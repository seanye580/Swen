// ─── Mock Data ───────────────────────────────────────────────────────────────

export const MANAGERS = [
  { id: 1, name: "Bridgewater Associates", strategy: "Global Macro", aum: "$124B", nextMeeting: "Feb 18, 2026", status: "Confirmed", allocation: 8.2, returnYTD: 4.1, notes: 3 },
  { id: 2, name: "Renaissance Technologies", strategy: "Quantitative Equity", aum: "$68B", nextMeeting: "Feb 20, 2026", status: "Pending", allocation: 5.7, returnYTD: 11.3, notes: 7 },
  { id: 3, name: "Sequoia Capital", strategy: "Venture Capital", aum: "$38B", nextMeeting: "Feb 25, 2026", status: "Confirmed", allocation: 4.1, returnYTD: -2.8, notes: 2 },
  { id: 4, name: "Ares Management", strategy: "Private Credit", aum: "$52B", nextMeeting: "Mar 3, 2026", status: "Tentative", allocation: 6.5, returnYTD: 7.9, notes: 5 },
  { id: 5, name: "BlackRock Real Assets", strategy: "Real Assets", aum: "$91B", nextMeeting: "Mar 10, 2026", status: "Confirmed", allocation: 7.3, returnYTD: 3.2, notes: 1 },
];

export const NOTES = [
  { id: 1, title: "Q4 Performance Review — Bridgewater", date: "Jan 15, 2026", labels: ["Performance", "Macro"], manager: "Bridgewater Associates", author: "David S.", excerpt: "Bridgewater's Pure Alpha fund returned +3.2% in Q4, driven primarily by rates positioning. Key concern around correlation to equity beta rising to 0.35..." },
  { id: 2, title: "Due Diligence: Renaissance Medallion Access", date: "Jan 22, 2026", labels: ["Due Diligence", "Quantitative"], manager: "Renaissance Technologies", author: "James Park", excerpt: "Evaluated capacity constraints and fee structure for potential increased allocation. Medallion remains closed but RIEF offers similar factor exposures..." },
  { id: 3, title: "IC Meeting Minutes — Private Credit Allocation", date: "Feb 1, 2026", labels: ["IC Meeting", "Private Credit"], manager: "Ares Management", author: "David S.", excerpt: "Committee approved increasing private credit allocation from 6.5% to 8.0% over next 12 months. Ares and Apollo shortlisted for additional commitment..." },
  { id: 4, title: "Sequoia Fund XIV — Capital Call Notice", date: "Feb 5, 2026", labels: ["Operations", "Venture Capital"], manager: "Sequoia Capital", author: "Michael Torres", excerpt: "Third capital call received for $2.4M. Total drawn to date: $7.2M of $15M commitment. Fund deployment pace tracking ahead of schedule..." },
  { id: 5, title: "ESG Integration Framework Discussion", date: "Feb 8, 2026", labels: ["ESG", "Policy"], manager: "General", author: "David S.", excerpt: "Board requested formal ESG integration framework by Q2. Reviewing UNPRI alignment and manager-level ESG scoring methodology options..." },
  { id: 6, title: "Real Assets Portfolio Review", date: "Feb 10, 2026", labels: ["Performance", "Real Assets"], manager: "BlackRock Real Assets", author: "James Park", excerpt: "Infrastructure sleeve outperforming at +5.1% while real estate returning +1.2%. Discussing timber allocation reduction given softwood pricing headwinds..." },
];

