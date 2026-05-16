"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Upload,
  History,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

const DEPARTMENTS = [
  "Medicine",
  "Surgery",
  "Pediatric Surgery",
  "Burn & Plastic Surgery",
  "Neurosurgery",
  "Cardiac & Medicine",
  "Orthopedic",
  "ENT",
  "Cancer",
  "Psychiatry",
  "Gynae & Obs",
  "Paediatric",
  "Kidney",
  "Medicine & Kidney",
  "Neuromedicine",
  "Rheumatology",
  "Chest Medicine & Heart",
  "Diabetes & Hormone",
  "Physical Medicine",
  "Respiratory Medicine",
  "Liver(Hepatology)",
  "Urology",
  "Dental",
  "Skin & VD",
];

const DAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

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
  serialNumber?: string;
  roomNumber?: string;
  about?: string;
  chamberDetails?: {
    name?: string;
    address?: string;
    phone?: string;
  };
  schedule?: {
    [key: string]: {
      start: string;
      end: string;
      isOff?: boolean;
    };
  };
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  leaveStatus?: "active" | "on-leave";
  leaveDuration?: {
    startDate?: string;
    endDate?: string;
  };
}

interface FormData {
  name: string;
  designation: string;
  specialty: string;
  department: string;
  qualifications: string;
  visitingHours: string;
  phone: string;
  isActive: boolean;
  order: number;
  serialNumber: string;
  roomNumber: string;
  about: string;
  chamberDetails: {
    name: string;
    address: string;
    phone: string;
  };
  schedule: {
    [key: string]: {
      start: string;
      end: string;
      isOff: boolean;
    };
  };
  socialLinks: {
    facebook: string;
    twitter: string;
    linkedin: string;
  };
  leaveStatus: "active" | "on-leave";
  leaveDuration: {
    startDate: string;
    endDate: string;
  };
}

