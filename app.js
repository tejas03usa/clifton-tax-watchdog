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
let propCurrentPage = 1;
const propPageSize = 36;

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
  renderIntelligenceReports();
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
            <span>🏡</span> Filter Properties in ${n.name} ➔
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

  // Render Family & School Enrollment Demographics
  renderFamilyAndSchools();
}

// Render Family Child Demographics & School Feeder Network
function renderFamilyAndSchools() {
  if (!demographicsData || !demographicsData.familyChildDemographics) return;

  const fData = demographicsData.familyChildDemographics;

  // 1. Family Stats Ribbon
  const ribbon = document.getElementById('family-stats-ribbon');
  if (ribbon && fData.citywide) {
    const c = fData.citywide;
    ribbon.innerHTML = `
      <div class="family-stat-box highlight-stat">
        <span class="f-stat-label">Families With Children</span>
        <span class="f-stat-val">${c.householdsWithChildrenPercent}%</span>
        <span class="f-stat-sub">${c.householdsWithChildrenUnder18.toLocaleString()} of ${c.totalHouseholds.toLocaleString()} Clifton households</span>
      </div>
      <div class="family-stat-box">
        <span class="f-stat-label">Public School Students</span>
        <span class="f-stat-val font-mono" style="color: var(--color-school);">${c.enrolledPublicSchools.toLocaleString()}</span>
        <span class="f-stat-sub">${c.enrolledPublicPercent}% of all ${c.totalSchoolAgeChildren.toLocaleString()} school-age kids</span>
      </div>
      <div class="family-stat-box">
        <span class="f-stat-label">East Clifton (07011) Share</span>
        <span class="f-stat-val" style="color: #dc2626;">53.2%</span>
        <span class="f-stat-sub">Supplies 5,720 students • Pays 36.7% school levy</span>
      </div>
      <div class="family-stat-box">
        <span class="f-stat-label">West Clifton (07013) Share</span>
        <span class="f-stat-val" style="color: #166534;">40.7%</span>
        <span class="f-stat-sub">Supplies 4,380 students • Pays 57.4% school levy</span>
      </div>
    `;
  }

  // 2. Family vs Tax Comparison Table
  const tableBody = document.getElementById('family-tax-table-body');
  if (tableBody && fData.zipBreakdown) {
    tableBody.innerHTML = fData.zipBreakdown.map(z => {
      const isRecipient = z.ratioStudentsToTaxes > 1.1;
      const isSubsidizer = z.ratioStudentsToTaxes < 0.9;
      const badgeClass = isRecipient ? 'badge-recipient' : (isSubsidizer ? 'badge-subsidizer' : 'badge-balanced');
      const badgeIcon = isRecipient ? '📥' : (isSubsidizer ? '📤' : '⚖️');
      return `
        <tr>
          <td>
            <strong>ZIP ${z.zip}</strong><br>
            <small style="color: var(--text-muted);">${z.area}</small>
          </td>
          <td><strong>${z.households.toLocaleString()}</strong></td>
          <td><span class="stat-highlight-tag">${z.householdsWithChildrenPercent}%</span></td>
          <td>${z.schoolAgeChildren.toLocaleString()}</td>
          <td style="font-weight: 700; color: var(--color-school);">${z.districtStudentsSent.toLocaleString()}</td>
          <td><strong>${z.districtStudentsPercent}%</strong></td>
          <td style="font-weight: 700; color: #b91c1c;">${z.residentialTaxSharePaid}%</td>
          <td>
            <span class="fiscal-badge ${badgeClass}">
              ${badgeIcon} ${z.ratioStudentsToTaxes}× (${z.subsidyStatus})
            </span>
          </td>
        </tr>
      `;
    }).join('');
  }

  // 3. School Feeder Cards Grid
  const schoolsGrid = document.getElementById('schools-cards-grid');
  const filterPills = document.querySelectorAll('#school-type-filters .filter-btn');

  function renderSchools(filterType = 'all') {
    if (!schoolsGrid || !fData.schools) return;

    let list = fData.schools;
    if (filterType !== 'all') {
      list = list.filter(s => s.type === filterType);
    }

    schoolsGrid.innerHTML = list.map(s => {
      const typeClass = s.type === 'Elementary' ? 'pill-school' : (s.type === 'Middle School' ? 'pill-city' : 'pill-county');
      return `
        <div class="school-card">
          <div class="school-card-top">
            <div>
              <span class="school-type-pill ${typeClass}">${s.type}</span>
              <h4 class="school-name">${s.name}</h4>
              <div class="school-address">📍 ${s.address}</div>
            </div>
            <div class="school-enrollment-badge">
              <span class="seb-num">${s.enrollment.toLocaleString()}</span>
              <span class="seb-label">Students</span>
            </div>
          </div>

          <div class="school-specs-grid">
            <div class="s-spec-item">
              <span class="s-spec-label">Grades Served</span>
              <span class="s-spec-val">🎒 ${s.grades}</span>
            </div>
            <div class="s-spec-item">
              <span class="s-spec-label">Attendance Zone</span>
              <span class="s-spec-val">🏘️ ${s.neighborhood}</span>
            </div>
            <div class="s-spec-item">
              <span class="s-spec-label">Kids In Zone</span>
              <span class="s-spec-val">👨‍👩‍👧 ${s.familiesWithKidsPercentInZone}% Families</span>
            </div>
            <div class="s-spec-item">
              <span class="s-spec-label">Student-Teacher</span>
              <span class="s-spec-val">👩‍🏫 ${s.studentTeacherRatio}</span>
            </div>
            <div class="s-spec-item">
              <span class="s-spec-label">Economically Disadvantaged</span>
              <span class="s-spec-val highlight-warn">${s.economicallyDisadvantagedPercent}%</span>
            </div>
            <div class="s-spec-item">
              <span class="s-spec-label">Multilingual / ELL</span>
              <span class="s-spec-val">${s.multilingualLearnersPercent}%</span>
            </div>
          </div>

          <div class="school-feeder-box">
            <span class="feeder-label">Feeder Pathway:</span>
            <div class="feeder-path">
              <span>${s.name}</span>
              ${s.feederMiddle !== 'N/A (Feeds into Clifton High School)' && !s.feederMiddle.startsWith('Receives') ? `➔ <span>${s.feederMiddle}</span>` : ''}
              ${s.type !== 'High School' ? `➔ <span>Clifton High School (CHS)</span>` : ''}
            </div>
          </div>

          <div class="school-notes-footer">
            ${s.notes}
          </div>
        </div>
      `;
    }).join('');
  }

  // Setup School Filter Buttons
  filterPills.forEach(btn => {
    btn.onclick = () => {
      filterPills.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-school-filter');
      renderSchools(filter);
    };
  });

  renderSchools('all');
}

