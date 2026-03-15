"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useState, useEffect } from "react";

// Initial dataset to prevent layout shifts before the API loads
const INITIAL_WATCHLIST_DATA = [
    { id: 1, name: "Bitcoin", symbol: "BTC", price: "$71,485.37", h1: "...", h24: "...", d7: "...", mcap: "$1,410.75B", volUsd: "$64.76B", volToken: "...", supply: "...", isUp: true },
    { id: 2, name: "Ethereum", symbol: "ETH", price: "$2,125.32", h1: "...", h24: "...", d7: "...", mcap: "$255.58B", volUsd: "$4.24B", volToken: "...", supply: "...", isUp: true },
    { id: 3, name: "Tether", symbol: "USDT", price: "$1.00", h1: "...", h24: "...", d7: "...", mcap: "$102.78B", volUsd: "$50.57B", volToken: "...", supply: "...", isUp: true },
    { id: 4, name: "BNB", symbol: "BNB", price: "$659.13", h1: "...", h24: "...", d7: "...", mcap: "$98.78B", volUsd: "$2.46B", volToken: "...", supply: "...", isUp: true },
    { id: 5, name: "Solana", symbol: "SOL", price: "$90.04", h1: "...", h24: "...", d7: "...", mcap: "$40.84B", volUsd: "$3.28B", volToken: "...", supply: "...", isUp: true },
    { id: 6, name: "USDC", symbol: "USDC", price: "$1.00", h1: "...", h24: "...", d7: "...", mcap: "$32.32B", volUsd: "$3.73B", volToken: "...", supply: "...", isUp: true },
    { id: 7, name: "XRP", symbol: "XRP", price: "$1.41", h1: "...", h24: "...", d7: "...", mcap: "$77.17B", volUsd: "$2.72B", volToken: "...", supply: "...", isUp: true },
    { id: 8, name: "Dogecoin", symbol: "DOGE", price: "$0.096", h1: "...", h24: "...", d7: "...", mcap: "$13.59B", volUsd: "$470.54M", volToken: "...", supply: "...", isUp: true },
    { id: 9, name: "Toncoin", symbol: "TON", price: "$5.45", h1: "...", h24: "...", d7: "...", mcap: "$18.25B", volUsd: "$215.12M", volToken: "...", supply: "...", isUp: true },
    { id: 10, name: "Cardano", symbol: "ADA", price: "$0.269", h1: "...", h24: "...", d7: "...", mcap: "$9.09B", volUsd: "$413.86M", volToken: "...", supply: "...", isUp: true },
    { id: 11, name: "Avalanche", symbol: "AVAX", price: "$35.10", h1: "...", h24: "...", d7: "...", mcap: "$13.94B", volUsd: "$522.78M", volToken: "...", supply: "...", isUp: true },
    { id: 12, name: "Shiba Inu", symbol: "SHIB", price: "$0.00001", h1: "...", h24: "...", d7: "...", mcap: "$12.14B", volUsd: "$319.45M", volToken: "...", supply: "...", isUp: true },
    { id: 13, name: "Polkadot", symbol: "DOT", price: "$7.35", h1: "...", h24: "...", d7: "...", mcap: "$9.30B", volUsd: "$198.75M", volToken: "...", supply: "...", isUp: true },
];

const UpTrend = () => <Icon icon="lucide:arrow-up" className="inline text-[13px] mr-0.5 mt-[-2px] text-[#00c853]" />;
const DownTrend = () => <Icon icon="lucide:arrow-down" className="inline text-[13px] mr-0.5 mt-[-2px] text-[#ff5252]" />;

const SparklineUp = () => (
    <svg viewBox="0 0 100 30" className="w-[80px] h-[30px] stroke-[#00c853] fill-none stroke-[1.5] stroke-linecap-round stroke-linejoin-round">
        <polyline points="0,25 20,20 40,25 60,10 80,15 95,5" />
        <circle cx="95" cy="5" r="2.5" className="fill-[#00c853] stroke-none" />
    </svg>
);

const SparklineDown = () => (
    <svg viewBox="0 0 100 30" className="w-[80px] h-[30px] stroke-[#ff5252] fill-none stroke-[1.5] stroke-linecap-round stroke-linejoin-round">
        <polyline points="0,5 20,10 40,5 60,20 80,15 95,25" />
        <circle cx="95" cy="25" r="2.5" className="fill-[#ff5252] stroke-none" />
    </svg>
);

const getStatusColor = (val: string) => val.startsWith("-") ? "text-[#ff5252]" : (val === "..." ? "text-gray-500" : "text-[#00c853]");
const getStatusIcon = (val: string) => val.startsWith("-") ? <DownTrend /> : (val === "..." ? null : <UpTrend />);

const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
};

