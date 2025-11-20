import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Class from "@/models/Class";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, section, subject, teacherId } = await req.json();

    if (!name || !section || !subject || !teacherId) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    const created = await Class.create({
      name,
      section,
      subject,
      teacherId
    });

    return NextResponse.json({ success: true, class: created });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
