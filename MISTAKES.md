# MISTAKES & DATA GOVERNANCE LOG
**Repository:** `clifton_tax_watchdog` (`mytownlens.com`)  
**Mission:** Provide 100% accurate, factual, and verified non-partisan taxpayer analysis, municipal budgets, and election voter guides across all monitored New Jersey municipalities.  
**Standard:** **Zero tolerance** for scrambled candidate names, inaccurate service dates, invented offices, conflated professions, or stray municipal references.

---

## 1. Zero-Tolerance Governance Directives

1. **Every Public Official’s Record Must Be Anchored in Primary Public Sources:**
   - County Clerk Certified Candidate Filings & Sample Ballots (Passaic, Morris, Essex, Bergen).
   - Municipal Clerk Reorganization Meeting Minutes & Official Council Rosters.
   - School Board Official Directories & Board Reorganization Records.
   - State of New Jersey Local Government Ethics Law Financial Disclosure Statements (fds.nj.gov / elec.nj.gov).

2. **No Extrapolation or Synthetic Placeholders:**
   - Never fabricate, scramble, or synthesize candidate names, slogans, or ballot positions.
   - If an election is nonpartisan or holds races in odd/even alternating cycles (e.g., Montclair May council vs. November BOE; Parsippany odd-year council vs. even-year BOE), accurately reflect the specific office on that cycle's ballot.

3. **Check Every Text Representation for Consistency:**
   - Candidate objects have multiple biographical properties: `experience`, `civicBackground`, `historicExperience.summary`, `historicExperience.careerTimeline`, and `publicOfficesHeld`.
   - All fields must align mathematically and chronologically. A candidate cannot be "Councilman since 2014" in one paragraph and "Elected November 2015" in another.

---

## 2. Catalog of Past Mistakes, Root Causes & Permanent Remedies

### Mistake 1: Inaccurate & Conflated Incumbent Service Dates / Tenures

* **Incident:** Mary Sadrakula (Clifton City Council) was listed as serving continuously from "2004–present" or "over 20 years on Council".
  * **Root Cause:** Conflating activist taxpayer advocacy with elected council tenure.
  * **Factual Correction:** First elected November 2010 (served 2010–2014); out of office 2015–2018; re-elected November 2018 (served 2019–2022); re-elected November 2022 (serving 2023–present). Total tenure: 12 years.
  * **Prevention Rule:** Verify exact oath dates from municipal reorganization minutes; always account for gaps between terms.

* **Incident:** Ray Grabowski (Clifton Mayor & Council) was listed as "Councilman since 2014" and "Mayor (2022–present)".
  * **Root Cause:** Conflating the 2014 election of his late brother (Matthew Grabowski) with Ray’s special election in November 2015, and confusing the November 2022 election date with the January 2023 mayoral oath date.
  * **Factual Correction:** Won special election in November 2015 following the passing of Councilman Matthew Grabowski; re-elected 2018 and 2022. Sworn in as Mayor on January 3, 2023. Council tenure: 2015–present; Mayoral tenure: 2023–present (11 years total).
  * **Prevention Rule:** Verify special election dates and distinguish municipal election year from swearing-in/reorganization year.

* **Incident:** Joseph Kolodziej (Clifton City Council) was described as serving his "fourth term" and "Councilman (2010–present)".
  * **Root Cause:** Assuming continuous tenure since 2010 and counting skipped years as a continuous term.
  * **Factual Correction:** Serving his 3rd council term. Served two terms 2010–2018 (elected 2010, re-elected 2014); out of office 2019–2022; re-elected November 2022, taking office January 2023 for 3rd term (2023–present).
  * **Prevention Rule:** Count distinct 4-year terms explicitly; note interruptions when an official leaves and returns to office.

* **Incident:** Rosemary Pino (Clifton City Council) was listed as "Councilwoman (2018–present)" and "BOE (2014–2019)".
  * **Root Cause:** Conflating election month (November 2018) with commencement of term (January 1, 2019).
  * **Factual Correction:** Clifton BOE Trustee (2014–2018); took oath as Clifton Councilwoman on January 1, 2019; re-elected 2022, serving second term (2019–present).
  * **Prevention Rule:** Clearly separate Board of Education service termination from City Council term commencement.

* **Incident:** Donald Pavlak Jr. & Mark Faber (Wayne Board of Education).
  * **Factual Correction:** Donald Pavlak Jr. has served 20 years on the Wayne BOE (first elected in 2005) and served multiple terms as Board President (2017, 2018, 2024, 2025). Mark Faber was elected November 2023 and sworn in January 4, 2024 (term ending December 31, 2026).
  * **Prevention Rule:** Cross-reference Wayne Township Public Schools reorganization minutes.

* **Incident:** Timothy Berrios, Wendy Wright & Nicole DellaFave (Parsippany-Troy Hills BOE).
  * **Factual Correction:** Timothy Berrios has served since 2012 (14+ years, former Board President). Wendy Wright assumed office in January 2024 (elected Nov 2023 for 2024–2026 term). Nicole DellaFave was appointed in August 2025 to fill an unexpired vacancy through December 2026.
  * **Prevention Rule:** Explicitly distinguish appointed unexpired vacancy appointments from standard 3-year elected terms.

