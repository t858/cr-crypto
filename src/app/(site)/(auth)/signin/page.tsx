"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react/dist/iconify.js";

const SigninPage = () => {
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
        toast.error("Invalid email or password");
      } else {
        toast.success("Logged in successfully!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      toast.error("An error occurred during login");
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
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">Welcome Back</h2>
          <p className="text-gray-400 text-sm">Sign in to manage your crypto trading portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-2 px-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#161B22] border border-gray-800 rounded-xl py-3.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4520] transition-colors text-sm"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2 px-1">
              <label className="block text-xs font-bold text-gray-300">Password</label>
              <Link href="#" className="text-xs font-bold text-[#FF4520] hover:underline">Forgot password?</Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#161B22] border border-gray-800 rounded-xl py-3.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4520] transition-colors text-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-xl font-bold transition-all bg-[#FF4520] hover:bg-[#e03a17] text-white shadow-lg shadow-[#FF4520]/25 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center text-base"
          >
            {loading ? "Signing in..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-8">
          Don't have an account? <Link href="/signup" className="text-[#FF4520] font-bold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default SigninPage;
