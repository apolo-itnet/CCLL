"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Search, X, Upload } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { confirmDelete } from "@/components/dashboard/DeleteConfirm";

interface Testimonial {
  _id: string;
  name: string;
  companyName: string;
  logo: string;
  message: string;
  isActive: boolean;
  order: number;
}

const emptyForm = { name: "", companyName: "", message: "", isActive: true, order: 0 };

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true);
    const res = await fetch("/api/testimonials");
    const data = await res.json();
    if (data.success) setItems(data.data);
    setLoading(false);
  };

  const openAdd = () => {
    setEditItem(null); setForm(emptyForm);
    setImageFile(null); setImagePreview(""); setShowModal(true);
  };

  const openEdit = (item: Testimonial) => {
    setEditItem(item);
    setForm({ name: item.name, companyName: item.companyName, message: item.message, isActive: item.isActive, order: item.order });
    setImagePreview(item.logo || ""); setImageFile(null); setShowModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file); setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.companyName.trim() || !form.message.trim()) {
      toast.error("Name, Company and Message are required!"); return;
    }
    setSaving(true);
    try {
      let logoUrl = editItem?.logo || "";
      let cloudinaryId = (editItem as any)?.cloudinaryId || "";
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile); formData.append("folder", "ccll/testimonials");
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        const uploadData = await uploadRes.json();
        if (uploadData.success) { logoUrl = uploadData.url; cloudinaryId = uploadData.publicId; }
        else { toast.error("Image upload failed!"); setSaving(false); return; }
      }
      const payload = { ...form, logo: logoUrl, cloudinaryId };
      const url = editItem ? `/api/testimonials/${editItem._id}` : "/api/testimonials";
      const method = editItem ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) {
        toast.success(editItem ? "Updated! 🎉" : "Added! ✅");
        fetchItems(); setShowModal(false);
      } else { toast.error("Error: " + (data.error || "Failed to save")); }
    } catch { toast.error("Network error!"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
        setDeleting(id);
    const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) { toast.success("Deleted! 🗑️"); fetchItems(); }
    setDeleting(null);
  };

  const filtered = items.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.companyName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Testimonials</h2>
          <p className="text-slate-400 text-sm mt-1">{items.length} total testimonials</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all">
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Search testimonials..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 animate-pulse">
              <div className="flex gap-4 mb-4">
                <div className="w-16 h-16 bg-slate-800 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-4 bg-slate-800 rounded w-2/3" />
                  <div className="h-3 bg-slate-700 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-800 rounded" />
                <div className="h-3 bg-slate-800 rounded w-4/5" />
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="col-span-full text-center text-slate-500 py-12">No testimonials found</div>
        ) : (
          filtered.map((item) => (
            <motion.div key={item._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 p-2">
                    {item.logo ? (
                      <Image src={item.logo} alt={item.companyName} width={56} height={56} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-slate-500 text-xs text-center leading-tight">{item.companyName}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{item.name}</p>
                    <p className="text-emerald-400 text-xs mt-0.5">{item.companyName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(item)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(item._id)} disabled={deleting === item._id}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed italic line-clamp-3">"{item.message}"</p>
              <div className="flex items-center gap-2 mt-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${item.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-700 text-slate-400"}`}>
                  {item.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <h3 className="text-white font-semibold">{editItem ? "Edit Testimonial" : "Add Testimonial"}</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Company Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-14 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
                      {imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" /> :
                        <span className="text-slate-500 text-xs">No logo</span>}
                    </div>
                    <label className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm cursor-pointer transition-all">
                      <Upload className="w-4 h-4" /> Upload Logo
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Person Name</label>
                    <input type="text" placeholder="Mr. Ahmed" value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Company Name</label>
                    <input type="text" placeholder="Biman Bangladesh" value={form.companyName}
                      onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                  <textarea placeholder="Write the client's testimonial here..." value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4}
                    className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
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
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : editItem ? "Update" : "Add Testimonial"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
