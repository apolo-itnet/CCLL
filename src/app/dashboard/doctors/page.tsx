"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Search, X, Upload, Tag, Clock, ChevronDown } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { confirmDelete } from "@/components/dashboard/DeleteConfirm";

// ─── Constants ───────────────────────────────────────────────────────────────
const DEPARTMENTS = [
  "Burn & Plastic Surgery","Cardiology","Colorectal Surgery","Dentistry",
  "Endocrinology","ENT","General Surgery","Gynaecology & Obstetrics",
  "Hepatobiliary Surgery","Hepatology","Laparoscopic Surgery","Medicine",
  "Nephrology","Neurology","Neurosurgery","Oncology","Orthopaedics",
  "Pediatrics","Physical Medicine","Psychiatry","Respiratory Medicine",
  "Rheumatology","Skin & Venereal Diseases","Surgical Oncology","Urology",
];

const PREDEFINED_SPECIALTIES = [
  "Colorectal Surgery","General Surgery","Hepatobiliary Surgery","Laparoscopic Surgery",
  "Cardiology","Interventional Cardiology","Neurology","Neurosurgery","Oncology",
  "Surgical Oncology","Gynaecology","Obstetrics","Pediatric Surgery","Urology",
  "Nephrology","Hepatology","Endocrinology","Rheumatology","Psychiatry",
  "ENT","Orthopedics","Dentistry","Dermatology","Physical Medicine",
  "Respiratory Medicine","Burn & Plastic Surgery","Anesthesiology",
];

const DAYS = ["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday"];

const SCHEDULE_TEMPLATES = {
  Morning:   { start: "08:00", end: "14:00" },
  Afternoon: { start: "14:00", end: "20:00" },
  Evening:   { start: "17:00", end: "22:00" },
  FullDay:   { start: "09:00", end: "17:00" },
};

// ─── Types ───────────────────────────────────────────────────────────────────
interface Doctor {
  _id: string;
  name: string;
  designation: string;
  specialties: string[];
  department: string;
  qualifications: string;
  image: string;
  visitingHours: string;
  personalPhone: string;
  isActive: boolean;
  order: number;
  floorNumber?: string;
  roomNumber?: string;
  birthday?: string;
  about?: string;
  chamberDetails?: { name?: string; address?: string; phone?: string };
  schedule?: { [key: string]: { start: string; end: string; isOff?: boolean } };
  socialLinks?: { facebook?: string; twitter?: string; linkedin?: string };
  leaveStatus?: "active" | "on-leave";
  leaveDuration?: { startDate?: string; endDate?: string };
}

const defaultSchedule = Object.fromEntries(
  DAYS.map((d) => [d, { start: "09:00", end: "17:00", isOff: d === "Friday" }])
);

const emptyForm = {
  name: "", designation: "", specialties: [] as string[], department: DEPARTMENTS[0],
  qualifications: "", visitingHours: "", personalPhone: "", isActive: true, order: 0,
  floorNumber: "", roomNumber: "", birthday: "", about: "",
  chamberDetails: { name: "", address: "", phone: "" },
  schedule: defaultSchedule,
  socialLinks: { facebook: "", twitter: "", linkedin: "" },
  leaveStatus: "active" as "active" | "on-leave",
  leaveDuration: { startDate: "", endDate: "" },
};

