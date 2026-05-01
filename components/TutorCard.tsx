"use client";
import { useSession, signIn } from "next-auth/react";

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

export default function TutorCard({ tutor, index }: { tutor: Tutor; index: number }) {
    const { data: session } = useSession();

    const handleBook = () => {
        if (!session) {
            signIn("google");
        } else {
            alert(`Booking with ${tutor.name} — booking flow coming in next phase!`);
        }
    };

    return (
        <div
            className="card-hover rounded-2xl bg-[#141720] p-5 flex items-start gap-5 fade-up"
            style={{ animationDelay: `${index * 0.08}s` }}
        >
            {/* Avatar */}
            <div
                className="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center text-lg font-bold text-black"
                style={{ background: tutor.color, fontFamily: "var(--font-syne)" }}
            >
                {tutor.initials}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>
                            {tutor.name}
                        </h3>
                        {tutor.verified && (
                            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified
              </span>
                        )}
                    </div>

                    {/* Price + Rating */}
                    <div className="text-right shrink-0">
                        <div className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>
                            ${tutor.hourlyRate}<span className="text-sm font-normal text-white/40">/hr</span>
                        </div>
                        <div className="flex items-center gap-1 justify-end text-sm">
                            <span className="text-yellow-400">★</span>
                            <span className="text-white font-medium">{tutor.rating}</span>
                            <span className="text-white/40">({tutor.reviewCount})</span>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-white/50 mb-3 line-clamp-2">{tutor.bio}</p>

                {/* Tags */}
                <div className="flex items-center gap-2 flex-wrap">
                    {tutor.tags.map((tag) => (
                        <span key={tag} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/8 text-xs text-white/60">
              {tag}
            </span>
                    ))}
                    <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/8 text-xs text-white/40">
            🌐 {tutor.language.join(", ")}
          </span>
                    {tutor.availability.includes("Today") && (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
              Available today
            </span>
                    )}
                </div>
            </div>

            {/* CTA */}
            <button
                onClick={handleBook}
                className="btn-primary px-5 py-2.5 rounded-xl text-sm shrink-0 self-center"
            >
                Book
            </button>
        </div>
    );
}