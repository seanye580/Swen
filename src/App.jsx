import { useState, useMemo, useCallback } from "react";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MANAGERS = [
  { id: 1, name: "Bridgewater Associates", strategy: "Global Macro", aum: "$124B", nextMeeting: "Feb 18, 2026", status: "Confirmed", allocation: 8.2, returnYTD: 4.1, notes: 3 },
  { id: 2, name: "Renaissance Technologies", strategy: "Quantitative Equity", aum: "$68B", nextMeeting: "Feb 20, 2026", status: "Pending", allocation: 5.7, returnYTD: 11.3, notes: 7 },
  { id: 3, name: "Sequoia Capital", strategy: "Venture Capital", aum: "$38B", nextMeeting: "Feb 25, 2026", status: "Confirmed", allocation: 4.1, returnYTD: -2.8, notes: 2 },
  { id: 4, name: "Ares Management", strategy: "Private Credit", aum: "$52B", nextMeeting: "Mar 3, 2026", status: "Tentative", allocation: 6.5, returnYTD: 7.9, notes: 5 },
  { id: 5, name: "BlackRock Real Assets", strategy: "Real Assets", aum: "$91B", nextMeeting: "Mar 10, 2026", status: "Confirmed", allocation: 7.3, returnYTD: 3.2, notes: 1 },
];

const NOTES = [
  { id: 1, title: "Q4 Performance Review — Bridgewater", date: "Jan 15, 2026", labels: ["Performance", "Macro"], manager: "Bridgewater Associates", author: "David S.", excerpt: "Bridgewater's Pure Alpha fund returned +3.2% in Q4, driven primarily by rates positioning. Key concern around correlation to equity beta rising to 0.35..." },
  { id: 2, title: "Due Diligence: Renaissance Medallion Access", date: "Jan 22, 2026", labels: ["Due Diligence", "Quantitative"], manager: "Renaissance Technologies", author: "James Park", excerpt: "Evaluated capacity constraints and fee structure for potential increased allocation. Medallion remains closed but RIEF offers similar factor exposures..." },
  { id: 3, title: "IC Meeting Minutes — Private Credit Allocation", date: "Feb 1, 2026", labels: ["IC Meeting", "Private Credit"], manager: "Ares Management", author: "David S.", excerpt: "Committee approved increasing private credit allocation from 6.5% to 8.0% over next 12 months. Ares and Apollo shortlisted for additional commitment..." },
  { id: 4, title: "Sequoia Fund XIV — Capital Call Notice", date: "Feb 5, 2026", labels: ["Operations", "Venture Capital"], manager: "Sequoia Capital", author: "Michael Torres", excerpt: "Third capital call received for $2.4M. Total drawn to date: $7.2M of $15M commitment. Fund deployment pace tracking ahead of schedule..." },
  { id: 5, title: "ESG Integration Framework Discussion", date: "Feb 8, 2026", labels: ["ESG", "Policy"], manager: "General", author: "David S.", excerpt: "Board requested formal ESG integration framework by Q2. Reviewing UNPRI alignment and manager-level ESG scoring methodology options..." },
  { id: 6, title: "Real Assets Portfolio Review", date: "Feb 10, 2026", labels: ["Performance", "Real Assets"], manager: "BlackRock Real Assets", author: "James Park", excerpt: "Infrastructure sleeve outperforming at +5.1% while real estate returning +1.2%. Discussing timber allocation reduction given softwood pricing headwinds..." },
];

const NEWS_ITEMS = [
  { id: 1, title: "Fed Signals Potential Rate Cut in March Amid Cooling Inflation Data", source: "Wall Street Journal", sourceType: "newspaper", time: "2h ago", tags: ["Macro", "Rates"], summary: "Federal Reserve officials indicated openness to a rate reduction following January CPI data showing inflation at 2.3%, closer to the 2% target." },
  { id: 2, title: "Endowment Model Under Pressure as Alts Underperform Public Markets", source: "Institutional Investor", sourceType: "newspaper", time: "4h ago", tags: ["Endowments", "Alternatives"], summary: "Several large university endowments reported fiscal year returns below 60/40 benchmarks, raising questions about illiquidity premiums." },
  { id: 3, title: "The Case for Private Credit in a Disintermediated World", source: "Matt Levine's Newsletter", sourceType: "substack", time: "6h ago", tags: ["Private Credit", "Banking"], summary: "Analysis of how bank capital requirements continue to push lending into private markets, creating opportunities for institutional allocators." },
  { id: 4, title: "Bridgewater's Co-CIO on Navigating the 'New Neutral'", source: "@RayDalio", sourceType: "x", time: "8h ago", tags: ["Macro", "Bridgewater"], summary: "Thread discussing structural shifts in neutral rates and implications for portfolio construction in the current regime." },
  { id: 5, title: "Foundation Boards Increasingly Mandate Climate-Aligned Portfolios", source: "Chronicle of Philanthropy", sourceType: "newspaper", time: "12h ago", tags: ["ESG", "Foundations"], summary: "Survey of 200 private foundations shows 47% now have formal climate investment policies, up from 28% two years ago." },
  { id: 6, title: "Why Venture Returns Will Compress (And What To Do About It)", source: "The Generalist", sourceType: "substack", time: "1d ago", tags: ["Venture Capital", "Returns"], summary: "Deep dive into the proliferation of venture capital AUM and its implications for future return expectations for institutional LPs." },
  { id: 7, title: "SEC Proposes New Private Fund Reporting Requirements", source: "Bloomberg", sourceType: "newspaper", time: "1d ago", tags: ["Regulation", "Compliance"], summary: "New Form PF amendments would require quarterly reporting for funds over $500M, affecting many endowment managers." },
  { id: 8, title: "AI-Driven Alpha: Separating Signal from Noise in Quant Strategies", source: "@CliffordAsness", sourceType: "x", time: "1d ago", tags: ["Quantitative", "AI"], summary: "AQR founder discusses the real vs. perceived impact of LLMs on systematic investment strategies." },
];

