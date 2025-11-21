import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

import QRSession from "@/models/QRSession";
import ClassModel from "@/models/Class";
import Attendance from "@/models/Attendance";
import { dbConnect } from "@/lib/db";

export default async function SessionsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "teacher") {
    redirect("/login");
  }

  await dbConnect();

  // STEP 1 → fetch all classes of teacher
  const classes = await ClassModel.find({
    teacherId: session.user.id,
  })
    .sort({ createdAt: -1 })
    .lean();

  // STEP 2 → fetch all sessions of teacher
  const qrSessions = await QRSession.find({
    teacherId: session.user.id,
  })
    .sort({ createdAt: -1 })
    .lean();

  // STEP 3 → attach attendance count to each session
  for (let s of qrSessions) {
    const count = await Attendance.countDocuments({ sessionId: s._id });
    s.attendanceCount = count;
  }

  // STEP 4 → group sessions under their class
  const grouped: any = {};

  classes.forEach((cls: any) => {
    grouped[cls._id] = {
      class: cls,
      sessions: [],
    };
  });

  qrSessions.forEach((session: any) => {
    if (grouped[session.classId]) {
      grouped[session.classId].sessions.push(session);
    }
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-6">
      <div className="max-w-4xl mx-auto">

        {/* PAGE TITLE */}
        <h1 className="text-3xl font-bold mb-6">📚 Class-wise Attendance Sessions</h1>

        {/* NO CLASSES */}
        {classes.length === 0 && (
          <p className="text-slate-400">You have not created any classes yet.</p>
        )}

        {/* RENDER CLASS GROUPS */}
        {Object.values(grouped).map((item: any) => {
          const cls = item.class;
          const sessions = item.sessions;

          return (
            <div
              key={cls._id}
              className="mb-8 p-5 rounded-xl bg-slate-900 border border-slate-700"
            >
              {/* CLASS TITLE */}
              <h2 className="text-xl font-semibold mb-3">
                📘 {cls.name}{" "}
                {cls.division && (
                  <span className="text-slate-400 text-sm">({cls.division})</span>
                )}
              </h2>

              {/* NO SESSIONS */}
              {sessions.length === 0 && (
                <p className="text-slate-500 text-sm">No sessions created yet.</p>
              )}

              {/* SESSION LIST */}
              {sessions.map((s: any) => (
                <div
                  key={s._id}
                  className="mb-4 p-4 bg-slate-800 rounded-lg border border-slate-600"
                >
                  <p className="text-sm text-slate-400">
                    Session ID: <span className="text-white">{s._id.toString()}</span>
                  </p>

                  <p className="text-sm text-slate-400 mt-1">
                    Time:{" "}
                    <span className="text-white">
                      {new Date(s.createdAt).toLocaleString()}
                    </span>
                  </p>

                  <p className="text-sm text-slate-400 mt-1">
                    Attendance Marked:{" "}
                    <span className="text-green-400 font-bold">
                      {s.attendanceCount}
                    </span>
                  </p>

                  {!s.isActive ? (
                    <p className="mt-2 text-xs text-red-400">Expired</p>
                  ) : (
                    <p className="mt-2 text-xs text-green-400">Active</p>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
