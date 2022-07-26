import { useState, createContext, useEffect } from 'react'
import useAxios from '../hooks/useAxios'
import { removeSlug } from '../utils/slug'

export const SearchContext = createContext({})

const SearchContextProvider = ({ children }: { children: React.ReactNode }) => {
  /**
   * @param {string} search - the search query
   * @param {string} searchResults - the search results that match the query coming from the server and filtered
   * @param {boolean} loading - whether the search is loading or not
   * @param {function} setSearch  - sets the search query
   * @param {function} setSearchResults - sets the search results
   * @param {function} setFoodCategory ==>
   *    ===> is used to set the food category in the search component (search/searchResults), useEffect(() => { setFoodCategory('foods')}, [setFoodCategory])
   * @param {function} setSearchFor ==>
   *    ===> is used to set the search for users/orders in the search component (search/searchResults), useEffect(() => { setSearchFor('users')}, [setSearchFor])
   */

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
          ({ foodName, foodTags }) =>
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
