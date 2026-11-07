#!/usr/bin/env python3
import json
import os
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")

with open(os.path.join(DATA_DIR, "surrounding_towns_comparison.json")) as f:
    comp_data = json.load(f)

existing_hub_ids = {"clifton", "parsippany", "wayne", "montclair", "morristown", "montville", "glenrock"}

icons = {
    "paterson": "🏭",
    "passaic-city": "🏛️",
    "totowa": "🦅",
    "little-falls": "🌊",
    "woodland-park": "🌲",
    "hawthorne": "🌳",
    "pompton-lakes": "🛶",
    "ringwood": "🏞️",
    "wanaque": "💧",
    "bloomingdale": "🌲",
    "north-haledon": "⛰️",
    "haledon": "🏛️",
    "prospect-park": "🌳",
    "west-milford": "🌲",
    "fair-lawn": "🚂",
    "elmwood-park": "🏡",
    "garfield": "🏛️",
    "ridgewood": "🌲",
    "paramus": "🏬",
    "hackensack": "⚖️",
    "fort-lee": "🌉",
    "teaneck": "🏡",
    "mahwah": "⛰️",
    "nutley": "🏡",
    "bloomfield": "🏛️",
    "belleville": "🌸",
    "livingston": "🌳",
    "west-orange": "💡",
    "millburn": "🎭",
    "verona": "🏞️",
    "cedar-grove": "🌲",
    "fairfield": "✈️",
    "pequannock": "🌳",
    "denville": "🛶",
    "hanover": "🏢",
    "mountain-lakes": "⛵",
    "florham-park": "🌸",
    "riverdale": "🌲",
    "kinnelon": "🌲",
    "butler": "🏛️"
}

from generate_all_47_towns_data import TOWN_STREETS, COUNTY_OFFICIALS

def clean_town_name(name):
    # Remove parentheses like (Short Hills), (Whippany)
    clean = re.sub(r'\(.*?\)', '', name).strip()
    # Remove Borough, Township, City, Village
    clean = re.sub(r'\s+(Borough|Township|City|Village)$', '', clean).strip()
    return clean

def format_curr_m(val):
    return f"${val / 1000000:.1f}M"

def format_curr_k(val):
    return f"${val / 1000:.1f}k"

registry_entries = {}

