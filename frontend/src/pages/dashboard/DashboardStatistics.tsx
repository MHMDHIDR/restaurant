import { useState, useEffect, Suspense, lazy } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
ChartJS.register(ArcElement, Tooltip, Legend)

import useAxios from '../../hooks/useAxios'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import useEventListener from '../../hooks/useEventListener'

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

  const [userStatus, setUserStatus] = useState<string>('')
  const [userType, setUserType] = useState<string>('')
  const [categories, setCategories] = useState<string[]>([''])
  const [menuCount, setMenuCount] = useState<number>()
  const [ordersCount, setOrdersCount] = useState<number>(0)
  const [ordersResponsecCategory, setOrdersResponsecCategory] = useState<string[]>([''])

  //if there's food id then fetch with food id, otherwise fetch everything
  const currentUser = useAxios({ method: 'get', url: `/users/all/1/1/${USER?._id}` })
  const getCategories = useAxios({ url: `/settings` })
  const menu = useAxios({ method: 'get', url: `/foods/0/0` })
  const orders = useAxios({
    url: `/orders/0/0`,
    headers: USER ? JSON.stringify({ Authorization: `Bearer ${USER.token}` }) : null
  })

  useEffect(() => {
    if (currentUser?.response !== null || menu.response !== null) {
      setUserStatus(currentUser?.response?.response?.userAccountStatus)
      setUserType(currentUser?.response?.response?.userAccountType)
      //Statistics
      setCategories(getCategories?.response?.CategoryList)
      setMenuCount(menu?.response?.itemsCount)
      setOrdersCount(orders?.response?.itemsCount)
      setOrdersResponsecCategory(
        orders?.response?.response?.map(
          ({ orderItems }) => orderItems?.map(({ cCategory }) => cCategory)[0]
        )
      )
    }
  }, [
    currentUser?.response,
    menu?.response,
    orders?.response,
    orders?.response?.response
  ])

  useEventListener('keydown', (e: any) => e.key === 'Escape' && menuToggler())

  let count //?.forEach(x => count[x] + 1)

  console.log(ordersResponsecCategory?.map(x => x))

  //check if userStatus is active and the userType is admin
  return !USER?._id ? (
    <ModalNotFound />
  ) : !USER?._id || userStatus === 'block' || userType === 'user' ? (
    logoutUser(USER?._id)
  ) : !userStatus || !userType ? (
    <LoadingPage />
  ) : (
    <Suspense fallback={<LoadingPage />}>
      <section className='overflow-x-auto h-screen'>
        <DashboardSidebar />
        <DashboardNav />
        <div className='container mx-auto'>
          <h1 className='mx-0 mt-32 mb-20 text-2xl text-center'>
            عدد الطلبات حسب التصنيف
          </h1>

          <Doughnut
            width={100}
            height={50}
            data={{
              labels: categories?.map(category => category[1]),
              datasets: [
                {
                  label: 'عدد الطلبات حسب التصنيف',
                  data: [12, 19, 3],
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                  ],
                  borderWidth: 1
                }
              ]
            }}
          />
        </div>
        <Outlet />
      </section>
    </Suspense>
  )
}

export default DashboardHome
