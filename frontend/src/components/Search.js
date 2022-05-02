import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import useAxios from '../hooks/useAxios'
import useEventListener from '../hooks/useEventListener'

import { removeSlug } from '../functions/slug'

const Search = () => {
  const [search, setSearch] = useState('')
  const [data, setData] = useState('')

  const { ...response } = useAxios({
    method: 'get',
    url: '/foods/1/0'
  })

  useEffect(() => {
    if (response.response !== null) {
      setData(response.response.response)
    }
  }, [response.response])

  let searchable = {}

  //looping through results, and adding food names to searchable object[key] = value
  data && data.map(food => (searchable[food._id] = food.foodName))
  const foodItems = Object.entries(searchable)

  const searchWrapper = document.querySelector('.search__wrapper')

  useEventListener('click', e => {
    // when clicking outside search input
    if (e.target.id !== 'search') searchWrapper?.classList.remove('opacity-100')
  })

  const handleSearch = e => {
    e.preventDefault()
    window.location.href = `/view/item/${search}`
  }

  return (
    <form method='post' className='relative z-10 w-full' onSubmit={handleSearch}>
      <input
        type='search'
        id='search'
        className='text-2xl font-[600] p-5 pl-16 sm:pl-28 w-[inherit] text-black outline-orange-400 outline-offset-2 rtl bg-neutral-200 dark:bg-neutral-300'
        placeholder='ابحث عن طعامك المفضل'
        onChange={e => (e.target.value.trim() ? setSearch(e.target.value.trim()) : '')}
        onKeyUp={e => {
          const searchValue = e.target.value.trim()

          searchValue.length > 0
            ? searchWrapper?.classList.add('opacity-100', 'pointer-events-auto')
            : searchWrapper?.classList.remove('opacity-100', 'pointer-events-auto')
        }}
      />
      <button
        type='submit'
        role='search'
        aria-label='search'
        title='search'
        className='absolute top-0 bottom-0 left-0 flex items-center justify-center w-20'
      >
        <svg
          className='w-8'
          viewBox='0 0 40 40'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M39.5112 37.155L28.1363 25.78C30.3397 23.0584 31.6663 19.6 31.6663 15.8334C31.6663 7.10336 24.563 0 15.8331 0C7.1032 0 0 7.10328 0 15.8333C0 24.5633 7.10328 31.6666 15.8332 31.6666C19.5998 31.6666 23.0581 30.34 25.7797 28.1366L37.1546 39.5116C37.4796 39.8366 37.9062 40 38.3329 40C38.7597 40 39.1863 39.8366 39.5113 39.5116C40.1629 38.86 40.1629 37.8066 39.5112 37.155ZM15.8332 28.3333C8.9399 28.3333 3.33332 22.7266 3.33332 15.8333C3.33332 8.93992 8.9399 3.33328 15.8332 3.33328C22.7265 3.33328 28.333 8.93992 28.333 15.8333C28.333 22.7266 22.7264 28.3333 15.8332 28.3333Z'
            fill='black'
          />
        </svg>
      </button>

      <div className='absolute w-[inherit] bg-neutral-200 dark:bg-neutral-300 opacity-0 pointer-events-none search__wrapper'>
        <ul className='overflow-y-auto rtl:text-right ltr:text-left max-h-60 ltr'>
          {search.trim()
            ? foodItems
                ?.filter(food => food[1].includes(search))
                ?.map((item, idx) => (
                  <Link
                    key={idx}
                    to={`/view/item/${item[0]}`}
                    className={`w-full p-4 transition-colors font-[600] text-orange-600 dark:text-orange-700 text-xl hover:cursor-pointer hover:bg-gray-300 dark:hover:bg-neutral-400 inline-block border-b border-b-gray-300 dark:border-b-gray-400`}
                  >
                    {removeSlug(item[1])}
                  </Link>
                ))
            : ''}
        </ul>
      </div>
    </form>
  )
}

export default Search
