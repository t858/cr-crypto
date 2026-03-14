import { adminDb } from "@/lib/firebaseAdmin";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";

export default async function AdminDashboardPage() {
    let users: any[] = [];
    let error: any = null;

    try {
        const usersSnapshot = await adminDb.collection("users").orderBy("created_at", "desc").get();
        usersSnapshot.forEach(doc => {
            users.push({ id: doc.id, ...doc.data() });
        });
    } catch (e: any) {
        // Fallback without ordering in case the index doesn't exist yet
        try {
            const usersSnapshot = await adminDb.collection("users").get();
            usersSnapshot.forEach(doc => {
                users.push({ id: doc.id, ...doc.data() });
            });
        } catch (fallbackError: any) {
            error = fallbackError;
        }
    }

    if (error) {
        return <div className="p-10 text-red-500 font-mono">Fatal Error loading user database: {error.message}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight mb-1">User Database Central</h2>
                    <p className="text-gray-400 font-mono text-sm">Select a user to mutate their core platform metadata properties natively.</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg font-mono text-sm flex items-center gap-2">
                    <Icon icon="lucide:database" />
                    {users?.length || 0} Records Found
                </div>
            </div>

            <div className="grid gap-4">
                {users?.map((user) => (
                    <Link
                        key={user.id}
                        href={`/admin/user/${user.id}`}
                        className="group flex items-center justify-between p-5 rounded-xl border border-white/5 bg-[#11062b] hover:border-red-500/50 transition-all shadow-lg hover:shadow-red-500/5 cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-indigo-900/30 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold font-mono">
                                {user.email.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-white font-bold">{user.name || "Unnamed User"}</h3>
                                <p className="text-gray-400 text-sm font-mono mt-0.5">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className="text-xs text-gray-500 font-mono">
                                Joined: {new Date(user.created_at).toLocaleDateString()}
                            </span>
                            <Icon
                                icon="lucide:chevron-right"
                                className="text-gray-600 group-hover:text-red-400 transition-colors text-xl"
                            />
                        </div>
                    </Link>
                ))}
                {users?.length === 0 && (
                    <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl text-gray-500 font-mono">
                        No users registered in database yet.
                    </div>
                )}
            </div>
        </div>
    );
}
