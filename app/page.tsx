"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const SUBJECTS = ["Mathematics", "English", "Science", "Programming"];

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const [query, setQuery] = useState("");

  const userInitial = session?.user?.name?.[0]?.toUpperCase() ?? "U";
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const dummyNotifications = [
    "Welcome to TutorLink! Start by finding a tutor.",
    "Special Offer: Get 20% off your first session with code FIRST20.",
    "New tutors joined today in the Programming section.",
  ];

  const handleSearch = () => {
    const params = query ? `?subject=${encodeURIComponent(query)}` : "";
    router.push(`/tutors${params}`);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #fffde7 0%, #e0f7f4 50%, #b2ede8 100%)",
      }}
    >
      <nav className="flex items-center justify-between px-4 md:px-8 py-5">
        <div className="flex items-center gap-2">
          <svg className="h-7 w-7 text-teal-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-xl font-bold text-black">TutorLink</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="relative h-10 w-10 overflow-hidden rounded-full bg-amber-200 ring-2 ring-amber-400 transition-transform hover:scale-110 active:scale-95 shadow-md">
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-300 to-orange-400 text-sm font-bold text-white">
              {userInitial}
            </div>
          </Link>
          <button 
            className="relative" 
            type="button" 
            aria-label="Notifications"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
            <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {dummyNotifications.length}
            </span>
          </button>
        </div>
      </nav>

      {notificationsOpen && (
        <div className="absolute right-4 md:right-8 top-20 z-50 w-72 rounded-2xl border border-white/80 bg-white/80 p-4 shadow-xl backdrop-blur-md fade-up">
          <p className="mb-3 text-sm font-bold text-gray-900">Notifications</p>
          <div className="space-y-3">
            {dummyNotifications.map((notif, idx) => (
              <div key={idx} className="rounded-xl bg-white/50 p-3 text-xs text-gray-700 shadow-sm border border-white/50">
                {notif}
              </div>
            ))}
          </div>
        </div>
      )}

      <section className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-8 pb-16 pt-8">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase leading-tight tracking-tight text-gray-900">
            Learning
            <br />
            Without <span className="text-teal-500">Limits.</span>
            <br />
            Find Your
            <br />
            Tutor.
          </h1>
          <div className="mt-8 flex w-full max-w-md items-center rounded-full border border-gray-200 bg-white/70 px-5 py-3 shadow-sm backdrop-blur">
            <input
              className="flex-1 bg-transparent text-sm text-gray-500 placeholder-gray-400 outline-none"
              placeholder="Search for Tutors, Subjects, Skills..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <p className="mt-6 max-w-sm text-lg font-medium leading-relaxed text-gray-700">
            TutorLink connects students with top-rated tutors for personalized learning.
          </p>
          <button
            className="mt-6 rounded-full bg-teal-500 px-8 py-3 font-semibold text-white shadow-md transition-colors hover:bg-teal-600"
            onClick={() => {
              if (session) {
                router.push("/dashboard");
              }
              else
                router.push("/auth/signin")
            }}
            type="button"
          >
            Get Started
          </button>
          <div className="mt-4 flex flex-wrap gap-2">
            {SUBJECTS.map((s) => (
              <button
                key={s}
                className="rounded-full border border-teal-500/30 bg-white/50 px-3 py-1.5 text-xs text-gray-700 transition-colors hover:bg-white/80"
                onClick={() => router.push(`/tutors?subject=${encodeURIComponent(s)}`)}
                type="button"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden flex-1 items-center justify-end pl-8 lg:flex">
          <div
            className="h-[665px] w-full max-w-lg rounded-3xl"
            style={{
              backgroundImage: "url('/images/landing page.png')",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
            role="img"
            aria-label="TutorLink learning illustration"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-8 pb-20">
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/80 bg-white/70 p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10">
              <svg className="h-5 w-5 text-teal-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <h3 className="mb-2 text-base font-bold text-gray-900">Diverse Subjects</h3>
            <p className="text-sm leading-relaxed text-gray-500">Subjects ranging from advanced University courses to Elementary School education.</p>
          </div>

          <div className="rounded-2xl border border-white/80 bg-white/70 p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10">
              <svg className="h-5 w-5 text-teal-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
            </div>
            <h3 className="mb-2 text-base font-bold text-gray-900">Certified Tutors</h3>
            <p className="text-sm leading-relaxed text-gray-500">TutorLink only hosts tutors with the proper certifications for their respective subjects.</p>
          </div>

          <div className="rounded-2xl border border-white/80 bg-white/70 p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10">
              <svg className="h-5 w-5 text-teal-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="mb-2 text-base font-bold text-gray-900">Flexible Learning</h3>
            <p className="text-sm leading-relaxed text-gray-500">Approach learning from a new more flexible and personalized perspective.</p>
          </div>
        </div>
      </section>
    </div>
  );
}