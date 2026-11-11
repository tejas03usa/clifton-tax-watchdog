const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const REPO_DIR = process.env.REPO_DIR || path.resolve(__dirname, '..');
const pages = ['index.html', 'budgets.html', 'properties.html', 'election.html'];

console.log("================================================================================");
console.log("STARTING COMPREHENSIVE HUMAN-IMITATION SIMULATION TEST SUITE");
console.log("================================================================================\n");

let totalTests = 0;
let passedTests = 0;
let failedTests = [];

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ ${message}`);
  } else {
    failedTests.push(message);
    console.error(`  ✗ FAIL: ${message}`);
  }
}

// Helper to create a JSDOM window with all data preloaded into mock fetch
function createPageEnvironment(pageName) {
  let htmlContent = fs.readFileSync(path.join(REPO_DIR, pageName), 'utf8');
  // Strip external script tag so JSDOM does not fetch stale code over HTTP
  htmlContent = htmlContent.replace(/<script src="app\.js"><\/script>/g, '');

  const dom = new JSDOM(htmlContent, {
    url: `https://mytownlens.com/${pageName}`,
    runScripts: 'dangerously',
    pretendToBeVisual: true
  });

  const { window } = dom;
  const { document } = window;

  // Mock HTMLDialogElement showModal & close
  if (!window.HTMLDialogElement.prototype.showModal) {
    window.HTMLDialogElement.prototype.showModal = function() {
      this.open = true;
      this.setAttribute('open', '');
    };
  }
  if (!window.HTMLDialogElement.prototype.close) {
    window.HTMLDialogElement.prototype.close = function() {
      this.open = false;
      this.removeAttribute('open');
    };
  }

  // Mock scrollIntoView on window.Element.prototype
  if (window.Element && window.Element.prototype) {
    window.Element.prototype.scrollIntoView = function() {};
  }

  // Mock clipboard
  window.navigator.clipboard = {
    writeText: (txt) => Promise.resolve()
  };

  // Mock fetch to serve local data files
  window.fetch = (url) => {
    let cleanUrl = String(url).split('?')[0];
    let relPath = cleanUrl.replace(/^\/?/, '');
    if (relPath.startsWith('data/')) {
      const fullPath = path.join(REPO_DIR, relPath);
      if (fs.existsSync(fullPath)) {
        const data = fs.readFileSync(fullPath, 'utf8');
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(JSON.parse(data)),
          text: () => Promise.resolve(data)
        });
      }
    }
    const fallbackPath = path.join(REPO_DIR, 'data', path.basename(cleanUrl));
    if (fs.existsSync(fallbackPath)) {
      const data = fs.readFileSync(fallbackPath, 'utf8');
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(JSON.parse(data)),
        text: () => Promise.resolve(data)
      });
    }
    return Promise.resolve({
      ok: false,
      status: 404,
      json: () => Promise.reject(new Error(`404 Not Found: ${url}`)),
      text: () => Promise.resolve('')
    });
  };

  return { dom, window, document };
}