export const NEWS_ITEMS = [
  { id: 1, title: "Fed Signals Potential Rate Cut in March Amid Cooling Inflation Data", source: "Wall Street Journal", sourceType: "newspaper", time: "2h ago", tags: ["Macro", "Rates"], summary: "Federal Reserve officials indicated openness to a rate reduction following January CPI data showing inflation at 2.3%, closer to the 2% target." },
  { id: 2, title: "Endowment Model Under Pressure as Alts Underperform Public Markets", source: "Institutional Investor", sourceType: "newspaper", time: "4h ago", tags: ["Endowments", "Alternatives"], summary: "Several large university endowments reported fiscal year returns below 60/40 benchmarks, raising questions about illiquidity premiums." },
  { id: 3, title: "The Case for Private Credit in a Disintermediated World", source: "Matt Levine's Newsletter", sourceType: "substack", time: "6h ago", tags: ["Private Credit", "Banking"], summary: "Analysis of how bank capital requirements continue to push lending into private markets, creating opportunities for institutional allocators." },
  { id: 4, title: "Bridgewater's Co-CIO on Navigating the 'New Neutral'", source: "@RayDalio", sourceType: "x", time: "8h ago", tags: ["Macro", "Bridgewater"], summary: "Thread discussing structural shifts in neutral rates and implications for portfolio construction in the current regime." },
  { id: 5, title: "Foundation Boards Increasingly Mandate Climate-Aligned Portfolios", source: "Chronicle of Philanthropy", sourceType: "newspaper", time: "12h ago", tags: ["ESG", "Foundations"], summary: "Survey of 200 private foundations shows 47% now have formal climate investment policies, up from 28% two years ago." },
  { id: 6, title: "Why Venture Returns Will Compress (And What To Do About It)", source: "The Generalist", sourceType: "substack", time: "1d ago", tags: ["Venture Capital", "Returns"], summary: "Deep dive into the proliferation of venture capital AUM and its implications for future return expectations for institutional LPs." },
  { id: 7, title: "SEC Proposes New Private Fund Reporting Requirements", source: "Bloomberg", sourceType: "newspaper", time: "1d ago", tags: ["Regulation", "Compliance"], summary: "New Form PF amendments would require quarterly reporting for funds over $500M, affecting many endowment managers." },
  { id: 8, title: "AI-Driven Alpha: Separating Signal from Noise in Quant Strategies", source: "@CliffordAsness", sourceType: "x", time: "1d ago", tags: ["Quantitative", "AI"], summary: "AQR founder discusses the real vs. perceived impact of LLMs on systematic investment strategies." },
];

export const ASSET_ALLOCATION = [
  { name: "Public Equity", value: 28, color: "#3B82F6" },
  { name: "Fixed Income", value: 12, color: "#10B981" },
  { name: "Hedge Funds", value: 18, color: "#8B5CF6" },
  { name: "Private Equity", value: 15, color: "#F59E0B" },
  { name: "Private Credit", value: 8, color: "#EF4444" },
  { name: "Real Assets", value: 11, color: "#06B6D4" },
  { name: "Venture Capital", value: 5, color: "#EC4899" },
  { name: "Cash", value: 3, color: "#6B7280" },
];

