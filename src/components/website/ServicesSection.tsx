"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Microscope, Scan, Heart, Ear, Stethoscope, Brain, Activity, ArrowRight } from "lucide-react";

const services = [
  { title: "Pathology", description: "Comprehensive lab tests including blood work, urine analysis, and tissue examination.", icon: Microscope, href: "/services/pathology", color: "blue" },
  { title: "Radiology & Imaging", description: "Advanced imaging with X-ray, CT scan, MRI, and digital radiography.", icon: Scan, href: "/services/radiology", color: "purple" },
  { title: "Cardiology", description: "Complete cardiac diagnostics including ECG, Echo, and stress testing.", icon: Heart, href: "/services/cardiology", color: "red" },
  { title: "ENT", description: "Specialized ear, nose, and throat diagnostic procedures and evaluations.", icon: Ear, href: "/services/ent", color: "amber" },
  { title: "Gastroenterology", description: "Digestive system diagnostics including endoscopy and colonoscopy.", icon: Stethoscope, href: "/services/gastroenterology", color: "emerald" },
  { title: "Neurophysiology", description: "Brain and nervous system evaluations including EEG and nerve conduction.", icon: Brain, href: "/services/neurophysiology", color: "indigo" },
  { title: "Ultrasonography", description: "High-resolution ultrasound imaging for abdomen, pelvis, and more.", icon: Activity, href: "/services/ultrasonography", color: "cyan" },
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
  purple: "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
  red: "bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white",
  amber: "bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white",
  emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
  indigo: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
  cyan: "bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white",
};

export default function ServicesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">What We Offer</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2 mb-4">Range of Services</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            We offer a comprehensive range of diagnostic services using the latest technology to ensure accurate and timely results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Link href={service.href}>
                  <div className="group bg-white border border-slate-100 hover:border-blue-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:shadow-blue-50 transition-all duration-300 cursor-pointer h-full">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${colorMap[service.color]}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{service.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{service.description}</p>
                    <div className="flex items-center gap-1 mt-4 text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all">
                      Learn more <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}