export type WidgetKey = "verificationBanner" | "balances" | "portfolio" | "chart" | "news" | "bigMovers";

export interface ChartPoint {
  label: string;
  val: number;
}

export interface UserDashboardConfig {
  balance: number;
  invested: number;
  walletTotal: string;
  walletChange: string;
  tradingProfit: number;
  tradingProfitChange: string;
  walletBalances: {
    btc: string;
    eth: string;
    sol: string;
    ada: string;
    xrp: string;
    avax: string;
  };
  chartHeight: number; // in pixels (e.g., 200 - 600)
  chartPoints: ChartPoint[];
  chartTitle: string;
  widgetOrder: WidgetKey[];
  widgetVisibility: Record<WidgetKey, boolean>;
  verificationStep: number; // 1, 2, or 3 (3 hides banner)
  verificationNotice: string;
}

export const DEFAULT_DASHBOARD_CONFIG: UserDashboardConfig = {
  balance: 0.00,
  invested: 0.00,
  walletTotal: "$0.00",
  walletChange: "+0.00%",
  tradingProfit: 0.00,
  tradingProfitChange: "+0.00%",
  walletBalances: {
    btc: "$0.00",
    eth: "$0.00",
    sol: "$0.00",
    ada: "$0.00",
    xrp: "$0.00",
    avax: "$0.00",
  },
  chartHeight: 320,
  chartPoints: [
    { label: "Mon", val: 0 },
    { label: "Tue", val: 0 },
    { label: "Wed", val: 0 },
    { label: "Thu", val: 0 },
    { label: "Fri", val: 0 },
    { label: "Sat", val: 0 },
    { label: "Sun", val: 0 },
  ],
  chartTitle: "Wallet Trading Profit & Performance",
  widgetOrder: ["verificationBanner", "balances", "portfolio", "chart", "news", "bigMovers"],
  widgetVisibility: {
    verificationBanner: true,
    balances: true,
    portfolio: true,
    chart: true,
    news: true,
    bigMovers: true,
  },
  verificationStep: 1,
  verificationNotice: "Verifying your identity helps us prevent unauthorized access.",
};
