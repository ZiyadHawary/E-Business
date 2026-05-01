import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { tutorId, tutorName, tutorInitials, tutorColor, subject, date, time } = body;

        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
        const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
        const userId = (session.user as any).id || (session.user as any).sub || session.user.email;

        if (!userId || !tutorId || !tutorName || !subject || !date || !time) {
            const missing = [];
            if (!userId) missing.push("userId (Session ID)");
            if (!tutorId) missing.push("tutorId");
            if (!tutorName) missing.push("tutorName");
            if (!subject) missing.push("subject");
            if (!date) missing.push("date");
            if (!time) missing.push("time");
            return NextResponse.json({ 
                error: `Missing required fields: ${missing.join(", ")}`,
                debug: { 
                    sessionUserId: (session.user as any)?.id, 
                    hasUser: !!session.user,
                    receivedBody: body
                }
            }, { status: 400 });
        }

        const bookingData = {
            fields: {
                userId: { stringValue: String(userId) },
                tutorId: { stringValue: String(tutorId) },
                tutorName: { stringValue: String(tutorName) },
                tutorInitials: { stringValue: String(tutorInitials || "") },
                tutorColor: { stringValue: String(tutorColor || "#10b981") },
                subject: { stringValue: String(subject) },
                date: { stringValue: String(date) },
                time: { stringValue: String(time) },
                status: { stringValue: "Upcoming" },
                createdAt: { timestampValue: new Date().toISOString() }
            }
        };

        const res = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/bookings?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error?.message || "Failed to create booking");
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("Booking error:", e);
        return NextResponse.json({ error: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
        const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
        const userId = (session.user as any).id || (session.user as any).sub || session.user.email;

        const query = {
            structuredQuery: {
                from: [{ collectionId: "bookings" }],
                where: {
                    fieldFilter: {
                        field: { fieldPath: "userId" },
                        op: "EQUAL",
                        value: { stringValue: userId }
                    }
                }
            }
        };

        const res = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(query)
        });

        const data = await res.json();
        
        if (!Array.isArray(data)) {
            return NextResponse.json([]);
        }

        const bookings = data
            .filter(item => item.document)
            .map(item => {
                const doc = item.document;
                const fields = doc.fields;
                const parsed: any = { id: doc.name.split('/').pop() };
                
                for (const [key, value] of Object.entries(fields)) {
                    const val = value as any;
                    if (val.stringValue !== undefined) parsed[key] = val.stringValue;
                    else if (val.integerValue !== undefined) parsed[key] = parseInt(val.integerValue);
                    else if (val.timestampValue !== undefined) parsed[key] = val.timestampValue;
                }
                return parsed;
            });

        return NextResponse.json(bookings);
    } catch (e) {
        console.error("Fetch bookings error:", e);
        return NextResponse.json({ error: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
    }
}
