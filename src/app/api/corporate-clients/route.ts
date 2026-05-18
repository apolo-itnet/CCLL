import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import CorporateClient from "@/models/CorporateClient";

export async function GET() {
  try {
    await connectDB();
    const clients = await CorporateClient.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: clients });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const client = await CorporateClient.create(body);
    return NextResponse.json({ success: true, data: client }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
