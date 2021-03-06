import { JSXElementConstructor, useContext } from 'react'
import { CartContext } from '../../Contexts/CartContext'
import { ToppingsContext } from '../../Contexts/ToppingsContext'

import { removeSlug } from '../../utils/slug'

import Divider from '../../components/Divider'

const CartItems: any = () => {
  const { items, setItems, removeFromCart, setGrandPrice } = useContext(CartContext)
  const { handleToppingChecked, checkedToppings } = useContext(ToppingsContext)
  const MAX_QUANTITY = 100

  return (
    items?.length > 0 &&
    items.map(item => {
      const hasToppings = typeof item?.cToppings[0]?.toppingName === 'string'

      return (
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
              src={item?.cImg[0].foodImgDisplayPath}
              alt={removeSlug(item?.cHeading)}
              width='128'
              height='128'
              className='object-cover w-32 h-32 p-1 mx-auto border border-gray-400 min-w-fit min-h-fit aspect-square dark:border-gray-300 rounded-xl'
            />

            {/* Product Details */}
            <div
              className={`
            flex flex-col gap-2 space-y-3 select-none
            ${!hasToppings && 'xl:col-start-2 xl:col-end-4'}
          `}
            >
              <h2 className='text-lg font-semibold text-center underline underline-offset-8'>
                {removeSlug(item?.cHeading)}
              </h2>
              <p>{item?.cDesc}</p>
            </div>

            {/* Product Toppings and it's Quantity */}
            {typeof item?.cToppings[0].toppingName === 'string' && (
              <div className='flex items-center justify-around gap-y-10 xl:gap-x-5 sm:flex-row'>
                <div className='flex flex-col gap-2 text-lg select-none md:items-start'>
                  <h2 className='text-center ltr'>????????????????</h2>
                  {item?.cToppings?.map(
                    ({
                      toppingId,
                      toppingName = '??????????',
                      toppingPrice = 1,
                      toppingQuantity
                    }) => (
                      <div className='flex items-center' key={toppingId}>
                        <input
                          type='checkbox'
                          id={toppingId}
                          value={toppingName}
                          className='cursor-pointer min-w-[1.5rem] min-h-[1.5rem]'
                          onChange={() => handleToppingChecked(toppingId, toppingPrice)}
                          defaultChecked={checkedToppings.find(
                            topping => topping.toppingId === toppingId
                          )}
                        />
                        <label
                          htmlFor={toppingId}
                          className='cursor-pointer p-1.5 text-base rounded-md select-none'
                        >
                          {toppingName}
                        </label>
                        <label
                          htmlFor={toppingId}
                          className='px-3 py-1 mr-2 -ml-2 text-base text-green-800 bg-green-300 rounded-md cursor-pointer bg-opacity-80 min-w-fit'
                        >
                          {toppingPrice * toppingQuantity + ' ??.??'}
                        </label>
                      </div>
                    )
                  )}
                </div>

                <div className='flex flex-col items-center gap-2 text-lg select-none'>
                  <h2 className='text-center ltr'>???????? ????????????????</h2>
                  {item?.cToppings?.map((topping: any, idx: number) => {
                    const toppingId = item.cItemId + idx
                    return (
                      <div key={toppingId} className='flex gap-1 select-none'>
                        <button
                          className='quantity-btn number-hover'
                          onClick={
                            //onClick function to increase the quantity of topping to the specific item in the cart
                            () => {
                              if (topping.toppingQuantity < MAX_QUANTITY) {
                                setItems(
                                  items.map(item => {
                                    if (item.cItemId === toppingId.slice(0, -1)) {
                                      topping.toppingQuantity++
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
                        <span className='text-lg font-bold quantity-btn'>
                          {topping.toppingQuantity}
                        </span>
                        <button
                          className='quantity-btn number-hover'
                          //onClick function to Decrement the quantity of topping to the specific item in the cart
                          onClick={() => {
                            if (topping.toppingQuantity > 1) {
                              setItems(
                                items.map(item => {
                                  if (item.cItemId === toppingId.slice(0, -1)) {
                                    topping.toppingQuantity--
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
                !hasToppings &&
                'lg:col-start-2 lg:col-end-4 xl:col-start-auto xl:col-end-auto'
              }`}
            >
              <h2 className='text-lg text-center ltr'>?????? ??????????????</h2>
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
                          items.reduce(
                            (acc, item) =>
                              acc +
                              item.cPrice * item.cQuantity +
                              //calculate all items checked toppings prices * all items checked toppings quantities
                              checkedToppings.reduce(
                                (acc, curr) =>
                                  curr.toppingId.slice(0, -2) === item.cItemId
                                    ? acc +
                                      parseInt(curr.toppingPrice) *
                                        item.cToppings.reduce(
                                          (acc, curr2) =>
                                            curr2.toppingId === curr.toppingId
                                              ? curr2.toppingQuantity
                                              : acc,
                                          0
                                        )
                                    : acc,
                                0
                              ),
                            0
                          )
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
                        items.reduce(
                          (acc, item) =>
                            acc +
                            item.cPrice * item.cQuantity +
                            //calculate all items checked toppings prices * all items checked toppings quantities
                            checkedToppings.reduce(
                              (acc, curr) =>
                                curr.toppingId.slice(0, -2) === item.cItemId
                                  ? acc +
                                    parseInt(curr.toppingPrice) *
                                      item.cToppings.reduce(
                                        (acc, curr2) =>
                                          curr2.toppingId === curr.toppingId
                                            ? curr2.toppingQuantity
                                            : acc,
                                        0
                                      )
                                  : acc,
                              0
                            ),
                          0
                        )
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
                ${!hasToppings && 'xl:row-start-2 xl:row-end-3'}
              `}
            >
              <span>?????? ???????????? ???? ???????? ???????????????? ?????????????? ???????????????? ?????????????? :&nbsp;</span>
              <strong className='text-lg'>
                {
                  //calculate the item price * item quantity
                  item.cPrice * item.cQuantity +
                    //calculate the item toppings price * item toppings quantity
                    checkedToppings.reduce(
                      (acc, curr) =>
                        curr.toppingId.slice(0, -2) === item.cItemId
                          ? acc +
                            parseInt(curr.toppingPrice) *
                              item.cToppings.reduce(
                                (acc, curr2) =>
                                  curr2.toppingId === curr.toppingId
                                    ? curr2.toppingQuantity
                                    : acc,
                                0
                              )
                          : acc,
                      0
                    )
                }
              </strong>
              &nbsp;??.??
            </span>

            {/* Product Remove from Cart Button */}
            <button
              className={`
              relative rtl m-2 min-w-[7.5rem] text-white py-1.5 px-6 rounded-lg bg-red-800 hover:bg-red-700
              xl:col-start-3 xl:col-end-5
            `}
              onClick={() => {
                if (
                  window.confirm(`???? ?????? ?????????? ???? ?????? (${item.cHeading}) ???? ?????? ????????????????`)
                ) {
                  removeFromCart(item.cItemId)
                }
              }}
            >
              <span className='py-0.5 px-1 pr-1.5 bg-gray-100 rounded-md absolute right-1 top-1 pointer-events-none'>
                ???
              </span>
              &nbsp;&nbsp;
              <span className='mr-4 text-sm pointer-events-none'>???????? ???? ??????????</span>
            </button>
          </div>
          <Divider />
        </div>
      )
    })
  )
}

export default CartItems
