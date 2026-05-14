"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Search, X, Upload } from "lucide-react";

interface NewsItem {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  isActive: boolean;
  isFeatured: boolean;
  publishedAt: string;
}

const CATEGORIES = ["News", "Media", "Press Release", "Event"];

const emptyForm = {
  title: "", excerpt: "", content: "", category: "News",
  isActive: true, isFeatured: false,
};

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editNews, setEditNews] = useState<NewsItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => { fetchNews(); }, []);

  const fetchNews = async () => {
    setLoading(true);
    const res = await fetch("/api/news");
    const data = await res.json();
    if (data.success) setNews(data.data);
    setLoading(false);
  };

  const openAdd = () => {
    setEditNews(null); setForm(emptyForm);
    setImageFile(null); setImagePreview(""); setShowModal(true);
  };

  const openEdit = (item: NewsItem) => {
    setEditNews(item);
    setForm({ title: item.title, excerpt: item.excerpt, content: item.content,
      category: item.category, isActive: item.isActive, isFeatured: item.isFeatured });
    setImagePreview(item.image || ""); setImageFile(null); setShowModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file); setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      let imageUrl = editNews?.image || "";
      let cloudinaryId = (editNews as any)?.cloudinaryId || "";
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile); formData.append("folder", "ccll/news");
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        const uploadData = await uploadRes.json();
        if (uploadData.success) { imageUrl = uploadData.url; cloudinaryId = uploadData.publicId; }
      }
      const payload = { ...form, image: imageUrl, cloudinaryId };
      const url = editNews ? `/api/news/${editNews._id}` : "/api/news";
      const method = editNews ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) { fetchNews(); setShowModal(false); }
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this news?")) return;
    setDeleting(id);
    const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) fetchNews();
    setDeleting(null);
  };

  const filtered = news.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">News & Media</h2>
          <p className="text-slate-400 text-sm mt-1">{news.length} total articles</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all">
          <Plus className="w-4 h-4" /> Add News
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Search news..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">Article</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">Category</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">Status</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={4} className="text-center text-slate-500 py-12">Loading...</td></tr> :
              filtered.length === 0 ? <tr><td colSpan={4} className="text-center text-slate-500 py-12">No news found</td></tr> :
              filtered.map((item) => (
                <motion.tr key={item._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {item.image && <img src={item.image} alt={item.title} className="w-12 h-10 rounded-lg object-cover flex-shrink-0" />}
                      <div>
                        <p className="text-white text-sm font-medium line-clamp-1">{item.title}</p>
                        <p className="text-slate-400 text-xs line-clamp-1">{item.excerpt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300 text-sm">{item.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(item)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(item._id)} disabled={deleting === item._id} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <h3 className="text-white font-semibold">{editNews ? "Edit News" : "Add News"}</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Cover Image</label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-16 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0">
                      {imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /> :
                        <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">No image</div>}
                    </div>
                    <label className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm cursor-pointer transition-all">
                      <Upload className="w-4 h-4" /> Upload Image
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                  <input type="text" placeholder="News title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Excerpt</label>
                  <input type="text" placeholder="Short summary" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Content</label>
                  <textarea placeholder="Full article content..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6}
                    className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                    <select value={form.isActive ? "true" : "false"} onChange={(e) => setForm({ ...form, isActive: e.target.value === "true" })}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Featured</label>
                    <select value={form.isFeatured ? "true" : "false"} onChange={(e) => setForm({ ...form, isFeatured: e.target.value === "true" })}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-400 hover:text-white text-sm transition-colors">Cancel</button>
                <button onClick={handleSubmit} disabled={saving}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : editNews ? "Update News" : "Add News"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}