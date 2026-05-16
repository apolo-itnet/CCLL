"use client";

import { motion } from "framer-motion";

const timeline = [
  { year: "1995", title: "Foundation", desc: "CCLL was established in Chittagong with a vision to provide quality diagnostic services." },
  { year: "2000", title: "Expansion", desc: "Expanded services with modern equipment and opened the first branch outside the main office." },
  { year: "2005", title: "ISO Certification", desc: "Achieved ISO certification, marking a milestone in quality assurance." },
  { year: "2010", title: "Digital Transformation", desc: "Transitioned to fully digital reporting and online result delivery systems." },
  { year: "2015", title: "Regional Growth", desc: "Expanded to 6 branches across Chittagong division." },
  { year: "2020", title: "COVID Response", desc: "Played a critical role in COVID-19 testing for the Chittagong region." },
  { year: "2024", title: "Today", desc: "Now operating 11 branches with 500+ tests and 50+ specialist doctors." },
];

export default function HistoryPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-blue-950 to-blue-900 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4">Our History</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-blue-200 text-lg">A journey of excellence spanning decades</motion.p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-100" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <motion.div key={item.year}
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="relative flex gap-6 pl-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 z-10 mt-1">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-5 flex-1 border border-slate-100">
                    <span className="text-blue-600 font-bold text-sm">{item.year}</span>
                    <h3 className="font-bold text-slate-800 mt-1 mb-2">{item.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}