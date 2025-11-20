import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Attendance from "@/models/Attendance";
import { dbConnect } from "@/lib/db";
import { Calendar, Clock, CheckCircle2, XCircle } from "lucide-react";

export default async function StudentHistoryPage() {
  const session = (await getServerSession()) as any;
  if (!session) redirect("/login");

  await dbConnect();

  let attendanceRaw = await Attendance.find({
    studentEmail: session.user.email,
  })
    .sort({ createdAt: -1 })
    .lean();

  const attendance = attendanceRaw.map((item: any) => ({
    ...item,
    _id: item._id.toString(),
    sessionId: item.sessionId?.toString(),
    classId: item.classId?.toString(),
    createdAt: item.createdAt?.toString(),
  }));

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-white">📘 My Attendance</h1>

        <a
          href="/scan"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded-lg shadow"
        >
          Scan QR
        </a>
      </div>

      {/* Empty State */}
      {attendance.length === 0 && (
        <div className="text-center mt-12">
          <XCircle className="w-12 h-12 text-gray-500 mx-auto" />
          <p className="text-gray-400 mt-2 text-lg">No attendance records found.</p>
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {attendance.map((item) => (
          <div
            key={item._id}
            className="bg-gray-900/40 border border-gray-700 rounded-xl p-5 shadow-md hover:shadow-xl transition"
          >
            {/* Session ID + Status */}
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-300 text-sm">Session ID</p>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  item.status === "present"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {item.status.toUpperCase()}
              </span>
            </div>

            <p className="font-mono text-sm text-white mb-2">
              {item.sessionId}
            </p>

            {/* Class ID */}
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Calendar size={16} />
              <span className="font-medium">Class ID:</span> {item.classId}
            </div>

            {/* Time */}
            <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
              <Clock size={16} />
              <span className="font-medium">Time:</span>{" "}
              {new Date(item.createdAt).toLocaleString()}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-700 my-3"></div>

            {/* Footer */}
            <p className="text-xs text-gray-500">
              ✔️ Marked automatically using QR
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
