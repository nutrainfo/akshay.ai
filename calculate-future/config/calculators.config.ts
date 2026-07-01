/**
 * ============================================================
 * THE SINGLE SOURCE OF TRUTH FOR EVERY CALCULATOR ON THE SITE.
 * ============================================================
 *
 * To add calculator #10, #50, or #500: append one object to the
 * CALCULATORS array below. That's it. Nothing else to touch.
 *
 * Adding an entry here automatically:
 *   1. Creates a live page at /{slug}          → app/[slug]/page.tsx
 *   2. Generates its <title>, meta description, canonical URL,
 *      Open Graph + Twitter tags                → lib/seo.ts
 *   3. Adds it to sitemap.xml                    → app/sitemap.ts
 *   4. Lists it on /calculators and its category page
 *   5. Makes it available to the Related Calculators widget on
 *      every other page that references its slug
 *   6. Wires up its interactive widget, FAQ schema, and
 *      breadcrumb schema
 *
 * No new files, no route registration, no manual sitemap edits.
 * ============================================================
 */

import type { CalculatorConfig } from '@/lib/types';
import {
  sipFutureValue,
  fdMaturity,
  rdMaturity,
  emi,
  ppfMaturity,
  npsCorpus,
  cagr,
  inflationAdjustedValue,
  swpLongevityMonths,
  formatINR,
} from '@/lib/formulas';

