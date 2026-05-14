import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Package from "@/models/Package";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const pkg = await Package.findByIdAndUpdate(params.id, body, { new: true });
    if (!pkg) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: pkg });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const pkg = await Package.findById(params.id);
    if (!pkg) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    if (pkg.cloudinaryId) await cloudinary.uploader.destroy(pkg.cloudinaryId);
    await Package.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, message: "Package deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}