const ASSET_ALLOCATION = [
  { name: "Public Equity", value: 28, color: "#3B82F6" },
  { name: "Fixed Income", value: 12, color: "#10B981" },
  { name: "Hedge Funds", value: 18, color: "#8B5CF6" },
  { name: "Private Equity", value: 15, color: "#F59E0B" },
  { name: "Private Credit", value: 8, color: "#EF4444" },
  { name: "Real Assets", value: 11, color: "#06B6D4" },
  { name: "Venture Capital", value: 5, color: "#EC4899" },
  { name: "Cash", value: 3, color: "#6B7280" },
];

// ─── New Data: Funds ─────────────────────────────────────────────────────────

const FUNDS_DATA = [
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

// ─── New Data: Themes ────────────────────────────────────────────────────────

const THEMES_DATA = [
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

// ─── New Data: Portfolio Construction MVO ─────────────────────────────────────

const MVO_ASSET_CLASSES = [
  { name: "US Equity", expReturn: 7.8, expVol: 15.4, color: "#3B82F6" },
  { name: "Intl Equity", expReturn: 7.2, expVol: 17.2, color: "#6366F1" },
  { name: "Fixed Income", expReturn: 3.8, expVol: 5.1, color: "#10B981" },
  { name: "Hedge Funds", expReturn: 6.5, expVol: 8.8, color: "#8B5CF6" },
  { name: "Private Equity", expReturn: 10.2, expVol: 18.5, color: "#F59E0B" },
  { name: "Private Credit", expReturn: 8.1, expVol: 6.2, color: "#EF4444" },
  { name: "Real Assets", expReturn: 6.8, expVol: 10.4, color: "#06B6D4" },
  { name: "Venture Capital", expReturn: 12.5, expVol: 25.8, color: "#EC4899" },
];

const LABEL_COLORS = {
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

const SOURCE_ICONS = { newspaper: "📰", substack: "✉️", x: "𝕏" };

// ─── Shared Components ───────────────────────────────────────────────────────

function Label({ text }) {
  const cls = LABEL_COLORS[text] || "bg-gray-100 text-gray-700";
  return <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{text}</span>;
}

function StatCard({ label, value, sub, icon }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-lg flex-shrink-0">{icon}</div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function ReturnCell({ value }) {
  if (value === null || value === undefined) return <td className="px-3 py-3 text-xs text-gray-300 text-right">—</td>;
  const color = value > 0 ? "text-green-600" : value < 0 ? "text-red-600" : "text-gray-600";
  return <td className={`px-3 py-3 text-xs font-mono text-right ${color}`}>{value > 0 ? "+" : ""}{value.toFixed(1)}%</td>;
}

function MetricCell({ value, fmt, good, bad }) {
  if (value === null || value === undefined) return <td className="px-3 py-3 text-xs text-gray-300 text-right">—</td>;
  let color = "text-gray-700";
  if (good !== undefined && value >= good) color = "text-green-600";
  else if (bad !== undefined && value <= bad) color = "text-red-600";
  const display = fmt === "pct" ? `${value > 0 ? "" : ""}${value.toFixed(1)}%` : value.toFixed(2);
  return <td className={`px-3 py-3 text-xs font-mono text-right ${color}`}>{display}</td>;
}

function AllocationChart() {
  const total = ASSET_ALLOCATION.reduce((s, a) => s + a.value, 0);
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Asset Allocation</h3>
      <div className="flex rounded-lg overflow-hidden h-8 mb-4">
        {ASSET_ALLOCATION.map((a) => (
          <div key={a.name} style={{ width: `${(a.value / total) * 100}%`, backgroundColor: a.color }} className="transition-all" title={`${a.name}: ${a.value}%`} />
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {ASSET_ALLOCATION.map((a) => (
          <div key={a.name} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: a.color }} />
            <span className="text-xs text-gray-600">{a.name} <span className="font-semibold">{a.value}%</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}

function UpcomingMeetings() {
  const upcoming = MANAGERS.slice(0, 3);
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Upcoming Manager Meetings</h3>
      <div className="space-y-3">
        {upcoming.map((m) => (
          <div key={m.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <div>
              <p className="text-sm font-medium text-gray-900">{m.name}</p>
              <p className="text-xs text-gray-500">{m.strategy}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-700">{m.nextMeeting}</p>
              <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${m.status === "Confirmed" ? "bg-green-100 text-green-700" : m.status === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"}`}>{m.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentActivity() {
  const activities = [
    { icon: "📝", text: "David S. added notes on Bridgewater Q4 review", time: "1h ago" },
    { icon: "📊", text: "Ares Management Q4 performance report uploaded", time: "3h ago" },
    { icon: "✅", text: "IC approved private credit allocation increase", time: "Yesterday" },
    { icon: "📅", text: "Renaissance meeting rescheduled to Feb 20", time: "Yesterday" },
    { icon: "🔔", text: "Sequoia Fund XIV — capital call notice received", time: "2 days ago" },
  ];
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((a, i) => (
          <div key={i} className="flex items-start gap-3 py-1.5">
            <span className="text-base mt-0.5">{a.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700">{a.text}</p>
              <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Pages ───────────────────────────────────────────────────────────────────

function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Portfolio overview and activity for the Morrison Family Foundation</p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon="💰" label="Total AUM" value="$842M" sub="As of Feb 13, 2026" />
        <StatCard icon="📈" label="YTD Return" value="+5.7%" sub="Benchmark: +4.2%" />
        <StatCard icon="🤝" label="Active Managers" value="23" sub="Across 7 asset classes" />
        <StatCard icon="📅" label="Meetings This Month" value="8" sub="3 confirmed, 5 pending" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <AllocationChart />
        <UpcomingMeetings />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <RecentActivity />
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">AI Insights</h3>
          <div className="space-y-3">
            {[
              { emoji: "⚡", text: "Bridgewater's equity beta correlation has increased to 0.35 — consider reviewing hedging strategy before next meeting.", priority: "high" },
              { emoji: "📋", text: "3 manager meetings this week have no prep notes. AI can generate briefing docs from recent performance data.", priority: "medium" },
              { emoji: "📰", text: "SEC proposed new Form PF requirements may affect 12 of your 23 managers. Review compliance implications.", priority: "medium" },
              { emoji: "💡", text: "Private credit allocation approved at 8% but current is 6.5%. Suggest scheduling calls with Ares and Apollo.", priority: "low" },
            ].map((insight, i) => (
              <div key={i} className={`p-3 rounded-lg border ${insight.priority === "high" ? "border-red-200 bg-red-50" : insight.priority === "medium" ? "border-amber-200 bg-amber-50" : "border-blue-200 bg-blue-50"}`}>
                <p className="text-sm text-gray-700"><span className="mr-1.5">{insight.emoji}</span>{insight.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Funds Page ──────────────────────────────────────────────────────────────

function FundsPage() {
  const [sortField, setSortField] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [expandedFund, setExpandedFund] = useState(null);
  const [filterClass, setFilterClass] = useState("all");

  const assetClasses = useMemo(() => ["all", ...new Set(FUNDS_DATA.map((f) => f.assetClass))], []);

  const sorted = useMemo(() => {
    let data = filterClass === "all" ? [...FUNDS_DATA] : FUNDS_DATA.filter((f) => f.assetClass === filterClass);
    data.sort((a, b) => {
      let va = a[sortField], vb = b[sortField];
      if (va === null) return 1;
      if (vb === null) return -1;
      if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir === "asc" ? va - vb : vb - va;
    });
    return data;
  }, [sortField, sortDir, filterClass]);

  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  };

  const SortHeader = ({ field, children, className = "" }) => (
    <th onClick={() => handleSort(field)} className={`px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700 select-none ${className}`}>
      <div className="flex items-center gap-1 justify-end">
        {children}
        {sortField === field && <span className="text-indigo-500">{sortDir === "asc" ? "↑" : "↓"}</span>}
      </div>
    </th>
  );

  const totalAlloc = sorted.reduce((s, f) => s + parseFloat(f.allocation.replace(/[^0-9.]/g, "")), 0);
  const avgSharpe = sorted.reduce((s, f) => s + f.sharpe, 0) / sorted.length;
  const avgYTD = sorted.reduce((s, f) => s + f.retYTD, 0) / sorted.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Funds</h1>
        <p className="text-sm text-gray-500 mt-1">Detailed performance analytics across all portfolio holdings</p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon="🏦" label="Total Funds" value={sorted.length.toString()} sub={`${assetClasses.length - 1} asset classes`} />
        <StatCard icon="💵" label="Allocated Capital" value={`$${totalAlloc.toFixed(1)}M`} sub="Across all funds" />
        <StatCard icon="📈" label="Avg YTD Return" value={`${avgYTD > 0 ? "+" : ""}${avgYTD.toFixed(1)}%`} sub="Weighted by allocation" />
        <StatCard icon="⚡" label="Avg Sharpe Ratio" value={avgSharpe.toFixed(2)} sub="Risk-adjusted returns" />
      </div>
      <div className="flex gap-2 items-center">
        <span className="text-xs text-gray-500 font-medium">Filter:</span>
        {assetClasses.map((ac) => (
          <button key={ac} onClick={() => setFilterClass(ac)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterClass === ac ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {ac === "all" ? "All Classes" : ac}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left w-56">Fund</th>
                <th className="px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left">Class</th>
                <SortHeader field="ret1M">1M</SortHeader>
                <SortHeader field="ret3M">3M</SortHeader>
                <SortHeader field="retYTD">YTD</SortHeader>
                <SortHeader field="ret1Y">1Y</SortHeader>
                <SortHeader field="ret3Y">3Y</SortHeader>
                <SortHeader field="ret5Y">5Y</SortHeader>
                <SortHeader field="volatility">Vol</SortHeader>
                <SortHeader field="sharpe">Sharpe</SortHeader>
                <SortHeader field="sortino">Sortino</SortHeader>
                <SortHeader field="maxDD">Max DD</SortHeader>
                <SortHeader field="alpha">Alpha</SortHeader>
                <SortHeader field="beta">Beta</SortHeader>
                <th className="px-3 py-2.5 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sorted.map((fund) => (
                <React.Fragment key={fund.id}>
                  <tr className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setExpandedFund(expandedFund === fund.id ? null : fund.id)}>
                    <td className="px-3 py-3">
                      <p className="text-sm font-medium text-gray-900">{fund.name}</p>
                      <p className="text-xs text-gray-400">{fund.manager}</p>
                    </td>
                    <td className="px-3 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">{fund.assetClass}</span></td>
                    <ReturnCell value={fund.ret1M} />
                    <ReturnCell value={fund.ret3M} />
                    <ReturnCell value={fund.retYTD} />
                    <ReturnCell value={fund.ret1Y} />
                    <ReturnCell value={fund.ret3Y} />
                    <ReturnCell value={fund.ret5Y} />
                    <MetricCell value={fund.volatility} fmt="pct" />
                    <MetricCell value={fund.sharpe} good={1.0} bad={0.5} />
                    <MetricCell value={fund.sortino} good={1.5} bad={0.5} />
                    <td className={`px-3 py-3 text-xs font-mono text-right text-red-600`}>{fund.maxDD.toFixed(1)}%</td>
                    <MetricCell value={fund.alpha} good={3.0} bad={0} />
                    <MetricCell value={fund.beta} />
                    <td className="px-3 py-3 text-gray-400 text-xs">{expandedFund === fund.id ? "▲" : "▼"}</td>
                  </tr>
                  {expandedFund === fund.id && (
                    <tr>
                      <td colSpan={15} className="bg-gray-50 px-6 py-4">
                        <div className="grid grid-cols-4 gap-6">
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Fund Details</h4>
                            <div className="space-y-1 text-xs text-gray-600">
                              <p>Strategy: <span className="font-medium text-gray-800">{fund.strategy}</span></p>
                              <p>Inception: <span className="font-medium text-gray-800">{fund.inception}</span></p>
                              <p>Fund AUM: <span className="font-medium text-gray-800">{fund.aum}</span></p>
                              <p>Our Allocation: <span className="font-medium text-gray-800">{fund.allocation}</span></p>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Risk Metrics</h4>
                            <div className="space-y-1 text-xs text-gray-600">
                              <p>Information Ratio: <span className="font-medium text-gray-800">{fund.infoRatio.toFixed(2)}</span></p>
                              <p>Calmar Ratio: <span className="font-medium text-gray-800">{fund.calmar.toFixed(2)}</span></p>
                              <p>Up Capture: <span className="font-medium text-green-600">{fund.upCapture}%</span></p>
                              <p>Down Capture: <span className="font-medium text-red-600">{fund.downCapture}%</span></p>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Correlation</h4>
                            <div className="space-y-1 text-xs text-gray-600">
                              <p>Equity Correlation: <span className="font-medium text-gray-800">{fund.correlation.toFixed(2)}</span></p>
                              <div className="mt-2 bg-gray-200 rounded-full h-2 w-full">
                                <div className="h-2 rounded-full" style={{ width: `${fund.correlation * 100}%`, backgroundColor: fund.correlation > 0.7 ? "#EF4444" : fund.correlation > 0.4 ? "#F59E0B" : "#10B981" }} />
                              </div>
                              <p className="text-gray-400 mt-1">{fund.correlation < 0.3 ? "Low" : fund.correlation < 0.6 ? "Moderate" : "High"} correlation to equities</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Quick Actions</h4>
                            <div className="space-y-1.5">
                              <button className="w-full text-left px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-lg hover:bg-indigo-200">🤖 AI Performance Analysis</button>
                              <button className="w-full text-left px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">📊 Full Fact Sheet</button>
                              <button className="w-full text-left px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">📝 View Notes ({NOTES.filter(n => n.manager === fund.manager).length})</button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Themes Page ─────────────────────────────────────────────────────────────

function ThemesPage() {
  const [selectedTheme, setSelectedTheme] = useState(null);

  const urgencyColor = { high: "border-red-300 bg-red-50", medium: "border-amber-300 bg-amber-50", low: "border-blue-300 bg-blue-50" };
  const urgencyBadge = { high: "bg-red-100 text-red-700", medium: "bg-amber-100 text-amber-700", low: "bg-blue-100 text-blue-700" };
  const trendIcon = { up: "📈", down: "📉", flat: "➡️" };
  const sourceIcon = { note: "📝", newsletter: "✉️", news: "📰", letter: "📄" };

  const theme = selectedTheme ? THEMES_DATA.find((t) => t.id === selectedTheme) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Themes</h1>
        <p className="text-sm text-gray-500 mt-1">AI-synthesized investment themes from notes, newsletters, and hedge fund letters</p>
      </div>
      <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
        <div className="flex items-start gap-3">
          <span className="text-xl">🤖</span>
          <div>
            <h3 className="text-sm font-semibold text-indigo-900">AI Theme Engine</h3>
            <p className="text-xs text-indigo-700 mt-1">Themes are automatically generated by analyzing patterns across your internal notes, subscribed newsletters, hedge fund investor letters, and market news. Sources are linked and updated in real time.</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1 space-y-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Active Themes ({THEMES_DATA.length})</h3>
          {THEMES_DATA.map((t) => (
            <button key={t.id} onClick={() => setSelectedTheme(t.id)} className={`w-full text-left p-4 rounded-xl border transition-all ${selectedTheme === t.id ? "border-indigo-500 bg-indigo-50 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"}`}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-gray-900 leading-snug">{t.name}</p>
                <span className="text-base flex-shrink-0">{trendIcon[t.trend]}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${urgencyBadge[t.urgency]}`}>{t.urgency}</span>
                <span className="text-xs text-gray-400">{t.sources.length} sources</span>
                <span className="text-xs text-gray-400">· {t.relatedFunds.length} funds</span>
              </div>
            </button>
          ))}
        </div>
        <div className="col-span-2">
          {theme ? (
            <div className="space-y-4">
              <div className={`rounded-xl border p-6 ${urgencyColor[theme.urgency]}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{trendIcon[theme.trend]}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${urgencyBadge[theme.urgency]}`}>{theme.urgency} priority</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{theme.name}</h2>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-3 leading-relaxed">{theme.summary}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">📂 Linked Sources</h3>
                <div className="space-y-2">
                  {theme.sources.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                      <span className="text-base">{sourceIcon[s.type]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{s.title}</p>
                        <p className="text-xs text-gray-400">{s.source || s.author}{s.date ? ` · ${s.date}` : ""}</p>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">{s.type}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">🏦 Related Funds</h3>
                <div className="flex flex-wrap gap-2">
                  {theme.relatedFunds.map((f, i) => {
                    const fund = FUNDS_DATA.find((fd) => fd.name === f);
                    return (
                      <div key={i} className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50">
                        <p className="text-xs font-medium text-gray-800">{f}</p>
                        {fund && <p className="text-xs text-gray-400 mt-0.5">YTD: <span className={fund.retYTD >= 0 ? "text-green-600" : "text-red-600"}>{fund.retYTD > 0 ? "+" : ""}{fund.retYTD}%</span> · Sharpe: {fund.sharpe.toFixed(2)}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="bg-violet-50 rounded-xl border border-violet-200 p-5">
                <h3 className="text-sm font-semibold text-violet-900 mb-2">🤖 AI Recommendation</h3>
                <p className="text-sm text-violet-800 leading-relaxed">{theme.aiInsight}</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center py-24 text-gray-400">
              <p className="text-4xl mb-3">🧠</p>
              <p className="text-sm">Select a theme to explore linked sources and AI insights</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Portfolio Construction (MVO) Page ───────────────────────────────────────

function PortfolioConstructionPage() {
  const [weights, setWeights] = useState({
    "US Equity": 20, "Intl Equity": 8, "Fixed Income": 12, "Hedge Funds": 18,
    "Private Equity": 15, "Private Credit": 8, "Real Assets": 11, "Venture Capital": 5,
  });
  const [cash, setCash] = useState(3);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const totalAllocated = Object.values(weights).reduce((s, v) => s + v, 0) + cash;

  const handleWeightChange = (name, value) => {
    const numVal = Math.max(0, Math.min(100, parseInt(value) || 0));
    setWeights((prev) => ({ ...prev, [name]: numVal }));
  };

  // Calculate portfolio expected return and volatility (simplified — no covariance)
  const calcPortfolio = useCallback((w) => {
    let totalW = Object.values(w).reduce((s, v) => s + v, 0) + cash;
    if (totalW === 0) return { ret: 0, vol: 0 };
    let expRet = 0, expVol2 = 0;
    MVO_ASSET_CLASSES.forEach((ac) => {
      const wt = (w[ac.name] || 0) / totalW;
      expRet += wt * ac.expReturn;
      expVol2 += (wt * ac.expVol) ** 2;
    });
    // Add cross-correlation approximation (avg corr ~0.3)
    MVO_ASSET_CLASSES.forEach((a, i) => {
      MVO_ASSET_CLASSES.forEach((b, j) => {
        if (i < j) {
          const wa = (w[a.name] || 0) / totalW;
          const wb = (w[b.name] || 0) / totalW;
          expVol2 += 2 * wa * wb * a.expVol * b.expVol * 0.25;
        }
      });
    });
    return { ret: expRet, vol: Math.sqrt(expVol2) };
  }, [cash]);

  const currentPortfolio = useMemo(() => calcPortfolio(weights), [weights, calcPortfolio]);

  // Generate efficient frontier points
  const frontierPoints = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      // Interpolate from conservative to aggressive
      const w = {};
      MVO_ASSET_CLASSES.forEach((ac) => {
        if (ac.name === "Fixed Income") w[ac.name] = 40 * (1 - t) + 2 * t;
        else if (ac.name === "US Equity") w[ac.name] = 15 * (1 - t) + 30 * t;
        else if (ac.name === "Private Equity") w[ac.name] = 2 * (1 - t) + 25 * t;
        else if (ac.name === "Venture Capital") w[ac.name] = 0 * (1 - t) + 15 * t;
        else if (ac.name === "Hedge Funds") w[ac.name] = 15 * (1 - t) + 12 * t;
        else if (ac.name === "Private Credit") w[ac.name] = 15 * (1 - t) + 5 * t;
        else if (ac.name === "Real Assets") w[ac.name] = 8 * (1 - t) + 8 * t;
        else if (ac.name === "Intl Equity") w[ac.name] = 5 * (1 - t) + 3 * t;
      });
      points.push(calcPortfolio(w));
    }
    return points;
  }, [calcPortfolio]);

  // Optimal (max Sharpe) portfolio
  const optimalPortfolio = useMemo(() => {
    let best = { ret: 0, vol: 1, sharpe: 0 };
    frontierPoints.forEach((p) => {
      const sharpe = p.vol > 0 ? (p.ret - 2.5) / p.vol : 0;
      if (sharpe > best.sharpe) best = { ...p, sharpe };
    });
    return best;
  }, [frontierPoints]);

  // SVG chart dimensions
  const W = 640, H = 380, PAD = 50;
  const minVol = 2, maxVol = 18, minRet = 2, maxRet = 12;
  const xScale = (v) => PAD + ((v - minVol) / (maxVol - minVol)) * (W - PAD * 2);
  const yScale = (r) => H - PAD - ((r - minRet) / (maxRet - minRet)) * (H - PAD * 2);

  const currentSharpe = currentPortfolio.vol > 0 ? (currentPortfolio.ret - 2.5) / currentPortfolio.vol : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Portfolio Construction</h1>
        <p className="text-sm text-gray-500 mt-1">Mean-Variance Optimization with manual weight adjustments</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon="🎯" label="Expected Return" value={`${currentPortfolio.ret.toFixed(1)}%`} sub="Annualized" />
        <StatCard icon="📊" label="Expected Volatility" value={`${currentPortfolio.vol.toFixed(1)}%`} sub="Annualized std dev" />
        <StatCard icon="⚡" label="Implied Sharpe" value={currentSharpe.toFixed(2)} sub={`Optimal: ${optimalPortfolio.sharpe.toFixed(2)}`} />
      </div>
      <div className="grid grid-cols-5 gap-4">
        {/* Chart: 3 cols */}
        <div className="col-span-3 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-700">Efficient Frontier</h3>
            <div className="flex gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" /> Efficient Frontier</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Current Portfolio</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Max Sharpe</span>
            </div>
          </div>
          <svg width={W} height={H} className="w-full" viewBox={`0 0 ${W} ${H}`}>
            {/* Grid */}
            {[4, 6, 8, 10].map((r) => (
              <g key={`r${r}`}>
                <line x1={PAD} y1={yScale(r)} x2={W - PAD} y2={yScale(r)} stroke="#E5E7EB" strokeDasharray="4" />
                <text x={PAD - 8} y={yScale(r) + 4} textAnchor="end" className="text-xs" fill="#9CA3AF" fontSize="10">{r}%</text>
              </g>
            ))}
            {[4, 6, 8, 10, 12, 14, 16].map((v) => (
              <g key={`v${v}`}>
                <line x1={xScale(v)} y1={PAD} x2={xScale(v)} y2={H - PAD} stroke="#E5E7EB" strokeDasharray="4" />
                <text x={xScale(v)} y={H - PAD + 16} textAnchor="middle" fill="#9CA3AF" fontSize="10">{v}%</text>
              </g>
            ))}
            {/* Axis labels */}
            <text x={W / 2} y={H - 6} textAnchor="middle" fill="#6B7280" fontSize="11" fontWeight="500">Volatility (annualized)</text>
            <text x={14} y={H / 2} textAnchor="middle" fill="#6B7280" fontSize="11" fontWeight="500" transform={`rotate(-90, 14, ${H / 2})`}>Expected Return</text>

            {/* Efficient frontier curve */}
            <path d={frontierPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.vol)} ${yScale(p.ret)}`).join(" ")} fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" />

            {/* Individual asset class points */}
            {MVO_ASSET_CLASSES.map((ac) => (
              <g key={ac.name} onMouseEnter={() => setHoveredPoint(ac.name)} onMouseLeave={() => setHoveredPoint(null)}>
                <circle cx={xScale(ac.expVol)} cy={yScale(ac.expReturn)} r={hoveredPoint === ac.name ? 7 : 5} fill={ac.color} opacity={0.7} stroke="white" strokeWidth="1.5" className="transition-all cursor-pointer" />
                {hoveredPoint === ac.name && (
                  <g>
                    <rect x={xScale(ac.expVol) - 50} y={yScale(ac.expReturn) - 32} width={100} height={22} rx={4} fill="#1F2937" opacity={0.9} />
                    <text x={xScale(ac.expVol)} y={yScale(ac.expReturn) - 17} textAnchor="middle" fill="white" fontSize="10">{ac.name}: {ac.expReturn}% / {ac.expVol}%</text>
                  </g>
                )}
              </g>
            ))}

            {/* Capital Market Line (from risk-free to optimal) */}
            <line x1={xScale(0)} y1={yScale(2.5)} x2={xScale(optimalPortfolio.vol * 2)} y2={yScale(2.5 + optimalPortfolio.sharpe * optimalPortfolio.vol * 2)} stroke="#F59E0B" strokeWidth="1" strokeDasharray="6 3" opacity={0.5} />

            {/* Optimal portfolio point */}
            <circle cx={xScale(optimalPortfolio.vol)} cy={yScale(optimalPortfolio.ret)} r={8} fill="none" stroke="#F59E0B" strokeWidth="2.5" />
            <circle cx={xScale(optimalPortfolio.vol)} cy={yScale(optimalPortfolio.ret)} r={3.5} fill="#F59E0B" />

            {/* Current portfolio point */}
            <circle cx={xScale(currentPortfolio.vol)} cy={yScale(currentPortfolio.ret)} r={9} fill="none" stroke="#10B981" strokeWidth="2.5" />
            <circle cx={xScale(currentPortfolio.vol)} cy={yScale(currentPortfolio.ret)} r={4} fill="#10B981" />

            {/* Labels for current and optimal */}
            <text x={xScale(currentPortfolio.vol) + 14} y={yScale(currentPortfolio.ret) + 4} fill="#10B981" fontSize="10" fontWeight="600">Current</text>
            <text x={xScale(optimalPortfolio.vol) + 14} y={yScale(optimalPortfolio.ret) + 4} fill="#F59E0B" fontSize="10" fontWeight="600">Max Sharpe</text>
          </svg>
        </div>
        {/* Weights panel: 2 cols */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-700">Allocation Weights</h3>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${totalAllocated === 100 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{totalAllocated}% / 100%</span>
          </div>
          <div className="space-y-3">
            {MVO_ASSET_CLASSES.map((ac) => (
              <div key={ac.name} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: ac.color }} />
                <span className="text-xs text-gray-700 w-28 flex-shrink-0">{ac.name}</span>
                <input type="range" min="0" max="50" value={weights[ac.name]} onChange={(e) => handleWeightChange(ac.name, e.target.value)} className="flex-1 h-1.5 accent-indigo-600" />
                <input type="number" min="0" max="100" value={weights[ac.name]} onChange={(e) => handleWeightChange(ac.name, e.target.value)} className="w-14 text-xs text-right font-mono border border-gray-300 rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                <span className="text-xs text-gray-400 w-3">%</span>
              </div>
            ))}
            {/* Cash row */}
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              <div className="w-3 h-3 rounded-sm flex-shrink-0 bg-gray-400" />
              <span className="text-xs text-gray-700 w-28 flex-shrink-0">Cash</span>
              <input type="range" min="0" max="20" value={cash} onChange={(e) => setCash(parseInt(e.target.value) || 0)} className="flex-1 h-1.5 accent-gray-500" />
              <input type="number" min="0" max="100" value={cash} onChange={(e) => setCash(Math.max(0, parseInt(e.target.value) || 0))} className="w-14 text-xs text-right font-mono border border-gray-300 rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              <span className="text-xs text-gray-400 w-3">%</span>
            </div>
          </div>
          {totalAllocated !== 100 && (
            <div className="mt-3 p-2.5 rounded-lg bg-amber-50 border border-amber-200">
              <p className="text-xs text-amber-700">Weights sum to {totalAllocated}%. Adjust to reach 100% for accurate optimization.</p>
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
            <h4 className="text-xs font-semibold text-gray-500 uppercase">Portfolio Metrics</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-gray-50 rounded">
                <p className="text-gray-400">Expected Return</p>
                <p className="font-semibold text-gray-800">{currentPortfolio.ret.toFixed(2)}%</p>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <p className="text-gray-400">Expected Vol</p>
                <p className="font-semibold text-gray-800">{currentPortfolio.vol.toFixed(2)}%</p>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <p className="text-gray-400">Sharpe Ratio</p>
                <p className="font-semibold text-gray-800">{currentSharpe.toFixed(2)}</p>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <p className="text-gray-400">Ret / Vol</p>
                <p className="font-semibold text-gray-800">{currentPortfolio.vol > 0 ? (currentPortfolio.ret / currentPortfolio.vol).toFixed(2) : "—"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Existing Pages (Meeting Prep, Notes, News) ─────────────────────────────

function MeetingPrepPage() {
  const [selectedManager, setSelectedManager] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState({});

  const handleGenerate = (id) => {
    setGenerating(true);
    setSelectedManager(id);
    setTimeout(() => {
      setGenerated((prev) => ({ ...prev, [id]: true }));
      setGenerating(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meeting Prep</h1>
        <p className="text-sm text-gray-500 mt-1">AI-assisted briefing materials for upcoming manager meetings</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1 space-y-3">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Upcoming Meetings</h3>
          {MANAGERS.map((m) => (
            <button key={m.id} onClick={() => setSelectedManager(m.id)} className={`w-full text-left p-4 rounded-xl border transition-all ${selectedManager === m.id ? "border-indigo-500 bg-indigo-50 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{m.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{m.strategy}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.status === "Confirmed" ? "bg-green-100 text-green-700" : m.status === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"}`}>{m.status}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">📅 {m.nextMeeting}</p>
              <div className="flex gap-3 mt-2 text-xs text-gray-500">
                <span>Allocation: {m.allocation}%</span>
                <span>YTD: <span className={m.returnYTD >= 0 ? "text-green-600" : "text-red-600"}>{m.returnYTD > 0 ? "+" : ""}{m.returnYTD}%</span></span>
              </div>
            </button>
          ))}
        </div>
        <div className="col-span-2">
          {selectedManager ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              {(() => {
                const mgr = MANAGERS.find((m) => m.id === selectedManager);
                return (
                  <>
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{mgr.name}</h2>
                        <p className="text-sm text-gray-500">{mgr.strategy} · AUM: {mgr.aum} · Meeting: {mgr.nextMeeting}</p>
                      </div>
                      <button onClick={() => handleGenerate(mgr.id)} disabled={generating} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2">
                        {generating && selectedManager === mgr.id ? (
                          <><span className="animate-spin">⏳</span> Generating...</>
                        ) : generated[mgr.id] ? (
                          <><span>✨</span> Regenerate Briefing</>
                        ) : (
                          <><span>🤖</span> Generate AI Briefing</>
                        )}
                      </button>
                    </div>
                    {generated[mgr.id] && (
                      <div className="space-y-4 animate-in">
                        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                          <h4 className="text-sm font-semibold text-indigo-900 mb-2">📋 AI-Generated Briefing Summary</h4>
                          <p className="text-sm text-indigo-800 leading-relaxed">Based on analysis of {mgr.notes} internal notes, recent performance data, and market intelligence, here are the key discussion points for your upcoming meeting with {mgr.name}:</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">🎯 Key Discussion Points</h4>
                            <ul className="text-sm text-gray-600 space-y-1.5">
                              <li>• YTD performance attribution and driver analysis</li>
                              <li>• Portfolio positioning changes since last meeting</li>
                              <li>• Risk factor exposure review (equity beta, duration)</li>
                              <li>• Capacity and fee structure discussion</li>
                            </ul>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">⚠️ Flags & Concerns</h4>
                            <ul className="text-sm text-gray-600 space-y-1.5">
                              <li>• Rising correlation to public equity benchmarks</li>
                              <li>• Key personnel change in risk management</li>
                              <li>• Peer group underperformance in current quarter</li>
                              <li>• Regulatory changes affecting strategy capacity</li>
                            </ul>
                          </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">📰 Relevant News & Market Context</h4>
                          <ul className="text-sm text-gray-600 space-y-1.5">
                            <li>• Fed rate cut signals may impact {mgr.strategy.toLowerCase()} strategies</li>
                            <li>• SEC Form PF proposals could affect quarterly reporting requirements</li>
                            <li>• Peer funds in {mgr.strategy.toLowerCase()} space averaged +{(Math.random() * 5 + 2).toFixed(1)}% YTD</li>
                          </ul>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">📂 Related Internal Notes ({mgr.notes})</h4>
                          {NOTES.filter((n) => n.manager === mgr.name || n.manager === "General").slice(0, 2).map((n) => (
                            <div key={n.id} className="mt-2 p-2 bg-white rounded border border-gray-100">
                              <p className="text-sm font-medium text-gray-800">{n.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{n.date} · {n.author}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {!generated[mgr.id] && !generating && (
                      <div className="text-center py-16 text-gray-400">
                        <p className="text-4xl mb-3">🤖</p>
                        <p className="text-sm">Click "Generate AI Briefing" to create a comprehensive meeting prep package</p>
                        <p className="text-xs mt-1">Pulls from internal notes, performance data, and market news</p>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center py-24 text-gray-400">
              <p className="text-4xl mb-3">👈</p>
              <p className="text-sm">Select a manager to view meeting details and generate AI briefings</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NotesPage() {
  const [search, setSearch] = useState("");
  const [activeLabel, setActiveLabel] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);

  const allLabels = useMemo(() => [...new Set(NOTES.flatMap((n) => n.labels))].sort(), []);

  const filtered = useMemo(() => {
    return NOTES.filter((n) => {
      const matchesSearch = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.excerpt.toLowerCase().includes(search.toLowerCase());
      const matchesLabel = !activeLabel || n.labels.includes(activeLabel);
      return matchesSearch && matchesLabel;
    });
  }, [search, activeLabel]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
          <p className="text-sm text-gray-500 mt-1">AI-organized and labeled meeting notes, memos, and research</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 flex items-center gap-2">
          <span>+</span> New Note
        </button>
      </div>
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-md">
          <input type="text" placeholder="Search notes..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
          <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button onClick={() => setActiveLabel(null)} className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${!activeLabel ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>All</button>
          {allLabels.map((label) => (
            <button key={label} onClick={() => setActiveLabel(activeLabel === label ? null : label)} className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${activeLabel === label ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{label}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1 space-y-2">
          {filtered.map((note) => (
            <button key={note.id} onClick={() => setSelectedNote(note.id)} className={`w-full text-left p-4 rounded-xl border transition-all ${selectedNote === note.id ? "border-indigo-500 bg-indigo-50 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"}`}>
              <p className="text-sm font-semibold text-gray-900 line-clamp-2">{note.title}</p>
              <p className="text-xs text-gray-500 mt-1">{note.date} · {note.author}</p>
              <div className="flex gap-1 mt-2 flex-wrap">{note.labels.map((l) => <Label key={l} text={l} />)}</div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">No notes match your filters</div>
          )}
        </div>
        <div className="col-span-2">
          {selectedNote ? (
            (() => {
              const note = NOTES.find((n) => n.id === selectedNote);
              return (
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                  <div>
                    <div className="flex gap-1.5 mb-2">{note.labels.map((l) => <Label key={l} text={l} />)}</div>
                    <h2 className="text-xl font-bold text-gray-900">{note.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">{note.date} · {note.author} · {note.manager}</p>
                  </div>
                  <div className="p-4 bg-violet-50 rounded-lg border border-violet-200">
                    <h4 className="text-sm font-semibold text-violet-900 mb-1">🏷️ AI Auto-Labels</h4>
                    <p className="text-xs text-violet-700">This note was automatically categorized based on content analysis. Labels: {note.labels.join(", ")}. Linked to manager: {note.manager}.</p>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-sm text-gray-700 leading-relaxed">{note.excerpt}</p>
                    <p className="text-sm text-gray-400 mt-4 italic">[Full note content would appear here with rich text formatting, embedded tables, and linked documents]</p>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">✏️ Edit</button>
                    <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">🔗 Link to Manager</button>
                    <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">📤 Share</button>
                    <button className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-100 rounded-lg hover:bg-indigo-200">🤖 AI Summarize</button>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center py-24 text-gray-400">
              <p className="text-4xl mb-3">📝</p>
              <p className="text-sm">Select a note to view its contents</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NewsPage() {
  const [sourceFilter, setSourceFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState(null);

  const allTags = useMemo(() => [...new Set(NEWS_ITEMS.flatMap((n) => n.tags))].sort(), []);

  const filtered = useMemo(() => {
    return NEWS_ITEMS.filter((n) => {
      const matchesSource = sourceFilter === "all" || n.sourceType === sourceFilter;
      const matchesTag = !tagFilter || n.tags.includes(tagFilter);
      return matchesSource && matchesTag;
    });
  }, [sourceFilter, tagFilter]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">News & Intelligence</h1>
          <p className="text-sm text-gray-500 mt-1">AI-curated daily updates from newspapers, X, Substack, and more</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 flex items-center gap-2">⚙️ Configure Sources</button>
          <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 flex items-center gap-2">📧 Send Daily Digest</button>
        </div>
      </div>
      <div className="flex gap-3 items-center flex-wrap">
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          {[{ key: "all", label: "All Sources" }, { key: "newspaper", label: "📰 News" }, { key: "x", label: "𝕏 Posts" }, { key: "substack", label: "✉️ Substack" }].map((s) => (
            <button key={s.key} onClick={() => setSourceFilter(s.key)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${sourceFilter === s.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}>{s.label}</button>
          ))}
        </div>
        <div className="h-5 w-px bg-gray-300" />
        <div className="flex gap-1.5 flex-wrap">
          {allTags.map((tag) => (
            <button key={tag} onClick={() => setTagFilter(tagFilter === tag ? null : tag)} className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${tagFilter === tag ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{tag}</button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-all cursor-pointer">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-base">{SOURCE_ICONS[item.sourceType]}</span>
                  <span className="text-xs font-medium text-gray-500">{item.source}</span>
                  <span className="text-xs text-gray-400">· {item.time}</span>
                </div>
                <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{item.summary}</p>
                <div className="flex gap-1.5 mt-3">{item.tags.map((t) => <Label key={t} text={t} />)}</div>
              </div>
              <div className="flex flex-col gap-1.5 ml-4">
                <button className="px-2.5 py-1 text-xs font-medium text-gray-500 bg-gray-50 rounded-lg hover:bg-gray-100 whitespace-nowrap">🤖 AI Brief</button>
                <button className="px-2.5 py-1 text-xs font-medium text-gray-500 bg-gray-50 rounded-lg hover:bg-gray-100 whitespace-nowrap">📌 Save</button>
                <button className="px-2.5 py-1 text-xs font-medium text-gray-500 bg-gray-50 rounded-lg hover:bg-gray-100 whitespace-nowrap">🔗 Link</button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">No news items match your filters</div>
        )}
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: "📊" },
  { key: "funds", label: "Funds", icon: "🏦" },
  { key: "themes", label: "Themes", icon: "🧠" },
  { key: "portfolio", label: "Portfolio", icon: "⚖️" },
  { key: "meetings", label: "Meeting Prep", icon: "🤝" },
  { key: "notes", label: "Notes", icon: "📝" },
  { key: "news", label: "News", icon: "📰" },
];

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className="w-60 bg-slate-900 text-white flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-sm font-bold">S</div>
            <div>
              <h1 className="text-sm font-bold tracking-tight">Swen</h1>
              <p className="text-xs text-slate-400">Intelligence Platform</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button key={item.key} onClick={() => setActivePage(item.key)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activePage === item.key ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}>
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-700">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-indigo-400 flex items-center justify-center text-xs font-bold">DS</div>
            <div>
              <p className="text-sm font-medium text-slate-200">David S.</p>
              <p className="text-xs text-slate-400">CIO</p>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          {activePage === "dashboard" && <DashboardPage />}
          {activePage === "funds" && <FundsPage />}
          {activePage === "themes" && <ThemesPage />}
          {activePage === "portfolio" && <PortfolioConstructionPage />}
          {activePage === "meetings" && <MeetingPrepPage />}
          {activePage === "notes" && <NotesPage />}
          {activePage === "news" && <NewsPage />}
        </div>
      </div>
    </div>
  );
}