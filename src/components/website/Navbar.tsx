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
  MessageSquareWarning,
} from "lucide-react";
import Image from "next/image";
import { navItems } from "@/lib/navItems";
import toast from "react-hot-toast";

const BRANCHES = [
  "Head Office",
  "Halisahar",
  "Bondortila",
  "Anowara",
  "Potiya",
  "Boalkhali",
  "Chokoria",
  "Cox's Bazar",
  "Hathazari",
  "Nazirhat",
  "Rangamati",
  "Feni",
];
const DEPARTMENTS = [
  "Pathology",
  "Radiology & Imaging",
  "Cardiology",
  "ENT",
  "Gastroenterology",
  "Neurophysiology",
  "Ultrasonography",
  "Reception",
  "Billing",
  "Administration",
];
const emptyComplaint = {
  complainType: "",
  priority: "Medium",
  patientName: "",
  invoiceNumber: "",
  mobile: "",
  email: "",
  branch: "",
  department: "",
  complain: "",
};

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [complainModal, setComplainModal] = useState(false);
  const [form, setForm] = useState(emptyComplaint);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen || complainModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, complainModal]);

  const handleComplaintSubmit = async () => {
    if (
      !form.complainType ||
      !form.patientName ||
      !form.mobile ||
      !form.branch ||
      !form.department ||
      !form.complain
    ) {
      toast.error("Please fill in all required fields!");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Complaint submitted! We'll respond soon.");
        setForm(emptyComplaint);
        setComplainModal(false);
      } else {
        toast.error("Failed to submit. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-blue-800 text-white text-xs py-2 px-4 hidden md:block">
        <div className="container-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="text-blue-300 font-medium">Opening Hours:</span>
            <span> Every Day 7 AM – 10:30 PM</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span className="text-blue-300 font-medium">Hotline: </span>
              <span>01755-666969, 01713-487903</span>
            </div>
            <div className="w-px h-4 bg-blue-600" />
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              <span className="text-blue-300 font-medium">Doctor Info: </span>
              <span>01756-203720, 01713-487901</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-sm shadow-slate-200/50" : "bg-white"}`}
      >
        <div className="container-lg">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <div>
              <Link
                href="/"
                className="hidden lg:flex items-center h-full flex-shrink-0"
              >
                <Image
                  src={process.env.NEXT_PUBLIC_LOGO_URL_DESKTOP!}
                  alt="Logo"
                  width={150}
                  height={40}
                  className="w-auto h-auto object-contain"
                  priority
                />
              </Link>
              <Link
                href="/"
                className="flex lg:hidden items-center h-full flex-shrink-0"
              >
                <Image
                  src={process.env.NEXT_PUBLIC_LOGO_URL_MOBILE!}
                  alt="CCLL Logo"
                  width={100}
                  height={40}
                  className="h-8 w-auto object-contain"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center h-16 flex-1 justify-center">
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
                  <AnimatePresence>
                    {item.children && activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute top-full mt-0 bg-white border border-slate-100 rounded-b-2xl shadow-xs shadow-slate-200/60 z-50 p-3 ${
                          item.grid
                            ? "grid grid-cols-1 lg:grid-cols-4 gap-3.5 w-4xl right-0 -left-100 mx-auto"
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

            {/* Complain & Advise */}
            <div className="h-full hidden lg:flex items-center pl-2">
              <button
                onClick={() => setComplainModal(true)}
                className="flex items-center gap-1.5 px-4 h-full text-sm font-medium text-red-600 border-b-2 border-transparent hover:border-red-500 hover:bg-red-50/50 transition-all duration-200"
              >
                <MessageSquareWarning className="w-4 h-4" />
                Complain & Advise
              </button>
            </div>

            {/* Right — Mobile Toggle only */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-80 bg-white z-50 lg:hidden flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-blue-800">
                <Image
                  src={process.env.NEXT_PUBLIC_LOGO_URL_MOBILE!}
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
              <div className="flex-1 overflow-y-auto py-3 px-3">
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
                        className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all ${pathname === item.href ? "bg-blue-800 text-blue-50" : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"}`}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setComplainModal(true);
                  }}
                  className="w-full flex items-center gap-2 mt-2 px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-semibold transition-all"
                >
                  <MessageSquareWarning className="w-4 h-4" /> Complain & Advise
                </button>
              </div>
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

      {/* Complaint Modal */}
      <AnimatePresence>
        {complainModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setComplainModal(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-t-2xl px-6 py-5 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Submit your complaint
                  </h2>
                  <p className="text-emerald-100 text-sm mt-1">
                    We will review and respond as soon as possible.
                  </p>
                </div>
                <button
                  onClick={() => setComplainModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form body */}
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-800">
                  Complaint Form
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Complain Type
                    </label>
                    <select
                      value={form.complainType}
                      onChange={(e) =>
                        setForm({ ...form, complainType: e.target.value })
                      }
                      className="w-full border border-slate-200 text-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="">Select Type</option>
                      {["Service", "Report Delay", "Billing", "Behavior"].map(
                        (t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Priority
                    </label>
                    <select
                      value={form.priority}
                      onChange={(e) =>
                        setForm({ ...form, priority: e.target.value })
                      }
                      className="w-full border border-slate-200 text-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      {["Low", "Medium", "High", "Urgent"].map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Patient Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Full name"
                      value={form.patientName}
                      onChange={(e) =>
                        setForm({ ...form, patientName: e.target.value })
                      }
                      className="w-full border border-slate-200 text-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Mobile <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="01XXXXXXXXX"
                      value={form.mobile}
                      onChange={(e) =>
                        setForm({ ...form, mobile: e.target.value })
                      }
                      className="w-full border border-slate-200 text-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="example@gmail.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full border border-slate-200 text-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Branch <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.branch}
                      onChange={(e) =>
                        setForm({ ...form, branch: e.target.value })
                      }
                      className="w-full border border-slate-200 text-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="">Select Branch</option>
                      {BRANCHES.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Invoice Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. INV-001234"
                      value={form.invoiceNumber}
                      onChange={(e) =>
                        setForm({ ...form, invoiceNumber: e.target.value })
                      }
                      className="w-full border border-slate-200 text-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.department}
                      onChange={(e) =>
                        setForm({ ...form, department: e.target.value })
                      }
                      className="w-full border border-slate-200 text-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="">Select Department</option>
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Complain <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Describe your complaint in detail..."
                    value={form.complain}
                    onChange={(e) =>
                      setForm({ ...form, complain: e.target.value })
                    }
                    rows={4}
                    className="w-full border border-slate-200 text-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleComplaintSubmit}
                    disabled={submitting}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Submit Complaint"
                    )}
                  </button>
                  <p className="text-slate-400 text-xs">
                    Date & time will be recorded automatically.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <h4 className="font-semibold text-slate-800 text-sm mb-2">
                      How it works
                    </h4>
                    <ol className="text-slate-500 text-xs space-y-1 list-decimal list-inside">
                      <li>Fill the complaint form</li>
                      <li>We review & assign internally</li>
                      <li>We reply by SMS/Email</li>
                    </ol>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <h4 className="font-semibold text-slate-800 text-sm mb-2">
                      Privacy
                    </h4>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      Your complaint details are used only for service
                      improvement and resolution.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
