import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import QRSession from "@/models/QRSession";
import { dbConnect } from "@/lib/db";

type TeacherSessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
  id?: string;
};

export default async function TeacherSessionsPage() {
  const session = await getServerSession() as { user?: TeacherSessionUser } | null;
  if (!session) redirect("/login");
  if (!session.user || session.user.role !== "teacher") redirect("/student/scan");

  await dbConnect();

  const sessions = await QRSession.find({ teacherId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Your Attendance Sessions</h1>

      {sessions.length === 0 && (
        <p className="text-gray-600">No sessions found.</p>
      )}

      <div className="space-y-4">
        {sessions.map((s: any) => (
          <a
            key={s._id}
            href={`/teacher/sessions/${s._id}`}
            className="block border border-gray-300 rounded p-4 bg-white hover:bg-gray-50"
          >
            <p className="font-semibold text-lg">Session ID: {s._id}</p>
            <p className="text-gray-600">Class: {s.className}</p>
            <p className="text-gray-600">
              Created: {new Date(s.createdAt).toLocaleString()}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
