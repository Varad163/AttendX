import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { hash } from "bcrypt";

export async function POST(req: Request) {
  const { name, email, password, role } = await req.json();

  await connectDB();

  const exists = await User.findOne({ email });
  if (exists) return Response.json({ error: "User already exists" });

  const hashed = await hash(password, 10);

  await User.create({
    name,
    email,
    password: hashed,
    role: role || "student"
  });

  return Response.json({ success: true });
}