export default function WatchlistPage() {
    const [watchlistData, setWatchlistData] = useState(INITIAL_WATCHLIST_DATA);

    useEffect(() => {
        const fetchLivePrices = async () => {
            try {
                const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1&sparkline=false');
                const data = await res.json();
                
                if (data && data.length > 0) {
                    const cryptoMap: Record<string, any> = {};
                    data.forEach((coin: any) => {
                        const price = coin.current_price;
                        const change24h = coin.price_change_percentage_24h || 0;
                        cryptoMap[coin.symbol.toUpperCase()] = {
                            price: price < 0.01 ? `$${price.toFixed(5)}` : `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                            h24: `${change24h > 0 ? '+' : ''}${change24h.toFixed(2)}%`,
                            mcap: formatNumber(coin.market_cap || 0),
                            volUsd: formatNumber(coin.total_volume || 0),
                            supply: `${(coin.circulating_supply || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })} ${coin.symbol.toUpperCase()}`,
                            volToken: "...",
                            isUp: change24h >= 0,
                        };
                    });

                    setWatchlistData(prev => prev.map(item => {
                        if (cryptoMap[item.symbol]) {
                            return { ...item, ...cryptoMap[item.symbol] };
                        }
                        return item;
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch live watchlist data:", error);
            }
        };

        fetchLivePrices();
        const intervalId = setInterval(fetchLivePrices, 30000); // 30s update interval
        return () => clearInterval(intervalId);
    }, []);
    return (
        <div className="w-full h-full min-h-screen bg-[#111315] text-white font-sans overflow-x-auto pb-24 lg:pb-0">
            {/* Table Container wrapping matching exactly the theme layout */}
            <div className="min-w-[1200px] w-full flex flex-col bg-[#111315]">

                {/* Table Header Row */}
                <div className="grid grid-cols-[60px_200px_1fr_1fr_1fr_1fr_1.5fr_1.5fr_1.5fr_120px] gap-4 px-6 py-4 border-b border-white/5 text-[13px] font-medium text-gray-400 items-center">
                    <div className="flex items-center gap-2">
                        <span>#</span>
                        <Icon icon="lucide:arrow-up-down" className="text-[12px] opacity-50" />
                    </div>
                    <div>Name</div>
                    <div className="text-right">Price</div>
                    <div className="text-right">1h%</div>
                    <div className="text-right">24h%</div>
                    <div className="text-right">7d%</div>
                    <div className="text-right flex items-center justify-end gap-1">Market cap <Icon icon="lucide:info" className="text-[12px] text-gray-500" /></div>
                    <div className="text-right flex items-center justify-end gap-1">Volume (24h) <Icon icon="lucide:info" className="text-[12px] text-gray-500" /></div>
                    <div className="text-right flex items-center justify-end gap-1">Circulating supply <Icon icon="lucide:info" className="text-[12px] text-gray-500" /></div>
                    <div className="text-right">Last 7 days</div>
                </div>

                {/* Table Body */}
                <div className="flex flex-col">
                    {watchlistData.map((coin, idx) => (
                        <div
                            key={coin.id}
                            className="grid grid-cols-[60px_200px_1fr_1fr_1fr_1fr_1.5fr_1.5fr_1.5fr_120px] gap-4 px-6 items-center border-b border-white/5 hover:bg-white/[0.02] transition-colors py-[14px] cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <Icon icon="lucide:zap" className="text-[#1e88e5] text-[15px]" />
                                <span className="text-[14px] text-white font-bold">{coin.id}</span>
                            </div>

                            {/* Name Column */}
                            <div className="flex items-center gap-3">
                                {/* Fake Logo Placeholder */}
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${idx % 2 === 0 ? 'bg-[#1e88e5] text-white' : 'bg-[#e0e0e0] text-black'} shadow-sm`}>
                                    {coin.symbol[0]}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[14px] font-bold text-gray-200">{coin.name}</span>
                                    <span className="text-[13px] font-medium text-gray-500">{coin.symbol}</span>
                                </div>
                            </div>

                            {/* Price Column */}
                            <div className="text-[14px] font-bold text-right text-gray-100">{coin.price}</div>

                            {/* 1h% Column */}
                            <div className={`text-[14px] font-medium text-right ${getStatusColor(coin.h1)}`}>
                                {getStatusIcon(coin.h1)} {coin.h1.replace(/[+-]/, '')}
                            </div>

                            {/* 24h% Column */}
                            <div className={`text-[14px] font-medium text-right ${getStatusColor(coin.h24)}`}>
                                {getStatusIcon(coin.h24)} {coin.h24.replace(/[+-]/, '')}
                            </div>

                            {/* 7d% Column */}
                            <div className={`text-[14px] font-medium text-right ${getStatusColor(coin.d7)}`}>
                                {getStatusIcon(coin.d7)} {coin.d7.replace(/[+-]/, '')}
                            </div>

                            {/* Market Cap Column */}
                            <div className="text-[14px] font-bold text-right text-gray-200">{coin.mcap}</div>

                            {/* Volume Column (Two Rows) */}
                            <div className="flex flex-col items-end justify-center">
                                <span className="text-[14px] font-bold text-gray-200 leading-tight">{coin.volUsd}</span>
                                <span className="text-[12px] font-medium text-gray-500 leading-tight mt-0.5">{coin.volToken}</span>
                            </div>

                            {/* Circulating Supply Column */}
                            <div className="text-[14px] font-bold text-right text-gray-200 flex justify-end items-center">
                                {coin.supply}
                            </div>

                            {/* Last 7 Days Sparkline */}
                            <div className="flex justify-end">
                                {coin.isUp ? <SparklineUp /> : <SparklineDown />}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
