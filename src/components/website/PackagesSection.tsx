"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Tag } from "lucide-react";

interface Package {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  tests: string[];
  category: string;
  image: string;
  isFeatured: boolean;
}

export default function PackagesSection() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/packages")
      .then((r) => r.json())
      .then((d) => { if (d.success) setPackages(d.data.filter((p: Package) => p.isFeatured).slice(0, 3)); })
      .finally(() => setLoading(false));
  }, []);

  if (!loading && packages.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
        >
          <div>
            <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">Special Offers</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2">Health Packages</h2>
            <p className="text-slate-500 mt-2">Comprehensive health checkup packages at affordable prices.</p>
          </div>
          <Link href="/packages" className="flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all whitespace-nowrap">
            View All Packages <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? [...Array(3)].map((_, i) => (
                <div key={i} className="bg-slate-50 rounded-2xl p-6 animate-pulse">
                  <div className="h-6 bg-slate-200 rounded mb-3 w-3/4" />
                  <div className="h-4 bg-slate-100 rounded mb-6" />
                  <div className="space-y-2 mb-6">
                    {[...Array(4)].map((_, j) => <div key={j} className="h-3 bg-slate-100 rounded" />)}
                  </div>
                  <div className="h-10 bg-slate-200 rounded-xl" />
                </div>
              ))
            : packages.map((pkg, i) => (
                <motion.div
                  key={pkg._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative bg-white border border-slate-200 hover:border-blue-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:shadow-blue-50 transition-all duration-300"
                >
                  {pkg.isFeatured && (
                    <div className="absolute -top-3 left-6">
                      <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                        <Tag className="w-3 h-3" /> Featured
                      </span>
                    </div>
                  )}
                  <h3 className="font-bold text-slate-800 text-lg mb-2">{pkg.name}</h3>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">{pkg.description}</p>

                  <ul className="space-y-2 mb-6">
                    {pkg.tests.slice(0, 5).map((test) => (
                      <li key={test} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        {test}
                      </li>
                    ))}
                    {pkg.tests.length > 5 && (
                      <li className="text-sm text-blue-600 font-medium">+{pkg.tests.length - 5} more tests</li>
                    )}
                  </ul>

                  <div className="flex items-center justify-between">
                    <div>
                      {pkg.discountPrice > 0 ? (
                        <>
                          <p className="text-slate-400 text-sm line-through">৳{pkg.price}</p>
                          <p className="text-2xl font-bold text-blue-600">৳{pkg.discountPrice}</p>
                        </>
                      ) : (
                        <p className="text-2xl font-bold text-blue-600">৳{pkg.price}</p>
                      )}
                    </div>
                    <Link href="/contact"
                      className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all">
                      Book Now
                    </Link>
                  </div>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}