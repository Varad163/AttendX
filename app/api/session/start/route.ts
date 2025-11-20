// app/api/session/start/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import QRSession from "@/models/QRSession";
import Class from "@/models/Class";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "teacher") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { classId } = await req.json();

    if (!classId) {
      return NextResponse.json(
        { success: false, error: "classId is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // ✅ Make sure this class belongs to this teacher
    const cls = await Class.findOne({
      _id: classId,
      teacherId: session.user.id,
    });

    if (!cls) {
      return NextResponse.json(
        { success: false, error: "Class not found for this teacher" },
        { status: 404 }
      );
    }

    // Generate secure token
    const qrToken = crypto.randomBytes(16).toString("hex");

    // Expire in 15 seconds
    const expiresAt = new Date(Date.now() + 15 * 1000);

    // Optional: deactivate previous active sessions for the same class
    await QRSession.updateMany(
      { teacherId: session.user.id, classId, isActive: true },
      { isActive: false }
    );

    // Create DB entry
    const newSession = await QRSession.create({
      teacherId: session.user.id,
      classId,
      qrToken,
      expiresAt,
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      qrPayload: {
        sessionId: newSession._id.toString(),
        token: qrToken,
        classId,
        className: cls.name,
        expiresAt: expiresAt.toISOString(),
      },
    });
  } catch (err) {
    console.error("START SESSION ERROR:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
