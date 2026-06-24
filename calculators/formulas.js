/**
 * Financial formula library — pure functions, no DOM deps.
 * All monetary values in INR; rates as decimals (e.g. 0.12 = 12%).
 */
const FC = (() => {
  /* ---- SIP ---- */
  function sipFV(monthly, rateAnnual, years) {
    const n = years * 12;
    const r = rateAnnual / 12;
    if (r === 0) return monthly * n;
    return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  }

  /* ---- Step-up SIP (annual step-up %) ---- */
  function stepUpSIP(monthly, rateAnnual, years, stepUpPercent) {
    const r = rateAnnual / 12;
    let corpus = 0;
    let m = monthly;
    for (let yr = 0; yr < years; yr++) {
      for (let mo = 0; mo < 12; mo++) {
        corpus = (corpus + m) * (1 + r);
      }
      m *= (1 + stepUpPercent / 100);
    }
    return corpus;
  }

  /* ---- Lumpsum ---- */
  function lumpsumFV(principal, rateAnnual, years) {
    return principal * Math.pow(1 + rateAnnual, years);
  }

  /* ---- EMI (reducing balance) ---- */
  function emi(principal, rateAnnual, tenureMonths) {
    const r = rateAnnual / 12;
    if (r === 0) return principal / tenureMonths;
    return principal * r * Math.pow(1 + r, tenureMonths) / (Math.pow(1 + r, tenureMonths) - 1);
  }

  /* ---- Amortization schedule ---- */
  function amortSchedule(principal, rateAnnual, tenureMonths) {
    const r = rateAnnual / 12;
    const e = emi(principal, rateAnnual, tenureMonths);
    const rows = [];
    let balance = principal;
    for (let i = 1; i <= tenureMonths; i++) {
      const interest = balance * r;
      const principalPaid = e - interest;
      balance = Math.max(0, balance - principalPaid);
      rows.push({ month: i, emi: e, interest, principalPaid, balance });
    }
    return rows;
  }

  /* ---- FD with compounding ---- */
  function fdFV(principal, rateAnnual, years, compoundsPerYear = 4, tdsRate = 0) {
    const grossFV = principal * Math.pow(1 + rateAnnual / compoundsPerYear, compoundsPerYear * years);
    const interest = grossFV - principal;
    const tds = interest * tdsRate;
    return { grossFV, interest, tds, netFV: grossFV - tds };
  }

  /* ---- RD ---- */
  function rdFV(monthly, rateAnnual, months) {
    const r = rateAnnual / 4;
    const n = months / 3;
    let fv = 0;
    for (let i = 1; i <= months; i++) {
      const quartersRemaining = Math.ceil((months - i + 1) / 3);
      fv += monthly * Math.pow(1 + r, quartersRemaining);
    }
    return fv;
  }

  /* ---- SWP (Systematic Withdrawal Plan) ---- */
  function swpLongevity(corpus, withdrawal, rateAnnual) {
    const r = rateAnnual / 12;
    if (withdrawal >= corpus * r + corpus / 1000) {
      const n = Math.log(withdrawal / (withdrawal - corpus * r)) / Math.log(1 + r);
      return isFinite(n) ? Math.round(n) : Infinity;
    }
    return Infinity;
  }

  /* ---- Income Tax (FY 2024-25) ---- */
  function taxOldRegime(income, deductions = {}) {
    const ch80c = Math.min(deductions.sec80c || 0, 150000);
    const ch80d = Math.min(deductions.sec80d || 0, 75000);
    const hra = deductions.hra || 0;
    const lta = deductions.lta || 0;
    const stdDeduction = 50000;
    const taxableIncome = Math.max(0, income - stdDeduction - ch80c - ch80d - hra - lta);

    let tax = 0;
    if (taxableIncome > 1000000) tax += (taxableIncome - 1000000) * 0.30;
    if (taxableIncome > 500000) tax += (Math.min(taxableIncome, 1000000) - 500000) * 0.20;
    if (taxableIncome > 250000) tax += (Math.min(taxableIncome, 500000) - 250000) * 0.05;

    const surcharge = taxableIncome > 5000000 ? tax * 0.10 : 0;
    const cess = (tax + surcharge) * 0.04;
    const totalTax = tax + surcharge + cess;

    const rebate87A = taxableIncome <= 500000 ? Math.min(totalTax, 12500) : 0;
    return { taxableIncome, tax: Math.max(0, totalTax - rebate87A), regime: 'old' };
  }

  function taxNewRegime(income) {
    const stdDeduction = 75000;
    const taxableIncome = Math.max(0, income - stdDeduction);

    let tax = 0;
    const slabs = [[300000,0],[600000,0.05],[900000,0.10],[1200000,0.15],[1500000,0.20],[Infinity,0.30]];
    let prev = 0;
    for (const [limit, rate] of slabs) {
      if (taxableIncome > prev) {
        tax += (Math.min(taxableIncome, limit) - prev) * rate;
        prev = limit;
      }
    }

    const rebate87A = taxableIncome <= 700000 ? Math.min(tax, 25000) : 0;
    const taxAfterRebate = Math.max(0, tax - rebate87A);
    const cess = taxAfterRebate * 0.04;
    return { taxableIncome, tax: taxAfterRebate + cess, regime: 'new' };
  }

  /* ---- NPS ---- */
  function npsFV(monthly, employerMonthly, rateAnnual, years, taxBracket) {
    const total = monthly + employerMonthly;
    const corpus = sipFV(total, rateAnnual, years);
    const annuityCorpus = corpus * 0.40;
    const lumpsum = corpus * 0.60;
    const taxOnLumpsum = lumpsum * 0;
    const taxSaved = Math.min(monthly * 12, 50000) * taxBracket;
    return { corpus, annuityCorpus, lumpsum, taxSaved };
  }

  /* ---- Retirement ---- */
  function retirementCorpus(currentAge, retirementAge, monthlyExpense, inflationRate, postReturnRate) {
    const yearsToRetire = retirementAge - currentAge;
    const inflatedExpense = monthlyExpense * Math.pow(1 + inflationRate, yearsToRetire);
    const annualExpense = inflatedExpense * 12;
    const realReturn = (1 + postReturnRate) / (1 + inflationRate) - 1;
    const lifeExpectancy = 85;
    const yearsPostRetirement = lifeExpectancy - retirementAge;
    let corpus;
    if (Math.abs(realReturn) < 0.001) {
      corpus = annualExpense * yearsPostRetirement;
    } else {
      corpus = annualExpense * (1 - Math.pow(1 + realReturn, -yearsPostRetirement)) / realReturn;
    }
    const requiredMonthlySIP = sipRequired(corpus, 0.12, yearsToRetire);
    return { corpus, inflatedExpense, requiredMonthlySIP };
  }

  /* ---- Required SIP for target ---- */
  function sipRequired(targetCorpus, rateAnnual, years) {
    const n = years * 12;
    const r = rateAnnual / 12;
    if (r === 0) return targetCorpus / n;
    return targetCorpus / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
  }

  /* ---- Capital Gains ---- */
  function capitalGains(buyPrice, sellPrice, units, holdingMonths, assetType) {
    const gain = (sellPrice - buyPrice) * units;
    const isLongTerm = assetType === 'equity' ? holdingMonths >= 12 : holdingMonths >= 36;
    let tax = 0, exemption = 0;

    if (assetType === 'equity') {
      if (isLongTerm) {
        exemption = 100000;
        tax = Math.max(0, gain - exemption) * 0.10;
      } else {
        tax = gain > 0 ? gain * 0.15 : 0;
      }
    } else {
      tax = gain > 0 ? gain * 0.20 : 0;
    }

    return { gain, isLongTerm, tax, netGain: gain - tax, exemption };
  }

  /* ---- Prepayment impact ---- */
  function prepaymentImpact(principal, rateAnnual, tenureMonths, prepayment, prepayMonth) {
    const schedule = amortSchedule(principal, rateAnnual, tenureMonths);
    const balanceAfterPrepay = Math.max(0, schedule[prepayMonth - 1].balance - prepayment);
    /* Use original EMI to find how many months to clear reduced balance */
    const origEMI = schedule[0].emi;
    const r = rateAnnual / 12;
    let remainingMonthsActual = 0;
    if (balanceAfterPrepay > 0 && r > 0) {
      remainingMonthsActual = Math.ceil(Math.log(origEMI / (origEMI - balanceAfterPrepay * r)) / Math.log(1 + r));
    }
    const newSchedule = amortSchedule(balanceAfterPrepay, rateAnnual, remainingMonthsActual || 0);
    const originalInterest = schedule.reduce((s, row) => s + row.interest, 0);
    const paidInterest = schedule.slice(0, prepayMonth).reduce((s, row) => s + row.interest, 0);
    const newInterest = newSchedule.reduce((s, row) => s + row.interest, 0);
    const savedInterest = originalInterest - paidInterest - newInterest;
    return { savedInterest, newTenure: prepayMonth + newSchedule.length };
  }

  /* ---- PPF ---- */
  function ppfFV(annual, years) {
    const r = 0.071;
    let corpus = 0;
    for (let y = 0; y < years; y++) corpus = (corpus + annual) * (1 + r);
    return corpus;
  }

  /* ---- Child education corpus ---- */
  function childEducation(currentCost, yearsUntil, inflationRate, returnRate) {
    const futureCost = currentCost * Math.pow(1 + inflationRate, yearsUntil);
    const requiredMonthlySIP = sipRequired(futureCost, returnRate, yearsUntil);
    return { futureCost, requiredMonthlySIP };
  }

  /* ---- Formatting helpers ---- */
  function formatINR(amount) {
    if (!isFinite(amount)) return '∞';
    const abs = Math.abs(amount);
    const sign = amount < 0 ? '-' : '';
    if (abs >= 1e7) return sign + '₹' + (abs / 1e7).toFixed(2) + ' Cr';
    if (abs >= 1e5) return sign + '₹' + (abs / 1e5).toFixed(2) + ' L';
    return sign + '₹' + abs.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function pct(val) { return (val * 100).toFixed(2) + '%'; }

  return {
    sipFV, stepUpSIP, lumpsumFV, emi, amortSchedule,
    fdFV, rdFV, swpLongevity,
    taxOldRegime, taxNewRegime,
    npsFV, retirementCorpus, sipRequired,
    capitalGains, prepaymentImpact, ppfFV, childEducation,
    formatINR, pct
  };
})();
