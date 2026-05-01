import { Suspense } from "react";
import TutorsContent from "./TutorsContent";

export default function TutorsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen grid-bg flex items-center justify-center text-white/40">Loading...</div>}>
            <TutorsContent />
        </Suspense>
    );
}