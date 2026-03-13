"use client";

import { Icon } from "@iconify/react/dist/iconify.js";

// Mock Data structure mirroring the screenshot
const assets = [
    { name: "Bitcoin", symbol: "BTC", amount: "1,981", price: "71,485.37", value: "141.61M", gainRate: "+1.4K (1.49%)", totalGain: "+30.05M (6,454.85%)", isUp: true },
    { name: "Ethereum", symbol: "ETH", amount: "1,000", price: "2,125.32", value: "2.12M", gainRate: "+4.10 (0.46%)", totalGain: "+883.96K (7,892.46...)", isUp: true },
    { name: "Stellar", symbol: "XLM", amount: "30,000,000...", price: "0.136268", value: "4.09M", gainRate: "+0.263 (45.99%)", totalGain: "+25.03M (46,359.3...)", isUp: true },
    { name: "Litecoin", symbol: "LTC", amount: "3,000", price: "88.35", value: "265.05K", gainRate: "-5.81 (2.25%)", totalGain: "+745.72K (6,576.01%)", isUp: false },
    { name: "Monero", symbol: "XMR", amount: "1,000", price: "142.44", value: "142.44K", gainRate: "+18.69 (4.87%)", totalGain: "+358.44K (814.63%)", isUp: true },
    { name: "Ardor", symbol: "ARDR", amount: "1,500,000", price: "0.15", value: "225.0K", gainRate: "+0.08 (4.28%)", totalGain: "+2.86M (3,809.46%)", isUp: true },
    { name: "Syscoin", symbol: "SYS", amount: "150,000", price: "0.170946", value: "25.64K", gainRate: "-0.048 (5.81%)", totalGain: "+114.14K (7,609.46%)", isUp: false },
];

export default function PortfolioPage() {
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
                            <span className="text-[34px] font-medium text-white leading-none tracking-tight">73,429,900</span>
                            <span className="text-[14px] text-gray-400 mt-1 uppercase font-medium tracking-wide">value USD</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[26px] font-medium text-[#00c853] leading-none">+16.84%</span>
                            <span className="text-[13px] text-gray-400 mt-1 mt-1 font-medium tracking-wide">24h gain</span>
                        </div>

                        {/* Center Icon Decoration (Target/Radar thing from screenshot) */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60 pointer-events-none hidden sm:flex">
                            <Icon icon="lucide:scan-crosshair" className="text-4xl text-[#ff9800]" />
                        </div>
                    </div>

                    {/* Bottom Row: Cost USD & Total gain */}
                    <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                            <span className="text-[26px] font-medium text-white leading-none tracking-tight">713,375</span>
                            <span className="text-[14px] text-gray-400 mt-1 uppercase font-medium tracking-wide">cost USD</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[24px] font-medium text-[#00c853] leading-none">+10,193.31%</span>
                            <span className="text-[13px] text-gray-400 mt-1 mt-1 font-medium tracking-wide">total gain</span>
                        </div>
                    </div>
                </div>

                {/* Asset List Container */}
                <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar bg-[#111315]">
                    {assets.map((asset, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-4 px-5 border-b border-white/5 bg-[#1b1e22] hover:bg-white/5 transition-colors cursor-pointer"
                        >
                            {/* Left Column (Asset Name & Amount) */}
                            <div className="flex flex-col gap-1 flex-1">
                                <span className="text-[17px] text-gray-200 font-normal tracking-wide leading-tight">{asset.name}</span>
                                <span className="text-[13px] text-gray-500 font-medium tracking-wide">
                                    {asset.amount} <span className="uppercase">{asset.symbol}</span>
                                </span>
                            </div>

                            {/* Middle Column (Price & 24h Gain) */}
                            <div className="flex flex-col items-center gap-1 flex-1">
                                <span className="text-[16px] text-white font-medium tracking-wide leading-tight flex items-center gap-1">
                                    <span className="text-gray-500 text-[13px] font-normal">×</span> {asset.price}
                                </span>
                                <span className={`text-[13px] font-medium tracking-wide ${asset.isUp ? 'text-[#00c853]' : 'text-[#ff5252]'}`}>
                                    {asset.gainRate}
                                </span>
                            </div>

                            {/* Right Column (Value & Total Gain) */}
                            <div className="flex flex-col items-end gap-1 flex-1">
                                <span className="text-[16px] text-white font-medium tracking-wide leading-tight flex items-center gap-1.5 border-b border-transparent">
                                    <span className="text-gray-500 text-[12px] font-normal uppercase">USD</span> {asset.value}
                                </span>
                                <span className="text-[13px] text-[#00c853] font-medium tracking-wide">
                                    {asset.totalGain}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Bottom Padding for mobile navigation overlapping */}
                    <div className="h-20 sm:hidden"></div>
                </div>

            </div>
        </div>
    );
}
