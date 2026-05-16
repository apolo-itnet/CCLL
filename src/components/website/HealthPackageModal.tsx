"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

interface Package {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  tests: string[];
  category: string;
  image: string;
}

interface HealthPackageModalProps {
  package: Package | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function HealthPackageModal({
  package: pkg,
  isOpen,
  onClose,
}: HealthPackageModalProps) {
  if (!isOpen || !pkg) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white hover:bg-slate-100 p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
          {/* Left Side - Image */}
          <div>
            <div className="w-full rounded-2xl overflow-hidden bg-slate-100 mb-6">
              {pkg.image ? (
                <Image
                  src={pkg.image}
                  alt={pkg.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full aspect-square flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
                  <span className="text-slate-400">No image</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-bold text-slate-800">
                {pkg.name}
              </h2>
              <p className="text-slate-600 mt-2">{pkg.description}</p>
              <p className="text-sm text-slate-500 mt-2 bg-slate-50 inline-block px-3 py-1 rounded-full">
                Category: {pkg.category}
              </p>
            </div>

            {/* Pricing */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <p className="text-slate-600 text-sm mb-2">Package Price</p>
              <div className="flex items-baseline gap-3">
                {pkg.discountPrice > 0 ? (
                  <>
                    <p className="text-slate-400 line-through text-lg">৳{pkg.price}</p>
                    <p className="text-4xl font-bold text-blue-600">৳{pkg.discountPrice}</p>
                    <span className="text-emerald-600 font-semibold text-sm">
                      Save ৳{pkg.price - pkg.discountPrice}
                    </span>
                  </>
                ) : (
                  <p className="text-4xl font-bold text-blue-600">৳{pkg.price}</p>
                )}
              </div>
            </div>

            {/* Tests List */}
            <div>
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                  ✓
                </span>
                Included Tests ({pkg.tests.length})
              </h3>
              <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                {pkg.tests.map((test, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 p-2 rounded-lg"
                  >
                    <span className="text-emerald-600 font-semibold">•</span>
                    {test}
                  </div>
                ))}
              </div>
            </div>

            {/* Book Button */}
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors mt-6">
              Book Now
            </button>

            {/* Info */}
            <div className="text-xs text-slate-500 bg-slate-50 p-4 rounded-lg">
              <p>📞 Contact us for appointment scheduling and sample collection details.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
