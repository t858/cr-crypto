import Link from 'next/link'

const Simple = () => {
  return (
    <section className='bg-simple-bg relative before:absolute before:w-full before:h-full before:bg-arrow-bg before:bg-no-repeat before:top-10'>
      <div className=''>
        <div className='container relative z-10'>
          <div className='max-w-2xl mx-auto'>
            <h2 className='text-center font-semibold mb-6 sm:leading-16 capitalize'>
              Copy Elite Traders. Automate Your Profits.
            </h2>
            <p className='text-center text-lightpurple text-lg font-normal mb-8'>
              Join the world's most trusted copy trading platform. Mirror expert trades automatically and watch your portfolio grow — no trading experience required.
            </p>
          </div>
          <div className='flex justify-center '>
            <Link
              href={'/signup'}
              className='text-xl font-semibold text-white py-4 px-6 lg:px-12 bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary rounded-xl cursor-pointer'>
              Start Copy Trading
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Simple
