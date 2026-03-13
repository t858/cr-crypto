"use client";

import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
import toast from "react-hot-toast";
import Ticker from "../components/dashboard/Ticker";
import { useDashboard } from "../components/dashboard/DashboardProvider";

export default function DashboardPage() {
  const {
    verificationStep,
    activeModal,
    setActiveModal,
    balance,
    invested
  } = useDashboard();

  return (
    <div className="w-full flex flex-col pb-20 lg:pb-0 min-h-full">
      <Ticker />

      <div className="p-4 lg:p-8 max-w-[1200px] mx-auto w-full space-y-6">

        {/* Verification Banner (Hide if step is 3/fully verified) */}
        {verificationStep < 3 && (
          <div className="bg-[#1b1e22] rounded-xl border border-white/5 overflow-hidden flex flex-col md:flex-row relative">
            <div className="p-8 flex-1 flex flex-col justify-center items-start z-10 relative">
              <div className="flex items-center gap-3 mb-4">
                {/* Step 1 Check */}
                <div className="w-5 h-5 rounded-full bg-[#22c55e] flex items-center justify-center text-black shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                  <Icon icon="lucide:check" className="text-sm font-bold" />
                </div>
                <div className="w-4 border-t border-[#22c55e]/50"></div>

                {/* Step 2 Check */}
                {verificationStep >= 2 ? (
                  <div className="w-5 h-5 rounded-full bg-[#22c55e] flex items-center justify-center text-black shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                    <Icon icon="lucide:check" className="text-sm font-bold" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center text-xs text-white/70">2</div>
                )}
                <div className="w-4 border-t border-white/20"></div>

                {/* Step 3 Check (Should never hit if banner is hidden at step 3, but safe) */}
                <div className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center text-xs text-white/70">3</div>
              </div>

              <h2 className="text-2xl font-bold mb-2 text-white">
                {verificationStep === 1 ? "You're almost ready to trade" : "Finalize your profile"}
              </h2>
              <p className="text-gray-400 text-sm mb-6 max-w-md leading-relaxed">
                {verificationStep === 1
                  ? "Verifying your identity helps us prevent someone else from creating an account in your name."
                  : "Upload a profile picture or set your avatar initials to personalize your trading experience."}
              </p>

              {verificationStep === 1 ? (
                <button
                  onClick={() => setActiveModal("VERIFY_INFO")}
                  className="bg-[#22c55e] hover:bg-[#1fae53] text-black font-bold py-2.5 px-6 rounded-full text-sm transition-colors cursor-pointer"
                >
                  Verify Identity Info
                </button>
              ) : (
                <button
                  onClick={() => setActiveModal("VERIFY_PIC")}
                  className="bg-[#22c55e] hover:bg-[#1fae53] text-black font-bold py-2.5 px-6 rounded-full text-sm transition-colors cursor-pointer"
                >
                  Setup Avatar / Picture
                </button>
              )}
            </div>

            <div className="md:w-[450px] relative h-[200px] md:h-auto overflow-hidden hidden sm:block">
              <div className="absolute inset-0 bg-gradient-to-r from-[#1b1e22] via-[#1b1e22]/50 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-0 bg-[#311158] opacity-30 mix-blend-color-burn"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border-2 border-[#22c55e]/30 z-20 rounded-lg hidden md:block"></div>
              <img
                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1000&auto=format&fit=crop"
                alt="Verification Tutorial"
                className="absolute inset-0 w-full h-full object-cover object-center scale-105 filter grayscale-[20%]"
              />
              <div className="absolute top-1/2 left-[40%] md:left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center cursor-pointer group">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <Icon icon="lucide:play" className="text-black text-2xl ml-1" />
                </div>
              </div>
              <div className="absolute bottom-4 left-0 w-full z-20 text-center font-black text-[#22c55e] text-3xl tracking-tighter mix-blend-screen opacity-90 drop-shadow-md">
                LET'S TALK VERIFICATION
              </div>
            </div>
          </div>
        )}

        {/* Core Balances Section */}
        <div className="bg-[#1b1e22] rounded-xl border border-white/5 p-8 pb-12 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 relative">
            <div className="flex flex-col items-center justify-center text-center">
              <h3 className="text-[34px] font-bold tracking-tight text-white mb-2">
                ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <p className="text-gray-400 text-[15px] flex items-center gap-1 cursor-pointer hover:text-white transition-colors group">
                Available USD
                <Icon icon="lucide:arrow-up-right" className="text-gray-500 group-hover:text-white" />
              </p>
            </div>

            <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-px bg-white/10"></div>

            <div className="flex flex-col items-center justify-center text-center">
              <h3 className="text-[34px] font-bold tracking-tight text-white mb-2">
                ${invested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <p className="text-gray-400 text-[15px] flex items-center gap-1 cursor-pointer hover:text-white transition-colors group">
                Invested
                <Icon icon="lucide:arrow-up-right" className="text-gray-500 group-hover:text-white" />
              </p>
            </div>
          </div>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">

          {/* Crypto News Feed (Vertical Scroll) */}
          <div className="lg:col-span-2 bg-[#1b1e22] rounded-xl border border-white/5 p-6 h-[380px] flex flex-col">
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-4 shrink-0">
              <div>
                <h3 className="text-[17px] font-bold text-white tracking-wide flex items-center gap-2">
                  <Icon icon="lucide:newspaper" className="text-[#1e88e5] text-xl" />
                  Latest Crypto News
                </h3>
              </div>
              <Link href="/dashboard/copy-trading" className="text-sm text-[#1e88e5] hover:text-[#5cb8ff] transition-colors">
                View All
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4 pr-2">
              {[
                { title: "Bitcoin Surges Past $71k Amid Pre-Halving Miner Accumulation Data", time: "1 hour ago", src: "Market Watch" },
                { title: "Ethereum Target Raised to $7,500 by Analysts Pointing to ETFs", time: "2 hours ago", src: "Crypto Insider" },
                { title: "SEC and CFTC Sign Historic Pact on Derivatives Oversight", time: "5 hours ago", src: "DeFi Pulse" },
                { title: "Goldman Sachs Revealed as Top Holder of Spot XRP ETFs", time: "8 hours ago", src: "Global Finance" },
                { title: "Stablecoin Market Projected to Hit $2 Trillion by 2028", time: "12 hours ago", src: "Web3 Daily" },
                { title: "Bitcoin Miners Pivot to Supplying Computation for AI Agents", time: "Yesterday", src: "Crypto Bulletin" },
                { title: "Solana Reclaims $90 Support Level After Network Upgrades", time: "Yesterday", src: "TokenTimes" },
                { title: "Ripple Establishes $50 Billion Buyback Plan to Constrict Supply", time: "2 days ago", src: "Finance Forward" },
                { title: "Solo Miner Hits Jackpot: $371k Won Mining Single Bitcoin Block", time: "3 days ago", src: "Mining Today" },
                { title: "Cardano Foundation Releases New Node Update for Scalability", time: "4 days ago", src: "ADA World" },
                { title: "Avalanche Ecosystem Fund Commits $50M to Blockchain Gaming", time: "Last Week", src: "GameFi News" },
                { title: "Crypto Fear & Greed Index Recovers Slightly From 'Extreme Fear'", time: "Last Week", src: "Sentiment Tracker" }
              ].map((news, i) => (
                <div key={i} className="flex flex-col gap-1 cursor-pointer group pb-3 border-b border-white/5 last:border-0 last:pb-0">
                  <h4 className="text-[15px] font-medium text-gray-200 group-hover:text-[#1e88e5] transition-colors line-clamp-2">
                    {news.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="text-[#1e88e5]/80 font-medium">{news.src}</span>
                    <span>•</span>
                    <span>{news.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Big Movers Section */}
          <div className="lg:col-span-1 bg-[#1b1e22] rounded-xl border border-white/5 p-6 h-[380px] flex flex-col relative">
            <div className="flex justify-between items-start mb-2 shrink-0">
              <div>
                <h3 className="text-[17px] font-bold text-white tracking-wide">Big Movers</h3>
                <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                  Today's biggest gainers and losers.
                  <Icon icon="lucide:info" className="text-xs cursor-pointer hover:text-white" />
                </p>
              </div>
              <button className="text-gray-400 hover:text-white">
                <Icon icon="lucide:more-vertical" />
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center text-center px-4">
              <p className="font-semibold text-gray-400 leading-tight">
                No big movement to display at the moment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

