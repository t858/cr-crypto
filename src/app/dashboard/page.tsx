"use client";

import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const [balance, setBalance] = useState(21543.90);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState("");

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!isNaN(val) && val > 0) {
      setBalance(prev => prev + val);
      toast.success(`Deposited $${val.toFixed(2)} successfully!`);
      setShowDeposit(false);
      setAmount("");
    } else {
      toast.error("Enter a valid amount");
    }
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!isNaN(val) && val > 0) {
      if (val > balance) {
        toast.error("Insufficient funds!");
        return;
      }
      setBalance(prev => prev - val);
      toast.success(`Withdrew $${val.toFixed(2)} successfully!`);
      setShowWithdraw(false);
      setAmount("");
    } else {
      toast.error("Enter a valid amount");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 lg:pb-0 relative">

      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Trading Dashboard</h1>
          <p className="text-gray-400 text-sm">Welcome back, Trader!</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-white/5 rounded-full px-4 py-2 border border-white/10">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-sm font-medium">System Online</span>
        </div>
      </div>

      {/* Main Balance Card */}
      <div className="bg-gradient-to-br from-[#4c1d95] to-[#2e1065] rounded-3xl p-6 lg:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#d97706]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-white/70 font-medium mb-1 flex items-center gap-2">
              Total Balance
              <Icon icon="lucide:eye" className="text-white/40 cursor-pointer hover:text-white" />
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="text-green-400 flex items-center gap-1 bg-green-400/10 px-2 py-0.5 rounded-full">
                <Icon icon="lucide:trending-up" className="text-xs" />
                +2.45%
              </span>
              <span className="text-white/50 border-l border-white/20 pl-2">Today</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setShowDeposit(true); setAmount(""); setShowWithdraw(false); }}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              <Icon icon="lucide:arrow-down-to-line" className="text-lg" />
              Deposit
            </button>
            <button
              onClick={() => { setShowWithdraw(true); setAmount(""); setShowDeposit(false); }}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/10 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 border border-white/5 transition-colors">
              <Icon icon="lucide:arrow-up-from-line" className="text-lg" />
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions & Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: "lucide:history", label: "History", color: "text-blue-400", bg: "bg-blue-400/10" },
          { icon: "lucide:arrow-left-right", label: "Exchange", color: "text-purple-400", bg: "bg-purple-400/10" },
          { icon: "lucide:bell", label: "Alerts", color: "text-yellow-400", bg: "bg-yellow-400/10" },
          { icon: "lucide:gift", label: "Rewards", color: "text-pink-400", bg: "bg-pink-400/10" },
        ].map((action, i) => (
          <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/10 transition-colors group">
            <div className={`w-12 h-12 rounded-full ${action.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <Icon icon={action.icon} className={`text-2xl ${action.color}`} />
            </div>
            <span className="text-sm font-medium">{action.label}</span>
          </div>
        ))}
      </div>

      {/* Market Overview */}
      <div className="bg-[#11062b] border border-white/5 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Top Coins</h3>
          <Link href="#" className="text-sm text-primary hover:underline">View All</Link>
        </div>

        <div className="space-y-4">
          {[
            { name: "Bitcoin", sym: "BTC", price: "$64,230.00", change: "+1.2%", up: true, icon: "cryptocurrency-color:btc" },
            { name: "Ethereum", sym: "ETH", price: "$3,450.20", change: "+0.8%", up: true, icon: "cryptocurrency-color:eth" },
            { name: "Solana", sym: "SOL", price: "$145.60", change: "-2.1%", up: false, icon: "cryptocurrency-color:sol" },
            { name: "Ripple", sym: "XRP", price: "$0.54", change: "+0.3%", up: true, icon: "cryptocurrency-color:xrp" },
          ].map((coin, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Icon icon={coin.icon} className="text-2xl" />
                </div>
                <div>
                  <h4 className="font-semibold">{coin.name}</h4>
                  <p className="text-xs text-gray-400">{coin.sym}</p>
                </div>
              </div>

              <div className="hidden lg:block flex-1 max-w-[120px] mx-8 h-8 opacity-50">
                <svg viewBox="0 0 100 30" className="w-full h-full stroke-current" fill="none">
                  <path d={coin.up ? "M0,25 Q10,20 20,25 T40,15 T60,10 T80,15 T100,5" : "M0,10 Q10,15 20,10 T40,20 T60,25 T80,20 T100,30"} strokeWidth="2" stroke={coin.up ? "#4ade80" : "#f87171"} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="text-left sm:text-right mt-2 sm:mt-0 font-medium">
                <p className="font-semibold">{coin.price}</p>
                <p className={`text-sm ${coin.up ? 'text-green-400' : 'text-red-400'} flex items-center sm:justify-end gap-1`}>
                  {coin.change}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {(showDeposit || showWithdraw) && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#11062b] border border-white/10 rounded-3xl w-full max-w-md p-6 relative">
            <button
              onClick={() => { setShowDeposit(false); setShowWithdraw(false); }}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              <Icon icon="lucide:x" className="text-2xl" />
            </button>

            <h2 className="text-2xl font-bold mb-6">
              {showDeposit ? "Deposit Funds" : "Withdraw Funds"}
            </h2>

            <form onSubmit={showDeposit ? handleDeposit : handleWithdraw}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-white/70 mb-2">Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 font-medium">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-lg focus:outline-none focus:border-[#a78bfa] transition-colors"
                    placeholder="0.00"
                  />
                </div>
                {showWithdraw && (
                  <p className="text-xs text-white/40 mt-2 text-right">
                    Available: ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-xl font-bold text-lg transition-colors ${showDeposit ? 'bg-green-500 hover:bg-green-400 text-black' : 'bg-red-500 hover:bg-red-400 text-white'}`}
              >
                {showDeposit ? "Confirm Deposit" : "Confirm Withdraw"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
