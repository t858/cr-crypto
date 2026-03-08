import { NextResponse } from "next/server";
import { addUser, getUserByEmail } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password } = body;

        // Basic validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = getUserByEmail(email);
        if (existingUser) {
            return NextResponse.json(
                { message: "User with this email already exists" },
                { status: 409 }
            );
        }

        // Hash the password securely
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Save the user
        const newUser = addUser({
            name,
            email: email.toLowerCase(),
            passwordHash,
        });

        // Don't send the password hash back
        const { passwordHash: _, ...safeUser } = newUser;

        return NextResponse.json(
            { message: "User created successfully", user: safeUser },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { message: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
