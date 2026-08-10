'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@iconify/react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'futures' | 'spot' | 'copy'>('futures');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const marketData = [
    { coin: 'BTC/USDT', price: '$94,520.50', change: '+3.42%', isUp: true, vol: '$1.2B' },
    { coin: 'ETH/USDT', price: '$3,480.20', change: '+4.15%', isUp: true, vol: '$840M' },
    { coin: 'SOL/USDT', price: '$198.75', change: '-1.12%', isUp: false, vol: '$450M' },
    { coin: 'BNB/USDT', price: '$642.10', change: '+2.08%', isUp: true, vol: '$210M' },
    { coin: 'DOGE/USDT', price: '$0.2450', change: '+8.75%', isUp: true, vol: '$320M' },
    { coin: 'PEPE/USDT', price: '$0.0000114', change: '-2.40%', isUp: false, vol: '$180M' },
  ];

  const tradingFeatures = [
    {
      id: 'futures',
      title: 'Futures Trading 📈',
      subtitle: 'Perpetual Futures with up to 100x Leverage',
      desc: 'Trade 100+ perpetual futures contracts 24/7. Capitalize on bull and bear market trends with deep orderbook liquidity, low slippage, and advanced risk management tools.',
      tag: 'Highest Volume',
      stats: 'Up to 100x Leverage',
      icon: 'lucide:trending-up',
    },
    {
      id: 'spot',
      title: 'Spot Trading 📊',
      subtitle: 'Instant Execution & 300+ Pairs',
      desc: 'Buy, sell, and exchange top cryptocurrencies instantly. Benefit from ultra-low 0.05% trading fees, real-time depth orderbooks, and zero subscription costs.',
      tag: '300+ Pairs Listed',
      stats: '0.05% Ultra-Low Fees',
      icon: 'lucide:layers',
    },
    {
      id: 'copy',
      title: '1-Click Copy Trading ⚡️',
      subtitle: 'Follow Top Crypto Traders',
      desc: 'Replicate trades executed by top-performing master traders automatically. Transparent PnL performance history, win-rate tracking, and 1-click execution.',
      tag: 'Ideal for Beginners',
      stats: '92.4% Win Rate Master Traders',
      icon: 'lucide:zap',
    },
  ];

  const faqs = [
    {
      q: 'How do I start trading crypto on Pionex?',
      a: 'Simply click "Sign Up" to register your free account, complete quick identity verification, and deposit funds to start trading Spot and Futures markets immediately.'
    },
    {
      q: 'What are the trading fees on Pionex?',
      a: 'Pionex offers competitive ultra-low trading fees starting at 0.05% for both Spot and Futures trades with zero hidden subscription costs.'
    },
    {
      q: 'How do I claim the 10,000 USDT welcome rewards?',
      a: 'Register your account, complete identity verification, and fulfill beginner trading milestones in your account dashboard to unlock up to 10,000 USDT in trading fee rebates and bonus rewards.'
    },
    {
      q: 'How does Pionex guarantee fund security?',
      a: 'Pionex maintains a 100% Proof of Reserves (PoR) verified on-chain, storing 98% of client funds offline in multi-signature cold storage with US MSB regulatory compliance.'
    },
    {
      q: 'Can I start trading with a small capital amount?',
      a: 'Yes! You can start trading Spot and Futures contracts with as little as 10 USDT.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#FF4520] selection:text-white overflow-x-hidden">
      
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-[#FF4520] via-[#FF5533] to-[#FF4520] text-white py-2 px-4 text-center text-xs sm:text-sm font-medium flex items-center justify-center gap-2 shadow-sm">
        <span className="px-2 py-0.5 bg-black/20 text-white font-bold rounded text-xs border border-white/20">NEW</span>
        <span>Claim up to <strong>10,000 USDT</strong> in rewards upon registration & first trade!</span>
        <Link href="/signup" className="underline font-bold hover:text-gray-100 ml-1">Claim Rewards &rarr;</Link>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/images/logo/pionex-logo.png"
              alt="Pionex Logo"
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-gray-700">
            <Link href="#markets" className="hover:text-[#FF4520] transition-colors">Markets</Link>
            <Link href="#trading" className="hover:text-[#FF4520] transition-colors">Trading</Link>
            <Link href="#futures" className="hover:text-[#FF4520] transition-colors">Futures</Link>
            <Link href="#copy" className="hover:text-[#FF4520] transition-colors">Copy Trading</Link>
            <Link href="#security" className="hover:text-[#FF4520] transition-colors">Security</Link>
            <Link href="#faq" className="hover:text-[#FF4520] transition-colors">FAQ</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/signin"
            className="px-4 py-2 text-sm font-bold text-gray-800 hover:text-[#FF4520] hover:bg-gray-50 rounded-xl transition-all"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 text-sm font-bold text-white bg-[#FF4520] hover:bg-[#e03a17] rounded-xl shadow-lg shadow-[#FF4520]/25 hover:scale-[1.02] transition-all"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 px-4 lg:px-8 max-w-7xl mx-auto bg-white">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#FF4520]/8 rounded-full blur-[130px] pointer-events-none" />

        <div className="text-center max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF4520]/10 border border-[#FF4520]/20 text-xs sm:text-sm font-bold text-[#FF4520]">
            <Icon icon="lucide:shield-check" className="text-lg" />
            <span>World-Class Crypto Exchange & Professional Trading Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-tight">
            Trade Crypto 24/7 With <br />
            <span className="text-[#FF4520]">
              High Liquidity & Low Fees
            </span>
          </h1>

          <p className="text-gray-600 text-base sm:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            Buy, sell, and trade Futures & Spot crypto with ultra-low fees (0.05%), institutional security, and 1-click strategy copy.
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-[#FF4520] hover:bg-[#e03a17] rounded-xl shadow-xl shadow-[#FF4520]/25 hover:scale-105 transition-all text-center"
            >
              Start Trading Now
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-7 py-4 text-base font-bold text-gray-800 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl transition-all text-center"
            >
              Explore Markets &rarr;
            </Link>
          </div>

          {/* Metric Cards */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-gray-100 mt-12">
            <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
              <div className="text-2xl sm:text-3xl font-black text-gray-900">$100M+</div>
              <div className="text-xs sm:text-sm text-gray-500 font-medium mt-1">Monthly Trading Volume</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#FF4520]/5 border border-[#FF4520]/15">
              <div className="text-2xl sm:text-3xl font-black text-[#FF4520]">5,000,000+</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium mt-1">Global Active Traders</div>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
              <div className="text-2xl sm:text-3xl font-black text-gray-900">100%</div>
              <div className="text-xs sm:text-sm text-gray-500 font-medium mt-1">Proof of Reserves</div>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
              <div className="text-2xl sm:text-3xl font-black text-gray-900">0.05%</div>
              <div className="text-xs sm:text-sm text-gray-500 font-medium mt-1">Ultra-Low Trading Fees</div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Ticker Section (Black Contrast Section) */}
      <section id="markets" className="py-14 bg-[#0B0E11] text-white border-y border-gray-800 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FF4520]/15 text-[#FF4520] flex items-center justify-center">
                <Icon icon="lucide:activity" className="text-xl" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">Popular Crypto Trading Markets</h2>
                <p className="text-xs text-gray-400">Real-time crypto prices & deep orderbook liquidity</p>
              </div>
            </div>
            <Link href="/dashboard" className="text-xs sm:text-sm text-[#FF4520] hover:underline font-bold">
              View All Markets &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {marketData.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#161B22] border border-gray-800 hover:border-[#FF4520] transition-all group">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span className="font-bold text-white text-sm group-hover:text-[#FF4520] transition-colors">{item.coin}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">{item.vol}</span>
                </div>
                <div className="text-lg font-bold text-white mb-1">{item.price}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs font-bold ${item.isUp ? 'text-green-400' : 'text-red-400'}`}>
                    {item.change}
                  </span>
                  <Link href="/dashboard" className="text-xs px-2.5 py-1 rounded-lg bg-[#FF4520]/20 hover:bg-[#FF4520] text-[#FF4520] hover:text-white font-bold transition-all">
                    Trade Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trading Showcase */}
      <section id="trading" className="py-20 px-4 lg:px-8 max-w-7xl mx-auto bg-white">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            Professional Trading Solutions
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Advanced trading instruments designed for both novice and institutional traders with high speed execution.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center gap-3 mb-10">
          {tradingFeatures.map((b) => (
            <button
              key={b.id}
              onClick={() => setActiveTab(b.id as any)}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === b.id
                  ? 'bg-[#FF4520] text-white shadow-lg shadow-[#FF4520]/25'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {b.title}
            </button>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {tradingFeatures.map((feature) => (
            <div
              key={feature.id}
              className={`p-8 rounded-3xl bg-white border transition-all duration-300 flex flex-col justify-between ${
                activeTab === feature.id
                  ? 'border-[#FF4520] shadow-2xl shadow-[#FF4520]/15 scale-[1.02]'
                  : 'border-gray-200 hover:border-gray-300 shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF4520]/10 text-[#FF4520] flex items-center justify-center">
                    <Icon icon={feature.icon} className="text-2xl" />
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-[#FF4520]/10 text-[#FF4520] font-bold border border-[#FF4520]/20">
                    {feature.tag}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-xs font-bold text-[#FF4520] mb-4">{feature.subtitle}</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{feature.desc}</p>
              </div>

              <div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 mb-6 text-xs text-gray-600 flex items-center justify-between">
                  <span>Trading Metric</span>
                  <span className="font-bold text-green-600">{feature.stats}</span>
                </div>

                <Link
                  href="/signup"
                  className="w-full py-3.5 rounded-xl bg-[#FF4520] hover:bg-[#e03a17] text-white font-bold text-sm text-center block transition-all shadow-md shadow-[#FF4520]/20"
                >
                  Start Trading
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security & Fund Safeguard Section (Black Contrast Section) */}
      <section id="security" className="py-20 bg-[#0B0E11] text-white border-t border-gray-800 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20">
              <Icon icon="lucide:shield-check" className="text-sm" />
              <span>100% Proof of Reserves Guaranteed</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Fund Security — <br />
              <span className="text-[#FF4520]">Pionex’s Fundamental Principle</span>
            </h2>

            <p className="text-gray-400 text-base leading-relaxed">
              Your assets are backed 1:1 on-chain. We utilize institutional-grade multi-signature cold storage, automated risk management controls, and dual regulatory compliance licenses.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shrink-0 mt-0.5">✓</div>
                <div>
                  <h4 className="text-sm font-bold text-white">Public On-Chain Reserve Audit</h4>
                  <p className="text-xs text-gray-400">Regular Merkle tree proof of reserves updated monthly.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shrink-0 mt-0.5">✓</div>
                <div>
                  <h4 className="text-sm font-bold text-white">US MSB Regulatory Compliance</h4>
                  <p className="text-xs text-gray-400">Strict adherence to international financial security standards.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shrink-0 mt-0.5">✓</div>
                <div>
                  <h4 className="text-sm font-bold text-white">Bank-Grade Cold Wallet Vaults</h4>
                  <p className="text-xs text-gray-400">98% of client funds stored offline in encrypted multi-sig hardware vaults.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link href="/signup" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FF4520] hover:bg-[#e03a17] text-white font-bold text-sm shadow-lg shadow-[#FF4520]/20 transition-all">
                Learn Security Architecture &rarr;
              </Link>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[#161B22] border border-gray-800 shadow-2xl relative overflow-hidden">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <span className="text-sm text-gray-400">Reserve Coverage Ratio</span>
                <span className="text-lg font-bold text-green-400">100.00%</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <span className="text-sm text-gray-400">BTC Reserve Balance</span>
                <span className="text-sm font-bold text-white">12,450.80 BTC</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <span className="text-sm text-gray-400">ETH Reserve Balance</span>
                <span className="text-sm font-bold text-white">85,320.15 ETH</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <span className="text-sm text-gray-400">USDT Reserve Balance</span>
                <span className="text-sm font-bold text-white">250,000,000 USDT</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B0E11] border border-gray-800 text-center">
                <span className="text-xs text-gray-400 block mb-1">Status</span>
                <span className="text-sm font-bold text-[#FF4520] flex items-center justify-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  All Customer Funds Fully Backed 1:1
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 lg:px-8 max-w-4xl mx-auto bg-gray-50/50">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-base">
            Everything you need to know about trading on Pionex and getting started.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-xs transition-all">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-6 text-left font-bold text-gray-900 text-base sm:text-lg flex items-center justify-between gap-4 hover:text-[#FF4520] transition-colors"
              >
                <span>{faq.q}</span>
                <Icon
                  icon="lucide:chevron-down"
                  className={`text-xl text-[#FF4520] transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`}
                />
              </button>

              {openFaq === idx && (
                <div className="px-6 pb-6 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 px-4 lg:px-8 max-w-7xl mx-auto bg-white">
        <div className="rounded-3xl bg-gradient-to-r from-[#FF4520] via-[#FF5B37] to-[#FF4520] p-10 lg:p-16 text-white text-center relative overflow-hidden shadow-2xl shadow-[#FF4520]/25">
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              Ready to Start Trading Crypto?
            </h2>
            <p className="text-white/90 text-base sm:text-lg font-semibold">
              Join 5,000,000+ traders worldwide. Register today and claim up to 10,000 USDT in welcome rewards!
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="px-9 py-4 rounded-2xl bg-black hover:bg-gray-900 text-white font-bold text-base shadow-2xl hover:scale-105 transition-all"
              >
                Create Account & Claim Rewards
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-[#07090C] text-gray-400 py-14 px-4 lg:px-8 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <img
                src="/images/logo/pionex-logo.png"
                alt="Pionex Logo"
                className="h-8 w-auto object-contain brightness-125"
              />
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              World-class cryptocurrency trading and exchange platform. Ultra-low 0.05% trading fees, 100% proof of reserves, and institutional security.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 text-sm">Trading Solutions</h4>
            <ul className="space-y-2.5 text-gray-400">
              <li><Link href="/dashboard" className="hover:text-[#FF4520]">Futures Trading</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#FF4520]">Spot Trading</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#FF4520]">Copy Trading</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#FF4520]">Margin Trading</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 text-sm">Account & Rewards</h4>
            <ul className="space-y-2.5 text-gray-400">
              <li><Link href="/signin" className="hover:text-[#FF4520]">Log In</Link></li>
              <li><Link href="/signup" className="hover:text-[#FF4520]">Sign Up</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#FF4520]">10,000 USDT Rewards</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#FF4520]">User Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 text-sm">Security & Support</h4>
            <ul className="space-y-2.5 text-gray-400">
              <li><Link href="#security" className="hover:text-[#FF4520]">Proof of Reserves</Link></li>
              <li><Link href="#security" className="hover:text-[#FF4520]">Security Center</Link></li>
              <li><Link href="#faq" className="hover:text-[#FF4520]">FAQ & Tutorials</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>© 2026 Pionex Trading Platform. All rights reserved.</div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white">Privacy Policy</Link>
            <Link href="#" className="hover:text-white">Terms of Service</Link>
            <Link href="#" className="hover:text-white">Risk Disclosure</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
