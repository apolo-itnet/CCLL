"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface CorporateClient {
  _id: string;
  name: string;
  logo: string;
}

export default function CorporateClients() {
  const [clients, setClients] = useState<CorporateClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/corporate-clients")
      .then((r) => r.json())
      .then((d) => { if (d.success) setClients(d.data); })
      .finally(() => setLoading(false));
  }, []);

  if (!loading && clients.length === 0) return null;

  const doubled = [...clients, ...clients];

  return (
    <section className="py-20 bg-white">
      <div className="container-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">
            Trusted By
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2 mb-4">
            Corporate Clients & Partners
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            We are proud to serve leading corporate organizations across Bangladesh with
            our dedicated diagnostic and healthcare services.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex gap-6 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-36 h-24 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="relative overflow-hidden">
            {/* Left fade */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            {/* Right fade */}
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="flex gap-6 w-max"
            >
              {doubled.map((client, i) => (
                <div
                  key={`${client._id}-${i}`}
                  className="flex-shrink-0 w-36 h-24 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 flex items-center justify-center p-4 group"
                >
                  {client.logo ? (
                    <Image
                      src={client.logo}
                      alt={client.name}
                      width={120}
                      height={60}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-slate-400 text-xs font-medium text-center">{client.name}</span>
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
