/* ============================================================
   FinCalc Pro — professional-calculators.js
   CA / CS / CMA tools: entity taxation, GST, TDS/TCS, ROC fees
   and depreciation — aligned to the Income Tax Act, 2025 (FY
   2026-27) and the Companies Act, 2013 / CGST Act, 2017 where
   noted. Loaded after tax-calculators.js — appends into the
   shared EXTRA_CALC_DEFS registry using the same generic engine.

   These are educational approximations of well-established rate
   structures, not a substitute for professional advice — rates
   are revised in each Union Budget, so figures should always be
   verified against the current Finance Act before filing.
   ============================================================ */

const PROFESSIONAL_CALC_DEFS = [

  /* ---- HUF tax (same slabs as an individual, no Section 87A rebate) ---- */
  {
    id: 'huf-tax', name: 'HUF Tax Calculator', cat: 'business',
    desc: 'HUF tax under old or new regime slabs (no 87A rebate)',
    inputs: [
      { id: 'income', label: 'HUF Total Income (₹)', min: 0, max: 10000000, step: 10000, def: 1200000 },
      { id: 'regime', label: 'Tax Regime', type: 'select', options: [['new', 'New Regime (IT Act 2025)'], ['old', 'Old Regime']], def: 'new' },
      { id: 'c80c', label: 'Section 80C (Old Regime Only) (₹)', min: 0, max: 150000, step: 5000, def: 150000 },
    ],
    mainLabel: 'Tax Payable',
    compute(v) {
      const isNew = v.regime === 'new' || isNaN(v.regime);
      let taxableIncome, res;
      if (isNew) {
        taxableIncome = v.income; /* HUFs get no standard deduction (no salary) */
        res = FC.applySurchargeAndCess(FC.newRegimeSlabTax, taxableIncome, [
          { threshold: 5000000, rate: 0.10 }, { threshold: 10000000, rate: 0.15 }, { threshold: 20000000, rate: 0.25 },
        ]);
      } else {
        taxableIncome = Math.max(0, v.income - Math.min(v.c80c, 150000));
        res = FC.applySurchargeAndCess(FC.oldRegimeSlabTax, taxableIncome, [
          { threshold: 5000000, rate: 0.10 }, { threshold: 10000000, rate: 0.15 }, { threshold: 20000000, rate: 0.25 }, { threshold: 50000000, rate: 0.37 },
        ]);
      }
      return {
        main: FC.formatINR(res.total),
        items: [
          { label: 'Taxable Income', value: FC.formatINR(taxableIncome) },
          { label: 'Surcharge', value: FC.formatINR(res.surcharge) },
          { label: 'Health & Education Cess (4%)', value: FC.formatINR(res.cess) },
          { label: 'Effective Tax Rate', value: v.income > 0 ? ((res.total / v.income) * 100).toFixed(2) + '%' : '0%' },
        ],
        explain: `A Hindu Undivided Family (HUF) is taxed as a separate person using the same ${isNew ? 'new regime' : 'old regime'} slab rates as an individual, but it does not get the Section 87A rebate available to individuals. On a taxable income of ${FC.formatINR(taxableIncome)}, tax payable is ${FC.formatINR(res.total)} including ${FC.formatINR(res.cess)} cess${res.surcharge > 0 ? ` and ${FC.formatINR(res.surcharge)} surcharge` : ''}. As per Income Tax Act, 2025 — Section 2(31) read with the applicable slab schedule.`,
      };
    },
  },

  /* ---- Partnership Firm / LLP tax (flat 30%) ---- */
  {
    id: 'partnership-llp-tax', name: 'Partnership Firm / LLP Tax Calculator', cat: 'business',
    desc: 'Flat 30% tax with surcharge above ₹1 crore',
    inputs: [
      { id: 'income', label: 'Total Income (₹)', min: 0, max: 50000000, step: 50000, def: 2000000 },
      { id: 'remuneration', label: 'Partner Remuneration Already Deducted (₹)', min: 0, max: 10000000, step: 50000, def: 0 },
    ],
    mainLabel: 'Tax Payable',
    compute(v) {
      const taxableIncome = Math.max(0, v.income);
      const res = FC.applySurchargeAndCess((x) => x * 0.30, taxableIncome, [{ threshold: 10000000, rate: 0.12 }]);
      return {
        main: FC.formatINR(res.total),
        items: [
          { label: 'Base Tax (30%)', value: FC.formatINR(res.baseTax) },
          { label: 'Surcharge (12% above ₹1 Cr)', value: FC.formatINR(res.surcharge) },
          { label: 'Health & Education Cess (4%)', value: FC.formatINR(res.cess) },
          { label: 'Net Income After Tax', value: FC.formatINR(taxableIncome - res.total) },
        ],
        explain: `Partnership firms and LLPs are taxed at a flat 30% (no slabs), plus a 12% surcharge once total income crosses ₹1 crore, plus 4% cess. Partner remuneration and interest, if within Section 40(b) limits, are already deducted before arriving at firm income. On ${FC.formatINR(taxableIncome)} taxable income, total tax payable is ${FC.formatINR(res.total)}. As per Income Tax Act, 2025 — Section 2(23) read with the firm tax rate schedule.`,
      };
    },
  },

  /* ---- Company tax with MAT ---- */
  {
    id: 'company-tax', name: 'Company Tax Calculator (with MAT)', cat: 'business',
    desc: '115BAA concessional rate vs regular regime, with MAT floor',
    inputs: [
      { id: 'income', label: 'Total Taxable Income (₹)', min: 0, max: 500000000, step: 100000, def: 10000000 },
      { id: 'bookProfit', label: 'Book Profit for MAT (₹)', min: 0, max: 500000000, step: 100000, def: 15000000 },
      { id: 'turnoverCr', label: 'Turnover in Relevant Prior Year (₹ Crore)', min: 0, max: 10000, step: 10, def: 200 },
      { id: 'regime', label: 'Regime', type: 'select', options: [['115baa', 'Section 115BAA (22% concessional)'], ['regular', 'Regular Regime (25% / 30%)']], def: '115baa' },
    ],
    mainLabel: 'Tax Payable',
    compute(v) {
      const income = Math.max(0, v.income);
      if (v.regime === '115baa') {
        const res = FC.applySurchargeAndCess((x) => x * 0.22, income, [{ threshold: 0, rate: 0.10 }]);
        return {
          main: FC.formatINR(res.total),
          items: [
            { label: 'Base Tax (22%)', value: FC.formatINR(res.baseTax) },
            { label: 'Surcharge (flat 10%)', value: FC.formatINR(res.surcharge) },
            { label: 'Cess (4%)', value: FC.formatINR(res.cess) },
            { label: 'MAT Applicable', value: 'No — 115BAA companies are MAT-exempt' },
          ],
          explain: `Under Section 115BAA, domestic companies pay a flat 22% concessional rate (effective ~25.17% with surcharge and cess) but give up most exemptions and deductions — and are exempt from MAT entirely. On ${FC.formatINR(income)} income, total tax is ${FC.formatINR(res.total)}. As per Income Tax Act, 2025 — Section 115BAA.`,
        };
      }
      const baseRate = v.turnoverCr <= 400 ? 0.25 : 0.30;
      const regular = FC.applySurchargeAndCess((x) => x * baseRate, income, [{ threshold: 10000000, rate: 0.07 }, { threshold: 100000000, rate: 0.12 }]);
      const matRate = 0.15;
      const mat = FC.applySurchargeAndCess((x) => x * matRate, Math.max(0, v.bookProfit), [{ threshold: 10000000, rate: 0.07 }, { threshold: 100000000, rate: 0.12 }]);
      const matApplies = mat.total > regular.total;
      const finalTax = Math.max(regular.total, mat.total);
      return {
        main: FC.formatINR(finalTax),
        items: [
          { label: `Regular Tax (${(baseRate * 100).toFixed(0)}%)`, value: FC.formatINR(regular.total) },
          { label: 'MAT (15% of Book Profit)', value: FC.formatINR(mat.total) },
          { label: 'MAT Applicable', value: matApplies ? 'Yes — MAT floor applies' : 'No — regular tax is higher' },
          { label: 'MAT Credit Carried Forward', value: matApplies ? FC.formatINR(mat.total - regular.total) : '₹0' },
        ],
        explain: `Companies not opting for 115BAA pay tax at ${(baseRate * 100).toFixed(0)}% (turnover ${v.turnoverCr <= 400 ? '≤' : '>'} ₹400 Cr), but must pay at least the Minimum Alternate Tax (MAT) of 15% of book profit if that's higher. Here, ${matApplies ? `MAT of ${FC.formatINR(mat.total)} exceeds the regular tax, so MAT applies` : `regular tax of ${FC.formatINR(regular.total)} already exceeds MAT`}, giving a final liability of ${FC.formatINR(finalTax)}.${matApplies ? ' The excess MAT paid can be carried forward as MAT credit for up to 15 years and set off against future regular tax.' : ''} As per Income Tax Act, 2025 — Sections 115JB (MAT) and the company tax rate schedule.`,
      };
    },
  },

  /* ---- GST: Forward Charge ---- */
  {
    id: 'gst-forward-charge', name: 'GST Forward Charge Calculator', cat: 'gst',
    desc: 'CGST+SGST or IGST split on a taxable supply',
    inputs: [
      { id: 'value', label: 'Taxable Value (₹)', min: 0, max: 10000000, step: 1000, def: 100000 },
      { id: 'rate', label: 'GST Rate', type: 'select', options: [['0.05', '5%'], ['0.12', '12%'], ['0.18', '18%'], ['0.28', '28%']], def: '0.18' },
      { id: 'supply', label: 'Supply Type', type: 'select', options: [['intra', 'Intra-state (CGST + SGST)'], ['inter', 'Inter-state (IGST)']], def: 'intra' },
    ],
    mainLabel: 'Total Invoice Value',
    compute(v) {
      const gstAmt = v.value * v.rate;
      const isIntra = v.supply === 'intra' || isNaN(v.supply);
      const half = gstAmt / 2;
      return {
        main: FC.formatINR(v.value + gstAmt),
        items: isIntra
          ? [
              { label: 'CGST', value: FC.formatINR(half) },
              { label: 'SGST', value: FC.formatINR(half) },
              { label: 'Total GST', value: FC.formatINR(gstAmt) },
            ]
          : [
              { label: 'IGST', value: FC.formatINR(gstAmt) },
              { label: 'Total GST', value: FC.formatINR(gstAmt) },
            ],
        explain: `Under forward charge, the supplier collects GST from the buyer and remits it to the government. On a taxable value of ${FC.formatINR(v.value)} at ${(v.rate * 100).toFixed(0)}%, GST works out to ${FC.formatINR(gstAmt)}${isIntra ? `, split equally into CGST ${FC.formatINR(half)} and SGST ${FC.formatINR(half)} for an intra-state supply` : ' as IGST for an inter-state supply'}. Total invoice value: ${FC.formatINR(v.value + gstAmt)}. As per the CGST Act, 2017 — Section 9(1).`,
      };
    },
  },

  /* ---- GST: Reverse Charge ---- */
  {
    id: 'gst-reverse-charge', name: 'GST Reverse Charge (RCM) Calculator', cat: 'gst',
    desc: 'GST payable directly by the recipient under RCM',
    inputs: [
      { id: 'value', label: 'Taxable Value (₹)', min: 0, max: 10000000, step: 1000, def: 50000 },
      { id: 'rate', label: 'GST Rate', type: 'select', options: [['0.05', '5%'], ['0.12', '12%'], ['0.18', '18%'], ['0.28', '28%']], def: '0.18' },
    ],
    mainLabel: 'RCM Tax Payable by Recipient',
    compute(v) {
      const gstAmt = v.value * v.rate;
      return {
        main: FC.formatINR(gstAmt),
        items: [
          { label: 'Taxable Value', value: FC.formatINR(v.value) },
          { label: 'GST Rate', value: (v.rate * 100).toFixed(0) + '%' },
          { label: 'ITC Claimable (if for business use)', value: FC.formatINR(gstAmt) },
        ],
        explain: `Under Reverse Charge Mechanism (RCM), the recipient — not the supplier — pays GST of ${FC.formatINR(gstAmt)} directly to the government via cash ledger, and issues a self-invoice. If the purchase is for business use, this amount can usually be claimed back as Input Tax Credit (ITC) in the same return. As per the CGST Act, 2017 — Section 9(3)/9(4).`,
      };
    },
  },

  /* ---- GST: Composition Scheme ---- */
  {
    id: 'gst-composition', name: 'GST Composition Scheme Calculator', cat: 'gst',
    desc: 'Flat-rate tax on turnover vs regular GST (no ITC)',
    inputs: [
      { id: 'turnover', label: 'Annual Turnover (₹)', min: 0, max: 15000000, step: 50000, def: 6000000 },
      { id: 'business', label: 'Business Type', type: 'select', options: [['0.01', 'Trader / Manufacturer (1%)'], ['0.05', 'Restaurant, non-alcohol (5%)'], ['0.06', 'Service Provider (6%)']], def: '0.01' },
      { id: 'regularRate', label: 'Regular Scheme GST Rate (for comparison)', type: 'select', options: [['0.05', '5%'], ['0.12', '12%'], ['0.18', '18%'], ['0.28', '28%']], def: '0.18' },
    ],
    mainLabel: 'Composition Tax Payable',
    compute(v) {
      const compTax = v.turnover * v.business;
      const regularEstimate = v.turnover * v.regularRate;
      return {
        main: FC.formatINR(compTax),
        items: [
          { label: 'Effective Rate', value: (v.business * 100).toFixed(1) + '% of turnover' },
          { label: 'Regular Scheme Estimate (no ITC offset)', value: FC.formatINR(regularEstimate) },
          { label: 'ITC Claimable Under Composition', value: '₹0 — not allowed' },
          { label: 'Quarterly Return', value: 'CMP-08 (simplified)' },
        ],
        explain: `Composition dealers pay a flat ${(v.business * 100).toFixed(1)}% of total turnover instead of computing GST on every invoice — simpler compliance (quarterly CMP-08, no monthly GSTR-1/3B), but Input Tax Credit cannot be claimed and GST cannot be charged separately on invoices. On ${FC.formatINR(v.turnover)} turnover, composition tax is ${FC.formatINR(compTax)}. Compare this against your regular-scheme liability net of ITC to decide which is better — composition tends to favor businesses with thin input costs. Eligibility caps at ₹1.5 Cr turnover (₹75L in special category states) for goods, ₹50L for services. As per the CGST Act, 2017 — Section 10.`,
      };
    },
  },

  /* ---- GST: ITC Eligibility Checker ---- */
  {
    id: 'gst-itc-eligibility', name: 'GST ITC Eligibility Checker', cat: 'gst',
    desc: 'Is Input Tax Credit blocked for this expense? (Sec 17(5))',
    inputs: [
      { id: 'category', label: 'Expense Category', type: 'select', def: '1', options: [
        ['1', 'Raw materials / capital goods / standard business purchase'],
        ['2', 'Motor vehicles (seating ≤13) for non-transport business use'],
        ['3', 'Motor vehicle used for transport of goods / passenger transport business'],
        ['4', 'Employee health/life insurance (not government-mandated)'],
        ['5', 'Rent-a-cab, health & fitness club membership'],
        ['6', 'Food & beverages, outdoor catering (unless mandated by law)'],
        ['7', 'Works contract for construction of immovable property'],
        ['8', 'Goods/services used for CSR activities'],
        ['9', 'Free samples / gifts / goods lost, stolen or destroyed'],
      ] },
    ],
    mainLabel: 'ITC Status',
    compute(v) {
      const RULES = {
        '1': { eligible: true,  note: 'Standard business inputs are fully creditable when used in the course or furtherance of business.' },
        '2': { eligible: false, note: 'ITC on motor vehicles (≤13 seats) is blocked unless used for further supply of vehicles, passenger transport, or driving training.' },
        '3': { eligible: true,  note: 'Vehicles used directly for transportation of goods, or by a passenger-transport business, are specifically excluded from the block — ITC is allowed.' },
        '4': { eligible: false, note: 'Blocked unless the government notifies the insurance as obligatory for employers under any law currently in force.' },
        '5': { eligible: false, note: 'Rent-a-cab and club memberships are explicitly blocked credits, with the same "obligatory by law" exception.' },
        '6': { eligible: false, note: 'Food, beverages and outdoor catering are blocked unless the law mandates providing them to employees, or they are used to make a further taxable supply of the same category.' },
        '7': { eligible: false, note: 'ITC on works contracts for immovable property is blocked, except when the output itself is a further works contract service (plant & machinery is excluded from this block).' },
        '8': { eligible: false, note: 'ITC on goods/services used for Corporate Social Responsibility obligations is specifically blocked.' },
        '9': { eligible: false, note: 'ITC is blocked (and must be reversed if already claimed) on free samples, gifts, and goods lost, stolen, destroyed or written off.' },
      };
      const r = RULES[v.category] || RULES['1'];
      return {
        main: r.eligible ? 'ITC Eligible ✅' : 'ITC Blocked ❌',
        items: [
          { label: 'Governing Section', value: 'CGST Act — Sec 16 / 17(5)' },
          { label: 'Reversal Required If Already Claimed', value: r.eligible ? 'No' : 'Yes' },
        ],
        explain: `${r.note} As per the CGST Act, 2017 — Section 17(5) (blocked credits), read with Section 16 (eligibility conditions).`,
      };
    },
  },

  /* ---- ROC / MCA additional fee for delayed AOC-4 / MGT-7 ---- */
  {
    id: 'roc-additional-fee', name: 'ROC Additional Fee Calculator (AOC-4 / MGT-7)', cat: 'business',
    desc: 'Late filing penalty for annual company filings',
    inputs: [
      { id: 'normalFee', label: 'Normal Filing Fee (₹, by authorized capital slab)', min: 200, max: 600, step: 100, def: 400 },
      { id: 'daysDelayed', label: 'Days Delayed Past Due Date', min: 0, max: 720, step: 1, def: 45 },
    ],
    mainLabel: 'Total Fee Payable',
    compute(v) {
      const additionalFee = v.daysDelayed * 100;
      const total = v.normalFee + additionalFee;
      return {
        main: FC.formatINR(total),
        items: [
          { label: 'Normal Filing Fee', value: FC.formatINR(v.normalFee) },
          { label: 'Additional Fee (₹100/day, uncapped)', value: FC.formatINR(additionalFee) },
          { label: 'Days Delayed', value: v.daysDelayed + ' days' },
        ],
        explain: `Since 2022, AOC-4 and MGT-7 filings attract a flat additional fee of ₹100 for every day of delay beyond the due date, with no upper cap — so the penalty compounds quickly. ${v.daysDelayed} days of delay on a ${FC.formatINR(v.normalFee)} normal fee adds ${FC.formatINR(additionalFee)}, for a total of ${FC.formatINR(total)}. Verify the exact due date and any extensions on the MCA portal before relying on this figure. As per the Companies (Registration Offices and Fees) Rules, 2014 (as amended).`,
      };
    },
  },

  /* ---- Depreciation: Companies Act (SLM/WDV) vs Income Tax Act (WDV) ---- */
  {
    id: 'depreciation-comparison', name: 'Depreciation Comparison (Companies Act vs IT Act)', cat: 'business',
    desc: 'SLM & WDV under Schedule II vs Income Tax block rates',
    inputs: [
      { id: 'cost', label: 'Asset Cost (₹)', min: 10000, max: 100000000, step: 10000, def: 1000000 },
      { id: 'usefulLife', label: 'Useful Life — Companies Act (Years)', min: 1, max: 40, step: 1, def: 15 },
      { id: 'itRate', label: 'Income Tax Block Rate', type: 'select', options: [['0.40', '40% — Computers, certain P&M'], ['0.15', '15% — General Plant & Machinery'], ['0.10', '10% — Buildings (general)'], ['0.05', '5% — Buildings (residential)'], ['0.30', '30% — Motor vehicles (business use)']], def: '0.15' },
      { id: 'years', label: 'Years Elapsed', min: 1, max: 30, step: 1, def: 3 },
    ],
    mainLabel: 'Written Down Value After N Years (IT Act)',
    compute(v) {
      const years = Math.min(v.years, v.usefulLife * 2);
      /* Companies Act SLM: straight-line to a 5% residual value over useful life */
      const residual = v.cost * 0.05;
      const slmAnnual = (v.cost - residual) / v.usefulLife;
      const slmWDV = Math.max(residual, v.cost - slmAnnual * years);
      /* Companies Act WDV: rate calibrated so the asset reaches 5% residual value by end of useful life */
      const caWdvRate = 1 - Math.pow(0.05, 1 / v.usefulLife);
      const caWdvValue = v.cost * Math.pow(1 - caWdvRate, years);
      /* Income Tax Act WDV: flat block rate, no residual-value floor */
      const itWdvValue = v.cost * Math.pow(1 - v.itRate, years);
      return {
        main: FC.formatINR(itWdvValue),
        items: [
          { label: 'Companies Act — SLM Value', value: FC.formatINR(slmWDV) },
          { label: 'Companies Act — WDV Value', value: FC.formatINR(caWdvValue) },
          { label: 'Income Tax Act — WDV Value', value: FC.formatINR(itWdvValue) },
          { label: `IT Act Depreciation Claimed (${years} yrs)`, value: FC.formatINR(v.cost - itWdvValue) },
        ],
        explain: `After ${years} years, a ${FC.formatINR(v.cost)} asset is worth ${FC.formatINR(slmWDV)} under Companies Act straight-line depreciation (Schedule II, ${v.usefulLife}-year life, 5% residual), ${FC.formatINR(caWdvValue)} under Companies Act WDV, and ${FC.formatINR(itWdvValue)} under the Income Tax Act's ${(v.itRate * 100).toFixed(0)}% block-rate WDV method (no residual floor, and no separate "useful life" concept). Companies must depreciate per Schedule II for financial statements, and separately per IT Act block rates for tax computation — the two rarely match, creating a deferred tax difference. If the asset was used for under 180 days in its year of purchase, the IT Act allows only half the normal rate for that year (not modelled here). As per the Companies Act, 2013 — Schedule II, and the Income Tax Act, 2025 — Section 32.`,
      };
    },
  },

];

