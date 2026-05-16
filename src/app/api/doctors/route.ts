import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import AuditLog from "@/models/AuditLog";

// GET all doctors
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const department = searchParams.get("department");

    const filter = department ? { department, isActive: true } : {};
    const doctors = await Doctor.find(filter).sort({ order: 1, createdAt: -1 });

    return NextResponse.json({ success: true, data: doctors });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

// POST create doctor
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    console.log("Doctor body:", body);
    const doctor = await Doctor.create(body);

    // Log audit
    await AuditLog.create({
      userId: "system",
      userName: "System",
      action: "CREATE",
      model: "Doctor",
      documentId: doctor._id.toString(),
      documentName: doctor.name,
      changes: {
        after: doctor.toObject(),
        fields: Object.keys(body),
      },
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true, data: doctor }, { status: 201 });
  } catch (error) {
    console.error("Doctor POST error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}