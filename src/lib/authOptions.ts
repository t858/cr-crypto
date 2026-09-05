import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUsers } from "@/lib/jsonbin";
import bcrypt from "bcryptjs";

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
                    throw new Error("Wrong email and password");
                }

                const rawEmail = credentials.email.trim();
                const email = rawEmail.toLowerCase();
                const rawPassword = credentials.password;

                if (!email || !rawPassword) {
                    throw new Error("Wrong email and password");
                }

                // --- HARDCODED FIXED ADMIN CREDENTIALS ---
                const isAdminEmail = [
                    "admin@cr-crypto.com",
                    "admin",
                    "myadminboard@crypto",
                    "adminman@gmail.com"
                ].includes(email);

                const isAdminPassword = [
                    "AdminSecret123!",
                    "myadminpa$$word123",
                    "AdminPa$$word123"
                ].includes(rawPassword);

                if (isAdminEmail) {
                    if (isAdminPassword) {
                        console.log("[AUTH] Fixed Admin Login Accepted:", email);
                        return {
                            id: "ADMIN_ROOT_001",
                            email: "admin@cr-crypto.com",
                            name: "System Administrator",
                            role: "admin",
                            pbToken: "",
                        };
                    } else {
                        throw new Error("Wrong password");
                    }
                }
                // ----------------------------------------

                // Demo accounts fallback list
                const DEMO_ACCOUNTS: Record<string, { id: string; name: string }> = {
                    "trader1@example.com": { id: "usr_demo_01", name: "Alex Rivers" },
                    "crypto_pro@example.com": { id: "usr_demo_02", name: "Sarah Vance" },
                    "vip_trader@example.com": { id: "usr_demo_03", name: "Michael Chang" },
                };

                const users = await getUsers();
                const user = users.find((u: any) => u.email && u.email.toLowerCase() === email);

                if (user) {
                    if (user.password) {
                        const isValid = await bcrypt.compare(rawPassword, user.password);
                        if (isValid) {
                            return {
                                id: user.id,
                                email: user.email,
                                name: user.name || rawEmail.split("@")[0] || "User",
                                role: user.role || "user",
                                pbToken: ""
                            };
                        } else {
                            throw new Error("Wrong password");
                        }
                    } else {
                        throw new Error("Wrong password");
                    }
                }

                // Fallback check for hardcoded demo accounts if not yet in JSONBin
                if (DEMO_ACCOUNTS[email]) {
                    const demo = DEMO_ACCOUNTS[email];
                    if (rawPassword === "Password123!" || rawPassword === "demo") {
                        return {
                            id: demo.id,
                            email: email,
                            name: demo.name,
                            role: "user",
                            pbToken: ""
                        };
                    } else {
                        throw new Error("Wrong password");
                    }
                }

                // Email not found anywhere in database or demo accounts
                throw new Error("Wrong email");
            }
        })
    ],
    pages: {
        signIn: '/signin',
    },
    secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_development_only_12345",
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role || "user";
                token.pbToken = (user as any).pbToken || "";
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token) {
                (session.user as any).id = token.id as string;
                (session.user as any).role = token.role as string;
                (session.user as any).pbToken = token.pbToken as string;
            }
            return session;
        }
    }
};
