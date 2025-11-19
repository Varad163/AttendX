"use client";

import dynamic from "next/dynamic";

// Load scanner dynamically so SSR does not break
const QrScanner = dynamic(
  () => import("@yudiel/react-qr-scanner").then((mod) => mod.QrScanner),
  { ssr: false }
);

export default QrScanner;
