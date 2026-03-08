import { NextResponse } from 'next/server'

import { HeaderItem } from '@/app/types/menu'
import { SocialType } from '@/app/types/sociallink'
import { FooterType } from '@/app/types/footerlink'
import { WorkType } from '@/app/types/work'
import { FeatureType } from '@/app/types/features'
import { FaqType } from '@/app/types/faq'

const Headerdata: HeaderItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Copy Trading', href: '/#exchange-section' },
  { label: 'How It Works', href: '/#features-section' },
  { label: 'FAQ', href: '/#faq-section' },
  { label: 'Contact Us', href: '/#contact' },
]

const Companiesdata: { imgSrc: string }[] = [
  {
    imgSrc: '/images/companies/birdseye.svg',
  },
  {
    imgSrc: '/images/companies/break.svg',
  },
  {
    imgSrc: '/images/companies/keddar.svg',
  },
  {
    imgSrc: '/images/companies/shield.svg',
  },
  {
    imgSrc: '/images/companies/tandov.svg',
  },
  {
    imgSrc: '/images/companies/tree.svg',
  },
]

const workdata: WorkType[] = [
  {
    imgSrc: '/images/work/icon-one.svg',
    heading: 'Connect Your Wallet',
    subheading:
      'Link your crypto wallet securely to our platform. Our encrypted connection ensures your assets remain safe while you browse expert traders.',
  },
  {
    imgSrc: '/images/work/icon-two.svg',
    heading: 'Choose a Master Trader',
    subheading:
      'Browse our verified elite traders, review their performance history, win rates, and risk scores. Select the expert that matches your investment goals.',
  },
  {
    imgSrc: '/images/work/icon-three.svg',
    heading: 'Copy Their Trades',
    subheading:
      'Enable auto-copy and watch as trades are automatically executed in your account. Set your investment amount and let our professionals trade for you.',
  },
]

const Featuresdata: FeatureType[] = [
  {
    imgSrc: '/images/features/featureOne.svg',
    heading: 'Auto-Copy Trading',
    subheading:
      'Our intelligent auto-copy system replicates expert trades in real-time. Set your preferences and let our elite traders grow your portfolio.',
  },
  {
    imgSrc: '/images/features/featureTwo.svg',
    heading: 'Verified Expert Traders',
    subheading:
      'Browse through rigorously vetted professional traders. View detailed performance metrics, risk scores, and verified track records.',
  },
  {
    imgSrc: '/images/features/featureThree.svg',
    heading: 'Real-Time Trade Replication',
    subheading:
      'Every move is copied instantly as our experts trade. Get the same results as the pros with our lightning-fast execution technology.',
  },
]

const Faqdata: FaqType[] = [
  {
    heading: '1. What is copy trading?',
    subheading:
      'Copy trading allows you to automatically replicate the trades of experienced, verified traders. When you enable auto-copy, every position they open is instantly duplicated in your account proportionally to your investment amount.',
  },
  {
    heading: '2. How do I choose the best trader to copy?',
    subheading:
      'Our platform provides detailed performance analytics for each expert trader including win rate, average return, risk score, and trading history. You can filter by asset class, risk tolerance, and performance timeframe to find the perfect match.',
  },
  {
    heading: '3. Is copy trading safe?',
    subheading:
      'While our expert traders have proven track records, all trading involves risk. We provide risk management tools including automatic stop-loss settings, position limits, and the ability to pause or stop copying at any time. You maintain full control of your funds.',
  },
]

const Sociallinkdata: SocialType[] = [
  { imgsrc: '/images/footer/insta.svg', href: '#' },
  { imgsrc: '/images/footer/dribble.svg', href: '#' },
  { imgsrc: '/images/footer/twitter.svg', href: '#' },
  { imgsrc: '/images/footer/youtube.svg', href: '#' },
]

const Footerlinkdata: FooterType[] = [
  { label: 'Home', href: '/' },
  { label: 'Copy Trading', href: '/#exchange-section' },
  { label: 'How It Works', href: '/#features-section' },
  { label: 'FAQ', href: '/#faq-section' },
  { label: 'Contact Us', href: '/#contact' },
]

export const GET = async () => {
  return NextResponse.json({
    Headerdata,
    Companiesdata,
    workdata,
    Featuresdata,
    Faqdata,
    Sociallinkdata,
    Footerlinkdata,
  })
}
