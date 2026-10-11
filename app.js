/**
 * Clifton NJ Taxpayer Watchdog - Core Client Application
 * Updated: October 10, 2026
 */

let taxData = null;
let boeBudgetData = null;
let cityBudgetData = null;
let staffData = null;
let ethicsData = null;
let vendorsData = null;
let benefitsData = null;
let controversiesData = null;
let demographicsData = null;
let propertyAssessmentsData = null;
let surroundingTownsData = null;
let currentFilteredProperties = [];

// OPRA Templates
const opraTemplates = {
  overtime: `To the Custodian of Records, City of Clifton (opra@cliftonnj.org):

Pursuant to the New Jersey Open Public Records Act (N.J.S.A. 47:1A-1 et seq.), I hereby request:
1. The complete payroll and compensation ledger for all City of Clifton employees for the most recent completed fiscal year, showing Employee Name, Department, Title, Base Salary, Overtime, and Stipends/Longevity.
2. All approved Secondary Employment / Outside Employment Notification and Authorization forms filed by City of Clifton sworn police officers, department heads, and municipal staff currently active for the current calendar year.
3. The annual summary of Outside Police Employment Details (contractor traffic details) showing vendors, admin fees collected, and officer payouts.

Please provide records electronically in Excel/CSV or searchable PDF format.`,

  vendors: `To the Business Administrator / Board Secretary, Clifton Board of Education (ashehata@clifton.k12.nj.us):

Pursuant to N.J.S.A. 47:1A-1 et seq., I hereby request electronic copies of:
1. The complete Accounts Payable / Check Register / Bill List approved by the Board of Education for the past 12 months, detailing Vendor Name, PO Number, Budget Line Code, Check Date, Check Amount, and Description.
2. Awarded agreements and fee schedules for Professional Services contracts (Board Attorney, Auditor, Architect, Insurance Broker).
3. Chapter 271 Political Contribution Disclosures / Pay-to-Play certifications for all vendors receiving over $17,500.

Please furnish these records electronically via email.`,

  contracts: `To the Custodian of Records, Clifton Board of Education (ashehata@clifton.k12.nj.us):

Pursuant to N.J.S.A. 47:1A-1 et seq. and N.J.S.A. 47:1A-10, please provide:
1. The current employment contracts and any amendments for the Superintendent of Schools, Assistant Superintendent for Business, and Assistant Superintendent of Curriculum.
2. The official calculation of accrued unused sick leave, unused vacation leave, and contractual buyout liability for the top 5 highest compensated district administrators.
3. Any car allowances or executive stipend authorizations approved for the current fiscal year.

Please furnish these records electronically via email.`,

  sickleave: `To the Municipal Clerk / Custodian of Records, City of Clifton (opra@cliftonnj.org):

Pursuant to the New Jersey Open Public Records Act (N.J.S.A. 47:1A-1 et seq.) and in light of findings highlighted by the NJ Office of the State Comptroller (OSC) regarding municipal sick leave payouts:
1. The official detailed ledger of all terminal leave / accumulated sick and vacation leave payouts issued to retiring or departing City of Clifton employees for the past 3 fiscal years, showing employee name, title, department, total hours cashed out, hourly rate, and total gross payout.
2. Any municipal policy, resolution, or collective bargaining agreement addenda establishing the current payout formulas or statutory caps (e.g., $15,000 cap under N.J.S.A. 11A:6-19.2) applicable to unclassified or managerial employees.

Please provide these records electronically in searchable PDF or Excel format.`,

  pilot: `To the Municipal Clerk / Custodian of Records, City of Clifton (opra@cliftonnj.org):

Pursuant to N.J.S.A. 47:1A-1 et seq., please provide copies of:
1. All active Financial Agreements for Payments in Lieu of Taxes (PILOT) / Long Term Tax Exemption agreements entered into under the Long Term Tax Exemption Law (N.J.S.A. 40A:20-1 et seq.) for redevelopment projects in Clifton.
2. The official annual audit reports or audited financial statements submitted to the City of Clifton by each urban renewal entity / PILOT beneficiary for the past 2 completed calendar years.
3. The Clifton Municipal Revenue Ledger showing total annual service charges (PILOT payments) collected and the corresponding 5% remittance made to Passaic County for the most recent fiscal year.

Please furnish these public records in electronic format via email.`
};

const opraMeta = {
  overtime: {
    recipientEmail: 'opra@cliftonnj.org',
    recipientDisplay: 'opra@cliftonnj.org (or cityclerk@cliftonnj.org) • Municipal Clerk Evelina Krajewski',
    subject: 'OPRA Public Records Request - City Payroll, Overtime & Secondary Details'
  },
  vendors: {
    recipientEmail: 'ashehata@clifton.k12.nj.us',
    cc: 'records@clifton.k12.nj.us',
    recipientDisplay: 'ashehata@clifton.k12.nj.us (cc: records@clifton.k12.nj.us) • BOE Business Admin Ahmed Shehata',
    subject: 'OPRA Public Records Request - School Board Vendor Check Registers & Legal Invoices'
  },
  contracts: {
    recipientEmail: 'ashehata@clifton.k12.nj.us',
    cc: 'records@clifton.k12.nj.us',
    recipientDisplay: 'ashehata@clifton.k12.nj.us (cc: records@clifton.k12.nj.us) • BOE Business Admin Ahmed Shehata',
    subject: 'OPRA Public Records Request - District Administrator Contracts & Sick Leave Calculations'
  },
  sickleave: {
    recipientEmail: 'opra@cliftonnj.org',
    recipientDisplay: 'opra@cliftonnj.org (or cityclerk@cliftonnj.org) • Municipal Clerk Evelina Krajewski',
    subject: 'OPRA Public Records Request - Municipal Sick Leave Terminal Payout Records'
  },
  pilot: {
    recipientEmail: 'opra@cliftonnj.org',
    recipientDisplay: 'opra@cliftonnj.org (or cityclerk@cliftonnj.org) • Municipal Clerk Evelina Krajewski',
    subject: 'OPRA Public Records Request - PILOT Tax Abatement Agreements & County Remittances'
  }
};

// Formatting helpers
function formatUSD(num) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(num);
}

function formatUSDWhole(num) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
}

// Initialize Application
async function initApp() {
  setupTabs();
  await loadAllData();
  setupCalculator();
  renderBudgets();
  renderDemographics();
  renderProperties();
  setupPropertyFilters();
  renderSurroundingTowns();
  renderBenefits();
  renderControversies();
  renderStaffTable();
  setupStaffFilters();
  renderEthicsCards();
  renderVendorsCards();
  setupInvestigationTools();
}

