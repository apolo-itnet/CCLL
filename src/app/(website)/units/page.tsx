"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, Smile, Baby, ArrowRight, Building2 } from "lucide-react";

const units = [
  {
    title: "Specialized Hospital",
    href: "/units/specialized-hospital",
    icon: Building2,
    color: "blue",
    description: "Our specialized hospital unit offers advanced medical care across multiple disciplines with state-of-the-art facilities.",
    features: ["Multi-specialty Care", "Modern OT Facilities", "ICU & CCU", "24/7 Emergency"],
  },
  {
    title: "Eye Hospital",
    href: "/units/eye-hospital",
    icon: Eye,
    color: "purple",
    description: "Dedicated eye care unit with the latest diagnostic and surgical equipment for all eye-related conditions.",
    features: ["Cataract Surgery", "LASIK", "Retina Clinic", "Glaucoma Care"],
  },
  {
    title: "Oro Dental Clinic",
    href: "/units/oro-dental",
    icon: Smile,
    color: "amber",
    description: "Comprehensive dental care services from routine checkups to advanced oral surgery and cosmetic dentistry.",
    features: ["Orthodontics", "Dental Implants", "Root Canal", "Teeth Whitening"],
  },
  {
    title: "IVF Center",
    href: "/units/ivf-center",
    icon: Baby,
    color: "emerald",
    description: "Advanced fertility treatment center offering comprehensive reproductive medicine and IVF services.",
    features: ["IVF Treatment", "IUI Procedure", "Fertility Testing", "Embryo Freezing"],
  },
];

const colorMap: Record<string, { bg: string; text: string; light: string; border: string }> = {
  blue: { bg: "bg-blue-600", text: "text-blue-600", light: "bg-blue-50", border: "border-blue-100" },
  purple: { bg: "bg-purple-600", text: "text-purple-600", light: "bg-purple-50", border: "border-purple-100" },
  amber: { bg: "bg-amber-600", text: "text-amber-600", light: "bg-amber-50", border: "border-amber-100" },
  emerald: { bg: "bg-emerald-600", text: "text-emerald-600", light: "bg-emerald-50", border: "border-emerald-100" },
};

export default function UnitsPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-blue-950 to-blue-900 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4">Our Units</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-blue-200 text-lg max-w-2xl mx-auto">
            Specialized medical units providing focused care and expertise across different healthcare domains
          </motion.p>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {units.map((unit, i) => {
              const Icon = unit.icon;
              const colors = colorMap[unit.color];
              return (
                <motion.div key={unit.title}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className={`bg-white rounded-2xl p-8 border ${colors.border} hover:shadow-lg transition-all duration-300 group`}>
                  <div className={`w-14 h-14 ${colors.light} ${colors.text} rounded-2xl flex items-center justify-center mb-5`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h2 className={`text-xl font-bold text-slate-800 mb-3 group-hover:${colors.text} transition-colors`}>
                    {unit.title}
                  </h2>
                  <p className="text-slate-500 mb-5 leading-relaxed">{unit.description}</p>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {unit.features.map((feature) => (
                      <div key={feature} className={`flex items-center gap-2 ${colors.light} rounded-xl px-3 py-2`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${colors.bg}`} />
                        <span className="text-sm text-slate-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Link href={unit.href}
                    className={`flex items-center gap-2 ${colors.text} font-semibold text-sm hover:gap-3 transition-all`}>
                    Learn More <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}