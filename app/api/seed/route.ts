import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

const TUTORS = [
    {
        name: "Karim Mahmoud",
        initials: "KM",
        bio: "5 years teaching Python, algorithms & web development. Cairo University graduate.",
        subjects: ["Programming", "Mathematics"],
        tags: ["Python", "Algorithms", "Web Dev"],
        hourlyRate: 22,
        rating: 4.8,
        reviewCount: 64,
        language: ["English", "Arabic"],
        availability: ["Today", "This week"],
        verified: true,
        color: "#10b981",
    },
    {
        name: "Omar Mostafa",
        initials: "OM",
        bio: "Backend engineer turned tutor. Specializes in Java, databases, and system design.",
        subjects: ["Programming", "Mathematics"],
        tags: ["Java", "Databases", "System Design"],
        hourlyRate: 19,
        rating: 4.6,
        reviewCount: 41,
        language: ["English"],
        availability: ["This week", "Weekends"],
        verified: true,
        color: "#6366f1",
    },
    {
        name: "Rania Adel",
        initials: "RA",
        bio: "Teaching programming and data structures since 2019. Patient, clear, exam-focused coaching.",
        subjects: ["Programming"],
        tags: ["C++", "Data Structures"],
        hourlyRate: 16,
        rating: 4.9,
        reviewCount: 78,
        language: ["Arabic", "English"],
        availability: ["Today", "Weekends"],
        verified: true,
        color: "#f59e0b",
    },
    {
        name: "Sara Ahmed",
        initials: "SA",
        bio: "Mathematics lecturer with 8 years of experience in calculus, algebra, and statistics.",
        subjects: ["Mathematics"],
        tags: ["Calculus", "Algebra", "Statistics"],
        hourlyRate: 18,
        rating: 4.7,
        reviewCount: 52,
        language: ["Arabic", "English"],
        availability: ["This week"],
        verified: true,
        color: "#ec4899",
    },
    {
        name: "Ahmed Nasser",
        initials: "AN",
        bio: "Physics PhD candidate. Specializes in mechanics, electrodynamics, and modern physics.",
        subjects: ["Physics"],
        tags: ["Mechanics", "Electrodynamics"],
        hourlyRate: 25,
        rating: 4.5,
        reviewCount: 33,
        language: ["English"],
        availability: ["Today", "This week"],
        verified: false,
        color: "#14b8a6",
    },
    {
        name: "Nour Ali",
        initials: "NA",
        bio: "Chemistry tutor specializing in organic chemistry and lab preparation for university students.",
        subjects: ["Chemistry"],
        tags: ["Organic Chem", "Lab Prep"],
        hourlyRate: 20,
        rating: 4.3,
        reviewCount: 29,
        language: ["Arabic"],
        availability: ["Weekends"],
        verified: true,
        color: "#8b5cf6",
    },
    {
        name: "Lina Hassan",
        initials: "LH",
        bio: "Native English speaker. Specializes in IELTS prep, business English, and academic writing.",
        subjects: ["English"],
        tags: ["IELTS", "Academic Writing"],
        hourlyRate: 12,
        rating: 4.8,
        reviewCount: 91,
        language: ["English", "French"],
        availability: ["Today", "This week", "Weekends"],
        verified: true,
        color: "#f43f5e",
    },
    {
        name: "Mohamed Youssef",
        initials: "MY",
        bio: "Electrical engineering tutor. Circuit analysis, digital logic, and microcontrollers.",
        subjects: ["Physics", "Programming"],
        tags: ["Circuits", "Digital Logic", "Embedded"],
        hourlyRate: 23,
        rating: 4.4,
        reviewCount: 18,
        language: ["Arabic", "English"],
        availability: ["This week", "Weekends"],
        verified: false,
        color: "#0ea5e9",
    },
];

export async function POST() {
    try {
        const colRef = collection(db, "tutors");
        const existing = await getDocs(colRef);
        existing.forEach(async (d) => await deleteDoc(doc(db, "tutors", d.id)));

        for (const tutor of TUTORS) {
            await addDoc(colRef, tutor);
        }
        return NextResponse.json({ success: true, count: TUTORS.length });
    } catch (e) {
        const message = e instanceof Error ? e.message : "Unknown error";
        console.error("Error seeding tutors:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}