#!/usr/bin/env python3
"""
Clifton NJ Taxpayer Watchdog - Investigation & Analysis CLI Toolkit
Updated: October 10, 2026

Allows Clifton residents to:
1. Check data freshness and certification dates
2. Calculate personal property tax bill breakdowns to the penny
3. Search city and school staff salaries and leadership
4. View detailed healthcare, pension, and terminal leave benefits
5. Review Watchdog Alerts (State Comptroller audits, ethics complaints, PILOT tax shifts)
6. Check ethics disclosures, businesses, and property lookup links
7. View top vendors and contractors paid by taxpayers
"""

import json
import os
import sys
import urllib.parse

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data')

def load_json(filename):
    path = os.path.join(DATA_DIR, filename)
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def show_data_status():
    print("\n" + "="*70)
    print(" CLIFTON NJ TAXPAYER WATCHDOG — DATA FRESHNESS & CERTIFICATION STATUS")
    print("="*70)

    files = [
        ("tax_breakdown.json", "Passaic County Tax Board Certified Rates"),
        ("boe_budget.json", "Clifton Board of Education Budget"),
        ("municipal_budget.json", "City of Clifton Municipal Budget"),
        ("benefits_healthcare.json", "SHBP/SEHBP Healthcare & Benefits"),
        ("ethics_controversies.json", "State Comptroller & Ethics Investigations"),
        ("staff_directory.json", "Public Staff & Collective Bargaining Payroll"),
        ("ethics_disclosures.json", "Financial Disclosure Statements (FDS)"),
        ("vendors_spending.json", "Bill Lists & Accounts Payable")
    ]

    for fname, label in files:
        data = load_json(fname)
        meta = data.get('metadata', {})
        updated = meta.get('lastUpdated', '2026-10-10')
        vintage = meta.get('dataVintage') or meta.get('fiscalCycle') or meta.get('reportVintage') or 'Current'
        status = meta.get('freshnessStatus', 'Current')
        agency = meta.get('sourceAgency', 'Public State / County Records')
        if isinstance(agency, list):
            agency = ", ".join(agency[:2])
        print(f"\n• {label} ({fname}):")
        print(f"  Last Updated: {updated} | Status: {status}")
        print(f"  Vintage: {vintage}")
        print(f"  Source: {agency}")

def calculate_taxes(assessed_value):
    tax_info = load_json('tax_breakdown.json')
    rate = tax_info['certifiedTotalRate']
    total_tax = (assessed_value / 100.0) * rate

    meta = tax_info.get('metadata', {})
    print("\n" + "="*70)
    print(f" CLIFTON NJ PROPERTY TAX BILL BREAKDOWN (Rate: {rate}% / $100)")
    print(f" Data Certified: {meta.get('certifiedDate', 'Tax Year 2026')}")
    print(f" Assessed Home Value: ${assessed_value:,.2f}")
    print(f" Total Annual Property Taxes: ${total_tax:,.2f}")
    print("="*70)

    for b in tax_info['breakdown']:
        amount = (assessed_value / 100.0) * b['rate']
        pct = b['percentage']
        print(f"\n▶ {b['entity'].upper()}")
        print(f"  Share: {pct:.2f}% | Annual Amount: ${amount:,.2f} (${amount/12:,.2f}/mo)")
        print(f"  {b['description']}")

        if 'components' in b:
            print("  Where that slice goes:")
            for c in b['components']:
                share_key = [k for k in c.keys() if k.startswith('shareOf')][0]
                comp_share = c[share_key]
                comp_amt = amount * comp_share
                print(f"    - {c['name']}: ${comp_amt:,.2f} ({comp_share*100:.1f}%)")

