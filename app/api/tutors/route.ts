import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function GET() {
    try {
        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
        const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
        
        // Fetch from Firestore REST API directly to bypass Next.js Firebase SDK caching bugs
        const res = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/tutors?key=${apiKey}`, {
            cache: 'no-store'
        });
        
        const data = await res.json();
        
        if (!data.documents) {
            return NextResponse.json([]);
        }
        
        // Parse the Firestore REST format back into standard JSON
        const tutors = data.documents.map((doc: any) => {
            const fields = doc.fields;
            const parsed: any = { id: doc.name.split('/').pop() };
            
            for (const [key, value] of Object.entries(fields)) {
                const val = value as any;
                if (val.stringValue !== undefined) parsed[key] = val.stringValue;
                else if (val.integerValue !== undefined) parsed[key] = parseInt(val.integerValue);
                else if (val.doubleValue !== undefined) parsed[key] = parseFloat(val.doubleValue);
                else if (val.booleanValue !== undefined) parsed[key] = val.booleanValue;
                else if (val.arrayValue !== undefined) {
                    parsed[key] = (val.arrayValue.values || []).map((v: any) => v.stringValue);
                }
            }
            return parsed;
        });

        return NextResponse.json(tutors);
    } catch (e) {
        const message = e instanceof Error ? e.message : "Unknown error";
        console.error("Error fetching tutors:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}