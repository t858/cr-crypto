"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useRef, useState } from "react";

const TICKER_DATA = [
    { symbol: "DJ30", price: "47881.85", change: "+0.30%", isUp: true },
    { symbol: "ETH", price: "2024.1100", change: "-0.31%", isUp: false },
    { symbol: "EURUSD", price: "1.16263", change: "+0.13%", isUp: true },
    { symbol: "OIL", price: "83.19", change: "-2.53%", isUp: false },
    { symbol: "GOLD", price: "5213.65", change: "+0.36%", isUp: true },
    { symbol: "NSDQ100", price: "25000.00", change: "+0.31%", isUp: true },
    { symbol: "BTC", price: "64230.12", change: "+1.21%", isUp: true },
    { symbol: "SOL", price: "145.60", change: "-1.10%", isUp: false },
];

export default function Ticker() {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Simple auto-scroll implementation
        const element = scrollRef.current;
        if (!element) return;

        let animationId: number;
        let position = 0;

        const scroll = () => {
            position += 0.5;
            if (position >= element.scrollWidth / 2) {
                position = 0;
            }
            element.scrollLeft = position;
            animationId = requestAnimationFrame(scroll);
        };

        animationId = requestAnimationFrame(scroll);

        return () => cancelAnimationFrame(animationId);
    }, []);

    return (
        <div className="w-full bg-[#1b1e22] border-b border-white/5 h-16 shrink-0 flex items-center overflow-hidden">
            {/* Container for seamless scroll effect by doubling the content */}
            <div
                ref={scrollRef}
                className="flex items-center h-full w-full overflow-hidden whitespace-nowrap"
                style={{ width: '100%' }}
            >
                <div className="flex items-center h-full min-w-max">
                    {[...TICKER_DATA, ...TICKER_DATA].map((item, i) => (
                        <div key={i} className="flex items-center gap-6 px-6 border-r border-white/5 h-full">
                            <div className="flex flex-col justify-center">
                                <span className="text-gray-400 text-xs font-bold">{item.symbol}</span>
                                <div className="flex items-end gap-2">
                                    <span className="text-white font-semibold text-[15px]">{item.price}</span>
                                    <span className={`text-[11px] font-bold mb-0.5 ${item.isUp ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                                        {item.change}
                                    </span>
                                </div>
                            </div>
                            {/* Tiny inline SVG chart sparkline */}
                            <div className="w-16 h-8 opacity-70">
                                <svg viewBox="0 0 100 30" className="w-full h-full stroke-current" fill="none">
                                    <path
                                        d={item.isUp ? "M0,25 Q10,20 20,25 T40,15 T60,10 T80,15 T100,5" : "M0,10 Q10,15 20,10 T40,20 T60,25 T80,20 T100,30"}
                                        strokeWidth="2"
                                        stroke={item.isUp ? "#22c55e" : "#ef4444"}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
