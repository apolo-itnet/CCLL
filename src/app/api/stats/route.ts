import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import Package from "@/models/Package";
import Gallery from "@/models/Gallery";
import News from "@/models/News";

export async function GET() {
  try {
    await connectDB();
    const [doctors, packages, gallery, news] = await Promise.all([
      Doctor.countDocuments({ isActive: true }),
      Package.countDocuments({ isActive: true }),
      Gallery.countDocuments({ isActive: true }),
      News.countDocuments({ isActive: true }),
    ]);

    return NextResponse.json({
      success: true,
      data: { doctors, packages, gallery, news },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}