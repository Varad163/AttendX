import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

export default async function TeacherDashboard() {
  const session = await getServerSession() as (Session & { user?: SessionUser });

  if (!session) redirect("/login");
  if (!session.user || session.user.role !== "teacher") redirect("/student/scan");

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Teacher Dashboard</h1>

      <div className="space-y-4">
        <a
          href="/teacher/generate"
          className="w-full block bg-blue-600 text-white p-4 rounded text-center"
        >
          Generate QR for Attendance
        </a>

        <a
          href="/teacher/sessions"
          className="w-full block bg-gray-800 text-white p-4 rounded text-center"
        >
          View Previous Sessions
        </a>
      </div>
    </div>
  );
}
