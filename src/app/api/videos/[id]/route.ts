import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Video from "@/models/Video";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const video = await Video.findByIdAndUpdate(params.id, body, { new: true });
    if (!video) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: video });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const video = await Video.findById(params.id);
    if (!video) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    await Video.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, message: "Video deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}