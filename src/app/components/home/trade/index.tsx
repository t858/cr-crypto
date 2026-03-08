import Image from 'next/image'

const Trade = () => {
  return (
    <section className='overflow-hidden'>
      <div className='container relative'>
        <div className='bg-linear-to-r from-primary to-secondary hidden lg:block absolute w-full h-full top-1/2  blur-390'></div>
        <div className='grid lg:grid-cols-2 gap-x-5 items-center relative z-10'>
          <div>
            <Image
              src={'/images/trade/macbook.png'}
              alt='macBook-image'
              width={787}
              height={512}
            />
          </div>
          <div className='flex flex-col gap-7'>
            <h2 className='font-semibold text-center sm:text-start max-w-96 leading-14'>
              Copy Trades Anywhere, Anytime
            </h2>
            <p className='lg:text-lg font-normal text-lightblue text-center sm:text-start'>
              Monitor your copy trading portfolio on the go with our secure, mobile-friendly platform. Track expert performances, manage your investments, and stay connected to the market 24/7 — no limits, no downtime.
            </p>
            <div className='flex justify-between'>
              <Image
                src={'/images/trade/mac.svg'}
                alt='macOS-image'
                width={61}
                height={105}
              />
              <div className='verticalLine'></div>
              <Image
                src={'/images/trade/appstore.svg'}
                alt='appstore-image'
                width={80}
                height={105}
              />
              <div className='verticalLine'></div>
              <Image
                src={'/images/trade/windows.svg'}
                alt='windows-image'
                width={80}
                height={105}
              />
              <div className='verticalLine'></div>
              <Image
                src={'/images/trade/android.svg'}
                alt='android-image'
                width={71}
                height={105}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Trade
