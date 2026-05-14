"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, User } from "lucide-react";

interface Doctor {
  _id: string;
  name: string;
  designation: string;
  specialty: string;
  department: string;
  qualifications: string;
  image: string;
  visitingHours: string;
}

export default function DoctorsSection() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/doctors")
      .then((r) => r.json())
      .then((d) => { if (d.success) setDoctors(d.data.slice(0, 8)); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
        >
          <div>
            <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">Medical Experts</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2">Our Doctors</h2>
            <p className="text-slate-500 mt-2 max-w-xl">Meet our team of highly qualified and experienced medical professionals.</p>
          </div>
          <Link href="/doctors" className="flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all whitespace-nowrap">
            View All Doctors <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

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
        ) : doctors.length === 0 ? (
          <div className="text-center text-slate-400 py-12">No doctors found</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {doctors.map((doctor, i) => (
              <motion.div
                key={doctor._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:shadow-blue-50 border border-slate-100 hover:border-blue-100 transition-all duration-300"
              >
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
                  <h3 className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition-colors line-clamp-1">{doctor.name}</h3>
                  <p className="text-blue-600 text-xs mt-0.5 line-clamp-1">{doctor.specialty}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{doctor.department}</p>
                  {doctor.visitingHours && (
                    <p className="text-slate-500 text-xs mt-2 bg-slate-50 rounded-lg px-2 py-1">{doctor.visitingHours}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}