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

/* ============================================================
   PART 2 — compliance workflow, portfolio math & layman tools
   ============================================================ */
const PROFESSIONAL_CALC_DEFS_2 = [

  /* ---- Advance tax installment schedule ---- */
  {
    id: 'advance-tax', name: 'Advance Tax Installment Calculator', cat: 'business',
    desc: 'Quarterly 15/45/75/100% schedule with 234C interest rules',
    inputs: [
      { id: 'estTax', label: 'Estimated Total Tax for the FY (₹)', min: 0, max: 10000000, step: 5000, def: 300000 },
      { id: 'tdsCredit', label: 'TDS / TCS Credit Expected (₹)', min: 0, max: 5000000, step: 5000, def: 50000 },
    ],
    mainLabel: 'Net Advance Tax Payable',
    compute(v) {
      const net = Math.max(0, v.estTax - v.tdsCredit);
      if (net < 10000) {
        return {
          main: 'Not Applicable',
          items: [{ label: 'Net Liability After TDS', value: FC.formatINR(net) }],
          explain: `Advance tax applies only when net tax liability (after TDS credit) is ₹10,000 or more in a financial year — yours is ${FC.formatINR(net)}, so you can pay the full amount as self-assessment tax while filing. Resident senior citizens with no business income are always exempt. As per Income Tax Act, 2025 — advance tax provisions.`,
        };
      }
      return {
        main: FC.formatINR(net),
        items: [
          { label: 'By Jun 15 — 15%', value: FC.formatINR(net * 0.15) },
          { label: 'By Sep 15 — 45% cumulative', value: FC.formatINR(net * 0.45) },
          { label: 'By Dec 15 — 75% cumulative', value: FC.formatINR(net * 0.75) },
          { label: 'By Mar 15 — 100%', value: FC.formatINR(net) },
        ],
        explain: `Pay advance tax in four cumulative installments: 15% by June 15, 45% by September 15, 75% by December 15 and 100% by March 15. Falling short of an installment attracts simple interest at 1% per month under Section 234C for the quarter (3 months per shortfall, 1 month for the March installment), and paying less than 90% of the total by March 31 attracts a further 1%/month under Section 234B until you pay. Presumptive-scheme (44AD/44ADA) taxpayers may instead pay 100% in one go by March 15. As per Income Tax Act, 2025 — Sections 234B and 234C.`,
      };
    },
  },

  /* ---- GST late fee + interest ---- */
  {
    id: 'gst-late-fee', name: 'GST Late Fee & Interest Calculator', cat: 'gst',
    desc: 'GSTR-3B late fee (capped) plus 18% interest on tax due',
    inputs: [
      { id: 'taxDue', label: 'Tax Payable in the Return (₹)', min: 0, max: 10000000, step: 1000, def: 100000 },
      { id: 'daysLate', label: 'Days Late', min: 0, max: 720, step: 1, def: 30 },
      { id: 'kind', label: 'Return Type', type: 'select', options: [['normal', 'Normal return (₹50/day)'], ['nil', 'Nil return (₹20/day)']], def: 'normal' },
      { id: 'cap', label: 'Late Fee Cap (by prior-year turnover)', type: 'select', options: [['2000', '₹2,000 — turnover ≤ ₹1.5 Cr'], ['5000', '₹5,000 — ₹1.5–5 Cr'], ['10000', '₹10,000 — above ₹5 Cr']], def: '5000' },
    ],
    mainLabel: 'Total Payable for Delay',
    compute(v) {
      const isNil = v.kind === 'nil';
      const perDay = isNil ? 20 : 50;
      const cap = isNil ? Math.min(parseFloat(v.cap) || 5000, 500) : (parseFloat(v.cap) || 5000);
      const lateFee = Math.min(v.daysLate * perDay, cap);
      const interest = v.taxDue * 0.18 * (v.daysLate / 365);
      return {
        main: FC.formatINR(lateFee + interest),
        items: [
          { label: `Late Fee (${perDay}/day, capped)`, value: FC.formatINR(lateFee) },
          { label: 'Interest @ 18% p.a. on Tax Due', value: FC.formatINR(interest) },
          { label: 'Days Late', value: v.daysLate + ' days' },
        ],
        explain: `A delayed GSTR-3B attracts a late fee of ₹${perDay}/day (₹${perDay / 2} CGST + ₹${perDay / 2} SGST), capped at ${FC.formatINR(cap)} based on turnover${isNil ? ' (nil returns are capped at ₹500)' : ''}, plus interest at 18% p.a. on the unpaid tax for the delay period — here ${FC.formatINR(interest)} on ${FC.formatINR(v.taxDue)} for ${v.daysLate} days. Interest applies on the cash-ledger portion of tax. As per the CGST Act, 2017 — Sections 47 and 50.`,
      };
    },
  },

  /* ---- Presumptive taxation 44AD / 44ADA / 44AE ---- */
  {
    id: 'presumptive-tax', name: 'Presumptive Tax Calculator (44AD/44ADA/44AE)', cat: 'business',
    desc: 'Deemed-profit schemes for small businesses & professionals',
    inputs: [
      { id: 'scheme', label: 'Scheme', type: 'select', options: [['44ad', '44AD — Small business'], ['44ada', '44ADA — Professionals'], ['44ae', '44AE — Goods transporters']], def: '44ad' },
      { id: 'turnover', label: 'Turnover / Gross Receipts (₹)', min: 0, max: 30000000, step: 100000, def: 8000000 },
      { id: 'digitalPct', label: '44AD: Digital Receipts Share (%)', min: 0, max: 100, step: 5, def: 80 },
      { id: 'vehicles', label: '44AE: Number of Vehicles', min: 1, max: 10, step: 1, def: 2 },
      { id: 'months', label: '44AE: Months Owned (per vehicle)', min: 1, max: 12, step: 1, def: 12 },
    ],
    mainLabel: 'Presumed Taxable Income',
    compute(v) {
      let presumed, basis;
      if (v.scheme === '44ada') {
        presumed = v.turnover * 0.50;
        basis = '50% of gross receipts is deemed income for specified professionals (limit ₹75L receipts when cash receipts ≤ 5%, else ₹50L)';
      } else if (v.scheme === '44ae') {
        presumed = v.vehicles * v.months * 7500;
        basis = `₹7,500 per vehicle per month for ${v.vehicles} vehicle(s) × ${v.months} month(s) (heavy vehicles: ₹1,000 per ton of gross weight)`;
      } else {
        const digital = v.turnover * (v.digitalPct / 100);
        const cash = v.turnover - digital;
        presumed = digital * 0.06 + cash * 0.08;
        basis = `6% on the ${v.digitalPct}% digital/banked turnover and 8% on the cash portion (limit ₹3 Cr turnover when cash receipts ≤ 5%, else ₹2 Cr)`;
      }
      const tax = FC.taxNewRegime(presumed + 75000); /* offset the std deduction taxNewRegime applies (business income gets none) */
      return {
        main: FC.formatINR(presumed),
        items: [
          { label: 'Deemed Profit Rate Applied', value: basis.split(' is deemed')[0].split(' on the')[0] },
          { label: 'Estimated Tax (New Regime, Individual)', value: FC.formatINR(tax.tax) },
          { label: 'Books of Account Required', value: 'No — that\'s the point' },
        ],
        explain: `Under the presumptive scheme, ${basis}. You pay tax on this deemed income with no books of account or audit, and you may pay the full year's advance tax in a single installment by March 15. Declaring lower-than-presumed profit means maintaining books and getting audited instead. Once opted for 44AD and later exited, you're barred from re-entering for 5 years. As per Income Tax Act, 2025 — Sections 44AD, 44ADA and 44AE.`,
      };
    },
  },

  /* ---- Tax audit applicability checker ---- */
  {
    id: 'tax-audit-checker', name: 'Tax Audit Applicability Checker (44AB)', cat: 'business',
    desc: 'Does this turnover need a tax audit?',
    inputs: [
      { id: 'entity', label: 'Nature of Activity', type: 'select', options: [['business', 'Business'], ['profession', 'Profession']], def: 'business' },
      { id: 'turnover', label: 'Turnover / Gross Receipts (₹)', min: 0, max: 200000000, step: 500000, def: 20000000 },
      { id: 'cash', label: 'Cash Receipts & Payments', type: 'select', options: [['low', '≤ 5% of totals (digital-heavy)'], ['high', '> 5% of totals']], def: 'low' },
    ],
    mainLabel: 'Audit Verdict',
    compute(v) {
      const isBiz = v.entity === 'business' || isNaN(v.entity);
      const lowCash = v.cash === 'low' || isNaN(v.cash);
      let limit, label;
      if (isBiz) { limit = lowCash ? 100000000 : 10000000; label = lowCash ? '₹10 Cr (digital-heavy business)' : '₹1 Cr (business)'; }
      else { limit = lowCash ? 7500000 : 5000000; label = lowCash ? '₹75 L (digital-heavy profession)' : '₹50 L (profession)'; }
      const required = v.turnover > limit;
      return {
        main: required ? 'Audit Required 📋' : 'No Audit Needed ✅',
        items: [
          { label: 'Applicable Threshold', value: label },
          { label: 'Your Turnover', value: FC.formatINR(v.turnover) },
          { label: 'Headroom', value: required ? 'Exceeded by ' + FC.formatINR(v.turnover - limit) : FC.formatINR(limit - v.turnover) + ' below limit' },
        ],
        explain: `${isBiz ? 'Businesses' : 'Professions'} need a tax audit under Section 44AB once turnover/gross receipts cross ${label} — the higher threshold applies when both cash receipts and cash payments stay within 5% of the respective totals. Your ${FC.formatINR(v.turnover)} is ${required ? 'above' : 'within'} the limit. Note: declaring profit below the presumptive rate while exceeding the basic exemption also independently triggers audit, regardless of turnover. As per Income Tax Act, 2025 — Section 44AB.`,
      };
    },
  },

  /* ---- CSR applicability & mandatory spend ---- */
  {
    id: 'csr-calculator', name: 'CSR Applicability & Spend Calculator', cat: 'business',
    desc: 'Section 135 thresholds and the 2% mandatory spend',
    inputs: [
      { id: 'networth', label: 'Net Worth (₹ Crore)', min: 0, max: 5000, step: 10, def: 120 },
      { id: 'turnover', label: 'Turnover (₹ Crore)', min: 0, max: 20000, step: 50, def: 800 },
      { id: 'netProfit', label: 'Net Profit This Year (₹ Crore)', min: 0, max: 2000, step: 1, def: 12 },
      { id: 'avgProfit', label: 'Average Net Profit — Last 3 FYs (₹ Crore)', min: 0, max: 2000, step: 1, def: 10 },
    ],
    mainLabel: 'Mandatory CSR Spend',
    compute(v) {
      const applicable = v.networth >= 500 || v.turnover >= 1000 || v.netProfit >= 5;
      const spend = v.avgProfit * 1e7 * 0.02;
      if (!applicable) {
        return {
          main: 'CSR Not Applicable',
          items: [
            { label: 'Net Worth Test (≥ ₹500 Cr)', value: v.networth + ' Cr — ' + (v.networth >= 500 ? 'Met' : 'Not met') },
            { label: 'Turnover Test (≥ ₹1,000 Cr)', value: v.turnover + ' Cr — ' + (v.turnover >= 1000 ? 'Met' : 'Not met') },
            { label: 'Net Profit Test (≥ ₹5 Cr)', value: v.netProfit + ' Cr — ' + (v.netProfit >= 5 ? 'Met' : 'Not met') },
          ],
          explain: `Section 135 applies only if any one test is met in the immediately preceding financial year: net worth ≥ ₹500 crore, turnover ≥ ₹1,000 crore, or net profit ≥ ₹5 crore. None are met here, so no CSR committee or spend is mandated. As per the Companies Act, 2013 — Section 135.`,
        };
      }
      return {
        main: FC.formatINR(spend),
        items: [
          { label: 'Basis', value: '2% of 3-yr avg net profit' },
          { label: 'CSR Committee Required', value: spend > 5000000 ? 'Yes' : 'Optional (spend ≤ ₹50L — board may handle)' },
          { label: 'Unspent (Ongoing Project) Treatment', value: 'Transfer to Unspent CSR A/c in 30 days' },
        ],
        explain: `The company crosses a Section 135 threshold, so it must spend at least 2% of its average net profit of the last three financial years — ${FC.formatINR(spend)} here — on Schedule VII CSR activities. Unspent amounts tied to ongoing projects go to a dedicated Unspent CSR Account within 30 days of year-end (spendable within 3 years); other unspent amounts go to a Schedule VII fund within 6 months. Net profit here means profit computed under Section 198. As per the Companies Act, 2013 — Section 135.`,
      };
    },
  },



  /* ---- Professional tax ---- */
  {
    id: 'professional-tax', name: 'Professional Tax Calculator', cat: 'tax',
    desc: 'State-wise PT on salary (max ₹2,500/year)',
    inputs: [
      { id: 'state', label: 'State', type: 'select', options: [['mh', 'Maharashtra'], ['ka', 'Karnataka'], ['wb', 'West Bengal'], ['tn', 'Tamil Nadu'], ['ts', 'Telangana / AP'], ['gj', 'Gujarat'], ['mp', 'Madhya Pradesh'], ['none', 'Delhi / UP / Haryana / Rajasthan (no PT)']], def: 'mh' },
      { id: 'salary', label: 'Gross Monthly Salary (₹)', min: 5000, max: 500000, step: 1000, def: 50000 },
    ],
    mainLabel: 'Annual Professional Tax',
    compute(v) {
      const s = v.salary;
      const SLABS = {
        mh: s <= 7500 ? 0 : s <= 10000 ? 2100 : 2500,
        ka: s <= 24999 ? 0 : 2400,
        wb: s <= 10000 ? 0 : s <= 15000 ? 1320 : s <= 40000 ? 1800 : 2400,
        tn: s <= 21000 ? 0 : 2500,
        ts: s <= 15000 ? 0 : s <= 20000 ? 1800 : 2400,
        gj: s <= 12000 ? 0 : 2400,
        mp: s <= 18750 ? 0 : 2500,
        none: 0,
      };
      const annual = SLABS[v.state] ?? 0;
      return {
        main: FC.formatINR(annual),
        items: [
          { label: 'Monthly Deduction (approx.)', value: FC.formatINR(annual / 12) },
          { label: 'Constitutional Ceiling', value: '₹2,500/year (Article 276)' },
          { label: 'Deductible From Salary Income', value: 'Yes — Section 16 (old regime)' },
        ],
        explain: `Professional tax is a state levy on employment income, capped at ₹2,500 a year by Article 276 of the Constitution. ${v.state === 'none' ? 'Your selected state does not levy professional tax at all.' : `At a gross salary of ${FC.formatINR(s)}/month, the applicable slab works out to ${FC.formatINR(annual)} per year, deducted monthly by your employer${v.state === 'mh' ? ' (Maharashtra collects ₹300 in February to reach ₹2,500)' : ''}.`} It's deductible from salary income under the old regime. Slabs are indicative — states revise them periodically.`,
      };
    },
  },

  /* ---- STP calculator ---- */
  {
    id: 'stp-calculator', name: 'STP Calculator (Systematic Transfer Plan)', cat: 'investment',
    desc: 'Park a lumpsum in debt, transfer monthly into equity',
    inputs: [
      { id: 'lumpsum', label: 'Lumpsum Parked in Debt Fund (₹)', min: 50000, max: 50000000, step: 50000, def: 1200000 },
      { id: 'transfer', label: 'Monthly Transfer to Equity (₹)', min: 1000, max: 1000000, step: 1000, def: 100000 },
      { id: 'debtRate', label: 'Debt Fund Return (% p.a.)', min: 3, max: 10, step: 0.5, def: 7 },
      { id: 'equityRate', label: 'Equity Fund Return (% p.a.)', min: 6, max: 20, step: 0.5, def: 12 },
      { id: 'horizon', label: 'Evaluation Horizon (Years)', min: 1, max: 20, step: 1, def: 3 },
    ],
    mainLabel: 'Total Value at Horizon',
    compute(v) {
      const rd = v.debtRate / 100 / 12, re = v.equityRate / 100 / 12;
      const months = Math.round(v.horizon * 12);
      let debt = v.lumpsum, equity = 0, transferred = 0;
      for (let m = 1; m <= months; m++) {
        debt *= 1 + rd;
        const t = Math.min(v.transfer, debt);
        debt -= t;
        transferred += t;
        equity = equity * (1 + re) + t;
      }
      const total = debt + equity;
      const allEquityDay1 = v.lumpsum * Math.pow(1 + v.equityRate / 100, v.horizon);
      const allDebt = v.lumpsum * Math.pow(1 + v.debtRate / 100, v.horizon);
      return {
        main: FC.formatINR(total),
        items: [
          { label: 'Equity Fund Value', value: FC.formatINR(equity) },
          { label: 'Left in Debt Fund', value: FC.formatINR(debt) },
          { label: 'If Invested in Equity on Day 1', value: FC.formatINR(allEquityDay1) },
          { label: 'If Left Entirely in Debt', value: FC.formatINR(allDebt) },
        ],
        explain: `An STP parks your ${FC.formatINR(v.lumpsum)} in a debt fund (earning ${v.debtRate}% while it waits) and moves ${FC.formatINR(v.transfer)} into equity every month — averaging your entry price instead of betting the entire amount on one day's market level. The transfers finish in about ${Math.ceil(v.lumpsum / v.transfer)} months; after ${v.horizon} years you'd hold roughly ${FC.formatINR(total)}. The day-1 lumpsum figure assumes markets only go up — STP gives up some of that upside to cut timing risk. Note: each monthly transfer is a redemption from the debt fund and is taxable as capital gains.`,
      };
    },
  },

  /* ---- Tax-loss harvesting ---- */
  {
    id: 'tax-loss-harvesting', name: 'Tax-Loss Harvesting Calculator', cat: 'stocks',
    desc: 'How much tax can booking losses before Mar 31 save?',
    inputs: [
      { id: 'ltcg', label: 'Realized LTCG This FY (₹)', min: 0, max: 10000000, step: 10000, def: 400000 },
      { id: 'stcg', label: 'Realized STCG This FY (₹)', min: 0, max: 10000000, step: 10000, def: 150000 },
      { id: 'loss', label: 'Unrealized Loss Available to Book (₹)', min: 0, max: 10000000, step: 10000, def: 200000 },
      { id: 'lossType', label: 'The Loss Is', type: 'select', options: [['st', 'Short-term (held < 1 yr)'], ['lt', 'Long-term (held ≥ 1 yr)']], def: 'st' },
    ],
    mainLabel: 'Tax Saved by Harvesting',
    compute(v) {
      const isST = v.lossType === 'st' || isNaN(v.lossType);
      let remaining = v.loss, stOffset = 0, ltOffset = 0;
      if (isST) { /* STCL sets off against STCG first (20%), then LTCG (12.5%) */
        stOffset = Math.min(remaining, v.stcg); remaining -= stOffset;
        ltOffset = Math.min(remaining, v.ltcg); remaining -= ltOffset;
      } else {   /* LTCL sets off against LTCG only */
        ltOffset = Math.min(remaining, v.ltcg); remaining -= ltOffset;
      }
      const taxableLtcgBefore = Math.max(0, v.ltcg - 125000);
      const taxableLtcgAfter = Math.max(0, v.ltcg - ltOffset - 125000);
      const saved = stOffset * 0.20 + (taxableLtcgBefore - taxableLtcgAfter) * 0.125;
      return {
        main: FC.formatINR(saved),
        items: [
          { label: 'Loss Used vs STCG (saves 20%)', value: FC.formatINR(stOffset) },
          { label: 'Loss Used vs LTCG (saves 12.5%)', value: FC.formatINR(ltOffset) },
          { label: 'Loss Left to Carry Forward (8 yrs)', value: FC.formatINR(remaining) },
          { label: 'LTCG Exemption Used', value: FC.formatINR(Math.min(125000, Math.max(0, v.ltcg - ltOffset))) + ' of ₹1.25L' },
        ],
        explain: `Booking the ${isST ? 'short' : 'long'}-term loss before March 31 offsets ${isST ? 'STCG first (taxed at 20%), then LTCG (12.5%)' : 'LTCG only — long-term losses cannot touch short-term gains'}, saving about ${FC.formatINR(saved)} in tax. Remember the first ₹1.25L of equity LTCG each year is already exempt — don't waste harvested losses shielding gains that were tax-free anyway. Unused losses carry forward 8 years if you file on time, and you can repurchase the same stock immediately (India has no wash-sale rule, though frequent same-day churning may attract scrutiny). As per Income Tax Act, 2025 — capital gains set-off provisions.`,
      };
    },
  },

  /* ---- Bond YTM ---- */
  {
    id: 'bond-ytm', name: 'Bond Yield to Maturity (YTM) Calculator', cat: 'stocks',
    desc: 'True annualized return of a bond bought at market price',
    inputs: [
      { id: 'face', label: 'Face Value (₹)', min: 100, max: 1000000, step: 100, def: 1000 },
      { id: 'price', label: 'Current Market Price (₹)', min: 100, max: 1000000, step: 10, def: 950 },
      { id: 'coupon', label: 'Coupon Rate (% p.a.)', min: 0, max: 15, step: 0.1, def: 7.5 },
      { id: 'years', label: 'Years to Maturity', min: 1, max: 30, step: 1, def: 5 },
    ],
    mainLabel: 'Yield to Maturity',
    compute(v) {
      const c = v.face * v.coupon / 100;
      /* bisection on annual-coupon bond price */
      const priceAt = (r) => {
        let p = 0;
        for (let t = 1; t <= v.years; t++) p += c / Math.pow(1 + r, t);
        return p + v.face / Math.pow(1 + r, v.years);
      };
      let lo = -0.5, hi = 2;
      for (let i = 0; i < 100; i++) {
        const mid = (lo + hi) / 2;
        if (priceAt(mid) > v.price) lo = mid; else hi = mid;
      }
      const ytm = (lo + hi) / 2;
      const currentYield = c / v.price;
      return {
        main: (ytm * 100).toFixed(2) + '% p.a.',
        items: [
          { label: 'Current Yield (coupon ÷ price)', value: (currentYield * 100).toFixed(2) + '%' },
          { label: 'Annual Coupon', value: FC.formatINR(c) },
          { label: 'Total Coupons Till Maturity', value: FC.formatINR(c * v.years) },
          { label: 'Capital ' + (v.face >= v.price ? 'Gain' : 'Loss') + ' at Maturity', value: FC.formatINR(Math.abs(v.face - v.price)) },
        ],
        explain: `Buying this bond at ${FC.formatINR(v.price)} against a ${FC.formatINR(v.face)} face value, you earn ${FC.formatINR(c)} in coupons yearly plus the ${v.face >= v.price ? 'pull-to-par gain' : 'premium erosion'} at maturity — an internal rate of return (YTM) of ${(ytm * 100).toFixed(2)}% p.a., versus the ${(currentYield * 100).toFixed(2)}% naive current yield. YTM assumes you hold to maturity and reinvest coupons at the same rate. Solved by bisection on the standard bond-pricing equation with annual coupons.`,
      };
    },
  },

  /* ---- Loan affordability (traffic light) ---- */
  {
    id: 'affordability-checker', name: 'Can I Afford This Loan?', cat: 'personal',
    desc: 'Traffic-light verdict from your debt-to-income ratio',
    inputs: [
      { id: 'income', label: 'Take-home Monthly Income (₹)', min: 10000, max: 2000000, step: 5000, def: 100000 },
      { id: 'existingEmi', label: 'Existing EMIs (₹/month)', min: 0, max: 1000000, step: 1000, def: 15000 },
      { id: 'loanAmt', label: 'Proposed Loan Amount (₹)', min: 50000, max: 50000000, step: 50000, def: 3000000 },
      { id: 'rate', label: 'Interest Rate (% p.a.)', min: 6, max: 20, step: 0.1, def: 9 },
      { id: 'tenure', label: 'Tenure (Years)', min: 1, max: 30, step: 1, def: 20 },
    ],
    mainLabel: 'Verdict',
    compute(v) {
      const newEmi = FC.emi(v.loanAmt, v.rate / 100, v.tenure * 12);
      const foir = (v.existingEmi + newEmi) / v.income;
      const verdict = foir <= 0.35 ? '🟢 Comfortable' : foir <= 0.50 ? '🟡 A Stretch' : '🔴 Risky';
      const maxSafeEmi = Math.max(0, v.income * 0.40 - v.existingEmi);
      /* invert the EMI formula to find the loan size that keeps FOIR at 40% */
      const r = v.rate / 100 / 12, n = v.tenure * 12;
      const maxSafeLoan = maxSafeEmi * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
      return {
        main: verdict,
        items: [
          { label: 'New EMI', value: FC.formatINR(newEmi) + '/mo' },
          { label: 'Total EMIs vs Income (FOIR)', value: (foir * 100).toFixed(0) + '%' },
          { label: 'Safe EMI Budget (40% rule)', value: FC.formatINR(maxSafeEmi) + '/mo' },
          { label: 'Max Comfortable Loan', value: FC.formatINR(maxSafeLoan) },
        ],
        explain: `This loan's EMI of ${FC.formatINR(newEmi)} plus your existing ${FC.formatINR(v.existingEmi)} takes ${(foir * 100).toFixed(0)}% of your take-home — lenders and planners call this FOIR, and generally treat up to 35% as comfortable, 35–50% as tight, and beyond 50% as over-leveraged (most banks also stop approving there). ${foir <= 0.35 ? 'You have healthy breathing room for emergencies and investing.' : foir <= 0.50 ? `Consider a longer tenure, a bigger down payment, or capping the loan near ${FC.formatINR(maxSafeLoan)} to stay comfortable.` : `At this level a single income shock could cascade — a loan near ${FC.formatINR(maxSafeLoan)} would keep you at the 40% safety line.`}`,
      };
    },
  },

  /* ---- Quick insurance need ---- */
  {
    id: 'insurance-quick-need', name: 'Term Cover in 30 Seconds', cat: 'insurance',
    desc: 'Ballpark life cover from just age, income & dependents',
    inputs: [
      { id: 'age', label: 'Your Age', min: 21, max: 60, step: 1, def: 32 },
      { id: 'income', label: 'Annual Income (₹)', min: 100000, max: 20000000, step: 50000, def: 1200000 },
      { id: 'dependents', label: 'Who Depends on Your Income?', type: 'select', options: [['young', 'Spouse + young kids'], ['spouse', 'Spouse / parents only'], ['none', 'Nobody yet']], def: 'young' },
      { id: 'loans', label: 'Outstanding Loans (₹)', min: 0, max: 50000000, step: 100000, def: 2000000 },
    ],
    mainLabel: 'Recommended Cover',
    compute(v) {
      const baseMult = v.age < 35 ? 20 : v.age < 45 ? 15 : v.age < 55 ? 10 : 5;
      const depAdj = v.dependents === 'none' ? 0.3 : v.dependents === 'spouse' ? 0.8 : 1;
      const cover = Math.round((v.income * baseMult * depAdj + v.loans) / 500000) * 500000;
      return {
        main: FC.formatINR(cover),
        items: [
          { label: 'Income Replacement', value: `${baseMult}× income${depAdj < 1 ? ' (scaled for dependents)' : ''}` },
          { label: 'Loans Covered', value: FC.formatINR(v.loans) },
          { label: 'Rough Annual Premium (term plan)', value: FC.formatINR(cover * (v.age < 35 ? 0.0009 : v.age < 45 ? 0.0016 : 0.003)) },
        ],
        explain: `A simple, planner-approved ballpark: cover ${baseMult}× your annual income at age ${v.age}${depAdj < 1 ? (v.dependents === 'none' ? ' (scaled down since nobody depends on your income yet — but locking a policy young keeps premiums low forever)' : ' (scaled for a smaller dependent load)') : ''}, plus enough to extinguish your ${FC.formatINR(v.loans)} of loans so debt never lands on your family. Buy pure term insurance — maximum cover per rupee of premium — and skip investment-linked policies. For a detailed number use the full Life Insurance Need calculator in Related Calculators below.`,
      };
    },
  },

  /* ---- Payslip explainer ---- */
  {
    id: 'payslip-explainer', name: 'Payslip Explainer', cat: 'personal',
    desc: 'Where does your salary actually go each month?',
    inputs: [
      { id: 'gross', label: 'Gross Monthly Salary (₹)', min: 15000, max: 1000000, step: 5000, def: 80000 },
      { id: 'basicPct', label: 'Basic Salary Share', type: 'select', options: [['0.4', '40% of gross (common)'], ['0.5', '50% of gross']], def: '0.5' },
      { id: 'pt', label: 'Professional Tax', type: 'select', options: [['200', '₹200/month (most PT states)'], ['0', 'None (Delhi/UP etc.)']], def: '200' },
    ],
    mainLabel: 'In-hand Salary',
    compute(v) {
      const basic = v.gross * v.basicPct;
      const pf = basic * 0.12;
      const pt = parseFloat(v.pt) || 0;
      const annualTds = FC.taxNewRegime(v.gross * 12).tax;
      const tds = annualTds / 12;
      const inHand = v.gross - pf - pt - tds;
      return {
        main: FC.formatINR(inHand),
        items: [
          { label: 'Your PF Contribution (12% of basic)', value: FC.formatINR(pf) },
          { label: 'TDS on Salary (new regime)', value: FC.formatINR(tds) },
          { label: 'Professional Tax', value: FC.formatINR(pt) },
          { label: 'Going to Your Retirement (PF ×2)', value: FC.formatINR(pf * 2) },
        ],
        explain: `From your ${FC.formatINR(v.gross)} gross: ${FC.formatINR(pf)} goes into your EPF account (12% of basic — and your employer silently adds a matching ${FC.formatINR(pf)} on top of your gross, most of it into PF/pension), ${FC.formatINR(tds)} is income tax deducted at source under the new regime, and ${FC.formatINR(pt)} is state professional tax. What lands in your bank: ${FC.formatINR(inHand)}. The PF isn't money lost — it's ${FC.formatINR(pf * 2)}/month compounding at ~8.25% for your retirement.`,
      };
    },
  },
];

