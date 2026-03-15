"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase";

type ModalType = "NONE" | "VERIFY_INFO" | "VERIFY_PIC" | "DEPOSIT" | "WITHDRAW" | "NOTIFICATIONS" | "TRANSACTION_HISTORY";

export interface UserProfile {
    fullName?: string;
    phone?: string;
    country?: string;
    address?: string;
    city?: string;
    dob?: string;
    photoUrl?: string;
}

export interface UserMetadata {
    walletTotal: string;
    walletChart: { label: string; val: number }[];
    walletBalances: {
        btc: string;
        eth: string;
        sol: string;
        ada: string;
        xrp: string;
        avax: string;
    };
    profile?: UserProfile;
}

const DEFAULT_METADATA: UserMetadata = {
    walletTotal: "$0.00",
    walletChart: [
        { label: '01', val: 0 },
        { label: '02', val: 0 },
        { label: '03', val: 0 },
        { label: '04', val: 0 },
        { label: '05', val: 0 },
        { label: '06', val: 0 },
        { label: '07', val: 0 },
    ],
    walletBalances: {
        btc: "$0.00",
        eth: "$0.00",
        sol: "$0.00",
        ada: "$0.00",
        xrp: "$0.00",
        avax: "$0.00",
    },
    profile: {
        fullName: "",
        phone: "",
        country: "",
        address: "",
        city: "",
        dob: "",
        photoUrl: "",
    }
};

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
    refreshMetadata: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
    const { data: session } = useSession();
    // Default to Step 5 (100% Verified) instead of Step 1
    const [verificationStep, setVerificationStep] = useState(5);
    const [profileInitials, setProfileInitials] = useState<string | null>(null);
    const [activeModal, setActiveModal] = useState<ModalType>("NONE");
    const [metadata, setMetadata] = useState<UserMetadata>(DEFAULT_METADATA);

    const refreshMetadata = useCallback(async () => {
        const userId = (session?.user as any)?.id;
        if (!userId) return;

        try {
            const { data, error } = await supabase
                .from('users')
                .select('metadata')
                .eq('id', userId)
                .maybeSingle();

            if (error) {
                console.error("Supabase fetch error:", error);
                return;
            }

            if (data?.metadata) {
                setMetadata({ ...DEFAULT_METADATA, ...data.metadata });
            }
        } catch (error) {
            console.error("Failed to fetch user metadata from Supabase:", error);
        }
    }, [session?.user]);

    useEffect(() => {
        refreshMetadata();
    }, [refreshMetadata]);

    const [balance, setBalance] = useState(0.00);
    const [invested, setInvested] = useState(0.00);

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
