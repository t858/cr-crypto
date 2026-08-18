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
import { CANADIAN_BANKS } from "../../utils/canadianBanks";
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
        invested,
        setInvested,
        metadata,
        setMetadata,
        dashboardConfig,
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

    // Canadian Bank Withdrawal Wizard States
    const [withdrawStep, setWithdrawStep] = useState<1 | 2 | 3 | 4 | 5>(1);
    const [accountHolderName, setAccountHolderName] = useState("");
    const [bankName, setBankName] = useState("");
    const [transitNumber, setTransitNumber] = useState("");
    const [institutionNumber, setInstitutionNumber] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountType, setAccountType] = useState<"Chequing" | "Savings">("Chequing");
    const [bankAddress, setBankAddress] = useState("");

    // Step Random 4 to 6 Seconds Countdown Loader States
    const [isStepLoading, setIsStepLoading] = useState(false);
    const [countdownSeconds, setCountdownSeconds] = useState(5);
    const [totalStepSeconds, setTotalStepSeconds] = useState(5);
    const [loadingStepMessage, setLoadingStepMessage] = useState("");

    // Step 3 Generated Withdrawal Details
    const [transactionId, setTransactionId] = useState("");
    const [requestDateTime, setRequestDateTime] = useState("");
    const [expectedCompletionDate, setExpectedCompletionDate] = useState("");
    const [referenceNumber, setReferenceNumber] = useState("");
    const [submittingWithdrawal, setSubmittingWithdrawal] = useState(false);

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

    // Random 4 to 6 Seconds Countdown Loader Helper
    const startStepLoader = (message: string, onComplete: () => Promise<void> | void) => {
        // Random duration between 4 and 6 seconds (4, 5, or 6)
        const randomSeconds = Math.floor(Math.random() * 3) + 4;
        setIsStepLoading(true);
        setLoadingStepMessage(message);
        setCountdownSeconds(randomSeconds);
        setTotalStepSeconds(randomSeconds);

        let current = randomSeconds;
        const timer = setInterval(async () => {
            current -= 1;
            if (current > 0) {
                setCountdownSeconds(current);
            } else {
                clearInterval(timer);
                try {
                    await onComplete();
                } catch (e) {
                    console.error("Step completion error:", e);
                } finally {
                    setIsStepLoading(false);
                }
            }
        }, 1000);
    };

    // Helper to generate 18-char alphanumeric Withdrawal ID (numbers and letters together)
    const generateAlphanumericId = (length: number = 18) => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "WD";
        for (let i = 0; i < length - 2; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    // Helper to generate 12-digit numeric reference number
    const generate12DigitRef = () => {
        let result = "";
        for (let i = 0; i < 12; i++) {
            result += Math.floor(Math.random() * 10).toString();
        }
        return result;
    };

    // Helper to format Expected Completion Date (2 business days ahead)
    const getExpectedCompletionDate = () => {
        const d = new Date();
        let daysAdded = 0;
        while (daysAdded < 2) {
            d.setDate(d.getDate() + 1);
            if (d.getDay() !== 0 && d.getDay() !== 6) {
                daysAdded++;
            }
        }
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

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

    // Calculate Available Trading Profit for Withdrawal
    const availableTradingProfit = typeof metadata.tradingProfit === "number"
        ? metadata.tradingProfit
        : (typeof dashboardConfig?.tradingProfit === "number" 
            ? dashboardConfig.tradingProfit 
            : (balance > 0 ? balance : 12450.00));

    // Step 1 Submission -> Confirm Payment (4-6s Loader -> Step 2)
    const handleConfirmPayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (availableTradingProfit <= 0) {
            toast.error("Your trading profit is $0.00. You cannot request a withdrawal at this time.");
            return;
        }
        setWithdrawAmount(availableTradingProfit.toFixed(2));
        if (!accountHolderName.trim()) {
            toast.error("Please enter the Account Holder Name.");
            return;
        }
        if (!bankName) {
            toast.error("Please select your Canadian Bank.");
            return;
        }
        if (!/^\d{5}$/.test(transitNumber.trim())) {
            toast.error("Transit number must be exactly 5 digits.");
            return;
        }
        if (!/^\d{3}$/.test(institutionNumber.trim())) {
            toast.error("Institution number must be exactly 3 digits.");
            return;
        }
        if (!accountNumber.trim()) {
            toast.error("Please enter your Account Number.");
            return;
        }
        if (!bankAddress.trim()) {
            toast.error("Please enter your Bank Address.");
            return;
        }

        // Random 4-6 second animated step transition
        startStepLoader("Processing Canadian banking information...", () => {
            setWithdrawStep(2);
        });
    };

    // Step 2 Submission -> Proceed to Withdrawal (4-6s Loader -> Step 3)
    const handleProceedToWithdrawal = () => {
        startStepLoader("Generating transaction ID & reference details...", () => {
            const now = new Date();
            const formattedDate = now.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            });

            setWithdrawAmount(availableTradingProfit.toFixed(2));
            setTransactionId(generateAlphanumericId(18));
            setRequestDateTime(formattedDate);
            setExpectedCompletionDate(getExpectedCompletionDate());
            setReferenceNumber(generate12DigitRef());

            setWithdrawStep(3);
        });
    };

    // Step 3 Submission -> Withdraw Now (4-6s Loader -> Step 4)
    const handleFinalWithdrawNow = () => {
        startStepLoader("Verifying 10% withdrawal fee requirement & BTC wallet...", () => {
            setWithdrawStep(4);
        });
    };

    // Step 4 Submission -> Complete Withdrawal (4-6s Loader -> Resets platform balance & invested capital to $0.00 everywhere -> Step 5 "Transaction Complete")
    const handleCompleteWithdrawal = () => {
        startStepLoader("Finalizing withdrawal transfer & updating database balance...", async () => {
            setSubmittingWithdrawal(true);
            setWithdrawStep(5);
            setBalance(0);
            if (setInvested) setInvested(0);

            try {
                await fetch("/api/user/metadata", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        balance: 0,
                        invested: 0,
                        investedCapital: 0,
                        walletTotal: "$0.00",
                        cryptoTotal: "$0.00",
                        tradingProfit: 0,
                        totalBalance: 0,
                        walletBalances: {
                            btc: "$0.00",
                            eth: "$0.00",
                            sol: "$0.00",
                            ada: "$0.00",
                            xrp: "$0.00",
                            avax: "$0.00"
                        }
                    }),
                });

                await refreshMetadata();
                toast.success("Transaction complete! Platform account balance & invested capital updated to $0.00.");
            } catch (err) {
                console.error("Failed to sync withdrawal completion to JSONBin:", err);
                toast.error("Failed to sync withdrawal completion to server.");
            } finally {
                setSubmittingWithdrawal(false);
            }
        });
    };

    // Step 4 Submission -> Pay Withdrawal Fee Now (10% calculated on full balance withdrawal)
    const handlePayFeeNow = () => {
        const fullAmount = balance > 0 ? balance : parseFloat(withdrawAmount) || 0;
        const feeAmount = (fullAmount * 0.10).toFixed(2);
        setDepositAmount(feeAmount);
        setActiveModal("DEPOSIT");
        toast.error(`A 10% withdrawal fee of $${parseFloat(feeAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })} is required to proceed with withdrawal.`);
    };

    const resetWithdrawalForm = () => {
        setWithdrawStep(1);
        setWithdrawAmount("");
        setAccountHolderName("");
        setBankName("");
        setTransitNumber("");
        setInstitutionNumber("");
        setAccountNumber("");
        setAccountType("Chequing");
        setBankAddress("");
        setTransactionId("");
        setRequestDateTime("");
        setExpectedCompletionDate("");
        setReferenceNumber("");
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

                                        {/* Bitcoin (BTC) Fee Deposit Wallet Card */}
                                        <div className="bg-[#111315] border border-amber-500/30 rounded-2xl p-4 space-y-3.5 text-center">
                                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                                                    <Icon icon="logos:bitcoin" className="text-base" />
                                                    <span>Bitcoin (BTC) Payment Wallet</span>
                                                </div>
                                                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                                                    BTC Network
                                                </span>
                                            </div>

                                            {/* QR Code Image */}
                                            <div className="relative inline-block bg-white p-2 rounded-2xl shadow-xl border border-white/20">
                                                <img
                                                    src="/images/btc-qr.jpg"
                                                    alt="Bitcoin Wallet QR Code"
                                                    className="w-44 h-44 object-contain mx-auto rounded-xl"
                                                />
                                            </div>

                                            {/* Bitcoin Wallet Address Display & Copy Button */}
                                            <div className="space-y-1 text-left">
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                    Bitcoin Deposit Wallet Address
                                                </label>
                                                <div className="flex items-center justify-between gap-2 bg-black/60 border border-amber-500/40 rounded-xl p-2.5">
                                                    <span className="font-mono text-xs sm:text-sm font-bold text-amber-300 break-all select-all">
                                                        bc1qsm0u3n4a4jd3epr76sa0g7u98q0yu22gv6cnfv
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText("bc1qsm0u3n4a4jd3epr76sa0g7u98q0yu22gv6cnfv");
                                                            toast.success("Bitcoin address copied to clipboard!");
                                                        }}
                                                        className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 p-2 rounded-lg border border-amber-500/40 transition-colors shrink-0 flex items-center gap-1.5 text-xs font-bold"
                                                        title="Copy BTC Address"
                                                    >
                                                        <Icon icon="lucide:copy" className="text-sm" />
                                                        <span className="hidden sm:inline">Copy</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-2 border-t border-white/5 space-y-4">
                                            <div className="bg-[#111315] border border-white/5 rounded-xl p-3 flex gap-3 opacity-70">
                                                <Icon icon="lucide:lock" className="text-xl shrink-0 mt-0.5" />
                                                <p className="text-xs text-gray-400 leading-relaxed">
                                                    Send the exact fee payment to the Bitcoin address above. Your transaction will process upon network confirmation.
                                                </p>
                                            </div>
                                            <button type="submit" className="w-full py-3.5 rounded-xl font-bold transition-colors bg-[#FF4520] hover:bg-[#e03a17] text-white">
                                                Submit Fee Payment Confirmation
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}

                            {/* Modal: WITHDRAW FUNDS (Multi-step Canadian Bank Withdrawal Wizard) */}
                            {activeModal === "WITHDRAW" && (
                                <>
                                    {/* Step Progress Header */}
                                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#FF4520]/10 border border-[#FF4520]/30 flex items-center justify-center text-[#FF4520]">
                                                <Icon icon="lucide:arrow-up-circle" className="text-2xl" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-white tracking-tight">Withdraw Funds</h2>
                                                <p className="text-xs text-gray-400 font-sans">
                                                    {withdrawStep === 1 && "Step 1 of 4: Enter Canadian Bank & Amount Details"}
                                                    {withdrawStep === 2 && "Step 2 of 4: Review Platform Account & Details"}
                                                    {withdrawStep === 3 && "Step 3 of 4: Final Transaction Details"}
                                                    {withdrawStep === 4 && "Step 4 of 4: 10% Withdrawal Fee & BTC Wallet"}
                                                    {withdrawStep === 5 && "Transaction Complete"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Step Pills */}
                                        {withdrawStep < 5 && !isStepLoading && (
                                            <div className="flex items-center gap-1">
                                                <span className={`w-2.5 h-2.5 rounded-full ${withdrawStep >= 1 ? 'bg-[#FF4520]' : 'bg-white/20'}`}></span>
                                                <span className={`w-2.5 h-2.5 rounded-full ${withdrawStep >= 2 ? 'bg-[#FF4520]' : 'bg-white/20'}`}></span>
                                                <span className={`w-2.5 h-2.5 rounded-full ${withdrawStep >= 3 ? 'bg-[#FF4520]' : 'bg-white/20'}`}></span>
                                                <span className={`w-2.5 h-2.5 rounded-full ${withdrawStep >= 4 ? 'bg-[#FF4520]' : 'bg-white/20'}`}></span>
                                            </div>
                                        )}
                                    </div>

                                    {/* 5-SECOND STEP COUNTDOWN LOADER OVERLAY */}
                                    {isStepLoading ? (
                                        <div className="py-10 px-4 text-center space-y-6 animate-in fade-in duration-300">
                                            {/* Animated Countdown Ring */}
                                            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                                                <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
                                                <div className="absolute inset-0 rounded-full border-4 border-[#FF4520] border-t-transparent animate-spin"></div>
                                                <span className="text-3xl font-black text-white font-mono tracking-tighter">
                                                    {countdownSeconds}s
                                                </span>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-bold text-white mb-1.5">Processing Request...</h3>
                                                <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
                                                    {loadingStepMessage || "Please wait while we verify your transaction..."}
                                                </p>
                                            </div>

                                            {/* Animated Progress Bar */}
                                            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden max-w-xs mx-auto">
                                                <div
                                                    className="bg-[#FF4520] h-full transition-all duration-1000 ease-linear"
                                                    style={{ width: `${((totalStepSeconds - countdownSeconds + 1) / Math.max(1, totalStepSeconds)) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {/* STEP 1: INPUT FORM */}
                                            {withdrawStep === 1 && (
                                                <form onSubmit={handleConfirmPayment} className="space-y-4">
                                                    {/* Balance Banner */}
                                                    <div className="bg-[#111315] border border-white/5 rounded-xl p-3.5 flex justify-between items-center text-xs">
                                                        <span className="text-gray-400 font-medium">Available Trading Profit</span>
                                                        <span className="font-bold text-white text-sm">${availableTradingProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                    </div>

                                                    {/* Amount Input (Fixed to 100% Full Trading Profit) */}
                                                    <div>
                                                        <div className="flex justify-between items-center mb-1.5">
                                                            <label className="block text-xs font-semibold text-gray-300">
                                                                Withdrawal Amount (USD) <span className="text-[#FF4520]">*</span>
                                                            </label>
                                                            <span className="bg-[#FF4520]/15 text-[#FF4520] border border-[#FF4520]/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                                Full Trading Profit Only (100%)
                                                            </span>
                                                        </div>
                                                        <div className="relative">
                                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FF4520] font-bold">$</span>
                                                            <input
                                                                type="text"
                                                                readOnly
                                                                value={availableTradingProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                                className="w-full bg-[#111315] border border-[#FF4520]/40 rounded-xl py-2.5 pl-8 pr-4 text-white font-bold text-base focus:outline-none cursor-not-allowed select-none"
                                                            />
                                                        </div>
                                                        <p className="text-[11px] text-gray-400 mt-1">
                                                            Withdrawals are restricted to your full trading profit (<strong className="text-white">${availableTradingProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>).
                                                        </p>
                                                    </div>

                                                    {/* Account Holder Name */}
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                                            Account Holder Name <span className="text-[#FF4520]">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={accountHolderName}
                                                            onChange={(e) => setAccountHolderName(e.target.value)}
                                                            className="w-full bg-[#111315] border border-white/10 rounded-xl py-2.5 px-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4520] transition-colors text-sm"
                                                            placeholder="Full legal name on bank account"
                                                        />
                                                    </div>

                                                    {/* Bank Name Dropdown (Canadian Banks) */}
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                                            Bank Name (Canada) <span className="text-[#FF4520]">*</span>
                                                        </label>
                                                        <select
                                                            required
                                                            value={bankName}
                                                            onChange={(e) => {
                                                                const selectedName = e.target.value;
                                                                setBankName(selectedName);
                                                                const b = CANADIAN_BANKS.find(bank => bank.name === selectedName);
                                                                if (b && b.code && b.code !== "999") {
                                                                    setInstitutionNumber(b.code);
                                                                }
                                                            }}
                                                            className="w-full bg-[#111315] border border-white/10 rounded-xl py-2.5 px-3.5 text-white focus:outline-none focus:border-[#FF4520] transition-colors text-sm cursor-pointer"
                                                        >
                                                            <option value="">Select your Canadian Bank or Financial Institution...</option>
                                                            {CANADIAN_BANKS.map((b) => (
                                                                <option key={b.name} value={b.name}>
                                                                    {b.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    {/* Transit & Institution Numbers Grid */}
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                                                Transit Number (5 digits) <span className="text-[#FF4520]">*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                maxLength={5}
                                                                required
                                                                value={transitNumber}
                                                                onChange={(e) => setTransitNumber(e.target.value.replace(/\D/g, ""))}
                                                                className="w-full bg-[#111315] border border-white/10 rounded-xl py-2.5 px-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4520] transition-colors text-sm font-mono"
                                                                placeholder="12345"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                                                Institution Number (3 digits) <span className="text-[#FF4520]">*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                maxLength={3}
                                                                required
                                                                value={institutionNumber}
                                                                onChange={(e) => setInstitutionNumber(e.target.value.replace(/\D/g, ""))}
                                                                className="w-full bg-[#111315] border border-white/10 rounded-xl py-2.5 px-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4520] transition-colors text-sm font-mono"
                                                                placeholder="003"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Account Number & Account Type */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                                                Account Number <span className="text-[#FF4520]">*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                required
                                                                value={accountNumber}
                                                                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                                                                className="w-full bg-[#111315] border border-white/10 rounded-xl py-2.5 px-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4520] transition-colors text-sm font-mono"
                                                                placeholder="12345678"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                                                Account Type <span className="text-[#FF4520]">*</span>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setAccountType("Chequing")}
                                                                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                                                                        accountType === "Chequing"
                                                                            ? "bg-[#FF4520] border-[#FF4520] text-white shadow-md shadow-[#FF4520]/20"
                                                                            : "bg-[#111315] border-white/10 text-gray-400 hover:text-white"
                                                                    }`}
                                                                >
                                                                    Chequing
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setAccountType("Savings")}
                                                                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                                                                        accountType === "Savings"
                                                                            ? "bg-[#FF4520] border-[#FF4520] text-white shadow-md shadow-[#FF4520]/20"
                                                                            : "bg-[#111315] border-white/10 text-gray-400 hover:text-white"
                                                                    }`}
                                                                >
                                                                    Savings
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Bank Address */}
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                                            Bank Address <span className="text-[#FF4520]">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={bankAddress}
                                                            onChange={(e) => setBankAddress(e.target.value)}
                                                            className="w-full bg-[#111315] border border-white/10 rounded-xl py-2.5 px-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4520] transition-colors text-sm"
                                                            placeholder="Street address of your bank branch"
                                                        />
                                                    </div>

                                                    <button
                                                        type="submit"
                                                        className="w-full py-3.5 mt-2 rounded-xl font-bold bg-[#FF4520] hover:bg-[#e03a17] text-white transition-all shadow-lg shadow-[#FF4520]/25 text-sm"
                                                    >
                                                        Confirm Payment
                                                    </button>
                                                </form>
                                            )}

                                            {/* STEP 2: SUMMARY REVIEW & DATABASE BALANCE */}
                                            {withdrawStep === 2 && (
                                                <div className="space-y-4">
                                                    {/* Account Database Trading Profit Summary Card */}
                                                    <div className="bg-gradient-to-r from-[#161B22] to-[#111315] border border-white/10 rounded-2xl p-4 space-y-2">
                                                        <div className="flex items-center justify-between text-xs text-gray-400">
                                                            <span>Platform Database Trading Profit</span>
                                                            <span className="font-bold text-white text-sm">${availableTradingProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-xs text-[#FF4520]">
                                                            <span>Requested Full Trading Profit Withdrawal (100%)</span>
                                                            <span className="font-bold text-sm">-${availableTradingProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                        </div>
                                                        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold text-emerald-400">
                                                            <span>Remaining Trading Profit After Withdrawal</span>
                                                            <span className="text-sm">$0.00</span>
                                                        </div>
                                                    </div>

                                                    {/* Inputted Information Summary Card */}
                                                    <div className="bg-[#111315] border border-white/5 rounded-2xl p-4 space-y-3">
                                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/5 pb-2">
                                                            Inputted Banking Information
                                                        </h4>

                                                        <div className="grid grid-cols-2 gap-3 text-xs">
                                                            <div>
                                                                <span className="text-gray-500 block">Account Holder</span>
                                                                <span className="font-semibold text-white">{accountHolderName}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-500 block">Bank Name</span>
                                                                <span className="font-semibold text-white">{bankName}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-500 block">Transit & Institution</span>
                                                                <span className="font-mono font-semibold text-gray-200">{transitNumber} - {institutionNumber}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-500 block">Account Number & Type</span>
                                                                <span className="font-mono font-semibold text-gray-200">{accountNumber} ({accountType})</span>
                                                            </div>
                                                            <div className="col-span-2">
                                                                <span className="text-gray-500 block">Bank Address</span>
                                                                <span className="font-semibold text-gray-300">{bankAddress}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="pt-2 flex gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => setWithdrawStep(1)}
                                                            className="w-1/3 py-3 rounded-xl font-bold border border-gray-700 text-gray-300 hover:bg-white/5 text-xs transition-colors"
                                                        >
                                                            Edit Details
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={handleProceedToWithdrawal}
                                                            className="w-2/3 py-3 rounded-xl font-bold bg-[#FF4520] hover:bg-[#e03a17] text-white text-xs transition-all shadow-lg shadow-[#FF4520]/25 flex items-center justify-center gap-2"
                                                        >
                                                            <span>Proceed to Withdrawal</span>
                                                            <Icon icon="lucide:arrow-right" className="text-base" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* STEP 3: GENERATED TRANSACTION DETAILS */}
                                            {withdrawStep === 3 && (
                                                <div className="space-y-4">
                                                    {/* Generated Receipt Details Card */}
                                                    <div className="bg-[#111315] border border-white/10 rounded-2xl p-5 space-y-3.5">
                                                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                                            <div>
                                                                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Transaction / Withdrawal ID</span>
                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                    <span className="font-mono font-bold text-white text-sm bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 tracking-wider">
                                                                        {transactionId}
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            navigator.clipboard.writeText(transactionId);
                                                                            toast.success("Transaction ID copied!");
                                                                        }}
                                                                        className="text-gray-400 hover:text-white p-1"
                                                                        title="Copy ID"
                                                                    >
                                                                        <Icon icon="lucide:copy" className="text-sm" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                                                                PENDING PROCESS
                                                            </span>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-3 text-xs">
                                                            <div>
                                                                <span className="text-gray-500 block mb-0.5">Request Date & Time</span>
                                                                <span className="font-medium text-white">{requestDateTime}</span>
                                                            </div>

                                                            <div>
                                                                <span className="text-gray-500 block mb-0.5">Expected Completion Date</span>
                                                                <span className="font-bold text-emerald-400">{expectedCompletionDate}</span>
                                                            </div>

                                                            <div className="col-span-2 pt-1 border-t border-white/5">
                                                                <span className="text-gray-500 block mb-0.5">Reference Number</span>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-mono font-bold text-gray-200 text-xs tracking-widest bg-black/40 px-2.5 py-1 rounded-md border border-white/5">
                                                                        {referenceNumber}
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            navigator.clipboard.writeText(referenceNumber);
                                                                            toast.success("Reference Number copied!");
                                                                        }}
                                                                        className="text-gray-400 hover:text-white p-1"
                                                                        title="Copy Reference"
                                                                    >
                                                                        <Icon icon="lucide:copy" className="text-xs" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs">
                                                            <span className="text-gray-400">Total Full Trading Profit Transfer</span>
                                                            <span className="font-extrabold text-white text-base">${availableTradingProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={handleFinalWithdrawNow}
                                                        disabled={submittingWithdrawal}
                                                        className="w-full py-3.5 rounded-xl font-extrabold bg-[#FF4520] hover:bg-[#e03a17] text-white text-base transition-all shadow-xl shadow-[#FF4520]/30 disabled:opacity-50 flex items-center justify-center gap-2"
                                                    >
                                                        <Icon icon="lucide:check-circle" className="text-lg" />
                                                        Withdraw Now
                                                    </button>
                                                </div>
                                            )}

                                            {/* STEP 4: 10% WITHDRAWAL FEE REQUIRED SCREEN */}
                                            {withdrawStep === 4 && (
                                                <div className="py-2 space-y-4 animate-in zoom-in-95 duration-300">
                                                    {/* Warning Alert Banner */}
                                                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3.5">
                                                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                                                            <Icon icon="lucide:shield-alert" className="text-2xl" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
                                                                <span>10% Withdrawal Fee Required</span>
                                                                <span className="bg-amber-500 text-black text-[9px] font-black uppercase px-2 py-0.5 rounded">Action Required</span>
                                                            </h3>
                                                            <p className="text-xs text-amber-200/90 leading-relaxed">
                                                                A 10% withdrawal fee is required to be paid to complete and proceed with your withdrawal request.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* 10% Fee Calculation Breakdown Card */}
                                                    {(() => {
                                                        const numWithdrawal = availableTradingProfit;
                                                        const fee10Percent = numWithdrawal * 0.10;
                                                        const totalWithFee = numWithdrawal + fee10Percent;

                                                        return (
                                                            <div className="bg-[#111315] border border-white/10 rounded-2xl p-4 space-y-3">
                                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/5 pb-2">
                                                                    Withdrawal Fee Breakdown (10% of Trading Profit)
                                                                </h4>

                                                                <div className="space-y-2 text-xs">
                                                                    <div className="flex justify-between items-center text-gray-300">
                                                                        <span>Requested Trading Profit Withdrawal:</span>
                                                                        <span className="font-bold text-white text-sm">
                                                                            ${numWithdrawal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                                        </span>
                                                                    </div>

                                                                    <div className="flex justify-between items-center text-amber-400">
                                                                        <span className="flex items-center gap-1 font-medium">
                                                                            <Icon icon="lucide:calculator" className="text-xs" />
                                                                            Required 10% Withdrawal Fee:
                                                                        </span>
                                                                        <span className="font-extrabold text-sm">
                                                                            +${fee10Percent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                                        </span>
                                                                    </div>

                                                                    <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs font-extrabold">
                                                                        <span className="text-white">Total Amount (Withdrawal + Fee):</span>
                                                                        <span className="text-emerald-400 text-base">
                                                                            ${totalWithFee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })()}

                                                    {/* Bitcoin Payment QR Code & Wallet Address Card */}
                                                    <div className="bg-[#111315] border border-amber-500/30 rounded-2xl p-4 space-y-3.5 text-center">
                                                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                                            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                                                                <Icon icon="logos:bitcoin" className="text-base" />
                                                                <span>Bitcoin (BTC) Fee Deposit Wallet</span>
                                                            </div>
                                                            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                                                                BTC Network
                                                            </span>
                                                        </div>

                                                        {/* QR Code Image */}
                                                        <div className="relative inline-block bg-white p-2.5 rounded-2xl shadow-xl border border-white/20">
                                                            <img
                                                                src="/images/btc-qr.jpg"
                                                                alt="Bitcoin Wallet QR Code"
                                                                className="w-48 h-48 object-contain mx-auto rounded-xl"
                                                            />
                                                        </div>

                                                        {/* Bitcoin Wallet Address Display & Copy Button */}
                                                        <div className="space-y-1.5 text-left">
                                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                                Bitcoin Wallet Address <span className="text-amber-400">*</span>
                                                            </label>
                                                            <div className="flex items-center justify-between gap-2 bg-black/60 border border-amber-500/40 rounded-xl p-2.5">
                                                                <span className="font-mono text-xs sm:text-sm font-bold text-amber-300 break-all select-all">
                                                                    bc1qsm0u3n4a4jd3epr76sa0g7u98q0yu22gv6cnfv
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        navigator.clipboard.writeText("bc1qsm0u3n4a4jd3epr76sa0g7u98q0yu22gv6cnfv");
                                                                        toast.success("Bitcoin address copied to clipboard!");
                                                                    }}
                                                                    className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 p-2 rounded-lg border border-amber-500/40 transition-colors shrink-0 flex items-center gap-1.5 text-xs font-bold"
                                                                    title="Copy Bitcoin Address"
                                                                >
                                                                    <Icon icon="lucide:copy" className="text-sm" />
                                                                    <span className="hidden sm:inline">Copy</span>
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <p className="text-[11px] text-gray-400 leading-relaxed">
                                                            Transfer the exact 10% fee to the Bitcoin address above to proceed with your withdrawal transfer.
                                                        </p>
                                                    </div>

                                                    {/* Transaction Reference Preview */}
                                                    <div className="bg-black/30 border border-white/5 rounded-xl p-3 text-xs space-y-1 font-mono text-gray-400">
                                                        <div className="flex justify-between">
                                                            <span>Withdrawal ID:</span>
                                                            <span className="text-white font-bold">{transactionId || "WD18X9A2P7L1M4N9X"}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Reference Code:</span>
                                                            <span className="text-gray-200 font-bold">{referenceNumber || "482910394821"}</span>
                                                        </div>
                                                    </div>

                                                    {/* Button: Complete withdrawal */}
                                                    <div className="pt-1">
                                                        <button
                                                            type="button"
                                                            onClick={handleCompleteWithdrawal}
                                                            className="w-full py-4 rounded-xl font-black bg-[#FF4520] hover:bg-[#e03a17] text-white text-base transition-all shadow-xl shadow-[#FF4520]/30 flex items-center justify-center gap-2 tracking-wide"
                                                        >
                                                            <Icon icon="lucide:check-circle-2" className="text-xl" />
                                                            <span>Complete withdrawal</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* STEP 5: TEMPORAL "TRANSACTION COMPLETE" VIEW */}
                                            {withdrawStep === 5 && (
                                                <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-300">
                                                    <div className="w-20 h-20 rounded-full bg-[#22c55e]/20 border-2 border-[#22c55e] flex items-center justify-center mx-auto text-[#22c55e] shadow-xl shadow-[#22c55e]/20">
                                                        <Icon icon="lucide:check-circle-2" className="text-5xl" />
                                                    </div>

                                                    <div>
                                                        <div className="inline-block bg-[#22c55e]/15 border border-[#22c55e]/30 text-[#22c55e] text-[10px] font-black uppercase px-3 py-1 rounded-full mb-2">
                                                            Transaction Complete ✓
                                                        </div>
                                                        <h3 className="text-2xl font-black text-white mb-1.5">Withdrawal Successful!</h3>
                                                        <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                                                            Your withdrawal request for <strong className="text-white">${parseFloat(withdrawAmount || availableTradingProfit.toString()).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong> (Full Trading Profit) has been completed. The updated platform trading profit is now <strong className="text-emerald-400">$0.00</strong>.
                                                        </p>
                                                    </div>

                                                    {/* Updated Balance Card */}
                                                    <div className="bg-[#111315] border border-white/10 rounded-2xl p-4 text-xs max-w-sm mx-auto space-y-2.5 text-left">
                                                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                                            <span className="text-gray-400 font-medium">New Trading Profit:</span>
                                                            <span className="font-extrabold text-emerald-400 text-base">$0.00</span>
                                                        </div>
                                                        <div className="flex justify-between text-gray-400 font-mono">
                                                            <span>Withdrawal ID:</span>
                                                            <span className="text-white font-bold">{transactionId}</span>
                                                        </div>
                                                        <div className="flex justify-between text-gray-400 font-mono">
                                                            <span>Reference Code:</span>
                                                            <span className="text-white font-bold">{referenceNumber}</span>
                                                        </div>
                                                        <div className="flex justify-between text-gray-400 font-mono">
                                                            <span>Expected Completion Date:</span>
                                                            <span className="text-gray-200 font-bold">{expectedCompletionDate}</span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            resetWithdrawalForm();
                                                            setActiveModal("NONE");
                                                        }}
                                                        className="w-full py-3.5 rounded-xl font-bold bg-white text-black hover:bg-gray-200 text-sm transition-colors mt-2"
                                                    >
                                                        Done & Return to Dashboard
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
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
                                            <label className="block text-xs font-medium text-gray-400 mb-1.5">Upload ID Card / Passport (Optional)</label>
                                            <label className={`block border ${idCardFile || metadata?.profile?.idDocumentUrl ? 'border-[#22c55e]/50 bg-[#22c55e]/5' : 'border-white/10 bg-[#111315]'} rounded-xl p-4 cursor-pointer hover:bg-white/5 transition-all text-center group`}>
                                                <input
                                                    type="file"
                                                    accept="image/*,.pdf"
                                                    className="hidden"
                                                    onChange={(e) => setIdCardFile(e.target.files?.[0] || null)}
                                                />
                                                {(idCardFile || metadata?.profile?.idDocumentUrl) ? (
                                                    <div className="flex flex-col items-center justify-center py-1">
                                                        <div className="w-12 h-12 rounded-full bg-[#22c55e]/20 border border-[#22c55e] flex items-center justify-center mb-2">
                                                            <Icon icon="lucide:check-circle-2" className="text-2xl text-[#22c55e]" />
                                                        </div>
                                                        <div className="flex items-center gap-1.5 bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/40 px-3 py-1 rounded-full font-bold text-xs mb-1">
                                                            <Icon icon="lucide:check" className="text-sm font-black" />
                                                            <span>Document Uploaded ✓</span>
                                                        </div>
                                                        <p className="text-xs text-gray-300 font-medium truncate max-w-[280px]">
                                                            {idCardFile ? idCardFile.name : "Government ID Document Attached"}
                                                        </p>
                                                        <span className="text-[11px] text-gray-400 mt-1 hover:underline">Click to change document</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center py-2">
                                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                                            <Icon icon="lucide:file-up" className="text-xl text-gray-300" />
                                                        </div>
                                                        <p className="text-xs font-semibold text-gray-300">
                                                            Click to upload ID Card, Passport, or Driver's License
                                                        </p>
                                                        <p className="text-[10px] text-gray-500 mt-0.5">Supports PNG, JPG, PDF up to 8MB</p>
                                                    </div>
                                                )}
                                            </label>
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
                                        <label className={`bg-[#111315] border ${profilePicFile || metadata?.profile?.photoUrl ? 'border-[#22c55e]/50 bg-[#22c55e]/5' : 'border-white/5'} rounded-xl p-6 flex flex-col items-center justify-center border-dashed cursor-pointer hover:bg-white/5 transition-colors group block relative`}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    if (e.target.files?.[0]) setProfilePicFile(e.target.files[0]);
                                                }}
                                            />
                                            {(profilePicFile || metadata?.profile?.photoUrl) ? (
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="w-16 h-16 rounded-full bg-[#22c55e]/20 border-2 border-[#22c55e] flex items-center justify-center mb-3 relative">
                                                        <Icon icon="lucide:check-circle-2" className="text-3xl text-[#22c55e]" />
                                                    </div>
                                                    <div className="flex items-center gap-1.5 bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/40 px-3 py-1 rounded-full font-bold text-xs mb-1">
                                                        <Icon icon="lucide:check" className="text-sm font-black" />
                                                        <span>Selfie Uploaded ✓</span>
                                                    </div>
                                                    <p className="text-xs text-gray-300 font-medium">
                                                        {profilePicFile ? profilePicFile.name : "Uploaded Selfie Picture"}
                                                    </p>
                                                    <span className="text-[11px] text-gray-400 mt-1 hover:underline">Click to change picture</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                        <Icon icon="lucide:upload-cloud" className="text-2xl text-gray-300" />
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-300">
                                                        Click to upload selfie picture
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                                                </>
                                            )}
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
