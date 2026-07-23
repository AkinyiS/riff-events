# UK / EU women’s ecommerce company research

**Generated:** 21 Jul 2026  
**File:** `uk-eu-women-ecommerce-companies.csv`  
**Count:** 442 companies

## Scope

Ecommerce brands selling **women’s clothing**, **shoes**, and/or **beauty** products, primarily based in the **UK or EU**. Criteria were relaxed: companies may be older than 5 years, larger or smaller than 5–20 LinkedIn employees, or missing some fields.

## Columns

| Column | Description |
|--------|-------------|
| name | Brand / company name |
| website | Primary ecommerce or brand URL |
| category | Clothing / Shoes / Beauty / Mixed |
| country | HQ / primary market country |
| founded | Year or range if known |
| linkedin_employees | LinkedIn headcount if known |
| ships_international | Yes / No / Partial / Unknown |
| hires_remotely | Yes / No / Unknown |
| hiring_manager_on_linkedin | Founders/managers visible on LI |
| recent_job_postings | Notes |
| careers_page | URL or None found / Unknown |
| social_media | Handles if known |
| revenue_last_fy | Figure or Not disclosed / Unknown |
| legitimacy_notes | Registry / press / verification notes |
| meets_strict_criteria | Yes / No / Partial / Unknown vs original brief |
| data_confidence | high / medium / low |

## Confidence levels

- **high** — Verified in this project via Companies House / live site / LinkedIn detail
- **medium** — Well-known published brand with public site from industry lists/press
- **low** — Appeared in roundups; website or details may need manual confirmation

## How to open the CSV

1. In Cursor / VS Code: open `uk-eu-women-ecommerce-companies.csv`
2. Or in File Explorer: `C:\Users\omaro\projects\Sarh Projects\research-output\`
3. Open in Excel / Google Sheets (File → Import → Upload)

## Rebuild

```bash
python build_companies_csv.py
```

## Caveats

This is a research harvest, not a complete census of every qualifying company in the UK/EU. LinkedIn headcounts and revenues are often undisclosed. Re-verify websites and registry status before commercial outreach. Some larger/older chains were included for completeness under the relaxed criteria and are marked `meets_strict_criteria=No`.
