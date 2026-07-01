/* ============================================================
   FinCalc Pro — tax-calculators.js
   Comprehensive tax calculators aligned to the Income Tax Act,
   2025 (effective FY 2026-27, replacing the Income Tax Act, 1961).
   Loaded after extra-calculators-2.js — appends into the shared
   EXTRA_CALC_DEFS registry using the same generic calculator engine.
   ============================================================ */

const TAX_CALC_DEFS = [

  {
    id: 'new-tax-regime', name: 'New Tax Regime Calculator (IT Act 2025)', cat: 'tax',
    desc: 'Tax payable under the new regime slabs, FY 2026-27',
    inputs: [
      { id: 'income', label: 'Gross Annual Income (₹)', min: 0, max: 10000000, step: 10000, def: 1200000 },
    ],
    mainLabel: 'Tax Payable',
    compute(v) {
      const res = FC.taxNewRegime(v.income);
      const items = [
        { label: 'Taxable Income', value: FC.formatINR(res.taxableIncome) },
      ];
      if (res.surcharge > 0) items.push({ label: 'Surcharge', value: FC.formatINR(res.surcharge) });
      items.push({ label: 'Health & Education Cess (4%)', value: FC.formatINR(res.cess) });
      items.push({ label: 'Take-home (Annual)', value: FC.formatINR(v.income - res.tax) });
      return {
        main: FC.formatINR(res.tax),
        items,
        explain: `Under the Income Tax Act, 2025 new regime slabs (0% to ₹4L, rising to 30% above ₹24L, with a ₹60,000 rebate up to ₹12L taxable income), tax on ${FC.formatINR(v.income)} gross income is ${FC.formatINR(res.tax)}${res.surcharge > 0 ? ` — including ${FC.formatINR(res.surcharge)} surcharge` : ''} and ${FC.formatINR(res.cess)} in 4% Health & Education Cess.`,
      };
    },
  },
  {
    id: 'old-tax-regime', name: 'Old Tax Regime Calculator', cat: 'tax',
    desc: 'Tax payable under the old regime with deductions',
    inputs: [
      { id: 'income', label: 'Gross Annual Income (₹)', min: 0, max: 10000000, step: 10000, def: 1200000 },
      { id: 'c80c', label: 'Section 80C Investments (₹)', min: 0, max: 150000, step: 5000, def: 150000 },
      { id: 'c80d', label: 'Section 80D Health Insurance (₹)', min: 0, max: 75000, step: 5000, def: 25000 },
      { id: 'hra', label: 'HRA Exemption (₹)', min: 0, max: 600000, step: 10000, def: 0 },
    ],
    mainLabel: 'Tax Payable',
    compute(v) {
      const res = FC.taxOldRegime(v.income, { sec80c: v.c80c, sec80d: v.c80d, hra: v.hra });
      const items = [
        { label: 'Taxable Income', value: FC.formatINR(res.taxableIncome) },
      ];
      if (res.surcharge > 0) items.push({ label: 'Surcharge', value: FC.formatINR(res.surcharge) });
      items.push({ label: 'Health & Education Cess (4%)', value: FC.formatINR(res.cess) });
      items.push({ label: 'Take-home (Annual)', value: FC.formatINR(v.income - res.tax) });
      return {
        main: FC.formatINR(res.tax),
        items,
        explain: `After the ₹50,000 standard deduction and eligible 80C/80D/HRA deductions, taxable income is ${FC.formatINR(res.taxableIncome)}, with tax payable of ${FC.formatINR(res.tax)}${res.surcharge > 0 ? ` (including ${FC.formatINR(res.surcharge)} surcharge` : ' (including'} and ${FC.formatINR(res.cess)} in 4% Health & Education Cess) under the old regime.`,
      };
    },
  },
  {
    id: 'tax-regime-comparison', name: 'Old vs New Tax Regime Comparison', cat: 'tax',
    desc: 'Compare old and new regimes to pick the better one',
    inputs: [
      { id: 'income', label: 'Gross Annual Income (₹)', min: 0, max: 10000000, step: 10000, def: 1200000 },
      { id: 'c80c', label: 'Section 80C Investments (₹)', min: 0, max: 150000, step: 5000, def: 150000 },
      { id: 'c80d', label: 'Section 80D Health Insurance (₹)', min: 0, max: 75000, step: 5000, def: 25000 },
      { id: 'hra', label: 'HRA Exemption (₹)', min: 0, max: 600000, step: 10000, def: 0 },
    ],
    mainLabel: 'Better Regime',
    compute(v) {
      const oldRes = FC.taxOldRegime(v.income, { sec80c: v.c80c, sec80d: v.c80d, hra: v.hra });
      const newRes = FC.taxNewRegime(v.income);
      const better = oldRes.tax <= newRes.tax ? 'Old Regime' : 'New Regime';
      const savings = Math.abs(oldRes.tax - newRes.tax);
      return {
        main: better,
        items: [
          { label: 'Old Regime Tax (incl. cess/surcharge)', value: FC.formatINR(oldRes.tax) },
          { label: 'New Regime Tax (incl. cess/surcharge)', value: FC.formatINR(newRes.tax) },
          { label: 'You Save', value: FC.formatINR(savings) },
        ],
        explain: `Old Regime Tax: ${FC.formatINR(oldRes.tax)} (cess ${FC.formatINR(oldRes.cess)}${oldRes.surcharge > 0 ? `, surcharge ${FC.formatINR(oldRes.surcharge)}` : ''}). New Regime Tax (IT Act 2025): ${FC.formatINR(newRes.tax)} (cess ${FC.formatINR(newRes.cess)}${newRes.surcharge > 0 ? `, surcharge ${FC.formatINR(newRes.surcharge)}` : ''}). ${better} saves you ${FC.formatINR(savings)}.`,
      };
    },
  },
  {
    id: 'income-tax-calculator', name: 'Comprehensive Income Tax Calculator', cat: 'tax',
    desc: 'Full salary tax estimate with effective rate & take-home',
    inputs: [
      { id: 'salary', label: 'Gross Salary (₹)', min: 0, max: 10000000, step: 10000, def: 1000000 },
      { id: 'regime', label: 'Tax Regime', type: 'select', options: [['new', 'New Regime (IT Act 2025)'], ['old', 'Old Regime']], def: 'new' },
      { id: 'c80c', label: 'Section 80C (Old Regime Only) (₹)', min: 0, max: 150000, step: 5000, def: 150000 },
    ],
    mainLabel: 'Total Tax Payable',
    compute(v) {
      const isNew = v.regime === 'new' || isNaN(v.regime);
      const res = isNew ? FC.taxNewRegime(v.salary) : FC.taxOldRegime(v.salary, { sec80c: v.c80c });
      const effectiveRate = v.salary > 0 ? (res.tax / v.salary * 100).toFixed(2) : 0;
      return {
        main: FC.formatINR(res.tax),
        items: [
          { label: 'Taxable Income', value: FC.formatINR(res.taxableIncome) },
          { label: 'Cess + Surcharge', value: FC.formatINR(res.cess + res.surcharge) },
          { label: 'Effective Tax Rate', value: effectiveRate + '%' },
          { label: 'Monthly Take-home', value: FC.formatINR((v.salary - res.tax) / 12) },
        ],
        explain: `On a gross salary of ${FC.formatINR(v.salary)} under the ${isNew ? 'new' : 'old'} regime, tax payable is ${FC.formatINR(res.tax)} (${effectiveRate}% effective rate), including ${FC.formatINR(res.cess)} cess${res.surcharge > 0 ? ` and ${FC.formatINR(res.surcharge)} surcharge` : ''}.`,
      };
    },
  },
  {
    id: 'tax-rebate-87a', name: 'Section 87A Rebate Calculator', cat: 'tax',
    desc: 'Check if you qualify for the full tax rebate',
    inputs: [
      { id: 'taxableIncome', label: 'Taxable Income (₹)', min: 0, max: 2000000, step: 10000, def: 1000000 },
      { id: 'regime', label: 'Tax Regime', type: 'select', options: [['new', 'New Regime (limit ₹12L)'], ['old', 'Old Regime (limit ₹5L)']], def: 'new' },
    ],
    mainLabel: 'Rebate Eligibility',
    compute(v) {
      const isNew = v.regime === 'new' || isNaN(v.regime);
      const limit = isNew ? 1200000 : 500000;
      const maxRebate = isNew ? 60000 : 12500;
      const eligible = v.taxableIncome <= limit;
      return {
        main: eligible ? `Eligible (up to ${FC.formatINR(maxRebate)})` : 'Not Eligible',
        items: [{ label: 'Rebate Threshold', value: FC.formatINR(limit) }],
        explain: eligible
          ? `Taxable income of ${FC.formatINR(v.taxableIncome)} is within the ₹${(limit/100000).toFixed(0)}L threshold — you qualify for a Section 87A rebate of up to ${FC.formatINR(maxRebate)}, potentially reducing your tax to zero.`
          : `Taxable income of ${FC.formatINR(v.taxableIncome)} exceeds the ₹${(limit/100000).toFixed(0)}L threshold, so no Section 87A rebate applies.`,
      };
    },
  },
  {
    id: 'hra-exemption-2025', name: 'HRA Exemption Calculator', cat: 'tax',
    desc: 'Tax-exempt House Rent Allowance under the old regime',
    inputs: [
      { id: 'basic', label: 'Basic Salary (Annual) (₹)', min: 100000, max: 10000000, step: 10000, def: 600000 },
      { id: 'hra', label: 'HRA Received (Annual) (₹)', min: 0, max: 5000000, step: 10000, def: 240000 },
      { id: 'rent', label: 'Rent Paid (Annual) (₹)', min: 0, max: 5000000, step: 10000, def: 300000 },
      { id: 'metro', label: 'City Type', type: 'select', options: [['1', 'Metro (Delhi/Mumbai/Kolkata/Chennai)'], ['0', 'Non-Metro']], def: '1' },
    ],
    mainLabel: 'HRA Exemption',
    compute(v) {
      const isMetro = v.metro === 1 || v.metro === '1';
      const basicPct = isMetro ? 0.5 : 0.4;
      const excessRent = Math.max(0, v.rent - 0.10 * v.basic);
      const exemption = Math.max(0, Math.min(v.hra, v.basic * basicPct, excessRent));
      return {
        main: FC.formatINR(exemption),
        items: [{ label: 'Taxable HRA', value: FC.formatINR(v.hra - exemption) }],
        explain: `HRA exemption is the least of: HRA received (${FC.formatINR(v.hra)}), ${(basicPct * 100)}% of basic (${FC.formatINR(v.basic * basicPct)}), or rent minus 10% of basic (${FC.formatINR(excessRent)}) → ${FC.formatINR(exemption)}.`,
      };
    },
  },
  {
    id: 'standard-deduction', name: 'Standard Deduction Impact Calculator', cat: 'tax',
    desc: 'Tax saved from the standard deduction on salary income',
    inputs: [
      { id: 'salary', label: 'Gross Salary (₹)', min: 100000, max: 10000000, step: 10000, def: 1000000 },
      { id: 'slab', label: 'Marginal Tax Slab (%)', type: 'select', options: [['0', '0%'], ['5', '5%'], ['10', '10%'], ['15', '15%'], ['20', '20%'], ['25', '25%'], ['30', '30%']], def: '20' },
      { id: 'deduction', label: 'Standard Deduction Amount (₹)', type: 'select', options: [['50000', '₹50,000 (Old Regime)'], ['75000', '₹75,000 (New Regime, IT Act 2025)']], def: '75000' },
    ],
    mainLabel: 'Tax Saved',
    compute(v) {
      const saved = v.deduction * (v.slab / 100);
      return {
        main: FC.formatINR(saved),
        items: [{ label: 'Reduced Taxable Income', value: FC.formatINR(v.salary - v.deduction) }],
        explain: `A standard deduction of ${FC.formatINR(v.deduction)} at your ${v.slab}% marginal slab saves ${FC.formatINR(saved)} in tax.`,
      };
    },
  },
  {
    id: 'section-80c-calculator', name: 'Section 80C Tax Saving Calculator', cat: 'tax',
    desc: 'Tax saved by fully utilizing the ₹1.5L 80C limit',
    inputs: [
      { id: 'investment', label: '80C Investment Amount (₹)', min: 0, max: 150000, step: 5000, def: 150000 },
      { id: 'slab', label: 'Marginal Tax Slab (%)', type: 'select', options: [['5', '5%'], ['10', '10%'], ['20', '20%'], ['30', '30%']], def: '30' },
    ],
    mainLabel: 'Tax Saved',
    compute(v) {
      const eligible = Math.min(v.investment, 150000);
      const saved = eligible * (v.slab / 100);
      return {
        main: FC.formatINR(saved),
        items: [{ label: 'Eligible Deduction', value: FC.formatINR(eligible) }],
        explain: `Investing ${FC.formatINR(eligible)} under Section 80C (PPF, ELSS, life insurance, etc.) at a ${v.slab}% marginal slab saves ${FC.formatINR(saved)} in tax. Note: 80C deductions apply only under the old regime.`,
      };
    },
  },
  {
    id: 'section-80d-calculator', name: 'Section 80D Health Insurance Tax Saving Calculator', cat: 'tax',
    desc: 'Tax saved on health insurance premiums for self & parents',
    inputs: [
      { id: 'selfPremium', label: 'Self/Family Premium (₹)', min: 0, max: 25000, step: 1000, def: 20000 },
      { id: 'parentsPremium', label: 'Parents Premium (₹)', min: 0, max: 50000, step: 1000, def: 25000 },
      { id: 'seniorParents', label: 'Parents are Senior Citizens?', type: 'select', options: [['1', 'Yes (limit ₹50,000)'], ['0', 'No (limit ₹25,000)']], def: '1' },
      { id: 'slab', label: 'Marginal Tax Slab (%)', type: 'select', options: [['5', '5%'], ['10', '10%'], ['20', '20%'], ['30', '30%']], def: '30' },
    ],
    mainLabel: 'Tax Saved',
    compute(v) {
      const parentLimit = (v.seniorParents === 1 || v.seniorParents === '1') ? 50000 : 25000;
      const eligibleSelf = Math.min(v.selfPremium, 25000);
      const eligibleParents = Math.min(v.parentsPremium, parentLimit);
      const totalDeduction = eligibleSelf + eligibleParents;
      const saved = totalDeduction * (v.slab / 100);
      return {
        main: FC.formatINR(saved),
        items: [{ label: 'Total Eligible Deduction', value: FC.formatINR(totalDeduction) }],
        explain: `Self/family premium of ${FC.formatINR(eligibleSelf)} plus parents' premium of ${FC.formatINR(eligibleParents)} gives a Section 80D deduction of ${FC.formatINR(totalDeduction)}, saving ${FC.formatINR(saved)} in tax (old regime only).`,
      };
    },
  },
  {
    id: 'nps-80ccd-calculator', name: 'NPS Additional Deduction Calculator (80CCD(1B))', cat: 'tax',
    desc: 'Extra tax saving from the additional ₹50,000 NPS deduction',
    inputs: [
      { id: 'contribution', label: 'Annual NPS Contribution (₹)', min: 0, max: 200000, step: 5000, def: 50000 },
      { id: 'slab', label: 'Marginal Tax Slab (%)', type: 'select', options: [['5', '5%'], ['10', '10%'], ['20', '20%'], ['30', '30%']], def: '30' },
    ],
    mainLabel: 'Additional Tax Saved',
    compute(v) {
      const eligible = Math.min(v.contribution, 50000);
      const saved = eligible * (v.slab / 100);
      return {
        main: FC.formatINR(saved),
        items: [{ label: 'Eligible Deduction (80CCD(1B))', value: FC.formatINR(eligible) }],
        explain: `Over and above the ₹1.5L Section 80C limit, an NPS contribution of ${FC.formatINR(eligible)} under 80CCD(1B) saves an additional ${FC.formatINR(saved)} in tax (old regime only).`,
      };
    },
  },
  {
    id: 'home-loan-tax-benefit', name: 'Home Loan Tax Benefit Calculator', cat: 'tax',
    desc: 'Tax saved on home loan interest & principal repayment',
    inputs: [
      { id: 'interest', label: 'Annual Interest Paid (₹)', min: 0, max: 500000, step: 5000, def: 200000 },
      { id: 'principal', label: 'Annual Principal Repaid (₹)', min: 0, max: 150000, step: 5000, def: 100000 },
      { id: 'selfOccupied', label: 'Property Type', type: 'select', options: [['1', 'Self-Occupied (interest cap ₹2L)'], ['0', 'Let-Out (no interest cap)']], def: '1' },
      { id: 'slab', label: 'Marginal Tax Slab (%)', type: 'select', options: [['5', '5%'], ['10', '10%'], ['20', '20%'], ['30', '30%']], def: '30' },
    ],
    mainLabel: 'Total Tax Saved',
    compute(v) {
      const isSelfOccupied = v.selfOccupied === 1 || v.selfOccupied === '1';
      const eligibleInterest = isSelfOccupied ? Math.min(v.interest, 200000) : v.interest;
      const eligiblePrincipal = Math.min(v.principal, 150000);
      const totalDeduction = eligibleInterest + eligiblePrincipal;
      const saved = totalDeduction * (v.slab / 100);
      return {
        main: FC.formatINR(saved),
        items: [
          { label: 'Interest Deduction (Sec 24)', value: FC.formatINR(eligibleInterest) },
          { label: 'Principal Deduction (Sec 80C)', value: FC.formatINR(eligiblePrincipal) },
        ],
        explain: `Interest deduction of ${FC.formatINR(eligibleInterest)} plus principal deduction of ${FC.formatINR(eligiblePrincipal)} saves ${FC.formatINR(saved)} in tax (old regime only).`,
      };
    },
  },
  {
    id: 'capital-gains-tax-2025', name: 'Capital Gains Tax Calculator', cat: 'tax',
    desc: 'STCG & LTCG tax on equity, debt and real estate',
    inputs: [
      { id: 'assetType', label: 'Asset Type', type: 'select', options: [['equity', 'Equity / Equity MF'], ['debt', 'Debt / Real Estate']], def: 'equity' },
      { id: 'buy', label: 'Buy Price per Unit (₹)', min: 1, max: 1000000, step: 1, def: 100 },
      { id: 'sell', label: 'Sell Price per Unit (₹)', min: 1, max: 1000000, step: 1, def: 200 },
      { id: 'units', label: 'Number of Units', min: 1, max: 100000, step: 1, def: 100 },
      { id: 'months', label: 'Holding Period (Months)', min: 1, max: 120, step: 1, def: 13 },
    ],
    mainLabel: 'Tax Payable',
    compute(v) {
      const res = FC.capitalGains(v.buy, v.sell, v.units, v.months, v.assetType);
      return {
        main: FC.formatINR(res.tax),
        items: [
          { label: 'Total Gain', value: FC.formatINR(res.gain) },
          { label: 'Gain Type', value: res.isLongTerm ? 'Long-Term (LTCG)' : 'Short-Term (STCG)' },
          { label: 'Net Gain After Tax', value: FC.formatINR(res.netGain) },
        ],
        explain: res.isLongTerm
          ? (v.assetType === 'equity' ? `LTCG on equity: 12.5% on gains above ₹1.25L exemption (${FC.formatINR(res.exemption)} exempt). Tax: ${FC.formatINR(res.tax)}.` : `LTCG on debt/real estate: 12.5% without indexation. Tax: ${FC.formatINR(res.tax)}.`)
          : (v.assetType === 'equity' ? `STCG on equity: flat 20% tax. Tax: ${FC.formatINR(res.tax)}.` : `STCG on debt: taxed at slab rate (estimated 30%). Tax: ${FC.formatINR(res.tax)}.`),
      };
    },
  },
  {
    id: 'presumptive-taxation', name: 'Presumptive Taxation Calculator (44AD/44ADA)', cat: 'tax',
    desc: 'Simplified tax estimate for small businesses & professionals',
    inputs: [
      { id: 'turnover', label: 'Annual Turnover / Gross Receipts (₹)', min: 100000, max: 20000000, step: 10000, def: 3000000 },
      { id: 'category', label: 'Category', type: 'select', options: [['business', 'Business (44AD — 8%/6% deemed profit)'], ['profession', 'Profession (44ADA — 50% deemed profit)']], def: 'business' },
      { id: 'digitalPercent', label: '% Receipts via Digital Mode (Business only)', min: 0, max: 100, step: 5, def: 100 },
      { id: 'slab', label: 'Marginal Tax Slab (%)', type: 'select', options: [['0', '0%'], ['5', '5%'], ['20', '20%'], ['30', '30%']], def: '20' },
    ],
    mainLabel: 'Deemed Taxable Profit',
    compute(v) {
      let deemedRate;
      if (v.category === 'profession') {
        deemedRate = 0.50;
      } else {
        deemedRate = v.digitalPercent >= 95 ? 0.06 : 0.08;
      }
      const deemedProfit = v.turnover * deemedRate;
      const estTax = deemedProfit * (v.slab / 100);
      return {
        main: FC.formatINR(deemedProfit),
        items: [
          { label: 'Deemed Profit Rate', value: (deemedRate * 100).toFixed(0) + '%' },
          { label: 'Estimated Tax', value: FC.formatINR(estTax) },
        ],
        explain: `Under presumptive taxation, ${(deemedRate * 100).toFixed(0)}% of ${FC.formatINR(v.turnover)} turnover (${FC.formatINR(deemedProfit)}) is deemed taxable profit — no need to maintain detailed books of account.`,
      };
    },
  },
  {
    id: 'advance-tax-calculator', name: 'Advance Tax Installment Calculator', cat: 'tax',
    desc: 'Quarterly advance tax due dates and amounts',
    inputs: [
      { id: 'estimatedTax', label: 'Estimated Annual Tax Liability (₹)', min: 10000, max: 10000000, step: 10000, def: 200000 },
      { id: 'tdsAlreadyPaid', label: 'TDS Already Deducted (₹)', min: 0, max: 10000000, step: 10000, def: 50000 },
    ],
    mainLabel: 'Net Advance Tax Payable',
    compute(v) {
      const netLiability = Math.max(0, v.estimatedTax - v.tdsAlreadyPaid);
      const q1 = netLiability * 0.15, q2 = netLiability * 0.45 - q1, q3 = netLiability * 0.75 - (q1 + q2), q4 = netLiability - (q1 + q2 + q3);
      return {
        main: FC.formatINR(netLiability),
        items: [
          { label: 'By 15 Jun (15%)', value: FC.formatINR(q1) },
          { label: 'By 15 Sep (45% cumulative)', value: FC.formatINR(q2) },
          { label: 'By 15 Dec (75% cumulative)', value: FC.formatINR(q3) },
          { label: 'By 15 Mar (100%)', value: FC.formatINR(q4) },
        ],
        explain: `Net advance tax of ${FC.formatINR(netLiability)} (after TDS credit) is payable in four installments of 15%, 45%, 75% and 100% cumulative by Jun 15, Sep 15, Dec 15 and Mar 15 respectively.`,
      };
    },
  },
  {
    id: 'tds-salary-calculator', name: 'TDS on Salary Calculator', cat: 'tax',
    desc: 'Monthly TDS to be deducted by employer',
    inputs: [
      { id: 'annualSalary', label: 'Gross Annual Salary (₹)', min: 100000, max: 10000000, step: 10000, def: 1200000 },
      { id: 'regime', label: 'Tax Regime', type: 'select', options: [['new', 'New Regime (IT Act 2025)'], ['old', 'Old Regime']], def: 'new' },
    ],
    mainLabel: 'Monthly TDS',
    compute(v) {
      const isNew = v.regime === 'new' || isNaN(v.regime);
      const res = isNew ? FC.taxNewRegime(v.annualSalary) : FC.taxOldRegime(v.annualSalary, {});
      const monthlyTds = res.tax / 12;
      return {
        main: FC.formatINR(monthlyTds),
        items: [{ label: 'Annual Tax Liability', value: FC.formatINR(res.tax) }],
        explain: `Based on an annual tax liability of ${FC.formatINR(res.tax)}, your employer should deduct approximately ${FC.formatINR(monthlyTds)}/month as TDS.`,
      };
    },
  },
  {
    id: 'late-tax-interest', name: 'Interest on Late Tax Payment Calculator (234A/B/C)', cat: 'tax',
    desc: 'Penal interest for delayed advance/self-assessment tax',
    inputs: [
      { id: 'unpaidTax', label: 'Unpaid Tax Amount (₹)', min: 1000, max: 10000000, step: 1000, def: 50000 },
      { id: 'monthsDelayed', label: 'Months Delayed', min: 1, max: 24, step: 1, def: 3 },
    ],
    mainLabel: 'Interest Payable',
    compute(v) {
      const interest = v.unpaidTax * 0.01 * v.monthsDelayed;
      return {
        main: FC.formatINR(interest),
        items: [{ label: 'Total Payable', value: FC.formatINR(v.unpaidTax + interest) }],
        explain: `At 1% simple interest per month (Sections 234A/B/C), ${v.monthsDelayed} months delay on ${FC.formatINR(v.unpaidTax)} unpaid tax adds ${FC.formatINR(interest)} in interest.`,
      };
    },
  },
  {
    id: 'gratuity-tax-exemption', name: 'Gratuity Tax Exemption Calculator', cat: 'tax',
    desc: 'Tax-exempt portion of gratuity received',
    inputs: [
      { id: 'gratuityReceived', label: 'Gratuity Received (₹)', min: 0, max: 5000000, step: 10000, def: 1000000 },
      { id: 'salary', label: 'Last Drawn Salary (Basic + DA) (₹)', min: 5000, max: 2000000, step: 1000, def: 60000 },
      { id: 'years', label: 'Years of Service', min: 1, max: 45, step: 1, def: 10 },
      { id: 'covered', label: 'Covered Under Gratuity Act?', type: 'select', options: [['1', 'Yes'], ['0', 'No']], def: '1' },
    ],
    mainLabel: 'Exempt Amount',
    compute(v) {
      const isCovered = v.covered === 1 || v.covered === '1';
      const statutoryLimit = 2000000;
      const formulaExemption = isCovered
        ? (v.salary * 15 * v.years) / 26
        : (v.salary * v.years) / 2;
      const exemption = Math.min(v.gratuityReceived, formulaExemption, statutoryLimit);
      return {
        main: FC.formatINR(exemption),
        items: [{ label: 'Taxable Gratuity', value: FC.formatINR(Math.max(0, v.gratuityReceived - exemption)) }],
        explain: `The exempt amount is the least of gratuity received, the statutory formula (${FC.formatINR(formulaExemption)}), and the ₹20L cap → ${FC.formatINR(exemption)} is tax-free.`,
      };
    },
  },
  {
    id: 'leave-encashment-tax', name: 'Leave Encashment Tax Exemption Calculator', cat: 'tax',
    desc: 'Tax-exempt portion of leave encashment on retirement',
    inputs: [
      { id: 'amountReceived', label: 'Leave Encashment Received (₹)', min: 0, max: 5000000, step: 10000, def: 500000 },
      { id: 'avgSalary', label: 'Avg Monthly Salary (Last 10 Months) (₹)', min: 5000, max: 2000000, step: 1000, def: 60000 },
      { id: 'leaveDaysEarned', label: 'Leave Days Earned (Unutilized)', min: 1, max: 300, step: 1, def: 90 },
    ],
    mainLabel: 'Exempt Amount',
    compute(v) {
      const statutoryLimit = 2500000;
      const cashEquivalent = (v.avgSalary / 30) * v.leaveDaysEarned;
      const tenMonthsSalary = v.avgSalary * 10;
      const exemption = Math.min(v.amountReceived, cashEquivalent, tenMonthsSalary, statutoryLimit);
      return {
        main: FC.formatINR(exemption),
        items: [{ label: 'Taxable Portion', value: FC.formatINR(Math.max(0, v.amountReceived - exemption)) }],
        explain: `For government/non-government employees (retirement), the exemption is the least of amount received, cash equivalent of leave (${FC.formatINR(cashEquivalent)}), 10 months' salary (${FC.formatINR(tenMonthsSalary)}), and the ₹25L cap → ${FC.formatINR(exemption)} exempt.`,
      };
    },
  },
  {
    id: 'tds-rent-calculator', name: 'TDS on Rent Calculator', cat: 'tax',
    desc: 'TDS deductible on rent paid (Section 194-I / 194-IB)',
    inputs: [
      { id: 'monthlyRent', label: 'Monthly Rent (₹)', min: 1000, max: 1000000, step: 1000, def: 60000 },
      { id: 'payerType', label: 'Payer Type', type: 'select', options: [['individual', 'Individual/HUF (194-IB, rent > ₹50,000/month)'], ['business', 'Business Entity (194-I)']], def: 'individual' },
    ],
    mainLabel: 'TDS Deductible',
    compute(v) {
      const isIndividual = v.payerType === 'individual';
      let rate, applicable;
      if (isIndividual) {
        applicable = v.monthlyRent > 50000;
        rate = 0.02;
      } else {
        applicable = true;
        rate = 0.10;
      }
      const annualRent = v.monthlyRent * 12;
      const tds = applicable ? annualRent * rate : 0;
      return {
        main: applicable ? FC.formatINR(tds) : 'No TDS Applicable',
        items: [{ label: 'Annual Rent', value: FC.formatINR(annualRent) }],
        explain: applicable
          ? `TDS at ${(rate * 100).toFixed(0)}% on annual rent of ${FC.formatINR(annualRent)} is ${FC.formatINR(tds)}.`
          : `Monthly rent of ${FC.formatINR(v.monthlyRent)} is below the ₹50,000 threshold for Section 194-IB — no TDS required for individual payers.`,
      };
    },
  },
  {
    id: 'gst-calculator', name: 'GST Calculator', cat: 'tax',
    desc: 'Add or remove GST from an amount',
    inputs: [
      { id: 'amount', label: 'Amount (₹)', min: 1, max: 10000000, step: 1, def: 10000 },
      { id: 'rate', label: 'GST Rate (%)', type: 'select', options: [['0', '0%'], ['5', '5%'], ['12', '12%'], ['18', '18%'], ['28', '28%']], def: '18' },
      { id: 'mode', label: 'Calculation Mode', type: 'select', options: [['exclusive', 'Add GST (amount is pre-GST)'], ['inclusive', 'Remove GST (amount includes GST)']], def: 'exclusive' },
    ],
    mainLabel: 'Total Amount',
    compute(v) {
      const rate = v.rate / 100;
      let base, gstAmt, total;
      if (v.mode === 'exclusive' || isNaN(v.mode)) {
        base = v.amount; gstAmt = base * rate; total = base + gstAmt;
      } else {
        total = v.amount; base = total / (1 + rate); gstAmt = total - base;
      }
      return {
        main: FC.formatINR(total),
        items: [
          { label: 'Base Amount', value: FC.formatINR(base) },
          { label: 'GST Amount', value: FC.formatINR(gstAmt) },
        ],
        explain: `At ${(rate * 100).toFixed(0)}% GST, base ${FC.formatINR(base)} + GST ${FC.formatINR(gstAmt)} = ${FC.formatINR(total)}.`,
      };
    },
  },
];

/* ============================================================
   REGISTRATION — append into shared EXTRA_CALC_DEFS registry
   ============================================================ */
TAX_CALC_DEFS.forEach(def => {
  EXTRA_CALC_DEFS.push(def);
  CALCULATORS.push({ id: def.id, name: def.name, cat: def.cat, desc: def.desc });
  if (!ICONS[def.id]) ICONS[def.id] = ICONS.tax;
});
