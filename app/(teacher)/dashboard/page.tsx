import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function TeacherDashboard() {
  const session = await getServerSession();

  if (!session) redirect("/login");

  

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Teacher Dashboard</h1>

      <div className="space-y-4">
        <a
          href="/generate"
          className="block bg-blue-600 text-white p-4 rounded text-center"
        >
          Generate QR for Attendance
        </a>

        <a
          href="/sessions"
          className="block bg-gray-800 text-white p-4 rounded text-center"
        >
          View previous sessions
        </a>
      </div>
    </div>
  );
}
