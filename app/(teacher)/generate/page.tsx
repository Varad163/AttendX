"use client";

import { useEffect, useState } from "react";
import { Plus, QrCode } from "lucide-react";

export default function GenerateQRPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [subject, setSubject] = useState("");

  const [qrSessionId, setQRSessionId] = useState("");

  // TEMP teacher ID (replace with getServerSession later)
  const teacherId = "TEMP_TEACHER_ID";

  const fetchClasses = async () => {
    const res = await fetch("/api/class/list");
    const data = await res.json();
    setClasses(data.classes || []);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  async function handleCreateClass(e: any) {
    e.preventDefault();

    const res = await fetch("/api/class/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: className,
        section,
        subject,
        teacherId,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setShowModal(false);

      // Refresh & auto-select newly created class
      fetchClasses().then(() => {
        setSelectedClass(data.class._id);
      });

      setClassName("");
      setSection("");
      setSubject("");
    }
  }
async function handleGenerateQR() {
  if (!selectedClass) return alert("Select a class first");

  const res = await fetch("/api/session/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ classId: selectedClass }),
  });

  const data = await res.json();

  if (data.success) {
    const payload = {
      id: data.id,
      token: data.token,
    };

    setQRSessionId(JSON.stringify(payload));
  } else {
    alert(data.error || "QR generation failed");
  }
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl shadow-xl p-8 w-full max-w-md backdrop-blur">
        <h1 className="text-2xl font-bold text-center mb-6">
          Generate QR for Attendance
        </h1>

        {/* Class Dropdown */}
        <label className="block mb-2 text-sm text-gray-300">
          Select Class
        </label>

        <select
          value={selectedClass}
          onChange={(e) => {
            if (e.target.value === "create") {
              setShowModal(true);
            } else {
              setSelectedClass(e.target.value);
            }
          }}
          className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg mb-3"
        >
          {classes.length === 0 && (
            <option>No classes found</option>
          )}

          {classes.map((cls) => (
  <option key={cls.id} value={cls.id}>
    {cls.name} ({cls.section}) - {cls.subject}
  </option>
))}


          <option value="create">➕ Create New Class</option>
        </select>

        {/* Generate QR button */}
        <button
          onClick={handleGenerateQR}
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg flex items-center justify-center gap-2 mt-3"
        >
          <QrCode size={18} />
          Generate QR
        </button>

        {/* Show QR */}
        {qrSessionId && (
          <div className="mt-6 bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
            <h2 className="text-lg font-semibold mb-3">Attendance QR</h2>

            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrSessionId)}`}
              alt="QR Code"
              className="mx-auto rounded-lg"
            />


            <p className="mt-3 text-gray-300 text-sm break-words">
              Session ID: {qrSessionId}
            </p>
          </div>
        )}
      </div>

      {/* Create Class Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-slate-900 p-6 rounded-xl w-96 border border-gray-700 shadow-xl">
            <h2 className="text-xl mb-4 flex items-center gap-2">
              <Plus size={20} /> Create New Class
            </h2>

            <form onSubmit={handleCreateClass} className="space-y-4">
              <input
                type="text"
                placeholder="Class Name"
                required
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg"
              />

              <input
                type="text"
                placeholder="Section"
                required
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg"
              />

              <input
                type="text"
                placeholder="Subject"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg"
              />

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg"
              >
                Save
              </button>
            </form>

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
