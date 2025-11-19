"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

export default function GenerateQRPage() {
  const [qrData, setQrData] = useState<any>(null);
  const [countdown, setCountdown] = useState(15);

  // Function to request new QR from API
  const generateQR = async () => {
    try {
      const res = await fetch("/api/session/start", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setQrData(data.qrPayload);
        setCountdown(15); // reset timer
      }
    } catch (err) {
      console.error("QR generation error:", err);
    }
  };

  // Auto refresh QR every 15 seconds
  useEffect(() => {
    generateQR(); // initial load

    const interval = setInterval(() => {
      generateQR();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!qrData) return;

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [qrData]);

  return (
    <div className="p-6 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4 text-black">Generate QR</h1>

      {qrData ? (
        <>
          <div className="bg-white p-4 rounded shadow">
            <QRCode
              value={JSON.stringify(qrData)}
              size={200}
            />
          </div>

          <p className="text-lg mt-4 text-black">
            ⏳ QR expires in: <b>{countdown}</b> sec
          </p>

          <p className="text-sm text-gray-600 mt-2">
            New QR will auto-refresh every 15 seconds.
          </p>
        </>
      ) : (
        <p className="text-gray-700">Generating QR...</p>
      )}
    </div>
  );
}
