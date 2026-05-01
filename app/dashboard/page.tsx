"use client";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

const PROGRESS = [
    { subject: "English", pct: 88, color: "#8b5cf6" },
    { subject: "Python", pct: 72, color: "#10b981" },
    { subject: "Calculus", pct: 55, color: "#3b82f6" },
    { subject: "Chemistry", pct: 38, color: "#f59e0b" },
];

const SAVED = [
    { name: "Karim Mahmoud", initials: "KM", color: "#10b981", subject: "Programming", rate: 22 },
    { name: "Sara Ahmed", initials: "SA", color: "#ec4899", subject: "Mathematics", rate: 18 },
    { name: "Lina Hassan", initials: "LH", color: "#f43f5e", subject: "English", rate: 12 },
];

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [bookings, setBookings] = useState<any[]>([]);
    const [bookingsLoading, setBookingsLoading] = useState(true);

    useEffect(() => {
        if (status === "authenticated") {
            fetchBookings();
        }
    }, [status]);

    const fetchBookings = async () => {
        try {
            const res = await fetch("/api/bookings");
            const data = await res.json();
            setBookings(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error("Failed to fetch bookings", e);
        } finally {
            setBookingsLoading(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen grid-bg flex items-center justify-center">
                <div className="text-white/40">Loading...</div>
            </div>
        );
    }

    if (!session) return null;

    const firstName = session.user?.name?.split(" ")[0] ?? "Student";

    return (
        <div className="min-h-screen grid-bg">
            <Navbar />
            <div className="pt-16 flex max-w-7xl mx-auto">
                {/* Sidebar */}
                <aside className="w-56 shrink-0 sticky top-16 h-[calc(100vh-4rem)] border-r border-white/5 p-4 flex flex-col">
                    <nav className="flex-1 space-y-1 mt-4">
                        {[
                            { icon: "◈", label: "Overview", active: true },
                            { icon: "○", label: "My Sessions", active: false },
                            { icon: "◎", label: "Find Tutors", active: false, href: "/tutors" },
                            { icon: "♡", label: "Saved Tutors", active: false },
                            { icon: "□", label: "Progress", active: false },
                            { icon: "$", label: "Payments", active: false },
                        ].map((item) => (
                            <Link
                                key={item.label}
                                href={item.href ?? "#"}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                                    item.active
                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                        : "text-white/40 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                <span className="font-mono">{item.icon}</span>
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="border-t border-white/5 pt-4">
                        <button className="flex items-center gap-2 px-3 py-2 text-sm text-white/30 hover:text-white/50 transition-colors w-full text-left">
                            <span className="font-mono">⚙</span> Settings
                        </button>
                    </div>
                </aside>

                {/* Main */}
                <main className="flex-1 p-8 overflow-auto">
                    {/* Greeting */}
                    <div className="mb-8 fade-up">
                        <div className="flex items-center gap-4 mb-1">
                            {session.user?.image ? (
                                <Image src={session.user.image} alt="avatar" width={44} height={44} className="rounded-full ring-2 ring-emerald-500/30" />
                            ) : (
                                <div className="w-11 h-11 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/30">
                                    {firstName[0]}
                                </div>
                            )}
                            <div>
                                <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-syne)" }}>
                                    Good morning, {firstName}
                                </h1>
                                <p className="text-white/40 text-sm">
                                    {bookingsLoading ? "Loading your sessions..." : `You have ${bookings.length} upcoming sessions`}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats cards */}
                    <div className="grid grid-cols-4 gap-4 mb-8 fade-up" style={{ animationDelay: "0.1s" }}>
                        {[
                            { label: "Total sessions", value: bookings.length.toString() },
                            { label: "Hours learned", value: (bookings.length * 1).toString() },
                            { label: "Saved tutors", value: "3" },
                            { label: "Avg. rating given", value: "4.7" },
                        ].map((stat) => (
                            <div key={stat.label} className="card-hover rounded-2xl bg-[#141720] p-5">
                                <div className="text-xs text-white/40 mb-2">{stat.label}</div>
                                <div className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>{stat.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Two columns */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        {/* Upcoming sessions */}
                        <div className="card-hover rounded-2xl bg-[#141720] p-6 fade-up" style={{ animationDelay: "0.2s" }}>
                            <h2 className="font-bold mb-4" style={{ fontFamily: "var(--font-syne)" }}>Upcoming sessions</h2>
                            <div className="space-y-4">
                                {bookingsLoading ? (
                                    <div className="py-8 text-center text-white/20 text-sm">Loading sessions...</div>
                                ) : bookings.length === 0 ? (
                                    <div className="py-8 text-center">
                                        <p className="text-white/20 text-sm mb-4">No upcoming sessions</p>
                                        <Link href="/tutors" className="btn-primary px-4 py-2 rounded-lg text-xs">Find a Tutor</Link>
                                    </div>
                                ) : (
                                    bookings.map((s) => (
                                        <div key={s.id} className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-black shrink-0" style={{ background: s.tutorColor, fontFamily: "var(--font-syne)" }}>
                                                {s.tutorInitials}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-white">{s.tutorName}</div>
                                                <div className="text-xs text-white/40">{s.date} at {s.time} · {s.subject}</div>
                                            </div>
                                            <span className={`text-xs px-2.5 py-1 rounded-full ${s.status === "Soon" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" : "bg-white/5 text-white/40 border border-white/10"}`}>
                                                {s.status}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Learning progress */}
                        <div className="card-hover rounded-2xl bg-[#141720] p-6 fade-up" style={{ animationDelay: "0.3s" }}>
                            <h2 className="font-bold mb-4" style={{ fontFamily: "var(--font-syne)" }}>Learning progress</h2>
                            <div className="space-y-4">
                                {PROGRESS.map((p) => (
                                    <div key={p.subject}>
                                        <div className="flex justify-between text-sm mb-1.5">
                                            <span className="text-white/70">{p.subject}</span>
                                            <span className="text-white/40">{p.pct}%</span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                                            <div className="h-full rounded-full transition-all" style={{ width: `${p.pct}%`, background: p.color }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Saved tutors */}
                    <div className="card-hover rounded-2xl bg-[#141720] p-6 fade-up" style={{ animationDelay: "0.4s" }}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold" style={{ fontFamily: "var(--font-syne)" }}>Saved tutors</h2>
                            <Link href="/tutors" className="text-xs text-emerald-400 hover:text-emerald-300">Find more →</Link>
                        </div>
                        <div className="space-y-3">
                            {SAVED.map((t) => (
                                <div key={t.name} className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-black shrink-0" style={{ background: t.color, fontFamily: "var(--font-syne)" }}>
                                        {t.initials}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-white">{t.name}</div>
                                        <div className="text-xs text-white/40">{t.subject} · ${t.rate}/hr</div>
                                    </div>
                                    <button className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60 hover:text-white hover:border-white/20 transition-all">
                                        Book
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}