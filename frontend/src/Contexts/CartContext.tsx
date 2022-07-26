import { useState, createContext, useContext, useEffect } from 'react'
import { ToppingsContext } from './ToppingsContext'
export const CartContext = createContext({})

const cartFromLocalStorage = JSON.parse(localStorage.getItem('restCartItems') || '[]')

const CartContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState(cartFromLocalStorage)
  const [orderDetails, setOrderDetails] = useState()
  const [grandPrice, setGrandPrice] = useState('')
  const { checkedToppings, setCheckedToppings } = useContext(ToppingsContext)

  useEffect(() => {
    localStorage.setItem('restCartItems', JSON.stringify(items))
  }, [items])

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
  const removeFromCart = cItemId => {
    setItems(items.filter(item => item.cItemId !== cItemId))
    setCheckedToppings(
      checkedToppings.filter(topping => topping.toppingId.slice(0, -2) !== cItemId)
    )
  }

  return (
    <CartContext.Provider
      value={{
        items,
        setItems,
        addToCart,
        removeFromCart,
        setGrandPrice,
        setOrderDetails,
        orderDetails,
        grandPrice
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export default CartContextProvider
