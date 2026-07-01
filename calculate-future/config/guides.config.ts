/**
 * ============================================================
 * SINGLE SOURCE OF TRUTH FOR EVERY GUIDE/ARTICLE ON THE SITE.
 * ============================================================
 * Add a new guide by appending one object to GUIDES below.
 * This automatically creates /guides/{slug}, adds it to the
 * sitemap, and lists it on /guides and any calculator page that
 * references it via relatedGuideSlugs.
 * ============================================================
 */

import type { GuideConfig } from '@/lib/types';

export const GUIDES: GuideConfig[] = [
  {
    slug: 'what-is-sip',
    title: 'What is SIP? A Complete Beginner\'s Guide',
    metaTitle: 'What is SIP? Complete Beginner\'s Guide to Systematic Investment Plans',
    metaDescription:
      'Learn what a SIP is, how it works, why it\'s popular in India, and how to start your first Systematic Investment Plan — explained simply for beginners.',
    keywords: ['what is sip', 'sip meaning', 'sip for beginners', 'how does sip work', 'sip investment guide'],
    publishedAt: '2025-01-10',
    updatedAt: '2026-06-01',
    readingTimeMinutes: 8,
    category: 'investment',
    content: `If you've spent any time around Indian personal finance content, you've almost certainly come across the term SIP. It stands for Systematic Investment Plan, and it is, without exaggeration, the most widely recommended way for ordinary Indians to start investing in mutual funds. But what does it actually mean, and why does nearly every financial advisor push it so hard?

At its simplest, a SIP is an instruction you give to a mutual fund — through an app, a broker, or directly with the fund house — to automatically invest a fixed amount of money in a specific mutual fund scheme on a fixed date every month. Instead of trying to save up ₹1,20,000 and investing it all at once, you invest ₹10,000 every month for 12 months. The mutual fund allots you units based on that day's Net Asset Value (NAV), and over time you accumulate more and more units.

Why does this matter so much? Two reasons: rupee-cost averaging and compounding.

Rupee-cost averaging means you buy more units when prices are low and fewer units when prices are high, since your investment amount stays fixed while the price per unit (NAV) fluctuates. Over the long run, this averages out your purchase price and removes the almost impossible task of trying to "time the market" — buying only at the lowest points, which even professional fund managers routinely fail to do consistently.

Compounding means the returns your money earns also start earning returns. In the early years, a SIP's growth chart looks nearly flat because your returns are small in absolute terms. But given enough years, the curve bends sharply upward, because you're now earning returns not just on your original contributions but on all the accumulated growth too. This is why starting early matters so much more than starting with a large amount — a 25-year-old with a modest SIP will often out-accumulate a 35-year-old with a much larger one, purely due to that extra decade of compounding.

How do you actually start a SIP? First, you need a KYC-compliant investment account, which today can be opened in minutes through apps like Groww, Zerodha Coin, Kuvera, Paytm Money, or directly through an AMC's own app or website — all requiring your PAN, Aadhaar, and a bank account for the auto-debit mandate. Second, you choose a mutual fund scheme appropriate to your goal and risk appetite: a large-cap or index fund for relatively lower volatility, a mid/small-cap fund for higher growth potential with higher risk, or a hybrid fund that blends equity and debt. Third, you set your monthly amount and the date you want it debited, and the SIP runs automatically from there — you don't need to do anything month to month unless you want to pause, increase, or stop it.

A common early mistake is choosing too many funds at once, chasing whatever topped last year's "best returns" list, or stopping a SIP the moment markets fall — precisely the opposite of what makes SIPs work. The entire point of a SIP is to keep investing steadily through market ups and downs over a long horizon (typically 5+ years, ideally 10+ for equity funds), letting rupee-cost averaging and compounding do their work quietly in the background.

Is SIP risk-free? No — if you invest in equity mutual funds through a SIP, your money is still subject to market risk, and the value of your investment will fluctuate with the market. What SIP does is manage the timing risk of investing, not the underlying market risk of the asset class itself. For genuinely risk-free, guaranteed returns, instruments like PPF or FDs are more appropriate, though they typically offer lower long-term growth potential than equity mutual funds.

If you're just getting started, the honest advice is this: pick an amount you can comfortably sustain every month without straining your budget, choose a well-diversified fund (a large-cap or flexi-cap fund, or a simple Nifty 50 index fund, are common beginner-friendly starting points), and commit to leaving it running for at least 5-7 years before judging the results. Use a SIP calculator to set realistic expectations for your specific amount, expected return assumption, and time horizon — and remember that the number it shows is an estimate based on your assumed rate, not a guarantee.`,
    faqs: [
      {
        question: 'What is the minimum amount to start a SIP?',
        answer: 'Most Indian mutual funds allow you to start a SIP with as little as ₹100 to ₹500 per month, making it accessible to nearly anyone regardless of income level.',
      },
      {
        question: 'Can I have multiple SIPs running at the same time?',
        answer: 'Yes, you can run as many SIPs as you like across different mutual fund schemes, though it\'s generally better to keep your portfolio focused on a handful of well-chosen funds rather than spreading too thin across many overlapping schemes.',
      },
      {
        question: 'What happens if I miss a SIP installment?',
        answer: 'If there are insufficient funds in your bank account on the debit date, the SIP installment for that month simply fails — your existing units are unaffected, and the SIP continues automatically the following month. Most fund houses don\'t charge a penalty, though your bank may charge a bounced auto-debit fee.',
      },
    ],
    relatedCalculatorSlugs: ['sip-calculator', 'cagr-calculator'],
    relatedGuideSlugs: ['sip-vs-fd', 'how-to-calculate-cagr'],
  },

  {
    slug: 'sip-vs-fd',
    title: 'SIP vs FD: Which is Better for You in 2026?',
    metaTitle: 'SIP vs FD: Which is Better for Your Money in 2026?',
    metaDescription:
      'A detailed, honest comparison of SIP (mutual funds) vs Fixed Deposits on returns, risk, taxation, and liquidity to help you decide which suits your goals.',
    keywords: ['sip vs fd', 'sip or fd better', 'mutual fund vs fixed deposit', 'fd vs sip returns', 'safe investment vs sip'],
    publishedAt: '2025-02-14',
    updatedAt: '2026-06-01',
    readingTimeMinutes: 9,
    category: 'investment',
    content: `"Should I do a SIP or just put my money in an FD?" is one of the most common questions asked by first-time Indian investors, and the honest answer is: it depends on your goal, your time horizon, and your tolerance for risk — not one single universally "better" answer. Let's break down the real differences.

Returns: Historically, well-diversified equity mutual fund SIPs have delivered 10-14% CAGR over long (10+ year) periods, while Fixed Deposits typically offer 6-7.5% per annum, guaranteed. On paper, SIP/equity wins by a wide margin over long horizons — but that higher return comes with genuine, sometimes significant, short-term volatility. An FD's return is locked in and guaranteed the day you open it; a SIP's actual realized return depends entirely on market performance during your specific holding period, which could be higher or lower than historical averages.

Risk: This is the crux of the decision. FDs carry essentially zero market risk — your principal and promised interest are protected (and DICGC-insured up to ₹5 lakh per bank), regardless of what happens in the stock market. A SIP in equity mutual funds carries real market risk: your investment's value will rise and fall with the market, and there is no guarantee you won't see negative returns over shorter periods (even multi-year periods, in unusual market cycles). If you need your money back on a specific date with certainty — say, a house down payment due in 18 months — an FD (or another low-risk instrument) is the appropriate choice, not equity SIP.

Liquidity: FDs can generally be broken prematurely with a modest interest penalty. Open-ended mutual fund SIPs can usually be redeemed within a few business days with no exit load after the applicable period (often 1 year for equity funds), though the redeemed amount depends on the prevailing NAV, which could be lower than your investment if markets have fallen.

Taxation: FD interest is fully taxed at your income tax slab rate every year it's earned (whether or not you withdraw it), which can be a meaningful drag for those in higher tax brackets. Equity mutual fund gains are taxed more favorably: units held over 12 months qualify for Long-Term Capital Gains (LTCG) tax of just 12.5% on gains above a ₹1.25 lakh exemption per financial year, while units held under 12 months attract a flat 20% Short-Term Capital Gains (STCG) tax. For someone in the 30% tax bracket, this difference in taxation meaningfully favors equity mutual funds held long-term, on top of their typically higher pre-tax returns.

Purpose and time horizon: The honest, balanced answer most financial planners give is that FD and SIP serve different jobs in your financial plan, and a good plan typically uses both. FDs (and similar instruments like RD, PPF) are ideal for your emergency fund, short-term goals (under 3 years), and the "safety" portion of your portfolio where capital protection matters more than growth. SIPs in equity mutual funds are better suited to long-term goals (5+ years, ideally 10+) — retirement, a child's higher education, or long-term wealth building — where you can ride out short-term volatility in exchange for meaningfully higher expected long-term growth.

A practical framework many planners recommend: keep 3-6 months of expenses in an FD or liquid fund as an emergency buffer, use FDs/RDs for goals less than 3 years away, and direct your long-term savings (10+ years) primarily into equity mutual fund SIPs, with the exact allocation between equity and debt depending on your personal risk tolerance and how close you are to needing the money.

Ultimately, this isn't a competition with one universal winner — it's about matching the right tool to the right job based on when you need the money and how much volatility you can genuinely tolerate without panicking and making poor decisions during a market downturn.`,
    faqs: [
      {
        question: 'Is SIP safer than FD?',
        answer: 'No, FD is significantly safer in terms of capital protection and guaranteed returns. SIP in equity mutual funds carries real market risk and can lose value in the short term, though it has historically offered higher long-term returns to compensate for that risk.',
      },
      {
        question: 'Can I lose money in a SIP?',
        answer: 'Yes, if the mutual fund you\'re invested in falls in value and you redeem during that period, you can receive back less than you invested. This risk generally decreases the longer you stay invested, but it is never zero for equity-oriented funds.',
      },
      {
        question: 'Should I put my emergency fund in FD or SIP?',
        answer: 'FD (or a liquid mutual fund) is strongly recommended for emergency funds, since you need guaranteed access to that money without risk of loss exactly when you need it — equity SIPs are not appropriate for money you might need on short notice.',
      },
    ],
    relatedCalculatorSlugs: ['sip-calculator', 'fd-calculator'],
    relatedGuideSlugs: ['what-is-sip', 'best-investment-options-india'],
  },

  {
    slug: 'how-to-calculate-cagr',
    title: 'How to Calculate CAGR (Compound Annual Growth Rate)',
    metaTitle: 'How to Calculate CAGR — Step-by-Step Guide with Examples',
    metaDescription:
      'Learn how to calculate CAGR (Compound Annual Growth Rate) step by step, with real examples for mutual funds, stocks, and business growth in India.',
    keywords: ['how to calculate cagr', 'cagr formula', 'cagr calculation example', 'compound annual growth rate explained'],
    publishedAt: '2025-03-05',
    updatedAt: '2026-06-01',
    readingTimeMinutes: 7,
    category: 'investment',
    content: `CAGR, or Compound Annual Growth Rate, is one of those financial terms you see everywhere — on mutual fund fact sheets, stock research reports, and business annual reports — but that many people never learn to actually calculate themselves. The good news is that once you see the formula and work through one example, it becomes intuitive and quick to compute for any investment.

The CAGR formula is: CAGR = [(Final Value ÷ Initial Value) raised to the power of (1 ÷ Number of Years)] − 1, then multiplied by 100 to express it as a percentage.

Let's work through a concrete example step by step. Suppose you invested ₹2,00,000 in a mutual fund 5 years ago, and today it's worth ₹4,50,000. Here's how to calculate the CAGR:

Step 1: Divide the final value by the initial value. ₹4,50,000 ÷ ₹2,00,000 = 2.25.

Step 2: Take that result to the power of (1 divided by the number of years). Since we have 5 years, we calculate 2.25 raised to the power of (1/5), which is the same as the 5th root of 2.25. This works out to approximately 1.1756.

Step 3: Subtract 1 from that result. 1.1756 − 1 = 0.1756.

Step 4: Multiply by 100 to express as a percentage. 0.1756 × 100 = 17.56%.

So this investment had a CAGR of approximately 17.56% per annum over the 5-year period. This doesn't mean it grew by exactly 17.56% every single year — it might have grown 30% in one year and only 5% in another — but 17.56% is the single steady annual rate that, compounded over exactly 5 years, would produce the same overall growth from ₹2,00,000 to ₹4,50,000.

Why go through this calculation instead of just looking at the total percentage gain? Because total or "absolute" return doesn't account for how long the growth took, making it impossible to fairly compare investments held for different periods. In our example, the absolute return was 125% (₹4,50,000 is 125% more than ₹2,00,000) — but knowing it took 5 years to achieve that 125% gain is essential context that CAGR captures and absolute return does not.

You can use this same method to calculate CAGR for anything that has a clear starting value, ending value, and time period: a stock's price appreciation, a company's revenue growth over several years, the price of gold or real estate over a holding period, or your own overall investment portfolio's performance since you started tracking it.

One important caveat: CAGR only works cleanly when you have a single starting investment and a single ending value — it does not account for additional money added or withdrawn along the way. If you've been investing through a SIP (multiple contributions over time) rather than a single lumpsum, CAGR will give a misleading answer, and you should use XIRR (Extended Internal Rate of Return) instead, which correctly weighs the timing and size of each individual cash flow.

If manual calculation feels tedious, any CAGR calculator (including the one on this site) does this instantly — just enter your initial value, final value, and the number of years, and it computes the CAGR for you using the exact formula above.`,
    faqs: [
      {
        question: 'What is a good CAGR for a mutual fund?',
        answer: 'For equity mutual funds in India, a long-term (10+ year) CAGR in the 10-14% range is considered historically reasonable, though it varies significantly by fund category, market cycle, and time period measured.',
      },
      {
        question: 'Can I calculate CAGR in Excel?',
        answer: 'Yes, the formula in Excel is =(Final Value/Initial Value)^(1/Number of Years)-1, then format the result as a percentage. This mirrors the exact manual calculation shown above.',
      },
      {
        question: 'Why is my SIP\'s CAGR different from the fund\'s reported CAGR?',
        answer: 'Because a fund\'s reported CAGR typically reflects a single lumpsum investment over the period, while your SIP involved multiple contributions at different times and different NAVs. Your effective return should be measured using XIRR, not CAGR, for an accurate picture.',
      },
    ],
    relatedCalculatorSlugs: ['cagr-calculator', 'sip-calculator'],
    relatedGuideSlugs: ['what-is-sip', 'sip-vs-fd'],
  },

  {
    slug: 'best-investment-options-india',
    title: 'Best Investment Options in India for 2026',
    metaTitle: 'Best Investment Options in India for 2026 — Complete Guide',
    metaDescription:
      'Explore the best investment options in India for 2026 — SIP, PPF, FD, NPS, ELSS and more — compared on returns, risk, liquidity, and taxation.',
    keywords: ['best investment options india', 'where to invest money in india', 'best investment plan 2026', 'investment options comparison india'],
    publishedAt: '2025-04-20',
    updatedAt: '2026-06-01',
    readingTimeMinutes: 10,
    category: 'planning',
    content: `With so many investment options available in India — mutual funds, fixed deposits, PPF, NPS, gold, real estate, stocks — it's easy to feel overwhelmed about where to actually put your money. Rather than declaring one single "best" option (there isn't one that fits everyone), this guide compares the major categories on the factors that actually matter: expected returns, risk, liquidity, and taxation, so you can build an allocation that fits your specific goals and risk tolerance.

Equity Mutual Funds (via SIP or lumpsum): Historically the best long-term wealth-building tool for most Indian investors, with 10+ year CAGR typically in the 10-14% range, though with genuine short-term volatility and no guaranteed return. Best suited for goals 7+ years away, where you can ride out market cycles. LTCG above ₹1.25 lakh/year is taxed at a relatively favorable 12.5%.

Public Provident Fund (PPF): A government-backed, EEE (fully tax-free) instrument with a 15-year lock-in and returns currently around 7.1% per annum, revised quarterly by the government. Zero market risk, ideal for the safe, long-term portion of your portfolio, though returns are typically lower than equity over the same horizon.

Fixed Deposits (FD): Guaranteed, DICGC-insured (up to ₹5 lakh) returns of roughly 6.5-7.5% per annum with flexible tenures from 7 days to 10 years. Best for short-to-medium-term goals and emergency funds where capital protection matters more than growth. Fully taxable at your income slab rate, which can meaningfully reduce real returns for those in higher tax brackets.

National Pension System (NPS): A market-linked retirement scheme offering an exclusive additional ₹50,000 tax deduction under Section 80CCD(1B), over and above the standard ₹1.5 lakh 80C limit. At retirement, 60% of the corpus is withdrawn tax-free while 40% must be annuitized into a taxable pension. Best used as a retirement-focused supplement alongside other investments, given its partial illiquidity and mandatory annuitization.

ELSS (Equity-Linked Savings Scheme) Mutual Funds: Tax-saving mutual funds that qualify for Section 80C deduction (up to ₹1.5 lakh) with the shortest lock-in among all 80C options — just 3 years. Being equity-oriented, they carry market risk but have historically offered strong long-term growth potential, making them a popular choice for investors who want tax-saving and equity exposure in one instrument.

Gold: Historically a reliable long-term inflation hedge and portfolio diversifier, available today through physical gold, Sovereign Gold Bonds (SGBs, which additionally pay 2.5% annual interest and are tax-free if held to maturity), or Gold ETFs/mutual funds. Gold typically performs well during market uncertainty but shouldn't dominate a portfolio — most planners suggest 5-10% allocation.

Real Estate: Can offer strong long-term appreciation and rental income, but comes with high illiquidity, large ticket sizes, ongoing maintenance costs, and significant transaction costs (stamp duty, registration) that reduce effective returns. Best approached as a long-term, low-liquidity portion of a diversified portfolio rather than your primary or only investment.

Recurring Deposits (RD): Similar risk/return profile to FDs but built for people saving from monthly income rather than a lumpsum, with comparable interest rates and full taxability of interest earned.

So, what should you actually do? Most financial planners recommend a diversified approach rather than putting everything into one instrument: build an emergency fund in FD/liquid funds first (3-6 months of expenses), maximize tax-efficient options like PPF, ELSS, and NPS up to your comfortable contribution limits, and direct the bulk of your long-term wealth-building savings into diversified equity mutual fund SIPs, with the exact equity-to-debt ratio depending on your age, risk tolerance, and how many years remain until you need the money. As a very rough starting heuristic, some planners suggest an equity allocation of "100 minus your age" percent, though this should be adjusted based on your personal circumstances and comfort with volatility — there is no one-size-fits-all answer, and the right mix for you depends entirely on your specific goals, timeline, and risk appetite.`,
    faqs: [
      {
        question: 'What is the safest investment option in India?',
        answer: 'Bank Fixed Deposits (within the ₹5 lakh DICGC insurance limit per bank) and the Public Provident Fund (PPF), which is backed by a sovereign guarantee, are generally considered the safest options in terms of capital protection, though both offer lower long-term growth potential than equity investments.',
      },
      {
        question: 'How should a beginner start investing in India?',
        answer: 'A common beginner-friendly approach is to first build an emergency fund in an FD or liquid fund, then start a small, sustainable SIP in a diversified equity mutual fund (such as a large-cap or index fund) for long-term goals, gradually increasing the amount as income grows and comfort with market volatility develops.',
      },
      {
        question: 'Is it better to invest in one option or diversify across many?',
        answer: 'Diversification across a few well-chosen instruments (rather than one single option, or too many overlapping ones) generally provides a better balance of growth potential, risk management, tax efficiency, and liquidity than concentrating everything into a single investment type.',
      },
    ],
    relatedCalculatorSlugs: ['sip-calculator', 'ppf-calculator', 'fd-calculator', 'nps-calculator'],
    relatedGuideSlugs: ['sip-vs-fd', 'what-is-sip'],
  },
];

export function getGuideBySlug(slug: string): GuideConfig | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function getRelatedGuides(guide: GuideConfig): GuideConfig[] {
  return guide.relatedGuideSlugs
    .map((slug) => getGuideBySlug(slug))
    .filter((g): g is GuideConfig => Boolean(g));
}