def show_benefits():
    ben = load_json('benefits_healthcare.json')
    print("\n" + "="*70)
    print(" CLIFTON PUBLIC EMPLOYEE HEALTHCARE & RETIREMENT BENEFITS")
    print(f" Total Taxpayer Annual Cost: ${ben['overview']['combinedTaxpayerBenefitsCost']:,.2f} ({ben['overview']['percentageOfCombinedBudgets']})")
    print("="*70)

    print("\n[Primary Health Insurance Plans (SHBP / SEHBP)]:")
    for p in ben['healthcarePlans']['primaryPlans']:
        print(f"  • {p['planName']} ({p['type']})")
        print(f"    {p['description']}")

    print("\n[Statutory Premium Cost Sharing]:")
    for r in ben['costSharing']['rules']:
        print(f"  • {r['tier']}")
        print(f"    Employee Out-of-Pocket: {r['employeeContribution']}")
        print(f"    Taxpayer Subsidy: {r['taxpayerContribution']}")
        print(f"    Example: {r['note']}")

    print("\n[Retirement & Leave Liability]:")
    for b in ben['retirementAndLeaveBenefits']:
        print(f"\n  ▶ {b['benefitName']}")
        print(f"    Authority: {b['legalAuthority']} | Impact: {b['taxpayerImpact']}")
        print(f"    Details: {b['details']}")

def show_alerts():
    cont = load_json('ethics_controversies.json')
    print("\n" + "="*70)
    print(" WATCHDOG ALERTS: AUDITS, ETHICS, AND POTENTIAL CONFLICTS")
    print("="*70)
    for c in cont['controversies']:
        print(f"\n[{c['severity']} ALERT] {c['title']}")
        print(f"Category: {c['category']} | Entity: {c['entityInvolved']} | Updated: {c['lastUpdated']}")
        print(f"Summary: {c['summary']}")
        print(f"Details: {c['investigationDetails']}")
        print(f"Taxpayer Impact: {c['taxpayerImpact']}")
        print(f"Status: {c['status']}")
        print("-" * 70)

def search_staff(query):
    raw = load_json('staff_directory.json')
    staff_data = raw.get('staff', raw) if isinstance(raw, dict) else raw
    query_lower = query.lower()
    matches = [s for s in staff_data if query_lower in s['name'].lower() or query_lower in s['title'].lower() or query_lower in s['department'].lower()]

    print(f"\nFound {len(matches)} match(es) for '{query}':")
    print("-" * 70)
    for m in matches:
        print(f"• Name: {m['name']}")
        print(f"  Entity: {m['entity']} | Dept: {m['department']}")
        print(f"  Title: {m['title']}")
        print(f"  Reported Salary: ${m['salaryReported']:,.2f} (Range: {m['salaryRange']})")
        print(f"  Notes: {m['notes']}")
        print("-" * 70)

def search_ethics(name_query):
    raw = load_json('ethics_disclosures.json')
    disclosures = raw.get('disclosures', raw) if isinstance(raw, dict) else raw
    matches = [d for d in disclosures if name_query.lower() in d['officialName'].lower()]

    if not matches:
        print(f"\nNo specific cached profile found for '{name_query}'.")
        print("To search any official state-wide in New Jersey:")
        print("1. Local Government Officers: Visit https://fds.nj.gov and search by municipality 'Clifton'")
        print("2. School Officials: Visit https://www.nj.gov/education/legal/ethics/")
        encoded = urllib.parse.quote_plus(name_query)
        print(f"3. Property Records: https://tax1.co.monmouth.nj.us/cgi-bin/m4.cgi?district=1602&owner={encoded}")
        return

    for d in matches:
        print("\n" + "="*70)
        print(f" ETHICS & ASSET PROFILE: {d['officialName']} ({d['publicTitle']})")
        print(f" Statutory Filing: {d['mandatoryFiling']}")
        print("="*70)

        print("\n[Declared Businesses & Outside Commercial Ties]:")
        for b in d['disclosedBusinesses']:
            print(f"  • {b['businessName']}")
            print(f"    Nature: {b['nature']} | Role: {b['ownership']} | Location: {b['location']}")

        print("\n[Real Estate Holdings]:")
        for r in d['realEstateHoldings']:
            print(f"  • {r['description']} in {r['municipality']}")
            print(f"    Lookup: {r['taxRecordLookup']}")

        print("\n[Sources of Earned Income > $2,000]:")
        for e in d['earnedIncomeSources']:
            print(f"  • {e}")

        print("\n[Ethics & Conflict Guidance]:")
        print(f"  {d['conflictGuidance']}")

