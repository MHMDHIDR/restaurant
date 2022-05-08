import { useState, useEffect } from 'react'
import { Link, Outlet } from 'react-router-dom'

import useAxios from '../../hooks/useAxios'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import useEventListener from '../../hooks/useEventListener'

import goTo from '../../functions/goTo'
import logoutUser from '../../functions/logoutUser'
import menuToggler from '../../functions/menuToggler'

import DashboardNav from '../../components/dashboard/DashboardNav'
import DashboardSidebar from '../../components/dashboard/DashboardSidebar'

const DashboardHome = () => {
  //getting user id from local storage
  const USER_ID = 'user' in localStorage && JSON.parse(localStorage.getItem('user'))._id

  const [userStatus, setUserStatus] = useState('')

  //if there's food id then fetch with food id, otherwise fetch everything
  const { ...response } = useAxios({
    method: 'get',
    url: `/users/all/1/1/${USER_ID}`
  })

  useEffect(() => {
    if (response.response !== null) {
      setUserStatus(response?.response?.response?.userAccountStatus)
    }
  }, [response.response])

  useDocumentTitle('Home')
  document.body.classList.add('dashboard')

  useEventListener('keydown', e => e.key === 'Escape' && menuToggler())

  return !USER_ID || userStatus === 'block' ? (
    logoutUser(USER_ID)
  ) : (
    <section className='overflow-x-auto'>
      <DashboardSidebar />
      <DashboardNav />
      <div className='container mx-auto'>
        <h3 className='mx-0 mt-32 mb-5 text-2xl text-center'>لوحة التحكم</h3>
        <div className='flex flex-wrap justify-center gap-4 md:justify-between'>
          <Link
            to={goTo('orders')}
            className='inline-flex flex-col items-center px-2 py-4 space-y-4 text-white bg-orange-800 hover:bg-orange-700 rounded-xl'
          >
            <img
              loading='lazy'
              src='/assets/img/icons/orders.svg'
              alt='menu slider img'
              className='w-40 h-24'
            />
            <h3>الطلبات</h3>
          </Link>

          <Link
            to={goTo('menu')}
            className='inline-flex flex-col items-center px-2 py-4 space-y-4 text-white bg-orange-800 hover:bg-orange-700 rounded-xl'
          >
            <img
              loading='lazy'
              src='/assets/img/icons/menu.svg'
              alt='menu slider img'
              className='w-40 h-24'
            />
            <h3>القائمة</h3>
          </Link>

          <Link
            to={goTo('add-food')}
            className='inline-flex flex-col items-center px-2 py-4 space-y-4 text-white bg-orange-800 hover:bg-orange-700 rounded-xl'
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
  )
}

export default DashboardHome