const emptyForm: FormData = {
  name: "",
  designation: "",
  specialty: "",
  department: DEPARTMENTS[0],
  qualifications: "",
  visitingHours: "",
  phone: "",
  isActive: true,
  order: 0,
  serialNumber: "",
  roomNumber: "",
  about: "",
  chamberDetails: {
    name: "",
    address: "",
    phone: "",
  },
  schedule: {
    Saturday: { start: "09:00", end: "17:00", isOff: false },
    Sunday: { start: "09:00", end: "17:00", isOff: false },
    Monday: { start: "09:00", end: "17:00", isOff: false },
    Tuesday: { start: "09:00", end: "17:00", isOff: false },
    Wednesday: { start: "09:00", end: "17:00", isOff: false },
    Thursday: { start: "09:00", end: "17:00", isOff: false },
    Friday: { start: "00:00", end: "00:00", isOff: true },
  },
  socialLinks: {
    facebook: "",
    twitter: "",
    linkedin: "",
  },
  leaveStatus: "active",
  leaveDuration: {
    startDate: "",
    endDate: "",
  },
};

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editDoctor, setEditDoctor] = useState<Doctor | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [search, setSearch] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [selectedDoctorForAudit, setSelectedDoctorForAudit] = useState<string | null>(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    const res = await fetch("/api/doctors");
    const data = await res.json();
    if (data.success) setDoctors(data.data);
    setLoading(false);
  };

  const fetchAuditLogs = async (doctorId: string) => {
    try {
      const res = await fetch(`/api/audit-logs?model=Doctor&documentId=${doctorId}&limit=20`);
      const data = await res.json();
      if (data.success) {
        setAuditLogs(data.data);
        setSelectedDoctorForAudit(doctorId);
      }
    } catch (error) {
      toast.error("Failed to fetch audit logs!");
    }
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
      name: doctor.name,
      designation: doctor.designation,
      specialty: doctor.specialty,
      department: doctor.department,
      qualifications: doctor.qualifications,
      visitingHours: doctor.visitingHours,
      phone: doctor.phone,
      isActive: doctor.isActive,
      order: doctor.order,
      serialNumber: doctor.serialNumber || "",
      roomNumber: doctor.roomNumber || "",
      about: doctor.about || "",
      chamberDetails: doctor.chamberDetails || {
        name: "",
        address: "",
        phone: "",
      },
      schedule: doctor.schedule || emptyForm.schedule,
      socialLinks: doctor.socialLinks || {
        facebook: "",
        twitter: "",
        linkedin: "",
      },
      leaveStatus: doctor.leaveStatus || "active",
      leaveDuration: doctor.leaveDuration || {
        startDate: "",
        endDate: "",
      },
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
    if (!form.name.trim()) {
      toast.error("Doctor name is required!");
      return;
    }

    setSaving(true);
    try {
      let imageUrl = editDoctor?.image || "";
      let cloudinaryId = editDoctor?.cloudinaryId || "";

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("folder", "ccll/doctors");
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          imageUrl = uploadData.url;
          cloudinaryId = uploadData.publicId;
        } else {
          toast.error("Image upload failed! " + (uploadData.error || ""));
          setSaving(false);
          return;
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
        const message = editDoctor
          ? "Doctor updated successfully! 🎉"
          : "Doctor added successfully! ✅";
        toast.success(message);
        fetchDoctors();
        setShowModal(false);
      } else {
        toast.error("Error: " + (data.error || "Failed to save doctor"));
      }
    } catch (error) {
      toast.error("Network error: Failed to save doctor!");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/doctors/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Doctor deleted successfully! 🗑️");
        fetchDoctors();
      } else {
        toast.error("Delete failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      toast.error("Network error: Failed to delete doctor!");
    } finally {
      setDeleting(null);
    }
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
          <p className="text-slate-400 text-sm mt-1">
            {doctors.length} total doctors
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowAuditLog(!showAuditLog);
              if (!showAuditLog) setSelectedDoctorForAudit(null);
            }}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          >
            <History className="w-4 h-4" /> Audit Log
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          >
            <Plus className="w-4 h-4" /> Add Doctor
          </button>
        </div>
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

      {/* Audit Log View */}
      {showAuditLog && (
        <div className="mb-6 bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Audit Log History</h3>
          <div className="bg-slate-900 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800 border-b border-slate-700">
                  <th className="px-4 py-3 text-left text-slate-400">Doctor</th>
                  <th className="px-4 py-3 text-left text-slate-400">Action</th>
                  <th className="px-4 py-3 text-left text-slate-400">User</th>
                  <th className="px-4 py-3 text-left text-slate-400">Fields Changed</th>
                  <th className="px-4 py-3 text-left text-slate-400">Date</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-4 text-center text-slate-500">
                      {selectedDoctorForAudit ? "No audit logs found" : "Select a doctor to view logs"}
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log._id} className="border-b border-slate-700 hover:bg-slate-800/50">
                      <td className="px-4 py-3 text-slate-300">{log.documentName}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-medium ${
                            log.action === "CREATE"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : log.action === "UPDATE"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{log.userName}</td>
                      <td className="px-4 py-3 text-slate-400 max-w-xs truncate">
                        {log.changes?.fields?.join(", ") || "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">
                Doctor
              </th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">
                Department
              </th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">
                Room/Serial
              </th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">
                Status
              </th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center text-slate-500 py-12">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-slate-500 py-12">
                  No doctors found
                </td>
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
                          <Image
                            src={doctor.image}
                            alt={doctor.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                            No img
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">
                          {doctor.name}
                        </p>
                        <p className="text-slate-400 text-xs">
                          {doctor.designation}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300 text-sm">
                    {doctor.department}
                  </td>
                  <td className="px-6 py-4 text-slate-300 text-sm">
                    {doctor.roomNumber ? `R${doctor.roomNumber}` : "—"} /{" "}
                    {doctor.serialNumber || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        doctor.isActive
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {doctor.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(doctor)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => fetchAuditLogs(doctor._id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 transition-all"
                      >
                        <History className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(doctor._id)}
                        disabled={deleting === doctor._id}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
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
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[95vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur">
                <h3 className="text-white font-semibold">
                  {editDoctor ? "Edit Doctor" : "Add Doctor"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Photo
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                          No image
                        </div>
                      )}
                    </div>
                    <label className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm cursor-pointer transition-all">
                      <Upload className="w-4 h-4" />
                      Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Basic Information */}
                <div>
                  <h4 className="text-slate-300 font-semibold mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">
                      1
                    </span>
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        label: "Full Name",
                        key: "name",
                        placeholder: "Dr. John Doe",
                      },
                      {
                        label: "Phone",
                        key: "phone",
                        placeholder: "+880 1XXX-XXXXXX",
                      },
                      {
                        label: "Designation",
                        key: "designation",
                        placeholder: "Senior Consultant",
                      },
                      {
                        label: "Specialty",
                        key: "specialty",
                        placeholder: "Cardiology",
                      },
                    ].map(({ label, key, placeholder }) => (
                      <div key={key}>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">
                          {label}
                        </label>
                        <input
                          type="text"
                          placeholder={placeholder}
                          value={(form as any)[key]}
                          onChange={(e) =>
                            setForm({ ...form, [key]: e.target.value })
                          }
                          className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h4 className="text-slate-300 font-semibold mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm">
                      2
                    </span>
                    Professional Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Department
                      </label>
                      <select
                        value={form.department}
                        onChange={(e) =>
                          setForm({ ...form, department: e.target.value })
                        }
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {DEPARTMENTS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Qualifications
                      </label>
                      <input
                        type="text"
                        placeholder="MBBS, MD, FCPS"
                        value={form.qualifications}
                        onChange={(e) =>
                          setForm({ ...form, qualifications: e.target.value })
                        }
                        className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Visiting Hours
                      </label>
                      <input
                        type="text"
                        placeholder="Sat-Thu: 9AM-2PM"
                        value={form.visitingHours}
                        onChange={(e) =>
                          setForm({ ...form, visitingHours: e.target.value })
                        }
                        className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={form.order}
                        onChange={(e) =>
                          setForm({ ...form, order: Number(e.target.value) })
                        }
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Medical/Diagnostic Information */}
                <div>
                  <h4 className="text-slate-300 font-semibold mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm">
                      3
                    </span>
                    Medical Information
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Serial Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., D001"
                        value={form.serialNumber}
                        onChange={(e) =>
                          setForm({ ...form, serialNumber: e.target.value })
                        }
                        className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Room Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., 101"
                        value={form.roomNumber}
                        onChange={(e) =>
                          setForm({ ...form, roomNumber: e.target.value })
                        }
                        className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Status
                      </label>
                      <select
                        value={form.isActive ? "true" : "false"}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            isActive: e.target.value === "true",
                          })
                        }
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      About / Bio
                    </label>
                    <textarea
                      placeholder="Add doctor's bio, achievements, or additional info..."
                      value={form.about}
                      onChange={(e) =>
                        setForm({ ...form, about: e.target.value })
                      }
                      rows={3}
                      className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Leave Information */}
                <div>
                  <h4 className="text-slate-300 font-semibold mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-sm">
                      4
                    </span>
                    Leave Status
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Status
                      </label>
                      <select
                        value={form.leaveStatus}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            leaveStatus: e.target.value as "active" | "on-leave",
                          })
                        }
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="active">Active</option>
                        <option value="on-leave">On Leave</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Leave From
                      </label>
                      <input
                        type="date"
                        value={form.leaveDuration.startDate}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            leaveDuration: {
                              ...form.leaveDuration,
                              startDate: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Leave To
                      </label>
                      <input
                        type="date"
                        value={form.leaveDuration.endDate}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            leaveDuration: {
                              ...form.leaveDuration,
                              endDate: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Chamber Details */}
                <div>
                  <h4 className="text-slate-300 font-semibold mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm">
                      5
                    </span>
                    Chamber Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Chamber Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Dhanmondi Branch"
                        value={form.chamberDetails.name}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            chamberDetails: {
                              ...form.chamberDetails,
                              name: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Chamber Phone
                      </label>
                      <input
                        type="text"
                        placeholder="+880 XXX-XXXXXX"
                        value={form.chamberDetails.phone}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            chamberDetails: {
                              ...form.chamberDetails,
                              phone: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      Address
                    </label>
                    <textarea
                      placeholder="Full chamber address..."
                      value={form.chamberDetails.address}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          chamberDetails: {
                            ...form.chamberDetails,
                            address: e.target.value,
                          },
                        })
                      }
                      rows={2}
                      className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Schedule */}
                <div>
                  <h4 className="text-slate-300 font-semibold mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center text-sm">
                      6
                    </span>
                    Weekly Schedule
                  </h4>
                  <div className="space-y-2">
                    {DAYS.map((day) => (
                      <div key={day} className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg">
                        <label className="w-20 text-sm font-medium text-slate-300">
                          {day}
                        </label>
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={form.schedule[day]?.isOff || false}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                schedule: {
                                  ...form.schedule,
                                  [day]: {
                                    ...form.schedule[day],
                                    isOff: e.target.checked,
                                  },
                                },
                              })
                            }
                            className="w-4 h-4"
                          />
                          <span className="text-xs text-slate-400">Off</span>
                        </div>
                        {!form.schedule[day]?.isOff && (
                          <>
                            <input
                              type="time"
                              value={form.schedule[day]?.start || "09:00"}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  schedule: {
                                    ...form.schedule,
                                    [day]: {
                                      ...form.schedule[day],
                                      start: e.target.value,
                                    },
                                  },
                                })
                              }
                              className="bg-slate-900 border border-slate-600 text-white rounded px-2 py-1 text-sm"
                            />
                            <span className="text-slate-400">to</span>
                            <input
                              type="time"
                              value={form.schedule[day]?.end || "17:00"}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  schedule: {
                                    ...form.schedule,
                                    [day]: {
                                      ...form.schedule[day],
                                      end: e.target.value,
                                    },
                                  },
                                })
                              }
                              className="bg-slate-900 border border-slate-600 text-white rounded px-2 py-1 text-sm"
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h4 className="text-slate-300 font-semibold mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm">
                      7
                    </span>
                    Social Links
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Facebook", key: "facebook" },
                      { label: "Twitter", key: "twitter" },
                      { label: "LinkedIn", key: "linkedin" },
                    ].map(({ label, key }) => (
                      <div key={key}>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">
                          {label}
                        </label>
                        <input
                          type="url"
                          placeholder={`https://${key}.com/...`}
                          value={(form.socialLinks as any)[key]}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              socialLinks: {
                                ...form.socialLinks,
                                [key]: e.target.value,
                              },
                            })
                          }
                          className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800 sticky bottom-0 bg-slate-900/95 backdrop-blur">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : editDoctor ? (
                    "Update Doctor"
                  ) : (
                    "Add Doctor"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