def list_top_vendors():
    raw = load_json('vendors_spending.json')
    vendors = raw.get('vendors', raw) if isinstance(raw, dict) else raw
    print("\n" + "="*70)
    print(" TOP VENDORS & CONTRACTORS (Clifton City & Board of Ed)")
    print("="*70)
    for v in vendors:
        print(f"\n• {v['vendorName']} ({v['entityServed']})")
        print(f"  Category: {v['category']} | Est. Annual Spend: ${v['annualEstimatedSpend']:,.2f}")
        print(f"  Details: {v['description']}")

def show_demographics(query=None):
    demo = load_json('demographics_taxes.json')
    ov = demo['cityOverview']

    print("\n" + "="*70)
    print(" CLIFTON DEMOGRAPHICS, POPULATION & PROPERTY TAX EQUITY")
    print(f" Population: {ov['totalPopulation']:,} | Median Household Income: ${ov['medianHouseholdIncome']:,}")
    print(f" Median Age: {ov['medianAge']} yrs | Owners: {ov['ownerOccupiedRate']}% | Renters: {ov['renterOccupiedRate']}%")
    print(f" Diversity: {ov['raceEthnicity']['whiteNonHispanic']}% White, {ov['raceEthnicity']['hispanicOrLatino']}% Latino, {ov['raceEthnicity']['asian']}% Asian, {ov['raceEthnicity']['blackOrAfricanAmerican']}% Black")
    print("="*70)

    if not query:
        print("\n[ZIP CODE COMPARISON: 07013 vs 07011]")
        for z in demo['zipCodeComparison']:
            print(f"\n▶ ZIP {z['zip']} — {z['areaName']}")
            print(f"  Population: {z['population']:,} ({z['populationShare']}%) | Median Age: {z['medianAge']} yrs")
            print(f"  Median Household Income: ${z['medianHouseholdIncome']:,} | Homeowners: {z['ownerOccupiedPercent']}%")
            print(f"  Avg Annual Tax Bill: ${z['averageAnnualTaxBill']:,.2f} (${z['monthlyTaxBill']:,.2f}/mo)")
            print(f"  Tax Burden (% of Income): {z['taxBurdenPercentOfIncome']}%")
            print(f"  Share of Total Tax Base: {z['shareOfTotalTaxBase']}% | Share of School Students: {z['schoolEnrollmentShare']}%")
            print("  Key Takeaways:")
            for k in z['keyFindings']:
                print(f"   • {k}")

        print("\n[CLIFTON NEIGHBORHOODS (6 DISTINCT ZONES)]:")
        for n in demo['neighborhoods']:
            print(f"  • {n['name']} (ZIP {n['zip']}): Income ${n['medianIncome']:,} | Age {n['medianAge']} | Avg Tax ${n['avgTaxBill']:,.2f} (Burden: {n['taxBurdenPercentIncome']}%)")

        print("\n[KEY WATCHDOG POLICY INSIGHTS]:")
        for t in demo['equityAnalysis']['keyTakeaways']:
            print(f"\n  ★ {t['title']}")
            print(f"    {t['detail']}")
    else:
        q_lower = query.lower()
        matched_zips = [z for z in demo['zipCodeComparison'] if q_lower in z['zip'].lower() or q_lower in z['areaName'].lower()]
        matched_neighs = [n for n in demo['neighborhoods'] if q_lower in n['name'].lower() or q_lower in n['zip'].lower() or q_lower in n['character'].lower()]

        if matched_zips:
            for z in matched_zips:
                print(f"\n[DETAILS FOR ZIP {z['zip']}]:")
                print(f"Area: {z['areaName']}")
                print(f"Neighborhoods: {z['neighborhoodsIncluded']}")
                print(f"Median Income: ${z['medianHouseholdIncome']:,} | Median Age: {z['medianAge']}")
                print(f"Average Tax Bill: ${z['averageAnnualTaxBill']:,.2f}/year | Monthly: ${z['monthlyTaxBill']:,.2f}")
                print(f"Tax-to-Income Burden: {z['taxBurdenPercentOfIncome']}% of household income")
                print(f"Tax Base Share: {z['shareOfTotalTaxBase']}% | School Enrollment Share: {z['schoolEnrollmentShare']}%")

        if matched_neighs:
            for n in matched_neighs:
                print(f"\n[NEIGHBORHOOD: {n['name']} (ZIP {n['zip']})]:")
                print(f"Character: {n['character']}")
                print(f"Median Income: ${n['medianIncome']:,} | Median Age: {n['medianAge']} | Homeowners: {n['ownerOccupied']}%")
                print(f"Avg Assessed Value: ${n['avgAssessedValue']:,} | Market Value: ${n['avgMarketValue']:,}")
                print(f"Avg Tax Bill: ${n['avgTaxBill']:,.2f}/yr | Tax Burden: {n['taxBurdenPercentIncome']}% of income")
                print(f"Description: {n['description']}")
                print(f"Tax Dynamic: {n['taxDynamic']}")

        if not matched_zips and not matched_neighs:
            print(f"No specific neighborhood match found for '{query}'. Try: 07011, 07013, 'Montclair', 'Allwood', 'Botany', 'Athenia'")

