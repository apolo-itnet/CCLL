import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import News from "@/models/News";

export async function GET() {
  try {
    await connectDB();
    const news = await News.find().sort({ publishedAt: -1 });
    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const news = await News.create({ ...body, slug });
    return NextResponse.json({ success: true, data: news }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}