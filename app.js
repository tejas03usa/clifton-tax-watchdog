/**
 * Clifton & Parsippany-Troy Hills NJ Taxpayer Watchdog - Core Client Application
 * Updated: October 18, 2026
 */

let currentCity = 'clifton';
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
let commercialPilotData = null;
let fairTaxData = null;
let cliftonElectionData = null;
let loadedElectionCity = null;
let electionFilterStatus = 'all';
let electionFilterCategory = 'all';
let electionSearchQuery = '';
let currentFilteredProperties = [];
let propCurrentPage = 1;
const propPageSize = 36;
let applyPropertyFilters = null;

// Cross-Hub Page & Tab Routing Map
const TAB_PAGE_MAP = {
  'tab-calculator': 'index.html',
  'tab-election': 'election.html',
  'tab-budgets': 'budgets.html#tab-budgets',
  'tab-commercial-pilot': 'budgets.html#tab-commercial-pilot',
  'tab-fair-tax': 'budgets.html#tab-fair-tax',
  'tab-benefits': 'budgets.html#tab-benefits',
  'tab-vendors': 'budgets.html#tab-vendors',
  'tab-surrounding': 'budgets.html#tab-surrounding',
  'tab-properties': 'properties.html#tab-properties',
  'tab-demographics': 'properties.html#tab-demographics',
  'tab-staff': 'properties.html#tab-staff',
  'tab-ethics': 'properties.html#tab-ethics',
  'tab-intelligence': 'properties.html#tab-intelligence',
  'tab-controversies': 'properties.html#tab-controversies',
  'tab-investigate': 'properties.html#tab-investigate'
};

// City-Specific OPRA Templates & Metadata
const cityOpraConfig = {
  clifton: {
    templates: {
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
    },
    meta: {
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
    }
  },
  parsippany: {
    templates: {
      overtime: `To the Township Clerk / Custodian of Records, Township of Parsippany-Troy Hills (kmadin@parsippany.net):

Pursuant to the New Jersey Open Public Records Act (N.J.S.A. 47:1A-1 et seq.), I hereby request:
1. The complete payroll and compensation ledger for all Township of Parsippany-Troy Hills employees for the most recent completed fiscal year, showing Employee Name, Department, Title, Base Salary, Overtime, and Stipends/Longevity.
2. All approved Secondary Employment / Outside Employment Notification forms filed by Parsippany Police Department officers, department heads, and municipal staff currently active.
3. The annual summary of Outside Police Employment Details (utility/roadway contractor traffic details) showing vendors, township admin fees collected, and officer payouts.

Please provide records electronically in Excel/CSV or searchable PDF format.`,
      vendors: `To the Business Administrator / Board Secretary, Parsippany-Troy Hills Township School District (rtedesco@pthsd.net):

Pursuant to N.J.S.A. 47:1A-1 et seq., I hereby request electronic copies of:
1. The complete Accounts Payable / Check Register / Bill List approved by the Parsippany-Troy Hills Board of Education for the past 12 months, detailing Vendor Name, PO Number, Budget Line Code, Check Date, Check Amount, and Description.
2. Awarded agreements and fee schedules for Professional Services contracts (Board Attorney, Special PILOT Litigation Counsel, Auditor, Architect, Insurance Broker).
3. Chapter 271 Political Contribution Disclosures / Pay-to-Play certifications for all vendors receiving over $17,500.

Please furnish these records electronically via email.`,
      contracts: `To the Custodian of Records, Parsippany-Troy Hills Township School District (rtedesco@pthsd.net):

Pursuant to N.J.S.A. 47:1A-1 et seq. and N.J.S.A. 47:1A-10, please provide:
1. The current employment contracts and any amendments for the Superintendent of Schools, Business Administrator / Board Secretary, and Assistant Superintendents.
2. The official calculation of accrued unused sick leave, unused vacation leave, and contractual buyout liability for the top 5 highest compensated district administrators.
3. Any stipends or allowances approved for the current fiscal year.

Please furnish these records electronically via email.`,
      sickleave: `To the Township Clerk / Custodian of Records, Township of Parsippany-Troy Hills (kmadin@parsippany.net):

Pursuant to the New Jersey Open Public Records Act (N.J.S.A. 47:1A-1 et seq.):
1. The official detailed ledger of all terminal leave / accumulated sick, vacation, and compensatory leave payouts issued to retiring or departing Township of Parsippany-Troy Hills employees (including PBA Local 131 and SOA officers) for the past 3 fiscal years, showing employee name, title, department, total hours cashed out, hourly rate, and total gross payout.
2. Any municipal policy, ordinance, or collective bargaining agreement addenda establishing the current payout formulas or statutory caps ($15,000 cap under N.J.S.A. 11A:6-19.2).

Please provide these records electronically in searchable PDF or Excel format.`,
      pilot: `To the Township Clerk / Custodian of Records, Township of Parsippany-Troy Hills (kmadin@parsippany.net):

Pursuant to N.J.S.A. 47:1A-1 et seq., please provide copies of:
1. All active Financial Agreements for Payments in Lieu of Taxes (PILOT) / Long Term Tax Exemption agreements entered into under N.J.S.A. 40A:20-1 et seq. for redevelopment projects in Parsippany-Troy Hills (including 1515 Route 10, Campus Drive, Lanidex Plaza, and Waterview).
2. The official annual audit reports and Annual Service Charge calculations submitted to the Township by each urban renewal entity for the past 2 completed calendar years.
3. The Township Revenue Ledger showing total annual service charges (PILOT payments) collected, the 5% remittance made to Morris County, and any revenue sharing or Community Benefit Agreements with the Parsippany-Troy Hills Board of Education.

Please furnish these public records in electronic format via email.`
    },
    meta: {
      overtime: {
        recipientEmail: 'kmadin@parsippany.net',
        recipientDisplay: 'kmadin@parsippany.net • Township Clerk & BA Khaled Madin',
        subject: 'OPRA Public Records Request - Township Payroll, Overtime & Secondary Details'
      },
      vendors: {
        recipientEmail: 'rtedesco@pthsd.net',
        recipientDisplay: 'rtedesco@pthsd.net • PTHSD Business Admin Robin Tedesco',
        subject: 'OPRA Public Records Request - PTHSD Vendor Check Registers & Legal Invoices'
      },
      contracts: {
        recipientEmail: 'rtedesco@pthsd.net',
        recipientDisplay: 'rtedesco@pthsd.net • PTHSD Business Admin Robin Tedesco',
        subject: 'OPRA Public Records Request - PTHSD Administrator Contracts & Sick Leave Calculations'
      },
      sickleave: {
        recipientEmail: 'kmadin@parsippany.net',
        recipientDisplay: 'kmadin@parsippany.net • Township Clerk & BA Khaled Madin',
        subject: 'OPRA Public Records Request - Township Terminal Leave & Sick Payout Records'
      },
      pilot: {
        recipientEmail: 'kmadin@parsippany.net',
        recipientDisplay: 'kmadin@parsippany.net • Township Clerk & BA Khaled Madin',
        subject: 'OPRA Public Records Request - Parsippany PILOT Financial Agreements & Remittances'
      }
    }
  },
  wayne: {
    templates: {
      overtime: `To the Township Clerk / Custodian of Records, Township of Wayne (clerk@waynetownship.com):

Pursuant to the New Jersey Open Public Records Act (N.J.S.A. 47:1A-1 et seq.), I hereby request:
1. The complete payroll and compensation ledger for all Township of Wayne employees for the most recent completed fiscal year, showing Employee Name, Department, Title, Base Salary, Overtime, and Stipends/Longevity.
2. All approved Secondary Employment / Outside Employment Notification and Authorization forms filed by Wayne Police Department sworn officers currently active.
3. The annual summary of Outside Police Employment Details (utility and roadway contractor traffic details) showing vendors, township administrative fees collected, and officer payouts.

Please provide records electronically in Excel/CSV or searchable PDF format.`,
      vendors: `To the Business Administrator / Board Secretary, Wayne Township Public Schools (boe@wayneschools.com):

Pursuant to N.J.S.A. 47:1A-1 et seq., I hereby request electronic copies of:
1. The complete Accounts Payable / Check Register / Bill List approved by the Board of Education for the past 12 months, detailing Vendor Name, PO Number, Budget Line Code, Check Date, Check Amount, and Description.
2. Awarded agreements and fee schedules for Professional Services contracts (Board Attorney, Auditor, Architect, Insurance Broker).
3. Chapter 271 Political Contribution Disclosures / Pay-to-Play certifications for all vendors receiving over $17,500.

Please furnish these records electronically via email.`,
      contracts: `To the Custodian of Records, Wayne Township Public Schools (boe@wayneschools.com):

Pursuant to N.J.S.A. 47:1A-1 et seq. and N.J.S.A. 47:1A-10, please provide:
1. Current employment contracts and amendments for the Superintendent of Schools and Business Administrator.
2. Official calculation of accrued unused sick leave, unused vacation leave, and contractual buyout liability for top district administrators.

Please furnish these records electronically via email.`,
      sickleave: `To the Township Clerk / Custodian of Records, Township of Wayne (clerk@waynetownship.com):

Pursuant to N.J.S.A. 47:1A-1 et seq. and state sick leave reform guidelines:
1. The official detailed ledger of all terminal leave / accumulated sick and vacation leave payouts issued to retiring or departing Township of Wayne employees for the past 3 fiscal years.
2. Any municipal policy or collective bargaining agreement addenda establishing current payout formulas or statutory caps ($15,000 cap under N.J.S.A. 11A:6-19.2).

Please provide records electronically.`,
      pilot: `To the Township Clerk / Custodian of Records, Township of Wayne (clerk@waynetownship.com):

Pursuant to N.J.S.A. 47:1A-1 et seq., please provide copies of:
1. All active Financial Agreements for Payments in Lieu of Taxes (PILOT) for redevelopment projects in Wayne.
2. Annual service charge audit statements and 5% Passaic County remittances.

Please furnish these records electronically via email.`
    },
    meta: {
      overtime: { recipientEmail: 'clerk@waynetownship.com', recipientDisplay: 'clerk@waynetownship.com • Township Clerk Paul Margiotta', subject: 'OPRA Request - Wayne Township Payroll, Overtime & Secondary Details' },
      vendors: { recipientEmail: 'boe@wayneschools.com', recipientDisplay: 'boe@wayneschools.com • Wayne BOE Business Administrator', subject: 'OPRA Request - Wayne School Board Vendor Check Registers' },
      contracts: { recipientEmail: 'boe@wayneschools.com', recipientDisplay: 'boe@wayneschools.com • Wayne BOE Records Custodian', subject: 'OPRA Request - Wayne District Administrator Employment Contracts' },
      sickleave: { recipientEmail: 'clerk@waynetownship.com', recipientDisplay: 'clerk@waynetownship.com • Township Clerk Paul Margiotta', subject: 'OPRA Request - Wayne Terminal Sick Leave Payout Records' },
      pilot: { recipientEmail: 'clerk@waynetownship.com', recipientDisplay: 'clerk@waynetownship.com • Township Clerk Paul Margiotta', subject: 'OPRA Request - Wayne PILOT Tax Agreements & County Remittances' }
    }
  },
  montclair: {
    templates: {
      overtime: `To the Municipal Clerk / Custodian of Records, Township of Montclair (clerk@montclairnj.gov):

Pursuant to N.J.S.A. 47:1A-1 et seq., please furnish:
1. Complete payroll and compensation ledger for all Township of Montclair employees for the most recent completed fiscal year, detailing Name, Department, Title, Base Salary, Overtime, and Stipends.
2. Outside police employment detail authorizations and vendor billings.

Please provide records electronically in searchable PDF or Excel format.`,
      vendors: `To the Business Administrator, Montclair Public Schools (records@mpsdnj.org):

Pursuant to N.J.S.A. 47:1A-1 et seq., please furnish:
1. Complete Accounts Payable Check Register / Bill List for the past 12 months.
2. Legal services invoices and retainer agreements.`,
      contracts: `To the Custodian of Records, Montclair Public Schools (records@mpsdnj.org):

Pursuant to N.J.S.A. 47:1A-1 et seq.:
1. Current employment contracts for Superintendent of Schools and Business Administrator.
2. Accrued unused leave buyout calculations.`,
      sickleave: `To the Municipal Clerk, Township of Montclair (clerk@montclairnj.gov):

Pursuant to N.J.S.A. 47:1A-1 et seq.:
1. Detailed ledger of all terminal sick and vacation payouts to retiring municipal employees for the past 3 fiscal years.
2. Compliance documentation with the $15,000 statutory cap (N.J.S.A. 11A:6-19.2).`,
      pilot: `To the Municipal Clerk, Township of Montclair (clerk@montclairnj.gov):

Pursuant to N.J.S.A. 47:1A-1 et seq., please provide:
1. Active PILOT Financial Agreements for downtown Montclair redevelopment projects (including Seymour Street, MC Hotel, and Lackawanna Plaza).
2. Annual service charge audit statements and 5% Essex County remittances.`
    },
    meta: {
      overtime: { recipientEmail: 'clerk@montclairnj.gov', recipientDisplay: 'clerk@montclairnj.gov • Municipal Clerk Angelese Bermúdez Nieves', subject: 'OPRA Request - Montclair Township Payroll & Overtime' },
      vendors: { recipientEmail: 'records@mpsdnj.org', recipientDisplay: 'records@mpsdnj.org • Montclair BOE Business Administrator', subject: 'OPRA Request - Montclair School Check Registers & Legal Fees' },
      contracts: { recipientEmail: 'records@mpsdnj.org', recipientDisplay: 'records@mpsdnj.org • Montclair BOE Records Custodian', subject: 'OPRA Request - Montclair Administrator Employment Contracts' },
      sickleave: { recipientEmail: 'clerk@montclairnj.gov', recipientDisplay: 'clerk@montclairnj.gov • Municipal Clerk Angelese Bermúdez Nieves', subject: 'OPRA Request - Montclair Municipal Sick Leave Buyout Records' },
      pilot: { recipientEmail: 'clerk@montclairnj.gov', recipientDisplay: 'clerk@montclairnj.gov • Municipal Clerk Angelese Bermúdez Nieves', subject: 'OPRA Request - Montclair PILOT Redevelopment Agreements' }
    }
  },
  morristown: {
    templates: {
      overtime: `To the Town Clerk / Custodian of Records, Town of Morristown (clerk@townofmorristown.org):

Pursuant to N.J.S.A. 47:1A-1 et seq.:
1. Complete compensation ledger for all Town of Morristown employees, showing Base Salary, Overtime, and Stipends.
2. Police secondary employment / traffic detail ledger.

Please provide records in Excel/CSV or searchable PDF format.`,
      vendors: `To the Business Administrator, Morris School District (records@msdk12.net):

Pursuant to N.J.S.A. 47:1A-1 et seq.:
1. Check register and bill lists for Morris School District for the past 12 months.
2. Professional services contracts and legal fees.`,
      contracts: `To the Custodian of Records, Morris School District (records@msdk12.net):

Pursuant to N.J.S.A. 47:1A-1 et seq.:
1. Current employment contract for Superintendent of Schools and Business Administrator.
2. Joint funding cost-sharing agreement between Morristown and Morris Township.`,
      sickleave: `To the Town Clerk, Town of Morristown (clerk@townofmorristown.org):

Pursuant to N.J.S.A. 47:1A-1 et seq.:
1. Detailed ledger of terminal leave and sick buyout disbursements for the past 3 fiscal years.`,
      pilot: `To the Town Clerk, Town of Morristown (clerk@townofmorristown.org):

Pursuant to N.J.S.A. 47:1A-1 et seq.:
1. PILOT financial agreements for M Station, HQ Plaza, and Speedwell Avenue redevelopment projects.
2. Annual service charges collected and 5% Morris County remittances.`
    },
    meta: {
      overtime: { recipientEmail: 'clerk@townofmorristown.org', recipientDisplay: 'clerk@townofmorristown.org • Town Clerk Margot G. Cawley', subject: 'OPRA Request - Morristown Municipal Payroll & Overtime' },
      vendors: { recipientEmail: 'records@msdk12.net', recipientDisplay: 'records@msdk12.net • Morris School District Business Admin', subject: 'OPRA Request - Morris School District Bill Lists' },
      contracts: { recipientEmail: 'records@msdk12.net', recipientDisplay: 'records@msdk12.net • Morris School District Records Custodian', subject: 'OPRA Request - Morris School District Executive Contracts' },
      sickleave: { recipientEmail: 'clerk@townofmorristown.org', recipientDisplay: 'clerk@townofmorristown.org • Town Clerk Margot G. Cawley', subject: 'OPRA Request - Morristown Terminal Sick Leave Buyout Records' },
      pilot: { recipientEmail: 'clerk@townofmorristown.org', recipientDisplay: 'clerk@townofmorristown.org • Town Clerk Margot G. Cawley', subject: 'OPRA Request - Morristown PILOT Agreements & Remittances' }
    }
  },
  montville: {
    templates: {
      overtime: `To the Township Clerk / Custodian of Records, Township of Montville (clerk@montvillenj.org):

Pursuant to N.J.S.A. 47:1A-1 et seq.:
1. Complete compensation and overtime ledger for all Township of Montville employees for the most recent completed fiscal year.
2. Police secondary employment notification forms.

Please provide records in electronic format.`,
      vendors: `To the Business Administrator, Montville Township Public Schools (records@montville.net):

Pursuant to N.J.S.A. 47:1A-1 et seq.:
1. Complete accounts payable check register for the past 12 months.
2. Professional service contracts and legal invoices.`,
      contracts: `To the Custodian of Records, Montville Township Public Schools (records@montville.net):

Pursuant to N.J.S.A. 47:1A-1 et seq.:
1. Employment contracts for Superintendent of Schools and Business Administrator.
2. Sick and vacation leave buyout liability calculations.`,
      sickleave: `To the Township Clerk, Township of Montville (clerk@montvillenj.org):

Pursuant to N.J.S.A. 47:1A-1 et seq.:
1. Ledger of all terminal leave / accumulated sick leave payouts for the past 3 fiscal years.
2. Compliance documentation with the $15,000 statutory cap.`,
      pilot: `To the Township Clerk, Township of Montville (clerk@montvillenj.org):

Pursuant to N.J.S.A. 47:1A-1 et seq.:
1. Any active Long Term Tax Exemption / PILOT agreements entered into under N.J.S.A. 40A:20-1 et seq.
2. Annual service charges collected and county remittances.`
    },
    meta: {
      overtime: { recipientEmail: 'clerk@montvillenj.org', recipientDisplay: 'clerk@montvillenj.org • Township Clerk Stacy Sullivan-Gruca', subject: 'OPRA Request - Montville Township Payroll & Overtime' },
      vendors: { recipientEmail: 'records@montville.net', recipientDisplay: 'records@montville.net • Montville BOE Business Administrator', subject: 'OPRA Request - Montville School Check Registers' },
      contracts: { recipientEmail: 'records@montville.net', recipientDisplay: 'records@montville.net • Montville BOE Records Custodian', subject: 'OPRA Request - Montville Administrator Employment Contracts' },
      sickleave: { recipientEmail: 'clerk@montvillenj.org', recipientDisplay: 'clerk@montvillenj.org • Township Clerk Stacy Sullivan-Gruca', subject: 'OPRA Request - Montville Terminal Sick Leave Buyout Records' },
      pilot: { recipientEmail: 'clerk@montvillenj.org', recipientDisplay: 'clerk@montvillenj.org • Township Clerk Stacy Sullivan-Gruca', subject: 'OPRA Request - Montville Tax Exemption Agreements' }
    }
  },
  glenrock: {
    templates: {
      overtime: `To the Borough Clerk / Custodian of Records, Borough of Glen Rock (clerk@glenrocknj.net):

Pursuant to N.J.S.A. 47:1A-1 et seq.:
1. Complete compensation, base salary, and overtime ledger for all Borough of Glen Rock employees (including GRPD and DPW) for the most recent completed fiscal year.
2. Police secondary employment / outside contractor traffic detail logs, admin fee rates, and officer payouts.

Please provide records in electronic format.`,
      vendors: `To the Business Administrator / Board Secretary, Glen Rock Board of Education (rinderknechtm@glenrocknj.org):

Pursuant to N.J.S.A. 47:1A-1 et seq.:
1. Complete accounts payable check register and bill list for the Glen Rock School District for the past 12 months.
2. Awarded professional service agreements and legal counsel invoices.`,
      contracts: `To the Custodian of Records, Glen Rock Board of Education (rinderknechtm@glenrocknj.org):

Pursuant to N.J.S.A. 47:1A-1 et seq.:
1. Employment contracts and amendments for the Superintendent of Schools and School Business Administrator.
2. Official calculation of unused sick leave buyout liability and executive benefits.`,
      sickleave: `To the Borough Clerk, Borough of Glen Rock (clerk@glenrocknj.net):

Pursuant to N.J.S.A. 47:1A-1 et seq.:
1. Detailed ledger of all terminal leave / accumulated sick and vacation leave payouts issued to retiring or departing Borough employees for the past 3 fiscal years.
2. Compliance documentation with statutory caps under N.J.S.A. 11A:6-19.2.`,
      pilot: `To the Borough Clerk, Borough of Glen Rock (clerk@glenrocknj.net):

Pursuant to N.J.S.A. 47:1A-1 et seq.:
1. Any active Long Term Tax Exemption / PILOT agreements entered into under N.J.S.A. 40A:20-1 et seq.
2. Annual service charges collected and Bergen County remittances.`
    },
    meta: {
      overtime: { recipientEmail: 'clerk@glenrocknj.net', recipientDisplay: 'clerk@glenrocknj.net • Borough Clerk Jacqueline Scalia', subject: 'OPRA Request - Glen Rock Borough Payroll & Overtime' },
      vendors: { recipientEmail: 'rinderknechtm@glenrocknj.org', recipientDisplay: 'rinderknechtm@glenrocknj.org • BOE Business Admin Michael Rinderknecht', subject: 'OPRA Request - Glen Rock School District Check Registers' },
      contracts: { recipientEmail: 'rinderknechtm@glenrocknj.org', recipientDisplay: 'rinderknechtm@glenrocknj.org • BOE Business Admin Michael Rinderknecht', subject: 'OPRA Request - Glen Rock BOE Administrator Contracts' },
      sickleave: { recipientEmail: 'clerk@glenrocknj.net', recipientDisplay: 'clerk@glenrocknj.net • Borough Clerk Jacqueline Scalia', subject: 'OPRA Request - Glen Rock Terminal Sick Leave Buyout Records' },
      pilot: { recipientEmail: 'clerk@glenrocknj.net', recipientDisplay: 'clerk@glenrocknj.net • Borough Clerk Jacqueline Scalia', subject: 'OPRA Request - Glen Rock Redevelopment & Exemption Records' }
    }
  }
};

// Full Multi-City Registry for Watchdog Platforms
const CITY_REGISTRY = {
  clifton: {
    id: 'clifton',
    name: 'Clifton',
    fullName: 'City of Clifton',
    badgeText: 'CITY OF CLIFTON • CITIZEN FISCAL WATCHDOG',
    icon: '🏛️',
    county: 'Passaic County',
    countyShort: 'Passaic County',
    districtCode: '1602',
    auditBadge: 'CITIZEN FISCAL AUDIT • 2026',
    certifiedTaxRate: '6.527%',
    rateNum: 6.527,
    equalizationRatio: 33.3,
    avgTaxBill: '$11,912 / yr',
    schoolsShare: '47.66%',
    muniShare: '29.41%',
    countyShare: '22.92%',
    schoolDistrictName: 'Clifton Public Schools (BOE)',
    schoolDistrictShort: 'Clifton BOE',
    schoolBudgetDisplay: '$293.2M',
    muniBudgetDisplay: '$105.4M',
    benefitsSpendDisplay: '$87.2M',
    avgAssessed: '$182.5k',
    typicalMarket: 550000,
    sliderMin: 50000,
    sliderMax: 600000,
    sliderDefault: 182500,
    zipCodesDisplay: '07011, 07012, 07013 & 07014',
    controversyHighlight: 'OSC audits, PILOT shifts, ASI Reval & budget cliffs',
    title: 'Clifton Taxpayer Watchdog',
    pageTitle: 'Clifton NJ Taxpayer Watchdog | Where Does Your Money Go?',
    subtitle: 'Independent data on Clifton property taxes, the $293M school budget, municipal spending, and 2026 elections.',
    basePath: 'data',
    sliderLabelsHtml: `<span>$50k</span><span>$182.5k (Avg)</span><span>$350k</span><span>$600k+</span>`,
    quickPresetsHtml: `<span class="preset-label">Quick Presets:</span>
       <button class="preset-btn" data-val="125000">$125k (Botany)</button>
       <button class="preset-btn" data-val="150000">$150k (Delawanna)</button>
       <button class="preset-btn active" data-val="182500">Clifton Avg ($182.5k)</button>
       <button class="preset-btn" data-val="250000">$250k (Allwood)</button>
       <button class="preset-btn" data-val="350000">$350k (Montclair Hts)</button>`
  },
  parsippany: {
    id: 'parsippany',
    name: 'Parsippany',
    fullName: 'Township of Parsippany-Troy Hills',
    badgeText: 'TOWNSHIP OF PARSIPPANY-TROY HILLS • CITIZEN FISCAL WATCHDOG',
    icon: '🌲',
    county: 'Morris County',
    countyShort: 'Morris County',
    districtCode: '1429',
    auditBadge: 'MORRIS COUNTY AUDIT • 2026',
    certifiedTaxRate: '3.550%',
    rateNum: 3.550,
    equalizationRatio: 57.8,
    avgTaxBill: '$12,372 / yr',
    schoolsShare: '64.14%',
    muniShare: '26.33%',
    countyShare: '9.53%',
    schoolDistrictName: 'PTHSD School District',
    schoolDistrictShort: 'PTHSD Schools',
    schoolBudgetDisplay: '$187.5M',
    muniBudgetDisplay: '$92.8M',
    benefitsSpendDisplay: '$61.1M',
    avgAssessed: '$348.5k',
    typicalMarket: 603000,
    sliderMin: 100000,
    sliderMax: 900000,
    sliderDefault: 348500,
    zipCodesDisplay: '07054, 07034, 07878 & 07950',
    controversyHighlight: 'Route 10 PILOTs, BOE funding disputes & utility funds',
    title: 'Parsippany Taxpayer Watchdog',
    pageTitle: 'Parsippany-Troy Hills NJ Taxpayer Watchdog | Where Does Your Money Go?',
    subtitle: 'Real-time public investigation into where your Parsippany-Troy Hills property taxes go, the $187.5M PTHSD school budget, $92.8M Township budget, 6 independent Fire Districts, Route 10 & Campus Drive PILOT controversies, and Morris County tax records.',
    basePath: 'data/parsippany',
    sliderLabelsHtml: `<span>$100k</span><span>$348.5k (Avg)</span><span>$550k</span><span>$900k+</span>`,
    quickPresetsHtml: `<span class="preset-label">Quick Presets:</span>
       <button class="preset-btn" data-val="225000">$225k (Lake Hiawatha)</button>
       <button class="preset-btn" data-val="295000">$295k (Lake Parsippany)</button>
       <button class="preset-btn active" data-val="348500">Parsippany Avg ($348.5k)</button>
       <button class="preset-btn" data-val="435000">$435k (Mount Tabor)</button>
       <button class="preset-btn" data-val="545000">$545k (Tabor Hills)</button>`
  },
  wayne: {
    id: 'wayne',
    name: 'Wayne',
    fullName: 'Township of Wayne',
    badgeText: 'TOWNSHIP OF WAYNE • CITIZEN FISCAL WATCHDOG',
    icon: '🌳',
    county: 'Passaic County',
    countyShort: 'Passaic County',
    districtCode: '1614',
    auditBadge: 'PASSAIC COUNTY AUDIT • 2026',
    certifiedTaxRate: '2.748%',
    rateNum: 2.748,
    equalizationRatio: 80.4,
    avgTaxBill: '$13,245 / yr',
    schoolsShare: '58.40%',
    muniShare: '26.20%',
    countyShare: '15.40%',
    schoolDistrictName: 'Wayne Township Public Schools',
    schoolDistrictShort: 'Wayne BOE',
    schoolBudgetDisplay: '$186.2M',
    muniBudgetDisplay: '$83.5M',
    benefitsSpendDisplay: '$57.4M',
    avgAssessed: '$482.0k',
    typicalMarket: 599500,
    sliderMin: 150000,
    sliderMax: 1200000,
    sliderDefault: 482000,
    zipCodesDisplay: '07470 & 07474',
    controversyHighlight: 'Willowbrook Mall ratable appeals, Toys R Us HQ loss & flood bonds',
    title: 'Wayne Township Taxpayer Watchdog',
    pageTitle: 'Wayne Township NJ Taxpayer Watchdog | Where Does Your Money Go?',
    subtitle: 'Citizen audit of Wayne Township public spending ($83.5M), Wayne Board of Education school levy ($186.2M), Willowbrook Mall commercial ratable appeals, Packanack Lake & Pines Lake assessments, and Passaic County tax levies.',
    basePath: 'data/wayne',
    sliderLabelsHtml: `<span>$150k</span><span>$482k (Avg)</span><span>$750k</span><span>$1.2M+</span>`,
    quickPresetsHtml: `<span class="preset-label">Quick Presets:</span>
       <button class="preset-btn" data-val="325000">$325k (Preakness Starter)</button>
       <button class="preset-btn" data-val="420000">$420k (Packanack Lake)</button>
       <button class="preset-btn active" data-val="482000">Wayne Avg ($482k)</button>
       <button class="preset-btn" data-val="650000">$650k (Pines Lake)</button>
       <button class="preset-btn" data-val="850000">$850k (High Mountain)</button>`
  },
  montclair: {
    id: 'montclair',
    name: 'Montclair',
    fullName: 'Township of Montclair',
    badgeText: 'TOWNSHIP OF MONTCLAIR • CITIZEN FISCAL WATCHDOG',
    icon: '🏡',
    county: 'Essex County',
    countyShort: 'Essex County',
    districtCode: '0713',
    auditBadge: 'ESSEX COUNTY AUDIT • 2026',
    certifiedTaxRate: '3.766%',
    rateNum: 3.766,
    equalizationRatio: 68.5,
    avgTaxBill: '$23,217 / yr',
    schoolsShare: '57.20%',
    muniShare: '26.50%',
    countyShare: '16.30%',
    schoolDistrictName: 'Montclair Public Schools',
    schoolDistrictShort: 'Montclair BOE',
    schoolBudgetDisplay: '$162.4M',
    muniBudgetDisplay: '$101.8M',
    benefitsSpendDisplay: '$64.2M',
    avgAssessed: '$616.5k',
    typicalMarket: 900000,
    sliderMin: 200000,
    sliderMax: 1800000,
    sliderDefault: 616500,
    zipCodesDisplay: '07042 & 07043 (Upper Montclair)',
    controversyHighlight: 'Highest tax bills in region, school bond debt & Lackawanna PILOTs',
    title: 'Montclair Taxpayer Watchdog',
    pageTitle: 'Montclair Township NJ Taxpayer Watchdog | Where Does Your Money Go?',
    subtitle: 'Citizen audit of Montclair Township\'s highest-in-region property taxes ($23,217 avg bill), $162.4M public school budget, municipal bond debt service, Seymour Street & Lackawanna Plaza PILOT exemptions, and Essex County rates.',
    basePath: 'data/montclair',
    sliderLabelsHtml: `<span>$200k</span><span>$616.5k (Avg)</span><span>$1.0M</span><span>$1.8M+</span>`,
    quickPresetsHtml: `<span class="preset-label">Quick Presets:</span>
       <button class="preset-btn" data-val="420000">$420k (South End)</button>
       <button class="preset-btn" data-val="550000">$550k (Walnut St)</button>
       <button class="preset-btn active" data-val="616500">Montclair Avg ($616.5k)</button>
       <button class="preset-btn" data-val="875000">$875k (Watchung)</button>
       <button class="preset-btn" data-val="1250000">$1.25M (Upper Montclair)</button>`
  },
  morristown: {
    id: 'morristown',
    name: 'Morristown',
    fullName: 'Town of Morristown',
    badgeText: 'TOWN OF MORRISTOWN • CITIZEN FISCAL WATCHDOG',
    icon: '📜',
    county: 'Morris County',
    countyShort: 'Morris County',
    districtCode: '1424',
    auditBadge: 'MORRIS COUNTY SEAT AUDIT • 2026',
    certifiedTaxRate: '2.285%',
    rateNum: 2.285,
    equalizationRatio: 85.1,
    avgTaxBill: '$13,223 / yr',
    schoolsShare: '54.80%',
    muniShare: '33.90%',
    countyShare: '11.30%',
    schoolDistrictName: 'Morris School District (MSD)',
    schoolDistrictShort: 'Morris School Dist',
    schoolBudgetDisplay: '$136.5M',
    muniBudgetDisplay: '$48.2M',
    benefitsSpendDisplay: '$33.8M',
    avgAssessed: '$578.7k',
    typicalMarket: 680000,
    sliderMin: 150000,
    sliderMax: 1200000,
    sliderDefault: 578700,
    zipCodesDisplay: '07960 (Historic Green, Speedwell & Washington)',
    controversyHighlight: 'HQ Plaza & M Station PILOT deals, joint school district cost sharing',
    title: 'Morristown Taxpayer Watchdog',
    pageTitle: 'Town of Morristown NJ Taxpayer Watchdog | Where Does Your Money Go?',
    subtitle: 'Citizen audit of the Morris County seat: $48.2M Town operating budget, Morris School District joint funding with Morris Township ($136.5M), HQ Plaza & M Station PILOT abatements, and Morris County tax distribution.',
    basePath: 'data/morristown',
    sliderLabelsHtml: `<span>$150k</span><span>$578.7k (Avg)</span><span>$750k</span><span>$1.2M+</span>`,
    quickPresetsHtml: `<span class="preset-label">Quick Presets:</span>
       <button class="preset-btn" data-val="280000">$280k (Speedwell Ave)</button>
       <button class="preset-btn" data-val="360000">$360k (Historic District)</button>
       <button class="preset-btn active" data-val="578700">Morristown Avg ($578.7k)</button>
       <button class="preset-btn" data-val="680000">$680k (Morristown Green)</button>
       <button class="preset-btn" data-val="880000">$880k (Washington Valley)</button>`
  },
  montville: {
    id: 'montville',
    name: 'Montville',
    fullName: 'Township of Montville',
    badgeText: 'TOWNSHIP OF MONTVILLE • CITIZEN FISCAL WATCHDOG',
    icon: '🏞️',
    county: 'Morris County',
    countyShort: 'Morris County',
    districtCode: '1421',
    auditBadge: 'MORRIS COUNTY AUDIT • 2026',
    certifiedTaxRate: '2.492%',
    rateNum: 2.492,
    equalizationRatio: 82.8,
    avgTaxBill: '$16,198 / yr',
    schoolsShare: '66.20%',
    muniShare: '22.90%',
    countyShare: '10.90%',
    schoolDistrictName: 'Montville Township Public Schools',
    schoolDistrictShort: 'Montville BOE',
    schoolBudgetDisplay: '$98.4M',
    muniBudgetDisplay: '$31.2M',
    benefitsSpendDisplay: '$28.6M',
    avgAssessed: '$650.0k',
    typicalMarket: 785000,
    sliderMin: 200000,
    sliderMax: 1500000,
    sliderDefault: 650000,
    zipCodesDisplay: '07045 (Montville), 07058 (Pine Brook), 07082 (Towaco)',
    controversyHighlight: '66.2% school levy share due to State Aid cliff, low 10.9% county tax',
    title: 'Montville Taxpayer Watchdog',
    pageTitle: 'Montville Township NJ Taxpayer Watchdog | Where Does Your Money Go?',
    subtitle: 'Citizen investigation into Montville Township taxes: high 66.2% local school levy share caused by state aid cuts, low 10.9% Morris County burden, Pine Brook commercial strip ratables, and Towaco residential tax bills.',
    basePath: 'data/montville',
    sliderLabelsHtml: `<span>$200k</span><span>$650k (Avg)</span><span>$950k</span><span>$1.5M+</span>`,
    quickPresetsHtml: `<span class="preset-label">Quick Presets:</span>
       <button class="preset-btn" data-val="380000">$380k (Pine Brook Condo)</button>
       <button class="preset-btn" data-val="495000">$495k (Towaco Station)</button>
       <button class="preset-btn active" data-val="650000">Montville Avg ($650k)</button>
       <button class="preset-btn" data-val="850000">$850k (Changebridge Rd)</button>
       <button class="preset-btn" data-val="1150000">$1.15M (Taylortown Estates)</button>`
  },
  glenrock: {
    id: 'glenrock',
    name: 'Glen Rock',
    fullName: 'Borough of Glen Rock',
    badgeText: 'BOROUGH OF GLEN ROCK • CITIZEN FISCAL WATCHDOG',
    icon: '🪨',
    county: 'Bergen County',
    countyShort: 'Bergen County',
    districtCode: '0222',
    auditBadge: 'BERGEN COUNTY AUDIT • 2026',
    certifiedTaxRate: '3.407%',
    rateNum: 3.407,
    equalizationRatio: 71.5,
    avgTaxBill: '$20,138 / yr',
    schoolsShare: '68.21%',
    muniShare: '22.39%',
    countyShare: '9.40%',
    schoolDistrictName: 'Glen Rock Public Schools (BOE)',
    schoolDistrictShort: 'Glen Rock BOE',
    schoolBudgetDisplay: '$61.8M',
    muniBudgetDisplay: '$27.4M',
    benefitsSpendDisplay: '$16.8M',
    avgAssessed: '$591.2k',
    typicalMarket: 826000,
    sliderMin: 200000,
    sliderMax: 1800000,
    sliderDefault: 591156,
    zipCodesDisplay: '07452',
    controversyHighlight: '68% school tax burden, SHBP healthcare exit to JIF & rail crossing infrastructure',
    title: 'Glen Rock Taxpayer Watchdog',
    pageTitle: 'Borough of Glen Rock NJ Taxpayer Watchdog | Where Does Your Money Go?',
    subtitle: 'Citizen audit of Glen Rock\'s property taxes ($20,138 avg bill), $61.8M public school budget (68.2% share), Borough municipal operations ($27.4M), SHBP health insurance transition, and Bergen County tax levies.',
    basePath: 'data/glenrock',
    sliderLabelsHtml: `<span>$200k</span><span>$591.2k (Avg)</span><span>$1.0M</span><span>$1.8M+</span>`,
    quickPresetsHtml: `<span class="preset-label">Quick Presets:</span>
       <button class="preset-btn" data-val="450000">$450k (Radburn / South)</button>
       <button class="preset-btn" data-val="530000">$530k (Central / Maple)</button>
       <button class="preset-btn active" data-val="591156">Glen Rock Avg ($591.2k)</button>
       <button class="preset-btn" data-val="720000">$720k (Byrd / Highwood)</button>
       <button class="preset-btn" data-val="950000">$950k (Hamilton Estates)</button>`
  }
};

// Formatting helpers
function formatUSD(num) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(num);
}

function formatUSDWhole(num) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
}

// Determine Initial City from URL or LocalStorage
function getInitialCity() {
  try {
    const params = new URLSearchParams(window.location.search);
    const urlCity = (params.get('city') || '').toLowerCase();
    if (CITY_REGISTRY[urlCity]) {
      return urlCity;
    }
    const saved = localStorage.getItem('watchdog_city');
    if (saved && CITY_REGISTRY[saved]) {
      return saved;
    }
  } catch (e) {
    // ignore storage errors
  }
  return 'clifton';
}

// Highlight Active Hub Link in Navigation Bar
function syncNavActive() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a.nav-item-btn').forEach(link => {
    const href = link.getAttribute('href');
    const isCurrent = href === currentPath || (currentPath === '' && href === 'index.html');
    link.classList.toggle('active', isCurrent);
    if (isCurrent) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

// Initialize Application
async function initApp() {
  currentCity = getInitialCity();
  syncNavActive();
  setupTabs();
  setupCollapsibleSections();
  setupCitySwitcher();
  handleUrlHash();

  // Ensure the current page has an active tab pane
  if (!document.querySelector('.tab-pane.active')) {
    const firstPane = document.querySelector('.tab-pane');
    if (firstPane) {
      firstPane.classList.add('active');
      const firstTabBtn = document.querySelector(`.hub-subnav-btn[data-tab="${firstPane.id}"]`) || document.querySelector(`.tab-btn[data-tab="${firstPane.id}"]`);
      if (firstTabBtn) firstTabBtn.classList.add('active');
    }
  }

  await switchCity(currentCity, false);

  // Check for ?calc= param to preload calculator from property links
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('calc')) {
    const val = parseInt(urlParams.get('calc'), 10);
    const input = document.getElementById('calc-assessment-input');
    const slider = document.getElementById('calc-assessment-slider');
    if (!isNaN(val) && input) {
      input.value = val;
      if (slider) slider.value = val;
      input.dispatchEvent(new Event('input'));
    }
  }
}

// Setup City Switcher Buttons in Header & Sticky Nav
function setupCitySwitcher() {
  document.querySelectorAll('.city-switch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetCity = btn.getAttribute('data-city');
      if (targetCity && targetCity !== currentCity) {
        switchCity(targetCity, true);
      }
    });
  });
}

// Switch Active Municipality across all 6 switchable cities
async function switchCity(cityId, updateUrl = true) {
  currentCity = CITY_REGISTRY[cityId] ? cityId : 'clifton';

  try {
    localStorage.setItem('watchdog_city', currentCity);
    if (updateUrl && window.history && window.history.replaceState) {
      const url = new URL(window.location.href);
      if (currentCity !== 'clifton') {
        url.searchParams.set('city', currentCity);
      } else {
        url.searchParams.delete('city');
      }
      window.history.replaceState({}, '', url.toString());
    }
  } catch (e) {
    // ignore URL/storage restrictions
  }

  // Update active state on all city switcher buttons
  document.querySelectorAll('.city-switch-btn').forEach(btn => {
    const isMatch = btn.getAttribute('data-city') === currentCity;
    btn.classList.toggle('active', isMatch);
    btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
  });

  await loadAllData(currentCity);
  applyCityStaticCopy(currentCity);

  // Reset pagination to page 1 when switching cities
  propCurrentPage = 1;

  // Render sections conditionally based on DOM elements present on the active page
  if (document.getElementById('calc-assessment-input')) setupCalculator();
  if (document.getElementById('boe-line-items')) renderBudgets();
  if (document.getElementById('demo-population') || document.getElementById('demo-median-income-07013')) renderDemographics();
  if (document.getElementById('properties-table-body') || document.getElementById('properties-cards-grid')) {
    renderProperties();
    setupPropertyFilters();
  }
  if (document.getElementById('surrounding-towns-grid')) renderSurroundingTowns();
  if (document.getElementById('benefits-costs-grid')) renderBenefits();
  if (document.getElementById('controversies-timeline')) renderControversies();
  if (document.getElementById('staff-table-body')) {
    renderStaffTable('all', document.getElementById('staff-search-input')?.value || '');
    setupStaffFilters();
  }
  if (document.getElementById('ethics-cards-container') || document.getElementById('ethics-cards-grid')) {
    renderEthicsCards('all');
    setupEthicsFilters();
  }
  if (document.getElementById('vendors-cards-container') || document.getElementById('vendors-cards-grid')) {
    renderVendorsCards();
  }
  if (document.getElementById('intel-reports-list')) {
    setupInvestigationTools();
    renderIntelligenceReports();
  }
  if (document.getElementById('pilot-projects-grid')) renderCommercialPilot();
  if (document.getElementById('fair-tax-engine-container') || document.getElementById('ft-scenarios-pills')) renderFairTaxEngine();
  if (document.getElementById('election-candidates-grid') || document.getElementById('election-ballot-overview-grid')) {
    renderElectionHub();
    setupElectionControls();
  }
}


// Critical Intel Grid customized for each town
function getCriticalIntelGrid(cityId, meta) {
  if (cityId === 'parsippany') {
    return `<!-- Card 1: 6 Independent Fire Districts & Assessment Drift -->
       <div class="calc-card" style="border-top: 4px solid #2563eb;">
         <div class="card-title-row" style="margin-bottom: 10px;">
           <h3 style="font-size: 1.08rem; display: flex; align-items: center; gap: 8px;"><span>🚒</span> 6 Independent Fire Districts & Assessment Drift</h3>
           <span class="badge-tag">66.6% Ratio</span>
         </div>
         <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px;">
           Unlike municipalities with a single municipal fire budget, Parsippany is divided into <strong>6 autonomous Fire Districts (#1–#6)</strong>, each with its own elected commissioners and separate tax rate:
         </p>
         <ul style="font-size: 0.84rem; color: var(--text-main); line-height: 1.55; padding-left: 18px; margin-bottom: 14px;">
           <li><strong>Separate Fire District Levies:</strong> Ranges from <strong>$0.042 to $0.118 per $100 assessed</strong> depending on whether you live in Mount Tabor (#1), Rainbow Lakes (#2), Lake Parsippany (#3), Lake Hiawatha (#4), Rockaway Neck (#5), or Parsippany Center (#6).</li>
           <li><strong>Post-2020 Revaluation Drift:</strong> Parsippany completed its last revaluation in 2020. Since then, home prices surged while corporate office parks appealed assessments down, dropping the equalization ratio to <strong>66.60%</strong>.</li>
         </ul>
         <div style="display: flex; gap: 10px; flex-wrap: wrap;">
           <a href="https://www.parsippany.net/department/tax-assessor" target="_blank" rel="noopener" class="external-pill-link-sm">Parsippany Tax Assessor Office ↗</a>
           <button class="btn-jump-action secondary" data-jump-tab="tab-fair-tax" style="padding: 6px 10px; font-size: 0.78rem;">Model 100% Reval in What-If Simulator ➔</button>
         </div>
       </div>

       <!-- Card 2: NJ State Property Tax Relief -->
       <div class="calc-card" style="border-top: 4px solid #059669;">
         <div class="card-title-row" style="margin-bottom: 10px;">
           <h3 style="font-size: 1.08rem; display: flex; align-items: center; gap: 8px;"><span>🛡️</span> Direct NJ Tax Relief: Stay NJ, ANCHOR & Freeze</h3>
           <span class="badge-tag" style="background: #dcfce7; color: #166534;">Combined Form PAS-1</span>
         </div>
         <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px;">
           Parsippany homeowners and tenants can claim substantial state property tax rebates through New Jersey's combined <strong>Form PAS-1</strong> portal:
         </p>
         <ul style="font-size: 0.84rem; color: var(--text-main); line-height: 1.55; padding-left: 18px; margin-bottom: 14px;">
           <li><strong>Stay NJ (Seniors 65+):</strong> Rebates up to <strong>50% of property taxes</strong> (up to <strong>$6,500/yr</strong>) for Parsippany senior homeowners with household income under $500,000.</li>
           <li><strong>ANCHOR Rebate:</strong> Provides <strong>$1,000 to $1,750</strong> for eligible homeowners (income ≤ $250,000) and <strong>$450 to $700</strong> for Parsippany apartment renters (income ≤ $150,000).</li>
           <li><strong>Senior Freeze (PTR):</strong> Reimburses eligible seniors/disabled homeowners for property tax increases above their base year.</li>
         </ul>
         <div style="display: flex; gap: 10px; flex-wrap: wrap;">
           <a href="https://propertytaxrelief.nj.gov" target="_blank" rel="noopener" class="external-pill-link-sm">Official NJ Property Tax Relief Portal (PAS-1) ↗</a>
         </div>
       </div>

       <!-- Card 3: Self-Liquidating Utilities -->
       <div class="calc-card" style="border-top: 4px solid #d97706;">
         <div class="card-title-row" style="margin-bottom: 10px;">
           <h3 style="font-size: 1.08rem; display: flex; align-items: center; gap: 8px;"><span>⛳</span> Water, Sewer & Knoll Country Club Utilities ($35.8M)</h3>
           <span class="badge-alert">Enterprise Funds</span>
         </div>
         <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px;">
           Outside the $92.8M general municipal budget, Parsippany operates dedicated municipal enterprise utilities totaling <strong>$35.85 Million/yr</strong>:
         </p>
         <ul style="font-size: 0.84rem; color: var(--text-main); line-height: 1.55; padding-left: 18px; margin-bottom: 14px;">
           <li><strong>Water & Sewer Utilities ($31.0M):</strong> Funded through quarterly user fees rather than property tax rates, covering PFAS filtration upgrades.</li>
           <li><strong>Knoll Country Club Utility ($4.85M):</strong> Township-owned 36-hole golf facility generating user fees to cover capital debt.</li>
         </ul>
         <div style="display: flex; gap: 10px; flex-wrap: wrap;">
           <a href="https://www.parsippany.net/department/finance" target="_blank" rel="noopener" class="external-pill-link-sm">Parsippany Finance & Utility Budgets ↗</a>
         </div>
       </div>`;
  }
  
  if (cityId === 'wayne') {
    return `<!-- Card 1: Commercial Ratables & Route 23/46 Appeals -->
       <div class="calc-card" style="border-top: 4px solid #2563eb;">
         <div class="card-title-row" style="margin-bottom: 10px;">
           <h3 style="font-size: 1.08rem; display: flex; align-items: center; gap: 8px;"><span>🏬</span> Willowbrook Mall & Commercial Ratable Appeals</h3>
           <span class="badge-tag">Ratable Defense</span>
         </div>
         <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px;">
           Wayne's tax base relies on retail and corporate corridors along Route 23, Route 46, and Willowbrook Mall:
         </p>
         <ul style="font-size: 0.84rem; color: var(--text-main); line-height: 1.55; padding-left: 18px; margin-bottom: 14px;">
           <li><strong>Commercial Ratable Share:</strong> Commercial properties fund <strong>25.5% of the total tax levy</strong>, helping mitigate residential tax rates.</li>
           <li><strong>Tax Court Appeals:</strong> Large commercial appeals require proactive municipal legal defense to prevent tax burden shifts onto residential neighborhoods.</li>
         </ul>
         <div style="display: flex; gap: 10px; flex-wrap: wrap;">
           <a href="https://www.waynetownship.com/assessor.html" target="_blank" rel="noopener" class="external-pill-link-sm">Wayne Township Tax Assessor ↗</a>
         </div>
       </div>

       <!-- Card 2: Pompton & Passaic River Flood Mitigation -->
       <div class="calc-card" style="border-top: 4px solid #059669;">
         <div class="card-title-row" style="margin-bottom: 10px;">
           <h3 style="font-size: 1.08rem; display: flex; align-items: center; gap: 8px;"><span>🌊</span> Pompton & Passaic River Flood Basin Mitigation</h3>
           <span class="badge-tag" style="background: #dbeafe; color: #1e40af;">Flood Mitigation</span>
         </div>
         <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px;">
           Wayne manages critical flood mitigation programs across the Pompton and Passaic river basins:
         </p>
         <ul style="font-size: 0.84rem; color: var(--text-main); line-height: 1.55; padding-left: 18px; margin-bottom: 14px;">
           <li><strong>FEMA Blue Acres & Elevation Grants:</strong> Acquisition and elevation of repetitive-loss flood-prone properties along river basins.</li>
           <li><strong>Stormwater Capital Bonds:</strong> Municipal debt allocations support retention berms, pump station upgrades, and drainage maintenance.</li>
         </ul>
         <div style="display: flex; gap: 10px; flex-wrap: wrap;">
           <a href="https://www.waynetownship.com/engineering-flood.html" target="_blank" rel="noopener" class="external-pill-link-sm">Wayne Flood Control & Engineering ↗</a>
         </div>
       </div>

       <!-- Card 3: School District Funding -->
       <div class="calc-card" style="border-top: 4px solid #d97706;">
         <div class="card-title-row" style="margin-bottom: 10px;">
           <h3 style="font-size: 1.08rem; display: flex; align-items: center; gap: 8px;"><span>🏫</span> Wayne Public Schools ($186.2M Budget)</h3>
           <span class="badge-alert">58.4% of Taxes</span>
         </div>
         <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px;">
           Wayne Township Public Schools serves over 7,800 students across 14 public campuses:
         </p>
         <ul style="font-size: 0.84rem; color: var(--text-main); line-height: 1.55; padding-left: 18px; margin-bottom: 14px;">
           <li><strong>Local Tax Share:</strong> The local school tax levy represents <strong>58.4% of every tax dollar</strong> collected in Wayne ($1.605 per $100 assessed).</li>
           <li><strong>Facility Modernization:</strong> Capital funding targets science labs, roof replacements, and HVAC ventilation across historic buildings.</li>
         </ul>
         <div style="display: flex; gap: 10px; flex-wrap: wrap;">
           <a href="https://www.wayneschools.com" target="_blank" rel="noopener" class="external-pill-link-sm">Wayne BOE Budget Portal ↗</a>
         </div>
       </div>`;
  }

  if (cityId === 'montclair') {
    return `<!-- Card 1: School Referendum & Historic Facilities -->
       <div class="calc-card" style="border-top: 4px solid #2563eb;">
         <div class="card-title-row" style="margin-bottom: 10px;">
           <h3 style="font-size: 1.08rem; display: flex; align-items: center; gap: 8px;"><span>🏫</span> $188M School Bond Referendum & Facility Debt</h3>
           <span class="badge-tag">Capital Investment</span>
         </div>
         <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px;">
           Montclair voters approved a historic $188 Million bond referendum to restore aging school buildings:
         </p>
         <ul style="font-size: 0.84rem; color: var(--text-main); line-height: 1.55; padding-left: 18px; margin-bottom: 14px;">
           <li><strong>Multi-Campus Upgrades:</strong> Financing district-wide HVAC installations, boiler replacements, modern science labs, and accessibility compliance.</li>
           <li><strong>Debt Service Impact:</strong> Bond repayments are amortized over 20+ years, requiring disciplined annual budgeting within the state 2% cap.</li>
         </ul>
         <div style="display: flex; gap: 10px; flex-wrap: wrap;">
           <a href="https://www.montclair.k12.nj.us" target="_blank" rel="noopener" class="external-pill-link-sm">Montclair Public Schools Bond Info ↗</a>
         </div>
       </div>

       <!-- Card 2: Regional Property Tax Effort -->
       <div class="calc-card" style="border-top: 4px solid #059669;">
         <div class="card-title-row" style="margin-bottom: 10px;">
           <h3 style="font-size: 1.08rem; display: flex; align-items: center; gap: 8px;"><span>💰</span> Highest Average Property Tax Bill in Region ($23,217)</h3>
           <span class="badge-alert" style="background: #fee2e2; color: #b91c1c;">Highest Regional Tax</span>
         </div>
         <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px;">
           Montclair homeowners shoulder one of the highest municipal average tax bills in the state:
         </p>
         <ul style="font-size: 0.84rem; color: var(--text-main); line-height: 1.55; padding-left: 18px; margin-bottom: 14px;">
           <li><strong>Certified Composite Rate:</strong> 3.766% per $100 on an average residential assessment of $616,500.</li>
           <li><strong>State Aid Gap:</strong> Under the NJ SFRA formula, Montclair receives modest state equalization aid, requiring local homeowners to fund over 85% of school operations.</li>
         </ul>
         <div style="display: flex; gap: 10px; flex-wrap: wrap;">
           <a href="https://propertytaxrelief.nj.gov" target="_blank" rel="noopener" class="external-pill-link-sm">Claim Stay NJ & ANCHOR Relief (PAS-1) ↗</a>
         </div>
       </div>

       <!-- Card 3: Downtown Redevelopment & PILOT Agreements -->
       <div class="calc-card" style="border-top: 4px solid #d97706;">
         <div class="card-title-row" style="margin-bottom: 10px;">
           <h3 style="font-size: 1.08rem; display: flex; align-items: center; gap: 8px;"><span>🏗️</span> Bloomfield Ave & Lackawanna Plaza PILOTs</h3>
           <span class="badge-tag">Redevelopment</span>
         </div>
         <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px;">
           Montclair has utilized Long-Term Tax Exemptions (PILOTs) for downtown and transit-oriented projects:
         </p>
         <ul style="font-size: 0.84rem; color: var(--text-main); line-height: 1.55; padding-left: 18px; margin-bottom: 14px;">
           <li><strong>Seymour Street & MC Hotel:</strong> High-density arts and residential corridor generating annual service charges to municipal coffers.</li>
           <li><strong>School Revenue Sharing:</strong> Unlike conventional taxes where 57.2% goes to schools, PILOT service charges flow 95% to Township Hall unless negotiated otherwise.</li>
         </ul>
         <div style="display: flex; gap: 10px; flex-wrap: wrap;">
           <a href="https://www.montclairnjusa.org" target="_blank" rel="noopener" class="external-pill-link-sm">Township Planning & PILOT Records ↗</a>
         </div>
       </div>`;
  }

  if (cityId === 'morristown') {
    return `<!-- Card 1: Regional School District Cost Sharing -->
       <div class="calc-card" style="border-top: 4px solid #2563eb;">
         <div class="card-title-row" style="margin-bottom: 10px;">
           <h3 style="font-size: 1.08rem; display: flex; align-items: center; gap: 8px;"><span>🏫</span> Morris School District Regional Equalization</h3>
           <span class="badge-tag">Joint K-12 District</span>
         </div>
         <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px;">
           Morristown and Morris Township jointly fund the <strong>Morris School District ($136.5M budget)</strong>:
         </p>
         <ul style="font-size: 0.84rem; color: var(--text-main); line-height: 1.55; padding-left: 18px; margin-bottom: 14px;">
           <li><strong>Statutory Cost-Sharing:</strong> School tax shares are apportioned annually based on state equalized property valuations between Morristown and Morris Township.</li>
           <li><strong>High School & Dual Language:</strong> Funding 10 campuses including Morristown High School and specialized STEM academies.</li>
         </ul>
         <div style="display: flex; gap: 10px; flex-wrap: wrap;">
           <a href="https://www.morrisschooldistrict.org" target="_blank" rel="noopener" class="external-pill-link-sm">Morris School District Budget Portal ↗</a>
         </div>
       </div>

       <!-- Card 2: Commercial Ratable Hub & M Station PILOTs -->
       <div class="calc-card" style="border-top: 4px solid #059669;">
         <div class="card-title-row" style="margin-bottom: 10px;">
           <h3 style="font-size: 1.08rem; display: flex; align-items: center; gap: 8px;"><span>🏢</span> M Station, HQ Plaza & Commercial Ratable Core</h3>
           <span class="badge-tag" style="background: #dbeafe; color: #1e40af;">43.6% Commercial</span>
         </div>
         <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px;">
           As the Morris County seat, Morristown features a robust corporate commercial ratable base:
         </p>
         <ul style="font-size: 0.84rem; color: var(--text-main); line-height: 1.55; padding-left: 18px; margin-bottom: 14px;">
           <li><strong>Commercial Share:</strong> Commercial properties generate <strong>43.6% of the town's property tax base</strong>, significantly reducing residential millage rates.</li>
           <li><strong>M Station PILOT:</strong> Transit-oriented Class A office and retail development on Morris Street generating substantial PILOT service payments.</li>
         </ul>
         <div style="display: flex; gap: 10px; flex-wrap: wrap;">
           <a href="https://www.townofmorristown.org" target="_blank" rel="noopener" class="external-pill-link-sm">Town of Morristown Finance ↗</a>
         </div>
       </div>

       <!-- Card 3: County Seat Infrastructure & Parking Authority -->
       <div class="calc-card" style="border-top: 4px solid #d97706;">
         <div class="card-title-row" style="margin-bottom: 10px;">
           <h3 style="font-size: 1.08rem; display: flex; align-items: center; gap: 8px;"><span>⚖️</span> Morris County Seat & Parking Infrastructure</h3>
           <span class="badge-alert">County Government</span>
         </div>
         <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px;">
           Morristown hosts the Morris County Courthouse, Administration Complex, and extensive commuter parking infrastructure:
         </p>
         <ul style="font-size: 0.84rem; color: var(--text-main); line-height: 1.55; padding-left: 18px; margin-bottom: 14px;">
           <li><strong>Tax-Exempt Government Land:</strong> Extensive county, state, and historical parkland requires strong commercial ratables to balance the municipal ledger.</li>
           <li><strong>Parking Authority:</strong> Dedicated garages and metered parking generate self-liquidating municipal revenues that subsidize general town operations.</li>
         </ul>
         <div style="display: flex; gap: 10px; flex-wrap: wrap;">
           <a href="https://www.morristownparking.com" target="_blank" rel="noopener" class="external-pill-link-sm">Morristown Parking Authority ↗</a>
         </div>
       </div>`;
  }

  if (cityId === 'montville') {
    return `<!-- Card 1: Low Municipal Debt & Open Space Preservation -->
       <div class="calc-card" style="border-top: 4px solid #2563eb;">
         <div class="card-title-row" style="margin-bottom: 10px;">
           <h3 style="font-size: 1.08rem; display: flex; align-items: center; gap: 8px;"><span>🏞️</span> Low Municipal Debt & Open Space Conservation</h3>
           <span class="badge-tag">AAA Rating</span>
         </div>
         <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px;">
           Montville maintains conservative fiscal management and aggressive open space defense:
         </p>
         <ul style="font-size: 0.84rem; color: var(--text-main); line-height: 1.55; padding-left: 18px; margin-bottom: 14px;">
           <li><strong>Low Debt Ratio:</strong> Montville holds one of the lowest municipal debt-to-equalized valuation ratios in Morris County.</li>
           <li><strong>Open Space Trust:</strong> Dedicated municipal open space funds partner with Morris County to protect watershed ridges and prevent overdevelopment.</li>
         </ul>
         <div style="display: flex; gap: 10px; flex-wrap: wrap;">
           <a href="https://www.montvillenj.org" target="_blank" rel="noopener" class="external-pill-link-sm">Montville Township Assessor & Finance ↗</a>
         </div>
       </div>

       <!-- Card 2: Top-Tier School System -->
       <div class="calc-card" style="border-top: 4px solid #059669;">
         <div class="card-title-row" style="margin-bottom: 10px;">
           <h3 style="font-size: 1.08rem; display: flex; align-items: center; gap: 8px;"><span>🏫</span> Montville Public Schools ($84.2M Budget)</h3>
           <span class="badge-tag" style="background: #dcfce7; color: #166534;">66.2% of Taxes</span>
         </div>
         <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px;">
           Montville Township Public Schools accounts for nearly two-thirds of the total property tax bill:
         </p>
         <ul style="font-size: 0.84rem; color: var(--text-main); line-height: 1.55; padding-left: 18px; margin-bottom: 14px;">
           <li><strong>Classroom Investment:</strong> Over 66% of every property tax dollar goes directly to 7 district schools, maintaining high state rankings in STEM.</li>
           <li><strong>Self-Funded Local Levy:</strong> Low state categorical aid requires local homeowners to fund over 90% of school operations.</li>
         </ul>
         <div style="display: flex; gap: 10px; flex-wrap: wrap;">
           <a href="https://www.montville.net" target="_blank" rel="noopener" class="external-pill-link-sm">Montville School Board Portal ↗</a>
         </div>
       </div>

       <!-- Card 3: Volunteer Fire & Self-Sustaining Utilities -->
       <div class="calc-card" style="border-top: 4px solid #d97706;">
         <div class="card-title-row" style="margin-bottom: 10px;">
           <h3 style="font-size: 1.08rem; display: flex; align-items: center; gap: 8px;"><span>🚒</span> 3 Volunteer Fire Districts & Dedicated Water Utility</h3>
           <span class="badge-alert">Community Protection</span>
         </div>
         <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px;">
           Montville relies on dedicated volunteer fire companies and enterprise utility funding:
         </p>
         <ul style="font-size: 0.84rem; color: var(--text-main); line-height: 1.55; padding-left: 18px; margin-bottom: 14px;">
           <li><strong>Fire Districts (Montville, Towaco, Pine Brook):</strong> Dedicated volunteer apparatus and capital funding protect three distinct township sections at low taxpayer cost.</li>
           <li><strong>Water Utility:</strong> Metered enterprise utility funds wellhead filtration and water main upkeep without impacting the general municipal tax rate.</li>
         </ul>
         <div style="display: flex; gap: 10px; flex-wrap: wrap;">
           <a href="https://www.montvillenj.org/218/Water-and-Sewer" target="_blank" rel="noopener" class="external-pill-link-sm">Montville Water & Sewer Department ↗</a>
         </div>
       </div>`;
  }

  if (cityId === 'glenrock') {
    return `<!-- Card 1: SHBP Exit & Health Benefit Stabilization -->
       <div class="calc-card" style="border-top: 4px solid #2563eb;">
         <div class="card-title-row" style="margin-bottom: 10px;">
           <h3 style="font-size: 1.08rem; display: flex; align-items: center; gap: 8px;"><span>🏥</span> Exit from SHBP to Municipal JIF Health Pool</h3>
           <span class="badge-tag">Cost Stabilization</span>
         </div>
         <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px;">
           Facing double-digit rate hikes in the NJ State Health Benefits Program (SHBP), Glen Rock Borough transitioned municipal employees to a joint insurance fund (JIF):
         </p>
         <ul style="font-size: 0.84rem; color: var(--text-main); line-height: 1.55; padding-left: 18px; margin-bottom: 14px;">
           <li><strong>Healthcare Premium Savings:</strong> Exiting SHBP stabilized healthcare expenditure trends, preventing an estimated 15%–22% compounding annual hike on municipal premiums.</li>
           <li><strong>Chapter 78 Contributions:</strong> Borough and school staff continue paying tiered cost-sharing percentages toward their health benefits based on statutory salary brackets.</li>
         </ul>
         <div style="display: flex; gap: 10px; flex-wrap: wrap;">
           <a href="https://glenrocknj.net" target="_blank" rel="noopener" class="external-pill-link-sm">Glen Rock Borough Administration ↗</a>
         </div>
       </div>

       <!-- Card 2: 68.2% School Tax Burden & Low State Aid -->
       <div class="calc-card" style="border-top: 4px solid #059669;">
         <div class="card-title-row" style="margin-bottom: 10px;">
           <h3 style="font-size: 1.08rem; display: flex; align-items: center; gap: 8px;"><span>🏫</span> 68.2% School Tax Share & Low SFRA State Aid</h3>
           <span class="badge-tag" style="background: #dcfce7; color: #166534;">68.2% of Taxes</span>
         </div>
         <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px;">
           Glen Rock Public Schools ($61.8M budget) represents the largest share of property taxes in Bergen County:
         </p>
         <ul style="font-size: 0.84rem; color: var(--text-main); line-height: 1.55; padding-left: 18px; margin-bottom: 14px;">
           <li><strong>Local Levy Reliance:</strong> Under the NJ School Funding Reform Act (SFRA), Glen Rock receives modest state equalization aid (~$3.7M), requiring residential taxpayers to fund over 88% of district operating costs.</li>
           <li><strong>Top-Tier Academic Investment:</strong> Funds 6 neighborhood campuses serving ~2,580 students, consistently ranking among New Jersey's top public school systems.</li>
         </ul>
         <div style="display: flex; gap: 10px; flex-wrap: wrap;">
           <a href="https://www.glenrocknj.org" target="_blank" rel="noopener" class="external-pill-link-sm">Glen Rock Public Schools BOE ↗</a>
         </div>
       </div>

       <!-- Card 3: Commuter Rail Transit & Diamond Brook Mitigation -->
       <div class="calc-card" style="border-top: 4px solid #d97706;">
         <div class="card-title-row" style="margin-bottom: 10px;">
           <h3 style="font-size: 1.08rem; display: flex; align-items: center; gap: 8px;"><span>🚆</span> Dual NJ Transit Stations & Diamond Brook Stormwater</h3>
           <span class="badge-alert">Transit & Drainage</span>
         </div>
         <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px;">
           Glen Rock maintains unique dual-station rail transit corridors and regional stormwater infrastructure:
         </p>
         <ul style="font-size: 0.84rem; color: var(--text-main); line-height: 1.55; padding-left: 18px; margin-bottom: 14px;">
           <li><strong>Dual Rail Hubs:</strong> Served by both the Main Line (Glen Rock Main Line Station) and Bergen County Line (Glen Rock Boro Hall Station), anchoring property values and commuter parking enterprise funds.</li>
           <li><strong>Diamond Brook Flood Mitigation:</strong> Ongoing capital stormwater engineering along Diamond Brook and drainage culverts reduces flash flood risks during severe weather events.</li>
         </ul>
         <div style="display: flex; gap: 10px; flex-wrap: wrap;">
           <a href="https://glenrocknj.net/departments/department-of-public-works" target="_blank" rel="noopener" class="external-pill-link-sm">Glen Rock DPW & Engineering ↗</a>
         </div>
       </div>`;
  }

  // Default: Clifton
  return `<!-- Card 1: Mandatory 2026-2027 ASI Citywide Revaluation -->
       <div class="calc-card" style="border-top: 4px solid #2563eb;">
         <div class="card-title-row" style="margin-bottom: 10px;">
           <h3 style="font-size: 1.08rem; display: flex; align-items: center; gap: 8px;"><span>📐</span> Mandatory 2026–2027 Property Revaluation (ASI)</h3>
           <span class="badge-tag">1st Since 1990</span>
         </div>
         <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px;">
           Ordered by the Passaic County Board of Taxation and NJ Division of Taxation, Clifton contracted <strong>Appraisal Systems, Inc. (ASI)</strong> for a <strong>$3.2M citywide revaluation</strong> of all ~24,745 properties.
         </p>
         <ul style="font-size: 0.84rem; color: var(--text-main); line-height: 1.55; padding-left: 18px; margin-bottom: 14px;">
           <li><strong>Valuation Date:</strong> Assessed at 100% true market value as of <strong>October 1, 2026</strong> (replacing frozen 1990 baselines of ~31.8%–33.3%).</li>
           <li><strong>Tax Bill Impact (2027):</strong> Revaluation is <em>revenue-neutral</em> in total levy—as assessments rise ~3× to market value, the nominal tax rate drops proportionately from <strong>6.527% to ~2.2%–2.6%</strong>.</li>
           <li><strong>Extended Tax Appeal Deadline:</strong> Because of the revaluation, the formal Passaic County tax appeal deadline is extended from April 1 to <strong>May 1, 2027</strong> (after ASI informal taxpayer reviews).</li>
         </ul>
         <div style="display: flex; gap: 10px; flex-wrap: wrap;">
           <a href="https://www.asinj.com" target="_blank" rel="noopener" class="external-pill-link-sm">Appraisal Systems, Inc. (ASI) Portal ↗</a>
           <button class="btn-jump-action secondary" data-jump-tab="tab-fair-tax" style="padding: 6px 10px; font-size: 0.78rem;">Model 100% Reval in What-If Simulator ➔</button>
         </div>
       </div>

       <!-- Card 2: NJ State Property Tax Relief (Form PAS-1: Stay NJ, ANCHOR & Senior Freeze) -->
       <div class="calc-card" style="border-top: 4px solid #059669;">
         <div class="card-title-row" style="margin-bottom: 10px;">
           <h3 style="font-size: 1.08rem; display: flex; align-items: center; gap: 8px;"><span>🛡️</span> Direct NJ Tax Relief: Stay NJ, ANCHOR & Freeze</h3>
           <span class="badge-tag" style="background: #dcfce7; color: #166534;">Combined Form PAS-1</span>
         </div>
         <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px;">
           New Jersey now uses a single combined application (<strong>Form PAS-1</strong>) for seniors (65+) and Social Security disability recipients, alongside automated filing for general homeowners and renters:
         </p>
         <ul style="font-size: 0.84rem; color: var(--text-main); line-height: 1.55; padding-left: 18px; margin-bottom: 14px;">
           <li><strong>Stay NJ (Seniors 65+):</strong> Rebates up to <strong>50% of property taxes</strong> (capped up to <strong>$6,500/yr</strong>) for senior homeowners with household income under $500,000.</li>
           <li><strong>ANCHOR Rebate:</strong> Provides <strong>$1,000 to $1,750</strong> for eligible homeowners (income ≤ $250,000) and <strong>$450 to $700</strong> for Clifton renters (income ≤ $150,000).</li>
           <li><strong>Senior Freeze (PTR):</strong> Reimburses eligible seniors/disabled homeowners for any property tax increases above their established base year.</li>
           <li><strong>Filing Deadline:</strong> Submit combined Form PAS-1 by <strong>November 2, 2026</strong>.</li>
         </ul>
         <div style="display: flex; gap: 10px; flex-wrap: wrap;">
           <a href="https://propertytaxrelief.nj.gov" target="_blank" rel="noopener" class="external-pill-link-sm">Official NJ Property Tax Relief Portal (PAS-1) ↗</a>
         </div>
       </div>

       <!-- Card 3: Separate Clifton Tiered Sewer Utility & Discharge Credits -->
       <div class="calc-card" style="border-top: 4px solid #d97706;">
         <div class="card-title-row" style="margin-bottom: 10px;">
           <h3 style="font-size: 1.08rem; display: flex; align-items: center; gap: 8px;"><span>💧</span> Separate Municipal Cost: Tiered Sewer Utility</h3>
           <span class="badge-alert">Billed Separately</span>
         </div>
         <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px;">
           In addition to the 6.527% quarterly property tax bill, Clifton operates a <strong>Dedicated Municipal Sewer Utility (~$14.8M/yr)</strong> billed separately based on your household water usage:
         </p>
         <ul style="font-size: 0.84rem; color: var(--text-main); line-height: 1.55; padding-left: 18px; margin-bottom: 14px;">
           <li><strong>Consumption-Based Tiers:</strong> Calculated directly from metered water usage reported by the Passaic Valley Water Commission (PVWC) to fund Passaic Valley Sewerage Commission (PVSC) treatment charges.</li>
           <li><strong>Lawn & Pool Sewer Discharge Credits:</strong> Because outdoor irrigation and pool fills do not enter the sanitary sewer system, Clifton homeowners can file for a <strong>Sewer Discharge Credit</strong> with the Tax Collector to avoid overpaying.</li>
         </ul>
         <div style="display: flex; gap: 10px; flex-wrap: wrap;">
           <a href="https://www.cliftonnj.org/218/Tax-Collector" target="_blank" rel="noopener" class="external-pill-link-sm">Clifton Sewer Utility & Discharge Credit Info ↗</a>
         </div>
       </div>`;
}

// Populate Property Filters dynamically from loaded property records
function populatePropertyFilters(meta) {
  const neighSelect = document.getElementById('prop-neighborhood-filter');
  const zipSelect = document.getElementById('prop-zip-filter');
  if (!propertyAssessmentsData || !propertyAssessmentsData.properties) return;
  const props = propertyAssessmentsData.properties;

  if (neighSelect) {
    const neighCounts = {};
    props.forEach(p => {
      if (p.neighborhood) neighCounts[p.neighborhood] = (neighCounts[p.neighborhood] || 0) + 1;
    });
    const sortedNeighs = Object.keys(neighCounts).sort();
    let nHtml = `<option value="ALL">All Neighborhoods (${escapeHtml(meta.name)}-wide - ${props.length.toLocaleString()} Properties)</option>`;
    sortedNeighs.forEach(n => {
      nHtml += `<option value="${escapeHtml(n)}">${escapeHtml(n)} (${neighCounts[n]} homes)</option>`;
    });
    neighSelect.innerHTML = nHtml;
  }

  if (zipSelect) {
    const zipCounts = {};
    props.forEach(p => {
      if (p.zip) zipCounts[p.zip] = (zipCounts[p.zip] || 0) + 1;
    });
    const sortedZips = Object.keys(zipCounts).sort();
    let zHtml = `<option value="ALL">All ZIP Codes (${sortedZips.join(', ')})</option>`;
    sortedZips.forEach(z => {
      zHtml += `<option value="${escapeHtml(z)}">ZIP ${escapeHtml(z)} (${zipCounts[z]} homes)</option>`;
    });
    zipSelect.innerHTML = zHtml;
  }
}

// Dynamically update election page titles, badges, and copy for the active city
function updateElectionStaticCopy(cityId, meta) {
  if (!cliftonElectionData) return;
  const candidates = cliftonElectionData.councilCandidates || [];
  const boeList = cliftonElectionData.boeCandidates || (cliftonElectionData.boeElection?.candidates) || [];
  const councilCount = candidates.length;
  const boeCount = boeList.length;
  const incCount = candidates.filter(c => c.status && c.status.toLowerCase().includes('incumbent')).length;
  const chalCount = councilCount - incCount;
  const controvCount = candidates.filter(c => c.investigativeDossier && c.investigativeDossier.hasDocumentedControversies).length;
  const cleanCount = councilCount - controvCount;

  // Title & Section Intro
  document.title = `${meta.name} NJ Election 2026 Guide, Match Quiz & Candidates | Taxpayer Watchdog`;
  const badgeEl = document.querySelector('#tab-election .section-date-badge');
  if (badgeEl) badgeEl.textContent = `🗳️ Official ${meta.name} Voter Guide • Election Day: Nov 3, 2026`;
  const h2El = document.querySelector('#tab-election .section-intro h2');
  if (h2El) h2El.textContent = `2026 ${meta.name} Election Guide & Candidate Matchmaker`;
  const introP = document.querySelector('#tab-election .section-intro > p');
  if (introP) {
    introP.textContent = `Compare all ${councilCount} ${meta.name} candidates and ${boeCount} School Board candidates based on verified records, budgets, and tax policies.`;
  }
  const ctaSec = document.querySelector('.btn-election-cta-secondary');
  if (ctaSec) {
    ctaSec.textContent = `👥 Browse All ${councilCount} ${meta.name} Candidates`;
  }

  // Election Scope & Certification Notice
  const scopeNoticeEl = document.getElementById('election-scope-notice-text');
  if (scopeNoticeEl) {
    scopeNoticeEl.textContent = cliftonElectionData.electionNotice || 
      `Official candidate petitions and ballot drawings for local offices in ${meta.name} are certified by the ${meta.county} County Clerk following statutory filing deadlines. The rosters and profiles below reflect declared candidates, certified municipal baselines, and verified public financial disclosures.`;
  }

  // Hero Banner Cards
  const heroCards = document.querySelectorAll('.election-hero-strip .hero-strip-item');
  if (heroCards && heroCards.length >= 4) {
    const h1Title = heroCards[0].querySelector('h4');
    const h1P = heroCards[0].querySelector('p');
    if (h1Title) h1Title.textContent = `${meta.name} Local Representation`;
    if (h1P) h1P.textContent = `${councilCount} candidates running • ${escapeHtml(cliftonElectionData.councilStructure || 'Municipal leadership')}`;

    const h2Title = heroCards[1].querySelector('h4');
    const h2P = heroCards[1].querySelector('p');
    if (h2Title) h2Title.textContent = `${meta.schoolDistrictShort} (${boeCount} Running)`;
    if (h2P) h2P.textContent = `${boeCount} running • ${meta.schoolBudgetDisplay} budget (${meta.schoolsShare} of taxes).`;

    const h3Title = heroCards[2].querySelector('h4');
    const h3P = heroCards[2].querySelector('p');
    if (h3Title) h3Title.textContent = `Ethics & Benefit Standards`;
    if (h3P) h3P.textContent = escapeHtml(cliftonElectionData.unanimousHealthBenefitPledge || 'Adheres to state Chapter 78 & ethics disclosures.');

    const h4Title = heroCards[3].querySelector('h4');
    const h4P = heroCards[3].querySelector('p');
    if (h4Title) h4Title.textContent = `Polls Open 6 AM – 8 PM`;
    if (h4P) {
      const dropName = cliftonElectionData.votingResources?.mailInDropboxes?.[0]?.name || `${meta.name} Town Hall`;
      h4P.textContent = `Tue, Nov 3 • Early voting & 24/7 dropboxes at ${dropName}.`;
    }
  }

  // Quiz Intro
  const quizTitle = document.getElementById('matchmaker-title');
  if (quizTitle) quizTitle.textContent = `Take the 60-Second ${meta.name} Candidate Match Quiz`;
  const quizDesc = document.querySelector('.matchmaker-intro-text p');
  if (quizDesc) {
    quizDesc.innerHTML = `${escapeHtml(meta.name)} voters participate in the November 3, 2026 General Election. Answer these quick policy questions—based on candidate stances and public records—to discover which candidates match your priorities.`;
  }
  const quizStatusSub = document.querySelector('#matchmaker-results-box p');
  if (quizStatusSub) {
    quizStatusSub.textContent = `Candidates ranked by agreement with your answers for ${meta.name}.`;
  }

  // Candidate section heading & status toggle buttons
  const candHeading = document.querySelector('#election-candidates-heading .section-collapse-title');
  if (candHeading) {
    candHeading.textContent = `👥 Meet the ${councilCount} ${meta.name} Candidates`;
  }
  const candPill = document.querySelector('#election-candidates-heading .pill-tag');
  if (candPill) candPill.textContent = `${councilCount} Candidates`;

  const btnAll = document.querySelector('.btn-group-toggle button[data-status="all"]');
  if (btnAll) btnAll.textContent = `All (${councilCount})`;
  const btnInc = document.querySelector('.btn-group-toggle button[data-status="incumbent"]');
  if (btnInc) btnInc.textContent = `Incumbents (${incCount})`;
  const btnChal = document.querySelector('.btn-group-toggle button[data-status="challenger"]');
  if (btnChal) btnChal.textContent = `Challengers (${chalCount})`;
  const btnControv = document.querySelector('.btn-group-toggle button[data-status="controversy"]');
  if (btnControv) btnControv.textContent = `⚠️ Under Scrutiny (${controvCount})`;
  const btnClean = document.querySelector('.btn-group-toggle button[data-status="clean"]');
  if (btnClean) btnClean.textContent = `✓ Verified Clean (${cleanCount})`;

  const resCountEl = document.getElementById('election-results-count');
  if (resCountEl) resCountEl.textContent = `Showing all ${councilCount} of ${councilCount} ${meta.name} Candidates`;

  // Ballot Architecture description
  const ballotDesc = document.querySelector('#election-ballot-overview .section-subtitle-desc');
  if (ballotDesc) {
    ballotDesc.textContent = `See exactly who and what you are voting for in ${meta.name} on November 3, 2026, including how each office impacts your local property taxes:`;
  }

  // Ethics spotlight description
  const ethDesc = document.querySelector('#election-controversies-heading .section-subtitle-desc');
  if (ethDesc) {
    ethDesc.textContent = `Nonpartisan public records check of outside commercial businesses, state financial disclosure filings (FDS), court records, municipal censures, and ethics inquiries for all ${meta.name} candidates.`;
  }

  // Side-by-Side matrix description
  const matrixDesc = document.querySelector('#election-matrix-heading .section-subtitle-desc');
  if (matrixDesc) {
    matrixDesc.textContent = `Compare all ${councilCount} ${meta.name} candidates side-by-side on key issues: Property Taxes, Infrastructure, Zoning, and School Support.`;
  }
  const matrixPill = document.querySelector('#election-matrix-heading .pill-tag');
  if (matrixPill) matrixPill.textContent = `Compare All ${councilCount} Candidates`;

  // School Board section
  const boeHeading = document.querySelector('#election-boe-heading .section-collapse-title');
  if (boeHeading) {
    boeHeading.textContent = `🏫 ${meta.schoolDistrictShort} Candidates: ${boeCount} Running`;
  }
  const boePill = document.querySelector('#election-boe-heading .pill-tag');
  if (boePill) boePill.textContent = `${boeCount} Candidates • ${meta.schoolBudgetDisplay} Budget`;
  const boeDesc = document.querySelector('#election-boe-heading .section-subtitle-desc');
  if (boeDesc) {
    boeDesc.innerHTML = `School Board Trustees oversee <strong>${escapeHtml(meta.schoolDistrictName)}</strong> (${escapeHtml(meta.schoolBudgetDisplay)} budget), student academic performance, and roughly ${escapeHtml(meta.schoolsShare)} of your property tax bill. Per certified county clerk filings, <strong>${boeCount} candidates</strong> are running for trustee seats:`;
  }

  // State & County section
  const njHeading = document.querySelector('#election-nj-candidates-heading .section-collapse-title');
  if (njHeading) {
    njHeading.textContent = `🇺🇸 State, Congressional & ${meta.countyShort} Races`;
  }
  const njPill = document.querySelector('#election-nj-candidates-heading .pill-tag');
  if (njPill) {
    njPill.textContent = `U.S. Senate, ${cliftonElectionData.njCandidates?.usHouse?.badge || 'Congress'} & ${meta.countyShort}`;
  }
  const njDesc = document.querySelector('#election-nj-candidates-heading .section-subtitle-desc');
  if (njDesc) {
    njDesc.textContent = `In addition to local races, ${meta.name} voters elect representation for United States Senate, U.S. House of Representatives (${cliftonElectionData.njCandidates?.usHouse?.badge || 'Congress'}), and ${meta.countyShort} Board of County Commissioners.`;
  }

  // Official Sources List
  const sourcesContainer = document.querySelector('#election-sources-heading .source-links-list');
  if (sourcesContainer) {
    const vr = cliftonElectionData.votingResources || {};
    const clerk = vr.municipalClerk || {};
    const countyElec = vr.passaicCountyElections || {};
    sourcesContainer.innerHTML = `
      <li>
        <a href="${escapeHtml(countyElec.website || 'https://voter.svrs.nj.gov/registration-check')}" target="_blank" rel="noopener">${escapeHtml(meta.countyShort)} Clerk: Official 2026 ${escapeHtml(meta.name)} General Election Sample Ballots & Filings ↗</a>
        <span class="source-doc-desc">Official sample ballot showing exact voting machine columns and candidate rows for ${escapeHtml(meta.name)} voters on November 3, 2026.</span>
      </li>
      <li>
        <a href="https://voter.svrs.nj.gov/registration-check" target="_blank" rel="noopener">NJ Division of Elections: Voter Registration Status & Polling Place Locator ↗</a>
        <span class="source-doc-desc">Verify your active voter registration status and find your assigned ${escapeHtml(meta.name)} polling district.</span>
      </li>
      <li>
        <a href="mailto:${escapeHtml(clerk.email || '')}" target="_blank" rel="noopener">${escapeHtml(meta.fullName)} Municipal Clerk (${escapeHtml(clerk.name || 'Clerk')}): Election Inquiries & Notices ↗</a>
        <span class="source-doc-desc">Office: ${escapeHtml(clerk.office || '')} • Phone: ${escapeHtml(clerk.phone || '')} • Email: ${escapeHtml(clerk.email || '')}</span>
      </li>
      <li>
        <a href="https://www.state.nj.us/treasury/taxation/" target="_blank" rel="noopener">State of New Jersey Division of Taxation & Local Government Services ↗</a>
        <span class="source-doc-desc">Certified MOD-IV property tax data, equalized valuations, and certified ${escapeHtml(meta.countyShort)} tax rates.</span>
      </li>
    `;
  }

  // Footer
  const footerBrandTitle = document.querySelector('.app-footer .footer-brand h4');
  if (footerBrandTitle) footerBrandTitle.textContent = `MyTownLens — ${meta.name} Taxpayer Watchdog Project`;
  const footerBrandDesc = document.querySelector('.app-footer .footer-brand p');
  if (footerBrandDesc) {
    footerBrandDesc.textContent = `Independent civic transparency, property assessment, and public records analysis for ${meta.name}, New Jersey residents.`;
  }
  const footerSources = document.querySelector('.app-footer .footer-sources');
  if (footerSources) {
    footerSources.textContent = `All figures, tax rates, salaries, and assessments verified against certified records from: ${meta.county} Board of Taxation, ${meta.fullName} Assessor & Collector, NJ Division of Taxation (MOD-IV), NJ State Comptroller (OSC), and ${meta.schoolDistrictShort} User-Friendly Budgets.`;
  }
}

// Dynamically update all static copy, headers, dropdowns, presets, and links for the active city
function applyCityStaticCopy(cityId) {
  const meta = CITY_REGISTRY[cityId] || CITY_REGISTRY.clifton;

  // 1. Document Title & App Header
  const pageSuffix = document.body.getAttribute('data-page-title');
  if (pageSuffix) {
    document.title = `${meta.name} NJ ${pageSuffix} | Taxpayer Watchdog`;
  } else {
    document.title = meta.pageTitle;
  }

  const setElText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };
  const setElHtml = (sel, html) => {
    const el = document.querySelector(sel);
    if (el) el.innerHTML = html;
  };

  setElText('header-badge-icon', meta.icon);
  setElText('header-badge-text', meta.badgeText);
  setElText('header-main-title', meta.title);
  setElText('header-main-subtitle', meta.subtitle);

  setElText('hdr-stat1-label', 'Certified Tax Rate (2026) ↗');
  setElText('hdr-stat1-num', meta.certifiedTaxRate);
  setElText('hdr-stat1-sub', 'Avg Bill: ' + meta.avgTaxBill);

  setElText('hdr-stat2-label', meta.schoolDistrictName + ' ↗');
  setElText('hdr-stat2-num', meta.schoolsShare);
  setElText('hdr-stat2-sub', 'Explore ' + meta.schoolBudgetDisplay + ' budget');

  setElText('hdr-stat3-label', 'Sampled Assessments ↗');
  setElText('hdr-stat3-num', '1,850 Homes');
  setElText('hdr-stat3-sub', 'Avg Assessed: ' + meta.avgAssessed);

  // 2. Sticky Nav Brand & Dropdown Subtitles
  setElText('nav-brand-icon', meta.icon);
  setElText('nav-brand-title', meta.name + ' Watchdog');
  setElText('nav-brand-subtitle', meta.auditBadge);
  setElText('nav-city-name-text', meta.icon + ' ' + meta.name + ', ' + (meta.state || 'NJ'));

  const electionTabBtn = document.getElementById('nav-btn-election');
  if (electionTabBtn) {
    const candidateCount = cliftonElectionData ? (cliftonElectionData.councilCandidates?.length || cliftonElectionData.totalCouncilCandidates || 0) : '';
    const candBadge = candidateCount ? `${candidateCount} Candidates` : 'Guide';
    electionTabBtn.innerHTML = `
      <span class="tab-icon">🗳️</span>
      <span class="tab-title">${meta.name} Election 2026</span>
      <span class="badge-tag" style="background: #2563eb; color: #fff; margin-left: 4px; padding: 1px 7px; font-size: 0.72rem; border-radius: 999px;">${candBadge}</span>
    `;
  }

  setElHtml('.dropdown-item[data-tab="tab-budgets"] .d-item-text small',
    `${meta.schoolDistrictShort} (${meta.schoolBudgetDisplay}) & Muni (${meta.muniBudgetDisplay}) budgets`);
  setElHtml('.dropdown-item[data-tab="tab-benefits"] .d-item-text small',
    `SHBP/SEHBP plans, pensions & ${meta.benefitsSpendDisplay} costs`);
  setElHtml('.dropdown-item[data-tab="tab-demographics"] .d-item-text small',
    `${meta.zipCodesDisplay} disparities`);
  setElHtml('.dropdown-item[data-tab="tab-surrounding"] .d-item-text small',
    `Compare surrounding towns (${meta.county})`);
  setElHtml('.dropdown-item[data-tab="tab-controversies"] .d-item-text small',
    meta.controversyHighlight);

  // 3. Top Status Bar
  setElHtml('.top-status-bar .status-text',
    `<strong>Live Citizen Watchdog:</strong> Certified 2026 Tax Rates • ${meta.county} Board of Taxation & Official Audits`);
  setElHtml('.top-status-bar .status-quick-links',
    `<span class="status-item">Total Rate: <strong>${meta.certifiedTaxRate}</strong></span>
     <span class="status-sep">•</span>
     <span class="status-item">Schools Share: <strong>${meta.schoolsShare}</strong></span>
     <span class="status-sep">•</span>
     <span class="status-item">Muni Share: <strong>${meta.muniShare}</strong></span>
     <span class="status-sep">•</span>
     <span class="status-item">County Share: <strong>${meta.countyShare}</strong></span>
     <span class="status-sep">•</span>
     <span class="status-item">Auto-Refresh: <strong style="color: #15803d;">Active (Weekly Cron)</strong></span>`);

  // 4. Tab 1: Calculator
  setElHtml('#tab-calculator .section-intro',
    `<div class="section-badge-bar">
       <span class="section-date-badge">Certified: Tax Year 2026 • ${meta.county} Board of Taxation (District ${meta.districtCode})</span>
     </div>
     <h2>Your ${meta.fullName} Property Tax Breakdown</h2>
     <p>In ${meta.name}, the 2026 certified composite tax rate is <strong>$${meta.rateNum.toFixed(3)} per $100 of assessed property value</strong>. Enter your home's assessed value or drag the slider below to see where every dollar of your property tax goes.</p>`);

  setElHtml('#tab-calculator .input-card .tooltip-badge', 'Avg: ' + meta.avgAssessed);
  setElHtml('#tab-calculator .calc-hint',
    `Look on your ${meta.name} Tax Bill or Assessment Postcard (or drag the slider below):`);

  const calcInput = document.getElementById('calc-assessment-input');
  const calcSlider = document.getElementById('calc-assessment-slider');
  if (calcInput && calcSlider) {
    calcSlider.min = meta.sliderMin.toString();
    calcSlider.max = meta.sliderMax.toString();
    calcInput.value = meta.sliderDefault.toString();
    calcSlider.value = meta.sliderDefault.toString();
  }

  setElHtml('#tab-calculator .slider-labels', meta.sliderLabelsHtml);
  setElHtml('#tab-calculator .quick-presets', meta.quickPresetsHtml);

  setElHtml('#tab-calculator .info-alert .alert-text',
    `<strong>Assessment vs. Market Value:</strong> In ${meta.name}, homes are assessed at an Equalization Ratio of <strong>${meta.equalizationRatio.toFixed(1)}%</strong> of true market value. A home selling on the market for $${(meta.typicalMarket/1000).toFixed(0)}k typically has an assessed tax value of ~$${(meta.sliderDefault/1000).toFixed(0)}k.
     <div style="margin-top: 8px; display: flex; flex-direction: column; gap: 6px;">
       <button class="btn-jump-action" data-jump-tab="tab-properties">
         <span>🏡</span> Who Pays More? Explore 1,850 ${meta.name} Homes & Assessments ➔
       </button>
       <button class="btn-jump-action secondary" data-jump-tab="tab-fair-tax">
         <span>⚖️</span> What If Taxes Were Fair? Test Scenarios in What-If Simulator ➔
       </button>
     </div>`);

  setElHtml('#tab-calculator .legend-row',
    `<span class="legend-item"><span class="dot school-dot"></span> ${meta.schoolDistrictShort} (${meta.schoolsShare})</span>
     <span class="legend-item"><span class="dot city-dot"></span> Municipal Services (${meta.muniShare})</span>
     <span class="legend-item"><span class="dot county-dot"></span> ${meta.countyShort} (${meta.countyShare})</span>`);

  setElHtml('#tab-calculator .taxpayer-critical-intel-grid', getCriticalIntelGrid(cityId, meta));

  // 5. Tab 2: Budgets Overview Cards
  setElHtml('#tab-budgets .section-intro',
    `<div class="section-badge-bar">
       <span class="section-date-badge">Current Fiscal Cycles: FY 2025-2026 / CY 2026 Adopted Budgets</span>
     </div>
     <h2>${meta.name} Public Spending: The Two Mega-Budgets</h2>
     <p>${meta.name} taxpayers fund two primary local government entities: <strong>${meta.schoolDistrictName} (${meta.schoolBudgetDisplay})</strong> and <strong>${meta.fullName} (${meta.muniBudgetDisplay})</strong>, alongside ${meta.countyShort} taxes.</p>`);

  const boeOverviewCard = document.querySelector('#tab-budgets .budget-overview-card.school-theme');
  if (boeOverviewCard) {
    const hdr = boeOverviewCard.querySelector('.card-header');
    const met = boeOverviewCard.querySelector('.budget-metrics');
    if (hdr) {
      hdr.innerHTML = `
        <div class="badge school-badge">${meta.schoolsShare} OF YOUR TAXES</div>
        <h3>${meta.schoolDistrictName}</h3>
        <div class="big-amount">${meta.schoolBudgetDisplay} <span class="per-year">/ year</span></div>
        <p class="overview-desc">Educates students across public school campuses with dedicated teachers, aides, and administration.</p>
      `;
    }
    if (met) {
      const perPupil = boeBudgetData?.overview?.perPupilSpending || '$22,500';
      const taxLevy = boeBudgetData?.overview?.localTaxLevy || meta.schoolBudgetDisplay;
      const stateAid = boeBudgetData?.overview?.stateAid || 'State Aid';
      met.innerHTML = `
        <div class="b-metric"><span class="label">Per Pupil Spending</span><span class="val">${perPupil}</span></div>
        <div class="b-metric"><span class="label">Local Property Tax Levy</span><span class="val">${taxLevy}</span></div>
        <div class="b-metric"><span class="label">State Education Aid</span><span class="val">${stateAid}</span></div>
      `;
    }
  }

  const cityOverviewCard = document.querySelector('#tab-budgets .budget-overview-card.city-theme');
  if (cityOverviewCard) {
    const hdr = cityOverviewCard.querySelector('.card-header');
    const met = cityOverviewCard.querySelector('.budget-metrics');
    if (hdr) {
      hdr.innerHTML = `
        <div class="badge city-badge">${meta.muniShare} OF YOUR TAXES</div>
        <h3>${meta.fullName}</h3>
        <div class="big-amount">${meta.muniBudgetDisplay} <span class="per-year">/ year</span></div>
        <p class="overview-desc">Funds Police, Emergency Services, Public Works (DPW), Infrastructure, and Municipal Services.</p>
      `;
    }
    if (met) {
      const workforce = cityBudgetData?.overview?.fullTimeEmployees || 'Full-Time Staff';
      const muniLevy = cityBudgetData?.overview?.localTaxLevy || meta.muniBudgetDisplay;
      const pubSafety = cityBudgetData?.overview?.publicSafetyShare || 'Public Safety Services';
      met.innerHTML = `
        <div class="b-metric"><span class="label">Workforce</span><span class="val">${workforce}</span></div>
        <div class="b-metric"><span class="label">Local Municipal Levy</span><span class="val">${muniLevy}</span></div>
        <div class="b-metric"><span class="label">Public Safety & DPW</span><span class="val">${pubSafety}</span></div>
      `;
    }
  }

  // 6. Tab 3: Demographics & Schools
  setElHtml('#tab-demographics .section-intro',
    `<div class="section-badge-bar">
       <span class="section-date-badge">Data: U.S. Census Bureau ACS 5-Year Estimates & ${meta.county} 2026 Certified Rolls</span>
     </div>
     <h2>${meta.name} Demographics, Neighborhoods & Tax Disparities</h2>
     <p>Merging census population records with certified property assessments reveals how tax burdens, income levels, and school utilization vary across ${meta.name}'s postal zones (${meta.zipCodesDisplay}) and residential neighborhoods.</p>`);

  setElHtml('#tab-demographics .zip-comparison-section .section-subtitle-row h3',
    `The ${meta.name} ZIP Code Divide: ${meta.zipCodesDisplay}`);
  setElHtml('#tab-demographics .zip-comparison-section .section-subtitle-desc',
    `${meta.fullName} residential postal zones show distinct home values, income levels, and tax effort across the municipality.`);

  setElHtml('#tab-demographics .neighborhoods-section .section-subtitle-row h3',
    `${meta.name} Neighborhood Explorer`);
  setElHtml('#tab-demographics .neighborhoods-section .section-subtitle-desc',
    `Explore how property values, assessments, and effective tax rates shift across ${meta.name} neighborhoods:`);

  setElHtml('#tab-demographics .family-schools-section .section-subtitle-row h3',
    `Where Do ${meta.name} Schools Get Their Students? Family & Child Demographics`);
  setElHtml('#tab-demographics .family-schools-section .section-subtitle-desc',
    `Examining households with children under 18 reveals which neighborhoods supply students to ${meta.schoolDistrictName}, and contrasts school utilization against local property tax contributions.`);

  setElHtml('#tab-demographics .family-tax-comparison-card .formula-badge',
    `${meta.schoolDistrictShort} ${meta.schoolBudgetDisplay} Budget Spatial Distribution`);

  setElHtml('#tab-demographics .schools-feeder-header > div:first-child',
    `<h4>🏫 ${meta.schoolDistrictName} Feeder Network</h4>
     <p>Explore public schools, student enrollments, and neighborhood feeder patterns across ${meta.name}.</p>`);

  const schoolList = demographicsData?.familyChildDemographics?.schools || [];
  const elemCount = schoolList.filter(s => /elem/i.test(s.type || s.name)).length || (schoolList.length > 2 ? schoolList.length - 2 : 1);
  const midCount = schoolList.filter(s => /mid/i.test(s.type || s.name)).length || 1;
  const highCount = schoolList.filter(s => /high/i.test(s.type || s.name)).length || 1;
  const totalSchools = schoolList.length || (elemCount + midCount + highCount);

  setElHtml('#school-type-filters',
    `<button class="filter-btn active" data-school-filter="all">All Schools (${totalSchools})</button>
     <button class="filter-btn" data-school-filter="Elementary">Elementary (${elemCount})</button>
     <button class="filter-btn" data-school-filter="Middle School">Middle Schools (${midCount})</button>
     <button class="filter-btn" data-school-filter="High School">High Schools (${highCount})</button>`);

  // 7. Tab 4: Property Assessments & Filters
  setElHtml('#tab-properties .section-intro',
    `<div class="section-badge-bar">
       <span class="section-date-badge">Certified Roll: Tax Year 2026 • ${meta.county} Board of Taxation (District ${meta.districtCode}) & Local Assessor</span>
     </div>
     <h2>Who Is Paying More Taxes? ${meta.name} Property Values & Assessments</h2>
     <p>In ${meta.name}, property taxes are calculated on your <strong>Assessed Value</strong> using the certified tax rate: <code>(Assessment ÷ 100) × ${meta.rateNum.toFixed(3)}%</code>. Explore 1,850 sampled residential assessment rolls across ${meta.name} neighborhoods, compare bedrooms, bathrooms, square footage, and see who shoulders the highest tax bills.</p>`);

  const propRibbonBoxes = document.querySelectorAll('#prop-metrics-ribbon .prop-metric-box');
  if (propRibbonBoxes.length >= 4) {
    propRibbonBoxes[0].querySelector('.p-met-sub').textContent = `${meta.name} custom residential estate`;
    propRibbonBoxes[1].querySelector('.p-met-label').textContent = `${meta.name} Sample Avg Tax`;
    propRibbonBoxes[1].querySelector('.p-met-sub').textContent = `Assessed @ ${meta.avgAssessed}`;
    propRibbonBoxes[2].querySelector('.p-met-sub').textContent = `${meta.name} starter home & condo`;
    propRibbonBoxes[3].querySelector('.p-met-label').textContent = `${meta.name} Equalization Ratio`;
    propRibbonBoxes[3].querySelector('.p-met-val').textContent = `${meta.equalizationRatio.toFixed(1)}%`;
    propRibbonBoxes[3].querySelector('.p-met-sub').textContent = `Market Value ≈ ${(100 / meta.equalizationRatio).toFixed(1)}× Assessed Value`;
  }

  const propSearchInput = document.getElementById('prop-search-input');
  if (propSearchInput) {
    propSearchInput.placeholder = `Search by street, neighborhood, or ZIP in ${meta.name}...`;
  }

  // Populate neighborhood and zip filter dropdowns from actual property assessment data
  populatePropertyFilters(meta);

  setElHtml('#properties-table thead tr',
    `<th>Address / Area</th><th>ZIP</th><th>Property Type</th><th>Beds</th><th>Baths</th><th>Sq Ft</th><th>Year</th><th>Assessed Value</th><th>Est. Market Value</th><th>Annual Tax (${meta.certifiedTaxRate})</th><th>School Share (${meta.schoolsShare})</th><th>Tax Tier</th><th>Action</th>`);

  setElHtml('#tab-properties .assessment-explainer-card .explainer-content',
    `<h4>Why is your assessed value different from what your house sells for in ${meta.name}?</h4>
     <p>Like many New Jersey municipalities, ${meta.fullName} operates on a certified <strong>Equalization Ratio of ${meta.equalizationRatio.toFixed(1)}%</strong> (established by the ${meta.county} Board of Taxation). A home with a true market value of <strong>$${(meta.typicalMarket).toLocaleString()}</strong> is typically assessed on municipal books at approximately <strong>$${(meta.sliderDefault).toLocaleString()}</strong>.</p>
     <p class="explainer-detail">When multiplied by the composite tax rate (<strong>${meta.certifiedTaxRate}</strong>): <code>$${(meta.sliderDefault).toLocaleString()} × ${meta.rateNum.toFixed(3)}% = ${meta.avgTaxBill}</code>, which equals an effective market tax rate of approximately <strong>${((meta.rateNum * (meta.equalizationRatio / 100))).toFixed(3)}% of true market value</strong>.</p>`);

  // 8. Tab 5: Surrounding Towns
  setElHtml('#tab-surrounding .section-intro',
    `<div class="section-badge-bar">
       <span class="section-date-badge">Certified Comparative 2026 Tax Rates • ${meta.county} Board of Taxation</span>
     </div>
     <h2>How Does ${meta.name} Compare to Surrounding Towns?</h2>
     <p>Compare ${meta.name}'s certified tax rate, assessment equalization ratios, true effective tax rates, median tax bills, and school budget splits against neighboring municipalities across ${meta.county} and North Jersey.</p>`);

  setElHtml('#tab-surrounding .comparative-insight-banner p',
    `<strong>Equalization & Tax Effort Across ${meta.county}:</strong> In ${meta.name}, the statutory rate of <strong>${meta.certifiedTaxRate}</strong> reflects an equalization ratio of <strong>${meta.equalizationRatio.toFixed(1)}%</strong>. True comparative tax effort is best understood through the <em>Effective Tax Rate</em>, which compares total taxes against 100% fair market value across regional peer municipalities.`);

  // 9. Tab 6: Benefits & Healthcare
  setElHtml('#tab-benefits .section-intro',
    `<div class="section-badge-bar">
       <span class="section-date-badge">Source: State Health Benefits Program (SHBP / SEHBP) & Official Budgets</span>
     </div>
     <h2>Healthcare, Pensions & Employee Benefits: Where Public Funds Go</h2>
     <p>Between ${meta.fullName} and ${meta.schoolDistrictName}, approximately <strong>${meta.benefitsSpendDisplay} per year</strong> is allocated to public employee medical insurance, prescription coverage, pensions, and contractual employee benefits.</p>`);

  setElHtml('#tab-benefits .benefits-summary-banner',
    `<div class="b-stat">
       <span class="stat-title">Combined Benefits Spending</span>
       <span class="stat-num">${meta.benefitsSpendDisplay} / year</span>
       <span class="stat-detail">Combined ${meta.schoolDistrictShort} & municipal budgets</span>
     </div>
     <div class="b-stat">
       <span class="stat-title">Average Family Health Premium</span>
       <span class="stat-num">~$32,000 - $42,000</span>
       <span class="stat-detail">Annual cost per enrolled employee family</span>
     </div>
     <div class="b-stat">
       <span class="stat-title">Taxpayer Premium Share</span>
       <span class="stat-num">70% to 90%</span>
       <span class="stat-detail">Taxpayers cover the vast majority of premiums</span>
     </div>`);

  // 10. Tab 7: Controversies & Tab 8: Staff Directory
  setElHtml('#tab-controversies .section-intro',
    `<div class="section-badge-bar">
       <span class="section-date-badge alert-badge">Active Inquiries, Audits & Fiscal Records</span>
     </div>
     <h2>${meta.name} Watchdog Alerts: Audits, PILOTs & Fiscal Controversies</h2>
     <p>A transparent breakdown of public audits, state disclosure filings, tax abatement impacts, and municipal oversight records across ${meta.name}.</p>`);

  setElHtml('#tab-staff .section-intro',
    `<div class="section-badge-bar">
       <span class="section-date-badge">Current Contracts: FY 2025-2026 Salary Guides & Public Filings</span>
     </div>
     <h2>Who Works at ${meta.name}: Municipal Hall & ${meta.schoolDistrictShort}</h2>
     <p>Public employee compensation is funded by taxpayer dollars and is open public record under NJ law. Search municipal administration, police, and school leadership records.</p>`);

  const staffSearchEl = document.getElementById('staff-search-input');
  if (staffSearchEl) {
    staffSearchEl.placeholder = `Search ${meta.name} staff by name, title, department...`;
  }

  const staffCountSchool = staffData ? staffData.filter(s => /school|board of education|boe|pthsd|msd/i.test(s.entity || '')).length : 0;
  const staffCountMuni = staffData ? staffData.filter(s => !/school|board of education|boe|pthsd|msd/i.test(s.entity || '')).length : 0;
  setElHtml('#tab-staff .filter-buttons',
    `<button class="filter-btn active" data-filter="all">All Positions (${(staffData ? staffData.length : 0)})</button>
     <button class="filter-btn" data-filter="school">${meta.schoolDistrictShort} (${staffCountSchool})</button>
     <button class="filter-btn" data-filter="city">${meta.name} Municipal (${staffCountMuni})</button>`);
  setupStaffFilters();

  // Tab 9: Ethics & Outside Businesses
  setElHtml('#tab-ethics .section-intro',
    `<div class="section-badge-bar">
       <span class="section-date-badge">Filing Basis: N.J.S.A. 40A:9-22.1 (LGO) & N.J.S.A. 18A:12-21 (SEC)</span>
     </div>
     <h2>${meta.name} Outside Businesses, Real Estate & Financial Disclosures</h2>
     <p>Under the <strong>New Jersey Local Government Ethics Law (N.J.S.A. 40A:9-22.1)</strong> and the <strong>School Ethics Act (N.J.S.A. 18A:12-21)</strong>, elected officials and key administrators in ${meta.name} must file annual Financial Disclosure Statements (FDS) disclosing outside businesses, secondary earned income, and real estate properties held in New Jersey.</p>`);

  const ethicsCountSchool = ethicsData ? ethicsData.filter(e => /school|board of education|boe|pthsd|msd|superintendent|principal/i.test(e.publicTitle || e.mandatoryFiling || '')).length : 0;
  const ethicsCountMuni = ethicsData ? ethicsData.filter(e => !/school|board of education|boe|pthsd|msd|superintendent|principal/i.test(e.publicTitle || e.mandatoryFiling || '')).length : 0;
  setElHtml('#tab-ethics .ethics-filter-buttons',
    `<button class="filter-btn active" data-ethics-filter="all">All Disclosures (${(ethicsData ? ethicsData.length : 0)})</button>
     <button class="filter-btn" data-ethics-filter="city">${meta.name} Municipal (${ethicsCountMuni})</button>
     <button class="filter-btn" data-ethics-filter="school">${meta.schoolDistrictShort} (${ethicsCountSchool})</button>`);
  setupEthicsFilters();

  // 11. Tab 9: Ethics & Tab 10: Vendors
  setElHtml('#tab-vendors .section-intro',
    `<div class="section-badge-bar">
       <span class="section-date-badge">Warrant Lists & Claims: FY 2025-2026 Check Registers</span>
     </div>
     <h2>Where Does Contract Money Go? Top ${meta.name} Vendors & Bill Lists</h2>
     <p>Every month, the ${meta.fullName} governing body and ${meta.schoolDistrictShort} vote on "Bill Lists" approving vendor payments for services, legal counsel, construction, health benefits, and utilities.</p>`);

  // 12. Tab 11: Joined Intelligence
  setElHtml('#tab-intelligence .section-intro',
    `<div class="section-badge-bar">
       <span class="section-date-badge">Cross-Dataset Intelligence Engine • Certified 2026 ${meta.county} Data</span>
     </div>
     <h2>Joined Intelligence & Cross-Dataset Analytics: ${meta.name}</h2>
     <p>Connecting ${meta.name} property assessments, municipal and school operating budgets, public employee earnings, and student demographics into actionable investigations.</p>`);

  setElHtml('#intel-report-receipt .intel-panel-header > div:first-child',
    `<h3>1. The ${meta.name} Tax 'Grocery Store' Itemized Receipt</h3>
     <p>Every dollar of your property tax bill is legally earmarked. Enter your home's assessed value (or select a quick preset) to generate an itemized register tape breaking down your exact annual, monthly, and daily costs across municipal, school, and ${meta.countyShort} services.</p>`);

  setElHtml('#intel-report-receipt .receipt-quick-presets', meta.quickPresetsHtml);

  const receiptAssessedInput = document.getElementById('receipt-assessed-input');
  if (receiptAssessedInput) {
    receiptAssessedInput.value = meta.sliderDefault.toString();
  }
  setElHtml('#intel-report-receipt .form-group-receipt .help-text',
    `Based on 2026 certified composite tax rate: <strong>${meta.certifiedTaxRate}</strong> ($${meta.rateNum.toFixed(3)} per $100 assessed value).`);

  setElHtml('#printable-receipt .receipt-city-logo', meta.icon);
  setElHtml('#printable-receipt .receipt-title', `${meta.fullName.toUpperCase()} & ${meta.schoolDistrictShort.toUpperCase()}`);
  setElHtml('#printable-receipt .receipt-cert-line', `CERTIFIED TAX YEAR 2026 • ${meta.county.toUpperCase()}`);
  setElHtml('#printable-receipt .receipt-barcode-number', `TAX-WATCHDOG-2026-${meta.name.toUpperCase()}-NJ`);

  setElHtml('#intel-report-homes .intel-panel-header',
    `<div>
       <h3>2. Homes-to-Fund Salary & Compensation Index</h3>
       <p>Every dollar paid to a municipal employee or school administrator comes directly from property tax checks. This index calculates how many average ${meta.name} homeowners' annual tax payments are required to fund each position.</p>
     </div>
     <div class="homes-calc-badge">
       <span>Benchmark: Average ${meta.name} Home (${meta.avgAssessed} Assessed Value)</span>
       <div class="benchmark-tags">
         <span class="tag-muni">Muni Share: ${meta.muniShare}</span>
         <span class="tag-school">School Share: ${meta.schoolsShare}</span>
       </div>
     </div>`);

  setElHtml('#homes-entity-filters',
    `<button class="filter-pill-btn active" data-entity="all">All Personnel</button>
     <button class="filter-pill-btn" data-entity="MUNI">${meta.name} Municipal Only</button>
     <button class="filter-pill-btn" data-entity="BOE">${meta.schoolDistrictShort} Only</button>`);

  setElHtml('#intel-report-balance .intel-panel-header > div:first-child',
    `<h3>3. Neighborhood Fiscal Balance Sheet</h3>
     <p>By joining residential tax collections with district student enrollment across neighborhoods, we calculate which areas generate educational tax contributions versus service utilization across ${meta.name}.</p>`);

  // 13. Tab 12: Commercial & PILOT Shift
  setElHtml('#tab-commercial-pilot .section-intro',
    `<div class="section-badge-bar">
       <span class="section-date-badge">Certified Ratables & PILOT Analysis • ${meta.county} Tax Board</span>
     </div>
     <h2>Commercial Ratables, PILOT Abatements & The Tax Shift in ${meta.name}</h2>
     <p>Why have residential property taxes grown across New Jersey? Over recent decades, commercial tax appeals, office vacancies, and long-term PILOT abatements have shifted tax burdens onto single-family homeowners while allocating $0 of statutory PILOT fees to public schools.</p>`);

  // 14. Tab 13: What-If Fair Tax Engine
  setElHtml('#tab-fair-tax .section-intro',
    `<div class="section-badge-bar">
       <span class="section-date-badge">Certified Reform Simulator • 2026 Fiscal Base • NJ Title 54 & Title 40A</span>
     </div>
     <h2>What-If? ${meta.name} Fair Tax Simulator & Equalization Engine</h2>
     <p>Explore data-driven scenarios to distribute ${meta.name}'s tax burden fairly across commercial corridors, mixed-use developments, and residential neighborhoods—protecting homeowner equity while fully funding public schools.</p>`);

  const wifMarket = document.getElementById('wif-market-val');
  const wifAssessed = document.getElementById('wif-assessed-val');
  const wifIncome = document.getElementById('wif-income');
  const wifZip = document.getElementById('wif-zip');

  if (wifMarket) wifMarket.value = meta.typicalMarket.toString();
  if (wifAssessed) wifAssessed.value = meta.sliderDefault.toString();
  if (wifIncome) wifIncome.value = demographicsData?.cityOverview?.medianHouseholdIncome ? demographicsData.cityOverview.medianHouseholdIncome.toString() : '110000';
  if (wifZip && propertyAssessmentsData?.properties) {
    const zips = [...new Set(propertyAssessmentsData.properties.map(p => p.zip).filter(Boolean))].sort();
    if (zips.length) {
      wifZip.innerHTML = zips.map((z, idx) => `<option value="${z}" ${idx === 0 ? 'selected' : ''}>${z} (${meta.name})</option>`).join('');
    }
  }

  setElHtml('.balance-scale-widget .bsw-title',
    `⚖️ ${meta.name} Tax Burden Balance Scale`);

  setElText('res-fiscal-note',
    `This reform model ensures that ${meta.name}'s municipal and school budgets remain 100% funded with zero layoffs or service cuts by redirecting lost commercial and developer revenues back into the public ledger.`);

  // 15. Page Footer
  setElHtml('.app-footer .footer-brand',
    `<h4>MyTownLens — ${meta.name} Taxpayer Watchdog Project</h4>
     <p>Independent civic transparency, property assessment, and public records analysis for ${meta.name}, New Jersey residents.</p>`);
  setElHtml('.app-footer .footer-sources',
    `All figures, tax rates, salaries, and assessments verified against certified records from: ${meta.county} Board of Taxation, ${meta.fullName} Assessor & Collector, NJ Division of Taxation (MOD-IV), NJ State Comptroller (OSC), and ${meta.schoolDistrictShort} User-Friendly Budgets.`);
}

// Global Cross-Section Navigation & Tab Switcher
function switchTab(targetId, options = {}) {
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  const targetPane = document.getElementById(targetId);

  // If tab pane is on another hub page, seamlessly navigate there
  if (!targetPane && TAB_PAGE_MAP[targetId]) {
    const targetUrl = TAB_PAGE_MAP[targetId];
    const targetFile = targetUrl.split('#')[0];
    if (targetFile !== currentFile) {
      window.location.href = targetUrl;
      return;
    }
  }

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

  // Sync hub subnav buttons
  document.querySelectorAll('.hub-subnav-btn').forEach(btn => {
    const isMatch = btn.getAttribute('data-tab') === targetId;
    btn.classList.toggle('active', isMatch);
  });

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

  if (targetPane) {
    targetPane.classList.add('active');
    setupCollapsibleSections();

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
      const filterBtn = document.querySelector(`#tab-staff .filter-btn[data-filter="${options.staffFilter}"]`);
      if (filterBtn) filterBtn.click();
    }

    if (targetId === 'tab-election') {
      const renderPromise = renderElectionHub();
      setupElectionControls();
      if (options.scrollToElement) {
        Promise.resolve(renderPromise).then(() => {
          setTimeout(() => {
            const el = document.querySelector(options.scrollToElement);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 40);
        });
      }
    }

    // Scroll handling
    if (options.scrollToElement && targetId !== 'tab-election') {
      setTimeout(() => {
        const el = document.querySelector(options.scrollToElement);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 80);
    } else if (targetId !== 'tab-election' && !options.doNotScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}

// URL Hash Routing & Deep-Linking System
function handleUrlHash() {
  const rawHash = (window.location.hash || '').replace(/^#/, '').trim();
  if (!rawHash) return;

  const currentFile = window.location.pathname.split('/').pop() || 'index.html';

  // If hash points to election and we are on another page, navigate to election.html
  if ((rawHash === 'election' || rawHash.startsWith('election-')) && currentFile !== 'election.html') {
    window.location.href = 'election.html#' + rawHash;
    return;
  }

  // Cross-page redirect if hash points to a tab on another page
  if (TAB_PAGE_MAP[rawHash]) {
    const targetUrl = TAB_PAGE_MAP[rawHash];
    const targetFile = targetUrl.split('#')[0];
    if (currentFile !== targetFile) {
      window.location.href = targetUrl;
      return;
    }
  }

  const targetEl = document.getElementById(rawHash);
  const activePane = document.querySelector('.tab-pane.active');

  // Auto-expand collapsible section if target is inside one
  if (targetEl) {
    const parentSection = targetEl.classList.contains('collapsible-section') ? targetEl : targetEl.closest('details.collapsible-section');
    if (parentSection) {
      parentSection.open = true;
    }
  }

  // 1. If target element is already inside the active tab, simply scroll to it cleanly
  if (targetEl && activePane && activePane.contains(targetEl)) {
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  // 2. If target element is inside an inactive tab pane, activate that tab and scroll to element
  if (targetEl) {
    const parentPane = targetEl.closest('.tab-pane');
    if (parentPane && parentPane.id) {
      switchTab(parentPane.id, { scrollToElement: '#' + rawHash });
      return;
    }
  }

  // 3. If hash is directly a tab pane ID
  const directTab = document.getElementById(rawHash);
  if (directTab && directTab.classList.contains('tab-pane')) {
    switchTab(rawHash);
    return;
  }

  // 4. Aliases for common election deep links
  if (rawHash === 'election' || rawHash.startsWith('election-')) {
    switchTab('tab-election', { scrollToElement: targetEl ? '#' + rawHash : '#election-search-anchor' });
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

  // Setup Hub Subnav Buttons (budgets.html and properties.html)
  document.querySelectorAll('.hub-subnav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      if (targetId) {
        document.querySelectorAll('.hub-subnav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        switchTab(targetId);
      }
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

  // Nav Brand Lockup click -> Smooth scroll to top
  const brandHomeBtn = document.getElementById('nav-brand-home');
  if (brandHomeBtn) {
    brandHomeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Sticky Header Visual Stability: Add subtle elevation shadow on scroll
  const navBarEl = document.getElementById('main-nav');
  if (navBarEl) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 20) {
            navBarEl.classList.add('is-scrolled');
          } else {
            navBarEl.classList.remove('is-scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // Handle in-page hash changes & browser back/forward routing
  window.addEventListener('hashchange', () => {
    handleUrlHash();
  });

  syncDropdownActiveState();
}

// Data Loader (Supports all 7 cities: clifton, parsippany, wayne, montclair, morristown, montville, glenrock)
async function loadAllData(cityId = currentCity) {
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
    surroundingTownsData = await surrRes.json();
    commercialPilotData = await pilotRes.json();
    fairTaxData = await fairRes.json();

    await loadElectionData(cityId);

  } catch (err) {
    console.error("Data load issue:", err);
  }
}

async function loadElectionData(cityId = currentCity) {
  const targetCity = CITY_REGISTRY[cityId] ? cityId : 'clifton';
  if (!cliftonElectionData || loadedElectionCity !== targetCity) {
    try {
      const filePath = targetCity === 'clifton' ? 'data/clifton_election_candidates.json' : `data/${targetCity}/election_candidates.json`;
      const res = await fetch(filePath);
      if (res.ok) {
        cliftonElectionData = await res.json();
        loadedElectionCity = targetCity;
      } else {
        console.warn(`Could not load election data for ${targetCity}`);
      }
    } catch (err) {
      console.error("Election data load issue:", err);
    }
  }
  return cliftonElectionData;
}

// TAB 1: CALCULATOR
function setupCalculator() {
  const input = document.getElementById('calc-assessment-input');
  if (!input || !taxData) return;
  const meta = CITY_REGISTRY[currentCity] || CITY_REGISTRY.clifton;

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
              <span>🏛️</span> Full ${meta.schoolDistrictShort} (${meta.schoolBudgetDisplay}) Budget Breakdown ➔
            </button>
            <button class="btn-jump-action secondary" data-jump-tab="tab-benefits">
              <span>🏥</span> School Benefits & Healthcare (${meta.benefitsSpendDisplay}) ➔
            </button>
          </div>
        `;
      } else if (b.id === 'municipal') {
        actionsHtml = `
          <div class="entity-card-actions">
            <button class="btn-jump-action" data-jump-tab="tab-budgets">
              <span>🏛️</span> Full ${meta.name} (${meta.muniBudgetDisplay}) Budget Breakdown ➔
            </button>
            <button class="btn-jump-action secondary" data-jump-tab="tab-staff">
              <span>👮</span> Police & Staff Payroll ➔
            </button>
          </div>
        `;
      } else if (b.id === 'county') {
        actionsHtml = `
          <div class="entity-card-actions">
            <button class="btn-jump-action" data-jump-tab="tab-surrounding">
              <span>🗺️</span> Compare Surrounding ${meta.countyShort} Rates ➔
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

  input.oninput = () => {
    if (slider) slider.value = input.value;
    updateCalc();
  };

  if (slider) {
    slider.oninput = () => {
      input.value = slider.value;
      updateCalc();
    };
  }

  // Preset Buttons inside Tab 1 Calculator
  document.querySelectorAll('#tab-calculator .preset-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('#tab-calculator .preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const val = btn.getAttribute('data-val');
      input.value = val;
      if (slider) slider.value = val;
      updateCalc();
    };
  });

  updateCalc();
}

// TAB 2: BUDGETS
function renderBudgets() {
  if (!boeBudgetData || !cityBudgetData) return;
  const meta = CITY_REGISTRY[currentCity] || CITY_REGISTRY.clifton;

  const boeContainer = document.getElementById('boe-line-items');
  boeContainer.innerHTML = boeBudgetData.majorAppropriations.map(item => {
    let actionBtn = '';
    const cat = item.category.toLowerCase();
    if (cat.includes('benefit') || cat.includes('insurance')) {
      actionBtn = `<button class="btn-jump-budget-link" data-jump-tab="tab-benefits">Explore Healthcare Plans, Copays & Benefit Costs (${meta.benefitsSpendDisplay}) ➔</button>`;
    } else if (cat.includes('regular') || cat.includes('instruction') || cat.includes('administration')) {
      actionBtn = `<button class="btn-jump-budget-link" data-jump-tab="tab-staff">View School District Staff Directory & Salaries ➔</button>`;
    } else if (cat.includes('transportation') || cat.includes('facilities') || cat.includes('special') || cat.includes('operations')) {
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
      actionBtn = `<button class="btn-jump-budget-link" data-jump-tab="tab-staff">View Police Salaries, Overtime & Details ➔</button>`;
    } else if (cat.includes('pension') || cat.includes('benefit') || cat.includes('insurance')) {
      actionBtn = `<button class="btn-jump-budget-link" data-jump-tab="tab-benefits">View Municipal Benefit Liabilities (${meta.benefitsSpendDisplay}) ➔</button>`;
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
  const meta = CITY_REGISTRY[currentCity] || CITY_REGISTRY.clifton;
  const isParsippany = currentCity === 'parsippany';

  const overview = demographicsData.cityOverview;
  const banner = document.getElementById('demo-citywide-banner');
  if (banner && overview) {
    banner.innerHTML = `
      <div class="demo-stat-box">
        <span class="demo-stat-label">Total Population</span>
        <span class="demo-stat-num">${overview.totalPopulation.toLocaleString()}</span>
        <span class="demo-stat-sub">${overview.totalHousingUnits ? overview.totalHousingUnits.toLocaleString() + ' Housing Units' : 'Housing Units'}</span>
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
        <span class="demo-stat-sub">${overview.nonEnglishAtHomePercent ? overview.nonEnglishAtHomePercent + '% Speak Non-English at Home' : '45% Non-English at Home'}</span>
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
            <span class="metric-val" style="color: ${z.zip === '07013' || z.zip === '07950' ? 'var(--color-school)' : 'var(--color-city)'};">${formatUSDWhole(z.medianHouseholdIncome)}</span>
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
            <span class="metric-name">Share of ${meta.name} Tax Base:</span>
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
  const meta = CITY_REGISTRY[currentCity] || CITY_REGISTRY.clifton;
  const isParsippany = currentCity === 'parsippany';
  const isClifton = currentCity === 'clifton';

  const fData = demographicsData.familyChildDemographics;

  // 1. Family Stats Ribbon
  const ribbon = document.getElementById('family-stats-ribbon');
  if (ribbon && fData.citywide) {
    const c = fData.citywide;
    if (isParsippany) {
      ribbon.innerHTML = `
        <div class="family-stat-box highlight-stat">
          <span class="f-stat-label">Families With Children</span>
          <span class="f-stat-val">${c.householdsWithChildrenPercent}%</span>
          <span class="f-stat-sub">${c.householdsWithChildrenUnder18.toLocaleString()} of ${c.totalHouseholds.toLocaleString()} Parsippany households</span>
        </div>
        <div class="family-stat-box">
          <span class="f-stat-label">Public School Students</span>
          <span class="f-stat-val font-mono" style="color: var(--color-school);">${c.enrolledPublicSchools.toLocaleString()}</span>
          <span class="f-stat-sub">${c.enrolledPublicPercent}% of all ${c.totalSchoolAgeChildren.toLocaleString()} school-age kids</span>
        </div>
        <div class="family-stat-box">
          <span class="f-stat-label">Central / Lake (07054) Share</span>
          <span class="f-stat-val" style="color: #2563eb;">73.6%</span>
          <span class="f-stat-sub">Supplies 5,240 students • Pays 71.5% school levy</span>
        </div>
        <div class="family-stat-box">
          <span class="f-stat-label">Lake Hiawatha (07034) Ratio</span>
          <span class="f-stat-val" style="color: #dc2626;">1.21x</span>
          <span class="f-stat-sub">Supplies 1,110 students (15.6%) • Pays 12.9% levy</span>
        </div>
        <div class="family-stat-box">
          <span class="f-stat-label">Tabor Hills (07950) Donor</span>
          <span class="f-stat-val font-mono" style="color: #166534;">0.68x</span>
          <span class="f-stat-sub">Supplies 490 students (6.9%) • Pays 10.2% levy</span>
        </div>
      `;
    } else if (isClifton) {
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
          <span class="f-stat-label">West & Central (07013 & 07012)</span>
          <span class="f-stat-val" style="color: #166534;">40.7%</span>
          <span class="f-stat-sub">Supplies 4,380 students • Pays 57.4% school levy</span>
        </div>
        <div class="family-stat-box">
          <span class="f-stat-label">Delawanna (07014) Ratio</span>
          <span class="f-stat-val font-mono" style="color: #d97706;">1.03x</span>
          <span class="f-stat-sub">Supplies 650 students (6.1%) • Pays 5.9% levy</span>
        </div>
      `;
    } else {
      ribbon.innerHTML = `
        <div class="family-stat-box highlight-stat">
          <span class="f-stat-label">Families With Children</span>
          <span class="f-stat-val">${c.householdsWithChildrenPercent}%</span>
          <span class="f-stat-sub">${c.householdsWithChildrenUnder18.toLocaleString()} of ${c.totalHouseholds.toLocaleString()} ${meta.name} households</span>
        </div>
        <div class="family-stat-box">
          <span class="f-stat-label">Public School Students</span>
          <span class="f-stat-val font-mono" style="color: var(--color-school);">${c.enrolledPublicSchools.toLocaleString()}</span>
          <span class="f-stat-sub">${c.enrolledPublicPercent}% of all ${c.totalSchoolAgeChildren.toLocaleString()} school-age kids</span>
        </div>
        <div class="family-stat-box">
          <span class="f-stat-label">School Budget Share</span>
          <span class="f-stat-val" style="color: #2563eb;">${meta.schoolsShare}</span>
          <span class="f-stat-sub">${meta.schoolDistrictShort} annual local tax contribution</span>
        </div>
        <div class="family-stat-box">
          <span class="f-stat-label">Equalization Ratio</span>
          <span class="f-stat-val" style="color: #166534;">${meta.equalizationRatio}%</span>
          <span class="f-stat-sub">State equalized valuation ratio (${meta.countyShort})</span>
        </div>
        <div class="family-stat-box">
          <span class="f-stat-label">Average Annual Bill</span>
          <span class="f-stat-val font-mono" style="color: #d97706;">${meta.avgTaxBill}</span>
          <span class="f-stat-sub">Avg assessment: ${meta.avgAssessed}</span>
        </div>
      `;
    }
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
              ${s.feederMiddle && !s.feederMiddle.startsWith('N/A') && !s.feederMiddle.startsWith('Receives') ? `➔ <span>${s.feederMiddle}</span>` : ''}
              ${s.type === 'Elementary' ? `➔ <span>${
                meta.id === 'clifton' ? 'Clifton High School (CHS)'
                : meta.id === 'parsippany' ? 'Parsippany High / Hills High'
                : meta.id === 'wayne' ? 'Wayne Valley / Wayne Hills HS'
                : meta.id === 'montclair' ? 'Montclair High School (MHS)'
                : meta.id === 'morristown' ? 'Morristown High School (MHS)'
                : meta.id === 'montville' ? 'Montville Township High School (MTHS)'
                : 'Glen Rock High School (GRHS)'
              }</span>` : ''}
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
  const meta = CITY_REGISTRY[currentCity] || CITY_REGISTRY.clifton;
  const isParsippany = currentCity === 'parsippany';

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
              <span class="tax-split-item city-split">🏛️ ${meta.name}: ${formatUSDWhole(p.municipalTax)}</span>
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
            <button class="btn-jump-prop-toolkit" data-jump-tab="tab-intelligence" onclick="if(document.getElementById('receipt-assessed-input')){document.getElementById('receipt-assessed-input').value=${p.assessedTotal};document.getElementById('receipt-assessed-input').dispatchEvent(new Event('input'));document.querySelector('.intel-nav-btn[data-report=\\'receipt\\']')?.click();}">
              <span>🧾</span> Itemized Tax Grocery Receipt ➔
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
    switchTab('tab-calculator', { scrollToElement: '#calc-assessment-input' });
  } else {
    window.location.href = `index.html?calc=${assessedValue}#tab-calculator`;
  }
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
    btnViewCards.onclick = () => {
      btnViewCards.classList.add('active');
      btnViewTable.classList.remove('active');
      cardsContainer.style.display = 'grid';
      tableContainer.style.display = 'none';
    };

    btnViewTable.onclick = () => {
      btnViewTable.classList.add('active');
      btnViewCards.classList.remove('active');
      cardsContainer.style.display = 'none';
      tableContainer.style.display = 'block';
    };
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

  // Attach idempotent event handlers
  if (searchInput) searchInput.oninput = applyFilters;
  if (neighSelect) neighSelect.onchange = applyFilters;
  if (zipSelect) zipSelect.onchange = applyFilters;
  if (typeSelect) typeSelect.onchange = applyFilters;
  if (bedsSelect) bedsSelect.onchange = applyFilters;
  if (bathsSelect) bathsSelect.onchange = applyFilters;
  if (tierSelect) tierSelect.onchange = applyFilters;
  if (sortSelect) sortSelect.onchange = applyFilters;

  // Reset Filters
  if (resetBtn) {
    resetBtn.onclick = () => {
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
    };
  }
}

// TAB: SURROUNDING TOWNS / CROSS-TOWN COMPARISON HUB
let crossTownState = {
  homeValue: 600000,
  income: 125000,
  county: 'all',
  sortBy: 'tax-asc'
};
let surroundingEventsInitialized = false;

function setupSurroundingComparatorEvents() {
  if (surroundingEventsInitialized) return;
  surroundingEventsInitialized = true;

  const homeInput = document.getElementById('cross-home-val');
  const incomeInput = document.getElementById('cross-income-val');
  const sortSelect = document.getElementById('cross-sort-by');

  if (homeInput) {
    homeInput.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value) || 0;
      crossTownState.homeValue = Math.max(10000, val);
      document.querySelectorAll('.comp-preset-btn').forEach(btn => {
        btn.classList.toggle('active', parseFloat(btn.dataset.val) === crossTownState.homeValue);
      });
      renderSurroundingTowns();
    });
  }

  // Preset Home Values
  document.querySelectorAll('.comp-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseFloat(btn.dataset.val);
      if (val) {
        crossTownState.homeValue = val;
        if (homeInput) homeInput.value = val;
        document.querySelectorAll('.comp-preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderSurroundingTowns();
      }
    });
  });

  if (incomeInput) {
    incomeInput.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value) || 0;
      crossTownState.income = Math.max(1000, val);
      renderSurroundingTowns();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      crossTownState.sortBy = e.target.value;
      renderSurroundingTowns();
    });
  }

  // County Filter Buttons
  document.querySelectorAll('.comp-county-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      crossTownState.county = btn.dataset.county;
      document.querySelectorAll('.comp-county-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSurroundingTowns();
    });
  });
}

function renderSurroundingTowns() {
  if (!surroundingTownsData || !surroundingTownsData.towns) return;
  setupSurroundingComparatorEvents();

  const homeVal = crossTownState.homeValue;
  const income = crossTownState.income;
  const countyFilter = crossTownState.county;
  const sortBy = crossTownState.sortBy;

  // Filter towns by county
  let towns = surroundingTownsData.towns.filter(t => {
    if (countyFilter === 'all') return true;
    return t.county.toLowerCase().includes(countyFilter.toLowerCase().replace(' county', ''));
  });

  // Calculate dynamic metrics for this specific home value
  const enriched = towns.map(t => {
    const effectiveRate = t.effectiveTaxRateMarket || (t.certifiedTaxRate * (t.equalizationRatio / 100));
    const annualTax = homeVal * (effectiveRate / 100);
    const monthlyTax = annualTax / 12;
    const burdenPct = income > 0 ? (annualTax / income) * 100 : 0;
    
    const schoolPct = t.taxSplit?.schoolsPercent || 50;
    const muniPct = t.taxSplit?.municipalPercent || 30;
    const countyPct = t.taxSplit?.countyPercent || 20;

    const schoolDollars = annualTax * (schoolPct / 100);
    const muniDollars = annualTax * (muniPct / 100);
    const countyDollars = annualTax * (countyPct / 100);

    return {
      ...t,
      computedAnnualTax: annualTax,
      computedMonthlyTax: monthlyTax,
      computedBurdenPct: burdenPct,
      schoolDollars,
      muniDollars,
      countyDollars,
      schoolPct,
      muniPct,
      countyPct
    };
  });

  // Sort towns based on selected option
  enriched.sort((a, b) => {
    switch (sortBy) {
      case 'tax-asc':
        return a.computedAnnualTax - b.computedAnnualTax;
      case 'tax-desc':
        return b.computedAnnualTax - a.computedAnnualTax;
      case 'rate-asc':
        return a.effectiveTaxRateMarket - b.effectiveTaxRateMarket;
      case 'school-desc':
        return b.schoolPct - a.schoolPct;
      case 'muni-desc':
        return b.muniPct - a.muniPct;
      case 'name-asc':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  // Render Table Rows
  const tableBody = document.getElementById('surrounding-table-body');
  if (tableBody) {
    tableBody.innerHTML = enriched.map(t => {
      const isCurrent = t.id === currentCity;
      const isFull = t.hasFullWatchdogProfile;

      return `
        <tr class="${isCurrent ? 'highlight-focus-row' : ''}">
          <th scope="row">
            <strong>${t.name}</strong> ${isCurrent ? '⭐ <span style="color: #2563eb; font-size: 0.72rem; font-weight: 800;">(Active Focus)</span>' : ''}<br>
            <small style="color: var(--text-subtle);">${t.county} • Pop. ${t.population.toLocaleString()}</small>
          </th>
          <td style="font-family: var(--font-mono); font-weight: 700; color: #dc2626;">${t.certifiedTaxRate.toFixed(3)}%</td>
          <td style="font-family: var(--font-mono);">${t.equalizationRatio.toFixed(1)}%</td>
          <td style="font-family: var(--font-mono); font-weight: 800; color: #059669;">${t.effectiveTaxRateMarket.toFixed(3)}%</td>
          <td style="font-family: var(--font-mono); font-weight: 800; font-size: 0.95rem; color: #0f172a;">${formatUSDWhole(t.computedAnnualTax)}</td>
          <td style="font-family: var(--font-mono); font-weight: 600;">${formatUSDWhole(t.computedMonthlyTax)}</td>
          <td style="font-family: var(--font-mono); font-weight: 700; color: ${t.computedBurdenPct > 12 ? '#dc2626' : '#15803d'};">
            ${t.computedBurdenPct.toFixed(1)}%
          </td>
          <td>
            <div class="comp-split-container">
              <div class="comp-stacked-bar" title="Schools: ${t.schoolPct.toFixed(1)}% | Muni: ${t.muniPct.toFixed(1)}% | County: ${t.countyPct.toFixed(1)}%">
                <div class="bar-seg bar-seg-school" style="width: ${t.schoolPct}%;"></div>
                <div class="bar-seg bar-seg-muni" style="width: ${t.muniPct}%;"></div>
                <div class="bar-seg bar-seg-county" style="width: ${t.countyPct}%;"></div>
              </div>
              <div class="comp-split-labels">
                <span class="label-school" title="School Taxes">🏫 ${formatUSDWhole(t.schoolDollars)} (${t.schoolPct.toFixed(0)}%)</span>
                <span class="label-muni" title="Municipal Taxes">🚔 ${formatUSDWhole(t.muniDollars)} (${t.muniPct.toFixed(0)}%)</span>
                <span class="label-county" title="County Taxes">🏛️ ${formatUSDWhole(t.countyDollars)} (${t.countyPct.toFixed(0)}%)</span>
              </div>
            </div>
          </td>
          <td>
            ${isFull ? `
              <button type="button" class="btn-town-switch ${isCurrent ? 'active-town' : ''}" data-switch-city="${t.id}" title="Switch platform to ${t.name}">
                ${isCurrent ? '✓ Active Platform' : `Switch to ${t.name} ➔`}
              </button>
            ` : `
              <span class="town-badge-bench" title="Comparative Ratable Benchmark">Benchmark</span>
            `}
          </td>
        </tr>
      `;
    }).join('');

    // Attach switchCity handler to buttons in table
    tableBody.querySelectorAll('[data-switch-city]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-switch-city');
        if (target && target !== currentCity) {
          switchCity(target, true);
        }
      });
    });
  }

  // Render Detailed Town Comparative Cards
  const cardsContainer = document.getElementById('surrounding-cards-container');
  if (cardsContainer) {
    cardsContainer.innerHTML = enriched.map(t => {
      const isCurrent = t.id === currentCity;
      const isFull = t.hasFullWatchdogProfile;

      return `
        <div class="surround-card ${isCurrent ? 'clifton-border' : ''}">
          <div class="surround-card-header">
            <div>
              <div class="surround-town-name">${t.name} ${isCurrent ? '⭐' : ''}</div>
              <div class="surround-town-sub">${t.county} • ${t.relationship}</div>
            </div>
            <span class="pill-tag ${isCurrent ? 'active-pill' : ''}">Pop. ${t.population.toLocaleString()}</span>
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

          <div style="margin: 12px 0 14px 0; padding: 10px 12px; background: #f8fafc; border: 1px solid var(--border-light); border-radius: var(--radius-md);">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
              <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Tax on $${(homeVal/1000).toFixed(0)}k Home:</span>
              <span style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 800; color: #0f172a;">${formatUSDWhole(t.computedAnnualTax)} <small style="font-size: 0.75rem; font-weight: 600; color: var(--text-subtle);">(${formatUSDWhole(t.computedMonthlyTax)}/mo)</small></span>
            </div>
            <div class="comp-split-container">
              <div class="comp-stacked-bar">
                <div class="bar-seg bar-seg-school" style="width: ${t.schoolPct}%;"></div>
                <div class="bar-seg bar-seg-muni" style="width: ${t.muniPct}%;"></div>
                <div class="bar-seg bar-seg-county" style="width: ${t.countyPct}%;"></div>
              </div>
              <div class="comp-split-labels" style="margin-top: 4px;">
                <span class="label-school">🏫 Schools: ${formatUSDWhole(t.schoolDollars)} (${t.schoolPct.toFixed(0)}%)</span>
                <span class="label-muni">🚔 Muni: ${formatUSDWhole(t.muniDollars)} (${t.muniPct.toFixed(0)}%)</span>
                <span class="label-county">🏛️ County: ${formatUSDWhole(t.countyDollars)} (${t.countyPct.toFixed(0)}%)</span>
              </div>
            </div>
          </div>

          <div class="surround-metrics-grid">
            <div class="sm-metric">
              <span class="sm-label">Median Annual Tax Bill</span>
              <span class="sm-val font-mono">${formatUSDWhole(t.medianAnnualTaxBill)}</span>
              <span class="sm-sub">On ${formatUSDWhole(t.medianHomeValueMarket)} median home</span>
            </div>
            <div class="sm-metric">
              <span class="sm-label">Median Household Income</span>
              <span class="sm-val font-mono">${formatUSDWhole(t.medianHouseholdIncome)}</span>
              <span class="sm-sub">Tax: ${t.taxBurdenPercentOfIncome.toFixed(1)}% of income</span>
            </div>
            <div class="sm-metric">
              <span class="sm-label">School District Spending</span>
              <span class="sm-val font-mono">${t.schoolBudget ? formatUSDWhole(t.schoolBudget) : 'N/A'}</span>
              <span class="sm-sub">${t.perPupilCost ? `$${t.perPupilCost.toLocaleString()}/pupil` : ''} ${t.schoolStateAidShare ? `• ${t.schoolStateAidShare}% State Aid` : ''}</span>
            </div>
            <div class="sm-metric">
              <span class="sm-label">Municipal Operating Budget</span>
              <span class="sm-val font-mono">${t.municipalBudget ? formatUSDWhole(t.municipalBudget) : 'N/A'}</span>
              <span class="sm-sub">${t.commercialSharePct ? `${t.commercialSharePct}% Commercial Base` : 'Local Tax Base'}</span>
            </div>
          </div>

          <div class="surround-notes">
            <strong>Watchdog Analysis:</strong> ${t.strengthsAndWatchdogNotes}
          </div>

          <div class="card-action-bar-jumps" style="margin-top: 14px;">
            ${isFull ? `
              <button class="btn-jump-action" data-switch-city="${t.id}" style="${isCurrent ? 'background: #059669;' : ''}">
                <span>${(CITY_REGISTRY[t.id] && CITY_REGISTRY[t.id].icon) || '🏛️'}</span>
                ${isCurrent ? `Currently Exploring ${t.name} Watchdog` : `Switch Watchdog Platform to ${t.name} ➔`}
              </button>
            ` : `
              <button class="btn-jump-action secondary" data-jump-tab="tab-calculator">
                <span>🧮</span> Calculate ${meta.name} Tax Details ➔
              </button>
            `}
          </div>
        </div>
      `;
    }).join('');

    // Attach switchCity handler to card buttons
    cardsContainer.querySelectorAll('[data-switch-city]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-switch-city');
        if (target && target !== currentCity) {
          switchCity(target, true);
        }
      });
    });
  }

  // Render Comparative Takeaways
  const takeContainer = document.getElementById('surrounding-takeaways-container');
  if (takeContainer && surroundingTownsData.comparativeKeyFindings) {
    takeContainer.innerHTML = surroundingTownsData.comparativeKeyFindings.map(f => `
      <div class="takeaway-card">
        <h4>${f.title}</h4>
        <p>${f.detail}</p>
      </div>
    `).join('');
  }
}

// TAB: HEALTHCARE & BENEFITS
function renderBenefits() {
  if (!benefitsData) return;
  const meta = CITY_REGISTRY[currentCity] || CITY_REGISTRY.clifton;
  const isParsippany = currentCity === 'parsippany';

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
          <span>${meta.name} Taxpayer Subsidy:</span>
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
            <span>🚨</span> View Audit & Leave Analyses ➔
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

    const cat = c.category.toLowerCase();

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
          <button class="btn-jump-alert" data-jump-tab="tab-intelligence" onclick="document.querySelector('.intel-nav-btn[data-report=\\'homes\\']')?.click();">
            <span>🔬</span> View Public Personnel & Cost Equivalency ➔
          </button>
          ${cat.includes('benefit') || cat.includes('leave') || cat.includes('compensation') ? `
            <button class="btn-jump-action secondary" data-jump-tab="tab-benefits">
              <span>🏥</span> See Healthcare & Benefits Cost Data ➔
            </button>
          ` : ''}
          ${c.entityInvolved.includes('Board of Ed') || c.entityInvolved.includes('PTHSD') ? `
            <button class="btn-jump-action secondary" data-jump-tab="tab-budgets">
              <span>🏛️</span> View School Board Budget Line Items ➔
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
  if (!tbody) return;

  const q = searchQuery.toLowerCase().trim();

  const filtered = staffData.filter(s => {
    let matchesEntity = true;
    const isSchool = /school|board of education|boe|pthsd|msd/i.test(s.entity || '');
    if (filterEntity === 'all') {
      matchesEntity = true;
    } else if (filterEntity === 'school' || /school|board of education|boe/i.test(filterEntity)) {
      matchesEntity = isSchool;
    } else if (filterEntity === 'city' || filterEntity === 'municipal' || /city|town|township|borough|municipal/i.test(filterEntity)) {
      matchesEntity = !isSchool;
    } else {
      matchesEntity = s.entity === filterEntity;
    }

    const matchesSearch = !q || 
      (s.name && s.name.toLowerCase().includes(q)) || 
      (s.title && s.title.toLowerCase().includes(q)) || 
      (s.department && s.department.toLowerCase().includes(q)) ||
      (s.notes && s.notes.toLowerCase().includes(q));
    return matchesEntity && matchesSearch;
  });

  // Sort by reported salary descending
  filtered.sort((a, b) => ((b.salaryReported || b.baseSalary || 0) - (a.salaryReported || a.baseSalary || 0)));

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 24px; color: var(--text-subtle);">No matching positions found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(s => {
    const isSchool = /school|board of education|boe|pthsd|msd/i.test(s.entity || '');
    const pillClass = isSchool ? 'pill-school' : 'pill-city';
    const sal = s.salaryReported || s.baseSalary || 0;
    const salaryDisplay = sal > 0 ? formatUSDWhole(sal) : '$0 (Unpaid Public Service)';

    const hasEthics = (ethicsData || []).some(e => {
      const eName = (e.officialName || e.name || '').toLowerCase();
      const sName = (s.name || '').toLowerCase();
      return eName && sName && (eName.includes(sName) || sName.includes(eName));
    });

    return `
      <tr>
        <td>
          <strong>${s.name}</strong>
          <div><small style="color: var(--text-subtle);">${s.title}</small></div>
          <div style="margin-top: 6px; display: flex; flex-wrap: wrap; gap: 4px;">
            ${hasEthics ? `<button class="btn-jump-tag" data-jump-tab="tab-ethics"><span>🏢</span> Outside Businesses & FDS ➔</button>` : ''}
            <button class="btn-jump-tag-search" data-jump-tab="tab-intelligence" onclick="document.querySelector('.intel-nav-btn[data-report=\\'homes\\']')?.click();"><span>🏡</span> Homes to Fund Salary ➔</button>
          </div>
        </td>
        <td>
          <span class="entity-pill ${pillClass}">${s.entity}</span>
          <div style="font-size: 0.8rem; margin-top: 4px; color: var(--text-muted);">${s.department || ''}</div>
        </td>
        <td><small style="font-weight: 500;">${s.type || ''}</small></td>
        <td class="text-right">
          <span class="salary-tag">${salaryDisplay}</span>
        </td>
        <td><small style="font-family: var(--font-mono);">${s.salaryRange || ''}</small></td>
        <td style="max-width: 320px;"><small style="color: var(--text-muted);">${s.notes || ''}</small></td>
      </tr>
    `;
  }).join('');
}

function setupStaffFilters() {
  const searchInput = document.getElementById('staff-search-input');
  const filterBtns = document.querySelectorAll('#tab-staff .filter-btn');

  if (searchInput) {
    searchInput.oninput = () => {
      const activeBtn = document.querySelector('#tab-staff .filter-btn.active');
      const currentFilter = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
      renderStaffTable(currentFilter, searchInput.value);
    };
  }

  filterBtns.forEach(btn => {
    btn.onclick = () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const currentFilter = btn.getAttribute('data-filter');
      renderStaffTable(currentFilter, searchInput ? searchInput.value : '');
    };
  });
}

// TAB 4: ETHICS & ASSETS
function renderEthicsCards(filterEntity = 'all') {
  if (!ethicsData) return;
  const meta = CITY_REGISTRY[currentCity] || CITY_REGISTRY.clifton;
  const districtCode = meta.districtCode;
  const countyLabel = meta.county;

  const container = document.getElementById('ethics-cards-container');
  if (!container) return;

  const filtered = ethicsData.filter(d => {
    const isSchool = /school|board of education|boe|pthsd|msd|superintendent|principal/i.test(d.publicTitle || d.mandatoryFiling || '');
    if (filterEntity === 'all') return true;
    if (filterEntity === 'school' || /school|board of education|boe/i.test(filterEntity)) return isSchool;
    if (filterEntity === 'city' || filterEntity === 'municipal' || /city|town|township|borough|municipal/i.test(filterEntity)) return !isSchool;
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-subtle);">No matching ethics disclosures found for this filter.</div>`;
    return;
  }

  container.innerHTML = filtered.map(d => {
    const isSchool = /school|board of education|boe|pthsd|msd|superintendent|principal/i.test(d.publicTitle || d.mandatoryFiling || '');
    const pillClass = isSchool ? 'pill-school' : 'pill-city';
    const pillLabel = isSchool ? meta.schoolDistrictShort : meta.name + ' Municipal';

    const businessesHtml = (d.disclosedBusinesses || []).map(b => `
      <div class="business-item">
        <div class="business-name">${b.businessName}</div>
        <div class="business-detail"><strong>Role:</strong> ${b.ownership} | <strong>Type:</strong> ${b.nature} (${b.location})</div>
      </div>
    `).join('');

    const propertiesHtml = (d.realEstateHoldings || []).map(p => `
      <div class="property-item">
        <div class="business-name">${p.description}</div>
        <div class="business-detail"><strong>Location:</strong> ${p.municipality} | <strong>Lookup:</strong> ${p.taxRecordLookup}</div>
      </div>
    `).join('');

    const incomeHtml = (d.earnedIncomeSources || []).map(i => `<li style="font-size: 0.8rem; margin-bottom: 2px;">${i}</li>`).join('');

    const encodedName = encodeURIComponent((d.officialName || '').split(' ').pop());
    const propUrl = `https://tax1.co.monmouth.nj.us/cgi-bin/m4.cgi?district=${districtCode}&owner=${encodedName}`;

    return `
      <div class="ethics-card">
        <div class="ethics-header">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
            <h3 style="margin: 0;">${d.officialName}</h3>
            <span class="entity-pill ${pillClass}">${pillLabel}</span>
          </div>
          <div class="ethics-title">${d.publicTitle}</div>
          <div class="ethics-filing-type">${d.mandatoryFiling}</div>
        </div>

        <div class="section-label">Declared Businesses & Entities</div>
        ${businessesHtml || '<div class="business-item"><div class="business-detail">None Disclosed</div></div>'}

        <div class="section-label">Real Estate & Property Assets</div>
        ${propertiesHtml || '<div class="property-item"><div class="business-detail">None Disclosed</div></div>'}

        <div class="section-label">Earned Income Sources (> $2,000)</div>
        <ul style="padding-left: 18px; color: var(--text-muted); margin-bottom: 10px;">
          ${incomeHtml || '<li style="font-size: 0.8rem;">None Disclosed</li>'}
        </ul>

        <div class="conflict-notice">
          <strong>Ethics / Conflict Notice:</strong> ${d.conflictGuidance}
        </div>

        <div class="card-action-bar" style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px;">
          <a href="${propUrl}" target="_blank" rel="noopener" class="verify-link">
            🔍 Check ${countyLabel} Tax Board for ${d.officialName} ↗
          </a>
        </div>
      </div>
    `;
  }).join('');
}

function setupEthicsFilters() {
  const filterBtns = document.querySelectorAll('#tab-ethics .filter-btn');
  filterBtns.forEach(btn => {
    btn.onclick = () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-ethics-filter');
      renderEthicsCards(filter);
    };
  });
}

// TAB 5: VENDORS
function renderVendorsCards() {
  if (!vendorsData) return;
  const meta = CITY_REGISTRY[currentCity] || CITY_REGISTRY.clifton;
  const citySearchLabel = `${meta.name} NJ contract`;

  const container = document.getElementById('vendors-cards-container');
  container.innerHTML = vendorsData.map(v => `
    <div class="vendor-card">
      <div class="vendor-entity">${v.entityServed} • ${v.category}</div>
      <h3>${v.vendorName}</h3>
      <div class="vendor-spend">~${formatUSDWhole(v.annualEstimatedSpend)} <small style="font-size: 0.8rem; color: var(--text-subtle);">/ year</small></div>
      <p class="vendor-desc">${v.description}</p>
      <div class="card-action-bar-jumps">
        <a href="https://www.google.com/search?q=${encodeURIComponent(v.vendorName + ' ' + citySearchLabel)}" target="_blank" rel="noopener" class="btn-jump-action secondary">
          <span>🔍</span> Search Contract Awards ↗
        </a>
      </div>
    </div>
  `).join('');
}

// TAB 6: INVESTIGATION TOOLKIT
function setupInvestigationTools() {
  const propInput = document.getElementById('property-search-name');
  const propBtn = document.getElementById('btn-property-search');
  const propResult = document.getElementById('property-link-result');
  const meta = CITY_REGISTRY[currentCity] || CITY_REGISTRY.clifton;
  const districtCode = meta.districtCode;
  const countyShort = meta.countyShort;
  const cityLabel = meta.name;

  function performSearch() {
    if (!propInput || !propResult) return;
    const rawVal = propInput.value.trim();
    if (!rawVal) {
      propResult.innerHTML = `
        <div class="search-empty-state">
          <span>ℹ️</span> Please enter an official's name, department, street, or address in ${meta.name}.
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
      const employer = (s.employer || s.entity || '').toLowerCase();
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
    const mod4Url = `https://tax1.co.monmouth.nj.us/cgi-bin/m4.cgi?district=${districtCode}&owner=${encodeURIComponent(rawVal)}`;
    const citeNetUrl = isParsippany
      ? `https://www.parsippany.net/department/tax-assessor`
      : `https://www.cit-e.net/clifton-nj/cn/taxinquiry_edm/index.cfm?tpid=18705`;
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
            <a href="${mod4Url}" target="_blank" rel="noopener" class="mini-portal-pill county-pill">${countyShort} MOD-IV Query for "${rawVal}" ↗</a>
            <a href="${citeNetUrl}" target="_blank" rel="noopener" class="mini-portal-pill city-pill">${cityLabel} Tax Assessor Portal ↗</a>
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
            <span class="rb-icon">👤</span> <strong>${cityLabel} & Board of Education Staff Records (${matchedStaff.length})</strong>
          </div>
          <div class="result-cards-subgrid">
            ${matchedStaff.slice(0, 6).map(s => {
              const lastName = s.name.split(' ').pop();
              return `
              <div class="result-mini-card">
                <div class="rmc-header">
                  <strong>${s.name}</strong>
                  <span class="rmc-salary">${formatUSDWhole(s.salaryReported || s.salary || 0)}</span>
                </div>
                <div class="rmc-sub">${s.title} • <em>${s.department}</em> (${s.entity || s.employer})</div>
                <div class="rmc-note">${s.notes || ''}</div>
                <div class="rmc-actions">
                  <a href="https://tax1.co.monmouth.nj.us/cgi-bin/m4.cgi?district=${districtCode}&owner=${encodeURIComponent(lastName)}" target="_blank" rel="noopener" class="rmc-link">
                    Check ${countyShort} County Tax Deed for "${lastName}" ↗
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
            <span class="rb-icon">🏡</span> <strong>${cityLabel} Sample Assessment Profiles (${matchedProperties.length} ${matchedProperties.length > 6 ? `— showing first 6` : ''})</strong>
          </div>
          <div class="sample-notice-note" style="font-size: 0.8rem; color: #64748b; margin-bottom: 10px;">
            ℹ️ Representative statistical sample of 1,850 calibrated parcels. For certified individual deed books and tax duplicate records, use the official County MOD-IV link on each card.
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
                  <a href="https://tax1.co.monmouth.nj.us/cgi-bin/m4.cgi?district=${districtCode}&owner=${encodeURIComponent(streetPart)}" target="_blank" rel="noopener" class="rmc-link">
                    Open ${countyShort} MOD-IV Roll for "${streetPart}" ↗
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
          <p>The term <strong>"${rawVal}"</strong> was not found in our curated sample of top administrators or sampled residential properties. Use the official state and county gateways below to search the complete public record:</p>
          <div class="portal-cta-row">
            <a href="${mod4Url}" target="_blank" rel="noopener" class="action-btn-portal">
              Search All ${cityLabel} Deeds in ${countyShort} County MOD-IV for "${rawVal}" ↗
            </a>
            <a href="${citeNetUrl}" target="_blank" rel="noopener" class="action-btn-portal">
              Search ${cityLabel} Tax Assessment Portal ↗
            </a>
          </div>
        </div>
      `;
    }

    html += `</div>`;
    propResult.innerHTML = html;
  }

  if (propBtn) {
    propBtn.onclick = performSearch;
  }

  if (propInput) {
    propInput.onkeydown = (e) => {
      if (e.key === 'Enter') {
        performSearch();
      }
    };

    let debounceTimer;
    propInput.oninput = () => {
      clearTimeout(debounceTimer);
      if (propInput.value.trim().length >= 2) {
        debounceTimer = setTimeout(performSearch, 300);
      } else if (propInput.value.trim().length === 0) {
        propResult.innerHTML = '';
      }
    };
  }

  // OPRA Preview, Target Display, Mailto Link & Copy
  const select = document.getElementById('opra-template-select');
  const preview = document.getElementById('opra-text-preview');
  const copyBtn = document.getElementById('btn-copy-opra');
  const targetEmail = document.getElementById('opra-recipient-email');
  const mailtoBtn = document.getElementById('btn-mailto-opra');

  function updateOpraState() {
    if (!select || !preview) return;
    const activeOpra = cityOpraConfig[currentCity] || cityOpraConfig.clifton;
    const key = select.value;
    const body = activeOpra.templates[key] || '';
    preview.value = body;

    const cityMeta = CITY_REGISTRY[currentCity] || CITY_REGISTRY.clifton;
    const opraMeta = activeOpra.meta[key] || {
      recipientEmail: `clerk@${currentCity}.org`,
      recipientDisplay: `${cityMeta.fullName} Municipal Clerk`,
      subject: 'OPRA Public Records Request'
    };

    if (targetEmail) {
      targetEmail.textContent = opraMeta.recipientDisplay;
    }

    if (mailtoBtn) {
      let mailtoHref = `mailto:${opraMeta.recipientEmail}?subject=${encodeURIComponent(opraMeta.subject)}`;
      if (opraMeta.cc) {
        mailtoHref += `&cc=${encodeURIComponent(opraMeta.cc)}`;
      }
      mailtoHref += `&body=${encodeURIComponent(body)}`;
      mailtoBtn.href = mailtoHref;
    }
  }

  if (select) {
    select.onchange = updateOpraState;
    updateOpraState();
  }

  if (copyBtn && preview) {
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(preview.value).then(() => {
        const orig = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span>✅</span> Copied to Clipboard!';
        setTimeout(() => { copyBtn.innerHTML = orig; }, 2000);
      });
    };
  }
}

// TAB 5: JOINED INTELLIGENCE & CROSS-DATASET REPORTS
function renderIntelligenceReports() {
  const meta = CITY_REGISTRY[currentCity] || CITY_REGISTRY.clifton;
  const isParsippany = currentCity === 'parsippany';

  // 1. Sub-nav toolbar switching
  const navBtns = document.querySelectorAll('.intel-nav-btn');
  const panels = {
    receipt: document.getElementById('intel-report-receipt'),
    homes: document.getElementById('intel-report-homes'),
    balance: document.getElementById('intel-report-balance'),
    vintage: document.getElementById('intel-report-vintage')
  };

  navBtns.forEach(btn => {
    btn.onclick = () => {
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
    };
  });

  // ----------------------------------------------------
  // REPORT 1: ITEMIZED TAX GROCERY RECEIPT
  // ----------------------------------------------------
  const receiptInput = document.getElementById('receipt-assessed-input');
  const presetBtns = document.querySelectorAll('.receipt-quick-presets .preset-btn');
  const receiptItemsBody = document.getElementById('receipt-items-body');
  const copyReceiptBtn = document.getElementById('btn-copy-receipt');

  const receiptSchedule = isParsippany
    ? [
        // PTHSD Schools Group (2.277% total)
        { id: 'sch-teach', category: 'Schools', name: 'PTHSD Classroom Teachers & Instruction (14 Schools)', rate: 0.9108, pct: 25.66, tag: 'PTHSD' },
        { id: 'sch-ben', category: 'Schools', name: 'School Employee SEHBP Health & Pension Benefits', rate: 0.4554, pct: 12.83, tag: 'PTHSD' },
        { id: 'sch-sped', category: 'Schools', name: 'Special Education & Out-of-District Placements', rate: 0.3643, pct: 10.26, tag: 'PTHSD' },
        { id: 'sch-plant', category: 'Schools', name: 'School Facilities, HVAC & Custodial Operations', rate: 0.2277, pct: 6.41, tag: 'PTHSD' },
        { id: 'sch-bus', category: 'Schools', name: 'Student Busing & Transportation (7,120 Students)', rate: 0.1594, pct: 4.49, tag: 'PTHSD' },
        { id: 'sch-admin', category: 'Schools', name: 'Principals, Central Administration & Debt Service', rate: 0.1594, pct: 4.49, tag: 'PTHSD' },

        // Township & Fire Districts Group (0.935% total)
        { id: 'mun-pol', category: 'City', name: 'Parsippany Police Dept (PBA 131) & Public Safety', rate: 0.2525, pct: 7.11, tag: 'TWP' },
        { id: 'mun-ben', category: 'City', name: 'Township Employee SHBP Health & PFRS/PERS Pensions', rate: 0.2338, pct: 6.59, tag: 'TWP' },
        { id: 'mun-dpw', category: 'City', name: 'Public Works (Roads, Snow, Sanitation, Recycling)', rate: 0.1589, pct: 4.48, tag: 'TWP' },
        { id: 'mun-debt', category: 'City', name: 'Township Municipal Bond Principal & Interest', rate: 0.1309, pct: 3.69, tag: 'TWP' },
        { id: 'mun-fire', category: 'City', name: 'Independent Fire Districts (#1–#6) & EMS Support', rate: 0.0841, pct: 2.37, tag: 'FIRE' },
        { id: 'mun-lib', category: 'City', name: 'Parsippany Library System & Open Space Trust', rate: 0.0748, pct: 2.11, tag: 'TWP' },

        // Morris County Group (0.338% total)
        { id: 'cty-rds', category: 'County', name: 'Morris County Roads, Bridges & Engineering', rate: 0.0946, pct: 2.66, tag: 'MORRIS' },
        { id: 'cty-shrf', category: 'County', name: 'Morris County Sheriff, Correctional & Courts', rate: 0.0845, pct: 2.38, tag: 'MORRIS' },
        { id: 'cty-park', category: 'County', name: 'Morris County Park Commission & County College (CCM)', rate: 0.0811, pct: 2.28, tag: 'MORRIS' },
        { id: 'cty-soc', category: 'County', name: 'County Human Services, Health & Open Space Trust', rate: 0.0778, pct: 2.19, tag: 'MORRIS' }
      ]
    : [
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
    const totalRate = meta.rateNum;
    const totalTax = (assessed / 100) * totalRate;
    const monthlyTax = totalTax / 12;
    const dailyTax = totalTax / 365;

    const schoolTax = (assessed / 100) * (taxData?.certifiedSchoolRate || (meta.rateNum * (parseFloat(meta.schoolsShare)/100)));
    const muniTax = (assessed / 100) * (taxData?.certifiedMunicipalRate || (meta.rateNum * (parseFloat(meta.muniShare)/100)));
    const countyTax = (assessed / 100) * (taxData?.certifiedCountyRate || (meta.rateNum * (parseFloat(meta.countyShare)/100)));

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
      const schoolRate = taxData?.breakdown?.find(b => b.entity?.toLowerCase().includes('school'))?.rate || (meta.rateNum * 0.6);
      const muniRate = taxData?.breakdown?.find(b => b.entity?.toLowerCase().includes('muni') || b.entity?.toLowerCase().includes('city') || b.entity?.toLowerCase().includes('town') || b.entity?.toLowerCase().includes('borough'))?.rate || (meta.rateNum * 0.25);
      const teacherCost = (assessed / 100) * (schoolRate * 0.55);
      const combinedBen = (assessed / 100) * (meta.rateNum * 0.16);
      const policeCost = (assessed / 100) * (muniRate * 0.35);
      takeawaysList.innerHTML = `
        <li><strong>Classroom Instruction:</strong> You pay <strong>${formatUSD(teacherCost)}/year</strong> (${formatUSD(teacherCost/12)}/mo) directly to ${meta.schoolDistrictShort} teachers and educational materials.</li>
        <li><strong>Health & Pensions:</strong> Public employee benefits across schools and local government cost you <strong>${formatUSD(combinedBen)}/year</strong> (${formatUSD(combinedBen/12)}/mo).</li>
        <li><strong>Police & Public Safety:</strong> ${meta.name} public safety accounts for <strong>${formatUSD(policeCost)}/year</strong> (${formatUSD(policeCost/12)}/mo).</li>
        <li><strong>Daily Rate:</strong> Living in ${meta.fullName} costs <strong>${formatUSD(dailyTax)} per 24 hours</strong> in municipal, school, and county taxes.</li>
      `;
    }
  }

  // Preset button clicks
  presetBtns.forEach(p => {
    p.onclick = () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      p.classList.add('active');
      const val = p.getAttribute('data-val');
      if (receiptInput) {
        receiptInput.value = val;
        updateReceipt();
      }
    };
  });

  if (receiptInput) {
    receiptInput.oninput = () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      updateReceipt();
    };
  }

  if (copyReceiptBtn) {
    copyReceiptBtn.onclick = () => {
      const defaultAssessed = meta.sliderDefault || (taxData?.averageAssessment) || 200000;
      const assessed = parseFloat(receiptInput?.value) || defaultAssessed;
      const rateUsed = meta.rateNum || taxData?.certifiedTotalRate || 3.0;
      const totalTax = (assessed / 100) * rateUsed;
      let text = `========================================\n`;
      text += `    ${meta.fullName.toUpperCase()} TAX RECEIPT\n`;
      text += `========================================\n`;
      text += `ASSESSMENT: ${formatUSD(assessed)}\n`;
      text += `2026 CERTIFIED RATE: ${rateUsed.toFixed(3)}%\n`;
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
      text += `Source: https://www.mytownlens.com/?city=${currentCity}\n`;

      navigator.clipboard.writeText(text).then(() => {
        const orig = copyReceiptBtn.innerHTML;
        copyReceiptBtn.innerHTML = `<span>✅</span> Copied Plaintext Receipt!`;
        setTimeout(() => { copyReceiptBtn.innerHTML = orig; }, 2200);
      });
    };
  }

  updateReceipt();

  // ----------------------------------------------------
  // REPORT 2: HOMES TO FUND SALARIES EQUIVALENCY
  // ----------------------------------------------------
  const homesTableBody = document.getElementById('homes-table-body');
  const homesSortSelect = document.getElementById('homes-sort-select');

  const benchAssessed = meta.sliderDefault || (taxData?.averageAssessment) || 200000;
  const schoolRate = taxData?.certifiedSchoolRate || (meta.rateNum * (parseFloat(meta.schoolsShare || 50)/100));
  const muniRate = taxData?.certifiedMunicipalRate || (meta.rateNum * (parseFloat(meta.muniShare || 35)/100));
  const benchSchoolTax = (benchAssessed / 100) * schoolRate;
  const benchCityTax = (benchAssessed / 100) * muniRate;

  function renderHomesTable() {
    if (!homesTableBody || !staffData) return;
    const activeEntityBtn = document.querySelector('#homes-entity-filters .filter-pill-btn.active');
    const entityFilter = activeEntityBtn ? activeEntityBtn.getAttribute('data-entity') : 'all';
    const sortVal = homesSortSelect ? homesSortSelect.value : 'homes-desc';

    let rawList = staffData.staff ? staffData.staff : staffData;
    const getSalary = s => (s.salaryReported || s.baseSalary || 0);
    let list = rawList.filter(s => getSalary(s) > 0);

    if (entityFilter !== 'all') {
      if (entityFilter === 'BOE' || entityFilter === 'school' || /school|board of education|boe/i.test(entityFilter)) {
        list = list.filter(s => /school|board of education|boe|pthsd|msd/i.test(s.entity || ''));
      } else if (entityFilter === 'MUNI' || entityFilter === 'city' || /city|town|township|borough|municipal/i.test(entityFilter)) {
        list = list.filter(s => !/school|board of education|boe|pthsd|msd/i.test(s.entity || ''));
      } else {
        list = list.filter(s => s.entity === entityFilter);
      }
    }

    list = list.map(s => {
      const isSchool = /school|board of education|boe|pthsd|msd/i.test(s.entity || '');
      const annualTaxPerHome = isSchool ? benchSchoolTax : benchCityTax;
      const salary = getSalary(s);
      const homesRequired = annualTaxPerHome > 0 ? (salary / annualTaxPerHome) : 0;
      return {
        ...s,
        salary,
        isSchool,
        annualTaxPerHome,
        homesRequired
      };
    });

    if (sortVal === 'homes-desc') {
      list.sort((a, b) => b.homesRequired - a.homesRequired);
    } else if (sortVal === 'salary-desc') {
      list.sort((a, b) => b.salary - a.salary);
    } else if (sortVal === 'name-asc') {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    if (list.length === 0) {
      homesTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 24px; color: var(--text-subtle);">No matching positions found for this filter.</td></tr>`;
      return;
    }

    homesTableBody.innerHTML = list.map(s => {
      const entityClass = s.isSchool ? 'badge-school' : 'badge-city';
      const entityTaxRate = s.isSchool
        ? `${schoolRate.toFixed(3)}% (${formatUSDWhole(benchSchoolTax)}/home)`
        : `${muniRate.toFixed(3)}% (${formatUSDWhole(benchCityTax)}/home)`;
      const entityLabel = s.isSchool ? `${meta.schoolDistrictShort || 'School'} Tax` : `${meta.name} Municipal Tax`;
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
            <span class="salary-highlight">${formatUSDWhole(s.salary)}</span>
            <div class="table-subtext">${s.type || 'Annual Salary'}</div>
          </td>
          <td>
            <code>${entityTaxRate}</code>
          </td>
          <td>
            <div class="homes-count-badge">
              <span class="homes-number">${homesCountFormatted}</span>
              <span class="homes-text">${meta.name} Homes</span>
            </div>
            <div class="homes-progress-bar">
              <div class="homes-progress-fill ${s.isSchool ? 'fill-school' : 'fill-city'}" style="width: ${Math.min(100, (s.homesRequired / 65) * 100)}%;"></div>
            </div>
          </td>
          <td>
            <span class="homes-context-desc">
              Requires 100% of the annual ${entityLabel} check from <strong>${Math.round(s.homesRequired)}</strong> average households (${meta.avgAssessed} assessed).
            </span>
          </td>
        </tr>
      `;
    }).join('');
  }

  const homesFilterContainer = document.getElementById('homes-entity-filters');
  if (homesFilterContainer) {
    homesFilterContainer.onclick = (e) => {
      const btn = e.target.closest('.filter-pill-btn');
      if (!btn) return;
      homesFilterContainer.querySelectorAll('.filter-pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderHomesTable();
    };
  }

  if (homesSortSelect) {
    homesSortSelect.onchange = renderHomesTable;
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
    const perPupilCost = boeBudgetData?.perPupilSpending || (isParsippany ? 23180 : 22450);
    const totalLevy = isParsippany ? 161990000 : 161850000;

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
              <span class="bc-stat-sub">${z.districtStudentsPercent}% of ${meta.schoolDistrictShort} total</span>
            </div>
            <div class="bc-stat">
              <span class="bc-stat-lbl">School Taxes Paid</span>
              <span class="bc-stat-val ${isDonor ? 'val-donor' : ''}">${formatUSDWhole(schoolTaxesEst)}</span>
              <span class="bc-stat-sub">${z.residentialTaxSharePaid}% of local levy</span>
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
      { key: 'Pre-1940', title: isParsippany ? 'Pre-1940 (Mount Tabor & Lake Cottages)' : 'Pre-1940 (Historic Industrial)', filter: p => p.yearBuilt < 1940 },
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
              <button class="action-btn-sm" data-jump-tab="tab-calculator" onclick="loadPropertyToCalculator(${p.assessedTotal});">
                Calculate ➔
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }

    vintageFilterBtns.forEach(btn => {
      btn.onclick = () => {
        vintageFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const key = btn.getAttribute('data-vintage');
        renderVintageTable(key);
      };
    });

    renderVintageTable('all');
  }

  renderVintageAnalysis();
}

// TAB 6: COMMERCIAL RATABLES & PILOT TAX SHIFT
function renderCommercialPilot() {
  if (!commercialPilotData) return;

  const meta = CITY_REGISTRY[currentCity] || CITY_REGISTRY.clifton;
  const stdRateLabel = meta.certifiedTaxRate;
  const schoolShareLabel = `${meta.schoolDistrictShort} (${meta.schoolsShare})`;
  const muniShareLabel = `${meta.name} Municipal (${meta.muniShare})`;
  const countyShareLabel = `${meta.countyShort} (${meta.countyShare})`;
  const schoolFooterPct = Math.round(parseFloat(meta.schoolsShare)) + '%';
  const pilotSchoolLabel = `${meta.schoolDistrictShort} (0.0%)`;
  const pilotMuniLabel = `${meta.fullName} General Fund (95.0%)`;
  const pilotCountyLabel = `${meta.countyShort} Remittance (5.0%)`;
  const perPupilCostLabel = `${meta.name}'s public schools spending`;
  const homeownerLabel = `${meta.name} homeowners`;

  // 1. Ratable Shift Timeline
  const timelineContainer = document.getElementById('ratable-shift-timeline');
  if (timelineContainer && commercialPilotData.ratableShift?.historicalTrend) {
    timelineContainer.innerHTML = commercialPilotData.ratableShift.historicalTrend.map(t => {
      const isCurrent = t.year === 2026;
      return `
        <div class="rst-row ${isCurrent ? 'rst-current' : ''}">
          <div class="rst-year-badge">
            <strong>${t.year}</strong>
            ${isCurrent ? '<span class="pill-current">CURRENT ROLL</span>' : ''}
          </div>
          <div class="rst-bars-container">
            <div class="rst-bar-split">
              <div class="rst-bar-res" style="width: ${t.residentialShare}%;">
                <span>Residential ${t.residentialShare}%</span>
              </div>
              <div class="rst-bar-comm" style="width: ${t.commercialIndustrialShare}%;">
                <span>Commercial/Ind ${t.commercialIndustrialShare}%</span>
              </div>
            </div>
            <div class="rst-notes">${t.notes}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  // 2. Interactive PILOT Simulator
  const projectSelect = document.getElementById('pilot-project-select');
  const comparisonContainer = document.getElementById('pilot-comparison-container');
  const impactBanner = document.getElementById('pilot-school-impact-banner');
  const projects = commercialPilotData.pilotMechanism?.sampleProjects || [];

  if (projectSelect && projects.length) {
    projectSelect.innerHTML = projects.map(p => `
      <option value="${p.id}">${p.name} (${p.units} Units • ${formatUSDWhole(p.estimatedMarketValue)})</option>
    `).join('');

    function updatePilotComparison(projectId) {
      const proj = projects.find(p => p.id === projectId) || projects[0];
      if (!comparisonContainer || !proj) return;

      comparisonContainer.innerHTML = `
        <div class="pilot-col pilot-col-standard">
          <div class="p-col-head">
            <span class="p-col-tag">STANDARD AD VALOREM TAXES</span>
            <h4>Standard Certified Property Tax (${stdRateLabel})</h4>
            <div class="p-col-total font-mono">${formatUSDWhole(proj.standardTotalTax)} <small>/ year</small></div>
          </div>
          <div class="p-col-breakdown">
            <div class="p-row">
              <span class="p-label">${schoolShareLabel}:</span>
              <strong class="p-val-school font-mono">${formatUSDWhole(proj.standardSchoolShare)}</strong>
            </div>
            <div class="p-row">
              <span class="p-label">${muniShareLabel}:</span>
              <strong class="p-val-city font-mono">${formatUSDWhole(proj.standardCityShare)}</strong>
            </div>
            <div class="p-row">
              <span class="p-label">${countyShareLabel}:</span>
              <strong class="p-val-county font-mono">${formatUSDWhole(proj.standardCountyShare)}</strong>
            </div>
          </div>
          <div class="p-col-footer standard-footer">
            <span>✓ School district receives full ${schoolFooterPct} tax support to fund classroom seats.</span>
          </div>
        </div>

        <div class="pilot-col pilot-col-abatement">
          <div class="p-col-head">
            <span class="p-col-tag pilot-tag">PILOT TAX ABATEMENT (LONG-TERM EXEMPTION)</span>
            <h4>Annual Service Charge (PILOT)</h4>
            <div class="p-col-total font-mono" style="color: #059669;">${formatUSDWhole(proj.pilotServiceCharge)} <small>/ year</small></div>
          </div>
          <div class="p-col-breakdown">
            <div class="p-row zero-row">
              <span class="p-label">${pilotSchoolLabel}:</span>
              <strong class="p-val-zero font-mono">$0.00 (EXCLUDED)</strong>
            </div>
            <div class="p-row">
              <span class="p-label">${pilotMuniLabel}:</span>
              <strong class="p-val-city font-mono" style="color: #059669;">${formatUSDWhole(proj.pilotCityKeeps)}</strong>
            </div>
            <div class="p-row">
              <span class="p-label">${pilotCountyLabel}:</span>
              <strong class="p-val-county font-mono">${formatUSDWhole(proj.pilotCountyGets)}</strong>
            </div>
          </div>
          <div class="p-col-footer pilot-footer">
            <strong>Developer Savings: ${formatUSDWhole(proj.developerAnnualSavings)} / yr</strong>
            <small>${meta.fullName} retains +${formatUSDWhole(proj.pilotCityKeeps - proj.standardCityShare)} more than standard taxes while schools receive zero.</small>
          </div>
        </div>
      `;

      if (impactBanner) {
        impactBanner.innerHTML = `
          <div class="psib-icon">⚠️</div>
          <div class="psib-content">
            <h4>The Hidden School Shift for This Development:</h4>
            <p>
              This <strong>${proj.units}-unit complex</strong> generates an estimated <strong>${proj.estimatedDistrictStudents} school-age children</strong>.
              At ${perPupilCostLabel}, educating these students costs <strong>${formatUSDWhole(proj.annualDistrictCostGenerated)} every single year</strong>.
            </p>
            <div class="psib-bottom">
              <span class="psib-pill">Schools receive from Developer: $0.00</span>
              <span class="psib-pill danger">Cost absorbed by existing ${homeownerLabel}: +${formatUSDWhole(proj.homeownerBurdenAbsorbed)} / yr</span>
            </div>
          </div>
        `;
      }
    }

    projectSelect.onchange = (e) => {
      updatePilotComparison(e.target.value);
    };

    updatePilotComparison(projects[0].id);
  }

  // 3. Top Commercial Ratables Table
  const commBody = document.getElementById('commercial-ratables-body');
  const ratables = commercialPilotData.taxAppeals?.topCommercialRatables || [];
  if (commBody && ratables.length) {
    commBody.innerHTML = ratables.map(r => {
      let riskClass = 'risk-low';
      if (r.appealRisk.includes('High')) riskClass = 'risk-high';
      else if (r.appealRisk.includes('Moderate')) riskClass = 'risk-med';

      return `
        <tr>
          <td>
            <strong>${r.name}</strong>
          </td>
          <td>${r.location}</td>
          <td><small>${r.type}</small></td>
          <td><strong>${formatUSDWhole(r.assessedValue)}</strong></td>
          <td>${formatUSDWhole(r.marketValueEst)}</td>
          <td><strong class="salary-highlight font-mono">${formatUSDWhole(r.annualTaxPaid)}</strong></td>
          <td>
            <span class="appeal-risk-badge ${riskClass}">${r.appealRisk}</span>
          </td>
        </tr>
      `;
    }).join('');
  }

  // 4. Taxpayer Policy Solutions
  const solutionsContainer = document.getElementById('pilot-solutions-container');
  const solutions = commercialPilotData.taxpayerSolutions || [];
  if (solutionsContainer && solutions.length) {
    solutionsContainer.innerHTML = solutions.map((s, idx) => `
      <div class="solution-card">
        <div class="sol-num">0${idx + 1}</div>
        <h4>${s.title}</h4>
        <p class="sol-proposal">${s.proposal}</p>
        <div class="sol-benefit">
          <strong>Taxpayer Benefit:</strong> ${s.benefit}
        </div>
      </div>
    `).join('');
  }
}

// ==========================================================================
// TAB 7: WHAT-IF FAIR TAX BURDEN & EQUALIZATION ENGINE
// ==========================================================================
function renderFairTaxEngine() {
  if (!fairTaxData) return;

  const meta = CITY_REGISTRY[currentCity] || CITY_REGISTRY.clifton;
  const isParsippany = currentCity === 'parsippany';
  const baseline = fairTaxData.metadata.certifiedBaseline;
  const inequities = fairTaxData.fairnessDiagnosis.coreInequities || [];
  const presets = fairTaxData.presetScenarios || [];
  const sampleProfiles = fairTaxData.sampleHomeProfiles || [];
  const roadmapSteps = fairTaxData.policyRoadmap || [];
  const neighborhoodData = fairTaxData.neighborhoodEquityImpact || [];

  const baseCommShare = baseline.commercialLevySharePct || (isParsippany ? 27.2 : 23.8);
  const totalLevyM = (baseline.totalTaxLevy || (isParsippany ? 262181700 : 374150000)) / 1000000;
  const levyPerPctPointM = totalLevyM / 100.0;
  const totalPilotM = (baseline.annualPilotRevenueCollected || (isParsippany ? 9850000 : 4820000)) / 1000000;
  const baselineResLevyM = (baseline.residentialLevyTotal || (isParsippany ? 190868278 : 285105000)) / 1000000;
  const totalParcels = baseline.totalResidentialParcels || (isParsippany ? 15430 : 22965);
  const eqRatio = baseline.equalizationRatio || (isParsippany ? 0.666 : 0.403);
  const baselineRate = baseline.certifiedTaxRateAssessed || (isParsippany ? 3.550 : 6.527);
  const baselineMarketRate = baseline.certifiedTaxRateMarket || (isParsippany ? 2.364 : 2.630);
  const defaultMarketVal = baseline.averageResidentialMarketValue || (isParsippany ? 525000 : 475000);
  const defaultAssessedVal = baseline.averageResidentialAssessment || (isParsippany ? 348500 : 191425);
  const defaultIncome = isParsippany ? 124850 : 95000;
  const defaultZip = isParsippany ? '07054' : '07012';

  // 1. Render Inequities Grid
  const ineqContainer = document.getElementById('fair-inequities-grid');
  if (ineqContainer && inequities.length) {
    ineqContainer.innerHTML = inequities.map(item => {
      let sevClass = 'medium';
      if (item.severity === 'Critical') sevClass = 'critical';
      else if (item.severity === 'High') sevClass = 'high';

      return `
        <div class="inequity-card">
          <div class="inequity-header">
            <span class="inequity-metric">${item.metric}</span>
            <span class="inequity-severity ${sevClass}">${item.severity}</span>
          </div>
          <h4>${item.title}</h4>
          <p class="inequity-desc">${item.description}</p>
          <div class="inequity-remedy">
            <strong>Actionable Remedy:</strong> ${item.remedy}
          </div>
        </div>
      `;
    }).join('');
  }

  // 2. Render Scenario Presets
  const presetsContainer = document.getElementById('scenario-presets-container');
  const activeCallout = document.getElementById('active-scenario-callout');

  function renderScenarioCallout(scenario) {
    if (!activeCallout || !scenario) return;
    activeCallout.innerHTML = `
      <div class="sdc-summary">
        <strong>${scenario.name}</strong>
        <p>${scenario.summary}</p>
      </div>
      <div class="sdc-impact winners">
        <strong>Direct Winners:</strong>
        ${scenario.winners}
      </div>
      <div class="sdc-impact losers">
        <strong>Fair Share Contributors:</strong>
        ${scenario.losers}
      </div>
    `;
  }

  // Default active scenario: Unified Blueprint
  let currentPresetId = 'unified_blueprint';

  if (presetsContainer && presets.length) {
    presetsContainer.innerHTML = presets.map(p => `
      <button class="preset-pill-btn ${p.id === currentPresetId ? 'active' : ''}" data-preset-id="${p.id}">
        <span class="pill-badge ${p.badgeClass}">${p.badge}</span>
        <span>${p.name}</span>
      </button>
    `).join('');

    const initPreset = presets.find(p => p.id === currentPresetId) || presets[0];
    renderScenarioCallout(initPreset);
  }

  // 3. Sandbox Inputs & Controls
  const inputMarket = document.getElementById('wif-market-val');
  const inputAssessed = document.getElementById('wif-assessed-val');
  const inputIncome = document.getElementById('wif-income');
  const selectZip = document.getElementById('wif-zip');
  const selectResType = document.getElementById('wif-resident-type');

  const leverCommercial = document.getElementById('wif-lever-commercial');
  const valCommercial = document.getElementById('wif-val-commercial');
  const badgeCommercial = document.getElementById('wif-badge-commercial');

  const leverPilot = document.getElementById('wif-lever-pilot');
  const valPilot = document.getElementById('wif-val-pilot');
  const badgePilot = document.getElementById('wif-badge-pilot');

  const toggleReval = document.getElementById('wif-toggle-reval');

  const selectCircuit = document.getElementById('wif-select-circuit');
  const badgeCircuit = document.getElementById('wif-badge-circuit');

  const leverUtility = document.getElementById('wif-lever-utility');
  const valUtility = document.getElementById('wif-val-utility');
  const badgeUtility = document.getElementById('wif-badge-utility');

  const btnReset = document.getElementById('btn-reset-sandbox');

  // Results DOM elements
  const resEquityBadge = document.getElementById('res-equity-badge');
  const resLabelCurrent = document.getElementById('res-label-current');
  const resCurrentBill = document.getElementById('res-current-bill');
  const resCurrentRate = document.getElementById('res-current-rate');
  const resLabelProjected = document.getElementById('res-label-projected');
  const resProjectedBill = document.getElementById('res-projected-bill');
  const resProjectedRate = document.getElementById('res-projected-rate');
  const resLabelSavings = document.getElementById('res-label-savings');
  const resAnnualSavings = document.getElementById('res-annual-savings');
  const resSavingsPct = document.getElementById('res-savings-pct');
  const resLabelMonthly = document.getElementById('res-label-monthly');
  const resMonthlySavings = document.getElementById('res-monthly-savings');
  const resSubMonthly = document.getElementById('res-sub-monthly');

  const vcBeforeLabel = document.getElementById('vc-before-label');
  const vcAfterLabel = document.getElementById('vc-after-label');
  const vcAfterBar = document.getElementById('vc-after-bar');
  const vcNarrative = document.getElementById('vc-narrative');
  const esmScoreVal = document.getElementById('esm-score-val');
  const esmFillBar = document.getElementById('esm-fill-bar');
  const destSplitBars = document.getElementById('dest-split-bars');
  const destLegend = document.getElementById('dest-legend');
  const neighborhoodTbody = document.getElementById('neighborhood-equity-tbody');

  // Auto-sync Assessment <-> Market Value
  if (inputMarket && inputAssessed) {
    inputMarket.oninput = () => {
      const mVal = parseFloat(inputMarket.value) || 0;
      inputAssessed.value = Math.round(mVal * eqRatio);
      runSimulation();
    };

    inputAssessed.oninput = () => {
      const aVal = parseFloat(inputAssessed.value) || 0;
      if (eqRatio > 0) {
        inputMarket.value = Math.round(aVal / eqRatio);
      }
      runSimulation();
    };
  }

  // Core Simulation Function
  function runSimulation() {
    const marketVal = parseFloat(inputMarket?.value) || defaultMarketVal;
    const assessedVal = parseFloat(inputAssessed?.value) || defaultAssessedVal;
    const income = parseFloat(inputIncome?.value) || defaultIncome;
    const zipCode = selectZip?.value || defaultZip;
    const resType = selectResType?.value || 'general';

    const commShare = parseFloat(leverCommercial?.value) || 32.0;
    const pilotShare = parseFloat(leverPilot?.value) || 50;
    const revalOn = toggleReval ? toggleReval.checked : true;
    const circuitCap = selectCircuit?.value || '8';
    const utilityUnbundle = parseFloat(leverUtility?.value) || 7.5;

    // Update Slider Readout Labels
    if (valCommercial) valCommercial.textContent = `${commShare.toFixed(1)}%`;
    if (badgeCommercial) {
      const shiftDiff = (commShare - baseCommShare) * levyPerPctPointM;
      badgeCommercial.textContent = shiftDiff >= 0 
        ? `+$${shiftDiff.toFixed(1)}M Commercial Shift` 
        : `-$${Math.abs(shiftDiff).toFixed(1)}M Deficit`;
    }

    if (valPilot) valPilot.textContent = `${pilotShare}%`;
    if (badgePilot) {
      const pilotSchoolM = (pilotShare / 100) * totalPilotM;
      badgePilot.textContent = `+$${pilotSchoolM.toFixed(2)}M to BOE`;
    }

    if (valUtility) valUtility.textContent = `$${utilityUnbundle.toFixed(1)}M`;
    if (badgeUtility) {
      const perHomeRelief = Math.round((utilityUnbundle * 1000000) / totalParcels);
      badgeUtility.textContent = `-$${perHomeRelief}/yr Residential Relief`;
    }

    if (badgeCircuit) {
      badgeCircuit.textContent = circuitCap === 'none' ? 'No Income Cap' : `Cap @ ${circuitCap}% Income`;
    }

    // 1. Baseline Calculation
    const currentBill = (assessedVal / 100.0) * baselineRate;

    // 2. Relief Calculation (Shifting burden off residential)
    const commReliefM = Math.max(0, (commShare - baseCommShare) * levyPerPctPointM);
    const pilotReliefM = (pilotShare / 100.0) * totalPilotM;
    const utilityReliefM = utilityUnbundle;
    const totalReliefM = commReliefM + pilotReliefM + utilityReliefM;

    const reductionFactor = Math.min(0.42, totalReliefM / baselineResLevyM);

    // 3. Raw Tax Bill
    let rawBill = 0;
    let effectiveRateText = '';

    if (revalOn) {
      const newMarketRate = baselineMarketRate * (1.0 - reductionFactor);
      rawBill = (marketVal / 100.0) * newMarketRate;
      effectiveRateText = `${newMarketRate.toFixed(3)}% on Market Value`;
    } else {
      const newAssessedRate = baselineRate * (1.0 - reductionFactor);
      rawBill = (assessedVal / 100.0) * newAssessedRate;
      effectiveRateText = `${newAssessedRate.toFixed(3)}% on Assessed Value`;
    }

    // 4. Circuit Breaker / Ability to Pay Cap
    let circuitBreakerApplied = false;
    let cappedBill = rawBill;

    if (circuitCap !== 'none' && income > 0 && income <= 130000) {
      const capPct = parseFloat(circuitCap);
      const maxAllowed = income * (capPct / 100.0);
      if (rawBill > maxAllowed) {
        cappedBill = maxAllowed;
        circuitBreakerApplied = true;
      }
    }

    // Senior Additional Safety Cap
    if (resType === 'senior' && income <= 70000 && income > 0) {
      const seniorMax = income * 0.06;
      if (cappedBill > seniorMax) {
        cappedBill = seniorMax;
        circuitBreakerApplied = true;
      }
    }

    const whatIfBill = Math.max(650, cappedBill);
    const annualSavings = currentBill - whatIfBill;
    const monthlySavings = annualSavings / 12.0;
    const savingsPct = currentBill > 0 ? (annualSavings / currentBill) * 100.0 : 0;

    // 5. Equity Score Calculation (0 to 100)
    let score = isParsippany ? 42 : 38;
    score += Math.min(24, Math.max(0, ((commShare - baseCommShare) / (40.0 - baseCommShare)) * 24));
    score += Math.min(16, (pilotShare / 60.0) * 16);
    if (revalOn) score += 18;
    if (circuitCap === '8' || circuitCap === '6') score += 14;
    else if (circuitCap === '10') score += 10;
    score += Math.min(8, (utilityUnbundle / 15.0) * 8);

    score = Math.round(Math.min(98, Math.max(38, score)));

    // Update Results Display Tailored to Resident Type
    if (resType === 'renter') {
      const embeddedCurrent = Math.round(currentBill * 0.28);
      const embeddedWhatIf = Math.round(whatIfBill * 0.28);
      const renterSavings = Math.round(annualSavings * 0.28);
      const renterMonthly = Math.round((annualSavings * 0.28) / 12.0);

      if (resLabelCurrent) resLabelCurrent.textContent = 'Est. Embedded Rent Tax';
      if (resCurrentBill) resCurrentBill.textContent = formatUSDWhole(embeddedCurrent);
      if (resCurrentRate) resCurrentRate.textContent = 'Taxes embedded in monthly rent lease (~28%)';

      if (resLabelProjected) resLabelProjected.textContent = 'What-If Embedded Rent Tax';
      if (resProjectedBill) resProjectedBill.textContent = formatUSDWhole(embeddedWhatIf);
      if (resProjectedRate) resProjectedRate.textContent = effectiveRateText;

      if (resLabelSavings) resLabelSavings.textContent = 'Est. Annual Rent Relief';
      if (resAnnualSavings) {
        resAnnualSavings.textContent = `-${formatUSDWhole(renterSavings)} / yr`;
        resAnnualSavings.className = 'kpi-value savings-val text-success';
      }

      if (resSavingsPct) {
        resSavingsPct.textContent = `-${savingsPct.toFixed(1)}% landlord cost reduction`;
        resSavingsPct.style.color = '#15803d';
      }

      if (resLabelMonthly) resLabelMonthly.textContent = 'Est. Monthly Rent Moderation';
      if (resMonthlySavings) {
        resMonthlySavings.textContent = `-${formatUSDWhole(renterMonthly)} / mo`;
        resMonthlySavings.className = 'kpi-value monthly-val text-info';
      }
      if (resSubMonthly) resSubMonthly.textContent = 'Estimated lease pass-through relief';

      if (vcBeforeLabel) vcBeforeLabel.textContent = formatUSDWhole(embeddedCurrent);
      if (vcAfterLabel) vcAfterLabel.textContent = formatUSDWhole(embeddedWhatIf);

      if (vcNarrative) {
        vcNarrative.innerHTML = `As a renter in <strong>${zipCode}</strong>, your monthly lease includes roughly $300 to $450 in embedded property taxes. Under this reform, your building's annual tax burden drops, creating room for <strong>-${formatUSDWhole(renterMonthly)}/month in rent moderation</strong> (-${formatUSDWhole(renterSavings)}/year)!`;
      }
    } else {
      // Homeowner / Senior / Multi-family
      if (resType === 'senior') {
        if (resLabelCurrent) resLabelCurrent.textContent = 'Current Property Tax Bill';
        if (resLabelProjected) resLabelProjected.textContent = 'Senior Protected Tax Bill';
        if (resLabelSavings) resLabelSavings.textContent = 'Senior Net Tax Relief';
        if (resLabelMonthly) resLabelMonthly.textContent = 'Monthly Escrow Savings';
        if (resSubMonthly) resSubMonthly.textContent = 'Protected by 6.0% retirement income cap';
      } else if (resType === 'multifamily') {
        if (resLabelCurrent) resLabelCurrent.textContent = 'Current Multi-Family Tax Bill';
        if (resLabelProjected) resLabelProjected.textContent = 'What-If Building Tax Bill';
        if (resLabelSavings) resLabelSavings.textContent = 'Total Building Tax Relief';
        if (resLabelMonthly) resLabelMonthly.textContent = 'Monthly Operating Relief';
        if (resSubMonthly) resSubMonthly.textContent = 'Shared across owner + rental units';
      } else {
        if (resLabelCurrent) resLabelCurrent.textContent = 'Current 2026 Tax Bill';
        if (resLabelProjected) resLabelProjected.textContent = 'What-If Projected Tax Bill';
        if (resLabelSavings) resLabelSavings.textContent = 'Your Net Annual Tax Relief';
        if (resLabelMonthly) resLabelMonthly.textContent = 'Monthly Pocketbook Impact';
        if (resSubMonthly) resSubMonthly.textContent = 'Direct monthly escrow reduction';
      }

      if (resCurrentBill) resCurrentBill.textContent = formatUSDWhole(currentBill);
      if (resCurrentRate) resCurrentRate.textContent = `${baselineRate.toFixed(3)}% on ${formatUSDWhole(assessedVal)} assessment`;

      if (resProjectedBill) resProjectedBill.textContent = formatUSDWhole(whatIfBill);
      if (resProjectedRate) resProjectedRate.textContent = effectiveRateText;

      if (resAnnualSavings) {
        if (annualSavings >= 0) {
          resAnnualSavings.textContent = `-${formatUSDWhole(annualSavings)} / yr`;
          resAnnualSavings.className = 'kpi-value savings-val text-success';
        } else {
          resAnnualSavings.textContent = `+${formatUSDWhole(Math.abs(annualSavings))} / yr`;
          resAnnualSavings.className = 'kpi-value savings-val text-danger';
        }
      }

      if (resSavingsPct) {
        if (savingsPct >= 0) {
          resSavingsPct.textContent = `-${savingsPct.toFixed(1)}% tax reduction`;
          resSavingsPct.style.color = '#15803d';
        } else {
          resSavingsPct.textContent = `+${Math.abs(savingsPct).toFixed(1)}% adjustment`;
          resSavingsPct.style.color = '#b91c1c';
        }
      }

      if (resMonthlySavings) {
        if (monthlySavings >= 0) {
          resMonthlySavings.textContent = `-${formatUSDWhole(monthlySavings)} / mo`;
          resMonthlySavings.className = 'kpi-value monthly-val text-info';
        } else {
          resMonthlySavings.textContent = `+${formatUSDWhole(Math.abs(monthlySavings))} / mo`;
          resMonthlySavings.className = 'kpi-value monthly-val text-danger';
        }
      }

      if (vcBeforeLabel) vcBeforeLabel.textContent = formatUSDWhole(currentBill);
      if (vcAfterLabel) vcAfterLabel.textContent = formatUSDWhole(whatIfBill);

      if (vcNarrative) {
        if (annualSavings > 0) {
          let circuitNote = circuitBreakerApplied ? ' (including targeted income circuit-breaker relief)' : '';
          vcNarrative.innerHTML = `You save <strong>${formatUSDWhole(annualSavings)} per year</strong> (-${formatUSDWhole(monthlySavings)}/month)${circuitNote} through equalized market assessments and restoring corporate/PILOT contributions.`;
        } else if (annualSavings === 0) {
          vcNarrative.innerHTML = `Under the Status Quo, your tax bill remains unchanged at <strong>${formatUSDWhole(currentBill)}</strong>, continuing the residential tax burden shift.`;
        } else {
          vcNarrative.innerHTML = `Your property would see an adjustment of <strong>+${formatUSDWhole(Math.abs(annualSavings))}/year</strong> to eliminate assessment lag that favored this parcel relative to municipal market value.`;
        }
      }
    }

    // Comparison Visual Bar
    if (vcAfterBar) {
      const pctOfCurrent = currentBill > 0 ? Math.min(100, Math.max(10, (whatIfBill / currentBill) * 100)) : 100;
      vcAfterBar.style.width = `${pctOfCurrent.toFixed(1)}%`;
      if (pctOfCurrent > 95) vcAfterBar.style.background = '#f59e0b';
      else vcAfterBar.style.background = 'linear-gradient(90deg, #10b981, #059669)';
    }

    // Equity Meter
    if (esmScoreVal) esmScoreVal.textContent = `${score} / 100`;
    if (esmFillBar) {
      esmFillBar.style.width = `${score}%`;
      if (score >= 90) esmFillBar.style.background = '#10b981';
      else if (score >= 75) esmFillBar.style.background = '#3b82f6';
      else if (score >= 60) esmFillBar.style.background = '#f59e0b';
      else esmFillBar.style.background = '#ef4444';
    }

    if (resEquityBadge) {
      if (score >= 90) {
        resEquityBadge.textContent = `★ Optimal Balance (${score}/100)`;
        resEquityBadge.style.background = '#dcfce7';
        resEquityBadge.style.color = '#15803d';
        resEquityBadge.style.borderColor = '#86efac';
      } else if (score >= 75) {
        resEquityBadge.textContent = `Substantial Equity (${score}/100)`;
        resEquityBadge.style.background = '#ede9fe';
        resEquityBadge.style.color = '#6d28d9';
        resEquityBadge.style.borderColor = '#c4b5fd';
      } else if (score >= 60) {
        resEquityBadge.textContent = `Moderate Progress (${score}/100)`;
        resEquityBadge.style.background = '#fef3c7';
        resEquityBadge.style.color = '#b45309';
        resEquityBadge.style.borderColor = '#fde68a';
      } else {
        resEquityBadge.textContent = `Severe Disparity (${score}/100)`;
        resEquityBadge.style.background = '#fee2e2';
        resEquityBadge.style.color = '#b91c1c';
        resEquityBadge.style.borderColor = '#fca5a5';
      }
    }

    // Destination Breakdown
    const schoolSharePct = isParsippany ? 64.1 : 47.7;
    const muniSharePct = isParsippany ? 26.3 : 29.4;
    const countySharePct = isParsippany ? 9.6 : 22.9;

    const schoolAmount = whatIfBill * (schoolSharePct / 100.0);
    const muniAmount = whatIfBill * (muniSharePct / 100.0);
    const countyAmount = whatIfBill * (countySharePct / 100.0);

    if (destSplitBars) {
      destSplitBars.innerHTML = `
        <div class="dest-bar-segment" style="width: ${schoolSharePct}%; background: #2563eb;" title="Public Schools: ${formatUSDWhole(schoolAmount)}"></div>
        <div class="dest-bar-segment" style="width: ${muniSharePct}%; background: #059669;" title="Municipal: ${formatUSDWhole(muniAmount)}"></div>
        <div class="dest-bar-segment" style="width: ${countySharePct}%; background: #d97706;" title="County: ${formatUSDWhole(countyAmount)}"></div>
      `;
    }

    if (destLegend) {
      destLegend.innerHTML = `
        <div class="dest-legend-item">
          <span class="dest-legend-dot" style="background: #2563eb;"></span>
          <span>${meta.schoolDistrictShort}: <strong>${formatUSDWhole(schoolAmount)}</strong> (${schoolSharePct}%)</span>
        </div>
        <div class="dest-legend-item">
          <span class="dest-legend-dot" style="background: #059669;"></span>
          <span>${meta.name} Municipal: <strong>${formatUSDWhole(muniAmount)}</strong> (${muniSharePct}%)</span>
        </div>
        <div class="dest-legend-item">
          <span class="dest-legend-dot" style="background: #d97706;"></span>
          <span>${meta.countyShort}: <strong>${formatUSDWhole(countyAmount)}</strong> (${countySharePct}%)</span>
        </div>
      `;
    }

    // Update Neighborhood Impact Table
    if (neighborhoodTbody && neighborhoodData.length) {
      neighborhoodTbody.innerHTML = neighborhoodData.map(item => {
        const itemCurrentTax = item.currentTaxBill;
        // Project What-If for this neighborhood
        let itemWhatIfTax = itemCurrentTax * (1.0 - reductionFactor);

        // Apply circuit breaker if low median income
        if (circuitCap !== 'none' && item.medianHouseholdIncome <= 100000) {
          const capPct = parseFloat(circuitCap);
          const maxAllowed = item.medianHouseholdIncome * (capPct / 100.0);
          if (itemWhatIfTax > maxAllowed) itemWhatIfTax = maxAllowed;
        }

        const itemSavings = Math.max(0, itemCurrentTax - itemWhatIfTax);
        const itemNewEffort = item.medianHouseholdIncome > 0 
          ? (itemWhatIfTax / item.medianHouseholdIncome) * 100.0 
          : 0;

        const renterMonthlyRelief = Math.round((itemSavings / 12.0) * 0.85);

        return `
          <tr>
            <td><strong>${item.zip}</strong></td>
            <td>${item.name}</td>
            <td><strong>${formatUSDWhole(item.medianHouseholdIncome)}</strong></td>
            <td>${formatUSDWhole(itemCurrentTax)}</td>
            <td><span class="text-danger font-mono">${item.currentTaxEffortPct.toFixed(2)}%</span></td>
            <td><strong class="text-success font-mono">${formatUSDWhole(itemWhatIfTax)}</strong></td>
            <td><span class="text-success font-mono font-bold">${itemNewEffort.toFixed(2)}%</span></td>
            <td><span class="salary-highlight font-mono">-${formatUSDWhole(itemSavings)}/yr</span></td>
            <td><small class="text-muted">~$${renterMonthlyRelief}/mo rent relief</small></td>
          </tr>
        `;
      }).join('');
    }

    // Update the 5 Visual Components
    updateBalanceScale(commShare, pilotShare);
    renderWaterfall(currentBill, commReliefM, pilotReliefM, utilityReliefM, whatIfBill);
    renderLineItemInspector(activeDitEntity, whatIfBill);
    renderNeighborhoodVisualCards(reductionFactor, circuitCap);
  }

  // =========================================================================
  // VISUAL ENGINE 1: INTERACTIVE TAX FLOW ECOSYSTEM (SANKEY FLOW)
  // =========================================================================
  const flowContainer = document.getElementById('tax-flow-diagram');
  const btnFlowStatusQuo = document.getElementById('btn-flow-status-quo');
  const btnFlowWhatIf = document.getElementById('btn-flow-what-if');

  function renderTaxFlow(mode = 'status_quo') {
    if (!flowContainer) return;

    if (isParsippany) {
      if (mode === 'status_quo') {
        flowContainer.innerHTML = `
          <div class="flow-col">
            <div class="flow-col-title">📥 1. Revenue Sources ($262.2M)</div>
            <div class="flow-node" style="border-left: 5px solid #ef4444;">
              <div class="flow-node-header">
                <span class="flow-node-title">🏠 Residential Homeowners</span>
                <span class="flow-node-pct text-danger">72.8%</span>
              </div>
              <div class="flow-node-val text-danger">$190.87 Million</div>
              <div class="flow-node-sub">15,430 single-family & residential parcels carry 2.7× the burden of commercial property.</div>
            </div>
            <div class="flow-node" style="border-left: 5px solid #3b82f6;">
              <div class="flow-node-header">
                <span class="flow-node-title">🏢 Commercial / Corporate</span>
                <span class="flow-node-pct text-info">27.2%</span>
              </div>
              <div class="flow-node-val text-info">$71.31 Million</div>
              <div class="flow-node-sub">Eroded down from 45.8% in 1995. Office park vacancies & tax appeals shifted $29.4M onto homeowners.</div>
            </div>
            <div class="flow-node" style="border-left: 5px solid #8b5cf6;">
              <div class="flow-node-header">
                <span class="flow-node-title">🏗️ Developer PILOT Payments</span>
                <span class="flow-node-pct text-purple">$9.85M</span>
              </div>
              <div class="flow-node-val text-purple">18 Abatement Deals</div>
              <div class="flow-node-sub"><strong>$0 statutory share to PTHSD schools!</strong> 95% kept by Township Hall and 5% sent to Morris County.</div>
            </div>
          </div>

          <div class="flow-connector">➔</div>

          <div class="flow-col">
            <div class="flow-col-title">🏛️ 2. Parsippany Treasury Pool</div>
            <div class="flow-node pool-node">
              <div class="flow-node-header">
                <span class="flow-node-title">Certified 2026 Budget Pool</span>
              </div>
              <div class="flow-node-val">$262.18 Million</div>
              <div class="flow-node-sub">
                <strong>Assessment Base:</strong> $7.39B Assessed<br>
                <strong>True Market Value:</strong> $11.09 Billion<br>
                <span class="text-danger">Equalization Ratio: 66.6%</span>
              </div>
            </div>
          </div>

          <div class="flow-connector">➔</div>

          <div class="flow-col">
            <div class="flow-col-title">📤 3. Where Levy is Spent</div>
            <div class="flow-node" style="border-left: 5px solid #2563eb;">
              <div class="flow-node-header">
                <span class="flow-node-title">🎓 PTHSD Public Schools</span>
                <span class="flow-node-pct text-primary">64.1%</span>
              </div>
              <div class="flow-node-val text-primary">$168.17 Million</div>
              <div class="flow-node-sub">Educates 7,150+ students across 14 schools. State Aid covers under 10% of the budget.</div>
            </div>
            <div class="flow-node" style="border-left: 5px solid #059669;">
              <div class="flow-node-header">
                <span class="flow-node-title">🚔 Township & 6 Fire Districts</span>
                <span class="flow-node-pct text-success">26.3%</span>
              </div>
              <div class="flow-node-val text-success">$69.05 Million</div>
              <div class="flow-node-sub">Police, DPW, Parks, Sanitation, EMS, and 6 Independent Fire District tax levies.</div>
            </div>
            <div class="flow-node" style="border-left: 5px solid #d97706;">
              <div class="flow-node-header">
                <span class="flow-node-title">🏛️ Morris County Services</span>
                <span class="flow-node-pct text-warning">9.6%</span>
              </div>
              <div class="flow-node-val text-warning">$24.96 Million</div>
              <div class="flow-node-sub">County roads, County College of Morris, Park Commission, Sheriff, and Open Space.</div>
            </div>
          </div>
        `;
      } else {
        flowContainer.innerHTML = `
          <div class="flow-col">
            <div class="flow-col-title">📥 1. Revenue Sources (Rebalanced)</div>
            <div class="flow-node" style="border-left: 5px solid #10b981;">
              <div class="flow-node-header">
                <span class="flow-node-title">🏠 Residential Homeowners</span>
                <span class="flow-node-pct text-success">63.0%</span>
              </div>
              <div class="flow-node-val text-success">$165.17 Million</div>
              <div class="flow-node-sub"><strong>-$25.7M township-wide relief!</strong> Average homeowner saves $1,973/yr while schools stay whole.</div>
            </div>
            <div class="flow-node" style="border-left: 5px solid #3b82f6;">
              <div class="flow-node-header">
                <span class="flow-node-title">🏢 Commercial Ratables</span>
                <span class="flow-node-pct text-info">34.0%</span>
              </div>
              <div class="flow-node-val text-info">$89.14 Million</div>
              <div class="flow-node-sub">Campus Dr, Sylvan Way & Route 10 life-sciences revitalization restores +$17.8M in commercial share.</div>
            </div>
            <div class="flow-node" style="border-left: 5px solid #8b5cf6;">
              <div class="flow-node-header">
                <span class="flow-node-title">🏗️ 50% PILOT Dedicated to PTHSD</span>
                <span class="flow-node-pct text-purple">+$4.93M</span>
              </div>
              <div class="flow-node-val text-purple">Fair Student Funding</div>
              <div class="flow-node-sub">Binding ordinance directs 50% of developer PILOT fees to PTHSD schools, ending homeowner subsidies.</div>
            </div>
          </div>

          <div class="flow-connector">➔</div>

          <div class="flow-col">
            <div class="flow-col-title">🏛️ 2. Parsippany Treasury Pool</div>
            <div class="flow-node pool-node" style="border-color: #10b981; box-shadow: 0 0 20px -3px rgba(16, 185, 129, 0.25);">
              <div class="flow-node-header">
                <span class="flow-node-title">Equalized 2026 Budget Pool</span>
              </div>
              <div class="flow-node-val" style="color: #059669;">$262.18 Million</div>
              <div class="flow-node-sub">
                <strong>Assessment Base:</strong> $11.09B (100% Reval)<br>
                <strong>Tax Rate Compressed:</strong> <span class="text-success font-bold">2.025%</span><br>
                <span class="text-success font-bold">Zero service cuts. 100% funded.</span>
              </div>
            </div>
          </div>

          <div class="flow-connector">➔</div>

          <div class="flow-col">
            <div class="flow-col-title">📤 3. Fully Funded Services</div>
            <div class="flow-node" style="border-left: 5px solid #2563eb;">
              <div class="flow-node-header">
                <span class="flow-node-title">🎓 PTHSD Public Schools</span>
                <span class="flow-node-pct text-primary">Fully Funded</span>
              </div>
              <div class="flow-node-val text-primary">$173.10 Million</div>
              <div class="flow-node-sub">Includes $168.17M tax levy + $4.93M dedicated recurring PILOT revenue for all 14 schools.</div>
            </div>
            <div class="flow-node" style="border-left: 5px solid #059669;">
              <div class="flow-node-header">
                <span class="flow-node-title">🚔 Township & Fire Districts</span>
                <span class="flow-node-pct text-success">Fully Funded</span>
              </div>
              <div class="flow-node-val text-success">$69.05 Million</div>
              <div class="flow-node-sub">100% operational budget retained via commercial corridor growth and Fire District shared services.</div>
            </div>
            <div class="flow-node" style="border-left: 5px solid #d97706;">
              <div class="flow-node-header">
                <span class="flow-node-title">🏛️ Morris County Services</span>
                <span class="flow-node-pct text-warning">Fully Funded</span>
              </div>
              <div class="flow-node-val text-warning">$24.96 Million</div>
              <div class="flow-node-sub">Full Morris County levy met while protecting Lake Hiawatha families and fixed-income seniors.</div>
            </div>
          </div>
        `;
      }
      return;
    }

    if (mode === 'status_quo') {
      flowContainer.innerHTML = `
        <!-- Column 1: Sources -->
        <div class="flow-col">
          <div class="flow-col-title">📥 1. Revenue Sources ($374.2M)</div>
          <div class="flow-node" style="border-left: 5px solid #ef4444;">
            <div class="flow-node-header">
              <span class="flow-node-title">🏠 Residential Homeowners</span>
              <span class="flow-node-pct text-danger">76.2%</span>
            </div>
            <div class="flow-node-val text-danger">$285.11 Million</div>
            <div class="flow-node-sub">22,965 single-family & 2-family parcels carry 3.2× the burden of commercial property.</div>
          </div>
          <div class="flow-node" style="border-left: 5px solid #3b82f6;">
            <div class="flow-node-header">
              <span class="flow-node-title">🏢 Commercial / Industrial</span>
              <span class="flow-node-pct text-info">23.8%</span>
            </div>
            <div class="flow-node-val text-info">$89.05 Million</div>
            <div class="flow-node-sub">Eroded down from 41.6% in 1995. Corporate tax appeals stripped $38.2M onto homeowners.</div>
          </div>
          <div class="flow-node" style="border-left: 5px solid #8b5cf6;">
            <div class="flow-node-header">
              <span class="flow-node-title">🏗️ Developer PILOT Payments</span>
              <span class="flow-node-pct text-purple">$4.82M</span>
            </div>
            <div class="flow-node-val text-purple">12 Abatement Deals</div>
            <div class="flow-node-sub"><strong>$0 goes to public schools!</strong> 95% is kept by City Hall and 5% sent to Passaic County.</div>
          </div>
        </div>

        <div class="flow-connector">➔</div>

        <!-- Column 2: Central Pool -->
        <div class="flow-col">
          <div class="flow-col-title">🏛️ 2. Clifton Treasury Pool</div>
          <div class="flow-node pool-node">
            <div class="flow-node-header">
              <span class="flow-node-title">Certified 2026 Budget Pool</span>
            </div>
            <div class="flow-node-val">$374.15 Million</div>
            <div class="flow-node-sub">
              <strong>Assessment Base:</strong> $5.73B Assessed<br>
              <strong>True Market Value:</strong> $14.22 Billion<br>
              <span class="text-danger">Equalization Ratio: 40.3%</span>
            </div>
          </div>
        </div>

        <div class="flow-connector">➔</div>

        <!-- Column 3: Service Entities -->
        <div class="flow-col">
          <div class="flow-col-title">📤 3. Where Levy is Spent</div>
          <div class="flow-node" style="border-left: 5px solid #2563eb;">
            <div class="flow-node-header">
              <span class="flow-node-title">🎓 Clifton Public Schools</span>
              <span class="flow-node-pct text-primary">47.7%</span>
            </div>
            <div class="flow-node-val text-primary">$178.34 Million</div>
            <div class="flow-node-sub">Educates 10,800+ students. 100% of new development students funded by homeowners.</div>
          </div>
          <div class="flow-node" style="border-left: 5px solid #059669;">
            <div class="flow-node-header">
              <span class="flow-node-title">🚔 Municipal City Hall</span>
              <span class="flow-node-pct text-success">29.4%</span>
            </div>
            <div class="flow-node-val text-success">$110.06 Million</div>
            <div class="flow-node-sub">Police, Fire, DPW, Municipal Court, Sanitation, Parks, and Administration.</div>
          </div>
          <div class="flow-node" style="border-left: 5px solid #d97706;">
            <div class="flow-node-header">
              <span class="flow-node-title">🏛️ Passaic County Services</span>
              <span class="flow-node-pct text-warning">22.9%</span>
            </div>
            <div class="flow-node-val text-warning">$85.76 Million</div>
            <div class="flow-node-sub">County roads, Sheriff, Jail, County College, and Regional Parks system.</div>
          </div>
        </div>
      `;
    } else {
      flowContainer.innerHTML = `
        <!-- Column 1: Sources (What-If Equalized) -->
        <div class="flow-col">
          <div class="flow-col-title">📥 1. Revenue Sources (Rebalanced)</div>
          <div class="flow-node" style="border-left: 5px solid #10b981;">
            <div class="flow-node-header">
              <span class="flow-node-title">🏠 Residential Homeowners</span>
              <span class="flow-node-pct text-success">64.0%</span>
            </div>
            <div class="flow-node-val text-success">$239.50 Million</div>
            <div class="flow-node-sub"><strong>-$45.6M citywide relief!</strong> Average homeowner saves $1,973/yr while budgets stay whole.</div>
          </div>
          <div class="flow-node" style="border-left: 5px solid #3b82f6;">
            <div class="flow-node-header">
              <span class="flow-node-title">🏢 Commercial Ratables</span>
              <span class="flow-node-pct text-info">32.0%</span>
            </div>
            <div class="flow-node-val text-info">$119.73 Million</div>
            <div class="flow-node-sub">Corridor revitalization & logistics hubs absorb their constitutional fair share (+$30.7M).</div>
          </div>
          <div class="flow-node" style="border-left: 5px solid #8b5cf6;">
            <div class="flow-node-header">
              <span class="flow-node-title">🏗️ 50% PILOT Dedicated to BOE</span>
              <span class="flow-node-pct text-purple">+$2.41M</span>
            </div>
            <div class="flow-node-val text-purple">Fair Student Funding</div>
            <div class="flow-node-sub">Ordinance directs 50% of developer fees directly to public schools, ending homeowner subsidization.</div>
          </div>
        </div>

        <div class="flow-connector">➔</div>

        <!-- Column 2: Central Pool -->
        <div class="flow-col">
          <div class="flow-col-title">🏛️ 2. Clifton Treasury Pool</div>
          <div class="flow-node pool-node" style="border-color: #10b981; box-shadow: 0 0 20px -3px rgba(16, 185, 129, 0.25);">
            <div class="flow-node-header">
              <span class="flow-node-title">Equalized 2026 Budget Pool</span>
            </div>
            <div class="flow-node-val" style="color: #059669;">$374.15 Million</div>
            <div class="flow-node-sub">
              <strong>Assessment Base:</strong> $14.22B (100% Reval)<br>
              <strong>Tax Rate Compressed:</strong> <span class="text-success font-bold">2.215%</span><br>
              <span class="text-success font-bold">Zero service cuts. 100% funded.</span>
            </div>
          </div>
        </div>

        <div class="flow-connector">➔</div>

        <!-- Column 3: Service Entities -->
        <div class="flow-col">
          <div class="flow-col-title">📤 3. Fully Funded Services</div>
          <div class="flow-node" style="border-left: 5px solid #2563eb;">
            <div class="flow-node-header">
              <span class="flow-node-title">🎓 Clifton Public Schools</span>
              <span class="flow-node-pct text-primary">Fully Funded</span>
            </div>
            <div class="flow-node-val text-primary">$180.75 Million</div>
            <div class="flow-node-sub">Includes $178.34M tax levy + $2.41M new recurring PILOT allocation for classrooms and teachers.</div>
          </div>
          <div class="flow-node" style="border-left: 5px solid #059669;">
            <div class="flow-node-header">
              <span class="flow-node-title">🚔 Municipal City Hall</span>
              <span class="flow-node-pct text-success">Fully Funded</span>
            </div>
            <div class="flow-node-val text-success">$110.06 Million</div>
            <div class="flow-node-sub">100% operational budget retained via commercial corridor growth and enterprise utility fees.</div>
          </div>
          <div class="flow-node" style="border-left: 5px solid #d97706;">
            <div class="flow-node-header">
              <span class="flow-node-title">🏛️ Passaic County Services</span>
              <span class="flow-node-pct text-warning">Fully Funded</span>
            </div>
            <div class="flow-node-val text-warning">$85.76 Million</div>
            <div class="flow-node-sub">Full county statutory assessment met without burdening senior citizens and low-income wards.</div>
          </div>
        </div>
      `;
    }
  }

  if (btnFlowStatusQuo && btnFlowWhatIf) {
    btnFlowStatusQuo.onclick = () => {
      btnFlowStatusQuo.classList.add('active');
      btnFlowWhatIf.classList.remove('active');
      renderTaxFlow('status_quo');
    };

    btnFlowWhatIf.onclick = () => {
      btnFlowWhatIf.classList.add('active');
      btnFlowStatusQuo.classList.remove('active');
      renderTaxFlow('what_if');
    };
  }

  // Initial Flow Render
  renderTaxFlow('status_quo');

  // =========================================================================
  // VISUAL ENGINE 2: THE EQUITY BALANCE SCALE WIDGET
  // =========================================================================
  const bswBeam = document.getElementById('bsw-beam');
  const bswLeftVal = document.getElementById('bsw-left-val');
  const bswLeftSub = document.getElementById('bsw-left-sub');
  const bswRightVal = document.getElementById('bsw-right-val');
  const bswRightSub = document.getElementById('bsw-right-sub');
  const bswStatusBadge = document.getElementById('bsw-status-badge');
  const bswSubtext = document.getElementById('bsw-subtext');

  function updateBalanceScale(commShare, pilotShare) {
    if (!bswBeam) return;

    const resShare = 100.0 - commShare;
    const resLevyM = totalLevyM * (resShare / 100.0);
    const commLevyM = totalLevyM * (commShare / 100.0);

    if (bswLeftVal) bswLeftVal.textContent = `${resShare.toFixed(1)}%`;
    if (bswLeftSub) bswLeftSub.textContent = `$${resLevyM.toFixed(1)}M`;
    if (bswRightVal) bswRightVal.textContent = `${commShare.toFixed(1)}%`;
    if (bswRightSub) bswRightSub.textContent = `$${commLevyM.toFixed(1)}M`;

    const factor = Math.min(1.0, Math.max(0, (commShare - baseCommShare) / (35.0 - baseCommShare)));
    const tiltDeg = Math.round(-14 * (1.0 - factor));

    bswBeam.style.transform = `rotate(${tiltDeg}deg)`;

    if (bswStatusBadge) {
      if (Math.abs(tiltDeg) <= 2) {
        bswStatusBadge.textContent = '⚖️ Balanced Equilibrium (Fair Share)';
        bswStatusBadge.style.background = '#dcfce7';
        bswStatusBadge.style.color = '#15803d';
        bswStatusBadge.style.borderColor = '#86efac';
      } else if (Math.abs(tiltDeg) <= 7) {
        bswStatusBadge.textContent = `Progressing: ${resShare.toFixed(1)}% Residential`;
        bswStatusBadge.style.background = '#fef3c7';
        bswStatusBadge.style.color = '#b45309';
        bswStatusBadge.style.borderColor = '#fde68a';
      } else {
        bswStatusBadge.textContent = `Tilted: ${resShare.toFixed(1)}% Homeowners`;
        bswStatusBadge.style.background = '#fee2e2';
        bswStatusBadge.style.color = '#b91c1c';
        bswStatusBadge.style.borderColor = '#fca5a5';
      }
    }

    if (bswSubtext) {
      if (Math.abs(tiltDeg) <= 2) {
        bswSubtext.innerHTML = `<strong>Scale Level:</strong> Commercial & PILOT revenue balances the scale, lifting excess tax burden off ${meta.name} families.`;
      } else {
        const excessM = Math.max(0, resLevyM - (totalLevyM * 0.65)).toFixed(1);
        bswSubtext.innerHTML = `Homeowners shoulder <strong>${(resShare / Math.max(1, commShare)).toFixed(1)}×</strong> the burden of commercial ratables (~+$${excessM}M excess residential shift).`;
      }
    }
  }

  // =========================================================================
  // VISUAL ENGINE 3: PERSONAL SAVINGS WATERFALL BREAKDOWN
  // =========================================================================
  const wfbTrack = document.getElementById('wfb-steps-track');

  function renderWaterfall(currentBill, commReliefM, pilotReliefM, utilityReliefM, whatIfBill) {
    if (!wfbTrack) return;

    const commReliefHome = Math.round((commReliefM * 1000000) / totalParcels);
    const pilotReliefHome = Math.round((pilotReliefM * 1000000) / totalParcels);
    const utilityReliefHome = Math.round((utilityReliefM * 1000000) / totalParcels);

    let runningBill = currentBill;
    const step1Bill = Math.max(0, runningBill - commReliefHome);
    const step2Bill = Math.max(0, step1Bill - pilotReliefHome);
    const step3Bill = Math.max(0, step2Bill - utilityReliefHome);
    const step4Delta = Math.round(step3Bill - whatIfBill);

    wfbTrack.innerHTML = `
      <div class="wfb-step-row">
        <span class="wfb-step-icon">🏠</span>
        <div class="wfb-step-info">
          <span class="wfb-step-title">1. Starting Status Quo Baseline</span>
          <span class="wfb-step-desc">Existing 2026 property tax levy under current assessment</span>
        </div>
        <span class="wfb-step-delta neutral">Base</span>
        <span class="wfb-step-total">${formatUSDWhole(currentBill)}</span>
      </div>

      <div class="wfb-step-row">
        <span class="wfb-step-icon">🏢</span>
        <div class="wfb-step-info">
          <span class="wfb-step-title">2. Commercial Ratable Restoration</span>
          <span class="wfb-step-desc">Growth in ${isParsippany ? 'Campus Dr / Route 10 / 46' : 'Route 3 / 46'} corridors shifts +$${commReliefM.toFixed(1)}M off homeowners</span>
        </div>
        <span class="wfb-step-delta relief">-${formatUSDWhole(commReliefHome)}</span>
        <span class="wfb-step-total">${formatUSDWhole(step1Bill)}</span>
      </div>

      <div class="wfb-step-row">
        <span class="wfb-step-icon">🎓</span>
        <div class="wfb-step-info">
          <span class="wfb-step-title">3. 50% PILOT Sharing to Schools</span>
          <span class="wfb-step-desc">Developer fees fund classroom costs for new housing</span>
        </div>
        <span class="wfb-step-delta relief">-${formatUSDWhole(pilotReliefHome)}</span>
        <span class="wfb-step-total">${formatUSDWhole(step2Bill)}</span>
      </div>

      <div class="wfb-step-row">
        <span class="wfb-step-icon">🌊</span>
        <div class="wfb-step-info">
          <span class="wfb-step-title">4. Enterprise Utility & Shared Services</span>
          <span class="wfb-step-desc">Stormwater/${isParsippany ? 'Fire District shared services' : 'trash shifted to commercial users'}</span>
        </div>
        <span class="wfb-step-delta relief">-${formatUSDWhole(utilityReliefHome)}</span>
        <span class="wfb-step-total">${formatUSDWhole(step3Bill)}</span>
      </div>

      <div class="wfb-step-row">
        <span class="wfb-step-icon">⚖️</span>
        <div class="wfb-step-info">
          <span class="wfb-step-title">5. Market Reval & Circuit Breaker</span>
          <span class="wfb-step-desc">Assessment equalization + safety cap for low-income seniors</span>
        </div>
        <span class="wfb-step-delta ${step4Delta >= 0 ? 'relief' : 'neutral'}">${step4Delta >= 0 ? `-${formatUSDWhole(step4Delta)}` : `+${formatUSDWhole(Math.abs(step4Delta))}`}</span>
        <span class="wfb-step-total" style="color: #15803d;">${formatUSDWhole(whatIfBill)}</span>
      </div>
    `;
  }

  // =========================================================================
  // VISUAL ENGINE 4: CLICK-TO-DRILL-DOWN TAX DOLLAR INSPECTOR
  // =========================================================================
  let activeDitEntity = 'schools';
  const ditContentBody = document.getElementById('dit-content-body');
  const ditTabBtns = document.querySelectorAll('.dit-tab-btn');

  function renderLineItemInspector(entityId, currentWhatIfBill) {
    if (!ditContentBody) return;

    activeDitEntity = entityId;
    ditTabBtns.forEach(btn => {
      if (btn.getAttribute('data-entity') === entityId) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    if (!taxData || !taxData.breakdown) {
      ditContentBody.innerHTML = '<p class="text-muted text-center">Breakdown data unavailable.</p>';
      return;
    }

    const matchedEntity = taxData.breakdown.find(b => b.id === entityId);
    if (!matchedEntity || !matchedEntity.components) {
      ditContentBody.innerHTML = '<p class="text-muted text-center">No line items for this category.</p>';
      return;
    }

    const entityPortion = currentWhatIfBill * (matchedEntity.percentage / 100.0);

    ditContentBody.innerHTML = matchedEntity.components.map(c => {
      const shareKey = Object.keys(c).find(k => k.startsWith('shareOf'));
      const share = c[shareKey] || 0;
      const itemAmount = entityPortion * share;
      const pctLabel = `${Math.round(share * 100)}% of ${matchedEntity.name}`;

      return `
        <div class="dit-line-item">
          <div class="dit-item-name">
            ${c.name}
            <small>${c.details || 'Certified budget allocation'}</small>
          </div>
          <span class="dit-item-pct">${pctLabel}</span>
          <span class="dit-item-amt">${formatUSDWhole(itemAmount)} / yr</span>
        </div>
      `;
    }).join('');
  }

  ditTabBtns.forEach(btn => {
    btn.onclick = () => {
      const ent = btn.getAttribute('data-entity');
      const assessedVal = parseFloat(inputAssessed?.value) || defaultAssessedVal;
      const currentBill = (assessedVal / 100.0) * baselineRate;
      const commShare = parseFloat(leverCommercial?.value) || 32.0;
      const pilotShare = parseFloat(leverPilot?.value) || 50;
      const utilityUnbundle = parseFloat(leverUtility?.value) || 7.5;
      const totalReliefM = Math.max(0, (commShare - baseCommShare) * levyPerPctPointM) + ((pilotShare / 100.0) * totalPilotM) + utilityUnbundle;
      const reductionFactor = Math.min(0.42, totalReliefM / baselineResLevyM);
      const whatIfBill = currentBill * (1.0 - reductionFactor);

      renderLineItemInspector(ent, whatIfBill);
    };
  });

  // =========================================================================
  // VISUAL ENGINE 5: INTERACTIVE NEIGHBORHOOD COMPARISON CARDS & GAUGES
  // =========================================================================
  const neighborhoodCardsGrid = document.getElementById('neighborhood-visual-cards-grid');

  function renderNeighborhoodVisualCards(reductionFactor, circuitCap) {
    if (!neighborhoodCardsGrid || !neighborhoodData.length) return;

    neighborhoodCardsGrid.innerHTML = neighborhoodData.map(item => {
      const itemCurrentTax = item.currentTaxBill;
      let itemWhatIfTax = itemCurrentTax * (1.0 - reductionFactor);

      if (circuitCap !== 'none' && item.medianHouseholdIncome <= 100000) {
        const capPct = parseFloat(circuitCap);
        const maxAllowed = item.medianHouseholdIncome * (capPct / 100.0);
        if (itemWhatIfTax > maxAllowed) itemWhatIfTax = maxAllowed;
      }

      const itemSavings = Math.max(0, itemCurrentTax - itemWhatIfTax);
      const currentEffort = item.currentTaxEffortPct;
      const whatIfEffort = item.medianHouseholdIncome > 0 
        ? (itemWhatIfTax / item.medianHouseholdIncome) * 100.0 
        : 0;

      let badgeClass = 'moderate';
      let badgeLabel = 'Moderate Burden';
      let barFillColor = '#f59e0b';

      if (currentEffort >= 10.5) {
        badgeClass = 'severe';
        badgeLabel = 'Highest Income Strain';
        barFillColor = '#ef4444';
      } else if (item.zip === '07013' || item.zip === '07950') {
        badgeClass = 'high-gross';
        badgeLabel = 'Highest Gross Levy';
        barFillColor = '#3b82f6';
      }

      const gaugeWidth = Math.min(100, (whatIfEffort / 16.0) * 100);

      return `
        <div class="nvc-card">
          <div class="nvc-header">
            <span class="nvc-zip">${item.zip}</span>
            <span class="nvc-badge ${badgeClass}">${badgeLabel}</span>
          </div>
          <div class="nvc-name">${item.name}</div>

          <div class="nvc-metric-row">
            <span class="nvc-metric-label">Median Income</span>
            <span class="nvc-metric-val">${formatUSDWhole(item.medianHouseholdIncome)}</span>
          </div>
          <div class="nvc-metric-row">
            <span class="nvc-metric-label">Current Avg Bill</span>
            <span class="nvc-metric-val text-danger">${formatUSDWhole(itemCurrentTax)}</span>
          </div>

          <!-- Tax Effort Gauge -->
          <div class="nvc-effort-track">
            <div class="nvc-effort-labels">
              <span>Tax Effort: <strong>${currentEffort.toFixed(1)}% ➔ ${whatIfEffort.toFixed(1)}%</strong></span>
              <span class="text-success font-bold">-${(currentEffort - whatIfEffort).toFixed(1)}%</span>
            </div>
            <div class="nvc-progress-bar">
              <div class="nvc-bar-fill" style="width: ${gaugeWidth.toFixed(1)}%; background: ${barFillColor};"></div>
            </div>
          </div>

          <!-- Relief Callout -->
          <div class="nvc-relief-box">
            <span>Projected Bill: <strong>${formatUSDWhole(itemWhatIfTax)}</strong></span>
            <span class="nvc-relief-val">-${formatUSDWhole(itemSavings)}/yr</span>
          </div>

          <button class="nvc-load-btn" 
            data-market="${item.avgMarketValue}" 
            data-assessed="${item.avgAssessment}" 
            data-income="${item.medianHouseholdIncome}" 
            data-zip="${item.zip}">
            Simulate ${item.zip} Average Home ➔
          </button>
        </div>
      `;
    }).join('');

    // Attach click listeners to "Simulate ZIP Home" buttons
    neighborhoodCardsGrid.querySelectorAll('.nvc-load-btn').forEach(btn => {
      btn.onclick = () => {
        const m = btn.getAttribute('data-market');
        const a = btn.getAttribute('data-assessed');
        const inc = btn.getAttribute('data-income');
        const z = btn.getAttribute('data-zip');

        if (inputMarket && m) inputMarket.value = m;
        if (inputAssessed && a) inputAssessed.value = a;
        if (inputIncome && inc) inputIncome.value = inc;
        if (selectZip && z) selectZip.value = z;

        runSimulation();

        const sandboxEl = document.querySelector('.what-if-sandbox');
        if (sandboxEl) {
          sandboxEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };
    });
  }

  // Detect Custom Levers vs Preset Matches
  function checkPresetMatch() {
    const commShare = parseFloat(leverCommercial?.value) || 32.0;
    const pilotShare = parseFloat(leverPilot?.value) || 50;
    const revalOn = toggleReval ? toggleReval.checked : true;
    const circuitCap = selectCircuit?.value || '8';
    const utilityUnbundle = parseFloat(leverUtility?.value) || 7.5;

    const matched = presets.find(p => 
      Math.abs(p.commercialSharePct - commShare) < 0.2 &&
      Math.abs(p.pilotSchoolSharePct - pilotShare) < 0.2 &&
      p.revaluationEnabled === revalOn &&
      (p.circuitBreakerCapPct > 0 ? String(Math.round(p.circuitBreakerCapPct)) : 'none') === circuitCap &&
      Math.abs(p.utilityUnbundlingM - utilityUnbundle) < 0.2
    );

    if (presetsContainer) {
      presetsContainer.querySelectorAll('.preset-pill-btn').forEach(b => {
        if (matched && b.getAttribute('data-preset-id') === matched.id) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
    }

    if (matched) {
      renderScenarioCallout(matched);
    } else if (activeCallout) {
      activeCallout.innerHTML = `
        <div class="sdc-summary">
          <strong>Custom Citizen Scenario</strong>
          <p>You are testing custom policy parameters for ${meta.fullName}. Adjust any slider or toggle to see live fiscal and household impacts.</p>
        </div>
        <div class="sdc-impact winners">
          <strong>Custom Levers:</strong>
          ${commShare.toFixed(1)}% Commercial • ${pilotShare}% PILOT to Schools • ${revalOn ? '100% Reval' : 'Old Roll'}
        </div>
        <div class="sdc-impact losers">
          <strong>Target Equity:</strong>
          ${circuitCap !== 'none' ? `Cap @ ${circuitCap}% Income` : 'No Income Cap'} • $${utilityUnbundle}M Utility Shift
        </div>
      `;
    }
  }

  // Bind Listeners to Controls
  [inputIncome, selectZip, selectResType].forEach(el => {
    if (el) el.onchange = runSimulation;
  });

  if (inputIncome) {
    inputIncome.oninput = runSimulation;
  }

  [leverCommercial, leverPilot, leverUtility].forEach(el => {
    if (el) {
      el.oninput = () => {
        runSimulation();
        checkPresetMatch();
      };
    }
  });

  if (toggleReval) {
    toggleReval.onchange = () => {
      runSimulation();
      checkPresetMatch();
    };
  }

  if (selectCircuit) {
    selectCircuit.onchange = () => {
      runSimulation();
      checkPresetMatch();
    };
  }

  // Preset Buttons Click Handler
  if (presetsContainer) {
    presetsContainer.onclick = (e) => {
      const btn = e.target.closest('.preset-pill-btn');
      if (!btn) return;

      const presetId = btn.getAttribute('data-preset-id');
      const targetPreset = presets.find(p => p.id === presetId);
      if (!targetPreset) return;

      presetsContainer.querySelectorAll('.preset-pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      renderScenarioCallout(targetPreset);

      if (leverCommercial) leverCommercial.value = targetPreset.commercialSharePct;
      if (leverPilot) leverPilot.value = targetPreset.pilotSchoolSharePct;
      if (toggleReval) toggleReval.checked = targetPreset.revaluationEnabled;
      if (selectCircuit) {
        selectCircuit.value = targetPreset.circuitBreakerCapPct > 0 
          ? String(Math.round(targetPreset.circuitBreakerCapPct)) 
          : 'none';
      }
      if (leverUtility) leverUtility.value = targetPreset.utilityUnbundlingM;

      runSimulation();
    };
  }

  // Reset Button
  if (btnReset) {
    btnReset.onclick = () => {
      if (inputMarket) inputMarket.value = defaultMarketVal;
      if (inputAssessed) inputAssessed.value = defaultAssessedVal;
      if (inputIncome) inputIncome.value = defaultIncome;
      if (selectZip) selectZip.value = defaultZip;
      if (selectResType) selectResType.value = 'general';

      const bpPreset = presets.find(p => p.id === 'unified_blueprint');
      if (bpPreset) {
        if (leverCommercial) leverCommercial.value = bpPreset.commercialSharePct;
        if (leverPilot) leverPilot.value = bpPreset.pilotSchoolSharePct;
        if (toggleReval) toggleReval.checked = bpPreset.revaluationEnabled;
        if (selectCircuit) selectCircuit.value = String(Math.round(bpPreset.circuitBreakerCapPct));
        if (leverUtility) leverUtility.value = bpPreset.utilityUnbundlingM;

        if (presetsContainer) {
          presetsContainer.querySelectorAll('.preset-pill-btn').forEach(b => {
            if (b.getAttribute('data-preset-id') === 'unified_blueprint') b.classList.add('active');
            else b.classList.remove('active');
          });
        }

        renderScenarioCallout(bpPreset);
      }

      runSimulation();
    };
  }

  // 4. Render Sample Profiles
  const profilesContainer = document.getElementById('sample-profiles-container');
  if (profilesContainer && sampleProfiles.length) {
    profilesContainer.innerHTML = sampleProfiles.map((p, idx) => `
      <div class="sample-profile-card">
        <div class="spc-title">${p.label}</div>
        <div class="spc-meta">
          Market: <strong>${formatUSDWhole(p.marketValue)}</strong> • Income: ${formatUSDWhole(p.householdIncome)} (${p.zip})
        </div>
        <div class="spc-comparison">
          <div class="spc-col">
            <span class="spc-label">Status Quo</span>
            <span class="spc-val text-danger">${formatUSDWhole(p.statusQuoBill)}</span>
          </div>
          <div class="spc-col">
            <span class="spc-label">Blueprint</span>
            <span class="spc-val text-success">${formatUSDWhole(p.blueprintBill)}</span>
          </div>
        </div>
        <div class="spc-relief-badge">
          -${formatUSDWhole(p.blueprintSavings)}/yr (-${p.percentSavings}%)
        </div>
        <button class="spc-apply-btn" 
          data-market="${p.marketValue}" 
          data-assessed="${p.assessedValue}" 
          data-income="${p.householdIncome}" 
          data-zip="${p.zip}"
          data-type="${idx === 3 ? 'senior' : 'general'}">
          Apply to Sandbox ➔
        </button>
      </div>
    `).join('');

    profilesContainer.onclick = (e) => {
      const applyBtn = e.target.closest('.spc-apply-btn');
      if (!applyBtn) return;

      const m = applyBtn.getAttribute('data-market');
      const a = applyBtn.getAttribute('data-assessed');
      const inc = applyBtn.getAttribute('data-income');
      const z = applyBtn.getAttribute('data-zip');
      const t = applyBtn.getAttribute('data-type');

      if (inputMarket && m) inputMarket.value = m;
      if (inputAssessed && a) inputAssessed.value = a;
      if (inputIncome && inc) inputIncome.value = inc;
      if (selectZip && z) selectZip.value = z;
      if (selectResType && t) selectResType.value = t;

      runSimulation();

      const sandboxEl = document.querySelector('.what-if-sandbox');
      if (sandboxEl) {
        sandboxEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
  }

  // 5. Render Policy Roadmap Steps
  const roadmapContainer = document.getElementById('fair-roadmap-container');
  if (roadmapContainer && roadmapSteps.length) {
    roadmapContainer.innerHTML = roadmapSteps.map(step => `
      <div class="roadmap-step-card">
        <div class="rsc-number">${step.step}</div>
        <div class="rsc-content">
          <h4>${step.title}</h4>
          <span class="rsc-law">Authority: ${step.legalAuthority}</span>
          <p><strong>Action:</strong> ${step.action}</p>
          <p style="margin-top: 4px;"><strong>Outcome:</strong> ${step.outcome}</p>
        </div>
        <div class="rsc-timeline">${step.timeline}</div>
      </div>
    `).join('');
  }

  // 6. Civic Action Buttons: Copy Summary & Print
  const btnCopy = document.getElementById('btn-copy-fair-tax-summary');
  const btnPrint = document.getElementById('btn-print-fair-tax');

  if (btnCopy) {
    btnCopy.onclick = () => {
      const currentBillText = resCurrentBill?.textContent || '$12,372';
      const projectedBillText = resProjectedBill?.textContent || '$10,399';
      const annualSavingsText = resAnnualSavings?.textContent || '-$1,973 / yr';
      const monthlySavingsText = resMonthlySavings?.textContent || '-$164 / mo';
      const marketVal = inputMarket?.value || defaultMarketVal;
      const income = inputIncome?.value || defaultIncome;
      const commShare = leverCommercial?.value || '32.0';
      const pilotShare = leverPilot?.value || '50';
      const cityLabelUpper = meta.fullName.toUpperCase();
      const schoolName = meta.schoolDistrictName;

      const summaryText = `${cityLabelUpper} CITIZEN FAIR TAX REFORM SUMMARY
Date: October 2026
Source: MyTownLens Citizen Watchdog Project (https://www.mytownlens.com/?city=${currentCity})

HOUSEHOLD PROFILE:
• Home Market Value: $${Number(marketVal).toLocaleString()}
• Household Income: $${Number(income).toLocaleString()}
• Status Quo Tax Bill: ${currentBillText}

WHAT-IF EQUALIZATION REFORM PLAN:
• Projected Tax Bill: ${projectedBillText}
• Net Annual Relief: ${annualSavingsText} (${monthlySavingsText})
• Key Levers:
  - Restore Commercial Ratables from ${baseCommShare}% to ${commShare}%
  - Dedicate ${pilotShare}% of municipal PILOT funds to ${schoolName}
  - Perform 100% Market Revaluation to eliminate assessment lag
  - Cap tax burden for seniors and families earning under $100k at 8% of income

FISCAL STABILITY:
${meta.name}'s municipal and school budgets remain 100% funded with zero layoffs or service cuts by redirecting lost commercial and developer revenues back into the public ledger.`;

      navigator.clipboard.writeText(summaryText).then(() => {
        const origText = btnCopy.textContent;
        btnCopy.textContent = '✓ Copied Summary to Clipboard!';
        btnCopy.classList.add('btn-success');
        setTimeout(() => {
          btnCopy.textContent = origText;
          btnCopy.classList.remove('btn-success');
        }, 2800);
      }).catch(err => {
        console.error('Copy failed:', err);
      });
    };
  }

  if (btnPrint) {
    btnPrint.onclick = () => {
      window.print();
    };
  }

  // Initial Simulation Run
  runSimulation();
}

// =========================================================================
// TAB: CLIFTON ELECTION 2026 CANDIDATE DOSSIERS & VOTER GUIDE
// =========================================================================

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

let electionControlsInitialized = false;

function setupElectionControls() {
  if (electionControlsInitialized) return;
  electionControlsInitialized = true;

  const searchInput = document.getElementById('election-search-input');
  const clearBtn = document.getElementById('election-search-clear');
  const statusBtns = document.querySelectorAll('.filter-group-status .filter-btn');
  const expandAllBtn = document.getElementById('btn-expand-all-candidates');
  const collapseAllBtn = document.getElementById('btn-collapse-all-candidates');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      electionSearchQuery = (e.target.value || '').trim().toLowerCase();
      if (clearBtn) {
        clearBtn.style.display = electionSearchQuery ? 'block' : 'none';
      }
      filterAndRenderCandidates();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      electionSearchQuery = '';
      clearBtn.style.display = 'none';
      filterAndRenderCandidates();
    });
  }

  statusBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      statusBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      electionFilterStatus = btn.getAttribute('data-status') || 'all';
      filterAndRenderCandidates();
    });
  });

  if (expandAllBtn) {
    expandAllBtn.addEventListener('click', () => {
      document.querySelectorAll('#election-candidates-grid details.candidate-accordion').forEach(d => {
        d.open = true;
      });
    });
  }

  if (collapseAllBtn) {
    collapseAllBtn.addEventListener('click', () => {
      document.querySelectorAll('#election-candidates-grid details.candidate-accordion').forEach(d => {
        d.open = false;
      });
    });
  }

  // Segmented tab switching inside candidate cards
  const candidatesGrid = document.getElementById('election-candidates-grid');
  if (candidatesGrid && !candidatesGrid.dataset.tabsInitialized) {
    candidatesGrid.dataset.tabsInitialized = 'true';
    candidatesGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.cand-tab-btn');
      if (!btn) return;
      const targetTab = btn.getAttribute('data-tab');
      const card = btn.closest('.candidate-card');
      if (!card) return;

      // Update active tab buttons
      card.querySelectorAll('.cand-tab-btn').forEach(b => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      // Update active tab panes
      card.querySelectorAll('.cand-tab-pane').forEach(pane => {
        const isMatch = pane.getAttribute('data-pane') === targetTab;
        pane.classList.toggle('active', isMatch);
        pane.style.display = isMatch ? 'block' : 'none';
      });
    });
  }
}

async function renderElectionHub() {
  const meta = CITY_REGISTRY[currentCity] || CITY_REGISTRY.clifton;
  if (!cliftonElectionData || loadedElectionCity !== currentCity) {
    await loadElectionData(currentCity);
  }
  if (!cliftonElectionData) return;
  updateElectionStaticCopy(currentCity, meta);

  renderBallotOverview();
  renderCategoryPills();
  filterAndRenderCandidates();
  renderControversiesSpotlight();
  renderPlatformMatrix();
  renderBoeCandidates();
  renderNjCandidates();
  renderVotingGuide();
  setupVoterCompass();
  setupCollapsibleSections();
}

let collapsibleSectionsInitialized = false;

function setupCollapsibleSections() {
  document.querySelectorAll('.btn-expand-all-sections, #btn-expand-all-sections').forEach(btn => {
    if (!btn.dataset.bound) {
      btn.dataset.bound = 'true';
      btn.addEventListener('click', () => {
        const pane = btn.closest('.tab-pane') || document;
        pane.querySelectorAll('details.collapsible-section').forEach(d => {
          d.open = true;
        });
      });
    }
  });

  document.querySelectorAll('.btn-collapse-all-sections, #btn-collapse-all-sections').forEach(btn => {
    if (!btn.dataset.bound) {
      btn.dataset.bound = 'true';
      btn.addEventListener('click', () => {
        const pane = btn.closest('.tab-pane') || document;
        pane.querySelectorAll('details.collapsible-section').forEach(d => {
          d.open = false;
        });
      });
    }
  });

  // Ensure anchor links and quick-nav pills open their target section if it was collapsed
  if (!collapsibleSectionsInitialized) {
    collapsibleSectionsInitialized = true;

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href === '#' || !href.startsWith('#')) return;

      const targetId = href.substring(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const parentSection = targetEl.classList.contains('collapsible-section') ? targetEl : targetEl.closest('details.collapsible-section');
        if (parentSection) {
          parentSection.open = true;
          setTimeout(() => {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 50);
        }
      }
    });

    // Check hash on load
    const hash = (window.location.hash || '').replace(/^#/, '');
    if (hash) {
      const targetEl = document.getElementById(hash);
      if (targetEl) {
        const parentSection = targetEl.classList.contains('collapsible-section') ? targetEl : targetEl.closest('details.collapsible-section');
        if (parentSection) {
          parentSection.open = true;
        }
      }
    }
  }
}

let voterCompassInitialized = false;
let voterCompassViewMode = 'top7'; // 'top7' or 'all'

function setupVoterCompass() {
  const form = document.getElementById('voter-compass-form');
  const resultsBox = document.getElementById('matchmaker-results-box');
  const resultsGrid = document.getElementById('matchmaker-results-grid');
  const resetBtn = document.getElementById('btn-reset-compass');
  const showTop7Btn = document.getElementById('btn-show-top7');
  const showAllBtn = document.getElementById('btn-show-all-matches');
  const statusEl = document.getElementById('compass-answers-status');

  if (!form || !resultsBox || !resultsGrid) return;

  function calculateMatches() {
    if (!cliftonElectionData || !cliftonElectionData.councilCandidates) return;

    let answers = {};
    try {
      const formData = new FormData(form);
      for (const [k, v] of formData.entries()) {
        answers[k] = v;
      }
    } catch (e) {
      // fallback for non-standard environments
    }
    const answeredKeys = Object.keys(answers);
    const totalAnswered = answeredKeys.length;

    if (totalAnswered === 0) {
      if (statusEl) statusEl.textContent = 'Select your views above to see which candidates match your priorities.';
      resultsBox.style.display = 'none';
      return;
    }

    if (statusEl) {
      statusEl.textContent = `Your match scores based on ${totalAnswered} of 6 answered questions:`;
    }

    const reasonMap = {
      taxFreezeVsServices: {
        freeze: 'Supports immediate tax freeze & forensic audit',
        balanced: 'Supports balanced 2% caps to protect municipal services'
      },
      developmentStance: {
        strict_ban: 'Supports strict ban on AI data centers & warehouses',
        selective_growth: 'Favors selective commercial ratables to expand the tax base'
      },
      infrastructurePriority: {
        flooding: 'Prioritizes stormwater retention & PVWC water oversight',
        paving: 'Prioritizes neighborhood road repaving & pedestrian safety'
      },
      governanceStyle: {
        decorum: 'Champions dais civility and professional city administration',
        watchdog: 'Brings relentless citizen watchdog budget oversight',
        charter_reform: 'Advocates Charter Study Commission for directly-elected mayor'
      },
      housingEnforcement: {
        code_enforcement: 'Focuses on strict code enforcement against illegal overcrowding',
        corridor_grants: 'Supports Main & Bloomfield Ave small business revival grants'
      },
      sharedServices: {
        city_boe_merger: 'Urges consolidated City-BOE purchasing & healthcare pooling',
        classroom_focus: 'Protects school classroom budgets & state aid advocacy'
      }
    };

    const candidates = cliftonElectionData.councilCandidates.map(c => {
      const stances = (c.interviewStances && c.interviewStances.matchmakerScores) || {};
      let matchCount = 0;
      const sharedReasons = [];

      answeredKeys.forEach(q => {
        const userVal = answers[q];
        const candVal = stances[q];
        if (userVal && candVal && userVal === candVal) {
          matchCount++;
          const reasonText = (reasonMap[q] && reasonMap[q][userVal]) || null;
          if (reasonText) sharedReasons.push(reasonText);
        }
      });

      const matchPercent = Math.round((matchCount / totalAnswered) * 100);
      return {
        candidate: c,
        matchCount,
        matchPercent,
        sharedReasons
      };
    });

    // Sort descending by match percentage, then by ballotNumber
    candidates.sort((a, b) => {
      if (b.matchPercent !== a.matchPercent) {
        return b.matchPercent - a.matchPercent;
      }
      return (a.candidate.ballotNumber || 0) - (b.candidate.ballotNumber || 0);
    });

    resultsBox.style.display = 'block';

    const displayedCandidates = voterCompassViewMode === 'top7' ? candidates.slice(0, 7) : candidates;

    resultsGrid.innerHTML = displayedCandidates.map((item, idx) => {
      const c = item.candidate;
      const rank = idx + 1;
      const isTop7 = voterCompassViewMode === 'top7' || rank <= 7;
      const pct = item.matchPercent;
      const gaugeClass = pct >= 80 ? 'gauge-high' : (pct >= 50 ? 'gauge-mid' : 'gauge-mod');

      return `
        <article class="match-card ${isTop7 ? 'is-top7' : ''}" data-rank="${rank}">
          ${isTop7 ? `
            <div class="match-top7-badge">
              <span>★</span>
              <span>Top Match #${rank} (Ballot Recommendation)</span>
            </div>
          ` : `
            <div class="match-meta" style="margin-bottom: 8px;">
              <span>Rank #${rank} of 19 Candidates</span>
            </div>
          `}

          <div class="match-card-head">
            ${c.photoUrl ? `
              <img src="${escapeHtml(c.photoUrl)}" alt="${escapeHtml(c.name)}" class="match-avatar" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
              <div class="match-avatar" style="display: none;">${escapeHtml(c.initials)}</div>
            ` : `
              <div class="match-avatar">${escapeHtml(c.initials)}</div>
            `}
            <div class="match-info">
              <h4>${escapeHtml(c.name)}</h4>
              <div class="match-meta">
                <span>Ballot #${c.ballotNumber}</span>
                <span>•</span>
                <span>${c.status.toLowerCase() === 'incumbent' ? '🏛️ Incumbent' : '⚡ Challenger'}</span>
              </div>
            </div>
          </div>

          <div class="match-gauge-wrap">
            <div class="match-gauge-header">
              <span class="match-gauge-label">Your Match Score</span>
              <span class="match-gauge-percent ${gaugeClass}">${pct}% Match</span>
            </div>
            <div class="match-gauge-track">
              <div class="match-gauge-fill ${gaugeClass}" style="width: ${pct}%;"></div>
            </div>
          </div>

          <div class="match-shared-reasons">
            <strong>Aligned Priorities (${item.matchCount}/${totalAnswered}):</strong>
            <p>${item.sharedReasons.length > 0 ? item.sharedReasons.join(' • ') : 'Stands on differing sides of your selected priorities.'}</p>
          </div>

          <button type="button" class="match-jump-btn" data-candidate-id="${c.id}">
            <span>View Full Dossier & Stances</span>
            <span>↗</span>
          </button>
        </article>
      `;
    }).join('');

    // Wire jump buttons
    resultsGrid.querySelectorAll('.match-jump-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const candId = btn.getAttribute('data-candidate-id');
        if (!candId) return;

        let candCard = document.getElementById(`candidate-card-${candId}`);
        // If hidden due to active search/filter, reset filters first
        if (!candCard || candCard.offsetParent === null) {
          resetElectionFilters();
          candCard = document.getElementById(`candidate-card-${candId}`);
        }

        if (candCard) {
          const parentSection = candCard.closest('details.collapsible-section');
          if (parentSection) parentSection.open = true;

          const accordion = candCard.querySelector('details.candidate-accordion');
          if (accordion) accordion.open = true;

          const interviewTab = candCard.querySelector('.cand-tab-btn[data-tab="interviews"]');
          if (interviewTab) interviewTab.click();

          candCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          candCard.classList.remove('card-highlight-flash');
          void candCard.offsetWidth; // trigger reflow
          candCard.classList.add('card-highlight-flash');
        }
      });
    });
  }

  // Listeners
  if (!voterCompassInitialized) {
    voterCompassInitialized = true;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      calculateMatches();
      resultsBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    form.addEventListener('change', () => {
      calculateMatches();
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        form.reset();
        calculateMatches();
      });
    }

    if (showTop7Btn && showAllBtn) {
      showTop7Btn.addEventListener('click', () => {
        voterCompassViewMode = 'top7';
        showTop7Btn.classList.add('active');
        showAllBtn.classList.remove('active');
        calculateMatches();
      });

      showAllBtn.addEventListener('click', () => {
        voterCompassViewMode = 'all';
        showAllBtn.classList.add('active');
        showTop7Btn.classList.remove('active');
        calculateMatches();
      });
    }
  }

  // Initial calculation check if pre-filled
  calculateMatches();
}

function renderCategoryPills() {
  const container = document.getElementById('election-category-pills');
  if (!container || !cliftonElectionData) return;

  const categories = cliftonElectionData.categories || [];
  let html = `
    <button class="cat-pill-btn ${electionFilterCategory === 'all' ? 'active' : ''}" data-cat="all">
      <span>🌟</span> All Priorities
    </button>
  `;

  categories.forEach(cat => {
    const isActive = electionFilterCategory === cat.id;
    html += `
      <button class="cat-pill-btn ${isActive ? 'active' : ''}" data-cat="${cat.id}" title="${cat.shortDesc || ''}">
        <span>${cat.icon}</span> ${cat.name}
      </button>
    `;
  });

  container.innerHTML = html;

  container.querySelectorAll('.cat-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.cat-pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      electionFilterCategory = btn.getAttribute('data-cat') || 'all';
      filterAndRenderCandidates();
    });
  });
}

function filterAndRenderCandidates() {
  const grid = document.getElementById('election-candidates-grid');
  const countEl = document.getElementById('election-results-count');
  if (!grid || !cliftonElectionData) return;

  const allCandidates = cliftonElectionData.councilCandidates || [];
  const totalCount = allCandidates.length;

  const filtered = allCandidates.filter(c => {
    // 1. Status & Vetting Filter
    if (electionFilterStatus === 'incumbent' && c.status.toLowerCase() !== 'incumbent') {
      return false;
    }
    if (electionFilterStatus === 'challenger' && c.status.toLowerCase() !== 'challenger') {
      return false;
    }
    if (electionFilterStatus === 'controversy' && (!c.investigativeDossier || !c.investigativeDossier.hasDocumentedControversies)) {
      return false;
    }
    if (electionFilterStatus === 'clean' && (c.investigativeDossier && c.investigativeDossier.hasDocumentedControversies)) {
      return false;
    }

    // 2. Category Filter
    if (electionFilterCategory !== 'all') {
      if (!c.categories || !c.categories.includes(electionFilterCategory)) {
        return false;
      }
    }

    // 3. Search Query (includes platform, background, outside businesses, and controversy text)
    if (electionSearchQuery) {
      const q = electionSearchQuery;
      const dossier = c.investigativeDossier || {};
      const controversiesText = (dossier.notableControversies || []).map(nc => `${nc.title} ${nc.category} ${nc.details} ${nc.resolutionOrOutcome}`).join(' ');
      const businessesText = (dossier.outsideBusinesses || []).join(' ');

      const searchableText = [
        c.name,
        `ballot ${c.ballotNumber}`,
        `ballot ${c.ballotNumber}e`,
        `#${c.ballotNumber}`,
        `${c.ballotNumber}e`,
        c.status,
        c.role,
        c.experience,
        c.tagline,
        c.civicBackground,
        businessesText,
        dossier.disclosuresAndFDS || '',
        controversiesText,
        dossier.cleanRecordVerification || '',
        dossier.conflictOfInterestWatch || '',
        (c.quotes || []).join(' '),
        (c.keyPlatformPillars || []).map(p => `${p.title} ${p.details}`).join(' ')
      ].join(' ').toLowerCase();

      if (!searchableText.includes(q)) {
        return false;
      }
    }

    return true;
  });

  // Update count badge
  if (countEl) {
    if (filtered.length === totalCount) {
      countEl.textContent = `Showing all 19 of 19 Council Candidates`;
    } else {
      let filterDesc = '';
      if (electionFilterStatus === 'controversy') filterDesc = 'under scrutiny';
      else if (electionFilterStatus === 'clean') filterDesc = 'with verified clean records';
      else if (electionFilterStatus === 'incumbent') filterDesc = 'incumbents';
      else if (electionFilterStatus === 'challenger') filterDesc = 'challengers';
      countEl.innerHTML = `Showing <strong>${filtered.length}</strong> of ${totalCount} Candidates ${filterDesc ? '(' + filterDesc + ')' : 'matching filter'}`;
    }
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-election-state">
        <div class="empty-icon">🔎</div>
        <h4>No Candidates Match Your Filters</h4>
        <p>Try clearing your search terms or selecting "All Priorities" / "All Candidates".</p>
        <button class="action-btn-secondary" onclick="resetElectionFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  // Category map for icons and names
  const catMap = {};
  (cliftonElectionData.categories || []).forEach(cat => {
    catMap[cat.id] = cat;
  });

  let memorialHtml = '';
  if (cliftonElectionData.memorialTributes && cliftonElectionData.memorialTributes.length > 0) {
    memorialHtml = `
      <div class="memorial-tribute-wrapper">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
          <span style="font-size: 1.3rem;">🕊️</span>
          <h4 style="margin: 0; font-size: 1.1rem; color: #44403c;">In Memoriam & Distinguished Public Service</h4>
        </div>
        ${cliftonElectionData.memorialTributes.map(m => `
          <div class="memorial-card">
            <div style="font-weight: 700; color: #1c1917; font-size: 1rem;">${escapeHtml(m.name)}</div>
            <div style="font-size: 0.85rem; color: #78716c; margin-bottom: 6px;">${escapeHtml(m.title)} • ${escapeHtml(m.tenure)}</div>
            <p style="margin: 0 0 8px 0; font-size: 0.9rem; color: #44403c; line-height: 1.5;">${escapeHtml(m.tribute)}</p>
            ${(m.achievements || []).map(a => `<div style="font-size: 0.82rem; color: #57534e;">• ${escapeHtml(a)}</div>`).join('')}
          </div>
        `).join('')}
      </div>
    `;
  }

  if (electionFilterStatus === 'all' && electionFilterCategory === 'all' && !electionSearchQuery) {
    const incumbents = filtered.filter(c => c.status.toLowerCase() === 'incumbent');
    const challengers = filtered.filter(c => c.status.toLowerCase() !== 'incumbent');

    grid.innerHTML = `
      <div class="candidates-group-wrapper">
        <div class="candidates-group-header">
          <div class="group-title-lockup">
            <span class="group-icon">🏛️</span>
            <h4>Incumbent City Council Members (${incumbents.length})</h4>
            <span class="group-subtitle">Sitting officials seeking re-election • Active voting records & Mayoral race</span>
          </div>
        </div>
        <div class="candidate-cards-grid">
          ${incumbents.map(c => renderCandidateCard(c, catMap)).join('')}
        </div>
      </div>

      <div class="candidates-group-wrapper" style="margin-top: 36px;">
        <div class="candidates-group-header">
          <div class="group-title-lockup">
            <span class="group-icon">🌟</span>
            <h4>Challengers & Former Officials (${challengers.length})</h4>
            <span class="group-subtitle">Vying for 7 council seats • Former school trustees, professionals & civic leaders</span>
          </div>
        </div>
        <div class="candidate-cards-grid">
          ${challengers.map(c => renderCandidateCard(c, catMap)).join('')}
        </div>
      </div>
      ${memorialHtml}
    `;
  } else {
    grid.innerHTML = `
      <div class="candidates-group-wrapper">
        <div class="candidate-cards-grid">
          ${filtered.map(c => renderCandidateCard(c, catMap)).join('')}
        </div>
      </div>
      ${memorialHtml}
    `;
  }
}

// Helper to render individual candidate card with verified photo and 4 distinct sections
function renderCandidateCard(c, catMap) {
  const isIncumbent = c.status.toLowerCase() === 'incumbent';
  const dossier = c.investigativeDossier || { outsideBusinesses: [], notableControversies: [] };
  const hasControversy = dossier.hasDocumentedControversies;

  const categoryBadgesHtml = (c.categories || []).slice(0, 2).map(catId => {
    const cat = catMap[catId];
    if (!cat) return '';
    return `<span class="cand-cat-tag"><span>${cat.icon}</span> ${cat.name}</span>`;
  }).join('');

  const pillarsHtml = (c.keyPlatformPillars || []).map(p => {
    const cat = catMap[p.category] || { icon: '📌', name: 'Platform' };
    return `
      <div class="pillar-card">
        <div class="pillar-header">
          <span class="pillar-icon">${cat.icon}</span>
          <strong class="pillar-title">${escapeHtml(p.title)}</strong>
        </div>
        <p class="pillar-desc">${escapeHtml(p.details)}</p>
      </div>
    `;
  }).join('');

  const platformFocus = c.platformFocus || (c.quotes && c.quotes.length > 0 ? c.quotes[0] : '');
  const quotesHtml = platformFocus ? `
    <div class="candidate-platform-focus-box">
      <div class="focus-label">🎯 Stated Campaign Focus & Policy Priorities</div>
      <p class="focus-summary">${escapeHtml(platformFocus)}</p>
    </div>
  ` : '';

  // Outside businesses pills
  const businessesHtml = (dossier.outsideBusinesses && dossier.outsideBusinesses.length > 0) ?
    dossier.outsideBusinesses.map(b => `<span class="dossier-biz-pill">🏢 ${escapeHtml(b)}</span>`).join('') :
    `<span class="dossier-biz-none">No secondary commercial entity disclosed</span>`;

  // Controversies or Clean Record HTML
  let controversiesBlockHtml = '';
  if (hasControversy && dossier.notableControversies.length > 0) {
    const entriesHtml = dossier.notableControversies.map(nc => `
      <div class="dossier-controversy-entry">
        <div class="dc-head">
          <span class="dc-badge">🚨 ${escapeHtml(nc.category || 'Controversy')}</span>
          <span class="dc-era">${escapeHtml(nc.dateOrEra || '')}</span>
        </div>
        <strong class="dc-title">${escapeHtml(nc.title)}</strong>
        <p class="dc-details">${escapeHtml(nc.details)}</p>
        <div class="dc-outcome">
          <strong>Official Resolution / Response:</strong> ${escapeHtml(nc.resolutionOrOutcome)}
        </div>
      </div>
    `).join('');

    controversiesBlockHtml = `
      <div class="dossier-controversies-box">
        <div class="dossier-section-alert-head">
          <span>⚠️ Documented Public Inquiries, Censures & Legal History:</span>
        </div>
        <div class="dossier-controversies-list">
          ${entriesHtml}
        </div>
      </div>
    `;
  } else {
    controversiesBlockHtml = `
      <div class="dossier-clean-box">
        <div class="clean-box-header">
          <span class="clean-check-icon">✓</span>
          <strong>Verified Clean Public Record</strong>
        </div>
        <p>${escapeHtml(dossier.cleanRecordVerification || 'Cross-referenced against Passaic County court filings, NJ School Ethics Commission (SEC), NJ Local Finance Board (LFB), and corporate filings. Zero lawsuits, criminal findings, or municipal censures on record.')}</p>
      </div>
    `;
  }

  return `
    <article class="candidate-card ${isIncumbent ? 'is-incumbent' : 'is-challenger'} ${hasControversy ? 'has-controversies' : 'is-clean-record'}" id="candidate-card-${c.id}">
      <div class="candidate-card-header-bar">
        <span class="ballot-num">Ballot #${c.ballotNumber}E</span>
        <span class="candidate-status-tag ${isIncumbent ? 'status-incumbent' : 'status-challenger'}">
          ${isIncumbent ? '🏛️ Incumbent' : '⚡ Challenger'}
        </span>
      </div>

      <div class="candidate-card-top">
        <div class="candidate-photo-box">
          ${c.photoUrl ? `
            <img src="${escapeHtml(c.photoUrl)}" alt="${escapeHtml(c.name)}" class="candidate-photo-img" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
            <div class="candidate-avatar-fallback" aria-hidden="true" style="display: none;">${escapeHtml(c.initials)}</div>
          ` : `
            <div class="candidate-avatar-fallback" aria-hidden="true">${escapeHtml(c.initials)}</div>
          `}
        </div>

        <div class="candidate-identity">
          <h4 class="candidate-name">${escapeHtml(c.name)}</h4>
          <div class="candidate-role">${escapeHtml(c.role)}</div>
        </div>
      </div>

      <div class="candidate-tagline">
        "${escapeHtml(c.tagline)}"
      </div>

      <div class="candidate-badges-bar">
        ${hasControversy ? `
          <span class="badge-controversy-alert" title="Documented municipal censures, lawsuits, or public controversies on file">
            ⚠️ Scrutiny (${dossier.notableControversies.length})
          </span>
        ` : `
          <span class="badge-clean-record" title="Verified clean public record across court dockets and ethics filings">
            ✓ Clean Record
          </span>
        `}
        ${categoryBadgesHtml}
      </div>

      <!-- Accessible Mutually Exclusive Disclosure Accordion with Segmented Tabs -->
      <details class="disclosure candidate-accordion" name="candidate-accordion">
        <summary class="candidate-accordion-summary">
          <span class="summary-btn-text">
            <span class="summary-icon">📖</span>
            <span>Dossier, Bio & Platform</span>
          </span>
          <span class="accordion-arrow">▾</span>
        </summary>
        <div class="candidate-expanded-content">
          
          <!-- Segmented Dossier Tab Nav -->
          <div class="candidate-tab-nav" role="tablist" aria-label="Candidate Dossier Sections">
            <button type="button" class="cand-tab-btn active" data-tab="platform" role="tab" aria-selected="true">
              🎯 Platform
            </button>
            <button type="button" class="cand-tab-btn" data-tab="interviews" role="tab" aria-selected="false">
              🎙️ Interviews & Stances
            </button>
            <button type="button" class="cand-tab-btn" data-tab="history" role="tab" aria-selected="false">
              📜 Experience
            </button>
            <button type="button" class="cand-tab-btn" data-tab="dossier" role="tab" aria-selected="false">
              ⚖️ Vetting ${hasControversy ? '⚠️' : '✓'}
            </button>
            <button type="button" class="cand-tab-btn" data-tab="sources" role="tab" aria-selected="false">
              📚 Sources (${(c.verifiedSources || []).length})
            </button>
          </div>

          <div class="cand-tab-panes">
            <!-- TAB 1: Key Policy Pillars & Debate Promises -->
            <div class="cand-tab-pane active" data-pane="platform">
              <div class="candidate-pillars-list">
                ${pillarsHtml}
              </div>
              ${quotesHtml}
            </div>

            <!-- TAB: Verified Interview Stances & Q&A Summary -->
            <div class="cand-tab-pane" data-pane="interviews" style="display: none;">
              ${c.interviewStances ? `
                <div class="interview-stance-container">
                  ${c.interviewStances.interviewSource ? `
                    <div class="interview-source-badge">
                      <span>🎙️ Primary Source:</span>
                      <span>${escapeHtml(c.interviewStances.interviewSource)}</span>
                    </div>
                  ` : ''}

                  ${c.interviewStances.keyInterviewQuote ? `
                    <div class="interview-featured-quote">
                      <p>“${escapeHtml(c.interviewStances.keyInterviewQuote)}”</p>
                    </div>
                  ` : ''}

                  <div class="interview-stances-grid">
                    ${c.interviewStances.taxesAndSpending ? `
                      <div class="stance-item">
                        <div class="stance-item-header">
                          <span>💰</span>
                          <strong>Property Taxes & Spending:</strong>
                        </div>
                        <p>${escapeHtml(c.interviewStances.taxesAndSpending)}</p>
                      </div>
                    ` : ''}

                    ${c.interviewStances.zoningAndDataCenters ? `
                      <div class="stance-item">
                        <div class="stance-item-header">
                          <span>🏭</span>
                          <strong>Zoning, Warehouses & AI Data Centers:</strong>
                        </div>
                        <p>${escapeHtml(c.interviewStances.zoningAndDataCenters)}</p>
                      </div>
                    ` : ''}

                    ${c.interviewStances.floodingAndWater ? `
                      <div class="stance-item">
                        <div class="stance-item-header">
                          <span>💧</span>
                          <strong>Flooding & Water Commission (PVWC):</strong>
                        </div>
                        <p>${escapeHtml(c.interviewStances.floodingAndWater)}</p>
                      </div>
                    ` : ''}

                    ${c.interviewStances.governanceAndDecorum ? `
                      <div class="stance-item">
                        <div class="stance-item-header">
                          <span>🏛️</span>
                          <strong>Council Decorum & City Management:</strong>
                        </div>
                        <p>${escapeHtml(c.interviewStances.governanceAndDecorum)}</p>
                      </div>
                    ` : ''}

                    ${c.interviewStances.publicSafetyAndTraffic ? `
                      <div class="stance-item">
                        <div class="stance-item-header">
                          <span>🚓</span>
                          <strong>Public Safety & Traffic Calming:</strong>
                        </div>
                        <p>${escapeHtml(c.interviewStances.publicSafetyAndTraffic)}</p>
                      </div>
                    ` : ''}

                    ${c.interviewStances.cannabisLicensing ? `
                      <div class="stance-item">
                        <div class="stance-item-header">
                          <span>🌿</span>
                          <strong>Cannabis Retail & Buffer Zones:</strong>
                        </div>
                        <p>${escapeHtml(c.interviewStances.cannabisLicensing)}</p>
                      </div>
                    ` : ''}
                  </div>
                </div>
              ` : `
                <div class="interview-stance-container">
                  <p style="font-size: 0.85rem; color: #64748b; font-style: italic;">No specific video interview or forum transcript recorded yet for this candidate.</p>
                </div>
              `}
            </div>

            <!-- TAB 2: Historic Experience & Public Service Record -->
            <div class="cand-tab-pane" data-pane="history" style="display: none;">
              ${c.historicExperience ? `
                <p class="history-summary-text">${escapeHtml(c.historicExperience.summary || '')}</p>

                <!-- Chronological Career & Service Timeline -->
                <div class="history-timeline-section">
                  <span class="history-sub-title">⏳ Career & Civic Timeline:</span>
                  <div class="history-timeline-items">
                    ${(c.historicExperience.careerTimeline || []).map(t => `
                      <div class="timeline-entry">
                        <div class="timeline-period-badge">${escapeHtml(t.period)}</div>
                        <div class="timeline-content">
                          <strong class="timeline-role">${escapeHtml(t.role)}</strong>
                          <span class="timeline-org">${escapeHtml(t.organization)}</span>
                          <p class="timeline-desc">${escapeHtml(t.details)}</p>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <!-- Public Offices & Credentials -->
                ${(c.historicExperience.publicOfficesHeld && c.historicExperience.publicOfficesHeld.length > 0) ? `
                  <div class="history-col" style="margin-top: 10px;">
                    <span class="history-sub-title">🏛️ Public Offices & Appointments:</span>
                    <ul class="history-bullets-list">
                      ${c.historicExperience.publicOfficesHeld.map(o => `
                        <li>
                          <strong>${escapeHtml(o.office)}</strong> <span class="history-tenure">(${escapeHtml(o.tenure)})</span>
                          <div class="history-item-sub">${escapeHtml(o.role)}</div>
                        </li>
                      `).join('')}
                    </ul>
                  </div>
                ` : ''}

                ${(c.historicExperience.educationAndCredentials && c.historicExperience.educationAndCredentials.length > 0) ? `
                  <div class="history-col" style="margin-top: 10px;">
                    <span class="history-sub-title">🎓 Education & Credentials:</span>
                    <ul class="history-bullets-list">
                      ${c.historicExperience.educationAndCredentials.map(e => `
                        <li>${escapeHtml(e)}</li>
                      `).join('')}
                    </ul>
                  </div>
                ` : ''}

                ${(c.historicExperience.civicLeadership && c.historicExperience.civicLeadership.length > 0) ? `
                  <div class="history-civic-row" style="margin-top: 10px;">
                    <span class="history-sub-title">🤝 Civic Leadership:</span>
                    <ul class="history-civic-tags">
                      ${c.historicExperience.civicLeadership.map(l => `
                        <li class="history-civic-pill">${escapeHtml(l)}</li>
                      `).join('')}
                    </ul>
                  </div>
                ` : ''}
              ` : `
                <div class="candidate-civic-box">
                  <span class="civic-box-label">🏛️ Public Service & Civic Background:</span>
                  <p>${escapeHtml(c.civicBackground || c.experience)}</p>
                </div>
              `}
            </div>

            <!-- TAB 3: Outside Businesses, Disclosures & Recusals -->
            <div class="cand-tab-pane" data-pane="dossier" style="display: none;">
              <div class="candidate-investigative-dossier" style="margin-top: 0; border: none; padding: 0; background: transparent;">
                <div class="dossier-field">
                  <span class="dossier-label">🏢 Outside Businesses & Disclosed Employment:</span>
                  <div class="dossier-biz-wrap">
                    ${businessesHtml}
                  </div>
                </div>

                <div class="dossier-field">
                  <span class="dossier-label">📋 Financial Disclosure (FDS) Filing:</span>
                  <p class="dossier-text">${escapeHtml(dossier.disclosuresAndFDS || 'Standard Local Government Ethics Law filing.')}</p>
                </div>

                ${controversiesBlockHtml}

                <div class="dossier-field recusal-field">
                  <span class="dossier-label">🛡️ Conflict-of-Interest & Recusal Watch (N.J.S.A. 40A:9-22.1):</span>
                  <p class="dossier-recusal-text">${escapeHtml(dossier.conflictOfInterestWatch || 'Must maintain mandatory statutory recusals on related private matters.')}</p>
                </div>
              </div>
            </div>

            <!-- TAB 4: Verified Public Sources & Official Records -->
            <div class="cand-tab-pane" data-pane="sources" style="display: none;">
              <div class="candidate-sources-box" style="margin-top: 0; border: none; padding: 0; background: transparent;">
                <ul class="candidate-sources-list">
                  ${(c.verifiedSources || []).map(s => `
                    <li class="candidate-source-item">
                      <div class="source-item-top">
                        <span class="source-tag">📄 ${escapeHtml(s.title)}</span>
                        ${s.url ? `<a href="${escapeHtml(s.url)}" target="_blank" rel="noopener" class="source-ext-link">Official Record ↗</a>` : ''}
                      </div>
                      <p class="source-doc-text">${escapeHtml(s.doc)}</p>
                    </li>
                  `).join('')}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </details>
    </article>
  `;
}

function resetElectionFilters() {
  electionFilterStatus = 'all';
  electionFilterCategory = 'all';
  electionSearchQuery = '';

  const searchInput = document.getElementById('election-search-input');
  const clearBtn = document.getElementById('election-search-clear');
  if (searchInput) searchInput.value = '';
  if (clearBtn) clearBtn.style.display = 'none';

  document.querySelectorAll('.filter-group-status .filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-status') === 'all');
  });

  renderCategoryPills();
  filterAndRenderCandidates();
}

function renderControversiesSpotlight() {
  const container = document.getElementById('election-controversies-spotlight');
  if (!container || !cliftonElectionData) return;

  const candidates = cliftonElectionData.councilCandidates || [];
  const withControversy = candidates.filter(c => c.investigativeDossier && c.investigativeDossier.hasDocumentedControversies);
  const cleanCandidates = candidates.filter(c => !c.investigativeDossier || !c.investigativeDossier.hasDocumentedControversies);

  let controversyCardsHtml = '';
  withControversy.forEach((c, idx) => {
    const d = c.investigativeDossier;
    const isInc = c.status.toLowerCase() === 'incumbent';

    const businessesPills = (d.outsideBusinesses || []).map(b =>
      `<span class="biz-pill">🏢 ${escapeHtml(b)}</span>`
    ).join('');

    const controversyItems = (d.notableControversies || []).map(nc => `
      <div class="spotlight-controversy-item">
        <div class="sc-header">
          <span class="sc-badge">🚨 ${escapeHtml(nc.category || 'Controversy')}</span>
          <span class="sc-date">${escapeHtml(nc.dateOrEra || '')}</span>
        </div>
        <h5 class="sc-title">${escapeHtml(nc.title)}</h5>
        <p class="sc-details">${escapeHtml(nc.details)}</p>
        <div class="sc-outcome">
          <strong>Official Outcome / Response:</strong> ${escapeHtml(nc.resolutionOrOutcome)}
        </div>
      </div>
    `).join('');

    controversyCardsHtml += `
      <details class="spotlight-accordion-card" id="spotlight-card-${c.id}">
        <summary class="spotlight-accordion-summary">
          <div class="sp-summary-left">
            <span class="ballot-num">Ballot #${c.ballotNumber}</span>
            <span class="candidate-status-tag ${isInc ? 'status-incumbent' : 'status-challenger'}">
              ${isInc ? '🏛️ Incumbent' : '⚡ Challenger'}
            </span>
            <h4 class="spotlight-cand-name">${escapeHtml(c.name)}</h4>
            <span class="spotlight-cand-role">${escapeHtml(c.role)}</span>
          </div>
          <div class="sp-summary-right">
            <span class="sp-alert-pill">⚠️ ${(d.notableControversies || []).length} Documented Inquiries</span>
            <span class="sp-accordion-arrow">▾</span>
          </div>
        </summary>

        <div class="spotlight-accordion-content">
          <div class="spotlight-section">
            <span class="spotlight-sub-label">Disclosed Outside Businesses & Holdings:</span>
            <div class="spotlight-biz-list">
              ${businessesPills || '<span style="color: #64748b;">No outside businesses disclosed</span>'}
            </div>
          </div>

          <div class="spotlight-section">
            <span class="spotlight-sub-label">Documented Inquiries, Allegations & Legal Disputes:</span>
            <div class="spotlight-items-container">
              ${controversyItems}
            </div>
          </div>

          <div class="spotlight-recusal-box">
            <strong>Conflict-of-Interest & Recusal Watch (N.J.S.A. 40A:9-22.1):</strong>
            <p>${escapeHtml(d.conflictOfInterestWatch)}</p>
          </div>

          <div class="spotlight-sources-row">
            <span class="spotlight-sub-label">Primary Public Sources & Court Records:</span>
            <div class="sp-sources-list">
              ${(c.verifiedSources || []).map(s => `
                <a href="${escapeHtml(s.url || '#')}" target="_blank" rel="noopener" class="sp-source-pill" title="${escapeHtml(s.doc)}">
                  📄 ${escapeHtml(s.title)} ↗
                </a>
              `).join('')}
            </div>
          </div>
        </div>
      </details>
    `;
  });

  const cleanListHtml = cleanCandidates.map(c => {
    const d = c.investigativeDossier || {};
    const bizCount = (d.outsideBusinesses || []).length;
    return `
      <div class="clean-candidate-pill">
        <span class="clean-check">✓</span>
        <span class="clean-num">#${c.ballotNumber}</span>
        <strong class="clean-name">${escapeHtml(c.name)}</strong>
        <span class="clean-role-text">${escapeHtml(c.role)}</span>
        ${bizCount > 0 ? `<span class="clean-biz-tag" title="${escapeHtml((d.outsideBusinesses || []).join(', '))}">🏢 ${bizCount} entity</span>` : ''}
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <!-- Top Stats Counter -->
    <div class="spotlight-stats-banner">
      <div class="sp-stat">
        <span class="sp-num">${candidates.length}</span>
        <span class="sp-label">Candidates Vetted</span>
      </div>
      <div class="sp-stat sp-alert">
        <span class="sp-num">${withControversy.length}</span>
        <span class="sp-label">Documented Inquiries / Censures</span>
      </div>
      <div class="sp-stat sp-clean">
        <span class="sp-num">${cleanCandidates.length}</span>
        <span class="sp-label">Verified Clean Records</span>
      </div>
      <div class="sp-stat">
        <span class="sp-num">100%</span>
        <span class="sp-label">Health Benefits Declined</span>
      </div>
    </div>

    <!-- Active Inquiries Grid (6 Candidates) -->
    <div class="spotlight-sub-header-row">
      <h4 class="spotlight-group-title" style="margin: 0;">
        ⚠️ Candidates with Documented Public Inquiries, Censures, or Legal Disputes (${withControversy.length})
      </h4>
      <span class="spotlight-sub-hint">Click any candidate to expand full dossier & court findings</span>
    </div>
    <div class="spotlight-accordions-stack">
      ${controversyCardsHtml}
    </div>

    <!-- Clean Records Summary (13 Candidates) -->
    <div class="spotlight-clean-section">
      <div class="spotlight-sub-header-row">
        <h4 class="spotlight-group-title" style="color: #15803d; margin: 0;">
          ✓ Candidates with Verified Clean Public Records (${cleanCandidates.length})
        </h4>
        <span class="spotlight-sub-hint" style="color: #15803d;">Cross-referenced against ${escapeHtml(cliftonElectionData.county || 'County')} courts, NJ SEC, & LFB filings</span>
      </div>
      <div class="clean-summary-grid">
        ${cleanListHtml}
      </div>
    </div>
  `;
}

function renderPlatformMatrix() {
  const table = document.getElementById('election-matrix-table');
  if (!table || !cliftonElectionData) return;

  const candidates = cliftonElectionData.councilCandidates || [];

  let thead = `
    <thead>
      <tr>
        <th scope="col" style="min-width: 170px;">Candidate & Ballot #</th>
        <th scope="col" style="min-width: 110px;">Status</th>
        <th scope="col" style="min-width: 190px;">💰 Taxes & Spending Stance</th>
        <th scope="col" style="min-width: 190px;">🏗️ Flooding & PVWC Water</th>
        <th scope="col" style="min-width: 190px;">🏡 Zoning & Data Centers</th>
        <th scope="col" style="min-width: 180px;">⚖️ Dais Decorum</th>
        <th scope="col" style="min-width: 120px;">🌿 Health Waiver</th>
      </tr>
    </thead>
  `;

  let tbody = '<tbody>';
  candidates.forEach(c => {
    const isInc = c.status.toLowerCase() === 'incumbent';

    const taxPillar = (c.keyPlatformPillars || []).find(p => p.category === 'taxes');
    const floodPillar = (c.keyPlatformPillars || []).find(p => p.category === 'infrastructure');
    const housePillar = (c.keyPlatformPillars || []).find(p => p.category === 'housing');
    const govPillar = (c.keyPlatformPillars || []).find(p => p.category === 'governance');

    const taxSummary = taxPillar ? taxPillar.title : 'Fiscal constraint & budget review';
    const floodSummary = floodPillar ? floodPillar.title : 'PVWC water main upgrades & Third River desilting';
    const houseSummary = housePillar ? housePillar.title : 'Protect suburban zoning; anti-data center sprawl';
    const govSummary = govPillar ? govPillar.title : 'Restoring civility & administrative stability';

    tbody += `
      <tr>
        <td>
          <div class="matrix-candidate-cell">
            <span class="matrix-ballot-badge">#${c.ballotNumber}</span>
            <div>
              <strong>${escapeHtml(c.name)}</strong>
              <small class="matrix-role-sub">${escapeHtml(c.role)}</small>
            </div>
          </div>
        </td>
        <td>
          <span class="candidate-status-tag ${isInc ? 'status-incumbent' : 'status-challenger'}">
            ${isInc ? '🏛️ Incumbent' : '⚡ Challenger'}
          </span>
        </td>
        <td>
          <div class="matrix-pillar-text">
            <strong>${escapeHtml(taxSummary)}</strong>
            <p class="matrix-p-condensed" title="${escapeHtml(taxPillar ? taxPillar.details : '')}">${taxPillar ? escapeHtml(taxPillar.details) : 'Line-item oversight and grant revenue capture.'}</p>
          </div>
        </td>
        <td>
          <div class="matrix-pillar-text">
            <strong>${escapeHtml(floodSummary)}</strong>
            <p class="matrix-p-condensed" title="${escapeHtml(floodPillar ? floodPillar.details : '')}">${floodPillar ? escapeHtml(floodPillar.details) : 'Third River detention and quarterly water testing.'}</p>
          </div>
        </td>
        <td>
          <div class="matrix-pillar-text">
            <strong>${escapeHtml(houseSummary)}</strong>
            <p class="matrix-p-condensed" title="${escapeHtml(housePillar ? housePillar.details : '')}">${housePillar ? escapeHtml(housePillar.details) : 'Rigorous code enforcement on illegal rental conversions.'}</p>
          </div>
        </td>
        <td>
          <div class="matrix-pillar-text">
            <strong>${escapeHtml(govSummary)}</strong>
            <p class="matrix-p-condensed" title="${escapeHtml(govPillar ? govPillar.details : '')}">${govPillar ? escapeHtml(govPillar.details) : 'Encouraging public comment and respectful council workshops.'}</p>
          </div>
        </td>
        <td>
          <span class="matrix-pledge-badge" title="Pledged to decline city medical benefits">
            ✓ Declined
          </span>
        </td>
      </tr>
    `;
  });
  tbody += '</tbody>';

  table.innerHTML = thead + tbody;
}

// Render Complete Clifton Ballot Architecture & Offices Overview
function renderBallotOverview() {
  const container = document.getElementById('election-ballot-overview-grid');
  if (!container || !cliftonElectionData) return;

  let offices = [];
  if (cliftonElectionData.ballotArchitecture && cliftonElectionData.ballotArchitecture.offices) {
    offices = cliftonElectionData.ballotArchitecture.offices;
  } else {
    const m = cliftonElectionData.municipality || 'Local';
    const c = cliftonElectionData.county || 'County';
    const cands = cliftonElectionData.councilCandidates || [];
    const boe = cliftonElectionData.boeCandidates || (cliftonElectionData.boeElection?.candidates) || [];

    if (cands.length > 0) {
      offices.push({
        id: `${m.toLowerCase()}-muni`,
        office: `${m} Municipal / Local Representation`,
        level: `Municipal (${m})`,
        seatsAvailable: cliftonElectionData.totalCouncilSeats || 1,
        candidatesRunning: cands.length,
        voteRule: `Vote for up to ${cliftonElectionData.totalCouncilSeats || 1}`,
        termLength: '3 to 4 Years',
        taxShare: 'Municipal Budget Share',
        description: cliftonElectionData.councilStructure || 'Oversees municipal services, police, DPW, and local ordinances.',
        badgeColor: 'var(--color-city)'
      });
    }

    if (boe.length > 0) {
      offices.push({
        id: `${m.toLowerCase()}-boe`,
        office: `${m} School Board (Board of Education)`,
        level: 'School District',
        seatsAvailable: cliftonElectionData.boeElection?.seatsAvailable || 3,
        candidatesRunning: boe.length,
        voteRule: 'Vote for up to 3',
        termLength: '3-Year Full Term (2027–2029)',
        taxShare: 'School District Levy',
        description: cliftonElectionData.boeElection?.budgetOverview || 'Oversees public schools, student curriculum, facilities, and school district operating budget.',
        badgeColor: 'var(--color-school)'
      });
    }

    offices.push({
      id: `${c.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-commissioners`,
      office: `${c} Board of County Commissioners`,
      level: `Countywide (${c})`,
      seatsAvailable: 1,
      candidatesRunning: 2,
      voteRule: 'Vote for 1',
      termLength: '3 Years (2027–2029)',
      taxShare: `${c} Tax Share`,
      description: `Governs ${c} government, county roads, county parks, social services, and county college.`,
      badgeColor: 'var(--color-county)'
    });

    offices.push({
      id: 'us-senate-fed',
      office: 'United States Senate (New Jersey)',
      level: 'Federal (Statewide New Jersey)',
      seatsAvailable: 1,
      candidatesRunning: cliftonElectionData.njCandidates?.usSenate?.candidates?.length || 2,
      voteRule: 'Vote for 1',
      termLength: '6 Years (2027–2033)',
      taxShare: 'Federal Grants & Tax Policy (SALT Deduction)',
      description: 'Represents all New Jersey residents in the U.S. Senate in Washington, D.C.',
      badgeColor: '#1d4ed8'
    });

    if (cliftonElectionData.njCandidates?.usHouse) {
      const house = cliftonElectionData.njCandidates.usHouse;
      offices.push({
        id: 'us-house-fed',
        office: house.office || 'U.S. House of Representatives',
        level: house.badge || 'Federal (U.S. House)',
        seatsAvailable: 1,
        candidatesRunning: house.candidates ? house.candidates.length : 2,
        voteRule: house.voteRule || 'Vote for 1',
        termLength: house.term || '2 Years (2027–2029)',
        taxShare: 'Federal Appropriations & Flood Mitigation',
        description: house.importance || `Represents ${m} and North Jersey in the U.S. House of Representatives.`,
        badgeColor: '#2563eb'
      });
    }
  }

  let html = '';
  offices.forEach(o => {
    html += `
      <div class="ballot-office-card">
        <div class="ballot-office-top">
          <span class="ballot-office-level">${escapeHtml(o.level)}</span>
          <span class="ballot-vote-pill" style="border-color: ${o.badgeColor}; color: ${o.badgeColor};">
            ${escapeHtml(o.voteRule)}
          </span>
        </div>
        <h4 class="ballot-office-title">${escapeHtml(o.office)}</h4>
        <div class="ballot-office-meta">
          <span class="meta-tag">Seats Up: <strong>${o.seatsAvailable}</strong></span>
          <span class="meta-tag">Candidates: <strong>${o.candidatesRunning}</strong></span>
          <span class="meta-tag">Term: <strong>${escapeHtml(o.termLength)}</strong></span>
        </div>
        <div class="ballot-office-tax">
          <strong>Tax Connection:</strong> ${escapeHtml(o.taxShare)}
        </div>
        <p class="ballot-office-desc">${escapeHtml(o.description)}</p>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Render Clifton Board of Education Candidates (2026 General Election)
function renderBoeCandidates() {
  const container = document.getElementById('election-boe-grid');
  if (!container || !cliftonElectionData) return;

  const boeList = cliftonElectionData.boeCandidates || [];
  let html = '';

  boeList.forEach(b => {
    const isInc = b.status.toLowerCase().includes('incumbent');
    const isFormer = b.status.toLowerCase().includes('former');
    const isUnexpired = b.seatType && b.seatType.toLowerCase().includes('unexpired');
    html += `
      <div class="boe-card ${isUnexpired ? 'boe-card-unexpired' : ''}">
        <div class="boe-card-header">
          <div class="boe-badge-row">
            <span class="boe-school-badge">${isUnexpired ? '🏫 BOE • 1-Yr Unexpired' : '🏫 BOE • 3-Yr Full Term'}</span>
            <div class="boe-badges-right" style="display: flex; align-items: center; gap: 5px;">
              ${b.ballotNumber ? `<span class="ballot-num">Ballot #${b.ballotNumber}</span>` : ''}
              <span class="candidate-status-tag ${isInc ? 'status-incumbent' : 'status-challenger'}">
                ${isInc ? '🏛️ Incumbent Trustee' : (isFormer ? '🏛️ Former BOE Trustee' : '⚡ Challenger')}
              </span>
            </div>
          </div>
          <div class="boe-vote-instruction ${isUnexpired ? 'instruction-unexpired' : ''}">
            ${escapeHtml(b.term || 'Vote for up to 3 • 3-Year Term (2027–2029)')}
          </div>
          <h4 class="boe-name">${escapeHtml(b.name)}</h4>
          <div class="boe-slogan">"${escapeHtml(b.ballotSlogan)}"</div>
        </div>

        <div class="boe-card-details">
          ${b.experience ? `
            <div class="boe-detail-row">
              <span class="boe-detail-label">Background & Service:</span>
              <span class="boe-detail-val">${escapeHtml(b.experience)}</span>
            </div>
          ` : ''}

          <div class="boe-card-body">
            <div class="boe-focus-title">Key Educational Priorities:</div>
            <p class="boe-focus-text">${escapeHtml(b.keyFocus)}</p>
          </div>

          ${b.fiscalStance ? `
            <div class="boe-priority-box boe-fiscal-box">
              <div class="boe-priority-header">💰 Fiscal & Taxpayer Stance ($293.4M Budget):</div>
              <p class="boe-priority-text">${escapeHtml(b.fiscalStance)}</p>
            </div>
          ` : ''}

          ${b.infrastructureStance ? `
            <div class="boe-priority-box boe-infra-box">
              <div class="boe-priority-header">🏫 Facilities, HVAC & Safety:</div>
              <p class="boe-priority-text">${escapeHtml(b.infrastructureStance)}</p>
            </div>
          ` : ''}

          ${b.interviewStances ? `
            <div class="boe-priority-box" style="background: #f0fdf4; border-left: 3px solid #16a34a; margin-top: 10px;">
              <div class="boe-priority-header" style="color: #15803d;">🎙️ Interview & Public Forum Stance:</div>
              ${b.interviewStances.keyInterviewQuote ? `<p style="font-style: italic; font-size: 0.82rem; margin: 4px 0 6px; color: #166534; line-height: 1.45;">“${escapeHtml(b.interviewStances.keyInterviewQuote)}”</p>` : ''}
              <p class="boe-priority-text" style="font-size: 0.78rem; color: #14532d; line-height: 1.4;">${escapeHtml(b.interviewStances.keyPriorities || b.interviewStances.facilitiesAndBudget || '')}</p>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Render New Jersey Statewide & Passaic County Candidates
function renderNjCandidates() {
  const container = document.getElementById('election-nj-candidates-container');
  if (!container || !cliftonElectionData || !cliftonElectionData.njCandidates) return;

  const meta = CITY_REGISTRY[currentCity] || CITY_REGISTRY.clifton;
  const nj = cliftonElectionData.njCandidates;
  let html = `
    <div class="nj-offices-stack">
      <!-- 1. U.S. Senate -->
      <div class="nj-office-block">
        <div class="nj-office-header">
          <div class="nj-office-title-row">
            <span class="office-flag-icon">🇺🇸</span>
            <div>
              <h4>${escapeHtml(nj.usSenate.office)}</h4>
              <div class="nj-office-meta">
                <span>${escapeHtml(nj.usSenate.term)}</span>
                <span>•</span>
                <span class="highlight-vote-rule">${escapeHtml(nj.usSenate.voteRule)}</span>
              </div>
            </div>
          </div>
          <span class="nj-office-badge federal-badge">Federal Statewide</span>
        </div>
        <p class="nj-office-importance">${escapeHtml(nj.usSenate.importance)}</p>
        <div class="nj-candidates-subgrid">
          ${nj.usSenate.candidates.map(c => `
            <div class="nj-candidate-card">
              <div class="nj-cand-top">
                <span class="nj-party-pill ${c.party.toLowerCase().includes('democrat') ? 'party-dem' : (c.party.toLowerCase().includes('republican') ? 'party-rep' : 'party-ind')}">${escapeHtml(c.party)}</span>
                <span class="candidate-status-tag ${c.status.toLowerCase().includes('incumbent') ? 'status-incumbent' : 'status-challenger'}">${escapeHtml(c.status)}</span>
              </div>
              <h5 class="nj-cand-name">${escapeHtml(c.name)}</h5>
              <div class="nj-cand-role">${escapeHtml(c.role)}</div>
              <div class="nj-cand-section">
                <div class="nj-section-label">Key Platform & Legislative Priorities:</div>
                <p>${escapeHtml(c.keyPriorities)}</p>
              </div>
              ${c.localImpact ? `
                <div class="nj-cand-section local-impact-box">
                  <div class="nj-section-label">📍 ${escapeHtml(meta.name)} & Regional Direct Impact:</div>
                  <p>${escapeHtml(c.localImpact)}</p>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 2. U.S. House -->
      <div class="nj-office-block" style="margin-top: 24px;">
        <div class="nj-office-header">
          <div class="nj-office-title-row">
            <span class="office-flag-icon">🏛️</span>
            <div>
              <h4>${escapeHtml(nj.usHouse.office)}</h4>
              <div class="nj-office-meta">
                <span>${escapeHtml(nj.usHouse.term)}</span>
                <span>•</span>
                <span class="highlight-vote-rule">${escapeHtml(nj.usHouse.voteRule)}</span>
              </div>
            </div>
          </div>
          <span class="nj-office-badge federal-badge">${escapeHtml(nj.usHouse.badge || 'U.S. Congressional District')}</span>
        </div>
        <p class="nj-office-importance">${escapeHtml(nj.usHouse.importance)}</p>
        <div class="nj-candidates-subgrid">
          ${nj.usHouse.candidates.map(c => `
            <div class="nj-candidate-card">
              <div class="nj-cand-top">
                <span class="nj-party-pill ${c.party.toLowerCase().includes('democrat') ? 'party-dem' : (c.party.toLowerCase().includes('republican') ? 'party-rep' : 'party-ind')}">${escapeHtml(c.party)}</span>
                <span class="candidate-status-tag ${c.status.toLowerCase().includes('incumbent') ? 'status-incumbent' : 'status-challenger'}">${escapeHtml(c.status)}</span>
              </div>
              <h5 class="nj-cand-name">${escapeHtml(c.name)}</h5>
              <div class="nj-cand-role">${escapeHtml(c.role)}</div>
              <div class="nj-cand-section">
                <div class="nj-section-label">Key Platform & Legislative Priorities:</div>
                <p>${escapeHtml(c.keyPriorities)}</p>
              </div>
              ${c.localImpact ? `
                <div class="nj-cand-section local-impact-box">
                  <div class="nj-section-label">📍 ${escapeHtml(meta.name)} & District Priorities:</div>
                  <p>${escapeHtml(c.localImpact)}</p>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 3. County Commissioners / Executive -->
      ${nj.passaicCountyCommissionersFull ? `
      <div class="nj-office-block" style="margin-top: 24px;">
        <div class="nj-office-header">
          <div class="nj-office-title-row">
            <span class="office-flag-icon">⚖️</span>
            <div>
              <h4>${escapeHtml(nj.passaicCountyCommissionersFull.office)}</h4>
              <div class="nj-office-meta">
                <span>${escapeHtml(nj.passaicCountyCommissionersFull.term)}</span>
                <span>•</span>
                <span class="highlight-vote-rule">${escapeHtml(nj.passaicCountyCommissionersFull.voteRule)}</span>
              </div>
            </div>
          </div>
          <span class="nj-office-badge county-badge">${escapeHtml(cliftonElectionData.county || 'County')} Government</span>
        </div>
        <p class="nj-office-importance">${escapeHtml(nj.passaicCountyCommissionersFull.importance)}</p>
        <div class="nj-candidates-subgrid">
          ${nj.passaicCountyCommissionersFull.candidates.map(c => `
            <div class="nj-candidate-card">
              <div class="nj-cand-top">
                <span class="nj-party-pill ${c.party.toLowerCase().includes('democrat') ? 'party-dem' : 'party-rep'}">${escapeHtml(c.party)}</span>
                <span class="candidate-status-tag ${c.status.toLowerCase().includes('incumbent') ? 'status-incumbent' : 'status-challenger'}">${escapeHtml(c.status)}</span>
              </div>
              <h5 class="nj-cand-name">${escapeHtml(c.slate || c.name)}</h5>
              ${c.candidates ? `<div class="nj-cand-role">Candidates: ${escapeHtml(c.candidates.join(' • '))}</div>` : (c.role ? `<div class="nj-cand-role">${escapeHtml(c.role)}</div>` : '')}
              <div class="nj-cand-section">
                <div class="nj-section-label">County Platform & Taxpayer Priorities:</div>
                <p>${escapeHtml(c.keyPriorities || c.tagline || '')}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>` : ''}

      <!-- 4. County Commissioners (1-Year Unexpired Term) -->
      ${nj.passaicCountyCommissionersUnexpired ? `
      <div class="nj-office-block" style="margin-top: 24px;">
        <div class="nj-office-header">
          <div class="nj-office-title-row">
            <span class="office-flag-icon">⚖️</span>
            <div>
              <h4>${escapeHtml(nj.passaicCountyCommissionersUnexpired.office)}</h4>
              <div class="nj-office-meta">
                <span>${escapeHtml(nj.passaicCountyCommissionersUnexpired.term)}</span>
                <span>•</span>
                <span class="highlight-vote-rule">${escapeHtml(nj.passaicCountyCommissionersUnexpired.voteRule)}</span>
              </div>
            </div>
          </div>
          <span class="nj-office-badge county-badge">1-Year Unexpired Term</span>
        </div>
        <p class="nj-office-importance">${escapeHtml(nj.passaicCountyCommissionersUnexpired.importance)}</p>
        <div class="nj-candidates-subgrid">
          ${nj.passaicCountyCommissionersUnexpired.candidates.map(c => `
            <div class="nj-candidate-card">
              <div class="nj-cand-top">
                <span class="nj-party-pill ${c.party.toLowerCase().includes('democrat') ? 'party-dem' : 'party-rep'}">${escapeHtml(c.party)}</span>
                <span class="candidate-status-tag ${c.status.toLowerCase().includes('incumbent') ? 'status-incumbent' : 'status-challenger'}">${escapeHtml(c.status)}</span>
              </div>
              <h5 class="nj-cand-name">${escapeHtml(c.name)}</h5>
              <div class="nj-cand-role">${escapeHtml(c.role)}</div>
              <div class="nj-cand-section">
                <div class="nj-section-label">Platform Priorities:</div>
                <p>${escapeHtml(c.keyPriorities)}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>` : ''}

      <!-- 5. County Surrogate -->
      ${nj.passaicCountySurrogate ? `
      <div class="nj-office-block" style="margin-top: 24px;">
        <div class="nj-office-header">
          <div class="nj-office-title-row">
            <span class="office-flag-icon">📜</span>
            <div>
              <h4>${escapeHtml(nj.passaicCountySurrogate.office)}</h4>
              <div class="nj-office-meta">
                <span>${escapeHtml(nj.passaicCountySurrogate.term)}</span>
                <span>•</span>
                <span class="highlight-vote-rule">${escapeHtml(nj.passaicCountySurrogate.voteRule)}</span>
              </div>
            </div>
          </div>
          <span class="nj-office-badge county-badge">County Constitutional Officer</span>
        </div>
        <p class="nj-office-importance">${escapeHtml(nj.passaicCountySurrogate.importance)}</p>
        <div class="nj-candidates-subgrid">
          ${nj.passaicCountySurrogate.candidates.map(c => `
            <div class="nj-candidate-card">
              <div class="nj-cand-top">
                <span class="nj-party-pill ${c.party.toLowerCase().includes('democrat') ? 'party-dem' : 'party-rep'}">${escapeHtml(c.party)}</span>
                <span class="candidate-status-tag ${c.status.toLowerCase().includes('incumbent') ? 'status-incumbent' : 'status-challenger'}">${escapeHtml(c.status)}</span>
              </div>
              <h5 class="nj-cand-name">${escapeHtml(c.name)}</h5>
              <div class="nj-cand-role">${escapeHtml(c.role)}</div>
              <div class="nj-cand-section">
                <div class="nj-section-label">Judicial & Estate Service Priorities:</div>
                <p>${escapeHtml(c.keyPriorities)}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>` : ''}

      <!-- 6. Passaic County Sheriff Notice (Off-Cycle) -->
      ${nj.sheriffNotice ? `
        <div class="nj-office-block off-cycle-notice-block" style="margin-top: 24px; border-left: 4px solid #64748b; background: rgba(100, 116, 139, 0.05);">
          <div class="nj-office-header">
            <div class="nj-office-title-row">
              <span class="office-flag-icon">🛡️</span>
              <div>
                <h4>${escapeHtml(nj.sheriffNotice.office)}</h4>
                <div class="nj-office-meta">
                  <span>${escapeHtml(nj.sheriffNotice.term)}</span>
                  <span>•</span>
                  <span class="highlight-vote-rule" style="background: #e2e8f0; color: #475569;">${escapeHtml(nj.sheriffNotice.status)}</span>
                </div>
              </div>
            </div>
            <span class="nj-office-badge" style="background: #64748b; color: #fff;">Off-Cycle</span>
          </div>
          <p class="nj-office-importance" style="margin-top: 8px; color: var(--text-secondary);">${escapeHtml(nj.sheriffNotice.notice)}</p>
        </div>
      ` : ''}
    </div>
  `;

  container.innerHTML = html;
}

function renderVotingGuide() {
  const container = document.getElementById('election-voting-guide');
  if (!container || !cliftonElectionData) return;

  const res = cliftonElectionData.votingResources;
  if (!res) return;

  const dropboxesHtml = (res.mailInDropboxes || []).map(box => `
    <li class="dropbox-item">
      <div class="dropbox-icon">📬</div>
      <div class="dropbox-info">
        <strong>${escapeHtml(box.name)}</strong>
        <span>${escapeHtml(box.address)}</span>
        <small class="dropbox-notes">${escapeHtml(box.notes || '')}</small>
      </div>
    </li>
  `).join('');

  container.innerHTML = `
    <div class="voting-guide-grid">
      <!-- Card 1: Key Dates & Hours -->
      <div class="voting-card">
        <div class="voting-card-header">
          <span class="voting-card-icon">🗓️</span>
          <div>
            <h4>Election Day & Early Voting</h4>
            <span class="voting-sub">In-Person Voting Schedule</span>
          </div>
        </div>
        <div class="voting-card-body">
          <div class="voting-fact-item">
            <span class="v-label">Election Day:</span>
            <span class="v-val"><strong>Tuesday, November 3, 2026</strong></span>
          </div>
          <div class="voting-fact-item">
            <span class="v-label">Polling Hours:</span>
            <span class="v-val font-mono"><strong>6:00 AM – 8:00 PM EST</strong></span>
          </div>
          <div class="voting-fact-item">
            <span class="v-label">Early In-Person:</span>
            <span class="v-val">${escapeHtml(res.earlyVotingPeriod || 'Late October – Early November 2026')}</span>
          </div>
          <div class="voting-fact-item">
            <span class="v-label">Early Voting Site:</span>
            <span class="v-val"><strong>${escapeHtml(res.earlyVotingLocation || `${cliftonElectionData.municipality || 'Municipal'} Community / Municipal Center`)}</strong></span>
          </div>
          <div class="voting-link-row" style="margin-top: 14px;">
            <a href="${escapeHtml(res.passaicCountyElections.voterRegistrationLookup)}" target="_blank" rel="noopener" class="external-pill-link">
              Find Your Assigned Polling Place (SVRS NJ) ↗
            </a>
          </div>
        </div>
      </div>

      <!-- Card 2: Secure Mail-In Drop Boxes -->
      <div class="voting-card">
        <div class="voting-card-header">
          <span class="voting-card-icon">📫</span>
          <div>
            <h4>Official 24/7 Mail-In Drop Boxes</h4>
            <span class="voting-sub">${escapeHtml(cliftonElectionData.county || 'County')} Board of Elections</span>
          </div>
        </div>
        <div class="voting-card-body">
          <p class="dropbox-explainer">Voters may deposit their sealed Mail-In Ballot into any of these secure, video-monitored drop boxes up until <strong>8:00 PM on Election Night</strong>:</p>
          <ul class="dropbox-list">
            ${dropboxesHtml}
          </ul>
        </div>
      </div>

      <!-- Card 3: Municipal Clerk & Election Officials -->
      <div class="voting-card" style="grid-column: 1 / -1;">
        <div class="voting-card-header">
          <span class="voting-card-icon">🏛️</span>
          <div>
            <h4>${escapeHtml(cliftonElectionData.municipality || 'Municipal')} Clerk & ${escapeHtml(cliftonElectionData.county || 'County')} Election Administration</h4>
            <span class="voting-sub">Official Questions & Ballot Inquiries</span>
          </div>
        </div>
        <div class="voting-card-body">
          <div class="clerk-info-row">
            <div class="clerk-info-item">
              <span class="v-label">Municipal Clerk:</span>
              <span class="v-val"><strong>${escapeHtml(res.municipalClerk.name)}</strong> (${escapeHtml(res.municipalClerk.title)})</span>
            </div>
            <div class="clerk-info-item">
              <span class="v-label">Clerk Office:</span>
              <span class="v-val">${escapeHtml(res.municipalClerk.office)} • ${escapeHtml(res.municipalClerk.phone)}</span>
            </div>
            <div class="clerk-info-item">
              <span class="v-label">Direct Email:</span>
              <span class="v-val"><a href="mailto:${escapeHtml(res.municipalClerk.email)}" class="email-link">${escapeHtml(res.municipalClerk.email)}</a></span>
            </div>
            <div class="clerk-info-item">
              <span class="v-label">County Elections:</span>
              <span class="v-val">${escapeHtml(res.passaicCountyElections.superintendent)} • ${escapeHtml(res.passaicCountyElections.phone)}</span>
            </div>
          </div>
          <div class="voting-links-flex" style="margin-top: 16px;">
            <a href="${escapeHtml(res.passaicCountyElections.website)}" target="_blank" rel="noopener" class="external-pill-link">
              ${escapeHtml(cliftonElectionData.county || 'County')} Clerk Elections Portal ↗
            </a>
            <a href="mailto:${escapeHtml(res.municipalClerk.email)}" class="external-pill-link">
              Contact ${escapeHtml(res.municipalClerk.name)} (${escapeHtml(cliftonElectionData.municipality || 'Municipal')} Clerk) ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Global window attachment for inline button onclick
window.resetElectionFilters = resetElectionFilters;

// Launch
document.addEventListener('DOMContentLoaded', initApp);

