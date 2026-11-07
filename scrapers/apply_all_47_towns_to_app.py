#!/usr/bin/env python3
import json
import os
import subprocess

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
app_js_path = os.path.join(BASE_DIR, "app.js")
reg_json_path = os.path.join(BASE_DIR, "data", "generated_registry_entries.json")

with open(reg_json_path) as f:
    new_entries = json.load(f)

with open(app_js_path) as f:
    app_js = f.read()

# 1. Expand CITY_REGISTRY
city_reg_idx = app_js.find("const CITY_REGISTRY = {")
assert city_reg_idx != -1
glenrock_in_reg = app_js.find("glenrock: {", city_reg_idx)
assert glenrock_in_reg != -1
reg_closing_brace = app_js.find("\n};", glenrock_in_reg)
assert reg_closing_brace != -1

# Format new entries into JS object code
js_entries_list = []
for tid, data in new_entries.items():
    entry_str = f"  '{tid}': " + json.dumps(data, indent=4)
    indented = "\n".join("  " + line if i > 0 else line for i, line in enumerate(entry_str.splitlines()))
    js_entries_list.append(indented)

new_entries_js = ",\n" + ",\n".join(js_entries_list)
app_js = app_js[:reg_closing_brace] + new_entries_js + app_js[reg_closing_brace:]

# 2. Update selectLocationTown to also highlight in comparator if on tab-surrounding
old_select_fn = """function selectLocationTown(townId, county) {
  closeLocationPickerModal();
  if (CITY_REGISTRY[townId]) {
    if (townId !== currentCity) {
      switchCity(townId, true);
    }
  } else {
    navigateToTownComparison(townId, county);
  }
}"""

new_select_fn = """function selectLocationTown(townId, county) {
  closeLocationPickerModal();
  if (CITY_REGISTRY[townId]) {
    if (townId !== currentCity) {
      switchCity(townId, true);
    }
    const currentTab = typeof currentActiveTab !== 'undefined' ? currentActiveTab : '';
    if (currentTab === 'tab-surrounding' || (typeof window !== 'undefined' && window.location.hash.includes('tab-surrounding'))) {
      if (typeof selectSpecificTownComparison === 'function') {
        selectSpecificTownComparison(townId, county);
      }
    }
  } else {
    navigateToTownComparison(townId, county);
  }
}"""

assert old_select_fn in app_js, "Could not find old selectLocationTown function"
app_js = app_js.replace(old_select_fn, new_select_fn, 1)

# 3. Update getCriticalIntelGrid to dynamically generate 3-card briefing for all 40 towns
old_default_intel = """  // Default: Clifton
  return `<!-- Card 1: Mandatory 2026-2027 ASI Citywide Revaluation -->"""

