import { useContext } from 'react'
import { CartContext } from '../../Contexts/CartContext'

import { removeSlug } from '../../functions/slug'

import Divider from '../../components/Divider'

const CartItems = ({ setGrandPrice }) => {
  const { items, setItems, removeFromCart } = useContext(CartContext)

  const MAX_QUANTITY = 100

  return (
    items?.length > 0 &&
    items.map(item => (
      <div key={item.cItemId}>
        <div
          className={`grid items-center
            grid-cols-1
            lg:grid-cols-2
            xl:grid-cols-3
            2xl:grid-cols-4
            gap-y-10
            gap-x-5
          `}
        >
          {/* Product Image */}
          <img
            loading='lazy'
            src={item?.cImg}
            alt={removeSlug(item?.cHeading)}
            width='128'
            height='128'
            className='object-cover w-32 h-32 p-1 mx-auto border border-gray-400 min-w-fit min-h-fit aspect-square dark:border-gray-300 rounded-xl'
          />

          {/* Product Details */}
          <div
            className={`
            flex flex-col gap-2 space-y-3 select-none
            ${item?.cToppings?.length === 0 && 'xl:col-start-2 xl:col-end-4'}
          `}
          >
            <h2 className='text-lg font-semibold text-center underline underline-offset-8'>
              {removeSlug(item?.cHeading)}
            </h2>
            <p>{item?.cDesc}</p>
          </div>

          {/* Product Toppings and it's Quantity */}
          {item?.cToppings?.length > 0 && (
            <div className='flex flex-col items-center justify-around gap-y-10 xl:gap-x-5 sm:flex-row'>
              <div className='flex flex-col gap-2 text-lg select-none md:items-start'>
                <h2 className='text-center ltr'>الإضافات</h2>
                {item?.cToppings?.map(({ name, price }, idx) => {
                  const cToppingId = item.cItemId + idx
                  return (
                    <div className='flex items-center' key={cToppingId}>
                      <input
                        type='checkbox'
                        id={cToppingId}
                        value={name}
                        className='cursor-pointer min-w-[1.5rem] min-h-[1.5rem]'
                      />
                      <label
                        htmlFor={cToppingId}
                        className='cursor-pointer p-1.5 text-base rounded-md select-none'
                      >
                        {name}
                      </label>
                      <label
                        htmlFor={cToppingId}
                        className='px-3 py-1 mr-2 -ml-2 text-base text-green-800 bg-green-300 rounded-md cursor-pointer bg-opacity-80 min-w-fit'
                      >
                        {price + ' ر.ق'}
                      </label>
                    </div>
                  )
                })}
              </div>

              <div className='flex flex-col gap-2 text-lg select-none md:items-start'>
                <h2 className='text-center ltr'>كمية الإضافات</h2>
                {item?.cToppings?.map(({ name, price }, idx) => {
                  const cToppingId = item.cItemId + idx
                  return (
                    <div key={cToppingId} className='flex gap-1 select-none'>
                      <button
                        className='quantity-btn number-hover'
                        onClick={
                          //onClick function to increase the quantity of topping to the specific item in the cart
                          () => {
                            if (item.cQuantity < MAX_QUANTITY) {
                              setItems(
                                items.map(item => {
                                  if (item.cItemId === item.cItemId) {
                                    item.cQuantity++
                                  }
                                  return item
                                })
                              )
                            }
                          }
                        }
                      >
                        +
                      </button>
                      <span className='order-1 text-lg font-bold quantity-btn lg:-order-none'>
                        {item.cQuantity}
                      </span>
                      <button
                        className='quantity-btn number-hover'
                        //onClick function to Decrement the quantity of topping to the specific item in the cart
                        onClick={() => {
                          if (item.cQuantity > 1) {
                            setItems(
                              items.map(item => {
                                if (item.cItemId === item.cItemId) {
                                  item.cQuantity--
                                }
                                return item
                              })
                            )
                          }
                        }}
                      >
                        -
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Product Quantity */}
          <div
            className={`
              flex items-center justify-center space-y-1 select-none flex-col
              ${
                item?.cToppings?.length === 0 &&
                'lg:col-start-2 lg:col-end-4 xl:col-start-auto xl:col-end-auto'
              }
            `}
          >
            <h2 className='text-lg text-center ltr'>عدد الوجبات</h2>
            <span className='text-lg font-bold quantity-btn'>{item.cQuantity}</span>
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

          {/* Product Price */}
          <span
            className={`
            p-3 mx-auto text-sm text-green-800 bg-green-300 border border-green-800 rounded-md select-none w-fit
            xl:col-start-1 xl:col-end-3
            ${item?.cToppings?.length === 0 && 'lg:row-start-3 lg:row-end-4'}
          `}
          >
            <span>سعر الوجبة مع حساب الإضافات والكمية للإضافات والوجبة :&nbsp;</span>
            <strong className='text-lg'>{item?.cPrice * item.cQuantity}</strong>
            &nbsp;ر.ق
          </span>

          {/* Product Remove from Cart Button */}
          <button
            className={`
              relative rtl m-2 min-w-[7.5rem] text-white py-1.5 px-6 rounded-lg bg-red-800 hover:bg-red-700
              xl:col-start-3 xl:col-end-5
              ${item?.cToppings?.length === 0 && 'lg:row-start-3 lg:row-end-4'}
            `}
            onClick={() => removeFromCart(item.cItemId, item.cHeading)}
          >
            <span className='py-0.5 px-1 pr-1.5 bg-gray-100 rounded-md absolute right-1 top-1 pointer-events-none'>
              ❌
            </span>
            &nbsp;&nbsp;
            <span className='mr-4 text-sm pointer-events-none'>إحذف من السلة</span>
          </button>
        </div>
        <Divider />
      </div>
    ))
  )
}

export default CartItems
