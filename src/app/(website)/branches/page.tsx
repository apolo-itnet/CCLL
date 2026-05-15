"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Clock } from "lucide-react";

const branches = [
  { name: "Head Office", location: "Main Road, Chittagong", phone: "+880 31-XXXXXXX", hours: "24/7", isHead: true },
  { name: "Halisahar Branch", location: "Halisahar, Chittagong", phone: "+880 1XXX-XXXXXX", hours: "8AM - 10PM" },
  { name: "Bondortila Branch", location: "Bondortila, Chittagong", phone: "+880 1XXX-XXXXXX", hours: "8AM - 10PM" },
  { name: "Anowara Branch", location: "Anowara, Chittagong", phone: "+880 1XXX-XXXXXX", hours: "8AM - 9PM" },
  { name: "Potiya Branch", location: "Potiya, Chittagong", phone: "+880 1XXX-XXXXXX", hours: "8AM - 9PM" },
  { name: "Boalkhali Branch", location: "Boalkhali, Chittagong", phone: "+880 1XXX-XXXXXX", hours: "8AM - 9PM" },
  { name: "Chokoria Branch", location: "Chokoria, Cox's Bazar", phone: "+880 1XXX-XXXXXX", hours: "8AM - 9PM" },
  { name: "Cox's Bazar Branch", location: "Cox's Bazar", phone: "+880 1XXX-XXXXXX", hours: "8AM - 10PM" },
  { name: "Hathazari Branch", location: "Hathazari, Chittagong", phone: "+880 1XXX-XXXXXX", hours: "8AM - 9PM" },
  { name: "Nazirhat Branch", location: "Nazirhat, Chittagong", phone: "+880 1XXX-XXXXXX", hours: "8AM - 9PM" },
  { name: "Rangamati Branch", location: "Rangamati", phone: "+880 1XXX-XXXXXX", hours: "8AM - 9PM" },
  { name: "Feni Branch", location: "Feni", phone: "+880 1XXX-XXXXXX", hours: "8AM - 9PM" },
];

export default function BranchesPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-blue-950 to-blue-900 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4">Our Branches</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-blue-200 text-lg">
            {branches.length} locations across Chittagong division — always close to you
          </motion.p>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Head Office */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white mb-8 shadow-lg shadow-blue-200">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold">Head Office</h2>
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">Main</span>
                </div>
                <p className="text-blue-100 mb-3">Main Road, Chittagong, Bangladesh</p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-blue-100">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">+880 31-XXXXXXX</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-100">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Open 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* All Branches */}
          <h3 className="text-xl font-bold text-slate-800 mb-6">All Branches</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {branches.filter((b) => !b.isHead).map((branch, i) => (
              <motion.div key={branch.name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{branch.name}</h3>
                    <p className="text-slate-400 text-sm mt-1">{branch.location}</p>
                    <div className="mt-3 space-y-1.5">
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Phone className="w-3.5 h-3.5" />
                        {branch.phone}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        {branch.hours}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}