"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BookingModal from "./BookingModal";

export default function TutorCard({ tutor, index }: { tutor: any; index: number }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    const handleBook = () => {
        if (!session) {
            router.push("/auth/signin");
        } else {
            setIsBookingOpen(true);
        }
    };

    return (
        <>
            <div
                className="card-hover rounded-2xl border border-white/80 bg-white/70 p-5 flex items-start gap-5 fade-up relative backdrop-blur shadow-sm transition-shadow hover:shadow-md"
                style={{ animationDelay: `${index * 0.08}s` }}
            >
                {bookingSuccess && (
                    <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-2xl border border-emerald-500/20">
                        <div className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 scale-up">
                            ✓ Booked!
                        </div>
                    </div>
                )}
                {/* Avatar */}
                <div
                    className="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center text-lg font-bold text-white shadow-inner"
                    style={{ background: tutor.color || '#10b981' }}
                >
                    {tutor.initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-gray-900">
                                {tutor.name}
                            </h3>
                            {tutor.verified && (
                                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-medium">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                            )}
                        </div>

                        {/* Price + Rating */}
                        <div className="text-right shrink-0">
                            <div className="text-lg font-bold text-gray-900">
                                ${tutor.hourlyRate || 0}<span className="text-sm font-normal text-gray-400">/hr</span>
                            </div>
                            <div className="flex items-center gap-1 justify-end text-sm">
                                <span className="text-yellow-500">★</span>
                                <span className="text-gray-900 font-bold">{tutor.rating || 0}</span>
                                <span className="text-gray-400 font-medium">({tutor.reviewCount || 0})</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{tutor.bio}</p>

                    {/* Tags */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {tutor.tags?.map((tag: string) => (
                            <span key={tag} className="px-2.5 py-1 rounded-lg bg-teal-500/5 border border-teal-500/10 text-[11px] font-bold text-teal-600 uppercase tracking-wider">
                  {tag}
                </span>
                        ))}
                        <span className="px-2.5 py-1 rounded-lg bg-gray-100 border border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                🌐 {tutor.language?.join(", ") || "English"}
              </span>
                        {tutor.availability?.includes("Today") && (
                            <span className="px-2.5 py-1 rounded-lg bg-amber-100 border border-amber-200 text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                  Available today
                </span>
                        )}
                    </div>
                </div>

                {/* CTA */}
                <button
                    onClick={handleBook}
                    className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all hover:shadow-md shrink-0 self-center"
                >
                    Book
                </button>
            </div>

            <BookingModal 
                tutor={tutor}
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                onSuccess={() => {
                    setBookingSuccess(true);
                    setTimeout(() => setBookingSuccess(false), 3000);
                }}
            />
        </>
    );
}