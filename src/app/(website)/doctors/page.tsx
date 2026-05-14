"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, User } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const DEPARTMENTS = [
  "All", "Medicine", "Surgery", "Pediatric Surgery", "Burn & Plastic Surgery",
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
}

function DoctorsContent() {
  const searchParams = useSearchParams();
  const deptParam = searchParams.get("dept") || "All";

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeDept, setActiveDept] = useState(deptParam);

  useEffect(() => {
    setLoading(true);
    fetch("/api/doctors")
      .then((r) => r.json())
      .then((d) => { if (d.success) setDoctors(d.data); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { setActiveDept(deptParam); }, [deptParam]);

  const filtered = doctors.filter((d) => {
    const matchDept = activeDept === "All" || d.department === activeDept;
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  });

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-950 to-blue-900 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4">Our Doctors</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-blue-200 text-lg mb-8">Meet our team of highly qualified medical professionals</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Search by name or specialty..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white text-slate-800 placeholder-slate-400 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg" />
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Department Filter */}
          <div className="flex gap-2 flex-wrap mb-8">
            {DEPARTMENTS.map((dept) => (
              <button key={dept} onClick={() => setActiveDept(dept)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeDept === dept
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-200"
                }`}>
                {dept}
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-slate-500 text-sm mb-6">{filtered.length} doctor{filtered.length !== 1 ? "s" : ""} found</p>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                  <div className="w-full aspect-square bg-slate-200 rounded-xl mb-4" />
                  <div className="h-4 bg-slate-200 rounded mb-2" />
                  <div className="h-3 bg-slate-100 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">No doctors found</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((doctor, i) => (
                <motion.div key={doctor._id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:shadow-blue-50 border border-slate-100 hover:border-blue-100 transition-all duration-300">
                  <div className="aspect-square bg-slate-100 overflow-hidden">
                    {doctor.image ? (
                      <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-16 h-16 text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{doctor.name}</h3>
                    {doctor.designation && <p className="text-slate-500 text-xs mt-0.5">{doctor.designation}</p>}
                    <p className="text-blue-600 text-xs mt-1 font-medium">{doctor.specialty}</p>
                    <span className="inline-block mt-2 bg-slate-50 text-slate-500 text-xs px-2 py-1 rounded-lg">{doctor.department}</span>
                    {doctor.qualifications && (
                      <p className="text-slate-400 text-xs mt-2 line-clamp-2">{doctor.qualifications}</p>
                    )}
                    {doctor.visitingHours && (
                      <div className="mt-3 bg-blue-50 text-blue-700 text-xs px-3 py-2 rounded-xl">
                        🕐 {doctor.visitingHours}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function DoctorsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <DoctorsContent />
    </Suspense>
  );
}