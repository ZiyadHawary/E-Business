"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

type Tutor = {
  id: string;
  name: string;
  initials: string;
  bio: string;
  subjects: string[];
  tags: string[];
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  language: string[];
  availability: string[];
  verified: boolean;
  color: string;
};

const SUBJECTS = ["Mathematics", "English", "Science", "Programming"];
const GRADES = ["Elementary", "Middle School", "High School", "University"];

const FALLBACK_TUTORS = [
  { name: "Annette Black", initials: "A", subject: "English", bio: "Beginner level English tutoring.", rating: 4.9, reviews: 172, rate: 300, level: "Level 2 Tutor", banner: "from-blue-500 to-indigo-600", bannerText: "ENGLISH" },
  { name: "@duozhuamiao", initials: "D", subject: "Programming", bio: "Learn advanced programming techniques.", rating: 5.0, reviews: 54, rate: 300, level: "Top Rated Tutor", banner: "from-sky-400 to-blue-600", bannerText: "PROGRAMMING" },
  { name: "Marvin McKinney", initials: "M", subject: "English", bio: "Advanced topics in English Literature.", rating: 5.0, reviews: 447, rate: 300, level: "Top Rated Tutor", banner: "from-red-700 to-red-900", bannerText: "English Literature" },
];

export default function TutorsContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [allTutors, setAllTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState<string>(searchParams.get("subject") ?? "Select Subject");
  const [maxRate, setMaxRate] = useState(1000);
  const [minRate, setMinRate] = useState(0);
  const [grade, setGrade] = useState("Select a Grade");
  const [fourPlus, setFourPlus] = useState(true);
  const [threePlus, setThreePlus] = useState(false);

  const fetchTutors = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/tutors");
      const data = await res.json();
      setAllTutors(Array.isArray(data) ? data : []);
    } catch {
      setAllTutors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTutors();
  }, [fetchTutors]);

  const seedDb = async () => {
    setSeeding(true);
    setLoading(true);
    await fetch("/api/seed", { method: "POST" });
    await fetchTutors();
    setSeeding(false);
  };

  const tutors = useMemo(() => {
    if (allTutors.length === 0) return FALLBACK_TUTORS;
    return allTutors.map((t) => ({
      name: t.name,
      initials: t.initials,
      subject: t.subjects[0] ?? "General",
      bio: t.bio,
      rating: t.rating,
      reviews: t.reviewCount,
      rate: t.hourlyRate,
      level: t.verified ? "Top Rated Tutor" : "Level 2 Tutor",
      banner: t.subjects[0]?.toLowerCase().includes("program")
        ? "from-sky-400 to-blue-600"
        : t.subjects[0]?.toLowerCase().includes("english")
          ? "from-blue-500 to-indigo-600"
          : "from-red-700 to-red-900",
      bannerText: t.subjects[0] ?? "TUTOR",
    }));
  }, [allTutors]);

  const filtered = tutors.filter((t) => {
    const text = `${t.name} ${t.subject} ${t.bio}`.toLowerCase();
    const matchesSearch = search.trim() === "" || text.includes(search.toLowerCase());
    const matchesSubject = subject === "Select Subject" || t.subject === subject;
    const matchesRate = t.rate >= minRate && t.rate <= maxRate;
    const matchesRating = (fourPlus && t.rating >= 4) || (threePlus && t.rating >= 3) || (!fourPlus && !threePlus);
    return matchesSearch && matchesSubject && matchesRate && matchesRating;
  });

  const shown = filtered.length > 0 ? filtered : tutors;
  const userInitial = session?.user?.name?.[0]?.toUpperCase() ?? "Y";

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #fffde7 0%, #e0f7f4 50%, #b2ede8 100%)", fontFamily: '"DM Sans", sans-serif' }}
    >
      <div className="flex min-h-screen">
        <aside className="flex w-72 flex-col gap-8 border-r border-white/60 bg-white/50 px-6 py-8 backdrop-blur">
          <Link href="/dashboard" className="flex items-center gap-2">
            <svg className="h-7 w-7 text-teal-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="9" rx="1" />
              <rect x="14" y="3" width="7" height="9" rx="1" />
              <rect x="3" y="15" width="7" height="6" rx="1" />
              <rect x="14" y="15" width="7" height="6" rx="1" />
            </svg>
            <span className="text-xl font-bold">TutorLink</span>
          </Link>
          <hr className="border-gray-200" />

          <div>
            <h4 className="mb-3 font-bold text-gray-800">Subject</h4>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-xl bg-teal-500 px-4 py-3 font-semibold text-white outline-none"
            >
              <option>Select Subject</option>
              {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <h4 className="mb-3 font-bold text-gray-800">Filter By Hourly Rate</h4>
            <input type="range" min={0} max={1000} value={maxRate} onChange={(e) => setMaxRate(Number(e.target.value))} className="mb-3 w-full accent-teal-500" />
            <div className="flex gap-2">
              <input
                className="w-1/2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none"
                value={minRate}
                onChange={(e) => setMinRate(Number(e.target.value) || 0)}
                placeholder="Min"
              />
              <input
                className="w-1/2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none"
                value={maxRate}
                onChange={(e) => setMaxRate(Number(e.target.value) || 0)}
                placeholder="Max"
              />
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-bold text-gray-800">Tutor Rating</h4>
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-3">
                <input type="checkbox" checked={fourPlus} onChange={(e) => setFourPlus(e.target.checked)} className="h-4 w-4 accent-teal-500" />
                <span className="text-sm text-gray-700">4+ Stars</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3">
                <input type="checkbox" checked={threePlus} onChange={(e) => setThreePlus(e.target.checked)} className="h-4 w-4 accent-teal-500" />
                <span className="text-sm text-gray-700">3+ Stars</span>
              </label>
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-bold text-gray-800">Grade</h4>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-xl bg-teal-500 px-4 py-3 font-semibold text-white outline-none"
            >
              <option>Select a Grade</option>
              {GRADES.map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>

          {allTutors.length === 0 && !loading && (
            <button
              onClick={seedDb}
              disabled={seeding}
              className="mt-auto w-full rounded-xl bg-teal-500 px-4 py-3 font-semibold text-white transition-colors hover:bg-teal-600 disabled:opacity-50"
            >
              {seeding ? "Loading..." : "Load Demo Tutors"}
            </button>
          )}
        </aside>

        <main className="flex-1 px-8 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex w-80 items-center gap-3 rounded-full border border-gray-200 bg-white/70 px-5 py-3 shadow-sm backdrop-blur">
              <input
                className="flex-1 bg-transparent text-sm text-gray-500 placeholder-gray-400 outline-none"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-400 text-sm font-bold text-white">
                {userInitial}
              </div>
              <button className="relative" type="button">
                <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  3
                </span>
              </button>
            </div>
          </div>

          <div className="mb-3 text-sm text-gray-600">
            {loading ? "Loading tutors..." : `${shown.length} tutor${shown.length !== 1 ? "s" : ""} found`}
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {(loading ? FALLBACK_TUTORS : shown).map((t, idx) => (
              <div key={`${t.name}-${idx}`} className="overflow-hidden rounded-2xl border border-white/80 bg-white/70 shadow-sm transition-shadow hover:shadow-md">
                <div className={`flex h-36 items-center justify-center bg-gradient-to-br ${t.banner}`}>
                  <span className="px-4 text-center text-lg font-extrabold tracking-widest text-white/90">{t.bannerText}</span>
                </div>
                <div className="p-4">
                  <div className="mb-1 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-white">{t.initials}</div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                      <p className="text-xs font-medium text-teal-600">{t.level}</p>
                    </div>
                  </div>
                  <p className="mb-2 mt-2 text-sm text-gray-700">{t.bio}</p>
                  <div className="mb-3 flex items-center gap-1 text-sm text-yellow-400">
                    ★ <span className="font-semibold text-gray-800">{t.rating.toFixed(1)}</span>{" "}
                    <span className="text-xs text-gray-400">({t.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <button className="text-gray-400 transition-colors hover:text-teal-500" type="button">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
                      </button>
                      <button className="text-gray-400 transition-colors hover:text-red-400" type="button">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-wide text-gray-400">Starting at</p>
                      <p className="text-sm font-bold text-gray-900">{t.rate}EGP/Hr</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
