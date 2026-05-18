"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Search, X, Upload } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { confirmDelete } from "@/components/dashboard/DeleteConfirm";

interface CorporateClient {
  _id: string;
  name: string;
  logo: string;
  isActive: boolean;
  order: number;
}

const emptyForm = { name: "", isActive: true, order: 0 };

export default function CorporatePage() {
  const [clients, setClients] = useState<CorporateClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editClient, setEditClient] = useState<CorporateClient | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => { fetchClients(); }, []);

  const fetchClients = async () => {
    setLoading(true);
    const res = await fetch("/api/corporate-clients");
    const data = await res.json();
    if (data.success) setClients(data.data);
    setLoading(false);
  };

  const openAdd = () => {
    setEditClient(null); setForm(emptyForm);
    setImageFile(null); setImagePreview(""); setShowModal(true);
  };

  const openEdit = (client: CorporateClient) => {
    setEditClient(client);
    setForm({ name: client.name, isActive: client.isActive, order: client.order });
    setImagePreview(client.logo || ""); setImageFile(null); setShowModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file); setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) { toast.error("Client name is required!"); return; }
    setSaving(true);
    try {
      let logoUrl = editClient?.logo || "";
      let cloudinaryId = (editClient as any)?.cloudinaryId || "";
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile); formData.append("folder", "ccll/corporate");
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        const uploadData = await uploadRes.json();
        if (uploadData.success) { logoUrl = uploadData.url; cloudinaryId = uploadData.publicId; }
        else { toast.error("Image upload failed!"); setSaving(false); return; }
      }
      const payload = { ...form, logo: logoUrl, cloudinaryId };
      const url = editClient ? `/api/corporate-clients/${editClient._id}` : "/api/corporate-clients";
      const method = editClient ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) {
        toast.success(editClient ? "Client updated! 🎉" : "Client added! ✅");
        fetchClients(); setShowModal(false);
      } else { toast.error("Error: " + (data.error || "Failed to save")); }
    } catch { toast.error("Network error!"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
        setDeleting(id);
    const res = await fetch(`/api/corporate-clients/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) { toast.success("Deleted! 🗑️"); fetchClients(); }
    setDeleting(null);
  };

  const filtered = clients.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Corporate Clients</h2>
          <p className="text-slate-400 text-sm mt-1">{clients.length} total clients</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all">
          <Plus className="w-4 h-4" /> Add Client
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Search clients..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 animate-pulse">
              <div className="w-full h-24 bg-slate-800 rounded-xl mb-3" />
              <div className="h-4 bg-slate-800 rounded" />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="col-span-full text-center text-slate-500 py-12">No clients found</div>
        ) : (
          filtered.map((client) => (
            <motion.div key={client._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition-all group">
              <div className="w-full h-24 bg-slate-800 rounded-xl mb-3 overflow-hidden flex items-center justify-center p-3">
                {client.logo ? (
                  <Image src={client.logo} alt={client.name} width={120} height={80} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-slate-500 text-xs text-center">{client.name}</span>
                )}
              </div>
              <p className="text-slate-300 text-sm font-medium text-center line-clamp-1">{client.name}</p>
              <div className="flex items-center justify-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(client)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                  <Pencil className="w-3 h-3" />
                </button>
                <button onClick={() => handleDelete(client._id)} disabled={deleting === client._id}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <h3 className="text-white font-semibold">{editClient ? "Edit Client" : "Add Client"}</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-16 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
                      {imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" /> :
                        <span className="text-slate-500 text-xs">No logo</span>}
                    </div>
                    <label className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm cursor-pointer transition-all">
                      <Upload className="w-4 h-4" /> Upload Logo
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Client Name</label>
                  <input type="text" placeholder="e.g. Biman Bangladesh Airlines" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                    <select value={form.isActive ? "true" : "false"} onChange={(e) => setForm({ ...form, isActive: e.target.value === "true" })}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Order</label>
                    <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-400 hover:text-white text-sm transition-colors">Cancel</button>
                <button onClick={handleSubmit} disabled={saving}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : editClient ? "Update" : "Add Client"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
