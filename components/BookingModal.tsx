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
                className="absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity"
            />
            
            <div className="relative w-full max-w-lg bg-white/95 border border-white/80 rounded-3xl shadow-2xl overflow-hidden scale-up backdrop-blur-xl">
                {/* Header */}
                <div className="p-6 border-b border-black/5 flex items-center gap-4">
                    <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white shadow-inner"
                        style={{ background: tutor.color || '#10b981' }}
                    >
                        {tutor.initials}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Book {tutor.name}
                        </h2>
                        <p className="text-gray-500 text-sm">Select your preferred session time</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="ml-auto w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 text-gray-400 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6">
                    {/* Subject Selection */}
                    <div className="mb-6">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">Subject</label>
                        <div className="flex flex-wrap gap-2">
                            {tutor.subjects?.map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSelectedSubject(s)}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                        selectedSubject === s 
                                            ? "bg-teal-500 text-white shadow-md shadow-teal-500/20" 
                                            : "bg-gray-50 text-gray-600 border border-gray-100 hover:border-gray-200"
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date Selection */}
                    <div className="mb-6">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">Select Date</label>
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {days.map(d => (
                                <button
                                    key={d.full}
                                    onClick={() => setSelectedDate(d.full)}
                                    className={`flex flex-col items-center min-w-[70px] p-3 rounded-2xl transition-all ${
                                        selectedDate === d.full 
                                            ? "bg-amber-400 text-white font-bold shadow-md shadow-amber-400/20" 
                                            : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100"
                                    }`}
                                >
                                    <span className="text-[10px] uppercase font-bold opacity-60 mb-1">{d.day}</span>
                                    <span className="text-xl leading-none mb-1">{d.date}</span>
                                    <span className="text-[10px] uppercase font-bold opacity-60">{d.month}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Time Selection */}
                    <div className="mb-8">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">Select Time</label>
                        <div className="grid grid-cols-4 gap-2">
                            {TIMES.map(t => (
                                <button
                                    key={t}
                                    onClick={() => setSelectedTime(t)}
                                    className={`py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                        selectedTime === t 
                                            ? "bg-teal-500/10 text-teal-600 border border-teal-500/20" 
                                            : "bg-gray-50 text-gray-500 border border-transparent hover:border-gray-200"
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
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-500/25 transition-all active:scale-[0.98]"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                Confirming...
                            </>
                        ) : "Confirm Booking"}
                    </button>
                </div>
            </div>
        </div>
    );
}
