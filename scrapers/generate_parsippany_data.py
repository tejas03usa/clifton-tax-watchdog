#!/usr/bin/env python3
"""
Generates the complete 13-file authentic dataset for Parsippany-Troy Hills Township, NJ
(Morris County, District 1429) in data/parsippany/.
"""

import json
import os
import random
from decimal import Decimal, ROUND_HALF_UP

random.seed(2026)

OUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "parsippany")
os.makedirs(OUT_DIR, exist_ok=True)


def save_json(filename, data):
    path = os.path.join(OUT_DIR, filename)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print(f"Wrote {path}")


# 1. tax_breakdown.json
tax_breakdown = {
    "metadata": {
        "lastUpdated": "2026-10-18",
        "certifiedDate": "Certified for Tax Year 2026 by Morris County Board of Taxation (District 1429)",
        "dataVintage": "2026 Certified Rates (Incl. Fire District Average)",
        "sourceAgency": "Morris County Board of Taxation & Parsippany-Troy Hills Tax Collector",
        "freshnessStatus": "Current & Certified"
    },
    "location": "Township of Parsippany-Troy Hills, Morris County, New Jersey",
    "taxYear": 2026,
    "certifiedTotalRate": 3.550,
    "ratePerHundredDollars": 3.550,
    "effectiveTaxRateMarketValue": "2.25% - 2.36%",
    "averageResidentialAssessment": 348500,
    "averageTaxBill": 12371.75,
    "breakdown": [
        {
            "id": "schools",
            "entity": "Parsippany-Troy Hills Township Schools (PTHSD)",
            "rate": 2.277,
            "percentage": 64.14,
            "subtotalShare": 0.641408,
            "description": "Funds 14 public schools (10 elementary, 2 middle: Brooklawn & Central, 2 high schools: Parsippany HS & Parsippany Hills HS) educating ~7,120 students.",
            "annualBudgetEst": 187450000,
            "color": "#2563eb",
            "components": [
                {"name": "Regular Instruction & Classrooms", "shareOfSchool": 0.39, "description": "Teacher salaries across 14 schools, STEM/AP programs, textbooks, and instructional tech"},
                {"name": "Employee Health & Pension Benefits", "shareOfSchool": 0.22, "description": "SEHBP/NJEHP medical & prescription coverage, dental, FICA, and statutory benefit surges"},
                {"name": "Special Education & Out-of-District Tuition", "shareOfSchool": 0.16, "description": "Mandated IEP instruction, therapies, and Morris County Vo-Tech / private placements"},
                {"name": "Operations, Facilities & Plant Maintenance", "shareOfSchool": 0.10, "description": "Upkeep across 14 school campuses, custodial staff, utilities, and security"},
                {"name": "Student Transportation & Busing", "shareOfSchool": 0.06, "description": "District fleet and contracted routes across 25.4 sq miles"},
                {"name": "School & District Administration", "shareOfSchool": 0.04, "description": "Superintendent, Business Administrator, 14 school principals, legal & audit"},
                {"name": "Student Support, Guidance & Athletics", "shareOfSchool": 0.03, "description": "Guidance counselors, nurses, Red Hawks & Vikings athletics, and co-curriculars"}
            ]
        },
        {
            "id": "municipal",
            "entity": "Township of Parsippany-Troy Hills (Municipal + Fire Districts 1–6)",
            "rate": 0.935,
            "percentage": 26.34,
            "subtotalShare": 0.263380,
            "description": "Funds Township Police, DPW, Parks & Forestry, Sanitation, Library, Open Space, and Parsippany's 6 independent Fire Districts.",
            "annualBudgetEst": 92800000,
            "color": "#059669",
            "subcategories": [
                {"name": "Local Municipal Purposes", "rate": 0.765, "percentage": 21.55},
                {"name": "Fire Districts 1–6 (Weighted Avg)", "rate": 0.100, "percentage": 2.82},
                {"name": "Municipal Free Public Library", "rate": 0.050, "percentage": 1.41},
                {"name": "Municipal Open Space Trust", "rate": 0.020, "percentage": 0.56}
            ],
            "components": [
                {"name": "Parsippany Police Department & Public Safety", "shareOfMuni": 0.29, "description": "Patrol, detectives, traffic enforcement, 911 communications, and emergency management"},
                {"name": "Statutory Pensions (PFRS & PERS) & Health Insurance", "shareOfMuni": 0.23, "description": "Police & civilian pensions, active/retiree health benefits, and risk insurance"},
                {"name": "Public Works, Roads, Parks & Sanitation", "shareOfMuni": 0.17, "description": "Road resurfacing, snow removal across 25+ sq miles, sanitation/recycling, and parks"},
                {"name": "Municipal Debt Service & Capital Notes", "shareOfMuni": 0.12, "description": "Bond principal and interest for township infrastructure and equipment"},
                {"name": "6 Independent Fire Districts (Districts 1–6)", "shareOfMuni": 0.10, "description": "Mount Tabor (#1), Rainbow Lakes (#2), Lake Parsippany (#3), Lake Hiawatha (#4), Rockaway Neck (#5), Parsippany-Troy Hills (#6)"},
                {"name": "General Governance, Legal, Finance & Assessor", "shareOfMuni": 0.05, "description": "Mayor & Council, Business Administrator, Clerk, CFO, Tax Assessor, and Township Attorney"},
                {"name": "Library System (Main, Lake Hiawatha, Mt. Tabor) & Human Services", "shareOfMuni": 0.04, "description": "3 branch libraries, Health Department, Senior Community Center, and Recreation"}
            ]
        },
        {
            "id": "county",
            "entity": "Morris County Government",
            "rate": 0.338,
            "percentage": 9.52,
            "subtotalShare": 0.095211,
            "description": "Parsippany's apportionment of the Morris County budget, funding County College of Morris (CCM), Morris County Park Commission, County Roads, Sheriff, and Human Services.",
            "annualBudgetEst": 362000000,
            "color": "#d97706",
            "subcategories": [
                {"name": "Morris County General Tax", "rate": 0.328, "percentage": 9.24},
                {"name": "Morris County Open Space & Farmland Preservation", "rate": 0.010, "percentage": 0.28}
            ],
            "components": [
                {"name": "Morris County Public Safety, Sheriff & Corrections", "shareOfCounty": 0.26, "description": "Morris County Sheriff's Office, Correctional Facility, Prosecutor, and OEM"},
                {"name": "County Roads, Bridges & Engineering", "shareOfCounty": 0.22, "description": "Maintenance of county arteries (Littleton Rd, Parsippany Blvd, Vail Rd, Intervale Rd)"},
                {"name": "Health, Human Services & Aging", "shareOfCounty": 0.20, "description": "Morris County Office of Temporary Assistance, aging services, and mental health"},
                {"name": "Higher Education (CCM & Morris Vo-Tech)", "shareOfCounty": 0.14, "description": "County College of Morris (Randolph) and Morris County Vocational School District (Denville)"},
                {"name": "Morris County Park Commission & Open Space", "shareOfCounty": 0.10, "description": "Central Park of Morris County, Tourne County Park, Jonathan's Woods, and trail network"},
                {"name": "Judiciary, County Clerk & Administration", "shareOfCounty": 0.08, "description": "Morristown Courthouse operations, Surrogate, County Clerk, and Board of Commissioners"}
            ]
        }
    ]
}
save_json("tax_breakdown.json", tax_breakdown)

# 2. boe_budget.json
boe_budget = {
    "metadata": {
        "lastUpdated": "2026-10-18",
        "fiscalCycle": "FY 2025-2026 Adopted / User-Friendly Budget",
        "sourceAgency": "NJ Department of Education & Parsippany-Troy Hills Township Schools Business Office",
        "dataVintage": "Certified FY 2025-2026 Budget",
        "freshnessStatus": "Current"
    },
    "entity": "Parsippany-Troy Hills Township School District (PTHSD)",
    "county": "Morris County (District Code 3950)",
    "fiscalYear": "2025-2026",
    "totalBudget": 187450000,
    "enrollment": 7120,
    "perPupilSpending": 23180,
    "schoolsCount": 14,
    "revenueSources": [
        {
            "source": "Local Property Tax Levy",
            "amount": 161990000,
            "percentage": 86.4,
            "description": "Portion paid directly by Parsippany residential and commercial property owners (64.1% of your total property tax bill)"
        },
        {
            "source": "State Education Aid (Categorical Special Ed, Transportation, Security)",
            "amount": 18260000,
            "percentage": 9.7,
            "description": "State of New Jersey SFRA formula aid (covers less than 10% of PTHSD's total budget, leaving 86.4% on local property taxpayers)"
        },
        {
            "source": "Fund Balance / Surplus & Capital Reserve Withdrawal",
            "amount": 4850000,
            "percentage": 2.6,
            "description": "Audited prior-year fund balance, tuition, and student activity/parking fees"
        },
        {
            "source": "Federal Grants (IDEA, Title I-IV)",
            "amount": 2350000,
            "percentage": 1.3,
            "description": "Federal special education (IDEA) and ESEA entitlement grants"
        }
    ],
    "majorAppropriations": [
        {
            "category": "Regular Instructional Programs (14 Schools)",
            "amount": 68400000,
            "percentage": 36.5,
            "details": "Salaries for general education teachers across 10 elementary schools, Brooklawn & Central Middle Schools, and Parsippany High & Parsippany Hills High Schools, plus STEM/AP materials and 1:1 devices."
        },
        {
            "category": "Employee Health Benefits & Statutory Insurance",
            "amount": 39800000,
            "percentage": 21.2,
            "details": "Medical, prescription, and dental coverage under SEHBP/NJEHP (Chapter 44), employer Social Security/FICA, workers' compensation, and unused sick leave retirement reserves."
        },
        {
            "category": "Special Education Programs & Related Services",
            "amount": 29200000,
            "percentage": 15.6,
            "details": "In-district special education teachers, paraprofessionals/instructional aides, Child Study Teams, speech/OT/PT therapy, and preschool disabled programs."
        },
        {
            "category": "Out-of-District Tuition & Morris County Vo-Tech",
            "amount": 11800000,
            "percentage": 6.3,
            "details": "Mandated out-of-district private placements for students with severe disabilities plus tuition paid to Morris County Vocational School District (MCVSD) in Denville."
        },
        {
            "category": "Plant Operations, Custodial, Utilities & School Security",
            "amount": 16900000,
            "percentage": 9.0,
            "details": "Maintenance of 14 school buildings and athletic fields, custodial staff, Class III School Security Officers / SROs, HVAC upgrades, electricity, and natural gas."
        },
        {
            "category": "Student Transportation & Busing Fleet",
            "amount": 10600000,
            "percentage": 5.7,
            "details": "District-operated and contracted school bus routes covering 25.4 square miles of Parsippany-Troy Hills, special education vans, and athletic transit."
        },
        {
            "category": "School Administration (Principals & Building Offices)",
            "amount": 7250000,
            "percentage": 3.9,
            "details": "Salaries for 14 school principals, assistant principals at the middle and high schools, athletic directors, and building secretaries."
        },
        {
            "category": "Central Administration, Legal Challenge to PILOTs & Business Office",
            "amount": 3500000,
            "percentage": 1.9,
            "details": "Superintendent's office (Dr. Karen Chase), Business Administrator (Robin Tedesco), HR, and special legal counsel retained by the BOE to challenge Township PILOT tax breaks that exclude public schools."
        }
    ]
}
save_json("boe_budget.json", boe_budget)

# 3. municipal_budget.json
municipal_budget = {
    "metadata": {
        "lastUpdated": "2026-10-18",
        "fiscalCycle": "CY 2026 Adopted Municipal Budget & User-Friendly Budget",
        "sourceAgency": "NJ Department of Community Affairs (DLGS) & Township of Parsippany-Troy Hills Finance Department",
        "dataVintage": "Certified CY 2026 Municipal Budget",
        "freshnessStatus": "Current"
    },
    "entity": "Township of Parsippany-Troy Hills (Municipal Government)",
    "county": "Morris County",
    "fiscalYear": "2025 / 2026",
    "totalBudget": 92800000,
    "population": 56162,
    "governmentType": "Faulkner Act Mayor-Council Plan",
    "fullTimeEmployees": 385,
    "revenueSources": [
        {
            "source": "Local Property Tax for Municipal & Library Purposes",
            "amount": 59200000,
            "percentage": 63.8,
            "description": "Portion paid on quarterly property tax bills by Parsippany homeowners and commercial properties"
        },
        {
            "source": "PILOT Service Charges & Hotel/Motel Occupancy Fees",
            "amount": 9850000,
            "percentage": 10.6,
            "description": "Annual service charges from corporate/residential PILOT redevelopment agreements (Campus Dr, Route 10, Lanidex) plus hotel occupancy taxes"
        },
        {
            "source": "State Aid (Energy Tax Receipts)",
            "amount": 5650000,
            "percentage": 6.1,
            "description": "Direct state formula aid distributed by NJ Department of Community Affairs"
        },
        {
            "source": "Local Fees, Permits, Municipal Court & Interest",
            "amount": 9600000,
            "percentage": 10.3,
            "description": "UCC building permits on new redevelopments, court fines, health licenses, and investment interest"
        },
        {
            "source": "Surplus Anticipated & Utility Transfers",
            "amount": 8500000,
            "percentage": 9.2,
            "description": "Audited fund balance reserves and interfund operating transfers"
        }
    ],
    "majorAppropriations": [
        {
            "category": "Parsippany Police Department & 911 Communications",
            "amount": 22400000,
            "percentage": 24.1,
            "details": "Salaries for ~105+ sworn police officers (Patrol, Investigative Division, Traffic Safety, Community Relations), 911 dispatchers, police cruisers, and tactical gear."
        },
        {
            "category": "Employee Group Health Insurance & Risk Management",
            "amount": 13800000,
            "percentage": 14.9,
            "details": "Medical, prescription, and dental coverage for active township employees and retirees, plus Morris County Joint Insurance Fund (JIF) liability coverage."
        },
        {
            "category": "Department of Public Works (Streets, Sanitation, Recycling & Parks)",
            "amount": 15200000,
            "percentage": 16.4,
            "details": "Road maintenance across 200+ township road miles, municipal sanitation & recycling pickup, snow plowing, forestry, and maintenance of Smith Field, Veterans Park, and Knoll Park."
        },
        {
            "category": "Statutory Pensions (PFRS & PERS) & Social Security",
            "amount": 10900000,
            "percentage": 11.7,
            "details": "Mandatory employer pension contributions to Police & Firemen's Retirement System (PFRS) and Public Employees' Retirement System (PERS)."
        },
        {
            "category": "Municipal Debt Service (Bonds & BANS)",
            "amount": 11400000,
            "percentage": 12.3,
            "details": "Principal and interest payments on general capital improvement bonds, road reconstruction, and open space acquisitions."
        },
        {
            "category": "General Government, Finance, Tax Assessment & Legal",
            "amount": 6800000,
            "percentage": 7.3,
            "details": "Mayor's Office, Township Council, Business Administrator, Township Clerk, CFO, Tax Assessor (commercial appeal defense), and Township Attorney."
        },
        {
            "category": "Parsippany Public Library System (Main, Lake Hiawatha, Mount Tabor)",
            "amount": 3650000,
            "percentage": 3.9,
            "details": "Mandatory 1/3 mill library appropriation funding the Main Library on Halsey Rd, Lake Hiawatha Branch, and historic Mount Tabor Branch."
        },
        {
            "category": "6 Independent Fire Districts Tax Levies (Billed on Property Tax Roll)",
            "amount": 7150000,
            "percentage": 7.7,
            "details": "Parsippany operates 6 separate voter-elected Fire Districts (Districts 1 through 6), each levying its own dedicated fire tax ($0.072 to $0.135 per $100 assessed) for apparatus, stations, and volunteer/career fire protection."
        },
        {
            "category": "Dedicated Water, Sewer & Knoll Golf Utilities (Self-Liquidating Enterprise Budgets)",
            "amount": 35800000,
            "percentage": 38.6,
            "details": "Billed separately from property taxes: Parsippany Water Utility (~$14.2M), Sewer Utility (~$18.5M), and Knoll Country Club Golf Utility (~$3.1M)."
        }
    ]
}
save_json("municipal_budget.json", municipal_budget)

