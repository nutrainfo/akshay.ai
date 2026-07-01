/**
 * Pure financial formula functions — no React/DOM dependencies.
 * Monetary values in INR; rates as percentages (e.g. 12 = 12% p.a.).
 */

export function sipFutureValue(monthly: number, annualRatePct: number, years: number): number {
  const n = years * 12;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return monthly * n;
  return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
}

export function lumpsumFutureValue(principal: number, annualRatePct: number, years: number): number {
  return principal * Math.pow(1 + annualRatePct / 100, years);
}

export function emi(principal: number, annualRatePct: number, tenureMonths: number): number {
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / tenureMonths;
  return (principal * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1);
}

export function fdMaturity(
  principal: number,
  annualRatePct: number,
  years: number,
  compoundsPerYear = 4
): { maturity: number; interest: number } {
  const maturity = principal * Math.pow(1 + annualRatePct / 100 / compoundsPerYear, compoundsPerYear * years);
  return { maturity, interest: maturity - principal };
}

export function rdMaturity(monthly: number, annualRatePct: number, months: number): number {
  const r = annualRatePct / 100 / 4;
  let fv = 0;
  for (let i = 1; i <= months; i++) {
    const quartersRemaining = Math.ceil((months - i + 1) / 3);
    fv += monthly * Math.pow(1 + r, quartersRemaining);
  }
  return fv;
}

export function ppfMaturity(annualContribution: number, years: number, ratePct = 7.1): number {
  const r = ratePct / 100;
  let corpus = 0;
  for (let y = 0; y < years; y++) corpus = (corpus + annualContribution) * (1 + r);
  return corpus;
}

export function npsCorpus(
  monthly: number,
  employerMonthly: number,
  annualRatePct: number,
  years: number
): { corpus: number; lumpsum: number; annuityCorpus: number } {
  const corpus = sipFutureValue(monthly + employerMonthly, annualRatePct, years);
  return { corpus, lumpsum: corpus * 0.6, annuityCorpus: corpus * 0.4 };
}

export function cagr(initialValue: number, finalValue: number, years: number): number {
  if (initialValue <= 0 || years <= 0) return 0;
  return (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
}

export function inflationAdjustedValue(currentAmount: number, inflationRatePct: number, years: number): number {
  return currentAmount * Math.pow(1 + inflationRatePct / 100, years);
}

export function swpLongevityMonths(corpus: number, monthlyWithdrawal: number, annualRatePct: number): number {
  const r = annualRatePct / 100 / 12;
  if (r <= 0) return corpus / monthlyWithdrawal;
  if (monthlyWithdrawal <= corpus * r) return Infinity;
  const n = Math.log(monthlyWithdrawal / (monthlyWithdrawal - corpus * r)) / Math.log(1 + r);
  return isFinite(n) ? Math.round(n) : Infinity;
}

export function amortizationSchedule(
  principal: number,
  annualRatePct: number,
  tenureMonths: number
): { month: number; emi: number; interest: number; principalPaid: number; balance: number }[] {
  const r = annualRatePct / 100 / 12;
  const e = emi(principal, annualRatePct, tenureMonths);
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

export function formatINR(amount: number): string {
  if (!isFinite(amount)) return '∞';
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  if (abs >= 1e7) return `${sign}₹${(abs / 1e7).toFixed(2)} Cr`;
  if (abs >= 1e5) return `${sign}₹${(abs / 1e5).toFixed(2)} L`;
  return `${sign}₹${abs.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}
