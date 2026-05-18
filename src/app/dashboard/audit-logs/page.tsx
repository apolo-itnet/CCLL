"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

interface AuditLog {
  _id: string;
  userId: string;
  userName: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  model: string;
  documentName: string;
  changes?: { fields?: string[] };
  timestamp: string;
}

const TABS = [
  { label: "All", model: "" },
  { label: "Doctors", model: "Doctor" },
  { label: "Health Packages", model: "Package" },
  { label: "Gallery", model: "Gallery" },
  { label: "News", model: "News" },
  { label: "Videos", model: "Video" },
  { label: "Corporate", model: "CorporateClient" },
  { label: "Testimonials", model: "Testimonial" },
  { label: "Complaints", model: "Complaint" },
];

const actionColor: Record<string, string> = {
  CREATE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  UPDATE: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  DELETE: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const model = TABS[activeTab].model;
    const params = new URLSearchParams({ limit: "200" });
    if (model) params.set("model", model);
    // All tab — no model filter, fetch without model param
    const res = await fetch(`/api/audit-logs?${params}`);
    const data = await res.json();
    if (data.success) { setLogs(data.data); setTotal(data.pagination?.total || 0); }
    setLoading(false);
  }, [activeTab]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const filtered = logs.filter(
    (l) =>
      l.documentName.toLowerCase().includes(search.toLowerCase()) ||
      l.userName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Audit Logs</h2>
        <p className="text-slate-400 text-sm mt-1">সকল CRUD activity এর বিস্তারিত রেকর্ড</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 flex-wrap mb-6">
        {TABS.map((tab, i) => (
          <button key={tab.label} onClick={() => setActiveTab(i)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${activeTab === i ? "bg-blue-600 text-white" : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Search by document or user..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-800">
              {["Action","Document","User","Changed Fields","Date & Time"].map((h) => (
                <th key={h} className="text-left text-slate-400 text-xs font-medium px-5 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center text-slate-500 py-12">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center text-slate-500 py-12">No logs found</td></tr>
            ) : (
              filtered.map((log) => (
                <motion.tr key={log._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${actionColor[log.action]}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-slate-200 text-sm font-medium">{log.documentName}</p>
                    <p className="text-slate-500 text-xs">{log.model}</p>
                  </td>
                  <td className="px-5 py-3.5 text-slate-300 text-sm">{log.userName}</td>
                  <td className="px-5 py-3.5">
                    <div className="relative group">
                      <p className="text-slate-400 text-xs max-w-[160px] truncate cursor-help">
                        {log.changes?.fields?.join(", ") || "—"}
                      </p>
                      {log.changes?.fields && log.changes.fields.length > 0 && (
                        <div className="absolute right-0 bottom-full mb-1 hidden group-hover:block z-30 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 shadow-2xl w-max max-w-[260px]">
                          <p className="text-slate-300 text-xs font-medium mb-2">Changed Fields:</p>
                          <div className="flex flex-wrap gap-1">
                            {log.changes.fields.map((f: string) => (
                              <span key={f} className="bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded-md text-[11px] whitespace-nowrap">{f}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString("en-BD", {
                      day: "numeric", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-slate-600 text-xs mt-3 text-right">Total: {total} records</p>
    </div>
  );
}
