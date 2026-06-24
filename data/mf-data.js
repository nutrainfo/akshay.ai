/* Mutual fund list — indicative returns as of June 2026 */
const MF_DATA = [
  /* ---- Large Cap Equity ---- */
  { name:'Mirae Asset Large Cap Fund Direct-Growth',       amc:'Mirae Asset',  cat:'equity', risk:'mod',   ret1:22.4, ret3:17.8, ret5:21.2, aum:'₹42,500 Cr',  growwSlug:'mirae-asset-large-cap-fund-direct-plan-growth' },
  { name:'Axis Bluechip Fund Direct-Growth',               amc:'Axis MF',      cat:'equity', risk:'mod',   ret1:18.6, ret3:14.1, ret5:18.4, aum:'₹34,200 Cr',  growwSlug:'axis-bluechip-fund-direct-plan-growth' },
  { name:'SBI Bluechip Fund Direct-Growth',                amc:'SBI MF',       cat:'equity', risk:'mod',   ret1:21.3, ret3:16.2, ret5:19.5, aum:'₹48,600 Cr',  growwSlug:'sbi-bluechip-fund-direct-plan-growth' },
  { name:'HDFC Top 100 Fund Direct-Growth',                amc:'HDFC MF',      cat:'equity', risk:'mod',   ret1:26.5, ret3:20.8, ret5:22.6, aum:'₹33,100 Cr',  growwSlug:'hdfc-top-100-fund-direct-plan-growth' },
  { name:'Nippon India Large Cap Fund Direct-Growth',      amc:'Nippon MF',    cat:'equity', risk:'mod',   ret1:27.2, ret3:21.4, ret5:24.0, aum:'₹30,400 Cr',  growwSlug:'nippon-india-large-cap-fund-direct-plan-growth' },
  /* ---- Flexi / Multi Cap ---- */
  { name:'Parag Parikh Flexi Cap Fund Direct-Growth',      amc:'PPFAS MF',     cat:'equity', risk:'high',  ret1:24.8, ret3:22.1, ret5:27.3, aum:'₹78,500 Cr',  growwSlug:'parag-parikh-flexi-cap-fund-direct-plan-growth' },
  { name:'HDFC Flexi Cap Fund Direct-Growth',              amc:'HDFC MF',      cat:'equity', risk:'high',  ret1:32.4, ret3:25.6, ret5:26.1, aum:'₹62,000 Cr',  growwSlug:'hdfc-flexi-cap-fund-direct-plan-growth' },
  { name:'Mirae Asset Emerging Bluechip Direct-Growth',    amc:'Mirae Asset',  cat:'equity', risk:'high',  ret1:20.8, ret3:17.2, ret5:24.3, aum:'₹36,800 Cr',  growwSlug:'mirae-asset-emerging-bluechip-fund-direct-plan-growth' },
  /* ---- Mid & Small Cap ---- */
  { name:'Kotak Emerging Equity Fund Direct-Growth',       amc:'Kotak MF',     cat:'equity', risk:'vhigh', ret1:30.6, ret3:25.4, ret5:30.2, aum:'₹49,200 Cr',  growwSlug:'kotak-emerging-equity-fund-direct-plan-growth' },
  { name:'Axis Small Cap Fund Direct-Growth',              amc:'Axis MF',      cat:'equity', risk:'vhigh', ret1:23.5, ret3:24.1, ret5:32.8, aum:'₹22,100 Cr',  growwSlug:'axis-small-cap-fund-direct-plan-growth' },
  { name:'Nippon India Small Cap Fund Direct-Growth',      amc:'Nippon MF',    cat:'equity', risk:'vhigh', ret1:38.2, ret3:33.5, ret5:40.1, aum:'₹58,600 Cr',  growwSlug:'nippon-india-small-cap-fund-direct-plan-growth' },
  { name:'Quant Active Fund Direct-Growth',                amc:'Quant MF',     cat:'equity', risk:'vhigh', ret1:35.4, ret3:30.8, ret5:37.2, aum:'₹10,200 Cr', growwSlug:'quant-active-fund-direct-plan-growth' },
  /* ---- Index ---- */
  { name:'Navi Nifty 50 Index Fund Direct-Growth',         amc:'Navi MF',      cat:'index',  risk:'mod',   ret1:18.8, ret3:15.4, ret5:18.5, aum:'₹1,240 Cr',   growwSlug:'navi-nifty-50-index-fund-direct-plan-growth' },
  { name:'UTI Nifty 50 Index Fund Direct-Growth',          amc:'UTI MF',       cat:'index',  risk:'mod',   ret1:18.9, ret3:15.5, ret5:18.6, aum:'₹21,400 Cr',  growwSlug:'uti-nifty-50-index-fund-direct-plan-growth' },
  { name:'HDFC Index Fund-Nifty 50 Direct-Growth',         amc:'HDFC MF',      cat:'index',  risk:'mod',   ret1:18.9, ret3:15.5, ret5:18.7, aum:'₹18,200 Cr',  growwSlug:'hdfc-index-fund-nifty-50-plan-direct-growth' },
  { name:'Motilal Oswal Nifty Midcap 150 Index Direct',    amc:'Motilal MF',   cat:'index',  risk:'high',  ret1:31.2, ret3:25.8, ret5:31.4, aum:'₹14,600 Cr',  growwSlug:'motilal-oswal-nifty-midcap-150-index-fund-direct-plan-growth' },
  /* ---- Hybrid ---- */
  { name:'ICICI Pru Balanced Advantage Direct-Growth',     amc:'ICICI Pru MF', cat:'hybrid', risk:'mod',   ret1:18.2, ret3:14.8, ret5:16.5, aum:'₹58,400 Cr',  growwSlug:'icici-prudential-balanced-advantage-fund-direct-plan-growth' },
  { name:'HDFC Balanced Advantage Direct-Growth',          amc:'HDFC MF',      cat:'hybrid', risk:'mod',   ret1:27.6, ret3:21.4, ret5:21.2, aum:'₹88,000 Cr',  growwSlug:'hdfc-balanced-advantage-fund-direct-plan-growth' },
  { name:'Kotak Equity Hybrid Direct-Growth',              amc:'Kotak MF',     cat:'hybrid', risk:'mod',   ret1:22.0, ret3:17.2, ret5:19.8, aum:'₹5,100 Cr',   growwSlug:'kotak-equity-hybrid-fund-direct-plan-growth' },
  { name:'SBI Debt Hybrid Fund Direct-Growth',             amc:'SBI MF',       cat:'hybrid', risk:'low',   ret1:14.2, ret3:11.8, ret5:12.5, aum:'₹6,400 Cr',   growwSlug:'sbi-debt-hybrid-fund-direct-plan-growth' },
  /* ---- Debt ---- */
  { name:'HDFC Short Term Debt Fund Direct-Growth',        amc:'HDFC MF',      cat:'debt',   risk:'low',   ret1:8.2,  ret3:7.1,  ret5:7.6,  aum:'₹14,800 Cr',  growwSlug:'hdfc-short-term-debt-fund-direct-plan-growth' },
  { name:'Axis Corporate Debt Fund Direct-Growth',         amc:'Axis MF',      cat:'debt',   risk:'low',   ret1:8.0,  ret3:6.9,  ret5:7.4,  aum:'₹4,200 Cr',   growwSlug:'axis-corporate-debt-fund-direct-plan-growth' },
  { name:'SBI Magnum Gilt Fund Direct-Growth',             amc:'SBI MF',       cat:'debt',   risk:'low',   ret1:10.4, ret3:8.0,  ret5:8.4,  aum:'₹9,600 Cr',   growwSlug:'sbi-magnum-gilt-fund-direct-plan-growth' },
  { name:'Nippon India Liquid Fund Direct-Growth',         amc:'Nippon MF',    cat:'debt',   risk:'low',   ret1:7.6,  ret3:7.1,  ret5:6.8,  aum:'₹35,000 Cr',  growwSlug:'nippon-india-liquid-fund-direct-plan-growth' },
];

function getGrowwLink(name) {
  return 'https://groww.in/mutual-funds';
}
