#!/usr/bin/env python3
"""
Score companies for:
  - pure DTC (no physical store, no other retailers)
  - >30 products online
  - LinkedIn profile OR careers page (or both)

Uses Shopify public products.json where available + page keyword heuristics.
LinkedIn/careers presence is inferred from master CSV columns.
"""
from __future__ import annotations

import csv
import json
import re
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "uk-eu-women-ecommerce-companies.csv"
OUT_ALL = ROOT / "pure-dtc-30plus-products.csv"
OUT_AUDIT = ROOT / "pure-dtc-screening-audit.csv"
CHECKPOINT = ROOT / "pure-dtc-screening-checkpoint.jsonl"
UA = "Mozilla/5.0 (compatible; SarhResearchBot/1.0; +research)"

EMPTYISH = {
    "",
    "unknown",
    "n/a",
    "na",
    "none",
    "none found",
    "no",
    "-",
    "not found",
    "not available",
}

RETAILER_RE = re.compile(
    r"\b("
    r"john\s*lewis|selfridges|harrods|harvey\s*nichols|boots\b|sephora|"
    r"ulta|nordstrom|net[\s-]?a[\s-]?porter|matchesfashion|ssense|revolve|"
    r"zalando|about\s*you|asos\b|next\.com|mark(?:s)?\s*&\s*spencer|m&s\b|"
    r"libert(?:y|ies)|fenwick|brown\s*thomas|arnotts|galeries\s*lafayette|"
    r"le\s*bon\s*march[eé]|printemps|douglas\b|flaconi|notino|"
    r"space\s*nk|cult\s*beauty|lookfantastic|beautybay|"
    r"stockist|stockists|stocked\s+in|stocked\s+at|available\s+at|"
    r"wholesale|retail\s+partners?|where\s+to\s+buy|find\s+a\s+stockist|"
    r"our\s+stores?|store\s+locator|flagship\s+store|physical\s+store|"
    r"brick[\s-]?and[\s-]?mortar|pop[\s-]?up\s+store|boutique\s+in|"
    r"shops?\s+in\s+\d+|permanent\s+space"
    r")\b",
    re.I,
)

STORE_ONLY_RE = re.compile(
    r"\b("
    r"store\s+locator|find\s+a\s+store|our\s+stores|visit\s+us\s+in\s+store|"
    r"flagship\s+store|opening\s+hours|mon[\s–-]sun|brick[\s-]?and[\s-]?mortar"
    r")\b",
    re.I,
)


def fetch(url: str, timeout: int = 12, retries: int = 4) -> tuple[int, str, dict]:
    last_status, last_body, last_headers = 0, "", {}
    for attempt in range(retries):
        req = Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
        try:
            with urlopen(req, timeout=timeout) as resp:
                body = resp.read().decode("utf-8", errors="replace")
                headers = {k.lower(): v for k, v in resp.headers.items()}
                return resp.status, body, headers
        except HTTPError as e:
            body = e.read().decode("utf-8", errors="replace") if e.fp else ""
            last_status, last_body, last_headers = e.code, body, {}
            if e.code in (429, 503) and attempt < retries - 1:
                time.sleep(1.5 * (2**attempt))
                continue
            return e.code, body, {}
        except Exception as e:
            last_status, last_body, last_headers = 0, str(e), {}
            if attempt < retries - 1:
                time.sleep(0.8 * (attempt + 1))
                continue
            return 0, str(e), {}
    return last_status, last_body, last_headers


def normalize_base(website: str) -> str | None:
    w = (website or "").strip()
    if not w or "example.invalid" in w or w.lower() == "unknown":
        return None
    if not w.startswith("http"):
        w = "https://" + w
    p = urlparse(w)
    if not p.netloc:
        return None
    return f"{p.scheme}://{p.netloc}"


def count_shopify_products(base: str) -> tuple[int | None, str]:
    """Return (count_or_None, method_note). Count may be lower bound if capped."""
    total = 0
    # Prefer page-based public storefront API (still widely works)
    for page in range(1, 21):  # up to 5000 products
        url = f"{base}/products.json?limit=250&page={page}"
        status, body, _ = fetch(url)
        if status != 200:
            if page == 1:
                return None, f"not_shopify_or_blocked:{status}"
            break
        try:
            data = json.loads(body)
        except json.JSONDecodeError:
            if page == 1:
                return None, "invalid_json"
            break
        products = data.get("products") or []
        n = len(products)
        total += n
        if n < 250:
            return total, f"shopify_products.json pages={page}"
        time.sleep(0.15)
    if total:
        return total, "shopify_products.json capped_at_5000"
    return None, "no_products"


