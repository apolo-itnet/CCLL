"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Search, X, Upload } from "lucide-react";

interface Package {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  tests: string[];
  category: string;
  image: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
}

const emptyForm = {
  name: "", description: "", price: 0, discountPrice: 0,
  tests: "", category: "General", isActive: true, isFeatured: false, order: 0,
};

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editPkg, setEditPkg] = useState<Package | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => { fetchPackages(); }, []);

  const fetchPackages = async () => {
    setLoading(true);
    const res = await fetch("/api/packages");
    const data = await res.json();
    if (data.success) setPackages(data.data);
    setLoading(false);
  };

  const openAdd = () => {
    setEditPkg(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview("");
    setShowModal(true);
  };

  const openEdit = (pkg: Package) => {
    setEditPkg(pkg);
    setForm({
      name: pkg.name, description: pkg.description,
      price: pkg.price, discountPrice: pkg.discountPrice,
      tests: pkg.tests.join("\n"), category: pkg.category,
      isActive: pkg.isActive, isFeatured: pkg.isFeatured, order: pkg.order,
    });
    setImagePreview(pkg.image || "");
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
      let imageUrl = editPkg?.image || "";
      let cloudinaryId = (editPkg as any)?.cloudinaryId || "";

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("folder", "ccll/packages");
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          imageUrl = uploadData.url;
          cloudinaryId = uploadData.publicId;
        }
      }

      const payload = {
        ...form,
        tests: form.tests.split("\n").filter((t) => t.trim()),
        image: imageUrl,
        cloudinaryId,
      };

      const url = editPkg ? `/api/packages/${editPkg._id}` : "/api/packages";
      const method = editPkg ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) { fetchPackages(); setShowModal(false); }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this package?")) return;
    setDeleting(id);
    const res = await fetch(`/api/packages/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) fetchPackages();
    setDeleting(null);
  };

  const filtered = packages.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Health Packages</h2>
          <p className="text-slate-400 text-sm mt-1">{packages.length} total packages</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all">
          <Plus className="w-4 h-4" /> Add Package
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Search packages..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">Package</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">Category</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">Price</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">Status</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center text-slate-500 py-12">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center text-slate-500 py-12">No packages found</td></tr>
            ) : filtered.map((pkg) => (
              <motion.tr key={pkg._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {pkg.image && <img src={pkg.image} alt={pkg.name} className="w-10 h-10 rounded-xl object-cover" />}
                    <div>
                      <p className="text-white text-sm font-medium">{pkg.name}</p>
                      <p className="text-slate-400 text-xs">{pkg.tests?.length || 0} tests</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-300 text-sm">{pkg.category}</td>
                <td className="px-6 py-4">
                  <p className="text-white text-sm font-medium">৳{pkg.price}</p>
                  {pkg.discountPrice > 0 && <p className="text-emerald-400 text-xs">৳{pkg.discountPrice} offer</p>}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium w-fit ${pkg.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                      {pkg.isActive ? "Active" : "Inactive"}
                    </span>
                    {pkg.isFeatured && <span className="px-2.5 py-1 rounded-full text-xs font-medium w-fit bg-amber-500/10 text-amber-400">Featured</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(pkg)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(pkg._id)} disabled={deleting === pkg._id} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
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
                <h3 className="text-white font-semibold">{editPkg ? "Edit Package" : "Add Package"}</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                {/* Image */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Image</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0">
                      {imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /> :
                        <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">No image</div>}
                    </div>
                    <label className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm cursor-pointer transition-all">
                      <Upload className="w-4 h-4" /> Upload Image
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                </div>

                {[
                  { label: "Package Name", key: "name", placeholder: "Basic Health Checkup" },
                  { label: "Category", key: "category", placeholder: "General" },
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
                  <textarea placeholder="Package description..." value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                    className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Regular Price (৳)</label>
                    <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Offer Price (৳)</label>
                    <input type="number" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: Number(e.target.value) })}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Tests Included (one per line)</label>
                  <textarea placeholder={"CBC\nBlood Sugar\nLiver Function"} value={form.tests}
                    onChange={(e) => setForm({ ...form, tests: e.target.value })} rows={5}
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
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : editPkg ? "Update Package" : "Add Package"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}