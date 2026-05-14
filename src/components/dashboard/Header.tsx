"use client";

import { useSession } from "next-auth/react";
import { Bell, User } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-10">
      <div>
        <h1 className="text-white font-semibold text-sm">
          Welcome back, {session?.user?.name ?? "Admin"} 👋
        </h1>
        <p className="text-slate-500 text-xs mt-0.5">
          Manage your CCLL dashboard
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
          <Bell className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 bg-slate-800 rounded-xl px-3 py-2">
          <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
            <User className="w-3 h-3 text-white" />
          </div>
          <span className="text-slate-300 text-xs font-medium">
            {session?.user?.email ?? "admin@ccll.com"}
          </span>
        </div>
      </div>
    </header>
  );
}