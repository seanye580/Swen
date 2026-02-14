"use client";

import { useState } from "react";
import { MANAGERS, NOTES } from "@/lib/data";

export default function MeetingPrepPage() {
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
                      <div className="space-y-4">
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
                            <li>• Peer funds in {mgr.strategy.toLowerCase()} space show mixed YTD performance</li>
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
                        <p className="text-sm">Click &quot;Generate AI Briefing&quot; to create a comprehensive meeting prep package</p>
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