/* ============================================================
   COST INFLATION INDEX (CII) — reference table + indexer
   ============================================================ */
const CII_TABLE = [
  ['2001-02', 100], ['2002-03', 105], ['2003-04', 109], ['2004-05', 113], ['2005-06', 117],
  ['2006-07', 122], ['2007-08', 129], ['2008-09', 137], ['2009-10', 148], ['2010-11', 167],
  ['2011-12', 184], ['2012-13', 200], ['2013-14', 220], ['2014-15', 240], ['2015-16', 254],
  ['2016-17', 264], ['2017-18', 272], ['2018-19', 280], ['2019-20', 289], ['2020-21', 301],
  ['2021-22', 317], ['2022-23', 331], ['2023-24', 348], ['2024-25', 363], ['2025-26', 376],
];

function uiCIILookup() {
  const opts = (sel) => CII_TABLE.map(([fy]) => `<option value="${fy}"${fy === sel ? ' selected' : ''}>FY ${fy}</option>`).join('');
  return `<div class="tds-lookup">
    <div class="result-card">
      <div class="result-label">Indexed Cost of Acquisition</div>
      <div class="result-main" id="cii-result">--</div>
      <p class="quick-sentence" data-custom="1" id="cii-sentence">Pick purchase and sale years to inflate your cost basis.</p>
    </div>
    <div class="mini-form" style="margin-top:0">
      <div class="form-group"><label>Purchase Cost (₹)</label><input type="number" class="input" id="cii-cost" value="1000000" min="0" oninput="calcCII()" /></div>
      <div class="form-group"><label>Purchase Year</label><select class="input" id="cii-from" onchange="calcCII()">${opts('2015-16')}</select></div>
      <div class="form-group"><label>Sale Year</label><select class="input" id="cii-to" onchange="calcCII()">${opts('2025-26')}</select></div>
    </div>
    <div class="tds-table-wrap" style="max-height:300px">
      <table class="tds-table"><thead><tr><th>Financial Year</th><th>CII</th></tr></thead>
      <tbody>${CII_TABLE.map(([fy, i]) => `<tr><td class="tds-section">FY ${fy}</td><td class="tds-rate">${i}</td></tr>`).join('')}</tbody></table>
    </div>
    <div class="trust-line">
      <span class="trust-fy-tag">Base: FY 2001-02 = 100</span>
      <span>As per CBDT notifications up to FY 2025-26. Indexation now applies mainly to specified legacy/real-estate cases — check current rules for your asset class.</span>
    </div>
  </div>`;
}