export const FUNDS_DATA = [
  { id: 1, name: "Bridgewater Pure Alpha", manager: "Bridgewater Associates", strategy: "Global Macro", assetClass: "Hedge Funds", inception: "1991", aum: "$12.4B", allocation: "$68.9M", ret1M: 1.2, ret3M: 3.1, retYTD: 4.1, ret1Y: 8.7, ret3Y: 6.2, ret5Y: 7.1, volatility: 10.2, sharpe: 0.87, sortino: 1.14, maxDD: -12.3, alpha: 2.1, beta: 0.35, infoRatio: 0.62, calmar: 0.58, upCapture: 68, downCapture: 42, correlation: 0.35, status: "active" },
  { id: 2, name: "RenTech RIEF", manager: "Renaissance Technologies", strategy: "Quantitative Equity", assetClass: "Hedge Funds", inception: "2005", aum: "$34.0B", allocation: "$48.0M", ret1M: 2.8, ret3M: 5.4, retYTD: 11.3, ret1Y: 19.2, ret3Y: 14.1, ret5Y: 16.8, volatility: 12.8, sharpe: 1.52, sortino: 2.01, maxDD: -8.7, alpha: 8.4, beta: 0.62, infoRatio: 1.31, calmar: 1.93, upCapture: 92, downCapture: 38, correlation: 0.58, status: "active" },
  { id: 3, name: "Sequoia Capital Fund XIV", manager: "Sequoia Capital", strategy: "Venture Capital", assetClass: "Venture Capital", inception: "2022", aum: "$8.5B", allocation: "$34.5M", ret1M: -0.8, ret3M: -1.2, retYTD: -2.8, ret1Y: 5.4, ret3Y: null, ret5Y: null, volatility: 22.1, sharpe: 0.31, sortino: 0.42, maxDD: -28.4, alpha: 3.2, beta: 1.15, infoRatio: 0.18, calmar: 0.19, upCapture: 118, downCapture: 95, correlation: 0.72, status: "active" },
  { id: 4, name: "Ares Senior Direct Lending III", manager: "Ares Management", strategy: "Private Credit", assetClass: "Private Credit", inception: "2020", aum: "$14.2B", allocation: "$54.7M", ret1M: 0.7, ret3M: 2.1, retYTD: 7.9, ret1Y: 10.8, ret3Y: 9.4, ret5Y: null, volatility: 4.2, sharpe: 1.88, sortino: 2.84, maxDD: -3.1, alpha: 4.8, beta: 0.08, infoRatio: 1.52, calmar: 3.03, upCapture: 32, downCapture: 8, correlation: 0.12, status: "active" },
  { id: 5, name: "BlackRock Global Infrastructure IV", manager: "BlackRock Real Assets", strategy: "Infrastructure", assetClass: "Real Assets", inception: "2019", aum: "$22.0B", allocation: "$61.5M", ret1M: 0.4, ret3M: 1.5, retYTD: 3.2, ret1Y: 7.1, ret3Y: 8.3, ret5Y: 7.8, volatility: 6.8, sharpe: 1.12, sortino: 1.58, maxDD: -9.2, alpha: 2.9, beta: 0.22, infoRatio: 0.84, calmar: 0.85, upCapture: 45, downCapture: 22, correlation: 0.28, status: "active" },
  { id: 6, name: "Vanguard Total US Equity", manager: "Vanguard", strategy: "Passive Equity", assetClass: "Public Equity", inception: "1992", aum: "$1.4T", allocation: "$152.0M", ret1M: 1.8, ret3M: 4.2, retYTD: 6.1, ret1Y: 12.4, ret3Y: 9.8, ret5Y: 11.2, volatility: 15.4, sharpe: 0.72, sortino: 0.95, maxDD: -23.8, alpha: 0.0, beta: 1.0, infoRatio: 0.0, calmar: 0.47, upCapture: 100, downCapture: 100, correlation: 1.0, status: "active" },
  { id: 7, name: "PIMCO Income Fund", manager: "PIMCO", strategy: "Multi-Sector Fixed Income", assetClass: "Fixed Income", inception: "2007", aum: "$148B", allocation: "$72.3M", ret1M: 0.5, ret3M: 1.4, retYTD: 2.8, ret1Y: 6.2, ret3Y: 3.9, ret5Y: 4.5, volatility: 5.1, sharpe: 0.88, sortino: 1.22, maxDD: -7.8, alpha: 1.5, beta: 0.42, infoRatio: 0.71, calmar: 0.58, upCapture: 52, downCapture: 35, correlation: 0.45, status: "active" },
  { id: 8, name: "KKR Americas PE Fund XIII", manager: "KKR", strategy: "Buyout", assetClass: "Private Equity", inception: "2021", aum: "$18.4B", allocation: "$95.0M", ret1M: 0.9, ret3M: 2.8, retYTD: 5.2, ret1Y: 14.1, ret3Y: 12.6, ret5Y: null, volatility: 8.9, sharpe: 1.41, sortino: 1.92, maxDD: -11.2, alpha: 5.2, beta: 0.48, infoRatio: 1.08, calmar: 1.13, upCapture: 72, downCapture: 35, correlation: 0.52, status: "active" },
  { id: 9, name: "Pershing Square Holdings", manager: "Pershing Square Capital", strategy: "Concentrated Equity", assetClass: "Hedge Funds", inception: "2004", aum: "$18.2B", allocation: "$41.2M", ret1M: 3.1, ret3M: 7.2, retYTD: 8.4, ret1Y: 22.5, ret3Y: 18.3, ret5Y: 21.4, volatility: 18.6, sharpe: 1.15, sortino: 1.48, maxDD: -32.1, alpha: 9.8, beta: 0.82, infoRatio: 0.92, calmar: 0.67, upCapture: 108, downCapture: 68, correlation: 0.74, status: "active" },
  { id: 10, name: "Brookfield Renewable Partners", manager: "Brookfield Asset Management", strategy: "Renewable Infrastructure", assetClass: "Real Assets", inception: "2011", aum: "$28.0B", allocation: "$31.2M", ret1M: 0.6, ret3M: 1.8, retYTD: 4.5, ret1Y: 9.2, ret3Y: 7.1, ret5Y: 8.6, volatility: 9.4, sharpe: 0.91, sortino: 1.28, maxDD: -15.4, alpha: 3.1, beta: 0.31, infoRatio: 0.72, calmar: 0.56, upCapture: 48, downCapture: 28, correlation: 0.34, status: "active" },
];

