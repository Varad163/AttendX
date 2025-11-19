import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import QRSession from "@/models/QRSession";
import { dbConnect } from "@/lib/db";

type TeacherSessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
  id?: string;
};

export default async function TeacherSessionsPage() {
  const session = await getServerSession() as any as {
    user: TeacherSessionUser;
  };

  // Ensure logged in
  if (!session || !session.user) {
    redirect("/login");
  }

  // Ensure teacher role
  if (session.user.role !== "teacher") {
    redirect("/scan");
  }

  await dbConnect();

  const sessions = await QRSession.find({
    teacherId: session.user.id!,
  })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Your Attendance Sessions</h1>

      {sessions.length === 0 ? (
        <p>No sessions found.</p>
      ) : (
        sessions.map((s: any) => (
          <div key={s._id} className="p-4 border mb-3 rounded">
            Session ID: {s._id}
          </div>
        ))
      )}
    </div>
  );
}
