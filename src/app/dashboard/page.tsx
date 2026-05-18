"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Package, Images, Newspaper, TrendingUp, MessageSquareWarning, Building2, Quote } from "lucide-react";
import Link from "next/link";

interface Stats {
  doctors: number;
  packages: number;
  gallery: number;
  news: number;
  complaints: number;
  corporateClients: number;
  testimonials: number;
}

const statCards = [
  { label: "Total Doctors", key: "doctors", icon: Users, color: "blue", href: "/dashboard/doctors" },
  { label: "Health Packages", key: "packages", icon: Package, color: "emerald", href: "/dashboard/packages" },
  { label: "Gallery Photos", key: "gallery", icon: Images, color: "purple", href: "/dashboard/gallery" },
  { label: "News & Media", key: "news", icon: Newspaper, color: "amber", href: "/dashboard/news" },
  { label: "Complaints", key: "complaints", icon: MessageSquareWarning, color: "red", href: "/dashboard/complaints" },
  { label: "Corporate Clients", key: "corporateClients", icon: Building2, color: "sky", href: "/dashboard/corporate" },
  { label: "Testimonials", key: "testimonials", icon: Quote, color: "pink", href: "/dashboard/testimonials" },
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  red: "bg-red-500/10 text-red-400 border-red-500/20",
  sky: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  pink: "bg-pink-500/10 text-pink-400 border-pink-500/20",
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ doctors: 0, packages: 0, gallery: 0, news: 0, complaints: 0, corporateClients: 0, testimonials: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => { if (d.success) setStats(d.data); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
        <p className="text-slate-400 mt-1 text-sm">Manage all CCLL content from here</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={card.href}>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 hover:bg-slate-800/50 transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-400 text-sm font-medium">{card.label}</span>
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colorMap[card.color]}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white">
                    {loading ? <span className="text-slate-600">...</span> : stats[card.key as keyof Stats]}
                  </p>
                  <p className="text-slate-500 text-xs mt-2 group-hover:text-slate-400 transition-colors">
                    Click to manage →
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-semibold">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.key} href={card.href}>
                <div className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 rounded-xl px-4 py-3 transition-all cursor-pointer">
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-300 text-sm">{card.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}