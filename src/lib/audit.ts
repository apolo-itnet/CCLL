import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AuditLog from "@/models/AuditLog";

export async function logAudit({
  action,
  model,
  documentId,
  documentName,
  changes,
}: {
  action: "CREATE" | "UPDATE" | "DELETE";
  model: string;
  documentId: string;
  documentName: string;
  changes?: { before?: any; after?: any; fields?: string[] };
}) {
  try {
    const session = await getServerSession(authOptions);
    await AuditLog.create({
      userId: (session?.user as any)?.id || "system",
      userName: session?.user?.name || "System",
      action,
      model,
      documentId,
      documentName,
      changes,
      timestamp: new Date(),
    });
  } catch {
    // audit log failure should not break the main operation
  }
}
