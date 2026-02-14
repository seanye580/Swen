"use client";

import { useState, useMemo, useCallback } from "react";
import { MVO_ASSET_CLASSES } from "@/lib/data";
import { StatCard } from "@/components/shared";

export default function PortfolioConstructionPage() {
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

  const calcPortfolio = useCallback((w) => {
    let totalW = Object.values(w).reduce((s, v) => s + v, 0) + cash;
    if (totalW === 0) return { ret: 0, vol: 0 };
    let expRet = 0, expVol2 = 0;
    MVO_ASSET_CLASSES.forEach((ac) => {
      const wt = (w[ac.name] || 0) / totalW;
      expRet += wt * ac.expReturn;
      expVol2 += (wt * ac.expVol) ** 2;
    });
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

  const frontierPoints = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
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

  const optimalPortfolio = useMemo(() => {
    let best = { ret: 0, vol: 1, sharpe: 0 };
    frontierPoints.forEach((p) => {
      const sharpe = p.vol > 0 ? (p.ret - 2.5) / p.vol : 0;
      if (sharpe > best.sharpe) best = { ...p, sharpe };
    });
    return best;
  }, [frontierPoints]);

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
            {[4, 6, 8, 10].map((r) => (
              <g key={`r${r}`}>
                <line x1={PAD} y1={yScale(r)} x2={W - PAD} y2={yScale(r)} stroke="#E5E7EB" strokeDasharray="4" />
                <text x={PAD - 8} y={yScale(r) + 4} textAnchor="end" fill="#9CA3AF" fontSize="10">{r}%</text>
              </g>
            ))}
            {[4, 6, 8, 10, 12, 14, 16].map((v) => (
              <g key={`v${v}`}>
                <line x1={xScale(v)} y1={PAD} x2={xScale(v)} y2={H - PAD} stroke="#E5E7EB" strokeDasharray="4" />
                <text x={xScale(v)} y={H - PAD + 16} textAnchor="middle" fill="#9CA3AF" fontSize="10">{v}%</text>
              </g>
            ))}
            <text x={W / 2} y={H - 6} textAnchor="middle" fill="#6B7280" fontSize="11" fontWeight="500">Volatility (annualized)</text>
            <text x={14} y={H / 2} textAnchor="middle" fill="#6B7280" fontSize="11" fontWeight="500" transform={`rotate(-90, 14, ${H / 2})`}>Expected Return</text>
            <path d={frontierPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.vol)} ${yScale(p.ret)}`).join(" ")} fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" />
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
            <line x1={xScale(0)} y1={yScale(2.5)} x2={xScale(optimalPortfolio.vol * 2)} y2={yScale(2.5 + optimalPortfolio.sharpe * optimalPortfolio.vol * 2)} stroke="#F59E0B" strokeWidth="1" strokeDasharray="6 3" opacity={0.5} />
            <circle cx={xScale(optimalPortfolio.vol)} cy={yScale(optimalPortfolio.ret)} r={8} fill="none" stroke="#F59E0B" strokeWidth="2.5" />
            <circle cx={xScale(optimalPortfolio.vol)} cy={yScale(optimalPortfolio.ret)} r={3.5} fill="#F59E0B" />
            <circle cx={xScale(currentPortfolio.vol)} cy={yScale(currentPortfolio.ret)} r={9} fill="none" stroke="#10B981" strokeWidth="2.5" />
            <circle cx={xScale(currentPortfolio.vol)} cy={yScale(currentPortfolio.ret)} r={4} fill="#10B981" />
            <text x={xScale(currentPortfolio.vol) + 14} y={yScale(currentPortfolio.ret) + 4} fill="#10B981" fontSize="10" fontWeight="600">Current</text>
            <text x={xScale(optimalPortfolio.vol) + 14} y={yScale(optimalPortfolio.ret) + 4} fill="#F59E0B" fontSize="10" fontWeight="600">Max Sharpe</text>
          </svg>
        </div>
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
