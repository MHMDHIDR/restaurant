import { useState, useEffect } from 'react'
import useAxios from '../../hooks/useAxios'
import { Link, useParams } from 'react-router-dom'
import Axios from 'axios'

import useEventListener from '../../hooks/useEventListener'

import goTo from '../../functions/goTo'
import { toggleCSSclasses } from '../../functions/toggleCSSclasses'

import Modal from '../Modal/Modal'
import { Success, Error, Loading } from '../Icons/Status'
import { LoadingSpinner } from '../Loading'
import Pagination from '../Pagination'
import Divider from '../Divider'

const OrdersTable = () => {
  let { pageNum } = useParams()

  const pageNumber = !pageNum || pageNum < 1 || isNaN(pageNum) ? 1 : parseInt(pageNum)
  const itemsPerPage = 5

  const [acceptOrderStatus, setAcceptOrderStatus] = useState(false)
  const [deleteOrderStatus, setDeleteOrderStatus] = useState(false)
  const [orderId, setOrderId] = useState()
  const [orderStatus, setOrderStatus] = useState()
  const [ordersData, setOrdersData] = useState()

  const modalLoading = document.querySelector('#modal')

  const BASE_URL =
    process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_API_LOCAL_URL
      : process.env.REACT_APP_API_URL

  const { ...response } = useAxios({
    method: 'get',
    url: `/orders/${pageNumber}/${itemsPerPage}`
  })

  useEffect(() => {
    if (response.response !== null) {
      setOrdersData(response.response)
    }
  }, [response.response])

  useEventListener('click', e => {
    if (
      e.target.id === 'acceptOrder' ||
      e.target.id === 'rejectOrder' ||
      e.target.id === 'deleteOrder'
    ) {
      setOrderId(e.target.dataset.id)
      setOrderStatus(e.target.dataset.status)
      //show modal
      modalLoading.classList.remove('hidden')
    }

    if (e.target.id === 'cancel') {
      modalLoading.classList.add('hidden')
    } else if (e.target.id === 'confirm') {
      handleOrder(orderId, orderStatus)
    } else if (e.target.dataset.orderContentArrow) {
      toggleCSSclasses(
        [e.target.parentElement.nextElementSibling.classList.contains('ordered-items')],
        e.target.parentElement.nextElementSibling,
        ['max-h-0'],
        ['ordered-items', `max-h-screen`]
      )
      toggleCSSclasses(
        [e.target.classList.contains('rotate-180')],
        e.target,
        ['rotate-180', 'hover:translate-y-1'],
        ['rotate-180', 'hover:-translate-y-1']
      )
    }
  })

  const handleOrder = async (orderId, orderStatus) => {
    //delete order
    if (orderStatus === 'delete') {
      try {
        //You need to name the body {data} so it can be recognized in (.delete) method
        const response = await Axios.delete(`${BASE_URL}/orders/${orderId}`)
        const { orderDeleted } = response.data

        setDeleteOrderStatus(orderDeleted)
        //Remove waiting modal
        setTimeout(() => {
          modalLoading.classList.add('hidden')
        }, 300)
      } catch (err) {
        console.error(err)
      }
      return
    }

    //else accept or reject order
    // using FormData to send constructed data
    const formData = new FormData()
    formData.append('orderStatus', orderStatus)

    try {
      const response = await Axios.patch(`${BASE_URL}/orders/${orderId}`, formData)
      const { OrderStatusUpdated } = response.data

      setAcceptOrderStatus(OrderStatusUpdated)
      //Remove waiting modal
      setTimeout(() => {
        modalLoading.classList.add('hidden')
      }, 300)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      {acceptOrderStatus === 1 || deleteOrderStatus === 1 ? (
        <Modal
          status={Success}
          classes='text-2xl'
          msg={
            orderStatus === 'accept'
              ? `😄    تمت الموافقة على الطلب    🎉`
              : orderStatus === 'delete'
              ? '🗑    تم حذف الطلب بنجاح    ❌'
              : `❗️    تم رفض الطلب بنجاح    😔`
          }
          redirectLink={goTo('orders')}
          redirectTime='4000'
        />
      ) : acceptOrderStatus === 0 ? (
        <Modal
          status={Error}
          msg={`عفواً! خطأ ما!`}
          redirectLink={goTo('orders')}
          redirectTime='4000'
        />
      ) : null}

      {/* Confirm Box */}
      <Modal
        status={Loading}
        modalHidden='hidden'
        classes='txt-blue text-center'
        msg={`هل أنت متأكد من ${
          orderStatus === 'accept' ? 'الموافقة' : orderStatus === 'delete' ? 'حذف' : 'رفض'
        } هذا الطلب؟ لا يمكن التراجع عن هذا القرار`}
        ctaConfirmBtns={[
          orderStatus === 'accept' ? 'موافق' : orderStatus === 'delete' ? 'حذف' : 'رفض',
          'الغاء'
        ]}
      />
      <table className='table w-full text-center border-collapse table-auto'>
        <thead className='text-white bg-orange-800'>
          <tr>
            <th className='px-1 py-2 min-w-[10rem]'>اسم الشخص</th>
            <th className='px-1 py-2'>تاريخ و وقت الطلب</th>
            <th className='px-1 py-2'>هاتف صاحب الطلب</th>
            <th className='px-1 py-2 min-w-[20rem]'>محتويات الطلب</th>
            <th className='px-1 py-2'>ملاحظات الطلب</th>
            <th className='px-1 py-2'>السعر الاجمالي</th>
            <th className='px-1 py-2'>رقم الطلب</th>
            <th className='px-1 py-2'>حالة الطلب</th>
            <th className='px-1 py-2'>الاجراء</th>
          </tr>
        </thead>

        <tbody>
          {(ordersData ?? ordersData !== undefined) &&
          ordersData?.response?.length > 0 ? (
            <>
              {ordersData?.response?.map(item => (
                <tr
                  key={item._id}
                  className='transition-colors even:bg-neutral-300 odd:bg-neutral-200 dark:even:bg-neutral-700 dark:odd:bg-neutral-600'
                >
                  <td className='px-1 py-2 min-w-[10rem]'>{item.personName}</td>
                  <td className='text-right min-w-[13rem] px-1 py-2'>
                    <p>التاريخ: {item.orderDate.split(',')[0]}</p>
                    <p>الوقت: {item.orderDate.split(',')[1]}</p>
                  </td>
                  <td className='px-1 py-2'>{item.personPhone}</td>
                  <td className='px-1 py-2 min-w-[20rem]'>
                    <span tooltip={`عرض ${item.orderItems.length} طلبات`}>
                      <span
                        data-order-content-arrow
                        className={`inline-block text-2xl font-bold transition-transform duration-300 cursor-pointer hover:translate-y-1`}
                      >
                        &#8679;
                      </span>
                    </span>
                    <div className='max-h-screen overflow-hidden transition-all duration-300 ordered-items'>
                      {item?.orderItems?.map(item => (
                        <div key={item.cItemId}>
                          <div className='flex flex-col items-start gap-2'>
                            <img
                              loading='lazy'
                              src={item.cImg}
                              alt={item.cHeading}
                              width='50'
                              height='50'
                              className='object-cover rounded-lg shadow-md w-14 h-14'
                            />
                            <h4>اسم الطلب: {item.cHeading}</h4>
                            <h4>الكمية: {item.cQuantity}</h4>
                            <span className='inline-block px-2 py-2 text-green-800 bg-green-300 rounded-xl bg-opacity-80'>
                              السعر على حسب الكمية: {item.cPrice * item.cQuantity} ر.ق
                            </span>
                          </div>
                          <Divider marginY='2' thickness='0.5' />
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className='px-1 py-2'>
                    {!item.personNotes ? (
                      <span className='font-bold text-red-600 dark:text-red-400'>
                        لا يوجد ملاحظات في الطلب
                      </span>
                    ) : (
                      item.personNotes
                    )}
                  </td>
                  <td>
                    <span className='inline-block px-2 py-2 text-green-800 bg-green-300 rounded-xl bg-opacity-80'>
                      {item.grandPrice} ر.ق
                    </span>
                  </td>
                  <td className='px-1 py-2'>{item.orderId}</td>
                  <td
                    className={`px-1 py-2 font-bold${
                      item.orderStatus === 'reject'
                        ? ' text-red-600 dark:text-red-400'
                        : item.orderStatus === 'accept'
                        ? ' text-green-600 dark:text-green-500'
                        : ''
                    }`}
                  >
                    {item.orderStatus === 'pending'
                      ? 'تحت المراجعة'
                      : item.orderStatus === 'accept'
                      ? 'تمت الموافقة'
                      : 'تم الرفض'}
                  </td>
                  <td>
                    {item.orderStatus === 'pending' ? (
                      <>
                        <AcceptBtn id={item._id} />
                        <RejectBtn id={item._id} />
                        <DeleteBtn id={item._id} />
                      </>
                    ) : item.orderStatus === 'accept' ? (
                      <>
                        <RejectBtn id={item._id} />
                        <DeleteBtn id={item._id} />
                      </>
                    ) : item.orderStatus === 'reject' ? (
                      <>
                        <AcceptBtn id={item._id} />
                        <DeleteBtn id={item._id} />
                      </>
                    ) : (
                      <span>لا يوجد إجراء</span>
                    )}
                  </td>
                </tr>
              ))}

              <tr>
                <td colSpan='100%'>
                  <Pagination
                    routeName={`dashboard/orders`}
                    pageNum={pageNumber}
                    numberOfPages={ordersData?.numberOfPages}
                    count={ordersData?.itemsCount}
                    foodId={ordersData?.response?._id}
                    itemsPerPage={itemsPerPage}
                  />
                </td>
              </tr>
            </>
          ) : !ordersData ? (
            <tr>
              <td />
              <td />
              <td />
              <td />
              <td />
              <td>
                <LoadingSpinner />
              </td>
              <td />
            </tr>
          ) : (
            <tr>
              <td />
              <td />
              <td />
              <td />
              <td />
              <td className='flex flex-col px-1 py-2'>
                <p
                  className='my-2 md:text-2xl text-red-600 font-[600] py-2 px-1'
                  data-form-msg
                >
                  لم يتم العثور على طلبات بعد، يمكنك العودة للوحة التحكم بالضغط على
                </p>
                <Link
                  to={goTo('dashboard')}
                  className='min-w-[7rem] bg-blue-500 hover:bg-blue-600 text-white py-1.5 text-lg px-6 rounded-md'
                >
                  لوحة التحكم
                </Link>
              </td>
              <td />
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}

const AcceptBtn = ({ id }) => (
  <button
    id='acceptOrder'
    data-id={id}
    data-status='accept'
    className='m-1 px-2 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 min-w-[7rem] relative text-center overflow-hidden'
    tooltip='موافقة الطلب'
  >
    <span className='py-0.5 px-1 md:pl-1 md:pr-2 bg-green-300 rounded-md absolute right-2 top-1.5 pointer-events-none'>
      &#9989;
    </span>
    <span className='mr-4 pointer-events-none'>موافقة</span>
  </button>
)

const RejectBtn = ({ id }) => (
  <button
    id='rejectOrder'
    data-id={id}
    data-status='reject'
    className='m-1 px-2 py-2 text-sm text-white bg-gray-600 rounded-md hover:bg-gray-700 min-w-[7rem] relative text-center overflow-hidden border'
    tooltip='رفض الطلب'
  >
    <span className='py-0.5 px-1 md:pl-1 md:pr-2 bg-gray-300 rounded-md absolute right-2 top-1.5 pointer-events-none'>
      &#10060;
    </span>
    <span className='mr-4 pointer-events-none'>رفض</span>
  </button>
)

const DeleteBtn = ({ id }) => (
  <button
    id='deleteOrder'
    data-id={id}
    data-status='delete'
    className='m-1 px-2 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 min-w-[7rem] relative text-center overflow-hidden'
    tooltip='حذف الطلب'
  >
    <span className='py-0.5 px-1 md:pl-1 md:pr-2 bg-red-200 rounded-md absolute right-2 top-1.5 pointer-events-none'>
      &#128465;
    </span>
    <span className='mr-4 pointer-events-none'>حذف</span>
  </button>
)

export default OrdersTable
