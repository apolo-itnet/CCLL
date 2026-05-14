import Link from "next/link";
import { Activity, Phone, Mail, MapPin } from "lucide-react";
import { FaFacebookF, FaYoutube } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-lg leading-none">CCLL</p>
                <p className="text-blue-400 text-xs">Diagnostic Laboratory</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Chittagong Clinical & Diagnostic Laboratory Ltd. — Providing world-class diagnostic services since establishment.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="w-9 h-9 bg-slate-800 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-all">
                <FaFacebookF   className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-slate-800 hover:bg-red-600 rounded-xl flex items-center justify-center transition-all">
                <FaYoutube  className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4">Our Services</h4>
            <ul className="space-y-2">
              {["Pathology", "Radiology & Imaging", "Cardiology", "ENT", "Gastroenterology", "Neurophysiology", "Ultrasonography"].map((s) => (
                <li key={s}>
                  <Link href="/services" className="text-slate-400 hover:text-blue-400 text-sm transition-colors">{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Branches */}
          <div>
            <h4 className="font-semibold text-white mb-4">Our Branches</h4>
            <ul className="space-y-2">
              {["Halisahar", "Bondortila", "Anowara", "Potiya", "Cox's Bazar", "Hathazari", "Rangamati", "Feni"].map((b) => (
                <li key={b}>
                  <Link href="/branches" className="text-slate-400 hover:text-blue-400 text-sm transition-colors">{b}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-400 text-sm">Chittagong, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-slate-400 text-sm">+880 31-XXXXXXX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-slate-400 text-sm">info@ccll.com.bd</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-slate-500 text-sm">© 2025 CCLL. All rights reserved.</p>
          <p className="text-slate-600 text-xs">Developed with ❤️ for better healthcare</p>
        </div>
      </div>
    </footer>
  );
}