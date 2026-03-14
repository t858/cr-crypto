"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { useDashboard } from "../../components/dashboard/DashboardProvider";

export default function PortfolioPage() {
    const { setActiveModal } = useDashboard();

    return (
        <div className="w-full flex pb-20 lg:pb-0 min-h-screen bg-[#111315]">
            <div className="w-full flex flex-col bg-[#111315] text-[#e0e0e0] font-sans min-h-full">

                {/* Header Title */}
                <div className="px-5 py-6 border-b border-white/10 shrink-0 bg-[#1b1e22]">
                    <h1 className="text-[28px] font-bold text-white tracking-tight">Portfolio</h1>
                </div>

                {/* Portfolio Summary Header */}
                <div className="p-5 flex flex-col gap-6 border-b border-white/10 shrink-0 bg-[#1b1e22]">

                    {/* Top Row: Value USD & 24h gain */}
                    <div className="flex justify-between items-end relative">
                        <div className="flex flex-col">
                            <span className="text-[34px] font-medium text-white leading-none tracking-tight">0.00</span>
                            <span className="text-[14px] text-gray-400 mt-1 uppercase font-medium tracking-wide">value USD</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[26px] font-medium text-gray-500 leading-none">0.00%</span>
                            <span className="text-[13px] text-gray-400 mt-1 font-medium tracking-wide">24h gain</span>
                        </div>
                    </div>

                    {/* Bottom Row: Cost USD & Total gain */}
                    <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                            <span className="text-[26px] font-medium text-white leading-none tracking-tight">0.00</span>
                            <span className="text-[14px] text-gray-400 mt-1 uppercase font-medium tracking-wide">cost USD</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[24px] font-medium text-gray-500 leading-none">0.00%</span>
                            <span className="text-[13px] text-gray-400 mt-1 font-medium tracking-wide">total gain</span>
                        </div>
                    </div>
                </div>

                {/* Empty State Container */}
                <div className="flex flex-col flex-1 bg-[#111315] items-center justify-center p-8 text-center h-full">
                    <div className="w-24 h-24 bg-[#1b1e22] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,255,255,0.02)] border border-white/5">
                        <Icon icon="lucide:pie-chart" className="text-5xl text-gray-500" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-3">Your Portfolio is Empty</h2>
                    <p className="text-gray-400 max-w-sm mb-8 leading-relaxed">
                        You haven't purchased any crypto assets or deposited funds yet. Fund your wallet to start building your portfolio.
                    </p>

                    <button 
                        onClick={() => setActiveModal("DEPOSIT")}
                        className="bg-[#1e88e5] hover:bg-[#1a73e8] text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(30,136,229,0.3)] hover:shadow-[0_0_30px_rgba(30,136,229,0.5)] transform hover:-translate-y-1"
                    >
                        Deposit Funds
                    </button>
                    
                    <Link href="/dashboard/copy-trading" className="mt-6 text-[#1e88e5] hover:text-[#5cb8ff] font-medium text-sm transition-colors">
                        Explore Copy Trading
                    </Link>

                    {/* Bottom Padding for mobile navigation overlapping */}
                    <div className="h-20 sm:hidden"></div>
                </div>

            </div>
        </div>
    );
}
