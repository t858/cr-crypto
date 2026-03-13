"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react/dist/iconify.js";

// The shape of our user's dynamic wallet data
export interface UserMetadata {
    walletTotal: string;
    walletChart: { label: string; val: number }[];
    walletBalances: {
        btc: string;
        eth: string;
        sol: string;
        ada: string;
        xrp: string;
        avax: string;
    };
}

// Default state if the user has no metadata yet
const DEFAULT_METADATA: UserMetadata = {
    walletTotal: "$124,563.00",
    walletChart: [
        { label: '01', val: 40 },
        { label: '02', val: 70 },
        { label: '03', val: 35 },
        { label: '04', val: 65 },
        { label: '05', val: 50 },
        { label: '06', val: 85 },
        { label: '07', val: 60 },
    ],
    walletBalances: {
        btc: "$71,485.37",
        eth: "$2,125.32",
        sol: "$90.04",
        ada: "$0.2699",
        xrp: "$1.41",
        avax: "$35.10",
    }
};

export default function AdminUserEditor({ userId }: { userId: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [metadata, setMetadata] = useState<UserMetadata>(DEFAULT_METADATA);
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase
                .from('users')
                .select('email, metadata')
                .eq('id', userId)
                .single();

            if (error) {
                toast.error("Failed to load user");
            } else if (data) {
                setUserEmail(data.email);
                // Deep merge fetched metadata with defaults to ensure schema safety
                setMetadata({
                    ...DEFAULT_METADATA,
                    ...(data.metadata || {})
                });
            }
            setLoading(false);
        };

        fetchUser();
    }, [userId]);

    const handleChartDrag = (index: number, e: React.MouseEvent<HTMLDivElement>) => {
        // If we're holding down the mouse
        if (e.buttons !== 1) return;

        const container = e.currentTarget;
        const rect = container.getBoundingClientRect();
        const y = e.clientY - rect.top;

        // Calculate percentage (0 is top/100%, rect.height is bottom/0%)
        let percent = 100 - ((y / rect.height) * 100);
        percent = Math.max(0, Math.min(100, Math.round(percent)));

        const newChart = [...metadata.walletChart];
        newChart[index].val = percent;
        setMetadata({ ...metadata, walletChart: newChart });
    };

    const handleChartClick = (index: number, e: React.MouseEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        const rect = container.getBoundingClientRect();
        const y = e.clientY - rect.top;

        let percent = 100 - ((y / rect.height) * 100);
        percent = Math.max(0, Math.min(100, Math.round(percent)));

        const newChart = [...metadata.walletChart];
        newChart[index].val = percent;
        setMetadata({ ...metadata, walletChart: newChart });
    };

    const saveToSupabase = async () => {
        setSaving(true);
        const { error } = await supabase
            .from('users')
            .update({ metadata })
            .eq('id', userId);

        if (error) {
            toast.error("Failed to save DB changes");
            console.error(error);
        } else {
            toast.success("User Dashboard Live Updated");
        }
        setSaving(false);
    };

    if (loading) return <div className="text-white font-mono p-10 animate-pulse">Loading Override Protocol...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-300">

            {/* Header Actions */}
            <div className="flex justify-between items-end pb-6 border-b border-red-500/20">
                <div>
                    <button onClick={() => router.push('/admin')} className="text-red-500 font-mono text-sm mb-4 hover:underline flex items-center gap-2">
                        <Icon icon="lucide:arrow-left" /> Back to Database
                    </button>
                    <h2 className="text-3xl font-black text-white tracking-tighter">Editing User UI</h2>
                    <p className="font-mono text-gray-400 mt-1">{userEmail}</p>
                </div>
                <button
                    onClick={saveToSupabase}
                    disabled={saving}
                    className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-lg font-mono tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] disabled:opacity-50"
                >
                    {saving ? "SYNCING..." : "PUSH DB UPDATE"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Visual Chart Builder */}
                <div className="bg-[#11062b] border border-red-500/20 p-8 rounded-2xl shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-2 font-mono flex items-center gap-2">
                        <Icon icon="lucide:bar-chart-2" className="text-red-500" />
                        Interactive Chart Editor
                    </h3>
                    <p className="text-gray-400 text-sm mb-8">Click or drag along the dashed columns to manually reshape this user's Wallet Trading Profit line graph.</p>

                    <div className="flex justify-between items-end h-[240px] px-4 gap-4">
                        {metadata.walletChart.map((day, i) => (
                            <div key={i} className="flex flex-col items-center gap-4 flex-1 h-full justify-end">
                                {/* INTERACTIVE COLUMN */}
                                <div
                                    className="w-full max-w-[40px] h-[80%] border-x border-dashed border-red-500/20 bg-white/5 relative flex flex-col justify-end p-[1px] cursor-ns-resize group rounded overflow-hidden"
                                    onMouseMove={(e) => handleChartDrag(i, e)}
                                    onClick={(e) => handleChartClick(i, e)}
                                >
                                    <div
                                        className="w-full bg-red-500/80 transition-none pointer-events-none rounded-t"
                                        style={{ height: `${day.val}%` }}
                                    >
                                        <div className="absolute top-1 w-full text-center text-[10px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap -ml-0.5">
                                            {day.val}%
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-gray-500 uppercase">{day.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Global Balances Editor */}
                <div className="bg-[#11062b] border border-red-500/20 p-8 rounded-2xl shadow-xl space-y-6">
                    <h3 className="text-lg font-bold text-white mb-2 font-mono flex items-center gap-2">
                        <Icon icon="lucide:wallet" className="text-red-500" />
                        Wallet Text Overrides
                    </h3>

                    <div>
                        <label className="text-xs font-mono text-gray-400 uppercase tracking-widest block mb-1">Total Balance Card</label>
                        <input
                            type="text"
                            value={metadata.walletTotal}
                            onChange={(e) => setMetadata({ ...metadata, walletTotal: e.target.value })}
                            className="w-full bg-[#07011d] text-3xl font-bold text-white p-3 rounded-lg border border-red-500/20 focus:border-red-500 outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-red-500/10">
                        {Object.entries(metadata.walletBalances).map(([coin, value]) => (
                            <div key={coin}>
                                <label className="text-xs font-mono text-gray-500 uppercase tracking-widest block mb-1">
                                    {coin} Price
                                </label>
                                <input
                                    type="text"
                                    value={value}
                                    onChange={(e) => setMetadata({
                                        ...metadata,
                                        walletBalances: {
                                            ...metadata.walletBalances,
                                            [coin]: e.target.value
                                        }
                                    })}
                                    className="w-full bg-[#07011d] text-white p-2 rounded-lg border border-white/5 focus:border-red-500 outline-none font-mono text-sm"
                                />
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