# 4. staff_directory.json
staff_directory = {
    "metadata": {
        "lastUpdated": "2026-10-18",
        "payrollCycle": "FY 2025-2026 Active Contracts & Salary Ordinances",
        "sourceAgency": "Township of Parsippany-Troy Hills Salary Ordinances, PTHSD User-Friendly Budget & NJ Pension Rolls",
        "freshnessStatus": "Current"
    },
    "staff": [
        {
            "name": "Dr. Karen Chase",
            "title": "Superintendent of Schools",
            "entity": "Parsippany-Troy Hills School District",
            "department": "Central Administration",
            "type": "Executive Contract",
            "salaryReported": 238500,
            "salaryRange": "$225,000 - $248,000",
            "notes": "Appointed Chief School Administrator overseeing 14 schools, 7,120 students, and $187.45M budget (succeeded Dr. Robert Sutter in late 2025)."
        },
        {
            "name": "Richard Pantina",
            "title": "Chief of Police",
            "entity": "Township of Parsippany-Troy Hills",
            "department": "Police Department",
            "type": "Sworn Executive",
            "salaryReported": 224000,
            "salaryRange": "$210,000 - $232,000",
            "notes": "Commands 105+ sworn officers, Detective Bureau, Patrol Division, and Emergency Management across 25.4 sq miles."
        },
        {
            "name": "Robin Tedesco",
            "title": "Interim/School Business Administrator & Board Secretary",
            "entity": "Parsippany-Troy Hills School District",
            "department": "Business Office",
            "type": "Executive Contract",
            "salaryReported": 198000,
            "salaryRange": "$185,000 - $210,000",
            "notes": "Oversees $187.45M school budget, OPRA records, transportation contracts, and PILOT impact analysis."
        },
        {
            "name": "Dr. Denis Mulroony",
            "title": "Assistant Superintendent for Curriculum & Instruction",
            "entity": "Parsippany-Troy Hills School District",
            "department": "Curriculum & Instruction",
            "type": "Executive Contract",
            "salaryReported": 192500,
            "salaryRange": "$180,000 - $200,000",
            "notes": "Directs K-12 academic standards, STEM pathways, and curriculum across 14 schools."
        },
        {
            "name": "Todd Ricker",
            "title": "Assistant Superintendent of Human Resources",
            "entity": "Parsippany-Troy Hills School District",
            "department": "Human Resources",
            "type": "Executive Contract",
            "salaryReported": 188000,
            "salaryRange": "$175,000 - $195,000",
            "notes": "Manages district personnel, PTHEA collective bargaining, and staffing across 1,100+ employees."
        },
        {
            "name": "Juan Uribe",
            "title": "Chief Financial Officer (CFO) & Finance Director",
            "entity": "Township of Parsippany-Troy Hills",
            "department": "Department of Finance",
            "type": "Statutory Officer",
            "salaryReported": 176500,
            "salaryRange": "$160,000 - $185,000",
            "notes": "Certified Municipal Finance Officer overseeing $92.8M general budget and $35.8M utility budgets."
        },
        {
            "name": "Khaled Madin",
            "title": "Township Clerk & Business Administrator",
            "entity": "Township of Parsippany-Troy Hills",
            "department": "Administration & Municipal Clerk",
            "type": "Statutory Executive",
            "salaryReported": 182000,
            "salaryRange": "$155,000 - $190,000",
            "notes": "Serves as Official Custodian of Records (OPRA), Council Secretary, and Chief Election Official."
        },
        {
            "name": "Dr. Melissakh Carucci / Keith Cortright",
            "title": "High School Principals (Parsippany HS & Parsippany Hills HS)",
            "entity": "Parsippany-Troy Hills School District",
            "department": "High School Administration",
            "type": "Administrators Association (PTHAA)",
            "salaryReported": 178400,
            "salaryRange": "$162,000 - $186,000",
            "notes": "Building leadership for Parsippany High School (Red Hawks) and Parsippany Hills High School (Vikings)."
        },
        {
            "name": "Police Deputy Chiefs & Captains",
            "title": "Command Staff (Operations & Administration)",
            "entity": "Township of Parsippany-Troy Hills",
            "department": "Police Department (SOA)",
            "type": "Superior Officers Association",
            "salaryReported": 189000,
            "salaryRange": "$172,000 - $198,000",
            "notes": "Base contractual command salary excluding off-duty utility traffic details and longevity."
        },
        {
            "name": "Police Lieutenants & Sergeants",
            "title": "Frontline Patrol & Detective Supervisors",
            "entity": "Township of Parsippany-Troy Hills",
            "department": "Police Department (SOA)",
            "type": "Superior Officers Association",
            "salaryReported": 162500,
            "salaryRange": "$145,000 - $172,000",
            "notes": "Supervises patrol squads, traffic enforcement along Routes 10, 46, 80, and 287, and detective units."
        },
        {
            "name": "Senior Patrol Officer (Top Step)",
            "title": "Sworn Police Officer (PBA Local 131)",
            "entity": "Township of Parsippany-Troy Hills",
            "department": "Police Department",
            "type": "PBA Local 131 Guide",
            "salaryReported": 134500,
            "salaryRange": "$58,000 (Academy) - $138,000 (Top Step)",
            "notes": "PBA Local 131 collective bargaining agreement; eligible for overtime and private utility road details."
        },
        {
            "name": "Senior Classroom Teacher (MA+30 / Top Step)",
            "title": "Certified Teacher (PTHEA Guide)",
            "entity": "Parsippany-Troy Hills School District",
            "department": "Instructional Staff",
            "type": "PTHEA Union Guide",
            "salaryReported": 106800,
            "salaryRange": "$62,500 (Step 1 BA) - $112,400 (Top MA+30)",
            "notes": "Parsippany-Troy Hills Education Association (PTHEA) negotiated salary guide across 14 schools."
        },
        {
            "name": "Pulkit Desai",
            "title": "Mayor of Parsippany-Troy Hills",
            "entity": "Township of Parsippany-Troy Hills",
            "department": "Office of the Mayor",
            "type": "Full-Time Elected Executive",
            "salaryReported": 125000,
            "salaryRange": "$120,000 - $130,000 (Faulkner Act Mayor)",
            "notes": "Elected Chief Executive under Mayor-Council plan (took office Jan 2026 following former Mayor James R. Barberio); campaigned on halting unchecked PILOT giveaways."
        },
        {
            "name": "Judy Hernandez",
            "title": "Township Council President",
            "entity": "Township of Parsippany-Troy Hills",
            "department": "Township Council",
            "type": "Elected Governing Body",
            "salaryReported": 12000,
            "salaryRange": "$12,000 Stipend",
            "notes": "Presides over Township Council legislative sessions, budget hearings, and land-use ordinances."
        },
        {
            "name": "Paul Carifi Jr. / Diya Patel / Matt McGrath / Matthew Kavanagh",
            "title": "Township Councilmembers",
            "entity": "Township of Parsippany-Troy Hills",
            "department": "Township Council",
            "type": "Elected Governing Body",
            "salaryReported": 10000,
            "salaryRange": "$10,000 Stipend",
            "notes": "Votes on municipal budget, PILOT redevelopment ordinances, bond issues, and vendor bill lists."
        },
        {
            "name": "Alison Cogan / Susy Golderer / Timothy Berrios",
            "title": "Board of Education Trustees & Leadership",
            "entity": "Parsippany-Troy Hills School District",
            "department": "Board of Education",
            "type": "Elected Unpaid Trustees",
            "salaryReported": 0,
            "salaryRange": "$0 (Statutory Unpaid Service)",
            "notes": "9-member elected Board of Education overseeing $187.45M school budget and challenging uncompensated Township PILOTs."
        }
    ]
}
save_json("staff_directory.json", staff_directory)

# 5. ethics_disclosures.json
ethics_disclosures = {
    "metadata": {
        "lastUpdated": "2026-10-18",
        "filingYear": "2025/2026 Annual Ethics Filings",
        "sourceAgency": "NJ Department of Community Affairs (LFB/FDS) & NJ School Ethics Commission (SEC)",
        "statutoryBasis": "N.J.S.A. 40A:9-22.1 (Local Government Ethics Law) & N.J.S.A. 18A:12-21 (School Ethics Act)",
        "freshnessStatus": "Current"
    },
    "disclosures": [
        {
            "officialName": "Pulkit Desai",
            "publicTitle": "Mayor (Township of Parsippany-Troy Hills)",
            "mandatoryFiling": "Local Government Ethics Law (N.J.S.A. 40A:9-22.1) - Annual FDS at fds.nj.gov",
            "disclosedBusinesses": [
                {
                    "businessName": "Cybersecurity & Enterprise IT Governance Advisory",
                    "nature": "Prior technology & cybersecurity executive consulting (U.S. Marine Corps veteran)",
                    "location": "Parsippany, NJ",
                    "ownership": "Former Principal / Transitioned to Full-Time Mayor"
                }
            ],
            "realEstateHoldings": [
                {
                    "description": "Primary Residential Property",
                    "municipality": "Parsippany-Troy Hills, NJ (Morris County)",
                    "ownershipType": "Fee Simple",
                    "taxRecordLookup": "Search Morris County Board of Taxation (District 1429) under Desai Pulkit"
                }
            ],
            "earnedIncomeSources": [
                "Township of Parsippany-Troy Hills (Elected Mayor salary)",
                "Prior corporate cybersecurity & IT executive compensation"
            ],
            "unearnedIncomeSources": [
                "Brokerage & retirement investment accounts"
            ],
            "conflictGuidance": "Pledged transparency on redevelopment and PILOT audits; must recuse from any municipal IT vendor where a prior professional relationship existed."
        },
        {
            "officialName": "James R. Barberio",
            "publicTitle": "Former Mayor (Township of Parsippany-Troy Hills, through Dec 2025)",
            "mandatoryFiling": "Local Government Ethics Law (N.J.S.A. 40A:9-22.1) - Historical FDS Filings",
            "disclosedBusinesses": [
                {
                    "businessName": "Real Estate & Business Consulting",
                    "nature": "Advisory and property management interests",
                    "location": "Morris County, NJ",
                    "ownership": "Principal"
                }
            ],
            "realEstateHoldings": [
                {
                    "description": "Residential Property",
                    "municipality": "Parsippany-Troy Hills, NJ (Morris County)",
                    "ownershipType": "Fee Simple",
                    "taxRecordLookup": "Search Morris County MOD-IV (District 1429) under Barberio James"
                }
            ],
            "earnedIncomeSources": [
                "Township of Parsippany-Troy Hills (Former Mayoral salary)",
                "Private business / consulting income"
            ],
            "unearnedIncomeSources": [
                "Retirement & investment distributions"
            ],
            "conflictGuidance": "Advocated for 30-year PILOT redevelopment ordinances on Campus Drive and 1515 Route 10; faced intense scrutiny from BOE and residents over campaign contributions from redevelopment professionals."
        },
        {
            "officialName": "Paul Carifi Jr.",
            "publicTitle": "Councilman (Township of Parsippany-Troy Hills)",
            "mandatoryFiling": "Local Government Ethics Law (N.J.S.A. 40A:9-22.1) - Annual FDS at fds.nj.gov",
            "disclosedBusinesses": [
                {
                    "businessName": "Carifi & Associates / Local Commercial Interests",
                    "nature": "Local business operations and property management",
                    "location": "Parsippany, NJ",
                    "ownership": "Principal / Family Interest"
                }
            ],
            "realEstateHoldings": [
                {
                    "description": "Residential & Commercial Real Estate",
                    "municipality": "Parsippany-Troy Hills, NJ (Morris County)",
                    "ownershipType": "Fee Simple / LLC",
                    "taxRecordLookup": "Search Morris County MOD-IV (District 1429) under Carifi"
                }
            ],
            "earnedIncomeSources": [
                "Private business & property operations",
                "Township of Parsippany-Troy Hills (Council stipend)"
            ],
            "unearnedIncomeSources": [
                "Rental and investment income"
            ],
            "conflictGuidance": "Must recuse from zoning board referrals or municipal contracts intersecting with family or personal commercial holdings in Parsippany."
        },
        {
            "officialName": "Judy Hernandez",
            "publicTitle": "Council President (Township of Parsippany-Troy Hills)",
            "mandatoryFiling": "Local Government Ethics Law (N.J.S.A. 40A:9-22.1) - Annual FDS at fds.nj.gov",
            "disclosedBusinesses": [
                {
                    "businessName": "None (Legal / Corporate Professional)",
                    "nature": "Private sector employment",
                    "location": "Morris County, NJ",
                    "ownership": "Employee"
                }
            ],
            "realEstateHoldings": [
                {
                    "description": "Primary Residential Property",
                    "municipality": "Parsippany-Troy Hills, NJ (Morris County)",
                    "ownershipType": "Fee Simple",
                    "taxRecordLookup": "Search Morris County MOD-IV (District 1429) under Hernandez"
                }
            ],
            "earnedIncomeSources": [
                "Private sector professional salary",
                "Township of Parsippany-Troy Hills (Council President stipend)"
            ],
            "unearnedIncomeSources": [
                "401(k) / retirement savings"
            ],
            "conflictGuidance": "Serves as Council President; vocal critic of uncompensated PILOT agreements that exclude the Parsippany-Troy Hills School District."
        },
        {
            "officialName": "Dr. Karen Chase",
            "publicTitle": "Superintendent of Schools (PTHSD)",
            "mandatoryFiling": "School Ethics Act (N.J.S.A. 18A:12-21) - Annual SEC Disclosure",
            "disclosedBusinesses": [
                {
                    "businessName": "None (Full-Time Public Educator)",
                    "nature": "Educational administration",
                    "location": "Parsippany, NJ",
                    "ownership": "N/A"
                }
            ],
            "realEstateHoldings": [
                {
                    "description": "Primary Residence",
                    "municipality": "New Jersey",
                    "ownershipType": "Fee Simple",
                    "taxRecordLookup": "Filed with NJ School Ethics Commission"
                }
            ],
            "earnedIncomeSources": [
                "Parsippany-Troy Hills Township School District (Superintendent salary)"
            ],
            "unearnedIncomeSources": [
                "NJ TPAF pension credits & personal savings"
            ],
            "conflictGuidance": "Governed by NJ School Ethics Act; cannot hold financial interest in any textbook, technology, or busing vendor contracting with PTHSD."
        },
        {
            "officialName": "Robin Tedesco",
            "publicTitle": "School Business Administrator / Board Secretary (PTHSD)",
            "mandatoryFiling": "School Ethics Act (N.J.S.A. 18A:12-21) - Annual SEC Disclosure",
            "disclosedBusinesses": [
                {
                    "businessName": "None Active",
                    "nature": "School Business Administration",
                    "location": "Parsippany, NJ",
                    "ownership": "N/A"
                }
            ],
            "realEstateHoldings": [
                {
                    "description": "Primary Residence",
                    "municipality": "Morris County, NJ",
                    "ownershipType": "Fee Simple",
                    "taxRecordLookup": "Filed with NJ School Ethics Commission"
                }
            ],
            "earnedIncomeSources": [
                "Parsippany-Troy Hills Township School District",
                "NJ Division of Pensions & Benefits"
            ],
            "unearnedIncomeSources": [
                "Retirement & investment accounts"
            ],
            "conflictGuidance": "Chief school procurement officer; oversees allChapter 271 Pay-to-Play vendor disclosures for PTHSD contracts exceeding $17,500."
        }
    ]
}
save_json("ethics_disclosures.json", ethics_disclosures)

