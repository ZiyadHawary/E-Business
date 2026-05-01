"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!name || !email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
            const { auth } = await import("@/lib/firebase");

            // Create user in Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Update the display name
            if (userCredential.user) {
                await updateProfile(userCredential.user, { displayName: name });
            }

            // Sign in through NextAuth so a session is created
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Account created, but sign in failed. Please try logging in.");
                router.push("/auth/signin");
            } else {
                router.push("/dashboard");
            }
        } catch (err: any) {
            console.error("Signup error:", err);
            // Provide more specific error messages if possible
            if (err.code === "auth/email-already-in-use") {
                setError("An account with this email already exists.");
            } else {
                setError(err.message || "Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid-bg flex items-center justify-center px-4">
            <div className="w-full max-w-md fade-up">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block text-2xl font-bold" style={{ fontFamily: "var(--font-syne)" }}>
                        Tutor<span className="text-emerald-400">Link</span>
                    </Link>
                    <p className="text-white/40 text-sm mt-2">Create an account to start learning</p>
                </div>

                <div className="bg-[#141720] rounded-2xl border border-white/8 p-8 space-y-4">
                    <h1 className="text-2xl font-bold text-center mb-6" style={{ fontFamily: "var(--font-syne)" }}>Create Account</h1>

                    {error && <p className="text-sm text-red-400 text-center">{error}</p>}

                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 outline-none focus:border-emerald-500/50 transition-colors"
                    />
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
                        disabled={loading || !name || !email || !password}
                        className="btn-primary w-full py-3 rounded-xl text-sm disabled:opacity-50"
                    >
                        {loading ? "Creating account..." : "Sign up"}
                    </button>

                    <p className="text-center text-sm text-white/50 pt-4">
                        Already have an account?{" "}
                        <Link href="/auth/signin" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
