import { useState, useEffect } from 'react'
import useAxios from '../../hooks/useAxios'
import { useParams } from 'react-router-dom'
import Axios from 'axios'

import useDocumentTitle from '../../hooks/useDocumentTitle'
import useEventListener from '../../hooks/useEventListener'

import goTo from '../../functions/goTo'
import logoutUser from '../../functions/logoutUser'

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
  const [userAccountStatus, setUserAccountAction] = useState()
  const [userName, setUserName] = useState('')
  const [deleteUserStatus, setDeleteUserStatus] = useState()
  const [userStatus, setUserStatus] = useState()
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
      e.target.id === 'activateUser'
    ) {
      setUserId(e.target.dataset.id)
      setUserName(e.target.dataset.name)
      setUserAccountAction(
        e.target.dataset.action === 'delete' ? 'delete' : e.target.dataset.action
      )
      //show modal
      modalLoading.classList.remove('hidden')
    }

    if (e.target.id === 'cancel') {
      modalLoading.classList.add('hidden')
    } else if (e.target.id === 'confirm') {
      handleUser(userId, userAccountStatus)
    }
  })

  const handleUser = async (userId, userAccountStatus) => {
    if (userAccountStatus === 'delete') {
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
      formData.append('userAccountStatus', userAccountStatus)

      try {
        const response = await Axios.patch(`${BASE_URL}/users/${userId}`, formData)

        const { userStatusUpdated } = response.data
        setUserStatus(userStatusUpdated)
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
      ) : userStatus === 1 ? (
        <Modal
          status={Success}
          msg={`تم${
            userAccountStatus === 'block' ? `❗️ حظر 😔` : `🎉 تفعيل 😄`
          } ${userName} بنجاح الرجاء الانتظار ليتم تحويلك لقائمة المستخدمين`}
          redirectLink={goTo('users')}
          redirectTime='3000'
        />
      ) : userStatus === 0 ? (
        <Modal
          status={Error}
          msg={`حدث خطأ ما أثناء حظر ${userName}!`}
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
          userAccountStatus === 'block'
            ? 'حظر'
            : userAccountStatus === 'active'
            ? 'تفعيل'
            : userAccountStatus === 'delete'
            ? 'حذف'
            : 'الغاء'
        } ${userName} لا يمكن التراجع عن هذا القرار`}
        ctaConfirmBtns={[
          userAccountStatus === 'block'
            ? 'حظر'
            : userAccountStatus === 'active'
            ? 'تفعيل'
            : 'حذف',
          'الغاء'
        ]}
      />

      <section className='py-12 my-8 dashboard'>
        <div className='container mx-auto'>
          <h3 className='mx-0 mt-4 mb-12 text-2xl text-center md:text-3xl'>المستخدمين</h3>

          <table className='table w-full text-center'>
            <thead className='text-white bg-orange-800'>
              <tr>
                <th className='px-1 py-2'>اسم المستخدم</th>
                <th className='px-1 py-2'>البريد الالكتروني</th>
                <th className='px-1 py-2'>حالة المستخدم</th>
                <th className='px-1 py-2'>الاجراء</th>
              </tr>
            </thead>

            <tbody>
              {(data ?? data !== undefined) && data?.response?.length > 0 ? (
                <>
                  {data?.response?.map(item => (
                    <tr
                      key={item._id}
                      className='transition-colors even:bg-gray-200 odd:bg-gray-300 dark:even:bg-gray-600 dark:odd:bg-gray-700'
                    >
                      <td className='px-1 py-2'>{item.userFullName}</td>
                      <td className='w-1/2 px-1 py-2'>
                        <p>{item.userEmail}</p>
                      </td>
                      <td
                        className={`px-1 py-2 font-bold${
                          item.userAccountStatus === 'block'
                            ? ' text-red-600 dark:text-red-400'
                            : ' text-green-600 dark:text-green-500'
                        }`}
                      >
                        <p
                          tooltip={
                            item.userAccountStatus === 'block'
                              ? 'المستخدم المحظور لا يملك صلاحية للدخول على حسابه فعليه لا يملك صلاحية الدخول للوحة التحكم'
                              : 'المستخدم المفعل يملك صلاحية الدخول على حسابه فعليه  يستطيع الدخول للوحة التحكم، وإدارة الموقع من خلالها'
                          }
                        >
                          {item.userAccountStatus === 'block'
                            ? 'المستخدم محظور\u00A0\u00A0\u00A0❌'
                            : 'المستخدم مفعل\u00A0\u00A0\u00A0✅'}
                        </p>
                      </td>
                      <td className='flex justify-center gap-3 px-1 py-2'>
                        {item.userAccountStatus === 'block' ? (
                          <button
                            id='activateUser'
                            data-id={item._id}
                            data-name={item.userFullName}
                            data-action='active'
                            className='px-16 py-1 text-white bg-green-600 border-2 rounded-md hover:bg-green-700'
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
                            className='px-16 py-1 text-white border-2 rounded-md bg-neutral-600 hover:bg-neutral-700'
                            tooltip='حظر المستخدم'
                          >
                            حظر
                          </button>
                        )}
                        <button
                          id='deleteUser'
                          data-id={item._id}
                          data-name={item.userFullName}
                          data-action='delete'
                          className='px-16 py-1 text-white bg-red-600 rounded-md hover:bg-red-700'
                          tooltip='حذف المستخدم'
                        >
                          حذف
                        </button>
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