function calcCII() {
  const cost = parseFloat(document.getElementById('cii-cost')?.value) || 0;
  const from = document.getElementById('cii-from')?.value;
  const to = document.getElementById('cii-to')?.value;
  const fi = CII_TABLE.find(([fy]) => fy === from)?.[1];
  const ti = CII_TABLE.find(([fy]) => fy === to)?.[1];
  if (!fi || !ti) return;
  const indexed = cost * ti / fi;
  const el = document.getElementById('cii-result');
  if (el) el.textContent = FC.formatINR(indexed);
  const s = document.getElementById('cii-sentence');
  if (s) s.textContent = `${FC.formatINR(cost)} spent in FY ${from} counts as ${FC.formatINR(indexed)} in FY ${to} — reducing your taxable gain by ${FC.formatINR(indexed - cost)}.`;
}

/* ============================================================
   XIRR WITH ACTUAL DATES — irregular cashflow IRR
   ============================================================ */
let xirrRowCount = 0;

function uiXIRR() {
  xirrRowCount = 0;
  const today = new Date().toISOString().slice(0, 10);
  const yearAgo = (n) => { const d = new Date(); d.setFullYear(d.getFullYear() - n); return d.toISOString().slice(0, 10); };
  const rows = [
    { date: yearAgo(3), amt: -100000 }, { date: yearAgo(2), amt: -150000 },
    { date: yearAgo(1), amt: -100000 }, { date: today, amt: 450000 },
  ].map(r => xirrRow(r.date, r.amt)).join('');
  return `<div class="tds-lookup">
    <div class="result-card">
      <div class="result-label">XIRR — Annualized Return</div>
      <div class="result-main" id="xirr-result">--</div>
      <div class="result-grid" id="xirr-grid"></div>
      <p class="quick-sentence" data-custom="1">Negative amounts are money you put in; positive are withdrawals or today's value.</p>
    </div>
    <div id="xirr-rows">${rows}</div>
    <div><button class="btn btn-ghost btn-sm" onclick="addXirrRow()">+ Add cashflow</button></div>
    <div class="calc-explanation" id="xirr-explain"></div>
  </div>`;
}

