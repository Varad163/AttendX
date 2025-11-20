"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

export default function StudentScanPage() {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader", 
      {
        fps: 10,
        qrbox: {
          width: 250,
          height: 250,  // 👈 Small camera box
        }
      },
      false
    );

    function onScanSuccess(decodedText: string) {
      scanner.clear();
      handleScan(decodedText);
    }

    scanner.render(onScanSuccess, undefined);

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  function safeParse(text: string) {
    try { return JSON.parse(text); }
    catch {
      try { return JSON.parse(JSON.parse(text)); }
      catch { return null; }
    }
  }

  async function handleScan(text: string) {
    const payload = safeParse(text);

    if (!payload || !payload.id || !payload.token) {
      alert("Invalid QR Code!");
      return;
    }

    const res = await fetch("/api/attendance/mark", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      alert("Attendance Marked!");
    } else {
      alert("⚠ " + data.error);
    }

    // Restart scanner after alert
    window.location.reload();
  }

  return (
    <div className="p-6 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4 text-black">Scan QR</h1>

      {/* Camera Box */}
      <div 
        id="reader" 
        className="w-[260px] h-[260px] border rounded-lg shadow-lg"
      ></div>

      <p className="text-sm text-gray-600 mt-4">
        Align the QR inside the box
      </p>
    </div>
  );
}
