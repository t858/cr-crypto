'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import HeaderLink from './navigation/HeaderLink'
import MobileHeaderLink from './navigation/MobileHeaderLink'
import Logo from './logo'
import { HeaderItem } from '@/app/types/menu'
import { CryptoTicker } from './CryptoTicker'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

const Header: React.FC = () => {
  const [navbarOpen, setNavbarOpen] = useState(false)
  const [sticky, setSticky] = useState(false)
  const [navlink, setNavLink] = useState<HeaderItem[]>([])
  const { data: session } = useSession()

  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/page-data')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setNavLink(data.Headerdata)
      } catch (error) {
        console.error('Error fetching service', error)
      }
    }
    fetchData()
  }, [])

  const handleScroll = () => {
    setSticky(window.scrollY >= 10)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target as Node) &&
      navbarOpen
    ) {
      setNavbarOpen(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [navbarOpen])

  const pathname = usePathname()

  useEffect(() => {
    if (navbarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [navbarOpen])

  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/signin') || pathname?.startsWith('/signup')) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 z-40 w-full transition-all duration-300 ${sticky
        ? 'shadow-lg bg-body-bg'
        : 'shadow-none'
        }`}>
      <CryptoTicker />
      <div className={`transition-all duration-300 ${sticky ? 'py-4' : 'py-6'}`}>
        <div className='container flex items-center justify-between'>
          <Logo />
          <nav className='hidden lg:flex grow items-center gap-8 justify-center ml-14'>
            {navlink.map((item, index) => (
              <HeaderLink key={index} item={item} />
            ))}
          </nav>
          <div className='flex items-center gap-4'>
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm text-gray-300 font-medium">Markets Open</span>
            </div>
            <button aria-label="Toggle Theme" className="hidden lg:flex items-center justify-center p-2 rounded-lg hover:bg-white/10 text-gray-300 transition-colors">
              <Icon icon="lucide:sun" className="text-xl" />
            </button>

            <Link
              href='/signin'
              className='hidden lg:block text-gray-300 hover:text-white transition-colors duration-300 px-4 py-2'>
              Sign In
            </Link>
            <Link
              href='/signup'
              className='hidden lg:flex items-center justify-center bg-[#D97706] hover:bg-[#B45309] text-white duration-300 px-6 py-2.5 rounded-lg font-medium transition-colors'>
              Start Trading
            </Link>

            <button
              onClick={() => setNavbarOpen(!navbarOpen)}
              className='block lg:hidden p-2 rounded-lg'
              aria-label='Toggle mobile menu'>
              <span className='block w-6 h-0.5 bg-white'></span>
              <span className='block w-6 h-0.5 bg-white mt-1.5'></span>
              <span className='block w-6 h-0.5 bg-white mt-1.5'></span>
            </button>
          </div>
        </div>
        {navbarOpen && (
          <div className='fixed top-0 left-0 w-full h-full bg-black/50 z-40' />
        )}
        <div
          ref={mobileMenuRef}
          className={`lg:hidden fixed top-0 right-0 h-full w-full bg-[#11062b] shadow-lg transform transition-transform duration-300 max-w-xs ${navbarOpen ? 'translate-x-0' : 'translate-x-full'
            } z-50`}>
          <div className='flex items-center justify-between p-4'>
            <h2 className='text-lg font-bold text-white'>
              <Logo />
            </h2>
            <button
              onClick={() => setNavbarOpen(false)}
              className='hover:cursor-pointer'
              aria-label='Close menu Modal'>
              <Icon
                icon='tabler:x'
                className='text-white text-xl hover:text-primary text-24 inline-block me-2'
              />
            </button>
          </div>
          <nav className='flex flex-col items-start p-4 text-white'>
            {navlink.map((item, index) => (
              <MobileHeaderLink key={index} item={item} />
            ))}
            <div className='mt-4 flex flex-col space-y-4 w-full'>
              <Link
                href='/signin'
                className='bg-transparent border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white text-center font-semibold'
                onClick={() => setNavbarOpen(false)}>
                Sign In
              </Link>
              <Link
                href='/signup'
                className='bg-primary text-black px-4 py-2 rounded-lg hover:bg-transparent border border-primary hover:text-primary text-center font-semibold'
                onClick={() => setNavbarOpen(false)}>
                Start Trading
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
