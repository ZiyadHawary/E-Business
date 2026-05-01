"use client";
import { useState } from "react";

type Tutor = {
    id: string;
    name: string;
    initials: string;
    color: string;
    subjects: string[];
};

type BookingModalProps = {
    tutor: Tutor;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
};

const TIMES = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

export default function BookingModal({ tutor, isOpen, onClose, onSuccess }: BookingModalProps) {
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [selectedSubject, setSelectedSubject] = useState<string>(tutor?.subjects?.[0] || "");
    const [loading, setLoading] = useState(false);

    console.log("Booking Tutor:", tutor);

    const getNextDays = () => {
        const days = [];
        for (let i = 1; i <= 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            days.push({
                full: d.toISOString().split('T')[0],
                day: d.toLocaleDateString('en-US', { weekday: 'short' }),
                date: d.getDate(),
                month: d.toLocaleDateString('en-US', { month: 'short' })
            });
        }
        return days;
    };

    const days = getNextDays();

    const handleBooking = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tutorId: tutor.id,
                    tutorName: tutor.name,
                    tutorInitials: tutor.initials,
                    tutorColor: tutor.color,
                    subject: selectedSubject,
                    date: selectedDate,
                    time: selectedTime
                })
            });

            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to book session");
            }
        } catch (e) {
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            />
            
            <div className="relative w-full max-w-lg bg-[#141720] border border-white/10 rounded-3xl shadow-2xl overflow-hidden scale-up">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center gap-4">
                    <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-black"
                        style={{ background: tutor.color, fontFamily: "var(--font-syne)" }}
                    >
                        {tutor.initials}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>
                            Book {tutor.name}
                        </h2>
                        <p className="text-white/40 text-sm">Select your preferred session time</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="ml-auto w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 text-white/40 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6">
                    {/* Subject Selection */}
                    <div className="mb-6">
                        <label className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2 block">Subject</label>
                        <div className="flex flex-wrap gap-2">
                            {tutor.subjects.map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSelectedSubject(s)}
                                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                                        selectedSubject === s 
                                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                            : "bg-white/5 text-white/60 border border-transparent hover:border-white/10"
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date Selection */}
                    <div className="mb-6">
                        <label className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2 block">Select Date</label>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {days.map(d => (
                                <button
                                    key={d.full}
                                    onClick={() => setSelectedDate(d.full)}
                                    className={`flex flex-col items-center min-w-[64px] p-3 rounded-2xl transition-all ${
                                        selectedDate === d.full 
                                            ? "bg-emerald-500 text-black font-bold" 
                                            : "bg-white/5 text-white/60 hover:bg-white/10"
                                    }`}
                                >
                                    <span className="text-[10px] uppercase opacity-60 mb-1">{d.day}</span>
                                    <span className="text-lg leading-none mb-1">{d.date}</span>
                                    <span className="text-[10px] opacity-60">{d.month}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Time Selection */}
                    <div className="mb-8">
                        <label className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2 block">Select Time</label>
                        <div className="grid grid-cols-4 gap-2">
                            {TIMES.map(t => (
                                <button
                                    key={t}
                                    onClick={() => setSelectedTime(t)}
                                    className={`py-2 rounded-xl text-xs transition-all ${
                                        selectedTime === t 
                                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                            : "bg-white/5 text-white/60 border border-transparent hover:border-white/10"
                                    }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <button
                        disabled={!selectedDate || !selectedTime || loading}
                        onClick={handleBooking}
                        className="w-full btn-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                Confirming...
                            </>
                        ) : "Confirm Booking"}
                    </button>
                </div>
            </div>
        </div>
    );
}
