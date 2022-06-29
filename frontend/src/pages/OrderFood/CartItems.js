import { useContext } from 'react'
import { CartContext } from '../../Contexts/CartContext'
import { FoodToppingsContext } from '../../Contexts/FoodToppingsContext'

import { removeSlug } from '../../functions/slug'

import Divider from '../../components/Divider'

const CartItems = ({ setGrandPrice }) => {
  const { items, setItems, removeFromCart } = useContext(CartContext)
  const { saveSelectedTags } = useContext(FoodToppingsContext)

  const MAX_QUANTITY = 100

  return (
    items?.length > 0 &&
    items.map(item => (
      <div key={item.cItemId}>
        <div className='grid items-center grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5'>
          <img
            loading='lazy'
            src={item?.cImg}
            alt={removeSlug(item?.cHeading)}
            width='128'
            height='128'
            className='object-cover w-32 h-32 p-1 mx-auto border border-gray-400 dark:border-gray-300 rounded-xl'
          />
          <div className='flex flex-col gap-2 space-y-3 select-none'>
            <h2 className='text-xl text-center'>{removeSlug(item?.cHeading)}</h2>
            <p className='text-lg'>{item?.cDesc}</p>
          </div>
          <div className='flex flex-col gap-2 space-y-3 text-xl select-none'>
            <h2 className='text-right ltr'>:الإضافات</h2>
            {item?.cSelectedToppings.map(topping => (
              <div className='flex items-center gap-1.5' key={topping}>
                <input
                  type='checkbox'
                  id={topping}
                  value={topping}
                  className='w-6 h-6 cursor-pointer peer'
                />
                <label
                  className='px-2 text-base text-center border rounded cursor-pointer select-none peer-checked:bg-orange-300 peer-checked:border-orange-800'
                  htmlFor={topping}
                >
                  {removeSlug(topping)}
                </label>
              </div>
            ))}
          </div>
          <div className='flex items-center justify-center gap-3 space-y-1 select-none lg:flex-col'>
            <h4 className='text-lg'>الكمية:</h4>
            <span className='order-1 text-lg font-bold quantity-btn lg:-order-none'>
              {item.cQuantity}
            </span>
            <div className='flex gap-2 select-none justify-evenly'>
              <button
                className='quantity-btn number-hover'
                onClick={
                  //Increment items quantity
                  () => {
                    if (item.cQuantity < MAX_QUANTITY) {
                      item.cQuantity++
                      setItems([...items])
                      setGrandPrice(
                        items.reduce((acc, curr) => acc + curr.cPrice * curr.cQuantity, 0)
                      )
                    }
                  }
                }
              >
                +
              </button>
              <button
                className='quantity-btn number-hover'
                //Decrement items quantity
                onClick={() => {
                  if (item.cQuantity > 1) {
                    item.cQuantity--
                    setItems([...items])
                    setGrandPrice(
                      items.reduce((acc, curr) => acc + curr.cPrice * curr.cQuantity, 0)
                    )
                  }
                }}
              >
                -
              </button>
            </div>
          </div>
          <span className='p-1 mx-auto text-sm text-green-800 bg-green-300 border border-green-800 rounded-md select-none w-fit'>
            السعر :&nbsp;
            <strong>{item?.cPrice * item.cQuantity}</strong>
            &nbsp;ر.ق
          </span>
          <button
            className='relative rtl m-2 min-w-[7.5rem] text-white py-1.5 px-6 rounded-lg bg-red-800 hover:bg-red-700'
            onClick={() => removeFromCart(item.cItemId, item.cHeading)}
          >
            <span className='py-0.5 px-1 pr-1.5 bg-gray-100 rounded-md absolute right-1 top-1 pointer-events-none'>
              ❌
            </span>
            &nbsp;&nbsp;
            <span className='mr-4 text-center pointer-events-none'>إحذف من السلة</span>
          </button>
        </div>
        <Divider />
      </div>
    ))
  )
}

export default CartItems