function xirrRow(date, amt) {
  const i = xirrRowCount++;
  return `<div class="ladder-row xirr-row" id="xrow-${i}">
    <div class="form-group"><label>Date</label><input type="date" class="input" id="xr-date-${i}" value="${date}" onchange="calcXIRR()" /></div>
    <div class="form-group"><label>Amount (₹, − invest / + redeem)</label><input type="number" class="input" id="xr-amt-${i}" value="${amt}" step="1000" oninput="calcXIRR()" /></div>
    <button class="btn btn-ghost btn-sm" onclick="document.getElementById('xrow-${i}').remove();calcXIRR()" aria-label="Remove cashflow">✕</button>
  </div>`;
}

function addXirrRow() {
  document.getElementById('xirr-rows')?.insertAdjacentHTML('beforeend', xirrRow(new Date().toISOString().slice(0, 10), 0));
}

function calcXIRR() {
  const flows = [];
  for (let i = 0; i < xirrRowCount; i++) {
    const d = document.getElementById(`xr-date-${i}`), a = document.getElementById(`xr-amt-${i}`);
    if (!d || !a) continue;
    const amt = parseFloat(a.value);
    const date = new Date(d.value);
    if (!isNaN(amt) && amt !== 0 && !isNaN(date.getTime())) flows.push({ date, amt });
  }
  const out = document.getElementById('xirr-result');
  const grid = document.getElementById('xirr-grid');
  const explain = document.getElementById('xirr-explain');
  if (!out) return;
  const invested = -flows.filter(f => f.amt < 0).reduce((s, f) => s + f.amt, 0);
  const redeemed = flows.filter(f => f.amt > 0).reduce((s, f) => s + f.amt, 0);
  if (flows.length < 2 || invested <= 0 || redeemed <= 0) {
    out.textContent = '--';
    if (explain) explain.textContent = 'Add at least one investment (negative) and one redemption/current value (positive).';
    return;
  }
  const t0 = Math.min(...flows.map(f => f.date.getTime()));
  const yrs = (f) => (f.date.getTime() - t0) / (365.25 * 86400000);
  const npv = (r) => flows.reduce((s, f) => s + f.amt / Math.pow(1 + r, yrs(f)), 0);
  /* bisection: npv is decreasing in r when net inflows come later */
  let lo = -0.9999, hi = 10;
  if (npv(lo) * npv(hi) > 0) {
    out.textContent = 'No solution';
    if (explain) explain.textContent = 'These cashflows have no meaningful rate of return in the −99.99% to 1000% range — check the signs and dates.';
    return;
  }
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (npv(mid) > 0) lo = mid; else hi = mid;
  }
  const rate = (lo + hi) / 2;
  out.textContent = (rate * 100).toFixed(2) + '% p.a.';
  if (grid) grid.innerHTML = `
    <div class="result-item"><div class="result-item-val">${FC.formatINR(invested)}</div><div class="result-item-label">Total Invested</div></div>
    <div class="result-item"><div class="result-item-val">${FC.formatINR(redeemed)}</div><div class="result-item-label">Total Redeemed / Current Value</div></div>
    <div class="result-item"><div class="result-item-val">${FC.formatINR(redeemed - invested)}</div><div class="result-item-label">Absolute Gain</div></div>`;
  if (explain) explain.textContent = `XIRR weighs every cashflow by exactly how long it stayed invested (actual dates, not averages) — the one honest annualized return for SIPs with top-ups, pauses and partial withdrawals. Your ${flows.length} cashflows work out to ${(rate * 100).toFixed(2)}% p.a. This is the same XIRR your mutual fund statement shows.`;
}

