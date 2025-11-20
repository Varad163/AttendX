import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import QRSession from "@/models/QRSession";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ success: false, error: "Unauthorized" });
    }

    await dbConnect();

    const qrToken = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 1000);

    const newSession = await QRSession.create({
      teacherId: session.user.id,
      classId: "6748f070cbb0cff72b35b9ce", // ✔ your real classId HERE
      qrToken,
      expiresAt,
    });

    const qrPayload = {
      id: newSession._id,
      token: qrToken,
    };

    return NextResponse.json({ success: true, qrPayload });
  } catch (err) {
    console.error("START SESSION ERROR:", err);
    return NextResponse.json({ success: false, error: "Server Error" });
  }
}
