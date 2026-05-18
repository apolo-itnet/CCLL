import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa6";

const quickLinks = [
  { label: "Find a Doctor", href: "/doctors" },
  { label: "Health Packages", href: "/packages" },
  { label: "Range of Services", href: "/services" },
  { label: "News & Media", href: "/news" },
  { label: "Our Branches", href: "/branches" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Our Units", href: "/units" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer */}
      <div className="container-md py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {/* Left — Contact Info */}
          <div className="space-y-4">
            <h4 className="text-slate-300 font-semibold text-sm uppercase tracking-wider mb-5">
              Contact Information
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-slate-400 text-sm">Hotline</p>
                  <p className="text-white text-sm font-medium">
                    01755-666969, 01713-487903
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-slate-400 text-sm">Doctor Info</p>
                  <p className="text-white text-sm font-medium">
                    01756-203720, 01713-487901
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-slate-400 text-sm">Email</p>
                  <p className="text-white text-sm font-medium">
                    info@ccll.com.bd
                  </p>
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div className="pt-2">
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-3">
                Follow Us
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="w-9 h-9 bg-slate-800 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-all"
                >
                  <FaFacebookF className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-slate-800 hover:bg-red-600 rounded-xl flex items-center justify-center transition-all"
                >
                  <FaYoutube className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-slate-800 hover:bg-pink-600 rounded-xl flex items-center justify-center transition-all"
                >
                  <FaInstagram className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-slate-800 hover:bg-blue-500 rounded-xl flex items-center justify-center transition-all"
                >
                  <FaLinkedinIn className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-slate-800 hover:bg-emerald-600 rounded-xl flex items-center justify-center transition-all"
                >
                  <FaWhatsapp className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Center — Logo + Tagline */}
          <div className="flex flex-col items-center text-center gap-6">
            <div className="w-64 h-64 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center p-4">
              <Image
                src={process.env.NEXT_PUBLIC_LOGO_URL_DESKTOP!}
                alt="CCLL Logo"
                width={100}
                height={100}
                className="w-full h-full object-contain brightness-0 invert"
              />
            </div>
            {/* <div>
              <p className="font-bold text-xl text-white leading-tight">
                CHEVRON
              </p>
              <p className="text-blue-400 text-sm mt-1">
                {" "}
                Clinical Laboratory (PTE) Ltd.
              </p>
              <p className="text-slate-500 text-xs mt-2 italic">
                Your Health, Our Priority
              </p>
            </div> */}
            <Link
              href="/contact"
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all"
            >
              Contact Us
            </Link>
          </div>

          {/* Right — Address + Quick Links */}
          <div className="space-y-4 md:text-right">
            <div>
              <h4 className="text-slate-300 font-semibold text-sm uppercase tracking-wider mb-5">
                Head Office
              </h4>
              <div className="flex items-start gap-3 md:flex-row-reverse">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-slate-400 text-sm leading-relaxed">
                  Chittagong, Bangladesh
                  <br />
                  Every Day 7 AM – 10:30 PM
                </p>
              </div>
            </div>
            <div className="pt-2">
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-3">
                Privacy Policy
              </p>
              <Link
                href="#"
                className="text-slate-400 hover:text-white text-sm transition-colors underline underline-offset-2"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Links Row */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-slate-400 hover:text-white text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Tagline watermark */}
        <div className="mt-8 text-center overflow-hidden">
          <p className="text-slate-800 text-5xl md:text-7xl font-extrabold tracking-tight select-none">
            Your Health, Our Priority
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container-md py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-slate-500 text-sm">
            © 2026 CCLL. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs">Developed by Nexawebs ❤️</p>
        </div>
      </div>
    </footer>
  );
}
