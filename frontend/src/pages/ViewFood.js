import { useState, useEffect, useContext, Suspense, lazy } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { CartContext } from '../Contexts/CartContext'

import useAxios from '../hooks/useAxios'
import useDocumentTitle from '../hooks/useDocumentTitle'

import abstractText from '../functions/abstractText'
import { removeSlug } from '../functions/slug'

import { LoadingCard } from '../components/Loading'

const ModalNotFound = lazy(() => import('../components/Modal/ModalNotFound'))
const Card = lazy(() => import('../components/Card'))
const Header = lazy(() => import('../components/Header'))
const Footer = lazy(() => import('../components/Footer'))
const Pagination = lazy(() => import('../components/Pagination'))

const ViewFood = () => {
  useDocumentTitle('View Foods')

  let { pageNum, foodId } = useParams()

  const loaction =
    useLocation().pathname.split('/')[useLocation().pathname.split('/').length - 2]
  const category = loaction !== 'view' && loaction

  const pageNumber = !pageNum || pageNum < 1 || isNaN(pageNum) ? 1 : parseInt(pageNum)
  const itemsPerPage = 5
  const [data, setData] = useState('')

  //if there's food id then fetch with food id, otherwise fetch everything
  const { error, ...response } = useAxios({
    method: 'get',
    url: foodId
      ? `/foods/1/1/${foodId}`
      : category
      ? `/foods/${pageNumber}/${itemsPerPage}?category=${category}`
      : `/foods/${pageNumber}/${itemsPerPage}`
  })

  useEffect(() => {
    if (response.response !== null) {
      setData(response.response)
    }
  }, [response.response])

  const { items } = useContext(CartContext)

  return (
    <>
      <Suspense fallback={<LoadingCard />}>
        <Header />
      </Suspense>
      <section id='viewFood' className='py-12 my-8'>
        <div className='container mx-auto'>
          <h2 className='text-xl text-center mb-28 md:text-2xl xl:text-4xl'>
            {!data?.response?.length
              ? //single food item (Title)
                data?.response && (
                  <Link to={`/view/item/${data?.response?._id}`}>
                    {removeSlug(data?.response?.foodName)}
                  </Link>
                )
              : 'عرض الوجبات'}
          </h2>

          {data ?? data !== undefined ? (
            // if data.length gives a number that means there are Multiple food items
            data?.response?.length > 0 ? (
              <Suspense fallback={<LoadingCard />}>
                {data?.response?.map(item => (
                  // View Multiple (Many) food items
                  <Card
                    key={item._id}
                    cItemId={item._id}
                    cHeading={
                      <Link to={`/view/item/${item._id}`}>
                        {removeSlug(abstractText(item.foodName, 70))}
                      </Link>
                    }
                    cPrice={item.foodPrice}
                    cDesc={abstractText(item.foodDesc, 120)}
                    cTags={item?.foodTags}
                    cToppings={item.foodToppings}
                    cImg={item.foodImgs}
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
                ))}

                <Pagination
                  routeName={`view`}
                  pageNum={pageNumber}
                  numberOfPages={data?.numberOfPages}
                  count={data?.itemsCount}
                  foodId={data?.response?._id}
                  itemsPerPage={itemsPerPage}
                  loaction={loaction}
                  category={category}
                />
              </Suspense>
            ) : data?.response?.length === 0 ? (
              <ModalNotFound />
            ) : (
              // Single food item
              <Suspense fallback={<LoadingCard />}>
                <Card
                  key={data?.response?._id}
                  cItemId={data?.response?._id}
                  cHeading={
                    <Link to={`/view/item/${data?.response?._id}`}>
                      {removeSlug(data?.response?.foodName)}
                    </Link>
                  }
                  cPrice={data?.response?.foodPrice}
                  cDesc={data?.response?.foodDesc}
                  cTags={data?.response?.foodTags}
                  cToppings={data?.response?.foodToppings}
                  cImg={data?.response?.foodImgs}
                  cImgAlt={data?.response?.foodName}
                  cCtaLabel={
                    //add to cart button, if item is already in cart then disable the button
                    items.find(
                      itemInCart => itemInCart.cItemId === data?.response?._id
                    ) ? (
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
              </Suspense>
            )
          ) : error?.response?.status === 500 ? (
            <div className='flex flex-col items-center justify-center text-base text-center lg:text-xl 2xl:text-3xl gap-14'>
              <span className='my-2 font-bold text-red-500'>
                عفواً! لم يتم العثور على الوجبة المطلوبة &nbsp;&nbsp;&nbsp; 😥
              </span>
              <Link
                to='/'
                className='px-3 py-1 text-orange-800 transition-colors bg-orange-100 border border-orange-700 rounded hover:bg-orange-200'
              >
                يمكنك العودة للصفحة الرئيسية
              </Link>
            </div>
          ) : data === '' || !data ? (
            <LoadingCard />
          ) : null}
        </div>
      </section>
      <Suspense fallback={<LoadingCard />}>
        <Footer />
      </Suspense>
    </>
  )
}

export default ViewFood
