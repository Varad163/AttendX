"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

export default function GenerateQRPage() {
  const [qrData, setQrData] = useState<any>(null);
  const [countdown, setCountdown] = useState(15);

  const generateQR = async () => {
    try {
      const res = await fetch("/api/session/start", { method: "POST" });
      const data = await res.json();

      if (data.success) {
        setQrData(data.qrPayload);
        setCountdown(15);
      }
    } catch (err) {
      console.error("QR ERROR:", err);
    }
  };

  useEffect(() => {
    generateQR();

    const interval = setInterval(() => generateQR(), 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!qrData) return;

    const timer = setInterval(() => {
      setCountdown((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [qrData]);

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Generate QR</h1>

      {qrData ? (
        <>
          <div className="bg-white p-4 rounded shadow">
            <QRCode value={JSON.stringify(qrData)} size={200} />
          </div>

          <p className="mt-4">
            ⏳ Expires in <b>{countdown}</b> sec
          </p>
        </>
      ) : (
        <p>Generating QR...</p>
      )}
    </div>
  );
}
