"use client";

import { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

type Article = {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    image: string;
    time: string;
    author: string;
};

const MOCK_NEWS: Article[] = [
    {
        id: "1",
        title: "Bitcoin Surges Past $65,000 Following New ETF Approvals",
        excerpt: "Institutional demand continues to drive the market as major funds pour capital into recently approved Bitcoin Exchange Traded Funds.",
        category: "Markets",
        image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=800&auto=format&fit=crop",
        time: "2 hours ago",
        author: "Sarah Jenkins"
    },
    {
        id: "2",
        title: "Ethereum's 'Dencun' Upgrade Successfully Deployed on Testnet",
        excerpt: "Developers confirm the massive upgrade aiming to reduce Layer 2 rollup fees has been successfully tested ahead of mainnet launch.",
        category: "Technology",
        image: "https://images.unsplash.com/photo-1622736468798-e7c5abdbf572?q=80&w=800&auto=format&fit=crop",
        time: "5 hours ago",
        author: "Michael Chang"
    },
    {
        id: "3",
        title: "Solana Network Hits Record High TPS Amid Network Congestion Queries",
        excerpt: "Despite recent outages, the Solana blockchain processed a record number of transactions this week driven by meme coin trading.",
        category: "Altcoins",
        image: "https://images.unsplash.com/photo-1639815188546-c43c240ff4df?q=80&w=800&auto=format&fit=crop",
        time: "8 hours ago",
        author: "David Ross"
    },
    {
        id: "4",
        title: "New Regulatory Framework Proposed for USD-Backed Stablecoins",
        excerpt: "Global finance ministers draft comprehensive guidelines for systemic stablecoins to prevent future de-pegging events.",
        category: "Regulation",
        image: "https://images.unsplash.com/photo-1621504450181-5d356f61d307?q=80&w=800&auto=format&fit=crop",
        time: "Yesterday",
        author: "Elena Rodriguez"
    },
    {
        id: "5",
        title: "DeFi TVL Crosses $100 Billion Mark for First Time Since 2022",
        excerpt: "Yield farming and liquid staking protocols see a massive resurgence as overall market sentiment flips extremely bullish.",
        category: "DeFi",
        image: "https://images.unsplash.com/photo-1639762681485-074b7f4ec651?q=80&w=800&auto=format&fit=crop",
        time: "Yesterday",
        author: "Alex Thompson"
    },
    {
        id: "6",
        title: "Institutional Adoption of Crypto Accelerates Globally",
        excerpt: "Major banks and financial institutions are finally integrating cryptocurrency custody and settlement systems into their core offerings.",
        category: "Adoption",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
        time: "2 days ago",
        author: "Marcus Wei"
    }
];

const CATEGORIES = ["All News", "Markets", "Technology", "Altcoins", "Regulation", "DeFi", "NFTs"];

export default function NewsPage() {
    const [activeCategory, setActiveCategory] = useState("All News");

    const filteredNews = activeCategory === "All News"
        ? MOCK_NEWS
        : MOCK_NEWS.filter(article => article.category === activeCategory);

    const featuredArticle = filteredNews[0];
    const regularArticles = filteredNews.slice(1);

    return (
        <div className="w-full flex flex-col min-h-full pb-20 lg:pb-0 bg-[#111315]">
            {/* Header Section */}
            <div className="bg-[#1b1e22] border-b border-white/5 py-8 px-4 lg:px-8">
                <div className="max-w-[1200px] mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Icon icon="lucide:globe" className="text-[#1e88e5]" />
                        Crypto Insight Daily
                    </h1>
                    <p className="text-gray-400 text-sm max-w-xl leading-relaxed">
                        Stay ahead of the market with the latest happenings, deep-dives, and regulatory updates across the global cryptocurrency ecosystem.
                    </p>

                    {/* Category Filter */}
                    <div className="flex gap-2 overflow-x-auto custom-scrollbar mt-6 pb-2">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${activeCategory === cat
                                        ? "bg-[#1e88e5] text-white border-[#1e88e5]"
                                        : "bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="p-4 lg:p-8 max-w-[1200px] mx-auto w-full">

                {filteredNews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <Icon icon="lucide:newspaper" className="text-6xl mb-4 opacity-50" />
                        <h2 className="text-xl font-bold text-white mb-2">No Articles Found</h2>
                        <p>No recent news available for the "{activeCategory}" category.</p>
                        <button
                            onClick={() => setActiveCategory("All News")}
                            className="mt-6 text-[#1e88e5] hover:text-white underline transition-colors"
                        >
                            View All News
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Featured Article (Full width card) */}
                        {featuredArticle && (
                            <div className="mb-8 bg-[#1b1e22] rounded-2xl border border-white/5 overflow-hidden flex flex-col lg:flex-row group cursor-pointer hover:border-white/10 transition-colors">
                                <div className="lg:w-2/3 h-[300px] lg:h-[400px] relative overflow-hidden">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                                    <img
                                        src={featuredArticle.image}
                                        alt={featuredArticle.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                    <div className="absolute top-4 left-4 z-20">
                                        <span className="bg-[#1e88e5] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                            Featured • {featuredArticle.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="lg:w-1/3 p-6 lg:p-8 flex flex-col justify-center bg-gradient-to-br from-[#1b1e22] to-[#16181b]">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-4 uppercase tracking-wider">
                                        <Icon icon="lucide:clock" className="text-sm" />
                                        {featuredArticle.time}
                                    </div>
                                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 group-hover:text-[#1e88e5] transition-colors leading-tight">
                                        {featuredArticle.title}
                                    </h2>
                                    <p className="text-gray-400 leading-relaxed mb-6 flex-1">
                                        {featuredArticle.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#111315] border border-white/10 flex items-center justify-center text-xs font-bold text-white">
                                                {featuredArticle.author.charAt(0)}
                                            </div>
                                            <span className="text-sm font-medium text-gray-300">{featuredArticle.author}</span>
                                        </div>
                                        <button className="text-[#1e88e5] group-hover:text-white transition-colors">
                                            <Icon icon="lucide:arrow-right" className="text-xl -rotate-45 group-hover:rotate-0 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Grid of Articles */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {regularArticles.map(article => (
                                <div key={article.id} className="bg-[#1b1e22] rounded-xl border border-white/5 overflow-hidden flex flex-col group cursor-pointer hover:border-white/10 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                                    <div className="h-[200px] relative overflow-hidden">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                        />
                                        <div className="absolute top-3 left-3 z-20">
                                            <span className="bg-black/60 backdrop-blur-sm border border-white/10 text-gray-200 text-xs font-semibold px-2.5 py-1 rounded-md tracking-wide">
                                                {article.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-3">
                                            <Icon icon="lucide:clock" />
                                            {article.time}
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#1e88e5] transition-colors leading-snug line-clamp-2">
                                            {article.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
                                            {article.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                                            <span className="text-xs font-medium text-gray-500">{article.author}</span>
                                            <button className="text-gray-400 group-hover:text-[#1e88e5] transition-colors">
                                                <Icon icon="lucide:bookmark" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredNews.length > 0 && (
                            <div className="mt-12 flex justify-center">
                                <button className="bg-transparent border border-[#1e88e5] text-white hover:bg-[#1e88e5]/10 font-bold py-3 px-8 rounded-full transition-colors text-sm tracking-wide">
                                    Load More Articles
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
