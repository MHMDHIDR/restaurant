import { useState, createContext, useContext, useEffect } from 'react'
import { ToppingsContext } from './ToppingsContext'

const cartFromLocalStorage = JSON.parse(localStorage.getItem('restCartItems') || '[]')

export interface CartProps {
  items: any[]
  setItems: any
  addToCart: any
  removeFromCart: any
  setGrandPrice: any
  setOrderDetails: any
  orderDetails: any
  grandPrice: any
}

export const CartContext = createContext({} as CartProps)

const CartContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState(cartFromLocalStorage)
  const [orderDetails, setOrderDetails] = useState()
  const [grandPrice, setGrandPrice] = useState<number>()
  const { checkedToppings, setCheckedToppings } = useContext(ToppingsContext)

  useEffect(() => {
    localStorage.setItem('restCartItems', JSON.stringify(items))
  }, [items])

  //add items to card add the details like: cHeading, cImg, cPrice, cDesc, cToppings, cQuantity: 1
  const addToCart = (
    cItemId: string,
    cHeading: string,
    cImg: string,
    cPrice: string,
    cDesc: string,
    cToppings: any[]
  ) => {
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
  const removeFromCart = (cItemId: string) => {
    setItems(items.filter((item: { cItemId: string }) => item.cItemId !== cItemId))
    setCheckedToppings(
      checkedToppings.filter(
        (topping: { toppingId: string }) => topping.toppingId.slice(0, -2) !== cItemId
      )
    )
  }

  return (
    <CartContext.Provider
      value={{
        items,
        setItems,
        addToCart,
        removeFromCart,
        setOrderDetails,
        orderDetails,
        grandPrice,
        setGrandPrice
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export default CartContextProvider
