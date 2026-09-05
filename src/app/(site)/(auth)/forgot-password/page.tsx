"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react/dist/iconify.js";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your account email address.");
      return;
    }

    if (!newPassword) {
      toast.error("Please enter a new password.");
      return;
    }

    if (!confirmPassword) {
      toast.error("Please confirm your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match. Please ensure both fields are identical.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to reset password.");
      } else {
        toast.success(data.message || "Password updated successfully!");
        router.push("/signin");
      }
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast.error("An error occurred while resetting your password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-16 bg-gray-50 relative z-10 px-4">
      {/* Back to Login Button */}
      <Link 
        href="/signin" 
        className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl text-gray-700 hover:text-black transition-all shadow-xs text-sm font-semibold"
      >
        <Icon icon="lucide:arrow-left" className="text-lg" />
        <span>Back to Sign In</span>
      </Link>

      <div className="relative mx-auto w-full max-w-md bg-[#0B0E11] text-white rounded-3xl p-8 sm:p-10 z-10 border border-gray-800 shadow-2xl">
        {/* Logo */}
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
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">Reset Your Password</h2>
          <p className="text-gray-400 text-sm">Enter your account email and choose a new password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-2 px-1">Account Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#161B22] border border-gray-800 rounded-xl py-3.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4520] transition-colors text-sm"
              placeholder="name@example.com"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-2 px-1">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#161B22] border border-gray-800 rounded-xl py-3.5 pl-4 pr-11 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4520] transition-colors text-sm"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                <Icon icon={showNewPassword ? "lucide:eye-off" : "lucide:eye"} className="text-lg" />
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-2 px-1">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#161B22] border border-gray-800 rounded-xl py-3.5 pl-4 pr-11 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4520] transition-colors text-sm"
                placeholder="Re-enter new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                <Icon icon={showConfirmPassword ? "lucide:eye-off" : "lucide:eye"} className="text-lg" />
              </button>
            </div>
          </div>

          {/* Password Match Status Indicator */}
          {confirmPassword.length > 0 && (
            <div className="text-xs px-1">
              {newPassword === confirmPassword ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Icon icon="lucide:check-circle" className="text-sm" />
                  Passwords match
                </span>
              ) : (
                <span className="text-red-400 font-semibold flex items-center gap-1">
                  <Icon icon="lucide:alert-circle" className="text-sm" />
                  Passwords do not match
                </span>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-xl font-bold transition-all bg-[#FF4520] hover:bg-[#e03a17] text-white shadow-lg shadow-[#FF4520]/25 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center text-base"
          >
            {loading ? "Updating Password..." : "Update Password"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-8">
          Remember your password? <Link href="/signin" className="text-[#FF4520] font-bold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
