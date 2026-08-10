import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import './globals.css'
import Aoscompo from '@/lib/utils/aos'
import ScrollToTop from './components/scroll-to-top'
import Header from './components/layout/header'
import Footer from './components/layout/footer'
import AuthProvider from './components/auth/AuthProvider'
const font = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: "Pionex | Professional Crypto Trading & Exchange Platform",
    template: "%s | Pionex",
  },
  description: "World-Class Crypto Exchange & Professional Trading Platform - Pionex",
  icons: {
    icon: "/images/logo/pionex-logo.png",
    shortcut: "/images/logo/pionex-logo.png",
    apple: "/images/logo/pionex-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${font.className}`}>
        <AuthProvider>
          <Aoscompo>
            <Header />
            {children}
            <Footer />
          </Aoscompo>
          <ScrollToTop />
        </AuthProvider>
      </body>
    </html>
  )
}