/* ============================================================
   TDS / TCS SECTION-WISE RATE TABLE — custom searchable UI
   (registered as its own calculator id, with a dedicated UI
   builder rather than the generic slider template, since a
   lookup table is fundamentally different from a slider calc)
   ============================================================ */
const TDS_RATES = [
  { section: '192',      desc: 'Salary payments',                                   rate: 'Slab rates' },
  { section: '192A',     desc: 'Premature EPF withdrawal (> ₹50,000)',               rate: '10%' },
  { section: '193',      desc: 'Interest on securities',                            rate: '10%' },
  { section: '194',      desc: 'Dividend (> ₹10,000)',                              rate: '10%' },
  { section: '194A',     desc: 'Interest other than on securities (bank/FD etc.)',   rate: '10%' },
  { section: '194B',     desc: 'Winnings from lottery / game shows',                 rate: '30%' },
  { section: '194BB',    desc: 'Winnings from horse races',                         rate: '30%' },
  { section: '194C',     desc: 'Payment to contractors',                            rate: '1% (Ind/HUF) · 2% (others)' },
  { section: '194D',     desc: 'Insurance commission',                              rate: '2%' },
  { section: '194DA',    desc: 'Life insurance policy payout (taxable portion)',     rate: '5%' },
  { section: '194G',     desc: 'Commission on sale of lottery tickets',              rate: '2%' },
  { section: '194H',     desc: 'Commission or brokerage',                           rate: '2%' },
  { section: '194-I(a)', desc: 'Rent — plant & machinery',                          rate: '2%' },
  { section: '194-I(b)', desc: 'Rent — land, building, furniture',                  rate: '10%' },
  { section: '194-IA',   desc: 'Transfer of immovable property (> ₹50L)',            rate: '1%' },
  { section: '194-IB',   desc: 'Rent by individual/HUF not liable to audit',         rate: '2%' },
  { section: '194J(a)',  desc: 'Technical services / royalty',                       rate: '2%' },
  { section: '194J(b)',  desc: 'Professional fees',                                 rate: '10%' },
  { section: '194M',     desc: 'Contract/commission/professional fee by Ind/HUF (non-audit)', rate: '2%' },
  { section: '194N',     desc: 'Cash withdrawal above ₹1 crore (banks)',             rate: '2%' },
  { section: '194O',     desc: 'E-commerce operator payment to participants',        rate: '0.1%' },
  { section: '194Q',     desc: 'Purchase of goods (buyer turnover > ₹10 Cr)',        rate: '0.1%' },
  { section: '206C(1H)', desc: 'TCS on sale of goods (seller turnover > ₹10 Cr)',     rate: '0.1%' },
  { section: '206AB',    desc: 'Non-filers of ITR — higher TDS rate',                rate: '5% or 2× normal, whichever higher' },
];

