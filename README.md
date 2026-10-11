# Clifton NJ Taxpayer Watchdog

A public transparency project and citizen oversight portal for Clifton, Passaic County, New Jersey.

This project visualizes where Clifton property tax dollars go, documents public employee payrolls across the City of Clifton and Clifton Board of Education, analyzes the ~$293M public school budget, deep-dives into public employee healthcare and retirement benefits, and tracks potential ethics violations, audits, and outside business holdings under New Jersey transparency laws.

---

## Data Freshness & Source Certification

| Dataset | Last Updated | Certification / Vintage | Official Source Agency |
| :--- | :--- | :--- | :--- |
| **Property Tax Breakdown** | October 10, 2026 | **2026 Certified Rates** | Passaic County Board of Taxation & Clifton Tax Collector |
| **Property Values & Assessments** | October 11, 2026 | **2026 Certified Assessment Rolls (520 Properties)** | Passaic County Board of Taxation & City Assessor Records |
| **Surrounding Towns Comparison** | October 11, 2026 | **2026 Abstracts of Ratables (8 Towns)** | Passaic & Essex County Boards of Taxation |
| **Clifton BOE Budget (~$293M)** | October 10, 2026 | **Certified FY 2025-2026 Budget** | NJ Department of Education & Clifton Public Schools |
| **City Municipal Budget (~$105M)** | October 10, 2026 | **Certified CY 2026 Adopted Budget** | NJ Department of Community Affairs (DLGS) & Clifton CFO |
| **Healthcare & Benefits ($87.2M)** | October 10, 2026 | **Certified 2026 Plan Year & State Review** | NJ Division of Pensions and Benefits (SHBP / SEHBP) |
| **Demographics & Spatial Equity** | October 11, 2026 | **Census ACS 5-Yr & Passaic County 2026** | US Census Bureau & Passaic County Board of Taxation |
| **Ethics & Audit Watchdog Alerts** | October 10, 2026 | **Active State Filings & Reports** | NJ Office of the State Comptroller (OSC) & NJ SEC |
| **Staff & Payroll Directory** | October 10, 2026 | **2025-2026 Contracts & Guides** | City Salary Ordinances, BOE UFB, APP DataUniverse |
| **Asset & Business Disclosures** | October 10, 2026 | **2025/2026 Annual Filings** | NJ Local Government Ethics Law (FDS) & SEC Portals |

---

## 1. Property Values & Assessments: Who Pays More Taxes?

A dedicated investigation tool with **520 sampled residential properties** across all 10 Clifton neighborhoods:
* **Certified Tax Formula**: In NJ, property tax is strictly: `(Assessed Value ÷ 100) × 6.527%`.
* **The Assessment vs. Market Equalization Ratio (~33.3%)**: Because Clifton has not conducted a citywide revaluation recently, market values are approximately **3× their municipal assessed values**. A home selling for **\$600,000** is assessed on city tax rolls for **~\$200,000**, generating **\$13,054/year** in property taxes.
* **Who Pays the Most?**:
  * **Top 10% Highest Tax Bracket (\$16,000 – \$25,000+/yr)**: Dominated by single-family estates and split-levels in **Montclair Heights** (Valley Rd, Grove St, Normal Ave) and **Allwood** custom colonials. Peak sampled bill: **\$24,998.41/yr** on a 4-bed, 3-bath estate assessed at \$383,000.
  * **City Median Range (\$10,500 – \$13,500/yr)**: Cape Cods, ranches, and traditional colonials in **Athenia**, **Richfield**, and **Albion**.
  * **Moderate Range (<\$10,500/yr)**: Two-family and multi-family homes in **Botany Village** and **Lakeview** starter colonials/condos.
* **Interactive UI Features**:
  * Filter by **Bedrooms** (Any, 2+, 3+, 4+, 5+), **Bathrooms** (1.5+, 2+, 3+, 4+), **Neighborhood**, **ZIP Code**, **Property Type**, and **Tax Bracket**.
  * Toggle between **Cards View** and **Full Comparison Table View**.
  * **One-Click Calculator Transfer**: Click "Load in Tax Calculator" on any property card to instantly see where its exact tax bill goes across regular instruction, police, fire, DPW, and county services.


