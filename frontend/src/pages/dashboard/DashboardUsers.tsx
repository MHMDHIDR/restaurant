import { useState, useEffect } from 'react'
import useAxios from '../../hooks/useAxios'
import { Link, useParams } from 'react-router-dom'
import Axios from 'axios'

import useDocumentTitle from '../../hooks/useDocumentTitle'
import useEventListener from '../../hooks/useEventListener'

import goTo from '../../utils/goTo'
import logoutUser from '../../utils/logoutUser'

import { API_URL } from '../../data/constants'

import Modal from '../../components/Modal/Modal'
import { Success, Error, Loading } from '../../components/Icons/Status'
import { LoadingSpinner } from '../../components/Loading'
import Pagination from '../../components/Pagination'
import NavMenu from '../../components/NavMenu'
import ModalNotFound from '../../components/Modal/ModalNotFound'

const DashboardUsers = () => {
  useDocumentTitle('Users')

  let { pageNum }: any = useParams()

  const pageNumber = !pageNum || pageNum < 1 || isNaN(pageNum) ? 1 : parseInt(pageNum)
  const itemsPerPage = 2

  const [userId, setUserId] = useState()
  const [userAccountAction, setUserAccountAction] = useState()
  const [userName, setUserName] = useState('')
  const [deleteUserStatus, setDeleteUserStatus] = useState()
  const [userUpdated, setUserUpdated] = useState()
  const [data, setData] = useState<any>('')

  const USER = JSON.parse(localStorage.getItem('user'))

  const modalLoading = document.querySelector('#modal')

  //get users data only if the admin is authenticated and logged in
  const { ...response } = useAxios({ url: `/users/all/${pageNumber}/${itemsPerPage}` })

  useEffect(() => {
    if (response.response !== null) {
      setData(response.response)
    }
  }, [response.response])

  useEventListener('click', (e: any) => {
    if (
      e.target.id === 'deleteUser' ||
      e.target.id === 'blockUser' ||
      e.target.id === 'activateUser' ||
      e.target.id === 'admin' ||
      e.target.id === 'cashier' ||
      e.target.id === 'user'
    ) {
      setUserId(e.target.dataset.id)
      setUserName(e.target.dataset.name)
      setUserAccountAction(e.target.dataset.action)
      //show modal
      modalLoading.classList.remove('hidden')
    }

    if (e.target.id === 'cancel') {
      modalLoading.classList.add('hidden')
    } else if (e.target.id === 'confirm') {
      handleUser(userId, userAccountAction)
    }
  })

  const handleUser = async (userId: string, userAccountAction: string) => {
    if (userAccountAction === 'delete') {
      try {
        //You need to name the body {data} so it can be recognized in (.delete) method
        const response = await Axios.delete(`${API_URL}/users/${userId}`, { data })

        const { userDeleted } = response.data

        setDeleteUserStatus(userDeleted)
        //Remove waiting modal
        setTimeout(() => {
          modalLoading.classList.add('hidden')
        }, 300)

        logoutUser(userId)
      } catch (err) {
        console.error(err)
      }
    } else {
      const formData = new FormData()
      formData.append('userAccountAction', userAccountAction)

      try {
        const response = await Axios.patch(`${API_URL}/users/${userId}`, formData)

        const { userUpdated } = response.data
        setUserUpdated(userUpdated)
        //Remove waiting modal
        setTimeout(() => {
          modalLoading.classList.add('hidden')
        }, 300)
      } catch (err) {
        console.error(err)
      }
    }
  }

  return USER?.userAccountType !== 'admin' ? (
    <ModalNotFound btnLink='/dashboard' btnName='لوحة التحكم' />
  ) : (
    <>
      {deleteUserStatus === 1 ? (
        <Modal
          status={Success}
          msg={`تم حذف ${userName} بنجاح 😄 الرجاء الانتظار ليتم تحويلك لقائمة المستخدمين`}
          redirectLink={goTo('users')}
          redirectTime={3000}
        />
      ) : deleteUserStatus === 0 ? (
        <Modal
          status={Error}
          msg={`حدث خطأ ما أثناء حذف ${userName}!`}
          redirectLink={goTo('users')}
          redirectTime={3000}
        />
      ) : userUpdated === 1 ? (
        <Modal
          status={Success}
          msg={`تم${
            userAccountAction === 'block'
              ? `❗️ حظر 😔 ${userName} `
              : userAccountAction === 'active'
              ? `🎉 تفعيل 😄 ${userName}`
              : userAccountAction === 'admin'
              ? `🎉 تحويل ${userName} إلى مدير 😎`
              : userAccountAction === 'cashier'
              ? `🎉 تحويل ${userName} إلى كاشير 😎`
              : userAccountAction === 'user'
              ? `❗️ تحويل ${userName}  إلى مستخدم 😎`
              : null
          } بنجاح الرجاء الانتظار ليتم تحويلك لقائمة المستخدمين`}
          redirectLink={goTo('users')}
          redirectTime={3000}
        />
      ) : userUpdated === 0 ? (
        <Modal
          status={Error}
          msg={`حدث خطأ ما أثناء تحديث ${userName}!`}
          redirectLink={goTo('users')}
          redirectTime={3000}
        />
      ) : null}

      {/* Confirm Box */}
      <Modal
        status={Loading}
        modalHidden='hidden'
        classes='txt-blue text-center'
        msg={`هل أنت متأكد من ${
          userAccountAction === 'block'
            ? `حظر ${userName}`
            : userAccountAction === 'active'
            ? `تفعيل ${userName}`
            : userAccountAction === 'admin'
            ? `تحويل ${userName} الى مدير`
            : userAccountAction === 'cashier'
            ? `تحويل ${userName} الى كاشير`
            : userAccountAction === 'user'
            ? `تحويل ${userName} الى مستخدم`
            : 'الغاء'
        } لا يمكن التراجع عن هذا القرار`}
        ctaConfirmBtns={[
          userAccountAction === 'block'
            ? 'حظر'
            : userAccountAction === 'active'
            ? 'تفعيل'
            : userAccountAction === 'admin'
            ? 'تحويل الى مدير'
            : userAccountAction === 'cashier'
            ? 'تحويل الى كاشير'
            : userAccountAction === 'user'
            ? 'تحويل الى مستخدم'
            : 'حذف',
          'الغاء'
        ]}
      />

      <section className='py-12 my-8 dashboard'>
        <div className='container mx-auto'>
          <h3 className='mx-0 mt-4 mb-12 text-2xl text-center md:text-3xl'>
            قائمة المستخدمين
          </h3>

          <table className='table w-full text-center'>
            <thead className='text-white bg-orange-800'>
              <tr>
                <th className='px-1 py-2'>الإســــــــــــــم</th>
                <th className='px-1 py-2'>البريد الالكتروني</th>
                <th className='px-1 py-2'>نوع المستخدم</th>
                <th className='px-1 py-2'>حالة المستخدم</th>
                <th className='px-1 py-2'>الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              {(data ?? data !== undefined) && data?.response?.length > 0 ? (
                <>
                  {data?.response?.map((item: any, idx: number) => (
                    <tr
                      key={item._id}
                      className='transition-colors even:bg-gray-200 odd:bg-gray-300 dark:even:bg-gray-600 dark:odd:bg-gray-700'
                    >
                      <td className='px-1 py-2'>{item.userFullName}</td>
                      <td className='px-1 py-2'>
                        <p>{item.userEmail}</p>
                      </td>
                      <td
                        className={`px-1 py-2 font-bold${
                          item.userAccountType === 'admin'
                            ? ' text-red-700 dark:text-red-400 font-bold'
                            : item.userAccountType === 'cashier'
                            ? ' text-orange-500 dark:text-orange-400 font-bold'
                            : ' text-gray-800 dark:text-gray-300'
                        }`}
                      >
                        <span
                          data-tooltip={
                            item.userAccountType === 'admin'
                              ? 'المدير يملك صلاحية الدخول على لوحة التحكم، فعليه يستطيع إدارة الموقع من خلالها'
                              : item.userAccountType === 'cashier'
                              ? 'الكاشير يملك صلاحية الدخول للوحة التحكم والوصول لصفحة الطلبات مع إمكانية الموافقة أو رفض الطلب'
                              : 'المستخدم العادي يملك صلاحية الدخول على حسابه ورؤية الطلبات الخاصة به فقط'
                          }
                          className='w-40'
                        >
                          {item.userAccountType === 'admin'
                            ? 'مدير'
                            : item.userAccountType === 'cashier'
                            ? 'كاشير'
                            : 'مستخدم عادي'}
                        </span>
                      </td>
                      <td
                        className={`px-1 py-2 font-bold${
                          item.userAccountStatus === 'block'
                            ? ' text-red-600 dark:text-red-400'
                            : ' text-green-600 dark:text-green-500'
                        }`}
                      >
                        <span
                          data-tooltip={
                            item.userAccountStatus === 'block'
                              ? 'المستخدم المحظور لا يملك صلاحية للدخول على النظام'
                              : 'المستخدم المفعل يملك صلاحية الدخول على حسابه فعليه يستطيع الدخول للنظام وعمل الاجراء الذي يتناسب مع صلاحياته'
                          }
                        >
                          {item.userAccountStatus === 'block'
                            ? '❌\u00A0\u00A0\u00A0محظور'
                            : '✅\u00A0\u00A0\u00A0مفعل'}
                        </span>
                      </td>
                      <td className='px-1 py-2'>
                        {idx === 0 ? (
                          //first admin account doesn't have to get deleted or blocked from others hence no action provided
                          <span className='text-gray-600 select-none dark:text-gray-200'>
                            لا يوجد إجراء
                          </span>
                        ) : (
                          <NavMenu>
                            {/* UserStatus Buttons */}
                            {item.userAccountStatus === 'block' ? (
                              <button
                                id='activateUser'
                                data-id={item._id}
                                data-name={item.userFullName}
                                data-action='active'
                                className='py-1 text-white bg-green-600 border-2 rounded-md hover:bg-green-700 min-w-[4rem]'
                                data-tooltip='تفعيل المستخدم'
                              >
                                تفعيل
                              </button>
                            ) : (
                              <button
                                id='blockUser'
                                data-id={item._id}
                                data-name={item.userFullName}
                                data-action='block'
                                className='py-1 px-2 text-white border-2 rounded-md bg-neutral-600 hover:bg-neutral-700 min-w-[6.5rem]'
                                data-tooltip='حظر المستخدم'
                              >
                                حظر
                              </button>
                            )}

                            {/* UserType Buttons */}
                            {item.userAccountType === 'admin' ? (
                              <>
                                <button
                                  id='user'
                                  data-id={item._id}
                                  data-name={item.userFullName}
                                  data-action='user'
                                  className='py-1 px-2 text-white bg-green-600 border-2 rounded-md hover:bg-green-700 min-w-[6.5rem]'
                                  data-tooltip='تحويل الى مستخدم عادي'
                                >
                                  تحويل لمستخدم
                                </button>
                                <button
                                  id='user'
                                  data-id={item._id}
                                  data-name={item.userFullName}
                                  data-action='cashier'
                                  className='py-1 px-2 text-white bg-orange-600 border-2 rounded-md hover:bg-orange-700 min-w-[6.5rem]'
                                  data-tooltip='تحويل الى لكاشير'
                                >
                                  تحويل لكاشير
                                </button>
                              </>
                            ) : item.userAccountType === 'cashier' ? (
                              <>
                                <button
                                  id='admin'
                                  data-id={item._id}
                                  data-name={item.userFullName}
                                  data-action='admin'
                                  className='py-1 px-2 text-white bg-green-600 border-2 rounded-md hover:bg-green-700 min-w-[6.5rem]'
                                  data-tooltip='تحول الى مدير'
                                >
                                  تحول لمدير
                                </button>
                                <button
                                  id='user'
                                  data-id={item._id}
                                  data-name={item.userFullName}
                                  data-action='user'
                                  className='py-1 px-2 text-white bg-green-600 border-2 rounded-md hover:bg-green-700 min-w-[6.5rem]'
                                  data-tooltip='تحويل الى مستخدم عادي'
                                >
                                  تحويل لمستخدم
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  id='admin'
                                  data-id={item._id}
                                  data-name={item.userFullName}
                                  data-action='admin'
                                  className='py-1 px-2 text-white bg-green-600 border-2 rounded-md hover:bg-green-700 min-w-[6.5rem]'
                                  data-tooltip='تحول الى مدير'
                                >
                                  تحول لمدير
                                </button>
                                <button
                                  id='user'
                                  data-id={item._id}
                                  data-name={item.userFullName}
                                  data-action='cashier'
                                  className='py-1 px-2 text-white bg-orange-600 border-2 rounded-md hover:bg-orange-700 min-w-[6.5rem]'
                                  data-tooltip='تحويل الى لكاشير'
                                >
                                  تحويل لكاشير
                                </button>
                              </>
                            )}

                            {/* Delete Button */}
                            <button
                              id='deleteUser'
                              data-id={item._id}
                              data-name={item.userFullName}
                              data-action='delete'
                              className='py-1 px-2 text-white bg-red-600 rounded-md hover:bg-red-700 min-w-[6.5rem]'
                              data-tooltip='حذف المستخدم'
                            >
                              حذف
                            </button>
                          </NavMenu>
                        )}
                      </td>
                    </tr>
                  ))}

                  {/* Pagination */}
                  <tr>
                    <td colSpan={100}>
                      <Pagination
                        routeName={`dashboard/users`}
                        pageNum={pageNumber}
                        numberOfPages={data?.numberOfPages}
                        count={data?.itemsCount}
                        foodId={data?.response?._id}
                        itemsPerPage={itemsPerPage}
                      />
                    </td>
                  </tr>
                </>
              ) : !data || !data === null || data?.itemsCount === undefined ? (
                <tr>
                  <td />
                  <td className='flex justify-center py-10'>
                    <LoadingSpinner size='10' />
                  </td>
                  <td />
                </tr>
              ) : (
                <tr>
                  <td />
                  <td className='flex flex-col px-1 py-2'>
                    <p className='my-2 md:text-2xl text-red-600 dark:text-red-400 font-[600] py-2 px-1'>
                      عفواً، لم يتم العثور على مستخدمين
                    </p>
                    <Link
                      to='dashboard'
                      className='w-fit mx-auto bg-orange-700 hover:bg-orange-800 text-white py-1.5 text-lg px-6 rounded-md'
                    >
                      العودة للوحة التحكم
                    </Link>
                  </td>
                  <td />
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

export default DashboardUsers
