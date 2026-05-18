import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Complaint from "@/models/Complaint";

export async function GET() {
  try {
    await connectDB();
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: complaints });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const complaint = await Complaint.create(body);
    return NextResponse.json({ success: true, data: complaint }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