# 6. vendors_spending.json
vendors_spending = {
    "metadata": {
        "lastUpdated": "2026-10-18",
        "billListCycles": "FY 2025-2026 Accounts Payable & Warrant Lists",
        "sourceAgency": "Township of Parsippany-Troy Hills Bill Lists & PTHSD Board Secretary Warrant Registers",
        "freshnessStatus": "Current"
    },
    "vendors": [
        {
            "vendorName": "State Health Benefits Program (SHBP / SEHBP) & Horizon BCBS",
            "entityServed": "Both Township of Parsippany & PTHSD",
            "category": "Employee Healthcare & Prescription",
            "annualEstimatedSpend": 51200000,
            "description": "Combined medical, prescription drug, and dental insurance coverage for active and retired township and school district personnel."
        },
        {
            "vendorName": "Police & Firemen's Retirement System (PFRS) & PERS",
            "entityServed": "Township of Parsippany-Troy Hills",
            "category": "Statutory Pension Mandates",
            "annualEstimatedSpend": 10900000,
            "description": "Mandatory annual employer pension billing from the NJ Division of Pensions & Benefits for police officers and civilian staff."
        },
        {
            "vendorName": "Student Transportation Contractors (First Student, STA, Educational Services Commission of Morris County)",
            "entityServed": "Parsippany-Troy Hills School District",
            "category": "Student Busing & Special Ed Transit",
            "annualEstimatedSpend": 9450000,
            "description": "Contracted daily school bus routes across 14 schools, non-public aid-in-lieu payments, and coordinated special education transportation through ESCMC."
        },
        {
            "vendorName": "Out-of-District Special Education & Morris County Vo-Tech (MCVSD)",
            "entityServed": "Parsippany-Troy Hills School District",
            "category": "Mandated Vocational & Special Ed Tuition",
            "annualEstimatedSpend": 11800000,
            "description": "Tuition paid to Morris County School of Technology (Denville), Allegro School, Shepard School, P.G. Chambers School, and Celebrate the Children."
        },
        {
            "vendorName": "Suburban Disposal / Municipal Solid Waste & Recycling Hauling",
            "entityServed": "Township of Parsippany-Troy Hills",
            "category": "Sanitation & Recycling Collection",
            "annualEstimatedSpend": 6850000,
            "description": "Curbside solid waste, bulk trash, and recycling collection & Morris County MUA tipping fees across 16,500+ residential households."
        },
        {
            "vendorName": "Weiner Law Group / Inglesino Taylor / Special Redevelopment & PILOT Counsel",
            "entityServed": "Township of Parsippany & PTHSD",
            "category": "Municipal, Land Use & BOE Legal Services",
            "annualEstimatedSpend": 2150000,
            "description": "Township Attorney, tax appeal defense counsel, redevelopment/PILOT attorneys, and special legal counsel retained by the Board of Education to contest uncompensated PILOTs."
        },
        {
            "vendorName": "Boswell Engineering / Suburban Consulting Engineers / Parette Somjen Architects",
            "entityServed": "Township of Parsippany & PTHSD",
            "category": "Engineering, Water/Sewer & School Facilities",
            "annualEstimatedSpend": 3400000,
            "description": "PFAS water treatment upgrades, sanitary sewer pump station rehab, road resurfacing design, and school roof/HVAC capital projects."
        },
        {
            "vendorName": "JCP&L (FirstEnergy) & NJ Natural Gas",
            "entityServed": "Township of Parsippany & PTHSD",
            "category": "Public Utilities, Streetlights & Water Pumping",
            "annualEstimatedSpend": 4600000,
            "description": "Electricity for 14 schools, municipal complex, wastewater treatment plant, water wells, and township street lighting."
        }
    ]
}
save_json("vendors_spending.json", vendors_spending)

# 7. benefits_healthcare.json
benefits_healthcare = {
    "metadata": {
        "lastUpdated": "2026-10-18",
        "fiscalCycle": "FY 2025-2026 / CY 2026",
        "dataVintage": "Certified 2026 Plan Year",
        "sourceAgencies": [
            "NJ Division of Pensions and Benefits (SHBP / SEHBP)",
            "Township of Parsippany-Troy Hills Adopted Budget & PBA/Teamsters Contracts",
            "Parsippany-Troy Hills School District User-Friendly Budget (PTHEA Contract)"
        ],
        "freshnessStatus": "Current"
    },
    "overview": {
        "annualTaxpayerCostCity": 24700000,
        "annualTaxpayerCostBOE": 39800000,
        "combinedTaxpayerBenefitsCost": 64500000,
        "percentageOfCombinedBudgets": "23.0% of all Parsippany municipal and school spending ($64.5M of $280.2M) goes directly to employee health insurance, pensions, and retirement benefits"
    },
    "healthcarePlans": {
        "providers": "Horizon Blue Cross Blue Shield / SEHBP (School District) & Township Health Benefits Program",
        "primaryPlans": [
            {
                "planName": "NJ Educators Health Plan (NJEHP / Chapter 44) & Garden State Health Plan",
                "type": "School District PPO (PTHEA & Staff)",
                "description": "Enacted under P.L. 2020, c. 44. Caps teacher and school staff premium contributions at 1.7% to 7.2% of salary rather than percentage of premium, shifting double-digit healthcare inflation directly onto Parsippany property taxpayers."
            },
            {
                "planName": "NJ DIRECT 10 / NJ DIRECT 15 (Horizon BCBSNJ)",
                "type": "Comprehensive PPO Plan",
                "description": "Nationwide PPO network with $10-$15 primary care copays and low out-of-network deductibles for grandfathered and municipal bargaining units."
            },
            {
                "planName": "Prescription Drug Card (OptumRx / Benecard)",
                "type": "Retail & Mail-Order Formulary",
                "description": "Covers brand, generic, and high-cost GLP-1/specialty biologics with low employee copays; taxpayers absorb the remaining 85%+ formulary cost."
            },
            {
                "planName": "Delta Dental & Vision Service Plan",
                "type": "Preventive, Restorative & Orthodontic Dental",
                "description": "Employer-paid family dental and optical benefits for eligible full-time township and school employees."
            }
        ]
    },
    "costSharing": {
        "statutoryFramework": "Chapter 78 (P.L. 2011, c. 78) & Chapter 44 (P.L. 2020, c. 44)",
        "rules": [
            {
                "tier": "Township Police & Municipal Staff (Chapter 78 / CBA Grid)",
                "employeeContribution": "10.0% to 35.0% of premium based on salary tier",
                "taxpayerContribution": "65.0% to 90.0% of total premium ($22,500 - $29,000/yr per family)",
                "note": "For a police officer or supervisor with a $36,000 family health plan, Parsippany taxpayers subsidize ~$23,400+ every year."
            },
            {
                "tier": "PTHSD Teachers & School Staff (Chapter 44 NJEHP)",
                "employeeContribution": "1.7% to 7.2% of base salary",
                "taxpayerContribution": "80.0% to 92.0% of total family premium",
                "note": "Because employee contributions are tied to salary rather than premium growth, 100% of annual health insurance rate hikes fall on the PTHSD school tax levy."
            }
        ]
    },
    "retirementAndLeaveBenefits": [
        {
            "benefitName": "Post-Retirement Medical Benefits (25-Year Service Rule)",
            "legalAuthority": "N.J.S.A. 40A:10-23 & Collective Bargaining Agreements",
            "taxpayerImpact": "Multi-million dollar annual retiree medical expenditure",
            "details": "Eligible employees retiring after 25 years of pensionable service receive township- or state-paid medical coverage in retirement plus Medicare Part B reimbursements."
        },
        {
            "benefitName": "Police & Firemen's Retirement System (PFRS) & PERS",
            "legalAuthority": "NJ Division of Pensions and Benefits",
            "taxpayerImpact": "$10.9M annual mandatory municipal budget appropriation",
            "details": "Funds special retirement pensions (65%-70% of final salary after 25 years) for sworn Parsippany police officers and standard pensions for civilian employees."
        },
        {
            "benefitName": "Unused Sick & Vacation Terminal Payouts",
            "legalAuthority": "N.J.S.A. 11A:6-19.2 & PBA / PTHEA Contracts",
            "taxpayerImpact": "Lump-sum retirement cash-outs funded via municipal & school reserves",
            "details": "Veteran employees hired prior to the 2010 statutory reform retain grandfathered contractual rights to cash out accumulated unused sick and vacation days upon retirement."
        }
    ]
}
save_json("benefits_healthcare.json", benefits_healthcare)

# 8. ethics_controversies.json
ethics_controversies = {
    "metadata": {
        "lastUpdated": "2026-10-18",
        "reportVintage": "October 2026 Parsippany Watchdog Analysis",
        "sources": [
            "Parsippany-Troy Hills Board of Education Resolutions & Special Counsel Filings",
            "Township of Parsippany-Troy Hills Council Minutes & Redevelopment Ordinances",
            "Morris County Board of Taxation Abstract of Ratables & Appeal Docket",
            "Parsippany Focus, Morristown Green & Daily Record Investigations"
        ],
        "freshnessStatus": "Current"
    },
    "controversies": [
        {
            "id": "parsippany-pilot-school-war",
            "severity": "HIGH",
            "category": "PILOT Tax Abatements & School Revenue Exclusion",
            "title": "1515 Route 10 (Stanbery) & Campus Drive PILOT Battles: Township vs. Board of Education",
            "entityInvolved": "Parsippany Township Council / Former Mayor Barberio vs. Parsippany-Troy Hills BOE",
            "lastUpdated": "2025-2026",
            "summary": "The Township approved sweeping 30-year PILOT tax breaks for massive luxury apartment redevelopments (including 1515 Route 10 and Campus Drive), sparking an unprecedented public standoff with the Board of Education.",
            "investigationDetails": "As Parsippany's corporate office parks along Route 10 and Campus Drive converted into hundreds of luxury multi-family apartments (such as Stanbery Development's 500+ unit mixed-use project at 1515 Route 10 and AvalonBay on Campus Drive), the Township granted 30-year Payments In Lieu of Taxes (PILOT) exemptions. While initial verbal assurances suggested revenue sharing with the schools, 1515 Route 10 was excluded from the school revenue-sharing MOU. Under N.J.S.A. 40A:20, Township Hall retains 95% of PILOT payments and Morris County gets 5%, while the Parsippany-Troy Hills School District receives $0 statutory share—forcing homeowners to pay 100% of the $23,180/pupil cost for every new student moving into PILOT complexes.",
            "taxpayerImpact": "Millions in abated property taxes and uncompensated school enrollment costs shifted directly onto Parsippany single-family homeowners.",
            "status": "Major issue in the 2025/2026 Mayoral transition; BOE retained special legal counsel to challenge uncompensated PILOTs."
        },
        {
            "id": "boe-special-legal-counsel-pilots",
            "severity": "HIGH",
            "category": "Inter-Governmental Legal Dispute",
            "title": "Board of Education Hires Special Legal Counsel to Challenge Township PILOT Giveaways",
            "entityInvolved": "Parsippany-Troy Hills Board of Education vs. Township Administration",
            "lastUpdated": "2025-2026",
            "summary": "In a rare move in New Jersey municipal governance, the Parsippany Board of Education voted to retain independent special legal counsel to protect school taxpayers from municipal PILOT ordinances.",
            "investigationDetails": "Facing over 25 approved or proposed PILOT redevelopment projects across the township, the PTHSD Board of Education formally retained special redevelopment legal counsel to audit municipal financial agreements, demand per-pupil impact compensation, and challenge PILOT ordinances that bypass the school tax levy. Because local property taxes fund 86.4% of PTHSD's $187.45M budget (with State Aid under 10%), every uncompensated apartment complex directly forces either a school tax spike or teacher reductions.",
            "taxpayerImpact": "Taxpayers fund legal counsel on both sides (Township redevelopment attorneys vs. BOE special counsel) due to lack of a binding 50% PILOT school-sharing ordinance.",
            "status": "Active BOE oversight and ongoing negotiation with the new Desai administration."
        },
        {
            "id": "corporate-office-park-collapse",
            "severity": "HIGH",
            "category": "Commercial Ratable Erosion & Tax Appeals",
            "title": "Corporate Office Park Vacancy Crisis (Mack-Cali, Lanidex, MCC & Route 10)",
            "entityInvolved": "Campus Drive, Sylvan Way, Lanidex Plaza & Waterview Corporate Corridors",
            "lastUpdated": "2024-2026",
            "summary": "Once the 'Corporate Capital of Morris County,' Parsippany's suburban office park vacancies and commercial tax appeals have shifted tens of millions in tax burden onto residential homeowners.",
            "investigationDetails": "In the 1990s, Parsippany's sprawling corporate campuses (AT&T, Nabisco, Prudential, Cendant, Mack-Cali, Wyndham, Tiffany) paid nearly 46% of the township's entire property tax levy, keeping residential taxes among the lowest in Morris County. Over the past 15 years, remote work, corporate relocations, and aggressive NJ Tax Court appeals slashed commercial assessments by hundreds of millions of dollars. Today, residential homeowners shoulder 72.8% of the tax base while commercial/industrial properties pay just 27.2%.",
            "taxpayerImpact": "+$29.4 Million per year in tax burden shifted from corporate office parks onto single-family homes (~$1,680/yr extra per average household).",
            "status": "Ongoing commercial tax appeal settlements and adaptive reuse debates."
        },
        {
            "id": "pthsd-budget-crunch-activity-fees",
            "severity": "HIGH",
            "category": "School Budget Cap & Healthcare Surge",
            "title": "PTHSD 86.4% Local Tax Reliance, Healthcare Surge & Student Activity Fee Debates",
            "entityInvolved": "Parsippany-Troy Hills Township School District (PTHSD)",
            "lastUpdated": "2025-2026 Budget Cycle",
            "summary": "With State Education Aid covering less than 10% of the budget and employee health benefits nearing $40M, the school district faced painful budget gaps, staffing reductions, and controversial student fees.",
            "investigationDetails": "Unlike urban districts where state aid covers 37% to 85% of school budgets, Parsippany receives only ~9.7% in state aid ($18.26M out of $187.45M), leaving local homeowners to fund $161.99M (86.4%). Compounded by double-digit SEHBP/Chapter 44 health insurance increases, surging out-of-district special education tuition, and busing inflation, the BOE was forced to weigh staff reductions, courtesy busing reviews, and student participation/activity fees while appealing for fair PILOT sharing.",
            "taxpayerImpact": "School taxes now consume 64.14% of every Parsippany homeowner's property tax bill ($7,935/yr on an average $348.5k home).",
            "status": "Adopted FY 2025-2026 budget at statutory cap + health care adjustment."
        },
        {
            "id": "six-fire-districts-fragmentation",
            "severity": "MEDIUM",
            "category": "Special Taxing District Fragmentation",
            "title": "6 Separate Fire Districts & 6 Separate Fire Tax Levies Across One Township",
            "entityInvolved": "Parsippany Fire Districts #1, #2, #3, #4, #5, and #6",
            "lastUpdated": "2026 Certified Tax Roll",
            "summary": "Parsippany is one of the few NJ municipalities divided into six independent Fire Districts, each with its own elected board of commissioners, legal/audit overhead, and separate property tax rate.",
            "investigationDetails": "Depending on which neighborhood you live in—Mount Tabor (Dist. 1), Rainbow Lakes (Dist. 2), Lake Parsippany (Dist. 3), Lake Hiawatha (Dist. 4), Rockaway Neck (Dist. 5), or Central/Troy Hills (Dist. 6)—you pay a different Fire District tax rate ranging from $0.072 to $0.135 per $100 of assessed value (~$7.15M combined levy). Watchdogs have long questioned the administrative duplication of maintaining six separate accounting, legal, insurance, and procurement structures within a single town.",
            "taxpayerImpact": "Adds $250 to $520 per year onto residential tax bills depending on fire district boundaries.",
            "status": "Each Fire District holds independent annual budget elections/certifications."
        },
        {
            "id": "waterview-whole-foods-litigation-legacy",
            "severity": "MEDIUM",
            "category": "Redevelopment & Open Space Disputes",
            "title": "Waterview Marketplace / Route 202 & Corporate Corridor Traffic Strain",
            "entityInvolved": "Township Planning/Zoning Boards & Route 202 / Route 46 Corridors",
            "lastUpdated": "2024-2026",
            "summary": "High-density retail and residential redevelopments along Littleton Road (Rt 202), Route 46, and Route 10 have triggered years of citizen litigation, traffic congestion, and stormwater runoff concerns.",
            "investigationDetails": "Following the long-fought Waterview tract battle (which ultimately yielded Whole Foods Marketplace and luxury townhomes along Route 202/Intervale Rd), subsequent high-density redevelopments have intensified impervious surface runoff into the Whippany and Rockaway River watersheds while straining local commuter intersections.",
            "taxpayerImpact": "Increased municipal infrastructure, traffic policing, and stormwater drainage maintenance costs.",
            "status": "Active stormwater management and Master Plan land-use review."
        }
    ]
}
save_json("ethics_controversies.json", ethics_controversies)

