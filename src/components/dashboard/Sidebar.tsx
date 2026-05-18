"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Stethoscope, Package, Images, Video, Newspaper,
  ChevronLeft, ChevronRight, Activity, MessageSquareWarning,
  Building2, Quote, ClipboardList, Users, Menu, X,
} from "lucide-react";
import { useSession } from "next-auth/react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["Admin","Manager","Staff"] },
  { href: "/dashboard/doctors", label: "Doctors", icon: Stethoscope, roles: ["Admin","Manager","Staff"] },
  { href: "/dashboard/packages", label: "Health Packages", icon: Package, roles: ["Admin","Manager","Staff"] },
  { href: "/dashboard/gallery", label: "Photo Gallery", icon: Images, roles: ["Admin","Manager","Staff"] },
  { href: "/dashboard/videos", label: "Corporate Videos", icon: Video, roles: ["Admin","Manager","Staff"] },
  { href: "/dashboard/news", label: "News & Media", icon: Newspaper, roles: ["Admin","Manager","Staff"] },
  { href: "/dashboard/corporate", label: "Corporate Clients", icon: Building2, roles: ["Admin","Manager","Staff"] },
  { href: "/dashboard/testimonials", label: "Testimonials", icon: Quote, roles: ["Admin","Manager","Staff"] },
  { href: "/dashboard/complaints", label: "Complaints", icon: MessageSquareWarning, roles: ["Admin","Manager","Staff"] },
  { href: "/dashboard/audit-logs", label: "Audit Logs", icon: ClipboardList, roles: ["Admin","Manager"] },
  { href: "/dashboard/users", label: "Users", icon: Users, roles: ["Admin"] },
];

function SidebarContent({
  collapsed, setCollapsed, pathname, role, onClose,
}: {
  collapsed: boolean;
  setCollapsed?: (v: boolean) => void;
  pathname: string;
  role: string;
  onClose?: () => void;
}) {
  const allowedItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800">
        <div className="flex-shrink-0 w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className="text-white font-bold text-lg tracking-tight whitespace-nowrap">
              CCLL Admin
            </motion.span>
          )}
        </AnimatePresence>
        {onClose && (
          <button onClick={onClose} className="ml-auto text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Role Badge */}
      {!collapsed && (
        <div className="px-4 py-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            role === "Admin" ? "bg-red-500/10 text-red-400 border border-red-500/20"
            : role === "Manager" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            : "bg-slate-700 text-slate-400 border border-slate-600"
          }`}>{role}</span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        {allowedItems.map((item) => {
          const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} onClick={onClose}>
              <motion.div whileHover={{ x: 2 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}>
                <Icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                      className="text-sm font-medium whitespace-nowrap">{item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Logo bottom */}
      <div className="px-4 py-4 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 w-7 h-7 bg-blue-600/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                className="text-slate-600 text-xs whitespace-nowrap">
                CCLL © 2026
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Collapse button — desktop only */}
      {setCollapsed && (
        <button onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-8 w-6 h-6 bg-slate-700 hover:bg-blue-600 border border-slate-600 rounded-full flex items-center justify-center text-slate-300 hover:text-white transition-all duration-200 shadow-lg z-10">
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      )}
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const role = (session?.user as any)?.role || "Staff";

  return (
    <>
      {/* Mobile hamburger */}
      <button onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-300 shadow-lg">
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 z-40" />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed top-0 left-0 h-full w-64 bg-slate-950 border-r border-slate-800 z-50 relative">
              <SidebarContent collapsed={false} pathname={pathname} role={role} onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside animate={{ width: collapsed ? 72 : 240 }} transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden lg:flex relative flex-col bg-slate-950 border-r border-slate-800 h-screen sticky top-0 overflow-hidden flex-shrink-0">
        <SidebarContent collapsed={collapsed} setCollapsed={setCollapsed} pathname={pathname} role={role} />
      </motion.aside>
    </>
  );
}
