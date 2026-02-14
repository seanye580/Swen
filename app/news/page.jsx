"use client";

import { useState, useMemo } from "react";
import { NEWS_ITEMS, SOURCE_ICONS } from "@/lib/data";
import { Label } from "@/components/shared";

export default function NewsPage() {
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