function uiTDSLookup() {
  return `<div class="tds-lookup">
    <div class="result-card">
      <div class="result-label">TDS / TCS Section-Wise Rates</div>
      <div class="result-main" style="font-size:1.5rem">${TDS_RATES.length} sections</div>
      <p class="quick-sentence" data-custom="1">Search by section number or payment type — rates shown are indicative for FY 2026-27.</p>
    </div>
    <div class="tds-search-wrap">
      <input type="search" id="tds-search" class="input" placeholder="Search “194C”, “rent”, “professional”…" oninput="filterTDSTable(this.value)" aria-label="Search TDS sections" autocomplete="off" />
    </div>
    <div class="tds-table-wrap">
      <table class="tds-table" id="tds-table">
        <thead><tr><th>Section</th><th>Nature of Payment</th><th>Rate</th></tr></thead>
        <tbody id="tds-tbody"></tbody>
      </table>
    </div>
    <div class="trust-line">
      <span class="trust-fy-tag">FY 2026-27</span>
      <span>As per Income Tax Act, 2025. Rates change with each Finance Act — verify before deducting.</span>
    </div>
  </div>`;
}

function renderTDSTable(filter = '') {
  const tbody = document.getElementById('tds-tbody');
  if (!tbody) return;
  const q = filter.trim().toLowerCase();
  const rows = TDS_RATES.filter(r => !q || r.section.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q) || r.rate.toLowerCase().includes(q));
  tbody.innerHTML = rows.length
    ? rows.map(r => `<tr><td class="tds-section">${r.section}</td><td>${r.desc}</td><td class="tds-rate">${r.rate}</td></tr>`).join('')
    : `<tr><td colspan="3" style="text-align:center;color:var(--text3);padding:1.5rem">No matching section.</td></tr>`;
}

