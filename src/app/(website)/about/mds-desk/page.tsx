"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export default function MDsDeskPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-blue-950 to-blue-900 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4">From MD's Desk</motion.h1>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-slate-50 rounded-3xl p-8 md:p-12">
            <Quote className="w-12 h-12 text-blue-200 mb-6" />
            <div className="space-y-4 text-slate-600 leading-relaxed text-lg mb-8">
              <p>
                Dear Valued Patients and Well-wishers,
              </p>
              <p>
                It is with immense pride and gratitude that I welcome you to Chittagong Clinical & Diagnostic Laboratory Ltd. (CCLL). Over the past decades, we have worked tirelessly to build an institution that stands as a beacon of quality healthcare in Chittagong.
              </p>
              <p>
                Our commitment has always been simple: to provide accurate, affordable, and accessible diagnostic services to every patient who walks through our doors. We believe that quality healthcare is not a privilege — it is a right.
              </p>
              <p>
                With a team of dedicated doctors, technicians, and support staff, we continue to invest in the latest technology and training to ensure that our patients receive nothing but the best.
              </p>
              <p>
                Thank you for placing your trust in CCLL. We remain committed to your health and wellbeing.
              </p>
            </div>
            <div className="border-t border-slate-200 pt-6">
              <p className="font-bold text-slate-800 text-lg">Prof. Dr. [MD Name]</p>
              <p className="text-blue-600 text-sm">Managing Director, CCLL</p>
              <p className="text-slate-400 text-sm">MBBS, MD, FCPS</p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}