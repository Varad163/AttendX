import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { dbConnect } from "@/lib/db";
import Attendance from "@/models/Attendance";

export default async function StudentHistoryPage() {
  const session = await getServerSession();
  if (!session) redirect("/login");

  await dbConnect();

  const attendance = await Attendance.find({
    studentId: session.user.id,
  })
    .sort({ timestamp: -1 })
    .lean();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Attendance</h1>

        <a
          href="/scan"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Scan QR
        </a>
      </div>

      {attendance.length === 0 && (
        <p className="text-gray-600">No attendance records found.</p>
      )}

      <div className="space-y-3">
        {attendance.map((a: any) => (
          <div key={a._id} className="p-3 border rounded bg-white">
            <p className="text-gray-600">
              Time: {new Date(a.timestamp).toLocaleString()}
            </p>

            <p
              className={`font-semibold ${
                a.status === "present" ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {a.status.toUpperCase()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
