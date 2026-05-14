"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Search, X, Upload } from "lucide-react";
import Image from "next/image";

const DEPARTMENTS = [
  "Medicine", "Surgery", "Pediatric Surgery", "Burn & Plastic Surgery",
  "Neurosurgery", "Cardiac & Medicine", "Orthopedic", "ENT", "Cancer",
  "Psychiatry", "Gynae & Obs", "Paediatric", "Kidney", "Medicine & Kidney",
  "Neuromedicine", "Rheumatology", "Chest Medicine & Heart", "Diabetes & Hormone",
  "Physical Medicine", "Respiratory Medicine", "Liver(Hepatology)", "Urology",
  "Dental", "Skin & VD",
];

interface Doctor {
  _id: string;
  name: string;
  designation: string;
  specialty: string;
  department: string;
  qualifications: string;
  image: string;
  visitingHours: string;
  phone: string;
  isActive: boolean;
  order: number;
}

const emptyForm = {
  name: "", designation: "", specialty: "", department: DEPARTMENTS[0],
  qualifications: "", visitingHours: "", phone: "", isActive: true, order: 0,
};

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editDoctor, setEditDoctor] = useState<Doctor | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => { fetchDoctors(); }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    const res = await fetch("/api/doctors");
    const data = await res.json();
    if (data.success) setDoctors(data.data);
    setLoading(false);
  };

  const openAdd = () => {
    setEditDoctor(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview("");
    setShowModal(true);
  };

  const openEdit = (doctor: Doctor) => {
    setEditDoctor(doctor);
    setForm({
      name: doctor.name, designation: doctor.designation,
      specialty: doctor.specialty, department: doctor.department,
      qualifications: doctor.qualifications, visitingHours: doctor.visitingHours,
      phone: doctor.phone, isActive: doctor.isActive, order: doctor.order,
    });
    setImagePreview(doctor.image || "");
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
      let imageUrl = editDoctor?.image || "";
      let cloudinaryId = editDoctor?.cloudinaryId || "";

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("folder", "ccll/doctors");
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          imageUrl = uploadData.url;
          cloudinaryId = uploadData.publicId;
        }
      }

      const payload = { ...form, image: imageUrl, cloudinaryId };
      const url = editDoctor ? `/api/doctors/${editDoctor._id}` : "/api/doctors";
      const method = editDoctor ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        fetchDoctors();
        setShowModal(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;
    setDeleting(id);
    const res = await fetch(`/api/doctors/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) fetchDoctors();
    setDeleting(null);
  };

  const filtered = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Doctors</h2>
          <p className="text-slate-400 text-sm mt-1">{doctors.length} total doctors</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
        >
          <Plus className="w-4 h-4" /> Add Doctor
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search doctors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">Doctor</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">Department</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">Phone</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">Status</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center text-slate-500 py-12">Loading...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-slate-500 py-12">No doctors found</td>
              </tr>
            ) : (
              filtered.map((doctor) => (
                <motion.tr
                  key={doctor._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0">
                        {doctor.image ? (
                          <Image src={doctor.image} alt={doctor.name} width={40} height={40} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">No img</div>
                        )}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{doctor.name}</p>
                        <p className="text-slate-400 text-xs">{doctor.designation}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300 text-sm">{doctor.department}</td>
                  <td className="px-6 py-4 text-slate-300 text-sm">{doctor.phone || "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${doctor.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                      {doctor.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(doctor)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(doctor._id)} disabled={deleting === doctor._id} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
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

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <h3 className="text-white font-semibold">{editDoctor ? "Edit Doctor" : "Add Doctor"}</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Photo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">No image</div>
                      )}
                    </div>
                    <label className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm cursor-pointer transition-all">
                      <Upload className="w-4 h-4" />
                      Upload Photo
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Form Fields */}
                {[
                  { label: "Full Name", key: "name", placeholder: "Dr. John Doe" },
                  { label: "Designation", key: "designation", placeholder: "Senior Consultant" },
                  { label: "Specialty", key: "specialty", placeholder: "Cardiology" },
                  { label: "Qualifications", key: "qualifications", placeholder: "MBBS, MD, FCPS" },
                  { label: "Visiting Hours", key: "visitingHours", placeholder: "Sat-Thu: 9AM-2PM" },
                  { label: "Phone", key: "phone", placeholder: "+880 1XXX-XXXXXX" },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
                    <input
                      type="text"
                      placeholder={placeholder}
                      value={(form as any)[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Department</label>
                  <select
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Order & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Display Order</label>
                    <input
                      type="number"
                      value={form.order}
                      onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                    <select
                      value={form.isActive ? "true" : "false"}
                      onChange={(e) => setForm({ ...form, isActive: e.target.value === "true" })}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-400 hover:text-white text-sm transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : editDoctor ? "Update Doctor" : "Add Doctor"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}