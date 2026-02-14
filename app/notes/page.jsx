"use client";

import { useState, useMemo } from "react";
import { NOTES } from "@/lib/data";
import { Label } from "@/components/shared";

export default function NotesPage() {
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
