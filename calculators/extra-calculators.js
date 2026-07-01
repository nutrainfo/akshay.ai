/* ============================================================
   FinCalc Pro — extra-calculators.js
   50 additional calculators (business, real-estate, insurance,
   crypto, personal finance + more loan/savings/investment/tax).
   Data-driven: each def describes inputs + a compute() function.
   Loaded after app.js — extends CALCULATORS / buildCalcUI / calcLive.
   ============================================================ */

const EXTRA_CALC_DEFS = [

  /* ---------------- BUSINESS ---------------- */
  {
    id: 'breakeven', name: 'Break-even Point Calculator', cat: 'business',
    desc: 'Units needed to sell to cover fixed costs',
    inputs: [
      { id: 'fixed', label: 'Fixed Costs (₹)', min: 1000, max: 10000000, step: 1000, def: 200000 },
      { id: 'price', label: 'Selling Price per Unit (₹)', min: 1, max: 100000, step: 1, def: 500 },
      { id: 'variable', label: 'Variable Cost per Unit (₹)', min: 0, max: 99000, step: 1, def: 200 },
    ],
    mainLabel: 'Break-even Units',
    compute(v) {
      const contrib = v.price - v.variable;
      const units = contrib > 0 ? v.fixed / contrib : Infinity;
      const revenue = isFinite(units) ? units * v.price : Infinity;
      return {
        main: isFinite(units) ? Math.ceil(units).toLocaleString('en-IN') : '∞',
        items: [
          { label: 'Break-even Revenue', value: FC.formatINR(revenue) },
          { label: 'Contribution / Unit', value: FC.formatINR(contrib) },
        ],
        explain: contrib > 0
          ? `You must sell ${Math.ceil(units).toLocaleString('en-IN')} units (₹${revenue.toFixed(0)} revenue) to cover fixed costs of ${FC.formatINR(v.fixed)}.`
          : `Selling price must exceed variable cost per unit to ever break even.`,
      };
    },
  },
  {
    id: 'profit-margin', name: 'Profit Margin Calculator', cat: 'business',
    desc: 'Gross & net profit margin from revenue and cost',
    inputs: [
      { id: 'revenue', label: 'Revenue (₹)', min: 1000, max: 100000000, step: 1000, def: 1000000 },
      { id: 'cost', label: 'Total Cost (₹)', min: 0, max: 100000000, step: 1000, def: 700000 },
    ],
    mainLabel: 'Profit Margin',
    compute(v) {
      const profit = v.revenue - v.cost;
      const margin = v.revenue > 0 ? (profit / v.revenue) * 100 : 0;
      return {
        main: margin.toFixed(1) + '%',
        items: [
          { label: 'Net Profit', value: FC.formatINR(profit) },
          { label: 'Markup on Cost', value: v.cost > 0 ? ((profit / v.cost) * 100).toFixed(1) + '%' : '--' },
        ],
        explain: `Revenue of ${FC.formatINR(v.revenue)} minus cost of ${FC.formatINR(v.cost)} gives a profit margin of ${margin.toFixed(1)}%.`,
      };
    },
  },
  {
    id: 'roi', name: 'ROI Calculator', cat: 'business',
    desc: 'Return on investment percentage & net gain',
    inputs: [
      { id: 'investment', label: 'Investment Amount (₹)', min: 1000, max: 100000000, step: 1000, def: 500000 },
      { id: 'returns', label: 'Total Returns (₹)', min: 0, max: 200000000, step: 1000, def: 650000 },
    ],
    mainLabel: 'ROI',
    compute(v) {
      const net = v.returns - v.investment;
      const roi = v.investment > 0 ? (net / v.investment) * 100 : 0;
      return {
        main: roi.toFixed(1) + '%',
        items: [{ label: 'Net Profit', value: FC.formatINR(net) }],
        explain: `An investment of ${FC.formatINR(v.investment)} returning ${FC.formatINR(v.returns)} yields ${roi.toFixed(1)}% ROI.`,
      };
    },
  },
  {
    id: 'gst', name: 'GST Calculator', cat: 'business',
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
  {
    id: 'markup', name: 'Markup Calculator', cat: 'business',
    desc: 'Selling price from cost & desired markup %',
    inputs: [
      { id: 'cost', label: 'Cost Price (₹)', min: 1, max: 1000000, step: 1, def: 500 },
      { id: 'markup', label: 'Markup (%)', min: 0, max: 500, step: 1, def: 40 },
    ],
    mainLabel: 'Selling Price',
    compute(v) {
      const sp = v.cost * (1 + v.markup / 100);
      return {
        main: FC.formatINR(sp),
        items: [{ label: 'Profit', value: FC.formatINR(sp - v.cost) }],
        explain: `Cost ${FC.formatINR(v.cost)} with ${v.markup}% markup gives a selling price of ${FC.formatINR(sp)}.`,
      };
    },
  },
  {
    id: 'payback-period', name: 'Payback Period Calculator', cat: 'business',
    desc: 'Years to recover an initial investment',
    inputs: [
      { id: 'investment', label: 'Initial Investment (₹)', min: 10000, max: 100000000, step: 1000, def: 1000000 },
      { id: 'cashflow', label: 'Annual Cash Flow (₹)', min: 1000, max: 50000000, step: 1000, def: 250000 },
    ],
    mainLabel: 'Payback Period',
    compute(v) {
      const years = v.cashflow > 0 ? v.investment / v.cashflow : Infinity;
      return {
        main: isFinite(years) ? years.toFixed(1) + ' yrs' : '∞',
        items: [],
        explain: isFinite(years) ? `The investment of ${FC.formatINR(v.investment)} pays back in ${years.toFixed(1)} years at ${FC.formatINR(v.cashflow)}/year.` : 'No cash flow to recover investment.',
      };
    },
  },
  {
    id: 'business-cagr', name: 'CAGR Calculator', cat: 'business',
    desc: 'Compound annual growth rate between two values',
    inputs: [
      { id: 'initial', label: 'Initial Value (₹)', min: 1000, max: 100000000, step: 1000, def: 100000 },
      { id: 'final', label: 'Final Value (₹)', min: 1000, max: 200000000, step: 1000, def: 250000 },
      { id: 'years', label: 'Years', min: 1, max: 40, step: 1, def: 5 },
    ],
    mainLabel: 'CAGR',
    compute(v) {
      const cagr = (Math.pow(v.final / v.initial, 1 / v.years) - 1) * 100;
      return {
        main: cagr.toFixed(2) + '%',
        items: [{ label: 'Total Growth', value: (((v.final / v.initial) - 1) * 100).toFixed(1) + '%' }],
        explain: `${FC.formatINR(v.initial)} growing to ${FC.formatINR(v.final)} over ${v.years} years is a CAGR of ${cagr.toFixed(2)}%.`,
      };
    },
  },
  {
    id: 'inventory-turnover', name: 'Inventory Turnover Calculator', cat: 'business',
    desc: 'How many times inventory is sold & restocked',
    inputs: [
      { id: 'cogs', label: 'Cost of Goods Sold (₹)', min: 10000, max: 100000000, step: 1000, def: 2000000 },
      { id: 'avgInv', label: 'Average Inventory (₹)', min: 1000, max: 50000000, step: 1000, def: 400000 },
    ],
    mainLabel: 'Turnover Ratio',
    compute(v) {
      const ratio = v.avgInv > 0 ? v.cogs / v.avgInv : 0;
      const days = ratio > 0 ? 365 / ratio : Infinity;
      return {
        main: ratio.toFixed(2) + 'x',
        items: [{ label: 'Days to Sell Inventory', value: isFinite(days) ? days.toFixed(0) + ' days' : '∞' }],
        explain: `Inventory turns over ${ratio.toFixed(2)} times a year, taking about ${isFinite(days) ? days.toFixed(0) : '∞'} days per cycle.`,
      };
    },
  },
  {
    id: 'working-capital', name: 'Working Capital Calculator', cat: 'business',
    desc: 'Current assets minus current liabilities',
    inputs: [
      { id: 'assets', label: 'Current Assets (₹)', min: 0, max: 100000000, step: 1000, def: 1500000 },
      { id: 'liabilities', label: 'Current Liabilities (₹)', min: 0, max: 100000000, step: 1000, def: 900000 },
    ],
    mainLabel: 'Working Capital',
    compute(v) {
      const wc = v.assets - v.liabilities;
      const ratio = v.liabilities > 0 ? v.assets / v.liabilities : Infinity;
      return {
        main: FC.formatINR(wc),
        items: [{ label: 'Current Ratio', value: isFinite(ratio) ? ratio.toFixed(2) : '∞' }],
        explain: `Working capital of ${FC.formatINR(wc)} with a current ratio of ${isFinite(ratio) ? ratio.toFixed(2) : '∞'} indicates ${wc >= 0 ? 'healthy' : 'strained'} short-term liquidity.`,
      };
    },
  },
  {
    id: 'late-fee', name: 'Invoice Late Fee Calculator', cat: 'business',
    desc: 'Penalty interest for overdue invoice payments',
    inputs: [
      { id: 'amount', label: 'Invoice Amount (₹)', min: 100, max: 10000000, step: 100, def: 50000 },
      { id: 'days', label: 'Days Overdue', min: 1, max: 365, step: 1, def: 30 },
      { id: 'rate', label: 'Annual Penalty Rate (%)', min: 1, max: 36, step: 0.5, def: 18 },
    ],
    mainLabel: 'Late Fee',
    compute(v) {
      const fee = v.amount * (v.rate / 100 / 365) * v.days;
      return {
        main: FC.formatINR(fee),
        items: [{ label: 'Total Payable', value: FC.formatINR(v.amount + fee) }],
        explain: `${v.days} days overdue at ${v.rate}% p.a. adds a late fee of ${FC.formatINR(fee)} to the invoice.`,
      };
    },
  },

  /* ---------------- REAL ESTATE ---------------- */
  {
    id: 'rent-vs-buy', name: 'Rent vs Buy Calculator', cat: 'real-estate',
    desc: 'Compare renting & investing vs buying a home',
    inputs: [
      { id: 'rent', label: 'Monthly Rent (₹)', min: 5000, max: 500000, step: 1000, def: 25000 },
      { id: 'price', label: 'Home Price (₹)', min: 500000, max: 100000000, step: 100000, def: 6000000 },
      { id: 'down', label: 'Down Payment (₹)', min: 0, max: 50000000, step: 50000, def: 1200000 },
      { id: 'rate', label: 'Home Loan Rate (%)', min: 5, max: 15, step: 0.1, def: 8.5 },
      { id: 'years', label: 'Time Horizon (Years)', min: 1, max: 30, step: 1, def: 15 },
      { id: 'appreciation', label: 'Home Appreciation (% p.a.)', min: 0, max: 15, step: 0.5, def: 5 },
    ],
    mainLabel: 'Better Option',
    compute(v) {
      const loanAmt = v.price - v.down;
      const emiVal = FC.emi(loanAmt, v.rate / 100, v.years * 12);
      const totalPaidBuy = v.down + emiVal * v.years * 12;
      const futureHomeValue = v.price * Math.pow(1 + v.appreciation / 100, v.years);
      const netBuy = futureHomeValue - totalPaidBuy + v.down;
      const investedInsteadOfDown = FC.lumpsumFV(v.down, 0.10, v.years);
      const monthlyDiff = Math.max(0, emiVal - v.rent);
      const rentSavingsFV = FC.sipFV(monthlyDiff, 0.10, v.years);
      const netRent = investedInsteadOfDown + rentSavingsFV;
      const winner = netBuy > netRent ? 'Buy' : 'Rent & Invest';
      return {
        main: winner,
        items: [
          { label: 'Net Position (Buy)', value: FC.formatINR(netBuy) },
          { label: 'Net Position (Rent & Invest)', value: FC.formatINR(netRent) },
          { label: 'Home Loan EMI', value: FC.formatINR(emiVal) },
        ],
        explain: `Over ${v.years} years, buying nets ${FC.formatINR(netBuy)} vs renting & investing the difference nets ${FC.formatINR(netRent)}. ${winner} appears better under these assumptions.`,
      };
    },
  },
  {
    id: 'property-appreciation', name: 'Property Appreciation Calculator', cat: 'real-estate',
    desc: 'Future value of property at expected growth rate',
    inputs: [
      { id: 'value', label: 'Current Property Value (₹)', min: 100000, max: 100000000, step: 100000, def: 5000000 },
      { id: 'rate', label: 'Annual Appreciation (%)', min: 0, max: 20, step: 0.5, def: 6 },
      { id: 'years', label: 'Years', min: 1, max: 40, step: 1, def: 10 },
    ],
    mainLabel: 'Future Value',
    compute(v) {
      const fv = v.value * Math.pow(1 + v.rate / 100, v.years);
      return {
        main: FC.formatINR(fv),
        items: [{ label: 'Total Appreciation', value: FC.formatINR(fv - v.value) }],
        explain: `A property worth ${FC.formatINR(v.value)} today grows to ${FC.formatINR(fv)} in ${v.years} years at ${v.rate}% p.a. appreciation.`,
      };
    },
  },
  {
    id: 'rental-yield', name: 'Rental Yield Calculator', cat: 'real-estate',
    desc: 'Gross rental yield of a property investment',
    inputs: [
      { id: 'rent', label: 'Annual Rent (₹)', min: 10000, max: 5000000, step: 1000, def: 300000 },
      { id: 'value', label: 'Property Value (₹)', min: 100000, max: 100000000, step: 100000, def: 6000000 },
    ],
    mainLabel: 'Gross Rental Yield',
    compute(v) {
      const yieldPct = v.value > 0 ? (v.rent / v.value) * 100 : 0;
      return {
        main: yieldPct.toFixed(2) + '%',
        items: [{ label: 'Monthly Rent', value: FC.formatINR(v.rent / 12) }],
        explain: `Annual rent of ${FC.formatINR(v.rent)} on a ${FC.formatINR(v.value)} property gives a gross rental yield of ${yieldPct.toFixed(2)}%.`,
      };
    },
  },
  {
    id: 'stamp-duty', name: 'Stamp Duty Calculator', cat: 'real-estate',
    desc: 'Stamp duty & registration cost on property purchase',
    inputs: [
      { id: 'value', label: 'Property Value (₹)', min: 100000, max: 100000000, step: 100000, def: 6000000 },
      { id: 'rate', label: 'Stamp Duty Rate (%)', min: 3, max: 10, step: 0.5, def: 6 },
      { id: 'regRate', label: 'Registration Fee (%)', min: 0, max: 2, step: 0.1, def: 1 },
    ],
    mainLabel: 'Stamp Duty',
    compute(v) {
      const duty = v.value * (v.rate / 100);
      const reg = v.value * (v.regRate / 100);
      return {
        main: FC.formatINR(duty),
        items: [
          { label: 'Registration Fee', value: FC.formatINR(reg) },
          { label: 'Total Charges', value: FC.formatINR(duty + reg) },
        ],
        explain: `On a property worth ${FC.formatINR(v.value)}, stamp duty of ${FC.formatINR(duty)} and registration fee of ${FC.formatINR(reg)} apply.`,
      };
    },
  },
  {
    id: 'home-affordability', name: 'Home Affordability Calculator', cat: 'real-estate',
    desc: 'Maximum home loan you can afford based on income',
    inputs: [
      { id: 'income', label: 'Monthly Net Income (₹)', min: 10000, max: 2000000, step: 1000, def: 100000 },
      { id: 'existingEmi', label: 'Existing EMIs (₹)', min: 0, max: 500000, step: 500, def: 0 },
      { id: 'rate', label: 'Interest Rate (%)', min: 5, max: 15, step: 0.1, def: 8.5 },
      { id: 'years', label: 'Loan Tenure (Years)', min: 1, max: 30, step: 1, def: 20 },
    ],
    mainLabel: 'Max Loan Eligible',
    compute(v) {
      const maxEmi = Math.max(0, v.income * 0.4 - v.existingEmi);
      const r = v.rate / 100 / 12;
      const n = v.years * 12;
      const maxLoan = r === 0 ? maxEmi * n : maxEmi * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
      return {
        main: FC.formatINR(maxLoan),
        items: [{ label: 'Max Affordable EMI', value: FC.formatINR(maxEmi) }],
        explain: `Based on 40% of income going to EMIs, you can afford a loan of about ${FC.formatINR(maxLoan)} with EMI ${FC.formatINR(maxEmi)}.`,
      };
    },
  },
  {
    id: 'property-tax', name: 'Property Tax Calculator', cat: 'real-estate',
    desc: 'Annual municipal property tax estimate',
    inputs: [
      { id: 'annualValue', label: 'Annual Rateable Value (₹)', min: 10000, max: 5000000, step: 1000, def: 200000 },
      { id: 'rate', label: 'Tax Rate (%)', min: 5, max: 30, step: 0.5, def: 15 },
    ],
    mainLabel: 'Annual Property Tax',
    compute(v) {
      const tax = v.annualValue * (v.rate / 100);
      return {
        main: FC.formatINR(tax),
        items: [{ label: 'Monthly Equivalent', value: FC.formatINR(tax / 12) }],
        explain: `At ${v.rate}% on an annual rateable value of ${FC.formatINR(v.annualValue)}, the property tax is ${FC.formatINR(tax)}/year.`,
      };
    },
  },
  {
    id: 'mortgage-refinance', name: 'Loan Refinance Calculator', cat: 'real-estate',
    desc: 'Savings from refinancing a home loan at a lower rate',
    inputs: [
      { id: 'balance', label: 'Outstanding Loan (₹)', min: 100000, max: 100000000, step: 10000, def: 3000000 },
      { id: 'oldRate', label: 'Current Rate (%)', min: 5, max: 18, step: 0.1, def: 9.5 },
      { id: 'newRate', label: 'New Rate (%)', min: 5, max: 18, step: 0.1, def: 8.3 },
      { id: 'years', label: 'Remaining Tenure (Years)', min: 1, max: 30, step: 1, def: 15 },
    ],
    mainLabel: 'Monthly Savings',
    compute(v) {
      const oldEmi = FC.emi(v.balance, v.oldRate / 100, v.years * 12);
      const newEmi = FC.emi(v.balance, v.newRate / 100, v.years * 12);
      const monthlySavings = oldEmi - newEmi;
      return {
        main: FC.formatINR(monthlySavings),
        items: [
          { label: 'Old EMI', value: FC.formatINR(oldEmi) },
          { label: 'New EMI', value: FC.formatINR(newEmi) },
          { label: 'Total Savings (Tenure)', value: FC.formatINR(monthlySavings * v.years * 12) },
        ],
        explain: `Refinancing from ${v.oldRate}% to ${v.newRate}% saves ${FC.formatINR(monthlySavings)}/month, or ${FC.formatINR(monthlySavings * v.years * 12)} over the remaining tenure.`,
      };
    },
  },
  {
    id: 'brokerage-fee', name: 'Property Brokerage Fee Calculator', cat: 'real-estate',
    desc: 'Broker commission on property sale/purchase',
    inputs: [
      { id: 'value', label: 'Property Value (₹)', min: 100000, max: 100000000, step: 100000, def: 6000000 },
      { id: 'rate', label: 'Brokerage (%)', min: 0.5, max: 3, step: 0.1, def: 1 },
    ],
    mainLabel: 'Brokerage Fee',
    compute(v) {
      const fee = v.value * (v.rate / 100);
      return {
        main: FC.formatINR(fee),
        items: [{ label: 'Net Amount (after fee)', value: FC.formatINR(v.value - fee) }],
        explain: `Brokerage of ${v.rate}% on ${FC.formatINR(v.value)} comes to ${FC.formatINR(fee)}.`,
      };
    },
  },

  /* ---------------- INSURANCE ---------------- */
  {
    id: 'term-insurance', name: 'Term Insurance Cover Calculator', cat: 'insurance',
    desc: 'Recommended life cover using income multiple method',
    inputs: [
      { id: 'income', label: 'Annual Income (₹)', min: 100000, max: 20000000, step: 10000, def: 1200000 },
      { id: 'age', label: 'Current Age', min: 18, max: 60, step: 1, def: 30 },
      { id: 'liabilities', label: 'Outstanding Loans (₹)', min: 0, max: 50000000, step: 10000, def: 2000000 },
    ],
    mainLabel: 'Recommended Cover',
    compute(v) {
      const multiplier = v.age < 35 ? 20 : v.age < 45 ? 15 : 10;
      const cover = v.income * multiplier + v.liabilities;
      return {
        main: FC.formatINR(cover),
        items: [{ label: 'Income Multiple Used', value: multiplier + 'x' }],
        explain: `At age ${v.age}, a cover of ${multiplier}x annual income plus outstanding liabilities suggests ${FC.formatINR(cover)} of term insurance.`,
      };
    },
  },
  {
    id: 'life-insurance-need', name: 'Human Life Value Calculator', cat: 'insurance',
    desc: 'Life insurance need via human life value method',
    inputs: [
      { id: 'income', label: 'Annual Income (₹)', min: 100000, max: 20000000, step: 10000, def: 1200000 },
      { id: 'expenses', label: 'Annual Personal Expenses (₹)', min: 0, max: 10000000, step: 10000, def: 300000 },
      { id: 'years', label: 'Years to Retirement', min: 1, max: 40, step: 1, def: 25 },
      { id: 'discountRate', label: 'Discount Rate (%)', min: 2, max: 10, step: 0.5, def: 6 },
    ],
    mainLabel: 'Human Life Value',
    compute(v) {
      const netIncome = Math.max(0, v.income - v.expenses);
      const r = v.discountRate / 100;
      const hlv = r === 0 ? netIncome * v.years : netIncome * (1 - Math.pow(1 + r, -v.years)) / r;
      return {
        main: FC.formatINR(hlv),
        items: [{ label: 'Net Annual Contribution', value: FC.formatINR(netIncome) }],
        explain: `The present value of your future income contribution to family over ${v.years} years is ${FC.formatINR(hlv)}.`,
      };
    },
  },
  {
    id: 'health-insurance-premium', name: 'Health Insurance Premium Estimator', cat: 'insurance',
    desc: 'Rough annual premium estimate for health cover',
    inputs: [
      { id: 'age', label: 'Age', min: 18, max: 75, step: 1, def: 35 },
      { id: 'sumInsured', label: 'Sum Insured (₹)', min: 100000, max: 20000000, step: 100000, def: 1000000 },
      { id: 'members', label: 'Family Members Covered', min: 1, max: 6, step: 1, def: 2 },
    ],
    mainLabel: 'Estimated Annual Premium',
    compute(v) {
      const ageFactor = v.age < 30 ? 0.008 : v.age < 45 ? 0.012 : v.age < 60 ? 0.02 : 0.035;
      const premium = v.sumInsured * ageFactor * (1 + (v.members - 1) * 0.6);
      return {
        main: FC.formatINR(premium),
        items: [{ label: 'Monthly Equivalent', value: FC.formatINR(premium / 12) }],
        explain: `For a ${FC.formatINR(v.sumInsured)} family floater covering ${v.members} member(s) at age ${v.age}, expect a premium around ${FC.formatINR(premium)}/year (indicative only).`,
      };
    },
  },
  {
    id: 'vehicle-insurance', name: 'Vehicle IDV Calculator', cat: 'insurance',
    desc: 'Insured Declared Value of a vehicle after depreciation',
    inputs: [
      { id: 'price', label: 'Ex-showroom Price (₹)', min: 50000, max: 20000000, step: 10000, def: 800000 },
      { id: 'ageMonths', label: 'Vehicle Age (Months)', min: 0, max: 120, step: 1, def: 18 },
    ],
    mainLabel: 'Insured Declared Value (IDV)',
    compute(v) {
      const ageYears = v.ageMonths / 12;
      let depRate;
      if (ageYears <= 0.5) depRate = 0.05;
      else if (ageYears <= 1) depRate = 0.15;
      else if (ageYears <= 2) depRate = 0.20;
      else if (ageYears <= 3) depRate = 0.30;
      else if (ageYears <= 4) depRate = 0.40;
      else if (ageYears <= 5) depRate = 0.50;
      else depRate = 0.60;
      const idv = v.price * (1 - depRate);
      return {
        main: FC.formatINR(idv),
        items: [{ label: 'Depreciation Applied', value: (depRate * 100).toFixed(0) + '%' }],
        explain: `A vehicle priced at ${FC.formatINR(v.price)} and ${v.ageMonths} months old has an IDV of ${FC.formatINR(idv)} (as per IRDAI depreciation schedule).`,
      };
    },
  },
  {
    id: 'ulip-vs-term', name: 'ULIP vs Term + Mutual Fund Calculator', cat: 'insurance',
    desc: 'Compare ULIP corpus vs Term insurance + separate SIP',
    inputs: [
      { id: 'premium', label: 'Annual Premium Budget (₹)', min: 5000, max: 1000000, step: 1000, def: 50000 },
      { id: 'termCost', label: 'Term Plan Annual Cost (₹)', min: 1000, max: 100000, step: 500, def: 8000 },
      { id: 'ulipReturn', label: 'ULIP Expected Return (% p.a.)', min: 4, max: 15, step: 0.5, def: 8 },
      { id: 'mfReturn', label: 'Mutual Fund Expected Return (% p.a.)', min: 4, max: 20, step: 0.5, def: 12 },
      { id: 'years', label: 'Years', min: 5, max: 40, step: 1, def: 20 },
    ],
    mainLabel: 'Better Option',
    compute(v) {
      const ulipCorpus = FC.sipFV(v.premium / 12, v.ulipReturn / 100, v.years) * 0.92;
      const mfBudget = Math.max(0, v.premium - v.termCost);
      const mfCorpus = FC.sipFV(mfBudget / 12, v.mfReturn / 100, v.years);
      const winner = mfCorpus > ulipCorpus ? 'Term + Mutual Fund' : 'ULIP';
      return {
        main: winner,
        items: [
          { label: 'ULIP Corpus', value: FC.formatINR(ulipCorpus) },
          { label: 'Term + MF Corpus', value: FC.formatINR(mfCorpus) },
        ],
        explain: `Over ${v.years} years, ULIP grows to ~${FC.formatINR(ulipCorpus)} while Term insurance + investing the rest in mutual funds grows to ~${FC.formatINR(mfCorpus)}. ${winner} comes out ahead here.`,
      };
    },
  },
  {
    id: 'critical-illness-cover', name: 'Critical Illness Cover Calculator', cat: 'insurance',
    desc: 'Recommended critical illness sum assured',
    inputs: [
      { id: 'income', label: 'Annual Income (₹)', min: 100000, max: 20000000, step: 10000, def: 1000000 },
      { id: 'treatmentCost', label: 'Avg. Critical Illness Treatment Cost (₹)', min: 100000, max: 5000000, step: 50000, def: 1500000 },
    ],
    mainLabel: 'Recommended Cover',
    compute(v) {
      const incomeReplacement = v.income * 2;
      const cover = incomeReplacement + v.treatmentCost;
      return {
        main: FC.formatINR(cover),
        items: [{ label: 'Income Replacement (2 yrs)', value: FC.formatINR(incomeReplacement) }],
        explain: `Covering 2 years of income replacement plus average treatment costs suggests a critical illness cover of ${FC.formatINR(cover)}.`,
      };
    },
  },

  /* ---------------- CRYPTO ---------------- */
  {
    id: 'crypto-sip', name: 'Crypto SIP Calculator', cat: 'crypto',
    desc: 'Projected value of a recurring crypto investment',
    inputs: [
      { id: 'monthly', label: 'Monthly Investment (₹)', min: 500, max: 500000, step: 500, def: 5000 },
      { id: 'rate', label: 'Expected Annual Return (%)', min: -20, max: 100, step: 1, def: 20 },
      { id: 'years', label: 'Tenure (Years)', min: 1, max: 20, step: 1, def: 5 },
    ],
    mainLabel: 'Projected Value',
    compute(v) {
      const fv = FC.sipFV(v.monthly, v.rate / 100, v.years);
      const invested = v.monthly * v.years * 12;
      return {
        main: FC.formatINR(fv),
        items: [
          { label: 'Total Invested', value: FC.formatINR(invested) },
          { label: 'Gains', value: FC.formatINR(fv - invested) },
        ],
        explain: `Investing ${FC.formatINR(v.monthly)}/month in crypto at an assumed ${v.rate}% p.a. for ${v.years} years projects to ${FC.formatINR(fv)}. Crypto returns are highly volatile — treat this as illustrative only.`,
      };
    },
  },
  {
    id: 'crypto-cagr', name: 'Crypto CAGR Calculator', cat: 'crypto',
    desc: 'Compound annual growth rate of a crypto holding',
    inputs: [
      { id: 'initial', label: 'Initial Investment (₹)', min: 1000, max: 10000000, step: 1000, def: 100000 },
      { id: 'final', label: 'Current Value (₹)', min: 0, max: 50000000, step: 1000, def: 400000 },
      { id: 'years', label: 'Holding Period (Years)', min: 0.5, max: 15, step: 0.5, def: 3 },
    ],
    mainLabel: 'CAGR',
    compute(v) {
      const cagr = v.initial > 0 ? (Math.pow(v.final / v.initial, 1 / v.years) - 1) * 100 : 0;
      return {
        main: cagr.toFixed(1) + '%',
        items: [{ label: 'Absolute Return', value: (((v.final / v.initial) - 1) * 100).toFixed(1) + '%' }],
        explain: `${FC.formatINR(v.initial)} growing to ${FC.formatINR(v.final)} in ${v.years} years is a CAGR of ${cagr.toFixed(1)}%.`,
      };
    },
  },
  {
    id: 'crypto-profit-loss', name: 'Crypto Profit/Loss Calculator', cat: 'crypto',
    desc: 'Net profit after buy/sell price and trading fees',
    inputs: [
      { id: 'buy', label: 'Buy Price (₹)', min: 1, max: 10000000, step: 1, def: 2500000 },
      { id: 'sell', label: 'Sell Price (₹)', min: 1, max: 10000000, step: 1, def: 3000000 },
      { id: 'qty', label: 'Quantity', min: 0.001, max: 1000, step: 0.001, def: 0.5 },
      { id: 'fee', label: 'Trading Fee (%)', min: 0, max: 5, step: 0.05, def: 0.5 },
    ],
    mainLabel: 'Net Profit / Loss',
    compute(v) {
      const grossGain = (v.sell - v.buy) * v.qty;
      const fees = (v.buy + v.sell) * v.qty * (v.fee / 100);
      const net = grossGain - fees;
      return {
        main: FC.formatINR(net),
        items: [{ label: 'Fees Paid', value: FC.formatINR(fees) }],
        explain: `Buying at ${FC.formatINR(v.buy)} and selling at ${FC.formatINR(v.sell)} for ${v.qty} units nets ${FC.formatINR(net)} after ${FC.formatINR(fees)} in fees.`,
      };
    },
  },
  {
    id: 'crypto-tax', name: 'Crypto Tax Calculator (India)', cat: 'crypto',
    desc: 'Flat 30% tax + 1% TDS on crypto gains as per Indian law',
    inputs: [
      { id: 'buyValue', label: 'Purchase Value (₹)', min: 1000, max: 50000000, step: 1000, def: 500000 },
      { id: 'sellValue', label: 'Sale Value (₹)', min: 1000, max: 100000000, step: 1000, def: 800000 },
    ],
    mainLabel: 'Tax Payable',
    compute(v) {
      const gain = Math.max(0, v.sellValue - v.buyValue);
      const tax = gain * 0.30;
      const tds = v.sellValue * 0.01;
      return {
        main: FC.formatINR(tax),
        items: [
          { label: 'TDS Deducted (1%)', value: FC.formatINR(tds) },
          { label: 'Net Gain After Tax', value: FC.formatINR(gain - tax) },
        ],
        explain: `Gains of ${FC.formatINR(gain)} attract a flat 30% tax of ${FC.formatINR(tax)} (no loss set-off allowed), plus 1% TDS of ${FC.formatINR(tds)} on the sale value.`,
      };
    },
  },
  {
    id: 'crypto-dca', name: 'Crypto Dollar-Cost Averaging Calculator', cat: 'crypto',
    desc: 'Units accumulated & average cost via weekly DCA',
    inputs: [
      { id: 'weekly', label: 'Weekly Investment (₹)', min: 100, max: 100000, step: 100, def: 2000 },
      { id: 'weeks', label: 'Number of Weeks', min: 1, max: 260, step: 1, def: 52 },
      { id: 'avgPrice', label: 'Average Price per Unit (₹)', min: 1, max: 10000000, step: 1, def: 2800000 },
    ],
    mainLabel: 'Units Accumulated',
    compute(v) {
      const invested = v.weekly * v.weeks;
      const units = v.avgPrice > 0 ? invested / v.avgPrice : 0;
      return {
        main: units.toFixed(6),
        items: [{ label: 'Total Invested', value: FC.formatINR(invested) }],
        explain: `Investing ${FC.formatINR(v.weekly)}/week for ${v.weeks} weeks (${FC.formatINR(invested)} total) at an average price of ${FC.formatINR(v.avgPrice)} accumulates ${units.toFixed(6)} units.`,
      };
    },
  },

  /* ---------------- PERSONAL FINANCE ---------------- */
  {
    id: 'budget-50-30-20', name: '50/30/20 Budget Calculator', cat: 'personal',
    desc: 'Split monthly income into needs, wants and savings',
    inputs: [
      { id: 'income', label: 'Monthly Take-home Income (₹)', min: 5000, max: 2000000, step: 1000, def: 60000 },
    ],
    mainLabel: 'Suggested Split',
    compute(v) {
      const needs = v.income * 0.5, wants = v.income * 0.3, savings = v.income * 0.2;
      return {
        main: FC.formatINR(savings) + ' Savings',
        items: [
          { label: 'Needs (50%)', value: FC.formatINR(needs) },
          { label: 'Wants (30%)', value: FC.formatINR(wants) },
          { label: 'Savings (20%)', value: FC.formatINR(savings) },
        ],
        explain: `On ${FC.formatINR(v.income)}/month: allocate ${FC.formatINR(needs)} to needs, ${FC.formatINR(wants)} to wants, and ${FC.formatINR(savings)} to savings/investments.`,
      };
    },
  },
  {
    id: 'debt-payoff', name: 'Debt Payoff Calculator', cat: 'personal',
    desc: 'Months to clear a debt at a fixed monthly payment',
    inputs: [
      { id: 'principal', label: 'Outstanding Debt (₹)', min: 1000, max: 10000000, step: 1000, def: 200000 },
      { id: 'rate', label: 'Interest Rate (% p.a.)', min: 0, max: 42, step: 0.5, def: 24 },
      { id: 'payment', label: 'Monthly Payment (₹)', min: 500, max: 500000, step: 500, def: 10000 },
    ],
    mainLabel: 'Months to Debt-free',
    compute(v) {
      const r = v.rate / 100 / 12;
      const minInterestOnly = v.principal * r;
      if (v.payment <= minInterestOnly) {
        return { main: '∞', items: [], explain: `Your payment of ${FC.formatINR(v.payment)} doesn't even cover monthly interest of ${FC.formatINR(minInterestOnly)}. Increase the payment to make progress.` };
      }
      const months = Math.log(v.payment / (v.payment - v.principal * r)) / Math.log(1 + r);
      const totalPaid = v.payment * months;
      return {
        main: Math.ceil(months) + ' months',
        items: [{ label: 'Total Interest Paid', value: FC.formatINR(totalPaid - v.principal) }],
        explain: `Paying ${FC.formatINR(v.payment)}/month toward ${FC.formatINR(v.principal)} debt at ${v.rate}% p.a. clears it in about ${Math.ceil(months)} months.`,
      };
    },
  },
  {
    id: 'emergency-fund', name: 'Emergency Fund Calculator', cat: 'personal',
    desc: 'Ideal emergency fund based on monthly expenses',
    inputs: [
      { id: 'expenses', label: 'Monthly Expenses (₹)', min: 5000, max: 1000000, step: 1000, def: 40000 },
      { id: 'months', label: 'Months of Cover Desired', min: 3, max: 12, step: 1, def: 6 },
    ],
    mainLabel: 'Recommended Emergency Fund',
    compute(v) {
      const fund = v.expenses * v.months;
      return {
        main: FC.formatINR(fund),
        items: [],
        explain: `To cover ${v.months} months of expenses at ${FC.formatINR(v.expenses)}/month, build an emergency fund of ${FC.formatINR(fund)} in a liquid instrument.`,
      };
    },
  },
  {
    id: 'net-worth', name: 'Net Worth Calculator', cat: 'personal',
    desc: 'Total assets minus total liabilities',
    inputs: [
      { id: 'assets', label: 'Total Assets (₹)', min: 0, max: 500000000, step: 10000, def: 5000000 },
      { id: 'liabilities', label: 'Total Liabilities (₹)', min: 0, max: 500000000, step: 10000, def: 2000000 },
    ],
    mainLabel: 'Net Worth',
    compute(v) {
      const nw = v.assets - v.liabilities;
      return {
        main: FC.formatINR(nw),
        items: [],
        explain: `Assets of ${FC.formatINR(v.assets)} minus liabilities of ${FC.formatINR(v.liabilities)} gives a net worth of ${FC.formatINR(nw)}.`,
      };
    },
  },
  {
    id: 'savings-rate', name: 'Savings Rate Calculator', cat: 'personal',
    desc: 'Percentage of income you save each month',
    inputs: [
      { id: 'income', label: 'Monthly Income (₹)', min: 5000, max: 2000000, step: 1000, def: 80000 },
      { id: 'expenses', label: 'Monthly Expenses (₹)', min: 0, max: 2000000, step: 1000, def: 50000 },
    ],
    mainLabel: 'Savings Rate',
    compute(v) {
      const savings = v.income - v.expenses;
      const rate = v.income > 0 ? (savings / v.income) * 100 : 0;
      return {
        main: rate.toFixed(1) + '%',
        items: [{ label: 'Monthly Savings', value: FC.formatINR(savings) }],
        explain: `Saving ${FC.formatINR(savings)} out of ${FC.formatINR(v.income)} income gives a savings rate of ${rate.toFixed(1)}%.`,
      };
    },
  },
  {
    id: 'salary-hike', name: 'Salary Hike Calculator', cat: 'personal',
    desc: 'New CTC and increase amount from a hike percentage',
    inputs: [
      { id: 'ctc', label: 'Current CTC (₹ p.a.)', min: 100000, max: 20000000, step: 10000, def: 800000 },
      { id: 'hike', label: 'Hike Percentage (%)', min: 0, max: 100, step: 1, def: 15 },
    ],
    mainLabel: 'New CTC',
    compute(v) {
      const newCtc = v.ctc * (1 + v.hike / 100);
      return {
        main: FC.formatINR(newCtc),
        items: [{ label: 'Increase Amount', value: FC.formatINR(newCtc - v.ctc) }],
        explain: `A ${v.hike}% hike on ${FC.formatINR(v.ctc)} CTC results in a new CTC of ${FC.formatINR(newCtc)}, an increase of ${FC.formatINR(newCtc - v.ctc)}.`,
      };
    },
  },
  {
    id: 'inflation-impact', name: 'Inflation Impact Calculator', cat: 'personal',
    desc: 'Future cost of today\'s amount due to inflation',
    inputs: [
      { id: 'amount', label: 'Current Amount (₹)', min: 1000, max: 10000000, step: 1000, def: 100000 },
      { id: 'rate', label: 'Inflation Rate (% p.a.)', min: 1, max: 15, step: 0.5, def: 6 },
      { id: 'years', label: 'Years', min: 1, max: 40, step: 1, def: 10 },
    ],
    mainLabel: 'Future Equivalent Cost',
    compute(v) {
      const future = v.amount * Math.pow(1 + v.rate / 100, v.years);
      return {
        main: FC.formatINR(future),
        items: [{ label: 'Purchasing Power Lost', value: FC.formatINR(future - v.amount) }],
        explain: `${FC.formatINR(v.amount)} today will cost ${FC.formatINR(future)} in ${v.years} years at ${v.rate}% inflation — that's what you'll need to maintain the same purchasing power.`,
      };
    },
  },

  /* ---------------- RETIREMENT / TAX (salary benefits) ---------------- */
  {
    id: 'gratuity', name: 'Gratuity Calculator', cat: 'retirement',
    desc: 'Gratuity payable as per Payment of Gratuity Act',
    inputs: [
      { id: 'salary', label: 'Last Drawn Salary (Basic + DA) (₹)', min: 5000, max: 2000000, step: 1000, def: 60000 },
      { id: 'years', label: 'Years of Service', min: 1, max: 45, step: 1, def: 10 },
    ],
    mainLabel: 'Gratuity Amount',
    compute(v) {
      const gratuity = Math.min((v.salary * 15 * v.years) / 26, 2000000);
      return {
        main: FC.formatINR(gratuity),
        items: [],
        explain: `Using (15 × last salary × years of service) / 26, gratuity payable is ${FC.formatINR(gratuity)} (capped at ₹20 lakh as per current law).`,
      };
    },
  },
  {
    id: 'hra-exemption', name: 'HRA Exemption Calculator', cat: 'tax',
    desc: 'Tax-exempt House Rent Allowance under old regime',
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
    id: 'leave-encashment', name: 'Leave Encashment Calculator', cat: 'tax',
    desc: 'Amount receivable for encashing unused leave',
    inputs: [
      { id: 'salary', label: 'Basic Salary (Monthly) (₹)', min: 5000, max: 2000000, step: 1000, def: 50000 },
      { id: 'days', label: 'Leave Days to Encash', min: 1, max: 300, step: 1, def: 45 },
    ],
    mainLabel: 'Encashment Amount',
    compute(v) {
      const perDay = v.salary / 30;
      const amount = perDay * v.days;
      return {
        main: FC.formatINR(amount),
        items: [{ label: 'Per Day Salary', value: FC.formatINR(perDay) }],
        explain: `At ${FC.formatINR(perDay)}/day, encashing ${v.days} days of leave yields ${FC.formatINR(amount)} (tax treatment depends on employer type).`,
      };
    },
  },

  /* ---------------- LOAN ---------------- */
  {
    id: 'gold-loan', name: 'Gold Loan Calculator', cat: 'loan',
    desc: 'Loan amount and EMI against gold jewellery value',
    inputs: [
      { id: 'goldValue', label: 'Gold Value (₹)', min: 10000, max: 10000000, step: 1000, def: 500000 },
      { id: 'ltv', label: 'Loan-to-Value (%)', min: 50, max: 90, step: 1, def: 75 },
      { id: 'rate', label: 'Interest Rate (% p.a.)', min: 7, max: 24, step: 0.5, def: 10.5 },
      { id: 'months', label: 'Tenure (Months)', min: 3, max: 60, step: 1, def: 12 },
    ],
    mainLabel: 'Loan Amount',
    compute(v) {
      const loan = v.goldValue * (v.ltv / 100);
      const emiVal = FC.emi(loan, v.rate / 100, v.months);
      return {
        main: FC.formatINR(loan),
        items: [{ label: 'Monthly EMI', value: FC.formatINR(emiVal) }],
        explain: `At ${v.ltv}% LTV on gold worth ${FC.formatINR(v.goldValue)}, you can borrow ${FC.formatINR(loan)} with an EMI of ${FC.formatINR(emiVal)}.`,
      };
    },
  },
  {
    id: 'personal-loan', name: 'Personal Loan EMI Calculator', cat: 'loan',
    desc: 'EMI and total interest for an unsecured personal loan',
    inputs: [
      { id: 'principal', label: 'Loan Amount (₹)', min: 10000, max: 5000000, step: 10000, def: 500000 },
      { id: 'rate', label: 'Interest Rate (% p.a.)', min: 9, max: 30, step: 0.5, def: 13 },
      { id: 'months', label: 'Tenure (Months)', min: 6, max: 84, step: 1, def: 36 },
    ],
    mainLabel: 'Monthly EMI',
    compute(v) {
      const emiVal = FC.emi(v.principal, v.rate / 100, v.months);
      const total = emiVal * v.months;
      return {
        main: FC.formatINR(emiVal),
        items: [
          { label: 'Total Payment', value: FC.formatINR(total) },
          { label: 'Total Interest', value: FC.formatINR(total - v.principal) },
        ],
        explain: `A personal loan of ${FC.formatINR(v.principal)} at ${v.rate}% p.a. over ${v.months} months has an EMI of ${FC.formatINR(emiVal)}.`,
      };
    },
  },
  {
    id: 'loan-against-property', name: 'Loan Against Property Calculator', cat: 'loan',
    desc: 'Eligible loan amount and EMI against property value',
    inputs: [
      { id: 'value', label: 'Property Value (₹)', min: 500000, max: 100000000, step: 100000, def: 8000000 },
      { id: 'ltv', label: 'Loan-to-Value (%)', min: 40, max: 75, step: 1, def: 60 },
      { id: 'rate', label: 'Interest Rate (% p.a.)', min: 7, max: 16, step: 0.1, def: 9.5 },
      { id: 'years', label: 'Tenure (Years)', min: 1, max: 20, step: 1, def: 10 },
    ],
    mainLabel: 'Eligible Loan Amount',
    compute(v) {
      const loan = v.value * (v.ltv / 100);
      const emiVal = FC.emi(loan, v.rate / 100, v.years * 12);
      return {
        main: FC.formatINR(loan),
        items: [{ label: 'Monthly EMI', value: FC.formatINR(emiVal) }],
        explain: `At ${v.ltv}% LTV on a property worth ${FC.formatINR(v.value)}, the eligible loan is ${FC.formatINR(loan)} with an EMI of ${FC.formatINR(emiVal)}.`,
      };
    },
  },
  {
    id: 'balance-transfer', name: 'Loan Balance Transfer Calculator', cat: 'loan',
    desc: 'Savings from transferring a loan to a lower rate lender',
    inputs: [
      { id: 'balance', label: 'Outstanding Balance (₹)', min: 50000, max: 100000000, step: 10000, def: 2000000 },
      { id: 'oldRate', label: 'Current Rate (%)', min: 5, max: 20, step: 0.1, def: 10.5 },
      { id: 'newRate', label: 'New Lender Rate (%)', min: 5, max: 20, step: 0.1, def: 8.7 },
      { id: 'years', label: 'Remaining Tenure (Years)', min: 1, max: 25, step: 1, def: 12 },
      { id: 'transferCost', label: 'Transfer/Processing Cost (₹)', min: 0, max: 500000, step: 1000, def: 20000 },
    ],
    mainLabel: 'Net Savings',
    compute(v) {
      const oldEmi = FC.emi(v.balance, v.oldRate / 100, v.years * 12);
      const newEmi = FC.emi(v.balance, v.newRate / 100, v.years * 12);
      const totalSavings = (oldEmi - newEmi) * v.years * 12 - v.transferCost;
      return {
        main: FC.formatINR(totalSavings),
        items: [
          { label: 'Old EMI', value: FC.formatINR(oldEmi) },
          { label: 'New EMI', value: FC.formatINR(newEmi) },
        ],
        explain: `Transferring ${FC.formatINR(v.balance)} from ${v.oldRate}% to ${v.newRate}% saves ${FC.formatINR(totalSavings)} net of transfer costs over the remaining tenure.`,
      };
    },
  },

  /* ---------------- SAVINGS ---------------- */
  {
    id: 'sukanya-samriddhi', name: 'Sukanya Samriddhi Yojana Calculator', cat: 'savings',
    desc: 'Maturity value of SSY account for the girl child',
    inputs: [
      { id: 'annual', label: 'Annual Deposit (₹)', min: 250, max: 150000, step: 250, def: 50000 },
      { id: 'years', label: 'Years of Deposit (max 15)', min: 1, max: 15, step: 1, def: 15 },
    ],
    mainLabel: 'Maturity Value (at 21 years, 8.2% p.a.)',
    compute(v) {
      const r = 0.082;
      let corpus = 0;
      for (let y = 0; y < v.years; y++) corpus = (corpus + v.annual) * (1 + r);
      const remainingYears = 21 - v.years;
      const maturity = corpus * Math.pow(1 + r, Math.max(0, remainingYears));
      const invested = v.annual * v.years;
      return {
        main: FC.formatINR(maturity),
        items: [
          { label: 'Total Invested', value: FC.formatINR(invested) },
          { label: 'Interest Earned', value: FC.formatINR(maturity - invested) },
        ],
        explain: `Depositing ${FC.formatINR(v.annual)}/year for ${v.years} years at 8.2% p.a. grows to ${FC.formatINR(maturity)} by account maturity (21 years from opening), tax-free (EEE).`,
      };
    },
  },
  {
    id: 'senior-citizen-fd', name: 'Senior Citizen FD Calculator', cat: 'savings',
    desc: 'FD maturity with senior citizen rate addon',
    inputs: [
      { id: 'principal', label: 'Principal (₹)', min: 10000, max: 10000000, step: 10000, def: 1000000 },
      { id: 'baseRate', label: 'Base FD Rate (% p.a.)', min: 5, max: 10, step: 0.1, def: 7 },
      { id: 'years', label: 'Tenure (Years)', min: 0.5, max: 10, step: 0.5, def: 5 },
    ],
    mainLabel: 'Maturity Value',
    compute(v) {
      const rate = (v.baseRate + 0.5) / 100;
      const result = FC.fdFV(v.principal, rate, v.years, 4, 0);
      return {
        main: FC.formatINR(result.grossFV),
        items: [
          { label: 'Effective Rate', value: ((v.baseRate + 0.5).toFixed(1)) + '%' },
          { label: 'Interest Earned', value: FC.formatINR(result.interest) },
        ],
        explain: `Senior citizens earn an extra 0.5% over base FD rates. At ${(v.baseRate + 0.5).toFixed(1)}% p.a., ${FC.formatINR(v.principal)} grows to ${FC.formatINR(result.grossFV)} in ${v.years} years.`,
      };
    },
  },
  {
    id: 'post-office-mis', name: 'Post Office MIS Calculator', cat: 'savings',
    desc: 'Fixed monthly income from Post Office MIS deposit',
    inputs: [
      { id: 'deposit', label: 'Deposit Amount (₹)', min: 1000, max: 900000, step: 1000, def: 500000 },
      { id: 'rate', label: 'Interest Rate (% p.a.)', min: 5, max: 10, step: 0.1, def: 7.4 },
    ],
    mainLabel: 'Monthly Income',
    compute(v) {
      const monthlyIncome = (v.deposit * (v.rate / 100)) / 12;
      return {
        main: FC.formatINR(monthlyIncome),
        items: [{ label: 'Annual Income', value: FC.formatINR(monthlyIncome * 12) }],
        explain: `A deposit of ${FC.formatINR(v.deposit)} at ${v.rate}% p.a. under Post Office MIS pays a fixed monthly income of ${FC.formatINR(monthlyIncome)} for the 5-year tenure.`,
      };
    },
  },
  {
    id: 'kvp', name: 'Kisan Vikas Patra (KVP) Calculator', cat: 'savings',
    desc: 'Maturity value & doubling period of KVP investment',
    inputs: [
      { id: 'principal', label: 'Investment Amount (₹)', min: 1000, max: 10000000, step: 1000, def: 100000 },
      { id: 'rate', label: 'Interest Rate (% p.a.)', min: 5, max: 10, step: 0.1, def: 7.5 },
    ],
    mainLabel: 'Doubling Period',
    compute(v) {
      const doublingYears = 72 / v.rate;
      const maturity = v.principal * 2;
      return {
        main: doublingYears.toFixed(1) + ' years',
        items: [{ label: 'Maturity Value', value: FC.formatINR(maturity) }],
        explain: `At ${v.rate}% p.a. compounded annually, your KVP investment of ${FC.formatINR(v.principal)} doubles to ${FC.formatINR(maturity)} in approximately ${doublingYears.toFixed(1)} years (Rule of 72).`,
      };
    },
  },

  /* ---------------- INVESTMENT ---------------- */
  {
    id: 'gold-investment', name: 'Gold Investment Calculator', cat: 'investment',
    desc: 'Future value of gold investment by weight',
    inputs: [
      { id: 'grams', label: 'Gold Quantity (grams)', min: 1, max: 5000, step: 1, def: 50 },
      { id: 'price', label: 'Current Price per Gram (₹)', min: 1000, max: 20000, step: 100, def: 7500 },
      { id: 'rate', label: 'Expected Growth (% p.a.)', min: 0, max: 20, step: 0.5, def: 8 },
      { id: 'years', label: 'Years', min: 1, max: 30, step: 1, def: 10 },
    ],
    mainLabel: 'Future Value',
    compute(v) {
      const currentValue = v.grams * v.price;
      const fv = currentValue * Math.pow(1 + v.rate / 100, v.years);
      return {
        main: FC.formatINR(fv),
        items: [
          { label: 'Current Value', value: FC.formatINR(currentValue) },
          { label: 'Gains', value: FC.formatINR(fv - currentValue) },
        ],
        explain: `${v.grams}g of gold worth ${FC.formatINR(currentValue)} today grows to ${FC.formatINR(fv)} in ${v.years} years at ${v.rate}% p.a. appreciation.`,
      };
    },
  },
  {
    id: 'elss', name: 'ELSS Investment Calculator', cat: 'investment',
    desc: 'ELSS corpus with Section 80C tax savings (3-yr lock-in)',
    inputs: [
      { id: 'monthly', label: 'Monthly SIP in ELSS (₹)', min: 500, max: 150000, step: 500, def: 12500 },
      { id: 'rate', label: 'Expected Return (% p.a.)', min: 5, max: 20, step: 0.5, def: 12 },
      { id: 'years', label: 'Tenure (Years, min 3)', min: 3, max: 30, step: 1, def: 10 },
      { id: 'taxSlab', label: 'Tax Slab (%)', type: 'select', options: [['0', '0%'], ['5', '5%'], ['20', '20%'], ['30', '30%']], def: '30' },
    ],
    mainLabel: 'Projected Corpus',
    compute(v) {
      const fv = FC.sipFV(v.monthly, v.rate / 100, v.years);
      const invested = v.monthly * v.years * 12;
      const annualInvestment = Math.min(v.monthly * 12, 150000);
      const taxSaved = annualInvestment * (v.taxSlab / 100);
      return {
        main: FC.formatINR(fv),
        items: [
          { label: 'Total Invested', value: FC.formatINR(invested) },
          { label: 'Annual Tax Saved (80C)', value: FC.formatINR(taxSaved) },
        ],
        explain: `Investing ${FC.formatINR(v.monthly)}/month in ELSS at ${v.rate}% p.a. for ${v.years} years grows to ${FC.formatINR(fv)}, while saving ${FC.formatINR(taxSaved)}/year in tax under Section 80C.`,
      };
    },
  },
  {
    id: 'dividend-yield', name: 'Dividend Yield Calculator', cat: 'investment',
    desc: 'Annual dividend yield of a stock investment',
    inputs: [
      { id: 'price', label: 'Share Price (₹)', min: 1, max: 100000, step: 1, def: 500 },
      { id: 'dividend', label: 'Annual Dividend per Share (₹)', min: 0, max: 5000, step: 0.5, def: 15 },
      { id: 'shares', label: 'Number of Shares', min: 1, max: 1000000, step: 1, def: 100 },
    ],
    mainLabel: 'Dividend Yield',
    compute(v) {
      const yieldPct = v.price > 0 ? (v.dividend / v.price) * 100 : 0;
      const totalDividend = v.dividend * v.shares;
      return {
        main: yieldPct.toFixed(2) + '%',
        items: [{ label: 'Total Annual Dividend', value: FC.formatINR(totalDividend) }],
        explain: `A share priced at ${FC.formatINR(v.price)} paying ${FC.formatINR(v.dividend)}/share annually gives a dividend yield of ${yieldPct.toFixed(2)}%, or ${FC.formatINR(totalDividend)} total for ${v.shares} shares.`,
      };
    },
  },
];

/* ============================================================
   GENERIC UI RENDERER
   ============================================================ */
function uiExtraCalc(def) {
  const inputsHtml = def.inputs.map(inp => {
    const fid = `${def.id}-${inp.id}`;
    if (inp.type === 'select') {
      return field(fid, inp.label, 'select', '', inp.options, inp.def);
    }
    return sliderField(fid, inp.label, inp.min, inp.max, inp.step, inp.def);
  }).join('');
  return `<div class="calc-layout">
    <div class="calc-inputs">${inputsHtml}</div>
    <div class="calc-output">
      <div class="result-card"><div class="result-label">${def.mainLabel || 'Result'}</div><div class="result-main" id="${def.id}-main">--</div>
        <div class="result-grid" id="${def.id}-grid"></div>
      </div>
      <div class="calc-explanation" id="${def.id}-explain"></div>
    </div>
  </div>`;
}

function calcLiveExtra(def) {
  const vals = {};
  def.inputs.forEach(inp => {
    const el = document.getElementById(`${def.id}-${inp.id}`);
    const raw = el ? el.value : inp.def;
    vals[inp.id] = parseFloat(raw);
  });
  let result;
  try {
    result = def.compute(vals);
  } catch (e) {
    result = { main: '--', items: [], explain: '' };
  }
  const mainEl = document.getElementById(`${def.id}-main`);
  if (mainEl) mainEl.textContent = result.main;
  const grid = document.getElementById(`${def.id}-grid`);
  if (grid) {
    grid.innerHTML = result.items.map(it =>
      `<div class="result-item"><div class="result-item-val">${it.value}</div><div class="result-item-label">${it.label}</div></div>`
    ).join('');
  }
  const explainEl = document.getElementById(`${def.id}-explain`);
  if (explainEl) explainEl.textContent = result.explain || '';
}

/* ============================================================
   REGISTRATION — extend CALCULATORS / buildCalcUI / calcLive
   ============================================================ */
const EXTRA_CATEGORY_ICONS = {
  business: 'tax', 'real-estate': 'home-loan', insurance: 'ppf',
  crypto: 'lumpsum', personal: 'retirement', loan: 'car-loan',
  savings: 'rd', investment: 'sip', tax: 'income-tax', retirement: 'nps',
};

EXTRA_CALC_DEFS.forEach(def => {
  CALCULATORS.push({ id: def.id, name: def.name, cat: def.cat, desc: def.desc });
  if (!ICONS[def.id]) ICONS[def.id] = ICONS[EXTRA_CATEGORY_ICONS[def.cat]] || ICONS.fd;
});

const _origBuildCalcUI = buildCalcUI;
buildCalcUI = function (id) {
  const def = EXTRA_CALC_DEFS.find(d => d.id === id);
  if (def) return uiExtraCalc(def);
  return _origBuildCalcUI(id);
};

const _origCalcLive = calcLive;
calcLive = function (id) {
  const def = EXTRA_CALC_DEFS.find(d => d.id === id);
  if (def) { calcLiveExtra(def); return; }
  return _origCalcLive(id);
};