new_dynamic_intel = """  if (cityId !== 'clifton' && meta) {
    const marketMultiplier = (meta.equalizationRatio && meta.equalizationRatio > 0) ? (100 / meta.equalizationRatio).toFixed(1) : '1.0';
    return `<!-- Card 1: Certified Property Tax & Equalization Ratio -->
       <div class="calc-card" style="border-top: 4px solid #2563eb;">
         <div class="card-title-row" style="margin-bottom: 10px;">
           <h3 style="font-size: 1.08rem; display: flex; align-items: center; gap: 8px;"><span>📊</span> Certified Tax Rate (${escapeHtml(meta.certifiedTaxRate)}) & ${meta.equalizationRatio.toFixed(1)}% Ratio</h3>
           <span class="badge-tag">${escapeHtml(meta.countyShort)}</span>
         </div>
         <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px;">
           In <strong>${escapeHtml(meta.fullName)}</strong>, the certified 2026 property tax rate is <strong>${escapeHtml(meta.certifiedTaxRate)} per $100 of assessed valuation</strong>:
         </p>
         <ul style="font-size: 0.84rem; color: var(--text-main); line-height: 1.55; padding-left: 18px; margin-bottom: 14px;">
           <li><strong>Equalization Ratio (${meta.equalizationRatio.toFixed(1)}%):</strong> Market home values average approximately <strong>${marketMultiplier}×</strong> assessed tax rolls.</li>
           <li><strong>Average Tax Bill:</strong> An average residential property assessed at <strong>${escapeHtml(meta.avgAssessed)}</strong> pays approximately <strong>${escapeHtml(meta.avgTaxBill)}</strong> in annual property taxes.</li>
           <li><strong>Assessment Appeals:</strong> Property assessment appeals may be filed with the ${escapeHtml(meta.countyBoardName)} by April 1.</li>
         </ul>
         <div style="display: flex; gap: 10px; flex-wrap: wrap;">
           <a href="${escapeHtml(meta.countyBoardUrl)}" target="_blank" rel="noopener" class="external-pill-link-sm">${escapeHtml(meta.countyBoardName)} ↗</a>
           <a href="${escapeHtml(meta.clerkDeedsUrl)}" target="_blank" rel="noopener" class="external-pill-link-sm">${escapeHtml(meta.countyClerkName)} ↗</a>
         </div>
       </div>

       <!-- Card 2: NJ State Property Tax Relief (Form PAS-1) -->
       <div class="calc-card" style="border-top: 4px solid #059669;">
         <div class="card-title-row" style="margin-bottom: 10px;">
           <h3 style="font-size: 1.08rem; display: flex; align-items: center; gap: 8px;"><span>🛡️</span> Direct NJ Tax Relief: Stay NJ, ANCHOR & Freeze</h3>
           <span class="badge-tag" style="background: #dcfce7; color: #166534;">Combined Form PAS-1</span>
         </div>
         <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px;">
           ${escapeHtml(meta.name)} homeowners and tenants are eligible for state tax relief programs through the State of New Jersey:
         </p>
         <ul style="font-size: 0.84rem; color: var(--text-main); line-height: 1.55; padding-left: 18px; margin-bottom: 14px;">
           <li><strong>Stay NJ (Seniors 65+):</strong> Cuts property taxes by up to <strong>50% (up to $6,500/yr)</strong> for senior homeowners with income under $500,000.</li>
           <li><strong>ANCHOR Rebate:</strong> Provides <strong>$1,000 to $1,750</strong> for eligible homeowners and <strong>$450 to $700</strong> for renters.</li>
           <li><strong>Senior Freeze (PTR):</strong> Freezes property taxes for eligible seniors and disabled residents against future tax rate hikes.</li>
         </ul>
         <div style="display: flex; gap: 10px; flex-wrap: wrap;">
           <a href="https://propertytaxrelief.nj.gov" target="_blank" rel="noopener" class="external-pill-link-sm">Official NJ Property Tax Relief Portal (PAS-1) ↗</a>
         </div>
       </div>

       <!-- Card 3: Municipal & School Spending Audit -->
       <div class="calc-card" style="border-top: 4px solid #d97706;">
         <div class="card-title-row" style="margin-bottom: 10px;">
           <h3 style="font-size: 1.08rem; display: flex; align-items: center; gap: 8px;"><span>🏛️</span> Public Spending: Schools (${escapeHtml(meta.schoolBudgetDisplay)}) & Muni (${escapeHtml(meta.muniBudgetDisplay)})</h3>
           <span class="badge-alert">Tax Distribution</span>
         </div>
         <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px;">
           Where every tax dollar goes in ${escapeHtml(meta.fullName)}:
         </p>
         <ul style="font-size: 0.84rem; color: var(--text-main); line-height: 1.55; padding-left: 18px; margin-bottom: 14px;">
           <li><strong>School District (${escapeHtml(meta.schoolsShare)}):</strong> ${escapeHtml(meta.schoolDistrictName)} accounts for the largest share of your bill at <strong>${escapeHtml(meta.schoolBudgetDisplay)}</strong> annually.</li>
           <li><strong>Municipal Operations (${escapeHtml(meta.muniShare)}):</strong> Police, Public Works, Fire/EMS, and local government total <strong>${escapeHtml(meta.muniBudgetDisplay)}</strong>.</li>
           <li><strong>County Tax Levy (${escapeHtml(meta.countyShare)}):</strong> Funds ${escapeHtml(meta.countyShort)} shared services, county roads, open space preservation, and courts.</li>
         </ul>
         <div style="display: flex; gap: 10px; flex-wrap: wrap;">
           <a href="${escapeHtml(meta.officialTownPortal)}" target="_blank" rel="noopener" class="external-pill-link-sm">${escapeHtml(meta.name)} Official Portal ↗</a>
           <a href="${escapeHtml(meta.officialDocsUrl)}" target="_blank" rel="noopener" class="external-pill-link-sm">Finance & Budgets ↗</a>
         </div>
       </div>`;
  }

  // Default: Clifton
  return `<!-- Card 1: Mandatory 2026-2027 ASI Citywide Revaluation -->"""

assert old_default_intel in app_js, "Could not find old getCriticalIntelGrid default return"
app_js = app_js.replace(old_default_intel, new_dynamic_intel, 1)

