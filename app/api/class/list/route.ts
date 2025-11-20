import { dbConnect } from "@/lib/db";
import Class from "@/models/Class";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  const classDocs = await Class.find().sort({ createdAt: -1 }).lean();

  const classes = classDocs.map((c: any) => ({
    id: c._id.toString(),
    name: c.name,
  }));

  return NextResponse.json({
    success: true,
    classes,
  });
}
