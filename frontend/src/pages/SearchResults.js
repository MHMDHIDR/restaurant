import { useState, useEffect, useContext, lazy } from 'react'
import { Link, useParams } from 'react-router-dom'

import useAxios from '../hooks/useAxios'
import useDocumentTitle from '../hooks/useDocumentTitle'

import abstractText from '../functions/abstractText'
import { removeSlug } from '../functions/slug'

import { CartContext } from '../Contexts/CartContext'
const Card = lazy(() => import('../components/Card'))
const Nav = lazy(() => import('../components/Nav'))
// const Pagination = lazy(() => import('../components/Pagination'))
const Footer = lazy(() => import('../components/Footer'))
const Search = lazy(() => import('../components/Search'))

const SearchResults = () => {
  let { search } = useParams()
  useDocumentTitle(search ? `${search} نتائج البحث عن` : 'ابحث عن طعامك المفضل')

  let [searchData, setSearchData] = useState([])
  const { items } = useContext(CartContext)

  //if there's food id then fetch with food id, otherwise fetch everything
  const { error, ...response } = useAxios({
    method: 'get',
    url: `/foods/0/0`
  })

  useEffect(() => {
    if (response.response !== null) {
      setSearchData(response.response?.response)
    }
  }, [response.response])

  return (
    <>
      <section id='SearchResults' className='flex flex-col justify-between min-h-screen'>
        <Nav />
        <div className='container py-20 mx-auto'>
          <div className='text-center mb-28'>
            <h2 className='mb-10 text-xl md:text-2xl xl:text-4xl'>
              {search
                ? `نتائج البحث عن ${search}`
                : 'ابحث عن منتجات، وجبات، مشروبات، أو حلويات...'}
            </h2>

            {search && (
              <div className='flex justify-center gap-x-4'>
                <Link
                  to='/search'
                  className='px-3 py-1 text-orange-800 transition-colors bg-orange-100 border border-orange-700 rounded hover:bg-orange-200'
                >
                  العودة للبحث
                </Link>
                <Link
                  to='/'
                  className='px-3 py-1 text-orange-800 transition-colors bg-orange-100 border border-orange-700 rounded hover:bg-orange-200'
                >
                  الصفحة الرئيسية
                </Link>
              </div>
            )}
          </div>

          {search ? (
            searchData?.filter(({ foodName }) => removeSlug(foodName).includes(search))
              .length > 0 ? (
              searchData
                ?.filter(({ foodName }) => removeSlug(foodName).includes(search))
                .map((data, idx) => (
                  <div key={idx}>
                    <Card
                      cItemId={data._id}
                      cHeading={
                        <Link to={`/view/item/${data._id}`}>
                          {removeSlug(abstractText(data.foodName, 70))}
                        </Link>
                      }
                      cPrice={data.foodPrice}
                      cDesc={abstractText(data.foodDesc, 120)}
                      cTags={data?.foodTags}
                      cToppings={data.foodToppings}
                      cImg={data.foodImgs}
                      cImgAlt={data.foodName}
                      cCtaLabel={
                        //add to cart button, if item is already in cart then disable the button
                        items.find(itemInCart => itemInCart.cItemId === data._id) ? (
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

                    {/* <Pagination
                    routeName={`view`}
                    pageNum={pageNumber}
                    numberOfPages={data?.numberOfPages}
                    count={data?.itemsCount}
                    foodId={data?.response?._id}
                    itemsPerPage={itemsPerPage}
                    loaction={loaction}
                    category={category}
                  /> */}
                  </div>
                ))
            ) : (
              <div className='text-center'>
                <h3 className='text-xl md:text-2xl xl:text-4xl'>
                  لا يوجد نتائج للبحث عن {search}
                </h3>
              </div>
            )
          ) : (
            <Search />
          )}
        </div>
        <Footer />
      </section>
    </>
  )
}

export default SearchResults
