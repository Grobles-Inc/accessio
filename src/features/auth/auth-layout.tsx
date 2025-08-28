import Logo from '@/assets/logo.png'
import { Link } from '@tanstack/react-router'

interface Props {
  children: React.ReactNode
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className='dark:bg-zinc-900 bg-zinc-100 container grid h-svh max-w-none items-center justify-center'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8'>
        <div className='mb-4 flex items-center justify-center'>
          <Link to='/' className='flex items-center'>
            <img src={Logo} alt='Accessio' className='md:h-30 h-20 w-auto dark:invert' />
            <span className='lg:text-3xl text-2xl font-bold'>Accessio</span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
