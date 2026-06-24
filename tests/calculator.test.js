/**
 * FinCalc Pro — Unit Tests
 * Run: npm test
 * Uses Node's built-in test runner (Node ≥18) or Jest.
 */

/* Load formulas without DOM — wrap in module context */
global.window = global;
const vm = require('vm');
const code = require('fs').readFileSync(require('path').join(__dirname, '../calculators/formulas.js'), 'utf8');
const ctx = { module: {}, exports: {} };
vm.runInNewContext(code + '\nmodule.exports = FC;', ctx);
const f = ctx.module.exports;

const assert = require('assert');
const test = (name, fn) => {
  try { fn(); console.log(`  ✅ ${name}`); }
  catch(e) { console.error(`  ❌ ${name}:\n     ${e.message}`); process.exitCode = 1; }
};

/* ============================================================
   SIP TESTS
   ============================================================ */
console.log('\n📈 SIP Calculator');
test('SIP: 5k/mo at 12% for 10yrs', () => {
  const fv = f.sipFV(5000, 0.12, 10);
  assert(fv > 1100000 && fv < 1200000, `Expected ~₹11.6L, got ${fv.toFixed(0)}`);
});
test('SIP: 0% return equals total invested', () => {
  const fv = f.sipFV(1000, 0, 5);
  assert(Math.abs(fv - 60000) < 1, `Expected 60000, got ${fv}`);
});
test('SIP: future value > invested amount', () => {
  const fv = f.sipFV(10000, 0.15, 20);
  assert(fv > 10000 * 20 * 12, 'FV should exceed total invested');
});
test('Step-up SIP > regular SIP with same starting amount', () => {
  const sipFV = f.sipFV(5000, 0.12, 10);
  const stepFV = f.stepUpSIP(5000, 0.12, 10, 10);
  assert(stepFV > sipFV, 'Step-up SIP should yield more');
});
test('SIP goal planner: round-trip consistency', () => {
  const target = 1000000, rate = 0.12, years = 10;
  const required = f.sipRequired(target, rate, years);
  const actual = f.sipFV(required, rate, years);
  assert(Math.abs(actual - target) < 10, `Round-trip error: ${actual} vs ${target}`);
});

/* ============================================================
   EMI TESTS
   ============================================================ */
console.log('\n🏠 EMI Calculator');
test('Home loan EMI: 30L at 8.5% for 20yr', () => {
  const e = f.emi(3000000, 0.085, 240);
  assert(e > 25000 && e < 27000, `Expected ~₹26k, got ${e.toFixed(0)}`);
});
test('EMI × months ≥ principal', () => {
  const e = f.emi(500000, 0.10, 60);
  assert(e * 60 >= 500000, 'Total payment must exceed principal');
});
test('EMI: 0% rate returns principal/months', () => {
  const e = f.emi(120000, 0, 12);
  assert(Math.abs(e - 10000) < 0.01, `Expected 10000, got ${e}`);
});
test('Amortization: last balance ≈ 0', () => {
  const schedule = f.amortSchedule(1000000, 0.09, 120);
  assert(schedule[schedule.length - 1].balance < 10, 'Final balance should be ~0');
});
test('Prepayment saves interest', () => {
  const impact = f.prepaymentImpact(3000000, 0.085, 240, 500000, 24);
  assert(impact.savedInterest > 0, 'Prepayment should save interest');
  /* newTenure = prepayMonth + remaining months; should be less than original 240 */
  assert(impact.newTenure < 240, `Prepayment should reduce tenure (got ${impact.newTenure})`);
});

/* ============================================================
   FD TESTS
   ============================================================ */
console.log('\n🏦 FD Calculator');
test('FD: 1L at 7% quarterly for 2yr', () => {
  const { grossFV } = f.fdFV(100000, 0.07, 2, 4, 0);
  assert(grossFV > 114000 && grossFV < 116000, `Expected ~₹1.15L, got ${grossFV.toFixed(0)}`);
});
test('FD: TDS reduces net payout', () => {
  const { grossFV, netFV } = f.fdFV(100000, 0.07, 2, 4, 0.10);
  assert(netFV < grossFV, 'Net FV after TDS must be less than gross');
});
test('FD: monthly compounding > quarterly', () => {
  const quarterly = f.fdFV(100000, 0.07, 5, 4, 0).grossFV;
  const monthly = f.fdFV(100000, 0.07, 5, 12, 0).grossFV;
  assert(monthly > quarterly, 'Monthly compounding should yield more');
});

/* ============================================================
   RD TESTS
   ============================================================ */
console.log('\n📅 RD Calculator');
test('RD: maturity > total invested', () => {
  const fv = f.rdFV(5000, 0.07, 24);
  assert(fv > 5000 * 24, 'RD maturity must exceed deposits');
});
test('RD: 0% rate returns total deposited', () => {
  const fv = f.rdFV(1000, 0, 12);
  assert(Math.abs(fv - 12000) < 100, `Expected ~12000, got ${fv.toFixed(0)}`);
});

/* ============================================================
   TAX TESTS
   ============================================================ */
console.log('\n🧾 Tax Calculator');
test('Old regime: no tax below 5L with 80C', () => {
  const { tax } = f.taxOldRegime(500000, { sec80c: 150000 });
  assert(tax === 0, `Expected 0 tax with rebate, got ${tax}`);
});
test('New regime: no tax below 7L with rebate', () => {
  const { tax } = f.taxNewRegime(700000);
  assert(tax === 0, `Expected 0 tax, got ${tax}`);
});
test('New regime: 10L income yields positive tax', () => {
  const { tax } = f.taxNewRegime(1000000);
  assert(tax > 0, 'High income should have tax');
});
test('Old regime: deductions reduce taxable income', () => {
  const { taxableIncome: t1 } = f.taxOldRegime(800000, {});
  const { taxableIncome: t2 } = f.taxOldRegime(800000, { sec80c: 150000 });
  assert(t2 < t1, '80C should reduce taxable income');
});
test('Capital gains: equity LTCG 10% above 1L', () => {
  const { tax } = f.capitalGains(100, 200, 1000, 15, 'equity');
  const gain = (200 - 100) * 1000;
  const expected = Math.max(0, gain - 100000) * 0.10;
  assert(Math.abs(tax - expected) < 1, `Expected ${expected}, got ${tax}`);
});

/* ============================================================
   RETIREMENT TESTS
   ============================================================ */
console.log('\n🧓 Retirement');
test('Retirement corpus: positive and reasonable', () => {
  const { corpus } = f.retirementCorpus(30, 60, 30000, 0.06, 0.07);
  assert(corpus > 1e7 && corpus < 1e10, `Corpus out of range: ${corpus.toFixed(0)}`);
});
test('NPS: 60% lumpsum + 40% annuity = corpus', () => {
  const { corpus, lumpsum, annuityCorpus } = f.npsFV(5000, 0, 0.10, 25, 0.30);
  assert(Math.abs(lumpsum + annuityCorpus - corpus) < 1, 'NPS split should sum to corpus');
});

console.log('\n✅ All tests completed.\n');
