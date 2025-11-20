import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Attendance from "@/models/Attendance";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ success: false, error: "Unauthorized" });
    }

    const { classId, date } = await req.json();
    await dbConnect();

    if (!classId || !date) {
      return NextResponse.json({ success: false, error: "Missing fields" });
    }

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const attendance = await Attendance.find({
      classId,
      createdAt: { $gte: start, $lte: end },
    }).lean();

    return NextResponse.json({ success: true, attendance });
  } catch (err) {
    console.error("SUMMARY API ERROR:", err);
    return NextResponse.json({ success: false, error: "Server Error" });
  }
}
