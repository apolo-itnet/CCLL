import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import AuditLog from "@/models/AuditLog";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET single doctor
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const doctor = await Doctor.findById(id);
    if (!doctor) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: doctor });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

// PUT update doctor
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const oldDoctor = await Doctor.findById(id);
    const doctor = await Doctor.findByIdAndUpdate(id, body, { new: true });
    if (!doctor) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    // Log audit
    const changedFields = Object.keys(body).filter(
      (key) => JSON.stringify(oldDoctor?.[key as keyof typeof oldDoctor]) !== JSON.stringify(body[key])
    );

    await AuditLog.create({
      userId: "system",
      userName: "System",
      action: "UPDATE",
      model: "Doctor",
      documentId: id,
      documentName: doctor.name,
      changes: {
        before: oldDoctor?.toObject(),
        after: doctor.toObject(),
        fields: changedFields,
      },
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true, data: doctor });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

// DELETE doctor
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const doctor = await Doctor.findById(id);
    if (!doctor) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    if (doctor.cloudinaryId) {
      await cloudinary.uploader.destroy(doctor.cloudinaryId);
    }

    await Doctor.findByIdAndDelete(id);

    // Log audit
    await AuditLog.create({
      userId: "system",
      userName: "System",
      action: "DELETE",
      model: "Doctor",
      documentId: id,
      documentName: doctor.name,
      changes: {
        before: doctor.toObject(),
      },
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true, message: "Doctor deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}