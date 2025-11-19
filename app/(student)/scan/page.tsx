"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";

export default function ScanPage() {
  const [status, setStatus] = useState("Scan a QR code...");
  const [result, setResult] = useState("");

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      async (decodedText) => {
        setResult(decodedText);
        setStatus("Validating...");

        try {
          const parsed = JSON.parse(decodedText);

          const res = await fetch("/api/attendance/mark", {
            method: "POST",
            body: JSON.stringify(parsed),
          });

          const output = await res.json();

          if (output.success) {
            setStatus("✅ Attendance marked successfully!");
          } else {
            setStatus(`❌ ${output.error}`);
          }
        } catch (err) {
          setStatus("❌ Invalid QR Code");
        }
      },
      () => {}
    );

    // 👇 FIX: cleanup must NOT be async
    return () => {
      try {
        scanner.clear(); // no await
      } catch (e) {
        console.log("Scanner cleanup failed", e);
      }
    };
  }, []);

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-black mb-4">Scan QR Code</h1>
      <div id="qr-reader" className="w-72 h-72"></div>
      <p className="mt-4 text-lg text-black">{status}</p>
    </div>
  );
}
