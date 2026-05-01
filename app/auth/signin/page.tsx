"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });
        setLoading(false);
        if (res?.error) {
            setError("Invalid email or password.");
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <div className="min-h-screen grid-bg flex items-center justify-center px-4">
            <div className="w-full max-w-md fade-up">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block text-2xl font-bold" style={{ fontFamily: "var(--font-syne)" }}>
                        Tutor<span className="text-emerald-400">Link</span>
                    </Link>
                    <p className="text-white/40 text-sm mt-2">Sign in to continue learning</p>
                </div>

                <div className="bg-[#141720] rounded-2xl border border-white/8 p-8 space-y-4">
                    <h1 className="text-2xl font-bold text-center mb-6" style={{ fontFamily: "var(--font-syne)" }}>Welcome back</h1>

                    {error && <p className="text-sm text-red-400 text-center">{error}</p>}

                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 outline-none focus:border-emerald-500/50 transition-colors"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 outline-none focus:border-emerald-500/50 transition-colors"
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="btn-primary w-full py-3 rounded-xl text-sm disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </div>
            </div>
        </div>
    );
}