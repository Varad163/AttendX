"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useParams } from "next/navigation";

export default function GenerateQRPage() {
  const params = useParams();
  const classId = params.classId as string;

  const [qrData, setQrData] = useState<any>(null);
  const [countdown, setCountdown] = useState(15);

  const generateQR = async () => {
    if (!classId) {
      console.error("Missing classId");
      return;
    }

    const res = await fetch("/api/session/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classId }),
    });

    const data = await res.json();

    if (data.success) {
      setQrData(data.qrPayload);
      setCountdown(15);
    } else {
      console.error("QR Error:", data.error);
    }
  };

  useEffect(() => {
    generateQR(); 

    const interval = setInterval(() => generateQR(), 15000); 

    return () => clearInterval(interval);
  }, [classId]);

  useEffect(() => {
    if (!qrData) return;
    const timer = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [qrData]);

  return (
    <div className="p-6 flex flex-col items-center min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-4">Live Attendance QR</h1>

      {qrData ? (
        <>
          <div className="bg-white p-4 rounded shadow">
            <QRCode value={JSON.stringify(qrData)} size={220} />
          </div>

          <p className="mt-4 text-lg">
            ⏳ QR Expires in <b>{countdown}</b> seconds
          </p>
        </>
      ) : (
        <p>Generating QR...</p>
      )}
    </div>
  );
}
