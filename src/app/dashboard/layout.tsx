import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ReactNode } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Logo from "../components/layout/header/logo";
import { authOptions } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/signin");
    }

    return (
        <div className="flex shrink-0 min-h-screen bg-[#07011d] text-white overflow-hidden">
            {/* Sidebar for Desktop */}
            <aside className="hidden lg:flex w-64 flex-col bg-[#11062b] border-r border-white/10 shrink-0 h-screen sticky top-0">
                <div className="p-6 flex items-center gap-3">
                    <Logo />
                </div>
                <nav className="flex flex-col gap-2 px-4 mt-6">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-[#4c1d95]/30 text-[#a78bfa] rounded-lg border border-[#a78bfa]/20 transition-all">
                        <Icon icon="lucide:layout-dashboard" className="text-xl" />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link href="/dashboard/copy-trading" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                        <Icon icon="lucide:copy" className="text-xl" />
                        <span className="font-medium">Copy Trading</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                        <Icon icon="lucide:wallet" className="text-xl" />
                        <span className="font-medium">Wallet</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                        <Icon icon="lucide:history" className="text-xl" />
                        <span className="font-medium">Transactions</span>
                    </Link>
                </nav>
                <div className="mt-auto p-4 border-t border-white/10 flex flex-col gap-2">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                        <Icon icon="lucide:home" className="text-xl" />
                        <span className="font-medium">Back to Home</span>
                    </Link>
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                        <Icon icon="lucide:log-out" className="text-xl" />
                        <span className="font-medium">Sign Out</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-y-auto">
                <header className="lg:hidden flex items-center justify-between p-4 bg-[#11062b] border-b border-white/10 sticky top-0 z-10 w-full shrink-0">
                    <Logo />
                    <Link href="/" className="text-sm border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/5">
                        Exit
                    </Link>
                </header>

                <div className="flex-1 overflow-x-hidden p-4 lg:p-8">
                    {children}
                </div>

                {/* Mobile Bottom Navigation */}
                <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-[#11062b] border-t border-white/10 flex justify-around p-3 z-50">
                    <Link href="/dashboard" className="flex flex-col items-center gap-1 text-[#a78bfa]">
                        <Icon icon="lucide:layout-dashboard" className="text-xl" />
                        <span className="text-[10px] uppercase font-medium">Home</span>
                    </Link>
                    <Link href="/dashboard/copy-trading" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
                        <Icon icon="lucide:copy" className="text-xl" />
                        <span className="text-[10px] uppercase font-medium">Copy</span>
                    </Link>
                    <Link href="#" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
                        <Icon icon="lucide:wallet" className="text-xl" />
                        <span className="text-[10px] uppercase font-medium">Wallet</span>
                    </Link>
                </nav>
            </main>
        </div>
    );
}
