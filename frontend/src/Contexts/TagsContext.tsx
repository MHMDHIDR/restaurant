import { useState, createContext } from 'react'

export const TagsContext = createContext({})

const TagsContextProvider = ({ children }: { children: React.ReactNode }) => {
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
    <TagsContext.Provider
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
    </TagsContext.Provider>
  )
}

export default TagsContextProvider