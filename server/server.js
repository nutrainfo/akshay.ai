/**
 * FinCalc Pro — Express API Server
 * Proxies market data, WebSocket relay, and admin endpoints.
 * Never exposes API keys to the frontend.
 *
 * API Providers (configure via .env):
 *   PAID:  TrueData (https://truedata.in/api-documentation/)
 *          or GlobalDataFeeds (https://globaldatafeeds.in/api)
 *   CHEAP: IndianAPI via RapidAPI (https://rapidapi.com/collection/stock-market-apis-india)
 *          or Apify scraper (https://apify.com/actors?search=nse)
 */

const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3001;

/* ---- Middleware ---- */
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(express.json({ limit: '10kb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: { error: 'Too many requests' } }));

/* ============================================================
   MARKET DATA PROXY
   ============================================================ */

/* --- Option A: TrueData (paid, low-latency) ---
   Docs: https://truedata.in/api-documentation/
   Replace TRUEDATA_USER / TRUEDATA_PASS in .env

const axios = require('axios');
let truedataToken = null;

async function loginTruedata() {
  const res = await axios.post('https://api.truedata.in/loginGoogle', null, {
    params: { user: process.env.TRUEDATA_USER, password: process.env.TRUEDATA_PASS }
  });
  truedataToken = res.data.token;
}

async function fetchTruedataLTP(symbols) {
  const res = await axios.get('https://api.truedata.in/getAllQuotes', {
    params: { token: truedataToken, symbols: symbols.join(',') }
  });
  return res.data.Records;
}
loginTruedata().catch(console.error);
setInterval(loginTruedata, 18 * 60 * 60 * 1000);
*/

/* --- Option B: RapidAPI / IndianAPI (affordable, REST) ---
   Docs: https://rapidapi.com/search/nse-stocks
   Set RAPIDAPI_KEY in .env
*/
async function fetchMarketDataFallback() {
  /* Simulated response — replace with real API call */
  return {
    NIFTY50: { ltp: 24500 + (Math.random() - 0.5) * 200, change: (Math.random() - 0.5) * 100 },
    SENSEX:  { ltp: 80500 + (Math.random() - 0.5) * 500, change: (Math.random() - 0.5) * 250 },
    GOLD:    { ltp: 73500 + (Math.random() - 0.5) * 300, change: (Math.random() - 0.5) * 150 },
    SILVER:  { ltp: 91000 + (Math.random() - 0.5) * 500, change: (Math.random() - 0.5) * 200 },
    USDINR:  { ltp: 84.5 + (Math.random() - 0.5) * 0.2, change: (Math.random() - 0.5) * 0.1 },
  };
  /* Real RapidAPI example:
  const res = await fetch('https://latest-stock-price.p.rapidapi.com/any?Indices=NIFTY 50', {
    headers: { 'X-RapidAPI-Key': process.env.RAPIDAPI_KEY, 'X-RapidAPI-Host': 'latest-stock-price.p.rapidapi.com' }
  });
  return res.json();
  */
}

/* ---- REST endpoint ---- */
app.get('/api/market', async (req, res) => {
  try {
    const data = await fetchMarketDataFallback();
    res.json({ ok: true, data, ts: Date.now() });
  } catch (err) {
    console.error('Market data error:', err.message);
    res.status(502).json({ ok: false, error: 'Market data unavailable' });
  }
});

/* ============================================================
   WebSocket RELAY — broadcasts live prices to connected clients
   ============================================================ */
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  ws.on('close', () => clients.delete(ws));
  ws.on('error', () => clients.delete(ws));
});

function broadcastMarket(data) {
  const msg = JSON.stringify({ type: 'market', data, ts: Date.now() });
  for (const client of clients) {
    if (client.readyState === 1) client.send(msg);
  }
}

/* Broadcast every 10 seconds */
setInterval(async () => {
  if (!clients.size) return;
  try {
    const data = await fetchMarketDataFallback();
    broadcastMarket(data);
  } catch (err) {
    console.error('Broadcast error:', err.message);
  }
}, 10000);

/* ============================================================
   BANK RATES — simple JSON store
   ============================================================ */
const fs = require('fs');
const path = require('path');
const RATES_FILE = path.join(__dirname, '../data/bank-rates.json');

app.get('/api/rates', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(RATES_FILE, 'utf8'));
    res.json({ ok: true, data });
  } catch {
    res.status(404).json({ ok: false, error: 'Rates not found' });
  }
});

/* ============================================================
   ADMIN — minimal rate update endpoint (add auth in production)
   ============================================================ */
const ADMIN_KEY = process.env.ADMIN_KEY || 'change-this-secret';

function adminAuth(req, res, next) {
  if (req.headers['x-admin-key'] !== ADMIN_KEY) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

app.post('/api/admin/rates', adminAuth, (req, res) => {
  try {
    fs.writeFileSync(RATES_FILE, JSON.stringify(req.body, null, 2));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/* ============================================================
   CONTACT FORM (server-side — swap nodemailer/Resend in prod)
   ============================================================ */
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ ok: false, error: 'Missing fields' });

  console.log(`Contact from ${name} <${email}>: ${message.slice(0, 80)}`);
  /* Production: use nodemailer or Resend (https://resend.com) */
  res.json({ ok: true });
});

/* ============================================================
   HEALTH CHECK
   ============================================================ */
app.get('/health', (_, res) => res.json({ ok: true, uptime: process.uptime() }));

server.listen(PORT, () => console.log(`FinCalc Pro server running on :${PORT}`));

module.exports = { app, server };
