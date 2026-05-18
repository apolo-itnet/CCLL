import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import Package from "@/models/Package";
import Gallery from "@/models/Gallery";
import News from "@/models/News";
import Complaint from "@/models/Complaint";
import CorporateClient from "@/models/CorporateClient";
import Testimonial from "@/models/Testimonial";

export async function GET() {
  try {
    await connectDB();
    const [doctors, packages, gallery, news, complaints, corporateClients, testimonials] = await Promise.all([
      Doctor.countDocuments({ isActive: true }),
      Package.countDocuments({ isActive: true }),
      Gallery.countDocuments({ isActive: true }),
      News.countDocuments({ isActive: true }),
      Complaint.countDocuments(),
      CorporateClient.countDocuments({ isActive: true }),
      Testimonial.countDocuments({ isActive: true }),
    ]);

    return NextResponse.json({
      success: true,
      data: { doctors, packages, gallery, news, complaints, corporateClients, testimonials },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}