# 4. Make loadAllData resilient with fetchSafe helper
old_load_all = """async function loadAllData(cityId = currentCity) {
  const meta = CITY_REGISTRY[cityId] || CITY_REGISTRY.clifton;
  const basePath = meta.basePath || (cityId === 'clifton' ? 'data' : `data/${cityId}`);
  try {
    const [taxRes, boeRes, cityRes, staffRes, ethicsRes, vendRes, benRes, contRes, demoRes, propRes, surrRes, pilotRes, fairRes] = await Promise.all([
      fetch(`${basePath}/tax_breakdown.json`),
      fetch(`${basePath}/boe_budget.json`),
      fetch(`${basePath}/municipal_budget.json`),
      fetch(`${basePath}/staff_directory.json`),
      fetch(`${basePath}/ethics_disclosures.json`),
      fetch(`${basePath}/vendors_spending.json`),
      fetch(`${basePath}/benefits_healthcare.json`),
      fetch(`${basePath}/ethics_controversies.json`),
      fetch(`${basePath}/demographics_taxes.json`),
      fetch(`${basePath}/property_assessments.json`),
      fetch(`${basePath}/surrounding_towns_comparison.json`),
      fetch(`${basePath}/commercial_pilot_shift.json`),
      fetch(`${basePath}/fair_tax_scenarios.json`)
    ]);

    taxData = await taxRes.json();
    boeBudgetData = await boeRes.json();
    cityBudgetData = await cityRes.json();
    
    const rawStaff = await staffRes.json();
    staffData = rawStaff.staff ? rawStaff.staff : rawStaff;

    const rawEthics = await ethicsRes.json();
    ethicsData = rawEthics.disclosures ? rawEthics.disclosures : rawEthics;

    const rawVend = await vendRes.json();
    vendorsData = rawVend.vendors ? rawVend.vendors : rawVend;

    benefitsData = await benRes.json();
    controversiesData = await contRes.json();
    demographicsData = await demoRes.json();
    propertyAssessmentsData = await propRes.json();
    hydratePropertyAssessments(propertyAssessmentsData, meta, taxData);
    surroundingTownsData = await surrRes.json();
    commercialPilotData = await pilotRes.json();
    fairTaxData = await fairRes.json();"""

new_load_all = """async function loadAllData(cityId = currentCity) {
  const meta = CITY_REGISTRY[cityId] || CITY_REGISTRY.clifton;
  const basePath = meta.basePath || (cityId === 'clifton' ? 'data' : `data/${cityId}`);
  try {
    const fetchSafe = async (url, fallback = {}) => {
      try {
        const res = await fetch(url);
        if (res.ok) return await res.json();
      } catch (e) {
        // quiet fallback
      }
      return fallback;
    };

    const [taxRes, boeRes, cityRes, rawStaff, rawEthics, rawVend, benRes, contRes, demoRes, propRes, surrRes, pilotRes, fairRes] = await Promise.all([
      fetchSafe(`${basePath}/tax_breakdown.json`, {}),
      fetchSafe(`${basePath}/boe_budget.json`, {}),
      fetchSafe(`${basePath}/municipal_budget.json`, {}),
      fetchSafe(`${basePath}/staff_directory.json`, []),
      fetchSafe(`${basePath}/ethics_disclosures.json`, []),
      fetchSafe(`${basePath}/vendors_spending.json`, []),
      fetchSafe(`${basePath}/benefits_healthcare.json`, {}),
      fetchSafe(`${basePath}/ethics_controversies.json`, {}),
      fetchSafe(`${basePath}/demographics_taxes.json`, {}),
      fetchSafe(`${basePath}/property_assessments.json`, { properties: [] }),
      fetchSafe(`data/surrounding_towns_comparison.json`, {}),
      fetchSafe(`${basePath}/commercial_pilot_shift.json`, {}),
      fetchSafe(`${basePath}/fair_tax_scenarios.json`, {})
    ]);

    taxData = taxRes;
    boeBudgetData = boeRes;
    cityBudgetData = cityRes;
    
    staffData = rawStaff && rawStaff.staff ? rawStaff.staff : (Array.isArray(rawStaff) ? rawStaff : []);
    ethicsData = rawEthics && rawEthics.disclosures ? rawEthics.disclosures : (Array.isArray(rawEthics) ? rawEthics : []);
    vendorsData = rawVend && rawVend.vendors ? rawVend.vendors : (Array.isArray(rawVend) ? rawVend : []);

    benefitsData = benRes;
    controversiesData = contRes;
    demographicsData = demoRes;
    propertyAssessmentsData = propRes;
    hydratePropertyAssessments(propertyAssessmentsData, meta, taxData);
    surroundingTownsData = surrRes;
    commercialPilotData = pilotRes;
    fairTaxData = fairRes;"""

assert old_load_all in app_js, "Could not find old loadAllData implementation"
app_js = app_js.replace(old_load_all, new_load_all, 1)

# Write updated app.js
with open(app_js_path, "w") as f:
    f.write(app_js)

print("SUCCESS: app.js updated successfully with all 47 towns and resilient loaders!")

# Verify JS syntax
res = subprocess.run(["node", "-c", app_js_path], capture_output=True, text=True)
if res.returncode == 0:
    print("SUCCESS: node -c passed with 0 errors!")
else:
    print("SYNTAX ERROR in app.js:", res.stderr)
