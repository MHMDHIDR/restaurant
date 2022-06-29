import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { CartContext } from '../Contexts/CartContext'

import useAxios from '../hooks/useAxios'

import abstractText from '../functions/abstractText'
import { removeSlug } from '../functions/slug'

import Card from './Card'
import { LoadingCard } from './Loading'

const NewFood = () => {
  const [data, setData] = useState('')

  const { ...response } = useAxios({
    method: 'get',
    url: '/foods/1/7?category=foods'
  })

  useEffect(() => {
    if (response.response !== null) {
      setData(response.response?.response)
    }
  }, [response.response])

  const { items } = useContext(CartContext)

  return (
    <section id='new' className='py-12 my-8 new'>
      <div className='container mx-auto text-center'>
        <h2 className='mx-0 mt-4 mb-12 text-2xl text-center md:text-3xl'>
          الوجبات الجديدة
        </h2>
        {data && data?.length > 0 ? (
          data?.map(item => (
            <div className='odd:ltr' key={item._id}>
              <Card
                cItemId={item._id}
                cHeading={
                  <Link to={`/view/item/${item._id}`}>
                    {removeSlug(abstractText(item.foodName, 40))}
                  </Link>
                }
                cPrice={item.foodPrice}
                cDesc={abstractText(item.foodDesc, 100)}
                cToppings={item?.foodToppings}
                cImg={item.foodImgDisplayPath}
                cImgAlt={item.foodName}
                cCtaLabel={
                  //add to cart button, if item is already in cart then disable the button
                  items.find(itemInCart => itemInCart.cItemId === item._id) ? (
                    <div className='relative rtl m-2 min-w-[7.5rem] text-white py-1.5 px-6 rounded-lg bg-red-800 hover:bg-red-700'>
                      <span className='py-0.5 px-1 pr-1.5 bg-gray-100 rounded-md absolute right-1 top-1 pointer-events-none'>
                        ❌
                      </span>
                      &nbsp;&nbsp;
                      <span className='mr-4 text-center pointer-events-none'>
                        إحذف من السلة
                      </span>
                    </div>
                  ) : (
                    <div className='relative rtl m-2 min-w-[7.5rem] text-white py-1.5 px-6 rounded-lg bg-green-800 hover:bg-green-700'>
                      <span className='py-0.5 px-1 pr-1.5 bg-gray-100 rounded-md absolute right-1 top-1 pointer-events-none'>
                        🛒
                      </span>
                      &nbsp;&nbsp;
                      <span className='mr-4 text-center pointer-events-none'>
                        أضف إلى السلة
                      </span>
                    </div>
                  )
                }
              />
            </div>
          ))
        ) : !data || data === null || data?.itemsCount === undefined ? (
          <LoadingCard />
        ) : (
          <p className='form__msg inline-block md:text-lg text-red-600 dark:text-red-400 font-[600] pt-2 px-1'>
            عفواً، لم يتم العثور على وجبات جديدة 😕
          </p>
        )}
      </div>
    </section>
  )
}

export default NewFood
