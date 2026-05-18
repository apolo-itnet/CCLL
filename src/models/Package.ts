import mongoose, { Schema, Document } from "mongoose";

export const PACKAGE_CATEGORIES = [
  "Blood Test",
  "Urine Test",
  "Imaging & Radiology",
  "Cardiology",
  "Diabetes Screening",
  "Full Body Checkup",
  "Women's Health",
  "Men's Health",
  "Child Health",
  "Cancer Screening",
  "Liver & Kidney",
  "Thyroid",
  "Allergy Test",
  "Corporate Package",
  "Other",
];

export interface IPackage extends Document {
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  tests: string[];
  category: string;
  image: string;
  cloudinaryId: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: Date;
}

const PackageSchema = new Schema<IPackage>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },
    tests: [{ type: String }],
    category: { type: String, required: true, enum: PACKAGE_CATEGORIES, default: "Other" },
    image: { type: String, default: "" },
    cloudinaryId: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Package || mongoose.model<IPackage>("Package", PackageSchema);