export const CALCULATORS: CalculatorConfig[] = [
  // ============================================================
  // SIP CALCULATOR
  // ============================================================
  {
    slug: 'sip-calculator',
    id: 'sip',
    name: 'SIP Calculator',
    shortName: 'SIP',
    category: 'investment',
    metaTitle: 'SIP Calculator — Calculate Mutual Fund SIP Returns Online (2026)',
    metaDescription:
      'Free SIP calculator to estimate the future value of your monthly mutual fund SIP investment. See total invested amount, wealth gained, and maturity value instantly.',
    keywords: [
      'sip calculator',
      'mutual fund sip calculator',
      'sip return calculator',
      'monthly sip calculator india',
      'sip maturity calculator',
    ],
    h1: 'SIP Calculator — Estimate Your Mutual Fund SIP Returns',
    introParagraph:
      'A Systematic Investment Plan (SIP) lets you invest a fixed amount in a mutual fund every month, harnessing the power of compounding and rupee-cost averaging. Use this SIP calculator to instantly see how much your monthly investment could grow to over any time horizon.',
    explanation: `A Systematic Investment Plan, universally known as SIP, is the single most popular way for Indian retail investors to enter the equity and mutual fund markets. Instead of committing a large lumpsum at one point in time — and risking that you invest right before a market downturn — a SIP spreads your investment across months and years, automatically deducting a fixed amount from your bank account on a chosen date and investing it in the mutual fund scheme of your choice.

The two forces that make SIPs powerful are rupee-cost averaging and compounding. Rupee-cost averaging means that when markets fall, your fixed monthly amount buys more mutual fund units; when markets rise, it buys fewer. Over a long horizon this smooths out the impact of short-term volatility and removes the near-impossible task of "timing the market." Compounding means that the returns your investment earns also start earning returns — money making money on money — which is why the growth curve of a long-term SIP looks flat in the early years and then curves sharply upward in the later years.

This is exactly why financial advisors in India almost universally recommend starting a SIP as early as possible, even with a small amount like ₹500 or ₹1,000 a month, rather than waiting to "save up" a larger sum. A 25-year-old investing ₹5,000/month for 35 years at a realistic 12% annual return builds a dramatically larger corpus than a 35-year-old investing double that amount for 25 years — purely because of the extra decade of compounding.

Indian mutual funds offer SIPs across every risk category: large-cap equity funds for relatively lower volatility, mid-cap and small-cap funds for higher growth potential with higher risk, hybrid funds that blend equity and debt, and index funds that simply track the Nifty 50 or Sensex at very low cost. Most fund houses and platforms (Groww, Zerodha Coin, Kuvera, or directly through AMCs) allow you to start, pause, increase ("step-up"), or stop a SIP with a few taps, and SIPs can be linked to auto-debit mandates so you never have to remember a manual transfer.

It's worth being clear-eyed about what a SIP calculator can and cannot tell you. This tool projects a future value assuming a constant annual rate of return you specify — real markets do not move in a straight line, and actual returns will vary year to year. The number this calculator shows is a reasonable planning estimate, not a guarantee. Historically, well-diversified equity mutual funds in India have delivered 10–14% CAGR over long (10+ year) periods, though any given decade could come in above or below that range.

One feature worth knowing about even though this basic calculator doesn't include it: a "Step-up SIP," where you increase your monthly contribution by a fixed percentage every year (say 10%) in line with salary increments. Because your invested amount grows exactly when your income does, a step-up SIP can build a meaningfully larger corpus than a flat SIP of the same starting amount, without ever feeling like a bigger burden on your monthly budget.`,
    formula: {
      title: 'SIP Future Value Formula',
      expression: 'FV = P × [ ((1 + r)^n − 1) / r ] × (1 + r)',
      variables: [
        { symbol: 'FV', meaning: 'Future value of the SIP investment' },
        { symbol: 'P', meaning: 'Monthly investment (SIP) amount' },
        { symbol: 'r', meaning: 'Expected monthly rate of return (annual rate ÷ 12)' },
        { symbol: 'n', meaning: 'Total number of monthly installments (years × 12)' },
      ],
    },
    example: {
      title: 'Example: ₹10,000/month SIP for 15 years at 12% p.a.',
      steps: [
        'Monthly investment (P) = ₹10,000',
        'Expected annual return = 12% → monthly rate r = 12% / 12 = 1% = 0.01',
        'Tenure = 15 years → n = 15 × 12 = 180 months',
        'FV = 10,000 × [((1.01)^180 − 1) / 0.01] × 1.01',
        'Total amount invested over 15 years = 10,000 × 180 = ₹18,00,000',
      ],
      result: 'FV ≈ ₹50.29 Lakh, meaning your wealth gain is roughly ₹32.29 Lakh above the ₹18 Lakh you invested.',
    },
    benefits: [
      'Disciplined, automated investing — no need to time the market or remember manual transfers',
      'Rupee-cost averaging smooths out the impact of short-term market volatility',
      'The power of compounding accelerates wealth creation significantly over 10+ year horizons',
      'You can start with as little as ₹500/month and increase later as your income grows',
      'Full flexibility to pause, increase, or stop your SIP anytime with no lock-in (except ELSS funds)',
      'Long-term equity SIP gains above ₹1.25 lakh in a financial year are taxed at a relatively low 12.5% LTCG rate',
    ],
    faqs: [
      {
        question: 'What is a good SIP amount to start with?',
        answer:
          'There is no universal "right" amount — what matters is that it is sustainable for your budget. A common rule of thumb is to invest at least 20% of your monthly take-home income across your financial goals, but starting with even ₹500–₹1,000/month is far better than waiting until you can invest more.',
      },
      {
        question: 'Is SIP better than a lumpsum investment?',
        answer:
          'SIPs are generally better for salaried individuals who invest out of monthly income and for reducing the risk of investing a large sum right before a market fall. If you already have a large lumpsum sitting idle, a lumpsum investment can outperform a SIP in a rising market, but carries more timing risk. Many investors use both — a lumpsum for existing savings and a SIP for ongoing monthly income.',
      },
      {
        question: 'What rate of return should I assume in this calculator?',
        answer:
          'For equity mutual fund SIPs, 10–12% p.a. is a commonly used long-term planning assumption based on historical Nifty/Sensex performance, though returns are never guaranteed. For more conservative hybrid or debt-oriented funds, 7–9% is more realistic. Always treat the calculator output as an estimate, not a promise.',
      },
      {
        question: 'Can I stop my SIP anytime?',
        answer:
          'Yes. Open-ended mutual fund SIPs (which is most of them) can be paused or stopped anytime by cancelling the auto-debit mandate with your fund house or platform, with no penalty. The only common exception is ELSS (tax-saving) mutual funds, where each SIP installment is individually locked in for 3 years.',
      },
      {
        question: 'How is SIP taxed in India?',
        answer:
          'Each SIP installment is treated as a separate investment for tax purposes. For equity mutual funds, units held for more than 12 months qualify for LTCG taxed at 12.5% on gains above ₹1.25 lakh in a financial year; units held less than 12 months are taxed at a flat 20% STCG rate.',
      },
    ],
    fields: [
      { id: 'monthly', label: 'Monthly Investment', unit: '₹', min: 500, max: 200000, step: 500, defaultValue: 10000 },
      { id: 'rate', label: 'Expected Return (p.a.)', unit: '%', min: 1, max: 30, step: 0.5, defaultValue: 12 },
      { id: 'years', label: 'Investment Duration', unit: 'years', min: 1, max: 40, step: 1, defaultValue: 15 },
    ],
    compute: (v) => {
      const fv = sipFutureValue(v.monthly, v.rate, v.years);
      const invested = v.monthly * v.years * 12;
      return {
        headline: { label: 'Maturity Value', value: formatINR(fv) },
        items: [
          { label: 'Total Invested', value: formatINR(invested) },
          { label: 'Wealth Gained', value: formatINR(fv - invested) },
        ],
      };
    },
    relatedSlugs: ['cagr-calculator', 'swp-calculator', 'fd-calculator', 'inflation-calculator'],
  },

  // ============================================================
  // FD CALCULATOR
  // ============================================================
  {
    slug: 'fd-calculator',
    id: 'fd',
    name: 'FD Calculator',
    shortName: 'FD',
    category: 'savings',
    metaTitle: 'FD Calculator — Fixed Deposit Maturity & Interest Calculator (2026)',
    metaDescription:
      'Calculate your Fixed Deposit (FD) maturity value and interest earned instantly. Compare quarterly compounding across banks with this free FD calculator.',
    keywords: [
      'fd calculator',
      'fixed deposit calculator',
      'fd maturity calculator',
      'fd interest calculator india',
      'bank fd calculator',
    ],
    h1: 'FD Calculator — Calculate Fixed Deposit Maturity Value',
    introParagraph:
      'A Fixed Deposit (FD) is one of the safest and most widely used savings instruments in India, offering guaranteed, predictable returns. Use this FD calculator to see exactly how much your deposit will be worth at maturity.',
    explanation: `A Fixed Deposit, or FD, is a financial instrument offered by banks, small finance banks, and NBFCs where you deposit a lumpsum amount for a fixed tenure — anywhere from 7 days to 10 years — in exchange for a guaranteed rate of interest that does not fluctuate with the market. Because the interest rate is locked in on the day you open the FD and is backed by DICGC insurance (up to ₹5 lakh per depositor per bank for scheduled banks), FDs are considered one of the lowest-risk investment options available to Indian savers, making them a cornerstone of conservative and retirement portfolios.

Interest on an FD compounds — most Indian banks compound quarterly by default, though some offer monthly, half-yearly, or annual compounding options, and the compounding frequency has a real (if modest) effect on your final maturity value: more frequent compounding means marginally higher effective returns for the same nominal rate. Senior citizens (60 years and above) typically receive an additional 0.25% to 0.75% interest rate over the base rate as a special concession, which is why the FD calculator on many platforms includes a dedicated senior citizen toggle.

There are two broad ways to receive your FD returns: a standard (cumulative) FD reinvests the interest each compounding period and pays out the full maturity amount — principal plus all accumulated interest — only at the end of the tenure. A non-cumulative FD instead pays out interest at regular intervals (monthly, quarterly, or annually) as income, while your principal stays fixed and is returned only at maturity. Retirees who need a regular income stream often prefer non-cumulative FDs, while those building a long-term corpus typically choose cumulative FDs to maximize compounding.

One important detail this calculator will show you: FD interest is fully taxable as per your income tax slab, and banks deduct TDS (Tax Deducted at Source) at 10% if your total interest income from that bank exceeds ₹40,000 in a financial year (₹50,000 for senior citizens). You can avoid TDS deduction by submitting Form 15G (for those below the taxable limit) or Form 15H (for senior citizens) to your bank, though the interest itself still remains taxable and must be declared in your income tax return.

FDs are best suited for short-to-medium-term goals where capital protection matters more than high growth — an emergency fund, a house down payment you'll need in 2 years, or the debt portion of your overall retirement portfolio. For long-term wealth creation (10+ years), FD returns of roughly 6.5–7.5% typically lag behind well-diversified equity mutual funds, though FDs remain unmatched for guaranteed, predictable safety of capital.

Premature withdrawal of an FD is usually allowed but comes with a penalty — typically 0.5% to 1% lower interest than the rate applicable for the period the deposit was actually held, so it's worth choosing your tenure carefully rather than relying on early withdrawal.`,
    formula: {
      title: 'FD Maturity Value Formula (Compound Interest)',
      expression: 'A = P × (1 + r/n)^(n×t)',
      variables: [
        { symbol: 'A', meaning: 'Maturity amount' },
        { symbol: 'P', meaning: 'Principal (deposit) amount' },
        { symbol: 'r', meaning: 'Annual interest rate (as a decimal)' },
        { symbol: 'n', meaning: 'Number of times interest compounds per year (usually 4 = quarterly)' },
        { symbol: 't', meaning: 'Tenure in years' },
      ],
    },
    example: {
      title: 'Example: ₹5,00,000 FD for 5 years at 7% p.a., compounded quarterly',
      steps: [
        'Principal (P) = ₹5,00,000',
        'Annual rate (r) = 7% = 0.07',
        'Compounding frequency (n) = 4 (quarterly)',
        'Tenure (t) = 5 years',
        'A = 5,00,000 × (1 + 0.07/4)^(4×5) = 5,00,000 × (1.0175)^20',
      ],
      result: 'Maturity amount ≈ ₹7,08,477, so total interest earned ≈ ₹2,08,477 over 5 years.',
    },
    benefits: [
      'Guaranteed, fixed returns unaffected by stock market volatility',
      'Capital is protected — DICGC insures deposits up to ₹5 lakh per bank per depositor',
      'Flexible tenures from 7 days to 10 years to match any short or medium-term goal',
      'Senior citizens earn an additional 0.25%–0.75% interest over standard rates',
      'Loan/overdraft facility available against your FD without breaking it',
      'Choice of cumulative (lumpsum at maturity) or non-cumulative (regular payout) structures',
    ],
    faqs: [
      {
        question: 'Is FD interest taxable in India?',
        answer:
          'Yes. FD interest is added to your total income and taxed as per your applicable income tax slab. Banks deduct 10% TDS if your interest income from that bank exceeds ₹40,000 in a year (₹50,000 for senior citizens), but you are still liable to pay any additional tax due based on your slab when filing your return.',
      },
      {
        question: 'Which compounding frequency gives the highest FD returns?',
        answer:
          'For the same nominal interest rate, more frequent compounding always yields a marginally higher maturity value — monthly compounding beats quarterly, which beats annual. The difference is usually small (well under 1% of the final amount) but can matter for large deposits over long tenures.',
      },
      {
        question: 'What happens if I break my FD before maturity?',
        answer:
          'Most banks allow premature withdrawal but apply a penalty, typically reducing your effective interest rate by 0.5%–1% from what was applicable for the period you actually held the deposit. Some tax-saving 5-year FDs (eligible under Section 80C) do not allow premature withdrawal at all.',
      },
      {
        question: 'How much extra interest do senior citizens get on FDs?',
        answer:
          'Most Indian banks offer senior citizens (60 years and above) an additional 0.25% to 0.75% interest rate over the standard FD rate, and some small finance banks offer even more. Senior citizens also enjoy a higher TDS exemption threshold of ₹50,000 in interest income per financial year.',
      },
      {
        question: 'Is FD better than a savings account?',
        answer:
          'Yes, for money you don\'t need immediate access to. FDs typically offer 6–8% p.a. compared to 2.5–4% p.a. on most savings accounts, though savings accounts offer instant liquidity while FDs may have a premature withdrawal penalty.',
      },
    ],
    fields: [
      { id: 'principal', label: 'Deposit Amount', unit: '₹', min: 1000, max: 10000000, step: 1000, defaultValue: 500000 },
      { id: 'rate', label: 'Interest Rate (p.a.)', unit: '%', min: 3, max: 12, step: 0.1, defaultValue: 7 },
      { id: 'years', label: 'Tenure', unit: 'years', min: 0.25, max: 10, step: 0.25, defaultValue: 5 },
    ],
    compute: (v) => {
      const { maturity, interest } = fdMaturity(v.principal, v.rate, v.years, 4);
      return {
        headline: { label: 'Maturity Value', value: formatINR(maturity) },
        items: [
          { label: 'Principal', value: formatINR(v.principal) },
          { label: 'Interest Earned', value: formatINR(interest) },
        ],
      };
    },
    relatedSlugs: ['rd-calculator', 'ppf-calculator', 'sip-calculator', 'inflation-calculator'],
  },

  // ============================================================
  // RD CALCULATOR
  // ============================================================
  {
    slug: 'rd-calculator',
    id: 'rd',
    name: 'RD Calculator',
    shortName: 'RD',
    category: 'savings',
    metaTitle: 'RD Calculator — Recurring Deposit Maturity Calculator (2026)',
    metaDescription:
      'Free Recurring Deposit (RD) calculator to estimate maturity value and interest earned on your monthly RD deposits with any Indian bank or post office.',
    keywords: [
      'rd calculator',
      'recurring deposit calculator',
      'rd maturity calculator',
      'post office rd calculator',
      'monthly deposit calculator',
    ],
    h1: 'RD Calculator — Calculate Recurring Deposit Maturity Value',
    introParagraph:
      'A Recurring Deposit (RD) lets you build savings discipline by depositing a fixed amount every month into a bank or post office account that earns FD-like interest. Use this calculator to see your RD maturity value instantly.',
    explanation: `A Recurring Deposit, commonly called an RD, is designed for people who want the safety and guaranteed returns of a Fixed Deposit but don't have a lumpsum to invest upfront — instead, you commit to depositing a fixed amount every month for a chosen tenure, typically ranging from 6 months to 10 years. Banks and post offices in India both offer RDs, and interest rates are usually comparable to FD rates of similar tenure, often 6–7.5% per annum for regular RDs (with an additional 0.25–0.75% for senior citizens on bank RDs).

The mechanics of an RD sit somewhere between a SIP and an FD. Like a SIP, you contribute a fixed amount every month rather than a lumpsum, which makes it accessible even on a modest salary and builds the habit of consistent saving. Like an FD, the interest rate is fixed and guaranteed for the entire tenure regardless of market conditions, and the amount is fully protected (DICGC-insured up to ₹5 lakh for bank RDs). Unlike a SIP invested in mutual funds, however, an RD carries no market risk whatsoever — your returns are contractually fixed the day you open the account.

RD interest compounds quarterly in most banks, similar to FDs, though the maturity value calculation is more involved than a simple FD because each monthly deposit earns interest for a different length of time — the first month's deposit earns interest for the full tenure, while the last month's deposit earns interest for only one compounding period. This calculator handles that calculation for you automatically.

Post Office RDs are particularly popular in smaller towns and among risk-averse savers because they are backed directly by the Government of India rather than a bank, and post office RD interest rates (revised quarterly) have historically been competitive with or better than many bank RDs. As of recent quarters, the Post Office RD rate has hovered around 6.7%, compounded quarterly, with a standard 5-year tenure (extendable).

RDs are an excellent tool for specific, time-bound savings goals with a known target date: saving for an annual insurance premium, a family wedding a few years out, a vacation fund, or simply building the habit of monthly saving before graduating to SIP-based investing. Because RD returns don't beat inflation by much once you account for taxation (RD interest, like FD interest, is fully taxable at your income slab rate), they are not ideal for long-term wealth building — for goals more than 5-7 years away, a SIP in an appropriate mutual fund category will typically build a larger corpus, albeit with market-linked risk.

One practical tip: most banks allow you to close an RD prematurely, but you'll usually forfeit a portion of the promised interest rate, similar to premature FD withdrawal. If you miss a monthly installment, banks typically charge a small penalty (often ₹1–₹15 per ₹100 of the installment per month of delay depending on the RD amount) rather than terminating the account outright, though repeated defaults can lead to closure.`,
    formula: {
      title: 'RD Maturity Value Formula',
      expression: 'A = Σ [ P × (1 + r/4)^(4×t_i / 12) ]  for each monthly installment i',
      variables: [
        { symbol: 'A', meaning: 'Maturity amount (sum across all monthly installments)' },
        { symbol: 'P', meaning: 'Fixed monthly deposit amount' },
        { symbol: 'r', meaning: 'Annual interest rate (as a decimal)' },
        { symbol: 't_i', meaning: 'Remaining months for installment i to earn interest until maturity' },
      ],
    },
    example: {
      title: 'Example: ₹5,000/month RD for 3 years at 6.9% p.a.',
      steps: [
        'Monthly deposit (P) = ₹5,000',
        'Annual rate (r) = 6.9%, compounded quarterly',
        'Tenure = 3 years = 36 monthly installments',
        'Each installment compounds quarterly for its remaining time to maturity',
        'Total amount deposited over 3 years = 5,000 × 36 = ₹1,80,000',
      ],
      result: 'Maturity value ≈ ₹1,98,700, meaning interest earned ≈ ₹18,700 over the 3-year tenure.',
    },
    benefits: [
      'No lumpsum needed — build savings with small, fixed monthly deposits',
      'Guaranteed, fixed interest rate for the entire tenure, unaffected by market swings',
      'Widely available at banks and post offices, including in rural and semi-urban India',
      'DICGC insurance covers bank RD deposits up to ₹5 lakh per depositor per bank',
      'Builds financial discipline — a natural stepping stone before starting SIP investing',
      'Flexible tenures from 6 months to 10 years to match short and medium-term goals',
    ],
    faqs: [
      {
        question: 'What is the difference between RD and FD?',
        answer:
          'An FD requires a one-time lumpsum deposit, while an RD requires fixed monthly deposits over the tenure. Both offer similar fixed interest rates and guaranteed returns, but an RD is better suited to those who want to save gradually from monthly income rather than invest a large sum upfront.',
      },
      {
        question: 'What happens if I miss an RD installment?',
        answer:
          'Most banks charge a small penalty (commonly ₹1–₹15 per ₹100 of the monthly installment, per month of delay) rather than closing the account immediately. However, consistently missing installments can eventually lead to the RD being closed by the bank, so it is important to only commit to an amount you can sustain monthly.',
      },
      {
        question: 'Is RD interest taxable?',
        answer:
          'Yes, RD interest is fully taxable as per your income tax slab, exactly like FD interest. Banks deduct 10% TDS if the total interest earned across your RDs and FDs with that bank exceeds ₹40,000 in a financial year (₹50,000 for senior citizens).',
      },
      {
        question: 'Can I withdraw my RD before maturity?',
        answer:
          'Yes, premature closure is usually allowed, but you will typically receive a lower interest rate than originally promised — similar to premature FD withdrawal penalties, which vary by bank.',
      },
      {
        question: 'Is Post Office RD better than a bank RD?',
        answer:
          'Post Office RDs are backed directly by the Government of India and offer a standardized, quarterly-revised interest rate (recently around 6.7%) with a fixed 5-year tenure. Bank RDs offer more flexible tenures (6 months to 10 years) and sometimes marginally higher rates, especially at small finance banks — compare current rates before choosing.',
      },
    ],
    fields: [
      { id: 'monthly', label: 'Monthly Deposit', unit: '₹', min: 500, max: 100000, step: 500, defaultValue: 5000 },
      { id: 'rate', label: 'Interest Rate (p.a.)', unit: '%', min: 3, max: 10, step: 0.1, defaultValue: 6.9 },
      { id: 'months', label: 'Tenure', unit: 'months', min: 6, max: 120, step: 3, defaultValue: 36 },
    ],
    compute: (v) => {
      const maturity = rdMaturity(v.monthly, v.rate, v.months);
      const invested = v.monthly * v.months;
      return {
        headline: { label: 'Maturity Value', value: formatINR(maturity) },
        items: [
          { label: 'Total Deposited', value: formatINR(invested) },
          { label: 'Interest Earned', value: formatINR(maturity - invested) },
        ],
      };
    },
    relatedSlugs: ['fd-calculator', 'ppf-calculator', 'sip-calculator'],
  },

  // ============================================================
  // EMI CALCULATOR
  // ============================================================
  {
    slug: 'emi-calculator',
    id: 'emi',
    name: 'EMI Calculator',
    shortName: 'EMI',
    category: 'loan',
    metaTitle: 'EMI Calculator — Home, Car & Personal Loan EMI Calculator (2026)',
    metaDescription:
      'Free EMI calculator for home loans, car loans, and personal loans. Instantly calculate your monthly EMI, total interest payable, and full amortization schedule.',
    keywords: [
      'emi calculator',
      'home loan emi calculator',
      'car loan emi calculator',
      'loan emi calculator india',
      'personal loan emi calculator',
    ],
    h1: 'EMI Calculator — Calculate Your Loan EMI Instantly',
    introParagraph:
      'Whether you\'re planning a home loan, car loan, or personal loan, knowing your exact monthly EMI beforehand helps you budget confidently. This EMI calculator computes your monthly installment, total interest, and total repayment in seconds.',
    explanation: `EMI stands for Equated Monthly Installment — the fixed amount you pay every month to your lender until a loan is fully repaid. Every EMI is a blend of two components: a portion that goes toward reducing your outstanding principal, and a portion that pays interest on the remaining balance. In the early months of any loan, the interest component dominates the EMI because your outstanding principal is at its highest; as the loan matures, more of each EMI goes toward principal repayment and less toward interest — this shifting split is what an amortization schedule visualizes month by month.

The three variables that determine your EMI are the loan principal (how much you borrow), the annual interest rate your lender charges, and the tenure (how many months or years you take to repay). Of these three, tenure has an outsized and often underappreciated effect on total cost: extending a loan's tenure lowers your monthly EMI (making it easier to qualify and budget for), but dramatically increases the total interest you pay over the life of the loan, because you are paying interest on a large outstanding balance for a longer period. A ₹30 lakh home loan at 8.5% over 20 years costs roughly ₹34.4 lakh in interest, while the same loan over 30 years costs roughly ₹57.3 lakh in interest — nearly ₹23 lakh more, for a monthly EMI that is only about ₹4,500 lower.

Home loans in India are typically offered at floating interest rates linked to the lender's repo-linked lending rate (RLLR), meaning your EMI (or tenure, depending on the bank's policy) can change when the RBI adjusts the repo rate. Car loans and personal loans are more commonly offered at fixed rates for the entire tenure, giving you certainty about your monthly outflow but usually at a higher interest rate than home loans, since they are unsecured or secured against a rapidly depreciating asset.

A crucial, often-overlooked lever for reducing your total interest cost is prepayment — making extra lumpsum payments toward your principal whenever you have surplus cash (a bonus, tax refund, or maturing FD). Because interest is calculated on the outstanding principal, even a modest prepayment early in the loan tenure can save you a disproportionately large amount of interest and shave years off your repayment schedule. Most Indian banks do not charge prepayment penalties on floating-rate home loans taken by individual borrowers, per RBI guidelines, making this one of the most effective (and underused) tools available to Indian home loan borrowers.

Before taking any loan, it's worth checking your total EMI obligations (including any existing loans) against the widely used affordability rule of thumb: most lenders and financial planners suggest keeping your total EMI outflow under 40% of your monthly take-home income, to leave adequate room for living expenses, savings, and unexpected costs. This calculator helps you sanity-check that ratio before you commit to a loan tenure and amount.`,
    formula: {
      title: 'EMI Formula (Reducing Balance Method)',
      expression: 'EMI = [P × r × (1 + r)^n] / [(1 + r)^n − 1]',
      variables: [
        { symbol: 'EMI', meaning: 'Equated Monthly Installment' },
        { symbol: 'P', meaning: 'Loan principal amount' },
        { symbol: 'r', meaning: 'Monthly interest rate (annual rate ÷ 12 ÷ 100)' },
        { symbol: 'n', meaning: 'Loan tenure in months' },
      ],
    },
    example: {
      title: 'Example: ₹30,00,000 home loan at 8.5% p.a. for 20 years',
      steps: [
        'Principal (P) = ₹30,00,000',
        'Annual rate = 8.5% → monthly rate r = 8.5/12/100 = 0.007083',
        'Tenure = 20 years → n = 240 months',
        'EMI = [30,00,000 × 0.007083 × (1.007083)^240] / [(1.007083)^240 − 1]',
      ],
      result: 'EMI ≈ ₹26,035/month. Total payment over 20 years ≈ ₹62.48 Lakh, so total interest paid ≈ ₹32.48 Lakh.',
    },
    benefits: [
      'Instantly know your exact monthly EMI before applying for any loan',
      'Compare how different tenures affect your EMI amount vs. total interest cost',
      'Plan your monthly budget with certainty and avoid over-borrowing',
      'Understand how much of each EMI goes to interest vs. principal at any point in the loan',
      'Model the impact of prepayments before deciding how much extra to pay',
      'Negotiate better loan terms armed with a clear understanding of the numbers',
    ],
    faqs: [
      {
        question: 'Does a longer loan tenure always mean I pay more interest?',
        answer:
          'Yes, for the same principal and interest rate, a longer tenure always increases total interest paid, even though it lowers your monthly EMI. This is because you carry a larger outstanding balance for a longer period, and interest accrues on that balance every month.',
      },
      {
        question: 'What is the ideal EMI-to-income ratio?',
        answer:
          'Most lenders and financial planners recommend keeping your total EMI obligations (across all loans) below 40% of your monthly take-home income, to leave sufficient room for essential expenses, savings, and emergencies.',
      },
      {
        question: 'Can I prepay my home loan without penalty?',
        answer:
          'Per RBI guidelines, banks cannot charge prepayment or foreclosure penalties on floating-rate home loans taken by individual borrowers for non-business purposes. Fixed-rate loans and loans to non-individuals may still attract prepayment charges — check your loan agreement.',
      },
      {
        question: 'Why is my EMI mostly interest in the early years?',
        answer:
          'Because interest is calculated on your outstanding principal balance each month, and that balance is at its highest right after disbursement, the interest component of your EMI is largest in the early years and gradually shrinks as the principal is paid down — this is standard reducing-balance amortization.',
      },
      {
        question: 'Should I choose a fixed or floating interest rate?',
        answer:
          'Floating rates (common for home loans) move with the RBI repo rate and market conditions — they can rise or fall over your loan tenure. Fixed rates (common for personal and car loans) stay constant, giving payment certainty but usually at a rate premium. Floating rates are generally preferred for long-tenure home loans where rate cycles average out over time.',
      },
    ],
    fields: [
      { id: 'principal', label: 'Loan Amount', unit: '₹', min: 50000, max: 100000000, step: 50000, defaultValue: 3000000 },
      { id: 'rate', label: 'Interest Rate (p.a.)', unit: '%', min: 5, max: 20, step: 0.1, defaultValue: 8.5 },
      { id: 'years', label: 'Tenure', unit: 'years', min: 1, max: 30, step: 1, defaultValue: 20 },
    ],
    compute: (v) => {
      const monthlyEmi = emi(v.principal, v.rate, v.years * 12);
      const totalPayment = monthlyEmi * v.years * 12;
      return {
        headline: { label: 'Monthly EMI', value: formatINR(monthlyEmi) },
        items: [
          { label: 'Total Payment', value: formatINR(totalPayment) },
          { label: 'Total Interest', value: formatINR(totalPayment - v.principal) },
        ],
      };
    },
    relatedSlugs: ['fd-calculator', 'sip-calculator', 'inflation-calculator'],
  },

  // ============================================================
  // PPF CALCULATOR
  // ============================================================
  {
    slug: 'ppf-calculator',
    id: 'ppf',
    name: 'PPF Calculator',
    shortName: 'PPF',
    category: 'savings',
    metaTitle: 'PPF Calculator — Public Provident Fund Maturity Calculator (2026)',
    metaDescription:
      'Calculate your PPF maturity value with this free Public Provident Fund calculator. See tax-free interest earned on your 15-year PPF investment instantly.',
    keywords: [
      'ppf calculator',
      'public provident fund calculator',
      'ppf maturity calculator',
      'ppf interest calculator',
      'ppf 15 year calculator',
    ],
    h1: 'PPF Calculator — Calculate Public Provident Fund Maturity Value',
    introParagraph:
      'The Public Provident Fund (PPF) is a government-backed, tax-free savings scheme with a 15-year lock-in, popular for its safety, guaranteed returns, and triple tax exemption (EEE) status. Use this calculator to project your PPF maturity value.',
    explanation: `The Public Provident Fund, or PPF, is one of the oldest and most trusted long-term savings instruments in India, introduced by the government in 1968 specifically to encourage small savings with attractive, tax-free returns. A PPF account can be opened at any nationalized bank, most private banks, or a post office, with a minimum annual contribution of just ₹500 and a maximum of ₹1.5 lakh per financial year — contributions above ₹1.5 lakh do not earn interest or qualify for tax deduction.

What makes PPF genuinely unique among Indian savings instruments is its "EEE" (Exempt-Exempt-Exempt) tax status: your annual contribution is deductible from taxable income under Section 80C (up to the ₹1.5 lakh limit, shared with other 80C instruments like ELSS and life insurance premiums), the interest earned every year is completely tax-free, and the entire maturity amount withdrawn at the end of the tenure is also tax-free. No other government-backed instrument offers this complete tax exemption at all three stages, which is why PPF remains a cornerstone recommendation for the debt portion of long-term financial plans, especially for those in higher tax brackets.

The PPF interest rate is set by the government every quarter (currently around 7.1% per annum, though this is revised periodically) and is compounded annually, though interest is calculated on the lowest balance between the 5th and last day of each month — which is why financial advisors consistently recommend depositing your PPF contribution before the 5th of the month (ideally in April, at the start of the financial year) to maximize the interest earned for that period.

The standard PPF tenure is 15 years, and this is a genuine lock-in — you cannot close the account early except in specific circumstances (life-threatening illness of the account holder or dependents, higher education needs, or a change in residency status, and even then only after 5 years). However, PPF does offer two forms of liquidity within the lock-in: partial withdrawals are permitted from the 7th financial year onward, and loans against your PPF balance are available between the 3rd and 6th financial years. After the initial 15-year maturity, account holders have the flexible option to extend the account in blocks of 5 years, either continuing to contribute (with the same tax benefits) or without further contributions while the balance continues to earn interest.

Because PPF returns are government-guaranteed and unaffected by stock market movements, it functions as an anchor of stability in a financial portfolio, best used for very long-term, low-risk goals — retirement savings, a child's higher education fund, or simply as the ultra-safe component that balances higher-risk equity investments elsewhere in your portfolio. The trade-off is that PPF returns, while tax-free, are typically lower than what a well-managed equity SIP could deliver over the same 15+ year horizon before tax — the right allocation between the two depends on your overall risk appetite and time horizon.`,
    formula: {
      title: 'PPF Maturity Value Formula (Annual Compounding)',
      expression: 'A = Σ [ (Balance + Contribution) × (1 + r) ]  compounded annually over 15 years',
      variables: [
        { symbol: 'A', meaning: 'Maturity value at the end of the tenure' },
        { symbol: 'Contribution', meaning: 'Annual PPF deposit (up to ₹1.5 lakh/year)' },
        { symbol: 'r', meaning: 'Current PPF interest rate (compounded annually, e.g. 7.1%)' },
      ],
    },
    example: {
      title: 'Example: ₹1,50,000/year PPF contribution for 15 years at 7.1% p.a.',
      steps: [
        'Annual contribution = ₹1,50,000 (the maximum allowed under Section 80C)',
        'Interest rate = 7.1% per annum, compounded annually',
        'Tenure = 15 years (standard PPF lock-in)',
        'Total amount contributed over 15 years = 1,50,000 × 15 = ₹22,50,000',
      ],
      result: 'Maturity value ≈ ₹40.68 Lakh, meaning tax-free interest earned ≈ ₹18.18 Lakh over 15 years.',
    },
    benefits: [
      'EEE tax status: contribution, interest, and maturity amount are all completely tax-free',
      'Sovereign guarantee — returns are backed by the Government of India, zero market risk',
      'Contribution qualifies for deduction under Section 80C up to ₹1.5 lakh per year',
      'Partial withdrawals allowed from the 7th financial year, loans available from year 3',
      'Can be extended indefinitely in 5-year blocks after the initial 15-year maturity',
      'Protected from attachment by creditors even in cases of debt default (with limited exceptions)',
    ],
    faqs: [
      {
        question: 'What is the current PPF interest rate?',
        answer:
          'The PPF interest rate is set by the Ministry of Finance every quarter and has been around 7.1% per annum in recent years, though it is subject to periodic revision. It is always compounded annually.',
      },
      {
        question: 'Can I withdraw my PPF money before 15 years?',
        answer:
          'Partial withdrawals are allowed from the 7th financial year onward, subject to limits. Full premature closure is only permitted in specific cases such as life-threatening illness, higher education needs, or change of residency status, and only after completing 5 years.',
      },
      {
        question: 'What happens after my PPF account matures in 15 years?',
        answer:
          'You can withdraw the entire tax-free maturity amount, or extend the account in blocks of 5 years — either continuing to make contributions (retaining the 80C tax benefit) or without further contributions, while the existing balance continues to earn tax-free interest.',
      },
      {
        question: 'What is the minimum and maximum PPF contribution?',
        answer:
          'The minimum annual contribution to keep a PPF account active is ₹500, and the maximum is ₹1.5 lakh per financial year. Contributions beyond ₹1.5 lakh do not earn interest and are not eligible for tax deduction.',
      },
      {
        question: 'Is PPF better than ELSS mutual funds for tax saving?',
        answer:
          'Both qualify for Section 80C deduction, but they serve different purposes. PPF offers guaranteed, tax-free returns with a long 15-year lock-in and zero market risk. ELSS mutual funds have a much shorter 3-year lock-in and historically higher return potential, but come with market risk and gains are taxed (12.5% LTCG above ₹1.25 lakh). Many investors use both for a balanced approach.',
      },
    ],
    fields: [
      { id: 'annual', label: 'Annual Contribution', unit: '₹', min: 500, max: 150000, step: 500, defaultValue: 150000 },
      { id: 'years', label: 'Tenure', unit: 'years', min: 15, max: 40, step: 5, defaultValue: 15 },
      { id: 'rate', label: 'Interest Rate (p.a.)', unit: '%', min: 6, max: 9, step: 0.1, defaultValue: 7.1 },
    ],
    compute: (v) => {
      const maturity = ppfMaturity(v.annual, v.years, v.rate);
      const invested = v.annual * v.years;
      return {
        headline: { label: 'Maturity Value (Tax-Free)', value: formatINR(maturity) },
        items: [
          { label: 'Total Invested', value: formatINR(invested) },
          { label: 'Interest Earned', value: formatINR(maturity - invested) },
        ],
      };
    },
    relatedSlugs: ['fd-calculator', 'nps-calculator', 'sip-calculator'],
  },

  // ============================================================
  // NPS CALCULATOR
  // ============================================================
  {
    slug: 'nps-calculator',
    id: 'nps',
    name: 'NPS Calculator',
    shortName: 'NPS',
    category: 'retirement',
    metaTitle: 'NPS Calculator — National Pension System Corpus Calculator (2026)',
    metaDescription:
      'Free NPS calculator to estimate your National Pension System retirement corpus, lumpsum withdrawal, and annuity split based on your monthly contribution.',
    keywords: [
      'nps calculator',
      'national pension system calculator',
      'nps corpus calculator',
      'nps retirement calculator',
      'nps pension calculator',
    ],
    h1: 'NPS Calculator — Estimate Your National Pension System Corpus',
    introParagraph:
      'The National Pension System (NPS) is a government-regulated, market-linked retirement savings scheme offering additional tax benefits beyond Section 80C. Use this calculator to estimate your retirement corpus, tax-free lumpsum, and annuity.',
    explanation: `The National Pension System, or NPS, is a voluntary, defined-contribution retirement savings scheme regulated by the Pension Fund Regulatory and Development Authority (PFRDA), open to all Indian citizens aged 18 to 70, including salaried employees, self-employed individuals, and NRIs. Unlike PPF or EPF, which offer fixed, government-set interest rates, NPS is market-linked — your contributions are invested across a mix of equity, corporate bonds, and government securities based on the allocation you choose, meaning your final corpus depends on actual market performance over your investment horizon.

NPS operates through two account types: Tier I is the primary retirement account with the tax benefits and withdrawal restrictions described below, while Tier II is a voluntary, flexible savings account with no lock-in but no dedicated tax benefits (Tier II is often described as similar to a regular mutual fund investment account, just under the NPS structure). Almost all discussion of "NPS" for retirement planning refers to Tier I.

The tax treatment of NPS is genuinely compelling and a key reason it's recommended alongside — not instead of — other retirement instruments. Contributions up to ₹1.5 lakh qualify under the overall Section 80C umbrella, but NPS additionally offers an exclusive extra deduction of up to ₹50,000 under Section 80CCD(1B), over and above the 80C limit — meaning a taxpayer in the 30% bracket can save an additional ₹15,000 in tax purely by contributing ₹50,000 more to NPS, a benefit unavailable through PPF, ELSS, or any other 80C instrument alone.

At retirement (age 60, though partial withdrawal is possible from age 60 with some conditions, or earlier under specific circumstances), NPS rules require that at least 40% of the accumulated corpus be used to purchase an annuity from an IRDAI-registered insurance company — this annuity then pays you a regular pension for life. The remaining 60% can be withdrawn as a lumpsum, and this lumpsum portion is completely tax-free. The annuity income you receive, however, is taxed as regular income in the year you receive it, at your applicable slab rate — a detail that surprises many first-time NPS investors.

NPS offers investors a choice between "Active Choice," where you manually decide your allocation across four asset classes — Equity (E), Corporate Bonds (C), Government Securities (G), and Alternative Investment Funds (A, capped at 5%) — and "Auto Choice" (Lifecycle Fund), where the equity allocation automatically reduces as you approach retirement age, following a pre-set glide path similar to how target-date retirement funds work globally. Equity allocation in NPS is capped at 75% for those below 50 (reducing to lower caps as age increases under most lifecycle options), which limits both the upside and downside compared to an unrestricted equity mutual fund SIP.

Because roughly 40–60% of your NPS corpus is effectively locked into an annuity at retirement (which typically offers modest returns of 5–7% and is fully taxable), and fund management charges plus the mandatory annuitization reduce overall flexibility compared to a pure equity SIP, most financial planners recommend NPS as a valuable, tax-efficient supplement to — rather than a replacement for — an equity mutual fund SIP and other retirement savings vehicles.`,
    formula: {
      title: 'NPS Corpus Formula',
      expression: 'Corpus = SIP-FV(Employee + Employer Contribution, r, n) → 60% Lumpsum + 40% Annuity',
      variables: [
        { symbol: 'Corpus', meaning: 'Total accumulated NPS Tier I balance at retirement' },
        { symbol: 'r', meaning: 'Expected weighted annual return based on your E/C/G allocation' },
        { symbol: 'n', meaning: 'Number of years until retirement (age 60)' },
      ],
    },
    example: {
      title: 'Example: ₹10,000/month NPS contribution for 25 years at 10% p.a.',
      steps: [
        'Monthly contribution = ₹10,000 (employee only, no employer match assumed)',
        'Expected blended annual return = 10% (based on a moderate equity/debt mix)',
        'Investment horizon = 25 years until retirement',
        'Total corpus is computed using the SIP future value formula',
      ],
      result:
        'Estimated corpus ≈ ₹1.33 Crore. Of this, ~₹79.8 Lakh (60%) is available as a tax-free lumpsum, and ~₹53.2 Lakh (40%) must be annuitized to provide a monthly pension.',
    },
    benefits: [
      'Exclusive extra tax deduction of ₹50,000 under Section 80CCD(1B), over and above the ₹1.5 lakh 80C limit',
      'Market-linked growth potential typically higher than fixed-return retirement instruments',
      '60% of the maturity corpus can be withdrawn completely tax-free as a lumpsum',
      'Extremely low fund management charges compared to most mutual funds',
      'Portable across jobs, sectors, and even from government to private employment',
      'Choice of Active or Auto (Lifecycle) allocation to match your risk appetite and age',
    ],
    faqs: [
      {
        question: 'What is the extra NPS tax benefit under Section 80CCD(1B)?',
        answer:
          'Beyond the standard ₹1.5 lakh Section 80C deduction (shared across PPF, ELSS, insurance, etc.), NPS offers an exclusive additional deduction of up to ₹50,000 under Section 80CCD(1B), available only to NPS contributors — this can save a 30%-slab taxpayer up to ₹15,000 extra in tax per year.',
      },
      {
        question: 'Can I withdraw my entire NPS corpus at retirement?',
        answer:
          'No. NPS regulations require a minimum of 40% of your accumulated corpus to be used to purchase an annuity that provides a regular pension. The remaining 60% (or more, if you choose to annuitize a larger share) can be withdrawn as a tax-free lumpsum.',
      },
      {
        question: 'Is the NPS annuity (pension) taxable?',
        answer:
          'Yes. While the 60% lumpsum withdrawal is tax-free, the regular pension income you subsequently receive from the annuity is taxed as normal income in the year you receive it, at your applicable income tax slab rate.',
      },
      {
        question: 'What is the difference between NPS Tier I and Tier II?',
        answer:
          'Tier I is the primary retirement account with tax benefits, mandatory annuitization, and withdrawal restrictions until retirement. Tier II is a voluntary, flexible add-on account with no lock-in and no dedicated tax benefit — you can withdraw anytime, making it function more like a regular investment account.',
      },
      {
        question: 'What is the maximum equity allocation allowed in NPS?',
        answer:
          'Under Active Choice, equity allocation is capped at 75% for subscribers below 50 years of age, gradually reducing after age 50. Under Auto Choice (Lifecycle Fund), the equity percentage automatically reduces as you age, following a pre-set glide path toward safer assets as retirement approaches.',
      },
    ],
    fields: [
      { id: 'monthly', label: 'Monthly Contribution', unit: '₹', min: 500, max: 100000, step: 500, defaultValue: 10000 },
      { id: 'rate', label: 'Expected Return (p.a.)', unit: '%', min: 6, max: 14, step: 0.5, defaultValue: 10 },
      { id: 'years', label: 'Years to Retirement', unit: 'years', min: 1, max: 40, step: 1, defaultValue: 25 },
    ],
    compute: (v) => {
      const { corpus, lumpsum, annuityCorpus } = npsCorpus(v.monthly, 0, v.rate, v.years);
      return {
        headline: { label: 'Projected Corpus', value: formatINR(corpus) },
        items: [
          { label: 'Tax-Free Lumpsum (60%)', value: formatINR(lumpsum) },
          { label: 'Annuity Corpus (40%)', value: formatINR(annuityCorpus) },
        ],
      };
    },
    relatedSlugs: ['ppf-calculator', 'sip-calculator', 'inflation-calculator'],
  },

  // ============================================================
  // CAGR CALCULATOR
  // ============================================================
  {
    slug: 'cagr-calculator',
    id: 'cagr',
    name: 'CAGR Calculator',
    shortName: 'CAGR',
    category: 'investment',
    metaTitle: 'CAGR Calculator — Compound Annual Growth Rate Calculator (2026)',
    metaDescription:
      'Free CAGR calculator to find the compound annual growth rate of any investment. Compare mutual funds, stocks, and business performance accurately.',
    keywords: [
      'cagr calculator',
      'compound annual growth rate calculator',
      'cagr formula calculator',
      'mutual fund cagr calculator',
      'investment growth rate calculator',
    ],
    h1: 'CAGR Calculator — Calculate Compound Annual Growth Rate',
    introParagraph:
      'CAGR (Compound Annual Growth Rate) is the single most reliable way to measure and compare investment performance over multiple years, smoothing out year-to-year volatility into one annualized number.',
    explanation: `CAGR, or Compound Annual Growth Rate, answers a deceptively simple question: "If my investment had grown at a single, steady annual rate every year — instead of the actual bumpy, up-and-down path it took — what would that steady rate have been?" It is the standard metric used across the Indian and global investment industry to report and compare mutual fund performance, stock returns, business revenue growth, and virtually any value that changes over multiple years, precisely because it removes the noise of year-to-year volatility and gives you one clean, comparable number.

This is critically different from a simple "absolute return" calculation, which just tells you the total percentage gain over the entire period without accounting for how long it took. An investment that doubled in 3 years and one that doubled in 10 years both have a 100% absolute return, but they represent very different quality of performance — the CAGR calculation reveals this clearly: doubling in 3 years is roughly a 26% CAGR, an exceptional result, while doubling in 10 years is roughly a 7.2% CAGR, a much more modest (though still respectable) outcome. This is why financial news, mutual fund fact sheets, and stock research reports almost universally quote CAGR rather than absolute or simple average returns when comparing performance across different time periods.

CAGR is a "smoothed" figure, not a literal description of what happened in any individual year. A mutual fund with a 5-year CAGR of 12% almost certainly did not return exactly 12% in each of those 5 years — it might have returned +35% in one strong year, -15% in a weak year, and various other figures, with the CAGR representing the single steady rate that would have produced the same starting-to-ending value. This is precisely why CAGR is so useful for comparison purposes (it removes the "noise" of volatility) but should not be mistaken for a guarantee of what any single future year will look like.

CAGR has countless practical uses beyond mutual fund fact sheets: comparing the historical performance of two or more stocks or mutual funds over the same holding period, measuring how fast a company's revenue or profit has grown year over year, tracking the appreciation rate of real estate or gold over a holding period, or simply understanding what annual growth rate your own portfolio has actually delivered since you started investing (rather than relying on your gut feeling, which is often unreliable). Many investors calculate their portfolio's overall CAGR annually as a health check against a relevant benchmark — for equity mutual funds, that benchmark is typically the Nifty 50 or Sensex CAGR over the same period.

One limitation worth knowing: CAGR treats the beginning and ending value as the only two data points that matter, ignoring any intermediate cash flows (like additional investments or partial withdrawals along the way). If you've made multiple contributions over time — as with a SIP — CAGR is not the right metric; instead, you should use XIRR (Extended Internal Rate of Return), which properly accounts for the timing and size of each individual cash flow. CAGR is best reserved for a single lumpsum invested at one point in time and measured at one later point in time.`,
    formula: {
      title: 'CAGR Formula',
      expression: 'CAGR = [(Final Value / Initial Value)^(1/n) − 1] × 100',
      variables: [
        { symbol: 'CAGR', meaning: 'Compound Annual Growth Rate, expressed as a percentage' },
        { symbol: 'Final Value', meaning: 'Value of the investment at the end of the period' },
        { symbol: 'Initial Value', meaning: 'Value of the investment at the start of the period' },
        { symbol: 'n', meaning: 'Number of years between the initial and final value' },
      ],
    },
    example: {
      title: 'Example: ₹1,00,000 grew to ₹2,50,000 over 6 years',
      steps: [
        'Initial Value = ₹1,00,000',
        'Final Value = ₹2,50,000',
        'Number of years (n) = 6',
        'CAGR = [(2,50,000 / 1,00,000)^(1/6) − 1] × 100 = [(2.5)^0.1667 − 1] × 100',
      ],
      result: 'CAGR ≈ 16.53% per annum — meaning the investment grew as if it compounded steadily at 16.53% every year.',
    },
    benefits: [
      'Removes year-to-year volatility to give one clean, comparable growth figure',
      'Industry-standard metric for comparing mutual funds, stocks, and other assets fairly',
      'Reveals the true quality of returns better than simple absolute/total return figures',
      'Useful for tracking business revenue, profit, or any metric that compounds over years',
      'Helps set realistic expectations for how an investment might behave over the long run',
      'Simple to calculate with just three inputs: starting value, ending value, and time period',
    ],
    faqs: [
      {
        question: 'What is a good CAGR for mutual fund investments in India?',
        answer:
          'Historically, well-diversified equity mutual funds in India have delivered a long-term (10+ year) CAGR in the range of 10–14%, though this varies by fund category and time period and is never guaranteed. Debt funds and FDs typically deliver 6–8% CAGR with much lower volatility.',
      },
      {
        question: 'What is the difference between CAGR and absolute return?',
        answer:
          'Absolute return is the total percentage gain over the entire period, regardless of how long it took. CAGR annualizes that growth into a single yearly rate, making it possible to fairly compare investments held for different lengths of time.',
      },
      {
        question: 'Can CAGR be used for SIP investments?',
        answer:
          'Not accurately. CAGR assumes a single lumpsum invested at the start and measured at the end. For SIPs, where you invest at different points in time, XIRR (Extended Internal Rate of Return) is the correct metric, as it properly accounts for the timing and amount of each individual investment.',
      },
      {
        question: 'Can CAGR be negative?',
        answer:
          'Yes. If the final value is lower than the initial value, CAGR will be a negative percentage, correctly reflecting that the investment lost value on an annualized basis over the period measured.',
      },
      {
        question: 'How is CAGR different from average annual return?',
        answer:
          'A simple average annual return just adds up each year\'s percentage return and divides by the number of years, which can overstate true growth because it ignores compounding. CAGR correctly accounts for compounding and reflects the actual growth path from start to end value.',
      },
    ],
    fields: [
      { id: 'initial', label: 'Initial Value', unit: '₹', min: 1000, max: 100000000, step: 1000, defaultValue: 100000 },
      { id: 'final', label: 'Final Value', unit: '₹', min: 1000, max: 200000000, step: 1000, defaultValue: 250000 },
      { id: 'years', label: 'Number of Years', unit: 'years', min: 1, max: 40, step: 1, defaultValue: 6 },
    ],
    compute: (v) => {
      const rate = cagr(v.initial, v.final, v.years);
      return {
        headline: { label: 'CAGR', value: `${rate.toFixed(2)}%` },
        items: [
          { label: 'Absolute Growth', value: `${(((v.final - v.initial) / v.initial) * 100).toFixed(1)}%` },
          { label: 'Total Gain', value: formatINR(v.final - v.initial) },
        ],
      };
    },
    relatedSlugs: ['sip-calculator', 'inflation-calculator', 'swp-calculator'],
  },

  // ============================================================
  // INFLATION CALCULATOR
  // ============================================================
  {
    slug: 'inflation-calculator',
    id: 'inflation',
    name: 'Inflation Calculator',
    shortName: 'Inflation',
    category: 'planning',
    metaTitle: 'Inflation Calculator — Future Value & Purchasing Power Calculator (2026)',
    metaDescription:
      'Free inflation calculator to see how much today\'s money will be worth in the future, or what a future goal will cost after inflation, in Indian Rupees.',
    keywords: [
      'inflation calculator',
      'inflation calculator india',
      'future value calculator',
      'purchasing power calculator',
      'cost of living calculator india',
    ],
    h1: 'Inflation Calculator — See the Future Cost of Today\'s Money',
    introParagraph:
      'Inflation quietly erodes the purchasing power of your money every year. This inflation calculator shows you exactly what today\'s expenses or savings goals will cost in the future, so you can plan realistically.',
    explanation: `Inflation is the gradual, persistent rise in the general price level of goods and services over time, which means the same amount of rupees buys progressively less as years pass. In India, retail inflation (measured by the Consumer Price Index, or CPI) has historically averaged somewhere in the 5–7% range over long periods, though it fluctuates year to year based on food prices, fuel costs, global commodity trends, and monetary policy set by the Reserve Bank of India, which currently targets keeping CPI inflation within a band of 2–6%, with 4% as the medium-term goal.

The single most important, and most commonly underestimated, implication of inflation for personal finance is this: any long-term financial goal you're planning for — your child's college education 15 years from now, your own retirement 25 years from now, or even a family wedding 5 years out — will cost meaningfully more in the future than it does today, simply because prices rise every year in the interim. A financial plan built using today's cost figures without adjusting for inflation will fall dramatically short when the goal actually arrives, which is why every serious retirement or goal-based financial calculator must incorporate an inflation assumption.

Consider a concrete illustration: if a year of engineering college costs ₹3,00,000 today, and education inflation runs at a historically realistic 8–10% per year (education costs in India have consistently outpaced general CPI inflation), that same year of college could cost ₹9,00,000–₹12,00,000 or more by the time a child born today is ready for college 18 years from now. Parents who save based on today's ₹3,00,000 figure, without projecting it forward, will find themselves significantly short when the bill actually arrives.

This calculator works in two directions, both useful for financial planning. First, it can tell you the future cost of a current expense or goal — enter today's amount, an assumed inflation rate, and the number of years, and it shows what that same expense will cost in the future. Second, thinking about it in reverse, the same formula tells you the real (inflation-adjusted) purchasing power of a future sum of money in today's terms — useful for understanding, for example, that ₹1 crore received 20 years from now will not have anywhere near the same purchasing power as ₹1 crore today.

Inflation is also the reason financial planners emphasize the difference between "nominal" returns (the raw percentage your investment grew) and "real" returns (that growth rate minus inflation, reflecting your actual increase in purchasing power). A Fixed Deposit earning 7% in a year when inflation runs at 6% has delivered a real return of only about 1% — and once you factor in tax on that FD interest, the real, after-tax return can turn negative in some years. This is a core reason financial advisors recommend a meaningful allocation to equity or equity mutual funds for long-term goals: historically, equities have been one of the few asset classes capable of consistently outpacing inflation by a wide enough margin to genuinely grow purchasing power over decades, despite their higher short-term volatility.

When setting your own inflation assumption for a specific goal, it's worth being category-specific rather than defaulting to the general CPI figure: general living expenses might reasonably use 5–6%, education costs have historically run higher at 8–10%, medical/healthcare inflation in India has often exceeded 10–12% in recent years, and real estate or gold price appreciation has its own distinct historical pattern separate from consumer inflation.`,
    formula: {
      title: 'Future Value Formula (Inflation-Adjusted)',
      expression: 'FV = PV × (1 + i)^n',
      variables: [
        { symbol: 'FV', meaning: 'Future value — what the amount will cost/be worth after inflation' },
        { symbol: 'PV', meaning: 'Present value — today\'s cost or amount' },
        { symbol: 'i', meaning: 'Assumed annual inflation rate (as a decimal)' },
        { symbol: 'n', meaning: 'Number of years into the future' },
      ],
    },
    example: {
      title: 'Example: ₹50,000/month household expense today, 20 years from now, at 6% inflation',
      steps: [
        'Present value (PV) = ₹50,000 (monthly household expenses today)',
        'Assumed annual inflation rate (i) = 6% = 0.06',
        'Time horizon (n) = 20 years',
        'FV = 50,000 × (1.06)^20',
      ],
      result: 'Future monthly expense ≈ ₹1,60,357 — meaning you would need over 3x today\'s income just to maintain the same standard of living 20 years from now.',
    },
    benefits: [
      'Reveals the true future cost of long-term goals like education, weddings, or retirement',
      'Helps you avoid dangerously underestimating how much you need to save',
      'Clarifies the difference between nominal returns and real, inflation-adjusted returns',
      'Supports more realistic retirement corpus planning based on future, not current, expenses',
      'Useful for comparing investment options on a like-for-like, purchasing-power basis',
      'Encourages allocating a meaningful share of long-term savings to growth assets that can outpace inflation',
    ],
    faqs: [
      {
        question: 'What inflation rate should I use for retirement planning?',
        answer:
          'A commonly used long-term planning assumption for general living expenses in India is 6% per annum, based on historical CPI trends, though many planners now suggest 6-7% to be conservative. For specific categories like healthcare or education, higher rates (8-12%) are more realistic given their historical trend of outpacing general inflation.',
      },
      {
        question: 'What is the difference between nominal and real returns?',
        answer:
          'Nominal return is the raw percentage growth of your investment as reported. Real return is that nominal return minus the inflation rate during the same period, reflecting your actual increase in purchasing power. A 7% FD return during a year with 6% inflation delivers a real return of roughly only 1%.',
      },
      {
        question: 'Why does education cost inflation run higher than general inflation in India?',
        answer:
          'Education costs in India have historically risen faster than general CPI inflation due to rising demand for quality education, increasing infrastructure and faculty costs, and limited seats at top institutions relative to demand — many planners use 8-10% as a realistic education-specific inflation assumption rather than the general 5-6% figure.',
      },
      {
        question: 'How does inflation affect my retirement corpus requirement?',
        answer:
          'Inflation means your monthly expenses in retirement will be significantly higher in rupee terms than your expenses today, simply because prices keep rising every year until and throughout your retirement. A retirement corpus calculation must inflate today\'s expenses forward to your retirement date, and often account for continuing inflation throughout the retirement period itself.',
      },
      {
        question: 'Can any investment fully protect against inflation?',
        answer:
          'No investment guarantees protection against inflation, but historically, equity and equity mutual funds have been among the more reliable long-term asset classes for outpacing inflation over 10+ year periods, despite higher short-term volatility. Real estate and gold have also historically kept pace with or exceeded inflation over long holding periods, though with their own distinct risks and illiquidity.',
      },
    ],
    fields: [
      { id: 'amount', label: 'Current Amount', unit: '₹', min: 1000, max: 10000000, step: 1000, defaultValue: 50000 },
      { id: 'rate', label: 'Inflation Rate (p.a.)', unit: '%', min: 1, max: 15, step: 0.5, defaultValue: 6 },
      { id: 'years', label: 'Number of Years', unit: 'years', min: 1, max: 40, step: 1, defaultValue: 20 },
    ],
    compute: (v) => {
      const future = inflationAdjustedValue(v.amount, v.rate, v.years);
      return {
        headline: { label: 'Future Value', value: formatINR(future) },
        items: [
          { label: 'Purchasing Power Needed', value: formatINR(future - v.amount) },
          { label: 'Multiplier', value: `${(future / v.amount).toFixed(2)}x` },
        ],
      };
    },
    relatedSlugs: ['sip-calculator', 'cagr-calculator', 'nps-calculator'],
  },

  // ============================================================
  // SWP CALCULATOR
  // ============================================================
  {
    slug: 'swp-calculator',
    id: 'swp',
    name: 'SWP Calculator',
    shortName: 'SWP',
    category: 'retirement',
    metaTitle: 'SWP Calculator — Systematic Withdrawal Plan Calculator (2026)',
    metaDescription:
      'Free SWP calculator to check how long your mutual fund corpus will last with regular monthly withdrawals, ideal for retirement income planning.',
    keywords: [
      'swp calculator',
      'systematic withdrawal plan calculator',
      'swp mutual fund calculator',
      'retirement income calculator',
      'monthly withdrawal calculator',
    ],
    h1: 'SWP Calculator — Plan Your Systematic Withdrawal Plan',
    introParagraph:
      'A Systematic Withdrawal Plan (SWP) lets you withdraw a fixed amount from your mutual fund investment every month, while the remainder stays invested and continues to grow — ideal for generating regular income in retirement.',
    explanation: `A Systematic Withdrawal Plan, or SWP, is essentially a SIP in reverse: instead of investing a fixed amount every month into a mutual fund, you withdraw a fixed amount every month from an existing mutual fund investment, while the remaining balance stays invested and continues to earn returns. This makes SWP one of the most popular and tax-efficient ways for retirees — and anyone else who needs a regular income stream from a lumpsum corpus — to convert accumulated savings into a steady monthly "paycheck" without having to sell the entire investment at once.

The core mechanics work like this: you first invest a lumpsum (or the accumulated proceeds of a maturing SIP) into a mutual fund scheme, and then set up an SWP instruction specifying a fixed rupee amount to be redeemed and credited to your bank account every month. Each monthly withdrawal reduces your unit holding in the fund, but as long as the fund's growth rate exceeds your withdrawal rate, your remaining corpus can actually continue to grow even while you draw a regular income from it — this is the central appeal of SWP over simply holding cash or a lower-yielding instrument and drawing it down.

The sustainability of an SWP hinges entirely on the relationship between your withdrawal rate and your fund's actual rate of return. If you withdraw less than the fund earns annually, your corpus can theoretically last indefinitely, growing even as you draw income from it. If you withdraw more than the fund earns, your corpus will eventually deplete to zero — the only question is how many months or years that will take, which is exactly what this calculator estimates for you. A widely cited (though not universally agreed upon) rule of thumb for retirement withdrawal sustainability is the "4% rule" — withdrawing roughly 4% of your corpus annually is historically considered a sustainable long-term rate for a mixed equity-debt portfolio, though many Indian planners suggest being more conservative given India's typically higher inflation compared to developed markets.

SWP has a distinct tax advantage over comparable fixed-income alternatives like FD interest income or an annuity from NPS. Each SWP withdrawal is treated, for tax purposes, as a partial redemption of mutual fund units — meaning only the capital gains portion of each withdrawal is taxed (at 12.5% LTCG for equity funds held over 12 months, or per applicable slab/rates for debt funds), while the return of your original principal is not taxed at all. This is meaningfully different from FD interest, where 100% of the interest earned is taxed at your full income slab rate, or an NPS annuity, where the entire pension payout is taxed as regular income — making SWP a comparatively tax-efficient income stream for many retirees.

SWP is commonly used to fund retirement income after a person stops earning a salary, to supplement a smaller pension or NPS annuity, to fund a specific multi-year goal like a child's education fees paid out over several years, or even by younger investors seeking a form of "self-created dividend" from an equity portfolio without the unpredictability of actual mutual fund dividend payouts (which are also taxable as regular income, unlike the more tax-efficient SWP structure).

It's important to choose the underlying mutual fund category carefully based on how conservative you need to be — a retiree relying entirely on SWP income for living expenses should typically choose a more conservative, lower-volatility fund (like a conservative hybrid or balanced advantage fund) rather than a pure equity fund, since withdrawing a fixed rupee amount during a market downturn means selling more units at depressed prices, which can permanently damage the corpus's ability to recover — a risk known as "sequence of returns risk" that is one of the most important, and least understood, considerations in retirement income planning.`,
    formula: {
      title: 'SWP Corpus Longevity Formula',
      expression: 'n = ln[ W / (W − C×r) ] / ln(1 + r)',
      variables: [
        { symbol: 'n', meaning: 'Number of months the corpus will last' },
        { symbol: 'W', meaning: 'Fixed monthly withdrawal amount' },
        { symbol: 'C', meaning: 'Starting corpus (lumpsum invested)' },
        { symbol: 'r', meaning: 'Expected monthly rate of return (annual rate ÷ 12)' },
      ],
    },
    example: {
      title: 'Example: ₹50,00,000 corpus, ₹40,000/month withdrawal, at 8% p.a.',
      steps: [
        'Starting corpus (C) = ₹50,00,000',
        'Monthly withdrawal (W) = ₹40,000',
        'Expected annual return = 8% → monthly rate r = 8%/12 = 0.667%',
        'Since W (₹40,000) is close to but below the monthly return on the corpus (₹50,00,000 × 0.667% ≈ ₹33,350), the corpus depletes slowly',
      ],
      result: 'The corpus lasts approximately 22+ years of monthly withdrawals before being fully depleted, assuming the 8% return holds steady throughout.',
    },
    benefits: [
      'Provides a regular, predictable monthly income stream from a lumpsum investment',
      'Only the capital gains portion of each withdrawal is taxed, not the full amount',
      'Remaining corpus stays invested and can continue growing if withdrawal rate is sustainable',
      'Far more flexible than an annuity — you can change or stop the withdrawal amount anytime',
      'Ideal structure for retirement income, education fee payouts, or any long-term drawdown need',
      'Full control over the underlying fund and asset allocation, unlike a fixed annuity product',
    ],
    faqs: [
      {
        question: 'How much can I safely withdraw from my SWP corpus every month?',
        answer:
          'A widely referenced starting point is the "4% rule" — withdrawing about 4% of your corpus annually (roughly 0.33% monthly) is historically considered sustainable for a balanced portfolio over a 25-30 year retirement, though many Indian planners suggest being more conservative (3-3.5%) given India\'s historically higher inflation.',
      },
      {
        question: 'Is SWP income taxable?',
        answer:
          'Each SWP withdrawal is treated as a partial redemption of mutual fund units. Only the capital gains portion of each withdrawal is taxed — at 12.5% LTCG for equity funds held over 12 months (above ₹1.25 lakh exemption per year) or applicable rates for debt funds — while the principal portion of the withdrawal is not taxed.',
      },
      {
        question: 'What happens if I withdraw more than my fund earns?',
        answer:
          'Your corpus will gradually deplete over time, since you are drawing down principal faster than it is being replenished by returns. This calculator estimates exactly how many months your specific corpus will last given your withdrawal amount and expected return.',
      },
      {
        question: 'Which type of mutual fund is best for SWP?',
        answer:
          'For retirees relying on SWP for essential living expenses, a more conservative fund category — such as a conservative hybrid fund or balanced advantage fund — is generally safer than a pure equity fund, since it reduces the risk of having to sell units at depressed prices during a market downturn ("sequence of returns risk").',
      },
      {
        question: 'Can I change my SWP withdrawal amount later?',
        answer:
          'Yes, most fund houses allow you to modify, pause, or stop an SWP instruction at any time, offering far more flexibility than a fixed annuity product, which typically cannot be altered once purchased.',
      },
    ],
    fields: [
      { id: 'corpus', label: 'Starting Corpus', unit: '₹', min: 100000, max: 50000000, step: 100000, defaultValue: 5000000 },
      { id: 'withdrawal', label: 'Monthly Withdrawal', unit: '₹', min: 1000, max: 500000, step: 1000, defaultValue: 40000 },
      { id: 'rate', label: 'Expected Return (p.a.)', unit: '%', min: 1, max: 20, step: 0.5, defaultValue: 8 },
    ],
    compute: (v) => {
      const months = swpLongevityMonths(v.corpus, v.withdrawal, v.rate);
      const years = isFinite(months) ? (months / 12).toFixed(1) : '∞';
      return {
        headline: { label: 'Corpus Lasts For', value: isFinite(months) ? `${months} months (${years} yrs)` : 'Indefinitely' },
        items: [
          { label: 'Monthly Withdrawal', value: formatINR(v.withdrawal) },
          {
            label: 'Total Withdrawn',
            value: isFinite(months) ? formatINR(v.withdrawal * months) : '∞',
          },
        ],
      };
    },
    relatedSlugs: ['sip-calculator', 'nps-calculator', 'inflation-calculator'],
  },
];

export function getCalculatorBySlug(slug: string): CalculatorConfig | undefined {
  return CALCULATORS.find((c) => c.slug === slug);
}

export function getCalculatorsByCategory(category: string): CalculatorConfig[] {
  return CALCULATORS.filter((c) => c.category === category);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(CALCULATORS.map((c) => c.category)));
}

export function getRelatedCalculators(calc: CalculatorConfig): CalculatorConfig[] {
  return calc.relatedSlugs
    .map((slug) => getCalculatorBySlug(slug))
    .filter((c): c is CalculatorConfig => Boolean(c));
}