for t in comp_data["towns"]:
    tid = t["id"]
    if tid in existing_hub_ids:
        continue
    
    full_name = t["name"]
    short_name = clean_town_name(full_name)
    county = t["county"]
    county_short = county
    officials = COUNTY_OFFICIALS.get(county, {})
    
    cert_rate = t["certifiedTaxRate"]
    rate_num = float(cert_rate)
    eq_ratio = float(t["equalizationRatio"])
    med_assessed = int(t["medianAssessedValue"])
    med_market = int(t["medianHomeValueMarket"])
    annual_tax = float(t["medianAnnualTaxBill"])
    
    school_pct = float(t["taxSplit"]["schoolsPercent"])
    muni_pct = float(t["taxSplit"]["municipalPercent"])
    county_pct = float(t["taxSplit"]["countyPercent"])
    
    school_budget = t["schoolBudget"]
    muni_budget = t["municipalBudget"]
    benefits_spend = t.get("benefitsSpend", round(muni_budget * 0.45))
    
    prop_path = os.path.join(DATA_DIR, tid, "property_assessments.json")
    total_homes = 1200
    if os.path.exists(prop_path):
        with open(prop_path) as pf:
            pd = json.load(pf)
            total_homes = len(pd.get("properties", []))
            
    zip_code = TOWN_STREETS.get(tid, ("07000", []))[0]
    
    # Sliders
    s_min = max(25000, round(med_assessed * 0.35, -4))
    s_max = round(med_assessed * 2.8, -4)
    s_def = med_assessed
    
    p25 = round(med_assessed * 0.65, -3)
    p50 = round(med_assessed * 0.85, -3)
    p75 = round(med_assessed * 1.25, -3)
    p100 = round(med_assessed * 1.65, -3)
    
    slider_labels = f'<span>${s_min/1000:.0f}k</span><span>${s_def/1000:.1f}k (Avg)</span><span>${(s_min + s_max)/2000:.0f}k</span><span>${s_max/1000:.0f}k+</span>'
    quick_presets = f'''<span class="preset-label">Quick Presets:</span>
       <button class="preset-btn" data-val="{int(p25)}">${p25/1000:.0f}k (Starter)</button>
       <button class="preset-btn" data-val="{int(p50)}">${p50/1000:.0f}k (Neighborhood)</button>
       <button class="preset-btn active" data-val="{int(s_def)}">{short_name} Avg (${s_def/1000:.1f}k)</button>
       <button class="preset-btn" data-val="{int(p75)}">${p75/1000:.0f}k (Suburban)</button>
       <button class="preset-btn" data-val="{int(p100)}">${p100/1000:.0f}k (Executive)</button>'''
       
    notes = t.get("strengthsAndWatchdogNotes", f"Comprehensive citizen watchdog audit of {full_name} property tax rates, school budgets, and equalization ratios.")
    
    # Official town portal
    town_slug = tid.replace('-', '')
    portal_url = f"https://www.{tid}.org" if "parsippany" not in tid else "https://www.parsippany.net"

    entry = {
        "id": tid,
        "name": short_name,
        "officialTownPortal": portal_url,
        "officialDocsUrl": f"{portal_url}/finance",
        "fullName": full_name,
        "badgeText": f"{full_name.upper()} • CITIZEN FISCAL WATCHDOG",
        "icon": icons.get(tid, "🏛️"),
        "county": county,
        "countyShort": county_short,
        "districtCode": t.get("districtCode", "0000"),
        "countyBoardUrl": officials.get("boardUrl", ""),
        "countyBoardName": officials.get("boardName", ""),
        "clerkDeedsUrl": officials.get("clerkUrl", ""),
        "countyClerkName": officials.get("clerkName", ""),
        "auditBadge": officials.get("badge", f"{county.upper()} AUDIT • 2026"),
        "certifiedTaxRate": f"{cert_rate:.3f}%",
        "rateNum": rate_num,
        "equalizationRatio": eq_ratio,
        "avgTaxBill": f"${annual_tax:,.0f} / yr",
        "schoolsShare": f"{school_pct:.2f}%",
        "muniShare": f"{muni_pct:.2f}%",
        "countyShare": f"{county_pct:.2f}%",
        "schoolDistrictName": f"{short_name} Public Schools",
        "schoolDistrictShort": f"{short_name} BOE",
        "schoolBudgetDisplay": format_curr_m(school_budget),
        "muniBudgetDisplay": format_curr_m(muni_budget),
        "benefitsSpendDisplay": format_curr_m(benefits_spend),
        "totalHomes": total_homes,
        "avgAssessed": format_curr_k(med_assessed),
        "typicalMarket": med_market,
        "sliderMin": int(s_min),
        "sliderMax": int(s_max),
        "sliderDefault": int(s_def),
        "zipCodesDisplay": zip_code,
        "controversyHighlight": notes[:90] + ("..." if len(notes) > 90 else ""),
        "title": f"{short_name} Taxpayer Watchdog",
        "pageTitle": f"{full_name} NJ Taxpayer Watchdog | Where Does Your Money Go?",
        "subtitle": f"Citizen audit of {full_name} property taxes ({cert_rate:.3f}% rate), {format_curr_m(school_budget)} school budget, {format_curr_m(muni_budget)} municipal budget, and {county} tax levies.",
        "basePath": f"data/{tid}",
        "sliderLabelsHtml": slider_labels,
        "quickPresetsHtml": quick_presets
    }
    registry_entries[tid] = entry

print(f"Generated {len(registry_entries)} town registry entries successfully.")
with open(os.path.join(DATA_DIR, "generated_registry_entries.json"), "w") as out:
    json.dump(registry_entries, out, indent=2)
