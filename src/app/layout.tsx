import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import './globals.css'
import Aoscompo from '@/lib/utils/aos'
import ScrollToTop from './components/scroll-to-top'
import Header from './components/layout/header'
import Footer from './components/layout/footer'
import AuthProvider from './components/auth/AuthProvider'
import ToasterContext from '@/app/api/contex/ToasetContex'
const font = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: "Pionex | Professional Crypto Trading & Exchange Platform",
    template: "%s | Pionex",
  },
  description: "World-Class Crypto Exchange & Professional Trading Platform - Pionex",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.png" type="image/png" sizes="any" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${font.className}`}>
        <AuthProvider>
          <ToasterContext />
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
