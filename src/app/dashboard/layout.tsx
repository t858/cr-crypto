"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Logo from "../components/layout/header/logo";
import { DashboardProvider, useDashboard } from "../components/dashboard/DashboardProvider";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { countries } from "../../utils/countries";
import { uploadFiles } from "@/lib/uploadthing";
import { markNotificationsAsReadAction, deleteNotificationAction } from "@/app/admin/actions";

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
        metadata,
        setMetadata,
        refreshMetadata
    } = useDashboard();
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;

    const notifications = metadata.notifications || [];
    const unreadCount = notifications.filter((n) => !n.read).length;

    const handleMarkAllAsRead = async () => {
        const userId = (session?.user as any)?.id;
        if (!userId) return;

        const updatedNotifs = notifications.map((n) => ({ ...n, read: true }));
        setMetadata({ ...metadata, notifications: updatedNotifs });

        try {
            await markNotificationsAsReadAction(userId);
            toast.success("All announcements marked as read");
        } catch (err) {
            console.error("Mark as read error:", err);
        }
    };

    const handleDeleteNotification = async (notificationId: string) => {
        const userId = (session?.user as any)?.id;
        if (!userId) return;

        const updatedNotifs = notifications.filter((n) => n.id !== notificationId);
        setMetadata({ ...metadata, notifications: updatedNotifs });

        try {
            await deleteNotificationAction(userId, notificationId);
            toast.success("Notification removed");
        } catch (err) {
            console.error("Delete notification error:", err);
        }
    };

    // Local state for forms
    const [depositAmount, setDepositAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [initialsInput, setInitialsInput] = useState("");
    const [selectedCountryCode, setSelectedCountryCode] = useState("");

    // Personal Verification States
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dob, setDob] = useState("");
    const [residence, setResidence] = useState("");
    const [city, setCity] = useState("");
    const [stateProv, setStateProv] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [idCardFile, setIdCardFile] = useState<File | null>(null);
    const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
    const [submittingKyc, setSubmittingKyc] = useState(false);

    const selectedCountry = countries.find(c => c.code === selectedCountryCode);

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        const val = parseFloat(depositAmount);
        if (!isNaN(val) && val > 0) {
            const newBalance = balance + val;
            setBalance(newBalance);
            const formattedTotal = `$${newBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

            try {
                await fetch("/api/user/metadata", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ balance: newBalance, walletTotal: formattedTotal }),
                });
                await refreshMetadata();
            } catch (err) {
                console.error("Failed to sync deposit to JSONBin:", err);
            }

            toast.success(`Deposited $${val.toFixed(2)} successfully!`);
            setActiveModal("NONE");
            setDepositAmount("");
        } else {
            toast.error("Enter a valid amount");
        }
    };

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        const val = parseFloat(withdrawAmount);
        if (!isNaN(val) && val > 0) {
            if (val > balance) {
                toast.error("Insufficient funds!");
                return;
            }
            const newBalance = balance - val;
            setBalance(newBalance);
            const formattedTotal = `$${newBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

            try {
                await fetch("/api/user/metadata", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ balance: newBalance, walletTotal: formattedTotal }),
                });
                await refreshMetadata();
            } catch (err) {
                console.error("Failed to sync withdrawal to JSONBin:", err);
            }

            toast.success(`Withdrew $${val.toFixed(2)} successfully!`);
            setActiveModal("NONE");
            setWithdrawAmount("");
        } else {
            toast.error("Enter a valid amount");
        }
    };

    const handleVerifyInfoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmittingKyc(true);
        try {
            let idDocumentUrl = "";

            if (idCardFile) {
                try {
                    const res = await uploadFiles("idDocument", { files: [idCardFile] });
                    if (res && res[0]?.url) {
                        idDocumentUrl = res[0].url;
                    }
                } catch (uploadErr: any) {
                    console.error("UploadThing cloud error:", uploadErr);
                    throw new Error("Cloud upload failed. Please ensure UPLOADTHING_TOKEN is set in .env.local!");
                }
            }

            const updatedProfile: any = {
                fullName: `${firstName} ${lastName}`.trim(),
                phone: phoneNumber,
                country: selectedCountry?.name || selectedCountryCode,
                address: residence,
                city: city,
                dob: dob,
                verificationStep: 2
            };

            if (idDocumentUrl) {
                updatedProfile.idDocumentUrl = idDocumentUrl;
            }

            const res = await fetch("/api/user/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedProfile),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Failed to save information");
            }

            await refreshMetadata();
            setVerificationStep(2);
            setActiveModal("NONE");
            toast.success("Completed!");
        } catch (err: any) {
            console.error("KYC Info submit error:", err);
            toast.error(err.message || "Failed to save information");
        } finally {
            setSubmittingKyc(false);
        }
    };

    const handleVerifyPicSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmittingKyc(true);
        try {
            let photoUrl = "";

            if (profilePicFile) {
                try {
                    const res = await uploadFiles("profilePicture", { files: [profilePicFile] });
                    if (res && res[0]?.url) {
                        photoUrl = res[0].url;
                    }
                } catch (uploadErr: any) {
                    console.error("UploadThing cloud error:", uploadErr);
                    throw new Error("Cloud upload failed. Please ensure UPLOADTHING_TOKEN is set in .env.local!");
                }
            }

            if (initialsInput.trim()) {
                setProfileInitials(initialsInput.substring(0, 2).toUpperCase());
            }

            const payload: any = { verificationStep: 3 };
            if (photoUrl) payload.photoUrl = photoUrl;

            const res = await fetch("/api/user/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Failed to update profile picture");
            }

            await refreshMetadata();
            setVerificationStep(3);
            setActiveModal("NONE");
            toast.success("Completed!");
        } catch (err: any) {
            console.error("KYC Pic submit error:", err);
            toast.error(err.message || "Failed to update profile picture");
        } finally {
            setSubmittingKyc(false);
        }
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
                                className="h-full bg-[#FF4520] rounded-full transition-all duration-1000 ease-in-out"
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
                    <Link href="/dashboard/watchlist" className={`flex items-center gap-3 px-4 py-[10px] rounded-lg transition-colors border-l-4 ${isActive('/dashboard/watchlist') ? 'bg-white/5 border-[#FF4520] text-white' : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}>
                        <Icon icon="lucide:star" className="text-xl" />
                        <span className="font-medium text-[15px]">Watchlist</span>
                    </Link>
                    <Link href="/dashboard/portfolio" className={`flex items-center gap-3 px-4 py-[10px] rounded-lg transition-colors border-l-4 ${isActive('/dashboard/portfolio') ? 'bg-white/5 border-[#FF4520] text-white' : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}>
                        <Icon icon="lucide:pie-chart" className="text-xl" />
                        <span className="font-medium text-[15px]">Portfolio</span>
                    </Link>
                    <Link href="/dashboard/copy-trading" className="flex items-center gap-3 px-4 py-[10px] text-gray-400 hover:text-gray-200 hover:bg-white/5 rounded-lg transition-colors border-l-4 border-transparent">
                        <Icon icon="lucide:globe" className="text-xl" />
                        <span className="font-medium text-[15px]">News</span>
                    </Link>
                    <Link href="/dashboard/wallet" className={`flex items-center gap-3 px-4 py-[10px] rounded-lg transition-colors border-l-4 ${isActive('/dashboard/wallet') ? 'bg-white/5 border-[#FF4520] text-white' : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}>
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
                        <button onClick={() => setActiveModal("NOTIFICATIONS")} className="flex items-center justify-between px-4 py-[10px] text-gray-400 hover:text-gray-200 hover:bg-white/5 rounded-lg transition-colors text-sm w-full text-left">
                            <div className="flex items-center gap-3">
                                <Icon icon="lucide:bell" className="text-lg opacity-80" />
                                <span>Notifications</span>
                            </div>
                            {unreadCount > 0 && (
                                <span className="bg-red-500 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                        <Link href="/dashboard/account" className={`flex items-center gap-3 px-4 py-[10px] rounded-lg transition-colors text-sm ${isActive('/dashboard/account') ? 'bg-white/5 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}>
                            <Icon icon="lucide:user-circle" className="text-lg opacity-80" />
                            <span>My Account</span>
                        </Link>
                        <Link href="/dashboard/profile" className={`flex items-center gap-3 px-4 py-[10px] rounded-lg transition-colors text-sm ${isActive('/dashboard/profile') ? 'bg-white/5 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}>
                            <Icon icon="lucide:settings" className="text-lg opacity-80" />
                            <span>Edit Profile</span>
                        </Link>
                        <button
                            onClick={() => {
                                signOut({ callbackUrl: "/signin" });
                            }}
                            className="flex items-center gap-3 px-4 py-[10px] text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-sm w-full text-left"
                        >
                            <Icon icon="lucide:log-out" className="text-lg opacity-80" />
                            <span>Sign Out</span>
                        </button>
                    </nav>
                </div>

                <div className="mt-auto px-6 pb-6 pt-4 flex flex-col gap-4">
                    <button
                        onClick={() => setActiveModal("DEPOSIT")}
                        className="w-full bg-[#FF4520] hover:bg-[#e03a17] text-white font-bold py-3 px-4 rounded-lg transition-colors text-sm tracking-wide"
                    >
                        Deposit Funds
                    </button>
                    <button
                        onClick={() => setActiveModal("WITHDRAW")}
                        className="w-full bg-transparent border-2 border-[#FF4520] text-white hover:bg-[#FF4520]/10 font-bold py-2.5 px-4 rounded-lg transition-colors text-sm tracking-wide"
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
                                className="bg-[#111315] border border-transparent text-gray-200 text-sm rounded-lg focus:ring-[#FF4520] focus:border-[#FF4520] block w-full pl-10 p-2.5 transition-all outline-none"
                                placeholder="Search"
                            />
                        </div>
                    </div>
                    {/* Header Actions */}
                    <div className="flex items-center gap-4 mr-4">
                        <button onClick={() => setActiveModal("NOTIFICATIONS")} className="text-gray-400 hover:text-white transition-colors relative p-2 rounded-xl hover:bg-white/5">
                            <Icon icon="lucide:bell" className="text-xl" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 bg-red-500 text-white font-mono text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-[#1b1e22] animate-pulse">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => {
                                signOut({ callbackUrl: "/" });
                            }}
                            className="text-sm bg-black/40 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
                        >
                            Exit
                        </button>
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
                    <button
                        onClick={() => {
                            signOut({ callbackUrl: "/" });
                        }}
                        className="text-sm border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/5 text-gray-300"
                    >
                        Exit
                    </button>
                </header>

                <div className="flex-1 w-full bg-[#111315]">
                    {children}
                </div>

                {/* Mobile Bottom Navigation */}
                <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-[#1b1e22] border-t border-white/5 flex justify-around p-3 z-50">
                    <Link href="/dashboard" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard') ? 'text-[#FF4520]' : 'text-gray-400 hover:text-white'}`}>
                        <Icon icon="lucide:home" className="text-xl" />
                        <span className="text-[10px] uppercase font-medium">Home</span>
                    </Link>
                    <Link href="/dashboard/portfolio" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard/portfolio') ? 'text-[#FF4520]' : 'text-gray-400 hover:text-white'}`}>
                        <Icon icon="lucide:pie-chart" className="text-xl" />
                        <span className="text-[10px] uppercase font-medium">Portfolio</span>
                    </Link>
                    <Link href="/dashboard/copy-trading" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard/copy-trading') ? 'text-[#FF4520]' : 'text-gray-400 hover:text-white'}`}>
                        <Icon icon="lucide:globe" className="text-xl" />
                        <span className="text-[10px] uppercase font-medium">Discover</span>
                    </Link>
                    <Link href="/dashboard/wallet" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard/wallet') ? 'text-[#FF4520]' : 'text-gray-400 hover:text-white'}`}>
                        <Icon icon="lucide:wallet" className="text-xl" />
                        <span className="text-[10px] uppercase font-medium">Wallet</span>
                    </Link>
                    <Link href="/dashboard/account" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard/account') || isActive('/dashboard/profile') ? 'text-[#FF4520]' : 'text-gray-400 hover:text-white'}`}>
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
                                        <Icon icon="lucide:arrow-down-circle" className="text-[#FF4520]" />
                                        Deposit Funds
                                    </h2>
                                    <form onSubmit={handleDeposit} className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Select Payment Method</label>
                                            <select className="w-full bg-[#111315] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#FF4520] transition-colors cursor-pointer appearance-none">
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
                                                    className="w-full bg-[#111315] border border-white/10 rounded-xl py-3 pl-8 pr-4 text-lg focus:outline-none focus:border-[#FF4520] transition-colors"
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
                                            <button type="submit" className="w-full py-3.5 rounded-xl font-bold transition-colors bg-[#FF4520] hover:bg-[#e03a17] text-white">
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
                                            <select className="w-full bg-[#111315] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#FF4520] transition-colors cursor-pointer appearance-none">
                                                <option>Crypto Wallet (USDT/BTC/ETH)</option>
                                                <option>Bank Account</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Wallet Address or Bank Details</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-[#111315] border border-white/10 rounded-xl py-3 px-4 text-md focus:outline-none focus:border-[#FF4520] transition-colors placeholder:text-gray-600"
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
                                                    className="w-full bg-[#111315] border border-white/10 rounded-xl py-3 pl-8 pr-4 text-lg focus:outline-none focus:border-[#FF4520] transition-colors"
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
                                                <input
                                                    type="text"
                                                    required
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                    className="w-full bg-[#111315] border border-white/5 rounded-lg py-2.5 px-3 text-sm focus:border-[#FF4520] outline-none"
                                                    placeholder="First name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-400 mb-1">Last Name *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                    className="w-full bg-[#111315] border border-white/5 rounded-lg py-2.5 px-3 text-sm focus:border-[#FF4520] outline-none"
                                                    placeholder="Last name"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-1">Date of Birth *</label>
                                            <input
                                                type="date"
                                                required
                                                value={dob}
                                                onChange={(e) => setDob(e.target.value)}
                                                className="w-full bg-[#111315] border border-white/5 rounded-lg py-2.5 px-3 text-sm focus:border-[#FF4520] outline-none text-gray-300"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-1">Residential Address *</label>
                                            <input
                                                type="text"
                                                required
                                                value={residence}
                                                onChange={(e) => setResidence(e.target.value)}
                                                className="w-full bg-[#111315] border border-white/5 rounded-lg py-2.5 px-3 text-sm focus:border-[#FF4520] outline-none"
                                                placeholder="Street address"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-400 mb-1">City *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={city}
                                                    onChange={(e) => setCity(e.target.value)}
                                                    className="w-full bg-[#111315] border border-white/5 rounded-lg py-2.5 px-3 text-sm focus:border-[#FF4520] outline-none"
                                                    placeholder="City"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-400 mb-1">State / Province *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={stateProv}
                                                    onChange={(e) => setStateProv(e.target.value)}
                                                    className="w-full bg-[#111315] border border-white/5 rounded-lg py-2.5 px-3 text-sm focus:border-[#FF4520] outline-none"
                                                    placeholder="State"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-400 mb-1">Country *</label>
                                                <select
                                                    required
                                                    value={selectedCountryCode}
                                                    onChange={(e) => setSelectedCountryCode(e.target.value)}
                                                    className="w-full bg-[#111315] border border-white/5 rounded-lg py-2.5 px-3 text-sm focus:border-[#FF4520] outline-none text-gray-300"
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
                                                        value={phoneNumber}
                                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                                        className="w-full bg-[#111315] border border-white/5 rounded-lg py-2.5 pl-[72px] pr-3 text-sm focus:border-[#FF4520] outline-none"
                                                        placeholder="Phone number"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-1">Upload ID Card / Passport (Optional)</label>
                                            <input
                                                type="file"
                                                accept="image/*,.pdf"
                                                onChange={(e) => setIdCardFile(e.target.files?.[0] || null)}
                                                className="w-full bg-[#111315] border border-white/5 rounded-lg py-2 px-3 text-xs text-gray-400 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-white/10 file:text-white hover:file:bg-white/20"
                                            />
                                        </div>

                                        <button type="submit" disabled={submittingKyc} className="w-full py-3 mt-4 rounded-xl font-bold bg-[#FF4520] hover:bg-[#1fae53] text-black transition-colors disabled:opacity-50">
                                            {submittingKyc ? "Please wait..." : "Submit Information"}
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
                                        <label className="bg-[#111315] border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center border-dashed cursor-pointer hover:bg-white/5 transition-colors group block">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    if (e.target.files?.[0]) setProfilePicFile(e.target.files[0]);
                                                }}
                                            />
                                            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                <Icon icon="lucide:upload-cloud" className="text-2xl text-gray-300" />
                                            </div>
                                            <p className="text-sm font-medium text-gray-300">
                                                {profilePicFile ? profilePicFile.name : "Click to upload picture"}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                                        </label>

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
                                                className="w-full bg-[#111315] border border-white/10 rounded-xl py-3 px-4 text-center text-lg tracking-[0.5em] font-bold focus:outline-none focus:border-[#FF4520] uppercase relative z-10"
                                                placeholder="TH"
                                            />
                                            <p className="text-xs text-gray-500 mt-2 text-center">Enter your initials (e.g. TH) to use as your avatar.</p>
                                        </div>

                                        <button type="submit" disabled={submittingKyc} className="w-full py-3.5 rounded-xl font-bold bg-[#FF4520] hover:bg-[#1fae53] text-black transition-colors disabled:opacity-50">
                                            {submittingKyc ? "Please wait..." : "Finish Verification"}
                                        </button>
                                    </form>
                                </>
                            )}

                            {/* Modal: NOTIFICATIONS (Live Announcements Drawer) */}
                            {activeModal === "NOTIFICATIONS" && (
                                <div className="flex flex-col h-full overflow-hidden">
                                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 pr-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-[#FF4520]">
                                                <Icon icon="lucide:bell-ringing" className="text-xl" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white tracking-tight">Announcements & Alerts</h3>
                                                <p className="text-xs text-gray-400 font-mono">Platform notifications and system messages</p>
                                            </div>
                                        </div>

                                        {unreadCount > 0 && (
                                            <button
                                                onClick={handleMarkAllAsRead}
                                                className="text-xs text-[#FF4520] hover:text-blue-400 font-mono font-bold transition-colors shrink-0"
                                            >
                                                Mark all read
                                            </button>
                                        )}
                                    </div>

                                    {notifications.length > 0 ? (
                                        <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-1 flex-1 py-1">
                                            {notifications.map((item) => {
                                                const iconMap = {
                                                    info: { icon: "lucide:info", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
                                                    success: { icon: "lucide:check-circle", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                                                    warning: { icon: "lucide:alert-triangle", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
                                                    alert: { icon: "lucide:bell-ring", color: "text-red-400 bg-red-500/10 border-red-500/20" },
                                                };
                                                const typeStyle = iconMap[item.type || "info"];

                                                return (
                                                    <div
                                                        key={item.id}
                                                        className={`p-4 rounded-xl border transition-all relative ${
                                                            !item.read
                                                                ? "bg-[#14161b] border-blue-500/40 shadow-lg"
                                                                : "bg-[#111315] border-white/5 opacity-85"
                                                        }`}
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="flex items-start gap-3">
                                                                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${typeStyle.color}`}>
                                                                    <Icon icon={typeStyle.icon} className="text-base" />
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                                        <span className="font-bold text-white text-sm">{item.title}</span>
                                                                        {item.isGlobal ? (
                                                                            <span className="text-[9px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.2 rounded uppercase">
                                                                                GLOBAL BROADCAST
                                                                            </span>
                                                                        ) : (
                                                                            <span className="text-[9px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.2 rounded uppercase">
                                                                                DIRECT MESSAGE
                                                                            </span>
                                                                        )}
                                                                        {!item.read && (
                                                                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-xs text-gray-300 leading-relaxed font-sans">{item.message}</p>
                                                                    <span className="text-[10px] text-gray-500 font-mono mt-2 block">
                                                                        {new Date(item.createdAt).toLocaleString()}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <button
                                                                onClick={() => handleDeleteNotification(item.id)}
                                                                className="text-gray-500 hover:text-red-400 p-1 transition-colors"
                                                                title="Delete notification"
                                                            >
                                                                <Icon icon="lucide:trash-2" className="text-sm" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center my-auto">
                                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/5">
                                                <Icon icon="lucide:bell-off" className="text-3xl text-gray-500" />
                                            </div>
                                            <h4 className="text-lg font-bold mb-1 text-white">No announcements yet</h4>
                                            <p className="text-gray-400 text-xs max-w-xs">
                                                System announcements, deposit confirmations, and admin notices will appear right here.
                                            </p>
                                        </div>
                                    )}
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
