"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Award, Users, Heart, Shield } from "lucide-react";

const values = [
  { icon: Heart, title: "Patient First", description: "Every decision we make is centered around patient welfare and comfort." },
  { icon: Shield, title: "Quality Assured", description: "ISO certified processes ensuring accurate and reliable test results." },
  { icon: Users, title: "Expert Team", description: "Highly qualified doctors and technicians with decades of experience." },
  { icon: Award, title: "Excellence", description: "Committed to the highest standards of diagnostic excellence." },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-950 to-blue-900 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4">About CCLL</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-blue-200 text-lg max-w-2xl mx-auto">
            Chittagong Clinical & Diagnostic Laboratory Ltd. — Committed to excellence in healthcare diagnostics
          </motion.p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">Who We Are</span>
              <h2 className="text-3xl font-bold text-slate-800 mt-2 mb-4">A Legacy of Healthcare Excellence</h2>
              <p className="text-slate-500 leading-relaxed mb-4">
                Chittagong Clinical & Diagnostic Laboratory Ltd. (CCLL) is one of the leading diagnostic centers in Chittagong, Bangladesh. Established with a vision to provide world-class diagnostic services to the people of Chittagong and surrounding areas.
              </p>
              <p className="text-slate-500 leading-relaxed mb-6">
                We combine cutting-edge technology with experienced medical professionals to deliver accurate, timely, and affordable diagnostic services. Our state-of-the-art facilities and commitment to quality have made us the trusted choice for thousands of patients.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/about/history" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all">
                  Our History <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/about/mission-vision" className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-medium transition-all">
                  Mission & Vision
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="grid grid-cols-2 gap-4">
              {[
                { value: "25+", label: "Years of Service" },
                { value: "50+", label: "Expert Doctors" },
                { value: "500+", label: "Tests Available" },
                { value: "11", label: "Branch Locations" },
              ].map((stat) => (
                <div key={stat.label} className="bg-blue-50 rounded-2xl p-6 text-center">
                  <p className="text-4xl font-bold text-blue-600 mb-1">{stat.value}</p>
                  <p className="text-slate-600 text-sm">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Values */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div key={value.title}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="text-center p-6 bg-slate-50 rounded-2xl hover:bg-blue-50 transition-all group">
                  <div className="w-14 h-14 bg-white group-hover:bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm transition-all">
                    <Icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">{value.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sub Pages Links */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Our History", href: "/about/history", desc: "Learn about our journey" },
              { title: "From MD's Desk", href: "/about/mds-desk", desc: "Message from our MD" },
              { title: "Mission & Vision", href: "/about/mission-vision", desc: "Our goals and aspirations" },
              { title: "Recognitions", href: "/about/recognitions", desc: "Awards & certifications" },
            ].map((item) => (
              <Link key={item.title} href={item.href}>
                <div className="bg-white rounded-2xl p-5 border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group">
                  <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors mb-1">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                  <ArrowRight className="w-4 h-4 text-blue-600 mt-3 opacity-0 group-hover:opacity-100 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}