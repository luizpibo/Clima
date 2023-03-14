import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Image from 'next/image'
export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className='relative min-h-screen w-full bg-slate-600'>
      <Image src="/Background.png" fill alt='Background' objectFit='cover' className='z-0' />
      <div className='grid items-center justify-center z-10 relative min-h-screen w-full'>
        <Component {...pageProps} />
      </div>
    </div>
  )
}
