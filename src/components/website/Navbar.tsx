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
  Activity,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

const navItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About CCLL", href: "/about" },
      { label: "Our History", href: "/about/history" },
      { label: "From MD's Desk", href: "/about/mds-desk" },
      { label: "Mission & Vision", href: "/about/mission-vision" },
      { label: "Industry Recognitions", href: "/about/recognitions" },
    ],
  },
  {
    label: "Range of Services",
    href: "/services",
    children: [
      { label: "Pathology", href: "/services/pathology" },
      { label: "Radiology & Imaging", href: "/services/radiology" },
      { label: "Cardiology", href: "/services/cardiology" },
      { label: "Ear Nose & Throat (ENT)", href: "/services/ent" },
      { label: "Gastroenterology", href: "/services/gastroenterology" },
      { label: "Neurophysiology", href: "/services/neurophysiology" },
      { label: "Ultrasonography", href: "/services/ultrasonography" },
    ],
  },
  {
    label: "Doctors",
    href: "/doctors",
    grid: true,
    children: [
      { label: "Medicine", href: "/doctors?dept=Medicine" },
      { label: "Surgery", href: "/doctors?dept=Surgery" },
      { label: "Pediatric Surgery", href: "/doctors?dept=Pediatric Surgery" },
      {
        label: "Burn & Plastic Surgery",
        href: "/doctors?dept=Burn & Plastic Surgery",
      },
      { label: "Neurosurgery", href: "/doctors?dept=Neurosurgery" },
      { label: "Cardiac & Medicine", href: "/doctors?dept=Cardiac & Medicine" },
      { label: "Orthopedic", href: "/doctors?dept=Orthopedic" },
      { label: "ENT", href: "/doctors?dept=ENT" },
      { label: "Cancer", href: "/doctors?dept=Cancer" },
      { label: "Psychiatry", href: "/doctors?dept=Psychiatry" },
      { label: "Gynae & Obs", href: "/doctors?dept=Gynae & Obs" },
      { label: "Paediatric", href: "/doctors?dept=Paediatric" },
      { label: "Kidney", href: "/doctors?dept=Kidney" },
      { label: "Neuromedicine", href: "/doctors?dept=Neuromedicine" },
      { label: "Dental", href: "/doctors?dept=Dental" },
      { label: "Skin & VD", href: "/doctors?dept=Skin & VD" },
    ],
  },
  {
    label: "Our Units",
    href: "/units",
    children: [
      { label: "Specialized Hospital", href: "/units/specialized-hospital" },
      { label: "Eye Hospital", href: "/units/eye-hospital" },
      { label: "Oro Dental Clinic", href: "/units/oro-dental" },
      { label: "IVF Center", href: "/units/ivf-center" },
    ],
  },
  {
    label: "Our Branches",
    href: "/branches",
    branches: true,
    children: [
      { label: "Halisahar", href: "/branches/halisahar" },
      { label: "Bondortila", href: "/branches/bondortila" },
      { label: "Anowara", href: "/branches/anowara" },
      { label: "Potiya", href: "/branches/potiya" },
      { label: "Boalkhali", href: "/branches/boalkhali" },
      { label: "Chokoria", href: "/branches/chokoria" },
      { label: "Cox's Bazar", href: "/branches/coxs-bazar" },
      { label: "Hathazari", href: "/branches/hathazari" },
      { label: "Nazirhat", href: "/branches/nazirhat" },
      { label: "Rangamati", href: "/branches/rangamati" },
      { label: "Feni", href: "/branches/feni" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

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

  return (
    <>
      {/* Top Bar */}
      <div className="bg-blue-800 text-white text-xs py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p>Welcome to CHEVRON</p>
          <div className="flex items-center gap-2">
            <Phone className="w-3 h-3" />
            <p>
              <span className="font-bold">Hotline: :</span> 01755 666969, 01713
              487903
            </p>
            <p>
              <span className="font-bold">Doctor Info : </span> 01756 203720,
              01713 487901 & 01755 666 956
            </p>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-sm shadow-slate-200/50" : "bg-white"}`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-full h-auto flex items-center justify-center">
                <Image
                  src="https://res.cloudinary.com/dtppzdxgj/image/upload/v1778815755/ccll/gallery/pfoe4g3qudnngjsii2bb.png"
                  alt="CCLL Logo"
                  width={32}
                  height={32}
                  className="w-12 h-auto"
                />
                <Activity className="w-6 h-6 text-white" />
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center justify-center gap-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() =>
                    item.children && setActiveDropdown(item.label)
                  }
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between px-4 text-sm font-medium hover:text-white hover:py-4 hover:bg-blue-800 transition-all duration-200 ${
                      pathname === item.href
                        ? "py-4 text-blue-50 bg-blue-800"
                        : "text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {item.label}
                    {item.children && <ChevronDown className="w-3.5 h-3.5" />}
                  </Link>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {item.children && activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute top-full left-0 mt-4 bg-white border border-slate-200 rounded-xl shadow-sm shadow-slate-200/60 w-full p-4 z-50 flex flex-col gap-2 ${
                          item.grid
                            ? "grid grid-cols-4 gap-2 min-w-5xl right-0 left-auto"
                            : item.branches
                              ? "grid grid-cols-3 gap-2 min-w-2xl right-0 left-auto"
                              : "w-xs"
                        }`}
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="group/item flex items-center gap-2 rounded-lg border border-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 hover:border-blue-200 hover:bg-blue-50"
                          >
                            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-blue-700 text-blue-700 hover:border-blue-800 hover:bg-blue-800 hover:text-white transition-colors duration-300 group-hover/item:border-blue-800 group-hover/item:bg-blue-800 group-hover/item:text-white">
                              <ChevronRight className="h-4 w-4" />
                            </div>
                            <span className="group-hover/item:translate-x-1 transition-transform duration-300">
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
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-700"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-slate-100 bg-white overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {navItems.map((item) => (
                  <div key={item.label}>
                    {item.children ? (
                      <>
                        <button
                          onClick={() =>
                            setMobileExpanded(
                              mobileExpanded === item.label ? null : item.label,
                            )
                          }
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                          {item.label}
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${mobileExpanded === item.label ? "rotate-180" : ""}`}
                          />
                        </button>
                        <AnimatePresence>
                          {mobileExpanded === item.label && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-4 space-y-1 overflow-hidden"
                            >
                              {item.children.map((child) => (
                                <Link
                                  key={child.label}
                                  href={child.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="block px-3 py-2 text-sm text-slate-600 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="block px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
