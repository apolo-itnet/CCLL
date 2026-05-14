import mongoose, { Schema, Document } from "mongoose";

export interface IDoctor extends Document {
  name: string;
  designation: string;
  specialty: string;
  department: string;
  qualifications: string;
  image: string;
  cloudinaryId: string;
  visitingHours: string;
  phone: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
}

const DoctorSchema = new Schema<IDoctor>(
  {
    name: { type: String, required: true },
    designation: { type: String, default: "" },
    specialty: { type: String, required: true },
    department: {
      type: String,
      required: true,
      enum: [
        "Medicine", "Surgery", "Pediatric Surgery", "Burn & Plastic Surgery",
        "Neurosurgery", "Cardiac & Medicine", "Orthopedic", "ENT", "Cancer",
        "Psychiatry", "Gynae & Obs", "Paediatric", "Kidney", "Medicine & Kidney",
        "Neuromedicine", "Rheumatology", "Chest Medicine & Heart", "Diabetes & Hormone",
        "Physical Medicine", "Respiratory Medicine", "Liver(Hepatology)", "Urology",
        "Dental", "Skin & VD",
      ],
    },
    qualifications: { type: String, default: "" },
    image: { type: String, default: "" },
    cloudinaryId: { type: String, default: "" },
    visitingHours: { type: String, default: "" },
    phone: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Doctor ||
  mongoose.model<IDoctor>("Doctor", DoctorSchema);