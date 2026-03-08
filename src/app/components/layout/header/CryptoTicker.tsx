import React from 'react';

const tickerData = [
    { symbol: 'ETH', price: '$3,842', change: '+2.37%', isPositive: true },
    { symbol: 'SPY', price: '$512.45', change: '+0.83%', isPositive: true },
    { symbol: 'EUR/USD', price: '1.0834', change: '-0.11%', isPositive: false },
    { symbol: 'SOL', price: '$142.56', change: '+6.19%', isPositive: true },
    { symbol: 'NVDA', price: '$892.34', change: '+2.70%', isPositive: true },
    { symbol: 'BTC', price: '$67,423', change: '+1.86%', isPositive: true },
];

export const CryptoTicker = () => {
    return (
        <div className="w-full bg-[#080808] border-b border-border py-2 text-xs font-semibold text-gray-400">
            <div className="ticker-wrap w-full flex overflow-hidden">
                <div className="ticker">
                    {/* Render three groups to ensure smooth looping animation */}
                    {[1, 2, 3].map((group) => (
                        <div key={group} className="flex shrink-0 items-center justify-around gap-12 pr-12 w-full">
                            {tickerData.map((item, index) => (
                                <div key={`${group}-${index}`} className="flex items-center gap-3">
                                    <span className="text-gray-300">{item.symbol}</span>
                                    <span className="text-white">{item.price}</span>
                                    <span className={item.isPositive ? 'text-green-500' : 'text-red-500'}>
                                        {item.change}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
