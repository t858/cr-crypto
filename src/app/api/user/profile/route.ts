import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { getUsers, updateUser } from "@/lib/jsonbin";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const body = await req.json();

        if (userId === "ADMIN_ROOT_001" || userId.startsWith("usr_demo")) {
            return NextResponse.json({ 
                message: "Profile updated (Demo Mode)", 
                profile: body
            }, { status: 200 });
        }

        try {
            const users = await getUsers();
            const userRecord = users.find((u: any) => u.id === userId);
            const existingMetadata = userRecord?.metadata || {};

            const updatedProfile = {
                ...(existingMetadata.profile || {}),
                ...(body.fullName !== undefined && { fullName: body.fullName }),
                ...(body.phone !== undefined && { phone: body.phone }),
                ...(body.country !== undefined && { country: body.country }),
                ...(body.address !== undefined && { address: body.address }),
                ...(body.city !== undefined && { city: body.city }),
                ...(body.dob !== undefined && { dob: body.dob }),
                ...(body.photoUrl !== undefined && { photoUrl: body.photoUrl }),
                ...(body.idDocumentUrl !== undefined && { idDocumentUrl: body.idDocumentUrl }),
            };

            const mergedMetadata = {
                ...existingMetadata,
                verificationStep: body.verificationStep ?? existingMetadata.verificationStep ?? 1,
                profile: updatedProfile
            };

            await updateUser(userId, {
                name: updatedProfile.fullName || userRecord?.name || session.user.name,
                metadata: mergedMetadata,
            });

            return NextResponse.json({ message: "Profile saved successfully", profile: updatedProfile, metadata: mergedMetadata }, { status: 200 });

        } catch (pbErr: any) {
            console.error("[JSONBIN_PROFILE_API] Update error:", pbErr?.message || pbErr);
            return NextResponse.json({ message: "Update failed" }, { status: 500 });
        }
        
    } catch (error: any) {
        console.error("[PROFILE_API] Server error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

