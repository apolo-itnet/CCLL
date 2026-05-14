import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Video from "@/models/Video";

export async function GET() {
  try {
    await connectDB();
    const videos = await Video.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: videos });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const video = await Video.create(body);
    return NextResponse.json({ success: true, data: video }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}