"use client";

import { useState } from "react";

export default function AttendanceSummaryPage() {
  const [classId, setClassId] = useState("");
  const [date, setDate] = useState("");
  const [attendance, setAttendance] = useState([]);

  async function fetchSummary() {
    const res = await fetch("/api/attendance/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classId, date }),
    });

    const data = await res.json();
    if (!data.success) return alert(data.error);

    setAttendance(data.attendance);
  }

  const present = attendance.filter((s: any) => s.status === "present");
  const absent = attendance.filter((s: any) => s.status === "absent");

  return (
    <div className="p-6 max-w-3xl mx-auto text-black">
      <h1 className="text-3xl font-bold mb-6">Attendance Summary</h1>

      <select
        className="border p-2 rounded w-full mb-4"
        value={classId}
        onChange={(e) => setClassId(e.target.value)}
      >
        <option value="">Select Class</option>
        <option value="CE-1">CE-1</option>
        <option value="CE-2">CE-2</option>
        <option value="CE-3">CE-3</option>
     
      </select>

      <input
        type="date"
        className="border p-2 rounded w-full mb-4"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button
        onClick={fetchSummary}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        View Attendance
      </button>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Present Students</h2>
        <ul className="space-y-2">
          {present.map((s: any) => (
            <li key={s._id} className="p-3 bg-green-100 rounded">
              {s.studentUsername} ({s.studentEmail})
            </li>
          ))}
        </ul>

        <h2 className="text-xl font-bold mt-6 mb-2">Absent Students</h2>
        <p className="text-gray-600">(Feature: show absent based on class roster)</p>
      </div>
    </div>
  );
}