async function run() {
  const appJsCode = fs.readFileSync(path.join(REPO_DIR, 'app.js'), 'utf8');

  // ==============================================================================
  // SCENARIO 1: HOME PAGE (index.html) - BENTO, HEADER, CALCULATOR, & DIALOGS
  // ==============================================================================
  console.log("--------------------------------------------------------------------------------");
  console.log("SCENARIO 1: Simulating Human User on Home Page (index.html)");
  console.log("--------------------------------------------------------------------------------");

  const envHome = createPageEnvironment('index.html');
  const { window: winHome, document: docHome } = envHome;

  winHome.eval(appJsCode);
  if (typeof winHome.initApp === 'function') {
    await winHome.initApp();
  }
  await new Promise(r => setTimeout(r, 100));

  // 1.1 Check Header Elements
  console.log("\n[1.1] Testing Header & KPI Cards:");
  const hdrRate = docHome.getElementById('hdr-stat1-num');
  assert(hdrRate && hdrRate.textContent.includes('6.527%'), 'Header KPI displays certified tax rate 6.527%');
  
  const hdrSchool = docHome.getElementById('hdr-stat2-num');
  assert(hdrSchool && hdrSchool.textContent.includes('47.66%'), 'Header KPI displays Clifton Public Schools 47.66%');

  const hdrRoll = docHome.getElementById('hdr-stat3-num');
  assert(hdrRoll && hdrRoll.textContent.includes('21,300'), 'Header KPI displays 21,300 homes roll');

  // 1.2 Check Bento Grid Quadrant 1 (Home & Taxes)
  console.log("\n[1.2] Testing Bento Quadrant 1 (My Home & Property Taxes):");
  const bentoHomeSearch = docHome.getElementById('bento-home-search');
  assert(bentoHomeSearch !== null, 'Bento address search input exists');

  bentoHomeSearch.value = "Van Houten";
  winHome.openOmnibox(bentoHomeSearch.value);
  const omniboxDialog = docHome.getElementById('omnibox-dialog');
  assert(omniboxDialog && omniboxDialog.open, 'Find button opens Omnibox with initial query "Van Houten"');
  
  const omniInput = docHome.getElementById('omnibox-search-input');
  assert(omniInput && omniInput.value === 'Van Houten', 'Omnibox input contains "Van Houten"');
  winHome.closeOmnibox();
  assert(omniboxDialog && !omniboxDialog.open, 'Omnibox closes on closeOmnibox()');

  // Test Bento button: 2027 Reval Forecaster
  winHome.openRevalForecaster();
  const revalDialog = docHome.getElementById('reval-forecaster-dialog');
  assert(revalDialog && revalDialog.open, 'Bento button successfully opened 2027 Reval Forecaster modal');
  revalDialog.close();

  // Test Bento button: Form PAS-1 Relief Wizard
  winHome.openReliefCalculator();
  const reliefDialog = docHome.getElementById('relief-calc-dialog');
  assert(reliefDialog && reliefDialog.open, 'Bento button successfully opened Form PAS-1 Relief Wizard modal');
  reliefDialog.close();

  // Test Bento button: Appeal Feasibility & Form A-1
  await winHome.openAppealAnalyzer();
  const appealDialog = docHome.getElementById('appeal-analyzer-dialog');
  assert(appealDialog && appealDialog.open, 'Bento button successfully opened Tax Appeal Analyzer modal');
  appealDialog.close();

  // Test Bento button: Renter Tax Impact
  winHome.openRenterCalculator(2000);
  const renterDialog = docHome.getElementById('renter-tax-dialog');
  assert(renterDialog && renterDialog.open, 'Bento button successfully opened Renter Tax modal');
  renterDialog.close();

  // 1.3 Check Bento Grid Quadrant 2 (Where Does Public Money Go?)
  console.log("\n[1.3] Testing Bento Quadrant 2 (Where Does Public Money Go?):");
  const bentoQ2 = docHome.querySelector('.bento-card-budgets');
  assert(bentoQ2 !== null, 'Quadrant 2 Budgets card exists');
  const statStrip = bentoQ2.querySelector('.bento-stat-strip');
  assert(statStrip && statStrip.textContent.includes('$293.2M'), 'Budgets stat strip includes $293.2M schools');
  assert(statStrip && statStrip.textContent.includes('$143.3M'), 'Budgets stat strip includes $143.3M municipal');
  assert(statStrip && statStrip.textContent.includes('$4.1M'), 'Budgets stat strip includes $4.1M overtime');
  assert(statStrip && statStrip.textContent.includes('$8.18M'), 'Budgets stat strip includes $8.18M PILOT shift');

  // 1.4 Check Bento Grid Quadrant 3 (November 2026 Election)
  console.log("\n[1.4] Testing Bento Quadrant 3 (November 2026 Election):");
  const bentoQ3 = docHome.querySelector('.bento-card-election');
  assert(bentoQ3 !== null, 'Quadrant 3 Election card exists');
  await winHome.openPocketBallot();
  const ballotDialog = docHome.getElementById('pocket-ballot-dialog');
  assert(ballotDialog && ballotDialog.open, 'Bento button successfully opened 1-Page Pocket Ballot modal');
  ballotDialog.close();

  // 1.5 Check Bento Grid Quadrant 4 (Citizen Action Toolkit)
  console.log("\n[1.5] Testing Bento Quadrant 4 (Citizen Action Toolkit):");
  winHome.openOpraModal('overtime');
  const opraDialog = docHome.getElementById('opra-request-dialog');
  assert(opraDialog && opraDialog.open, 'Bento button successfully opened OPRA Request Generator modal');
  const opraPreview = docHome.getElementById('opra-modal-preview');
  assert(opraPreview && opraPreview.value.includes('N.J.S.A. 47:1A-1'), 'OPRA demand preview generated with statutory citation');
  opraDialog.close();

  winHome.openSpeechBuilder('taxes');
  const speechDialog = docHome.getElementById('speech-builder-dialog');
  assert(speechDialog && speechDialog.open, 'Bento button successfully opened 3-Minute Speech Builder modal');
  const speechBox = docHome.getElementById('speech-transcript-box');
  assert(speechBox && speechBox.value.length > 50, 'Speech builder generated speech transcript');
  speechDialog.close();

  // 1.6 Interactive Tax Calculator
  console.log("\n[1.6] Testing Tax Calculator Inputs & Recalculation:");
  const calcInput = docHome.getElementById('calc-assessment-input');
  assert(calcInput !== null, 'Tax assessment input exists');
  calcInput.value = "250000";
  if (typeof calcInput.oninput === 'function') calcInput.oninput();
  calcInput.dispatchEvent(new winHome.Event('input', { bubbles: true }));
  await new Promise(r => setTimeout(r, 50));
  
  const totalTaxDisplay = docHome.getElementById('calc-total-annual');
  assert(totalTaxDisplay && totalTaxDisplay.textContent.includes('$16,317'), `Total tax calculated correctly for $250k: ${totalTaxDisplay.textContent}`);

  // ==============================================================================
  // SCENARIO 2: UNIVERSAL OMNIBOX (Cmd+K) DEEP INTERACTIVE TESTING
  // ==============================================================================
  console.log("\n--------------------------------------------------------------------------------");
  console.log("SCENARIO 2: Simulating User Teleport Omnibox Interactions Across Queries");
  console.log("--------------------------------------------------------------------------------");

  winHome.openOmnibox();
  assert(omniboxDialog.open, 'Omnibox opened via openOmnibox()');

  // 2.1 Default state (empty query)
  console.log("\n[2.1] Omnibox default suggestions (empty query):");
  const resultsContainer = docHome.getElementById('omnibox-results-list');
  const initialItems = resultsContainer.querySelectorAll('.omnibox-result-item');
  assert(initialItems.length >= 15, `Empty query renders curated recommendations (found ${initialItems.length})`);

  // 2.2 Category chips filtering
  console.log("\n[2.2] Category chip filtering:");
  winHome.filterOmniboxCategory('tools');
  let filteredItems = resultsContainer.querySelectorAll('.omnibox-result-item');
  assert(filteredItems.length > 0, `Tools filter chip displays tools (found ${filteredItems.length})`);

  winHome.filterOmniboxCategory('budgets');
  filteredItems = resultsContainer.querySelectorAll('.omnibox-result-item');
  assert(filteredItems.length > 0, `Budgets filter chip displays ledgers (found ${filteredItems.length})`);

  winHome.filterOmniboxCategory('election');
  filteredItems = resultsContainer.querySelectorAll('.omnibox-result-item');
  assert(filteredItems.length > 0, `Election filter chip displays election resources (found ${filteredItems.length})`);

  winHome.filterOmniboxCategory('all');

  // 2.3 Query: "reval" -> Enter -> executes Reval Forecaster modal
  console.log("\n[2.3] Search & Execution: 'reval':");
  omniInput.value = 'reval';
  omniInput.dispatchEvent(new winHome.Event('input', { bubbles: true }));
  let matchItem = resultsContainer.querySelector('.omnibox-result-item');
  assert(matchItem && matchItem.textContent.includes('Revaluation'), 'First match for "reval" is 2027 Revaluation Forecaster');
  
  omniInput.dispatchEvent(new winHome.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  assert(!omniboxDialog.open, 'Omnibox closed after Enter execution');
  assert(revalDialog.open, '2027 Reval Forecaster modal opened via Omnibox Enter');
  revalDialog.close();

  // 2.4 Query: "speech" -> Enter -> executes Speech Builder modal
  console.log("\n[2.4] Search & Execution: 'speech':");
  winHome.openOmnibox('speech');
  omniInput.dispatchEvent(new winHome.Event('input', { bubbles: true }));
  omniInput.dispatchEvent(new winHome.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  assert(speechDialog.open, '3-Minute Speech Builder modal opened via Omnibox Enter');
  speechDialog.close();

  // 2.5 Query: "ballot" -> Enter -> executes Pocket Ballot modal
  console.log("\n[2.5] Search & Execution: 'ballot':");
  winHome.openOmnibox('ballot');
  omniInput.dispatchEvent(new winHome.Event('input', { bubbles: true }));
  omniInput.dispatchEvent(new winHome.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  assert(ballotDialog.open, 'Pocket Ballot modal opened via Omnibox Enter');
  ballotDialog.close();

  // 2.6 Arrow key navigation simulation
  console.log("\n[2.6] Keyboard Arrow Navigation (ArrowDown / ArrowUp):");
  winHome.openOmnibox();
  const getSelectedIdx = () => {
    const sel = resultsContainer.querySelector('.omnibox-result-item.is-selected');
    return sel ? parseInt(sel.getAttribute('data-index'), 10) : -1;
  };
  assert(getSelectedIdx() === 0, 'Initially first item is selected (index 0)');
  omniInput.dispatchEvent(new winHome.KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
  assert(getSelectedIdx() === 1, 'ArrowDown moved selection to index 1');
  omniInput.dispatchEvent(new winHome.KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
  assert(getSelectedIdx() === 0, 'ArrowUp moved selection back to index 0');
  winHome.closeOmnibox();

  // ==============================================================================
  // SCENARIO 3: CITIZEN ACTION TOOLKIT: TOP NAV DROPDOWN & FOOTER STRIP ACROSS ALL 4 PAGES
  // (Floating Dock Removed Per User Instruction)
  // ==============================================================================
  console.log("\n--------------------------------------------------------------------------------");
  console.log("SCENARIO 3: Testing Citizen Action Toolkit (Nav Dropdown & Footer Strip) On All 4 Pages");
  console.log("--------------------------------------------------------------------------------");

  for (const page of pages) {
    console.log(`\nTesting Citizen Toolkit Placement on [${page}]:`);
    const env = createPageEnvironment(page);
    env.window.eval(appJsCode);
    if (typeof env.window.initApp === 'function') {
      await env.window.initApp();
    }
    await new Promise(r => setTimeout(r, 100));

    // Verify floating dock is REMOVED
    const dock = env.document.getElementById('floating-citizen-dock');
    assert(dock === null, `Bottom quick dock #floating-citizen-dock is completely removed from ${page}`);

    // Verify Top Nav Citizen Action Tools Dropdown Menu
    const navToolsWrap = env.document.getElementById('nav-tools-menu-wrap');
    assert(navToolsWrap !== null, `Top Nav tools wrapper #nav-tools-menu-wrap exists on ${page}`);

    const navTrigger = env.document.getElementById('nav-tools-trigger');
    assert(navTrigger !== null, `Top Nav tools button #nav-tools-trigger exists on ${page}`);

    const navDropdown = env.document.getElementById('nav-tools-dropdown');
    assert(navDropdown !== null, `Top Nav tools dropdown #nav-tools-dropdown exists on ${page}`);

    const toolItems = navDropdown.querySelectorAll('.nav-tool-item');
    assert(toolItems.length === 8, `Nav dropdown contains 8 citizen action tools on ${page}`);

    // Test Dropdown Toggle & Close
    env.window.toggleNavToolsMenu();
    assert(navToolsWrap.classList.contains('is-open'), `toggleNavToolsMenu opens dropdown on ${page}`);
    env.window.closeNavToolsMenu();
    assert(!navToolsWrap.classList.contains('is-open'), `closeNavToolsMenu closes dropdown on ${page}`);

    // Test Opening Modals via Nav Tools
    // 1. Tax Relief Wizard
    env.window.openReliefCalculator();
    const relief = env.document.getElementById('relief-calc-dialog');
    assert(relief && relief.open, `Tax Relief Wizard opens from toolkit on ${page}`);
    relief.close();

    // 2. 2027 Reval Forecaster
    env.window.openRevalForecaster();
    const reval = env.document.getElementById('reval-forecaster-dialog');
    assert(reval && reval.open, `2027 Reval Forecaster opens from toolkit on ${page}`);
    reval.close();

    // 3. Pocket Ballot
    await env.window.openPocketBallot();
    const ballot = env.document.getElementById('pocket-ballot-dialog');
    assert(ballot && ballot.open, `Pocket Ballot opens from toolkit on ${page}`);
    ballot.close();

    // 4. OPRA Request
    env.window.openOpraModal('pilot');
    const opra = env.document.getElementById('opra-request-dialog');
    assert(opra && opra.open, `OPRA Request generator opens from toolkit on ${page}`);
    opra.close();

    // 5. 3-Min Speech
    env.window.openSpeechBuilder('overtime');
    const speech = env.document.getElementById('speech-builder-dialog');
    assert(speech && speech.open, `3-Min Speech Builder opens from toolkit on ${page}`);
    speech.close();

    // 6. Tax Appeal Analyzer
    await env.window.openAppealAnalyzer();
    const appeal = env.document.getElementById('appeal-analyzer-dialog');
    assert(appeal && appeal.open, `Tax Appeal Analyzer opens from toolkit on ${page}`);
    appeal.close();

    // 7. PVWC Lead Water Tracker
    env.window.openWaterTracker();
    const waterDlg = env.document.getElementById('pvwc-water-dialog');
    assert(waterDlg && waterDlg.open, `PVWC Lead Water Tracker opens from toolkit on ${page}`);
    waterDlg.close();

    // 8. Flood Risk & Tax Stigma Relief
    env.window.openFloodReliefModal();
    const floodDlg = env.document.getElementById('flood-relief-dialog');
    assert(floodDlg && floodDlg.open, `Flood Risk & Tax Stigma Relief opens from toolkit on ${page}`);
    floodDlg.close();

    // Verify Footer Toolkit Strip Across All 4 Pages
    const footerStrip = env.document.querySelector('.footer-toolkit-strip');
    assert(footerStrip !== null, `Footer toolkit strip .footer-toolkit-strip exists on ${page}`);

    const footerBtns = footerStrip.querySelectorAll('.footer-tool-btn');
    assert(footerBtns.length === 8, `Footer toolkit strip contains 8 tool buttons on ${page}`);
  }

  // ==============================================================================
  // SCENARIO 4: DETAILED MODAL FEATURES & USER CONTROLS
  // ==============================================================================
  console.log("\n--------------------------------------------------------------------------------");
  console.log("SCENARIO 4: Detailed Modal Controls, Timers, Checkboxes & Form Generators");
  console.log("--------------------------------------------------------------------------------");

  // 4.1 Speech Builder Timer & Rehearsal Controls
  console.log("\n[4.1] Testing 3-Minute Speech Builder Rehearsal Timer:");
  winHome.openSpeechBuilder('taxes');
  const timerClock = docHome.getElementById('speech-timer-clock');
  assert(timerClock && timerClock.textContent === '3:00', 'Speech rehearsal timer initialized at 3:00');
  
  winHome.startSpeechTimer();
  assert(winHome.speechBuilderState.timerInterval !== null, 'Timer started ticking');
  
  winHome.pauseSpeechTimer();
  assert(winHome.speechBuilderState.timerInterval === null, 'Timer paused successfully');

  winHome.resetSpeechTimer();
  assert(timerClock.textContent === '3:00', 'Timer reset back to 3:00');

  winHome.handleSpeechConfigChange('topic', 'overtime');
  const speechOvertimeBox = docHome.getElementById('speech-transcript-box');
  assert(speechOvertimeBox.value.includes('overtime') || speechOvertimeBox.value.includes('Overtime'), 'Speech transcript updated to overtime focus');

  speechDialog.close();

  // 4.2 Pocket Ballot Candidate Selection
  console.log("\n[4.2] Testing 1-Page Pocket Ballot Candidate Selection:");
  await winHome.openPocketBallot();
  const ballotContent = docHome.getElementById('pocket-ballot-content');
  assert(ballotContent && (ballotContent.textContent.includes('Council') || ballotContent.textContent.includes('City Council')), 'Pocket Ballot renders Council section');
  assert(ballotContent && (ballotContent.textContent.includes('School Board') || ballotContent.textContent.includes('Board of Education')), 'Pocket Ballot renders BOE section');
  ballotDialog.close();

  // 4.3 2027 Reval Forecaster Calculation
  console.log("\n[4.3] Testing 2027 Reval Forecaster Inputs & Calculation:");
  winHome.openRevalForecaster(180000, 540000);
  const revalContent = docHome.getElementById('reval-dialog-content');
  assert(revalContent && revalContent.textContent.includes('Rule of Thirds'), 'Reval modal renders Rule of Thirds analysis');
  
  winHome.handleRevalInput('marketValue', 650000);
  assert(winHome.revalForecasterState.marketValue === 650000, 'Reval market value updated to $650,000');
  revalDialog.close();

  // 4.4 Form PAS-1 Relief Wizard Deductions
  console.log("\n[4.4] Testing Form PAS-1 Tax Relief Wizard Toggles & Printable Voucher:");
  winHome.openReliefCalculator(12000, 185000);
  const reliefContent = docHome.getElementById('relief-dialog-content');
  assert(reliefContent.textContent.includes('Stay NJ'), 'Relief wizard displays Stay NJ program');
  assert(reliefContent.textContent.includes('ANCHOR'), 'Relief wizard displays ANCHOR program');
  assert(reliefContent.textContent.includes('Senior Freeze'), 'Relief wizard displays Senior Freeze program');
  assert(reliefContent.textContent.includes('Veteran'), 'Relief wizard displays Veteran deduction program');

  // Test 1-Click Printable State Relief Voucher
  const reliefVoucherContainer = docHome.getElementById('printable-relief-packet');
  assert(reliefVoucherContainer, 'Printable relief voucher container #printable-relief-packet exists in DOM');
  assert(typeof winHome.printReliefPacket === 'function', 'window.printReliefPacket is exposed as a callable function');
  winHome.printReliefPacket();
  assert(reliefVoucherContainer.innerHTML.includes('STATE PROPERTY TAX RELIEF SUMMARY &amp; FILING VOUCHER') || reliefVoucherContainer.innerHTML.includes('STATE PROPERTY TAX RELIEF SUMMARY & FILING VOUCHER'), 'Printable voucher renders official state title header');
  assert(reliefVoucherContainer.innerHTML.includes('ANCHOR (Form PAS-1)'), 'Printable voucher contains ANCHOR (Form PAS-1) breakdown');
  assert(reliefVoucherContainer.innerHTML.includes('StayNJ Senior Tax Cut'), 'Printable voucher contains StayNJ statutory entitlement');
  assert(reliefVoucherContainer.innerHTML.includes('propertytaxrelief.nj.gov'), 'Printable voucher references official state relief filing portal');
  reliefDialog.close();

  // 4.5 OPRA Public Records Demand Letter
  console.log("\n[4.5] Testing 1-Click OPRA Request Generator:");
  winHome.openOpraModal('pilot');
  const opraBody = docHome.getElementById('opra-modal-preview');
  assert(opraBody && opraBody.value.includes('N.J.S.A. 47:1A-1'), 'OPRA letter cites New Jersey Open Public Records Act (N.J.S.A. 47:1A-1)');
  assert(opraBody.value.includes('PILOT') || opraBody.value.includes('Financial Agreement'), 'OPRA letter mentions PILOT agreement demand');
  opraDialog.close();

  // 4.6 Passaic County Tax Appeal Analyzer
  console.log("\n[4.6] Testing Tax Appeal Analyzer & Passaic County Comps:");
  await winHome.openAppealAnalyzer();
  const appealContent = docHome.getElementById('appeal-dialog-content');
  assert(appealContent && (appealContent.textContent.includes('Ch. 123') || appealContent.textContent.includes('Chapter 123')), 'Appeal analyzer renders Chapter 123 ratio corridor analysis');
  assert(appealContent.textContent.includes('Passaic County Board of Taxation'), 'Appeal analyzer references Passaic County Board of Taxation');
  appealDialog.close();

  // ==============================================================================
  // SCENARIO 5: CROSS-PAGE ROUTING & TAB NAVIGATION (budgets.html)
  // ==============================================================================
  console.log("\n--------------------------------------------------------------------------------");
  console.log("SCENARIO 5: Budgets Page Sub-Nav Tabs & Hash Anchors (budgets.html)");
  console.log("--------------------------------------------------------------------------------");

  const envBudgets = createPageEnvironment('budgets.html');
  const { window: winBudgets, document: docBudgets } = envBudgets;
  winBudgets.eval(appJsCode);
  if (typeof winBudgets.initApp === 'function') {
    await winBudgets.initApp();
  }
  await new Promise(r => setTimeout(r, 100));

  const budgetTabs = [
    'tab-budgets', 'tab-commercial-pilot', 'tab-fair-tax', 
    'tab-benefits', 'tab-vendors', 'tab-surrounding', 'tab-city-docs'
  ];

  for (const t of budgetTabs) {
    const pane = docBudgets.getElementById(t);
    assert(pane !== null, `Budgets subtab pane #${t} exists`);
    
    if (typeof winBudgets.switchTab === 'function') {
      winBudgets.switchTab(t);
      assert(pane.classList.contains('active'), `switchTab('${t}') activates pane #${t}`);
    }
  }

  // Test Property Tier Shift Calculator on tab-commercial-pilot
  winBudgets.switchTab('tab-commercial-pilot');
  const tierCalcCard = docBudgets.getElementById('tier-shift-calculator');
  assert(tierCalcCard !== null, 'Property Tier Shift Calculator exists on #tab-commercial-pilot');
  const tierDisplay = docBudgets.getElementById('tier-impact-display');
  assert(tierDisplay !== null, 'Tier impact display container exists');
  if (typeof winBudgets.selectPropertyShiftTier === 'function') {
    winBudgets.selectPropertyShiftTier('median');
    assert(tierDisplay.textContent.includes('$1,240'), 'Median property tier renders $1,240 annual extra shift');
    winBudgets.selectPropertyShiftTier('starter');
    assert(tierDisplay.textContent.includes('736') || tierDisplay.textContent.includes('735'), 'Starter property tier renders ~$736 annual extra shift');
  }

  console.log("\n[5.1] Testing 'Compare Tax Disparities with Neighbor Towns' tab (#tab-surrounding):");
  const surroundingPane = docBudgets.getElementById('tab-surrounding');
  assert(surroundingPane && surroundingPane.textContent.includes('Surrounding Towns'), 'Surrounding towns comparison tab exists with content');

  const surrData = JSON.parse(fs.readFileSync(path.join(REPO_DIR, 'data/surrounding_towns_comparison.json'), 'utf8'));
  assert(surrData.towns.length === 47, `Surrounding dataset contains all 47 municipalities (found ${surrData.towns.length})`);

  const passaicTowns = surrData.towns.filter(t => t.county.includes('Passaic'));
  assert(passaicTowns.length === 16, `All 16 Passaic County municipalities present (found ${passaicTowns.length})`);

  const bergenTowns = surrData.towns.filter(t => t.county.includes('Bergen'));
  assert(bergenTowns.length === 10, `All 10 Bergen County benchmark peers present (found ${bergenTowns.length})`);

  const essexTowns = surrData.towns.filter(t => t.county.includes('Essex'));
  assert(essexTowns.length === 10, `All 10 Essex County benchmark peers present (found ${essexTowns.length})`);

  const morrisTowns = surrData.towns.filter(t => t.county.includes('Morris'));
  assert(morrisTowns.length === 11, `All 11 Morris County benchmark peers present (found ${morrisTowns.length})`);

  console.log("\n[5.2] Testing NJ DOE TGES School Efficiency Audit on budgets.html:");
  const tgesSection = docBudgets.getElementById('boe-spending-efficiency-section');
  assert(tgesSection !== null, 'TGES School Efficiency section exists on budgets.html');
  assert(tgesSection.textContent.includes('Taxpayers\' Guide to Education Spending'), 'TGES section renders certified DOE title');
  assert(tgesSection.textContent.includes('$22,450'), 'TGES renders Clifton budgetary per pupil spending $22,450');
  assert(tgesSection.textContent.includes('Wayne Township'), 'TGES comparison includes peer districts');

  console.log("\n[5.3] Testing Passaic County Services & Road Jurisdiction Guide on budgets.html:");
  const countySection = docBudgets.getElementById('passaic-county-services-section');
  assert(countySection !== null, 'Passaic County Services section exists on budgets.html');
  assert(countySection.textContent.includes('$58.74M'), 'Passaic County section renders Clifton levy share $58.74M');
  assert(countySection.textContent.includes('Valley Road'), 'Passaic County roadways list includes Valley Road');
  assert(countySection.textContent.includes('881-4500'), 'Passaic County DPW contact number present');
  assert(countySection.textContent.includes('Weasel Brook Park'), 'Passaic County parks list includes Weasel Brook Park');

  console.log("\n[5.4] Testing 2D Cross-Town Fiscal Efficiency Scatter Matrix on budgets.html:");
  winBudgets.switchTab('tab-surrounding');
  const scatterContainer = docBudgets.getElementById('cross-town-scatter-matrix-container');
  assert(scatterContainer !== null, 'Cross-town scatter matrix container exists on budgets.html');
  const scatterCard = docBudgets.getElementById('cross-town-scatter-matrix-card');
  assert(scatterCard !== null, 'Cross-town scatter matrix card renders actively');
  assert(scatterCard.textContent.includes('Cross-Town Fiscal Efficiency Matrix'), 'Scatter card renders headline');
  assert(scatterCard.textContent.includes('HIGH FISCAL EFFICIENCY'), 'Scatter matrix contains High Fiscal Efficiency quadrant');
  assert(scatterCard.textContent.includes('PREMIUM EDUCATION & TAX PRESSURE') || scatterCard.textContent.includes('PREMIUM EDUCATION &amp; TAX PRESSURE'), 'Scatter matrix contains Premium Education quadrant');

  const allScatterDots = docBudgets.querySelectorAll('.scatter-point-group');
  assert(allScatterDots.length === 47, `Scatter matrix plots all 47 municipalities across 4 counties (found ${allScatterDots.length})`);

  winBudgets.filterScatterMatrixCounty('morris');
  const morrisScatterDots = docBudgets.querySelectorAll('.scatter-point-group');
  assert(morrisScatterDots.length === 11, `County filter restricts scatter matrix to Morris County (found ${morrisScatterDots.length})`);

  winBudgets.filterScatterMatrixCounty('all');
  const restoredDots = docBudgets.querySelectorAll('.scatter-point-group');
  assert(restoredDots.length === 47, `Restoring filter plots all 47 municipalities again (found ${restoredDots.length})`);

  // ==============================================================================
  // SCENARIO 6: ELECTION PAGE & MATCHMAKER QUIZ (election.html)
  // ==============================================================================
  console.log("\n--------------------------------------------------------------------------------");
  console.log("SCENARIO 6: Election Page Candidate Matchmaker & Roster (election.html)");
  console.log("--------------------------------------------------------------------------------");

  const envElection = createPageEnvironment('election.html');
  const { window: winElection, document: docElection } = envElection;
  winElection.eval(appJsCode);
  if (typeof winElection.initApp === 'function') {
    await winElection.initApp();
  }
  await new Promise(r => setTimeout(r, 100));

  const matchmakerSection = docElection.getElementById('election-matchmaker-section') || docElection.getElementById('matchmaker');
  assert(matchmakerSection !== null, 'Matchmaker quiz section exists on election.html');

  if (typeof winElection.selectMatchmakerOption === 'function') {
    winElection.selectMatchmakerOption('taxFreezeVsServices', 'freeze');
    winElection.selectMatchmakerOption('developmentStance', 'strict_ban');
    winElection.selectMatchmakerOption('infrastructurePriority', 'flooding');
    assert(winElection.userMatchmakerAnswers.taxFreezeVsServices === 'freeze', 'Matchmaker recorded user answer');
  }

  // ==============================================================================
  // SCENARIO 7: PROPERTIES PAGE FILTERS & MOD-IV ROLL (properties.html)
  // ==============================================================================
  console.log("\n--------------------------------------------------------------------------------");
  console.log("SCENARIO 7: Properties MOD-IV Roll & Search (properties.html)");
  console.log("--------------------------------------------------------------------------------");

  const envProps = createPageEnvironment('properties.html');
  const { window: winProps, document: docProps } = envProps;
  winProps.eval(appJsCode);
  if (typeof winProps.initApp === 'function') {
    await winProps.initApp();
  }
  await new Promise(r => setTimeout(r, 100));

  const propSearch = docProps.getElementById('prop-search-input');
  assert(propSearch !== null, 'Property search input exists on properties.html');

  const propCountBadge = docProps.getElementById('prop-filter-count') || docProps.getElementById('prop-results-count');
  assert(propCountBadge !== null, 'Property results count badge exists');

  const dupesSection = docProps.getElementById('mod4-verify-dialog') || docProps.getElementById('mod4-duplicates');
  assert(dupesSection !== null, 'MOD-IV Duplicate Parcel Inspector section exists on properties.html');

  // Test Search by PAMS PIN and Block/Lot notation
  if (propSearch && typeof winProps.applyPropertyFilters === 'function') {
    propSearch.value = '39.04/15';
    winProps.applyPropertyFilters();
    const slashCards = docProps.querySelectorAll('.property-card');
    assert(slashCards.length >= 1, 'Property search resolves slash-formatted Block/Lot (39.04/15)');

    propSearch.value = '1602_39.04_15';
    winProps.applyPropertyFilters();
    const pinCards = docProps.querySelectorAll('.property-card');
    assert(pinCards.length >= 1, 'Property search resolves raw PAMS PIN (1602_39.04_15)');

    // Reset search
    propSearch.value = '';
    winProps.applyPropertyFilters();
  }

  // ==============================================================================
  // SCENARIO 8: LIVE ELECTION RESULTS TRACKER & 3-MINUTE AUTO-REFRESH
  // ==============================================================================
  console.log("\n--------------------------------------------------------------------------------");
  console.log("SCENARIO 8: Live Certified Election Results & 3-Minute Refresh Engine");
  console.log("--------------------------------------------------------------------------------");

  // 8.1 Results Dashboard on election.html
  console.log("\n[8.1] Testing Election Results Dashboard on election.html:");
  const resultsSection = docElection.getElementById('election-results-section');
  assert(resultsSection !== null, 'Election results section exists on election.html');
  assert(resultsSection && resultsSection.hasAttribute('open'), 'Results section is open by default');

  const resultsContent = docElection.getElementById('election-results-container');
  assert(resultsContent && resultsContent.children.length > 0, 'Results container rendered dynamically');

  assert(resultsContent.textContent.includes('43 of 43'), 'Results state 100% of districts reporting');
  assert(resultsContent.textContent.includes('Ray Grabowski') && resultsContent.textContent.includes('Projected Mayor'), 'Projected Mayor designated under 1923 charter');
  assert(resultsContent.textContent.includes('Mary Sadrakula') && resultsContent.textContent.includes('John Thomas Jr.'), 'Top 7 Council winners rendered');
  assert(resultsContent.textContent.includes('Board of Education') && resultsContent.textContent.includes('Joseph "Joe" R. Canova'), 'BOE results rendered');
  assert(resultsContent.textContent.includes('Election Day Machines') && resultsContent.textContent.includes('16,982'), 'Turnout methods breakdown rendered');
  assert(resultsContent.textContent.includes('Passaic County Board of County Commissioners'), 'County Commissioners section rendered');
  assert(resultsContent.textContent.includes('Orlando Cruz') && resultsContent.textContent.includes('Nicholas Veliky'), 'Elected County Commissioners Cruz and Veliky rendered');
  assert(resultsContent.textContent.includes('Passaic County Surrogate') && resultsContent.textContent.includes('Zoila Cassanova'), 'Elected County Surrogate Cassanova rendered');

  // 8.2 Candidate Filters on Results
  console.log("\n[8.2] Testing Interactive Results Filtering:");
  winElection.setElectionResultsFilter('winners');
  const winnerCards = resultsContent.querySelectorAll('.council-result-card.is-winner');
  assert(winnerCards.length === 7, 'Filter "winners" displays exactly 7 elected council members');

  winElection.setElectionResultsFilter('incumbents');
  const incCards = resultsContent.querySelectorAll('.council-result-card');
  assert(incCards.length === 5, 'Filter "incumbents" displays 5 running council incumbents');

  winElection.handleElectionResultsSearch('Latona');
  const searchCards = resultsContent.querySelectorAll('.council-result-card');
  assert(searchCards.length === 1 && searchCards[0].textContent.includes('Latona'), 'Search filter narrows down to specific candidate');
  winElection.handleElectionResultsSearch('');
  winElection.setElectionResultsFilter('all');

  // 8.3 Auto-Refresh Timer & Polling Halt When Count Complete
  console.log("\n[8.3] Testing Polling Halt When Counting Complete & Manual Sync:");
  const countdownEl = docElection.getElementById('election-refresh-countdown-display');
  assert(countdownEl !== null, 'Refresh status pill exists in election results header');
  assert(
    countdownEl && (countdownEl.textContent.includes('Counting Complete') || countdownEl.textContent.includes('Halted')),
    'Auto-refresh polling halted once 100% of districts counted'
  );
  assert(winElection.isElectionCountingComplete() === true, 'Election counting completion detected (100% / isCountComplete)');

  await winElection.manualRefreshElectionResults();
  assert(winElection.isElectionCountingComplete() === true, 'Manual refresh preserves counting complete status without recurring polling');

  // 8.4 Alert Ribbon on index.html
  console.log("\n[8.4] Testing Live Election Alert Ribbon & Bento on index.html:");
  const ribbon = docHome.getElementById('election-live-alert-ribbon');
  assert(ribbon !== null, 'Live election ribbon exists on index.html');
  assert(ribbon.textContent.includes('Districts') || ribbon.textContent.includes('Reporting'), 'Ribbon displays live reporting status');

  const bentoLive = docHome.getElementById('bento-election-live-preview');
  assert(bentoLive !== null, 'Bento Quadrant 3 live preview exists on index.html');
  assert(bentoLive.textContent.includes('Ray Grabowski'), 'Bento preview surfaces projected Mayor');

  // 8.5 Omnibox Integration
  const omniMatches = winHome.getOmniboxMatches('results');
  assert(omniMatches.some(m => m.id === 'election-live-results'), 'Omnibox indexes Live 2026 Election Results');

  // ==============================================================================
  // SCENARIO 9: PVWC LEAD WATER TRACKER & FLOOD STIGMA APPEAL ENGINE
  // ==============================================================================
  console.log("\n--------------------------------------------------------------------------------");
  console.log("SCENARIO 9: Testing PVWC Lead Water Line Tracker & Flood Stigma Appeal Engine");
  console.log("--------------------------------------------------------------------------------");

  // 9.1 PVWC Lead Water Tracker
  console.log("\n[9.1] Testing PVWC Lead Water Tracker Modal & Calculator:");
  winHome.openWaterTracker('Botany Village / Lakeview');
  const pvwcDialog = docHome.getElementById('pvwc-water-dialog');
  assert(pvwcDialog && pvwcDialog.open, 'PVWC Water modal opens');
  const pvwcContent = docHome.getElementById('pvwc-dialog-content');
  assert(pvwcContent && pvwcContent.textContent.includes('1,580'), 'PVWC modal displays 1,580 Clifton lead lines replaced');
  assert(pvwcContent.textContent.includes('$0 Cost to Homeowners'), 'PVWC modal states $0 homeowner cost under P.L. 2021, c.183');
  assert(pvwcContent.textContent.includes('Botany Village'), 'PVWC modal displays selected neighborhood');

  winHome.setWaterUsageTier('high');
  assert(docHome.getElementById('pvwc-dialog-content').textContent.includes('32 CCF') || winHome.activeWaterState.customCCF === 32, 'Water estimator handles high usage tier');
  pvwcDialog.close();

  // 9.2 Passaic River Basin Flood Stigma Appeal Engine
  console.log("\n[9.2] Testing Passaic River Basin Flood Stigma Appeal Engine:");
  winHome.openFloodReliefModal(200000, 'ae_basement');
  const floodDialog = docHome.getElementById('flood-relief-dialog');
  assert(floodDialog && floodDialog.open, 'Flood relief modal opens');
  const floodContent = docHome.getElementById('flood-dialog-content');
  assert(floodContent && floodContent.textContent.includes('Glen Wall Associates v. Wall Twp'), 'Flood modal cites Glen Wall Associates case law');
  assert(floodContent.textContent.includes('15.0%'), 'Flood modal calculates 15% stigma discount');
  assert(floodContent.textContent.includes('Zone AE'), 'Flood modal renders FEMA Zone AE condition');

  winHome.setFloodCondition('ae_floodway');
  assert(docHome.getElementById('flood-dialog-content').textContent.includes('22.5%'), 'Flood modal updates to 22.5% floodway discount');
  floodDialog.close();

  // 9.3 Omnibox Teleportation for new tools
  console.log("\n[9.3] Testing Omnibox Teleportation for New Tools:");
  winHome.openOmnibox('water');
  const waterMatches = winHome.getOmniboxMatches('water', 'all');
  assert(waterMatches.length > 0 && waterMatches[0].id === 'tool-water', 'Omnibox finds PVWC Lead Water tool for "water" query');
  winHome.closeOmnibox();

  winHome.openOmnibox('flood');
  const floodMatches = winHome.getOmniboxMatches('flood', 'all');
  assert(floodMatches.length > 0 && floodMatches[0].id === 'tool-flood', 'Omnibox finds Flood Risk tool for "flood" query');
  winHome.closeOmnibox();

  // --------------------------------------------------------------------------
  // SCENARIO 10: All 47 County Towns Visibility & Teleport Search Across Pages
  // --------------------------------------------------------------------------
  console.log("\n--------------------------------------------------------------------------------");
  console.log("SCENARIO 10: All 47 County Towns Visibility & Teleport Search Across Pages");
  console.log("--------------------------------------------------------------------------------");

  const pagesToCheck = [
    { name: 'index.html', doc: docHome },
    { name: 'budgets.html', doc: docBudgets },
    { name: 'properties.html', doc: docProps },
    { name: 'election.html', doc: docElection }
  ];

  for (const p of pagesToCheck) {
    const allTownsBtn = p.doc.querySelector('.city-switch-all-btn');
    assert(allTownsBtn !== null, `Persistent "All 47 Towns" button exists in header on ${p.name}`);
    assert(allTownsBtn.getAttribute('href') === 'budgets.html#tab-surrounding', `Button links to budgets.html#tab-surrounding on ${p.name}`);
    assert(allTownsBtn.textContent.includes('All 47 Towns'), `Button displays "All 47 Towns" text on ${p.name}`);

    // Option A: Smart Location Pill Button
    const locPill = p.doc.getElementById('header-location-pill-btn');
    assert(locPill !== null, `Smart Location Pill #header-location-pill-btn exists in header on ${p.name}`);

    const activeTown = p.doc.getElementById('header-active-town-name');
    assert(activeTown !== null && activeTown.textContent.length > 0, `Active town name displayed in Location Pill on ${p.name}`);

    const activeCounty = p.doc.getElementById('header-active-county-name');
    assert(activeCounty !== null && activeCounty.textContent.length > 0, `Active county displayed in Location Pill on ${p.name}`);

    // Location Picker Modal Dialog
    const locModal = p.doc.getElementById('location-picker-dialog');
    assert(locModal !== null, `Location Picker Dialog #location-picker-dialog exists on ${p.name}`);
  }

  // Check Option A Location Picker Modal Interaction (using index.html window)
  console.log("\n[10.0] Testing Option A Location Picker Modal Interaction:");
  winHome.openLocationPickerModal();
  const locModalHome = docHome.getElementById('location-picker-dialog');
  assert(locModalHome && (locModalHome.open || locModalHome.hasAttribute('open')), 'Location Picker Modal opens on openLocationPickerModal()');

  const locGrid = docHome.getElementById('loc-towns-grid');
  assert(locGrid !== null, 'Towns grid exists in Location Picker Modal');

  // Test county tabs in Location Picker Modal
  const countyTabs = docHome.querySelectorAll('.loc-county-tab');
  assert(countyTabs.length === 5, `Location Picker contains 5 county filter tabs (found ${countyTabs.length})`);

  // Bergen County tab
  const bergenTab = docHome.querySelector('.loc-county-tab[data-loc-county="Bergen County"]');
  if (bergenTab) bergenTab.click();
  let bergenCards = locGrid.querySelectorAll('.loc-town-card');
  assert(bergenCards.length === 10, `Location Picker displays 10 Bergen County town cards (found ${bergenCards.length})`);

  // Essex County tab
  const essexTab = docHome.querySelector('.loc-county-tab[data-loc-county="Essex County"]');
  if (essexTab) essexTab.click();
  let essexCards = locGrid.querySelectorAll('.loc-town-card');
  assert(essexCards.length === 10, `Location Picker displays 10 Essex County town cards (found ${essexCards.length})`);

  // Morris County tab
  const morrisTab = docHome.querySelector('.loc-county-tab[data-loc-county="Morris County"]');
  if (morrisTab) morrisTab.click();
  let morrisCards = locGrid.querySelectorAll('.loc-town-card');
  assert(morrisCards.length === 11, `Location Picker displays 11 Morris County town cards (found ${morrisCards.length})`);

  // Passaic County tab
  const passaicTab = docHome.querySelector('.loc-county-tab[data-loc-county="Passaic County"]');
  if (passaicTab) passaicTab.click();
  let passaicCards = locGrid.querySelectorAll('.loc-town-card');
  assert(passaicCards.length === 16, `Location Picker displays 16 Passaic County town cards (found ${passaicCards.length})`);

  // All Towns tab
  const allTab = docHome.querySelector('.loc-county-tab[data-loc-county="all"]');
  if (allTab) allTab.click();
  let allCards = locGrid.querySelectorAll('.loc-town-card');
  assert(allCards.length === 47, `Location Picker displays all 47 North Jersey town cards (found ${allCards.length})`);

  // Test modal search input
  const modalSearch = docHome.getElementById('loc-search-input');
  assert(modalSearch !== null, 'Modal live search input exists');
  modalSearch.value = 'totowa';
  modalSearch.dispatchEvent(new envHome.window.Event('input'));
  const modalFilteredCards = locGrid.querySelectorAll('.loc-town-card');
  assert(modalFilteredCards.length === 1, `Searching "totowa" in modal filters down to 1 town card`);

  // Test clear search
  winHome.clearLocationSearch();
  let restoredCards = locGrid.querySelectorAll('.loc-town-card');
  assert(restoredCards.length > 1, `Clearing search restores town cards in modal`);

  // Close modal
  winHome.closeLocationPickerModal();
  assert(!locModalHome.open && !locModalHome.hasAttribute('open'), 'Location Picker Modal closes on closeLocationPickerModal()');

  // Check budgets.html subnav label
  const compareTabBtn = docBudgets.querySelector('.hub-subnav-btn[data-tab="tab-surrounding"]');
  assert(compareTabBtn && compareTabBtn.textContent.includes('All 47'), 'budgets.html subnav tab explicitly indicates "(All 47)"');

  // Check budgets.html comparator unified filter console
  console.log("\n[10.1] Testing budgets.html Option A Unified Filter Console:");
  const cascadePanel = docBudgets.getElementById('comparator-cascading-filter-panel');
  assert(cascadePanel !== null, 'Comparator unified console #comparator-cascading-filter-panel exists on budgets.html');

  const unifiedToolbar = docBudgets.getElementById('comparator-unified-toolbar');
  assert(unifiedToolbar !== null, 'Unified single-bar toolbar #comparator-unified-toolbar exists');

  const compCountySelect = docBudgets.getElementById('comp-cascade-county');
  assert(compCountySelect !== null, 'Comparator county selector #comp-cascade-county exists in toolbar');

  const compTownSelect = docBudgets.getElementById('comp-cascade-town');
  assert(compTownSelect !== null, 'Comparator town selector #comp-cascade-town exists in toolbar');

  const homeValInput = docBudgets.getElementById('cross-home-val');
  assert(homeValInput !== null, 'Home value input #cross-home-val exists in toolbar');

  const incomeInput = docBudgets.getElementById('cross-income-val');
  assert(incomeInput !== null, 'Annual income input #cross-income-val exists in toolbar');

  const sortSelect = docBudgets.getElementById('cross-sort-by');
  assert(sortSelect !== null, 'Sort dropdown #cross-sort-by exists in toolbar');

  const chipsGrid = docBudgets.getElementById('comp-town-chips-grid');
  assert(chipsGrid !== null, 'Comparator town chips grid exists in console');

  // Initial render (Passaic County default)
  winBudgets.renderSurroundingTowns();
  const renderedPassaicChips = chipsGrid.querySelectorAll('.comp-town-chip');
  assert(renderedPassaicChips.length === 16, `Default Passaic County renders 16 quick-chips (found ${renderedPassaicChips.length})`);

  const compTownOpts = compTownSelect.querySelectorAll('option');
  assert(compTownOpts.length === 17, `Cascading town dropdown populated with 'all' + 16 Passaic towns (found ${compTownOpts.length})`);

  // Test selecting All Counties in comparator
  compCountySelect.value = 'all';
  compCountySelect.dispatchEvent(new envBudgets.window.Event('change'));
  const renderedAllChips = chipsGrid.querySelectorAll('.comp-town-chip');
  assert(renderedAllChips.length === 47, `Switching comparator county to "all" renders all 47 town chips (found ${renderedAllChips.length})`);

  // Test live search input
  const townSearchInput = docBudgets.getElementById('cross-town-search-input');
  assert(townSearchInput !== null, 'Town search input exists in comparator toolbar');
  townSearchInput.value = 'totowa';
  townSearchInput.dispatchEvent(new envBudgets.window.Event('input'));
  assert(docBudgets.querySelectorAll('#surrounding-table-body tr').length === 1, 'Live search "totowa" filters table to exactly 1 town');

  // Reset search
  const clearFilterBtn = docBudgets.getElementById('btn-clear-town-filter');
  if (clearFilterBtn) clearFilterBtn.click();
  else {
    townSearchInput.value = '';
    townSearchInput.dispatchEvent(new envBudgets.window.Event('input'));
  }
  assert(docBudgets.querySelectorAll('#surrounding-table-body tr').length === 47, 'Clearing search restores all 47 towns in table');

  // Test reset cascade button
  const resetCascadeBtn = docBudgets.getElementById('btn-reset-cascade');
  assert(resetCascadeBtn !== null, 'Reset cascade button #btn-reset-cascade exists');

  // Omnibox Town Teleportation Search
  console.log("\n[10.2] Testing Omnibox Town Teleportation Searches:");
  const testTownQueries = [
    { query: 'totowa', expectedName: 'Totowa', expectedCounty: 'Passaic County' },
    { query: 'little falls', expectedName: 'Little Falls', expectedCounty: 'Passaic County' },
    { query: 'hawthorne', expectedName: 'Hawthorne', expectedCounty: 'Passaic County' },
    { query: 'paramus', expectedName: 'Paramus', expectedCounty: 'Bergen County' },
    { query: 'nutley', expectedName: 'Nutley', expectedCounty: 'Essex County' }
  ];

  for (const tq of testTownQueries) {
    const matches = winHome.getOmniboxMatches(tq.query, 'all');
    assert(matches.length > 0, `Omnibox returns results for town search "${tq.query}"`);
    const townMatch = matches.find(m => m.title && m.title.toLowerCase().includes(tq.query));
    assert(townMatch !== undefined, `Omnibox surfaces matching town card for "${tq.query}"`);
    assert(townMatch.subtitle.includes('Effective Rate:'), `Town card contains Effective Tax Rate for "${tq.query}"`);
    assert(townMatch.actionTarget.includes('budgets.html?county='), `Town card links to budgets.html?county= for "${tq.query}"`);
  }

  // [10.3] Testing Full Data Availability & Switching for All 47 Towns
  console.log("\n[10.3] Testing Full Data Availability & Switching for All 47 Towns:");
  
  // Test Totowa (Passaic County non-hub town)
  await winHome.switchCity('totowa');
  assert(winHome.currentCity === 'totowa', 'Current city switched to totowa');
  assert(docHome.getElementById('header-active-town-name').textContent === 'Totowa', 'Header Location Pill updated to Totowa');
  assert(docHome.getElementById('header-active-county-name').textContent.includes('Passaic'), 'Header Location Pill county is Passaic');
  assert(docHome.getElementById('hdr-stat1-num').textContent === '2.934%', 'Totowa Certified Tax Rate updated to 2.934%');
  assert(docHome.getElementById('hdr-stat1-sub').textContent.includes('$8,537'), 'Totowa Average Tax Bill updated to $8,537');
  assert(docHome.getElementById('hdr-stat2-num').textContent === '48.20%', 'Totowa Schools Share updated to 48.20%');

  // Verify Totowa Tax Calculator recalculates accurately
  const calcInputTotowa = docHome.getElementById('calc-assessment-input');
  calcInputTotowa.value = '250000';
  calcInputTotowa.dispatchEvent(new envHome.window.Event('input'));
  assert(docHome.getElementById('calc-total-annual').textContent === '$7,335.00', 'Totowa 2026 tax correctly calculated for $250k assessment: $7,335.00');

  // Test Nutley (Essex County non-hub town)
  await winHome.switchCity('nutley');
  assert(winHome.currentCity === 'nutley', 'Current city switched to nutley');
  assert(docHome.getElementById('header-active-town-name').textContent === 'Nutley', 'Header Location Pill updated to Nutley');
  assert(docHome.getElementById('header-active-county-name').textContent.includes('Essex'), 'Header Location Pill county is Essex');
  assert(docHome.getElementById('hdr-stat1-num').textContent === '2.844%', 'Nutley Certified Tax Rate updated to 2.844%');

  calcInputTotowa.value = '250000';
  calcInputTotowa.dispatchEvent(new envHome.window.Event('input'));
  assert(docHome.getElementById('calc-total-annual').textContent === '$7,110.00', 'Nutley 2026 tax correctly calculated for $250k assessment: $7,110.00');

  // Test Ridgewood (Bergen County non-hub town)
  await winHome.switchCity('ridgewood');
  assert(winHome.currentCity === 'ridgewood', 'Current city switched to ridgewood');
  assert(docHome.getElementById('header-active-town-name').textContent === 'Ridgewood', 'Header Location Pill updated to Ridgewood');
  assert(docHome.getElementById('header-active-county-name').textContent.includes('Bergen'), 'Header Location Pill county is Bergen');
  assert(docHome.getElementById('hdr-stat1-num').textContent === '2.782%', 'Ridgewood Certified Tax Rate updated to 2.782%');

  // Test Denville (Morris County non-hub town)
  await winHome.switchCity('denville');
  assert(winHome.currentCity === 'denville', 'Current city switched to denville');
  assert(docHome.getElementById('header-active-town-name').textContent === 'Denville', 'Header Location Pill updated to Denville');
  assert(docHome.getElementById('header-active-county-name').textContent.includes('Morris'), 'Header Location Pill county is Morris');
  assert(docHome.getElementById('hdr-stat1-num').textContent === '2.584%', 'Denville Certified Tax Rate updated to 2.584%');

  // Test Selecting Town via Location Picker Modal
  winHome.openLocationPickerModal();
  await winHome.selectLocationTown('paterson', 'Passaic County');
  assert(winHome.currentCity === 'paterson', 'Selecting Paterson from modal switches city to paterson');
  assert(docHome.getElementById('header-active-town-name').textContent === 'Paterson', 'Header Location Pill updated to Paterson');
  assert(docHome.getElementById('hdr-stat1-num').textContent === '5.335%', 'Paterson Certified Tax Rate updated to 5.335%');

  // Test Properties Roll Loading on properties.html for a non-hub town
  await envProps.window.switchCity('totowa');
  assert(envProps.window.currentCity === 'totowa', 'properties.html switched to totowa');
  const propRows = envProps.document.querySelectorAll('#properties-table-body tr');
  assert(propRows.length > 0, `properties.html loaded and rendered ${propRows.length} Totowa property records`);

  console.log("\n--------------------------------------------------------------------------------");
  console.log("SCENARIO 11: Testing Golden Lead Dossier & Buyer Dispatch Console");
  console.log("--------------------------------------------------------------------------------");

  await envProps.window.switchCity('clifton');
  envProps.window.openAppealAnalyzer();
  const appealDialogS11 = envProps.document.getElementById('appeal-analyzer-dialog');
  assert(appealDialogS11 && appealDialogS11.open, 'Appeal Analyzer dialog opens on properties.html');
  const footerReviewBtn = appealDialogS11.querySelector('.modern-dialog-footer button[onclick="openAttorneyConsultModal()"]');
  assert(!!footerReviewBtn, 'Primary Request Free Attorney Review button exists in Appeal Analyzer footer');

  envProps.window.openAttorneyConsultModal();
  const consultDialog = envProps.document.getElementById('attorney-consult-dialog');
  assert(consultDialog && consultDialog.open, 'Attorney Consultation modal opens');
  const meritsPreview = envProps.document.getElementById('attorney-lead-prop-badge');
  assert(meritsPreview && meritsPreview.innerHTML.includes('Est. Tax Savings'), 'Case Merits & Comps preview badge renders inside Attorney Consultation modal');

  // Fill and submit Attorney Lead Form
  envProps.document.getElementById('lead-full-name').value = 'Jane Homeowner';
  envProps.document.getElementById('lead-email').value = 'jane@example.com';
  envProps.document.getElementById('lead-phone').value = '(973) 555-0199';
  envProps.document.getElementById('lead-notes').value = 'Original kitchen and roof needs replacement.';
  envProps.document.getElementById('lead-is-owner').checked = true;
  envProps.document.getElementById('lead-consent').checked = true;

  const formEvt = new envProps.window.Event('submit', { bubbles: true, cancelable: true });
  envProps.window.handleAttorneyLeadSubmit(formEvt);

  const savedLeads = JSON.parse(envProps.window.localStorage.getItem('mytownlens_attorney_leads') || '[]');
  assert(savedLeads.length === 1, 'Submitting Attorney Consult form stores 1 Golden Lead Dossier in localStorage');
  assert(savedLeads[0].contact.name === 'Jane Homeowner', 'Lead stores homeowner fullName');
  assert(typeof savedLeads[0].caseMerits.potentialAnnualSavings === 'number', 'Lead stores calculated potentialAnnualSavings');
  assert(Array.isArray(savedLeads[0].comparables), 'Lead packages MOD-IV street comparables array');
  assert(savedLeads[0].formattedDossier && savedLeads[0].formattedDossier.includes('MYTOWNLENS — PRE-QUALIFIED NJ PROPERTY TAX APPEAL CASE DOSSIER'), 'Lead includes formatted plain-text Case Dossier');

  // Test Sample Lead Generator & Dossier Inspector in Owner Console
  envProps.window.openAdminLeadsModal();
  const adminDialog = envProps.document.getElementById('admin-leads-dialog');
  assert(adminDialog && adminDialog.open, 'Owner Lead & Partner Console opens');
  envProps.window.generateSampleQualifiedLead('appeals');
  const updatedLeads = JSON.parse(envProps.window.localStorage.getItem('mytownlens_attorney_leads') || '[]');
  assert(updatedLeads.length === 2, 'generateSampleQualifiedLead("appeals") creates a real MOD-IV sample lead');
  const inspector = envProps.document.getElementById('admin-dossier-inspector');
  assert(inspector && inspector.style.display !== 'none', 'Lead Dossier Inspector Drawer opens automatically on sample generation');
  const inspectorContent = envProps.document.getElementById('admin-dossier-pre');
  assert(inspectorContent && inspectorContent.textContent.includes('CHAPTER 123 & COMPARABLE OVER-ASSESSMENT MERITS'), 'Dossier Inspector displays full Chapter 123 & Street Comparable Merits');

  // Test Settings & Webhook Dispatch Integration
  envProps.window.switchAdminTab('settings');
  const settingsPanel = envProps.document.getElementById('admin-panel-settings');
  assert(settingsPanel && settingsPanel.style.display === 'block', 'Admin tab switches to Settings & Webhooks');
  const webhookInput = envProps.document.getElementById('admin-webhook-url');
  assert(webhookInput !== null, 'Admin webhook URL input exists');
  webhookInput.value = 'https://formspree.io/f/test-endpoint';
  envProps.window.saveAdminWebhook();
  assert(envProps.window.localStorage.getItem('mytownlens_lead_webhook') === 'https://formspree.io/f/test-endpoint', 'saveAdminWebhook() successfully saves webhook URL in localStorage');
  envProps.window.testAdminWebhook();
  const webhookMsg = envProps.document.getElementById('admin-webhook-status-msg');
  assert(webhookMsg && webhookMsg.innerHTML.includes('Sending test Golden Lead Dossier ping'), 'testAdminWebhook() triggers webhook dispatch test ping');

  // Test Embeddable Partner Widget Generator
  const widgetCodeEl = envProps.document.getElementById('admin-widget-code');
  assert(widgetCodeEl !== null && widgetCodeEl.textContent.includes('iframe src="https://mytownlens.com'), 'Embeddable Partner Widget Code block exists with clean iframe snippet');
  if (typeof envProps.window.copyWidgetSnippet === 'function') {
    envProps.window.copyWidgetSnippet();
    const widgetStatusMsg = envProps.document.getElementById('admin-widget-status-msg');
    assert(widgetStatusMsg && widgetStatusMsg.innerHTML.includes('copied to clipboard'), 'copyWidgetSnippet() generates success confirmation message');
  }

  console.log("\n--------------------------------------------------------------------------------");
  console.log("SCENARIO 12: Testing Attorney Outreach CRM & Law Firm Directory Pipeline");
  console.log("--------------------------------------------------------------------------------");

  envProps.window.switchAdminTab('outreach');
  const tabOutreachBtn = envProps.document.getElementById('admin-tab-outreach-btn');
  assert(tabOutreachBtn && tabOutreachBtn.classList.contains('active'), 'Admin tab switches to Attorney Outreach & Pitch Outbox');
  const outreachPanel = envProps.document.getElementById('admin-panel-outreach');
  assert(outreachPanel && outreachPanel.style.display === 'block', 'Outreach CRM panel renders actively');
  
  const initialFirmRows = envProps.document.querySelectorAll('#admin-tbody-outreach tr');
  assert(initialFirmRows.length === 18, `Outreach CRM seeded with 18 premier North Jersey law firms (found ${initialFirmRows.length})`);

  const pitchData = envProps.window.buildLawFirmPitchData('zipp-tanebaum');
  assert(pitchData && pitchData.body.includes('Peter J. Zipp, Esq.'), 'Pitch letter personalizes to managing partner Peter J. Zipp, Esq.');
  assert(pitchData.body.includes('Golden Lead Case Dossier'), 'Pitch letter outlines Chapter 123 Golden Lead Case Dossier deliverables');

  envProps.window.filterOutreachCounty('Bergen');
  const bergenRows = envProps.document.querySelectorAll('#admin-tbody-outreach tr');
  assert(bergenRows.length === 4, `County filter restricts CRM view to Bergen County hub firms (found ${bergenRows.length})`);

  envProps.window.filterOutreachCounty('all');
  envProps.window.updateLawFirmStatus('zipp-tanebaum', 'active-retainer');
  const mrrKpi = envProps.document.getElementById('outreach-kpi-mrr');
  assert(mrrKpi && mrrKpi.textContent.includes('350'), 'Projected MRR pipeline updates to reflect $350/mo active retainer');

  // Test Over-Assessment Quick-Filter & Savings Badges on properties.html
  const toggleAppealBtn = envProps.document.getElementById('btn-toggle-appeal-filter');
  assert(!!toggleAppealBtn, 'Quick-filter button #btn-toggle-appeal-filter exists in properties toolbar');
  envProps.window.toggleOverAssessedFilter();
  assert(toggleAppealBtn.classList.contains('active'), 'Over-assessed filter button activates on click');
  const cardsWithSavings = envProps.document.querySelectorAll('#properties-cards-container .property-card');
  assert(cardsWithSavings.length > 0, `Rendered ${cardsWithSavings.length} properties under over-assessed filter`);
  const firstBadge = cardsWithSavings[0].querySelector('.prop-savings-badge');
  assert(firstBadge && firstBadge.textContent.includes('Est. Savings'), 'Property card displays prominent Chapter 123 Est. Savings badge');
  envProps.window.toggleOverAssessedFilter();
  assert(!toggleAppealBtn.classList.contains('active'), 'Over-assessed filter toggles off cleanly');

  console.log("\n--------------------------------------------------------------------------------");
  console.log("SCENARIO 13: Testing Realtor & Brokerage Outreach CRM Pipeline");
  console.log("--------------------------------------------------------------------------------");

  envProps.window.switchAdminTab('realtor_outreach');
  const tabRealtorOutreachBtn = envProps.document.getElementById('admin-tab-realtor_outreach-btn');
  assert(tabRealtorOutreachBtn && tabRealtorOutreachBtn.classList.contains('active'), 'Admin tab switches to Realtor Outreach CRM');
  const realtorOutreachPanel = envProps.document.getElementById('admin-panel-realtor_outreach');
  assert(realtorOutreachPanel && realtorOutreachPanel.style.display === 'block', 'Realtor Outreach CRM panel renders actively');

  const initialBrokerRows = envProps.document.querySelectorAll('#admin-tbody-realtor-outreach tr');
  assert(initialBrokerRows.length === 16, `Realtor CRM seeded with 16 premier North Jersey brokerages (found ${initialBrokerRows.length})`);

  const realtorPitchData = envProps.window.buildRealtorPitchData('christies-ridgewood');
  assert(realtorPitchData && realtorPitchData.body.includes('Sonja Cullaro'), 'Pitch letter personalizes to managing broker Sonja Cullaro');
  assert(realtorPitchData.body.includes('150,016 verified parcels'), 'Pitch letter highlights 150,016 parcel scale');
  assert(realtorPitchData.body.includes('3 complimentary') || realtorPitchData.body.includes('3 sample'), 'Pitch letter offers 3 complimentary trial CMA leads');

  envProps.window.filterRealtorCounty('Passaic');
  const passaicBrokerRows = envProps.document.querySelectorAll('#admin-tbody-realtor-outreach tr');
  assert(passaicBrokerRows.length === 6, `County filter restricts CRM view to Passaic County brokerages (found ${passaicBrokerRows.length})`);

  envProps.window.filterRealtorCounty('all');
  envProps.window.updateRealtorStatus('christies-ridgewood', 'active-retainer');
  const realtorMrrKpi = envProps.document.getElementById('realtor-kpi-mrr');
  assert(realtorMrrKpi && realtorMrrKpi.textContent.includes('300'), 'Projected Realtor MRR pipeline updates to reflect $300/mo active retainer');

  // --------------------------------------------------------------------------
  // SCENARIO 14: Testing Graceful Disabling of Unrouted Lead Capture & Self-Service Mode
  // --------------------------------------------------------------------------
  console.log("\n--------------------------------------------------------------------------------");
  console.log("SCENARIO 14: Testing Graceful Disabling of Unrouted Lead Capture & Self-Service Mode");
  console.log("--------------------------------------------------------------------------------");

  // Create fresh environment to simulate a brand-new visitor (no webhook configured)
  const envFreshHome = createPageEnvironment('index.html');
  envFreshHome.window.eval(appJsCode);
  if (typeof envFreshHome.window.initApp === 'function') {
    await envFreshHome.window.initApp();
  }

  assert(!envFreshHome.window.isPublicLeadCaptureEnabled(), 'Public lead capture is disabled by default for fresh visitors');
  assert(envFreshHome.document.body.classList.contains('lead-capture-disabled'), 'Body receives .lead-capture-disabled class');

  const bentoCmaFresh = envFreshHome.document.getElementById('bento-pill-realtor-cma');
  assert(bentoCmaFresh && bentoCmaFresh.style.display === 'none', 'Realtor CMA bento pill is hidden on index.html when lead capture is paused');

  const partnerStripFresh = envFreshHome.document.querySelector('.partner-showcase-strip');
  assert(partnerStripFresh && partnerStripFresh.style.display === 'none', 'Partner sponsorship footer banner is hidden when lead capture is paused');

  // Open Appeal Analyzer in fresh environment
  await envFreshHome.window.openAppealAnalyzer();
  const appealDialogFresh = envFreshHome.document.getElementById('appeal-analyzer-dialog');
  const appealContentFresh = envFreshHome.document.getElementById('appeal-dialog-content');
  assert(appealContentFresh && appealContentFresh.textContent.includes('Official Self-Filing Mode'), 'Appeal Analyzer displays Official Self-Filing Mode card');
  assert(appealContentFresh && appealContentFresh.textContent.includes('Print Form A-1 Packet Now'), 'Official Self-Filing card provides instant Print Form A-1 button');

  const footerReviewBtnFresh = appealDialogFresh.querySelector('.modern-dialog-footer button[onclick*="openAttorneyConsultModal"]');
  assert(footerReviewBtnFresh && footerReviewBtnFresh.style.display === 'none', 'Appeal Analyzer footer hides Request Free Attorney Review button when paused');

  // Verify properties.html card omitting Realtor CMA button
  const envFreshProps = createPageEnvironment('properties.html');
  envFreshProps.window.eval(appJsCode);
  if (typeof envFreshProps.window.initApp === 'function') {
    await envFreshProps.window.initApp();
  }
  const cmaCardBtnsFresh = envFreshProps.document.querySelectorAll('.btn-realtor-val-trigger');
  assert(cmaCardBtnsFresh.length === 0, 'Property cards omit unrouted Realtor CMA valuation buttons when disabled');

  // Verify Admin Portal status and reactivation
  const envFreshAdmin = createPageEnvironment('admin.html');
  envFreshAdmin.window.sessionStorage.setItem('mytownlens_admin_session', 'authenticated');
  envFreshAdmin.window.eval(appJsCode);
  if (typeof envFreshAdmin.window.initApp === 'function') {
    await envFreshAdmin.window.initApp();
  }
  envFreshAdmin.window.initAdminPortalWorkspace();

  const adminKpiWebhook = envFreshAdmin.document.getElementById('admin-kpi-webhook-status');
  assert(adminKpiWebhook && adminKpiWebhook.textContent.includes('Paused'), 'Admin KPI reflects Paused status when no webhook configured');

  const routingTitleFresh = envFreshAdmin.document.getElementById('admin-lead-routing-status-title');
  assert(routingTitleFresh && routingTitleFresh.textContent.includes('Paused (Self-Service Mode Active)'), 'Admin Settings banner displays Paused / Self-Service status');

  // Simulate admin entering valid webhook URL
  const adminWebhookInput = envFreshAdmin.document.getElementById('admin-webhook-url');
  adminWebhookInput.value = 'https://formspree.io/f/testendpoint';
  envFreshAdmin.window.saveAdminWebhook();

  assert(envFreshAdmin.window.isPublicLeadCaptureEnabled(), 'Saving valid webhook URL immediately activates isPublicLeadCaptureEnabled()');
  assert(adminKpiWebhook && adminKpiWebhook.textContent.includes('Active'), 'Admin KPI updates to Active status upon webhook save');
  assert(routingTitleFresh && routingTitleFresh.textContent.includes('Active & Forwarding'), 'Admin Settings banner updates to Active & Forwarding');

  // Simulate admin clearing webhook URL
  adminWebhookInput.value = '';
  envFreshAdmin.window.saveAdminWebhook();
  assert(!envFreshAdmin.window.isPublicLeadCaptureEnabled(), 'Clearing webhook URL automatically pauses public lead capture');
  assert(adminKpiWebhook && adminKpiWebhook.textContent.includes('Paused'), 'Admin KPI reverts to Paused status');

  console.log("\n================================================================================");
  console.log(`TEST SUITE COMPLETED: ${passedTests} passed out of ${totalTests} tests`);
  if (failedTests.length > 0) {
    console.error(`FAILED TESTS (${failedTests.length}):`);
    failedTests.forEach(f => console.error(`  - ${f}`));
    process.exit(1);
  } else {
    console.log("ALL SCENARIOS PASSED WITH ZERO ERRORS!");
    console.log("================================================================================");
    process.exit(0);
  }
}

run().catch(err => {
  console.error("Simulation error:", err);
  process.exit(1);
});