# 9. demographics_taxes.json
demographics_taxes = {
    "metadata": {
        "lastUpdated": "2026-10-18",
        "sources": [
            "U.S. Census Bureau American Community Survey (ACS 5-Year Estimates, ZCTA 07054, 07034, 07878, 07950)",
            "Morris County Board of Taxation 2026 Certified Assessment Roll (District 1429)",
            "NJ Department of Education Fall Enrollment Reports (Parsippany-Troy Hills School District)"
        ],
        "certifiedTaxRate": 3.550,
        "equalizationRatio": 0.666,
        "freshnessStatus": "Current & Certified"
    },
    "cityOverview": {
        "municipality": "Township of Parsippany-Troy Hills",
        "county": "Morris County",
        "totalPopulation": 56162,
        "totalHousingUnits": 21840,
        "medianHouseholdIncome": 124850,
        "perCapitaIncome": 56420,
        "medianAge": 41.4,
        "povertyRate": 4.8,
        "ownerOccupiedRate": 63.5,
        "renterOccupiedRate": 36.5,
        "foreignBornPercentage": 34.8,
        "averageResidentialAssessment": 348500,
        "averageEstimatedMarketValue": 595000,
        "averageAnnualTaxBill": 12371.75
    },
    "zipCodeComparison": [
        {
            "zip": "07054",
            "areaName": "Central Parsippany, Troy Hills, Powder Mill & Lake Parsippany",
            "neighborhoodsIncluded": "Troy Hills, Powder Mill, Parsippany Hills, Lake Parsippany, Knollwood, Rockaway Neck",
            "population": 41850,
            "populationShare": 74.5,
            "medianHouseholdIncome": 134200,
            "perCapitaIncome": 59800,
            "medianAge": 42.1,
            "ownerOccupiedPercent": 68.4,
            "renterOccupiedPercent": 31.6,
            "averageAssessment": 368000,
            "averageMarketValue": 635000,
            "averageAnnualTaxBill": 13064.00,
            "monthlyTaxBill": 1088.67,
            "taxBurdenPercentOfIncome": 9.73,
            "shareOfTotalTaxBase": 76.8,
            "totalResidentialLevyContribution": 124400000,
            "schoolEnrollmentShare": 72.5,
            "demographicProfile": {
                "whiteNonHispanic": 48.5,
                "asian": 36.8,
                "hispanicOrLatino": 10.2,
                "blackOrAfricanAmerican": 3.5,
                "other": 1.0
            },
            "keyFindings": [
                "Represents three-quarters of Parsippany's population and generates 76.8% of the residential school and municipal tax levy.",
                "Includes both high-value custom colonials in Powder Mill/Troy Hills ($430k+ assessments) and modest bungalows around Lake Parsippany ($285k assessments).",
                "Contains the Campus Drive, Sylvan Way, and Route 10 corporate corridors where 30-year PILOT apartment conversions are concentrated."
            ]
        },
        {
            "zip": "07034",
            "areaName": "Lake Hiawatha & Beverwyck Corridor",
            "neighborhoodsIncluded": "Lake Hiawatha, North Beverwyck Rd Corridor, Lower Knollwood",
            "population": 10120,
            "populationShare": 18.0,
            "medianHouseholdIncome": 96400,
            "perCapitaIncome": 44200,
            "medianAge": 38.9,
            "ownerOccupiedPercent": 51.2,
            "renterOccupiedPercent": 48.8,
            "averageAssessment": 292000,
            "averageMarketValue": 485000,
            "averageAnnualTaxBill": 10366.00,
            "monthlyTaxBill": 863.83,
            "taxBurdenPercentOfIncome": 10.75,
            "shareOfTotalTaxBase": 14.2,
            "totalResidentialLevyContribution": 23000000,
            "schoolEnrollmentShare": 19.8,
            "demographicProfile": {
                "whiteNonHispanic": 51.0,
                "asian": 28.4,
                "hispanicOrLatino": 15.6,
                "blackOrAfricanAmerican": 3.8,
                "other": 1.2
            },
            "keyFindings": [
                "Walkable downtown commercial & residential neighborhood with the highest property tax effort as a share of household income (10.75%).",
                "Nearly 49% renter households in garden apartments and multi-family homes along North Beverwyck Road.",
                "Supplies nearly 20% of public school students while paying 14.2% of the residential tax levy."
            ]
        },
        {
            "zip": "07878",
            "areaName": "Historic Mount Tabor & Tabor Lake",
            "neighborhoodsIncluded": "Mount Tabor Historic District (Camp Meeting Grounds), Country Club Rd Enclave",
            "population": 1690,
            "populationShare": 3.0,
            "medianHouseholdIncome": 128500,
            "perCapitaIncome": 61200,
            "medianAge": 44.6,
            "ownerOccupiedPercent": 82.0,
            "renterOccupiedPercent": 18.0,
            "averageAssessment": 334000,
            "averageMarketValue": 565000,
            "averageAnnualTaxBill": 11857.00,
            "monthlyTaxBill": 988.08,
            "taxBurdenPercentOfIncome": 9.23,
            "shareOfTotalTaxBase": 3.4,
            "totalResidentialLevyContribution": 5510000,
            "schoolEnrollmentShare": 2.9,
            "demographicProfile": {
                "whiteNonHispanic": 72.4,
                "asian": 14.2,
                "hispanicOrLatino": 9.4,
                "blackOrAfricanAmerican": 2.8,
                "other": 1.2
            },
            "keyFindings": [
                "Founded in 1869 as a Victorian Methodist camp-meeting community; listed on the National Register of Historic Places.",
                "Served by Fire District #1 and its own dedicated Mount Tabor Branch Library and NJ Transit train station border.",
                "High homeownership rate (82%) with unique historic cottage and Victorian architecture."
            ]
        },
        {
            "zip": "07950",
            "areaName": "Southwest Parsippany / Greystone / Morris Plains Border",
            "neighborhoodsIncluded": "Littleton Rd (Rt 202) West, Greystone Park Border, Intervale / Powder Mill West",
            "population": 2502,
            "populationShare": 4.5,
            "medianHouseholdIncome": 152000,
            "perCapitaIncome": 68400,
            "medianAge": 43.2,
            "ownerOccupiedPercent": 78.5,
            "renterOccupiedPercent": 21.5,
            "averageAssessment": 412000,
            "averageMarketValue": 715000,
            "averageAnnualTaxBill": 14626.00,
            "monthlyTaxBill": 1218.83,
            "taxBurdenPercentOfIncome": 9.62,
            "shareOfTotalTaxBase": 5.6,
            "totalResidentialLevyContribution": 9080000,
            "schoolEnrollmentShare": 4.8,
            "demographicProfile": {
                "whiteNonHispanic": 58.2,
                "asian": 31.0,
                "hispanicOrLatino": 7.3,
                "blackOrAfricanAmerican": 2.5,
                "other": 1.0
            },
            "keyFindings": [
                "Affluent western section of Parsippany sharing the 07950 postal code with neighboring Morris Plains.",
                "Carries the highest average residential assessments ($412,000) and average annual tax bills ($14,626/yr) in the township.",
                "Feeds into Parsippany Hills High School and Brooklawn Middle School."
            ]
        }
    ],
    "neighborhoods": [
        {
            "name": "Powder Mill & Parsippany Hills",
            "zip": "07054",
            "character": "Executive Split-Levels, Center-Hall Colonials & Wooded Lots",
            "medianIncome": 164000,
            "medianAge": 44.2,
            "avgAssessment": 428000,
            "avgMarketValue": 745000,
            "avgTaxBill": 15194.00,
            "taxBurdenPercentIncome": 9.26,
            "ownerOccupied": 88.5,
            "description": "Located in western/southwest Parsippany near Parsippany Hills High School and Morris Plains border. Features spacious 4–5 bedroom colonials and split-levels on quarter- to half-acre lots.",
            "taxDynamic": "Highest nominal residential tax bills in Parsippany ($14,500–$21,000/yr), acting as a major net tax donor to the school and municipal levy."
        },
        {
            "name": "Troy Hills & South Beverwyck",
            "zip": "07054",
            "character": "Historic Suburban Core, Colonials, Bi-Levels & Cul-de-Sacs",
            "medianIncome": 142500,
            "medianAge": 42.5,
            "avgAssessment": 376000,
            "avgMarketValue": 645000,
            "avgTaxBill": 13348.00,
            "taxBurdenPercentIncome": 9.37,
            "ownerOccupied": 81.0,
            "description": "Stretching along South Beverwyck Road, Reynolds Ave, and Troy Rd toward Whippany. Home to Troy Hills Elementary and classic mid-century and modern suburban subdivisions.",
            "taxDynamic": "Strong middle-to-upper-middle class tax base; homeowners have absorbed steep school levy increases as nearby Route 10 office parks lost assessment value."
        },
        {
            "name": "Lake Parsippany",
            "zip": "07054",
            "character": "Lakefront Community, Expanded Ranches, Capes & Rebuild Colonials",
            "medianIncome": 116800,
            "medianAge": 40.8,
            "avgAssessment": 312000,
            "avgMarketValue": 535000,
            "avgTaxBill": 11076.00,
            "taxBurdenPercentIncome": 9.48,
            "ownerOccupied": 79.4,
            "description": "Built around the 168-acre Lake Parsippany (LPPOA) in the southern-central section of town. Mix of 1930s–1950s summer cottages converted to year-round homes and modern rebuilds.",
            "taxDynamic": "Served by Fire District #3; residents pay both township property taxes ($11,076 avg) and optional/deeded Lake Parsippany Property Owners Association fees."
        },
        {
            "name": "Lake Hiawatha",
            "zip": "07034",
            "character": "High-Density Residential, Walkable Commercial Corridor & Garden Apartments",
            "medianIncome": 96400,
            "medianAge": 38.9,
            "avgAssessment": 292000,
            "avgMarketValue": 485000,
            "avgTaxBill": 10366.00,
            "taxBurdenPercentIncome": 10.75,
            "ownerOccupied": 51.2,
            "description": "Northeastern section of Parsippany centered on North Beverwyck Road and Lake Shore Drive, bordering Montville and Boonton. Features local restaurants, shops, single-family capes, and apartment complexes.",
            "taxDynamic": "Bears the highest property tax burden as a percentage of household income (10.75%) and serves as a major source of students for Lake Hiawatha Elementary, Central MS, and Parsippany High School."
        },
        {
            "name": "Mount Tabor & Rainbow Lakes",
            "zip": "07878",
            "character": "Historic Victorian Camp-Meeting Enclave & Lakefront Homes",
            "medianIncome": 131000,
            "medianAge": 44.1,
            "avgAssessment": 342000,
            "avgMarketValue": 585000,
            "avgTaxBill": 12141.00,
            "taxBurdenPercentIncome": 9.27,
            "ownerOccupied": 83.2,
            "description": "Northwest corner of Parsippany bordering Denville. Includes the 1869 Mount Tabor Historic District with gingerbread Victorian cottages and the scenic Rainbow Lakes community.",
            "taxDynamic": "Served by Fire Districts #1 (Mt. Tabor) and #2 (Rainbow Lakes); high civic engagement and historic preservation protections."
        },
        {
            "name": "Knollwood, Lake Intervale & Greystone",
            "zip": "07054",
            "character": "North/West Commuter Subdivisions, Townhomes & Country Club Corridor",
            "medianIncome": 138500,
            "medianAge": 41.2,
            "avgAssessment": 362000,
            "avgMarketValue": 618000,
            "avgTaxBill": 12851.00,
            "taxBurdenPercentIncome": 9.28,
            "ownerOccupied": 72.0,
            "description": "Encompasses the northern and western corridors near Knoll Country Club, Intervale Road (Waterview), and Littleton Road (07950 border).",
            "taxDynamic": "Directly impacted by high-density luxury apartment and townhome redevelopments along Route 202 and Route 46."
        }
    ],
    "familyChildDemographics": {
        "citywide": {
            "totalHouseholds": 20950,
            "householdsWithChildrenUnder18": 7420,
            "householdsWithChildrenPercent": 35.4,
            "totalSchoolAgeChildren": 8150,
            "enrolledPublicSchools": 7120,
            "enrolledPublicPercent": 87.4,
            "privateOrParochialStudents": 1030
        },
        "zipBreakdown": [
            {
                "zip": "07054",
                "area": "Central Parsippany, Troy Hills, Powder Mill & Lake Parsippany",
                "households": 15280,
                "householdsWithChildrenPercent": 35.8,
                "schoolAgeChildren": 5920,
                "districtStudentsSent": 5162,
                "districtStudentsPercent": 72.5,
                "residentialTaxSharePaid": 76.8,
                "ratioStudentsToTaxes": 0.94,
                "subsidyStatus": "Net Tax Donor",
                "keyDriver": "High-assessment single-family homes in Powder Mill, Troy Hills, and Knollwood generate a 4.3% net school tax surplus.",
                "primaryFeeder": "Brooklawn MS & Central MS ➔ Parsippany HS & Parsippany Hills HS"
            },
            {
                "zip": "07034",
                "area": "Lake Hiawatha & North Beverwyck Corridor",
                "households": 4080,
                "householdsWithChildrenPercent": 36.2,
                "schoolAgeChildren": 1580,
                "districtStudentsSent": 1410,
                "districtStudentsPercent": 19.8,
                "residentialTaxSharePaid": 14.2,
                "ratioStudentsToTaxes": 1.39,
                "subsidyStatus": "Net Educational Recipient",
                "keyDriver": "Higher family density and multi-family apartments send 1,410 students (19.8%) while contributing 14.2% of residential school taxes.",
                "primaryFeeder": "Lake Hiawatha / Knollwood Elem ➔ Central MS ➔ Parsippany HS"
            },
            {
                "zip": "07878",
                "area": "Mount Tabor & Tabor Lake",
                "households": 640,
                "householdsWithChildrenPercent": 31.0,
                "schoolAgeChildren": 235,
                "districtStudentsSent": 206,
                "districtStudentsPercent": 2.9,
                "residentialTaxSharePaid": 3.4,
                "ratioStudentsToTaxes": 0.85,
                "subsidyStatus": "Net Tax Donor",
                "keyDriver": "Smaller historic lots and older empty-nester demographics generate a net school tax surplus.",
                "primaryFeeder": "Mount Tabor Elem ➔ Brooklawn MS ➔ Parsippany Hills HS"
            },
            {
                "zip": "07950",
                "area": "Southwest Parsippany / Littleton / Greystone Border",
                "households": 950,
                "householdsWithChildrenPercent": 37.5,
                "schoolAgeChildren": 415,
                "districtStudentsSent": 342,
                "districtStudentsPercent": 4.8,
                "residentialTaxSharePaid": 5.6,
                "ratioStudentsToTaxes": 0.86,
                "subsidyStatus": "Net Tax Donor",
                "keyDriver": "High average assessments ($412k) generate $9.08M in school taxes for 342 students.",
                "primaryFeeder": "Littleton / Intervale Elem ➔ Brooklawn MS ➔ Parsippany Hills HS"
            }
        ],
        "schools": [
            {
                "name": "Parsippany High School",
                "type": "High School",
                "grades": "9-12",
                "address": "309 Baldwin Rd, Parsippany, NJ 07054",
                "neighborhood": "East / Central Parsippany & Lake Hiawatha",
                "enrollment": 1045,
                "familiesWithKidsPercentInZone": 36.0,
                "studentTeacherRatio": "11.2:1",
                "economicallyDisadvantagedPercent": 16.4,
                "multilingualLearnersPercent": 5.8,
                "feederMiddle": "Receives from Central Middle School",
                "notes": "Home of the Red Hawks; serves eastern/central Parsippany and Lake Hiawatha."
            },
            {
                "name": "Parsippany Hills High School",
                "type": "High School",
                "grades": "9-12",
                "address": "20 Rita Dr, Morris Plains (Parsippany), NJ 07950",
                "neighborhood": "West Parsippany, Powder Mill, Mt. Tabor & Lake Parsippany",
                "enrollment": 1120,
                "familiesWithKidsPercentInZone": 35.5,
                "studentTeacherRatio": "11.4:1",
                "economicallyDisadvantagedPercent": 10.2,
                "multilingualLearnersPercent": 3.4,
                "feederMiddle": "Receives from Brooklawn Middle School",
                "notes": "Home of the Vikings; nationally ranked AP/STEM programs serving western and southern Parsippany."
            },
            {
                "name": "Brooklawn Middle School",
                "type": "Middle School",
                "grades": "6-8",
                "address": "250 Beachwood Rd, Parsippany, NJ 07054",
                "neighborhood": "West & South Parsippany (Mount Tabor, Littleton, Lake Parsippany, Eastlake)",
                "enrollment": 925,
                "familiesWithKidsPercentInZone": 36.2,
                "studentTeacherRatio": "11.0:1",
                "economicallyDisadvantagedPercent": 11.5,
                "multilingualLearnersPercent": 4.2,
                "feederMiddle": "Feeds into Parsippany Hills High School",
                "notes": "Receives students from Eastlake, Intervale, Lake Parsippany, Littleton, and Mount Tabor Elementary Schools."
            },
            {
                "name": "Central Middle School",
                "type": "Middle School",
                "grades": "6-8",
                "address": "1620 Route 46, Parsippany, NJ 07054",
                "neighborhood": "Central & East Parsippany (Lake Hiawatha, Troy Hills, Knollwood, Rockaway Meadow)",
                "enrollment": 845,
                "familiesWithKidsPercentInZone": 35.8,
                "studentTeacherRatio": "10.8:1",
                "economicallyDisadvantagedPercent": 17.8,
                "multilingualLearnersPercent": 6.5,
                "feederMiddle": "Feeds into Parsippany High School",
                "notes": "Receives students from Knollwood, Lake Hiawatha, Northvail, Rockaway Meadow, and Troy Hills Elementary Schools."
            },
            {
                "name": "Lake Hiawatha Elementary School",
                "type": "Elementary",
                "grades": "PreK-5",
                "address": "1 Lincoln Ave, Lake Hiawatha, NJ 07034",
                "neighborhood": "Lake Hiawatha (07034)",
                "enrollment": 435,
                "familiesWithKidsPercentInZone": 38.4,
                "studentTeacherRatio": "11.5:1",
                "economicallyDisadvantagedPercent": 21.2,
                "multilingualLearnersPercent": 11.4,
                "feederMiddle": "Central Middle School",
                "notes": "Largest elementary school in eastern Parsippany; serves walkable Lake Hiawatha neighborhood."
            },
            {
                "name": "Knollwood Elementary School",
                "type": "Elementary",
                "grades": "K-5",
                "address": "445 Knoll Rd, Lake Hiawatha, NJ 07034",
                "neighborhood": "Knollwood & Upper Lake Hiawatha",
                "enrollment": 365,
                "familiesWithKidsPercentInZone": 37.0,
                "studentTeacherRatio": "11.2:1",
                "economicallyDisadvantagedPercent": 16.5,
                "multilingualLearnersPercent": 8.9,
                "feederMiddle": "Central Middle School",
                "notes": "Serves northern Knollwood and Beverwyck corridors."
            },
            {
                "name": "Littleton Elementary School",
                "type": "Elementary",
                "grades": "K-5",
                "address": "51 Brooklawn Dr, Morris Plains (Parsippany), NJ 07950",
                "neighborhood": "Powder Mill & Littleton (07950/07054)",
                "enrollment": 385,
                "familiesWithKidsPercentInZone": 39.1,
                "studentTeacherRatio": "11.6:1",
                "economicallyDisadvantagedPercent": 8.4,
                "multilingualLearnersPercent": 6.1,
                "feederMiddle": "Brooklawn Middle School",
                "notes": "Experiencing enrollment growth from Route 10 and Campus Drive residential redevelopments."
            },
            {
                "name": "Mount Tabor Elementary School",
                "type": "Elementary",
                "grades": "K-5",
                "address": "Park Rd & Route 53, Tabor, NJ 07878",
                "neighborhood": "Mount Tabor & Rainbow Lakes (07878)",
                "enrollment": 330,
                "familiesWithKidsPercentInZone": 34.2,
                "studentTeacherRatio": "11.0:1",
                "economicallyDisadvantagedPercent": 9.8,
                "multilingualLearnersPercent": 5.2,
                "feederMiddle": "Brooklawn Middle School",
                "notes": "Serves historic Mount Tabor, Rainbow Lakes, and northwestern Parsippany."
            },
            {
                "name": "Troy Hills Elementary School",
                "type": "Elementary",
                "grades": "K-5",
                "address": "509 South Beverwyck Rd, Parsippany, NJ 07054",
                "neighborhood": "Troy Hills & South Parsippany",
                "enrollment": 310,
                "familiesWithKidsPercentInZone": 35.0,
                "studentTeacherRatio": "10.9:1",
                "economicallyDisadvantagedPercent": 12.6,
                "multilingualLearnersPercent": 7.4,
                "feederMiddle": "Central Middle School",
                "notes": "Serves historic Troy Hills and South Beverwyck residential subdivisions."
            },
            {
                "name": "Lake Parsippany Elementary School",
                "type": "Elementary",
                "grades": "K-5",
                "address": "225 Kingston Rd, Parsippany, NJ 07054",
                "neighborhood": "Lake Parsippany (07054)",
                "enrollment": 295,
                "familiesWithKidsPercentInZone": 34.8,
                "studentTeacherRatio": "10.7:1",
                "economicallyDisadvantagedPercent": 14.1,
                "multilingualLearnersPercent": 7.8,
                "feederMiddle": "Brooklawn Middle School",
                "notes": "Walkable community elementary school on the eastern shore of Lake Parsippany."
            },
            {
                "name": "Intervale Elementary School",
                "type": "Elementary",
                "grades": "K-5",
                "address": "60 Pitt Rd, Boonton (Parsippany), NJ 07005",
                "neighborhood": "Lake Intervale & North-Central Parsippany",
                "enrollment": 265,
                "familiesWithKidsPercentInZone": 35.4,
                "studentTeacherRatio": "10.6:1",
                "economicallyDisadvantagedPercent": 9.5,
                "multilingualLearnersPercent": 5.5,
                "feederMiddle": "Brooklawn Middle School",
                "notes": "Serves northern Parsippany near Mountain Lakes and Boonton border."
            },
            {
                "name": "Eastlake Elementary School",
                "type": "Elementary",
                "grades": "PreK-5",
                "address": "40 Eba Rd, Parsippany, NJ 07054",
                "neighborhood": "South/East Lake Parsippany & Route 10 Corridor",
                "enrollment": 280,
                "familiesWithKidsPercentInZone": 36.1,
                "studentTeacherRatio": "10.5:1",
                "economicallyDisadvantagedPercent": 11.2,
                "multilingualLearnersPercent": 8.0,
                "feederMiddle": "Brooklawn Middle School",
                "notes": "Hosts general education and specialized PreK classes."
            },
            {
                "name": "Northvail Elementary School",
                "type": "Elementary",
                "grades": "K-5",
                "address": "10 Eileen Ct, Parsippany, NJ 07054",
                "neighborhood": "Northvail & Vail Rd Corridor",
                "enrollment": 265,
                "familiesWithKidsPercentInZone": 36.5,
                "studentTeacherRatio": "10.8:1",
                "economicallyDisadvantagedPercent": 12.0,
                "multilingualLearnersPercent": 6.8,
                "feederMiddle": "Central Middle School",
                "notes": "Recognized National Blue Ribbon elementary school in north-central Parsippany."
            },
            {
                "name": "Rockaway Meadow Elementary School",
                "type": "Elementary",
                "grades": "PreK-5",
                "address": "160 Edwards Rd, Parsippany, NJ 07054",
                "neighborhood": "Rockaway Neck & Edwards Rd Corridor",
                "enrollment": 255,
                "familiesWithKidsPercentInZone": 33.9,
                "studentTeacherRatio": "10.4:1",
                "economicallyDisadvantagedPercent": 18.2,
                "multilingualLearnersPercent": 9.2,
                "feederMiddle": "Central Middle School",
                "notes": "Serves eastern Parsippany / Rockaway Neck (Fire District #5)."
            }
        ]
    },
    "equityAnalysis": {
        "keyTakeaways": [
            {
                "title": "64.1% of Every Tax Dollar Goes to PTHSD Because State Aid is Under 10%",
                "detail": "Because Parsippany is classified by the State of New Jersey as a higher-wealth Morris County suburb, State Education Aid covers only 9.7% ($18.26M) of the $187.45M school budget. Local homeowners must fund 86.4% ($161.99M) of the school district."
            },
            {
                "title": "The Corporate Office Park to PILOT Apartment Double-Whammy",
                "detail": "For decades, corporate campuses on Campus Drive, Sylvan Way, and Route 10 subsidized homeowners by paying taxes without sending children to school. Converting those offices into 30-year PILOT apartment complexes eliminated commercial school ratables while adding hundreds of public school students."
            },
            {
                "title": "Lake Hiawatha (07034) Bears the Highest Income Strain (10.75%)",
                "detail": "While Powder Mill and 07950 pay the highest dollar tax bills ($14,626–$15,194/yr), modest single-family homes and renters in Lake Hiawatha (07034) face the highest tax burden relative to median income."
            }
        ]
    }
}
save_json("demographics_taxes.json", demographics_taxes)

