"use client";

import { Icon } from "@iconify/react/dist/iconify.js";

// Exact dataset matching the provided screenshot
const watchlistData = [
    { id: 1, name: "Bitcoin", symbol: "BTC", price: "$71,485.37", h1: "+0.12%", h24: "-0.63%", d7: "+1.49%", mcap: "$1,410,754,284,000", volUsd: "$64,762,993,140", volToken: "$645,582 BTC", supply: "19,795,252 BTC", isUp: true },
    { id: 2, name: "Ethereum", symbol: "ETH", price: "$2,125.32", h1: "+0.62%", h24: "-0.74%", d7: "+0.42%", mcap: "$255,580,132,000", volUsd: "$4,244,643,765", volToken: "$424,756 ETH", supply: "120,795,252 ETH", isUp: false },
    { id: 3, name: "Tether", symbol: "USDT", price: "$1.000", h1: "-0.01%", h24: "+0.01%", d7: "-0.01%", mcap: "$102,786,342,000", volUsd: "$50,579,385,000", volToken: "$50,579,354 USDT", supply: "102,795,252 USDT", isUp: true },
    { id: 4, name: "BNB", symbol: "BNB", price: "$659.13", h1: "+0.21%", h24: "-0.78%", d7: "+0.34%", mcap: "$98,784,498,000", volUsd: "$2,462,174,839", volToken: "$3,645,582 BNB", supply: "149,795,252 BNB", isUp: true },
    { id: 5, name: "Solana", symbol: "SOL", price: "$90.04", h1: "+0.92%", h24: "-0.60%", d7: "+5.40%", mcap: "$40,844,989,000", volUsd: "$3,283,471,513", volToken: "$36,645,582 SOL", supply: "443,795,252 SOL", isUp: true },
    { id: 6, name: "XRP", symbol: "XRP", price: "$1.410", h1: "-0.88%", h24: "-0.55%", d7: "-0.37%", mcap: "$77,173,887,000", volUsd: "$2,729,480,727", volToken: "$1,945,582 XRP", supply: "54,795,252 XRP", isUp: true },
    { id: 7, name: "USDC", symbol: "USDC", price: "$1.000", h1: "+0.01%", h24: "-0.01%", d7: "+0.00%", mcap: "$32,329,553,000", volUsd: "$3,739,315,031", volToken: "$3,739,582 USDC", supply: "32,795,252 USDC", isUp: true },
    { id: 8, name: "Cardano", symbol: "ADA", price: "$0.2699", h1: "-0.29%", h24: "-0.61%", d7: "-1.12%", mcap: "$9,097,631,000", volUsd: "$413,867,060", volToken: "$1,645,582 ADA", supply: "35,795,252 ADA", isUp: false },
    { id: 9, name: "Avalanche", symbol: "AVAX", price: "$35.10", h1: "+0.25%", h24: "-0.99%", d7: "+0.44%", mcap: "$13,947,644,000", volUsd: "$522,788,698", volToken: "$14,645,582 AVAX", supply: "377,795,252 AVAX", isUp: false },
    { id: 10, name: "Dogecoin", symbol: "DOGE", price: "$0.0968", h1: "-0.43%", h24: "-0.80%", d7: "-0.44%", mcap: "$13,599,009,000", volUsd: "$470,549,476", volToken: "$4,645,582 DOGE", supply: "143,795,252 DOGE", isUp: false },
    { id: 11, name: "TRON", symbol: "TRX", price: "$0.2902", h1: "-0.91%", h24: "-0.80%", d7: "-0.93%", mcap: "$8,072,370,000", volUsd: "$264,783,764", volToken: "$945,582 TRX", supply: "87,795,252 TRX", isUp: false },
    { id: 12, name: "Polkadot", symbol: "DOT", price: "$7.35", h1: "+0.38%", h24: "+0.27%", d7: "+0.70%", mcap: "$9,302,087,000", volUsd: "$198,757,513", volToken: "$24,582 DOT", supply: "1,295,252 DOT", isUp: true },
    { id: 13, name: "Chainlink", symbol: "LINK", price: "$18.05", h1: "+0.61%", h24: "-0.73%", d7: "+0.11%", mcap: "$10,200,588,000", volUsd: "$329,480,727", volToken: "$18,582 LINK", supply: "587,252 LINK", isUp: true },
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

const getStatusColor = (val: string) => val.startsWith("+") ? "text-[#00c853]" : "text-[#ff5252]";
const getStatusIcon = (val: string) => val.startsWith("+") ? <UpTrend /> : <DownTrend />;

export default function WatchlistPage() {
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