function filterTDSTable(q) { renderTDSTable(q); }

/* chain onto the existing buildCalcUI/calcLive override chain
   (same pattern extra-calculators.js established) for this one
   custom, non-slider calculator */
const _prevBuildCalcUI_prof = buildCalcUI;
buildCalcUI = function (id) {
  if (id === 'tds-rate-lookup') return uiTDSLookup();
  return _prevBuildCalcUI_prof(id);
};
const _prevCalcLive_prof = calcLive;
calcLive = function (id) {
  if (id === 'tds-rate-lookup') { renderTDSTable(); return; }
  return _prevCalcLive_prof(id);
};

CALCULATORS.push({ id: 'tds-rate-lookup', name: 'TDS/TCS Rate Lookup', cat: 'tax', desc: 'Searchable section-wise TDS & TCS rate table' });
ICONS['tds-rate-lookup'] = ICONS['income-tax'];

/* ============================================================
   REGISTRATION — append into shared EXTRA_CALC_DEFS registry
   ============================================================ */
const PROFESSIONAL_CATEGORY_ICONS = { business: 'tax', gst: 'income-tax' };
/* used by the Related Calculators rail to keep these entity/compliance
   tools clustered together rather than mixed with generic ROI/markup
   business calculators that happen to share the same category */
const PROFESSIONAL_CALC_IDS = new Set(['huf-tax', 'partnership-llp-tax', 'company-tax',
  'gst-forward-charge', 'gst-reverse-charge', 'gst-composition', 'gst-itc-eligibility',
  'roc-additional-fee', 'depreciation-comparison', 'tds-rate-lookup']);
PROFESSIONAL_CALC_DEFS.forEach(def => {
  EXTRA_CALC_DEFS.push(def);
  CALCULATORS.push({ id: def.id, name: def.name, cat: def.cat, desc: def.desc });
  if (!ICONS[def.id]) ICONS[def.id] = ICONS[PROFESSIONAL_CATEGORY_ICONS[def.cat]] || ICONS.tax;
});
