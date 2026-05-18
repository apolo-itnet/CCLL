import mongoose, { Schema, Document } from "mongoose";

export interface IComplaint extends Document {
  complainType: "Service" | "Report Delay" | "Billing" | "Behavior";
  priority: "Low" | "Medium" | "High" | "Urgent";
  patientName: string;
  invoiceNumber: string;
  mobile: string;
  email: string;
  branch: string;
  department: string;
  complain: string;
  status: "Pending" | "In Review" | "Resolved" | "Closed";
  createdAt: Date;
}

const ComplaintSchema = new Schema<IComplaint>(
  {
    complainType: {
      type: String,
      enum: ["Service", "Report Delay", "Billing", "Behavior"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    patientName: { type: String, required: true },
    invoiceNumber: { type: String, default: "" },
    mobile: { type: String, required: true },
    email: { type: String, default: "" },
    branch: { type: String, required: true },
    department: { type: String, required: true },
    complain: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "In Review", "Resolved", "Closed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Complaint ||
  mongoose.model<IComplaint>("Complaint", ComplaintSchema);
