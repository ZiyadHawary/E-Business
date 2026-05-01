import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    return NextResponse.json({
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "MISSING",
        NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "EXISTS" : "MISSING",
    });
}
