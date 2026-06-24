/**
 * Vercel Serverless Function — /api/market
 * Fetches live Indian market data via Yahoo Finance (no API key required).
 * Vercel edge cache: 5-minute s-maxage, 10-minute stale-while-revalidate.
 * Falls back gracefully to seeded values on any fetch failure.
 *
 * ENABLE_AI_INSIGHTS=false — no AI calls in this file.
 * To enable AI market summaries later: add an /api/ai-market.js endpoint
 * and gate it with process.env.ENABLE_AI_INSIGHTS === 'true'.
 */

/* Yahoo Finance symbols */
const YF = {
  NIFTY50: '^NSEI',
  SENSEX:  '^BSESN',
  GOLD:    'GC=F',     /* USD / troy oz  → converted to INR / 10g  */
  SILVER:  'SI=F',     /* USD / troy oz  → converted to INR / kg   */
  USDINR:  'USDINR=X',
};

/* Fallback values shown when every upstream fetch fails */
/* Fallback values — June 2026 approximate levels */
const FALLBACK = {
  NIFTY50: { price: 26200,  change: 0, changePct: 0 },
  SENSEX:  { price: 86000,  change: 0, changePct: 0 },
  GOLD:    { price: 96000,  change: 0, changePct: 0 }, /* ₹/10g MCX */
  SILVER:  { price: 102000, change: 0, changePct: 0 }, /* ₹/kg  MCX */
  USDINR:  { price: 86.2,   change: 0, changePct: 0 },
};

async function fetchYahooQuote(symbol) {
  const url =
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}` +
    `?interval=1d&range=1d`;

  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
        '(KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      Accept: 'application/json',
    },
    signal: AbortSignal.timeout(6000),
  });

  if (!res.ok) throw new Error(`Yahoo ${symbol}: HTTP ${res.status}`);

  const json = await res.json();
  const meta = json?.chart?.result?.[0]?.meta;
  if (!meta?.regularMarketPrice) throw new Error(`No price data for ${symbol}`);

  const price = meta.regularMarketPrice;
  const prev  = meta.previousClose || meta.chartPreviousClose || price;
  const change    = price - prev;
  const changePct = prev ? (change / prev) * 100 : 0;

  return { price, prev, change, changePct };
}

module.exports = async function handler(req, res) {
  /* 5-min Vercel CDN cache; stale content served for up to 10 min while revalidating */
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  res.setHeader('Content-Type', 'application/json');

  /* Fetch all symbols in parallel; never let one failure block others */
  const [niftyR, sensexR, goldR, silverR, usdinrR] = await Promise.allSettled([
    fetchYahooQuote(YF.NIFTY50),
    fetchYahooQuote(YF.SENSEX),
    fetchYahooQuote(YF.GOLD),
    fetchYahooQuote(YF.SILVER),
    fetchYahooQuote(YF.USDINR),
  ]);

  const ok  = (r, fb) => (r.status === 'fulfilled' ? r.value : fb);
  const partial = [niftyR, sensexR, goldR, silverR, usdinrR].some(r => r.status === 'rejected');

  /* USD/INR rate used for commodity conversions */
  const usdRate = ok(usdinrR, FALLBACK.USDINR).price;

  /* Gold: USD / troy oz → INR / 10g  (1 troy oz = 31.1035 g) */
  const goldRaw = goldR.status === 'fulfilled' ? goldR.value : null;
  const goldINR = goldRaw
    ? {
        price:     (goldRaw.price  / 31.1035) * 10 * usdRate,
        change:    (goldRaw.change / 31.1035) * 10 * usdRate,
        changePct: goldRaw.changePct,
      }
    : FALLBACK.GOLD;

  /* Silver: USD / troy oz → INR / kg  (1 kg = 1000 g; 1 troy oz = 31.1035 g) */
  const silverRaw = silverR.status === 'fulfilled' ? silverR.value : null;
  const silverINR = silverRaw
    ? {
        price:     (silverRaw.price  / 31.1035) * 1000 * usdRate,
        change:    (silverRaw.change / 31.1035) * 1000 * usdRate,
        changePct: silverRaw.changePct,
      }
    : FALLBACK.SILVER;

  res.json({
    ok: true,
    ts: Date.now(),
    _partial: partial,   /* true when some symbols failed but others succeeded */
    data: {
      NIFTY50: ok(niftyR,  FALLBACK.NIFTY50),
      SENSEX:  ok(sensexR, FALLBACK.SENSEX),
      GOLD:    goldINR,
      SILVER:  silverINR,
      USDINR:  ok(usdinrR, FALLBACK.USDINR),
    },
  });
};
