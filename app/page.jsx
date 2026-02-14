"use client";

import { StatCard, AllocationChart, UpcomingMeetings, RecentActivity } from "@/components/shared";

export default function DashboardPage() {
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
