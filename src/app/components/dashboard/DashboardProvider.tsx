"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase";

type ModalType = "NONE" | "VERIFY_INFO" | "VERIFY_PIC" | "DEPOSIT" | "WITHDRAW" | "NOTIFICATIONS" | "TRANSACTION_HISTORY";

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
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
    const { data: session } = useSession();
    // Default to Step 5 (100% Verified) instead of Step 1
    const [verificationStep, setVerificationStep] = useState(5);
    const [profileInitials, setProfileInitials] = useState<string | null>(null);
    const [activeModal, setActiveModal] = useState<ModalType>("NONE");
    const [metadata, setMetadata] = useState<UserMetadata>(DEFAULT_METADATA);

    useEffect(() => {
        const userId = (session?.user as any)?.id;
        if (userId) {
            const fetchMetadata = async () => {
                const { data, error } = await supabase
                    .from('users')
                    .select('metadata')
                    .eq('id', userId)
                    .single();

                if (data?.metadata) {
                    setMetadata({ ...DEFAULT_METADATA, ...data.metadata });
                }
            };
            fetchMetadata();
        }
    }, [session?.user]);

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
