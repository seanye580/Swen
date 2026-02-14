"use client";

import { Fragment, useState, useMemo } from "react";
import { FUNDS_DATA, NOTES } from "@/lib/data";
import { StatCard, ReturnCell, MetricCell } from "@/components/shared";

export default function FundsPage() {
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
                <Fragment key={fund.id}>
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
                    <td className="px-3 py-3 text-xs font-mono text-right text-red-600">{fund.maxDD.toFixed(1)}%</td>
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
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
