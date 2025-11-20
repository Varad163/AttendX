import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import QRSession from "@/models/QRSession";
import Attendance from "@/models/Attendance";
import { dbConnect } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" });
    }

    const { id, token } = await req.json();
    await dbConnect();

    // Validate QR session
    const qrSession = await QRSession.findOne({
      _id: id,
      qrToken: token,
      isActive: true,
      expiresAt: { $gt: new Date() },
    });

    if (!qrSession) {
      return NextResponse.json({ success: false, error: "Invalid Session" });
    }

    // Fallback username logic
    const username =
      session.user.name || session.user.email?.split("@")[0] || "unknown";

    // Create attendance
    await Attendance.create({
      sessionId: qrSession._id,
      classId: qrSession.classId,
      studentId: session.user.id,
      studentUsername: username,
      studentEmail: session.user.email,
      status: "present",
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("ATTENDANCE ERROR:", err);
    return NextResponse.json({
      success: false,
      error: "Server Error",
    });
  }
}
