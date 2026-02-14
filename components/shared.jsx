"use client";

import { LABEL_COLORS, ASSET_ALLOCATION, MANAGERS, NOTES } from "@/lib/data";

export function Label({ text }) {
  const cls = LABEL_COLORS[text] || "bg-gray-100 text-gray-700";
  return <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{text}</span>;
}

export function StatCard({ label, value, sub, icon }) {
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

export function ReturnCell({ value }) {
  if (value === null || value === undefined) return <td className="px-3 py-3 text-xs text-gray-300 text-right">—</td>;
  const color = value > 0 ? "text-green-600" : value < 0 ? "text-red-600" : "text-gray-600";
  return <td className={`px-3 py-3 text-xs font-mono text-right ${color}`}>{value > 0 ? "+" : ""}{value.toFixed(1)}%</td>;
}

export function MetricCell({ value, fmt, good, bad }) {
  if (value === null || value === undefined) return <td className="px-3 py-3 text-xs text-gray-300 text-right">—</td>;
  let color = "text-gray-700";
  if (good !== undefined && value >= good) color = "text-green-600";
  else if (bad !== undefined && value <= bad) color = "text-red-600";
  const display = fmt === "pct" ? `${value > 0 ? "" : ""}${value.toFixed(1)}%` : value.toFixed(2);
  return <td className={`px-3 py-3 text-xs font-mono text-right ${color}`}>{display}</td>;
}

export function AllocationChart() {
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

export function UpcomingMeetings() {
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

export function RecentActivity() {
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
