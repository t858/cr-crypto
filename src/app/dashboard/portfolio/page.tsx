"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { useDashboard } from "../../components/dashboard/DashboardProvider";

export default function PortfolioPage() {
    const { setActiveModal, metadata, dashboardConfig } = useDashboard();

    const isZeroBalance = metadata.balance === 0 || (typeof metadata.balance === "number" && metadata.balance <= 0);

    const walletTotal = isZeroBalance ? "$0.00" : (metadata.walletTotal || (typeof metadata.balance === "number" ? `$${metadata.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : dashboardConfig?.walletTotal || "$0.00"));
    const walletChange = isZeroBalance ? "+0.00%" : (metadata.walletChange || (typeof dashboardConfig?.walletChange === "string" ? dashboardConfig.walletChange : "+0.00%"));
    const invested = isZeroBalance ? "$0.00" : (typeof metadata.invested === "number" 
        ? `$${metadata.invested.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : (typeof dashboardConfig?.invested === "number" ? `$${dashboardConfig.invested.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"));
    const tradingProfitChange = isZeroBalance ? "+0.00%" : (metadata.tradingProfitChange || (typeof dashboardConfig?.tradingProfitChange === "string" ? dashboardConfig.tradingProfitChange : "+0.00%"));
    const walletBalances = isZeroBalance ? { btc: "$0.00", eth: "$0.00", sol: "$0.00", ada: "$0.00", xrp: "$0.00", avax: "$0.00" } : (metadata.walletBalances || dashboardConfig.walletBalances);

    const hasBalance = !isZeroBalance && ((typeof metadata.balance === "number" && metadata.balance > 0) || (walletTotal !== "$0.00" && walletTotal !== "0.00" && walletTotal !== "$0"));

    const isNegativeChange = walletChange.startsWith("-");
    const isNegativeProfit = tradingProfitChange.startsWith("-");

    const cryptoAssets = [
        { name: "Bitcoin", symbol: "BTC", icon: "bitcoin", value: walletBalances?.btc || "$0.00" },
        { name: "Ethereum", symbol: "ETH", icon: "ethereum", value: walletBalances?.eth || "$0.00" },
        { name: "Solana", symbol: "SOL", icon: "solana", value: walletBalances?.sol || "$0.00" },
        { name: "Cardano", symbol: "ADA", icon: "cardano", value: walletBalances?.ada || "$0.00" },
        { name: "Ripple", symbol: "XRP", icon: "ripple", value: walletBalances?.xrp || "$0.00" },
        { name: "Avalanche", symbol: "AVAX", icon: "avalanche", value: walletBalances?.avax || "$0.00" },
    ];

    return (
        <div className="w-full flex pb-20 lg:pb-0 min-h-screen bg-[#111315]">
            <div className="w-full flex flex-col bg-[#111315] text-[#e0e0e0] font-sans min-h-full">

                {/* Header Title */}
                <div className="px-5 py-6 border-b border-white/10 shrink-0 bg-[#1b1e22] flex justify-between items-center">
                    <h1 className="text-[28px] font-bold text-white tracking-tight">Portfolio</h1>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setActiveModal("DEPOSIT")}
                            className="bg-[#FF4520] hover:bg-[#e03a17] text-white font-bold py-2 px-5 rounded-full text-xs transition-all shadow-[0_0_15px_rgba(30,136,229,0.3)]"
                        >
                            Deposit
                        </button>
                        <button 
                            onClick={() => setActiveModal("WITHDRAW")}
                            className="bg-transparent border border-white/20 hover:bg-white/10 text-white font-bold py-2 px-5 rounded-full text-xs transition-all"
                        >
                            Withdraw
                        </button>
                    </div>
                </div>

                {/* Portfolio Summary Header */}
                <div className="p-5 flex flex-col gap-6 border-b border-white/10 shrink-0 bg-[#1b1e22]">

                    {/* Top Row: Value USD & 24h gain */}
                    <div className="flex justify-between items-end relative">
                        <div className="flex flex-col">
                            <span className="text-[34px] font-bold text-white leading-none tracking-tight font-mono">{walletTotal}</span>
                            <span className="text-[13px] text-gray-400 mt-1 uppercase font-medium tracking-wide">value USD</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className={`text-[24px] font-bold leading-none font-mono ${isNegativeChange ? 'text-red-400' : 'text-emerald-400'}`}>
                                {walletChange}
                            </span>
                            <span className="text-[13px] text-gray-400 mt-1 font-medium tracking-wide">24h gain</span>
                        </div>
                    </div>

                    {/* Bottom Row: Cost USD & Total gain */}
                    <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                            <span className="text-[26px] font-medium text-white leading-none tracking-tight font-mono">{invested}</span>
                            <span className="text-[13px] text-gray-400 mt-1 uppercase font-medium tracking-wide">cost USD</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className={`text-[22px] font-medium leading-none font-mono ${isNegativeProfit ? 'text-red-400' : 'text-emerald-400'}`}>
                                {tradingProfitChange}
                            </span>
                            <span className="text-[13px] text-gray-400 mt-1 font-medium tracking-wide">total gain</span>
                        </div>
                    </div>
                </div>

                {/* Dynamic Content Section */}
                {hasBalance ? (
                    <div className="p-6 flex-1 flex flex-col gap-6 bg-[#111315]">
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                                <Icon icon="lucide:layers" className="text-[#FF4520]" />
                                Crypto Asset Holdings
                            </h3>
                            <span className="text-xs text-gray-500 font-mono">Live Valuation</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {cryptoAssets.map((asset) => (
                                <div
                                    key={asset.symbol}
                                    className="bg-[#1b1e22] hover:bg-[#21252b] p-4 rounded-xl border border-white/5 transition-all flex items-center justify-between shadow-md"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#111315] flex items-center justify-center border border-white/5">
                                            <Icon icon={`cryptocurrency-color:${asset.icon}`} className="text-2xl" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm">{asset.name}</h4>
                                            <span className="text-xs text-gray-400 font-mono">{asset.symbol}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-bold text-white font-mono block">{asset.value}</span>
                                        <span className="text-[10px] text-gray-500 uppercase">Valuation</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 p-5 bg-[#1b1e22] rounded-xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <h4 className="text-white font-bold text-sm">Expand Your Investment Portfolio</h4>
                                <p className="text-gray-400 text-xs mt-0.5">Explore copy trading options to automatically mirror experienced strategy managers.</p>
                            </div>
                            <Link
                                href="/dashboard/copy-trading"
                                className="bg-[#FF4520] hover:bg-[#e03a17] text-white font-bold py-2.5 px-6 rounded-full text-xs transition-all shrink-0"
                            >
                                Copy Trading
                            </Link>
                        </div>
                    </div>
                ) : (
                    /* Empty State Container */
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
                            className="bg-[#FF4520] hover:bg-[#e03a17] text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(30,136,229,0.3)] hover:shadow-[0_0_30px_rgba(30,136,229,0.5)] transform hover:-translate-y-1"
                        >
                            Deposit Funds
                        </button>
                        
                        <Link href="/dashboard/copy-trading" className="mt-6 text-[#FF4520] hover:text-[#5cb8ff] font-medium text-sm transition-colors">
                            Explore Copy Trading
                        </Link>

                        <div className="h-20 sm:hidden"></div>
                    </div>
                )}

            </div>
        </div>
    );
}