// Pagination Range Helper
function getPaginationRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const delta = 2, range = [], rangeWithDots = [];
  let l;
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) range.push(i);
  }
  for (const i of range) {
    if (l) {
      if (i - l === 2) rangeWithDots.push(l + 1);
      else if (i - l !== 1) rangeWithDots.push('…');
    }
    rangeWithDots.push(i);
    l = i;
  }
  return rangeWithDots;
}

// Go to specific property pagination page
function goToPropertyPage(page) {
  if (!propertyAssessmentsData || !currentFilteredProperties) return;
  const totalPages = Math.max(1, Math.ceil(currentFilteredProperties.length / propPageSize));
  if (page < 1 || page > totalPages) return;
  propCurrentPage = page;
  renderProperties(currentFilteredProperties, propCurrentPage);
  
  const anchor = document.getElementById('properties-pagination-top') || document.getElementById('tab-properties');
  if (anchor) {
    anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Render Top and Bottom Pagination Controls
function renderPaginationControls(totalProps, currentPage, totalPages) {
  const topContainer = document.getElementById('properties-pagination-top');
  const bottomContainer = document.getElementById('properties-pagination-bottom');
  if (!topContainer && !bottomContainer) return;

  if (totalProps === 0 || totalPages <= 1) {
    if (topContainer) topContainer.innerHTML = '';
    if (bottomContainer) bottomContainer.innerHTML = '';
    return;
  }

  const startItem = (currentPage - 1) * propPageSize + 1;
  const endItem = Math.min(currentPage * propPageSize, totalProps);
  const pagesList = getPaginationRange(currentPage, totalPages);

  const pagesHtml = pagesList.map(item => {
    if (item === '…') {
      return `<span class="pagination-ellipsis">…</span>`;
    }
    const isActive = item === currentPage;
    return `
      <button class="pagination-btn ${isActive ? 'active' : ''}" 
              onclick="goToPropertyPage(${item})" 
              ${isActive ? 'aria-current="page"' : ''}
              title="Go to page ${item}">
        ${item}
      </button>
    `;
  }).join('');

  const paginationHtml = `
    <div class="pagination-bar">
      <div class="pagination-summary">
        Showing <strong>${startItem.toLocaleString()}–${endItem.toLocaleString()}</strong> of <strong>${totalProps.toLocaleString()}</strong> Homes (Page ${currentPage} of ${totalPages})
      </div>
      <div class="pagination-nav">
        <button class="pagination-nav-btn" 
                onclick="goToPropertyPage(1)" 
                ${currentPage <= 1 ? 'disabled' : ''} 
                title="First Page">
          « First
        </button>
        <button class="pagination-nav-btn" 
                onclick="goToPropertyPage(${currentPage - 1})" 
                ${currentPage <= 1 ? 'disabled' : ''} 
                title="Previous Page">
          ‹ Prev
        </button>
        <div class="pagination-pages-group">
          ${pagesHtml}
        </div>
        <button class="pagination-nav-btn" 
                onclick="goToPropertyPage(${currentPage + 1})" 
                ${currentPage >= totalPages ? 'disabled' : ''} 
                title="Next Page">
          Next ›
        </button>
        <button class="pagination-nav-btn" 
                onclick="goToPropertyPage(${totalPages})" 
                ${currentPage >= totalPages ? 'disabled' : ''} 
                title="Last Page">
          Last »
        </button>
      </div>
    </div>
  `;

  if (topContainer) topContainer.innerHTML = paginationHtml;
  if (bottomContainer) bottomContainer.innerHTML = paginationHtml;
}

// TAB: PROPERTY VALUES & ASSESSMENTS
function renderProperties(propsToRender, page) {
  if (!propertyAssessmentsData || !propertyAssessmentsData.properties) return;

  const list = propsToRender || propertyAssessmentsData.properties;
  currentFilteredProperties = list;

  const totalProps = list.length;
  const totalPages = Math.max(1, Math.ceil(totalProps / propPageSize));
  if (typeof page === 'number') {
    propCurrentPage = Math.min(Math.max(1, page), totalPages);
  } else {
    propCurrentPage = Math.min(Math.max(1, propCurrentPage), totalPages);
  }

  const startIndex = (propCurrentPage - 1) * propPageSize;
  const endIndex = Math.min(startIndex + propPageSize, totalProps);
  const pageItems = list.slice(startIndex, endIndex);

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
    if (totalProps === 0) {
      countBadge.textContent = `0 of ${propertyAssessmentsData.properties.length.toLocaleString()} Properties`;
    } else {
      countBadge.textContent = `Showing ${startIndex + 1}–${endIndex} of ${totalProps.toLocaleString()} Properties (Page ${propCurrentPage} of ${totalPages})`;
    }
  }
  if (navBadge) {
    navBadge.textContent = totalProps.toLocaleString();
  }

  // Render Cards Grid (Paginated)
  const cardsContainer = document.getElementById('properties-cards-container');
  if (cardsContainer) {
    if (totalProps === 0) {
      cardsContainer.innerHTML = `
        <div class="no-properties-msg">
          <div style="font-size: 2rem; margin-bottom: 8px;">🔍</div>
          <h4>No properties match your filter criteria</h4>
          <p>Try resetting filters or expanding bedroom, bathroom, or neighborhood selections.</p>
        </div>
      `;
    } else {
      cardsContainer.innerHTML = pageItems.map(p => `
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

  // Render Table View (Paginated)
  const tableBody = document.getElementById('properties-table-body');
  if (tableBody) {
    if (totalProps === 0) {
      tableBody.innerHTML = `<tr><td colspan="13" style="text-align: center; padding: 24px; color: var(--text-muted);">No properties match your filter criteria</td></tr>`;
    } else {
      tableBody.innerHTML = pageItems.map(p => `
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

  // Render Top & Bottom Pagination Controls
  renderPaginationControls(totalProps, propCurrentPage, totalPages);
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

    propCurrentPage = 1;
    renderProperties(filtered, 1);
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
      propCurrentPage = 1;
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
                <span>🏡</span> Browse 1,850 Clifton Sample Properties ➔
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

// TAB 5: JOINED INTELLIGENCE & CROSS-DATASET REPORTS
function renderIntelligenceReports() {
  // 1. Sub-nav toolbar switching
  const navBtns = document.querySelectorAll('.intel-nav-btn');
  const panels = {
    receipt: document.getElementById('intel-report-receipt'),
    homes: document.getElementById('intel-report-homes'),
    balance: document.getElementById('intel-report-balance'),
    vintage: document.getElementById('intel-report-vintage')
  };

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const report = btn.getAttribute('data-report');
      navBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      Object.entries(panels).forEach(([k, panel]) => {
        if (!panel) return;
        if (k === report) {
          panel.style.display = 'block';
          panel.classList.add('active');
        } else {
          panel.style.display = 'none';
          panel.classList.remove('active');
        }
      });
    });
  });

  // ----------------------------------------------------
  // REPORT 1: ITEMIZED TAX GROCERY RECEIPT
  // ----------------------------------------------------
  const receiptInput = document.getElementById('receipt-assessed-input');
  const presetBtns = document.querySelectorAll('.receipt-quick-presets .preset-btn');
  const receiptItemsBody = document.getElementById('receipt-items-body');
  const copyReceiptBtn = document.getElementById('btn-copy-receipt');

  // Exact sub-service schedule (percentages and rates totaling 6.527%)
  const receiptSchedule = [
    // School Group (3.111% total)
    { id: 'sch-teach', category: 'Schools', name: 'Certified Classroom Teachers & Instruction', rate: 1.1822, pct: 18.11, tag: 'BOE' },
    { id: 'sch-ben', category: 'Schools', name: 'School Employee Health & Pension Benefits', rate: 0.6844, pct: 10.49, tag: 'BOE' },
    { id: 'sch-sped', category: 'Schools', name: 'Special Education & Mandated Placements', rate: 0.4978, pct: 7.63, tag: 'BOE' },
    { id: 'sch-plant', category: 'Schools', name: 'School Plant, Utilities & Custodial Care', rate: 0.3111, pct: 4.77, tag: 'BOE' },
    { id: 'sch-admin', category: 'Schools', name: 'School Principals & District Administration', rate: 0.1867, pct: 2.86, tag: 'BOE' },
    { id: 'sch-bus', category: 'Schools', name: 'Student Transportation & District Busing', rate: 0.1556, pct: 2.38, tag: 'BOE' },
    { id: 'sch-supp', category: 'Schools', name: 'Student Guidance, Counseling & Athletics', rate: 0.0932, pct: 1.42, tag: 'BOE' },

    // Municipal Group (1.920% total)
    { id: 'mun-pol', category: 'City', name: 'Clifton Police Department & Patrol Operations', rate: 0.5184, pct: 7.94, tag: 'CITY' },
    { id: 'mun-ben', category: 'City', name: 'Municipal Police/Fire Pensions & Health Benefits', rate: 0.3840, pct: 5.88, tag: 'CITY' },
    { id: 'mun-fire', category: 'City', name: 'Clifton Fire Department & Emergency Medical', rate: 0.3648, pct: 5.59, tag: 'CITY' },
    { id: 'mun-dpw', category: 'City', name: 'Department of Public Works (Streets, Trash, Snow)', rate: 0.2688, pct: 4.12, tag: 'CITY' },
    { id: 'mun-debt', category: 'City', name: 'Municipal Debt Service & Capital Bond Principal', rate: 0.1728, pct: 2.65, tag: 'CITY' },
    { id: 'mun-adm', category: 'City', name: 'City Hall Governance, Legal, Finance & Assessor', rate: 0.1152, pct: 1.76, tag: 'CITY' },
    { id: 'mun-lib', category: 'City', name: 'Clifton Public Library & Health Clinic Services', rate: 0.0960, pct: 1.47, tag: 'CITY' },

    // County Group (1.496% total)
    { id: 'cty-shrf', category: 'County', name: 'Passaic County Sheriff, Jail & Courthouse Security', rate: 0.4189, pct: 6.42, tag: 'PASSAIC' },
    { id: 'cty-soc', category: 'County', name: 'County Social Services, Public Health & Welfare', rate: 0.3291, pct: 5.04, tag: 'PASSAIC' },
    { id: 'cty-rds', category: 'County', name: 'Passaic County Roads, Bridges & Traffic Signals', rate: 0.2992, pct: 4.58, tag: 'PASSAIC' },
    { id: 'cty-jud', category: 'County', name: 'Passaic County Courts, Prosecutor & Surrogate', rate: 0.2094, pct: 3.21, tag: 'PASSAIC' },
    { id: 'cty-park', category: 'County', name: 'Garret Mountain Parks & PCCC College Share', rate: 0.2394, pct: 3.67, tag: 'PASSAIC' }
  ];

  function updateReceipt() {
    if (!receiptInput) return;
    const assessed = parseFloat(receiptInput.value) || 0;
    const totalRate = 6.527; // Certified 2026 Rate
    const totalTax = (assessed / 100) * totalRate;
    const monthlyTax = totalTax / 12;
    const dailyTax = totalTax / 365;

    const schoolTax = (assessed / 100) * 3.111;
    const muniTax = (assessed / 100) * 1.920;
    const countyTax = (assessed / 100) * 1.496;

    // Update summary pills & slips
    const elAnn = document.getElementById('receipt-summary-annual');
    const elMo = document.getElementById('receipt-summary-monthly');
    const elDay = document.getElementById('receipt-summary-daily');
    if (elAnn) elAnn.textContent = formatUSD(totalTax);
    if (elMo) elMo.textContent = `${formatUSD(monthlyTax)} / mo`;
    if (elDay) elDay.textContent = `${formatUSD(dailyTax)} / day`;

    const elSlipAss = document.getElementById('receipt-slip-assessment');
    const elSlipTot = document.getElementById('receipt-slip-total');
    const elSlipMo = document.getElementById('receipt-slip-monthly');
    const elSlipDay = document.getElementById('receipt-slip-daily');
    const elSlipSch = document.getElementById('receipt-subtotal-schools');
    const elSlipMun = document.getElementById('receipt-subtotal-muni');
    const elSlipCty = document.getElementById('receipt-subtotal-county');

    if (elSlipAss) elSlipAss.textContent = formatUSD(assessed);
    if (elSlipTot) elSlipTot.textContent = formatUSD(totalTax);
    if (elSlipMo) elSlipMo.textContent = formatUSD(monthlyTax);
    if (elSlipDay) elSlipDay.textContent = formatUSD(dailyTax);
    if (elSlipSch) elSlipSch.textContent = formatUSD(schoolTax);
    if (elSlipMun) elSlipMun.textContent = formatUSD(muniTax);
    if (elSlipCty) elSlipCty.textContent = formatUSD(countyTax);

    // Build Receipt Line Items
    if (receiptItemsBody) {
      receiptItemsBody.innerHTML = receiptSchedule.map(item => {
        const lineCost = (assessed / 100) * item.rate;
        const lineMonthly = lineCost / 12;
        return `
          <div class="receipt-item-row">
            <div class="receipt-item-desc">
              <span class="item-tag tag-${item.category.toLowerCase()}">${item.tag}</span>
              <span class="item-title">${item.name}</span>
            </div>
            <div class="receipt-item-numbers">
              <span class="item-annual">${formatUSD(lineCost)}</span>
              <span class="item-mo">${formatUSD(lineMonthly)}/mo</span>
            </div>
          </div>
        `;
      }).join('');
    }

    // Dynamic Takeaways
    const takeawaysList = document.getElementById('receipt-takeaways');
    if (takeawaysList) {
      const teacherCost = (assessed / 100) * 1.1822;
      const combinedBen = (assessed / 100) * (0.6844 + 0.3840);
      const policeCost = (assessed / 100) * 0.5184;
      takeawaysList.innerHTML = `
        <li><strong>Classroom Instruction:</strong> You pay <strong>${formatUSD(teacherCost)}/year</strong> (${formatUSD(teacherCost/12)}/mo) directly to teachers and educational materials.</li>
        <li><strong>Health & Pensions:</strong> Public employee benefits across schools and City Hall cost you <strong>${formatUSD(combinedBen)}/year</strong> (${formatUSD(combinedBen/12)}/mo).</li>
        <li><strong>Police & Patrol:</strong> Clifton Police operations account for <strong>${formatUSD(policeCost)}/year</strong> (${formatUSD(policeCost/12)}/mo).</li>
        <li><strong>Daily Rate:</strong> Living in Clifton costs <strong>${formatUSD(dailyTax)} per 24 hours</strong> in municipal, school, and county taxes.</li>
      `;
    }
  }

  // Preset button clicks
  presetBtns.forEach(p => {
    p.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      p.classList.add('active');
      const val = p.getAttribute('data-val');
      if (receiptInput) {
        receiptInput.value = val;
        updateReceipt();
      }
    });
  });

  if (receiptInput) {
    receiptInput.addEventListener('input', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      updateReceipt();
    });
  }

  if (copyReceiptBtn) {
    copyReceiptBtn.addEventListener('click', () => {
      const assessed = parseFloat(receiptInput?.value) || 214000;
      const totalTax = (assessed / 100) * 6.527;
      let text = `========================================\n`;
      text += `    CITY OF CLIFTON & BOE TAX RECEIPT\n`;
      text += `========================================\n`;
      text += `ASSESSMENT: ${formatUSD(assessed)}\n`;
      text += `2026 CERTIFIED RATE: 6.527%\n`;
      text += `----------------------------------------\n`;
      receiptSchedule.forEach(item => {
        const cost = (assessed / 100) * item.rate;
        text += `[${item.tag.padEnd(7)}] ${item.name.padEnd(32)} ${formatUSD(cost).padStart(10)}\n`;
      });
      text += `----------------------------------------\n`;
      text += `TOTAL ANNUAL TAX: ${formatUSD(totalTax)}\n`;
      text += `MONTHLY ESCROW:   ${formatUSD(totalTax / 12)} / mo\n`;
      text += `DAILY COST:       ${formatUSD(totalTax / 365)} / day\n`;
      text += `========================================\n`;
      text += `Source: clifton-tax-watchdog.github.io\n`;

      navigator.clipboard.writeText(text).then(() => {
        const orig = copyReceiptBtn.innerHTML;
        copyReceiptBtn.innerHTML = `<span>✅</span> Copied Plaintext Receipt!`;
        setTimeout(() => { copyReceiptBtn.innerHTML = orig; }, 2200);
      });
    });
  }

  updateReceipt();

  // ----------------------------------------------------
  // REPORT 2: HOMES TO FUND SALARIES EQUIVALENCY
  // ----------------------------------------------------
  const homesTableBody = document.getElementById('homes-table-body');
  const homesEntityBtns = document.querySelectorAll('#homes-entity-filters .filter-pill-btn');
  const homesSortSelect = document.getElementById('homes-sort-select');

  // Benchmark home: $214,000 assessed value
  const benchAssessed = 214000;
  const benchSchoolTax = (benchAssessed / 100) * 3.111; // $6,657.54
  const benchCityTax = (benchAssessed / 100) * 1.920;   // $4,108.80

  function renderHomesTable() {
    if (!homesTableBody || !staffData) return;
    const activeEntityBtn = document.querySelector('#homes-entity-filters .filter-pill-btn.active');
    const entityFilter = activeEntityBtn ? activeEntityBtn.getAttribute('data-entity') : 'all';
    const sortVal = homesSortSelect ? homesSortSelect.value : 'homes-desc';

    let list = (staffData.staff ? staffData.staff : staffData).filter(s => (s.salaryReported || 0) > 0);

    if (entityFilter !== 'all') {
      list = list.filter(s => s.entity === entityFilter);
    }

    list = list.map(s => {
      const isSchool = s.entity && s.entity.includes('Board of Education');
      const annualTaxPerHome = isSchool ? benchSchoolTax : benchCityTax;
      const homesRequired = s.salaryReported / annualTaxPerHome;
      return {
        ...s,
        isSchool,
        annualTaxPerHome,
        homesRequired
      };
    });

    if (sortVal === 'homes-desc') {
      list.sort((a, b) => b.homesRequired - a.homesRequired);
    } else if (sortVal === 'salary-desc') {
      list.sort((a, b) => b.salaryReported - a.salaryReported);
    } else if (sortVal === 'name-asc') {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    homesTableBody.innerHTML = list.map(s => {
      const entityClass = s.isSchool ? 'badge-school' : 'badge-city';
      const entityTaxRate = s.isSchool ? '3.111% ($6,658/home)' : '1.920% ($4,109/home)';
      const entityLabel = s.isSchool ? 'School Tax' : 'City Tax';
      const homesCountFormatted = s.homesRequired.toFixed(1);

      return `
        <tr>
          <td>
            <strong>${s.name}</strong>
            <div class="table-subtext">${s.title} • <span class="text-subtle">${s.department || ''}</span></div>
          </td>
          <td>
            <span class="status-badge ${entityClass}">${s.entity}</span>
          </td>
          <td>
            <span class="salary-highlight">${formatUSDWhole(s.salaryReported)}</span>
            <div class="table-subtext">${s.type || 'Annual Salary'}</div>
          </td>
          <td>
            <code>${entityTaxRate}</code>
          </td>
          <td>
            <div class="homes-count-badge">
              <span class="homes-number">${homesCountFormatted}</span>
              <span class="homes-text">Clifton Homes</span>
            </div>
            <div class="homes-progress-bar">
              <div class="homes-progress-fill ${s.isSchool ? 'fill-school' : 'fill-city'}" style="width: ${Math.min(100, (s.homesRequired / 55) * 100)}%;"></div>
            </div>
          </td>
          <td>
            <span class="homes-context-desc">
              Requires 100% of the annual ${entityLabel} check from <strong>${Math.round(s.homesRequired)}</strong> average households ($214k assessed).
            </span>
          </td>
        </tr>
      `;
    }).join('');
  }

  homesEntityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      homesEntityBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderHomesTable();
    });
  });

  if (homesSortSelect) {
    homesSortSelect.addEventListener('change', renderHomesTable);
  }

  renderHomesTable();

  // ----------------------------------------------------
  // REPORT 3: NEIGHBORHOOD FISCAL BALANCE SHEET
  // ----------------------------------------------------
  const balanceCardsContainer = document.getElementById('balance-sheet-cards');
  const balanceSchoolsBody = document.getElementById('balance-schools-body');

  function renderBalanceSheet() {
    if (!balanceCardsContainer || !demographicsData) return;
    const zipData = demographicsData.familyChildDemographics?.zipBreakdown || [];
    const perPupilCost = boeBudgetData?.perPupilSpending || 22450;
    const totalLevy = 161850000;

    balanceCardsContainer.innerHTML = zipData.map(z => {
      const schoolTaxesEst = (z.residentialTaxSharePaid / 100) * totalLevy;
      const schoolCostConsumed = z.districtStudentsSent * perPupilCost;
      const netLocalGap = schoolTaxesEst - schoolCostConsumed;
      const isDonor = netLocalGap >= 0;
      const statusBadge = isDonor
        ? `<span class="balance-badge donor">Net Tax Donor (+${formatUSDWhole(netLocalGap)})</span>`
        : `<span class="balance-badge recipient">Net Recipient (${formatUSDWhole(netLocalGap)})</span>`;

      return `
        <div class="balance-card ${isDonor ? 'card-donor' : 'card-recipient'}">
          <div class="bc-header">
            <div>
              <span class="bc-zip">ZIP ${z.zip}</span>
              <h4 class="bc-area">${z.area}</h4>
            </div>
            ${statusBadge}
          </div>

          <div class="bc-stats-grid">
            <div class="bc-stat">
              <span class="bc-stat-lbl">Households</span>
              <span class="bc-stat-val">${z.households.toLocaleString()}</span>
              <span class="bc-stat-sub">${z.householdsWithChildrenPercent}% with kids</span>
            </div>
            <div class="bc-stat">
              <span class="bc-stat-lbl">District Students</span>
              <span class="bc-stat-val">${z.districtStudentsSent.toLocaleString()}</span>
              <span class="bc-stat-sub">${z.districtStudentsPercent}% of Clifton total</span>
            </div>
            <div class="bc-stat">
              <span class="bc-stat-lbl">School Taxes Paid</span>
              <span class="bc-stat-val ${isDonor ? 'val-donor' : ''}">${formatUSDWhole(schoolTaxesEst)}</span>
              <span class="bc-stat-sub">${z.residentialTaxSharePaid}% of city levy</span>
            </div>
            <div class="bc-stat">
              <span class="bc-stat-lbl">School Costs Consumed</span>
              <span class="bc-stat-val">${formatUSDWhole(schoolCostConsumed)}</span>
              <span class="bc-stat-sub">@ ${formatUSDWhole(perPupilCost)} / student</span>
            </div>
          </div>

          <div class="bc-driver-box">
            <strong>Key Fiscal Driver:</strong> ${z.keyDriver}
          </div>

          <div class="bc-footer">
            <span class="bc-feeder-lbl">Primary Middle School Feeder:</span>
            <strong>${z.primaryFeeder}</strong>
          </div>
        </div>
      `;
    }).join('');

    // Populate Schools Feeder Table
    if (balanceSchoolsBody && demographicsData.familyChildDemographics?.schools) {
      const schools = demographicsData.familyChildDemographics.schools;
      balanceSchoolsBody.innerHTML = schools.map(s => {
        const annualCost = s.enrollment * perPupilCost;
        return `
          <tr>
            <td>
              <strong>${s.name}</strong>
              <div class="table-subtext">${s.address}</div>
            </td>
            <td>
              <span class="status-badge badge-school">${s.type}</span>
              <span class="table-subtext">${s.grades}</span>
            </td>
            <td>${s.neighborhood}</td>
            <td><strong>${s.enrollment.toLocaleString()}</strong></td>
            <td><strong class="salary-highlight">${formatUSDWhole(annualCost)}</strong></td>
            <td>
              <span class="econ-pill">${s.economicallyDisadvantagedPercent}%</span>
            </td>
            <td>${s.feederMiddle}</td>
          </tr>
        `;
      }).join('');
    }
  }

  renderBalanceSheet();

  // ----------------------------------------------------
  // REPORT 4: TAX PER SQ FT & HOUSING VINTAGE DISPARITY
  // ----------------------------------------------------
  const vintageCardsContainer = document.getElementById('vintage-summary-cards');
  const vintageTableBody = document.getElementById('vintage-table-body');
  const vintageFilterBtns = document.querySelectorAll('#vintage-filter-pills .filter-pill-btn');

  function renderVintageAnalysis() {
    if (!vintageCardsContainer || !propertyAssessmentsData?.properties) return;
    const props = propertyAssessmentsData.properties;

    // Categorize into 5 vintages
    const eraDefinitions = [
      { key: 'Pre-1940', title: 'Pre-1940 (Historic Industrial)', filter: p => p.yearBuilt < 1940 },
      { key: '1940-1959', title: '1940–1959 (Post-War Expansion)', filter: p => p.yearBuilt >= 1940 && p.yearBuilt < 1960 },
      { key: '1960-1979', title: '1960–1979 (Mid-Century Suburbia)', filter: p => p.yearBuilt >= 1960 && p.yearBuilt < 1980 },
      { key: '1980-1999', title: '1980–1999 (Modern Subdivisions)', filter: p => p.yearBuilt >= 1980 && p.yearBuilt < 2000 },
      { key: '2000+', title: '2000+ (Recent Construction & Luxury)', filter: p => p.yearBuilt >= 2000 }
    ];

    const stats = eraDefinitions.map(era => {
      const eraProps = props.filter(era.filter);
      const count = eraProps.length;
      const totalAssessed = eraProps.reduce((sum, p) => sum + (p.assessedTotal || 0), 0);
      const totalTax = eraProps.reduce((sum, p) => sum + (p.annualTax || 0), 0);
      const totalSqFt = eraProps.reduce((sum, p) => sum + (p.squareFeet || 1500), 0);
      const totalMarket = eraProps.reduce((sum, p) => sum + (p.estimatedMarketValue || 0), 0);

      const avgAssessed = count ? Math.round(totalAssessed / count) : 0;
      const avgTax = count ? Math.round(totalTax / count) : 0;
      const avgSqFt = count ? Math.round(totalSqFt / count) : 0;
      const taxPerSqFt = totalSqFt ? +(totalTax / totalSqFt).toFixed(2) : 0;
      const effectiveRate = totalMarket ? +((totalTax / totalMarket) * 100).toFixed(2) : 0;

      return {
        ...era,
        count,
        avgAssessed,
        avgTax,
        avgSqFt,
        taxPerSqFt,
        effectiveRate
      };
    });

    vintageCardsContainer.innerHTML = stats.map(s => {
      return `
        <div class="vintage-card">
          <div class="vc-top">
            <span class="vc-tag">${s.key}</span>
            <span class="vc-count">${s.count} Properties</span>
          </div>
          <h4 class="vc-title">${s.title}</h4>
          
          <div class="vc-metric-highlight">
            <span class="vc-big-val">$${s.taxPerSqFt.toFixed(2)}</span>
            <span class="vc-big-lbl">Tax per Square Foot</span>
          </div>

          <div class="vc-stats-list">
            <div class="vc-row">
              <span>Avg Annual Tax:</span>
              <strong>${formatUSDWhole(s.avgTax)}</strong>
            </div>
            <div class="vc-row">
              <span>Avg Home Size:</span>
              <strong>${s.avgSqFt.toLocaleString()} sq ft</strong>
            </div>
            <div class="vc-row">
              <span>Avg Assessed Value:</span>
              <strong>${formatUSDWhole(s.avgAssessed)}</strong>
            </div>
            <div class="vc-row">
              <span>Effective Market Tax Rate:</span>
              <strong>${s.effectiveRate}%</strong>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Render sample properties table
    function renderVintageTable(filterKey) {
      if (!vintageTableBody) return;
      let sampleList = props;
      if (filterKey !== 'all') {
        const era = eraDefinitions.find(e => e.key === filterKey);
        if (era) sampleList = props.filter(era.filter);
      }

      // Display 25 representative properties across the selection
      const displayProps = sampleList.slice(0, 25);

      vintageTableBody.innerHTML = displayProps.map(p => {
        const sqft = p.squareFeet || 1500;
        const taxSqFt = (p.annualTax / sqft).toFixed(2);
        return `
          <tr>
            <td>
              <strong>${p.address}</strong>
              <div class="table-subtext">Block ${p.block}, Lot ${p.lot}</div>
            </td>
            <td>${p.neighborhood}</td>
            <td><strong>${p.yearBuilt}</strong></td>
            <td>${sqft.toLocaleString()} sq ft</td>
            <td>${formatUSDWhole(p.assessedTotal)}</td>
            <td>${formatUSDWhole(p.estimatedMarketValue)}</td>
            <td><strong>${formatUSD(p.annualTax)}</strong></td>
            <td>
              <span class="tax-sqft-badge">$${taxSqFt} / sq ft</span>
            </td>
            <td>
              <button class="action-btn-sm" data-jump-tab="tab-calculator" onclick="document.getElementById('calc-assessment-input').value = ${p.assessedTotal}; switchTab('tab-calculator');">
                Calculate ➔
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }

    vintageFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        vintageFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const key = btn.getAttribute('data-vintage');
        renderVintageTable(key);
      });
    });

    renderVintageTable('all');
  }

  renderVintageAnalysis();
}

// Launch
document.addEventListener('DOMContentLoaded', initApp);
