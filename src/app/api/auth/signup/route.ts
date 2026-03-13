import { NextResponse } from "next/server";

// Enforce strong passwords constraint
const validatePassword = (password: string) => {
    const minLength = 8; // Industry standard minimum
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) return "Password must be at least 8 characters long.";
    if (!hasUpperCase) return "Password must contain at least one uppercase letter.";
    if (!hasLowerCase) return "Password must contain at least one lowercase letter.";
    if (!hasNumbers) return "Password must contain at least one number.";
    if (!hasSpecialChar) return "Password must contain at least one special character.";

    return null;
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // Basic input sanitization
        const rawEmail = body.email?.trim();
        const rawPassword = body.password; // Do not trim passwords
        const rawName = body.name?.trim() || "User";

        if (!rawEmail || !rawPassword) {
            return NextResponse.json({ message: "Email and password are required fields" }, { status: 400 });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
            return NextResponse.json({ message: "Invalid email address format" }, { status: 400 });
        }

        const email = rawEmail.toLowerCase();

        // Validate password strength
        const passwordError = validatePassword(rawPassword);
        if (passwordError) {
            return NextResponse.json({ message: passwordError }, { status: 400 });
        }

        const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
        if (!firebaseApiKey) {
            console.error("[AUTH] Firebase API Key is not configured.");
            return NextResponse.json({ message: "Internal server error: missing configuration" }, { status: 500 });
        }

        console.log("[DEBUG SIGNUP] Attempting to create email:", email);
        console.log("[DEBUG SIGNUP] Password length:", rawPassword?.length);

        // 1. Create User via Firebase Auth REST API
        const createRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseApiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password: rawPassword,
                returnSecureToken: true
            })
        });

        const createData = await createRes.json();

        if (!createRes.ok) {
            console.error("[FIREBASE_AUTH] Signup failed:", createData.error);
            const errorMsg = createData.error?.message === "EMAIL_EXISTS" 
                ? "An account with this email already exists" 
                : "Failed to create user account";
            const statusCode = createData.error?.message === "EMAIL_EXISTS" ? 409 : 400;
            return NextResponse.json({ message: errorMsg }, { status: statusCode });
        }

        // 2. Update Display Name using the returned idToken
        const updateRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${firebaseApiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                idToken: createData.idToken,
                displayName: rawName,
                returnSecureToken: false
            })
        });

        if (!updateRes.ok) {
            console.warn("[FIREBASE_AUTH] Non-critical: Failed to update display name during signup.");
        }

        return NextResponse.json({
            message: "User created successfully",
            user: { 
                id: createData.localId,
                email: createData.email,
                name: rawName
            }
        }, { status: 201 });

    } catch (error: any) {
        console.error("[AUTH_API] Unhandled Signup Error:", error);
        return NextResponse.json({ message: "An unexpected error occurred processing your request" }, { status: 500 });
    }
}
