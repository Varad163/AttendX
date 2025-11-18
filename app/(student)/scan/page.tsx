"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";

export default function ScanPage() {
  const [result, setResult] = useState("");

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      async (decodedText) => {
        setResult("Validating...");

        const res = await fetch("/api/qr/validate", {
          method: "POST",
          body: JSON.stringify({ qrData: decodedText }),
        });

        const out = await res.json();
        setResult(out.message);

        scanner.clear();
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Scan QR</h1>

      <div id="reader" className="w-full"></div>

      <p className="mt-4 font-medium">{result}</p>
    </div>
  );
}
