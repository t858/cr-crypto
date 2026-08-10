import { NextResponse } from "next/server";
import { getUsers, saveUsers } from "@/lib/jsonbin";
import { DEFAULT_DASHBOARD_CONFIG } from "@/app/types/dashboardConfig";
import bcrypt from "bcryptjs";

const validatePassword = (password: string) => {
    if (!password || password.length < 8) {
        return "Password must be at least 8 characters long.";
    }
    if (!/[A-Z]/.test(password)) {
        return "Password must contain at least one uppercase capital letter.";
    }
    if (!/[0-9]/.test(password)) {
        return "Password must contain at least one number.";
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
        return "Password must contain at least one special character (e.g. @, $, _, !, etc.).";
    }
    return null;
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        const rawEmail = body.email?.trim();
        const rawPassword = body.password;
        const rawName = body.name?.trim() || "User";

        if (!rawEmail || !rawPassword) {
            return NextResponse.json({ message: "Email and password are required fields" }, { status: 400 });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
            return NextResponse.json({ message: "Invalid email address format" }, { status: 400 });
        }

        const email = rawEmail.toLowerCase();

        const passwordError = validatePassword(rawPassword);
        if (passwordError) {
            return NextResponse.json({ message: passwordError }, { status: 400 });
        }

        try {
            const users = await getUsers();
            
            if (users.some((u: any) => u.email === email)) {
                return NextResponse.json({ message: "An account with this email already exists" }, { status: 409 });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(rawPassword, salt);

            const initialMetadata = {
                ...DEFAULT_DASHBOARD_CONFIG,
                profile: {
                    fullName: rawName,
                    phone: "",
                    country: "",
                    address: "",
                    city: "",
                    dob: "",
                    photoUrl: "",
                    idDocumentUrl: ""
                }
            };

            const newUser = {
                id: "usr_" + Math.random().toString(36).substring(2, 9),
                email,
                password: hashedPassword,
                name: rawName,
                role: "user",
                metadata: initialMetadata,
                created: new Date().toISOString()
            };

            users.push(newUser);
            
            const saved = await saveUsers(users);

            if (!saved) {
                console.error("[SIGNUP_API] Could not persist user to remote JSONBin database.");
                return NextResponse.json({ message: "Failed to save account to JSONBin database. Please check connection and try again." }, { status: 500 });
            }

            return NextResponse.json({
                message: "User created successfully",
                user: { 
                    id: newUser.id,
                    email: newUser.email,
                    name: rawName
                }
            }, { status: 201 });

        } catch (authError: any) {
            console.error("[JSONBIN_AUTH] Signup failed:", authError?.message);
            return NextResponse.json({ message: "Failed to create user" }, { status: 500 });
        }

    } catch (error: any) {
        console.error("[SIGNUP_API] Error:", error);
        return NextResponse.json({ message: error.message || "An unexpected error occurred during signup" }, { status: 500 });
    }
}
