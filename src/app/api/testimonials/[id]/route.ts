import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import { logAudit } from "@/lib/audit";

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!role || role === "Staff") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }
    const { id } = await context.params;
    await connectDB();
    const body = await req.json();
    const old = await Testimonial.findById(id);
    const item = await Testimonial.findByIdAndUpdate(id, body, { returnDocument: "after" });
    if (!item) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    const changedFields = Object.keys(body).filter(
      (k) => JSON.stringify((old as any)?.[k]) !== JSON.stringify(body[k])
    );
    await logAudit({
      action: "UPDATE", model: "Testimonial",
      documentId: id, documentName: (item as any).name || id,
      changes: { before: old?.toObject(), after: item.toObject(), fields: changedFields },
    });
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!role || role === "Staff" || role === "Manager") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }
    const { id } = await context.params;
    await connectDB();
    const item = await Testimonial.findById(id);
    if (!item) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    await Testimonial.findByIdAndDelete(id);
    await logAudit({
      action: "DELETE", model: "Testimonial",
      documentId: id, documentName: (item as any).name || id,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
