import { useState, createContext } from 'react'

export const FoodToppingsContext = createContext()

const FoodToppingsContextProvider = ({ children }) => {
  const [tags, setTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])

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

  const saveSelectedTags = (id, tags) => {
    setSelectedTags([...selectedTags, { id, tags }])
  }

  const removeSelectedTags = id => {
    setSelectedTags(selectedTags.filter(item => item.itemId !== id))
  }

  return (
    <FoodToppingsContext.Provider
      value={{
        addTag,
        removeTags,
        tags,
        setTags,
        saveSelectedTags,
        removeSelectedTags,
        selectedTags
      }}
    >
      {children}
    </FoodToppingsContext.Provider>
  )
}

export default FoodToppingsContextProvider
