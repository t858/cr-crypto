import { NextResponse } from "next/server";
import { getUserByIdOrEmail, updateUser } from "@/lib/jsonbin";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        const rawEmail = body.email?.trim();
        const rawPassword = body.newPassword || body.password;
        const rawConfirmPassword = body.confirmPassword || body.ReNewPassword;

        if (!rawEmail) {
            return NextResponse.json({ message: "Please enter your account email address." }, { status: 400 });
        }

        if (!rawPassword) {
            return NextResponse.json({ message: "New password is required." }, { status: 400 });
        }

        if (!rawConfirmPassword) {
            return NextResponse.json({ message: "Please confirm your new password." }, { status: 400 });
        }

        if (rawPassword !== rawConfirmPassword) {
            return NextResponse.json({ message: "New password and confirm password do not match." }, { status: 400 });
        }

        if (rawPassword.length < 6) {
            return NextResponse.json({ message: "Password must be at least 6 characters long." }, { status: 400 });
        }

        const email = rawEmail.toLowerCase();
        
        // Find existing user in JSONBin database
        const existingUser = await getUserByIdOrEmail(email);
        if (!existingUser) {
            return NextResponse.json({ message: "No account found with this email address." }, { status: 404 });
        }

        // Hash the new password using bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(rawPassword, salt);

        // Update user record: replaces old password with new hashed password without altering account metadata
        const updated = await updateUser(email, { password: hashedPassword });

        if (!updated) {
            return NextResponse.json({ message: "Failed to update password in database. Please check your connection." }, { status: 500 });
        }

        return NextResponse.json({
            message: "Password updated successfully! You can now log in with your new password.",
            success: true
        }, { status: 200 });

    } catch (error: any) {
        console.error("[RESET_PASSWORD_API] Error:", error?.message);
        return NextResponse.json({ message: "An error occurred while resetting your password." }, { status: 500 });
    }
}
