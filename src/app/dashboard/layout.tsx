"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Logo from "../components/layout/header/logo";
import { DashboardProvider, useDashboard } from "../components/dashboard/DashboardProvider";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import { useState } from "react";
import toast from "react-hot-toast";
import { countries } from "../../utils/countries";

function DashboardLayoutContent({ children }: { children: ReactNode }) {
    const { data: session } = useSession();
    const {
        verificationStep,
        setVerificationStep,
        profileInitials,
        setProfileInitials,
        activeModal,
        setActiveModal,
        balance,
        setBalance,
        metadata
    } = useDashboard();
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;

    // Local state for forms
    const [depositAmount, setDepositAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [initialsInput, setInitialsInput] = useState("");
    const [selectedCountryCode, setSelectedCountryCode] = useState("");

    const selectedCountry = countries.find(c => c.code === selectedCountryCode);

    const handleDeposit = (e: React.FormEvent) => {
        e.preventDefault();
        const val = parseFloat(depositAmount);
        if (!isNaN(val) && val > 0) {
            setBalance(balance + val);
            toast.success(`Deposited $${val.toFixed(2)} successfully!`);
            setActiveModal("NONE");
            setDepositAmount("");
        } else {
            toast.error("Enter a valid amount");
        }
    };

    const handleWithdraw = (e: React.FormEvent) => {
        e.preventDefault();
        const val = parseFloat(withdrawAmount);
        if (!isNaN(val) && val > 0) {
            if (val > balance) {
                toast.error("Insufficient funds!");
                return;
            }
            setBalance(balance - val);
            toast.success(`Withdrew $${val.toFixed(2)} successfully!`);
            setActiveModal("NONE");
            setWithdrawAmount("");
        } else {
            toast.error("Enter a valid amount");
        }
    };

    const handleVerifyInfoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTimeout(() => {
            setVerificationStep(2);
            setActiveModal("NONE");
            toast.success("Personal information saved.");
        }, 500);
    };

    const handleVerifyPicSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!initialsInput.trim()) {
            toast.error("Please enter initials or upload a picture");
            return;
        }
        setTimeout(() => {
            setProfileInitials(initialsInput.substring(0, 2).toUpperCase());
            setVerificationStep(3);
            setActiveModal("NONE");
            toast.success("Profile updated successfully!");
        }, 500);
    };

    // Calculate percentage based on current step
    const getVerificationPercentage = () => {
        if (verificationStep === 1) return 15;
        if (verificationStep === 2) return 50;
        return 100;
    };

    const percentage = getVerificationPercentage();

    return (
        <div className="flex shrink-0 min-h-screen bg-[#111315] text-white overflow-hidden font-sans">
            {/* Sidebar for Desktop */}
            <aside className="hidden lg:flex w-[260px] flex-col bg-[#1b1e22] shrink-0 h-screen sticky top-0 overflow-y-auto custom-scrollbar shadow-[4px_0_24px_rgba(0,0,0,0.5)] z-20">
                <div className="p-6 flex items-center justify-between">
                    <Logo />
                    <button className="text-gray-400 hover:text-white transition-colors">
                        <Icon icon="lucide:arrow-left-to-line" className="text-xl" />
                    </button>
                </div>

                {/* Profile Section */}
                <div className="px-6 flex flex-col gap-4 mt-2 mb-6 cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded-xl transition-colors" onClick={() => (window.location.href = '/dashboard/account')}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 shrink-0 bg-[#3b82f6] flex items-center justify-center font-bold text-xl text-white uppercase relative">
                            {metadata?.profile?.photoUrl ? (
                                <img src={metadata.profile.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : profileInitials ? profileInitials : (
                                <Icon icon="lucide:user" className="text-white/50" />
                            )}
                        </div>
                        <div className="font-semibold text-[15px] truncate max-w-[150px]" title={metadata?.profile?.fullName || session?.user?.name || session?.user?.email || "Trader"}>
                            {metadata?.profile?.fullName || session?.user?.name || session?.user?.email?.split('@')[0] || "Trader"}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center text-xs text-gray-400">
                            <span>{percentage}% Complete</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden w-full">
                            <div
                                className="h-full bg-[#22c55e] rounded-full transition-all duration-1000 ease-in-out"
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                        {percentage < 100 && (
                            <Link href="/dashboard" className="text-xs text-gray-400 hover:text-white mt-1">Complete Profile</Link>
                        )}
                    </div>
                </div>

                {/* Primary Nav */}
                <nav className="flex flex-col px-3">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-[10px] text-gray-300 hover:bg-white/5 rounded-lg transition-colors border-l-4 border-transparent hover:border-[#111315] active-nav-item">
                        <Icon icon="lucide:home" className="text-xl" />
                        <span className="font-medium text-[15px]">Home</span>
                    </Link>
                    <Link href="/dashboard/watchlist" className={`flex items-center gap-3 px-4 py-[10px] rounded-lg transition-colors border-l-4 ${isActive('/dashboard/watchlist') ? 'bg-white/5 border-[#1e88e5] text-white' : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}>
                        <Icon icon="lucide:star" className="text-xl" />
                        <span className="font-medium text-[15px]">Watchlist</span>
                    </Link>
                    <Link href="/dashboard/portfolio" className={`flex items-center gap-3 px-4 py-[10px] rounded-lg transition-colors border-l-4 ${isActive('/dashboard/portfolio') ? 'bg-white/5 border-[#1e88e5] text-white' : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}>
                        <Icon icon="lucide:pie-chart" className="text-xl" />
                        <span className="font-medium text-[15px]">Portfolio</span>
                    </Link>
                    <Link href="/dashboard/copy-trading" className="flex items-center gap-3 px-4 py-[10px] text-gray-400 hover:text-gray-200 hover:bg-white/5 rounded-lg transition-colors border-l-4 border-transparent">
                        <Icon icon="lucide:globe" className="text-xl" />
                        <span className="font-medium text-[15px]">News</span>
                    </Link>
                    <Link href="/dashboard/wallet" className={`flex items-center gap-3 px-4 py-[10px] rounded-lg transition-colors border-l-4 ${isActive('/dashboard/wallet') ? 'bg-white/5 border-[#1e88e5] text-white' : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}>
                        <Icon icon="lucide:wallet" className="text-xl shrink-0" />
                        <span className="font-medium text-[15px]">Wallet</span>
                    </Link>
                </nav>

                {/* Secondary Nav Group */}
                <div className="mt-8 px-3">
                    <div className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">More</div>
                    <nav className="flex flex-col">
                        <Link href="/dashboard/copy-trading" className="flex items-center gap-3 px-4 py-[10px] text-gray-400 hover:text-gray-200 hover:bg-white/5 rounded-lg transition-colors text-sm">
                            <Icon icon="lucide:globe" className="text-lg opacity-80" />
                            <span>Discover</span>
                        </Link>
                        <button onClick={() => setActiveModal("NOTIFICATIONS")} className="flex items-center gap-3 px-4 py-[10px] text-gray-400 hover:text-gray-200 hover:bg-white/5 rounded-lg transition-colors text-sm w-full text-left">
                            <Icon icon="lucide:bell" className="text-lg opacity-80" />
                            <span>Notifications</span>
                        </button>
                        <Link href="/dashboard/account" className={`flex items-center gap-3 px-4 py-[10px] rounded-lg transition-colors text-sm ${isActive('/dashboard/account') ? 'bg-white/5 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}>
                            <Icon icon="lucide:user-circle" className="text-lg opacity-80" />
                            <span>My Account</span>
                        </Link>
                        <Link href="/dashboard/profile" className={`flex items-center gap-3 px-4 py-[10px] rounded-lg transition-colors text-sm ${isActive('/dashboard/profile') ? 'bg-white/5 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}>
                            <Icon icon="lucide:settings" className="text-lg opacity-80" />
                            <span>Edit Profile</span>
                        </Link>
                        <Link href="#" className="flex items-center gap-3 px-4 py-[10px] text-gray-400 hover:text-gray-200 hover:bg-white/5 rounded-lg transition-colors text-sm opacity-50 cursor-not-allowed">
                            <Icon icon="lucide:gem" className="text-lg opacity-80" />
                            <span>CR Crypto Club</span>
                        </Link>
                    </nav>
                </div>

                <div className="mt-auto px-6 pb-6 pt-4 flex flex-col gap-4">
                    <button
                        onClick={() => setActiveModal("DEPOSIT")}
                        className="w-full bg-[#1e88e5] hover:bg-[#1a73e8] text-white font-bold py-3 px-4 rounded-lg transition-colors text-sm tracking-wide"
                    >
                        Deposit Funds
                    </button>
                    <button
                        onClick={() => setActiveModal("WITHDRAW")}
                        className="w-full bg-transparent border-2 border-[#1e88e5] text-white hover:bg-[#1e88e5]/10 font-bold py-2.5 px-4 rounded-lg transition-colors text-sm tracking-wide"
                    >
                        Withdraw Funds
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar relative">
                {/* Desktop Top Header Bar */}
                <header className="hidden lg:flex items-center justify-between p-4 bg-[#1b1e22] sticky top-0 z-30 w-full shrink-0 h-[72px] border-b border-black/20 shadow-sm">
                    {/* Search Bar */}
                    <div className="max-w-md w-full ml-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Icon icon="lucide:search" className="text-gray-500 group-hover:text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="bg-[#111315] border border-transparent text-gray-200 text-sm rounded-lg focus:ring-[#1e88e5] focus:border-[#1e88e5] block w-full pl-10 p-2.5 transition-all outline-none"
                                placeholder="Search"
                            />
                        </div>
                    </div>
                    {/* Header Actions */}
                    <div className="flex items-center gap-4 mr-4">
                        <button onClick={() => setActiveModal("NOTIFICATIONS")} className="text-gray-400 hover:text-white transition-colors relative">
                            <Icon icon="lucide:bell" className="text-xl" />
                            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500 border border-[#1b1e22]"></span>
                        </button>
                        <Link href="/" className="text-sm bg-black/40 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors">
                            Exit
                        </Link>
                    </div>
                </header>

                {/* Mobile Header */}
                <header className="lg:hidden flex items-center justify-between p-4 bg-[#1b1e22] sticky top-0 z-30 w-full shrink-0 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <Logo />
                        <div className="h-6 w-px bg-white/10 hidden sm:block"></div>
                        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => (window.location.href = '/dashboard/account')}>
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0 bg-[#3b82f6] flex items-center justify-center font-bold text-sm text-white uppercase relative">
                                {metadata?.profile?.photoUrl ? (
                                    <img src={metadata.profile.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : profileInitials ? profileInitials : (
                                    <Icon icon="lucide:user" className="text-white/50 w-4 h-4" />
                                )}
                            </div>
                            <div className="font-semibold text-sm text-gray-300 truncate max-w-[120px]" title={metadata?.profile?.fullName || session?.user?.name || session?.user?.email || "Trader"}>
                                {metadata?.profile?.fullName || session?.user?.name || session?.user?.email?.split('@')[0] || "Trader"}
                            </div>
                        </div>
                    </div>
                    <Link href="/" className="text-sm border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/5 text-gray-300">
                        Exit
                    </Link>
                </header>

                <div className="flex-1 w-full bg-[#111315]">
                    {children}
                </div>

                {/* Mobile Bottom Navigation */}
                <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-[#1b1e22] border-t border-white/5 flex justify-around p-3 z-50">
                    <Link href="/dashboard" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard') ? 'text-[#1e88e5]' : 'text-gray-400 hover:text-white'}`}>
                        <Icon icon="lucide:home" className="text-xl" />
                        <span className="text-[10px] uppercase font-medium">Home</span>
                    </Link>
                    <Link href="/dashboard/portfolio" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard/portfolio') ? 'text-[#1e88e5]' : 'text-gray-400 hover:text-white'}`}>
                        <Icon icon="lucide:pie-chart" className="text-xl" />
                        <span className="text-[10px] uppercase font-medium">Portfolio</span>
                    </Link>
                    <Link href="/dashboard/copy-trading" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard/copy-trading') ? 'text-[#1e88e5]' : 'text-gray-400 hover:text-white'}`}>
                        <Icon icon="lucide:globe" className="text-xl" />
                        <span className="text-[10px] uppercase font-medium">Discover</span>
                    </Link>
                    <Link href="/dashboard/wallet" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard/wallet') ? 'text-[#1e88e5]' : 'text-gray-400 hover:text-white'}`}>
                        <Icon icon="lucide:wallet" className="text-xl" />
                        <span className="text-[10px] uppercase font-medium">Wallet</span>
                    </Link>
                    <Link href="/dashboard/account" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard/account') || isActive('/dashboard/profile') ? 'text-[#1e88e5]' : 'text-gray-400 hover:text-white'}`}>
                        <Icon icon="lucide:user-circle" className="text-xl" />
                        <span className="text-[10px] uppercase font-medium">Account</span>
                    </Link>
                </nav>

                {/* Global Modals container */}
                {activeModal !== "NONE" && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <div className="bg-[#1b1e22] border border-white/10 shadow-2xl rounded-2xl w-full max-w-lg p-6 lg:p-8 relative max-h-[90vh] overflow-y-auto custom-scrollbar">

                            <button
                                onClick={() => setActiveModal("NONE")}
                                className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors bg-white/5 w-8 h-8 rounded-full flex items-center justify-center pb-0.5"
                            >
                                &times;
                            </button>

                            {/* Modal: DEPOSIT FUNDS */}
                            {activeModal === "DEPOSIT" && (
                                <>
                                    <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                                        <Icon icon="lucide:arrow-down-circle" className="text-[#1e88e5]" />
                                        Deposit Funds
                                    </h2>
                                    <form onSubmit={handleDeposit} className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Select Payment Method</label>
                                            <select className="w-full bg-[#111315] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#1e88e5] transition-colors cursor-pointer appearance-none">
                                                <option>Credit / Debit Card</option>
                                                <option>PayPal</option>
                                                <option>Stripe</option>
                                                <option>Bank Transfer</option>
                                                <option>Crypto Deposit</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Amount (USD)</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="1"
                                                    required
                                                    value={depositAmount}
                                                    onChange={(e) => setDepositAmount(e.target.value)}
                                                    className="w-full bg-[#111315] border border-white/10 rounded-xl py-3 pl-8 pr-4 text-lg focus:outline-none focus:border-[#1e88e5] transition-colors"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-white/5 space-y-4">
                                            <div className="bg-[#111315] border border-white/5 rounded-xl p-4 flex gap-3 opacity-70">
                                                <Icon icon="lucide:lock" className="text-xl shrink-0 mt-0.5" />
                                                <p className="text-xs text-gray-400 leading-relaxed">
                                                    Your payment details are fully encrypted and secure. By continuing you agree to the Deposit terms of service.
                                                </p>
                                            </div>
                                            <button type="submit" className="w-full py-3.5 rounded-xl font-bold transition-colors bg-[#1e88e5] hover:bg-[#1a73e8] text-white">
                                                Continue to Payment
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}

                            {/* Modal: WITHDRAW FUNDS */}
                            {activeModal === "WITHDRAW" && (
                                <>
                                    <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                                        <Icon icon="lucide:arrow-up-circle" className="text-gray-300" />
                                        Withdraw Funds
                                    </h2>
                                    <form onSubmit={handleWithdraw} className="space-y-5">
                                        <div className="flex justify-between text-sm mb-1 px-1">
                                            <span className="text-gray-400">Available to withdraw</span>
                                            <span className="font-bold text-white">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Withdrawal Method</label>
                                            <select className="w-full bg-[#111315] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#1e88e5] transition-colors cursor-pointer appearance-none">
                                                <option>Crypto Wallet (USDT/BTC/ETH)</option>
                                                <option>Bank Account</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Wallet Address or Bank Details</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-[#111315] border border-white/10 rounded-xl py-3 px-4 text-md focus:outline-none focus:border-[#1e88e5] transition-colors placeholder:text-gray-600"
                                                placeholder="Enter address or IBAN..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Amount (USD)</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="1"
                                                    max={balance}
                                                    required
                                                    value={withdrawAmount}
                                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                                    className="w-full bg-[#111315] border border-white/10 rounded-xl py-3 pl-8 pr-4 text-lg focus:outline-none focus:border-[#1e88e5] transition-colors"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>

                                        <button type="submit" disabled={balance <= 0} className={`w-full py-3.5 rounded-xl font-bold transition-colors mt-4 ${balance > 0 ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}>
                                            Submit Withdrawal Request
                                        </button>
                                    </form>
                                </>
                            )}

                            {/* Modal: VERIFY INFO (Step 2) */}
                            {activeModal === "VERIFY_INFO" && (
                                <>
                                    <h2 className="text-2xl font-bold mb-2 text-white">Personal Information</h2>
                                    <p className="text-gray-400 text-sm mb-6">Please provide your details exactly as they appear on your government-issued ID.</p>

                                    <form onSubmit={handleVerifyInfoSubmit} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-400 mb-1">First Name *</label>
                                                <input type="text" required className="w-full bg-[#111315] border border-white/5 rounded-lg py-2.5 px-3 text-sm focus:border-[#22c55e] outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-400 mb-1">Middle Name</label>
                                                <input type="text" className="w-full bg-[#111315] border border-white/5 rounded-lg py-2.5 px-3 text-sm focus:border-[#22c55e] outline-none" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-1">Date of Birth *</label>
                                            <input type="date" required className="w-full bg-[#111315] border border-white/5 rounded-lg py-2.5 px-3 text-sm focus:border-[#22c55e] outline-none text-gray-300" />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-1">Residential Address *</label>
                                            <input type="text" required className="w-full bg-[#111315] border border-white/5 rounded-lg py-2.5 px-3 text-sm focus:border-[#22c55e] outline-none" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-400 mb-1">City *</label>
                                                <input type="text" required className="w-full bg-[#111315] border border-white/5 rounded-lg py-2.5 px-3 text-sm focus:border-[#22c55e] outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-400 mb-1">State / Province *</label>
                                                <input type="text" required className="w-full bg-[#111315] border border-white/5 rounded-lg py-2.5 px-3 text-sm focus:border-[#22c55e] outline-none" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-400 mb-1">Country *</label>
                                                <select
                                                    required
                                                    value={selectedCountryCode}
                                                    onChange={(e) => setSelectedCountryCode(e.target.value)}
                                                    className="w-full bg-[#111315] border border-white/5 rounded-lg py-2.5 px-3 text-sm focus:border-[#22c55e] outline-none text-gray-300"
                                                >
                                                    <option value="">Select a country...</option>
                                                    {countries.map(c => (
                                                        <option key={c.code} value={c.code}>{c.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-400 mb-1">Phone Number *</label>
                                                <div className="relative">
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                                                        {selectedCountry ? (
                                                            <>
                                                                <span className="text-[15px]">{selectedCountry.flag}</span>
                                                                <span className="text-gray-400 text-sm font-medium">{selectedCountry.dialCode}</span>
                                                            </>
                                                        ) : (
                                                            <Icon icon="lucide:globe" className="text-gray-500 text-sm" />
                                                        )}
                                                    </div>
                                                    <input
                                                        type="tel"
                                                        required
                                                        className="w-full bg-[#111315] border border-white/5 rounded-lg py-2.5 pl-[72px] pr-3 text-sm focus:border-[#22c55e] outline-none"
                                                        placeholder="Phone number"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <button type="submit" className="w-full py-3 mt-4 rounded-xl font-bold bg-[#22c55e] hover:bg-[#1fae53] text-black transition-colors">
                                            Submit Information
                                        </button>
                                    </form>
                                </>
                            )}

                            {/* Modal: VERIFY PIC (Step 3) */}
                            {activeModal === "VERIFY_PIC" && (
                                <>
                                    <h2 className="text-2xl font-bold mb-2 text-white">Setup Profile Avatar</h2>
                                    <p className="text-gray-400 text-sm mb-6">Choose how you want to be displayed on the platform.</p>

                                    <form onSubmit={handleVerifyPicSubmit} className="space-y-6">
                                        <div className="bg-[#111315] border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center border-dashed cursor-pointer hover:bg-white/5 transition-colors group">
                                            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                <Icon icon="lucide:upload-cloud" className="text-2xl text-gray-300" />
                                            </div>
                                            <p className="text-sm font-medium text-gray-300">Click to upload picture</p>
                                            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                                        </div>

                                        <div className="flex items-center gap-4 w-full">
                                            <div className="h-px bg-white/10 flex-1"></div>
                                            <span className="text-xs text-gray-500 font-medium uppercase font-sans">OR</span>
                                            <div className="h-px bg-white/10 flex-1"></div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Use Initials Instead</label>
                                            <input
                                                type="text"
                                                maxLength={2}
                                                value={initialsInput}
                                                onChange={(e) => setInitialsInput(e.target.value.toUpperCase())}
                                                className="w-full bg-[#111315] border border-white/10 rounded-xl py-3 px-4 text-center text-lg tracking-[0.5em] font-bold focus:outline-none focus:border-[#22c55e] uppercase relative z-10"
                                                placeholder="TH"
                                            />
                                            <p className="text-xs text-gray-500 mt-2 text-center">Enter your initials (e.g. TH) to use as your avatar.</p>
                                        </div>

                                        <button type="submit" className="w-full py-3.5 rounded-xl font-bold bg-[#22c55e] hover:bg-[#1fae53] text-black transition-colors">
                                            Finish Verification
                                        </button>
                                    </form>
                                </>
                            )}

                            {/* Modal: NOTIFICATIONS (Empty State) */}
                            {activeModal === "NOTIFICATIONS" && (
                                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                        <Icon icon="lucide:bell-ringing" className="text-4xl text-gray-500" />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2 text-white">No notifications yet</h2>
                                    <p className="text-gray-400 text-sm max-w-xs">
                                        When you get notifications about your account, transactions, or market alerts, they'll show up here.
                                    </p>
                                    <button
                                        onClick={() => setActiveModal("NONE")}
                                        className="mt-8 px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium text-sm"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}

                            {/* Modal: TRANSACTION HISTORY (Empty State) */}
                            {activeModal === "TRANSACTION_HISTORY" && (
                                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                        <Icon icon="lucide:file-clock" className="text-4xl text-gray-500" />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2 text-white">No transaction has been done</h2>
                                    <p className="text-gray-400 text-sm max-w-xs">
                                        Your deposit, withdrawal, and trade history will appear here once you make your first transaction.
                                    </p>
                                    <button
                                        onClick={() => setActiveModal("NONE")}
                                        className="mt-8 px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium text-sm"
                                    >
                                        Close History
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
    // Layout entry wraps in Context
    return (
        <DashboardProvider>
            <DashboardLayoutContent>{children}</DashboardLayoutContent>
        </DashboardProvider>
    );
}
