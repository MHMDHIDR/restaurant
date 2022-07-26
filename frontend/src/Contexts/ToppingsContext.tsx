import { createContext, useState, useEffect } from 'react'
export const ToppingsContext = createContext()

const checkedToppingsFromLocalStorage = JSON.parse(
  localStorage.getItem('restCheckedToppings') || '[]'
)

const ToppingsContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [checkedToppings, setCheckedToppings] = useState(checkedToppingsFromLocalStorage)

  useEffect(() => {
    localStorage.setItem('restCheckedToppings', JSON.stringify(checkedToppings))
  }, [checkedToppings])

  const handleToppingChecked = (toppingId, toppingPrice) => {
    const topping = checkedToppings.find(topping => topping.toppingId === toppingId)
    !topping ? addTopping(toppingId, toppingPrice) : removeTopping(toppingId)
  }

  const addTopping = (toppingId, toppingPrice) => {
    setCheckedToppings([
      ...checkedToppings,
      {
        toppingId,
        toppingPrice
      }
    ])
  }

  const removeTopping = toppingId => {
    setCheckedToppings(checkedToppings.filter(topping => topping.toppingId !== toppingId))
  }

  return (
    <ToppingsContext.Provider
      value={{
        handleToppingChecked,
        checkedToppings,
        setCheckedToppings
      }}
    >
      {children}
    </ToppingsContext.Provider>
  )
}

export default ToppingsContextProvider
