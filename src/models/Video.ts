import mongoose, { Schema, Document } from "mongoose";

export interface IVideo extends Document {
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnail: string;
  category: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: Date;
}

const VideoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    youtubeUrl: { type: String, required: true },
    thumbnail: { type: String, default: "" },
    category: { type: String, default: "Corporate" },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Video || mongoose.model<IVideo>("Video", VideoSchema);