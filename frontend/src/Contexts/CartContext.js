import { useState, createContext } from 'react'
export const CartContext = createContext()

const CartContextProvider = ({ children }) => {
  const [items, setItems] = useState([])

  //add items to card add the details like: cHeading, cImg, cPrice, cDesc, cQuantity: 1
  const addToCart = (cItemId, cHeading, cImg, cPrice, cDesc) => {
    setItems([...items, { cItemId, cHeading, cImg, cPrice, cDesc, cQuantity: 1 }])
  }

  const removeFromCart = (cItemId, cHeading) => {
    window.confirm(`هل أنت متأكد من حذف (${cHeading}) من سلة الطلبات؟`) &&
      setItems(items.filter(item => item.cItemId !== cItemId))
  }

  return (
    <CartContext.Provider value={{ items, setItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  )
}

export default CartContextProvider
