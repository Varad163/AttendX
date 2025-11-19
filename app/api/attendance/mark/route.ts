import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Attendance from "@/models/Attendance";
import {dbConnect} from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { sessionId } = await req.json();
  await dbConnect();

  await Attendance.create({
    sessionId,
    studentEmail: session.user.email,
    studentUsername: session.user.name,   // ⭐ SAVE USERNAME
    status: "present",
  });

  return NextResponse.json({ message: "Attendance marked" });
}
