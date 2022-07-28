import { useState, createContext, useEffect } from 'react'
import useAxios from '../hooks/useAxios'
import { removeSlug } from '../utils/slug'

interface SearchContextProps {
  setSearch: (search: string) => void
  search: string
  searchResults: any[]
  setSearchFor: (searchFor: string) => void
  setFoodCategory: (foodCategory: string) => void
  loading: boolean
  error: any
}

export const SearchContext = createContext<SearchContextProps>({} as SearchContextProps)

const SearchContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [search, setSearch] = useState('')
  const [searchResults, setRearchResults] = useState([])
  const [foodCategory, setFoodCategory] = useState('')
  const [searchFor, setSearchFor] = useState('foods')

  const { error, loading, ...response } = useAxios({
    method: 'get',
    url: `/${searchFor}/0/0?category=${foodCategory}`
  })

  useEffect(() => {
    if (response.response !== null) {
      setRearchResults(
        response.response?.response?.filter(
          ({ foodName, foodTags }: { foodName: string; foodTags: string[] }) =>
            removeSlug(foodName).includes(search) || foodTags.includes(search)
        )
      )
    }
  }, [response.response, search])

  return (
    <SearchContext.Provider
      value={{
        setSearch,
        search,
        searchResults,
        setSearchFor,
        setFoodCategory,
        loading,
        error
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export default SearchContextProvider