---

## 1. Demographics & Spatial Property Tax Analysis (07013 vs 07011)

Clifton has a population of **89,379** residents across **32,840 housing units**. Merging U.S. Census Bureau demographic files with Passaic County property assessment records reveals deep economic and tax divisions across the city's two main postal zones:

### ZIP Code Comparison: 07013 vs. 07011
| Metric | ZIP Code 07013 (South & West) | ZIP Code 07011 (North & East) |
| :--- | :--- | :--- |
| **Neighborhoods** | Montclair Heights, Allwood, Richfield, Athenia | Botany Village, Lakeview, Dutch Hill, Main Ave |
| **Population** | 49,650 (55.5%) | 39,729 (44.5%) |
| **Median Household Income** | **$116,273** *(+$42,079 / 56.7% higher)* | **$74,194** |
| **Median Age** | **45.4 Years** *(Aging, retirees)* | **37.2 Years** *(Younger families)* |
| **Homeownership vs Renters** | **73.6% Own** / 26.4% Rent | **47.8% Own** / **52.2% Rent** |
| **Average Assessed Value** | $218,000 (Market: ~$685,000) | $154,000 (Market: ~$475,000) |
| **Average Annual Tax Bill** | **$14,228.86 / year** ($1,185.74/mo) | **$10,051.58 / year** ($837.63/mo) |
| **Tax-to-Income Burden** | **12.24%** of household income | **13.55%** of household income *(Heavier effort)* |
| **Share of Residential Tax Levy** | **63.3%** ($102.4M generated) | **36.7%** ($59.5M generated) |
| **Share of Public School Students** | **46.8%** of district enrollment | **53.2%** of district enrollment |

### Key Neighborhood Insights:
1. **Montclair Heights (07013)**: The highest average tax check in Clifton (**$17,949/year** on median income of $142,000). Skews older (median age 47.8 yrs) with 88% homeownership.
2. **Allwood & Richfield (07013)**: Historic suburban planned community (**$14,359/year tax bill**). High senior population on fixed Social Security/pensions facing severe strain from annual tax increases.
3. **Botany Village (07011)**: Historic textile mill district with 59% renters and highest tax-to-income burden (**13.82%** of earnings). Generates high public school enrollment while absorbing high living costs.
4. **The Inter-Neighborhood School Subsidy**: 07013 generates **63.3% of the tax levy** but only supplies **46.8% of students**, meaning older homeowners in 07013 heavily subsidize the public school system for younger families in 07011.
5. **The Hidden Renter Tax**: In 07011 where over half of residents rent, landlords pass 100% of the $10,000+ property tax bill into monthly rent payments—meaning **$300 to $450 of every tenant's monthly rent in Clifton goes directly to municipal and school taxes**.

---

## 1. Where the Tax Dollars Go (Certified 2026 Rates)

* **Certified Total General Tax Rate**: **6.527%** ($6.527 per $100 of assessed property value).
* **Clifton Public Schools (BOE)**: **3.111%** (**47.66%** of your total property taxes).
* **City of Clifton (Municipal)**: **1.920%** (**29.41%** of your property taxes).
  * Municipal Local Purposes: 1.806%
  * Clifton Public Library: 0.104%
  * Municipal Open Space: 0.010%
* **Passaic County Government**: **1.496%** (**22.92%** of your property taxes).

---

## 2. Healthcare, Pensions & Employee Benefits ($87.2M Annual Cost)

Employee benefits account for **21.9% of all public funds** spent by City Hall and the Board of Education:
1. **Medical Plans (SHBP / SEHBP)**: 
   * **NJ DIRECT 10 / NJ DIRECT 15** (Horizon Blue Cross Blue Shield PPO)
   * **NJ Educators Health Plan (NJEHP / Chapter 44)** for teachers and school staff
   * Standalone prescription drug formulary plans (copays as low as $3 generic / $10 brand)
   * Employer-funded dental and vision plans
