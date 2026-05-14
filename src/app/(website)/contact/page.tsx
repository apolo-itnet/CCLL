"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { FaFacebook, FaYoutube } from "react-icons/fa6";

const branches = [
  { name: "Head Office", address: "Main Road, Chittagong", phone: "+880 31-XXXXXXX" },
  { name: "Halisahar Branch", address: "Halisahar, Chittagong", phone: "+880 1XXX-XXXXXX" },
  { name: "Bondortila Branch", address: "Bondortila, Chittagong", phone: "+880 1XXX-XXXXXX" },
  { name: "Cox's Bazar Branch", address: "Cox's Bazar", phone: "+880 1XXX-XXXXXX" },
  { name: "Rangamati Branch", address: "Rangamati", phone: "+880 1XXX-XXXXXX" },
  { name: "Feni Branch", address: "Feni", phone: "+880 1XXX-XXXXXX" },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-950 to-blue-900 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-blue-200 text-lg">We are here to help you — reach out to us anytime</motion.p>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Get In Touch</h2>
              <div className="space-y-4 mb-8">
                {[
                  { icon: Phone, label: "Phone", value: "+880 31-XXXXXXX" },
                  { icon: Mail, label: "Email", value: "info@ccll.com.bd" },
                  { icon: MapPin, label: "Address", value: "Main Road, Chittagong, Bangladesh" },
                  { icon: Clock, label: "Hours", value: "Open 24/7 — All Days" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4 bg-white rounded-2xl p-4 border border-slate-100">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">{label}</p>
                      <p className="text-slate-700 font-medium mt-0.5">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <a href="#" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all">
                  <FaFacebook className="w-4 h-4" /> Facebook
                </a>
                <a href="#" className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all">
                  <FaYoutube className="w-4 h-4" /> YouTube
                </a>
              </div>
            </div>

            {/* Map placeholder + Branches */}
            <div>
              <div className="bg-slate-200 rounded-2xl h-64 mb-6 flex items-center justify-center">
                <p className="text-slate-400">Map — Coming Soon</p>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Our Branches</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {branches.map((branch) => (
                  <div key={branch.name} className="bg-white rounded-xl p-4 border border-slate-100">
                    <p className="font-semibold text-slate-800 text-sm">{branch.name}</p>
                    <p className="text-slate-400 text-xs mt-1">{branch.address}</p>
                    <p className="text-blue-600 text-xs mt-1">{branch.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}