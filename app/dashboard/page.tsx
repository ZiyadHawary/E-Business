"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useMemo, useState } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = useMemo(
    () => [
      "Your UI/UX assignment is due tomorrow.",
      "New message from Annette Black.",
      "Advanced Programming starts at 10:30AM.",
    ],
    [],
  );

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!session) return null;

  const firstName = session.user?.name?.split(" ")[0] ?? "Student";

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #fffde7 0%, #e0f7f4 55%, #b2ede8 100%)",
        fontFamily: '"DM Sans", sans-serif',
      }}
    >
      <div className="flex min-h-screen">
        <aside className="flex w-64 flex-col border-r border-white/60 bg-white/50 px-5 py-8 backdrop-blur">
          <div className="mb-10 flex items-center gap-2">
            <svg
              className="h-7 w-7 text-teal-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="3" width="7" height="9" rx="1" />
              <rect x="14" y="3" width="7" height="9" rx="1" />
              <rect x="3" y="15" width="7" height="6" rx="1" />
              <rect x="14" y="15" width="7" height="6" rx="1" />
            </svg>
            <span className="text-xl font-bold">TutorLink</span>
          </div>

          <nav className="flex flex-1 flex-col gap-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-xl bg-teal-500/10 px-4 py-3 font-semibold text-teal-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
              Dashboard Overview
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-600 transition-colors hover:bg-teal-500/5"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
              My Courses
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center justify-between rounded-xl px-4 py-3 text-gray-600 transition-colors hover:bg-teal-500/5"
            >
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Messages
              </div>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-xs font-semibold text-white">
                3
              </span>
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-600 transition-colors hover:bg-teal-500/5"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M16 8v5a3 3 0 01-6 0V8M12 3v5M8 8h8M3 20h18" />
              </svg>
              Progress
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-600 transition-colors hover:bg-teal-500/5"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Schedule
            </Link>
          </nav>

          <button
            className="mt-auto flex items-center gap-3 rounded-xl bg-teal-500 px-4 py-3 font-semibold text-white transition-colors hover:bg-teal-600"
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            type="button"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </aside>

        <main className="flex-1 overflow-y-auto px-8 py-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex w-72 items-center gap-3 rounded-full border border-gray-200 bg-white/70 px-5 py-3 shadow-sm backdrop-blur">
                <input
                  className="flex-1 bg-transparent text-sm text-gray-500 placeholder-gray-400 outline-none"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <Link
                href="/tutors"
                className="rounded-full bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-600"
              >
                Find Tutors
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-400 text-sm font-bold text-white">
                {firstName[0]}
              </div>
              <button
                className="relative"
                type="button"
                aria-label="Notifications"
                onClick={() => setNotificationsOpen((prev) => !prev)}
              >
                <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  3
                </span>
              </button>
            </div>
          </div>
          {notificationsOpen && (
            <div className="mb-5 max-w-sm rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm backdrop-blur">
              <p className="mb-2 text-sm font-semibold text-gray-900">Notifications</p>
              <ul className="space-y-2 text-xs text-gray-600">
                {notifications.map((item) => (
                  <li key={item} className="rounded-lg bg-white/70 px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900">Welcome Back, {firstName}!</h1>
              <p className="mt-1 text-gray-500">You&apos;re doing great! Keep up the good work!</p>
            </div>
            <button className="flex items-center gap-2 rounded-full bg-teal-500 px-5 py-3 font-semibold text-white shadow-md transition-colors hover:bg-teal-600">
              <span className="text-lg font-bold">+</span> Start Course
            </button>
          </div>

          <section className="mb-10">
            <h2 className="mb-5 text-2xl font-bold text-gray-900">Your Courses</h2>
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
              <div className="flex flex-col items-center rounded-2xl border border-white/80 bg-white/70 p-6 shadow-sm backdrop-blur">
                <p className="mb-4 text-sm font-bold text-gray-800">UI/UX Design</p>
                <div className="relative mb-4 h-32 w-32">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#E5E7EB" strokeWidth="10" />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="#2EC4B6"
                      strokeWidth="10"
                      strokeDasharray="314"
                      strokeDashoffset="37"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-gray-900">88%</span>
                    <span className="text-xs text-gray-400">Excellent</span>
                  </div>
                </div>
                <p className="text-sm font-semibold text-teal-500">Excellent work!</p>
              </div>

              <div className="rounded-2xl border border-white/80 bg-white/70 p-6 shadow-sm backdrop-blur">
                <div className="mb-3 flex gap-2">
                  <span className="rounded-full bg-teal-500/10 px-2 py-1 text-xs font-medium text-teal-600">Group course</span>
                  <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-600">Advanced</span>
                </div>
                <h3 className="mb-2 text-base font-extrabold text-gray-900">Advanced Programming</h3>
                <p className="mb-4 text-xs leading-relaxed text-gray-500">
                  Learn advanced programming techniques in C++, Python, and JavaScript.
                </p>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-xs text-gray-400">Participants</p>
                    <div className="-space-x-1 flex">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-300 text-xs font-bold text-white ring-2 ring-white">A</div>
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-300 text-xs font-bold text-white ring-2 ring-white">B</div>
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-300 text-xs font-bold text-white ring-2 ring-white">C</div>
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-gray-400">Course progress</p>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full w-[87%] rounded-full bg-gradient-to-r from-teal-500 to-teal-600" />
                      </div>
                      <span className="text-xs font-bold text-teal-500">87%</span>
                    </div>
                  </div>
                </div>
                <button className="w-full rounded-xl bg-teal-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-600">
                  Continue Learning
                </button>
              </div>

              <div className="rounded-2xl border border-white/80 bg-white/70 p-6 shadow-sm backdrop-blur">
                <div className="mb-3">
                  <span className="rounded-full bg-teal-500/10 px-2 py-1 text-xs font-medium text-teal-600">Personalized course</span>
                </div>
                <h3 className="mb-2 text-base font-extrabold text-gray-900">German - B2</h3>
                <p className="mb-4 text-xs leading-relaxed text-gray-500">
                  A German language exam for young people and adults. It certifies an advanced level of language
                  proficiency and corresponds to level four (B2) on the six-level scale of the CEFR.
                </p>
                <div className="mb-4">
                  <p className="mb-1 text-xs text-gray-400">Course progress</p>
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full w-[49%] rounded-full bg-gradient-to-r from-teal-500 to-teal-600" />
                    </div>
                    <span className="text-xs font-bold text-teal-500">49%</span>
                  </div>
                </div>
                <button className="w-full rounded-xl bg-teal-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-600">
                  Continue Learning
                </button>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">My Schedule</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white/70 transition-colors hover:bg-white"
                >
                  <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <span className="text-sm font-medium text-gray-600">This Week</span>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white/70 transition-colors hover:bg-white"
                >
                  <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
              <div className="relative overflow-hidden rounded-2xl bg-indigo-500 p-6 text-white">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="mb-1 text-xs text-indigo-200">Today from 10:30AM to 12:00PM</p>
                    <h4 className="text-base font-bold">Technical English for Beginners</h4>
                  </div>
                  <span className="rounded-lg bg-orange-400 px-2 py-1 text-xs font-bold text-white">Now</span>
                </div>
                <span className="mb-8 inline-block rounded-full bg-teal-500 px-3 py-1 text-xs font-medium text-white">Beginner</span>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 font-bold ring-2 ring-white">A</div>
                  <div>
                    <p className="text-sm font-semibold">Annette Black</p>
                    <p className="text-xs text-indigo-200">English Teacher</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/80 bg-white/60 p-6 shadow-sm backdrop-blur">
                <p className="mb-1 text-xs text-gray-400">Tomorrow from 10:30AM to 1:00PM</p>
                <h4 className="mb-3 text-base font-bold text-gray-900">Advanced Programming</h4>
                <span className="mb-8 inline-block rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-600">Advanced</span>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-500 text-sm font-bold text-white ring-2 ring-white">D</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">@duozhuamiao</p>
                    <p className="text-xs text-gray-400">Computer Scientist</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/80 bg-white/60 p-6 shadow-sm backdrop-blur">
                <p className="mb-1 text-xs text-gray-400">Wednesday from 6:30PM to 8:00PM</p>
                <h4 className="mb-3 text-base font-bold text-gray-900">German B2</h4>
                <span className="mb-8 inline-block rounded-full bg-teal-500/10 px-3 py-1 text-xs font-medium text-teal-600">Personalized Course</span>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-400 text-sm font-bold text-white ring-2 ring-white">D</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Darrell Steward</p>
                    <p className="text-xs text-gray-400">German Teacher</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}