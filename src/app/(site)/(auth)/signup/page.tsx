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
    <div className="min-h-screen flex items-center justify-center pt-32 pb-12 bg-[#07011d] relative z-10 px-4">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 z-0"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#1e88e5]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 z-0"></div>

      {/* Back to Home Button */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 z-50 flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 hover:text-white transition-all backdrop-blur-md"
      >
        <Icon icon="lucide:arrow-left" className="text-lg" />
        <span className="font-medium text-sm">Back to Home</span>
      </Link>

      <div className="relative mx-auto w-full max-w-md bg-[#11062b] overflow-hidden rounded-2xl backdrop-blur-md px-8 pt-10 pb-8 z-10 border border-white/10 shadow-2xl">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Account</h2>
          <p className="text-gray-400 text-sm">Join us to start trading securely</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5 px-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#1b1136] border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#1e88e5] transition-colors"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5 px-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1b1136] border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#1e88e5] transition-colors"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5 px-1">Secure Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1b1136] border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#1e88e5] transition-colors"
              placeholder="••••••••"
            />
            <p className="text-[11px] text-gray-500 mt-2 px-1 leading-relaxed">
              Must be at least 8 characters containing 1 uppercase, 1 lowercase, 1 number, and 1 special symbol.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-4 rounded-xl font-bold transition-all bg-[#1e88e5] hover:bg-[#1a73e8] text-white disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account? <Link href="/signin" className="text-[#1e88e5] hover:text-[#5cb8ff] font-medium transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
