"use client";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
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

const SUBJECTS = ["Mathematics", "Physics", "Programming", "Chemistry", "English", "Arabic"];
const LANGUAGES = ["English", "Arabic", "French"];
const AVAILABILITIES = ["Today", "This week", "Weekends"];
const SORT_OPTIONS = ["Top rated", "Price: Low to High", "Price: High to Low", "Most reviews"];

export default function TutorsContent() {
    const searchParams = useSearchParams();
    const [allTutors, setAllTutors] = useState<Tutor[]>([]);
    const [loading, setLoading] = useState(true);
    const [seeding, setSeeding] = useState(false);

    const [subjects, setSubjects] = useState<string[]>(() => {
        const s = searchParams.get("subject");
        return s ? [s] : [];
    });
    const [maxPrice, setMaxPrice] = useState(100);
    const [minRating, setMinRating] = useState(0);
    const [languages, setLanguages] = useState<string[]>([]);
    const [availabilities, setAvailabilities] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState("Top rated");
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const fetchTutors = async() => {
        try {
            const res = await fetch("/api/tutors");
            const data = await res.json();
            setAllTutors(Array.isArray(data) ? data : []);
        } catch {
            setAllTutors([]);
        } finally {
            setLoading(false);
        }
    }

    // const fetchTutors = useCallback(async () => {
    //     try {
    //         const res = await fetch("/api/tutors");
    //         const data = await res.json();
    //         setAllTutors(Array.isArray(data) ? data : []);
    //     } catch {
    //         setAllTutors([]);
    //     } finally {
    //         setLoading(false);
    //     }
    // }, []);

    useEffect(() => {
        const cancelled = false;
        const load = async() => {
            try {
                const res = await fetch("/api/tutors");
                const data = await res.json();
                if (!cancelled) {
                    setAllTutors(Array.isArray(data) ? data : []);
                }
            } catch {
                if (!cancelled) {
                    setAllTutors([]);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }
    }, [fetchTutors]);

    const seedDb = async () => {
        setSeeding(true);
        setLoading(true);
        await fetch("/api/seed", { method: "POST" });
        await fetchTutors();
        setSeeding(false);
    };

    const toggleItem = (arr: string[], item: string) =>
        arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];

    const filtered = allTutors
        .filter((t) => subjects.length === 0 || t.subjects.some((s) => subjects.includes(s)))
        .filter((t) => t.hourlyRate <= maxPrice)
        .filter((t) => t.rating >= minRating)
        .filter((t) => languages.length === 0 || t.language.some((l) => languages.includes(l)))
        .filter((t) => availabilities.length === 0 || t.availability.some((a) => availabilities.includes(a)))
        .sort((a, b) => {
            if (sortBy === "Top rated") return b.rating - a.rating;
            if (sortBy === "Price: Low to High") return a.hourlyRate - b.hourlyRate;
            if (sortBy === "Price: High to Low") return b.hourlyRate - a.hourlyRate;
            if (sortBy === "Most reviews") return b.reviewCount - a.reviewCount;
            return 0;
        });
    console.log(filtered);
    return (
        <div className="min-h-screen grid-bg">
            <Navbar />
            <div className="pt-20 max-w-7xl mx-auto px-4">
                <div className="py-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-syne)" }}>
                            Find a <span className="text-emerald-400">Tutor</span>
                        </h1>
                        <p className="text-white/40 text-sm mt-1">
                            {loading ? "Loading..." : `${filtered.length} tutor${filtered.length !== 1 ? "s" : ""} available`}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {allTutors.length === 0 && !loading && (
                            <button onClick={seedDb} disabled={seeding} className="btn-primary px-4 py-2 rounded-lg text-sm disabled:opacity-50">
                                {seeding ? "Seeding..." : "Load Demo Tutors"}
                            </button>
                        )}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/60 hover:text-white transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 12h10M10 20h4" /></svg>
                            Filters
                        </button>
                    </div>
                </div>

                <div className="flex gap-6 pb-16">
                    {sidebarOpen && (
                        <aside className="w-64 shrink-0 fade-up">
                            <div className="sticky top-24 bg-[#141720] rounded-2xl border border-white/[0.07] p-5 space-y-6">
                                <div>
                                    <h3 className="text-xs font-bold text-white/40 tracking-widest uppercase mb-3">Subject</h3>
                                    <div className="space-y-2">
                                        {SUBJECTS.map((s) => (
                                            <label key={s} className="flex items-center gap-2.5 cursor-pointer group">
                                                <input type="checkbox" checked={subjects.includes(s)} onChange={() => setSubjects(toggleItem(subjects, s))} className="w-4 h-4 rounded" />
                                                <span className="text-sm text-white/60 group-hover:text-white transition-colors">{s}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs font-bold text-white/40 tracking-widest uppercase mb-3">Price / Hour</h3>
                                    <input type="range" min={5} max={100} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full" />
                                    <div className="flex justify-between text-xs text-white/40 mt-1">
                                        <span>$0</span>
                                        <span className="text-emerald-400 font-semibold">Up to ${maxPrice}</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs font-bold text-white/40 tracking-widest uppercase mb-3">Min. Rating</h3>
                                    <div className="space-y-2">
                                        {[{label:"Any",val:0},{label:"4+ stars",val:4},{label:"4.5+ stars",val:4.5}].map(({label,val}) => (
                                            <label key={label} className="flex items-center gap-2.5 cursor-pointer group">
                                                <input type="radio" name="rating" checked={minRating === val} onChange={() => setMinRating(val)} className="w-4 h-4" />
                                                <span className="text-sm text-white/60 group-hover:text-white transition-colors">{label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs font-bold text-white/40 tracking-widest uppercase mb-3">Language</h3>
                                    <div className="space-y-2">
                                        {LANGUAGES.map((l) => (
                                            <label key={l} className="flex items-center gap-2.5 cursor-pointer group">
                                                <input type="checkbox" checked={languages.includes(l)} onChange={() => setLanguages(toggleItem(languages, l))} className="w-4 h-4 rounded" />
                                                <span className="text-sm text-white/60 group-hover:text-white transition-colors">{l}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs font-bold text-white/40 tracking-widest uppercase mb-3">Availability</h3>
                                    <div className="space-y-2">
                                        {AVAILABILITIES.map((a) => (
                                            <label key={a} className="flex items-center gap-2.5 cursor-pointer group">
                                                <input type="checkbox" checked={availabilities.includes(a)} onChange={() => setAvailabilities(toggleItem(availabilities, a))} className="w-4 h-4 rounded" />
                                                <span className="text-sm text-white/60 group-hover:text-white transition-colors">{a}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => { setSubjects([]); setMaxPrice(100); setMinRating(0); setLanguages([]); setAvailabilities([]); }}
                                    className="w-full py-2 rounded-lg border border-white/10 text-sm text-white/40 hover:text-white hover:border-white/20 transition-all"
                                >
                                    Reset filters
                                </button>
                            </div>
                        </aside>
                    )}

                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2 flex-wrap">
                                {subjects.map((s) => (
                                    <span key={s} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
                    {s}
                                        <button onClick={() => setSubjects(subjects.filter((x) => x !== s))}>×</button>
                  </span>
                                ))}
                            </div>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-[#141720] border border-white/10 text-white/70 text-sm rounded-lg px-3 py-2 outline-none">
                                {SORT_OPTIONS.map((o) => <option key={o} value={o} className="bg-[#1c2030]">{o}</option>)}
                            </select>
                        </div>

                        {loading ? (
                            <div className="grid gap-4">{[1,2,3].map((i) => <div key={i} className="skeleton rounded-2xl h-36" />)}</div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-24 text-white/30">
                                <div className="text-5xl mb-4">🔍</div>
                                <p className="text-lg font-medium" style={{ fontFamily: "var(--font-syne)" }}>No tutors found</p>
                                <p className="text-sm mt-2">Try adjusting your filters</p>
                                {allTutors.length === 0 && (
                                    <button onClick={seedDb} disabled={seeding} className="btn-primary mt-6 px-6 py-2.5 rounded-xl text-sm">
                                        {seeding ? "Loading..." : "Load Demo Tutors"}
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {filtered.map((tutor, i) => <TutorCard key={tutor.id} tutor={tutor} index={i} />)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}