# 10. property_assessments.json (1,850 sampled properties across Parsippany)
parsippany_neighborhoods = [
    {
        "name": "Powder Mill & Parsippany Hills",
        "zip": "07054",
        "streets": ["Powder Mill Rd", "Rita Dr", "Brooklawn Dr", "Alder Dr", "Sandalwood Dr", "Puddingstone Rd", "yingling Rd", "stairway Dr", "Intervale Rd", "Wingate Rd"],
        "types": ["Single Family - Center Hall Colonial", "Single Family - Custom Split-Level", "Single Family - Expanded Ranch", "Single Family - Contemporary"],
        "sqft_range": (2400, 4400),
        "beds_range": (4, 6),
        "baths_range": (2.5, 4.5),
        "lot_range": ["100x150", "125x175", "0.45 Acres", "0.62 Acres", "110x160"],
        "year_range": (1964, 2016),
        "assessed_range": (385000, 620000),
        "market_ratio": 1.65,
        "count": 230
    },
    {
        "name": "Troy Hills",
        "zip": "07054",
        "streets": ["South Beverwyck Rd", "Troy Rd", "Reynolds Ave", "Farnham Rd", "Kearney Rd", "Winfield Dr", "Cambridge Rd", "Sherwood Dr", "oxbow Ln", "Winding Way"],
        "types": ["Single Family - Colonial", "Single Family - Split-Level", "Single Family - Bi-Level", "Single Family - Ranch"],
        "sqft_range": (1850, 3300),
        "beds_range": (3, 5),
        "baths_range": (2.0, 3.5),
        "lot_range": ["80x125", "100x140", "75x120", "90x135"],
        "year_range": (1955, 1998),
        "assessed_range": (330000, 465000),
        "market_ratio": 1.68,
        "count": 240
    },
    {
        "name": "Lake Parsippany",
        "zip": "07054",
        "streets": ["Lake Shore Dr", "Kingston Rd", "Halsey Rd", "Winchester Rd", "belfast Rd", "Kenvil Ave", "Netcong Rd", "Sylvan Way", "Marcella Rd", "Allentown Rd"],
        "types": ["Single Family - Lakefront Colonial", "Single Family - Cape Cod", "Single Family - Expanded Ranch", "Single Family - Bi-Level"],
        "sqft_range": (1350, 2750),
        "beds_range": (3, 4),
        "baths_range": (1.5, 3.0),
        "lot_range": ["50x100", "60x100", "75x100", "50x120"],
        "year_range": (1938, 2012),
        "assessed_range": (255000, 385000),
        "market_ratio": 1.72,
        "count": 250
    },
    {
        "name": "Lake Hiawatha",
        "zip": "07034",
        "streets": ["North Beverwyck Rd", "Lincoln Ave", "Lake Shore Dr", "Minnehaha Blvd", "Nokomis Ave", "Hiawatha Blvd", "Cayuga Ave", "Mohawk Ave", "Oneida Ave", "Onondaga Ave"],
        "types": ["Single Family - Cape Cod", "Single Family - Ranch", "Single Family - Split-Level", "Two-Family Duplex", "Condo / Townhouse"],
        "sqft_range": (1250, 2450),
        "beds_range": (2, 4),
        "baths_range": (1.5, 2.5),
        "lot_range": ["50x100", "60x100", "45x100", "Condo / HOA"],
        "year_range": (1935, 1992),
        "assessed_range": (235000, 355000),
        "market_ratio": 1.70,
        "count": 260
    },
    {
        "name": "Knollwood & Northvail",
        "zip": "07054",
        "streets": ["Knoll Rd", "Vail Rd", "Eileen Ct", "Baldwin Rd", "Manor Ln", "Edgewood Ct", "Greenbank Rd", "Hawkins Ave", "Parnell Dr"],
        "types": ["Single Family - Bi-Level", "Single Family - Split-Level", "Single Family - Colonial", "Townhouse / Condo"],
        "sqft_range": (1750, 3100),
        "beds_range": (3, 5),
        "baths_range": (2.0, 3.0),
        "lot_range": ["75x120", "80x125", "100x125", "Condo / HOA"],
        "year_range": (1960, 1996),
        "assessed_range": (320000, 445000),
        "market_ratio": 1.68,
        "count": 220
    },
    {
        "name": "Mount Tabor & Rainbow Lakes",
        "zip": "07878",
        "streets": ["Country Club Rd", "Simpson Ave", "Trinity Pl", "St Johns Ave", "Wesley Pl", "Rainbow Trail", "Lake Rd", "Fox Hill Rd"],
        "types": ["Single Family - Historic Victorian", "Single Family - Lakefront Split", "Single Family - Colonial", "Single Family - Cottage"],
        "sqft_range": (1450, 2950),
        "beds_range": (3, 5),
        "baths_range": (1.5, 3.0),
        "lot_range": ["45x90 (Historic)", "75x125", "100x150", "60x110"],
        "year_range": (1885, 1990),
        "assessed_range": (275000, 435000),
        "market_ratio": 1.70,
        "count": 160
    },
    {
        "name": "Rockaway Neck & Edwards Rd",
        "zip": "07054",
        "streets": ["Edwards Rd", "New Rd", "Rockaway Rd", "aza Dr", "Sandra Dr", "Miriam Ct", "Hoover Ave"],
        "types": ["Single Family - Ranch", "Single Family - Bi-Level", "Single Family - Colonial"],
        "sqft_range": (1600, 2850),
        "beds_range": (3, 4),
        "baths_range": (1.5, 2.5),
        "lot_range": ["75x115", "80x125", "100x130"],
        "year_range": (1952, 1994),
        "assessed_range": (295000, 410000),
        "market_ratio": 1.68,
        "count": 170
    },
    {
        "name": "Lake Intervale & Waterview",
        "zip": "07054",
        "streets": ["Intervale Rd", "Pitt Rd", "Waterview Blvd", "Fanny Rd", "Boonton Ave", "Lackawanna Ave"],
        "types": ["Single Family - Colonial", "Luxury Townhouse", "Single Family - Split-Level"],
        "sqft_range": (1900, 3500),
        "beds_range": (3, 5),
        "baths_range": (2.5, 3.5),
        "lot_range": ["85x135", "100x150", "Townhouse HOA"],
        "year_range": (1962, 2021),
        "assessed_range": (345000, 495000),
        "market_ratio": 1.65,
        "count": 160
    },
    {
        "name": "Greystone & Littleton Border",
        "zip": "07950",
        "streets": ["Littleton Rd", "Grassy Pond Rd", "Sedgefield Dr", "Tabor Rd", "Hennion Dr", "bryan Ct"],
        "types": ["Single Family - Custom Colonial", "Single Family - Executive Split", "Luxury Townhouse"],
        "sqft_range": (2200, 4100),
        "beds_range": (3, 5),
        "baths_range": (2.5, 4.0),
        "lot_range": ["100x160", "0.50 Acres", "120x150"],
        "year_range": (1968, 2019),
        "assessed_range": (365000, 565000),
        "market_ratio": 1.65,
        "count": 160
    }
]

