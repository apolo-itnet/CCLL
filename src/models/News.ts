import mongoose, { Schema, Document } from "mongoose";

export interface INews extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: string;
  cloudinaryId: string;
  category: string;
  isActive: boolean;
  isFeatured: boolean;
  publishedAt: Date;
  createdAt: Date;
}

const NewsSchema = new Schema<INews>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String, default: "" },
    image: { type: String, default: "" },
    cloudinaryId: { type: String, default: "" },
    category: {
      type: String,
      enum: ["News", "Media", "Press Release", "Event"],
      default: "News",
    },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.News || mongoose.model<INews>("News", NewsSchema);