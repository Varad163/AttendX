import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import QRSession from "@/models/QRSession";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Generate secure token
    const qrToken = crypto.randomBytes(16).toString("hex");

    // Expire in 15 seconds
    const expiresAt = new Date(Date.now() + 15 * 1000);

    // Create DB entry
    const newSession = await QRSession.create({
      teacherId: session.user.id,
      classId: "default", // OK now because classId is string
      qrToken,
      expiresAt,
      isActive: true,
    });

    const qrPayload = {
      sessionId: newSession._id.toString(),
      token: qrToken,
    };

    return NextResponse.json({
      success: true,
      qrPayload,
    });
  } catch (err) {
    console.error("START SESSION ERROR:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
