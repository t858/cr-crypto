"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import Ticker from "./Ticker";
import { UserDashboardConfig, WidgetKey, DEFAULT_DASHBOARD_CONFIG } from "@/app/types/dashboardConfig";

interface EditableDashboardProps {
  config?: UserDashboardConfig;
  editMode?: boolean;
  onChangeConfig?: (newConfig: UserDashboardConfig) => void;
  onOpenModal?: (modalName: string) => void;
}

export default function EditableDashboard({
  config = DEFAULT_DASHBOARD_CONFIG,
  editMode = false,
  onChangeConfig,
  onOpenModal,
}: EditableDashboardProps) {
  // Ensure we fall back to defaults for any missing fields
  const currentConfig: UserDashboardConfig = {
    ...DEFAULT_DASHBOARD_CONFIG,
    ...config,
    walletBalances: {
      ...DEFAULT_DASHBOARD_CONFIG.walletBalances,
      ...(config?.walletBalances || {}),
    },
    widgetVisibility: {
      ...DEFAULT_DASHBOARD_CONFIG.widgetVisibility,
      ...(config?.widgetVisibility || {}),
    },
    widgetOrder: config?.widgetOrder && config.widgetOrder.length > 0
      ? config.widgetOrder
      : DEFAULT_DASHBOARD_CONFIG.widgetOrder,
    chartPoints: config?.chartPoints && config.chartPoints.length > 0
      ? config.chartPoints
      : DEFAULT_DASHBOARD_CONFIG.chartPoints,
  };

  const updateConfig = (patch: Partial<UserDashboardConfig>) => {
    if (onChangeConfig) {
      onChangeConfig({
        ...currentConfig,
        ...patch,
      });
    }
  };

  // Move widget up or down in widgetOrder
  const moveWidget = (index: number, direction: "up" | "down") => {
    const newOrder = [...currentConfig.widgetOrder];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;

    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    updateConfig({ widgetOrder: newOrder });
  };

  // Toggle widget visibility
  const toggleVisibility = (key: WidgetKey) => {
    updateConfig({
      widgetVisibility: {
        ...currentConfig.widgetVisibility,
        [key]: !currentConfig.widgetVisibility[key],
      },
    });
  };

  // Drag handler for interactive chart
  const handleChartPointChange = (index: number, val: number) => {
    const newPoints = [...currentConfig.chartPoints];
    newPoints[index] = { ...newPoints[index], val };
    updateConfig({ chartPoints: newPoints });
  };

  const handleChartInteraction = (index: number, e: React.MouseEvent<HTMLDivElement>) => {
    if (!editMode) return;
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const y = e.clientY - rect.top;
    let percent = 100 - (y / rect.height) * 100;
    percent = Math.max(0, Math.min(100, Math.round(percent)));
    handleChartPointChange(index, percent);
  };

  // Render individual widget based on key
  const renderWidget = (key: WidgetKey, index: number) => {
    // Check if visible
    if (!editMode && currentConfig.widgetVisibility[key] === false) {
      return null;
    }

    const isHiddenInAdmin = editMode && currentConfig.widgetVisibility[key] === false;

    return (
      <div
        key={key}
        className={`relative transition-all ${
          isHiddenInAdmin ? "opacity-40 grayscale border border-dashed border-red-500/40 p-2 rounded-xl" : ""
        }`}
      >
        {/* Admin Controls Overlay Header for each widget card */}
        {editMode && (
          <div className="bg-[#11062b] border border-red-500/40 rounded-t-xl px-4 py-2 flex items-center justify-between text-xs font-mono text-white mb-1 shadow-md">
            <div className="flex items-center gap-2">
              <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-bold uppercase">
                Widget: {key}
              </span>
              <button
                onClick={() => toggleVisibility(key)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  currentConfig.widgetVisibility[key]
                    ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                    : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                }`}
              >
                {currentConfig.widgetVisibility[key] ? "Visible" : "Hidden"}
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={index === 0}
                onClick={() => moveWidget(index, "up")}
                className="p-1 hover:bg-[#1b1e22]/10 rounded disabled:opacity-30 cursor-pointer"
                title="Move Up"
              >
                <Icon icon="lucide:arrow-up" />
              </button>
              <button
                disabled={index === currentConfig.widgetOrder.length - 1}
                onClick={() => moveWidget(index, "down")}
                className="p-1 hover:bg-[#1b1e22]/10 rounded disabled:opacity-30 cursor-pointer"
                title="Move Down"
              >
                <Icon icon="lucide:arrow-down" />
              </button>
            </div>
          </div>
        )}

        {/* WIDGET 1: VERIFICATION BANNER */}
        {key === "verificationBanner" && (
          <>
            {currentConfig.verificationStep < 3 || editMode ? (
              <div className="bg-[#1b1e22] rounded-xl border border-white/10 overflow-hidden flex flex-col md:flex-row relative shadow-lg">
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-center items-start z-10 relative">
                  {/* Step indicators */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-5 h-5 rounded-full bg-[#FF4520] flex items-center justify-center text-black shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                      <Icon icon="lucide:check" className="text-sm font-bold" />
                    </div>
                    <div className="w-4 border-t border-[#FF4520]/50"></div>

                    {currentConfig.verificationStep >= 2 ? (
                      <div className="w-5 h-5 rounded-full bg-[#FF4520] flex items-center justify-center text-black shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                        <Icon icon="lucide:check" className="text-sm font-bold" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center text-xs text-white/70">
                        2
                      </div>
                    )}
                    <div className="w-4 border-t border-white/20"></div>

                    {currentConfig.verificationStep >= 3 ? (
                      <div className="w-5 h-5 rounded-full bg-[#FF4520] flex items-center justify-center text-black shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                        <Icon icon="lucide:check" className="text-sm font-bold" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center text-xs text-white/70">
                        3
                      </div>
                    )}
                  </div>

                  <h2 className="text-2xl font-bold mb-2 text-white">
                    {currentConfig.verificationStep === 1
                      ? "You're almost ready to trade"
                      : currentConfig.verificationStep === 2
                      ? "Finalize your profile"
                      : "Account Fully Verified"}
                  </h2>

                  {/* Notice text */}
                  {editMode ? (
                    <div className="w-full my-2">
                      <label className="text-[10px] font-mono text-red-400 block mb-1 uppercase">
                        Admin Edit Banner Text:
                      </label>
                      <input
                        type="text"
                        value={currentConfig.verificationNotice}
                        onChange={(e) => updateConfig({ verificationNotice: e.target.value })}
                        className="w-full bg-[#07011d] text-white text-sm p-2 rounded border border-red-500/40 outline-none"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm mb-6 max-w-md leading-relaxed">
                      {currentConfig.verificationNotice}
                    </p>
                  )}

                  {/* Step Selector in Admin Mode */}
                  {editMode && (
                    <div className="flex items-center gap-3 my-3">
                      <span className="text-xs font-mono text-red-400 uppercase">Set Step:</span>
                      {[1, 2, 3].map((step) => (
                        <button
                          key={step}
                          onClick={() => updateConfig({ verificationStep: step })}
                          className={`px-3 py-1 text-xs rounded font-bold font-mono transition-colors ${
                            currentConfig.verificationStep === step
                              ? "bg-red-600 text-white"
                              : "bg-[#1b1e22]/10 text-gray-400 hover:bg-[#1b1e22]/20"
                          }`}
                        >
                          Step {step}
                        </button>
                      ))}
                    </div>
                  )}

                  {!editMode && (
                    <button
                      onClick={() =>
                        onOpenModal?.(
                          currentConfig.verificationStep === 1 ? "VERIFY_INFO" : "VERIFY_PIC"
                        )
                      }
                      className="bg-[#FF4520] hover:bg-[#e03a17] text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-lg shadow-[#FF4520]/25 cursor-pointer"
                    >
                      {currentConfig.verificationStep === 1
                        ? "Verify Identity Info"
                        : "Setup Avatar / Picture"}
                    </button>
                  )}
                </div>

                <div className="md:w-[450px] relative h-[180px] md:h-auto overflow-hidden hidden sm:block">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1b1e22] via-[#1b1e22]/50 to-transparent z-10 pointer-events-none"></div>
                  <img
                    src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1000&auto=format&fit=crop"
                    alt="Verification"
                    className="absolute inset-0 w-full h-full object-cover filter grayscale-[20%]"
                  />
                </div>
              </div>
            ) : null}
          </>
        )}

        {/* WIDGET 2: CORE BALANCES */}
        {key === "balances" && (
          <div className="bg-[#1b1e22] rounded-2xl border border-white/10 p-6 lg:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/0 via-indigo-500/50 to-emerald-500/0"></div>
            
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Icon icon="lucide:vault" className="text-base" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Account Capital & Liquidity</h3>
                  <p className="text-xs text-gray-400">Liquid reserves and deployed investment assets</p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Active Capital
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              {/* Available USD */}
              <div className="bg-[#0b0c0f] p-5 rounded-xl border border-white/10 flex flex-col justify-between relative group hover:border-white/15 transition-all">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Available Liquid USD</span>
                  <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-0.5 rounded">Unallocated</span>
                </div>
                {editMode ? (
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-red-400 uppercase block">Available USD ($):</label>
                    <input
                      type="number"
                      step="0.01"
                      value={currentConfig.balance}
                      onChange={(e) => updateConfig({ balance: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[#180a29] text-xl font-bold text-white p-2 rounded-lg border border-red-500/50 outline-none font-mono"
                    />
                  </div>
                ) : (
                  <div>
                    <h3 className="text-3xl font-extrabold tracking-tight text-white font-mono">
                      ${currentConfig.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h3>
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <span>Ready for trading & withdrawal</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Invested USD */}
              <div className="bg-[#0b0c0f] p-5 rounded-xl border border-white/10 flex flex-col justify-between relative group hover:border-white/15 transition-all">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Invested Capital</span>
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">Deployed</span>
                </div>
                {editMode ? (
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-red-400 uppercase block">Invested Amount ($):</label>
                    <input
                      type="number"
                      step="0.01"
                      value={currentConfig.invested}
                      onChange={(e) => updateConfig({ invested: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[#180a29] text-xl font-bold text-white p-2 rounded-lg border border-red-500/50 outline-none font-mono"
                    />
                  </div>
                ) : (
                  <div>
                    <h3 className="text-3xl font-extrabold tracking-tight text-white font-mono">
                      ${currentConfig.invested.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h3>
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <span>Active position allocation</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* WIDGET 2.5: PORTFOLIO OVERVIEW */}
        {key === "portfolio" && (
          <div className="bg-[#1b1e22] rounded-2xl border border-white/10 p-6 lg:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl relative overflow-hidden space-y-6">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/0 via-blue-500/50 to-indigo-500/0"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Icon icon="lucide:pie-chart" className="text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Portfolio Allocation & Valuation</h3>
                  <p className="text-xs text-gray-400">Overall account valuation, trading profitability, and asset holdings</p>
                </div>
              </div>
              {editMode && (
                <span className="text-xs font-mono font-bold text-red-400 uppercase bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/30">
                  WYSIWYG Admin Mode
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Total Wallet Balance Card */}
              <div className="bg-[#0b0c0f] p-6 rounded-xl border border-white/10 space-y-4 hover:border-white/15 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Total Portfolio Value</span>
                    <span className="text-[11px] text-gray-500">Net equity across all positions</span>
                  </div>
                  <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded-full border ${
                    (currentConfig.walletChange || "+0%").startsWith("-")
                      ? "bg-red-500/10 text-red-400 border-red-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                  }`}>
                    {currentConfig.walletChange || "+0%"}
                  </span>
                </div>

                {editMode ? (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-[10px] font-mono text-red-400 block mb-1 uppercase">Total Value ($):</label>
                      <input
                        type="text"
                        value={currentConfig.walletTotal || "$124,563.00"}
                        onChange={(e) => updateConfig({ walletTotal: e.target.value })}
                        className="w-full bg-[#180a29] text-white text-sm p-2 rounded-lg border border-red-500/40 outline-none font-mono"
                        placeholder="$124,563.00"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-red-400 block mb-1 uppercase">24h Change %:</label>
                      <input
                        type="text"
                        value={currentConfig.walletChange || "+15.4%"}
                        onChange={(e) => updateConfig({ walletChange: e.target.value })}
                        className="w-full bg-[#180a29] text-white text-sm p-2 rounded-lg border border-red-500/40 outline-none font-mono"
                        placeholder="+15.4%"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-baseline">
                    <h2 className="text-3xl font-extrabold text-white font-mono tracking-tight">{currentConfig.walletTotal || "$0.00"}</h2>
                  </div>
                )}
              </div>

              {/* Realized Trading Profit Card */}
              <div className="bg-[#0b0c0f] p-6 rounded-xl border border-white/10 space-y-4 hover:border-white/15 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Cumulative Trading Profit</span>
                    <span className="text-[11px] text-gray-500">Total net closed trade earnings</span>
                  </div>
                  <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded-full border ${
                    (currentConfig.tradingProfitChange || "+0%").startsWith("-")
                      ? "bg-red-500/10 text-red-400 border-red-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                  }`}>
                    {currentConfig.tradingProfitChange || "+0%"}
                  </span>
                </div>

                {editMode ? (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-[10px] font-mono text-red-400 block mb-1 uppercase">Profit Amount ($):</label>
                      <input
                        type="number"
                        step="0.01"
                        value={currentConfig.tradingProfit ?? 12450}
                        onChange={(e) => updateConfig({ tradingProfit: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#180a29] text-white text-sm p-2 rounded-lg border border-red-500/40 outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-red-400 block mb-1 uppercase">Profit %:</label>
                      <input
                        type="text"
                        value={currentConfig.tradingProfitChange || "+24.8%"}
                        onChange={(e) => updateConfig({ tradingProfitChange: e.target.value })}
                        className="w-full bg-[#180a29] text-white text-sm p-2 rounded-lg border border-red-500/40 outline-none font-mono"
                        placeholder="+24.8%"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-baseline">
                    <h2 className="text-3xl font-extrabold text-white font-mono tracking-tight">
                      ${(currentConfig.tradingProfit || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h2>
                  </div>
                )}
              </div>
            </div>

            {/* Individual Crypto Asset Holdings Grid */}
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Asset Holdings Valuation</span>
                <span className="text-xs text-gray-500">6 Core Assets Listed</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { key: "btc", label: "Bitcoin", symbol: "BTC", icon: "bitcoin" },
                  { key: "eth", label: "Ethereum", symbol: "ETH", icon: "ethereum" },
                  { key: "sol", label: "Solana", symbol: "SOL", icon: "solana" },
                  { key: "ada", label: "Cardano", symbol: "ADA", icon: "cardano" },
                  { key: "xrp", label: "Ripple", symbol: "XRP", icon: "ripple" },
                  { key: "avax", label: "Avalanche", symbol: "AVAX", icon: "avalanche" },
                ].map((asset) => (
                  <div key={asset.key} className="bg-[#0b0c0f] p-4 rounded-xl border border-white/10 hover:border-white/15 transition-all flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon icon={`cryptocurrency-color:${asset.icon}`} className="text-xl" />
                        <div>
                          <span className="text-xs font-bold text-white block leading-tight">{asset.label}</span>
                          <span className="text-[10px] text-gray-500 font-mono">{asset.symbol}</span>
                        </div>
                      </div>
                    </div>

                    {editMode ? (
                      <div className="mt-1">
                        <label className="text-[9px] font-mono text-red-400 block mb-0.5">Holding ($):</label>
                        <input
                          type="text"
                          value={(currentConfig.walletBalances as any)?.[asset.key] || "$0.00"}
                          onChange={(e) =>
                            updateConfig({
                              walletBalances: {
                                ...currentConfig.walletBalances,
                                [asset.key]: e.target.value,
                              },
                            })
                          }
                          className="w-full bg-[#180a29] text-white font-mono text-xs p-1.5 rounded border border-red-500/40 outline-none"
                        />
                      </div>
                    ) : (
                      <div className="mt-2 text-right">
                        <span className="text-sm font-extrabold text-white font-mono block">
                          {(currentConfig.walletBalances as any)?.[asset.key] || "$0.00"}
                        </span>
                        <span className="text-[9px] text-gray-500 uppercase">Holding Value</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* WIDGET 3: DYNAMIC INTERACTIVE CHART & HEIGHT CONTROL */}
        {key === "chart" && (
          <div className="bg-[#1b1e22] rounded-xl border border-white/10 p-6 shadow-xl relative flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-4">
              <div className="flex-1">
                {editMode ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-red-400 uppercase">Title:</span>
                    <input
                      type="text"
                      value={currentConfig.chartTitle}
                      onChange={(e) => updateConfig({ chartTitle: e.target.value })}
                      className="w-full bg-[#07011d] text-white font-bold p-1 rounded border border-red-500/40 outline-none text-sm"
                    />
                  </div>
                ) : (
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Icon icon="lucide:line-chart" className="text-[#1e88e5]" />
                    {currentConfig.chartTitle}
                  </h3>
                )}
              </div>

              {/* Chart Height Slider in Admin Edit Mode */}
              {editMode && (
                <div className="bg-[#11062b] border border-red-500/30 p-2 rounded-lg flex items-center gap-3">
                  <Icon icon="lucide:move-vertical" className="text-red-400 text-sm" />
                  <span className="text-xs font-mono text-red-400 uppercase whitespace-nowrap">
                    Height: <span className="font-bold text-white">{currentConfig.chartHeight}px</span>
                  </span>
                  <input
                    type="range"
                    min="180"
                    max="600"
                    step="10"
                    value={currentConfig.chartHeight}
                    onChange={(e) => updateConfig({ chartHeight: parseInt(e.target.value) })}
                    className="w-28 accent-red-500 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Interactive Canvas Chart */}
            <div
              className="w-full flex items-end justify-between gap-2 px-2 pt-6 transition-all duration-200"
              style={{ height: `${currentConfig.chartHeight}px` }}
            >
              {currentConfig.chartPoints.map((point, i) => (
                <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group">
                  <div
                    className={`w-full max-w-[48px] h-[85%] relative flex flex-col justify-end p-0.5 rounded-t overflow-hidden ${
                      editMode
                        ? "cursor-ns-resize border-x border-dashed border-red-500/30 hover:bg-white/5"
                        : "bg-white/5"
                    }`}
                    onClick={(e) => handleChartInteraction(i, e)}
                    onMouseMove={(e) => {
                      if (e.buttons === 1) handleChartInteraction(i, e);
                    }}
                  >
                    <div
                      className={`w-full transition-all rounded-t relative ${
                        editMode ? "bg-red-500/80" : "bg-gradient-to-t from-[#1e88e5] to-[#22c55e]"
                      }`}
                      style={{ height: `${point.val}%` }}
                    >
                      <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-white drop-shadow">
                        {point.val}%
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase mt-2">{point.label}</span>
                </div>
              ))}
            </div>

            {editMode && (
              <p className="text-center text-xs font-mono text-red-400/80 mt-3">
                💡 Admin Tip: Drag or click along chart bars to reshape the performance graph live!
              </p>
            )}
          </div>
        )}

        {/* WIDGET 4: CRYPTO NEWS FEED */}
        {key === "news" && (
          <div className="bg-[#1b1e22] rounded-xl border border-white/10 p-6 shadow-xl h-[360px] flex flex-col">
            <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4 shrink-0">
              <h3 className="text-[17px] font-bold text-white tracking-wide flex items-center gap-2">
                <Icon icon="lucide:newspaper" className="text-[#1e88e5] text-xl" />
                Latest Market News
              </h3>
              <Link href="/dashboard/copy-trading" className="text-sm text-[#1e88e5] hover:text-[#5cb8ff]">
                View All
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4 pr-2">
              {[
                { title: "Bitcoin Surges Amid Pre-Halving Miner Accumulation Data", time: "1 hour ago", src: "Market Watch" },
                { title: "Ethereum Target Raised by Analysts Pointing to ETFs", time: "2 hours ago", src: "Crypto Insider" },
                { title: "SEC and CFTC Sign Historic Pact on Derivatives Oversight", time: "5 hours ago", src: "DeFi Pulse" },
                { title: "Goldman Sachs Revealed as Top Holder of Spot XRP ETFs", time: "8 hours ago", src: "Global Finance" },
              ].map((news, i) => (
                <div key={i} className="flex flex-col gap-1 border-b border-white/10 pb-3 last:border-0">
                  <h4 className="text-[15px] font-medium text-gray-200 hover:text-[#1e88e5] transition-colors">
                    {news.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="text-[#1e88e5]/80 font-medium">{news.src}</span>
                    <span>•</span>
                    <span>{news.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WIDGET 5: BIG MOVERS */}
        {key === "bigMovers" && (
          <div className="bg-[#1b1e22] rounded-xl border border-white/10 p-6 shadow-xl h-[360px] flex flex-col">
            <div className="flex justify-between items-start mb-2 shrink-0">
              <div>
                <h3 className="text-[17px] font-bold text-white tracking-wide">Big Movers</h3>
                <p className="text-sm text-gray-400 mt-1">Today's top gainers & market shifters.</p>
              </div>
              <button className="text-gray-400 hover:text-white">
                <Icon icon="lucide:more-vertical" />
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-3">
              {[
                { coin: "Bitcoin", symbol: "BTC", price: "$97,450.00", change: "+4.2%" },
                { coin: "Solana", symbol: "SOL", price: "$210.15", change: "+8.9%" },
                { coin: "Ripple", symbol: "XRP", price: "$2.45", change: "+14.1%" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <div>
                    <div className="font-bold text-white">{item.coin} <span className="text-xs text-gray-400">({item.symbol})</span></div>
                    <div className="text-xs text-gray-400">{item.price}</div>
                  </div>
                  <span className="text-sm font-bold text-green-400 bg-green-500/10 px-2.5 py-1 rounded">
                    {item.change}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col pb-20 lg:pb-0 min-h-full">
      <Ticker />

      {/* ADMIN CONTROL TOOLBAR */}
      {editMode && (
        <div className="bg-[#11062b] border-b border-red-500/30 p-4 sticky top-0 z-40 shadow-2xl backdrop-blur-md">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <h3 className="text-white font-mono font-bold text-sm tracking-wider uppercase">
                WYSIWYG Admin Canvas (Live Edit)
              </h3>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-gray-300 overflow-x-auto max-w-full pb-1 md:pb-0">
              <span className="text-red-400 font-bold uppercase">Toggle Cards:</span>
              {(Object.keys(currentConfig.widgetVisibility) as WidgetKey[]).map((widgetKey) => (
                <label key={widgetKey} className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                  <input
                    type="checkbox"
                    checked={currentConfig.widgetVisibility[widgetKey]}
                    onChange={() => toggleVisibility(widgetKey)}
                    className="accent-red-500 cursor-pointer"
                  />
                  <span>{widgetKey}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD CANVAS CONTAINER */}
      <div className="p-4 lg:p-8 max-w-[1200px] mx-auto w-full space-y-6">
        {currentConfig.widgetOrder.map((widgetKey, idx) => renderWidget(widgetKey, idx))}
      </div>
    </div>
  );
}