2. **Taxpayer vs Employee Cost Sharing**:
   * **Municipal Staff**: Under **Chapter 78 (P.L. 2011, c. 78)**, employees contribute between 3% and 35% of the insurance premium based on salary tier. **Taxpayers pay the remaining 65% to 97% of premiums** (often $20,000–$25,000+ per employee family).
   * **School Staff**: Under **Chapter 44 (P.L. 2020, c. 44)**, school employee contributions are capped at 1.7% to 7.2% of salary, shifting even more premium cost onto local school tax levies.
3. **Lifetime Retiree Healthcare ("The 25-Year Rule")**:
   * Under N.J.S.A. 40A:10-23 / Chapter 48, employees with 25 or more years of service receive 100% employer-funded healthcare coverage in retirement until Medicare, plus Medicare Part B reimbursement.
4. **Pensions**:
   * City of Clifton pays ~$12.8M annually into the Police & Firemen's Retirement System (PFRS) and Public Employees' Retirement System (PERS).
5. **Health Benefit Waivers**:
   * Employees opting out of Clifton health insurance (e.g. covered under a spouse) receive annual cash incentive payments of up to $5,000.

---

## 3. Potential Fraud, Audits & Ethics Watchdog Alerts

* **State Comptroller Audit (Sick Leave Payouts)**: The NJ Office of the State Comptroller (OSC) specifically named Clifton in its municipal audit for bypassing the statutory $15,000 sick leave payout cap enacted under P.L. 2010, c. 3. Five of Clifton's six union contracts permitted accumulating and cashing out up to **260 unused sick days** as terminal leave upon retirement—potentially costing taxpayers over $100,000+ in a single exit payout for senior personnel.
* **The PILOT Tax Shift (Tax Inequity)**: Payments In Lieu of Taxes (PILOT) awarded to major redevelopment apartment complexes in Clifton give 95% of revenues to City Hall, 5% to Passaic County, and **0% to the Clifton Board of Education**. When new residential developments bring schoolchildren into district classrooms without contributing to the school tax levy, single-family homeowners absorb the higher tax burden.
* **City Council Censure**: City Council approved a formal resolution of censure against Councilwoman Mary Sadrakula regarding staff interactions and Open Public Meetings Act (OPMA) allegations, referring matters to the Local Finance Board.
* **School Ethics Commission Consent Orders**: Multiple complaints have been filed with the NJ School Ethics Commission regarding school board trustees making unauthorized public declarations outside of board policy.
* **City Manager Departure**: Long-time City Manager Nick Villano resigned abruptly in April 2025 following friction with the City Council, triggering disputes over contract buyouts and accumulated leave payouts. Interim City Manager Gary DeMarzo was appointed.
* **Secondary Employment & Outside Police Details**: Utility contractors hire off-duty police officers for road construction details, prompting scrutiny into administrative overhead fees and fatigue management.
* **Outside Businesses & Conflicts**: Mayor Raymond Grabowski operates a private landscaping business and a licensed private investigation/security consulting practice; Councilman Joseph Kolodziej serves as full-time Chief Financial Officer of Mt. Olive Township while legislating in Clifton. Both must maintain active recusals under the Local Government Ethics Law.

---

## How to Run & Use the Project

### 1. Web Dashboard (Live on Port 8088)
```bash
cd /Users/tejas/apps/clifton_tax_watchdog
python3 server.py
```
Open **http://localhost:8088** in your browser.

### 2. Terminal CLI Investigation Tool
```bash
cd /Users/tejas/apps/clifton_tax_watchdog

# Check data freshness & certification status:
python3 scrapers/investigation_toolkit.py status

# Calculate your personal tax breakdown down to the penny:
python3 scrapers/investigation_toolkit.py calc 182500

# View detailed healthcare plans & cost-sharing splits:
python3 scrapers/investigation_toolkit.py benefits

# View active Watchdog Alerts & Comptroller audit citations:
python3 scrapers/investigation_toolkit.py alerts

# Search staff payroll and leadership:
python3 scrapers/investigation_toolkit.py staff "Robertozzi"
python3 scrapers/investigation_toolkit.py staff "Police"

# Check declared businesses and assets:
python3 scrapers/investigation_toolkit.py ethics "Grabowski"

# View top vendors and contractors:
python3 scrapers/investigation_toolkit.py vendors
```
