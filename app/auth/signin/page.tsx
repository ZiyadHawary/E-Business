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
  const [showPassword, setShowPassword] = useState(false);

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
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #fffde7 0%, #e0f7f4 50%, #b2ede8 100%)",
      }}
    >
      <nav className="flex items-center px-4 md:px-8 py-5">
        <Link href="/" className="flex items-center gap-2">
          <svg
            className="h-7 w-7 text-teal-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-xl font-bold text-black">TutorLink</span>
        </Link>
      </nav>

      <main className="mx-auto flex flex-col lg:flex-row max-w-6xl items-center justify-center lg:justify-between gap-8 lg:gap-12 px-4 md:px-8 py-12">
        <div className="hidden lg:block max-w-md flex-1"
          style={{
            backgroundImage: "url('/images/login.png')",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}>
          <h2 className="mb-3 text-3xl font-extrabold text-gray-900">
            Welcome to TutorLink!
          </h2>
          <p className="mb-10 text-base text-gray-600">
            Connect with certified tutors to meet all your personalized learning
            needs!
          </p>
          <div
            className="h-96 w-full -z-10"
            aria-label="TutorLink learning illustration"
            role="img"
          />
        </div>

        <div className="w-full max-w-sm lg:w-96 rounded-3xl border border-white/80 bg-white/60 p-6 md:p-10 shadow-xl backdrop-blur-md">
          <h1 className="mb-8 text-center text-2xl font-extrabold leading-snug text-gray-900">
            Learning Without Limits.
            <br />
            <span className="text-gray-800">Join us now!</span>
          </h1>

          <div className="space-y-4">
            {error && <p className="text-center text-sm text-red-500">{error}</p>}

            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <input
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                placeholder="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <input
                  className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
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
              <a
                href="#"
                className="mt-1 block text-xs text-gray-500 transition-colors hover:text-teal-500"
              >
                Forgot Password?
              </a>
            </div>

            <button
              className="w-full rounded-xl bg-teal-500 py-3 font-semibold text-white shadow-md transition-colors hover:bg-teal-600 disabled:opacity-60"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            <p className="text-center text-sm text-gray-500">
              Don&apos;t Have an Account?{" "}
              <Link
                href="/auth/signup"
                className="font-medium text-teal-500 hover:underline"
              >
                Sign Up
              </Link>
            </p>

            <div className="mt-2 flex justify-center gap-3">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-teal-500 transition-colors hover:bg-teal-100"
                aria-label="Continue with Facebook"
              >
                <svg className="h-5 w-5 text-teal-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-teal-500 transition-colors hover:bg-teal-100"
                aria-label="Continue with Google"
              >
                <svg className="h-5 w-5 text-teal-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
              </button>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-teal-500 transition-colors hover:bg-teal-100"
                aria-label="Continue with LinkedIn"
              >
                <svg className="h-5 w-5 text-teal-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </button>
            </div>

            <button
              type="button"
              className="mt-2 flex w-full items-center justify-between rounded-xl bg-teal-500 px-5 py-3 font-semibold text-white transition-colors hover:bg-teal-600"
            >
              <span>Student</span>
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}