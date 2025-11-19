"use client";

import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

import { useRouter } from "next/navigation";

export default function ScanPage() {
  const [scanning, setScanning] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleScan = async (result: string) => {
    if (!result) return;

    console.log("QR Result:", result);
    setScanning(false);

    try {
      // Example: send scanned QR code to backend
      const res = await fetch("/api/attendance/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ qrCode: result }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Invalid QR code!");
        setScanning(true);
        return;
      }

      // Redirect on success
      router.push("/student/success");
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong");
      setScanning(true);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-xl font-semibold mb-4">Scan Attendance QR</h1>

      {errorMsg && <p className="text-red-500 mb-3">{errorMsg}</p>}

      <div className="w-full max-w-sm border rounded-lg overflow-hidden">
        {scanning && (
          <Scanner
            onDecode={handleScan}
            onError={(err: any) => console.warn("Scan Error:", err)}
            constraints={{
              facingMode: "environment",
            }}
            overlay="square"
            videoStyle={{ width: "100%" }}
          />
        )}
      </div>

      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => setScanning((prev) => !prev)}
      >
        {scanning ? "Stop Scanning" : "Start Scanning"}
      </button>
    </div>
  );
}
