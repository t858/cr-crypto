import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { supabase } from "@/lib/supabase";

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

        // 1. Fetch current metadata from Supabase
        const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('metadata')
            .eq('id', userId)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // Ignore not found error here
            console.error("[PROFILE_API] Error fetching existing data:", fetchError);
            return NextResponse.json({ message: "Database read error" }, { status: 500 });
        }

        const existingMetadata = userData?.metadata || {};

        // 2. Safely merge the new profile into the existing metadata
        const mergedMetadata = {
            ...existingMetadata,
            profile: {
                ...(existingMetadata.profile || {}),
                ...updatedProfile
            }
        };

        // 3. Update the record in Supabase
        const { error: updateError } = await supabase
            .from('users')
            .update({ metadata: mergedMetadata })
            .eq('id', userId);

        if (updateError) {
            console.error("[PROFILE_API] Error updating Supabase:", updateError);
            return NextResponse.json({ message: "Database update error" }, { status: 500 });
        }

        return NextResponse.json({ message: "Profile updated successfully (Supabase)", profile: updatedProfile }, { status: 200 });
        
    } catch (error: any) {
        console.error("[PROFILE_API] Server error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
