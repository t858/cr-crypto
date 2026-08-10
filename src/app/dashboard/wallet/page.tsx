"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useState, useEffect } from "react";
import { useDashboard } from "../../components/dashboard/DashboardProvider";

const INITIAL_MARKET_OVERVIEW = [
    { name: 'Bitcoin', symbol: 'BTC', price: "...", change: '...', isUp: true, icon: 'bitcoin' },
    { name: 'Ethereum', symbol: 'ETH', price: "...", change: '...', isUp: true, icon: 'ethereum' },
    { name: 'Solana', symbol: 'SOL', price: "...", change: '...', isUp: true, icon: 'solana' },
    { name: 'Cardano', symbol: 'ADA', price: "...", change: '...', isUp: true, icon: 'cardano' },
];

const INITIAL_CRYPTO_LIST = [
    { icon: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: "...", change: '...', marketCap: '$1.42T', isUp: true },
    { icon: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: "...", change: '...', marketCap: '$380.5B', isUp: true },
    { icon: 'solana', name: 'Solana', symbol: 'SOL', price: "...", change: '...', marketCap: '$84.2B', isUp: true },
    { icon: 'cardano', name: 'Cardano', symbol: 'ADA', price: "...", change: '...', marketCap: '$18.4B', isUp: true },
    { icon: 'ripple', name: 'Ripple', symbol: 'XRP', price: "...", change: '...', marketCap: '$42.1B', isUp: true },
    { icon: 'avalanche', name: 'Avalanche', symbol: 'AVAX', price: "...", change: '...', marketCap: '$12.8B', isUp: true }
];