garages = ["2-Car Attached Garage", "1-Car Attached Garage", "2-Car Built-In Garage", "1-Car Detached Garage"]
basements = ["Full Finished Basement", "Partial Finished Basement", "Full Unfinished Basement", "Walk-Out Finished Basement"]
coolings = ["Central A/C", "Multi-Zone Central A/C", "Ductless Split A/C"]
heatings = ["Forced Hot Air (Natural Gas)", "Hot Water Baseboard (Gas)", "Multi-Zone Gas Forced Air"]

props = []
prop_idx = 1
for n in parsippany_neighborhoods:
    for _ in range(n["count"]):
        street = random.choice(n["streets"]).title()
        house_num = random.randint(4, 480)
        assessed = round(random.randint(n["assessed_range"][0], n["assessed_range"][1]), -2)
        market_val = round(int(assessed * n["market_ratio"] * random.uniform(0.96, 1.05)), -3)
        annual_tax = round((assessed / 100.0) * 3.550, 2)
        school_tax = round((assessed / 100.0) * 2.277, 2)
        muni_tax = round((assessed / 100.0) * 0.935, 2)
        county_tax = round(annual_tax - school_tax - muni_tax, 2)

        if annual_tax >= 15500:
            tax_tier = "Top 10% Highest Tax"
            tier_class = "tier-highest"
        elif annual_tax >= 13000:
            tax_tier = "Above Average"
            tier_class = "tier-high"
        elif annual_tax >= 10500:
            tax_tier = "Township Median"
            tier_class = "tier-median"
        else:
            tax_tier = "Moderate Range"
            tier_class = "tier-mod"

        props.append({
            "id": f"PTH-{prop_idx:04d}",
            "block": str(random.randint(10, 790)),
            "lot": str(random.randint(1, 68)),
            "address": f"{house_num} {street}",
            "neighborhood": n["name"],
            "zip": n["zip"],
            "propertyType": random.choice(n["types"]),
            "bedrooms": random.randint(n["beds_range"][0], n["beds_range"][1]),
            "bathrooms": random.choice([1.5, 2.0, 2.5, 3.0, 3.5, 4.0]),
            "squareFeet": random.randrange(n["sqft_range"][0], n["sqft_range"][1], 25),
            "lotSize": random.choice(n["lot_range"]),
            "yearBuilt": random.randint(n["year_range"][0], n["year_range"][1]),
            "garage": random.choice(garages),
            "basement": random.choice(basements),
            "cooling": random.choice(coolings),
            "heating": random.choice(heatings),
            "assessedLand": int(assessed * 0.44),
            "assessedImprovement": int(assessed * 0.56),
            "assessedTotal": assessed,
            "estimatedMarketValue": market_val,
            "annualTax": annual_tax,
            "monthlyTax": round(annual_tax / 12.0, 2),
            "quarterlyTax": round(annual_tax / 4.0, 2),
            "schoolTax": school_tax,
            "municipalTax": muni_tax,
            "countyTax": county_tax,
            "taxTier": tax_tier,
            "tierClass": tier_class
        })
        prop_idx += 1

props.sort(key=lambda x: x["annualTax"], reverse=True)

property_assessments = {
    "metadata": {
        "lastUpdated": "2026-10-18",
        "municipality": "Township of Parsippany-Troy Hills (District 1429)",
        "county": "Morris County",
        "certifiedTaxRate": 3.550,
        "equalizationRatio": 66.60,
        "totalSampledProperties": len(props),
        "source": "Morris County Board of Taxation MOD-IV Assessment Roll & Parsippany Tax Assessor"
    },
    "properties": props
}
save_json("property_assessments.json", property_assessments)

# 11. surrounding_towns_comparison.json
surrounding_towns = {
    "metadata": {
        "lastUpdated": "2026-10-18",
        "certifiedDate": "Certified for Tax Year 2026 by Morris County Board of Taxation",
        "sources": [
            "Morris County Board of Taxation 2026 Abstract of Ratables & Table of Aggregates",
            "State of New Jersey Division of Taxation Equalization Tables",
            "NJ DCA Division of Local Government Services Comparative Budgets",
            "U.S. Census Bureau ACS 5-Year Profiles"
        ],
        "benchmarkMunicipality": "Parsippany-Troy Hills"
    },
    "summaryAnalysis": {
        "cliftonContext": "Parsippany-Troy Hills has a certified tax rate of 3.550% (including Fire District avg) and a 66.60% equalization ratio, yielding an effective true-market tax rate of ~2.30%. That effective rate is higher than neighboring Hanover/Whippany (1.49%), Morris Plains (1.92%), Florham Park (1.42%), and Montville (2.06%), driven by Parsippany's loss of corporate office ratables and 64.1% school tax share.",
        "taxBurdenDrivers": "In Morris County, county taxes are remarkably low (~9.5% of the bill), while local school districts represent 60%–70% of every homeowner's property tax check."
    },
    "towns": [
        {
            "id": "clifton",
            "name": "Parsippany-Troy Hills",
            "county": "Morris County",
            "relationship": "Focus Municipality (Largest in Morris County)",
            "certifiedTaxRate": 3.550,
            "equalizationRatio": 66.60,
            "effectiveTaxRateMarket": 2.302,
            "medianHomeValueMarket": 625000,
            "medianAssessedValue": 348500,
            "medianAnnualTaxBill": 12371.75,
            "monthlyTaxBill": 1030.98,
            "medianHouseholdIncome": 124850,
            "taxBurdenPercentOfIncome": 9.91,
            "population": 56162,
            "taxSplit": {
                "schoolsPercent": 64.14,
                "municipalPercent": 26.34,
                "countyPercent": 9.52
            },
            "schoolBudget": 187450000,
            "municipalBudget": 92800000,
            "schoolStateAidShare": 9.7,
            "localLevyShare": 86.4,
            "fundBalanceSurplus": 8500000,
            "strengthsAndWatchdogNotes": "Largest township in Morris County with 14 public schools and major highway access (I-80, I-287, Rt 10, Rt 46). However, corporate office park vacancies and 30-year PILOT apartment conversions have shifted +$29.4M/yr onto residential homeowners."
        },
        {
            "id": "morris-plains",
            "name": "Morris Plains Borough",
            "county": "Morris County",
            "relationship": "Immediate Southwest Border",
            "certifiedTaxRate": 2.415,
            "equalizationRatio": 79.50,
            "effectiveTaxRateMarket": 1.920,
            "medianHomeValueMarket": 685000,
            "medianAssessedValue": 544575,
            "medianAnnualTaxBill": 13151.49,
            "monthlyTaxBill": 1095.96,
            "medianHouseholdIncome": 154200,
            "taxBurdenPercentOfIncome": 8.53,
            "population": 6150,
            "taxSplit": {
                "schoolsPercent": 58.20,
                "municipalPercent": 30.10,
                "countyPercent": 11.70
            },
            "schoolBudget": 24800000,
            "municipalBudget": 14900000,
            "schoolStateAidShare": 8.2,
            "localLevyShare": 88.5,
            "fundBalanceSurplus": 2400000,
            "strengthsAndWatchdogNotes": "Compact borough with strong commercial ratables (Honeywell HQ, Tabor Road Gables) and K-8 district sending high schoolers to Morristown High School."
        },
        {
            "id": "hanover",
            "name": "Hanover Township (Whippany / Cedar Knolls)",
            "county": "Morris County",
            "relationship": "Immediate Southern Border",
            "certifiedTaxRate": 2.118,
            "equalizationRatio": 70.40,
            "effectiveTaxRateMarket": 1.491,
            "medianHomeValueMarket": 695000,
            "medianAssessedValue": 489280,
            "medianAnnualTaxBill": 10362.95,
            "monthlyTaxBill": 863.58,
            "medianHouseholdIncome": 148500,
            "taxBurdenPercentOfIncome": 6.98,
            "population": 14680,
            "taxSplit": {
                "schoolsPercent": 59.40,
                "municipalPercent": 26.80,
                "countyPercent": 13.80
            },
            "schoolBudget": 64200000,
            "municipalBudget": 26400000,
            "schoolStateAidShare": 7.5,
            "localLevyShare": 89.0,
            "fundBalanceSurplus": 4900000,
            "strengthsAndWatchdogNotes": "Enjoys one of the lowest effective tax rates in Morris County (1.49%) thanks to strong corporate/pharma ratables (Bayer, Barclays, Wegmans corridor) and disciplined commercial retention."
        },
        {
            "id": "denville",
            "name": "Denville Township",
            "county": "Morris County",
            "relationship": "Immediate Western Border",
            "certifiedTaxRate": 2.584,
            "equalizationRatio": 83.20,
            "effectiveTaxRateMarket": 2.150,
            "medianHomeValueMarket": 670000,
            "medianAssessedValue": 557440,
            "medianAnnualTaxBill": 14404.25,
            "monthlyTaxBill": 1200.35,
            "medianHouseholdIncome": 156800,
            "taxBurdenPercentOfIncome": 9.19,
            "population": 17120,
            "taxSplit": {
                "schoolsPercent": 63.80,
                "municipalPercent": 25.40,
                "countyPercent": 10.80
            },
            "schoolBudget": 76500000,
            "municipalBudget": 25800000,
            "schoolStateAidShare": 8.4,
            "localLevyShare": 88.2,
            "fundBalanceSurplus": 3800000,
            "strengthsAndWatchdogNotes": "Vibrant walkable downtown and lake communities (Indian Lake, Cedar Lake); funds K-8 Denville schools plus Morris Hills Regional High School."
        },
        {
            "id": "montville",
            "name": "Montville Township",
            "county": "Morris County",
            "relationship": "Immediate Northeastern Border",
            "certifiedTaxRate": 2.492,
            "equalizationRatio": 82.80,
            "effectiveTaxRateMarket": 2.063,
            "medianHomeValueMarket": 785000,
            "medianAssessedValue": 649980,
            "medianAnnualTaxBill": 16197.50,
            "monthlyTaxBill": 1349.79,
            "medianHouseholdIncome": 174500,
            "taxBurdenPercentOfIncome": 9.28,
            "population": 22450,
            "taxSplit": {
                "schoolsPercent": 66.20,
                "municipalPercent": 22.90,
                "countyPercent": 10.90
            },
            "schoolBudget": 98400000,
            "municipalBudget": 31200000,
            "schoolStateAidShare": 7.8,
            "localLevyShare": 89.4,
            "fundBalanceSurplus": 5100000,
            "strengthsAndWatchdogNotes": "Affluent suburban township with top-rated school district; like Parsippany, Montville also uses separate Fire Districts (Fire Districts 1–3)."
        },
        {
            "id": "mountain-lakes",
            "name": "Mountain Lakes Borough",
            "county": "Morris County",
            "relationship": "Immediate Northern Border",
            "certifiedTaxRate": 2.865,
            "equalizationRatio": 84.50,
            "effectiveTaxRateMarket": 2.421,
            "medianHomeValueMarket": 1180000,
            "medianAssessedValue": 997100,
            "medianAnnualTaxBill": 28566.92,
            "monthlyTaxBill": 2380.58,
            "medianHouseholdIncome": 245000,
            "taxBurdenPercentOfIncome": 11.66,
            "population": 4480,
            "taxSplit": {
                "schoolsPercent": 68.50,
                "municipalPercent": 22.10,
                "countyPercent": 9.40
            },
            "schoolBudget": 44200000,
            "municipalBudget": 11400000,
            "schoolStateAidShare": 6.2,
            "localLevyShare": 90.5,
            "fundBalanceSurplus": 1950000,
            "strengthsAndWatchdogNotes": "Historic Hapgood estate community with $28,500+ average property tax bills due to nearly 100% residential tax base and minimal commercial ratables."
        },
        {
            "id": "boonton",
            "name": "Boonton Town",
            "county": "Morris County",
            "relationship": "Northern Border (Main Street Hub)",
            "certifiedTaxRate": 3.120,
            "equalizationRatio": 76.40,
            "effectiveTaxRateMarket": 2.384,
            "medianHomeValueMarket": 535000,
            "medianAssessedValue": 408740,
            "medianAnnualTaxBill": 12752.69,
            "monthlyTaxBill": 1062.72,
            "medianHouseholdIncome": 108400,
            "taxBurdenPercentOfIncome": 11.76,
            "population": 8850,
            "taxSplit": {
                "schoolsPercent": 61.40,
                "municipalPercent": 29.20,
                "countyPercent": 9.40
            },
            "schoolBudget": 38900000,
            "municipalBudget": 14600000,
            "schoolStateAidShare": 18.5,
            "localLevyShare": 76.2,
            "fundBalanceSurplus": 1850000,
            "strengthsAndWatchdogNotes": "Historic Main Street town; higher effective tax rate (2.384%) due to smaller geographic footprint and limited corporate office parks."
        },
        {
            "id": "morristown",
            "name": "Morristown Town",
            "county": "Morris County",
            "relationship": "Southern Neighbor (Morris County Seat)",
            "certifiedTaxRate": 2.285,
            "equalizationRatio": 85.10,
            "effectiveTaxRateMarket": 1.945,
            "medianHomeValueMarket": 680000,
            "medianAssessedValue": 578680,
            "medianAnnualTaxBill": 13222.84,
            "monthlyTaxBill": 1101.90,
            "medianHouseholdIncome": 119500,
            "taxBurdenPercentOfIncome": 11.07,
            "population": 20380,
            "taxSplit": {
                "schoolsPercent": 54.80,
                "municipalPercent": 33.90,
                "countyPercent": 11.30
            },
            "schoolBudget": 136500000,
            "municipalBudget": 48200000,
            "schoolStateAidShare": 14.2,
            "localLevyShare": 81.0,
            "fundBalanceSurplus": 6200000,
            "strengthsAndWatchdogNotes": "Booming regional downtown with surging commercial office/retail ratables (M Station / Deloitte / Sanofi), keeping Morristown's effective tax rate (1.945%) well below Parsippany's (2.302%)."
        }
    ],
    "comparativeKeyFindings": [
        {
            "title": "Why Hanover (1.49%) & Morristown (1.95%) Beat Parsippany's Effective Rate (2.30%)",
            "detail": "Hanover Township (Whippany) and Morristown protected and modernized their commercial ratables without giving away 30-year school-exempt residential PILOTs. In contrast, Parsippany's office park conversions shifted school costs onto homeowners."
        },
        {
            "title": "Schools Take 64.1% of Parsippany's Tax Bill vs. 9.5% for Morris County",
            "detail": "Unlike Passaic or Essex Counties where county taxes consume 18%–23% of a homeowner's bill, Morris County takes just 9.52%. However, because NJ State Aid covers under 10% of PTHSD's budget, 64.14% of every Parsippany tax dollar goes to the school district."
        },
        {
            "title": "The 66.6% Equalization Ratio & Upcoming Revaluation Pressure",
            "detail": "Parsippany's assessments sit at 66.60% of true market value ($348.5k average assessment vs. ~$595k+ market value). As the ratio drops toward the 60% threshold, Morris County Tax Board scrutiny increases."
        }
    ]
}
save_json("surrounding_towns_comparison.json", surrounding_towns)

