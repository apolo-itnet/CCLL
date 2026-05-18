"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { Bell, ChevronDown, LogOut, MessageSquareWarning, Cake, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

interface Notification {
  id: string;
  type: "complaint" | "birthday";
  title: string;
  message: string;
  href: string;
}

const ROLE_COLOR: Record<string, string> = {
  Admin:   "bg-red-500/20 text-red-400",
  Manager: "bg-amber-500/20 text-amber-400",
  Staff:   "bg-slate-600 text-slate-300",
};

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const role = (session?.user as any)?.role || "Staff";

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchNotifications = async () => {
    const notifs: Notification[] = [];
    try {
      // Pending complaints
      const cRes = await fetch("/api/complaints");
      const cData = await cRes.json();
      if (cData.success) {
        const pending = cData.data.filter((c: any) => c.status === "Pending");
        if (pending.length > 0) {
          notifs.push({
            id: "complaints",
            type: "complaint",
            title: `${pending.length} Pending Complaint${pending.length > 1 ? "s" : ""}`,
            message: pending.slice(0, 2).map((c: any) => c.patientName).join(", ") + (pending.length > 2 ? ` +${pending.length - 2} more` : ""),
            href: "/dashboard/complaints",
          });
        }
      }
    } catch {}
    try {
      // Upcoming birthdays (next 2 days)
      const dRes = await fetch("/api/doctors");
      const dData = await dRes.json();
      if (dData.success) {
        const today = new Date();
        const upcoming = dData.data.filter((d: any) => {
          if (!d.birthday) return false;
          const bday = new Date(d.birthday);
          const thisYear = new Date(today.getFullYear(), bday.getMonth(), bday.getDate());
          const diff = thisYear.getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
          return diff >= 0 && diff <= 2 * 24 * 60 * 60 * 1000;
        });
        upcoming.forEach((d: any) => {
          const bday = new Date(d.birthday);
          const thisYear = new Date(today.getFullYear(), bday.getMonth(), bday.getDate());
          const diff = Math.round((thisYear.getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) / 86400000);
          notifs.push({
            id: `bday-${d._id}`,
            type: "birthday",
            title: `🎂 ${d.name}`,
            message: diff === 0 ? "আজ birthday!" : `${diff} দিন পরে birthday`,
            href: "/dashboard/doctors",
          });
        });
      }
    } catch {}
    setNotifications(notifs);
  };

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      {/* Left */}
      <div className="pl-10 lg:pl-0">
        <h1 className="text-white font-semibold text-sm">
          Welcome, {session?.user?.name ?? "Admin"} 👋
        </h1>
        <p className="text-slate-500 text-xs mt-0.5 hidden sm:block">CCLL Dashboard</p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <div ref={notifRef} className="relative">
          <button onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer">
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotif && (
              <motion.div initial={{ opacity: 0, y: 6, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }} transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                  <p className="text-white text-sm font-semibold">Notifications</p>
                  <button onClick={() => setShowNotif(false)} className="text-slate-500 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
                </div>
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-slate-500 text-sm">No new notifications</div>
                ) : (
                  <div className="divide-y divide-slate-800">
                    {notifications.map((n) => (
                      <button key={n.id} onClick={() => { router.push(n.href); setShowNotif(false); }}
                        className="w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-800/50 transition-colors cursor-pointer text-left">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${n.type === "complaint" ? "bg-red-500/10" : "bg-amber-500/10"}`}>
                          {n.type === "complaint" ? <MessageSquareWarning className="w-4 h-4 text-red-400" /> : <Cake className="w-4 h-4 text-amber-400" />}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{n.title}</p>
                          <p className="text-slate-400 text-xs mt-0.5">{n.message}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 rounded-xl px-3 py-2 transition-all cursor-pointer">
            <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{session?.user?.name?.[0]?.toUpperCase() || "A"}</span>
            </div>
            <span className="text-slate-300 text-xs font-medium hidden sm:block max-w-[100px] truncate">
              {session?.user?.name}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showProfile ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div initial={{ opacity: 0, y: 6, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }} transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
                {/* User Info */}
                <div className="px-4 py-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">{session?.user?.name?.[0]?.toUpperCase() || "A"}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{session?.user?.name}</p>
                      <p className="text-slate-400 text-xs truncate">{session?.user?.email}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ROLE_COLOR[role]}`}>{role}</span>
                  </div>
                </div>
                {/* Logout */}
                <div className="p-2">
                  <button onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer text-sm">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
