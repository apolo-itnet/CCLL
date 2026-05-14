"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Youtube } from "lucide-react";

interface Video {
  _id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  category: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
}

const emptyForm = {
  title: "", description: "", youtubeUrl: "",
  category: "Corporate", isActive: true, isFeatured: false, order: 0,
};

const getYoutubeId = (url: string) => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : null;
};

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editVideo, setEditVideo] = useState<Video | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => { fetchVideos(); }, []);

  const fetchVideos = async () => {
    setLoading(true);
    const res = await fetch("/api/videos");
    const data = await res.json();
    if (data.success) setVideos(data.data);
    setLoading(false);
  };

  const openAdd = () => { setEditVideo(null); setForm(emptyForm); setShowModal(true); };

  const openEdit = (video: Video) => {
    setEditVideo(video);
    setForm({ title: video.title, description: video.description, youtubeUrl: video.youtubeUrl,
      category: video.category, isActive: video.isActive, isFeatured: video.isFeatured, order: video.order });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const url = editVideo ? `/api/videos/${editVideo._id}` : "/api/videos";
      const method = editVideo ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) { fetchVideos(); setShowModal(false); }
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this video?")) return;
    setDeleting(id);
    const res = await fetch(`/api/videos/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) fetchVideos();
    setDeleting(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Corporate Videos</h2>
          <p className="text-slate-400 text-sm mt-1">{videos.length} total videos</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all">
          <Plus className="w-4 h-4" /> Add Video
        </button>
      </div>

      {loading ? <div className="text-center text-slate-500 py-12">Loading...</div> :
        videos.length === 0 ? <div className="text-center text-slate-500 py-12">No videos yet</div> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => {
              const ytId = getYoutubeId(video.youtubeUrl);
              return (
                <motion.div key={video._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                  {ytId && (
                    <div className="aspect-video">
                      <iframe src={`https://www.youtube.com/embed/${ytId}`} className="w-full h-full" allowFullScreen />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-white font-medium text-sm">{video.title}</p>
                        <p className="text-slate-400 text-xs mt-1">{video.category}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => openEdit(video)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(video._id)} disabled={deleting === video._id} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg">
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <h3 className="text-white font-semibold">{editVideo ? "Edit Video" : "Add Video"}</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { label: "Title", key: "title", placeholder: "Corporate Video 2025" },
                  { label: "YouTube URL", key: "youtubeUrl", placeholder: "https://youtube.com/watch?v=..." },
                  { label: "Category", key: "category", placeholder: "Corporate" },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
                    <input type="text" placeholder={placeholder} value={(form as any)[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                  <textarea placeholder="Video description..." value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                    className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Order</label>
                    <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : editVideo ? "Update Video" : "Add Video"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}