* **Incident:** Matthew S. Kayne & June B. Witty (Montville Township Committee).
  * **Factual Correction:** Matthew S. Kayne was elected November 2017, took office January 1, 2018, and re-elected 2020 & 2023 (serving through Dec 31, 2026; served as Mayor in 2023 & 2025). June B. Witty serves on the Committee with term ending Dec 31, 2026 and served as Deputy Mayor.
  * **Prevention Rule:** Confirm annual committee mayoral rotation records from Montville Township reorganization resolutions.

---

### Mistake 2: Conflated Professions, Public Offices & Labor Unions

* **Incident:** Antonio "Tony" Latona (Clifton Council) was described in `civicBackground` as a "Retired Clifton Police Officer; Clifton PBA Local 36 member".
  * **Root Cause:** Hallucinated public safety branch mix-up between police and fire departments.
  * **Factual Correction:** Retired career Clifton Firefighter (25+ years in Clifton Fire Department, FMBA Local 21, retired June 2022) and 5-year U.S. Air Force active-duty veteran. He was never a police officer and never in PBA Local 36.
  * **Prevention Rule:** Never extrapolate emergency service branches. Verify whether an individual was FMBA (Firefighters Mutual Benevolent Association) or PBA (Policemen's Benevolent Association).

* **Incident:** Norman A. Tahan (Clifton Council Candidate) was listed as "Clifton City Council (1998–2002)".
  * **Root Cause:** Confusing prior council candidacy with actual elected service.
  * **Factual Correction:** Norman Tahan was never elected to the Clifton City Council. He served 35 years in the Clifton Fire Department, retiring as Deputy Fire Chief (~2020), and served 12 years on the Clifton Board of Education (1993–1999 and subsequent terms).
  * **Prevention Rule:** Cross-reference historic municipal election canvass reports before claiming an individual held municipal council office.

* **Incident:** Matthew Cavallo (Wayne 5th Ward Candidate) was previously misclassified as an incumbent councilman.
  * **Root Cause:** Confusing candidate status with prior executive employment in another municipality.
  * **Factual Correction:** Cavallo was the Township Manager / Chief Administrative Officer of Verona (2015–2021). He was a challenger in Wayne's 2023 5th Ward council race and is a challenger in 2026.
  * **Prevention Rule:** Always verify municipal residence and distinguish between administrative appointed positions and elected ward council seats.

---

### Mistake 3: Scrambled, Inaccurate, or Synthetic Candidate Names

* **Incident:** Montville Township Board of Education candidates were listed as "Charles Daughtry" and "Joseph Pisano".
  * **Root Cause:** Synthetic names generated without checking certified county clerk petitions.
  * **Factual Correction:** The certified candidates from the Morris County Clerk are **Joseph Daughtry** (current President of Montville BOE, slogan: "Excellence In Education") and **Ryan Pisano** (Board of Adjustment member and BOE candidate, slogan: "Excellence In Education"), alongside **Michael J. Palma** (slogan: "Education First").
  * **Prevention Rule:** Always search the County Clerk's certified petition PDF before writing school board candidate profiles.

* **Incident:** Morristown (Morris School District) had a synthetic candidate named "Kathleen Murphy".
  * **Root Cause:** Accidental combination of Morris Township board members Kathleen "Katie" Cole and Linda K. Murphy.
  * **Factual Correction:** Morristown Town's 3 seats up for election are represented by sitting trustees **Alan Smith**, **Elisabeth "Beth" Wall**, and **Meredith Davidson** (all elected November 2023 for 3-year terms ending December 31, 2026).
  * **Prevention Rule:** Discard synthetic amalgamations; verify school district regional constituent breakdown (Morristown vs. Morris Township seats).

* **Incident:** Montclair Board of Education had scrambled names ("Eric Gideon", "Andrew Haran", "Holly Reynics", "Lynn Simpson", "Sean Bookhart").
  * **Root Cause:** Scrambling past candidates (Andrew Gideon, Ayelet Haran, etc.) into fictitious names.
  * **Factual Correction:** The three sitting incumbents with terms ending in 2026 are **Phaedra Dunn** (top vote-getter), **Melanie Deysher**, and **Allison Silverstein**. Certified challengers are verified real candidates such as **Kimberly Robinson Santos** and **Andrew Gideon**.
  * **Prevention Rule:** Only certified real candidates from Essex County Clerk filing records may be loaded into candidate matrices.

* **Incident:** Glen Rock Council listing Teresa Gilbreath as an active candidate.
  * **Root Cause:** Outdated roster data failing to recognize her tragic passing.
  * **Factual Correction:** Teresa Gilbreath served with distinction for 6 years on Council (2019–2026) and as Council President, but passed away on April 25, 2026 at age 66. Council President **Amy Martin** leads the council (term 2024–2026).
  * **Prevention Rule:** Check municipal memorial resolutions and current borough clerk rosters for midterm vacancies or passings.

---

### Mistake 4: Missing Primary Source Citations on Candidate Cards

* **Incident:** Candidate cards in Glen Rock, Montclair, Montville, and Morristown previously had 0 `verifiedSources`, leaving users without links to official county or municipal records.
  * **Root Cause:** Relying only on top-level metadata instead of populating per-candidate `verifiedSources` arrays.
  * **Factual Correction:** Every candidate across all 7 towns now contains explicit citations to County Clerk Candidate Petitions, Municipal Clerk Reorganization Minutes, and State Ethics Disclosures.
  * **Prevention Rule:** Automated validation script must enforce `len(c.verifiedSources) >= 2` for every candidate in every municipality.

---

### Mistake 5: Hardcoded Clifton Municipal Text Leaks

* **Incident:** When selecting other towns (Wayne, Parsippany, etc.), users encountered Clifton-specific text (PVWC water, Clifton High School feeder patterns, Clifton tax forms).
  * **Root Cause:** Hardcoding Clifton strings in `app.js` and HTML templates instead of dynamic template interpolation from active city configuration.
  * **Factual Correction:** Refactored `app.js` to dynamically parameterize city name, tax rates, school district budgets, water utilities, and voting locations.
  * **Prevention Rule:** Grep for hardcoded "Clifton", "Mustang", "PVWC", or "City Hall" across `app.js` and HTML files before deploying multi-city features.

---

## 3. Mandatory Pre-Commit Validation Checklist

Before any election or municipal data change is merged or deployed, run this validation sequence:

```bash
# 1. Verify JSON syntax and consistency across all 7 municipalities
python3 -c "
import json, glob
files = glob.glob('data/**/election_candidates.json', recursive=True) + ['data/clifton_election_candidates.json']
for f in files:
    with open(f) as fp:
        d = json.load(fp)
    cands = d.get('councilCandidates', [])
    for c in cands:
        assert c.get('name'), f'Missing name in {f}'
        assert c.get('status'), f'Missing status for {c[\"name\"]} in {f}'
        assert len(c.get('verifiedSources', [])) >= 2, f'Missing sources for {c[\"name\"]} in {f}'
print('All candidate records verified successfully!')
"

# 2. Check for stray municipal text leaks in app.js
grep -n "PVWC" app.js | grep -v "cityId === 'clifton'" || true
```

---

## 4. Log of Validated Municipal Elections (Current Baseline)

| Municipality | County | Key 2026 Municipal / Local Races | Verified Incumbents & Terms | Certified Sources |
|---|---|---|---|---|
| **Clifton** | Passaic | Clifton City Council (7 At-Large Seats) + Clifton BOE (3 Seats) | Grabowski (Mayor 2023–pres, Council 2015–pres); Sadrakula (2010–14, 2019–pres); Latona (2023–pres, Ret Firefighter FMBA 21); Kolodziej (3rd term 2010–18, 2023–pres); Pino (2019–pres, BOE 2014–18) | Passaic County Clerk Sample Ballot #12681, City Clerk Minutes |
| **Parsippany** | Morris | Parsippany-Troy Hills BOE (3 Seats) | Berrios (2012–pres, 14+ yrs); Wright (2024–2026); DellaFave (Appointed Aug 2025–2026) | Morris County Clerk Petitions, PTHSD Official Directory |
| **Wayne** | Passaic | Wayne Council Ward 5 (Unexpired) + Wayne BOE (3 Seats) | Donald Pavlak Jr. (20 yrs, 2005–pres, Multi-term Pres); Mark Faber (2024–2026); Matthew Cavallo (Challenger, Verona Mgr 2015–21) | Passaic County Clerk Petitions, Wayne BOE Minutes |
| **Montclair** | Essex | Montclair BOE (3 Seats) | Phaedra Dunn (#1 Vote-getter 2023, 2024–2026); Melanie Deysher (2022–2026); Allison Silverstein (2020/2024–2026) | Essex County Clerk Statement of Vote, Montclair Public Schools |
| **Morristown** | Morris | Morris School District BOE (3 Morristown Seats) | Alan Smith (2024–2026); Elisabeth "Beth" Wall (2024–2026); Meredith Davidson (2024–2026) | Morris County Clerk Canvass, Morris School District Roster |
| **Montville** | Morris | Montville Township Committee (2 Seats) + Montville BOE (3 Seats) | Matthew S. Kayne (2018–2026, Mayor 2023/25); June B. Witty (Term ending 2026); Joseph Daughtry (BOE Pres); Ryan Pisano (BOE Cand); Michael J. Palma (BOE Trustee) | Morris County Clerk Nominating Petitions, Montville Clerk Resolutions |
| **Glen Rock** | Bergen | Glen Rock Council (2 Seats) + Glen Rock BOE (3 Seats) | Amy Martin (Council Pres 2024–2026); Teresa Gilbreath (In Memoriam 2019–2026); Damali Robinson (BOE 2024–2026); Elizabeth Calvez (BOE 2024–2026) | Bergen County Clerk Canvass, Glen Rock Borough Minutes |

---
*This file is a permanent living document. Every data error uncovered must be documented here with its root cause, factual correction, and preventive rule before being resolved in code.*
