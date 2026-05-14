import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Package from "@/models/Package";

export async function GET() {
  try {
    await connectDB();
    const packages = await Package.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: packages });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const pkg = await Package.create(body);
    return NextResponse.json({ success: true, data: pkg }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}