"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react/dist/iconify.js";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create the user
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to create account");
        setLoading(false);
        return;
      }

      toast.success("Account created! Please sign in to continue.");
      router.push("/signin");
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-16 bg-gray-50 relative z-10 px-4">
      {/* Back to Home Button */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl text-gray-700 hover:text-black transition-all shadow-xs"
      >
        <Icon icon="lucide:arrow-left" className="text-lg" />
        <span className="font-semibold text-sm">Back to Home</span>
      </Link>

      <div className="relative mx-auto w-full max-w-md bg-[#0B0E11] text-white rounded-3xl p-8 sm:p-10 z-10 border border-gray-800 shadow-2xl">
        {/* Pionex Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <img
              src="/images/logo/pionex-logo.png"
              alt="Pionex Logo"
              className="h-10 w-auto object-contain brightness-125"
            />
          </Link>
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">Create Account</h2>
          <p className="text-gray-400 text-sm">Join 5,000,000+ traders & claim up to 10,000 USDT rewards</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-2 px-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#161B22] border border-gray-800 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4520] transition-colors text-sm"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-2 px-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#161B22] border border-gray-800 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4520] transition-colors text-sm"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-2 px-1">Secure Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#161B22] border border-gray-800 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4520] transition-colors text-sm"
              placeholder="••••••••"
            />
            <p className="text-[11px] text-gray-500 mt-2 px-1 leading-relaxed">
              Must be at least 10 characters containing 1 uppercase, 1 lowercase, 1 number, and 1 special symbol.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-4 rounded-xl font-bold transition-all bg-[#FF4520] hover:bg-[#e03a17] text-white shadow-lg shadow-[#FF4520]/25 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center text-base"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-8">
          Already have an account? <Link href="/signin" className="text-[#FF4520] font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
