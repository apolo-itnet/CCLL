"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Trash2, Eye, X } from "lucide-react";
import toast from "react-hot-toast";
import { confirmDelete } from "@/components/dashboard/DeleteConfirm";

interface Complaint {
  _id: string;
  complainType: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  patientName: string;
  invoiceNumber: string;
  mobile: string;
  email: string;
  branch: string;
  department: string;
  complain: string;
  status: "Pending" | "In Review" | "Resolved" | "Closed";
  createdAt: string;
}

const priorityColor: Record<string, string> = {
  Low: "bg-slate-500/10 text-slate-400",
  Medium: "bg-amber-500/10 text-amber-400",
  High: "bg-orange-500/10 text-orange-400",
  Urgent: "bg-red-500/10 text-red-400",
};
const statusColor: Record<string, string> = {
  Pending: "bg-amber-500/10 text-amber-400",
  "In Review": "bg-blue-500/10 text-blue-400",
  Resolved: "bg-emerald-500/10 text-emerald-400",
  Closed: "bg-slate-500/10 text-slate-400",
};

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => { fetchComplaints(); }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    const res = await fetch("/api/complaints");
    const data = await res.json();
    if (data.success) setComplaints(data.data);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/complaints/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Status updated!");
      fetchComplaints();
      if (selected?._id === id) setSelected({ ...selected, status: status as Complaint["status"] });
    }
  };

  const handleDelete = async (id: string) => {
    confirmDelete("এই complaint টি delete করবেন?", async () => {
      setDeleting(id);
      const res = await fetch(`/api/complaints/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) { toast.success("Deleted!"); fetchComplaints(); if (selected?._id === id) setSelected(null); }
      setDeleting(null);
    });
  };

  const filtered = complaints.filter((c) =>
    c.patientName.toLowerCase().includes(search.toLowerCase()) ||
    c.mobile.includes(search) ||
    c.branch.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Complaints</h2>
          <p className="text-slate-400 text-sm mt-1">{complaints.length} total complaints</p>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Search by name, mobile, branch..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">Patient</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">Type</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">Branch</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">Priority</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">Status</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">Date</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center text-slate-500 py-12">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center text-slate-500 py-12">No complaints found</td></tr>
            ) : (
              filtered.map((c) => (
                <motion.tr key={c._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-white text-sm font-medium">{c.patientName}</p>
                    <p className="text-slate-400 text-xs">{c.mobile}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-300 text-sm">{c.complainType}</td>
                  <td className="px-6 py-4 text-slate-300 text-sm">{c.branch}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityColor[c.priority]}`}>{c.priority}</span>
                  </td>
                  <td className="px-6 py-4">
                    <select value={c.status} onChange={(e) => updateStatus(c._id, e.target.value)}
                      className={`px-2 py-1 rounded-lg text-xs font-medium border-0 focus:outline-none cursor-pointer ${statusColor[c.status]} bg-transparent`}>
                      {["Pending","In Review","Resolved","Closed"].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs">
                    {new Date(c.createdAt).toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelected(c)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(c._id)} disabled={deleting === c._id}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selected && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => setSelected(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h3 className="text-white font-semibold">Complaint Details</h3>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              {[
                { label: "Patient Name", value: selected.patientName },
                { label: "Mobile", value: selected.mobile },
                { label: "Email", value: selected.email || "—" },
                { label: "Invoice No.", value: selected.invoiceNumber || "—" },
                { label: "Type", value: selected.complainType },
                { label: "Priority", value: selected.priority },
                { label: "Branch", value: selected.branch },
                { label: "Department", value: selected.department },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-3">
                  <span className="text-slate-400 text-sm w-28 flex-shrink-0">{label}</span>
                  <span className="text-slate-200 text-sm">{value}</span>
                </div>
              ))}
              <div>
                <p className="text-slate-400 text-sm mb-1">Complaint</p>
                <p className="text-slate-200 text-sm leading-relaxed bg-slate-800 rounded-xl p-3">{selected.complain}</p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <span className="text-slate-400 text-sm">Status:</span>
                <select value={selected.status} onChange={(e) => updateStatus(selected._id, e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {["Pending","In Review","Resolved","Closed"].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