export default function WalletPage() {
    const { setActiveModal, metadata, dashboardConfig } = useDashboard();
    
    const [marketOverview, setMarketOverview] = useState(INITIAL_MARKET_OVERVIEW);
    const [cryptoList, setCryptoList] = useState(INITIAL_CRYPTO_LIST);
    const [activeTab, setActiveTab] = useState<"overview" | "assets">("overview");

    const walletTotal = metadata.walletTotal || (typeof metadata.balance === "number" ? `$${metadata.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : dashboardConfig.walletTotal);
    const walletChange = metadata.walletChange || dashboardConfig.walletChange || "+15.4%";
    const tradingProfit = metadata.tradingProfit ?? dashboardConfig.tradingProfit ?? 12450;
    const tradingProfitChange = metadata.tradingProfitChange || dashboardConfig.tradingProfitChange || "+24.8%";
    
    const isNegativeChange = walletChange.startsWith("-");
    const isNegativeProfit = tradingProfitChange.startsWith("-");

    useEffect(() => {
        const fetchLivePrices = async () => {
            try {
                const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false');
                const data = await res.json();
                
                if (data && data.length > 0) {
                    const cryptoMap: Record<string, any> = {};
                    data.forEach((coin: any) => {
                        const price = coin.current_price;
                        const change24h = coin.price_change_percentage_24h || 0;
                        const cap = coin.market_cap ? `$${(coin.market_cap / 1e9).toFixed(1)}B` : 'N/A';
                        cryptoMap[coin.symbol.toUpperCase()] = {
                            price: price < 0.01 ? `$${price.toFixed(5)}` : `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                            change: `${change24h > 0 ? '+' : ''}${change24h.toFixed(2)}%`,
                            marketCap: cap,
                            isUp: change24h >= 0,
                        };
                    });

                    setMarketOverview(prev => prev.map(item => {
                        if (cryptoMap[item.symbol]) {
                            return { ...item, ...cryptoMap[item.symbol] };
                        }
                        return item;
                    }));

                    setCryptoList(prev => prev.map(item => {
                        if (cryptoMap[item.symbol]) {
                            return { ...item, ...cryptoMap[item.symbol] };
                        }
                        return item;
                    }));
                }
            } catch {
                // Silently fallback to initial list
            }
        };

        fetchLivePrices();
        const intervalId = setInterval(fetchLivePrices, 30000);
        return () => clearInterval(intervalId);
    }, []);

    const defaultChartData = [
        { label: "Mon", val: 45 },
        { label: "Tue", val: 65 },
        { label: "Wed", val: 30 },
        { label: "Thu", val: 85 },
        { label: "Fri", val: 55 },
        { label: "Sat", val: 90 },
        { label: "Sun", val: 75 },
    ];

    const chartPoints = metadata.walletChart || metadata.chartPoints || defaultChartData;

    return (
        <div className="w-full flex flex-col pb-20 lg:pb-8 min-h-screen bg-[#0d0e11] text-white">
            <div className="p-4 lg:p-8 max-w-[1300px] mx-auto w-full flex flex-col gap-6">

                {/* Top Action Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#14161b] p-5 rounded-2xl border border-white/10 shadow-xl backdrop-blur-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF4520]/0 via-[#FF4520] to-emerald-500/0"></div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-white">Wallet Terminal</h1>
                            <span className="text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full uppercase">Institutional</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">Real-time asset valuation & PnL reporting</p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => setActiveModal("DEPOSIT")}
                            className="flex-1 sm:flex-initial bg-gradient-to-r from-[#FF4520] to-[#1565c0] hover:from-[#1976d2] hover:to-[#0d47a1] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(30,136,229,0.3)] hover:shadow-[0_0_25px_rgba(30,136,229,0.5)] flex items-center justify-center gap-2"
                        >
                            <Icon icon="lucide:arrow-down-left" className="text-base" />
                            Deposit
                        </button>
                        <button
                            onClick={() => setActiveModal("WITHDRAW")}
                            className="flex-1 sm:flex-initial bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-6 py-2.5 rounded-xl border border-white/15 transition-all flex items-center justify-center gap-2"
                        >
                            <Icon icon="lucide:arrow-up-right" className="text-base text-gray-300" />
                            Withdraw
                        </button>
                        <button
                            onClick={() => setActiveModal("TRANSACTION_HISTORY")}
                            className="bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/10 transition-colors flex items-center gap-1.5"
                        >
                            <Icon icon="lucide:history" className="text-base text-gray-400" />
                            History
                        </button>
                    </div>
                </div>

                {/* Main Overview Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                    {/* Left: Total Account Net Worth */}
                    <div className="xl:col-span-4 bg-gradient-to-b from-[#181a20] via-[#14161b] to-[#101216] rounded-2xl border border-white/10 p-6 lg:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all"></div>
                        
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-400">Total Net Worth</span>
                                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Live Sync</span>
                            </div>

                            <div className="space-y-3">
                                <h2 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-mono">
                                    {walletTotal}
                                </h2>
                                
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center gap-1 text-xs font-bold font-mono px-2.5 py-1 rounded-full border ${
                                        isNegativeChange 
                                            ? "text-red-400 bg-red-500/10 border-red-500/20" 
                                            : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                                    }`}>
                                        <Icon icon={isNegativeChange ? "lucide:trending-down" : "lucide:trending-up"} className="text-sm" />
                                        {walletChange}
                                    </span>
                                    <span className="text-xs text-gray-400 font-mono">24h Change</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                            <div className="bg-[#0b0c0f] p-3 rounded-xl border border-white/5">
                                <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Status</span>
                                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    Verified
                                </span>
                            </div>
                            <div className="bg-[#0b0c0f] p-3 rounded-xl border border-white/5">
                                <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Security</span>
                                <span className="text-xs font-bold text-gray-300 flex items-center gap-1">
                                    <Icon icon="lucide:shield-check" className="text-blue-400 text-sm" />
                                    Protected
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Live Market Overview */}
                    <div className="xl:col-span-8 bg-gradient-to-b from-[#181a20] via-[#14161b] to-[#101216] rounded-2xl border border-white/10 p-6 lg:p-8 flex flex-col justify-between shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-base font-bold text-white tracking-tight">Market Highlights</h3>
                                <p className="text-xs text-gray-400">Live prices sourced directly from CoinGecko API</p>
                            </div>
                            <span className="text-[10px] font-mono text-gray-400 bg-white/5 px-2 py-1 rounded">30s Auto Refresh</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {marketOverview.map((coin, i) => (
                                <div key={i} className="bg-[#0b0c0f] border border-white/5 hover:border-white/15 rounded-xl p-4 flex flex-col justify-between transition-all group shadow-md">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="w-9 h-9 rounded-xl bg-[#14161b] flex items-center justify-center shrink-0 border border-white/5 group-hover:scale-105 transition-transform">
                                            <Icon icon={`cryptocurrency-color:${coin.icon}`} className="text-2xl" />
                                        </div>
                                        <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                                            coin.isUp ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'
                                        }`}>
                                            {coin.change}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-0.5">
                                            <h4 className="text-white text-xs font-bold truncate">{coin.name}</h4>
                                            <span className="text-[10px] font-mono text-gray-500">{coin.symbol}</span>
                                        </div>
                                        <p className="text-white font-mono font-extrabold text-base tracking-wide">{coin.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Trading Profit & Market Assets */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                    {/* Bottom Left: Trading Profit Report Visual */}
                    <div className="xl:col-span-5 bg-gradient-to-b from-[#181a20] via-[#14161b] to-[#101216] rounded-2xl border border-white/10 p-6 lg:p-8 flex flex-col shadow-2xl min-h-[460px]">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-white/5 gap-3">
                            <div>
                                <h3 className="text-base font-bold text-white tracking-tight">Trading Profit Report</h3>
                                <p className="text-xs text-gray-400">Cumulative closed position earnings</p>
                            </div>
                            <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded-full border ${
                                isNegativeProfit
                                    ? "text-red-400 bg-red-500/10 border-red-500/20"
                                    : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                            }`}>
                                {tradingProfitChange}
                            </span>
                        </div>

                        <div className="mb-6 bg-[#0b0c0f] p-4 rounded-xl border border-white/5 flex items-baseline justify-between">
                            <div>
                                <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Net Closed Profit</span>
                                <h3 className="text-3xl font-extrabold text-white font-mono tracking-tight">
                                    ${tradingProfit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </h3>
                            </div>
                            <span className="text-xs text-gray-400 font-mono">Total Growth</span>
                        </div>

                        {/* Chart Graphic Bar Component */}
                        <div className="flex-1 flex items-end justify-between px-2 gap-3 pt-4">
                            {chartPoints.map((day: any, i: number) => (
                                <div key={i} className="flex flex-col items-center gap-3 flex-1 h-full justify-end group">
                                    <div className="w-full max-w-[36px] h-[75%] bg-[#0b0c0f] rounded-lg relative flex flex-col justify-end p-1 border border-white/5 group-hover:border-blue-500/40 transition-colors overflow-hidden">
                                        <div
                                            className="w-full rounded-md transition-all duration-700 ease-in-out bg-gradient-to-t from-blue-600 via-indigo-500 to-cyan-400 group-hover:brightness-125 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                                            style={{ height: `${Math.min(100, Math.max(15, day.val))}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">{day.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Right: High-Density Crypto Asset Terminal */}
                    <div className="xl:col-span-7 bg-gradient-to-b from-[#181a20] via-[#14161b] to-[#101216] rounded-2xl border border-white/10 p-6 lg:p-8 flex flex-col min-h-[460px] shadow-2xl">
                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
                            <div>
                                <h3 className="text-base font-bold text-white tracking-tight">Crypto Asset Directory</h3>
                                <p className="text-xs text-gray-400">Live order book metrics & market valuation</p>
                            </div>
                            <div className="flex items-center gap-1 bg-[#0b0c0f] p-1 rounded-xl border border-white/5 text-xs font-mono">
                                <button
                                    onClick={() => setActiveTab("overview")}
                                    className={`px-3 py-1 rounded-lg transition-all ${
                                        activeTab === "overview" ? "bg-blue-600 text-white font-bold" : "text-gray-400 hover:text-white"
                                    }`}
                                >
                                    Overview
                                </button>
                                <button
                                    onClick={() => setActiveTab("assets")}
                                    className={`px-3 py-1 rounded-lg transition-all ${
                                        activeTab === "assets" ? "bg-blue-600 text-white font-bold" : "text-gray-400 hover:text-white"
                                    }`}
                                >
                                    Assets
                                </button>
                            </div>
                        </div>

                        {/* Directory Table Headers */}
                        <div className="grid grid-cols-12 gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-wider py-2 px-3 bg-[#0b0c0f] rounded-lg border border-white/5 mb-3">
                            <div className="col-span-5">Asset / Ticker</div>
                            <div className="col-span-4 text-right">Price (USD)</div>
                            <div className="col-span-3 text-right">24h Change</div>
                        </div>

                        {/* Directory List Items */}
                        <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar flex-1 pr-1">
                            {cryptoList.map((item, i) => (
                                <div
                                    key={i}
                                    className="grid grid-cols-12 gap-2 items-center bg-[#0b0c0f]/80 hover:bg-[#14161b] p-3 rounded-xl transition-all border border-white/5 hover:border-white/15"
                                >
                                    <div className="col-span-5 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-[#181a20] flex items-center justify-center shrink-0 border border-white/5">
                                            <Icon icon={`cryptocurrency-color:${item.icon}`} className="text-xl" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-white leading-tight">{item.name}</h4>
                                            <span className="text-[10px] text-gray-500 font-mono">{item.symbol} • Cap {item.marketCap}</span>
                                        </div>
                                    </div>
                                    <div className="col-span-4 text-right">
                                        <span className="text-xs font-bold font-mono text-gray-200">{item.price}</span>
                                    </div>
                                    <div className="col-span-3 flex justify-end">
                                        <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded-full ${
                                            item.isUp ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'
                                        }`}>
                                            {item.change}
                                        </span>
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