def page_signals(base: str) -> dict:
    texts = []
    for path in ["/", "/pages/stores", "/pages/store-locator", "/pages/stockists",
                 "/pages/find-us", "/pages/retailers", "/pages/where-to-buy",
                 "/policies/shipping-policy", "/pages/about", "/pages/about-us"]:
        status, body, _ = fetch(urljoin(base + "/", path.lstrip("/")))
        if status == 200 and body:
            # strip scripts/styles roughly
            cleaned = re.sub(r"<script[\s\S]*?</script>", " ", body, flags=re.I)
            cleaned = re.sub(r"<style[\s\S]*?</style>", " ", cleaned, flags=re.I)
            cleaned = re.sub(r"<[^>]+>", " ", cleaned)
            texts.append(cleaned[:80000])
        time.sleep(0.05)
    blob = "\n".join(texts)
    retailer_hits = sorted(set(m.group(0).lower() for m in RETAILER_RE.finditer(blob)))
    store_hits = sorted(set(m.group(0).lower() for m in STORE_ONLY_RE.finditer(blob)))
    return {
        "retailer_keyword_hits": "; ".join(retailer_hits[:20]),
        "store_keyword_hits": "; ".join(store_hits[:15]),
        "has_retailer_signal": bool(retailer_hits),
        "has_store_signal": bool(store_hits),
    }


def notes_signals(notes: str, social: str = "") -> dict:
    blob = f"{notes}\n{social}"
    retailer_hits = sorted(set(m.group(0).lower() for m in RETAILER_RE.finditer(blob)))
    return {
        "notes_retailer_hits": "; ".join(retailer_hits[:15]),
        "notes_has_retailer": bool(retailer_hits),
    }


def _is_emptyish(value: str) -> bool:
    return (value or "").strip().lower() in EMPTYISH


def linkedin_or_careers_presence(row: dict) -> dict:
    """Require LinkedIn profile OR careers page (or both) from master CSV fields."""
    careers = (row.get("careers_page") or "").strip()
    li_emp = (row.get("linkedin_employees") or "").strip()
    hiring_mgr = (row.get("hiring_manager_on_linkedin") or "").strip()
    social = row.get("social_media") or ""
    notes = row.get("legitimacy_notes") or ""
    jobs = row.get("recent_job_postings") or ""
    blob = "\n".join([social, notes, jobs, hiring_mgr, careers])

    has_careers = False
    careers_evidence = ""
    if not _is_emptyish(careers):
        has_careers = True
        careers_evidence = careers[:120]

    has_linkedin = False
    linkedin_evidence: list[str] = []

    if not _is_emptyish(li_emp) and re.search(r"\d", li_emp):
        has_linkedin = True
        linkedin_evidence.append(f"linkedin_employees={li_emp}")

    if hiring_mgr.strip().lower() in {"yes", "y", "true"}:
        has_linkedin = True
        linkedin_evidence.append("hiring_manager_on_linkedin=Yes")

    # LinkedIn URLs / company page shorthand in free-text fields
    li_url = re.search(
        r"(https?://)?([a-z]+\.)?linkedin\.com/[^\s|;,]+|LI\s+company/[^\s|;,]+|/company/[a-z0-9\-_%]+",
        blob,
        re.I,
    )
    if li_url:
        has_linkedin = True
        linkedin_evidence.append(li_url.group(0)[:120])

    # Soft LinkedIn mentions that imply a company page exists
    if re.search(r"\blinkedin\b", blob, re.I) and not has_linkedin:
        # only count if not clearly negative
        if not re.search(r"no\s+linkedin|linkedin\s+not\s+found|without\s+linkedin", blob, re.I):
            has_linkedin = True
            linkedin_evidence.append("linkedin_mention_in_notes_or_social")

    ok = has_linkedin or has_careers
    return {
        "has_linkedin_presence": "Yes" if has_linkedin else "No",
        "has_careers_page": "Yes" if has_careers else "No",
        "has_linkedin_or_careers": "Yes" if ok else "No",
        "linkedin_evidence": "; ".join(dict.fromkeys(linkedin_evidence))[:200],
        "careers_evidence": careers_evidence,
    }


