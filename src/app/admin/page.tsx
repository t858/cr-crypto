import { getUsers } from "@/lib/jsonbin";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import AdminAnnouncementBroadcast from "@/app/admin/components/AdminAnnouncementBroadcast";

const DEMO_USERS = [
    { id: "usr_demo_01", email: "trader1@example.com", name: "Alex Rivers", created: new Date().toISOString() },
    { id: "usr_demo_02", email: "crypto_pro@example.com", name: "Sarah Vance", created: new Date().toISOString() },
    { id: "usr_demo_03", email: "vip_trader@example.com", name: "Michael Chang", created: new Date().toISOString() },
];

export default async function AdminDashboardPage() {
    let users = DEMO_USERS;
    let isConnected = false;

    try {
        const records = await getUsers();

        if (records && records.length > 0) {
            users = records.map((r: any) => ({
                id: r.id,
                email: r.email,
                name: r.name || "Unnamed User",
                created: r.created || new Date().toISOString(),
            }));
            isConnected = true;
        }
    } catch {
        // Fallback to local demo list
    }

    return (
        <div className="space-y-8">
            {!isConnected && (
                <div className="bg-blue-500/10 border border-blue-500/30 text-blue-300 p-4 rounded-xl font-mono text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Icon icon="lucide:database" className="text-lg" />
                        <span>JSONBin Mode Active. (Please check your API Key and Bin ID)</span>
                    </div>
                </div>
            )}

            {/* Announcement Broadcast Console */}
            <AdminAnnouncementBroadcast users={users} />

            {/* User Database Section */}
            <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight mb-1">User Database Central (JSONBin)</h2>
                        <p className="text-gray-400 font-mono text-sm">Select a user to mutate their core platform metadata properties natively.</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg font-mono text-sm flex items-center gap-2">
                        <Icon icon="lucide:database" />
                        {users.length} Records Found
                    </div>
                </div>

                <div className="grid gap-4">
                    {users.map((user) => (
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
                                    Joined: {new Date(user.created).toLocaleDateString()}
                                </span>
                                <Icon
                                    icon="lucide:chevron-right"
                                    className="text-gray-600 group-hover:text-red-400 transition-colors text-xl"
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
