import { useState, createContext } from 'react'
export const CartContext = createContext()

const CartContextProvider = ({ children }) => {
  const [items, setItems] = useState([])

  //add items to card add the details like: cHeading, cImg, cPrice, cDesc, cSelectedToppings, cQuantity: 1
  const addToCart = (cItemId, cHeading, cImg, cPrice, cDesc, cSelectedToppings) => {
    setItems([
      ...items,
      { cItemId, cHeading, cImg, cPrice, cDesc, cSelectedToppings, cQuantity: 1 }
    ])
  }

  console.log(items)

  //remove items from card
  const removeFromCart = (cItemId, cHeading) => {
    if (window.confirm(`هل أنت متأكد من حذف (${cHeading}) من سلة الطلبات؟`)) {
      setItems(items.filter(item => item.cItemId !== cItemId))
    }
  }

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
