import { useState, useEffect, Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'
// import Axios from 'axios'

import useDocumentTitle from '../hooks/useDocumentTitle'
import useAxios from '../hooks/useAxios'

import goTo from '../functions/goTo'

import { LoadingCard } from '../components/Loading'

const Header = lazy(() => import('../components/Header'))
const Footer = lazy(() => import('../components/Footer'))

const Categories = () => {
  useDocumentTitle('Categories')

  // const BASE_URL =
  //   process.env.NODE_ENV === 'development'
  //     ? process.env.REACT_APP_API_LOCAL_URL
  //     : process.env.REACT_APP_API_URL
  // const [categoryList, setCategoryList] = useState([])
  // const [categoryListItems, setCategoryListItems] = useState([])
  const [foodImgs, setFoodImgs] = useState('')
  const [drinkImgs, setDrinkImgs] = useState('')
  const ITEMS_COUNT = 0 // if items count is == 0 then it will fetch everything in food category

  //fetching categories
  // const categories = useAxios({
  //   method: 'get',
  //   url: '/settings'
  // })

  const foods = useAxios({
    method: 'get',
    url: `/foods/1/${ITEMS_COUNT}?category=foods`
  })

  const drinks = useAxios({
    method: 'get',
    url: `/foods/1/${ITEMS_COUNT}?category=drinks`
  })

  // const ItemsByCategories = categories?.response?.CategoryList.map(async category => {
  //   try {
  //     const res = await Axios.get(
  //       `${BASE_URL}/foods/1/${ITEMS_COUNT}?category=${category[0]}`
  //     )
  //     const { data } = res
  //     return data
  //   } catch (err) {
  //     console.error(err)
  //   }
  // })

  //if thereis ItemsByCategories then fetch categories images and set them to state
  // useEffect(() => {
  //   if (ItemsByCategories) {
  //     Promise.all(ItemsByCategories).then(res => {
  //       return res.map(({ response, category }) => {
  //         if (response?.length > 0) {
  //           setCategoryList(category)
  //           setCategoryListItems(response)
  //         }
  //       })
  //     })
  //   }
  // }, [])

  // ItemsByCategories?.map(item => item.then(({ data }) => console.log(data)))

  useEffect(() => {
    if (foods?.response !== null && drinks?.response !== null) {
      setFoodImgs(foods?.response?.response)
      setDrinkImgs(drinks?.response?.response)
    }
  }, [foods?.response, drinks?.response])

  const getRandomFoodImg = () => {
    const randomIndex = Math.floor(Math.random() * foodImgs?.length)
    return foodImgs?.[randomIndex]?.foodImgDisplayPath
  }
  const getRandomDrinkImg = () => {
    const randomIndex = Math.floor(Math.random() * drinkImgs?.length)
    return drinkImgs?.[randomIndex]?.foodImgDisplayPath
  }

  return (
    <>
      <Suspense fallback={<LoadingCard />}>
        <Header />
      </Suspense>
      <section className='py-20 my-40'>
        <div className='container mx-auto'>
          <h3 className='mx-0 mt-4 mb-12 text-2xl text-center md:text-3xl'>
            الوجبات والتصنيفات
          </h3>
          {!foodImgs || !drinkImgs ? (
            <LoadingCard />
          ) : (
            <div className='flex flex-wrap justify-center mt-32 gap-14 xl:justify-between'>
              <Link
                to={goTo('../view')}
                className='block overflow-hidden transition-transform duration-300 bg-cover w-72 h-72 rounded-2xl hover:-translate-y-2'
                style={{
                  backgroundImage: `url("${getRandomFoodImg()}")`
                }}
              >
                <h3 className='flex items-center justify-center h-full text-sm font-bold text-white bg-gray-800 md:text-base 2xl:text-xl bg-opacity-80'>
                  كل الوجبات والمشروبات
                </h3>
              </Link>

              <Link
                to={goTo('../view/foods/')}
                className='block overflow-hidden transition-transform duration-300 bg-cover w-72 h-72 rounded-2xl hover:-translate-y-2'
                style={{
                  backgroundImage: `url("${getRandomFoodImg()}")`
                }}
              >
                <h3 className='flex items-center justify-center h-full text-sm font-bold text-white bg-gray-800 md:text-base 2xl:text-xl bg-opacity-80'>
                  الوجبات
                </h3>
              </Link>

              <Link
                to={goTo('../view/drinks/')}
                className='block overflow-hidden transition-transform duration-300 bg-cover w-72 h-72 rounded-2xl hover:-translate-y-2'
                style={{
                  backgroundImage: `url("${getRandomDrinkImg()}")`
                }}
              >
                <h3 className='flex items-center justify-center h-full text-sm font-bold text-white bg-gray-800 md:text-base 2xl:text-xl bg-opacity-80'>
                  المشروبات
                </h3>
              </Link>
            </div>
          )}
        </div>
      </section>
      <Suspense fallback={<LoadingCard />}>
        <Footer />
      </Suspense>
    </>
  )
}

export default Categories
