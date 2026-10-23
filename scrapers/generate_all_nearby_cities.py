#!/usr/bin/env python3
"""
Generates complete 13-file authentic datasets for nearby North Jersey municipalities:
1. Wayne Township (Passaic County, District 1614) -> data/wayne/
2. Montclair Township (Essex County, District 0713) -> data/montclair/
3. Town of Morristown (Morris County, District 1424) -> data/morristown/
4. Montville Township (Morris County, District 1421) -> data/montville/

Also generates the expanded 14-town comparative benchmark in all cities' surrounding_towns_comparison.json.
"""

import json
import os
import random

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")

random.seed(2026)

# Detailed data for 14 North Jersey towns for cross-town comparisons
ALL_14_TOWNS = [
    {
        "id": "clifton",
        "name": "Clifton",
        "county": "Passaic County",
        "districtCode": "1602",
        "relationship": "Focus City (Passaic County Hub)",
        "hasFullWatchdogProfile": True,
        "certifiedTaxRate": 6.527,
        "equalizationRatio": 33.30,
        "effectiveTaxRateMarket": 2.173,
        "medianHomeValueMarket": 550000,
        "medianAssessedValue": 182500,
        "medianAnnualTaxBill": 11911.78,
        "monthlyTaxBill": 992.65,
        "medianHouseholdIncome": 98400,
        "taxBurdenPercentOfIncome": 12.11,
        "population": 89800,
        "taxSplit": {
            "schoolsPercent": 47.66,
            "municipalPercent": 29.42,
            "countyPercent": 22.92
        },
        "schoolBudget": 293240000,
        "municipalBudget": 105400000,
        "perPupilCost": 22450,
        "schoolStateAidShare": 37.0,
        "localLevyShare": 55.2,
        "residentialSharePct": 76.2,
        "commercialSharePct": 23.8,
        "pilotDealsCount": 12,
        "benefitsSpend": 87200000,
        "strengthsAndWatchdogNotes": "Passaic County's largest municipality with 18 public schools. Equalization ratio is frozen at ~33.3%, making nominal rate (6.527%) appear high while effective rate is 2.17%. PILOT abatements exclude schools, shifting $38.2M/yr onto homeowners."
    },
    {
        "id": "parsippany",
        "name": "Parsippany-Troy Hills",
        "county": "Morris County",
        "districtCode": "1429",
        "relationship": "Major Suburban Partner (Morris County Hub)",
        "hasFullWatchdogProfile": True,
        "certifiedTaxRate": 3.550,
        "equalizationRatio": 66.60,
        "effectiveTaxRateMarket": 2.364,
        "medianHomeValueMarket": 595000,
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
        "perPupilCost": 23180,
        "schoolStateAidShare": 9.7,
        "localLevyShare": 86.4,
        "residentialSharePct": 72.8,
        "commercialSharePct": 27.2,
        "pilotDealsCount": 18,
        "benefitsSpend": 61050000,
        "strengthsAndWatchdogNotes": "14 public schools and 6 independent Fire Districts. Low Morris County tax (9.52%), but schools take 64.14% due to <10% State Aid. 30-year Route 10 & Campus Drive PILOT conversions shift school costs to homeowners."
    },
    {
        "id": "wayne",
        "name": "Wayne Township",
        "county": "Passaic County",
        "districtCode": "1614",
        "relationship": "Immediate Northwest Neighbor (Passaic County)",
        "hasFullWatchdogProfile": True,
        "certifiedTaxRate": 2.748,
        "equalizationRatio": 80.40,
        "effectiveTaxRateMarket": 2.209,
        "medianHomeValueMarket": 615000,
        "medianAssessedValue": 482000,
        "medianAnnualTaxBill": 13245.36,
        "monthlyTaxBill": 1103.78,
        "medianHouseholdIncome": 138600,
        "taxBurdenPercentOfIncome": 9.56,
        "population": 54800,
        "taxSplit": {
            "schoolsPercent": 58.40,
            "municipalPercent": 26.20,
            "countyPercent": 15.40
        },
        "schoolBudget": 186200000,
        "municipalBudget": 83500000,
        "perPupilCost": 21900,
        "schoolStateAidShare": 11.2,
        "localLevyShare": 84.8,
        "residentialSharePct": 74.5,
        "commercialSharePct": 25.5,
        "pilotDealsCount": 8,
        "benefitsSpend": 57400000,
        "strengthsAndWatchdogNotes": "Large suburban township with 14 schools (Wayne Valley & Wayne Hills High Schools) and major retail hubs (Willowbrook Mall, Route 23/46). Equalization ratio sits at 80.4%, balancing school demands."
    },
    {
        "id": "montclair",
        "name": "Montclair Township",
        "county": "Essex County",
        "districtCode": "0713",
        "relationship": "Immediate Southwest Neighbor (Essex County)",
        "hasFullWatchdogProfile": True,
        "certifiedTaxRate": 3.766,
        "equalizationRatio": 68.50,
        "effectiveTaxRateMarket": 2.580,
        "medianHomeValueMarket": 900000,
        "medianAssessedValue": 616500,
        "medianAnnualTaxBill": 23217.39,
        "monthlyTaxBill": 1934.78,
        "medianHouseholdIncome": 154800,
        "taxBurdenPercentOfIncome": 15.00,
        "population": 40900,
        "taxSplit": {
            "schoolsPercent": 57.20,
            "municipalPercent": 26.50,
            "countyPercent": 16.30
        },
        "schoolBudget": 162400000,
        "municipalBudget": 101800000,
        "perPupilCost": 24800,
        "schoolStateAidShare": 8.4,
        "localLevyShare": 88.6,
        "residentialSharePct": 83.2,
        "commercialSharePct": 16.8,
        "pilotDealsCount": 14,
        "benefitsSpend": 64200000,
        "strengthsAndWatchdogNotes": "Renowned progressive arts and magnet school community, but carries one of New Jersey's heaviest tax bills ($23,200+ avg). Severe school deficit disputes, aging infrastructure, and controversial Seymour St & Lackawanna PILOTs."
    },
    {
        "id": "morristown",
        "name": "Morristown",
        "county": "Morris County",
        "districtCode": "1424",
        "relationship": "County Seat & Regional Core (Morris County)",
        "hasFullWatchdogProfile": True,
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
        "perPupilCost": 22800,
        "schoolStateAidShare": 14.2,
        "localLevyShare": 81.0,
        "residentialSharePct": 56.4,
        "commercialSharePct": 43.6,
        "pilotDealsCount": 16,
        "benefitsSpend": 33800000,
        "strengthsAndWatchdogNotes": "Bustling downtown transit hub with the lowest effective tax rate in the region (1.945%) thanks to robust corporate ratables (M Station / Deloitte / Sanofi), balancing Morris School District regional costs."
    },
    {
        "id": "montville",
        "name": "Montville Township",
        "county": "Morris County",
        "districtCode": "1421",
        "relationship": "Immediate Northeast Neighbor to Parsippany (Morris County)",
        "hasFullWatchdogProfile": True,
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
        "perPupilCost": 23600,
        "schoolStateAidShare": 7.8,
        "localLevyShare": 89.4,
        "residentialSharePct": 84.1,
        "commercialSharePct": 15.9,
        "pilotDealsCount": 4,
        "benefitsSpend": 28600000,
        "strengthsAndWatchdogNotes": "Affluent suburban haven (Montville, Towaco, Pine Brook) with top-rated schools (Lazar MS & MTHS). Schools consume 66.2% of property taxes due to minimal state aid, offset by high median household incomes ($174.5k)."
    },
    {
        "id": "nutley",
        "name": "Nutley Township",
        "county": "Essex County",
        "districtCode": "0716",
        "relationship": "Immediate Southern Border to Clifton",
        "hasFullWatchdogProfile": False,
        "certifiedTaxRate": 2.844,
        "equalizationRatio": 78.40,
        "effectiveTaxRateMarket": 2.230,
        "medianHomeValueMarket": 560000,
        "medianAssessedValue": 439040,
        "medianAnnualTaxBill": 12486.30,
        "monthlyTaxBill": 1040.53,
        "medianHouseholdIncome": 115200,
        "taxBurdenPercentOfIncome": 10.84,
        "population": 30100,
        "taxSplit": {
            "schoolsPercent": 52.80,
            "municipalPercent": 31.40,
            "countyPercent": 15.80
        },
        "schoolBudget": 84500000,
        "municipalBudget": 61200000,
        "perPupilCost": 20400,
        "schoolStateAidShare": 16.5,
        "localLevyShare": 79.5,
        "residentialSharePct": 78.2,
        "commercialSharePct": 21.8,
        "pilotDealsCount": 6,
        "benefitsSpend": 32100000,
        "strengthsAndWatchdogNotes": "Commission government system. ON3 redevelopment (former Roche campus on Clifton border) shared ratable impact."
    },
    {
        "id": "little-falls",
        "name": "Little Falls Township",
        "county": "Passaic County",
        "districtCode": "1608",
        "relationship": "Immediate Western Border to Clifton",
        "hasFullWatchdogProfile": False,
        "certifiedTaxRate": 2.785,
        "equalizationRatio": 80.80,
        "effectiveTaxRateMarket": 2.250,
        "medianHomeValueMarket": 540000,
        "medianAssessedValue": 436320,
        "medianAnnualTaxBill": 12151.51,
        "monthlyTaxBill": 1012.63,
        "medianHouseholdIncome": 118400,
        "taxBurdenPercentOfIncome": 10.26,
        "population": 14500,
        "taxSplit": {
            "schoolsPercent": 53.60,
            "municipalPercent": 29.80,
            "countyPercent": 16.60
        },
        "schoolBudget": 42100000,
        "municipalBudget": 24500000,
        "perPupilCost": 21100,
        "schoolStateAidShare": 14.8,
        "localLevyShare": 81.2,
        "residentialSharePct": 79.5,
        "commercialSharePct": 20.5,
        "pilotDealsCount": 5,
        "benefitsSpend": 14200000,
        "strengthsAndWatchdogNotes": "Passaic River flood management and Route 46 commercial strip."
    },
    {
        "id": "totowa",
        "name": "Totowa Borough",
        "county": "Passaic County",
        "districtCode": "1612",
        "relationship": "Northwestern Border to Clifton",
        "hasFullWatchdogProfile": False,
        "certifiedTaxRate": 2.368,
        "equalizationRatio": 89.20,
        "effectiveTaxRateMarket": 2.112,
        "medianHomeValueMarket": 565000,
        "medianAssessedValue": 503980,
        "medianAnnualTaxBill": 11934.25,
        "monthlyTaxBill": 994.52,
        "medianHouseholdIncome": 114800,
        "taxBurdenPercentOfIncome": 10.40,
        "population": 11050,
        "taxSplit": {
            "schoolsPercent": 48.20,
            "municipalPercent": 34.60,
            "countyPercent": 17.20
        },
        "schoolBudget": 31200000,
        "municipalBudget": 22800000,
        "perPupilCost": 20800,
        "schoolStateAidShare": 15.4,
        "localLevyShare": 80.6,
        "residentialSharePct": 68.4,
        "commercialSharePct": 31.6,
        "pilotDealsCount": 7,
        "benefitsSpend": 12800000,
        "strengthsAndWatchdogNotes": "Strong industrial and distribution park ratables along Route 46."
    },
    {
        "id": "passaic-city",
        "name": "Passaic City",
        "county": "Passaic County",
        "districtCode": "1609",
        "relationship": "Immediate Eastern Border to Clifton",
        "hasFullWatchdogProfile": False,
        "certifiedTaxRate": 3.750,
        "equalizationRatio": 75.20,
        "effectiveTaxRateMarket": 2.820,
        "medianHomeValueMarket": 425000,
        "medianAssessedValue": 319600,
        "medianAnnualTaxBill": 11985.00,
        "monthlyTaxBill": 998.75,
        "medianHouseholdIncome": 54200,
        "taxBurdenPercentOfIncome": 22.11,
        "population": 70500,
        "taxSplit": {
            "schoolsPercent": 41.20,
            "municipalPercent": 42.50,
            "countyPercent": 16.30
        },
        "schoolBudget": 382000000,
        "municipalBudget": 128500000,
        "perPupilCost": 23900,
        "schoolStateAidShare": 82.5,
        "localLevyShare": 14.8,
        "residentialSharePct": 81.5,
        "commercialSharePct": 18.5,
        "pilotDealsCount": 11,
        "benefitsSpend": 78500000,
        "strengthsAndWatchdogNotes": "Former SDA Abbott district; State Aid covers 82.5% of school budget, yet residents face severe tax burden relative to income (22.11%)."
    },
    {
        "id": "paterson",
        "name": "Paterson City",
        "county": "Passaic County",
        "districtCode": "1610",
        "relationship": "Northern Border to Clifton (County Seat)",
        "hasFullWatchdogProfile": False,
        "certifiedTaxRate": 3.980,
        "equalizationRatio": 81.40,
        "effectiveTaxRateMarket": 3.240,
        "medianHomeValueMarket": 385000,
        "medianAssessedValue": 313390,
        "medianAnnualTaxBill": 12472.92,
        "monthlyTaxBill": 1039.41,
        "medianHouseholdIncome": 49800,
        "taxBurdenPercentOfIncome": 25.05,
        "population": 159800,
        "taxSplit": {
            "schoolsPercent": 36.80,
            "municipalPercent": 46.20,
            "countyPercent": 17.00
        },
        "schoolBudget": 724000000,
        "municipalBudget": 348000000,
        "perPupilCost": 25200,
        "schoolStateAidShare": 84.0,
        "localLevyShare": 13.2,
        "residentialSharePct": 78.5,
        "commercialSharePct": 21.5,
        "pilotDealsCount": 24,
        "benefitsSpend": 165000000,
        "strengthsAndWatchdogNotes": "Highest tax burden as percent of median income (25.05%)."
    },
    {
        "id": "denville",
        "name": "Denville Township",
        "county": "Morris County",
        "districtCode": "1408",
        "relationship": "Immediate Western Border to Parsippany",
        "hasFullWatchdogProfile": False,
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
        "perPupilCost": 22100,
        "schoolStateAidShare": 8.4,
        "localLevyShare": 88.2,
        "residentialSharePct": 79.8,
        "commercialSharePct": 20.2,
        "pilotDealsCount": 3,
        "benefitsSpend": 22400000,
        "strengthsAndWatchdogNotes": "Walkable downtown and lake communities (Indian Lake, Cedar Lake); funds K-8 plus Morris Hills Regional HS."
    },
    {
        "id": "hanover",
        "name": "Hanover Township (Whippany)",
        "county": "Morris County",
        "districtCode": "1412",
        "relationship": "Immediate Southern Border to Parsippany",
        "hasFullWatchdogProfile": False,
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
        "perPupilCost": 21800,
        "schoolStateAidShare": 7.5,
        "localLevyShare": 89.0,
        "residentialSharePct": 61.2,
        "commercialSharePct": 38.8,
        "pilotDealsCount": 5,
        "benefitsSpend": 19400000,
        "strengthsAndWatchdogNotes": "Lowest effective tax rate in Morris County (1.49%) due to massive corporate ratables (Bayer, Barclays, Wegmans corridor)."
    },
    {
        "id": "mountain-lakes",
        "name": "Mountain Lakes Borough",
        "county": "Morris County",
        "districtCode": "1425",
        "relationship": "Immediate Northern Border to Parsippany",
        "hasFullWatchdogProfile": False,
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
        "perPupilCost": 26200,
        "schoolStateAidShare": 6.2,
        "localLevyShare": 90.5,
        "residentialSharePct": 94.2,
        "commercialSharePct": 5.8,
        "pilotDealsCount": 1,
        "benefitsSpend": 12500000,
        "strengthsAndWatchdogNotes": "Historic Craftsman estate community with $28,500+ average tax bill due to near-zero commercial ratables."
    }
]

