import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Attendance from "@/models/Attendance";
import QRSession from "@/models/QRSession";
import { dbConnect } from "@/lib/db";

export default async function SessionDetails({ params }: any) {
  const session = await getServerSession();
  if (!session || session.user.role !== "teacher") {
    redirect("/login");
  }

  await dbConnect();

  const sessionData = await QRSession.findById(params.id).lean();
  if (!sessionData) {
    return <div className="p-6">Session not found.</div>;
  }

  const attendance = await Attendance.find({
    sessionId: params.id,
  }).lean();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Session Details</h1>

      <p className="text-lg text-gray-700 mb-4">
        Session ID: {params.id}
      </p>

      <h2 className="text-xl font-semibold mb-2">Students Attended:</h2>

      {attendance.length === 0 ? (
        <p className="text-gray-600">No attendance yet.</p>
      ) : (
        <div className="space-y-3">
          {attendance.map((a: any) => (
            <div key={a._id} className="p-3 border rounded bg-white shadow-sm">
              <p className="font-medium">{a.studentUsername}</p>
              <p className="text-gray-600">{a.studentEmail}</p>
              <p className="text-gray-600">
                Time: {new Date(a.createdAt).toLocaleString()}
              </p>

              <p
                className={`font-semibold ${
                  a.status === "present"
                    ? "text-green-600"
                    : "text-orange-600"
                }`}
              >
                {a.status.toUpperCase()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
