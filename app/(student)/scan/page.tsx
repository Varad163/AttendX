"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

export default function StudentScanPage() {

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 }
      },
      false
    );

    function onScanSuccess(decodedText: string) {
      console.log("RAW QR:", decodedText);

      const parsed = safeParse(decodedText);
      console.log("PARSED QR:", parsed);
console.log("RAW QR:", decodedText);
console.log("PARSED QR:", parsed);

      if (!parsed || !parsed.id || !parsed.token) {
        alert("Invalid QR");
        return;
      }

      scanner.clear();
      handleScan(parsed);
    }

    scanner.render(onScanSuccess, undefined);

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  // Safely parse QR JSON
  function safeParse(text: string) {
    try { return JSON.parse(text); }
    catch {
      try { return JSON.parse(JSON.parse(text)); }
      catch { return null; }
    }
  }

  
async function handleScan(data: any) {
  const res = await fetch("/api/attendance/mark", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: data.id,
      token: data.token
    }),
  });

  const result = await res.json();

  if (result.success) {
    alert("Attendance Marked!");
  } else {
    alert("⚠ " + result.error);
  }


  window.location.reload();
}




  return (
    <div className="p-6 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4 text-black">Scan QR</h1>

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
