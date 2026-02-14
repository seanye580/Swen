"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/funds", label: "Funds", icon: "🏦" },
  { href: "/themes", label: "Themes", icon: "🧠" },
  { href: "/portfolio", label: "Portfolio", icon: "⚖️" },
  { href: "/meetings", label: "Meeting Prep", icon: "🤝" },
  { href: "/notes", label: "Notes", icon: "📝" },
  { href: "/news", label: "News", icon: "📰" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-60 bg-slate-900 text-white flex flex-col flex-shrink-0 h-screen sticky top-0">
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
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}>
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
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
  );
}
