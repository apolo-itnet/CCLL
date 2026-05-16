import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
  userId: string;
  userName: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  model: string;
  documentId: string;
  documentName: string;
  changes?: {
    before?: Record<string, any>;
    after?: Record<string, any>;
    fields?: string[];
  };
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    action: {
      type: String,
      enum: ["CREATE", "UPDATE", "DELETE"],
      required: true,
    },
    model: { type: String, required: true },
    documentId: { type: String, required: true },
    documentName: { type: String, required: true },
    changes: {
      before: Schema.Types.Mixed,
      after: Schema.Types.Mixed,
      fields: [String],
    },
    timestamp: { type: Date, default: Date.now, index: true },
    ipAddress: String,
    userAgent: String,
  },
  { timestamps: true }
);

AuditLogSchema.index({ model: 1, documentId: 1 });
AuditLogSchema.index({ userId: 1, timestamp: -1 });
AuditLogSchema.index({ action: 1, timestamp: -1 });

export default mongoose.models.AuditLog ||
  mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
