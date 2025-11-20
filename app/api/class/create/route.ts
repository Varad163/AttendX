import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Class from "@/models/Class";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ success: false, error: "Unauthorized" });
    }

    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ success: false, error: "Name required" });
    }

    await dbConnect();

    const newClass = await Class.create({
      name,
      teacherId: session.user.id,
    });

    return NextResponse.json({
      success: true,
      class: {
        id: newClass._id.toString(),
        name: newClass.name,
      },
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Server error" });
  }
}
