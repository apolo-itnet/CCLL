"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, X, Upload, Pencil } from "lucide-react";

interface GalleryItem {
  _id: string;
  title: string;
  image: string;
  category: string;
  isActive: boolean;
  order: number;
}

const emptyForm = { title: "", category: "General", isActive: true, order: 0 };

export default function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editPhoto, setEditPhoto] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => { fetchPhotos(); }, []);

  const fetchPhotos = async () => {
    setLoading(true);
    const res = await fetch("/api/gallery");
    const data = await res.json();
    if (data.success) setPhotos(data.data);
    setLoading(false);
  };

  const openAdd = () => {
    setEditPhoto(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview("");
    setShowModal(true);
  };

  const openEdit = (photo: GalleryItem) => {
    setEditPhoto(photo);
    setForm({ title: photo.title, category: photo.category, isActive: photo.isActive, order: photo.order });
    setImagePreview(photo.image || "");
    setImageFile(null);
    setShowModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      let imageUrl = editPhoto?.image || "";
      let cloudinaryId = (editPhoto as any)?.cloudinaryId || "";

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("folder", "ccll/gallery");
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        const uploadData = await uploadRes.json();
        if (uploadData.success) { imageUrl = uploadData.url; cloudinaryId = uploadData.publicId; }
      }

      const payload = { ...form, image: imageUrl, cloudinaryId };
      const url = editPhoto ? `/api/gallery/${editPhoto._id}` : "/api/gallery";
      const method = editPhoto ? "PUT" : "POST";

      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) { fetchPhotos(); setShowModal(false); }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this photo?")) return;
    setDeleting(id);
    const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) fetchPhotos();
    setDeleting(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Photo Gallery</h2>
          <p className="text-slate-400 text-sm mt-1">{photos.length} total photos</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all">
          <Plus className="w-4 h-4" /> Add Photo
        </button>
      </div>

      {loading ? (
        <div className="text-center text-slate-500 py-12">Loading...</div>
      ) : photos.length === 0 ? (
        <div className="text-center text-slate-500 py-12">No photos yet</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <motion.div key={photo._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="aspect-square">
                <img src={photo.image} alt={photo.title} className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                <button onClick={() => openEdit(photo)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-all">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(photo._id)} disabled={deleting === photo._id} className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-600 text-white hover:bg-red-500 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3">
                <p className="text-white text-sm font-medium truncate">{photo.title}</p>
                <p className="text-slate-400 text-xs">{photo.category}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <h3 className="text-white font-semibold">{editPhoto ? "Edit Photo" : "Add Photo"}</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Photo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0">
                      {imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /> :
                        <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">No image</div>}
                    </div>
                    <label className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm cursor-pointer transition-all">
                      <Upload className="w-4 h-4" /> Upload Photo
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                  <input type="text" placeholder="Photo title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                  <input type="text" placeholder="General" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-400 hover:text-white text-sm transition-colors">Cancel</button>
                <button onClick={handleSubmit} disabled={saving}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : editPhoto ? "Update" : "Add Photo"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}