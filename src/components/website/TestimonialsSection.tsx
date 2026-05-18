"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Testimonial {
  _id: string;
  name: string;
  companyName: string;
  logo: string;
  message: string;
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((d) => { if (d.success) setTestimonials(d.data); })
      .finally(() => setLoading(false));
  }, []);

  if (!loading && testimonials.length === 0) return null;

  return (
    <section className="py-20 bg-slate-50">
      <div className="container-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
            What Our Clients Say
          </h2>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="flex gap-4 mb-4">
                  <div className="w-20 h-20 bg-slate-200 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2 pt-2">
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                    <div className="h-3 bg-slate-100 rounded w-1/3" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-100 rounded" />
                  <div className="h-3 bg-slate-100 rounded" />
                  <div className="h-3 bg-slate-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Top — Logo + Name */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-20 h-20 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center flex-shrink-0 p-2">
                    {item.logo ? (
                      <Image
                        src={item.logo}
                        alt={item.companyName}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-slate-300 text-xs text-center">{item.companyName}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{item.name}</p>
                    <p className="text-emerald-600 font-semibold text-sm mt-0.5">{item.companyName}</p>
                  </div>
                </div>

                {/* Quote divider */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 h-px bg-emerald-100" />
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                </div>

                {/* Bottom — Message */}
                <div className="relative">
                  <p className="text-slate-600 text-sm leading-relaxed italic">{item.message}</p>
                  {/* closing quote */}
                  <div className="flex justify-end mt-3">
                    <svg className="w-6 h-6 text-emerald-200" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.57-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
                    </svg>
                  </div>
                </div>

                {/* Bottom border accent */}
                <div className="mt-4 h-1 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-200" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