def analyze_row(row: dict) -> dict:
    base = normalize_base(row.get("website", ""))
    presence = linkedin_or_careers_presence(row)
    out = {
        **row,
        "base_url": base or "",
        "product_count": "",
        "product_count_method": "",
        "has_physical_or_retailer_signal": "",
        "has_linkedin_presence": presence["has_linkedin_presence"],
        "has_careers_page": presence["has_careers_page"],
        "has_linkedin_or_careers": presence["has_linkedin_or_careers"],
        "linkedin_evidence": presence["linkedin_evidence"],
        "careers_evidence": presence["careers_evidence"],
        "exclusion_reason": "",
        "inclusion_confidence": "",
        "passes_filter": "No",
    }
    if not base:
        out["exclusion_reason"] = "invalid_or_missing_website"
        out["inclusion_confidence"] = "exclude"
        return out

    n_notes = notes_signals(row.get("legitimacy_notes", ""), row.get("social_media", ""))
    count, method = count_shopify_products(base)
    # Skip deep page crawl when already excluded for LinkedIn/careers to finish faster;
    # still use notes + Shopify product count for the audit.
    if presence["has_linkedin_or_careers"] == "Yes":
        signals = page_signals(base)
    else:
        signals = {
            "retailer_keyword_hits": "",
            "store_keyword_hits": "",
            "has_retailer_signal": False,
            "has_store_signal": False,
        }

    out["product_count"] = "" if count is None else str(count)
    out["product_count_method"] = method
    out["retailer_keyword_hits"] = signals["retailer_keyword_hits"]
    out["store_keyword_hits"] = signals["store_keyword_hits"]
    out["notes_retailer_hits"] = n_notes["notes_retailer_hits"]

    has_channel = (
        signals["has_retailer_signal"]
        or signals["has_store_signal"]
        or n_notes["notes_has_retailer"]
    )
    out["has_physical_or_retailer_signal"] = "Yes" if has_channel else "No"

    reasons = []
    if presence["has_linkedin_or_careers"] != "Yes":
        reasons.append("no_linkedin_or_careers_page")
    if has_channel:
        reasons.append("physical_store_or_other_retailer_signal")
    if count is None:
        reasons.append("product_count_unknown_not_shopify_or_blocked")
    elif count <= 30:
        reasons.append(f"product_count_{count}_not_over_30")

    if not reasons:
        out["passes_filter"] = "Yes"
        out["inclusion_confidence"] = "medium"  # automated signals only
        out["exclusion_reason"] = ""
    else:
        out["passes_filter"] = "No"
        out["inclusion_confidence"] = "exclude"
        out["exclusion_reason"] = "; ".join(reasons)
    return out


def load_checkpoint() -> dict[str, dict]:
    by_name: dict[str, dict] = {}
    if not CHECKPOINT.exists():
        return by_name
    for line in CHECKPOINT.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            obj = json.loads(line)
        except json.JSONDecodeError:
            continue
        name = obj.get("name")
        if name:
            by_name[name] = obj
    return by_name


def append_checkpoint(row: dict) -> None:
    with CHECKPOINT.open("a", encoding="utf-8") as f:
        f.write(json.dumps(row, ensure_ascii=False) + "\n")


def write_outputs(rows: list[dict], results: list[dict]) -> tuple[int, int]:
    results = sorted(results, key=lambda r: (r.get("name") or "").lower())
    audit_fields = list(
        dict.fromkeys(
            list(rows[0].keys())
            + [
                "base_url",
                "product_count",
                "product_count_method",
                "has_physical_or_retailer_signal",
                "retailer_keyword_hits",
                "store_keyword_hits",
                "notes_retailer_hits",
                "has_linkedin_presence",
                "has_careers_page",
                "has_linkedin_or_careers",
                "linkedin_evidence",
                "careers_evidence",
                "exclusion_reason",
                "inclusion_confidence",
                "passes_filter",
            ]
        )
    )
    with OUT_AUDIT.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=audit_fields, extrasaction="ignore")
        w.writeheader()
        w.writerows(results)

    passed = [r for r in results if r.get("passes_filter") == "Yes"]
    refined_fields = [
        "name",
        "website",
        "category",
        "country",
        "founded",
        "product_count",
        "product_count_method",
        "has_physical_or_retailer_signal",
        "has_linkedin_presence",
        "has_careers_page",
        "has_linkedin_or_careers",
        "linkedin_evidence",
        "careers_page",
        "ships_international",
        "linkedin_employees",
        "hiring_manager_on_linkedin",
        "social_media",
        "legitimacy_notes",
        "inclusion_confidence",
        "data_confidence",
        "meets_strict_criteria",
    ]
    with OUT_ALL.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=refined_fields, extrasaction="ignore")
        w.writeheader()
        w.writerows(passed)
    return len(results), len(passed)


