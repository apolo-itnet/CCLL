"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, Tag, Search } from "lucide-react";

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

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/packages")
      .then((r) => r.json())
      .then((d) => { if (d.success) setPackages(d.data); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = packages.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <section className="bg-gradient-to-br from-blue-950 to-blue-900 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4">Health Packages</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-blue-200 text-lg mb-8">Comprehensive health checkup packages at affordable prices</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Search packages..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white text-slate-800 placeholder-slate-400 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg" />
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                  <div className="h-6 bg-slate-200 rounded mb-3 w-3/4" />
                  <div className="h-4 bg-slate-100 rounded mb-6" />
                  <div className="space-y-2 mb-6">
                    {[...Array(4)].map((_, j) => <div key={j} className="h-3 bg-slate-100 rounded" />)}
                  </div>
                  <div className="h-10 bg-slate-200 rounded-xl" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">No packages found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((pkg, i) => (
                <motion.div key={pkg._id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative bg-white border border-slate-200 hover:border-blue-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
                  {pkg.isFeatured && (
                    <div className="absolute -top-3 left-6">
                      <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                        <Tag className="w-3 h-3" /> Featured
                      </span>
                    </div>
                  )}
                  {pkg.image && (
                    <img src={pkg.image} alt={pkg.name} className="w-full h-40 object-cover rounded-xl mb-4" />
                  )}
                  <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">{pkg.category}</span>
                  <h3 className="font-bold text-slate-800 text-lg mt-3 mb-2">{pkg.name}</h3>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">{pkg.description}</p>
                  <ul className="space-y-1.5 mb-5">
                    {pkg.tests.slice(0, 6).map((test) => (
                      <li key={test} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /> {test}
                      </li>
                    ))}
                    {pkg.tests.length > 6 && (
                      <li className="text-sm text-blue-600 font-medium pl-6">+{pkg.tests.length - 6} more tests</li>
                    )}
                  </ul>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
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
                      Contact Us
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}