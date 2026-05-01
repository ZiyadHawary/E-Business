"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
    const { data: session, status } = useSession();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-1000 border-b border-black/5 bg-white/90 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <svg className="h-6 w-6 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="text-black text-xl font-bold tracking-tight">
                        Tutor<span className="text-emerald-400">Link</span>
                    </span>
                </Link>

                {/* Nav links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/tutors" className="text-sm text-gray-600 hover:text-black transition-colors">Find a Tutor</Link>
                    <Link href="#" className="text-sm text-gray-600 hover:text-black transition-colors">Become a Tutor</Link>
                    <Link href="#" className="text-sm text-gray-600 hover:text-black transition-colors">How it Works</Link>
                </div>

                {/* Auth */}
                <div className="flex items-center gap-3">
                    {status === "loading" ? (
                        <div className="w-24 h-8 skeleton rounded-lg" />
                    ) : session ? (
                        <div className="relative">
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 rounded-full px-3 py-1.5 bg-black/5 hover:bg-black/10 transition-colors border border-black/10"
                                >
                                    {session.user?.image ? (
                                        <Image src={session.user.image} alt="avatar" width={26} height={26} className="rounded-full" />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-black">
                                            {session.user?.name?.[0] ?? "U"}
                                        </div>
                                    )}
                                    <span className="text-sm text-gray-700 max-w-30 truncate font-medium">{session.user?.name}</span>
                                </Link>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="p-1 hover:bg-black/5 rounded-full transition-colors"
                                >
                                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-40 rounded-xl bg-white border border-black/10 shadow-xl overflow-hidden">
                                    <Link href="/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm text-gray-600 hover:text-black hover:bg-black/5 transition-colors">Dashboard</Link>
                                    <button onClick={() => signOut()} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:text-red-600 hover:bg-black/5 transition-colors">Sign out</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => signIn()}
                                className="text-sm px-4 py-2 rounded-lg text-gray-600 hover:text-black border border-black/10 hover:border-black/20 transition-all"
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