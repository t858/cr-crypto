"use client";

import { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import toast from "react-hot-toast";

type Message = {
    id: string;
    sender: string;
    avatar: string;
    content: string;
    time: string;
    isMe: boolean;
    tradeInfo?: { coin: string; action: string; amount: string; return: string; btnLabel: string };
};

export default function CopyTradingPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            sender: "CryptoWhale",
            avatar: "https://i.pravatar.cc/150?u=cryptowhale",
            content: "I'm seeing a strong support forming for SOL around $140. I just opened a long position.",
            time: "10:30 AM",
            isMe: false,
            tradeInfo: { coin: "SOL", action: "LONG", amount: "$5,000", return: "+12.4%", btnLabel: "Copy Trade" }
        },
        {
            id: "2",
            sender: "Satoshi_Fan",
            avatar: "https://i.pravatar.cc/150?u=satoshi",
            content: "Agree! The momentum looks great right now. We might see a breakout soon.",
            time: "10:35 AM",
            isMe: false,
        }
    ]);

    const [newMessage, setNewMessage] = useState("");

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const msg: Message = {
            id: Date.now().toString(),
            sender: "You",
            avatar: "https://i.pravatar.cc/150?u=you",
            content: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true
        };

        setMessages([...messages, msg]);
        setNewMessage("");
    };

    const handleCopyTrade = (sender: string, trade: any) => {
        toast.success(`Copied ${trade.action} on ${trade.coin} from ${sender}!`);
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)] lg:h-[calc(100vh-64px)] pb-16 lg:pb-0">

            {/* Header Info */}
            <div className="flex items-center justify-between mb-6 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold">Copy Trading VIP</h1>
                    <p className="text-gray-400 text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        842 traders online
                    </p>
                </div>
                <div className="hidden sm:flex items-center gap-3">
                    <div className="flex -space-x-2">
                        <img src="https://i.pravatar.cc/150?u=1" className="w-8 h-8 rounded-full border-2 border-[#07011d]" alt="user" />
                        <img src="https://i.pravatar.cc/150?u=2" className="w-8 h-8 rounded-full border-2 border-[#07011d]" alt="user" />
                        <img src="https://i.pravatar.cc/150?u=3" className="w-8 h-8 rounded-full border-2 border-[#07011d]" alt="user" />
                        <div className="w-8 h-8 rounded-full border-2 border-[#07011d] bg-white/10 flex items-center justify-center text-xs">+</div>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-[#11062b] border border-white/5 rounded-3xl overflow-hidden flex flex-col relative">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-20"></div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 z-10">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-4 max-w-[85%] ${msg.isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                            <img src={msg.avatar} alt={msg.sender} className="w-10 h-10 rounded-full shrink-0 object-cover border border-white/10" />

                            <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-semibold text-white/90">{msg.sender}</span>
                                    <span className="text-xs text-white/40">{msg.time}</span>
                                    {msg.sender === "CryptoWhale" && (
                                        <span className="bg-[#d97706] text-white text-[10px] px-1.5 py-0.5 rounded font-bold">EXPERT</span>
                                    )}
                                </div>

                                <div className={`p-4 rounded-2xl text-sm leading-relaxed block ${msg.isMe ? 'bg-primary text-black rounded-tr-sm' : 'bg-white/5 border border-white/10 rounded-tl-sm text-white/90'}`}>
                                    {msg.content}
                                </div>

                                {msg.tradeInfo && (
                                    <div className="mt-2 bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/20 rounded-xl p-3 w-64 shadow-lg backdrop-blur-sm">
                                        <p className="text-xs text-white/60 mb-2 uppercase font-semibold">Active Trade</p>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <Icon icon={`cryptocurrency-color:${msg.tradeInfo.coin.toLowerCase()}`} className="text-xl" />
                                                <span className="font-bold">{msg.tradeInfo.coin}</span>
                                            </div>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${msg.tradeInfo.action === 'LONG' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {msg.tradeInfo.action}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm mb-3">
                                            <span className="text-white/60">Margin: <span className="text-white font-medium">{msg.tradeInfo.amount}</span></span>
                                            <span className="text-green-400 font-bold">{msg.tradeInfo.return}</span>
                                        </div>
                                        <button
                                            onClick={() => handleCopyTrade(msg.sender, msg.tradeInfo)}
                                            className="w-full bg-green-500 hover:bg-green-400 text-black text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                                        >
                                            <Icon icon="lucide:copy" className="text-sm" />
                                            Copy Trade
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-[#11062b]/80 backdrop-blur-md border-t border-white/5 z-10 shrink-0">
                    <form onSubmit={handleSendMessage} className="flex gap-3">
                        <button type="button" className="shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                            <Icon icon="lucide:plus" className="text-xl" />
                        </button>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Message in Copy Trading VIP..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 text-sm focus:outline-none focus:border-[#a78bfa] transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-primary hover:bg-primary/90 text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Icon icon="lucide:send" className="text-xl" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
