"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface AdminSecretLoginModalProps {
    onClose: () => void;
}

export const AdminSecretLoginModal = ({ onClose }: AdminSecretLoginModalProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                toast.error("Invalid Admin Credentials");
            } else {
                toast.success("Admin Access Granted");
                router.push("/admin");
                router.refresh();
            }
        } catch (error) {
            toast.error("System Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl px-4 animate-in fade-in duration-200">
            <div className="bg-[#11062b] w-full max-w-sm rounded-2xl border border-red-500/30 p-8 shadow-[0_0_40px_rgba(239,68,68,0.1)] relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                >
                    ✕
                </button>

                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-black text-red-500 tracking-wider uppercase mb-1">System Override</h2>
                    <p className="text-xs text-gray-400 font-mono">Restricted Admin Access</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#0a0319] border border-red-500/20 rounded-lg py-3 px-4 text-white text-sm font-mono placeholder-red-900/50 focus:outline-none focus:border-red-500 transition-colors"
                            placeholder="sysadmin@protocol"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#0a0319] border border-red-500/20 rounded-lg py-3 px-4 text-white text-sm font-mono placeholder-red-900/50 focus:outline-none focus:border-red-500 transition-colors"
                            placeholder="••••••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-lg transition-colors font-mono tracking-widest uppercase text-sm disabled:opacity-50"
                    >
                        {loading ? "AUTHENTICATING..." : "EXECUTE"}
                    </button>
                </form>
            </div>
        </div>
    );
};
