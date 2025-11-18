"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleLogin(e: any) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const res: any = await signIn("credentials", {
      email,
      password,
      redirect: false, 
    });

    if (res?.error) {
      setErrorMsg("Invalid email or password!"); 
      setLoading(false);
      return;
    }

    window.location.href = "/"; 
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        
        <h1 className="text-2xl font-semibold text-center mb-4 text-black">
          Login
        </h1>

        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            placeholder="Email Address"
            className="w-full border border-black p-3 rounded text-black placeholder:text-black"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorMsg("");  // reset alert
            }}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-black p-3 rounded text-black placeholder:text-black"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMsg(""); // reset alert
            }}
            required
          />

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-black">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 underline">
            Register
          </a>
        </p>

      </div>
    </div>
  );
}