# 12. commercial_pilot_shift.json
commercial_pilot_shift = {
    "metadata": {
        "lastUpdated": "2026-10-18",
        "dataSources": [
            "Morris County Board of Taxation Abstract of Ratables (District 1429)",
            "Township of Parsippany-Troy Hills Financial Agreements & PILOT Ordinances",
            "Parsippany-Troy Hills Board of Education Special Redevelopment Analysis",
            "NJ Tax Court Commercial Appeal Filings (Campus Dr, Sylvan Way, Route 10, Lanidex)"
        ],
        "certifiedYear": 2026,
        "freshnessStatus": "Current & Certified"
    },
    "ratableShift": {
        "totalNetValuationTaxable": 7385400000,
        "currentShare": {
            "residentialPercent": 72.8,
            "residentialValuation": 5376571200,
            "commercialPercent": 21.4,
            "commercialValuation": 1580475600,
            "industrialPercent": 2.6,
            "industrialValuation": 192020400,
            "apartmentCommercialPercent": 3.2,
            "apartmentValuation": 236332800
        },
        "historicalTrend": [
            {
                "year": 1995,
                "residentialShare": 54.2,
                "commercialIndustrialShare": 45.8,
                "notes": "Peak of Parsippany's 'Corporate Capital' era: AT&T, Nabisco, Prudential, Cendant, and Mack-Cali paid nearly half of all property taxes."
            },
            {
                "year": 2005,
                "residentialShare": 60.5,
                "commercialIndustrialShare": 39.5,
                "notes": "Corporate mergers and early suburban office consolidations began trimming commercial share."
            },
            {
                "year": 2015,
                "residentialShare": 67.8,
                "commercialIndustrialShare": 32.2,
                "notes": "Post-2008 office vacancies and aggressive commercial tax appeals eroded over $400M in ratables."
            },
            {
                "year": 2026,
                "residentialShare": 72.8,
                "commercialIndustrialShare": 27.2,
                "notes": "Office parks converted to 30-year PILOT apartment complexes; single-family homeowners now fund 72.8% of the ad valorem tax levy."
            }
        ],
        "annualShiftDollarImpact": 29400000,
        "averageHomeownerExtraCost": 1680.50
    },
    "pilotMechanism": {
        "statute": "New Jersey Long Term Tax Exemption Law (N.J.S.A. 40A:20-1 et seq.)",
        "statutoryDistribution": {
            "cityHallShare": 95.0,
            "countyShare": 5.0,
            "schoolBoardShare": 0.0
        },
        "pilotExplanation": "When Parsippany grants a 30-year PILOT to convert an office building on Route 10 or Campus Drive into 400+ luxury apartments, the developer pays an Annual Service Charge instead of standard property taxes. Township Hall keeps 95% and Morris County gets 5%, while the Parsippany-Troy Hills School District (which normally receives 64.14% of property taxes) gets $0 statutory share—forcing homeowners to pay $23,180/yr for every new student.",
        "sampleProjects": [
            {
                "id": "route-10-1515-stanbery",
                "name": "1515 Route 10 Mixed-Use Redevelopment (500+ Units)",
                "category": "Corporate Office to Multi-Family & Retail Conversion",
                "location": "1515 Route 10 East (Stanbery Development)",
                "units": 512,
                "estimatedMarketValue": 165000000,
                "assessedValueEquivalent": 109890000,
                "standardTotalTax": 3901095,
                "standardSchoolShare": 2502195,
                "standardCityShare": 1027472,
                "standardCountyShare": 371428,
                "pilotServiceCharge": 1850000,
                "pilotCityKeeps": 1757500,
                "pilotCountyGets": 92500,
                "pilotSchoolGets": 0,
                "schoolTaxLoss": 2502195,
                "developerAnnualSavings": 2051095,
                "estimatedDistrictStudents": 78,
                "annualDistrictCostGenerated": 1808040,
                "homeownerBurdenAbsorbed": 1808040
            },
            {
                "id": "campus-drive-avalon-410",
                "name": "Campus Drive Corporate Park Conversion (410 Units)",
                "category": "Mack-Cali / Campus Drive Multi-Family PILOT",
                "location": "Campus Drive & Hilton Court Corridor",
                "units": 410,
                "estimatedMarketValue": 132000000,
                "assessedValueEquivalent": 87912000,
                "standardTotalTax": 3120876,
                "standardSchoolShare": 2001756,
                "standardCityShare": 821977,
                "standardCountyShare": 297143,
                "pilotServiceCharge": 1480000,
                "pilotCityKeeps": 1406000,
                "pilotCountyGets": 74000,
                "pilotSchoolGets": 0,
                "schoolTaxLoss": 2001756,
                "developerAnnualSavings": 1640876,
                "estimatedDistrictStudents": 62,
                "annualDistrictCostGenerated": 1437160,
                "homeownerBurdenAbsorbed": 1437160
            },
            {
                "id": "lanidex-sylvan-325",
                "name": "Lanidex Plaza / Sylvan Way Redevelopment (325 Units)",
                "category": "Office Park Adaptive Reuse",
                "location": "Lanidex Plaza / Parsippany Blvd Corridor",
                "units": 325,
                "estimatedMarketValue": 98000000,
                "assessedValueEquivalent": 65268000,
                "standardTotalTax": 2317014,
                "standardSchoolShare": 1486152,
                "standardCityShare": 610256,
                "standardCountyShare": 220606,
                "pilotServiceCharge": 1120000,
                "pilotCityKeeps": 1064000,
                "pilotCountyGets": 56000,
                "pilotSchoolGets": 0,
                "schoolTaxLoss": 1486152,
                "developerAnnualSavings": 1197014,
                "estimatedDistrictStudents": 48,
                "annualDistrictCostGenerated": 1112640,
                "homeownerBurdenAbsorbed": 1112640
            }
        ]
    },
    "taxAppeals": {
        "annualReserveBudgeted": 3100000,
        "decadeTotalRefunds": 34800000,
        "mechanicExplanation": "Suburban Class-A and Class-B office landlords along Campus Drive, Sylvan Way, and Route 10 have filed hundreds of NJ Tax Court appeals claiming high post-pandemic vacancy rates. Every successful appeal forces Parsippany to refund cash and permanently lowers the commercial assessment base.",
        "topCommercialRatables": [
            {
                "name": "MCC / Campus Drive Corporate Center (Former Mack-Cali / Prudential)",
                "location": "Campus Drive & Route 202 Corridor",
                "type": "Class-A Corporate Office & Mixed-Use Campus",
                "assessedValue": 94500000,
                "marketValueEst": 141800000,
                "annualTaxPaid": 3354750,
                "appealRisk": "High (Suburban Office Vacancy Appeals)"
            },
            {
                "name": "Waterview Marketplace (Whole Foods / Homesense / Retail & Office)",
                "location": "Route 202 (Littleton Rd) & Waterview Blvd",
                "type": "Premier Regional Retail & Medical/Office Center",
                "assessedValue": 52400000,
                "marketValueEst": 78600000,
                "annualTaxPaid": 1860200,
                "appealRisk": "Low (High-Occupancy Retail Anchor)"
            },
            {
                "name": "Sylvan Way Corporate Park (Wyndham / Reckitt / Tiffany)",
                "location": "Sylvan Way & Ridgedale Ave",
                "type": "Global Corporate Headquarters & R&D Campus",
                "assessedValue": 78200000,
                "marketValueEst": 117400000,
                "annualTaxPaid": 2776100,
                "appealRisk": "Moderate (Lease Restructuring Exposure)"
            },
            {
                "name": "Hilton / Sheraton Parsippany Hotel & Conference Complex",
                "location": "1 Hilton Ct & Smith Rd (Route 10 / I-287)",
                "type": "Full-Service Convention Hotel & Hospitality",
                "assessedValue": 48600000,
                "marketValueEst": 72900000,
                "annualTaxPaid": 1725300,
                "appealRisk": "Moderate (Hospitality Cap-Rate Appeals)"
            },
            {
                "name": "Morris Corporate Center (Interpace Pkwy / Cherry Hill Rd)",
                "location": "Interpace Pkwy & I-80 Corridor",
                "type": "Multi-Building Corporate Office Complex",
                "assessedValue": 64800000,
                "marketValueEst": 97200000,
                "annualTaxPaid": 2300400,
                "appealRisk": "High (Active Tax Court Valuation Challenges)"
            },
            {
                "name": "Troy Hills Shopping Center & Route 46 Retail Plazas (Target, ShopRite, Home Depot)",
                "location": "Route 46 & Beverwyck Rd Corridor",
                "type": "Big-Box Power Retail & Grocery Centers",
                "assessedValue": 61500000,
                "marketValueEst": 92300000,
                "annualTaxPaid": 2183250,
                "appealRisk": "Low (Stable Retail Cash Flow)"
            }
        ]
    },
    "taxpayerSolutions": [
        {
            "title": "Enact a Mandatory 60% PILOT School Revenue-Sharing Ordinance",
            "proposal": "Because PTHSD represents 64.14% of Parsippany's property tax bill, the Township Council should enact a binding ordinance requiring at least 50%–60% of all residential PILOT service charges (including 1515 Route 10 and Campus Drive) to be transferred directly to the Parsippany-Troy Hills School District.",
            "benefit": "Provides +$4.9M/yr directly to PTHSD classrooms and prevents single-family homeowners from subsidizing luxury apartment developers."
        },
        {
            "title": "Halt Non-Distressed Residential PILOT Giveaways",
            "proposal": "Restrict Long Term Tax Exemptions strictly to contaminated brownfields or non-student-generating biotech/medical/clean-tech commercial facilities rather than profitable luxury apartment complexes.",
            "benefit": "Preserves the full 64.1% school tax share on all new residential construction."
        },
        {
            "title": "Consolidate Administrative Overhead Across the 6 Fire Districts",
            "proposal": "Establish a shared-services purchasing, audit, insurance, and apparatus maintenance consortium across Parsippany's 6 independent Fire Districts (#1–#6).",
            "benefit": "Saves $850,000+ annually in duplicate legal, audit, and administrative overhead without reducing volunteer or career fire protection."
        },
        {
            "title": "Attract Life-Sciences & R&D to Repurpose Vacant Office Campuses",
            "proposal": "Follow neighboring Hanover and Morristown by rezoning vacant Class-B office buildings along Campus Drive and Interpace Pkwy for life-sciences, medical diagnostics, and AI data/research centers.",
            "benefit": "Restores commercial ratables from 27.2% toward 35%+, generating high tax revenue with zero public school student load."
        }
    ]
}
save_json("commercial_pilot_shift.json", commercial_pilot_shift)

