"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

interface SpiderNotificationProps {
  userName?: string;
  onClose?: () => void;
}

export default function SpiderNotification({ userName, onClose }: SpiderNotificationProps) {
  const [isActive, setIsActive] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCrawling, setIsCrawling] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);
  const [isBackdropVisible, setIsBackdropVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  const formatName = (str?: string) => {
    if (!str || str.trim() === "") return "Myrna Taylor";
    return str
      .trim()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const displayName = formatName(userName);

  useEffect(() => {
    // Start animation and fade in backdrop
    const startTimer = setTimeout(() => {
      setIsBackdropVisible(true);
      setIsCrawling(true);
      setIsActive(true);

      // After 1.2s when spider drops to top: 120px, stop crawling and pop open billboard
      const revealTimer = setTimeout(() => {
        setIsCrawling(false);
        setIsRevealed(true);
      }, 1200);

      return () => clearTimeout(revealTimer);
    }, 400);

    return () => clearTimeout(startTimer);
  }, []);

  const handleDismiss = () => {
    if (isDismissing) return;
    setIsDismissing(true);

    // Step 1: Hide billboard and fade out blurred black backdrop
    setIsRevealed(false);
    setIsBackdropVisible(false);
    setIsCrawling(true);

    // Step 2: Retract spider and silk thread back up
    setTimeout(() => {
      setIsActive(false);

      // Step 3: Stop crawling and unmount
      setTimeout(() => {
        setIsCrawling(false);
        setShouldRender(false);
        if (onClose) onClose();
      }, 1200);
    }, 300);
  };

  if (!shouldRender) return null;

  return (
    <>
      <style jsx global>{`
        /* Fullscreen Blurred Black Backdrop */
        .spider-backdrop {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.78);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          z-index: 999990;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.5s ease;
        }

        .spider-backdrop.visible {
          opacity: 1;
          pointer-events: auto;
        }

        /* Spider Banner Fixed Container */
        .spider-banner-container {
          position: fixed;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 520px;
          z-index: 999999;
          pointer-events: none;
        }

        /* Silk Thread */
        .spider-thread {
          position: absolute;
          top: 0;
          left: 50%;
          width: 2px;
          height: 0;
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.9));
          transform: translateX(-50%);
          transition: height 1.2s cubic-bezier(0.25, 1, 0.5, 1);
          box-shadow: 0 0 6px rgba(255, 255, 255, 0.6);
        }

        /* Spider Element */
        .spider {
          position: absolute;
          top: -50px;
          left: 50%;
          width: 40px;
          height: 40px;
          margin-left: -20px;
          transition: top 1.2s cubic-bezier(0.25, 1, 0.5, 1);
          cursor: pointer;
          pointer-events: auto;
          z-index: 20;
        }

        /* Spider Body Parts */
        .spider-body {
          position: absolute;
          top: 14px;
          left: 13px;
          width: 14px;
          height: 18px;
          background: #111315;
          border-radius: 50%;
          box-shadow: inset -2px -2px 4px rgba(255, 255, 255, 0.25), 0 0 8px rgba(0, 0, 0, 0.9);
          border: 1px solid #333;
        }

        .spider-head {
          position: absolute;
          top: 8px;
          left: 15px;
          width: 10px;
          height: 8px;
          background: #1e2229;
          border-radius: 50%;
          box-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
        }

        /* Spider Eyes (Subtle Red Glow) */
        .spider-head::before,
        .spider-head::after {
          content: "";
          position: absolute;
          top: 2px;
          width: 2px;
          height: 2px;
          background-color: #ff4520;
          border-radius: 50%;
          box-shadow: 0 0 3px #ff4520;
        }
        .spider-head::before {
          left: 2px;
        }
        .spider-head::after {
          right: 2px;
        }

        /* Spider Legs */
        .leg {
          position: absolute;
          width: 15px;
          height: 12px;
          border: 2px solid #2d333b;
          border-bottom: none;
          border-radius: 10px 10px 0 0;
        }

        .leg.left {
          left: 1px;
          border-right: none;
          transform-origin: right center;
        }

        .leg.right {
          right: 1px;
          border-left: none;
          transform-origin: left center;
        }

        /* Leg positioning */
        .leg-1 { top: 6px; transform: rotate(-20deg); }
        .leg-2 { top: 12px; transform: rotate(-5deg); }
        .leg-3 { top: 18px; transform: rotate(10deg); }
        .leg-4 { top: 24px; transform: rotate(30deg); }

        .crawling .leg-1.left { animation: crawlL 0.3s infinite alternate; }
        .crawling .leg-2.right { animation: crawlR 0.3s infinite alternate; }
        .crawling .leg-3.left { animation: crawlL 0.3s infinite alternate 0.15s; }
        .crawling .leg-4.right { animation: crawlR 0.3s infinite alternate 0.15s; }

        @keyframes crawlL {
          0% { transform: rotate(-20deg); }
          100% { transform: rotate(-40deg); }
        }
        @keyframes crawlR {
          0% { transform: rotate(20deg); }
          100% { transform: rotate(40deg); }
        }

        /* Notification Billboard Container */
        .notification-board {
          position: absolute;
          top: 140px;
          left: 50%;
          transform: translateX(-50%) scale(0);
          width: calc(100% - 32px);
          background: #111418;
          border: 1.5px solid rgba(255, 69, 32, 0.45);
          border-radius: 16px;
          padding: 20px 22px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.95), 0 0 40px rgba(255, 69, 32, 0.25);
          opacity: 0;
          transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease;
          pointer-events: auto;
          z-index: 10;
        }

        /* Web overlay on billboard */
        .web-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle, transparent 30%, rgba(255, 255, 255, 0.04) 31%, transparent 32%),
            radial-gradient(circle, transparent 60%, rgba(255, 255, 255, 0.04) 61%, transparent 62%);
          pointer-events: none;
          border-radius: 14px;
        }

        /* Active animation classes */
        .spider-banner-container.active .spider-thread {
          height: 140px;
        }

        .spider-banner-container.active .spider {
          top: 120px;
        }

        .spider-banner-container.revealed .notification-board {
          transform: translateX(-50%) scale(1);
          opacity: 1;
        }
      `}</style>

      {/* Fullscreen Blurred Black Backdrop */}
      <div
        className={`spider-backdrop ${isBackdropVisible ? "visible" : ""}`}
        onClick={handleDismiss}
        aria-hidden="true"
      />

      <div
        className={`spider-banner-container ${isActive ? "active" : ""} ${
          isRevealed ? "revealed" : ""
        }`}
      >
        {/* Silk Thread descending from ceiling */}
        <div className="spider-thread" />

        {/* Spider crawling and dangling */}
        <div
          className={`spider ${isCrawling ? "crawling" : ""}`}
          onClick={handleDismiss}
          title="Dismiss reminder"
        >
          <div className="spider-head" />
          <div className="spider-body" />
          <div className="leg left leg-1" />
          <div className="leg left leg-2" />
          <div className="leg left leg-3" />
          <div className="leg left leg-4" />
          <div className="leg right leg-1" />
          <div className="leg right leg-2" />
          <div className="leg right leg-3" />
          <div className="leg right leg-4" />
        </div>

        {/* Billboard Held by Spider */}
        <div className="notification-board">
          <div className="web-bg" />

          {/* Billboard Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg">🔔</span>
              <span className="font-extrabold text-white text-sm sm:text-base tracking-tight">
                Withdrawal Reminder
              </span>
            </div>

            <button
              onClick={handleDismiss}
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#FF4520] text-gray-400 hover:text-white flex items-center justify-center transition-all duration-200 border border-white/10 hover:border-transparent cursor-pointer"
              title="Close notification"
              aria-label="Close"
            >
              <Icon icon="lucide:x" className="text-base" />
            </button>
          </div>

          {/* Billboard Message */}
          <div className="relative z-10 text-gray-200 text-xs sm:text-sm leading-relaxed space-y-2">
            <p>
              <strong className="text-white font-semibold">{displayName}</strong>, you have a
              pending withdrawal request. Please review your account for any outstanding
              requirements and complete them to allow your withdrawal to proceed.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
