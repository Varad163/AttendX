import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import {authOptions} from "@/lib/auth";        // ✅ FIXED
import { dbConnect } from "@/lib/db";
import QRSession from "@/models/QRSession";
import crypto from "crypto";


export async function POST() {
  try {
    // 1. Validate teacher session
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "teacher") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    // 2. Generate QR token & expiry
    const qrToken = crypto.randomBytes(16).toString("hex");

    const expiresAt = new Date(Date.now() + 15 * 1000); // 15 seconds expiry

    // 3. Create QR session in DB
    const newSession = await QRSession.create({
      classId: "673123456789012345678901", // <-- change if needed
      teacherId: session.user.id,
      qrToken,
      expiresAt,
      isActive: true,
    });

    // 4. Payload student will scan inside QR
    const qrPayload = {
      sessionId: newSession._id.toString(),
      qrToken: newSession.qrToken,
      expiresAt: newSession.expiresAt,
    };

    return NextResponse.json(
      {
        success: true,
        qrPayload,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Start session error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
