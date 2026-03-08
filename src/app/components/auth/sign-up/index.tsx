'use client'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import SocialSignUp from '../SocialSignUp'
import Logo from '../../layout/header/logo'
import Loader from '../../shared/Loader'

const SignUp = () => {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // 1. Create the user
      const signupRes = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const signupData = await signupRes.json();

      if (!signupRes.ok) {
        toast.error(signupData.message || 'Sign up failed.');
        setLoading(false);
        return;
      }

      // 2. Sign them in immediately using NextAuth credentials provider
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (res?.error) {
        toast.error('Sign in after registration failed.')
      } else {
        toast.success('Account created successfully!')
        router.push('/dashboard')
      }
    } catch (error) {
      toast.error('An error occurred during sign up')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className='mb-10 text-center mx-auto inline-block max-w-[160px]'>
        <Logo />
      </div>

      <SocialSignUp />

      <span className='my-8 flex items-center justify-center text-center'>
        <span className='flex-grow border-t border-white/20'></span>
        <span className='mx-4 text-base text-white'>OR</span>
        <span className='flex-grow border-t border-white/20'></span>
      </span>

      <form onSubmit={handleSubmit}>
        <div className='mb-[22px]'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className='w-full rounded-md border border-white/20 border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition placeholder:text-grey focus:border-primary focus-visible:shadow-none text-white'
          />
        </div>
        <div className='mb-[22px]'>
          <input
            type='email'
            placeholder='Email'
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='w-full rounded-md border border-white/20 border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition placeholder:text-grey focus:border-primary focus-visible:shadow-none text-white'
          />
        </div>
        <div className='mb-[22px]'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='w-full rounded-md border border-white/20 border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition placeholder:text-grey focus:border-primary focus-visible:shadow-none text-white'
          />
        </div>
        <div className='mb-9'>
          <button
            type='submit'
            disabled={loading}
            className='flex w-full items-center text-lg text-black font-medium justify-center rounded-md bg-primary px-5 py-3 transition duration-300 ease-in-out hover:bg-transparent hover:text-primary border-primary border cursor-pointer disabled:opacity-50'>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </div>
      </form>

      <p className='text-body-secondary mb-4 text-white text-base'>
        By creating an account you are agree with our{' '}
        <a href='/#' className='text-primary hover:underline'>
          Privacy
        </a>{' '}
        and{' '}
        <a href='/#' className='text-primary hover:underline'>
          Policy
        </a>
      </p>

      <p className='text-body-secondary text-white text-base'>
        Already have an account?
        <Link href='/signin' className='pl-2 text-primary hover:underline'>
          Sign In
        </Link>
      </p>
    </>
  )
}

export default SignUp
