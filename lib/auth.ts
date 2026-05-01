import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    const { signInWithEmailAndPassword } = await import("firebase/auth");
                    const { auth } = await import("@/lib/firebase");

                    const userCredential = await signInWithEmailAndPassword(
                        auth,
                        credentials.email,
                        credentials.password
                    );

                    if (userCredential.user) {
                        return {
                            id: userCredential.user.uid,
                            name: userCredential.user.displayName || "User",
                            email: userCredential.user.email
                        };
                    }
                    return null;
                } catch (error) {
                    console.error("Firebase auth error:", error);
                    return null; // returning null = failed login
                }
            },
        }),
    ],
    pages: { signIn: "/auth/signin" },
    session: { strategy: "jwt" as const },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id || token.sub;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);