/* ============================================================
   PART 2 REGISTRATION — chain UIs, extend registries
   ============================================================ */
const _prevBuildCalcUI_prof2 = buildCalcUI;
buildCalcUI = function (id) {
  if (id === 'cii-lookup') return uiCIILookup();
  if (id === 'xirr-calculator') return uiXIRR();
  return _prevBuildCalcUI_prof2(id);
};
const _prevCalcLive_prof2 = calcLive;
calcLive = function (id) {
  if (id === 'cii-lookup') { calcCII(); return; }
  if (id === 'xirr-calculator') { calcXIRR(); return; }
  return _prevCalcLive_prof2(id);
};

CALCULATORS.push(
  { id: 'cii-lookup', name: 'Cost Inflation Index (CII) Lookup & Indexer', cat: 'tax', desc: 'CII table since 2001-02 with indexed-cost calculator' },
  { id: 'xirr-calculator', name: 'XIRR Calculator (Actual Dates)', cat: 'investment', desc: 'True annualized return from irregular, dated cashflows' },
);
ICONS['cii-lookup'] = ICONS['income-tax'];
ICONS['xirr-calculator'] = ICONS['sip'];

PROFESSIONAL_CALC_DEFS_2.forEach(def => {
  EXTRA_CALC_DEFS.push(def);
  CALCULATORS.push({ id: def.id, name: def.name, cat: def.cat, desc: def.desc });
  if (!ICONS[def.id]) ICONS[def.id] = ICONS[PROFESSIONAL_CATEGORY_ICONS[def.cat]] || ICONS.tax;
});

/* keep the professional tools clustered in the Related rail */
['advance-tax', 'gst-late-fee', 'presumptive-tax', 'tax-audit-checker', 'csr-calculator',
 'cii-lookup', 'professional-tax'].forEach(id => PROFESSIONAL_CALC_IDS.add(id));
