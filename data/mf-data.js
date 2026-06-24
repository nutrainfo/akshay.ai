/* Mutual fund list — returns as of Dec 2024 (indicative) */
const MF_DATA = [
  { name:'Mirae Asset Large Cap Fund Direct-Growth', amc:'Mirae Asset', cat:'equity', risk:'mod', ret1:18.2, ret3:13.4, ret5:19.8, aum:'₹38,245 Cr', growwSlug:'mirae-asset-large-cap-fund-direct-plan-growth' },
  { name:'Axis Bluechip Fund Direct-Growth', amc:'Axis MF', cat:'equity', risk:'mod', ret1:14.8, ret3:10.2, ret5:17.2, aum:'₹31,560 Cr', growwSlug:'axis-bluechip-fund-direct-plan-growth' },
  { name:'SBI Bluechip Fund Direct-Growth', amc:'SBI MF', cat:'equity', risk:'mod', ret1:17.5, ret3:12.6, ret5:18.0, aum:'₹44,800 Cr', growwSlug:'sbi-bluechip-fund-direct-plan-growth' },
  { name:'HDFC Top 100 Fund Direct-Growth', amc:'HDFC MF', cat:'equity', risk:'mod', ret1:22.1, ret3:17.5, ret5:21.0, aum:'₹29,450 Cr', growwSlug:'hdfc-top-100-fund-direct-plan-growth' },
  { name:'Nippon India Large Cap Fund Direct-Growth', amc:'Nippon MF', cat:'equity', risk:'mod', ret1:23.4, ret3:18.2, ret5:22.3, aum:'₹26,700 Cr', growwSlug:'nippon-india-large-cap-fund-direct-plan-growth' },
  { name:'Parag Parikh Flexi Cap Fund Direct-Growth', amc:'PPFAS MF', cat:'equity', risk:'high', ret1:20.4, ret3:19.5, ret5:25.2, aum:'₹62,300 Cr', growwSlug:'parag-parikh-flexi-cap-fund-direct-plan-growth' },
  { name:'HDFC Flexi Cap Fund Direct-Growth', amc:'HDFC MF', cat:'equity', risk:'high', ret1:29.8, ret3:22.1, ret5:24.0, aum:'₹55,500 Cr', growwSlug:'hdfc-flexi-cap-fund-direct-plan-growth' },
  { name:'Mirae Asset Emerging Bluechip Direct-Growth', amc:'Mirae Asset', cat:'equity', risk:'high', ret1:16.5, ret3:13.8, ret5:22.5, aum:'₹32,000 Cr', growwSlug:'mirae-asset-emerging-bluechip-fund-direct-plan-growth' },
  { name:'Kotak Emerging Equity Fund Direct-Growth', amc:'Kotak MF', cat:'equity', risk:'vhigh', ret1:26.4, ret3:22.0, ret5:28.1, aum:'₹43,000 Cr', growwSlug:'kotak-emerging-equity-fund-direct-plan-growth' },
  { name:'Axis Small Cap Fund Direct-Growth', amc:'Axis MF', cat:'equity', risk:'vhigh', ret1:19.2, ret3:20.4, ret5:30.5, aum:'₹19,400 Cr', growwSlug:'axis-small-cap-fund-direct-plan-growth' },
  { name:'Nippon India Small Cap Fund Direct-Growth', amc:'Nippon MF', cat:'equity', risk:'vhigh', ret1:36.5, ret3:30.2, ret5:38.0, aum:'₹51,000 Cr', growwSlug:'nippon-india-small-cap-fund-direct-plan-growth' },
  { name:'Navi Nifty 50 Index Fund Direct-Growth', amc:'Navi MF', cat:'index', risk:'mod', ret1:15.0, ret3:12.5, ret5:17.0, aum:'₹950 Cr', growwSlug:'navi-nifty-50-index-fund-direct-plan-growth' },
  { name:'UTI Nifty 50 Index Fund Direct-Growth', amc:'UTI MF', cat:'index', risk:'mod', ret1:15.1, ret3:12.6, ret5:17.1, aum:'₹18,200 Cr', growwSlug:'uti-nifty-50-index-fund-direct-plan-growth' },
  { name:'HDFC Index Fund-Nifty 50 Direct-Growth', amc:'HDFC MF', cat:'index', risk:'mod', ret1:15.1, ret3:12.6, ret5:17.2, aum:'₹15,600 Cr', growwSlug:'hdfc-index-fund-nifty-50-plan-direct-growth' },
  { name:'Motilal Oswal Nifty Midcap 150 Index Direct', amc:'Motilal MF', cat:'index', risk:'high', ret1:27.5, ret3:22.5, ret5:29.0, aum:'₹9,800 Cr', growwSlug:'motilal-oswal-nifty-midcap-150-index-fund-direct-plan-growth' },
  { name:'ICICI Pru Balanced Advantage Direct-Growth', amc:'ICICI Pru MF', cat:'hybrid', risk:'mod', ret1:14.8, ret3:11.5, ret5:15.2, aum:'₹52,000 Cr', growwSlug:'icici-prudential-balanced-advantage-fund-direct-plan-growth' },
  { name:'HDFC Balanced Advantage Direct-Growth', amc:'HDFC MF', cat:'hybrid', risk:'mod', ret1:24.0, ret3:18.5, ret5:19.5, aum:'₹79,000 Cr', growwSlug:'hdfc-balanced-advantage-fund-direct-plan-growth' },
  { name:'Kotak Equity Hybrid Direct-Growth', amc:'Kotak MF', cat:'hybrid', risk:'mod', ret1:18.2, ret3:14.0, ret5:18.0, aum:'₹4,400 Cr', growwSlug:'kotak-equity-hybrid-fund-direct-plan-growth' },
  { name:'SBI Debt Hybrid Fund Direct-Growth', amc:'SBI MF', cat:'hybrid', risk:'low', ret1:12.0, ret3:9.5, ret5:10.8, aum:'₹5,200 Cr', growwSlug:'sbi-debt-hybrid-fund-direct-plan-growth' },
  { name:'HDFC Short Term Debt Fund Direct-Growth', amc:'HDFC MF', cat:'debt', risk:'low', ret1:7.8, ret3:6.5, ret5:7.2, aum:'₹13,200 Cr', growwSlug:'hdfc-short-term-debt-fund-direct-plan-growth' },
  { name:'Axis Corporate Debt Fund Direct-Growth', amc:'Axis MF', cat:'debt', risk:'low', ret1:7.6, ret3:6.2, ret5:7.0, aum:'₹3,800 Cr', growwSlug:'axis-corporate-debt-fund-direct-plan-growth' },
  { name:'SBI Magnum Gilt Fund Direct-Growth', amc:'SBI MF', cat:'debt', risk:'low', ret1:9.8, ret3:7.2, ret5:7.8, aum:'₹8,300 Cr', growwSlug:'sbi-magnum-gilt-fund-direct-plan-growth' },
  { name:'Nippon India Liquid Fund Direct-Growth', amc:'Nippon MF', cat:'debt', risk:'low', ret1:7.3, ret3:6.8, ret5:6.4, aum:'₹32,000 Cr', growwSlug:'nippon-india-liquid-fund-direct-plan-growth' },
  { name:'Quant Active Fund Direct-Growth', amc:'Quant MF', cat:'equity', risk:'vhigh', ret1:32.5, ret3:28.5, ret5:35.0, aum:'₹8,500 Cr', growwSlug:'quant-active-fund-direct-plan-growth' },
];

function getGrowwLink(name) {
  return 'https://groww.in/mutual-funds';
}
