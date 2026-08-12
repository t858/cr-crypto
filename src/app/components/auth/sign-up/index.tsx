'use client'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import SocialSignUp from '../SocialSignUp'
import Logo from '../../layout/header/logo'
import { Icon } from '@iconify/react/dist/iconify.js'

const SignUp = () => {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const validatePassword = (pwd: string) => {
    if (!pwd || pwd.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/[A-Z]/.test(pwd)) {
      return "Password must contain at least 1 uppercase capital letter.";
    }
    if (!/[0-9]/.test(pwd)) {
      return "Password must contain at least 1 number.";
    }
    if (!/[^A-Za-z0-9]/.test(pwd)) {
      return "Password must contain at least 1 special character (e.g. @, $, _, !, etc.).";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Enforce Password Validation Rules before account creation
    const pwdError = validatePassword(password);
    if (pwdError) {
      toast.error(pwdError, { duration: 5000 });
      return;
    }

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
        if (signupRes.status === 409 || signupData.message?.toLowerCase().includes("email")) {
          toast.error("Email already in use");
        } else {
          toast.error(signupData.message || 'Sign up failed.');
        }
        setLoading(false);
        return;
      }

      toast.success("User account has been successfully created!");

      // 2. Sign them in immediately using NextAuth credentials provider
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (res?.error) {
        toast.error('Account created! Please sign in.')
        router.push('/signin')
      } else {
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
        <div className='mb-[22px] relative'>
          <input
            type={showPassword ? "text" : "password"}
            placeholder='Password'
            name='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='w-full rounded-md border border-white/20 border-solid bg-transparent pl-5 pr-12 py-3 text-base text-dark outline-hidden transition placeholder:text-grey focus:border-primary focus-visible:shadow-none text-white'
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <Icon icon={showPassword ? "lucide:eye-off" : "lucide:eye"} className="text-xl" />
          </button>
          <p className="text-[11px] text-gray-400 mt-2 pl-1">
            Must be at least 8 characters with at least 1 capital letter, 1 number, and 1 special char (e.g. @, $, _, !).
          </p>
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
