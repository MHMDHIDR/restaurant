import { useState, createContext } from 'react'

export const FoodToppingsContext = createContext()

const FoodToppingsContextProvider = ({ children }) => {
  const [tags, setTags] = useState([])

  const removeTags = indexToRemove => {
    setTags([...tags.filter((_, index) => index !== indexToRemove)])
  }

  const addTag = e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      setTags([...tags, e.target.value])
      e.target.value = ''
    }
  }

  return (
    <FoodToppingsContext.Provider value={{ tags, removeTags, addTag, setTags }}>
      {children}
    </FoodToppingsContext.Provider>
  )
}

export default FoodToppingsContextProvider
