"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useDashboard } from "../../components/dashboard/DashboardProvider";

export default function WalletPage() {
    const { setActiveModal, metadata } = useDashboard();
    return (
        <div className="w-full flex flex-col pb-20 lg:pb-0 min-h-full bg-[#111315] text-white">
            <div className="p-4 lg:p-8 max-w-[1200px] mx-auto w-full flex flex-col gap-6">

                {/* Top Row */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                    {/* Top Left: Total Balance (Total Deposited) */}
                    <div className="xl:col-span-4 bg-[#1b1e22] rounded-3xl border border-white/5 p-6 lg:p-8 flex flex-col h-full shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-[17px] font-bold text-gray-200">Total Balance</h3>
                            <button onClick={() => setActiveModal("TRANSACTION_HISTORY")} className="bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold px-4 py-2 rounded-full transition-colors truncate">
                                See History
                            </button>
                        </div>
                        <div className="flex-1 flex flex-col justify-center py-4">
                            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 lg:flex-col lg:items-start 2xl:flex-row 2xl:items-baseline">
                                <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">{metadata.walletTotal}</h1>
                                <span className="inline-flex items-center text-[#22c55e] font-bold text-sm bg-transparent px-0 py-0.5 rounded truncate w-max">
                                    0%
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm mt-4 font-semibold">This Month (June)</p>
                        </div>
                    </div>

                    {/* Top Right: Market Overview */}
                    <div className="xl:col-span-8 bg-[#1b1e22] rounded-3xl border border-white/5 p-6 lg:p-8 flex flex-col h-full shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-[17px] font-bold text-gray-200">Market Overview</h3>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                            {[
                                { name: 'Bitcoin', symbol: 'BTC', price: metadata.walletBalances.btc, change: '+1.49%', isUp: true },
                                { name: 'Ethereum', symbol: 'ETH', price: metadata.walletBalances.eth, change: '+0.46%', isUp: true },
                                { name: 'Solana', symbol: 'SOL', price: metadata.walletBalances.sol, change: '+5.21%', isUp: true },
                                { name: 'Cardano', symbol: 'ADA', price: metadata.walletBalances.ada, change: '-1.12%', isUp: false },
                            ].map((coin, i) => (
                                <div key={i} className="bg-[#111315] border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-white/10 transition-colors">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                            <Icon icon={`cryptocurrency-color:${coin.name.toLowerCase()}`} className="text-xl" />
                                        </div>
                                        <span className={`text-xs font-bold ${coin.isUp ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                                            {coin.change}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="text-gray-400 text-xs font-bold mb-1">{coin.name} <span className="text-gray-600 ml-1">{coin.symbol}</span></h4>
                                        <p className="text-white font-extrabold text-[15px] xl:text-lg tracking-wide">{coin.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pb-6">

                    {/* Bottom Left: Bar Chart (Progress for each time a trade was open) */}
                    <div className="xl:col-span-5 bg-[#1b1e22] rounded-3xl border border-white/5 p-6 lg:p-8 flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.2)] h-[500px]">
                        <div className="flex flex-col sm:flex-row sm:justify-between items-start mb-6 gap-4">
                            <div>
                                <h3 className="text-[17px] font-bold text-gray-200 mb-4">Trading Profit Report</h3>
                                <div className="flex items-center gap-4">
                                    <h1 className="text-4xl font-extrabold text-white tracking-tight">{metadata.walletTotal}</h1>
                                    <span className="flex items-center text-[#22c55e] font-bold text-sm bg-transparent px-0 py-0.5 rounded">
                                        0%
                                    </span>
                                </div>
                                <p className="text-gray-400 text-xs font-semibold mt-3">Last update <span className="text-gray-200">Today</span></p>
                            </div>
                        </div>

                        {/* Custom Legend */}
                        <div className="flex justify-end gap-6 mb-8 pr-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                <div className="w-5 h-5 rounded overflow-hidden relative border border-transparent">
                                    <div className="absolute inset-0 bg-[#5eead4]" style={{ background: 'repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(255,255,255,0.4) 3px, rgba(255,255,255,0.4) 6px), #5eead4' }}></div>
                                </div>
                                Revenue
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                <div className="w-5 h-5 rounded bg-white/5 border border-white/10"></div>
                                Expenses
                            </div>
                        </div>

                        {/* Chart Area */}
                        <div className="flex-1 flex items-end justify-between px-2 gap-2 mt-auto pb-2">
                            {metadata.walletChart.map((day, i) => (
                                <div key={i} className="flex flex-col items-center gap-4 flex-1 h-full justify-end">
                                    {/* Bar bg */}
                                    <div className="w-full max-w-[40px] h-[80%] bg-white/5 rounded-lg relative flex flex-col justify-end p-[1px] transition-all overflow-hidden group">
                                        {/* Filled bar */}
                                        <div
                                            className="w-full rounded-b-lg rounded-t-sm transition-all duration-700 ease-in-out group-hover:opacity-80"
                                            style={{
                                                height: `${day.val}%`,
                                                background: 'repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(255,255,255,0.5) 5px, rgba(255,255,255,0.5) 10px), #5eead4'
                                            }}
                                        ></div>
                                    </div>
                                    <span className="text-xs font-bold text-gray-500 uppercase">{day.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Right: List of Cryptos (Crypto Prices) */}
                    <div className="xl:col-span-7 bg-[#1b1e22] rounded-3xl border border-white/5 p-6 lg:p-8 flex flex-col h-[500px] shadow-[0_4px_24px_rgba(0,0,0,0.2)] relative">

                        {/* List Headers */}
                        <div className="grid grid-cols-12 gap-4 text-xs font-bold text-gray-500 mb-6 px-2 mt-4 shrink-0 uppercase tracking-wider border-b border-white/5 pb-4">
                            <div className="col-span-6 flex items-center gap-1 cursor-pointer hover:text-white">Asset name <Icon icon="lucide:chevrons-up-down" className="text-[10px]" /></div>
                            <div className="col-span-4 flex items-center gap-1 cursor-pointer hover:text-white">Price <Icon icon="lucide:chevrons-up-down" className="text-[10px]" /></div>
                            <div className="col-span-2 flex items-center justify-end gap-1 cursor-pointer hover:text-white">Chart <Icon icon="lucide:filter" className="text-[10px]" /></div>
                        </div>

                        {/* List Items */}
                        <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar flex-1 -mx-2 px-2 pb-2">
                            {[
                                { icon: 'bitcoin', name: 'Bitcoin (BTC)', date: 'Mar 13, 2026', price: metadata.walletBalances.btc, isUp: true },
                                { icon: 'ethereum', name: 'Ethereum (ETH)', date: 'Mar 13, 2026', price: metadata.walletBalances.eth, isUp: true },
                                { icon: 'solana', name: 'Solana (SOL)', date: 'Mar 13, 2026', price: metadata.walletBalances.sol, isUp: true },
                                { icon: 'cardano', name: 'Cardano (ADA)', date: 'Mar 13, 2026', price: metadata.walletBalances.ada, isUp: false },
                                { icon: 'ripple', name: 'Ripple (XRP)', date: 'Mar 13, 2026', price: metadata.walletBalances.xrp, isUp: false },
                                { icon: 'avalanche', name: 'Avalanche (AVAX)', date: 'Mar 13, 2026', price: metadata.walletBalances.avax, isUp: true }
                            ].map((item, i) => (
                                <div key={i} className="grid grid-cols-12 gap-4 items-center bg-white/5 hover:bg-white/10 p-3 rounded-2xl transition-all cursor-pointer shrink-0 border border-transparent hover:border-white/10">
                                    <div className="col-span-6 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-[#111315] flex items-center justify-center shrink-0 border border-white/5 shadow-inner">
                                            <Icon icon={`cryptocurrency-color:${item.icon}`} className="text-xl" />
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className="text-[14px] font-bold text-white leading-tight mb-1 truncate">{item.name}</h4>
                                            <span className="text-[11px] text-gray-500 font-bold">{item.date}</span>
                                        </div>
                                    </div>
                                    <div className="col-span-4">
                                        <span className="text-[14px] font-bold text-gray-200 tracking-wide">{item.price}</span>
                                    </div>
                                    <div className="col-span-2 flex justify-end">
                                        {/* Sparkline simulation */}
                                        <svg width="40" height="20" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            {item.isUp ? (
                                                <path d="M2 18C2 18 6.5 10 10 12C13.5 14 18.5 6 22 8C25.5 10 30.5 2 38 2" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            ) : (
                                                <path d="M2 2C2 2 6.5 10 10 8C13.5 6 18.5 14 22 12C25.5 10 30.5 18 38 18" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            )}
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
