import mongoose, { Schema, Document } from "mongoose";

export interface IDoctor extends Document {
  name: string;
  designation: string;
  specialties: string[];         // multiple specialties (array)
  department: string;
  qualifications: string;
  image: string;
  cloudinaryId: string;
  visitingHours: string;
  personalPhone: string;         // dashboard only — hidden from website
  isActive: boolean;
  order: number;
  floorNumber?: string;          // floor instead of serial
  roomNumber?: string;
  birthday?: string;             // for birthday notification
  about?: string;
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
  createdAt: Date;
}

const DEPARTMENTS = [
  "Burn & Plastic Surgery", "Cardiology", "Colorectal Surgery", "Dentistry",
  "Endocrinology", "ENT", "General Surgery", "Gynaecology & Obstetrics",
  "Hepatobiliary Surgery", "Hepatology", "Laparoscopic Surgery", "Medicine",
  "Nephrology", "Neurology", "Neurosurgery", "Oncology", "Orthopaedics",
  "Pediatrics", "Physical Medicine", "Psychiatry", "Respiratory Medicine",
  "Rheumatology", "Skin & Venereal Diseases", "Surgical Oncology", "Urology",
];

const DoctorSchema = new Schema<IDoctor>(
  {
    name: { type: String, required: true },
    designation: { type: String, default: "" },
    specialties: [{ type: String }],
    department: { type: String, required: true, enum: DEPARTMENTS },
    qualifications: { type: String, default: "" },
    image: { type: String, default: "" },
    cloudinaryId: { type: String, default: "" },
    visitingHours: { type: String, default: "" },
    personalPhone: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    floorNumber: { type: String, default: "" },
    roomNumber: { type: String, default: "" },
    birthday: { type: String, default: "" },
    about: { type: String, default: "" },
    chamberDetails: {
      name: { type: String, default: "" },
      address: { type: String, default: "" },
      phone: { type: String, default: "" },
    },
    schedule: { type: Object, default: {} },
    socialLinks: {
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },
    leaveStatus: { type: String, enum: ["active", "on-leave"], default: "active" },
    leaveDuration: {
      startDate: { type: String, default: "" },
      endDate: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export const DOCTOR_DEPARTMENTS = DEPARTMENTS;
export default mongoose.models.Doctor || mongoose.model<IDoctor>("Doctor", DoctorSchema);