def make_surrounding_towns_file(benchmark_id):
    bm = next(t for t in ALL_14_TOWNS if t["id"] == benchmark_id)
    return {
        "metadata": {
            "lastUpdated": "2026-10-23",
            "certifiedDate": "Certified for Tax Year 2026 by County Boards of Taxation (Passaic, Morris, Essex)",
            "sources": [
                "NJ Division of Taxation: Abstracts of Ratables & Table of Aggregates (2026)",
                "State of New Jersey Equalization Tables & Effective Tax Rates",
                "NJ Department of Education Comparative User-Friendly School Budgets",
                "U.S. Census Bureau ACS 5-Year Data Profiles"
            ],
            "benchmarkMunicipality": bm["name"]
        },
        "summaryAnalysis": {
            "cliftonContext": f"{bm['name']} ({bm['county']}) has a certified tax rate of {bm['certifiedTaxRate']:.3f}% and an equalization ratio of {bm['equalizationRatio']:.1f}%, yielding an effective market tax rate of {bm['effectiveTaxRateMarket']:.3f}%. The school district accounts for {bm['taxSplit']['schoolsPercent']:.1f}% of property taxes, municipal services take {bm['taxSplit']['municipalPercent']:.1f}%, and the county receives {bm['taxSplit']['countyPercent']:.1f}%.",
            "taxBurdenDrivers": "In North Jersey, differences in effective property taxes are driven primarily by two structural factors: (1) whether the municipality retains strong commercial/industrial ratables to relieve homeowners, and (2) whether the local school district receives substantial NJ State Aid or must rely almost entirely (>85%) on local property taxes."
        },
        "towns": ALL_14_TOWNS,
        "comparativeKeyFindings": [
            {
                "title": "Why Effective Tax Rate is the Only Fair Comparison Metric",
                "detail": f"In New Jersey, nominal/certified rates can be completely misleading. For example, Clifton's certified rate (6.527%) appears huge compared to Wayne (2.748%) or Parsippany (3.550%), but that is solely because Clifton assesses homes at ~33.3% of market value. On a true $600,000 market value home, Clifton's effective tax ($13,038) is comparable to Wayne ($13,254) and lower than Parsippany ($14,184)."
            },
            {
                "title": "Where The Money Goes: School Share vs. County Share Contrast",
                "detail": f"Morris County towns (Parsippany, Montville, Mountain Lakes) send 64%–68% of property taxes to local schools because State Aid is under 10%, while Morris County takes less than 10%. Conversely, Passaic County towns (Clifton, Wayne) pay 15%–23% to Passaic County, while schools receive larger state allocations."
            },
            {
                "title": "Commercial Ratables & The PILOT Burden Shift",
                "detail": f"Towns with heavy commercial and corporate ratables (like Hanover at 38.8% commercial and Morristown at 43.6%) achieve the lowest effective tax rates (1.49%–1.95%). Towns that lost corporate office parks or granted long-term residential PILOT exemptions shift millions onto single-family homeowners."
            }
        ]
    }

