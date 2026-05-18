import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import News from "@/models/News";
import { logAudit } from "@/lib/audit";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    const old = await News.findById(id);
    const item = await News.findByIdAndUpdate(id, body, { returnDocument: "after" });
    if (!item) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    const changedFields = Object.keys(body).filter(
      (k) => JSON.stringify((old as any)?.[k]) !== JSON.stringify(body[k])
    );
    await logAudit({
      action: "UPDATE", model: "News",
      documentId: id, documentName: (item as any).title || id,
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
    const item = await News.findById(id);
    if (!item) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    if ((item as any).cloudinaryId) {
      await cloudinary.uploader.destroy((item as any).cloudinaryId).catch(() => {});
    }
    await News.findByIdAndDelete(id);
    await logAudit({
      action: "DELETE", model: "News",
      documentId: id, documentName: (item as any).title || id,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
