#!/usr/bin/env python3
"""Merge UK fashion brands subagent results into master CSV."""
from __future__ import annotations

import csv
import json
import re
from pathlib import Path

OUT = Path(__file__).resolve().parent / "uk-eu-women-ecommerce-companies.csv"
TRANSCRIPT = Path(
    r"C:\Users\omaro\.cursor\projects\c-Users-omaro-projects-Sarh-Projects"
    r"\agent-transcripts\cb162682-9e38-4e12-9cb2-d22bec0f1d28"
    r"\subagents\89795419-be83-40ee-ac5e-201335314a2a.jsonl"
)
FIELDS = list(csv.DictReader(OUT.open(encoding="utf-8")).fieldnames or [])


def extract_companies(path: Path) -> list[dict]:
    text = path.read_text(encoding="utf-8", errors="replace")
    # Prefer raw JSON if assistant wrote it unescaped
    matches: list[list] = []
    for m in re.finditer(r"\[\s*\{[^\]]{200,}?\"name\"[^\]]+?\}\s*\]", text, re.S):
        chunk = m.group(0)
        # Fix common jsonl escaping: \" inside strings when whole payload escaped
        for candidate in (chunk, chunk.replace('\\"', '"').replace("\\\\", "\\")):
            try:
                data = json.loads(candidate)
                if (
                    isinstance(data, list)
                    and len(data) >= 40
                    and isinstance(data[0], dict)
                    and "name" in data[0]
                    and "website" in data[0]
                ):
                    matches.append(data)
                    break
            except json.JSONDecodeError:
                continue

    if matches:
        return max(matches, key=len)

    # Line-by-line: look for assistant final message with JSON
    for line in reversed(path.read_text(encoding="utf-8", errors="replace").splitlines()):
        if '"name"' not in line and "Peachy Den" not in line:
            continue
        # Unescape jsonl string content
        try:
            obj = json.loads(line)
        except json.JSONDecodeError:
            continue
        content = obj.get("message", {}).get("content", [])
        blobs = []
        if isinstance(content, list):
            for part in content:
                if isinstance(part, dict) and part.get("type") == "text":
                    blobs.append(part.get("text", ""))
        elif isinstance(content, str):
            blobs.append(content)
        for blob in blobs:
            start = blob.find("[")
            end = blob.rfind("]")
            if start >= 0 and end > start:
                try:
                    data = json.loads(blob[start : end + 1])
                    if isinstance(data, list) and len(data) >= 40 and "name" in data[0]:
                        return data
                except json.JSONDecodeError:
                    continue
    raise SystemExit("Could not extract company JSON from transcript")


def norm_boolish(v) -> str:
    if v is True:
        return "Yes"
    if v is False:
        return "No"
    if v in (None, "", "null"):
        return "Unknown"
    s = str(v)
    if s.lower() in ("true", "yes"):
        return "Yes"
    if s.lower() in ("false", "no"):
        return "No"
    return s


def to_row(obj: dict) -> dict:
    return {
        "name": str(obj["name"]).strip(),
        "website": str(obj.get("website") or "Unknown").strip(),
        "category": str(obj.get("category") or "Unknown"),
        "country": str(obj.get("country") or "UK"),
        "founded": str(obj.get("founded") or "Unknown"),
        "linkedin_employees": str(obj.get("linkedInEmployees") or "Unknown"),
        "ships_international": norm_boolish(obj.get("shipsInternational")),
        "hires_remotely": norm_boolish(obj.get("hiresRemote")),
        "hiring_manager_on_linkedin": norm_boolish(obj.get("hiringManagerOnLinkedIn")),
        "recent_job_postings": str(obj.get("recentJobPostings") or "Unknown"),
        "careers_page": str(obj.get("careersPage") or "Unknown"),
        "social_media": str(obj.get("socialMedia") or "Unknown"),
        "revenue_last_fy": str(obj.get("revenueLastFY") or "Unknown"),
        "legitimacy_notes": str(obj.get("legitimacyNotes") or "Unknown"),
        "meets_strict_criteria": norm_boolish(obj.get("meetsStrictCriteria")),
        "data_confidence": "medium",
    }


def is_unknown(v: str | None) -> bool:
    return not v or str(v).strip().lower() in {"unknown", "none found", "not disclosed", "n/a"}


def enrich(existing: dict, incoming: dict) -> bool:
    """Fill Unknown fields / better LI headcounts from incoming. Returns True if changed."""
    changed = False
    for key in FIELDS:
        if key in ("name", "data_confidence"):
            continue
        old = existing.get(key, "")
        new = incoming.get(key, "")
        if is_unknown(old) and not is_unknown(new):
            existing[key] = new
            changed = True
        elif key == "linkedin_employees" and is_unknown(old) is False and not is_unknown(new):
            # Prefer more specific numeric LI count when we had Unknown or vague
            pass
        elif key == "revenue_last_fy" and is_unknown(old) and not is_unknown(new):
            existing[key] = new
            changed = True
        elif key == "legitimacy_notes" and not is_unknown(new):
            if is_unknown(old):
                existing[key] = new
                changed = True
            elif new not in old and len(new) > 20:
                existing[key] = f"{old}; {new}"
                changed = True
        elif key == "meets_strict_criteria" and incoming.get("meets_strict_criteria") == "Yes":
            if existing.get("meets_strict_criteria") != "Yes":
                existing[key] = "Yes"
                changed = True
        elif key == "linkedin_employees" and not is_unknown(new):
            if is_unknown(old):
                existing[key] = new
                changed = True
    # Prefer richer website if existing looks placeholder
    if not is_unknown(incoming.get("website")) and (
        is_unknown(existing.get("website")) or "example.invalid" in existing.get("website", "")
    ):
        existing["website"] = incoming["website"]
        changed = True
    return changed


def name_key(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", name.lower())


def site_key(url: str) -> str:
    u = url.lower().strip().rstrip("/")
    u = re.sub(r"^https?://(www\.)?", "", u)
    return u


def main() -> None:
    companies = extract_companies(TRANSCRIPT)
    rows = list(csv.DictReader(OUT.open(encoding="utf-8")))
    by_name = {name_key(r["name"]): r for r in rows}
    by_site = {site_key(r["website"]): r for r in rows if r.get("website")}

    added = 0
    enriched = 0
    for obj in companies:
        row = to_row(obj)
        nk = name_key(row["name"])
        sk = site_key(row["website"])
        target = by_name.get(nk) or (by_site.get(sk) if sk else None)
        if target:
            if enrich(target, row):
                enriched += 1
            continue
        rows.append(row)
        by_name[nk] = row
        if sk:
            by_site[sk] = row
        added += 1

    with OUT.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        w.writeheader()
        w.writerows(rows)

    print(f"UK fashion merge: added={added} enriched={enriched} total={len(rows)}")


if __name__ == "__main__":
    main()
