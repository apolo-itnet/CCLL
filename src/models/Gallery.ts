import mongoose, { Schema, Document } from "mongoose";

export interface IGallery extends Document {
  title: string;
  image: string;
  cloudinaryId: string;
  category: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
}

const GallerySchema = new Schema<IGallery>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    cloudinaryId: { type: String, required: true },
    category: { type: String, default: "General" },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Gallery || mongoose.model<IGallery>("Gallery", GallerySchema);