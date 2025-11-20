import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Class from "@/models/Class";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";

export async function GET(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions); 
  // ❗ Now works in App Router

  if (!session || session.user.role !== "teacher") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const classes = await Class.find({ teacherId: session.user.id }).lean();

  return NextResponse.json({
    success: true,
    classes: classes.map((c) => ({
      id: String(c._id),
      name: c.name,
    })),
  });
}