export const THEMES_DATA = [
  {
    id: 1, name: "Rising Rate Sensitivity in Alternatives", trend: "up", urgency: "high",
    summary: "Multiple sources indicate increasing correlation between alternative fund returns and interest rate movements. Bridgewater's equity beta has risen to 0.35 and several hedge fund managers are flagging duration risk in their portfolios. The Fed's dovish pivot may create tactical opportunities but structural rate sensitivity remains a concern for the endowment model.",
    sources: [
      { type: "note", title: "Q4 Performance Review — Bridgewater", date: "Jan 15, 2026", author: "David S." },
      { type: "newsletter", title: "Bridgewater's Co-CIO on Navigating the 'New Neutral'", source: "@RayDalio" },
      { type: "news", title: "Fed Signals Potential Rate Cut in March", source: "Wall Street Journal" },
      { type: "letter", title: "Ares Q4 2025 Investor Letter", source: "Ares Management" },
    ],
    relatedFunds: ["Bridgewater Pure Alpha", "PIMCO Income Fund", "Ares Senior Direct Lending III"],
    aiInsight: "Consider stress-testing the portfolio under a +100bps rate shock scenario. Current allocation has estimated 3.2% NAV sensitivity to parallel rate shifts.",
  },
  {
    id: 2, name: "Private Credit: The New Bank Lending", trend: "up", urgency: "medium",
    summary: "Bank capital requirements continue to push lending into private markets. Ares and Apollo are seeing record deal flow as traditional banks pull back from middle-market lending. The IC has approved increasing allocation from 6.5% to 8.0%, but execution timing and manager selection remain open questions.",
    sources: [
      { type: "note", title: "IC Meeting Minutes — Private Credit Allocation", date: "Feb 1, 2026", author: "David S." },
      { type: "newsletter", title: "The Case for Private Credit in a Disintermediated World", source: "Matt Levine" },
      { type: "news", title: "SEC Proposes New Private Fund Reporting", source: "Bloomberg" },
    ],
    relatedFunds: ["Ares Senior Direct Lending III"],
    aiInsight: "Private credit allocation is 1.5% below target. Recommend scheduling commitment calls with Ares and Apollo within the next 30 days to deploy capital before rate cuts compress spreads.",
  },
  {
    id: 3, name: "Venture Capital Return Compression", trend: "down", urgency: "medium",
    summary: "The proliferation of VC AUM is compressing expected returns across all stages. Sequoia Fund XIV's deployment pace is ahead of schedule but early markdowns are a concern. Multiple Substack authors and institutional research pieces are flagging that the venture asset class may not deliver the traditional 300bps premium over public equities going forward.",
    sources: [
      { type: "note", title: "Sequoia Fund XIV — Capital Call Notice", date: "Feb 5, 2026", author: "Michael Torres" },
      { type: "newsletter", title: "Why Venture Returns Will Compress", source: "The Generalist" },
      { type: "news", title: "Endowment Model Under Pressure", source: "Institutional Investor" },
    ],
    relatedFunds: ["Sequoia Capital Fund XIV"],
    aiInsight: "Current VC allocation (5%) is modest. However, consider whether Sequoia re-up for Fund XV should be at reduced commitment given return compression thesis. Request updated TVPI/DPI projections.",
  },
  {
    id: 4, name: "ESG and Climate-Aligned Portfolio Mandates", trend: "up", urgency: "low",
    summary: "47% of private foundations now have formal climate investment policies, up from 28% two years ago. The board has requested a formal ESG integration framework by Q2. Key decisions include whether to adopt exclusionary screening, best-in-class selection, or impact-weighted approaches across the portfolio.",
    sources: [
      { type: "note", title: "ESG Integration Framework Discussion", date: "Feb 8, 2026", author: "David S." },
      { type: "news", title: "Foundation Boards Mandate Climate-Aligned Portfolios", source: "Chronicle of Philanthropy" },
      { type: "letter", title: "BlackRock 2026 Stewardship Report", source: "BlackRock" },
    ],
    relatedFunds: ["Brookfield Renewable Partners", "BlackRock Global Infrastructure IV"],
    aiInsight: "Draft ESG framework due in 8 weeks. Recommend scheduling consultant engagement with Cambridge Associates ESG team. Current portfolio carbon intensity is estimated at 142 tCO2e/$M — benchmark peers average 118.",
  },
  {
    id: 5, name: "Quantitative Strategy Evolution with AI/LLMs", trend: "up", urgency: "low",
    summary: "The integration of LLMs into systematic investment strategies is accelerating. Renaissance and AQR are both expanding their NLP-driven signal generation capabilities. Cliff Asness has publicly discussed separating genuine AI alpha from hype, while RenTech RIEF continues to outperform significantly.",
    sources: [
      { type: "note", title: "Due Diligence: Renaissance Medallion Access", date: "Jan 22, 2026", author: "James Park" },
      { type: "newsletter", title: "AI-Driven Alpha: Signal from Noise", source: "@CliffordAsness" },
    ],
    relatedFunds: ["RenTech RIEF", "Pershing Square Holdings"],
    aiInsight: "RenTech RIEF Sharpe of 1.52 is exceptional. Consider increasing allocation if capacity becomes available. Monitor for AI-driven strategy crowding risk across quant managers.",
  },
];

