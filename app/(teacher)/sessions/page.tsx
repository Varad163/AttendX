import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import QRSession from "@/models/QRSession";
import { dbConnect } from "@/lib/db";
import { BadgeCheck, Clock, Calendar, QrCode } from "lucide-react";

export default async function TeacherSessionsPage() {
  const session = await getServerSession();

  if (!session) redirect("/login");
  if (session.user.role !== "teacher") redirect("/history");

  await dbConnect();

  // Fetch teacher’s sessions
  const sessions = await QRSession.find({ teacherId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-black">📚 Previous QR Sessions</h1>

      {sessions.length === 0 && (
        <p className="text-gray-600">No sessions found yet.</p>
      )}

      <div className="space-y-4">
        {sessions.map((s: any) => {
          const isExpired = new Date(s.expiresAt) < new Date();

          return (
            <a
              key={s._id}
              href={`/sessions/${s._id}`}
              className="block p-4 border rounded-lg bg-white shadow hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-black flex items-center gap-2">
                    <QrCode className="w-5 h-5" />
                    Session ID: {s._id}
                  </p>

                  <p className="text-gray-700 mt-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Created: {new Date(s.createdAt).toLocaleString()}
                  </p>

                  <p className="text-gray-700 mt-1 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Expires: {new Date(s.expiresAt).toLocaleString()}
                  </p>
                </div>

                <div>
                  {isExpired ? (
                    <span className="text-red-600 text-sm font-semibold">
                      🔴 Expired
                    </span>
                  ) : (
                    <span className="text-green-600 text-sm font-semibold">
                      🟢 Active
                    </span>
                  )}
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
