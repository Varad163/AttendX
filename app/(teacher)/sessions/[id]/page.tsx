import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {dbConnect} from "@/lib/db";
import Attendance from "@/models/Attendance";
import QRSession from "@/models/QRSession";

type TeacherSessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
  id?: string;
};

export default async function SessionDetails({ params }: any) {
  const session = await getServerSession();
  if (!session) redirect("/login");
  if (!session.user || (session.user as TeacherSessionUser).role !== "teacher") redirect("/student/scan");

  await dbConnect();

  interface QRSessionType {
    _id: string;
    createdAt?: string | Date;
    // add other fields as needed
  }

  const qrSession = await QRSession.findById(params.id).lean() as QRSessionType | null;
  const attendance = await Attendance.find({ sessionId: params.id }).lean();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Session Details</h1>
      <p className="text-gray-600 mt-2">
        Created: {qrSession && qrSession.createdAt ? new Date(qrSession.createdAt).toLocaleString() : "N/A"}
      </p>

      <h2 className="text-xl font-semibold mt-6">Attendance</h2>

      <div className="mt-4 space-y-2">
        {attendance.length === 0 && (
          <p className="text-gray-500">No students marked attendance yet.</p>
        )}

        {attendance.map((a: any) => (
          <div
            key={a._id}
            className="border p-3 rounded bg-white flex justify-between"
          >
            <span>{a.studentEmail}</span>
            <span className="text-green-600 font-medium">
              {a.status.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
