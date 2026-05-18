import mongoose, { Schema, Document } from "mongoose";

export interface ICorporateClient extends Document {
  name: string;
  logo: string;
  cloudinaryId: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
}

const CorporateClientSchema = new Schema<ICorporateClient>(
  {
    name: { type: String, required: true },
    logo: { type: String, required: true },
    cloudinaryId: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.CorporateClient ||
  mongoose.model<ICorporateClient>("CorporateClient", CorporateClientSchema);
