"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Menu,
  X,
  Phone,
  ChevronRight,
  Stethoscope,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { navItems } from "@/lib/navItems";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-blue-800 text-white text-xs py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6  flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-blue-300 font-medium">Opening Hours:</span>
              <span> Every Day 7 AM – 10:30 PM</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6  flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-blue-300 font-medium">Hotline: </span>
                <span>01755-666969, 01713-487903</span>
              </div>
            </div>
            <div className="w-px h-4 bg-blue-600" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6  flex items-center justify-center">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-blue-300 font-medium">Doctor Info: </span>
                <span>01756-203720, 01713-487901</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-sm shadow-slate-200/50" : "bg-white"}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center h-full">
              <Image
                src={process.env.NEXT_PUBLIC_LOGO_URL!}
                alt="Logo"
                width={150}
                height={40}
                className="w-auto h-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center h-16">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative h-full flex items-center"
                  onMouseEnter={() =>
                    item.children && setActiveDropdown(item.label)
                  }
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 px-4 h-full text-sm font-medium transition-all duration-200 border-b-2 ${
                      pathname === item.href ||
                      pathname.startsWith(item.href + "/")
                        ? "text-blue-50 border-blue-700 bg-blue-800"
                        : "text-slate-700 border-transparent hover:text-blue-700 hover:border-blue-700 hover:bg-blue-50/50"
                    }`}
                  >
                    {item.label}
                    {item.children && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === item.label ? "rotate-180" : ""}`}
                      />
                    )}
                  </Link>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {item.children && activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute top-full mt-0 bg-white border border-slate-100 rounded-b-2xl shadow-xs shadow-slate-200/60 z-50 p-3 ${
                          item.grid
                            ? "grid grid-cols-1 lg:grid-cols-4 gap-3.5 w-4xl right-0 -left-100 mx-auto h-auto"
                            : item.branches
                              ? "grid grid-cols-1 lg:grid-cols-3 gap-3.5 w-xl right-0 left-auto mx-auto"
                              : "flex flex-col gap-2.5 w-72 left-0 right-auto mx-auto"
                        }`}
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="w-full group flex items-center gap-2 px-3 py-2 border border-blue-200 rounded-xl text-sm text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-150"
                          >
                            <div className="w-5 h-5 rounded-full border border-blue-200 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-700 group-hover:border-blue-700 transition-all">
                              <ChevronRight className="w-3 h-3 text-blue-600 group-hover:text-white" />
                            </div>
                            <span className="group-hover:translate-x-0.5 transition-transform duration-150 font-medium">
                              {child.label}
                            </span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay + Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-80 bg-white z-50 lg:hidden flex flex-col justify-center shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-blue-800">
                <Image
                  src="https://res.cloudinary.com/dtppzdxgj/image/upload/v1778815755/ccll/gallery/pfoe4g3qudnngjsii2bb.png"
                  alt="CCLL Logo"
                  width={100}
                  height={40}
                  className="h-8 w-auto object-contain brightness-0 invert"
                />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-700 hover:bg-blue-600 text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Nav Items */}
              <div className="flex-1 items-center justify-center overflow-y-auto py-3 px-3">
                {navItems.map((item) => (
                  <div key={item.label} className="mb-1">
                    {item.children ? (
                      <>
                        <button
                          onClick={() =>
                            setMobileExpanded(
                              mobileExpanded === item.label ? null : item.label,
                            )
                          }
                          className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all"
                        >
                          {item.label}
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${mobileExpanded === item.label ? "rotate-180 text-blue-600" : "text-slate-400"}`}
                          />
                        </button>

                        <AnimatePresence>
                          {mobileExpanded === item.label && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden mx-2 mb-1"
                            >
                              <div
                                className={`pt-1 pb-2 grid gap-1 ${item.grid || item.branches ? "grid-cols-2" : "grid-cols-1"}`}
                              >
                                {item.children.map((child) => (
                                  <Link
                                    key={child.label}
                                    href={child.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-all"
                                  >
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                    {child.label}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                          pathname === item.href
                            ? "bg-blue-800 text-blue-50"
                            : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                        }`}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Drawer Footer — Contact Info */}
              <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Hotline
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      01755-666969
                    </p>
                    <p className="text-sm text-slate-600">01713-487903</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Stethoscope className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Doctor Info
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      01756-203720
                    </p>
                    <p className="text-sm text-slate-600">01713-487901</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
