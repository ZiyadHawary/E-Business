"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const notifications = useMemo(
    () => [
      "New message from Karim Mahmoud about your Programming session.",
      "Your session with Rania Adel has been confirmed for Tomorrow.",
      "Check out our new 'Advanced Algorithms' course now available!",
      "Platform Update: We've improved the search filters to help you find tutors faster.",
    ],
    [],
  );

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch("/api/bookings");
        const data = await res.json();
        if (Array.isArray(data)) {
          setBookings(data);
        }
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        setLoadingBookings(false);
      }
    }
    if (session) {
      fetchBookings();
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!session) return null;

  const firstName = session.user?.name?.split(" ")[0] ?? "Student";
  const uniqueCourses = useMemo(() => {
    const subjects = bookings.map(b => b.subject);
    return Array.from(new Set(subjects)).map(subject => ({
      name: subject,
      sessions: bookings.filter(b => b.subject === subject).length,
      progress: Math.floor(Math.random() * 40) + 10 // Mock progress for visual appeal
    }));
  }, [bookings]);

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #fffde7 0%, #e0f7f4 55%, #b2ede8 100%)",
      }}
    >
      <div className="flex min-h-screen relative overflow-hidden">
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden" 
            onClick={() => setSidebarOpen(false)} 
          />
        )}
        <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/60 bg-white/90 px-5 py-8 backdrop-blur-md transition-transform duration-300 md:relative md:translate-x-0 md:bg-white/50 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <Link href="/" className="mb-10 flex items-center gap-2">
            <svg
              className="h-7 w-7 text-teal-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-xl font-bold text-black">TutorLink</span>
          </Link>

          <nav className="flex flex-1 flex-col gap-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition-all ${
                activeTab === "overview" 
                  ? "bg-teal-500/10 text-teal-600 shadow-sm" 
                  : "text-gray-600 hover:bg-teal-500/5"
              }`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("courses")}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition-all ${
                activeTab === "courses" 
                  ? "bg-teal-500/10 text-teal-600 shadow-sm" 
                  : "text-gray-600 hover:bg-teal-500/5"
              }`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
              My Courses
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`flex items-center justify-between rounded-xl px-4 py-3 font-semibold transition-all ${
                activeTab === "messages" 
                  ? "bg-teal-500/10 text-teal-600 shadow-sm" 
                  : "text-gray-600 hover:bg-teal-500/5"
              }`}
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
            </button>
            <button
              onClick={() => setActiveTab("progress")}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition-all ${
                activeTab === "progress" 
                  ? "bg-teal-500/10 text-teal-600 shadow-sm" 
                  : "text-gray-600 hover:bg-teal-500/5"
              }`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M16 8v5a3 3 0 01-6 0V8M12 3v5M8 8h8M3 20h18" />
              </svg>
              Progress
            </button>
            <button
              onClick={() => setActiveTab("schedule")}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition-all ${
                activeTab === "schedule" 
                  ? "bg-teal-500/10 text-teal-600 shadow-sm" 
                  : "text-gray-600 hover:bg-teal-500/5"
              }`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Schedule
            </button>
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

        <main className="flex-1 overflow-y-auto px-4 py-8 md:px-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full items-center justify-between md:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 shadow-sm"
              >
                <svg className="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <div className="flex items-center gap-3">
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

            <div className="flex w-full items-center gap-3 md:w-auto">
              <div className="flex flex-1 md:w-72 items-center gap-3 rounded-full border border-gray-200 bg-white/70 px-5 py-3 shadow-sm backdrop-blur">
                <input
                  className="w-full bg-transparent text-sm text-gray-500 placeholder-gray-400 outline-none"
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
                className="hidden md:block rounded-full bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-600"
              >
                Find Tutors
              </Link>
            </div>
            
            <div className="hidden items-center gap-4 md:flex">
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
              {notifications.length > 0 ? (
                <ul className="space-y-2 text-xs text-gray-600">
                  {notifications.map((item) => (
                    <li key={item} className="rounded-lg bg-white/70 px-3 py-2">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-500">No new notifications.</p>
              )}
            </div>
          )}

          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900">Welcome Back, {firstName}!</h1>
              <p className="mt-1 text-gray-500">You&apos;re doing great! Keep up the good work!</p>
            </div>
            <Link href="/tutors" className="flex w-full md:w-auto items-center justify-center gap-2 rounded-full bg-teal-500 px-5 py-3 font-semibold text-white shadow-md transition-colors hover:bg-teal-600">
              <span className="text-lg font-bold">+</span> Start Course
            </Link>
          </div>

          {activeTab === "overview" && (
            <>
              <section className="mb-10">
                <h2 className="mb-5 text-2xl font-bold text-gray-900">Your Booked Sessions</h2>
                {loadingBookings ? (
                  <div className="text-gray-500">Loading your bookings...</div>
                ) : bookings.length === 0 ? (
                  <div className="rounded-2xl border border-white/80 bg-white/70 p-10 text-center backdrop-blur">
                    <p className="text-gray-500 mb-4">You don&apos;t have any booked sessions yet.</p>
                    <Link href="/tutors" className="text-teal-500 font-bold hover:underline">Find a tutor and book your first session!</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="rounded-2xl border border-white/80 bg-white/70 p-6 shadow-sm backdrop-blur">
                        <div className="mb-3 flex justify-between items-start">
                          <span className="rounded-full bg-teal-500/10 px-2 py-1 text-xs font-medium text-teal-600">{booking.subject}</span>
                          <span className={`rounded-full px-2 py-1 text-xs font-medium ${booking.status === 'Upcoming' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600'}`}>
                            {booking.status}
                          </span>
                        </div>
                        <h3 className="mb-2 text-base font-extrabold text-gray-900">{booking.tutorName}</h3>
                        <p className="mb-4 text-xs leading-relaxed text-gray-500">
                          Session on {booking.date} at {booking.time}
                        </p>
                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white ring-2 ring-white"
                            style={{ background: booking.tutorColor || '#10b981' }}
                          >
                            {booking.tutorInitials}
                          </div>
                          <p className="text-sm font-semibold text-gray-800">{booking.tutorName}</p>
                        </div>
                        <button className="w-full rounded-xl bg-teal-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-600">
                          Join Session
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {!loadingBookings && bookings.length > 0 && (
                <section>
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Upcoming Schedule</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                    {bookings.slice(0, 3).map((booking) => (
                      <div key={`sched-${booking.id}`} className="relative overflow-hidden rounded-2xl bg-indigo-500 p-6 text-white">
                        <div className="mb-4 flex items-start justify-between">
                          <div>
                            <p className="mb-1 text-xs text-indigo-200">{booking.date} at {booking.time}</p>
                            <h4 className="text-base font-bold">{booking.subject}</h4>
                          </div>
                          {booking.status === 'Upcoming' && (
                            <span className="rounded-lg bg-orange-400 px-2 py-1 text-xs font-bold text-white">Soon</span>
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-3">
                          <div
                            className="flex h-9 w-9 items-center justify-center rounded-full font-bold ring-2 ring-white"
                            style={{ background: booking.tutorColor || '#10b981' }}
                          >
                            {booking.tutorInitials}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{booking.tutorName}</p>
                            <p className="text-xs text-indigo-200">Tutor</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {activeTab === "courses" && (
            <section className="mb-10">
              <h2 className="mb-5 text-2xl font-bold text-gray-900">My Registered Courses</h2>
              {uniqueCourses.length === 0 ? (
                <div className="rounded-2xl border border-white/80 bg-white/70 p-10 text-center backdrop-blur">
                  <p className="text-gray-500 mb-4">You haven&apos;t registered for any courses yet.</p>
                  <Link href="/tutors" className="text-teal-500 font-bold hover:underline">Browse tutors and start your first course!</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                  {uniqueCourses.map((course) => (
                    <div key={course.name} className="rounded-2xl border border-white/80 bg-white/70 p-5 shadow-sm backdrop-blur">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500 text-white font-bold text-lg">
                        {course.name[0]}
                      </div>
                      <h3 className="mb-1 text-base font-bold text-gray-900">{course.name}</h3>
                      <p className="mb-4 text-xs text-gray-500">{course.sessions} Sessions Booked</p>
                      <div className="mb-2 flex items-center justify-between text-xs font-bold text-gray-700">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div 
                          className="h-full bg-teal-500 transition-all duration-500" 
                          style={{ width: `${course.progress}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {(activeTab === "messages" || activeTab === "progress" || activeTab === "schedule") && (
            <div className="rounded-3xl border border-white/80 bg-white/70 p-20 text-center backdrop-blur">
              <h3 className="text-xl font-bold text-gray-900 uppercase tracking-widest">{activeTab} section</h3>
              <p className="text-gray-500 mt-2">This feature is coming soon!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
