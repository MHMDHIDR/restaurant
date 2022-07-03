import { createContext, useState } from 'react'
export const ToppingsContext = createContext()

const ToppingsContextProvider = ({ children }) => {
  const [checkedToppings, setCheckedToppings] = useState([])

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
