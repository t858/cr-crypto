"use client";

import { useDashboard } from "@/app/components/dashboard/DashboardProvider";
import { useSession } from "next-auth/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

export default function AccountPage() {
    const { metadata } = useDashboard();
    const { data: session } = useSession();

    const profile = metadata?.profile;
    const email = session?.user?.email || "";

    const infoRows = [
        { label: "Full Name", value: profile?.fullName, icon: "lucide:user" },
        { label: "Email Address", value: email, icon: "lucide:mail" },
        { label: "Phone Number", value: profile?.phone, icon: "lucide:phone" },
        { label: "Date of Birth", value: profile?.dob, icon: "lucide:calendar" },
        { label: "Country", value: profile?.country, icon: "lucide:globe" },
        { label: "City / Region", value: profile?.city, icon: "lucide:map-pin" },
        { label: "Street Address", value: profile?.address, icon: "lucide:home" },
    ];

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">My Account</h1>
                    <p className="text-gray-400">View your personal information and account details.</p>
                </div>
                <Link
                    href="/dashboard/profile"
                    className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20 text-sm"
                >
                    <Icon icon="lucide:pencil" />
                    Edit Profile
                </Link>
            </div>

            <div className="bg-[#1b1e22] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                {/* Profile Header */}
                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row gap-6 items-center md:items-start bg-black/20">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#3b82f6]/20 bg-[#111315] flex items-center justify-center shrink-0">
                        {profile?.photoUrl ? (
                            <img src={profile.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <Icon icon="lucide:user" className="text-5xl text-gray-600" />
                        )}
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h2 className="text-2xl font-bold text-white mb-1">
                            {profile?.fullName || session?.user?.name || "Trader"}
                        </h2>
                        <p className="text-gray-400 text-sm flex items-center gap-2 justify-center md:justify-start">
                            <Icon icon="lucide:mail" className="text-gray-500" />
                            {email || "No email set"}
                        </p>
                        {profile?.country && (
                            <p className="text-gray-500 text-sm mt-1 flex items-center gap-2 justify-center md:justify-start">
                                <Icon icon="lucide:map-pin" className="text-gray-600" />
                                {profile.city ? `${profile.city}, ` : ""}{profile.country}
                            </p>
                        )}
                    </div>
                </div>

                {/* Info Rows */}
                <div className="divide-y divide-white/5">
                    {infoRows.map((row) => (
                        <div key={row.label} className="px-8 py-5 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                            <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center shrink-0">
                                <Icon icon={row.icon} className="text-[#3b82f6] text-lg" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-0.5">{row.label}</p>
                                <p className={`text-[15px] truncate ${row.value ? "text-white" : "text-gray-600 italic"}`}>
                                    {row.value || "Not provided"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-black/20 flex items-center justify-between">
                    <p className="text-xs text-gray-600">
                        Account ID: <span className="text-gray-500 font-mono">{(session?.user as any)?.id?.slice(0, 12) || "—"}...</span>
                    </p>
                    <Link
                        href="/dashboard/profile"
                        className="text-sm text-[#3b82f6] hover:text-[#60a5fa] transition-colors flex items-center gap-1"
                    >
                        <Icon icon="lucide:pencil" className="text-xs" />
                        Edit Information
                    </Link>
                </div>
            </div>
        </div>
    );
}
