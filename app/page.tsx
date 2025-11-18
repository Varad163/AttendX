"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/register");   // 👈 redirect here
  }, []);

  return null; // or a loading spinner
}
