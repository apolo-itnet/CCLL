"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";
import Image from "next/image";

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
      .then((d) => { if (d.success) setPackages(d.data.slice(0, 4)); })
      .finally(() => setLoading(false));
  }, []);

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

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-slate-200" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-100 rounded" />
                  <div className="h-10 bg-slate-200 rounded-xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl">
            <p className="text-slate-400">No packages available yet.</p>
            <p className="text-slate-300 text-sm mt-1">Add packages from the dashboard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg, i) => (
              <motion.div
                key={pkg._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-white border border-slate-200 hover:border-blue-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-100 transition-all duration-300 cursor-pointer"
              >
                {/* Featured Badge */}
                {pkg.isFeatured && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Featured
                    </span>
                  </div>
                )}

                {/* Image */}
                <Link href={`/packages?packageId=${pkg._id}`}>
                  <div className="w-full h-48 bg-slate-100 overflow-hidden">
                    {pkg.image ? (
                      <Image
                        src={pkg.image}
                        alt={pkg.name}
                        width={300}
                        height={200}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
                        <span className="text-slate-300 text-sm">No image</span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-800 text-base group-hover:text-blue-600 transition-colors line-clamp-1">
                      {pkg.name}
                    </h3>
                    <p className="text-slate-500 text-xs mt-1 line-clamp-2">{pkg.description}</p>
                  </div>

                  {/* Footer with Pricing Left + Button Right */}
                  <div className="flex items-end justify-between pt-2 border-t border-slate-100">
                    {/* Pricing - Left */}
                    <div className="flex flex-col">
                      {pkg.discountPrice > 0 ? (
                        <>
                          <p className="text-slate-400 text-xs line-through">৳{pkg.price}</p>
                          <p className="text-xl font-bold text-blue-600">৳{pkg.discountPrice}</p>
                        </>
                      ) : (
                        <p className="text-xl font-bold text-blue-600">৳{pkg.price}</p>
                      )}
                    </div>

                    {/* View Details Button - Right */}
                    <Link
                      href={`/packages?packageId=${pkg._id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}