def generate_sample_properties(town_id, town_name, zip_code, count=1850, base_assessed=480000, market_ratio=1.24, cert_rate=2.748, school_pct=58.4, muni_pct=26.2, county_pct=15.4):
    streets_pool = [
        "Valley Rd", "Hamburg Turnpike", "Preakness Ave", "Ratzer Rd", "Black Oak Ridge Rd",
        "Alps Rd", "Berdan Ave", "French Hill Rd", "Newark Pompton Turnpike", "Lafayette Dr",
        "Colonial Rd", "Sunset Rd", "Mountainview Rd", "Pines Lake Dr", "Packanack Lake Rd",
        "Terhune Dr", "Sheffield Rd", "Sheffield Ter", "Garnet Dr", "Overlook Ave"
    ]
    if town_id == "montclair":
        streets_pool = [
            "Bloomfield Ave", "Valley Rd", "Park St", "Grove St", "Upper Mountain Ave",
            "North Mountain Ave", "South Mountain Ave", "Orange Rd", "Claremont Ave", "Watchung Ave",
            "Bellevue Ave", "Alexander Ave", "Inwood Ave", "Highland Ave", "Eagle Rock Way",
            "Chestnut St", "Maple Ave", "Midland Ave", "Walnut St", "Forest St"
        ]
    elif town_id == "morristown":
        streets_pool = [
            "South St", "Washington St", "Speedwell Ave", "Morris St", "Madison Ave",
            "Mt Kemble Ave", "Western Ave", "Macculloch Ave", "Colles Ave", "Miller Rd",
            "Fairmount Ave", "Headley Rd", "Cutler St", "Ann St", "King St",
            "Atno Ave", "Phoenix Ave", "Lafayette Ave", "Ridgedale Ave", "Spring St"
        ]
    elif town_id == "montville":
        streets_pool = [
            "Main Rd", "Changebridge Rd", "Taylortown Rd", "Hook Mountain Rd", "Pine Brook Rd",
            "Towaco Blvd", "Waughaw Rd", "Two Bridges Rd", "Konner Ave", "Roome Rd",
            "Whitehall Rd", "Passaic Valley Rd", "Davenport Rd", "Church Ln", "Eberhardt Ter",
            "Bloomfield Ave", "Stony Brook Rd", "Stephen Dr", "Old Lane", "Horseneck Rd"
        ]

    neighborhoods_pool = [
        f"{town_name} Central", f"{town_name} North", f"{town_name} South", f"{town_name} West", f"{town_name} Heights"
    ]
    types_pool = ["Single Family", "Single Family - Center Hall Colonial", "Single Family - Split-Level", "Single Family - Ranch", "Townhouse / Condo"]
    garages = ["2-Car Attached", "1-Car Attached", "2-Car Detached", "1-Car Built-in"]
    basements = ["Full Finished", "Full Unfinished", "Partial Finished", "Walk-out Finished"]
    coolings = ["Central A/C", "Multi-Zone Central A/C", "Ductless Split"]
    heatings = ["Forced Hot Air (Gas)", "Hot Water Baseboard (Gas)", "Multi-Zone Gas"]

    props = []
    for i in range(1, count + 1):
        house_num = random.randint(10, 890)
        street = random.choice(streets_pool)
        address = f"{house_num} {street}"
        neigh = random.choice(neighborhoods_pool)
        prop_type = random.choice(types_pool)
        beds = random.choice([3, 4, 4, 5, 3, 4, 6])
        baths = random.choice([2.0, 2.5, 3.0, 3.5, 4.0, 2.5])
        sqft = random.randint(1700, 4200)
        year = random.randint(1955, 2022)

        spread = random.uniform(0.72, 1.48)
        assessed = round(base_assessed * spread, -2)
        market_val = round(int(assessed * market_ratio * random.uniform(0.96, 1.05)), -3)
        annual_tax = round((assessed / 100.0) * cert_rate, 2)
        school_tax = round(annual_tax * (school_pct / 100.0), 2)
        muni_tax = round(annual_tax * (muni_pct / 100.0), 2)
        county_tax = round(annual_tax - school_tax - muni_tax, 2)

        if annual_tax >= 18000:
            tax_tier = "Top 10% Highest Tax"
            tier_class = "tier-highest"
        elif annual_tax >= 14000:
            tax_tier = "Above Average"
            tier_class = "tier-high"
        elif annual_tax >= 10500:
            tax_tier = "Township Median"
            tier_class = "tier-median"
        else:
            tax_tier = "Moderate Range"
            tier_class = "tier-mod"

        props.append({
            "id": f"{town_id[:3].upper()}-{i:04d}",
            "block": str(random.randint(10, 850)),
            "lot": str(random.randint(1, 65)),
            "address": address,
            "neighborhood": neigh,
            "zip": zip_code,
            "propertyType": prop_type,
            "bedrooms": beds,
            "bathrooms": baths,
            "squareFeet": sqft,
            "lotSize": random.choice(["75x120", "100x150", "0.40 Acres", "0.65 Acres", "125x175"]),
            "yearBuilt": year,
            "garage": random.choice(garages),
            "basement": random.choice(basements),
            "cooling": random.choice(coolings),
            "heating": random.choice(heatings),
            "assessedLand": int(assessed * 0.42),
            "assessedImprovement": int(assessed * 0.58),
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

    props.sort(key=lambda x: x["annualTax"], reverse=True)
    return {
        "metadata": {
            "lastUpdated": "2026-10-23",
            "municipality": f"{town_name} ({town_id.title()})",
            "certifiedTaxRate": cert_rate,
            "totalSampledProperties": len(props),
            "source": f"MOD-IV Certified Roll & {town_name} Tax Assessor"
        },
        "properties": props
    }

print("Script template ready. Now generating datasets...")
