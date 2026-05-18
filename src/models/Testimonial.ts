import mongoose, { Schema, Document } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  companyName: string;
  logo: string;
  cloudinaryId: string;
  message: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    companyName: { type: String, required: true },
    logo: { type: String, default: "" },
    cloudinaryId: { type: String, default: "" },
    message: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