def show_properties(search_term=""):
    data = load_json('property_assessments.json')
    props = data.get('properties', [])
    meta = data.get('metadata', {})
    stats = data.get('summaryStats', {})
    
    if search_term:
        term = search_term.lower()
        props = [p for p in props if term in p['address'].lower() or term in p['neighborhood'].lower() or term in p['zip'] or term in p['propertyType'].lower()]

    print("\n" + "="*75)
    print(" CLIFTON NJ PROPERTY VALUES & TAX ASSESSMENTS (2026 CERTIFIED ROLL)")
    print(f" Certified Tax Rate: {meta.get('taxRateCertified')}% | Formula: (Assessed Value / 100) * 6.527%")
    print(f" Citywide Sampled Stats: High ${stats.get('highestTax'):,.2f} | Low ${stats.get('lowestTax'):,.2f} | Avg ${stats.get('averageTax'):,.2f}")
    print("="*75)
    print(f"Showing {len(props)} properties{' matching \"' + search_term + '\"' if search_term else ''}:\n")

    for p in props[:15]:
        print(f"🏡 {p['address']} ({p['neighborhood']} • {p['zip']})")
        print(f"   Type: {p['propertyType']} | Year: {p['yearBuilt']}")
        print(f"   Specs: {p['bedrooms']} Beds | {p['bathrooms']} Baths | {p['squareFeet']:,} sq ft | Lot: {p['lotSize']}")
        print(f"   Assessment: Assessed ${p['assessedTotal']:,} (Land: ${p['assessedLand']:,}, Bldg: ${p['assessedBuilding']:,})")
        print(f"   Est. Market Value: ${p['estimatedMarketValue']:,}")
        print(f"   2026 Annual Tax: ${p['annualTax']:,.2f} (School: ${p['schoolTax']:,.2f}, City: ${p['municipalTax']:,.2f}, County: ${p['countyTax']:,.2f})")
        print(f"   Tier: {p['taxTier']} | Garage: {p['garage']} | Climate: {p['cooling']}")
        print("   " + "-"*65)

    if len(props) > 15:
        print(f"\n... and {len(props) - 15} more properties. Use the web dashboard at http://localhost:8088 to view and filter all.")

