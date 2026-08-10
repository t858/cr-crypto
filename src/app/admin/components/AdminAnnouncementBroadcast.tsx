"use client";

import { useState } from "react";
import { sendAnnouncementAction } from "@/app/admin/actions";
import { Icon } from "@iconify/react/dist/iconify.js";
import toast from "react-hot-toast";

interface UserOption {
    id: string;
    email: string;
    name: string;
}

export default function AdminAnnouncementBroadcast({ users }: { users: UserOption[] }) {
    const [targetUserId, setTargetUserId] = useState<string>("GLOBAL");
    const [title, setTitle] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [type, setType] = useState<"info" | "success" | "warning" | "alert">("info");
    const [sending, setSending] = useState<boolean>(false);
    const [isExpanded, setIsExpanded] = useState<boolean>(true);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !message.trim()) {
            toast.error("Please fill in both announcement title and message");
            return;
        }

        setSending(true);
        try {
            const res = await sendAnnouncementAction({
                targetUserId,
                title: title.trim(),
                message: message.trim(),
                type,
            });

            if (res.success) {
                toast.success(
                    targetUserId === "GLOBAL"
                        ? `Global announcement broadcast to all platform users!`
                        : `Direct announcement sent successfully!`
                );
                setTitle("");
                setMessage("");
            } else {
                toast.error(res.error || "Failed to send announcement");
            }
        } catch (err: any) {
            console.error("Announcement error:", err);
            toast.error("Failed to broadcast announcement");
        }
        setSending(false);
    };

    return (
        <div className="bg-[#11062b] border border-indigo-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500/0 via-indigo-500 to-pink-500/0"></div>
            
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                        <Icon icon="lucide:megaphone" className="text-xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white tracking-tight">System Announcement Console</h3>
                        <p className="text-xs text-gray-400 font-mono">Broadcast live alerts to user notification bars</p>
                    </div>
                </div>

                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-xs font-mono text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg border border-indigo-500/30 transition-all flex items-center gap-1.5"
                >
                    <Icon icon={isExpanded ? "lucide:chevron-up" : "lucide:chevron-down"} />
                    {isExpanded ? "Collapse Panel" : "Expand Console"}
                </button>
            </div>

            {isExpanded && (
                <form onSubmit={handleSend} className="space-y-4 mt-6 border-t border-white/5 pt-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Target Select */}
                        <div>
                            <label className="block text-xs font-mono font-bold text-gray-300 uppercase tracking-wider mb-2">
                                Announcement Target
                            </label>
                            <select
                                value={targetUserId}
                                onChange={(e) => setTargetUserId(e.target.value)}
                                className="w-full bg-[#0d0522] border border-indigo-500/30 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-indigo-400 font-mono"
                            >
                                <option value="GLOBAL">🌐 ALL PLATFORM USERS (GLOBAL BROADCAST)</option>
                                {users.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        👤 DIRECT: {u.name} ({u.email})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Notification Type */}
                        <div>
                            <label className="block text-xs font-mono font-bold text-gray-300 uppercase tracking-wider mb-2">
                                Alert Type / Priority
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setType("info")}
                                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 ${
                                        type === "info"
                                            ? "bg-blue-500/20 border-blue-500 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                            : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                                    }`}
                                >
                                    <Icon icon="lucide:info" /> Info
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setType("success")}
                                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 ${
                                        type === "success"
                                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                            : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                                    }`}
                                >
                                    <Icon icon="lucide:check-circle" /> Success
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setType("warning")}
                                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 ${
                                        type === "warning"
                                            ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                                            : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                                    }`}
                                >
                                    <Icon icon="lucide:alert-triangle" /> Warning
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setType("alert")}
                                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 ${
                                        type === "alert"
                                            ? "bg-red-500/20 border-red-500 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                                            : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                                    }`}
                                >
                                    <Icon icon="lucide:bell-ring" /> Urgent
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Title Input */}
                    <div>
                        <label className="block text-xs font-mono font-bold text-gray-300 uppercase tracking-wider mb-2">
                            Announcement Headline / Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Account Balance Updated or Market Volatility Alert"
                            className="w-full bg-[#0d0522] border border-indigo-500/30 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-indigo-400 font-sans"
                        />
                    </div>

                    {/* Detailed Message Input */}
                    <div>
                        <label className="block text-xs font-mono font-bold text-gray-300 uppercase tracking-wider mb-2">
                            Detailed Message Content
                        </label>
                        <textarea
                            rows={3}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter the message text that will be displayed in the user's notification bar..."
                            className="w-full bg-[#0d0522] border border-indigo-500/30 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-400 font-sans resize-none"
                        />
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={sending}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] disabled:opacity-50 flex items-center gap-2 uppercase tracking-wider"
                        >
                            {sending ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Broadcasting...
                                </>
                            ) : (
                                <>
                                    <Icon icon="lucide:send" className="text-base" />
                                    {targetUserId === "GLOBAL" ? "Send Global Broadcast" : "Send Direct Announcement"}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
