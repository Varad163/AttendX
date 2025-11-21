import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

import QRSession from "@/models/QRSession";
import { dbConnect } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export default async function TeacherDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  await dbConnect();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysSessions = await QRSession.countDocuments({
    teacherId: session.user.id,
    createdAt: { $gte: today },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-10 sm:px-6 lg:px-8">
        
        <header className="mb-8 flex items-center justify-between gap-4">

          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Teacher Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-300 sm:text-base">
              Manage attendance, generate QR codes, and review previous sessions.
            </p>
          </div>

          <div className="flex items-center gap-4">
            
            <div className="hidden items-center gap-3 rounded-full bg-slate-800/60 px-3 py-2 text-sm shadow-lg sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                {session.user?.name?.[0]?.toUpperCase() ?? "T"}
              </div>
              <div className="leading-tight">
                <p className="font-medium">{session.user?.name ?? "Teacher"}</p>
                <p className="text-xs text-slate-400">{session.user?.email}</p>
              </div>
            </div>

            <LogoutButton />
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6">

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl backdrop-blur">
            <h2 className="text-lg font-semibold text-slate-50">Quick actions</h2>
            <p className="mt-1 text-sm text-slate-300">
              Start a new attendance session or review your past classes.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              
              <Link
                href="/generate"
                className="group flex flex-col justify-between rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-600/70 via-blue-500/70 to-indigo-600/70 p-[1px] shadow-lg transition hover:-translate-y-0.5 hover:shadow-blue-500/40"
              >
                <div className="flex h-full flex-col rounded-[11px] bg-slate-950/90 p-4">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/90 text-sm font-semibold">
                    QR
                  </div>
                  <h3 className="text-base font-semibold text-white">
                    Generate QR for Attendance
                  </h3>
                  <p className="mt-1 text-xs text-slate-300">
                    Create a unique QR code for students to mark attendance.
                  </p>
                  <span className="mt-4 inline-flex items-center text-xs font-medium text-blue-300 group-hover:underline">
                    Start new session →
                  </span>
                </div>
              </Link>

              <Link
                href="/sessions"
                className="group flex flex-col justify-between rounded-xl border border-slate-700/70 bg-slate-900/80 p-4 shadow-lg transition hover:-translate-y-0.5 hover:border-slate-500"
              >
                <div className="flex h-full flex-col">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold">
                    📅
                  </div>
                  <h3 className="text-base font-semibold text-slate-50">
                    View previous sessions
                  </h3>
                  <p className="mt-1 text-xs text-slate-300">
                    Check attendance logs and past sessions.
                  </p>
                  <span className="mt-4 inline-flex items-center text-xs font-medium text-slate-200 group-hover:underline">
                    Open session history →
                  </span>
                </div>
              </Link>

            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-3">

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-xs text-slate-400">Today&apos;s sessions</p>
              <p className="mt-2 text-2xl font-semibold">{todaysSessions}</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-xs text-slate-400">Total sessions</p>
              <p className="mt-2 text-2xl font-semibold">—</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-xs text-slate-400">Average attendance</p>
              <p className="mt-2 text-2xl font-semibold">—</p>
            </div>

          </section>

        </main>
      </div>
    </div>
  );
}
