import { createContext, useState, useEffect } from 'react'
export const ToppingsContext = createContext({
  handleToppingChecked: (_toppingId: string, _toppingPrice: number): void => {},
  checkedToppings: [],
  setCheckedToppings: (
    _checkedToppings: { toppingId: string; toppingPrice: string }[]
  ) => {}
})

const checkedToppingsFromLocalStorage = JSON.parse(
  localStorage.getItem('restCheckedToppings') || '[]'
)

const ToppingsContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [checkedToppings, setCheckedToppings] = useState(checkedToppingsFromLocalStorage)

  useEffect(() => {
    localStorage.setItem('restCheckedToppings', JSON.stringify(checkedToppings))
  }, [checkedToppings])

  const handleToppingChecked = (toppingId: string, toppingPrice: number) => {
    const topping = checkedToppings.find(
      (topping: { toppingId: string }) => topping.toppingId === toppingId
    )
    !topping ? addTopping(toppingId, toppingPrice) : removeTopping(toppingId)
  }

  const addTopping = (toppingId: string, toppingPrice: number) => {
    setCheckedToppings([
      ...checkedToppings,
      {
        toppingId,
        toppingPrice
      }
    ])
  }

  const removeTopping = (toppingId: string) => {
    setCheckedToppings(
      checkedToppings.filter(
        (topping: { toppingId: string }) => topping.toppingId !== toppingId
      )
    )
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
