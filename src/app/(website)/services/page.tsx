"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Microscope, Scan, Heart, Ear, Stethoscope, Brain, Activity, ArrowRight, CheckCircle2 } from "lucide-react";

const services = [
  {
    title: "Pathology",
    href: "/services/pathology",
    icon: Microscope,
    color: "blue",
    description: "Our pathology department offers comprehensive laboratory testing services.",
    features: ["Complete Blood Count (CBC)", "Liver Function Tests", "Kidney Function Tests", "Thyroid Function Tests", "Urine Analysis", "Stool Analysis", "Culture & Sensitivity"],
  },
  {
    title: "Radiology & Imaging",
    href: "/services/radiology",
    icon: Scan,
    color: "purple",
    description: "State-of-the-art imaging services for accurate diagnosis.",
    features: ["Digital X-Ray", "CT Scan", "MRI", "Mammography", "Bone Densitometry", "Fluoroscopy", "Angiography"],
  },
  {
    title: "Cardiology",
    href: "/services/cardiology",
    icon: Heart,
    color: "red",
    description: "Comprehensive cardiac diagnostics and evaluation services.",
    features: ["ECG / EKG", "Echocardiography", "Stress Test (TMT)", "Holter Monitoring", "24hr BP Monitoring", "Cardiac Enzymes", "Lipid Profile"],
  },
  {
    title: "Ear Nose & Throat (ENT)",
    href: "/services/ent",
    icon: Ear,
    color: "amber",
    description: "Specialized diagnostic services for ENT conditions.",
    features: ["Audiometry", "Tympanometry", "Pure Tone Audiogram", "Speech Audiometry", "OAE Testing", "Endoscopy", "Nasopharyngoscopy"],
  },
  {
    title: "Gastroenterology",
    href: "/services/gastroenterology",
    icon: Stethoscope,
    color: "emerald",
    description: "Complete digestive system diagnostic procedures.",
    features: ["Upper GI Endoscopy", "Colonoscopy", "Sigmoidoscopy", "H. Pylori Test", "Liver Biopsy", "Capsule Endoscopy", "ERCP"],
  },
  {
    title: "Neurophysiology",
    href: "/services/neurophysiology",
    icon: Brain,
    color: "indigo",
    description: "Brain and nervous system evaluation services.",
    features: ["EEG", "EMG", "Nerve Conduction Study", "Evoked Potentials", "Sleep Study", "Video EEG", "Brain Mapping"],
  },
  {
    title: "Ultrasonography",
    href: "/services/ultrasonography",
    icon: Activity,
    color: "cyan",
    description: "High-resolution ultrasound imaging services.",
    features: ["Whole Abdomen USG", "Pelvic USG", "Thyroid USG", "Obstetric USG", "Color Doppler", "Musculoskeletal USG", "Breast USG"],
  },
];

const colorMap: Record<string, { bg: string; text: string; light: string }> = {
  blue: { bg: "bg-blue-600", text: "text-blue-600", light: "bg-blue-50" },
  purple: { bg: "bg-purple-600", text: "text-purple-600", light: "bg-purple-50" },
  red: { bg: "bg-red-600", text: "text-red-600", light: "bg-red-50" },
  amber: { bg: "bg-amber-600", text: "text-amber-600", light: "bg-amber-50" },
  emerald: { bg: "bg-emerald-600", text: "text-emerald-600", light: "bg-emerald-50" },
  indigo: { bg: "bg-indigo-600", text: "text-indigo-600", light: "bg-indigo-50" },
  cyan: { bg: "bg-cyan-600", text: "text-cyan-600", light: "bg-cyan-50" },
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-950 to-blue-900 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4">Range of Services</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-blue-200 text-lg max-w-2xl mx-auto">
            Comprehensive diagnostic services using cutting-edge technology for accurate and timely results.
          </motion.p>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          {services.map((service, i) => {
            const Icon = service.icon;
            const colors = colorMap[service.color];
            return (
              <motion.div key={service.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 hover:border-blue-100 hover:shadow-md transition-all">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className={`w-14 h-14 ${colors.light} ${colors.text} rounded-2xl flex items-center justify-center`}>
                      <Icon className="w-7 h-7" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className={`text-xl font-bold text-slate-800 mb-2`}>{service.title}</h2>
                    <p className="text-slate-500 mb-4">{service.description}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {service.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                          <CheckCircle2 className={`w-4 h-4 ${colors.text} flex-shrink-0`} />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </>
  );
}