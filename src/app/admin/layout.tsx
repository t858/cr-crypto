import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    // Hard intercept: If they are not the admin, kick them out immediately
    if ((session?.user as any)?.role !== "admin") {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-[#07011d] text-white">
            {/* Admin Topbar */}
            <header className="border-b border-red-500/20 bg-[#11062b] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <h1 className="font-mono text-red-500 font-bold tracking-widest uppercase text-sm">CR System Admin Overlay</h1>
                </div>
                <div className="text-xs font-mono text-gray-500">
                    AUTHORIZED SESSION ACTIVE
                </div>
            </header>

            <main className="p-6 max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    );
}
