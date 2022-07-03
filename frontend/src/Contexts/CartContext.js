import { useState, createContext, useContext } from 'react'
import { ToppingsContext } from './ToppingsContext'
export const CartContext = createContext()

const CartContextProvider = ({ children }) => {
  const [items, setItems] = useState([])
  const { checkedToppings, setCheckedToppings } = useContext(ToppingsContext)

  //add items to card add the details like: cHeading, cImg, cPrice, cDesc, cToppings, cQuantity: 1
  const addToCart = (cItemId, cHeading, cImg, cPrice, cDesc, cToppings) => {
    setItems([
      ...items,
      {
        cItemId,
        cHeading,
        cImg,
        cPrice,
        cDesc,
        cToppings: cToppings.map((topping, toppingIndex) => {
          return {
            toppingId: cItemId + '-' + toppingIndex,
            ...topping,
            toppingQuantity: 1
          }
        }),
        cQuantity: 1
      }
    ])
  }

  //remove items from card
  const removeFromCart = (cItemId, cHeading) => {
    if (window.confirm(`هل أنت متأكد من حذف (${cHeading}) من سلة الطلبات؟`)) {
      setItems(items.filter(item => item.cItemId !== cItemId))
      setCheckedToppings(
        checkedToppings.filter(topping => topping.toppingId.slice(0, -2) !== cItemId)
      )
    }
  }

  console.log(...items)

  return (
    <CartContext.Provider
      value={{
        items,
        setItems,
        addToCart,
        removeFromCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export default CartContextProvider
