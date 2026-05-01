import type { Metadata } from "next";
import { Google_Sans_Flex } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const googleSansFlex = Google_Sans_Flex({
    variable: "--font-google-sans-flex",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "TutorLink",
    description: "",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={googleSansFlex.variable}>
            <body className={`${googleSansFlex.className} antialiased bg-white text-black min-h-screen`}>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}