// Global Cross-Section Navigation & Tab Switcher
function switchTab(targetId, options = {}) {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const dropdowns = document.querySelectorAll('.nav-dropdown');

  tabBtns.forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });
  document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

  // Highlight corresponding nav tab if exists
  const matchingBtn = document.querySelector(`.tab-btn[data-tab="${targetId}"]`);
  if (matchingBtn) {
    matchingBtn.classList.add('active');
    matchingBtn.setAttribute('aria-selected', 'true');
  }

  // Close open dropdowns
  dropdowns.forEach(dd => {
    dd.classList.remove('open');
    const trig = dd.querySelector('.nav-dropdown-trigger');
    if (trig) trig.setAttribute('aria-expanded', 'false');
  });

  // Sync parent dropdown active state
  dropdowns.forEach(dd => {
    const hasActiveChild = dd.querySelector('.dropdown-item.active') !== null;
    if (hasActiveChild) {
      dd.classList.add('has-active');
    } else {
      dd.classList.remove('has-active');
    }
  });

  const targetPane = document.getElementById(targetId);
  if (targetPane) {
    targetPane.classList.add('active');

    // Contextual actions
    if (options.neighborhood && targetId === 'tab-properties') {
      const neighSelect = document.getElementById('prop-neighborhood-filter');
      if (neighSelect) {
        neighSelect.value = options.neighborhood;
        if (typeof applyPropertyFilters === 'function') {
          applyPropertyFilters();
        }
      }
    }

    if (options.searchQuery && targetId === 'tab-investigate') {
      const propInput = document.getElementById('property-search-name');
      const propBtn = document.getElementById('btn-property-search');
      if (propInput) {
        propInput.value = options.searchQuery;
        setTimeout(() => {
          if (propBtn) propBtn.click();
        }, 120);
      }
    }

    if (options.opraTemplate && targetId === 'tab-investigate') {
      const opraSelect = document.getElementById('opra-template-select');
      if (opraSelect) {
        opraSelect.value = options.opraTemplate;
        opraSelect.dispatchEvent(new Event('change'));
      }
    }

    if (options.staffFilter && targetId === 'tab-staff') {
      const filterBtn = document.querySelector(`.filter-btn[data-filter="${options.staffFilter}"]`);
      if (filterBtn) filterBtn.click();
    }

    // Scroll handling
    if (options.scrollToElement) {
      setTimeout(() => {
        const el = document.querySelector(options.scrollToElement);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}

// Tab Switching & Dropdown Navigation System
function setupTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const dropdowns = document.querySelectorAll('.nav-dropdown');

  // Helper to sync parent dropdown active states
  function syncDropdownActiveState() {
    dropdowns.forEach(dd => {
      const hasActiveChild = dd.querySelector('.dropdown-item.active') !== null;
      if (hasActiveChild) {
        dd.classList.add('has-active');
      } else {
        dd.classList.remove('has-active');
      }
    });
  }

  // Setup Dropdown Triggers
  dropdowns.forEach(dd => {
    const trigger = dd.querySelector('.nav-dropdown-trigger');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dd.classList.contains('open');
        
        // Close other dropdowns
        dropdowns.forEach(d => {
          if (d !== dd) {
            d.classList.remove('open');
            const trig = d.querySelector('.nav-dropdown-trigger');
            if (trig) trig.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle this dropdown
        if (isOpen) {
          dd.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          dd.classList.add('open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // Close dropdowns on click outside or on mobile backdrop
  document.addEventListener('click', (e) => {
    dropdowns.forEach(dd => {
      if (dd.classList.contains('open')) {
        const menu = dd.querySelector('.dropdown-menu');
        const trigger = dd.querySelector('.nav-dropdown-trigger');
        if ((!menu || !menu.contains(e.target)) && (!trigger || !trigger.contains(e.target))) {
          dd.classList.remove('open');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // Close dropdown on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdowns.forEach(dd => {
        dd.classList.remove('open');
        const trig = dd.querySelector('.nav-dropdown-trigger');
        if (trig) trig.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Setup Tab Button switching
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      if (targetId) switchTab(targetId);
    });
  });

  // Global listener for interactive cross-section jump links
  document.addEventListener('click', (e) => {
    const jumpBtn = e.target.closest('[data-jump-tab]');
    if (jumpBtn) {
      e.preventDefault();
      const targetTab = jumpBtn.getAttribute('data-jump-tab');
      const neighborhood = jumpBtn.getAttribute('data-jump-neighborhood');
      const searchQuery = jumpBtn.getAttribute('data-jump-search');
      const opraTemplate = jumpBtn.getAttribute('data-jump-opra');
      const staffFilter = jumpBtn.getAttribute('data-jump-staff-filter');
      const scrollTo = jumpBtn.getAttribute('data-jump-scroll');

      switchTab(targetTab, {
        neighborhood,
        searchQuery,
        opraTemplate,
        staffFilter,
        scrollToElement: scrollTo
      });
    }
  });

  syncDropdownActiveState();
}

// Data Loader
async function loadAllData() {
  try {
    const [taxRes, boeRes, cityRes, staffRes, ethicsRes, vendRes, benRes, contRes, demoRes, propRes, surrRes] = await Promise.all([
      fetch('data/tax_breakdown.json'),
      fetch('data/boe_budget.json'),
      fetch('data/municipal_budget.json'),
      fetch('data/staff_directory.json'),
      fetch('data/ethics_disclosures.json'),
      fetch('data/vendors_spending.json'),
      fetch('data/benefits_healthcare.json'),
      fetch('data/ethics_controversies.json'),
      fetch('data/demographics_taxes.json'),
      fetch('data/property_assessments.json'),
      fetch('data/surrounding_towns_comparison.json')
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
    surroundingTownsData = await surrRes.json();

  } catch (err) {
    console.error("Data load issue:", err);
  }
}

// TAB 1: CALCULATOR
function setupCalculator() {
  const input = document.getElementById('calc-assessment-input');
  if (!input || !taxData) return;

  function updateCalc() {
    const val = parseFloat(input.value) || 0;
    const rate = taxData.certifiedTotalRate;
    const totalAnnual = (val / 100.0) * rate;
    const totalMonthly = totalAnnual / 12.0;
    const totalQuarterly = totalAnnual / 4.0;

    document.getElementById('calc-total-annual').textContent = formatUSD(totalAnnual);
    document.getElementById('calc-total-monthly').textContent = `${formatUSD(totalMonthly)} / mo`;
    document.getElementById('calc-total-quarterly').textContent = `${formatUSD(totalQuarterly)} / qtr`;

    // Render Stacked Bar
    const stackedBar = document.getElementById('calc-stacked-bar');
    stackedBar.innerHTML = '';
    taxData.breakdown.forEach(b => {
      const seg = document.createElement('div');
      seg.className = 'stack-segment';
      seg.style.width = `${b.percentage}%`;
      seg.style.backgroundColor = b.color;
      seg.textContent = `${b.percentage}%`;
      seg.title = `${b.entity}: ${b.percentage}%`;
      stackedBar.appendChild(seg);
    });

    // Render Breakdown Cards
    const container = document.getElementById('calc-entity-breakdown');
    container.innerHTML = '';

    taxData.breakdown.forEach(b => {
      const entityAmt = (val / 100.0) * b.rate;
      const card = document.createElement('div');
      card.className = `entity-calc-card ${b.id}-card`;

      let componentsHtml = '';
      if (b.components) {
        componentsHtml = `
          <div class="components-list">
            ${b.components.map(c => {
              const shareKey = Object.keys(c).find(k => k.startsWith('shareOf'));
              const share = c[shareKey] || 0;
              const subAmt = entityAmt * share;
              return `
                <div class="component-row">
                  <span>${c.name}</span>
                  <span class="component-val">${formatUSD(subAmt)} <small>(${(share * 100).toFixed(0)}%)</small></span>
                </div>
              `;
            }).join('')}
          </div>
        `;
      }

      let actionsHtml = '';
      if (b.id === 'schools') {
        actionsHtml = `
          <div class="entity-card-actions">
            <button class="btn-jump-action" data-jump-tab="tab-budgets">
              <span>🏛️</span> Full BOE $293.2M Budget Breakdown ➔
            </button>
            <button class="btn-jump-action secondary" data-jump-tab="tab-benefits">
              <span>🏥</span> School Benefits & Healthcare ($62.8M) ➔
            </button>
          </div>
        `;
      } else if (b.id === 'municipal') {
        actionsHtml = `
          <div class="entity-card-actions">
            <button class="btn-jump-action" data-jump-tab="tab-budgets">
              <span>🏛️</span> Full City $105.4M Budget Breakdown ➔
            </button>
            <button class="btn-jump-action secondary" data-jump-tab="tab-staff" data-jump-staff-filter="police">
              <span>👮</span> Police & Staff Payroll ➔
            </button>
          </div>
        `;
      } else if (b.id === 'county') {
        actionsHtml = `
          <div class="entity-card-actions">
            <button class="btn-jump-action" data-jump-tab="tab-surrounding">
              <span>🗺️</span> Compare Surrounding Town Rates ➔
            </button>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="card-top-row">
          <div class="entity-name">${b.entity}</div>
          <div class="entity-amt" style="color: ${b.color};">${formatUSD(entityAmt)}</div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span class="entity-pct-badge">${b.percentage.toFixed(2)}% of total bill (${b.rate}% per $100)</span>
          <span style="font-size: 0.82rem; color: var(--text-subtle);">${formatUSD(entityAmt / 12)} / month</span>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted);">${b.description}</p>
        ${componentsHtml}
        ${actionsHtml}
      `;
      container.appendChild(card);
    });
  }

  const slider = document.getElementById('calc-assessment-slider');

  input.addEventListener('input', () => {
    if (slider) slider.value = input.value;
    updateCalc();
  });

  if (slider) {
    slider.addEventListener('input', () => {
      input.value = slider.value;
      updateCalc();
    });
  }

  // Preset Buttons
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const val = btn.getAttribute('data-val');
      input.value = val;
      if (slider) slider.value = val;
      updateCalc();
    });
  });

  updateCalc();
}

// TAB 2: BUDGETS
function renderBudgets() {
  if (!boeBudgetData || !cityBudgetData) return;

  const boeContainer = document.getElementById('boe-line-items');
  boeContainer.innerHTML = boeBudgetData.majorAppropriations.map(item => {
    let actionBtn = '';
    const cat = item.category.toLowerCase();
    if (cat.includes('benefit') || cat.includes('insurance')) {
      actionBtn = `<button class="btn-jump-budget-link" data-jump-tab="tab-benefits">Explore Healthcare Plans, Copays & Benefit Costs ($62.8M) ➔</button>`;
    } else if (cat.includes('regular instructional') || cat.includes('administration')) {
      actionBtn = `<button class="btn-jump-budget-link" data-jump-tab="tab-staff" data-jump-staff-filter="boe">View School District Staff Directory & Salaries ➔</button>`;
    } else if (cat.includes('transportation') || cat.includes('facilities') || cat.includes('special')) {
      actionBtn = `<button class="btn-jump-budget-link" data-jump-tab="tab-vendors">View Vendor Warrant & Check Lists ➔</button>`;
    }

    return `
      <div class="line-item-row">
        <div class="line-header">
          <span>${item.category}</span>
          <span class="line-amt">${formatUSDWhole(item.amount)} (${item.percentage}%)</span>
        </div>
        <div class="line-desc">${item.details}</div>
        ${actionBtn ? `<div style="margin-top: 6px;">${actionBtn}</div>` : ''}
      </div>
    `;
  }).join('');

  const cityContainer = document.getElementById('city-line-items');
  cityContainer.innerHTML = cityBudgetData.majorAppropriations.map(item => {
    let actionBtn = '';
    const cat = item.category.toLowerCase();
    if (cat.includes('police') || cat.includes('safety')) {
      actionBtn = `<button class="btn-jump-budget-link" data-jump-tab="tab-staff" data-jump-staff-filter="police">View Police Salaries, Overtime & Details ➔</button>`;
    } else if (cat.includes('pension') || cat.includes('benefit')) {
      actionBtn = `<button class="btn-jump-budget-link" data-jump-tab="tab-benefits">View Municipal Benefit Liabilities ($24.4M) ➔</button>`;
    } else if (cat.includes('general government') || cat.includes('debt') || cat.includes('legal')) {
      actionBtn = `<button class="btn-jump-budget-link" data-jump-tab="tab-controversies">View Audit & PILOT Abatement Analyses ➔</button>`;
    }

    return `
      <div class="line-item-row">
        <div class="line-header">
          <span>${item.category}</span>
          <span class="line-amt">${formatUSDWhole(item.amount)} (${item.percentage}%)</span>
        </div>
        <div class="line-desc">${item.details}</div>
        ${actionBtn ? `<div style="margin-top: 6px;">${actionBtn}</div>` : ''}
      </div>
    `;
  }).join('');
}

// TAB: DEMOGRAPHICS & AREAS
function renderDemographics() {
  if (!demographicsData) return;

  const overview = demographicsData.cityOverview;
  const banner = document.getElementById('demo-citywide-banner');
  if (banner && overview) {
    banner.innerHTML = `
      <div class="demo-stat-box">
        <span class="demo-stat-label">Total Population</span>
        <span class="demo-stat-num">${overview.totalPopulation.toLocaleString()}</span>
        <span class="demo-stat-sub">32,840 Housing Units</span>
      </div>
      <div class="demo-stat-box">
        <span class="demo-stat-label">Median Household Income</span>
        <span class="demo-stat-num">${formatUSDWhole(overview.medianHouseholdIncome)}</span>
        <span class="demo-stat-sub">Per Capita: ${formatUSDWhole(overview.perCapitaIncome)}</span>
      </div>
      <div class="demo-stat-box">
        <span class="demo-stat-label">Median Age</span>
        <span class="demo-stat-num">${overview.medianAge} <small style="font-size: 0.9rem;">years</small></span>
        <span class="demo-stat-sub">Poverty Rate: ${overview.povertyRate}%</span>
      </div>
      <div class="demo-stat-box">
        <span class="demo-stat-label">Homeownership Ratio</span>
        <span class="demo-stat-num">${overview.ownerOccupiedRate}%</span>
        <span class="demo-stat-sub">Renters: ${overview.renterOccupiedRate}%</span>
      </div>
      <div class="demo-stat-box">
        <span class="demo-stat-label">Diversity & Global Roots</span>
        <span class="demo-stat-num">${overview.foreignBornPercentage}%</span>
        <span class="demo-stat-sub">45.2% Speak Non-English at Home</span>
      </div>
    `;
  }

  // ZIP Code Comparison Cards
  const zipContainer = document.getElementById('zip-cards-container');
  if (zipContainer && demographicsData.zipCodeComparison) {
    zipContainer.innerHTML = demographicsData.zipCodeComparison.map(z => `
      <div class="zip-card zip-${z.zip}">
        <div class="zip-badge-row">
          <span class="zip-code-title">ZIP ${z.zip}</span>
          <span class="pill-tag">${z.populationShare}% of Population</span>
        </div>
        <div class="zip-area-label">${z.areaName}</div>
        <div class="zip-neighborhoods"><strong>Neighborhoods:</strong> ${z.neighborhoodsIncluded}</div>

        <div class="zip-stat-table">
          <div class="metric-row">
            <span class="metric-name">Median Household Income:</span>
            <span class="metric-val" style="color: ${z.zip === '07013' ? 'var(--color-school)' : 'var(--color-city)'};">${formatUSDWhole(z.medianHouseholdIncome)}</span>
          </div>
          <div class="metric-row">
            <span class="metric-name">Median Age:</span>
            <span class="metric-val">${z.medianAge} Years</span>
          </div>
          <div class="metric-row">
            <span class="metric-name">Homeowner vs. Renter:</span>
            <span class="metric-val">${z.ownerOccupiedPercent}% Own / ${z.renterOccupiedPercent}% Rent</span>
          </div>
          <div class="metric-row">
            <span class="metric-name">Average Property Tax Bill:</span>
            <span class="metric-val">${formatUSD(z.averageAnnualTaxBill)} / yr (${formatUSD(z.monthlyTaxBill)}/mo)</span>
          </div>
          <div class="metric-row" style="background: #fef2f2; border: 1px solid #fecaca;">
            <span class="metric-name" style="color: #991b1b; font-weight: 700;">Property Tax Burden (% of Income):</span>
            <span class="metric-val" style="color: #991b1b;">${z.taxBurdenPercentOfIncome}% of Paycheck</span>
          </div>
          <div class="metric-row">
            <span class="metric-name">Share of Clifton Tax Base:</span>
            <span class="metric-val">${z.shareOfTotalTaxBase}% (Generates ${formatUSDWhole(z.totalResidentialLevyContribution)})</span>
          </div>
          <div class="metric-row">
            <span class="metric-name">Share of Public School Students:</span>
            <span class="metric-val">${z.schoolEnrollmentShare}% of District Enrollment</span>
          </div>
          <div class="metric-row">
            <span class="metric-name">Demographic Makeup:</span>
            <span class="metric-val" style="font-size: 0.78rem;">${z.demographicProfile.hispanicOrLatino}% Latino, ${z.demographicProfile.whiteNonHispanic}% White, ${z.demographicProfile.asian}% Asian</span>
          </div>
        </div>

        <div class="zip-takeaway-box">
          <h4>Key Fiscal Findings for ${z.zip}:</h4>
          <ul>
            ${z.keyFindings.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>
        <div class="card-action-bar-jumps" style="margin-top: 14px;">
          <button class="btn-jump-action" data-jump-tab="tab-properties" data-jump-neighborhood="ALL">
            <span>🔍</span> View Residential Assessments in ${z.zip} ➔
          </button>
          <button class="btn-jump-action secondary" data-jump-tab="tab-surrounding">
            <span>🗺️</span> Benchmark Disparities with Neighbor Towns ➔
          </button>
        </div>
      </div>
    `).join('');
  }

  // Neighborhoods Grid
  const neighContainer = document.getElementById('neighborhoods-container');
  if (neighContainer && demographicsData.neighborhoods) {
    neighContainer.innerHTML = demographicsData.neighborhoods.map(n => `
      <div class="neighborhood-card">
        <div class="n-header">
          <div class="n-top">
            <h4>${n.name}</h4>
            <span class="n-zip">ZIP ${n.zip}</span>
          </div>
          <div class="n-character">${n.character}</div>
        </div>

        <div class="n-metrics-grid">
          <div class="n-metric-box">
            <span class="n-metric-label">Median Income</span>
            <span class="n-metric-val">${formatUSDWhole(n.medianIncome)}</span>
          </div>
          <div class="n-metric-box">
            <span class="n-metric-label">Median Age</span>
            <span class="n-metric-val">${n.medianAge} yrs</span>
          </div>
          <div class="n-metric-box">
            <span class="n-metric-label">Avg Tax Bill</span>
            <span class="n-metric-val" style="color: var(--color-school);">${formatUSDWhole(n.avgTaxBill)}</span>
          </div>
          <div class="n-metric-box">
            <span class="n-metric-label">Tax Burden Ratio</span>
            <span class="n-metric-val" style="color: #b91c1c;">${n.taxBurdenPercentIncome}%</span>
          </div>
          <div class="n-metric-box">
            <span class="n-metric-label">Avg Home Value</span>
            <span class="n-metric-val">${formatUSDWhole(n.avgMarketValue)}</span>
          </div>
          <div class="n-metric-box">
            <span class="n-metric-label">Homeowners</span>
            <span class="n-metric-val">${n.ownerOccupied}%</span>
          </div>
        </div>

        <p class="n-desc">${n.description}</p>
        <div class="n-tax-dynamic">
          <strong>Tax Dynamic:</strong> ${n.taxDynamic}
        </div>
        <div class="card-action-bar-jumps" style="margin-top: 12px;">
          <button class="btn-jump-action" data-jump-tab="tab-properties" data-jump-neighborhood="${n.name}">
            <span>🏡</span> Filter 520 Properties in ${n.name} ➔
          </button>
        </div>
      </div>
    `).join('');
  }

  // Equity Takeaways Grid
  const takeContainer = document.getElementById('equity-takeaways-container');
  if (takeContainer && demographicsData.equityAnalysis) {
    takeContainer.innerHTML = demographicsData.equityAnalysis.keyTakeaways.map(t => `
      <div class="takeaway-card">
        <h4>${t.title}</h4>
        <p>${t.detail}</p>
        <div style="margin-top: 12px;">
          <button class="btn-jump-action secondary" data-jump-tab="tab-surrounding">
            <span>🗺️</span> Compare Tax Disparities with Neighbor Towns ➔
          </button>
        </div>
      </div>
    `).join('');
  }
}

// TAB: PROPERTY VALUES & ASSESSMENTS
function renderProperties(propsToRender) {
  if (!propertyAssessmentsData || !propertyAssessmentsData.properties) return;

  const list = propsToRender || propertyAssessmentsData.properties;
  currentFilteredProperties = list;

  // Update summary ribbon stats
  const metHighest = document.getElementById('met-highest-tax');
  const metLowest = document.getElementById('met-lowest-tax');
  const metAvg = document.getElementById('met-avg-tax');
  const countBadge = document.getElementById('prop-filter-count');
  const navBadge = document.getElementById('nav-prop-count');

  if (list.length > 0) {
    const highestTax = Math.max(...list.map(p => p.annualTax));
    const lowestTax = Math.min(...list.map(p => p.annualTax));
    const avgTax = list.reduce((acc, p) => acc + p.annualTax, 0) / list.length;
    if (metHighest) metHighest.textContent = `${formatUSD(highestTax)} / yr`;
    if (metLowest) metLowest.textContent = `${formatUSD(lowestTax)} / yr`;
    if (metAvg) metAvg.textContent = `${formatUSD(avgTax)} / yr`;
  }

  if (countBadge) {
    countBadge.textContent = `Showing ${list.length} of ${propertyAssessmentsData.properties.length} Properties`;
  }
  if (navBadge) {
    navBadge.textContent = list.length;
  }

  // Render Cards Grid
  const cardsContainer = document.getElementById('properties-cards-container');
  if (cardsContainer) {
    if (list.length === 0) {
      cardsContainer.innerHTML = `
        <div class="no-properties-msg">
          <div style="font-size: 2rem; margin-bottom: 8px;">🔍</div>
          <h4>No properties match your filter criteria</h4>
          <p>Try resetting filters or expanding bedroom, bathroom, or neighborhood selections.</p>
        </div>
      `;
    } else {
      cardsContainer.innerHTML = list.map(p => `
        <div class="property-card" data-id="${p.id}">
          <div class="prop-card-header">
            <div>
              <div class="prop-address">${p.address}</div>
              <div class="prop-neighborhood">📍 ${p.neighborhood} • ZIP ${p.zip}</div>
            </div>
            <span class="prop-tier-badge ${p.tierClass}">${p.taxTier}</span>
          </div>

          <div class="prop-main-tax-banner">
            <div class="prop-tax-label">2026 Annual Property Tax</div>
            <div class="prop-tax-amount">${formatUSD(p.annualTax)} <span class="tax-period">/ yr</span></div>
            <div class="prop-tax-splits">
              <span class="tax-split-item school-split">🏫 Schools: ${formatUSDWhole(p.schoolTax)}</span>
              <span class="tax-split-item city-split">🏛️ City: ${formatUSDWhole(p.municipalTax)}</span>
              <span class="tax-split-item county-split">🌳 County: ${formatUSDWhole(p.countyTax)}</span>
            </div>
          </div>

          <div class="prop-specs-grid">
            <div class="spec-item">
              <span class="spec-label">Bedrooms</span>
              <span class="spec-val">🛏️ ${p.bedrooms} Beds</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Bathrooms</span>
              <span class="spec-val">🚿 ${p.bathrooms} Baths</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Finished Sq Ft</span>
              <span class="spec-val">📐 ${p.squareFeet.toLocaleString()} sq ft</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Year Built</span>
              <span class="spec-val">🗓️ ${p.yearBuilt}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Assessed Value</span>
              <span class="spec-val highlight-assess">🏷️ ${formatUSDWhole(p.assessedTotal)}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Est. Market Value</span>
              <span class="spec-val">💎 ${formatUSDWhole(p.estimatedMarketValue)}</span>
            </div>
          </div>

          <div class="prop-extra-details">
            <div class="extra-detail-row">
              <span class="ed-label">Type:</span>
              <span class="ed-val">${p.propertyType}</span>
            </div>
            <div class="extra-detail-row">
              <span class="ed-label">Lot Size:</span>
              <span class="ed-val">${p.lotSize}</span>
            </div>
            <div class="extra-detail-row">
              <span class="ed-label">Garage & Basement:</span>
              <span class="ed-val">${p.garage} • ${p.basement}</span>
            </div>
            <div class="extra-detail-row">
              <span class="ed-label">Climate Control:</span>
              <span class="ed-val">${p.cooling} • ${p.heating}</span>
            </div>
            <div class="extra-detail-row">
              <span class="ed-label">Assessment ID:</span>
              <span class="ed-val font-mono">Block ${p.block}, Lot ${p.lot} (ID: ${p.id})</span>
            </div>
          </div>

          <div class="prop-card-actions">
            <button class="btn-load-calculator" onclick="loadPropertyToCalculator(${p.assessedTotal})">
              <span>🧮</span> Load in Tax Calculator & Line Items
            </button>
            <button class="btn-jump-prop-toolkit" data-jump-tab="tab-investigate" data-jump-search="${p.address}">
              <span>🔍</span> Cross-Reference Owner & Deed in Toolkit ➔
            </button>
            <button class="btn-jump-prop-area" data-jump-tab="tab-demographics">
              <span>📍</span> View ${p.neighborhood} Demographics ➔
            </button>
          </div>
        </div>
      `).join('');
    }
  }

  // Render Table View
  const tableBody = document.getElementById('properties-table-body');
  if (tableBody) {
    if (list.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="13" style="text-align: center; padding: 24px; color: var(--text-muted);">No properties match your filter criteria</td></tr>`;
    } else {
      tableBody.innerHTML = list.map(p => `
        <tr>
          <td>
            <strong>${p.address}</strong><br>
            <small style="color: var(--text-subtle);">${p.neighborhood}</small>
          </td>
          <td><span class="badge-zip">${p.zip}</span></td>
          <td>${p.propertyType}</td>
          <td><strong>${p.bedrooms}</strong></td>
          <td><strong>${p.bathrooms}</strong></td>
          <td>${p.squareFeet.toLocaleString()}</td>
          <td>${p.yearBuilt}</td>
          <td style="font-family: var(--font-mono); font-weight: 700; color: var(--color-school);">${formatUSDWhole(p.assessedTotal)}</td>
          <td style="font-family: var(--font-mono);">${formatUSDWhole(p.estimatedMarketValue)}</td>
          <td style="font-family: var(--font-mono); font-weight: 800; color: #dc2626;">${formatUSD(p.annualTax)}</td>
          <td style="font-family: var(--font-mono); color: var(--color-school);">${formatUSDWhole(p.schoolTax)}</td>
          <td><span class="prop-tier-badge ${p.tierClass}" style="font-size: 0.72rem; padding: 2px 6px;">${p.taxTier}</span></td>
          <td>
            <button class="btn-table-action" onclick="loadPropertyToCalculator(${p.assessedTotal})">
              Analyze
            </button>
          </td>
        </tr>
      `).join('');
    }
  }
}

// Load property assessment value into Calculator tab and switch tabs
function loadPropertyToCalculator(assessedValue) {
  const input = document.getElementById('calc-assessment-input');
  const slider = document.getElementById('calc-assessment-slider');
  if (input) {
    input.value = assessedValue;
    if (slider) slider.value = assessedValue;
    input.dispatchEvent(new Event('input'));
  }

  // Switch to Calculator tab smoothly
  switchTab('tab-calculator', { scrollToElement: '#calc-assessment-input' });
}

// Setup Property Filters & View Switching
function setupPropertyFilters() {
  const searchInput = document.getElementById('prop-search-input');
  const neighSelect = document.getElementById('prop-neighborhood-filter');
  const zipSelect = document.getElementById('prop-zip-filter');
  const typeSelect = document.getElementById('prop-type-filter');
  const bedsSelect = document.getElementById('prop-beds-filter');
  const bathsSelect = document.getElementById('prop-baths-filter');
  const tierSelect = document.getElementById('prop-tier-filter');
  const sortSelect = document.getElementById('prop-sort-by');
  const resetBtn = document.getElementById('btn-reset-prop-filters');

  const btnViewCards = document.getElementById('btn-view-cards');
  const btnViewTable = document.getElementById('btn-view-table');
  const cardsContainer = document.getElementById('properties-cards-container');
  const tableContainer = document.getElementById('properties-table-container');

  // View Switching
  if (btnViewCards && btnViewTable && cardsContainer && tableContainer) {
    btnViewCards.addEventListener('click', () => {
      btnViewCards.classList.add('active');
      btnViewTable.classList.remove('active');
      cardsContainer.style.display = 'grid';
      tableContainer.style.display = 'none';
    });

    btnViewTable.addEventListener('click', () => {
      btnViewTable.classList.add('active');
      btnViewCards.classList.remove('active');
      cardsContainer.style.display = 'none';
      tableContainer.style.display = 'block';
    });
  }

  function applyFilters() {
    if (!propertyAssessmentsData || !propertyAssessmentsData.properties) return;

    let filtered = [...propertyAssessmentsData.properties];

    // Search query
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    if (query) {
      filtered = filtered.filter(p => 
        p.address.toLowerCase().includes(query) ||
        p.neighborhood.toLowerCase().includes(query) ||
        p.zip.includes(query) ||
        p.id.toLowerCase().includes(query) ||
        `block ${p.block}`.includes(query) ||
        `lot ${p.lot}`.includes(query)
      );
    }

    // Neighborhood
    if (neighSelect && neighSelect.value !== 'ALL') {
      filtered = filtered.filter(p => p.neighborhood === neighSelect.value);
    }

    // Zip Code
    if (zipSelect && zipSelect.value !== 'ALL') {
      filtered = filtered.filter(p => p.zip === zipSelect.value);
    }

    // Property Type
    if (typeSelect && typeSelect.value !== 'ALL') {
      const tVal = typeSelect.value;
      if (tVal === 'Single Family') {
        filtered = filtered.filter(p => p.propertyType.includes('Single Family'));
      } else if (tVal === 'Two-Family') {
        filtered = filtered.filter(p => p.propertyType.includes('Two-Family'));
      } else if (tVal === 'Three-Family') {
        filtered = filtered.filter(p => p.propertyType.includes('Three-Family'));
      } else if (tVal === 'Condo') {
        filtered = filtered.filter(p => p.propertyType.includes('Condo') || p.propertyType.includes('Townhouse'));
      }
    }

    // Min Bedrooms
    if (bedsSelect && parseInt(bedsSelect.value, 10) > 0) {
      const minBeds = parseInt(bedsSelect.value, 10);
      filtered = filtered.filter(p => p.bedrooms >= minBeds);
    }

    // Min Bathrooms
    if (bathsSelect && parseFloat(bathsSelect.value) > 0) {
      const minBaths = parseFloat(bathsSelect.value);
      filtered = filtered.filter(p => p.bathrooms >= minBaths);
    }

    // Tax Tier
    if (tierSelect && tierSelect.value !== 'ALL') {
      filtered = filtered.filter(p => p.tierClass === tierSelect.value);
    }

    // Sort order
    if (sortSelect) {
      const sortVal = sortSelect.value;
      if (sortVal === 'tax-desc') {
        filtered.sort((a, b) => b.annualTax - a.annualTax);
      } else if (sortVal === 'tax-asc') {
        filtered.sort((a, b) => a.annualTax - b.annualTax);
      } else if (sortVal === 'assess-desc') {
        filtered.sort((a, b) => b.assessedTotal - a.assessedTotal);
      } else if (sortVal === 'sqft-desc') {
        filtered.sort((a, b) => b.squareFeet - a.squareFeet);
      } else if (sortVal === 'beds-desc') {
        filtered.sort((a, b) => b.bedrooms - a.bedrooms);
      } else if (sortVal === 'year-desc') {
        filtered.sort((a, b) => b.yearBuilt - a.yearBuilt);
      }
    }

    renderProperties(filtered);
  }

  applyPropertyFilters = applyFilters;

  // Attach event listeners
  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (neighSelect) neighSelect.addEventListener('change', applyFilters);
  if (zipSelect) zipSelect.addEventListener('change', applyFilters);
  if (typeSelect) typeSelect.addEventListener('change', applyFilters);
  if (bedsSelect) bedsSelect.addEventListener('change', applyFilters);
  if (bathsSelect) bathsSelect.addEventListener('change', applyFilters);
  if (tierSelect) tierSelect.addEventListener('change', applyFilters);
  if (sortSelect) sortSelect.addEventListener('change', applyFilters);

  // Reset Filters
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (neighSelect) neighSelect.value = 'ALL';
      if (zipSelect) zipSelect.value = 'ALL';
      if (typeSelect) typeSelect.value = 'ALL';
      if (bedsSelect) bedsSelect.value = '0';
      if (bathsSelect) bathsSelect.value = '0';
      if (tierSelect) tierSelect.value = 'ALL';
      if (sortSelect) sortSelect.value = 'tax-desc';
      applyFilters();
    });
  }
}

// TAB: SURROUNDING TOWNS COMPARISON
function renderSurroundingTowns() {
  if (!surroundingTownsData || !surroundingTownsData.towns) return;

  const tableBody = document.getElementById('surrounding-table-body');
  if (tableBody) {
    tableBody.innerHTML = surroundingTownsData.towns.map(t => {
      const isClifton = t.id === 'clifton';
      return `
        <tr class="${isClifton ? 'highlight-clifton-row' : ''}">
          <td>
            <strong>${t.name}</strong> ${isClifton ? '⭐ <em>(Focus)</em>' : ''}<br>
            <small style="color: var(--text-subtle);">${t.county} • ${t.relationship}</small>
          </td>
          <td style="font-family: var(--font-mono); font-weight: 700; ${isClifton ? 'color: #dc2626;' : ''}">${t.certifiedTaxRate.toFixed(3)}%</td>
          <td style="font-family: var(--font-mono);">${t.equalizationRatio.toFixed(1)}%</td>
          <td style="font-family: var(--font-mono); font-weight: 800; color: var(--color-school);">${t.effectiveTaxRateMarket.toFixed(3)}%</td>
          <td style="font-family: var(--font-mono);">${formatUSDWhole(t.medianHomeValueMarket)}</td>
          <td style="font-family: var(--font-mono); font-weight: 700;">${formatUSDWhole(t.medianAnnualTaxBill)}</td>
          <td style="font-family: var(--font-mono);">${formatUSDWhole(t.medianHouseholdIncome)}</td>
          <td style="font-family: var(--font-mono); font-weight: 700; color: ${t.taxBurdenPercentOfIncome > 15 ? '#b91c1c' : 'var(--text-main)'};">
            ${t.taxBurdenPercentOfIncome.toFixed(1)}%
          </td>
          <td style="font-family: var(--font-mono); color: var(--color-school); font-weight: 700;">${t.taxSplit.schoolsPercent.toFixed(1)}%</td>
        </tr>
      `;
    }).join('');
  }

  // Render Town Detail Cards
  const cardsContainer = document.getElementById('surrounding-cards-container');
  if (cardsContainer) {
    cardsContainer.innerHTML = surroundingTownsData.towns.map(t => {
      const isClifton = t.id === 'clifton';
      return `
        <div class="surround-card ${isClifton ? 'clifton-border' : ''}">
          <div class="surround-card-header">
            <div>
              <div class="surround-town-name">${t.name} ${isClifton ? '⭐' : ''}</div>
              <div class="surround-town-sub">${t.county} • ${t.relationship}</div>
            </div>
            <span class="pill-tag ${isClifton ? 'active-pill' : ''}">Pop. ${t.population.toLocaleString()}</span>
          </div>

          <div class="surround-tax-strip">
            <div class="s-tax-box">
              <span class="s-tax-label">Certified Rate</span>
              <span class="s-tax-val font-mono">${t.certifiedTaxRate.toFixed(3)}%</span>
            </div>
            <div class="s-tax-box">
              <span class="s-tax-label">Equalization</span>
              <span class="s-tax-val font-mono">${t.equalizationRatio.toFixed(1)}%</span>
            </div>
            <div class="s-tax-box">
              <span class="s-tax-label">Effective (True) Rate</span>
              <span class="s-tax-val font-mono highlight-school">${t.effectiveTaxRateMarket.toFixed(3)}%</span>
            </div>
          </div>

          <div class="surround-metrics-grid">
            <div class="sm-metric">
              <span class="sm-label">Median Annual Tax</span>
              <span class="sm-val font-mono">${formatUSDWhole(t.medianAnnualTaxBill)}</span>
              <span class="sm-sub">${formatUSDWhole(t.monthlyTaxBill)} / month</span>
            </div>
            <div class="sm-metric">
              <span class="sm-label">Median Household Income</span>
              <span class="sm-val font-mono">${formatUSDWhole(t.medianHouseholdIncome)}</span>
              <span class="sm-sub">Tax: ${t.taxBurdenPercentOfIncome.toFixed(1)}% of income</span>
            </div>
            <div class="sm-metric">
              <span class="sm-label">School District Budget</span>
              <span class="sm-val font-mono">${formatUSDWhole(t.schoolBudget)}</span>
              <span class="sm-sub">${t.taxSplit.schoolsPercent.toFixed(1)}% of tax check</span>
            </div>
            <div class="sm-metric">
              <span class="sm-label">Municipal Operating Budget</span>
              <span class="sm-val font-mono">${formatUSDWhole(t.municipalBudget)}</span>
              <span class="sm-sub">${t.taxSplit.municipalPercent.toFixed(1)}% of tax check</span>
            </div>
          </div>

          <div class="surround-notes">
            <strong>Watchdog Analysis:</strong> ${t.strengthsAndWatchdogNotes}
          </div>
          ${isClifton ? `
            <div class="card-action-bar-jumps">
              <button class="btn-jump-action" data-jump-tab="tab-properties">
                <span>🏡</span> Browse 520 Clifton Sample Properties ➔
              </button>
              <button class="btn-jump-action secondary" data-jump-tab="tab-calculator">
                <span>🧮</span> Calculate Your Property Taxes ➔
              </button>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  }

  // Render Comparative Takeaways
  const takeContainer = document.getElementById('surrounding-takeaways-container');
  if (takeContainer && surroundingTownsData.comparativeKeyFindings) {
    takeContainer.innerHTML = surroundingTownsData.comparativeKeyFindings.map(f => `
      <div class="takeaway-card">
        <h4>${f.title}</h4>
        <p>${f.detail}</p>
        <div style="margin-top: 10px;">
          <button class="btn-jump-action secondary" data-jump-tab="tab-demographics">
            <span>📍</span> Explore Clifton Demographics & ZIP Codes ➔
          </button>
        </div>
      </div>
    `).join('');
  }
}

// TAB: HEALTHCARE & BENEFITS
function renderBenefits() {
  if (!benefitsData) return;

  const plansContainer = document.getElementById('benefits-plans-container');
  if (plansContainer && benefitsData.healthcarePlans) {
    plansContainer.innerHTML = benefitsData.healthcarePlans.primaryPlans.map(p => `
      <div class="plan-item-box">
        <div class="plan-title">${p.planName}</div>
        <div class="plan-type-badge">${p.type}</div>
        <div class="plan-desc">${p.description}</div>
      </div>
    `).join('');
  }

  const costContainer = document.getElementById('benefits-cost-share-container');
  if (costContainer && benefitsData.costSharing) {
    costContainer.innerHTML = benefitsData.costSharing.rules.map(r => `
      <div class="cost-share-item">
        <div class="cost-share-header">${r.tier}</div>
        <div class="cost-stat-row">
          <span>Employee Out-of-Pocket:</span>
          <strong>${r.employeeContribution}</strong>
        </div>
        <div class="cost-stat-row">
          <span>Clifton Taxpayer Subsidy:</span>
          <strong style="color: var(--color-city);">${r.taxpayerContribution}</strong>
        </div>
        <div class="cost-example">${r.note}</div>
      </div>
    `).join('');
  }

  const retContainer = document.getElementById('benefits-retirement-container');
  if (retContainer && benefitsData.retirementAndLeaveBenefits) {
    retContainer.innerHTML = benefitsData.retirementAndLeaveBenefits.map(b => `
      <div class="retiree-benefit-card">
        <div class="retiree-title-row">
          <div class="retiree-name">${b.benefitName}</div>
          <div class="retiree-impact-tag">${b.taxpayerImpact}</div>
        </div>
        <div class="retiree-authority">Legal Basis: ${b.legalAuthority}</div>
        <div class="retiree-details">${b.details}</div>
        <div class="card-action-bar-jumps">
          <button class="btn-jump-alert" data-jump-tab="tab-controversies">
            <span>🚨</span> View Comptroller Sick Leave Audit ➔
          </button>
          <button class="btn-jump-action" data-jump-tab="tab-investigate" data-jump-opra="sickleave">
            <span>✉️</span> Generate OPRA Payout Request ➔
          </button>
        </div>
      </div>
    `).join('');
  }
}

// TAB: CONTROVERSIES & ETHICS ALERTS
function renderControversies() {
  if (!controversiesData) return;

  const container = document.getElementById('controversies-cards-container');
  if (!container) return;

  container.innerHTML = controversiesData.controversies.map(c => {
    let sevClass = 'sev-medium';
    if (c.severity === 'HIGH') sevClass = 'sev-high';
    if (c.severity === 'LOW') sevClass = 'sev-low';

    let opraKey = 'overtime';
    const cat = c.category.toLowerCase();
    const tit = c.title.toLowerCase();
    if (tit.includes('sick leave') || cat.includes('sick') || cat.includes('leave')) opraKey = 'sickleave';
    else if (tit.includes('pilot') || cat.includes('pilot')) opraKey = 'pilot';
    else if (tit.includes('police') || tit.includes('overtime') || cat.includes('police')) opraKey = 'overtime';
    else if (tit.includes('vendor') || tit.includes('bus') || tit.includes('legal') || cat.includes('contract')) opraKey = 'vendors';
    else if (tit.includes('contract') || tit.includes('superintendent') || cat.includes('administrator')) opraKey = 'contracts';

    return `
      <div class="controversy-card ${sevClass}">
        <div class="controversy-header">
          <div class="controversy-title-wrap">
            <span class="sev-badge ${sevClass}">${c.severity} WATCHDOG ALERT • ${c.category}</span>
            <h3 style="margin-top: 6px;">${c.title}</h3>
            <div class="controversy-entity">Entity: ${c.entityInvolved} | Updated: ${c.lastUpdated}</div>
          </div>
        </div>

        <div class="controversy-summary">${c.summary}</div>
        <div class="controversy-body">${c.investigationDetails}</div>

        <div class="controversy-impact-box">
          <div><strong>Taxpayer Impact:</strong> ${c.taxpayerImpact}</div>
          <div class="controversy-status"><strong>Current Oversight Status:</strong> ${c.status}</div>
        </div>

        <div class="card-action-bar-jumps">
          <button class="btn-jump-alert" data-jump-tab="tab-investigate" data-jump-opra="${opraKey}">
            <span>✉️</span> Draft OPRA Public Records Request on this Issue ➔
          </button>
          ${cat.includes('benefit') || cat.includes('leave') ? `
            <button class="btn-jump-action secondary" data-jump-tab="tab-benefits">
              <span>🏥</span> See Healthcare & Benefits Cost Data ➔
            </button>
          ` : ''}
          ${c.entityInvolved.includes('Board of Ed') ? `
            <button class="btn-jump-action secondary" data-jump-tab="tab-budgets">
              <span>🏛️</span> View Board of Ed Budget Line Items ➔
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// TAB 3: STAFF DIRECTORY
function renderStaffTable(filterEntity = 'all', searchQuery = '') {
  if (!staffData) return;

  const tbody = document.getElementById('staff-table-body');
  const q = searchQuery.toLowerCase().trim();

  const filtered = staffData.filter(s => {
    const matchesEntity = filterEntity === 'all' || s.entity === filterEntity;
    const matchesSearch = !q || 
      s.name.toLowerCase().includes(q) || 
      s.title.toLowerCase().includes(q) || 
      s.department.toLowerCase().includes(q) ||
      (s.notes && s.notes.toLowerCase().includes(q));
    return matchesEntity && matchesSearch;
  });

  // Sort by reported salary descending
  filtered.sort((a, b) => b.salaryReported - a.salaryReported);

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 24px; color: var(--text-subtle);">No matching positions found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(s => {
    const isSchool = s.entity.includes('Board of Education');
    const pillClass = isSchool ? 'pill-school' : 'pill-city';
    const salaryDisplay = s.salaryReported > 0 ? formatUSDWhole(s.salaryReported) : '$0 (Unpaid Public Service)';

    const hasEthics = (ethicsData || []).some(e => e.officialName.toLowerCase().includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(e.officialName.toLowerCase()));

    return `
      <tr>
        <td>
          <strong>${s.name}</strong>
          <div><small style="color: var(--text-subtle);">${s.title}</small></div>
          <div style="margin-top: 6px; display: flex; flex-wrap: wrap; gap: 4px;">
            ${hasEthics ? `<button class="btn-jump-tag" data-jump-tab="tab-ethics"><span>🏢</span> Outside Businesses & FDS ➔</button>` : ''}
            <button class="btn-jump-tag-search" data-jump-tab="tab-investigate" data-jump-search="${s.name}"><span>🔍</span> Check Deeds & Records ➔</button>
          </div>
        </td>
        <td>
          <span class="entity-pill ${pillClass}">${s.entity}</span>
          <div style="font-size: 0.8rem; margin-top: 4px; color: var(--text-muted);">${s.department}</div>
        </td>
        <td><small style="font-weight: 500;">${s.type}</small></td>
        <td class="text-right">
          <span class="salary-tag">${salaryDisplay}</span>
        </td>
        <td><small style="font-family: var(--font-mono);">${s.salaryRange}</small></td>
        <td style="max-width: 320px;"><small style="color: var(--text-muted);">${s.notes}</small></td>
      </tr>
    `;
  }).join('');
}

function setupStaffFilters() {
  const searchInput = document.getElementById('staff-search-input');
  const filterBtns = document.querySelectorAll('.filter-btn');
  let currentFilter = 'all';

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderStaffTable(currentFilter, searchInput.value);
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      renderStaffTable(currentFilter, searchInput.value);
    });
  });
}

// TAB 4: ETHICS & ASSETS
function renderEthicsCards() {
  if (!ethicsData) return;

  const container = document.getElementById('ethics-cards-container');
  container.innerHTML = ethicsData.map(d => {
    const businessesHtml = d.disclosedBusinesses.map(b => `
      <div class="business-item">
        <div class="business-name">${b.businessName}</div>
        <div class="business-detail"><strong>Role:</strong> ${b.ownership} | <strong>Type:</strong> ${b.nature} (${b.location})</div>
      </div>
    `).join('');

    const propertiesHtml = d.realEstateHoldings.map(p => `
      <div class="property-item">
        <div class="business-name">${p.description}</div>
        <div class="business-detail"><strong>Location:</strong> ${p.municipality} | <strong>Lookup:</strong> ${p.taxRecordLookup}</div>
      </div>
    `).join('');

    const incomeHtml = d.earnedIncomeSources.map(i => `<li style="font-size: 0.8rem; margin-bottom: 2px;">${i}</li>`).join('');

    const encodedName = encodeURIComponent(d.officialName.split(' ').pop()); // last name
    const propUrl = `https://tax1.co.monmouth.nj.us/cgi-bin/m4.cgi?district=1602&owner=${encodedName}`;

    return `
      <div class="ethics-card">
        <div class="ethics-header">
          <h3>${d.officialName}</h3>
          <div class="ethics-title">${d.publicTitle}</div>
          <div class="ethics-filing-type">${d.mandatoryFiling}</div>
        </div>

        <div class="section-label">Declared Businesses & Entities</div>
        ${businessesHtml}

        <div class="section-label">Real Estate & Property Assets</div>
        ${propertiesHtml}

        <div class="section-label">Earned Income Sources (> $2,000)</div>
        <ul style="padding-left: 18px; color: var(--text-muted); margin-bottom: 10px;">
          ${incomeHtml}
        </ul>

        <div class="conflict-notice">
          <strong>Ethics / Conflict Notice:</strong> ${d.conflictGuidance}
        </div>

        <div class="card-action-bar" style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px;">
          <a href="${propUrl}" target="_blank" rel="noopener" class="verify-link">
            🔍 Check Passaic County Tax Board for ${d.officialName} ↗
          </a>
          <button class="btn-jump-action secondary" data-jump-tab="tab-investigate" data-jump-search="${d.officialName}">
            <span>🔍</span> Search All Records in Toolkit ➔
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// TAB 5: VENDORS
function renderVendorsCards() {
  if (!vendorsData) return;

  const container = document.getElementById('vendors-cards-container');
  container.innerHTML = vendorsData.map(v => `
    <div class="vendor-card">
      <div class="vendor-entity">${v.entityServed} • ${v.category}</div>
      <h3>${v.vendorName}</h3>
      <div class="vendor-spend">~${formatUSDWhole(v.annualEstimatedSpend)} <small style="font-size: 0.8rem; color: var(--text-subtle);">/ year</small></div>
      <p class="vendor-desc">${v.description}</p>
      <div class="card-action-bar-jumps">
        <button class="btn-jump-action" data-jump-tab="tab-investigate" data-jump-opra="vendors">
          <span>📋</span> Request PO Invoices via OPRA ➔
        </button>
        <button class="btn-jump-action secondary" data-jump-tab="tab-investigate" data-jump-search="${v.vendorName}">
          <span>🏢</span> Search State Corporate Gateway ➔
        </button>
      </div>
    </div>
  `).join('');
}

// TAB 6: INVESTIGATION TOOLKIT
function setupInvestigationTools() {
  const propInput = document.getElementById('property-search-name');
  const propBtn = document.getElementById('btn-property-search');
  const propResult = document.getElementById('property-link-result');

  function performSearch() {
    if (!propInput || !propResult) return;
    const rawVal = propInput.value.trim();
    if (!rawVal) {
      propResult.innerHTML = `
        <div class="search-empty-state">
          <span>ℹ️</span> Please enter an official's name, department, street, or address above (e.g. <em>Grabowski</em>, <em>DeMarzo</em>, <em>Rinaldi</em>, <em>Sadrakula</em>, <em>Valley</em>, <em>Grove</em>, <em>07011</em>).
        </div>
      `;
      return;
    }

    const q = rawVal.toLowerCase();

    // 1. Search Staff
    const matchedStaff = (staffData || []).filter(s => {
      const name = (s.name || '').toLowerCase();
      const title = (s.title || '').toLowerCase();
      const dept = (s.department || '').toLowerCase();
      const employer = (s.employer || '').toLowerCase();
      return name.includes(q) || title.includes(q) || dept.includes(q) || employer.includes(q);
    });

    // 2. Search Ethics
    const matchedEthics = (ethicsData || []).filter(e => {
      const name = (e.officialName || '').toLowerCase();
      const title = (e.publicTitle || '').toLowerCase();
      const bus = (e.disclosedBusinesses || []).some(b => (b.businessName || '').toLowerCase().includes(q) || (b.nature || '').toLowerCase().includes(q));
      const props = (e.realEstateHoldings || []).some(p => (p.description || '').toLowerCase().includes(q) || (p.municipality || '').toLowerCase().includes(q));
      return name.includes(q) || title.includes(q) || bus || props;
    });

    // 3. Search Properties
    const matchedProperties = (propertyAssessmentsData && propertyAssessmentsData.properties ? propertyAssessmentsData.properties : []).filter(p => {
      const addr = (p.address || '').toLowerCase();
      const owner = (p.owner || '').toLowerCase();
      const neigh = (p.neighborhood || '').toLowerCase();
      const zip = (p.zip || '').toString().toLowerCase();
      const bl = (p.blockLot || p.id || '').toLowerCase();
      return addr.includes(q) || owner.includes(q) || neigh.includes(q) || zip.includes(q) || bl.includes(q);
    });

    // Gateways with prefilled queries
    const mod4Url = `https://tax1.co.monmouth.nj.us/cgi-bin/m4.cgi?district=1602&owner=${encodeURIComponent(rawVal)}`;
    const citeNetUrl = `https://www.cit-e.net/clifton-nj/cn/taxinquiry_edm/index.cfm?tpid=18705`;
    const fdsUrl = `https://fds.nj.gov`;
    const dorUrl = `https://www.njportal.com/DOR/BusinessNameSearch/`;

    let html = `
      <div class="search-results-wrapper">
        <div class="search-header-meta">
          <div class="search-count-title">
            <strong>Cross-Reference Results for "${rawVal}":</strong>
            <span class="count-pill staff-pill">${matchedStaff.length} Staff Matches</span>
            <span class="count-pill ethics-pill">${matchedEthics.length} Ethics Filings</span>
            <span class="count-pill prop-pill">${matchedProperties.length} Sample Properties</span>
          </div>
          <div class="search-portal-quicklinks">
            <span class="portal-quick-label">Direct External Searches:</span>
            <a href="${mod4Url}" target="_blank" rel="noopener" class="mini-portal-pill county-pill">Passaic MOD-IV Query for "${rawVal}" ↗</a>
            <a href="${citeNetUrl}" target="_blank" rel="noopener" class="mini-portal-pill city-pill">City Cit-e-Net Street Search ↗</a>
            <a href="${fdsUrl}" target="_blank" rel="noopener" class="mini-portal-pill fds-pill">NJ FDS Portal ↗</a>
            <a href="${dorUrl}" target="_blank" rel="noopener" class="mini-portal-pill biz-pill">NJ Business Registry ↗</a>
          </div>
        </div>
    `;

    // Render Staff matches
    if (matchedStaff.length > 0) {
      html += `
        <div class="result-block">
          <div class="result-block-heading">
            <span class="rb-icon">👤</span> <strong>City & Board of Education Staff Records (${matchedStaff.length})</strong>
          </div>
          <div class="result-cards-subgrid">
            ${matchedStaff.slice(0, 6).map(s => {
              const lastName = s.name.split(' ').pop();
              return `
              <div class="result-mini-card">
                <div class="rmc-header">
                  <strong>${s.name}</strong>
                  <span class="rmc-salary">${formatUSDWhole(s.salary)}</span>
                </div>
                <div class="rmc-sub">${s.title} • <em>${s.department}</em> (${s.employer})</div>
                <div class="rmc-note">${s.notes || ''}</div>
                <div class="rmc-actions">
                  <a href="https://tax1.co.monmouth.nj.us/cgi-bin/m4.cgi?district=1602&owner=${encodeURIComponent(lastName)}" target="_blank" rel="noopener" class="rmc-link">
                    Check County Tax Deed for "${lastName}" ↗
                  </a>
                </div>
              </div>
            `;}).join('')}
          </div>
        </div>
      `;
    }

    // Render Ethics matches
    if (matchedEthics.length > 0) {
      html += `
        <div class="result-block">
          <div class="result-block-heading">
            <span class="rb-icon">📑</span> <strong>State Financial Disclosures & Declared Assets (${matchedEthics.length})</strong>
          </div>
          <div class="result-cards-subgrid">
            ${matchedEthics.map(e => `
              <div class="result-mini-card ethics-matched-card">
                <div class="rmc-header">
                  <strong>${e.officialName}</strong>
                  <span class="rmc-tag">${e.mandatoryFiling}</span>
                </div>
                <div class="rmc-sub">${e.publicTitle}</div>
                <div class="rmc-body">
                  <strong>Declared Holdings:</strong>
                  ${(e.disclosedBusinesses || []).map(b => `<div class="rmc-item">• Business: ${b.businessName} (${b.ownership})</div>`).join('')}
                  ${(e.realEstateHoldings || []).map(r => `<div class="rmc-item">• Real Estate: ${r.description} (${r.municipality})</div>`).join('')}
                </div>
                <div class="rmc-guidance"><strong>Ethics Guidance:</strong> ${e.conflictGuidance}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Render Properties matches
    if (matchedProperties.length > 0) {
      html += `
        <div class="result-block">
          <div class="result-block-heading">
            <span class="rb-icon">🏡</span> <strong>Clifton Sample Assessment Rolls (${matchedProperties.length} ${matchedProperties.length > 6 ? `— showing first 6` : ''})</strong>
          </div>
          <div class="result-cards-subgrid">
            ${matchedProperties.slice(0, 6).map(p => {
              const streetWords = p.address.split(' ');
              const streetPart = streetWords.length > 1 ? streetWords.slice(1).join(' ') : p.address;
              return `
              <div class="result-mini-card prop-matched-card">
                <div class="rmc-header">
                  <strong>${p.address}</strong>
                  <span class="rmc-tax">${formatUSD(p.annualTax)} / yr</span>
                </div>
                <div class="rmc-sub">📍 ${p.neighborhood} • ZIP ${p.zip}</div>
                <div class="rmc-specs">
                  <span>🛏️ ${p.bedrooms} Beds</span>
                  <span>🚿 ${p.bathrooms} Baths</span>
                  <span>📐 ${p.squareFeet.toLocaleString()} sq ft</span>
                  <span>🏷️ Assessed: ${formatUSDWhole(p.assessedTotal)}</span>
                </div>
                <div class="rmc-actions">
                  <a href="https://tax1.co.monmouth.nj.us/cgi-bin/m4.cgi?district=1602&owner=${encodeURIComponent(streetPart)}" target="_blank" rel="noopener" class="rmc-link">
                    Open Passaic MOD-IV Roll for "${streetPart}" ↗
                  </a>
                </div>
              </div>
            `;}).join('')}
          </div>
        </div>
      `;
    }

    if (matchedStaff.length === 0 && matchedEthics.length === 0 && matchedProperties.length === 0) {
      html += `
        <div class="no-local-matches-box">
          <h4>No Direct Matches in Our Curated Sample</h4>
          <p>The term <strong>"${rawVal}"</strong> was not found in our curated sample of top administrators or sampled residential properties. Clifton has over 25,000 parcels and 2,000+ public employees. Use the official state and county gateways below to search the complete public record:</p>
          <div class="portal-cta-row">
            <a href="${mod4Url}" target="_blank" rel="noopener" class="action-btn-portal">
              Search All 25,000 Clifton Deeds in Passaic County MOD-IV for "${rawVal}" ↗
            </a>
            <a href="${citeNetUrl}" target="_blank" rel="noopener" class="action-btn-portal">
              Search City Cit-e-Net Assessment Portal ↗
            </a>
          </div>
        </div>
      `;
    }

    html += `</div>`;
    propResult.innerHTML = html;
  }

  if (propBtn) {
    propBtn.addEventListener('click', performSearch);
  }

  if (propInput) {
    propInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        performSearch();
      }
    });

    let debounceTimer;
    propInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      if (propInput.value.trim().length >= 2) {
        debounceTimer = setTimeout(performSearch, 300);
      } else if (propInput.value.trim().length === 0) {
        propResult.innerHTML = '';
      }
    });
  }

  // OPRA Preview, Target Display, Mailto Link & Copy
  const select = document.getElementById('opra-template-select');
  const preview = document.getElementById('opra-text-preview');
  const copyBtn = document.getElementById('btn-copy-opra');
  const targetEmail = document.getElementById('opra-recipient-email');
  const mailtoBtn = document.getElementById('btn-mailto-opra');

  function updateOpraState() {
    if (!select || !preview) return;
    const key = select.value;
    const body = opraTemplates[key] || '';
    preview.value = body;

    const meta = opraMeta[key] || {
      recipientEmail: 'opra@cliftonnj.org',
      recipientDisplay: 'opra@cliftonnj.org • Municipal Clerk Evelina Krajewski',
      subject: 'OPRA Public Records Request'
    };

    if (targetEmail) {
      targetEmail.textContent = meta.recipientDisplay;
    }

    if (mailtoBtn) {
      let mailtoHref = `mailto:${meta.recipientEmail}?subject=${encodeURIComponent(meta.subject)}`;
      if (meta.cc) {
        mailtoHref += `&cc=${encodeURIComponent(meta.cc)}`;
      }
      mailtoHref += `&body=${encodeURIComponent(body)}`;
      mailtoBtn.href = mailtoHref;
    }
  }

  if (select) {
    select.addEventListener('change', updateOpraState);
    updateOpraState();
  }

  if (copyBtn && preview) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(preview.value).then(() => {
        const orig = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span>✅</span> Copied to Clipboard!';
        setTimeout(() => { copyBtn.innerHTML = orig; }, 2000);
      });
    });
  }
}

// Launch
document.addEventListener('DOMContentLoaded', initApp);
