"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.error) {
      setErrorMsg(data.error);
      setLoading(false);
      return;
    }

    router.push("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold text-center mb-4 text-black">
          Create an Account
        </h1>

        {errorMsg && (
          <p className="bg-red-100 text-red-600 px-3 py-2 rounded mb-3">
            {errorMsg}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <input
            name="name"
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full border border-black p-3 rounded text-black placeholder:text-black"
            required
          />

          <input
            type="email"
            name="email"
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full border border-black p-3 rounded text-black placeholder:text-black"
            required
          />

          <input
            type="password"
            name="password"
            onChange={handleChange}
            placeholder="Password"
            className="w-full border border-black p-3 rounded text-black placeholder:text-black"
            required
          />

          <select
            name="role"
            className="w-full border border-black p-3 rounded text-black bg-white"
            onChange={handleChange}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-black">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
