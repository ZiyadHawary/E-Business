"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from "@/components/Navbar";

const SUBJECTS = ["Mathematics", "Physics", "Programming", "Chemistry", "English", "Arabic"];

export default function Home() {
  const router = useRouter();
  const [subject, setSubject] = useState("");

  const handleSearch = () => {
    const params = subject ? `?subject=${encodeURIComponent(subject)}` : "";
    router.push(`/tutors${params}`);
  };

  return (
      <div className="min-h-screen grid-bg relative overflow-hidden">
        <Navbar />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />

        <section className="pt-40 pb-24 px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8 fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400 tracking-wider uppercase">Live 1-on-1 sessions</span>
          </div>

          <h1 className="fade-up text-5xl md:text-7xl font-extrabold tracking-tight leading-none mb-6" style={{fontFamily:"var(--font-syne)",animationDelay:"0.1s"}}>
            Find your perfect tutor,<br /><span className="text-emerald-400">learn faster</span>
          </h1>

          <p className="fade-up text-lg text-white/50 max-w-xl mx-auto mb-12" style={{animationDelay:"0.2s"}}>
            Connect with verified, expert tutors for live video sessions tailored to your goals.
          </p>

          <div className="fade-up max-w-lg mx-auto flex items-center gap-3 bg-[#141720] border border-white/10 rounded-2xl p-2 shadow-2xl" style={{animationDelay:"0.3s"}}>
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className="flex-1 bg-transparent text-white/70 text-sm px-3 py-2.5 outline-none cursor-pointer">
              <option value="">All Subjects</option>
              {SUBJECTS.map((s) => <option key={s} value={s} className="bg-[#1c2030]">{s}</option>)}
            </select>
            <button onClick={handleSearch} className="btn-primary px-6 py-2.5 rounded-xl text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Search
            </button>
          </div>

          <div className="fade-up flex flex-wrap justify-center gap-2 mt-6" style={{animationDelay:"0.4s"}}>
            {SUBJECTS.map((s) => (
                <button key={s} onClick={() => router.push(`/tutors?subject=${encodeURIComponent(s)}`)}
                        className="px-4 py-1.5 rounded-full text-sm text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 transition-colors">
                  {s}
                </button>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 pb-24">
          <div className="grid grid-cols-3 gap-4">
            {[{value:"500+",label:"Expert Tutors"},{value:"12k+",label:"Sessions Completed"},{value:"4.8★",label:"Average Rating"}].map((stat) => (
                <div key={stat.label} className="card-hover rounded-2xl bg-[#141720] p-6 text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-1" style={{fontFamily:"var(--font-syne)"}}>{stat.value}</div>
                  <div className="text-sm text-white/50">{stat.label}</div>
                </div>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-32">
          <h2 className="text-3xl font-bold text-center mb-12" style={{fontFamily:"var(--font-syne)"}}>How it <span className="text-emerald-400">works</span></h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {step:"01",title:"Search & Filter",desc:"Find the perfect tutor by subject, price, rating, and availability.",icon:"🔍"},
              {step:"02",title:"Book a Session",desc:"Pick a time slot that works for you. Real-time availability shown.",icon:"📅"},
              {step:"03",title:"Learn Live",desc:"HD video call with interactive whiteboard and file sharing.",icon:"🎓"},
            ].map((item) => (
                <div key={item.step} className="card-hover rounded-2xl bg-[#141720] p-6">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <div className="text-xs font-bold text-emerald-500 mb-2 tracking-widest">{item.step}</div>
                  <h3 className="text-lg font-bold mb-2" style={{fontFamily:"var(--font-syne)"}}>{item.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
                </div>
            ))}
          </div>
        </section>
      </div>
  );
}