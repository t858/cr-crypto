import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { getUsers, saveUsers, getUserByIdOrEmail, updateUser } from "@/lib/jsonbin";
import { DEFAULT_DASHBOARD_CONFIG } from "@/app/types/dashboardConfig";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const email = session.user.email || "";

        let userRecord = await getUserByIdOrEmail(userId) || (email ? await getUserByIdOrEmail(email) : null);

        // If user is not yet in JSONBin (e.g. demo account), auto-seed the user in JSONBin
        if (!userRecord && email) {
            try {
                const users = await getUsers();
                const newUser = {
                    id: userId || "usr_" + Buffer.from(email).toString("hex").substring(0, 10),
                    email: email.toLowerCase(),
                    name: session.user.name || email.split("@")[0] || "Trader Account",
                    role: (session.user as any).role || "user",
                    metadata: {
                        ...DEFAULT_DASHBOARD_CONFIG,
                        profile: {
                            fullName: session.user.name || "",
                            email: email,
                        }
                    },
                    created: new Date().toISOString()
                };

                users.push(newUser);
                await saveUsers(users);
                userRecord = newUser;
            } catch (seedErr) {
                console.error("[JSONBIN_METADATA_API] Auto-seed failed:", seedErr);
            }
        }

        const metadata = userRecord?.metadata || DEFAULT_DASHBOARD_CONFIG;

        return NextResponse.json({
            success: true,
            user: {
                id: userRecord?.id || userId,
                email: userRecord?.email || email,
                name: userRecord?.name || session.user.name
            },
            metadata: metadata
        }, { status: 200 });

    } catch (error: any) {
        console.error("[METADATA_API] GET error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const email = session.user.email || "";
        const body = await req.json();

        let userRecord = await getUserByIdOrEmail(userId) || (email ? await getUserByIdOrEmail(email) : null);

        if (!userRecord) {
            // Create user in JSONBin if missing
            const users = await getUsers();
            const newUser = {
                id: userId || "usr_" + Buffer.from(email).toString("hex").substring(0, 10),
                email: email.toLowerCase(),
                name: session.user.name || email.split("@")[0] || "Trader Account",
                role: (session.user as any).role || "user",
                metadata: {
                    ...DEFAULT_DASHBOARD_CONFIG,
                    ...body
                },
                created: new Date().toISOString()
            };

            users.push(newUser);
            await saveUsers(users);

            return NextResponse.json({
                message: "Metadata updated & user created in JSONBin",
                metadata: newUser.metadata
            }, { status: 200 });
        }

        // Merge existing metadata with updated fields
        const existingMetadata = userRecord.metadata || DEFAULT_DASHBOARD_CONFIG;
        const mergedMetadata = {
            ...existingMetadata,
            ...body,
            walletBalances: {
                ...(existingMetadata.walletBalances || {}),
                ...(body.walletBalances || {})
            },
            widgetVisibility: {
                ...(existingMetadata.widgetVisibility || {}),
                ...(body.widgetVisibility || {})
            },
            profile: {
                ...(existingMetadata.profile || {}),
                ...(body.profile || {})
            }
        };

        const updated = await updateUser(userRecord.id, { metadata: mergedMetadata });

        return NextResponse.json({
            message: "Metadata updated successfully",
            metadata: updated?.metadata || mergedMetadata
        }, { status: 200 });

    } catch (error: any) {
        console.error("[METADATA_API] POST error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