// ─── Specialty Tag Input ──────────────────────────────────────────────────────
function SpecialtyInput({
  value, onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const add = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !value.includes(trimmed)) onChange([...value, trimmed]);
    setInput("");
    setShowSuggestions(false);
  };

  const remove = (tag: string) => onChange(value.filter((v) => v !== tag));

  const filtered = PREDEFINED_SPECIALTIES.filter(
    (s) => s.toLowerCase().includes(input.toLowerCase()) && !value.includes(s)
  );

  return (
    <div ref={ref} className="relative">
      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {value.map((tag) => (
          <span key={tag} className="flex items-center gap-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-lg text-xs font-medium">
            <Tag className="w-3 h-3" /> {tag}
            <button onClick={() => remove(tag)} className="ml-1 hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
          </span>
        ))}
      </div>
      {/* Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Type specialty or choose from list..."
          value={input}
          onChange={(e) => { setInput(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) { e.preventDefault(); add(input); }
            if (e.key === "Backspace" && !input && value.length) remove(value[value.length - 1]);
          }}
          className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {/* Suggestions */}
      <AnimatePresence>
        {showSuggestions && filtered.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            className="absolute z-20 top-full mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl shadow-xl max-h-48 overflow-y-auto">
            {filtered.map((s) => (
              <button key={s} onClick={() => add(s)}
                className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-blue-500/10 hover:text-blue-300 transition-colors">
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Schedule Row ─────────────────────────────────────────────────────────────
function ScheduleRow({ day, value, onChange }: {
  day: string;
  value: { start: string; end: string; isOff: boolean };
  onChange: (v: { start: string; end: string; isOff: boolean }) => void;
}) {
  const [showTemplates, setShowTemplates] = useState(false);
  return (
    <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-2.5 rounded-xl">
      <span className="w-24 text-sm font-medium text-slate-300 flex-shrink-0">{day}</span>
      <label className="flex items-center gap-1.5 cursor-pointer flex-shrink-0">
        <input type="checkbox" checked={value.isOff}
          onChange={(e) => onChange({ ...value, isOff: e.target.checked })}
          className="w-4 h-4 accent-red-500" />
        <span className="text-xs text-slate-400">Off</span>
      </label>
      {!value.isOff && (
        <>
          <input type="time" value={value.start}
            onChange={(e) => onChange({ ...value, start: e.target.value })}
            className="bg-slate-900 border border-slate-600 text-white rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
          <span className="text-slate-500 text-xs">to</span>
          <input type="time" value={value.end}
            onChange={(e) => onChange({ ...value, end: e.target.value })}
            className="bg-slate-900 border border-slate-600 text-white rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
          {/* Template picker */}
          <div className="relative ml-auto">
            <button onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs transition-all">
              <Clock className="w-3 h-3" /> Template <ChevronDown className="w-3 h-3" />
            </button>
            <AnimatePresence>
              {showTemplates && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="absolute right-0 top-full mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-10 overflow-hidden w-32">
                  {Object.entries(SCHEDULE_TEMPLATES).map(([label, times]) => (
                    <button key={label} onClick={() => { onChange({ ...value, ...times }); setShowTemplates(false); }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-blue-500/10 hover:text-blue-300 transition-colors">
                      {label} <span className="text-slate-500 text-[10px] block">{times.start}–{times.end}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ num, color, label }: { num: string; color: string; label: string }) {
  return (
    <h4 className="text-slate-300 font-semibold mb-3 flex items-center gap-2">
      <span className={`w-7 h-7 rounded-full ${color} flex items-center justify-center text-xs font-bold flex-shrink-0`}>{num}</span>
      {label}
    </h4>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
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
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => { fetchDoctors(); }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    const res = await fetch("/api/doctors");
    const data = await res.json();
    if (data.success) setDoctors(data.data);
    setLoading(false);
  };

  const openAdd = () => {
    setEditDoctor(null); setForm(emptyForm);
    setImageFile(null); setImagePreview(""); setActiveTab(0); setShowModal(true);
  };

  const openEdit = (doc: Doctor) => {
    setEditDoctor(doc);
    setForm({
      name: doc.name, designation: doc.designation,
      specialties: doc.specialties || [],
      department: doc.department, qualifications: doc.qualifications,
      visitingHours: doc.visitingHours, personalPhone: doc.personalPhone || "",
      isActive: doc.isActive, order: doc.order,
      floorNumber: doc.floorNumber || "", roomNumber: doc.roomNumber || "",
      birthday: doc.birthday || "", about: doc.about || "",
      chamberDetails: doc.chamberDetails || { name: "", address: "", phone: "" },
      schedule: doc.schedule || defaultSchedule,
      socialLinks: doc.socialLinks || { facebook: "", twitter: "", linkedin: "" },
      leaveStatus: doc.leaveStatus || "active",
      leaveDuration: doc.leaveDuration || { startDate: "", endDate: "" },
    });
    setImagePreview(doc.image || ""); setImageFile(null); setActiveTab(0); setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) { toast.error("Doctor name is required!"); return; }
    setSaving(true);
    try {
      let imageUrl = editDoctor?.image || "";
      let cloudinaryId = (editDoctor as any)?.cloudinaryId || "";
      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile); fd.append("folder", "ccll/doctors");
        const r = await fetch("/api/upload", { method: "POST", body: fd });
        const d = await r.json();
        if (d.success) { imageUrl = d.url; cloudinaryId = d.publicId; }
        else { toast.error("Image upload failed!"); setSaving(false); return; }
      }
      const url = editDoctor ? `/api/doctors/${editDoctor._id}` : "/api/doctors";
      const method = editDoctor ? "PUT" : "POST";
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image: imageUrl, cloudinaryId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(editDoctor ? "Doctor updated! 🎉" : "Doctor added! ✅");
        fetchDoctors(); setShowModal(false);
      } else { toast.error("Error: " + (data.error || "Failed")); }
    } catch { toast.error("Network error!"); } finally { setSaving(false); }
  };

  const handleDelete = (id: string, name: string) => {
    confirmDelete(`"${name}" কে delete করতে চান?`, async () => {
      setDeleting(id);
      const res = await fetch(`/api/doctors/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) { toast.success("Doctor deleted!"); fetchDoctors(); }
      else toast.error("Delete failed!");
      setDeleting(null);
    });
  };

  const setScheduleDay = (day: string, val: { start: string; end: string; isOff: boolean }) => {
    setForm((f) => ({ ...f, schedule: { ...f.schedule, [day]: val } }));
  };

  const filtered = doctors.filter(
    (d) => d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.department.toLowerCase().includes(search.toLowerCase())
  );

  const TABS = ["Basic Info", "Medical Info", "Schedule", "Chamber & Leave", "Social"];

  // Birthday notification check
  const upcomingBirthdays = doctors.filter((d) => {
    if (!d.birthday) return false;
    const bday = new Date(d.birthday);
    const today = new Date();
    const diff = new Date(today.getFullYear(), bday.getMonth(), bday.getDate()).getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    return diff >= 0 && diff <= 2 * 24 * 60 * 60 * 1000;
  });

  return (
    <div>
      {/* Birthday Notifications */}
      {upcomingBirthdays.length > 0 && (
        <div className="mb-4 space-y-2">
          {upcomingBirthdays.map((d) => (
            <div key={d._id} className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
              <span className="text-xl">🎂</span>
              <p className="text-amber-300 text-sm font-medium">
                {d.name} এর birthday {new Date(d.birthday!).toLocaleDateString("en-BD", { day: "numeric", month: "long" })} তারিখে!
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Doctors</h2>
          <p className="text-slate-400 text-sm mt-1">{doctors.length} total doctors</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all">
          <Plus className="w-4 h-4" /> Add Doctor
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Search by name or department..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-slate-800">
              {["Doctor","Department","Floor / Room","Status","Actions"].map((h) => (
                <th key={h} className="text-left text-slate-400 text-xs font-medium px-5 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center text-slate-500 py-12">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center text-slate-500 py-12">No doctors found</td></tr>
            ) : (
              filtered.map((doc) => (
                <motion.tr key={doc._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0">
                        {doc.image ? <Image src={doc.image} alt={doc.name} width={40} height={40} className="w-full h-full object-cover" /> :
                          <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">No img</div>}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{doc.name}</p>
                        <p className="text-slate-400 text-xs">{doc.designation}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-slate-300 text-sm">{doc.department}</p>
                    {doc.specialties?.length > 0 && (
                      <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">{doc.specialties.join(", ")}</p>
                    )}
                  </td>
                  <td className="px-5 py-4 text-slate-300 text-sm">
                    {doc.floorNumber ? `Floor ${doc.floorNumber}` : "—"} / {doc.roomNumber || "—"}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${doc.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                      {doc.leaveStatus === "on-leave" ? "On Leave" : doc.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(doc)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(doc._id, doc.name)} disabled={deleting === doc._id}
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

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-6">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[95vh] flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 flex-shrink-0">
                <h3 className="text-white font-semibold">{editDoctor ? "Edit Doctor" : "Add Doctor"}</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Photo + Tabs */}
              <div className="flex items-center gap-4 px-6 pt-4 pb-0 flex-shrink-0">
                {/* Photo */}
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0">
                    {imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /> :
                      <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs text-center px-1">No photo</div>}
                  </div>
                  <label className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-all">
                    <Upload className="w-3.5 h-3.5" /> Photo
                    <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); } }} className="hidden" />
                  </label>
                </div>
                {/* Tabs */}
                <div className="flex gap-1 overflow-x-auto pb-1 flex-1">
                  {TABS.map((tab, i) => (
                    <button key={tab} onClick={() => setActiveTab(i)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === i ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}>
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {/* Tab 1 — Basic Info */}
                {activeTab === 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: "Full Name *", key: "name", placeholder: "Prof. Dr. Mohammad Masud Karim" },
                        { label: "Designation", key: "designation", placeholder: "Senior Consultant / Professor" },
                        { label: "Qualifications", key: "qualifications", placeholder: "MBBS, MS, FCPS" },
                        { label: "Personal Phone (Dashboard only)", key: "personalPhone", placeholder: "01XXXXXXXXX" },
                        { label: "Birthday", key: "birthday", type: "date" },
                        { label: "Display Order", key: "order", type: "number" },
                      ].map(({ label, key, placeholder, type }) => (
                        <div key={key}>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
                          <input type={type || "text"} placeholder={placeholder}
                            value={(form as any)[key]}
                            onChange={(e) => setForm({ ...form, [key]: type === "number" ? Number(e.target.value) : e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Status</label>
                        <select value={form.isActive ? "true" : "false"} onChange={(e) => setForm({ ...form, isActive: e.target.value === "true" })}
                          className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2 — Medical Info */}
                {activeTab === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Department *</label>
                      <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Specialties <span className="text-slate-500">(multiple — একজন doctor 4টাও রাখতে পারবেন)</span>
                      </label>
                      <SpecialtyInput value={form.specialties} onChange={(v) => setForm({ ...form, specialties: v })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Floor Number</label>
                        <input type="text" placeholder="e.g. 3" value={form.floorNumber}
                          onChange={(e) => setForm({ ...form, floorNumber: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Room Number</label>
                        <input type="text" placeholder="e.g. 301" value={form.roomNumber}
                          onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Visiting Hours</label>
                      <input type="text" placeholder="e.g. Sat–Thu: 9AM–2PM" value={form.visitingHours}
                        onChange={(e) => setForm({ ...form, visitingHours: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">About / Bio</label>
                      <textarea placeholder="Doctor's bio, achievements..." value={form.about}
                        onChange={(e) => setForm({ ...form, about: e.target.value })} rows={3}
                        className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                    </div>
                  </div>
                )}

                {/* Tab 3 — Schedule */}
                {activeTab === 2 && (
                  <div className="space-y-2">
                    <p className="text-slate-500 text-xs mb-3">প্রতিটি দিনের জন্য Template বেছে নিন অথবা custom time দিন।</p>
                    {DAYS.map((day) => (
                      <ScheduleRow key={day} day={day}
                        value={form.schedule[day] || { start: "09:00", end: "17:00", isOff: false }}
                        onChange={(val) => setScheduleDay(day, val)} />
                    ))}
                  </div>
                )}

                {/* Tab 4 — Chamber & Leave */}
                {activeTab === 3 && (
                  <div className="space-y-4">
                    <SectionHeader num="A" color="bg-cyan-500/20 text-cyan-400" label="Chamber Details" />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Chamber Name</label>
                        <input type="text" placeholder="e.g. CCLL Head Office" value={form.chamberDetails.name}
                          onChange={(e) => setForm({ ...form, chamberDetails: { ...form.chamberDetails, name: e.target.value } })}
                          className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Chamber Phone</label>
                        <input type="text" placeholder="01XXXXXXXXX" value={form.chamberDetails.phone}
                          onChange={(e) => setForm({ ...form, chamberDetails: { ...form.chamberDetails, phone: e.target.value } })}
                          className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Address</label>
                      <textarea placeholder="Full chamber address..." value={form.chamberDetails.address}
                        onChange={(e) => setForm({ ...form, chamberDetails: { ...form.chamberDetails, address: e.target.value } })}
                        rows={2} className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-800">
                      <SectionHeader num="B" color="bg-orange-500/20 text-orange-400" label="Leave Status" />
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5">Status</label>
                          <select value={form.leaveStatus} onChange={(e) => setForm({ ...form, leaveStatus: e.target.value as any })}
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="active">Active</option>
                            <option value="on-leave">On Leave</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5">Leave From</label>
                          <input type="date" value={form.leaveDuration.startDate}
                            onChange={(e) => setForm({ ...form, leaveDuration: { ...form.leaveDuration, startDate: e.target.value } })}
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5">Leave To</label>
                          <input type="date" value={form.leaveDuration.endDate}
                            onChange={(e) => setForm({ ...form, leaveDuration: { ...form.leaveDuration, endDate: e.target.value } })}
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 5 — Social */}
                {activeTab === 4 && (
                  <div className="space-y-4">
                    {[
                      { label: "Facebook", key: "facebook", placeholder: "https://facebook.com/..." },
                      { label: "Twitter / X", key: "twitter", placeholder: "https://twitter.com/..." },
                      { label: "LinkedIn", key: "linkedin", placeholder: "https://linkedin.com/in/..." },
                    ].map(({ label, key, placeholder }) => (
                      <div key={key}>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
                        <input type="url" placeholder={placeholder} value={(form.socialLinks as any)[key]}
                          onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, [key]: e.target.value } })}
                          className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 flex-shrink-0">
                <div className="flex gap-1">
                  {TABS.map((_, i) => (
                    <button key={i} onClick={() => setActiveTab(i)}
                      className={`w-2 h-2 rounded-full transition-all ${activeTab === i ? "bg-blue-500 w-5" : "bg-slate-700"}`} />
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-400 hover:text-white text-sm transition-colors">Cancel</button>
                  <button onClick={handleSubmit} disabled={saving}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all">
                    {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : editDoctor ? "Update Doctor" : "Add Doctor"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
