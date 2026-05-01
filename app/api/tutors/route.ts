import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
    try {
        const snap = await getDocs(collection(db, "tutors"));
        const tutors = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        return NextResponse.json(tutors);
    } catch (e) {
        const message = e instanceof Error ? e.message : "Unknown error";
        console.error("Error fetching tutors:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}