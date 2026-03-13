'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'

const Banner = () => {
  return (
    <section className='relative pb-0' id='home-section'>
      <div className='bg-banner-image absolute w-full h-full top-0 blur-390'></div>
      <div className='overflow-hidden'>
        <div className='container lg:pt-32 pt-20 relative'>
          <div className='relative z-10'>
            <div className='grid grid-cols-1 lg:grid-cols-12 my-16 items-center'>
              <div className='lg:col-span-7 mb-16'>
                <h1 className='mb-5 lg:text-start text-center sm:leading-snug leading-tight capitalize'>
                  Copy Expert Traders. <br /> <span className='text-[#D97706]'>Earn Like the Pros</span>
                </h1>
                <p className='text-gray-400 font-normal mb-8 max-w-[85%] lg:text-start text-center lg:mx-0 mx-auto'>
                  Mirror the trades of our elite crypto traders and grow your portfolio automatically. Join thousands of successful copiers today.
                </p>

                <div className='flex items-center gap-10 mb-10 justify-center lg:justify-start'>
                  <div>
                    <h3 className='text-white text-3xl font-bold'>$300k+</h3>
                    <p className='text-gray-500 text-sm'>Trader Profits</p>
                  </div>
                  <div>
                    <h3 className='text-green-500 text-3xl font-bold'>68%</h3>
                    <p className='text-gray-500 text-sm'>Success Rate</p>
                  </div>
                  <div>
                    <h3 className='text-white text-3xl font-bold'>1K+</h3>
                    <p className='text-gray-500 text-sm'>Active Copiers</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start" data-aos="fade-up" data-aos-duration="1400">
                  <Link href="/signin" className="bg-[#1e88e5] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#1565c0] hover:shadow-[0_0_20px_rgba(30,136,229,0.4)] transition-all duration-300 w-full sm:w-auto text-center border-2 border-[#1e88e5]">
                    Start Trading Now
                  </Link>
                  <Link
                    href='/signin'
                    className='bg-transparent border border-border py-4 px-8 rounded-full flex justify-center items-center text-white cursor-pointer hover:bg-white/5 transition-colors gap-2 font-semibold w-full sm:w-auto'>
                    <Icon icon='lucide:award' className='text-xl text-[#D97706]' />
                    <span>View Top Traders</span>
                  </Link>
                </div>
              </div>
              <div className='relative lg:col-span-5 lg:-m-48 -m-20 z-10 hidden lg:block'>

                {/* Floating Card 1: Top Right */}
                <div className='absolute top-44 right-20 z-20 animate-float bg-[#111111] border border-border rounded-xl p-4 shadow-2xl flex items-center justify-between gap-6 w-72'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-lg bg-[#D97706]/20 flex items-center justify-center text-[#D97706]'>
                      <Icon icon='lucide:bar-chart-2' className='text-xl' />
                    </div>
                    <div>
                      <p className='text-white font-semibold text-sm'>Live Portfolio</p>
                      <p className='text-gray-400 text-xs text-start'>Demo Account</p>
                    </div>
                  </div>
                  <div className='bg-[#052e16] text-[#22c55e] px-2 py-1 rounded-full text-xs font-semibold'>
                    +24.7%
                  </div>
                </div>

                {/* Floating Card 2: Mid Left */}
                <div className='absolute top-72 left-24 z-20 animate-float-delayed bg-[#0a0a0a] border border-border rounded-xl p-3 shadow-2xl flex items-center gap-3 w-56'>
                  <div className='w-10 h-10 rounded-full bg-[#052e16] flex items-center justify-center text-[#22c55e]'>
                    <Icon icon='lucide:trending-up' className='text-lg' />
                  </div>
                  <div>
                    <p className='text-white font-semibold text-sm'>BTC Long +12.4%</p>
                    <p className='text-gray-400 text-xs text-start'>Just now</p>
                  </div>
                </div>

                {/* Floating Card 3: Bottom Right */}
                <div className='absolute bottom-32 right-28 z-20 animate-float bg-[#0a0a0a] border border-border rounded-xl p-3 shadow-2xl flex items-center gap-3 w-52'>
                  <div className='w-10 h-10 rounded-full bg-[#78350f] flex items-center justify-center text-[#d97706]'>
                    <Icon icon='lucide:coins' className='text-lg' />
                  </div>
                  <div>
                    <p className='text-white font-semibold text-sm'>+$2,340 Profit</p>
                    <p className='text-gray-400 text-xs text-start'>ETH Trade Closed</p>
                  </div>
                </div>

                <Image
                  src='/images/banner/banner.png'
                  alt='trading dashboard'
                  width={1013}
                  height={760}
                  className='relative z-10'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Banner
