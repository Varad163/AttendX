"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GenerateQRClient({ classes }: any) {
  const router = useRouter();

  const [classList, setClassList] = useState(classes || []);
  const [selectedClass, setSelectedClass] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // Create new class
  // -----------------------------
  const createClass = async () => {
    if (!newClassName.trim()) return alert("Enter class name");

    const res = await fetch("/api/class/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newClassName }),
    });

    const data = await res.json();
    if (data.success) {
      setClassList([...classList, data.class]);
      setShowModal(false);
      setNewClassName("");
    } else {
      alert(data.error);
    }
  };

  // -----------------------------
  // Start QR session
  // -----------------------------
  const startSession = async () => {
    if (!selectedClass) return alert("Select a class");

    setLoading(true);

    const res = await fetch("/api/session/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classId: selectedClass }),
    });

    const data = await res.json();
    setLoading(false);

    if (!data.success) {
      alert(data.error);
      return;
    }

    // Redirect to the QR page
    router.push(`/generate/${data.qrPayload.id}`);
  };

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
      <label className="text-sm font-semibold mb-2 block">Select Class</label>

      <select
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="">Select Class</option>
        {classList.map((cls: any) => (
          <option key={cls.id} value={cls.id}>
            {cls.name}
          </option>
        ))}
      </select>

      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-3 py-2 rounded mb-4"
      >
        + Create Class
      </button>

      {/* Create Class Modal */}
      {showModal && (
        <div className="border p-4 bg-gray-50 rounded">
          <input
            placeholder="New Class Name"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />

          <button
            onClick={createClass}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      )}

      <button
        onClick={startSession}
        disabled={loading}
        className="mt-4 w-full bg-green-700 text-white px-4 py-2 rounded"
      >
        {loading ? "Generating..." : "Save & Generate QR"}
      </button>
    </div>
  );
}
