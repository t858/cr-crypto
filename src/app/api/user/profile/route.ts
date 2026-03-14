import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const body = await req.json();

        // Ensure we only extract the specific profile fields we want to allow editing
        const updatedProfile = {
            fullName: body.fullName || "",
            phone: body.phone || "",
            country: body.country || "",
            address: body.address || "",
            city: body.city || "",
            dob: body.dob || "",
            photoUrl: body.photoUrl || "",
        };

        const userRef = adminDb.collection('users').doc(userId);
        
        // Use set with merge: true to avoid overwriting existing data like wallet balances
        await userRef.set({
            metadata: {
                profile: updatedProfile
            }
        }, { merge: true });

        // Since we allow them to change their name, we might optionally want to sync this 
        // back to the core Firebase Auth profile, but storing it in the DB is usually cleaner 
        // for custom dashboards. We will stick with Firestore for the single source of truth.

        return NextResponse.json({ message: "Profile updated successfully", profile: updatedProfile }, { status: 200 });
        
    } catch (error: any) {
        console.error("[PROFILE_API] Error updating profile:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
