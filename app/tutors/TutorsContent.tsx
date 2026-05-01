"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import TutorCard from "@/components/TutorCard";

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
const LANGUAGES = ["English", "Mandarin", "Spanish", "French", "Arabic", "German"];

const FALLBACK_TUTORS = [
  { 
    id: "f1",
    name: "Annette Black", 
    initials: "A", 
    bio: "Beginner level English tutoring.", 
    rating: 4.9, 
    reviewCount: 172, 
    hourlyRate: 300, 
    subjects: ["English"], 
    tags: ["Friendly", "Experienced"], 
    language: ["English"], 
    availability: ["Today", "Tomorrow"], 
    verified: true, 
    color: "#fbbf24" 
  },
  { 
    id: "f2",
    name: "@duozhuamiao", 
    initials: "D", 
    bio: "Learn advanced programming techniques.", 
    rating: 5.0, 
    reviewCount: 54, 
    hourlyRate: 300, 
    subjects: ["Programming"], 
    tags: ["Pro", "Clean Code"], 
    language: ["English", "Mandarin"], 
    availability: ["Tomorrow"], 
    verified: true, 
    color: "#10b981" 
  },
  { 
    id: "f3",
    name: "Marvin McKinney", 
    initials: "M", 
    bio: "Advanced topics in English Literature.", 
    rating: 5.0, 
    reviewCount: 447, 
    hourlyRate: 300, 
    subjects: ["English"], 
    tags: ["Expert", "Academic"], 
    language: ["English"], 
    availability: ["Today"], 
    verified: false, 
    color: "#ef4444" 
  },
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
  const [selectedLanguage, setSelectedLanguage] = useState("All Languages");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [fourPlus, setFourPlus] = useState(true);
  const [threePlus, setThreePlus] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const dummyNotifications = [
    "You have a new tutor recommendation based on your interest in Programming.",
    "Reminder: Your session with Annette Black starts in 2 hours.",
    "A new verified tutor for 'Mandarin' has just joined!",
  ];

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

  const filteredTutors = useMemo(() => {
    const list = allTutors.length > 0 ? allTutors : FALLBACK_TUTORS;
    return list.filter((t) => {
      const mainSubject = (t as any).subjects?.[0] || (t as any).subject || "";
      const text = `${t.name} ${mainSubject} ${t.bio}`.toLowerCase();
      const matchesSearch = search.trim() === "" || text.includes(search.toLowerCase());
      const matchesSubject = subject === "Select Subject" || mainSubject === subject;
      const rate = (t as any).hourlyRate || (t as any).rate || 0;
      const matchesRate = rate >= minRate && rate <= maxRate;
      const matchesRating = (fourPlus && t.rating >= 4) || (threePlus && t.rating >= 3) || (!fourPlus && !threePlus);
      const matchesLanguage = selectedLanguage === "All Languages" || t.language?.includes(selectedLanguage);
      const matchesVerified = !onlyVerified || t.verified;
      
      return matchesSearch && matchesSubject && matchesRate && matchesRating && matchesLanguage && matchesVerified;
    });
  }, [allTutors, search, subject, minRate, maxRate, fourPlus, threePlus, selectedLanguage, onlyVerified]);

  const userInitial = session?.user?.name?.[0]?.toUpperCase() ?? "Y";

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #fffde7 0%, #e0f7f4 50%, #b2ede8 100%)" }}
    >
      <div className="flex min-h-screen">
        <aside className="flex w-72 flex-col gap-8 border-r border-white/60 bg-white/50 px-6 py-8 backdrop-blur">
          <Link href="/dashboard" className="flex items-center gap-2">
            <svg className="h-7 w-7 text-teal-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-xl font-bold text-black">TutorLink</span>
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

          <div>
            <h4 className="mb-3 font-bold text-gray-800">Language</h4>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-xl bg-teal-500 px-4 py-3 font-semibold text-white outline-none"
            >
              <option>All Languages</option>
              {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>

          <div>
            <h4 className="mb-3 font-bold text-gray-800">Trust & Safety</h4>
            <label className="flex cursor-pointer items-center gap-3">
              <input 
                type="checkbox" 
                checked={onlyVerified} 
                onChange={(e) => setOnlyVerified(e.target.checked)} 
                className="h-4 w-4 accent-teal-500" 
              />
              <span className="text-sm font-medium text-gray-700">Verified Tutors Only</span>
            </label>
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
              <Link href="/dashboard" className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-400 text-sm font-bold text-white transition-transform hover:scale-110 active:scale-95 shadow-md">
                {userInitial}
              </Link>
              <button 
                className="relative" 
                type="button"
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
          </div>

          {notificationsOpen && (
            <div className="absolute right-8 top-20 z-50 w-72 rounded-2xl border border-white/80 bg-white/80 p-4 shadow-xl backdrop-blur-md fade-up">
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

          <div className="mb-3 text-sm text-gray-600">
            {loading ? "Loading tutors..." : `${filteredTutors.length} tutor${filteredTutors.length !== 1 ? "s" : ""} found`}
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {filteredTutors.map((t, idx) => (
              <TutorCard key={(t as any).id || idx} tutor={t} index={idx} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
