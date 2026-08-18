"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useSession } from "next-auth/react";
import { UserDashboardConfig, DEFAULT_DASHBOARD_CONFIG } from "@/app/types/dashboardConfig";
import { getUserForAdmin, AnnouncementNotification } from "@/app/admin/actions";

type ModalType = "NONE" | "VERIFY_INFO" | "VERIFY_PIC" | "DEPOSIT" | "WITHDRAW" | "NOTIFICATIONS" | "TRANSACTION_HISTORY";

export interface UserProfile {
    fullName?: string;
    phone?: string;
    country?: string;
    address?: string;
    city?: string;
    dob?: string;
    photoUrl?: string;
    idDocumentUrl?: string;
}

export interface UserMetadata extends Partial<UserDashboardConfig> {
    profile?: UserProfile;
    walletTotal?: string;
    walletChart?: { label: string; val: number }[];
    notifications?: AnnouncementNotification[];
}

interface DashboardContextType {
    verificationStep: number;
    setVerificationStep: (step: number) => void;
    profileInitials: string | null;
    setProfileInitials: (initials: string | null) => void;
    activeModal: ModalType;
    setActiveModal: (modal: ModalType) => void;
    balance: number;
    setBalance: (amt: number) => void;
    invested: number;
    setInvested: (amt: number) => void;
    metadata: UserMetadata;
    setMetadata: (metadata: UserMetadata) => void;
    dashboardConfig: UserDashboardConfig;
    setDashboardConfig: (config: UserDashboardConfig) => void;
    refreshMetadata: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
    const { data: session } = useSession();
    const [verificationStep, setVerificationStep] = useState(1);
    const [profileInitials, setProfileInitials] = useState<string | null>(null);
    const [activeModal, setActiveModal] = useState<ModalType>("NONE");
    const [metadata, setMetadata] = useState<UserMetadata>({});
    const [dashboardConfig, setDashboardConfig] = useState<UserDashboardConfig>(DEFAULT_DASHBOARD_CONFIG);

    const [balance, setBalance] = useState(DEFAULT_DASHBOARD_CONFIG.balance);
    const [invested, setInvested] = useState(DEFAULT_DASHBOARD_CONFIG.invested);

    useEffect(() => {
        // No longer syncing pocketbase token
    }, [session?.user]);

    const refreshMetadata = useCallback(async () => {
        if (!session?.user) return;

        try {
            const res = await fetch("/api/user/metadata", { cache: "no-store" });
            if (!res.ok) return;
            const data = await res.json();

            if (data?.metadata) {
                const userMeta = { ...data.metadata };
                
                // If user's account balance is 0 (e.g. after withdrawal), ensure invested capital & wallet total are 0
                if (userMeta.balance === 0) {
                    userMeta.invested = 0;
                    userMeta.investedCapital = 0;
                    userMeta.walletTotal = "$0.00";
                    userMeta.cryptoTotal = "$0.00";
                    userMeta.tradingProfit = 0;
                    userMeta.walletBalances = {
                        btc: "$0.00",
                        eth: "$0.00",
                        sol: "$0.00",
                        ada: "$0.00",
                        xrp: "$0.00",
                        avax: "$0.00"
                    };
                }

                setMetadata(userMeta);
                const loadedConfig: UserDashboardConfig = {
                    ...DEFAULT_DASHBOARD_CONFIG,
                    ...userMeta,
                    invested: userMeta.balance === 0 ? 0 : (userMeta.invested ?? DEFAULT_DASHBOARD_CONFIG.invested),
                    walletTotal: userMeta.balance === 0 ? "$0.00" : (userMeta.walletTotal ?? DEFAULT_DASHBOARD_CONFIG.walletTotal),
                    walletBalances: {
                        ...DEFAULT_DASHBOARD_CONFIG.walletBalances,
                        ...(userMeta.walletBalances || {})
                    },
                    widgetVisibility: {
                        ...DEFAULT_DASHBOARD_CONFIG.widgetVisibility,
                        ...(userMeta.widgetVisibility || {})
                    }
                };
                setDashboardConfig(loadedConfig);
                if (typeof loadedConfig.balance === "number") setBalance(loadedConfig.balance);
                if (typeof loadedConfig.invested === "number") setInvested(loadedConfig.invested);
                if (typeof loadedConfig.verificationStep === "number") setVerificationStep(loadedConfig.verificationStep);
            }
        } catch {
            // Silently catch network errors to keep browser console clean
        }
    }, [session?.user]);

    useEffect(() => {
        refreshMetadata();

        // Auto polling every 6 seconds to reflect any manual JSONBin edits live
        const intervalId = setInterval(() => {
            refreshMetadata();
        }, 6000);

        const handleFocus = () => {
            refreshMetadata();
        };

        window.addEventListener("focus", handleFocus);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener("focus", handleFocus);
        };
    }, [refreshMetadata]);

    return (
        <DashboardContext.Provider
            value={{
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
                setDashboardConfig,
                refreshMetadata,
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error("useDashboard must be used within a DashboardProvider");
    }
    return context;
}
