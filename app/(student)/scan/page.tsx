"use client";

import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

export default function StudentScanPage() {
  const [scanning, setScanning] = useState(true);

  const handleScan = async (result: any) => {
    if (!result?.text) return;

    setScanning(false); // stop scanner to avoid multiple scans

    try {
      // QR contains: { id: "...", token: "..." }
      const payload = JSON.parse(result.text);

      const res = await fetch("/api/attendance/mark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // ⛔ If API didn't return JSON
      if (!res.ok) {
        const text = await res.text();
        console.error("SERVER ERROR:", text);
        alert("Server Error: " + text);
        setScanning(true);
        return;
      }

      const data = await res.json();

      if (data.success) {
        alert("🎉 Attendance Marked Successfully!");
      } else {
        alert("⚠️ " + data.error);
      }
    } catch (err) {
      console.error("SCAN ERROR:", err);
      alert("Invalid QR Code!");
    }

    setTimeout(() => setScanning(true), 2000); // restart scanner after alert
  };

  return (
    <div className="p-6 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4 text-black">Scan QR Code</h1>

      <div className="w-full max-w-sm">
        {scanning ? (
          <Scanner
            onDecode={handleScan}
            onError={(e:any) => console.error("Scanner error:", e)}
            containerStyle={{ width: "100%" }}
            videoStyle={{ width: "100%" }}
          />
        ) : (
          <p className="text-gray-600 text-center">Processing...</p>
        )}
      </div>

      <p className="text-sm text-gray-600 mt-4">
        Align the QR inside the frame
      </p>
    </div>
  );
}
