/* ============================================================
   FinCalc Pro — extra-calculators-2.js
   50 more calculators (stocks/forex, startup, education +
   more business/personal). Loaded after extra-calculators.js —
   appends into the shared EXTRA_CALC_DEFS registry.
   ============================================================ */

const EXTRA_CALC_DEFS_2 = [

  /* ---------------- STOCKS / FOREX ---------------- */
  {
    id: 'stock-cagr', name: 'Stock CAGR Calculator', cat: 'stocks',
    desc: 'Compound annual growth rate of a stock holding',
    inputs: [
      { id: 'initial', label: 'Purchase Value (₹)', min: 1000, max: 10000000, step: 1000, def: 100000 },
      { id: 'final', label: 'Current Value (₹)', min: 1000, max: 20000000, step: 1000, def: 175000 },
      { id: 'years', label: 'Holding Period (Years)', min: 0.5, max: 30, step: 0.5, def: 3 },
    ],
    mainLabel: 'CAGR',
    compute(v) {
      const cagr = (Math.pow(v.final / v.initial, 1 / v.years) - 1) * 100;
      return {
        main: cagr.toFixed(2) + '%',
        items: [{ label: 'Absolute Return', value: (((v.final / v.initial) - 1) * 100).toFixed(1) + '%' }],
        explain: `${FC.formatINR(v.initial)} growing to ${FC.formatINR(v.final)} over ${v.years} years is a CAGR of ${cagr.toFixed(2)}%.`,
      };
    },
  },
  {
    id: 'stock-split', name: 'Stock Split Calculator', cat: 'stocks',
    desc: 'New share count & price after a stock split',
    inputs: [
      { id: 'shares', label: 'Shares Owned', min: 1, max: 100000, step: 1, def: 100 },
      { id: 'price', label: 'Price per Share Before Split (₹)', min: 1, max: 100000, step: 1, def: 2000 },
      { id: 'ratio', label: 'Split Ratio (1 share → N shares)', min: 2, max: 20, step: 1, def: 2 },
    ],
    mainLabel: 'New Shares',
    compute(v) {
      const newShares = v.shares * v.ratio;
      const newPrice = v.price / v.ratio;
      return {
        main: newShares.toLocaleString('en-IN'),
        items: [
          { label: 'New Price per Share', value: FC.formatINR(newPrice) },
          { label: 'Total Value (Unchanged)', value: FC.formatINR(v.shares * v.price) },
        ],
        explain: `A 1:${v.ratio} split turns ${v.shares} shares at ${FC.formatINR(v.price)} into ${newShares} shares at ${FC.formatINR(newPrice)} — total value stays the same.`,
      };
    },
  },
  {
    id: 'brokerage-calculator', name: 'Stock Brokerage Calculator', cat: 'stocks',
    desc: 'Brokerage, STT & GST charges on a stock trade',
    inputs: [
      { id: 'tradeValue', label: 'Trade Value (₹)', min: 1000, max: 10000000, step: 1000, def: 100000 },
      { id: 'brokerageRate', label: 'Brokerage (%)', min: 0, max: 1, step: 0.01, def: 0.03 },
      { id: 'sttRate', label: 'STT (%)', min: 0, max: 0.5, step: 0.01, def: 0.1 },
    ],
    mainLabel: 'Total Charges',
    compute(v) {
      const brokerage = v.tradeValue * (v.brokerageRate / 100);
      const stt = v.tradeValue * (v.sttRate / 100);
      const gst = brokerage * 0.18;
      const total = brokerage + stt + gst;
      return {
        main: FC.formatINR(total),
        items: [
          { label: 'Brokerage', value: FC.formatINR(brokerage) },
          { label: 'STT', value: FC.formatINR(stt) },
          { label: 'GST on Brokerage', value: FC.formatINR(gst) },
        ],
        explain: `On a trade value of ${FC.formatINR(v.tradeValue)}, total charges (brokerage + STT + GST) come to ${FC.formatINR(total)}.`,
      };
    },
  },
  {
    id: 'demat-charges', name: 'Demat Account Charges Calculator', cat: 'stocks',
    desc: 'Annual cost of maintaining a demat account',
    inputs: [
      { id: 'amc', label: 'Annual Maintenance Charge (₹)', min: 0, max: 2000, step: 50, def: 300 },
      { id: 'transactions', label: 'Transactions per Year', min: 0, max: 1000, step: 1, def: 50 },
      { id: 'perTxnFee', label: 'Fee per Transaction (₹)', min: 0, max: 100, step: 1, def: 15 },
    ],
    mainLabel: 'Total Annual Cost',
    compute(v) {
      const total = v.amc + v.transactions * v.perTxnFee;
      return {
        main: FC.formatINR(total),
        items: [{ label: 'Transaction Charges', value: FC.formatINR(v.transactions * v.perTxnFee) }],
        explain: `AMC of ${FC.formatINR(v.amc)} plus ${v.transactions} transactions at ${FC.formatINR(v.perTxnFee)} each totals ${FC.formatINR(total)}/year.`,
      };
    },
  },
  {
    id: 'futures-margin', name: 'Futures Margin Calculator', cat: 'stocks',
    desc: 'Margin required to trade a futures contract',
    inputs: [
      { id: 'lotSize', label: 'Lot Size (units)', min: 1, max: 10000, step: 1, def: 500 },
      { id: 'price', label: 'Contract Price (₹)', min: 1, max: 100000, step: 1, def: 2500 },
      { id: 'marginPercent', label: 'Margin Requirement (%)', min: 5, max: 50, step: 1, def: 15 },
    ],
    mainLabel: 'Margin Required',
    compute(v) {
      const contractValue = v.lotSize * v.price;
      const margin = contractValue * (v.marginPercent / 100);
      return {
        main: FC.formatINR(margin),
        items: [{ label: 'Contract Value', value: FC.formatINR(contractValue) }],
        explain: `A contract of ${FC.formatINR(contractValue)} at ${v.marginPercent}% margin requires ${FC.formatINR(margin)} upfront.`,
      };
    },
  },
  {
    id: 'options-premium-breakeven', name: 'Options Breakeven Calculator', cat: 'stocks',
    desc: 'Breakeven price for a call/put option trade',
    inputs: [
      { id: 'strike', label: 'Strike Price (₹)', min: 1, max: 100000, step: 1, def: 2500 },
      { id: 'premium', label: 'Premium Paid (₹)', min: 0.5, max: 5000, step: 0.5, def: 40 },
      { id: 'type', label: 'Option Type', type: 'select', options: [['1', 'Call'], ['0', 'Put']], def: '1' },
    ],
    mainLabel: 'Breakeven Price',
    compute(v) {
      const isCall = v.type === 1 || v.type === '1';
      const breakeven = isCall ? v.strike + v.premium : v.strike - v.premium;
      return {
        main: FC.formatINR(breakeven),
        items: [],
        explain: `For a ${isCall ? 'call' : 'put'} at strike ${FC.formatINR(v.strike)} with premium ${FC.formatINR(v.premium)}, the underlying must ${isCall ? 'rise above' : 'fall below'} ${FC.formatINR(breakeven)} to breakeven.`,
      };
    },
  },
  {
    id: 'portfolio-rebalance', name: 'Portfolio Rebalancing Calculator', cat: 'stocks',
    desc: 'Amount to shift between equity & debt to hit target allocation',
    inputs: [
      { id: 'equity', label: 'Current Equity Value (₹)', min: 0, max: 100000000, step: 10000, def: 700000 },
      { id: 'debt', label: 'Current Debt Value (₹)', min: 0, max: 100000000, step: 10000, def: 300000 },
      { id: 'targetEquity', label: 'Target Equity Allocation (%)', min: 0, max: 100, step: 5, def: 60 },
    ],
    mainLabel: 'Action Needed',
    compute(v) {
      const total = v.equity + v.debt;
      const targetEquityValue = total * (v.targetEquity / 100);
      const diff = targetEquityValue - v.equity;
      const action = diff > 0 ? `Shift ${FC.formatINR(diff)} from Debt → Equity` : `Shift ${FC.formatINR(-diff)} from Equity → Debt`;
      return {
        main: action,
        items: [
          { label: 'Current Equity %', value: ((v.equity / total) * 100).toFixed(1) + '%' },
          { label: 'Target Equity Value', value: FC.formatINR(targetEquityValue) },
        ],
        explain: `To reach a ${v.targetEquity}% equity allocation on a ${FC.formatINR(total)} portfolio, ${action.toLowerCase()}.`,
      };
    },
  },
  {
    id: 'stock-average-price', name: 'Stock Average Price Calculator', cat: 'stocks',
    desc: 'Weighted average buy price across two purchases',
    inputs: [
      { id: 'qty1', label: 'Quantity (1st Buy)', min: 1, max: 100000, step: 1, def: 50 },
      { id: 'price1', label: 'Price (1st Buy) (₹)', min: 1, max: 100000, step: 1, def: 200 },
      { id: 'qty2', label: 'Quantity (2nd Buy)', min: 1, max: 100000, step: 1, def: 50 },
      { id: 'price2', label: 'Price (2nd Buy) (₹)', min: 1, max: 100000, step: 1, def: 160 },
    ],
    mainLabel: 'Average Price',
    compute(v) {
      const totalQty = v.qty1 + v.qty2;
      const avg = (v.qty1 * v.price1 + v.qty2 * v.price2) / totalQty;
      return {
        main: FC.formatINR(avg),
        items: [
          { label: 'Total Quantity', value: totalQty.toLocaleString('en-IN') },
          { label: 'Total Invested', value: FC.formatINR(v.qty1 * v.price1 + v.qty2 * v.price2) },
        ],
        explain: `Buying ${v.qty1} @ ${FC.formatINR(v.price1)} and ${v.qty2} @ ${FC.formatINR(v.price2)} gives an average price of ${FC.formatINR(avg)}.`,
      };
    },
  },
  {
    id: 'currency-conversion-fee', name: 'Currency Conversion Fee Calculator', cat: 'stocks',
    desc: 'Cost of converting foreign currency to INR',
    inputs: [
      { id: 'amountForeign', label: 'Foreign Amount (e.g. USD)', min: 1, max: 1000000, step: 1, def: 1000 },
      { id: 'rate', label: 'Exchange Rate (₹ per unit)', min: 1, max: 300, step: 0.1, def: 84 },
      { id: 'feePercent', label: 'Conversion Fee (%)', min: 0, max: 5, step: 0.1, def: 2 },
    ],
    mainLabel: 'Amount Received (₹)',
    compute(v) {
      const gross = v.amountForeign * v.rate;
      const fee = gross * (v.feePercent / 100);
      const net = gross - fee;
      return {
        main: FC.formatINR(net),
        items: [{ label: 'Conversion Fee', value: FC.formatINR(fee) }],
        explain: `Converting at ${v.rate}/unit gives ${FC.formatINR(gross)} gross; after a ${v.feePercent}% fee you receive ${FC.formatINR(net)}.`,
      };
    },
  },
  {
    id: 'forex-margin', name: 'Forex Margin Calculator', cat: 'stocks',
    desc: 'Margin required for a leveraged forex position',
    inputs: [
      { id: 'lotSize', label: 'Position Size (₹)', min: 10000, max: 50000000, step: 10000, def: 1000000 },
      { id: 'leverage', label: 'Leverage (x)', min: 1, max: 100, step: 1, def: 20 },
    ],
    mainLabel: 'Margin Required',
    compute(v) {
      const margin = v.lotSize / v.leverage;
      return {
        main: FC.formatINR(margin),
        items: [],
        explain: `A position of ${FC.formatINR(v.lotSize)} at ${v.leverage}x leverage requires a margin of ${FC.formatINR(margin)}.`,
      };
    },
  },
  {
    id: 'remittance-cost', name: 'International Remittance Cost Calculator', cat: 'stocks',
    desc: 'Total cost of sending money abroad including markup & fees',
    inputs: [
      { id: 'amountUSD', label: 'Amount to Send (USD)', min: 10, max: 100000, step: 10, def: 1000 },
      { id: 'rate', label: 'Market Exchange Rate (₹/USD)', min: 50, max: 150, step: 0.1, def: 84 },
      { id: 'markupPercent', label: 'Bank FX Markup (%)', min: 0, max: 5, step: 0.1, def: 1.5 },
      { id: 'flatFee', label: 'Flat Transfer Fee (₹)', min: 0, max: 5000, step: 50, def: 500 },
    ],
    mainLabel: 'Total Cost in INR',
    compute(v) {
      const effectiveRate = v.rate * (1 + v.markupPercent / 100);
      const converted = v.amountUSD * effectiveRate;
      const total = converted + v.flatFee;
      return {
        main: FC.formatINR(total),
        items: [
          { label: 'Effective Rate Used', value: '₹' + effectiveRate.toFixed(2) },
          { label: 'Markup Cost', value: FC.formatINR(v.amountUSD * v.rate * (v.markupPercent / 100)) },
        ],
        explain: `Sending $${v.amountUSD} at an effective rate of ₹${effectiveRate.toFixed(2)} plus a flat fee of ${FC.formatINR(v.flatFee)} costs ${FC.formatINR(total)} total.`,
      };
    },
  },
  {
    id: 'nre-nro-fd', name: 'NRE/NRO FD Calculator', cat: 'stocks',
    desc: 'Maturity value of an NRI fixed deposit',
    inputs: [
      { id: 'principal', label: 'Principal (₹)', min: 10000, max: 50000000, step: 10000, def: 1000000 },
      { id: 'rate', label: 'Interest Rate (% p.a.)', min: 4, max: 10, step: 0.1, def: 7.2 },
      { id: 'years', label: 'Tenure (Years)', min: 0.5, max: 10, step: 0.5, def: 3 },
    ],
    mainLabel: 'Maturity Value',
    compute(v) {
      const result = FC.fdFV(v.principal, v.rate / 100, v.years, 4, 0);
      return {
        main: FC.formatINR(result.grossFV),
        items: [{ label: 'Interest Earned', value: FC.formatINR(result.interest) }],
        explain: `${FC.formatINR(v.principal)} in an NRE FD at ${v.rate}% p.a. grows to ${FC.formatINR(result.grossFV)} in ${v.years} years (NRE interest is tax-free in India).`,
      };
    },
  },
  {
    id: 'travel-card-fee', name: 'Forex Travel Card Fee Calculator', cat: 'stocks',
    desc: 'Total loading & conversion cost on a forex travel card',
    inputs: [
      { id: 'loadAmount', label: 'Amount to Load (₹)', min: 1000, max: 1000000, step: 1000, def: 100000 },
      { id: 'loadingFeePercent', label: 'Loading Fee (%)', min: 0, max: 3, step: 0.1, def: 0.5 },
      { id: 'markupPercent', label: 'Conversion Markup (%)', min: 0, max: 4, step: 0.1, def: 1.5 },
    ],
    mainLabel: 'Total Fees',
    compute(v) {
      const loadingFee = v.loadAmount * (v.loadingFeePercent / 100);
      const markupFee = v.loadAmount * (v.markupPercent / 100);
      const total = loadingFee + markupFee;
      return {
        main: FC.formatINR(total),
        items: [{ label: 'Net Amount Usable', value: FC.formatINR(v.loadAmount - total) }],
        explain: `Loading ${FC.formatINR(v.loadAmount)} incurs ${FC.formatINR(loadingFee)} loading fee and ${FC.formatINR(markupFee)} conversion markup — ${FC.formatINR(total)} total fees.`,
      };
    },
  },

  /* ---------------- STARTUP ---------------- */
  {
    id: 'startup-valuation', name: 'Startup Valuation Calculator', cat: 'startup',
    desc: 'Simple revenue-multiple valuation estimate',
    inputs: [
      { id: 'revenue', label: 'Annual Revenue (₹)', min: 100000, max: 500000000, step: 100000, def: 10000000 },
      { id: 'multiple', label: 'Industry Revenue Multiple (x)', min: 1, max: 20, step: 0.5, def: 5 },
    ],
    mainLabel: 'Estimated Valuation',
    compute(v) {
      const val = v.revenue * v.multiple;
      return {
        main: FC.formatINR(val),
        items: [],
        explain: `At a ${v.multiple}x revenue multiple on ${FC.formatINR(v.revenue)} annual revenue, the estimated valuation is ${FC.formatINR(val)}.`,
      };
    },
  },
  {
    id: 'burn-rate', name: 'Startup Burn Rate Calculator', cat: 'startup',
    desc: 'Monthly cash burn from cash balance change',
    inputs: [
      { id: 'startCash', label: 'Cash at Start (₹)', min: 0, max: 1000000000, step: 100000, def: 20000000 },
      { id: 'endCash', label: 'Cash at End (₹)', min: 0, max: 1000000000, step: 100000, def: 14000000 },
      { id: 'months', label: 'Period (Months)', min: 1, max: 60, step: 1, def: 6 },
    ],
    mainLabel: 'Monthly Burn Rate',
    compute(v) {
      const burn = (v.startCash - v.endCash) / v.months;
      return {
        main: FC.formatINR(burn),
        items: [],
        explain: `Cash dropped from ${FC.formatINR(v.startCash)} to ${FC.formatINR(v.endCash)} over ${v.months} months — a burn rate of ${FC.formatINR(burn)}/month.`,
      };
    },
  },
  {
    id: 'runway-calculator', name: 'Startup Runway Calculator', cat: 'startup',
    desc: 'Months of runway left at current burn rate',
    inputs: [
      { id: 'cash', label: 'Cash in Bank (₹)', min: 0, max: 1000000000, step: 100000, def: 15000000 },
      { id: 'burn', label: 'Monthly Burn Rate (₹)', min: 1000, max: 100000000, step: 10000, def: 1500000 },
    ],
    mainLabel: 'Runway',
    compute(v) {
      const runway = v.burn > 0 ? v.cash / v.burn : Infinity;
      return {
        main: isFinite(runway) ? runway.toFixed(1) + ' months' : '∞',
        items: [],
        explain: isFinite(runway) ? `At ${FC.formatINR(v.burn)}/month burn, ${FC.formatINR(v.cash)} in the bank lasts about ${runway.toFixed(1)} months.` : 'No burn — infinite runway.',
      };
    },
  },
  {
    id: 'equity-dilution', name: 'Equity Dilution Calculator', cat: 'startup',
    desc: 'Ownership % after a new funding round issues shares',
    inputs: [
      { id: 'existingShares', label: 'Existing Total Shares', min: 100, max: 100000000, step: 100, def: 1000000 },
      { id: 'yourShares', label: 'Your Shares', min: 1, max: 100000000, step: 1, def: 100000 },
      { id: 'newShares', label: 'New Shares Issued', min: 0, max: 100000000, step: 100, def: 250000 },
    ],
    mainLabel: 'New Ownership %',
    compute(v) {
      const oldPct = (v.yourShares / v.existingShares) * 100;
      const newTotal = v.existingShares + v.newShares;
      const newPct = (v.yourShares / newTotal) * 100;
      return {
        main: newPct.toFixed(2) + '%',
        items: [{ label: 'Ownership Before', value: oldPct.toFixed(2) + '%' }],
        explain: `Issuing ${v.newShares.toLocaleString('en-IN')} new shares dilutes your stake from ${oldPct.toFixed(2)}% to ${newPct.toFixed(2)}%.`,
      };
    },
  },
  {
    id: 'esop-value', name: 'ESOP Value Calculator', cat: 'startup',
    desc: 'Intrinsic value of employee stock options',
    inputs: [
      { id: 'options', label: 'Number of Options', min: 1, max: 1000000, step: 1, def: 5000 },
      { id: 'strike', label: 'Strike Price per Share (₹)', min: 1, max: 100000, step: 1, def: 50 },
      { id: 'fmv', label: 'Current Fair Market Value per Share (₹)', min: 1, max: 100000, step: 1, def: 300 },
    ],
    mainLabel: 'Intrinsic Value',
    compute(v) {
      const gain = Math.max(0, v.fmv - v.strike);
      const value = gain * v.options;
      return {
        main: FC.formatINR(value),
        items: [{ label: 'Gain per Share', value: FC.formatINR(gain) }],
        explain: `${v.options.toLocaleString('en-IN')} options with a ₹${gain} gain per share (FMV ${FC.formatINR(v.fmv)} − strike ${FC.formatINR(v.strike)}) are worth ${FC.formatINR(value)}.`,
      };
    },
  },
  {
    id: 'customer-ltv', name: 'Customer Lifetime Value Calculator', cat: 'startup',
    desc: 'Total value a customer brings over their lifetime',
    inputs: [
      { id: 'aov', label: 'Avg Order Value (₹)', min: 10, max: 1000000, step: 10, def: 1500 },
      { id: 'frequency', label: 'Purchases per Year', min: 0.5, max: 100, step: 0.5, def: 4 },
      { id: 'lifespan', label: 'Customer Lifespan (Years)', min: 0.5, max: 20, step: 0.5, def: 3 },
      { id: 'margin', label: 'Gross Margin (%)', min: 5, max: 90, step: 1, def: 40 },
    ],
    mainLabel: 'Customer LTV',
    compute(v) {
      const ltv = v.aov * v.frequency * v.lifespan * (v.margin / 100);
      return {
        main: FC.formatINR(ltv),
        items: [{ label: 'Annual Revenue per Customer', value: FC.formatINR(v.aov * v.frequency) }],
        explain: `A customer buying ${FC.formatINR(v.aov)} at ${v.frequency}x/year for ${v.lifespan} years at ${v.margin}% margin has an LTV of ${FC.formatINR(ltv)}.`,
      };
    },
  },
  {
    id: 'cac-payback', name: 'CAC Payback Period Calculator', cat: 'startup',
    desc: 'Months to recover customer acquisition cost',
    inputs: [
      { id: 'cac', label: 'Customer Acquisition Cost (₹)', min: 10, max: 1000000, step: 10, def: 2000 },
      { id: 'monthlyRevenue', label: 'Avg Monthly Revenue per Customer (₹)', min: 10, max: 1000000, step: 10, def: 500 },
      { id: 'margin', label: 'Gross Margin (%)', min: 5, max: 90, step: 1, def: 60 },
    ],
    mainLabel: 'CAC Payback Period',
    compute(v) {
      const monthlyMargin = v.monthlyRevenue * (v.margin / 100);
      const months = monthlyMargin > 0 ? v.cac / monthlyMargin : Infinity;
      return {
        main: isFinite(months) ? months.toFixed(1) + ' months' : '∞',
        items: [],
        explain: isFinite(months) ? `Spending ${FC.formatINR(v.cac)} to acquire a customer pays back in ${months.toFixed(1)} months at ${FC.formatINR(monthlyMargin)}/month margin.` : 'No margin to recover CAC.',
      };
    },
  },
  {
    id: 'saas-mrr-growth', name: 'SaaS MRR Growth Calculator', cat: 'startup',
    desc: 'Projected Monthly Recurring Revenue at a growth rate',
    inputs: [
      { id: 'mrr', label: 'Current MRR (₹)', min: 1000, max: 100000000, step: 1000, def: 500000 },
      { id: 'growthPercent', label: 'Monthly Growth Rate (%)', min: 0, max: 50, step: 0.5, def: 8 },
      { id: 'months', label: 'Months', min: 1, max: 60, step: 1, def: 12 },
    ],
    mainLabel: 'Projected MRR',
    compute(v) {
      const futureMrr = v.mrr * Math.pow(1 + v.growthPercent / 100, v.months);
      return {
        main: FC.formatINR(futureMrr),
        items: [{ label: 'Projected ARR', value: FC.formatINR(futureMrr * 12) }],
        explain: `Growing ${v.growthPercent}%/month from ${FC.formatINR(v.mrr)} MRR reaches ${FC.formatINR(futureMrr)} in ${v.months} months.`,
      };
    },
  },

  /* ---------------- EDUCATION ---------------- */
  {
    id: 'education-loan-eligibility', name: 'Education Loan Eligibility Calculator', cat: 'education',
    desc: 'Estimated loan amount eligible based on family income',
    inputs: [
      { id: 'parentIncome', label: 'Parent/Co-applicant Monthly Income (₹)', min: 10000, max: 2000000, step: 1000, def: 80000 },
      { id: 'existingEmi', label: 'Existing EMIs (₹)', min: 0, max: 500000, step: 500, def: 0 },
      { id: 'rate', label: 'Interest Rate (% p.a.)', min: 6, max: 16, step: 0.1, def: 10 },
      { id: 'years', label: 'Repayment Tenure (Years)', min: 1, max: 15, step: 1, def: 10 },
    ],
    mainLabel: 'Estimated Loan Eligibility',
    compute(v) {
      const maxEmi = Math.max(0, v.parentIncome * 0.5 - v.existingEmi);
      const r = v.rate / 100 / 12, n = v.years * 12;
      const loan = r === 0 ? maxEmi * n : maxEmi * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
      return {
        main: FC.formatINR(loan),
        items: [{ label: 'Max Affordable EMI', value: FC.formatINR(maxEmi) }],
        explain: `Based on 50% of co-applicant income available for EMI, an education loan of about ${FC.formatINR(loan)} is likely achievable.`,
      };
    },
  },
  {
    id: 'scholarship-vs-loan', name: 'Scholarship vs Loan Calculator', cat: 'education',
    desc: 'EMI needed after applying a scholarship to course cost',
    inputs: [
      { id: 'totalCost', label: 'Total Course Cost (₹)', min: 50000, max: 20000000, step: 10000, def: 2000000 },
      { id: 'scholarship', label: 'Scholarship Amount (₹)', min: 0, max: 20000000, step: 10000, def: 500000 },
      { id: 'rate', label: 'Loan Interest Rate (%)', min: 6, max: 16, step: 0.1, def: 9.5 },
      { id: 'years', label: 'Loan Tenure (Years)', min: 1, max: 15, step: 1, def: 8 },
    ],
    mainLabel: 'Loan Needed',
    compute(v) {
      const loanNeeded = Math.max(0, v.totalCost - v.scholarship);
      const emiVal = FC.emi(loanNeeded, v.rate / 100, v.years * 12);
      return {
        main: FC.formatINR(loanNeeded),
        items: [{ label: 'Monthly EMI', value: FC.formatINR(emiVal) }],
        explain: `After a scholarship of ${FC.formatINR(v.scholarship)}, you need to borrow ${FC.formatINR(loanNeeded)}, with an EMI of ${FC.formatINR(emiVal)}.`,
      };
    },
  },
  {
    id: 'study-abroad-cost', name: 'Study Abroad Cost Calculator', cat: 'education',
    desc: 'Total INR cost of studying abroad over the course',
    inputs: [
      { id: 'tuition', label: 'Tuition per Year (Foreign Currency)', min: 1000, max: 200000, step: 1000, def: 30000 },
      { id: 'living', label: 'Living Cost per Year (Foreign Currency)', min: 1000, max: 100000, step: 500, def: 15000 },
      { id: 'years', label: 'Course Duration (Years)', min: 1, max: 6, step: 0.5, def: 2 },
      { id: 'fxRate', label: 'Exchange Rate (₹ per unit)', min: 1, max: 300, step: 0.5, def: 84 },
    ],
    mainLabel: 'Total Cost in INR',
    compute(v) {
      const totalForeign = (v.tuition + v.living) * v.years;
      const totalINR = totalForeign * v.fxRate;
      return {
        main: FC.formatINR(totalINR),
        items: [{ label: 'Per Year Cost (INR)', value: FC.formatINR((v.tuition + v.living) * v.fxRate) }],
        explain: `Over ${v.years} years at an exchange rate of ${v.fxRate}, total cost is approximately ${FC.formatINR(totalINR)}.`,
      };
    },
  },
  {
    id: 'skill-course-roi', name: 'Skill Course ROI Calculator', cat: 'education',
    desc: 'Payback period for an upskilling course investment',
    inputs: [
      { id: 'courseFee', label: 'Course Fee (₹)', min: 1000, max: 2000000, step: 1000, def: 100000 },
      { id: 'salaryHike', label: 'Expected Annual Salary Hike (₹)', min: 0, max: 5000000, step: 10000, def: 200000 },
    ],
    mainLabel: 'Payback Period',
    compute(v) {
      const monthlyHike = v.salaryHike / 12;
      const months = monthlyHike > 0 ? v.courseFee / monthlyHike : Infinity;
      return {
        main: isFinite(months) ? months.toFixed(1) + ' months' : '∞',
        items: [],
        explain: isFinite(months) ? `A course costing ${FC.formatINR(v.courseFee)} pays back in ${months.toFixed(1)} months given a ${FC.formatINR(v.salaryHike)}/year salary hike.` : 'No salary hike expected — no payback.',
      };
    },
  },
  {
    id: 'coaching-fee-planner', name: 'Coaching Fee Planner', cat: 'education',
    desc: 'Total cost of a coaching/tuition program',
    inputs: [
      { id: 'monthlyFee', label: 'Monthly Fee (₹)', min: 500, max: 200000, step: 500, def: 5000 },
      { id: 'months', label: 'Duration (Months)', min: 1, max: 36, step: 1, def: 12 },
      { id: 'material', label: 'One-time Material/Registration Cost (₹)', min: 0, max: 100000, step: 500, def: 5000 },
    ],
    mainLabel: 'Total Cost',
    compute(v) {
      const total = v.monthlyFee * v.months + v.material;
      return {
        main: FC.formatINR(total),
        items: [{ label: 'Monthly Outflow', value: FC.formatINR(v.monthlyFee) }],
        explain: `${v.months} months at ${FC.formatINR(v.monthlyFee)}/month plus ${FC.formatINR(v.material)} one-time cost totals ${FC.formatINR(total)}.`,
      };
    },
  },
  {
    id: 'student-budget', name: 'Student Monthly Budget Calculator', cat: 'education',
    desc: 'Savings or shortfall from a student\'s monthly allowance',
    inputs: [
      { id: 'allowance', label: 'Monthly Allowance (₹)', min: 1000, max: 200000, step: 500, def: 15000 },
      { id: 'rent', label: 'Rent/Hostel (₹)', min: 0, max: 100000, step: 500, def: 6000 },
      { id: 'food', label: 'Food (₹)', min: 0, max: 50000, step: 500, def: 4000 },
      { id: 'transport', label: 'Transport (₹)', min: 0, max: 20000, step: 100, def: 1000 },
      { id: 'misc', label: 'Miscellaneous (₹)', min: 0, max: 50000, step: 500, def: 2000 },
    ],
    mainLabel: 'Monthly Balance',
    compute(v) {
      const spend = v.rent + v.food + v.transport + v.misc;
      const balance = v.allowance - spend;
      return {
        main: FC.formatINR(balance),
        items: [{ label: 'Total Expenses', value: FC.formatINR(spend) }],
        explain: balance >= 0 ? `After expenses of ${FC.formatINR(spend)}, you save ${FC.formatINR(balance)}/month.` : `Expenses exceed allowance by ${FC.formatINR(-balance)}/month.`,
      };
    },
  },

  /* ---------------- AGRICULTURE (business) ---------------- */
  {
    id: 'crop-loan-calculator', name: 'Crop Loan Calculator', cat: 'business',
    desc: 'EMI for a short-term agricultural crop loan',
    inputs: [
      { id: 'loanAmount', label: 'Loan Amount (₹)', min: 10000, max: 3000000, step: 10000, def: 300000 },
      { id: 'rate', label: 'Interest Rate (% p.a.)', min: 4, max: 12, step: 0.5, def: 7 },
      { id: 'months', label: 'Tenure (Months)', min: 3, max: 60, step: 1, def: 12 },
    ],
    mainLabel: 'EMI',
    compute(v) {
      const emiVal = FC.emi(v.loanAmount, v.rate / 100, v.months);
      return {
        main: FC.formatINR(emiVal),
        items: [{ label: 'Total Payment', value: FC.formatINR(emiVal * v.months) }],
        explain: `A crop loan of ${FC.formatINR(v.loanAmount)} at ${v.rate}% p.a. over ${v.months} months has an EMI of ${FC.formatINR(emiVal)} (rates as low as 4% with timely-repayment subvention).`,
      };
    },
  },
  {
    id: 'kisan-credit-card-interest', name: 'Kisan Credit Card Interest Calculator', cat: 'business',
    desc: 'Interest payable on KCC utilized amount',
    inputs: [
      { id: 'utilized', label: 'Amount Utilized (₹)', min: 1000, max: 3000000, step: 1000, def: 200000 },
      { id: 'rate', label: 'Interest Rate (% p.a.)', min: 4, max: 12, step: 0.5, def: 7 },
      { id: 'months', label: 'Utilization Period (Months)', min: 1, max: 12, step: 1, def: 6 },
    ],
    mainLabel: 'Interest Payable',
    compute(v) {
      const interest = v.utilized * (v.rate / 100) * (v.months / 12);
      return {
        main: FC.formatINR(interest),
        items: [{ label: 'Total Repayable', value: FC.formatINR(v.utilized + interest) }],
        explain: `Utilizing ${FC.formatINR(v.utilized)} for ${v.months} months at ${v.rate}% p.a. accrues ${FC.formatINR(interest)} interest (4% effective if repaid within a year on loans up to ₹3L with subvention).`,
      };
    },
  },
  {
    id: 'farm-income-calculator', name: 'Farm Income Calculator', cat: 'business',
    desc: 'Net income from crop yield across farmland',
    inputs: [
      { id: 'acres', label: 'Land Area (Acres)', min: 0.5, max: 500, step: 0.5, def: 5 },
      { id: 'yieldPerAcre', label: 'Yield per Acre (Quintals)', min: 1, max: 100, step: 1, def: 20 },
      { id: 'pricePerQuintal', label: 'Price per Quintal (₹)', min: 500, max: 20000, step: 100, def: 2200 },
      { id: 'costPerAcre', label: 'Cultivation Cost per Acre (₹)', min: 1000, max: 200000, step: 1000, def: 20000 },
    ],
    mainLabel: 'Net Farm Income',
    compute(v) {
      const revenue = v.acres * v.yieldPerAcre * v.pricePerQuintal;
      const cost = v.acres * v.costPerAcre;
      const net = revenue - cost;
      return {
        main: FC.formatINR(net),
        items: [
          { label: 'Total Revenue', value: FC.formatINR(revenue) },
          { label: 'Total Cost', value: FC.formatINR(cost) },
        ],
        explain: `${v.acres} acres yielding ${v.yieldPerAcre} quintals/acre at ${FC.formatINR(v.pricePerQuintal)}/quintal generates ${FC.formatINR(revenue)} revenue; net income after costs is ${FC.formatINR(net)}.`,
      };
    },
  },
  {
    id: 'msp-revenue-calculator', name: 'MSP Revenue Calculator', cat: 'business',
    desc: 'Revenue from selling produce at Minimum Support Price',
    inputs: [
      { id: 'quantity', label: 'Quantity (Quintals)', min: 1, max: 10000, step: 1, def: 100 },
      { id: 'mspPrice', label: 'MSP per Quintal (₹)', min: 500, max: 20000, step: 50, def: 2275 },
    ],
    mainLabel: 'Total Revenue',
    compute(v) {
      const revenue = v.quantity * v.mspPrice;
      return {
        main: FC.formatINR(revenue),
        items: [],
        explain: `Selling ${v.quantity} quintals at the MSP of ${FC.formatINR(v.mspPrice)}/quintal yields ${FC.formatINR(revenue)}.`,
      };
    },
  },

  /* ---------------- PERSONAL (freelance, events, utility) ---------------- */
  {
    id: 'hourly-rate-calculator', name: 'Freelance Hourly Rate Calculator', cat: 'personal',
    desc: 'Hourly rate needed to hit a target annual income',
    inputs: [
      { id: 'targetIncome', label: 'Desired Annual Income (₹)', min: 100000, max: 20000000, step: 10000, def: 1200000 },
      { id: 'hoursPerWeek', label: 'Billable Hours per Week', min: 1, max: 60, step: 1, def: 25 },
      { id: 'weeksPerYear', label: 'Working Weeks per Year', min: 20, max: 52, step: 1, def: 46 },
    ],
    mainLabel: 'Required Hourly Rate',
    compute(v) {
      const totalHours = v.hoursPerWeek * v.weeksPerYear;
      const rate = totalHours > 0 ? v.targetIncome / totalHours : 0;
      return {
        main: FC.formatINR(rate),
        items: [{ label: 'Total Billable Hours/Year', value: totalHours.toLocaleString('en-IN') }],
        explain: `To earn ${FC.formatINR(v.targetIncome)}/year billing ${v.hoursPerWeek} hrs/week for ${v.weeksPerYear} weeks, charge ${FC.formatINR(rate)}/hour.`,
      };
    },
  },
  {
    id: 'gig-savings-plan', name: 'Gig Worker Savings Plan Calculator', cat: 'personal',
    desc: 'Monthly & annual savings from variable gig income',
    inputs: [
      { id: 'monthlyIncome', label: 'Avg Monthly Gig Income (₹)', min: 5000, max: 1000000, step: 1000, def: 40000 },
      { id: 'savingsPercent', label: 'Savings Target (%)', min: 5, max: 50, step: 5, def: 20 },
    ],
    mainLabel: 'Monthly Savings',
    compute(v) {
      const monthlySavings = v.monthlyIncome * (v.savingsPercent / 100);
      return {
        main: FC.formatINR(monthlySavings),
        items: [{ label: 'Annual Savings', value: FC.formatINR(monthlySavings * 12) }],
        explain: `Saving ${v.savingsPercent}% of ${FC.formatINR(v.monthlyIncome)}/month sets aside ${FC.formatINR(monthlySavings)}/month, or ${FC.formatINR(monthlySavings * 12)}/year.`,
      };
    },
  },
  {
    id: 'project-quote-calculator', name: 'Freelance Project Quote Calculator', cat: 'personal',
    desc: 'Client quote from estimated hours, rate & overhead',
    inputs: [
      { id: 'hours', label: 'Estimated Hours', min: 1, max: 2000, step: 1, def: 40 },
      { id: 'rate', label: 'Hourly Rate (₹)', min: 100, max: 20000, step: 50, def: 1500 },
      { id: 'overheadPercent', label: 'Overhead/Buffer (%)', min: 0, max: 50, step: 5, def: 15 },
    ],
    mainLabel: 'Project Quote',
    compute(v) {
      const base = v.hours * v.rate;
      const quote = base * (1 + v.overheadPercent / 100);
      return {
        main: FC.formatINR(quote),
        items: [{ label: 'Base Cost', value: FC.formatINR(base) }],
        explain: `${v.hours} hours at ${FC.formatINR(v.rate)}/hr with a ${v.overheadPercent}% buffer gives a project quote of ${FC.formatINR(quote)}.`,
      };
    },
  },
  {
    id: 'wedding-budget-planner', name: 'Wedding Budget Planner', cat: 'personal',
    desc: 'Break down a wedding budget across categories',
    inputs: [
      { id: 'totalBudget', label: 'Total Wedding Budget (₹)', min: 100000, max: 20000000, step: 50000, def: 1500000 },
      { id: 'venuePercent', label: 'Venue & Catering (%)', min: 0, max: 100, step: 5, def: 40 },
      { id: 'decorPercent', label: 'Decor & Photography (%)', min: 0, max: 100, step: 5, def: 20 },
      { id: 'attirePercent', label: 'Attire & Jewellery (%)', min: 0, max: 100, step: 5, def: 20 },
    ],
    mainLabel: 'Miscellaneous / Buffer',
    compute(v) {
      const venue = v.totalBudget * (v.venuePercent / 100);
      const decor = v.totalBudget * (v.decorPercent / 100);
      const attire = v.totalBudget * (v.attirePercent / 100);
      const misc = v.totalBudget - venue - decor - attire;
      return {
        main: FC.formatINR(Math.max(0, misc)),
        items: [
          { label: 'Venue & Catering', value: FC.formatINR(venue) },
          { label: 'Decor & Photography', value: FC.formatINR(decor) },
          { label: 'Attire & Jewellery', value: FC.formatINR(attire) },
        ],
        explain: `Out of ${FC.formatINR(v.totalBudget)}, allocating the given percentages leaves ${FC.formatINR(Math.max(0, misc))} for miscellaneous expenses.`,
      };
    },
  },
  {
    id: 'event-cost-splitter', name: 'Event Cost Splitter', cat: 'personal',
    desc: 'Per-person cost for a shared event or trip',
    inputs: [
      { id: 'totalCost', label: 'Total Event Cost (₹)', min: 1000, max: 5000000, step: 1000, def: 100000 },
      { id: 'people', label: 'Number of People', min: 1, max: 500, step: 1, def: 10 },
    ],
    mainLabel: 'Cost per Person',
    compute(v) {
      const perPerson = v.people > 0 ? v.totalCost / v.people : 0;
      return {
        main: FC.formatINR(perPerson),
        items: [],
        explain: `Splitting ${FC.formatINR(v.totalCost)} among ${v.people} people costs ${FC.formatINR(perPerson)} each.`,
      };
    },
  },
  {
    id: 'honeymoon-fund-planner', name: 'Honeymoon Fund Planner', cat: 'personal',
    desc: 'Monthly savings needed for a target honeymoon budget',
    inputs: [
      { id: 'target', label: 'Target Honeymoon Budget (₹)', min: 10000, max: 5000000, step: 5000, def: 300000 },
      { id: 'months', label: 'Months to Save', min: 1, max: 60, step: 1, def: 12 },
    ],
    mainLabel: 'Monthly Savings Needed',
    compute(v) {
      const monthly = v.months > 0 ? v.target / v.months : 0;
      return {
        main: FC.formatINR(monthly),
        items: [],
        explain: `To save ${FC.formatINR(v.target)} in ${v.months} months, set aside ${FC.formatINR(monthly)}/month.`,
      };
    },
  },
  {
    id: 'festival-budget', name: 'Festival Budget Calculator', cat: 'personal',
    desc: 'Recommended festival spending as % of income',
    inputs: [
      { id: 'income', label: 'Monthly Income (₹)', min: 5000, max: 2000000, step: 1000, def: 60000 },
      { id: 'budgetPercent', label: 'Festival Budget (%)', min: 1, max: 30, step: 1, def: 5 },
    ],
    mainLabel: 'Recommended Festival Budget',
    compute(v) {
      const amount = v.income * (v.budgetPercent / 100);
      return {
        main: FC.formatINR(amount),
        items: [],
        explain: `Allocating ${v.budgetPercent}% of ${FC.formatINR(v.income)} monthly income gives a festival budget of ${FC.formatINR(amount)}.`,
      };
    },
  },
  {
    id: 'simple-interest', name: 'Simple Interest Calculator', cat: 'personal',
    desc: 'Basic simple interest on a principal amount',
    inputs: [
      { id: 'principal', label: 'Principal (₹)', min: 1000, max: 10000000, step: 1000, def: 100000 },
      { id: 'rate', label: 'Rate of Interest (% p.a.)', min: 1, max: 20, step: 0.5, def: 8 },
      { id: 'years', label: 'Years', min: 0.5, max: 30, step: 0.5, def: 3 },
    ],
    mainLabel: 'Simple Interest',
    compute(v) {
      const si = (v.principal * v.rate * v.years) / 100;
      return {
        main: FC.formatINR(si),
        items: [{ label: 'Total Amount', value: FC.formatINR(v.principal + si) }],
        explain: `Simple interest on ${FC.formatINR(v.principal)} at ${v.rate}% p.a. for ${v.years} years is ${FC.formatINR(si)}.`,
      };
    },
  },
  {
    id: 'compound-interest', name: 'Compound Interest Calculator', cat: 'personal',
    desc: 'Compound interest with configurable compounding frequency',
    inputs: [
      { id: 'principal', label: 'Principal (₹)', min: 1000, max: 10000000, step: 1000, def: 100000 },
      { id: 'rate', label: 'Rate of Interest (% p.a.)', min: 1, max: 20, step: 0.5, def: 8 },
      { id: 'years', label: 'Years', min: 0.5, max: 30, step: 0.5, def: 5 },
      { id: 'compoundsPerYear', label: 'Compounding Frequency (times/yr)', type: 'select', options: [['1', 'Annual'], ['2', 'Semi-Annual'], ['4', 'Quarterly'], ['12', 'Monthly']], def: '4' },
    ],
    mainLabel: 'Maturity Value',
    compute(v) {
      const n = v.compoundsPerYear;
      const fv = v.principal * Math.pow(1 + (v.rate / 100) / n, n * v.years);
      return {
        main: FC.formatINR(fv),
        items: [{ label: 'Interest Earned', value: FC.formatINR(fv - v.principal) }],
        explain: `${FC.formatINR(v.principal)} compounded ${n}x/year at ${v.rate}% p.a. for ${v.years} years grows to ${FC.formatINR(fv)}.`,
      };
    },
  },
  {
    id: 'percentage-change', name: 'Percentage Change Calculator', cat: 'personal',
    desc: 'Percentage increase or decrease between two values',
    inputs: [
      { id: 'oldValue', label: 'Old Value (₹)', min: 1, max: 100000000, step: 1, def: 50000 },
      { id: 'newValue', label: 'New Value (₹)', min: 0, max: 100000000, step: 1, def: 65000 },
    ],
    mainLabel: 'Percentage Change',
    compute(v) {
      const change = v.oldValue !== 0 ? ((v.newValue - v.oldValue) / v.oldValue) * 100 : 0;
      return {
        main: (change >= 0 ? '+' : '') + change.toFixed(2) + '%',
        items: [{ label: 'Difference', value: FC.formatINR(v.newValue - v.oldValue) }],
        explain: `Going from ${FC.formatINR(v.oldValue)} to ${FC.formatINR(v.newValue)} is a ${change >= 0 ? 'increase' : 'decrease'} of ${Math.abs(change).toFixed(2)}%.`,
      };
    },
  },
  {
    id: 'discount-calculator', name: 'Discount Calculator', cat: 'personal',
    desc: 'Final price and savings after a percentage discount',
    inputs: [
      { id: 'mrp', label: 'MRP / Original Price (₹)', min: 1, max: 10000000, step: 1, def: 2000 },
      { id: 'discountPercent', label: 'Discount (%)', min: 0, max: 90, step: 1, def: 25 },
    ],
    mainLabel: 'Final Price',
    compute(v) {
      const finalPrice = v.mrp * (1 - v.discountPercent / 100);
      return {
        main: FC.formatINR(finalPrice),
        items: [{ label: 'Amount Saved', value: FC.formatINR(v.mrp - finalPrice) }],
        explain: `A ${v.discountPercent}% discount on ${FC.formatINR(v.mrp)} brings the price down to ${FC.formatINR(finalPrice)}, saving ${FC.formatINR(v.mrp - finalPrice)}.`,
      };
    },
  },
  {
    id: 'tip-calculator', name: 'Tip & Bill Split Calculator', cat: 'personal',
    desc: 'Tip amount and per-person share of a restaurant bill',
    inputs: [
      { id: 'bill', label: 'Bill Amount (₹)', min: 50, max: 200000, step: 50, def: 2000 },
      { id: 'tipPercent', label: 'Tip (%)', min: 0, max: 30, step: 1, def: 10 },
      { id: 'people', label: 'Number of People', min: 1, max: 50, step: 1, def: 4 },
    ],
    mainLabel: 'Total per Person',
    compute(v) {
      const tip = v.bill * (v.tipPercent / 100);
      const total = v.bill + tip;
      const perPerson = total / v.people;
      return {
        main: FC.formatINR(perPerson),
        items: [
          { label: 'Tip Amount', value: FC.formatINR(tip) },
          { label: 'Total Bill', value: FC.formatINR(total) },
        ],
        explain: `A ${v.tipPercent}% tip on ${FC.formatINR(v.bill)} adds ${FC.formatINR(tip)}; split among ${v.people} people, each pays ${FC.formatINR(perPerson)}.`,
      };
    },
  },
  {
    id: 'loan-eligibility-multiplier', name: 'Loan Eligibility Multiplier Calculator', cat: 'personal',
    desc: 'Quick loan eligibility estimate as a multiple of income',
    inputs: [
      { id: 'annualIncome', label: 'Annual Income (₹)', min: 100000, max: 20000000, step: 10000, def: 1000000 },
      { id: 'multiplier', label: 'Eligibility Multiplier (x)', min: 3, max: 10, step: 0.5, def: 5 },
    ],
    mainLabel: 'Estimated Loan Eligibility',
    compute(v) {
      const eligible = v.annualIncome * v.multiplier;
      return {
        main: FC.formatINR(eligible),
        items: [],
        explain: `At ${v.multiplier}x annual income of ${FC.formatINR(v.annualIncome)}, estimated loan eligibility is ${FC.formatINR(eligible)}.`,
      };
    },
  },
  {
    id: 'salary-in-hand', name: 'CTC to In-Hand Salary Calculator', cat: 'personal',
    desc: 'Approximate monthly take-home from annual CTC',
    inputs: [
      { id: 'ctc', label: 'Annual CTC (₹)', min: 100000, max: 20000000, step: 10000, def: 1200000 },
      { id: 'pfPercent', label: 'PF Contribution (%)', min: 0, max: 12, step: 1, def: 12 },
      { id: 'otherDeductionsPercent', label: 'Other Deductions (%)', min: 0, max: 20, step: 1, def: 5 },
    ],
    mainLabel: 'Approx Monthly In-hand',
    compute(v) {
      const annualDeductions = v.ctc * ((v.pfPercent + v.otherDeductionsPercent) / 100);
      const annualInHand = v.ctc - annualDeductions;
      const monthlyInHand = annualInHand / 12;
      return {
        main: FC.formatINR(monthlyInHand),
        items: [{ label: 'Annual Deductions', value: FC.formatINR(annualDeductions) }],
        explain: `From a CTC of ${FC.formatINR(v.ctc)}, after ~${v.pfPercent + v.otherDeductionsPercent}% deductions, monthly in-hand is approximately ${FC.formatINR(monthlyInHand)} (excludes income tax).`,
      };
    },
  },
  {
    id: 'credit-card-interest', name: 'Credit Card Interest Calculator', cat: 'personal',
    desc: 'Interest cost of carrying a credit card balance',
    inputs: [
      { id: 'outstanding', label: 'Outstanding Balance (₹)', min: 500, max: 1000000, step: 500, def: 30000 },
      { id: 'monthlyRate', label: 'Monthly Interest Rate (%)', min: 1, max: 5, step: 0.1, def: 3.5 },
      { id: 'months', label: 'Months Carried', min: 1, max: 36, step: 1, def: 3 },
    ],
    mainLabel: 'Total Interest',
    compute(v) {
      const interest = v.outstanding * ((Math.pow(1 + v.monthlyRate / 100, v.months)) - 1);
      return {
        main: FC.formatINR(interest),
        items: [{ label: 'Total Payable', value: FC.formatINR(v.outstanding + interest) }],
        explain: `Carrying ${FC.formatINR(v.outstanding)} for ${v.months} months at ${v.monthlyRate}%/month compounds to ${FC.formatINR(interest)} in interest — pay in full each month to avoid this.`,
      };
    },
  },
  {
    id: 'minimum-balance-penalty', name: 'Minimum Balance Penalty Calculator', cat: 'personal',
    desc: 'Penalty for not maintaining a bank\'s minimum balance',
    inputs: [
      { id: 'requiredBalance', label: 'Required Minimum Balance (₹)', min: 1000, max: 100000, step: 500, def: 10000 },
      { id: 'actualBalance', label: 'Actual Average Balance (₹)', min: 0, max: 100000, step: 500, def: 6000 },
      { id: 'penaltyPercent', label: 'Penalty Rate (%)', min: 1, max: 10, step: 0.5, def: 6 },
    ],
    mainLabel: 'Penalty Charged',
    compute(v) {
      const shortfall = Math.max(0, v.requiredBalance - v.actualBalance);
      const penalty = shortfall * (v.penaltyPercent / 100);
      return {
        main: FC.formatINR(penalty),
        items: [{ label: 'Balance Shortfall', value: FC.formatINR(shortfall) }],
        explain: shortfall > 0 ? `A shortfall of ${FC.formatINR(shortfall)} attracts a ${v.penaltyPercent}% penalty of ${FC.formatINR(penalty)}.` : 'No penalty — minimum balance maintained.',
      };
    },
  },
  {
    id: 'recurring-subscription-cost', name: 'Subscription Cost Calculator', cat: 'personal',
    desc: 'Total spend on recurring subscriptions over time',
    inputs: [
      { id: 'monthlyFee', label: 'Avg Fee per Subscription (₹/month)', min: 50, max: 5000, step: 50, def: 300 },
      { id: 'count', label: 'Number of Subscriptions', min: 1, max: 30, step: 1, def: 5 },
      { id: 'years', label: 'Years', min: 1, max: 20, step: 1, def: 5 },
    ],
    mainLabel: 'Total Spend',
    compute(v) {
      const total = v.monthlyFee * v.count * v.years * 12;
      return {
        main: FC.formatINR(total),
        items: [{ label: 'Annual Spend', value: FC.formatINR(v.monthlyFee * v.count * 12) }],
        explain: `${v.count} subscriptions at ${FC.formatINR(v.monthlyFee)}/month each cost ${FC.formatINR(v.monthlyFee * v.count * 12)}/year, or ${FC.formatINR(total)} over ${v.years} years.`,
      };
    },
  },
];

/* ============================================================
   REGISTRATION — append into shared EXTRA_CALC_DEFS registry
   ============================================================ */
Object.assign(EXTRA_CATEGORY_ICONS, {
  stocks: 'sip', startup: 'lumpsum', education: 'child-edu',
});

EXTRA_CALC_DEFS_2.forEach(def => {
  EXTRA_CALC_DEFS.push(def);
  CALCULATORS.push({ id: def.id, name: def.name, cat: def.cat, desc: def.desc });
  if (!ICONS[def.id]) ICONS[def.id] = ICONS[EXTRA_CATEGORY_ICONS[def.cat]] || ICONS.fd;
});
