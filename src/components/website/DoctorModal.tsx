"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Doctor {
  _id: string;
  name: string;
  designation: string;
  specialty: string;
  department: string;
  qualifications: string;
  image: string;
  phone: string;
  about?: string;
  roomNumber?: string;
  serialNumber?: string;
  chamberDetails?: {
    name?: string;
    address?: string;
    phone?: string;
  };
  schedule?: {
    [key: string]: {
      start: string;
      end: string;
      isOff?: boolean;
    };
  };
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  leaveStatus?: "active" | "on-leave";
  leaveDuration?: {
    startDate?: string;
    endDate?: string;
  };
}

interface DoctorModalProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
  allDoctors: Doctor[];
}

export default function DoctorModal({
  doctor,
  isOpen,
  onClose,
  allDoctors,
}: DoctorModalProps) {
  const [similarDoctors, setSimilarDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    if (doctor) {
      const similar = allDoctors.filter(
        (d) =>
          d.department === doctor.department &&
          d._id !== doctor._id
      );
      setSimilarDoctors(similar.slice(0, 6));
    }
  }, [doctor, allDoctors]);

  if (!isOpen || !doctor) return null;

  const scheduleArray = Object.entries(doctor.schedule || {}).map(
    ([day, time]) => ({
      day,
      ...time,
    })
  );

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
          className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
          {/* Left Side */}
          <div className="space-y-6">
            {/* Doctor Photo */}
            <div className="flex justify-center">
              <div className="w-48 h-48 rounded-2xl overflow-hidden bg-slate-100 border-4 border-emerald-600">
                {doctor.image ? (
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    No image
                  </div>
                )}
              </div>
            </div>

            {/* Doctor Info */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800">
                {doctor.name}
              </h2>
              <p className="text-emerald-600 font-semibold mt-1">
                {doctor.department}
              </p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    doctor.leaveStatus === "on-leave"
                      ? "bg-red-500 text-white"
                      : "bg-emerald-500 text-white"
                  }`}
                >
                  {doctor.leaveStatus === "on-leave" ? "On Leave" : "Active"}
                </span>
              </div>
            </div>

            {/* Similar Doctors */}
            {similarDoctors.length > 0 && (
              <div className="border-t border-slate-200 pt-6">
                <h3 className="font-semibold text-slate-800 mb-4 text-center">
                  Similar Doctors
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {similarDoctors.map((doc) => (
                    <div key={doc._id} className="text-center">
                      <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-2 bg-slate-100 border-2 border-emerald-200">
                        {doc.image ? (
                          <Image
                            src={doc.image}
                            alt={doc.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                            No img
                          </div>
                        )}
                      </div>
                      <p className="text-xs font-medium text-slate-700 line-clamp-2">
                        {doc.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Side */}
          <div className="space-y-6">
            {/* Bio */}
            {doctor.about && (
              <div>
                <h3 className="text-lg font-bold text-emerald-600 mb-2">
                  About
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  {doctor.about}
                </p>
              </div>
            )}

            {/* Degrees */}
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">Degrees</h4>
              <p className="text-slate-600 text-sm">
                {doctor.qualifications || "Not available"}
              </p>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">Contact</h4>
              <p className="text-slate-600 text-sm">
                {doctor.phone || "Not available"}
              </p>
            </div>

            {/* Book on Appointment Button */}
            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors">
              Book on Appointment
            </button>

            {/* Chamber Details */}
            {doctor.chamberDetails && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <h4 className="font-semibold text-slate-800 mb-2">
                  Chamber Details
                </h4>
                {doctor.leaveDuration?.startDate && (
                  <p className="text-yellow-700 text-sm mb-3">
                    🏥 In Leave from {doctor.leaveDuration.startDate} to{" "}
                    {doctor.leaveDuration.endDate}
                  </p>
                )}
                <div>
                  <p className="font-medium text-slate-800">
                    {doctor.chamberDetails.name}
                  </p>
                  <p className="text-sm text-slate-600">
                    {doctor.chamberDetails.address}
                  </p>
                  {doctor.chamberDetails.phone && (
                    <p className="text-sm text-slate-600 mt-1">
                      📞 {doctor.chamberDetails.phone}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Schedule */}
            {scheduleArray.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-800 mb-3">Schedule</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-emerald-600 text-white">
                        <th className="px-3 py-2 text-left">Day</th>
                        <th className="px-3 py-2 text-left">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduleArray.map((s) => (
                        <tr
                          key={s.day}
                          className="border-b border-slate-200 hover:bg-slate-50"
                        >
                          <td className="px-3 py-2 text-slate-700 font-medium">
                            {s.day}
                          </td>
                          <td className="px-3 py-2 text-slate-600">
                            {s.isOff ? "Off" : `${s.start} - ${s.end}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