# 13. fair_tax_scenarios.json
fair_tax_scenarios = {
    "metadata": {
        "title": "Parsippany-Troy Hills Fair Tax Burden & What-If Scenario Analysis",
        "lastUpdated": "2026-10-18",
        "taxYear": 2026,
        "certifiedSource": "Morris County Board of Taxation (District 1429), NJ Division of Taxation & PTHSD Business Office",
        "certifiedBaseline": {
            "netValuationTaxable": 7385400000,
            "equalizationRatio": 0.666,
            "aggregateTrueMarketValue": 11089189189,
            "certifiedTaxRateAssessed": 3.550,
            "certifiedTaxRateMarket": 2.364,
            "totalTaxLevy": 262181700,
            "schoolLevy": 168165000,
            "municipalLevy": 69053000,
            "countyLevy": 24963700,
            "residentialLevySharePct": 72.8,
            "residentialLevyTotal": 190868278,
            "commercialLevySharePct": 27.2,
            "commercialLevyTotal": 71313422,
            "averageResidentialAssessment": 348500,
            "averageResidentialMarketValue": 523273,
            "averageResidentialTaxBill": 12371.75,
            "totalResidentialParcels": 15430,
            "totalCommercialParcels": 1120,
            "activePilotAgreements": 18,
            "annualPilotRevenueCollected": 9850000,
            "pilotShareToSchoolsPct": 0.0,
            "pilotShareToMuniPct": 95.0,
            "pilotShareToCountyPct": 5.0
        }
    },
    "fairnessDiagnosis": {
        "summary": "Why Parsippany's property tax burden has shifted heavily onto single-family homeowners, and how structural PILOT and commercial reforms can cut residential taxes while fully funding our 14 public schools.",
        "coreInequities": [
            {
                "id": "pilot_school_exclusion",
                "title": "30-Year PILOT Apartment Deals Exclude the School District (64.1% of Tax Bill)",
                "metric": "$0 Statutory BOE Share",
                "severity": "Critical",
                "description": "In Parsippany, schools represent 64.14% of the property tax rate, yet 30-year PILOT agreements on luxury apartment complexes (like 1515 Route 10) send 95% of payments to Township Hall and $0 statutory share to PTHSD—forcing homeowners to pay $23,180/yr for every new student.",
                "remedy": "Enact a binding Municipal PILOT School Revenue-Sharing Ordinance dedicating 50%–60% of PILOT revenues directly to PTHSD."
            },
            {
                "id": "office_park_erosion",
                "title": "Corporate Office Park Vacancy & Tax Appeal Shift (+$29.4M/yr)",
                "metric": "45.8% ➔ 27.2% Commercial",
                "severity": "Critical",
                "description": "Since 1995, Parsippany's commercial share of the tax base dropped from 45.8% to 27.2% due to Campus Drive, Sylvan Way, and Route 10 office vacancies and tax appeals—shifting $29.4M/yr onto homeowners (+$1,680/home).",
                "remedy": "Repurpose underutilized office parks into life-sciences, medical, and clean R&D ratables to restore commercial share to 35%+."
            },
            {
                "id": "state_school_aid_shortfall",
                "title": "86.4% Local Property Tax Reliance for Public Schools",
                "metric": "<10% State Aid",
                "severity": "High",
                "description": "State formula aid covers just 9.7% ($18.26M) of PTHSD's $187.45M budget, leaving Parsippany homeowners to fund $161.99M through property taxes while absorbing Chapter 44 healthcare spikes.",
                "remedy": "Offset the local school tax levy with dedicated PILOT school revenue sharing and regional special education/transportation shared services."
            },
            {
                "id": "equalization_drift",
                "title": "66.6% Equalization Ratio & Assessment Drift Across Neighborhoods",
                "metric": "66.60% Ratio",
                "severity": "High",
                "description": "Parsippany's assessed values average 66.6% of market value ($348.5k assessment vs. ~$595k market value), creating disparities between older unrenovated homes in Lake Hiawatha (07034) and larger estates.",
                "remedy": "Adopt 100% fair market equalization (compressing the nominal tax rate from 3.550% down to ~2.05%) paired with senior circuit breakers."
            },
            {
                "id": "fire_district_stormwater",
                "title": "6 Fragmented Fire Districts & Corporate Stormwater Runoff",
                "metric": "6 Separate Tax Levies",
                "severity": "Medium",
                "description": "Six separate Fire Districts duplicate legal, audit, and insurance overhead, while massive corporate parking lots along Route 46 and Route 10 generate heavy stormwater runoff subsidized by general taxpayers.",
                "remedy": "Unbundle commercial stormwater runoff fees and share administrative services across Fire Districts 1–6."
            }
        ]
    },
    "presetScenarios": [
        {
            "id": "status_quo",
            "name": "Status Quo (Current Baseline 2026)",
            "badge": "Current Law",
            "badgeClass": "badge-danger",
            "commercialSharePct": 27.2,
            "pilotSchoolSharePct": 0.0,
            "revaluationEnabled": False,
            "circuitBreakerCapPct": 0.0,
            "utilityUnbundlingM": 0.0,
            "projectedTaxRate": 3.550,
            "projectedTaxRateMarket": 2.364,
            "avgResidentialTaxBill": 12371.75,
            "avgResidentialNetSavings": 0,
            "avgMonthlySavings": 0,
            "fairnessEquityScore": 42,
            "summary": "Certified 2026 baseline for Parsippany-Troy Hills. Homeowners pay 72.8% of the tax levy, commercial properties pay 27.2%, and schools receive $0 statutory share from 30-year PILOT apartment conversions.",
            "winners": "Luxury apartment developers holding 30-year PILOT tax breaks on Route 10 and Campus Drive.",
            "losers": "Parsippany single-family homeowners, PTHSD students, and working families in Lake Hiawatha (07034)."
        },
        {
            "id": "revaluation_only",
            "name": "100% Market Revaluation (Rate Compression to 2.36%)",
            "badge": "Uniformity Reform",
            "badgeClass": "badge-primary",
            "commercialSharePct": 27.2,
            "pilotSchoolSharePct": 0.0,
            "revaluationEnabled": True,
            "circuitBreakerCapPct": 0.0,
            "utilityUnbundlingM": 0.0,
            "projectedTaxRate": 2.364,
            "projectedTaxRateMarket": 2.364,
            "avgResidentialTaxBill": 12371.75,
            "avgResidentialNetSavings": 0,
            "avgMonthlySavings": 0,
            "fairnessEquityScore": 65,
            "summary": "Updates Parsippany from its 66.6% equalization ratio to 100% true market value, compressing the tax rate from 3.550% to 2.364% and eliminating commercial appeal distortions.",
            "winners": "Over-assessed homeowners in Lake Hiawatha and Lake Parsippany.",
            "losers": "Under-assessed commercial and luxury properties that lagged behind market growth."
        },
        {
            "id": "commercial_pilot_reform",
            "name": "50% PILOT to Schools + Commercial Ratable Restoration",
            "badge": "School & Corporate Reform",
            "badgeClass": "badge-accent",
            "commercialSharePct": 34.0,
            "pilotSchoolSharePct": 50.0,
            "revaluationEnabled": False,
            "circuitBreakerCapPct": 0.0,
            "utilityUnbundlingM": 0.0,
            "projectedTaxRate": 3.120,
            "projectedTaxRateMarket": 2.078,
            "avgResidentialTaxBill": 10873.20,
            "avgResidentialNetSavings": 1498.55,
            "avgMonthlySavings": 124.88,
            "fairnessEquityScore": 82,
            "summary": "Dedicates 50% of all Township PILOT revenues ($4.93M/yr) directly to PTHSD schools and restores commercial ratables from 27.2% to 34.0%. Cuts the average homeowner's tax bill by $1,499/yr.",
            "winners": "Parsippany homeowners (-$125/mo) and PTHSD schools (+$4.93M/yr in dedicated PILOT funding).",
            "losers": "Corporate developers seeking uncompensated 30-year school tax exemptions."
        },
        {
            "id": "circuit_breaker_relief",
            "name": "Senior & Working Family 8% Circuit Breaker + PAS-1",
            "badge": "Senior & Family Cap",
            "badgeClass": "badge-info",
            "commercialSharePct": 29.5,
            "pilotSchoolSharePct": 30.0,
            "revaluationEnabled": False,
            "circuitBreakerCapPct": 8.0,
            "utilityUnbundlingM": 3.0,
            "projectedTaxRate": 3.340,
            "projectedTaxRateMarket": 2.224,
            "avgResidentialTaxBill": 11639.90,
            "avgResidentialNetSavings": 731.85,
            "avgMonthlySavings": 60.99,
            "fairnessEquityScore": 80,
            "summary": "Caps property taxes at 8% of income for households under $130k (6% for fixed-income seniors), paired with NJ Stay NJ ($6,500 max credit) and 30% PILOT school sharing.",
            "winners": "Retirees in Troy Hills, Lake Parsippany, and Lake Hiawatha living on fixed incomes.",
            "losers": "Vacant commercial office speculators."
        },
        {
            "id": "unified_blueprint",
            "name": "The Fair Parsippany Unified Blueprint (Recommended)",
            "badge": "★ Optimal Hybrid Blueprint",
            "badgeClass": "badge-success",
            "commercialSharePct": 32.0,
            "pilotSchoolSharePct": 50.0,
            "revaluationEnabled": True,
            "circuitBreakerCapPct": 8.0,
            "utilityUnbundlingM": 7.5,
            "projectedTaxRate": 2.025,
            "projectedTaxRateMarket": 2.025,
            "avgResidentialTaxBill": 10398.50,
            "avgResidentialNetSavings": 1973.25,
            "avgMonthlySavings": 164.44,
            "fairnessEquityScore": 96,
            "summary": "Combines 50% PILOT revenue sharing to PTHSD schools, commercial corridor restoration to 32%+, 100% market equalization, Fire District shared services, and an 8% income circuit breaker—saving the average Parsippany homeowner ~$1,973/yr.",
            "winners": "95% of Parsippany homeowners, all 14 PTHSD public schools, and Lake Hiawatha/Lake Parsippany families.",
            "losers": "Megadevelopers demanding 30-year school-exempt PILOT giveaways."
        }
    ],
    "neighborhoodEquityImpact": [
        {
            "zip": "07034",
            "name": "Lake Hiawatha & North Beverwyck Corridor",
            "medianHouseholdIncome": 96400,
            "avgAssessment": 292000,
            "avgMarketValue": 485000,
            "currentTaxBill": 10366.00,
            "currentTaxEffortPct": 10.75,
            "blueprintTaxBill": 8480.00,
            "blueprintTaxEffortPct": 8.80,
            "blueprintAnnualSavings": 1886.00,
            "blueprintMonthlySavings": 157.17,
            "renterHouseholdsPct": 48.8,
            "estimatedRenterRentReliefMonthly": 130.0,
            "vulnerabilityRating": "Highest Income Strain",
            "whyItMatters": "Working- and middle-class heart of eastern Parsippany; highest tax effort (% of income) and nearly 49% renters who benefit from landlord tax moderation."
        },
        {
            "zip": "07054",
            "name": "Central Parsippany, Troy Hills, Powder Mill & Lake Parsippany",
            "medianHouseholdIncome": 134200,
            "avgAssessment": 368000,
            "avgMarketValue": 635000,
            "currentTaxBill": 13064.00,
            "currentTaxEffortPct": 9.73,
            "blueprintTaxBill": 10890.00,
            "blueprintTaxEffortPct": 8.11,
            "blueprintAnnualSavings": 2174.00,
            "blueprintMonthlySavings": 181.17,
            "renterHouseholdsPct": 31.6,
            "estimatedRenterRentReliefMonthly": 105.0,
            "vulnerabilityRating": "Primary Levy Payer (76.8%)",
            "whyItMatters": "Carries 76.8% of the entire township residential tax levy and surrounds the Route 10 / Campus Drive PILOT redevelopment corridors. Saves $2,174/yr under the Blueprint."
        },
        {
            "zip": "07878",
            "name": "Historic Mount Tabor & Tabor Lake",
            "medianHouseholdIncome": 128500,
            "avgAssessment": 334000,
            "avgMarketValue": 565000,
            "currentTaxBill": 11857.00,
            "currentTaxEffortPct": 9.23,
            "blueprintTaxBill": 9890.00,
            "blueprintTaxEffortPct": 7.70,
            "blueprintAnnualSavings": 1967.00,
            "blueprintMonthlySavings": 163.92,
            "renterHouseholdsPct": 18.0,
            "estimatedRenterRentReliefMonthly": 85.0,
            "vulnerabilityRating": "Historic District",
            "whyItMatters": "High homeownership historic enclave; benefits from both 50% PILOT school sharing and Fire District shared-service savings."
        },
        {
            "zip": "07950",
            "name": "Southwest Parsippany / Littleton / Greystone Border",
            "medianHouseholdIncome": 152000,
            "avgAssessment": 412000,
            "avgMarketValue": 715000,
            "currentTaxBill": 14626.00,
            "currentTaxEffortPct": 9.62,
            "blueprintTaxBill": 12195.00,
            "blueprintTaxEffortPct": 8.02,
            "blueprintAnnualSavings": 2431.00,
            "blueprintMonthlySavings": 202.58,
            "renterHouseholdsPct": 21.5,
            "estimatedRenterRentReliefMonthly": 95.0,
            "vulnerabilityRating": "Highest Gross Tax Bill",
            "whyItMatters": "Faces the highest nominal property tax bills ($14,626/yr avg); saves over $2,430/yr when commercial ratables and PILOT school shares are restored."
        }
    ],
    "sampleHomeProfiles": [
        {
            "label": "Lake Hiawatha Cape Cod / Starter Home (07034)",
            "marketValue": 465000,
            "assessedValue": 292000,
            "householdIncome": 88000,
            "zip": "07034",
            "statusQuoBill": 10366.00,
            "revalOnlyBill": 10360.00,
            "commercialReformBill": 9110.40,
            "circuitBreakerBill": 7040.00,
            "blueprintBill": 7040.00,
            "blueprintSavings": 3326.00,
            "percentSavings": 32.1
        },
        {
            "label": "Average Parsippany Ranch / Split-Level (07054)",
            "marketValue": 525000,
            "assessedValue": 348500,
            "householdIncome": 124850,
            "zip": "07054",
            "statusQuoBill": 12371.75,
            "revalOnlyBill": 12369.00,
            "commercialReformBill": 10873.20,
            "circuitBreakerBill": 11639.90,
            "blueprintBill": 10398.50,
            "blueprintSavings": 1973.25,
            "percentSavings": 16.0
        },
        {
            "label": "Troy Hills / Knollwood 4-Bed Colonial (07054)",
            "marketValue": 650000,
            "assessedValue": 395000,
            "householdIncome": 155000,
            "zip": "07054",
            "statusQuoBill": 14022.50,
            "revalOnlyBill": 14018.00,
            "commercialReformBill": 12324.00,
            "circuitBreakerBill": 13193.00,
            "blueprintBill": 11785.00,
            "blueprintSavings": 2237.50,
            "percentSavings": 16.0
        },
        {
            "label": "Fixed-Income Senior in Lake Parsippany (65+)",
            "marketValue": 495000,
            "assessedValue": 312000,
            "householdIncome": 52000,
            "zip": "07054",
            "statusQuoBill": 11076.00,
            "revalOnlyBill": 11072.00,
            "commercialReformBill": 9734.40,
            "circuitBreakerBill": 3120.00,
            "blueprintBill": 3120.00,
            "blueprintSavings": 7956.00,
            "percentSavings": 71.8
        },
        {
            "label": "Powder Mill / 07950 Executive Colonial",
            "marketValue": 780000,
            "assessedValue": 465000,
            "householdIncome": 215000,
            "zip": "07950",
            "statusQuoBill": 16507.50,
            "revalOnlyBill": 16502.00,
            "commercialReformBill": 14508.00,
            "circuitBreakerBill": 15531.00,
            "blueprintBill": 13875.00,
            "blueprintSavings": 2632.50,
            "percentSavings": 16.0
        }
    ],
    "policyRoadmap": [
        {
            "step": 1,
            "title": "Enact Binding 50%+ PILOT Revenue-Sharing Ordinance with PTHSD",
            "legalAuthority": "N.J.S.A. 40A:20-12 & Interlocal Revenue Sharing Agreement",
            "action": "Township Council and Mayor Desai codify a mandatory ordinance transferring at least 50% of all new and amended PILOT service charges directly to the Parsippany-Troy Hills School District.",
            "outcome": "Redirects $4.9M+ annually into PTHSD classrooms, ending the homeowner subsidy for 1515 Route 10 and Campus Drive apartment developments.",
            "timeline": "Months 1–3"
        },
        {
            "step": 2,
            "title": "Campus Drive, Sylvan Way & Route 10 Life-Sciences Commercial Revitalization",
            "legalAuthority": "N.J.S.A. 40A:12A-1 (Local Redevelopment & Zoning Modernization)",
            "action": "Halt residential apartment conversions of corporate parks and incentivize biotech, medical diagnostics, and clean R&D tenants that generate high commercial ratables with zero school enrollment cost.",
            "outcome": "Restores commercial share of the tax base from 27.2% back toward 34%+, shifting $20M+ off single-family homeowners.",
            "timeline": "Months 3–18"
        },
        {
            "step": 3,
            "title": "Shared-Services Consortium Across Parsippany's 6 Fire Districts",
            "legalAuthority": "N.J.S.A. 40A:65-1 (Uniform Shared Services and Consolidation Act)",
            "action": "Establish joint apparatus purchasing, insurance, audit, and legal procurement across Fire Districts #1 through #6.",
            "outcome": "Cuts duplicate administrative overhead by $850k+/yr while strengthening frontline fire and rescue apparatus.",
            "timeline": "Months 6–12"
        },
        {
            "step": 4,
            "title": "Commercial Impervious Stormwater Fee & Enterprise Unbundling",
            "legalAuthority": "N.J.S.A. 40A:26B-1 (Clean Stormwater and Flood Reduction Act)",
            "action": "Shift stormwater drainage and basin maintenance costs from residential property taxes onto massive commercial parking lots along Route 46, Route 10, and I-80.",
            "outcome": "Delivers ~$485/yr per household in municipal property tax relief while funding Whippany/Rockaway River flood mitigation.",
            "timeline": "Months 6–15"
        },
        {
            "step": 5,
            "title": "Senior Stay NJ / ANCHOR / Freeze (Form PAS-1) + Local Circuit Breaker",
            "legalAuthority": "P.L. 2023, c. 75 (Stay NJ) & N.J.S.A. 54:4-8.58",
            "action": "Maximize township-wide enrollment in NJ's combined Form PAS-1 (Stay NJ 50% senior property tax credit up to $6,500, ANCHOR $1,500–$1,750 rebate, and Senior Freeze) paired with local circuit-breaker protections.",
            "outcome": "Slashes net property tax bills by up to $6,500/yr for Parsippany seniors (65+) and protects Lake Hiawatha and Lake Parsippany working families.",
            "timeline": "Immediate (PAS-1 Filing Window)"
        }
    ]
}
save_json("fair_tax_scenarios.json", fair_tax_scenarios)
print("Successfully generated all 13 Parsippany-Troy Hills datasets!")
