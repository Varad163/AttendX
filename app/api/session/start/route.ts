import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import QRSession from "@/models/QRSession";
import Class from "@/models/Class";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ success: false, error: "Unauthorized" });
    }

    const { classId } = await req.json();
    if (!classId)
      return NextResponse.json({ success: false, error: "Missing classId" });

    await dbConnect();

    const cls = await Class.findOne({
      _id: classId,
      teacherId: session.user.id,
    });

    if (!cls)
      return NextResponse.json({ success: false, error: "Class not found" });

    const token = crypto.randomBytes(16).toString("hex");

    const newSession = await QRSession.create({
      classId,
      teacherId: session.user.id,
      qrToken: token,
      isActive: true,
      expiresAt: new Date(Date.now() + 15000),
    });

    return NextResponse.json({
      success: true,
      id: newSession._id.toString(),   // 👈 REQUIRED
      token: newSession.qrToken        // 👈 REQUIRED
    });

  } catch (err) {
    console.error("SESSION CREATE ERROR:", err);
    return NextResponse.json({ success: false, error: "Server error" });
  }
}