def reevaluate_from_audit_row(audit_row: dict, product_count: int | None, method: str) -> dict:
    """Update an existing audit row after a product-count-only retry."""
    out = dict(audit_row)
    out["product_count"] = "" if product_count is None else str(product_count)
    out["product_count_method"] = method
    has_channel = (out.get("has_physical_or_retailer_signal") or "") == "Yes"
    has_presence = (out.get("has_linkedin_or_careers") or "") == "Yes"
    reasons = []
    if not has_presence:
        reasons.append("no_linkedin_or_careers_page")
    if has_channel:
        reasons.append("physical_store_or_other_retailer_signal")
    if product_count is None:
        reasons.append("product_count_unknown_not_shopify_or_blocked")
    elif product_count <= 30:
        reasons.append(f"product_count_{product_count}_not_over_30")
    if not reasons:
        out["passes_filter"] = "Yes"
        out["inclusion_confidence"] = "medium"
        out["exclusion_reason"] = ""
    else:
        out["passes_filter"] = "No"
        out["inclusion_confidence"] = "exclude"
        out["exclusion_reason"] = "; ".join(reasons)
    return out


def should_retry_product_count(audit_row: dict) -> bool:
    """Re-check LI/careers candidates whose product count failed due to rate limits/errors."""
    if audit_row.get("has_linkedin_or_careers") != "Yes":
        return False
    method = audit_row.get("product_count_method") or ""
    reason = audit_row.get("exclusion_reason") or ""
    if "product_count_unknown" not in reason:
        return False
    return any(tok in method for tok in ("429", "503", "blocked:0", "not_shopify_or_blocked"))


def retry_unknown_from_audit() -> None:
    """Re-screen rate-limited / unknown product counts for LI/careers candidates."""
    if not OUT_AUDIT.exists():
        raise SystemExit("Audit CSV missing; run a full screen first.")
    master = {r["name"]: r for r in csv.DictReader(SRC.open(encoding="utf-8"))}
    audit_rows = list(csv.DictReader(OUT_AUDIT.open(encoding="utf-8")))
    retry_rows = [r for r in audit_rows if should_retry_product_count(r)]
    print(f"retrying product counts for {len(retry_rows)} LI/careers candidates", flush=True)

    refreshed: dict[str, dict] = {}
    for i, row in enumerate(retry_rows, 1):
        name = row.get("name") or ""
        base = normalize_base((master.get(name) or row).get("website", ""))
        if not base:
            refreshed[name] = reevaluate_from_audit_row(row, None, "invalid_or_missing_website")
        else:
            # Gentle pacing + product count only (keep prior store/LI audit fields)
            time.sleep(1.2)
            count, method = count_shopify_products(base)
            refreshed[name] = reevaluate_from_audit_row(row, count, method)
            print(
                f"retry {i}/{len(retry_rows)} {name}: count={count} method={method}",
                flush=True,
            )

    merged = []
    for row in audit_rows:
        name = row.get("name") or ""
        merged.append(refreshed.get(name, row))

    rows = list(master.values())
    total, passed = write_outputs(rows, merged)
    print(f"TOTAL={total} PASSED={passed}")
    print(f"Wrote {OUT_ALL}")
    print(f"Wrote {OUT_AUDIT}")


def main() -> None:
    import sys

    if "--retry-unknown" in sys.argv:
        retry_unknown_from_audit()
        return

    rows = list(csv.DictReader(SRC.open(encoding="utf-8")))
    cached = load_checkpoint()
    # Drop stale checkpoint rows missing the new LinkedIn/careers fields
    cached = {
        name: obj
        for name, obj in cached.items()
        if "has_linkedin_or_careers" in obj
    }
    results: list[dict] = []
    pending = []
    for r in rows:
        name = r.get("name") or ""
        if name in cached:
            results.append(cached[name])
        else:
            pending.append(r)

    print(f"resume: {len(results)} cached, {len(pending)} pending / {len(rows)}", flush=True)

    if pending:
        with ThreadPoolExecutor(max_workers=4) as ex:
            futs = {ex.submit(analyze_row, r): r["name"] for r in pending}
            done = 0
            for fut in as_completed(futs):
                done += 1
                name = futs[fut]
                try:
                    result = fut.result()
                except Exception as e:
                    result = {
                        "name": name,
                        "passes_filter": "No",
                        "exclusion_reason": f"error:{e}",
                        "inclusion_confidence": "exclude",
                        "has_linkedin_or_careers": "No",
                    }
                results.append(result)
                append_checkpoint(result)
                if done % 25 == 0 or done == len(pending):
                    print(f"progress {done}/{len(pending)} (total done {len(results)}/{len(rows)})", flush=True)

    total, passed = write_outputs(rows, results)
    print(f"TOTAL={total} PASSED={passed}")
    print(f"Wrote {OUT_ALL}")
    print(f"Wrote {OUT_AUDIT}")
    if CHECKPOINT.exists() and passed >= 0 and total == len(rows):
        # Keep checkpoint for resume safety; delete only when fully complete
        CHECKPOINT.unlink(missing_ok=True)
        print("Cleared checkpoint after full run", flush=True)


if __name__ == "__main__":
    main()
