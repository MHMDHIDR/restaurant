import { useState, useEffect, Suspense, lazy } from 'react'
import { Link, Outlet } from 'react-router-dom'

import useAxios from '../../hooks/useAxios'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import useEventListener from '../../hooks/useEventListener'

import goTo from '../../utils/goTo'
import logoutUser from '../../utils/logoutUser'
import menuToggler from '../../utils/menuToggler'

import ModalNotFound from '../../components/Modal/ModalNotFound'
import { LoadingPage } from '../../components/Loading'
const DashboardNav = lazy(() => import('../../components/dashboard/DashboardNav'))
const DashboardSidebar = lazy(() => import('../../components/dashboard/DashboardSidebar'))

const DashboardHome = () => {
  useDocumentTitle('Home')

  //getting user id from local storage
  const USER = JSON.parse(localStorage.getItem('user'))

  const [userStatus, setUserStatus] = useState()
  const [userType, setUserType] = useState<any>('')
  const [menuCount, setMenuCount] = useState<any>()
  const [ordersCount, setOrdersCount] = useState<any>()

  //if there's food id then fetch with food id, otherwise fetch everything
  const currentUser = useAxios({ method: 'get', url: `/users/all/1/1/${USER?._id}` })
  const menu = useAxios({ method: 'get', url: `/foods/0/0` })
  const orders = useAxios({
    url: `/orders/0/0`,
    headers: USER ? JSON.stringify({ Authorization: `Bearer ${USER.token}` }) : null
  })

  useEffect(() => {
    if (currentUser?.response !== null || menu.response !== null) {
      setUserStatus(currentUser?.response?.response?.userAccountStatus)
      setUserType(currentUser?.response?.response?.userAccountType)
      setMenuCount(menu?.response?.itemsCount)
      setOrdersCount(orders?.response?.itemsCount)
    }
  }, [currentUser?.response, menu?.response, orders?.response])

  document.body.classList.add('dashboard')

  useEventListener('keydown', (e: any) => e.key === 'Escape' && menuToggler())

  //check if userStatus is active and the userType is admin
  return !USER?._id ? (
    <ModalNotFound />
  ) : !USER?._id || userStatus === 'block' || userType === 'user' ? (
    logoutUser(USER?._id)
  ) : !userStatus || !userType ? (
    <LoadingPage />
  ) : (
    <Suspense fallback={<LoadingPage />}>
      <section className='overflow-x-auto'>
        <DashboardSidebar />
        <DashboardNav />
        <div className='container mx-auto'>
          <h3 className='mx-0 mt-32 mb-5 text-2xl text-center'>لوحة التحكم</h3>
          <div className='flex flex-wrap justify-center gap-4 md:justify-between'>
            <Link
              to={goTo('orders')}
              className='inline-flex flex-col items-center justify-center p-4 space-y-4 text-white bg-orange-800 hover:bg-orange-700 rounded-xl'
            >
              <img
                loading='lazy'
                src='/assets/img/icons/orders.svg'
                alt='menu slider img'
                className='w-40 h-24'
              />
              <h3>الطلبات</h3>
              <span className='text-lg font-bold'>عدد الطلبات {ordersCount}</span>
            </Link>

            <Link
              to={goTo('menu')}
              className='inline-flex flex-col items-center justify-center px-2 py-4 space-y-4 text-white bg-orange-800 hover:bg-orange-700 rounded-xl'
            >
              <img
                loading='lazy'
                src='/assets/img/icons/menu.svg'
                alt='menu slider img'
                className='w-40 h-24'
              />
              <h3>القائمة</h3>
              <span className='text-lg font-bold'>عدد الوجبات {menuCount}</span>
            </Link>

            <Link
              to={goTo('add-food')}
              className='inline-flex flex-col items-center justify-center px-2 py-4 space-y-4 text-white bg-orange-800 hover:bg-orange-700 rounded-xl'
            >
              <img
                loading='lazy'
                src='/assets/img/icons/add_food.svg'
                alt='menu slider img'
                className='w-40 h-24'
              />
              <h3>إضافة وجبة أو مشروب</h3>
            </Link>
          </div>
        </div>

        <Outlet />
      </section>
    </Suspense>
  )
}

export default DashboardHome
