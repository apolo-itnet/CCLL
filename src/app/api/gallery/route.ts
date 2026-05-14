import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Gallery from "@/models/Gallery";

export async function GET() {
  try {
    await connectDB();
    const photos = await Gallery.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: photos });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const photo = await Gallery.create(body);
    return NextResponse.json({ success: true, data: photo }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}