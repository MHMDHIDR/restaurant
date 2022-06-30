import { useState, createContext } from 'react'
export const CartContext = createContext()

const CartContextProvider = ({ children }) => {
  const [items, setItems] = useState([])

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
        cToppings,
        cQuantity: 1
        //: selectedTags.filter(item => item.id === cItemId)
      }
    ])
  }

  //remove items from card
  const removeFromCart = (cItemId, cHeading) => {
    if (window.confirm(`هل أنت متأكد من حذف (${cHeading}) من سلة الطلبات؟`)) {
      setItems(items.filter(item => item.cItemId !== cItemId))
    }
  }

  //This takes the selected tags from the food toppings context and adds them to the specific item in the cart
  // console.log('selectedTags=> ', selectedTags)

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
