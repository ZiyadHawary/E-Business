"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
    const { data: session, status } = useSession();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0d0f12]/90 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span style={{ fontFamily: "var(--font-syne)" }} className="text-xl font-bold tracking-tight">
                        Tutor<span className="text-emerald-400">Link</span>
                    </span>
                </Link>

                {/* Nav links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/tutors" className="text-sm text-white/60 hover:text-white transition-colors">Find a Tutor</Link>
                    <Link href="#" className="text-sm text-white/60 hover:text-white transition-colors">Become a Tutor</Link>
                    <Link href="#" className="text-sm text-white/60 hover:text-white transition-colors">How it Works</Link>
                </div>

                {/* Auth */}
                <div className="flex items-center gap-3">
                    {status === "loading" ? (
                        <div className="w-24 h-8 skeleton rounded-lg" />
                    ) : session ? (
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 rounded-full px-3 py-1.5 bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                            >
                                {session.user?.image ? (
                                    <Image src={session.user.image} alt="avatar" width={26} height={26} className="rounded-full" />
                                ) : (
                                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold text-black">
                                        {session.user?.name?.[0] ?? "U"}
                                    </div>
                                )}
                                <span className="text-sm text-white/80 max-w-30 truncate">{session.user?.name}</span>
                                <svg className="w-3 h-3 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-40 rounded-xl bg-[#1c2030] border border-white/10 shadow-xl overflow-hidden">
                                    <Link href="/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">Dashboard</Link>
                                    <button onClick={() => signOut()} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors">Sign out</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => signIn()}
                                className="text-sm px-4 py-2 rounded-lg text-white/70 hover:text-white border border-white/10 hover:border-white/20 transition-all"
                            >
                                Log in
                            </button>
                            <Link
                                href="/auth/signup"
                                className="btn-primary text-sm px-4 py-2 rounded-lg"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}