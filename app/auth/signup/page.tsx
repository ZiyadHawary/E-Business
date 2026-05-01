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
    const [showPassword, setShowPassword] = useState(false);

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
        <div 
            className="min-h-screen flex items-center justify-center px-4"
            style={{
                background: "linear-gradient(135deg, #fffde7 0%, #e0f7f4 50%, #b2ede8 100%)",
            }}
        >
            <div className="w-full max-w-md fade-up">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold">
                        <svg className="h-7 w-7 text-teal-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span className="text-gray-900">
                            Tutor<span className="text-teal-500">Link</span>
                        </span>
                    </Link>
                    <p className="text-gray-500 text-sm mt-2 font-medium">Create an account to start learning</p>
                </div>

                <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-white/80 p-8 shadow-xl space-y-4">
                    <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">Create Account</h1>

                    {error && (
                        <div className="bg-red-50 text-red-500 text-xs py-2 px-3 rounded-lg text-center border border-red-100 font-medium">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1 block">Full Name</label>
                            <input
                                type="text"
                                placeholder="e.g. John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3.5 rounded-2xl bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1 block">Email Address</label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3.5 rounded-2xl bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1 block">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                    className="w-full px-4 py-3.5 rounded-2xl bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <svg className="h-5 w-5 text-teal-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading || !name || !email || !password}
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white py-4 rounded-2xl text-sm font-bold shadow-lg shadow-teal-500/20 disabled:opacity-50 transition-all mt-4"
                    >
                        {loading ? "Creating account..." : "Sign up"}
                    </button>

                    <p className="text-center text-sm text-gray-500 pt-4 font-medium">
                        Already have an account?{" "}
                        <Link href="/auth/signin" className="text-teal-500 hover:text-teal-600 font-bold transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
