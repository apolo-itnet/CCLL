"use client";

import { motion } from "framer-motion";
import { Award, Star, Shield, Trophy } from "lucide-react";

const recognitions = [
  { icon: Shield, title: "ISO 9001:2015 Certified", year: "2005", desc: "International quality management certification for diagnostic services.", color: "blue" },
  { icon: Award, title: "Best Diagnostic Center", year: "2018", desc: "Awarded by Bangladesh Medical Association, Chittagong Chapter.", color: "amber" },
  { icon: Trophy, title: "Excellence in Healthcare", year: "2020", desc: "National recognition for outstanding contribution during COVID-19.", color: "emerald" },
  { icon: Star, title: "Patient Choice Award", year: "2022", desc: "Voted as the most trusted diagnostic center by patients.", color: "purple" },
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600",
  amber: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-600",
  purple: "bg-purple-50 text-purple-600",
};

export default function RecognitionsPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-blue-950 to-blue-900 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4">Industry Recognitions</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-blue-200 text-lg">Awards and certifications that reflect our commitment to excellence</motion.p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recognitions.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="flex gap-5 bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-blue-100 hover:shadow-md transition-all">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${colorMap[item.color]}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-800">{item.title}</h3>
                      <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">{item.year}</span>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}