export const MVO_ASSET_CLASSES = [
  { name: "US Equity", expReturn: 7.8, expVol: 15.4, color: "#3B82F6" },
  { name: "Intl Equity", expReturn: 7.2, expVol: 17.2, color: "#6366F1" },
  { name: "Fixed Income", expReturn: 3.8, expVol: 5.1, color: "#10B981" },
  { name: "Hedge Funds", expReturn: 6.5, expVol: 8.8, color: "#8B5CF6" },
  { name: "Private Equity", expReturn: 10.2, expVol: 18.5, color: "#F59E0B" },
  { name: "Private Credit", expReturn: 8.1, expVol: 6.2, color: "#EF4444" },
  { name: "Real Assets", expReturn: 6.8, expVol: 10.4, color: "#06B6D4" },
  { name: "Venture Capital", expReturn: 12.5, expVol: 25.8, color: "#EC4899" },
];

export const LABEL_COLORS = {
  "Performance": "bg-blue-100 text-blue-800",
  "Macro": "bg-purple-100 text-purple-800",
  "Due Diligence": "bg-amber-100 text-amber-800",
  "Quantitative": "bg-cyan-100 text-cyan-800",
  "IC Meeting": "bg-red-100 text-red-800",
  "Private Credit": "bg-rose-100 text-rose-800",
  "Operations": "bg-gray-100 text-gray-800",
  "Venture Capital": "bg-pink-100 text-pink-800",
  "ESG": "bg-green-100 text-green-800",
  "Policy": "bg-indigo-100 text-indigo-800",
  "Real Assets": "bg-teal-100 text-teal-800",
  "Rates": "bg-violet-100 text-violet-700",
  "Endowments": "bg-sky-100 text-sky-800",
  "Alternatives": "bg-orange-100 text-orange-800",
  "Banking": "bg-slate-100 text-slate-800",
  "Bridgewater": "bg-blue-100 text-blue-700",
  "Foundations": "bg-emerald-100 text-emerald-800",
  "Returns": "bg-yellow-100 text-yellow-800",
  "Regulation": "bg-red-100 text-red-700",
  "Compliance": "bg-amber-100 text-amber-700",
  "AI": "bg-fuchsia-100 text-fuchsia-800",
};

export const SOURCE_ICONS = { newspaper: "📰", substack: "✉️", x: "𝕏" };