def compare_surrounding_towns():
    data = load_json('surrounding_towns_comparison.json')
    towns = data.get('towns', [])
    findings = data.get('comparativeKeyFindings', [])

    print("\n" + "="*80)
    print(" 🗺️  CLIFTON VS. SURROUNDING TOWNS — REGIONAL TAX & BUDGET BENCHMARK (2026)")
    print("="*80)
    print(f"{'MUNICIPALITY':<20} | {'CERT. RATE':<10} | {'RATIO':<7} | {'EFF. RATE':<10} | {'MEDIAN TAX':<11} | {'TAX BURDEN %':<12} | {'SCHOOL %'}")
    print("-" * 80)

    for t in towns:
        star = "⭐ " if t['id'] == 'clifton' else "   "
        print(f"{star + t['name']:<20} | {t['certifiedTaxRate']:>8.3f}% | {t['equalizationRatio']:>5.1f}% | {t['effectiveTaxRateMarket']:>8.3f}% | ${t['medianAnnualTaxBill']:>9,.0f} | {t['taxBurdenPercentOfIncome']:>10.1f}% | {t['taxSplit']['schoolsPercent']:>6.1f}%")

    print("="*80)
    print("\n💡 KEY REGIONAL WATCHDOG FINDINGS:")
    for f in findings:
        print(f"\n• {f['title']}:")
        print(f"  {f['detail']}")

def print_help():
    print("""
Clifton NJ Taxpayer Watchdog - Command-Line Toolkit

Usage:
  python3 investigation_toolkit.py status
      Displays data freshness, timestamps, and certified sources.

  python3 investigation_toolkit.py calc [ASSESSED_VALUE]
      Calculates your exact Clifton property tax bill and line-item breakdown.
      Example: python3 investigation_toolkit.py calc 185000

  python3 investigation_toolkit.py properties [SEARCH_TERM]
      Displays residential property values, bedrooms, bathrooms, and tax bills.
      Example: python3 investigation_toolkit.py properties "Grove St"
      Example: python3 investigation_toolkit.py properties "Montclair Heights"

  python3 investigation_toolkit.py demographics [ZIP_OR_AREA]
      Shows Census ACS demographics and property tax disparities.
      Example: python3 investigation_toolkit.py demographics "07011"

  python3 investigation_toolkit.py benefits
      Breaks down public employee healthcare plans, SHBP/SEHBP, and pensions.

  python3 investigation_toolkit.py alerts
      Displays Watchdog Alerts (State Comptroller audits, ethics issues, PILOT tax shifts).

  python3 investigation_toolkit.py staff [SEARCH_TERM]
      Searches public employee salaries and leadership positions.
      Example: python3 investigation_toolkit.py staff "Robertozzi"
      Example: python3 investigation_toolkit.py staff "Police"

  python3 investigation_toolkit.py ethics [NAME]
      Checks declared outside businesses, properties, and income sources.
      Example: python3 investigation_toolkit.py ethics "Grabowski"

  python3 investigation_toolkit.py vendors
      Lists top contractors and vendors paid with tax dollars.
""")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print_help()
        sys.exit(0)

    cmd = sys.argv[1].lower()
    if cmd == 'status':
        show_data_status()
    elif cmd == 'calc':
        val = float(sys.argv[2]) if len(sys.argv) > 2 else 182500.0
        calculate_taxes(val)
    elif cmd == 'properties':
        term = sys.argv[2] if len(sys.argv) > 2 else ""
        show_properties(term)
    elif cmd == 'demographics':
        q = sys.argv[2] if len(sys.argv) > 2 else None
        show_demographics(q)
    elif cmd == 'benefits':
        show_benefits()
    elif cmd == 'alerts':
        show_alerts()
    elif cmd == 'staff':
        term = sys.argv[2] if len(sys.argv) > 2 else ""
        search_staff(term)
    elif cmd == 'ethics':
        name = sys.argv[2] if len(sys.argv) > 2 else ""
        search_ethics(name)
    elif cmd == 'compare':
        compare_surrounding_towns()
    elif cmd == 'vendors':
        list_top_vendors()
    else:
        print_help()
