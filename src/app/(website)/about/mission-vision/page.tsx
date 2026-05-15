"use client";

import { motion } from "framer-motion";
import { Target, Eye, Star } from "lucide-react";

export default function MissionVisionPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-blue-950 to-blue-900 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4">Mission & Vision</motion.h1>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          {[
            {
              icon: Target, title: "Our Mission", color: "blue",
              content: "To provide world-class diagnostic services with accuracy, speed, and compassion — making quality healthcare accessible to all people of Chittagong and beyond.",
            },
            {
              icon: Eye, title: "Our Vision", color: "purple",
              content: "To be the most trusted and advanced diagnostic center in Bangladesh, recognized for excellence in technology, patient care, and medical innovation.",
            },
            {
              icon: Star, title: "Our Values", color: "amber",
              content: "Integrity, Excellence, Compassion, Innovation, and Teamwork — these core values guide every aspect of our work and patient interactions.",
            },
          ].map((item, i) => {
            const Icon = item.icon;
            const colors: Record<string, string> = {
              blue: "bg-blue-50 text-blue-600",
              purple: "bg-purple-50 text-purple-600",
              amber: "bg-amber-50 text-amber-600",
            };
            return (
              <motion.div key={item.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex gap-6 bg-slate-50 rounded-2xl p-6 md:p-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${colors[item.color]}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h2>
                  <p className="text-slate-500 leading-relaxed text-lg">{item.content}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </>
  );
}