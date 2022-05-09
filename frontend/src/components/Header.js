import { useState, useEffect } from 'react'
import useAxios from '../hooks/useAxios'

import Search from './Search'
import Nav from './Nav'
import ScrollDown from './ScrollDown'

const Header = () => {
  const [data, setData] = useState('')

  const { response } = useAxios({
    method: 'get',
    url: '/settings'
  })

  useEffect(() => {
    if (response !== null) {
      setData(response)
    }
  }, [response])

  return (
    <header
      id='hero'
      className='relative bg-fixed bg-center bg-cover'
      style={{
        backgroundImage: `url("/assets/img/header-bg-1.webp")`
      }}
    >
      <Nav />

      {/* Overlay layer */}
      <div className='bg-gray-800 bg-opacity-90'>
        <div className='container mx-auto ltr'>
          {/* Search form and main hero */}
          <main className='flex flex-col items-center justify-center min-h-screen'>
            <h1 className='px-2 mb-24 text-lg font-bold leading-loose text-center text-white select-none xl:text-3xl sm:text-xl md:text-4xl rtl'>
              <span className='inline-flex h-20 pt-2 overflow-x-hidden animate-type whitespace-nowrap'>
                {data ? data.appTagline : 'نحن الأفضل، كنا ولازلنا وسنبقى كذلك...للأبد'}
              </span>
              <span className='box-border inline-block w-1 h-10 ml-2 -mb-2 bg-white md:-mb-4 md:h-16 animate-cursor'></span>
            </h1>

            <Search />

            <ScrollDown target='menu' />
          </main>
        </div>
      </div>

      {/* Wavey saprator svg */}
      <div className='absolute min-w-full overflow-hidden -bottom-1'>
        <svg
          data-name='Layer 1'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 1200 120'
          preserveAspectRatio='none'
          className='transition-colors fill-gray-200 dark:fill-gray-800'
        >
          <path d='M 0 11 L 24 18.3 C 48 26 96 40 144 49.5 C 192 59 240 62 288 58.7 C 336 55 384 44 432 47.7 C 480 51 528 70 576 77 C 624 84 672 81 720 75.2 C 768 70 816 62 864 49.5 C 912 37 960 18 1008 25.7 C 1056 33 1104 66 1152 77 C 1200 88 1248 77 1296 60.5 C 1344 44 1392 22 1440 12.8 C 1488 4 1536 7 1584 18.3 C 1632 29 1680 48 1728 62.3 C 1776 77 1824 88 1872 77 C 1920 66 1968 33 2016 29.3 C 2064 26 2112 51 2160 64.2 C 2208 77 2256 77 2304 78.8 C 2352 81 2400 84 2448 80.7 C 2496 77 2544 66 2592 60.5 C 2640 55 2688 55 2736 45.8 C 2784 37 2832 18 2880 20.2 C 2928 22 2976 44 3024 45.8 C 3072 48 3120 29 3168 22 C 3216 15 3264 18 3312 16.5 C 3360 15 3408 7 3432 3.7 L 3456 0 L 3455 229 L 0 248 Z'></path>
        </svg>
      </div>
    </header>
  )
}

export default Header
