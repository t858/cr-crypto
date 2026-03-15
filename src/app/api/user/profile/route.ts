import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client using Service Role Key (bypasses RLS)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy-url-for-build.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy-key-for-build"
);

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const userEmail = session.user.email || "";
        const userName = session.user.name || "";
        const body = await req.json();

        const updatedProfile = {
            fullName: body.fullName || "",
            phone: body.phone || "",
            country: body.country || "",
            address: body.address || "",
            city: body.city || "",
            dob: body.dob || "",
            photoUrl: body.photoUrl || "",
        };

        // 1. Try to fetch existing metadata
        const { data: userData } = await supabaseAdmin
            .from('users')
            .select('metadata')
            .eq('id', userId)
            .maybeSingle();

        const existingMetadata = userData?.metadata || {};

        // 2. Merge new profile data into existing metadata
        const mergedMetadata = {
            ...existingMetadata,
            profile: {
                ...(existingMetadata.profile || {}),
                ...updatedProfile
            }
        };

        // 3. Upsert — creates the row if it doesn't exist, updates if it does
        const { error: upsertError } = await supabaseAdmin
            .from('users')
            .upsert({
                id: userId,
                email: userEmail,
                name: updatedProfile.fullName || userName,
                "passwordHash": "firebase-auth-managed",
                metadata: mergedMetadata,
            }, { onConflict: 'id' });

        if (upsertError) {
            console.error("[PROFILE_API] Upsert error:", upsertError);
            return NextResponse.json({ message: "Database save error" }, { status: 500 });
        }

        return NextResponse.json({ message: "Profile updated successfully", profile: updatedProfile }, { status: 200 });
        
    } catch (error: any) {
        console.error("[PROFILE_API] Server error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
