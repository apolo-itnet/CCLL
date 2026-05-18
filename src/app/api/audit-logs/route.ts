import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AuditLog from "@/models/AuditLog";

// GET audit logs with filters
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const model = searchParams.get("model"); // null or empty = all models
    const documentId = searchParams.get("documentId");
    const userId = searchParams.get("userId");
    const action = searchParams.get("action");
    const limit = parseInt(searchParams.get("limit") || "200");
    const page = parseInt(searchParams.get("page") || "1");

    const filter: any = {};
    if (model && model.trim()) filter.model = model; // only filter if model provided
    if (documentId) filter.documentId = documentId;
    if (userId) filter.userId = userId;
    if (action) filter.action = action;

    const skip = (page - 1) * limit;

    const logs = await AuditLog.find(filter)
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip);

    const total = await AuditLog.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: logs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Audit log GET error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// CREATE audit log
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const log = await AuditLog.create(body);
    return NextResponse.json({ success: true, data: log }, { status: 201 });
  } catch (error) {
    console.error("Audit log POST error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
