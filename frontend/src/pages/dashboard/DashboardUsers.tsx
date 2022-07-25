import { useState, useEffect } from 'react'
import useAxios from '../../hooks/useAxios'
import { useParams } from 'react-router-dom'
import Axios from 'axios'

import useDocumentTitle from '../../hooks/useDocumentTitle'
import useEventListener from '../../hooks/useEventListener'

import goTo from '../../utils/goTo'
import logoutUser from '../../utils/logoutUser'

import Modal from '../../components/Modal/Modal'
import { Success, Error, Loading } from '../../components/Icons/Status'
import { LoadingSpinner } from '../../components/Loading'
import Pagination from '../../components/Pagination'

const DashboardUsers = () => {
  useDocumentTitle('Users')

  let { pageNum } = useParams()

  const pageNumber = !pageNum || pageNum < 1 || isNaN(pageNum) ? 1 : parseInt(pageNum)
  const itemsPerPage = 10

  const [userId, setUserId] = useState()
  const [userAccountAction, setUserAccountAction] = useState()
  const [userName, setUserName] = useState('')
  const [deleteUserStatus, setDeleteUserStatus] = useState()
  const [serUpdated, setUserUpdated] = useState()
  const [data, setData] = useState('')

  const modalLoading = document.querySelector('#modal')
  const BASE_URL =
    process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_API_LOCAL_URL
      : process.env.REACT_APP_API_URL

  //get users data only if the admin is authenticated and logged in
  const { ...response } = useAxios({
    method: 'get',
    url: `/users/all/${pageNumber}/${itemsPerPage}`
  })

  useEffect(() => {
    if (response.response !== null) {
      setData(response.response)
    }
  }, [response.response])

  useEventListener('click', e => {
    if (
      e.target.id === 'deleteUser' ||
      e.target.id === 'blockUser' ||
      e.target.id === 'activateUser' ||
      e.target.id === 'user' ||
      e.target.id === 'admin'
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

  const handleUser = async (userId, userAccountAction) => {
    if (userAccountAction === 'delete') {
      try {
        //You need to name the body {data} so it can be recognized in (.delete) method
        const response = await Axios.delete(`${BASE_URL}/users/${userId}`, { data })

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
        const response = await Axios.patch(`${BASE_URL}/users/${userId}`, formData)

        const { userUpdated } = response.data
        setUserUpdated(userUpdated)
        //Remove waiting modal
        setTimeout(() => {
          modalLoading.classList.add('hidden')
        }, 300)
      } catch (err) {
        console.log(err)
      }
    }
  }

  return (
    <>
      {deleteUserStatus === 1 ? (
        <Modal
          status={Success}
          msg={`تم حذف ${userName} بنجاح 😄 الرجاء الانتظار ليتم تحويلك لقائمة المستخدمين`}
          redirectLink={goTo('users')}
          redirectTime='3000'
        />
      ) : deleteUserStatus === 0 ? (
        <Modal
          status={Error}
          msg={`حدث خطأ ما أثناء حذف ${userName}!`}
          redirectLink={goTo('users')}
          redirectTime='3000'
        />
      ) : serUpdated === 1 ? (
        <Modal
          status={Success}
          msg={`تم${
            userAccountAction === 'block'
              ? `❗️ حظر 😔 ${userName} `
              : userAccountAction === 'active'
              ? `🎉 تفعيل 😄 ${userName}`
              : userAccountAction === 'admin'
              ? `🎉 تحويل ${userName} إلى مدير 😎`
              : userAccountAction === 'user'
              ? `❗️ تحويل ${userName}  إلى مستخدم 😎`
              : null
          } بنجاح الرجاء الانتظار ليتم تحويلك لقائمة المستخدمين`}
          redirectLink={goTo('users')}
          redirectTime='3000'
        />
      ) : serUpdated === 0 ? (
        <Modal
          status={Error}
          msg={`حدث خطأ ما أثناء تحديث ${userName}!`}
          redirectLink={goTo('users')}
          redirectTime='3000'
        />
      ) : null}

      {/* Confirm Box */}
      <Modal
        status={Loading}
        modalHidden='hidden'
        classes='txt-blue text-center'
        msg={`هل أنت متأكد من ${
          userAccountAction === 'block'
            ? 'حظر'
            : userAccountAction === 'active'
            ? 'تفعيل'
            : userAccountAction === 'admin'
            ? 'تحويل الى مدير'
            : userAccountAction === 'user'
            ? 'تحويل الى مستخدم'
            : 'الغاء'
        } ${userName} لا يمكن التراجع عن هذا القرار`}
        ctaConfirmBtns={[
          userAccountAction === 'block'
            ? 'حظر'
            : userAccountAction === 'active'
            ? 'تفعيل'
            : userAccountAction === 'admin'
            ? 'تحويل الى مدير'
            : userAccountAction === 'user'
            ? 'تحويل الى مستخدم'
            : 'حذف',
          'الغاء'
        ]}
      />

      <section className='py-12 my-8 dashboard'>
        <div className='container mx-auto'>
          <h3 className='mx-0 mt-4 mb-12 text-2xl text-center md:text-3xl'>المدراء</h3>

          <table className='table w-full text-center'>
            <thead className='text-white bg-orange-800'>
              <tr>
                <th className='px-1 py-2'>الإســــــــــــــم</th>
                <th className='px-1 py-2'>البريد الالكتروني</th>
                <th className='px-1 py-2'>نوع المستخدم</th>
                <th className='px-1 py-2'>حالة المستخدم</th>
                <th className='px-1 py-2'>الاجراء</th>
              </tr>
            </thead>

            <tbody>
              {(data ?? data !== undefined) && data?.response?.length > 0 ? (
                <>
                  {data?.response?.map((item, idx) => (
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
                            ? ' text-orange-600 dark:text-orange-400 font-bold'
                            : ' text-gray-600 dark:text-gray-500'
                        }`}
                      >
                        <span
                          tooltip={
                            item.userAccountType === 'admin'
                              ? 'المدير يملك صلاحية الدخول على لوحة التحكم، فعليه يستطيع إدارة الموقع من خلالها'
                              : 'المستخدم العادي يملك صلاحية الدخول على حسابه ورؤية الطلبات الخاصة به فقط'
                          }
                          className='w-40'
                        >
                          {item.userAccountType === 'admin' ? 'مدير' : 'مستخدم عادي'}
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
                          tooltip={
                            item.userAccountStatus === 'block'
                              ? 'المستخدم المحظور لا يملك صلاحية للدخول على حسابه فعليه لا يملك صلاحية الدخول للوحة التحكم'
                              : 'المستخدم المفعل يملك صلاحية الدخول على حسابه فعليه  يستطيع الدخول للوحة التحكم، وإدارة الموقع من خلالها'
                          }
                        >
                          {item.userAccountStatus === 'block'
                            ? 'المستخدم محظور\u00A0\u00A0\u00A0❌'
                            : 'المستخدم مفعل\u00A0\u00A0\u00A0✅'}
                        </span>
                      </td>
                      <td className='flex flex-wrap items-center justify-center gap-3 px-1 py-2'>
                        {idx === 0 ? (
                          <span className='text-gray-600 select-none dark:text-gray-200'>
                            لا يوجد إجراء
                          </span>
                        ) : (
                          <>
                            {/* UserStatus Buttons */}
                            {item.userAccountStatus === 'block' ? (
                              <button
                                id='activateUser'
                                data-id={item._id}
                                data-name={item.userFullName}
                                data-action='active'
                                className='py-1 text-white bg-green-600 border-2 rounded-md hover:bg-green-700 min-w-[4rem]'
                                tooltip='تفعيل المستخدم'
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
                                tooltip='حظر المستخدم'
                              >
                                حظر
                              </button>
                            )}

                            {/* UserType Buttons */}
                            {item.userAccountType === 'admin' ? (
                              <button
                                id='user'
                                data-id={item._id}
                                data-name={item.userFullName}
                                data-action='user'
                                className='py-1 px-2 text-white bg-green-600 border-2 rounded-md hover:bg-green-700 min-w-[6.5rem]'
                                tooltip='تحويل الى مستخدم عادي'
                              >
                                تحويل لمستخدم
                              </button>
                            ) : (
                              <button
                                id='admin'
                                data-id={item._id}
                                data-name={item.userFullName}
                                data-action='admin'
                                className='py-1 px-2 text-white bg-green-600 border-2 rounded-md hover:bg-green-700 min-w-[6.5rem]'
                                tooltip='تحول الى مدير'
                              >
                                تحول لمدير
                              </button>
                            )}

                            {/* Delete Button */}
                            <button
                              id='deleteUser'
                              data-id={item._id}
                              data-name={item.userFullName}
                              data-action='delete'
                              className='py-1 px-2 text-white bg-red-600 rounded-md hover:bg-red-700 min-w-[6.5rem]'
                              tooltip='حذف المستخدم'
                            >
                              حذف
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}

                  <tr>
                    <td colSpan='100%'>
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
