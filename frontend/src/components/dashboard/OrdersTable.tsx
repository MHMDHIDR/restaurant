import { useState, useEffect } from 'react'
import useAxios from '../../hooks/useAxios'
import { Link, useParams } from 'react-router-dom'
import Axios from 'axios'

import useEventListener from '../../hooks/useEventListener'

import goTo from '../../utils/goTo'
import { toggleCSSclasses } from '../../utils/toggleCSSclasses'

import { API_URL } from '../../data/constants'

import Modal from '../Modal/Modal'
import { Success, Error, Loading } from '../Icons/Status'
import { PayPal } from '../Icons/Payments'
import { LoadingSpinner } from '../Loading'
import Pagination from '../Pagination'
import Divider from '../Divider'

const OrdersTable = ({ ordersByUserEmail = false }) => {
  let { pageNum }: any = useParams()

  const pageNumber = !pageNum || pageNum < 1 || isNaN(pageNum) ? 1 : parseInt(pageNum)
  const itemsPerPage = 5

  const [acceptOrderStatus, setAcceptOrderStatus] = useState()
  const [deleteOrderStatus, setDeleteOrderStatus] = useState()
  const [orderId, setOrderId] = useState()
  const [orderStatus, setOrderStatus] = useState()
  const [ordersData, setOrdersData] = useState<any>()
  const [orderItemsIds, setOrderItemsIds] = useState([])
  const [orderToppingsId, setOrderToppingsId] = useState([])

  const modalLoading = document.querySelector('#modal')

  const USER = JSON.parse(localStorage.getItem('user'))

  const { ...response } = useAxios({
    method: 'get',
    url: `/orders/${pageNumber}/${itemsPerPage}?orderDate=-1`,
    headers: USER ? JSON.stringify({ Authorization: `Bearer ${USER.token}` }) : null
  })

  useEffect(() => {
    if (response.response !== null) {
      setOrdersData(response.response)
      setOrderItemsIds(
        response.response.response.map(({ orderItems }) =>
          orderItems?.map(({ cItemId }) => cItemId)
        )
      )
      setOrderToppingsId(
        response.response.response.map(
          ({ orderToppings }) =>
            orderToppings?.length > 0 && orderToppings.map(({ toppingId }) => toppingId)
        )
      )
    }
  }, [response.response])

  const inSeletedToppings = orderToppingsId?.map(selected =>
    //if there is no toppings in order then selected will be empty array
    (selected || []).filter((element: string | any[]) =>
      orderItemsIds.map(id => id?.includes(element?.slice(0, -2)))
    )
  )

  useEventListener('click', (e: any) => {
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

  const handleOrder = async (orderId: string, orderStatus: string) => {
    //delete order
    if (orderStatus === 'delete') {
      try {
        //You need to name the body {data} so it can be recognized in (.delete) method
        const response = await Axios.delete(`${API_URL}/orders/${orderId}`)
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
      const response = await Axios.patch(`${API_URL}/orders/${orderId}`, formData)
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
              ? `????    ?????? ???????????????? ?????? ??????????    ????`
              : orderStatus === 'delete'
              ? '????    ???? ?????? ?????????? ??????????    ???'
              : `??????    ???? ?????? ?????????? ??????????    ????`
          }
          redirectLink={goTo('orders')}
          redirectTime={4000}
        />
      ) : acceptOrderStatus === 0 ? (
        <Modal
          status={Error}
          msg={`??????????! ?????? ????!`}
          redirectLink={goTo('orders')}
          redirectTime={4000}
        />
      ) : null}

      {/* Confirm Box */}
      <Modal
        status={Loading}
        modalHidden='hidden'
        classes='txt-blue text-center'
        msg={`???? ?????? ?????????? ???? ${
          orderStatus === 'accept' ? '????????????????' : orderStatus === 'delete' ? '??????' : '??????'
        } ?????? ???????????? ???? ???????? ?????????????? ???? ?????? ????????????`}
        ctaConfirmBtns={[
          orderStatus === 'accept' ? '??????????' : orderStatus === 'delete' ? '??????' : '??????',
          '??????????'
        ]}
      />
      <table className='table w-full text-center border-collapse table-auto'>
        <thead className='text-white bg-orange-800'>
          <tr>
            <th className='max-w-[0.25rem] px-1 py-2 '>??.</th>
            <th className='px-1 py-2 min-w-[10rem]'>?????? ??????????</th>
            <th className='px-1 py-2 min-w-[7rem]'>???????????? ???????????????????? ????????????????</th>
            <th className='px-1 py-2'>?????????? ?? ?????? ??????????</th>
            <th className='px-1 py-2'>???????? ???????? ??????????</th>
            <th className='px-1 py-2 min-w-[20rem]'>???????????? ??????????</th>
            <th className='px-1 py-2'>?????????????? ??????????</th>
            <th className='px-1 py-2'>?????????? ????????????????</th>
            <th className='px-1 py-2'>?????? ??????????</th>
            <th className='px-1 py-2 min-w-[6rem]'>???????? ??????????</th>
            <th className='px-1 py-2'>???????? ??????????</th>
            {JSON.parse(localStorage.getItem('user')).userAccountType === 'admin' && (
              <th className='px-1 py-2'>??????????????</th>
            )}
          </tr>
        </thead>

        <tbody>
          {(ordersData ?? ordersData !== undefined) &&
          ordersData?.response?.length > 0 ? (
            <>
              {/* filter by email ordersByUserEmail === JSON.parse(localStorage.getItem('user')).userEmail */}
              {ordersByUserEmail === true ? (
                //show only orders by user email

                //FILTER by email
                ordersData?.response?.filter(
                  order =>
                    order.userEmail === JSON.parse(localStorage.getItem('user')).userEmail
                ).length > 0 ? ( //means there is at least one order by the current user email
                  ordersData?.response
                    ?.filter(
                      (order: { userEmail: string }) =>
                        order.userEmail ===
                        JSON.parse(localStorage.getItem('user')).userEmail
                    )
                    .map((order, idx) => (
                      <tr
                        key={order._id}
                        className='transition-colors even:bg-neutral-300 odd:bg-neutral-200 dark:even:bg-neutral-700 dark:odd:bg-neutral-600'
                      >
                        <td className='px-1 py-2 max-w-[0.25rem]'>{idx + 1}</td>
                        <td className='px-1 py-2 min-w-[10rem]'>{order.personName}</td>
                        <td className='px-1 py-2 min-w-[6rem]'>{order.userEmail}</td>
                        <td className='text-right min-w-[13rem] px-1 py-2'>
                          <p>??????????????: {order.orderDate.split(',')[0]}</p>
                          <p>??????????: {order.orderDate.split(',')[1]}</p>
                        </td>
                        <td className='px-1 py-2'>{order.personPhone}</td>
                        <td className='px-1 py-2 min-w-[30rem]'>
                          <span
                            data-tooltip={`?????? ${order.orderItems.length} ${
                              order.orderItems.length > 1 ? '??????????' : '??????'
                            }`}
                          >
                            <span
                              data-order-content-arrow
                              className={`inline-block text-xl font-bold transition-transform duration-300 cursor-pointer hover:translate-y-1`}
                            >
                              &#8679;
                            </span>
                          </span>

                          <div className='max-h-screen overflow-hidden transition-all duration-300 ordered-items'>
                            {order?.orderItems?.map(item => (
                              <div key={item.cItemId}>
                                <div className='flex flex-col gap-4'>
                                  <div className='flex flex-col items-start gap-2'>
                                    <div className='flex items-center w-full gap-4'>
                                      <img
                                        loading='lazy'
                                        src={item.cImg[0].foodImgDisplayPath}
                                        alt={item.cHeading}
                                        width='50'
                                        height='50'
                                        className='object-cover rounded-lg shadow-md w-14 h-14'
                                      />
                                      <div className='flex flex-col items-start'>
                                        <span>?????? ??????????: {item.cHeading}</span>
                                        <span>????????????: {item.cQuantity}</span>
                                      </div>
                                    </div>

                                    <span className='inline-block px-2 py-2 text-green-800 bg-green-300 rounded-xl bg-opacity-80'>
                                      ?????????? ?????? ?????? ??????????????: &nbsp;
                                      <strong>{item.cPrice * item.cQuantity}</strong> ??.??
                                    </span>
                                  </div>
                                  <div className='flex flex-col gap-6'>
                                    {inSeletedToppings
                                      .map(id => id.slice(0, -2))
                                      ?.includes(item.cItemId) && <h3>????????????????</h3>}
                                    {item?.cToppings?.map(
                                      ({
                                        toppingId,
                                        toppingName,
                                        toppingPrice,
                                        toppingQuantity
                                      }) =>
                                        inSeletedToppings[idx]?.includes(toppingId) && (
                                          <div key={toppingId} className='flex gap-4'>
                                            <span className='px-2 text-orange-900 bg-orange-200 rounded-lg'>
                                              ??? &nbsp; {toppingName}
                                            </span>
                                            <span className='px-2 text-orange-900 bg-orange-200 rounded-lg'>
                                              ?????? ???????????? {toppingPrice}
                                            </span>
                                            <span className='px-2 text-orange-900 bg-orange-200 rounded-lg'>
                                              ???????????? ???????????????? {toppingQuantity}
                                            </span>
                                            <span className='px-2 text-green-900 bg-green-200 rounded-lg'>
                                              ?????????? ?????? ????????????:{' '}
                                              {toppingPrice * toppingQuantity} ??.??
                                            </span>
                                            <hr />
                                          </div>
                                        )
                                    )}
                                  </div>
                                </div>
                                <Divider marginY={2} thickness={0.5} />
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className='px-1 py-2'>
                          {!order.personNotes ? (
                            <span className='font-bold text-red-600 dark:text-red-400'>
                              ???? ???????? ?????????????? ???? ??????????
                            </span>
                          ) : (
                            order.personNotes
                          )}
                        </td>
                        <td>
                          <span className='inline-block px-2 py-2 text-green-800 bg-green-300 rounded-xl bg-opacity-80'>
                            <strong>{order.grandPrice}</strong> ??.??
                          </span>
                        </td>
                        <td className='px-1 py-2'>{order.orderId}</td>
                        <td className='px-1 py-2 min-w-[6rem]'>
                          <span
                            data-tooltip={`?????? ???? ???????? ${
                              order.paymentData.paymentSource === 'paypal' && '?????? ??????'
                            }`}
                          >
                            {order.paymentData.paymentSource === 'paypal' && <PayPal />}
                          </span>
                        </td>
                        <td
                          className={`px-1 py-2 font-bold${
                            order.orderStatus === 'reject'
                              ? ' text-red-600 dark:text-red-400'
                              : order.orderStatus === 'accept'
                              ? ' text-green-600 dark:text-green-500'
                              : ''
                          }`}
                        >
                          {order.orderStatus === 'pending'
                            ? '?????? ????????????????'
                            : order.orderStatus === 'accept'
                            ? '?????? ????????????????'
                            : '???? ??????????'}
                        </td>
                        {JSON.parse(localStorage.getItem('user')).userAccountType ===
                          'admin' && (
                          <td>
                            {order.orderStatus === 'pending' ? (
                              <>
                                <AcceptBtn id={order._id} />
                                <RejectBtn id={order._id} />
                                <DeleteBtn id={order._id} />
                              </>
                            ) : order.orderStatus === 'accept' ? (
                              <>
                                <RejectBtn id={order._id} />
                                <DeleteBtn id={order._id} />
                              </>
                            ) : order.orderStatus === 'reject' ? (
                              <>
                                <AcceptBtn id={order._id} />
                                <DeleteBtn id={order._id} />
                              </>
                            ) : (
                              <span>???? ???????? ??????????</span>
                            )}
                          </td>
                        )}
                      </tr>
                    ))
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
                        ???? ?????? ???????????? ?????? ?????????? ???????? ?????????? ?????????? ?????? ????????
                      </p>
                      <Link
                        to={`/view`}
                        className='min-w-[7rem] bg-blue-500 hover:bg-blue-600 text-white py-1.5 text-lg px-6 rounded-md'
                      >
                        ?????????? ??????????????
                      </Link>
                    </td>
                    <td />
                  </tr>
                )
              ) : (
                //Show all orders
                ordersData?.response?.map((order, idx) => (
                  <tr
                    key={order._id}
                    className='transition-colors even:bg-neutral-300 odd:bg-neutral-200 dark:even:bg-neutral-700 dark:odd:bg-neutral-600'
                  >
                    <td className='px-1 py-2 max-w-[0.25rem]'>{idx + 1}</td>
                    <td className='px-1 py-2 min-w-[10rem]'>{order.personName}</td>
                    <td className='px-1 py-2 min-w-[6rem]'>{order.userEmail}</td>
                    <td className='text-right min-w-[13rem] px-1 py-2'>
                      <p>??????????????: {order.orderDate.split(',')[0]}</p>
                      <p>??????????: {order.orderDate.split(',')[1]}</p>
                    </td>
                    <td className='px-1 py-2'>{order.personPhone}</td>
                    <td className='px-1 py-2 min-w-[30rem]'>
                      <span
                        data-tooltip={`?????? ${order.orderItems.length} ${
                          order.orderItems.length > 1 ? '??????????' : '??????'
                        }`}
                      >
                        <span
                          data-order-content-arrow
                          className={`inline-block text-xl font-bold transition-transform duration-300 cursor-pointer hover:translate-y-1`}
                        >
                          &#8679;
                        </span>
                      </span>

                      <div className='max-h-screen overflow-hidden transition-all duration-300 ordered-items'>
                        {order?.orderItems?.map(item => (
                          <div key={item.cItemId}>
                            <div className='flex flex-col gap-4'>
                              <div className='flex flex-col items-start gap-2'>
                                <div className='flex items-center w-full gap-4'>
                                  <img
                                    loading='lazy'
                                    src={item.cImg[0].foodImgDisplayPath}
                                    alt={item.cHeading}
                                    width='50'
                                    height='50'
                                    className='object-cover rounded-lg shadow-md w-14 h-14'
                                  />
                                  <div className='flex flex-col items-start'>
                                    <span>?????? ??????????: {item.cHeading}</span>
                                    <span>????????????: {item.cQuantity}</span>
                                  </div>
                                </div>

                                <span className='inline-block px-2 py-2 text-green-800 bg-green-300 rounded-xl bg-opacity-80'>
                                  ?????????? ?????? ?????? ??????????????: &nbsp;
                                  <strong>{item.cPrice * item.cQuantity}</strong> ??.??
                                </span>
                              </div>
                              <div className='flex flex-col gap-6'>
                                {inSeletedToppings
                                  .map(id => id.slice(0, -2))
                                  ?.includes(item.cItemId) && <h3>????????????????</h3>}
                                {item?.cToppings?.map(
                                  ({
                                    toppingId,
                                    toppingName,
                                    toppingPrice,
                                    toppingQuantity
                                  }) =>
                                    inSeletedToppings[idx]?.includes(toppingId) && (
                                      <div key={toppingId} className='flex gap-4'>
                                        <span className='px-2 text-orange-900 bg-orange-200 rounded-lg'>
                                          ??? &nbsp; {toppingName}
                                        </span>
                                        <span className='px-2 text-orange-900 bg-orange-200 rounded-lg'>
                                          ?????? ???????????? {toppingPrice}
                                        </span>
                                        <span className='px-2 text-orange-900 bg-orange-200 rounded-lg'>
                                          ???????????? ???????????????? {toppingQuantity}
                                        </span>
                                        <span className='px-2 text-green-900 bg-green-200 rounded-lg'>
                                          ?????????? ?????? ????????????:{' '}
                                          {toppingPrice * toppingQuantity} ??.??
                                        </span>
                                        <hr />
                                      </div>
                                    )
                                )}
                              </div>
                            </div>
                            <Divider marginY={2} thickness={0.5} />
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className='px-1 py-2'>
                      {!order.personNotes ? (
                        <span className='font-bold text-red-600 dark:text-red-400'>
                          ???? ???????? ?????????????? ???? ??????????
                        </span>
                      ) : (
                        order.personNotes
                      )}
                    </td>
                    <td>
                      <span className='inline-block px-2 py-2 text-green-800 bg-green-300 rounded-xl bg-opacity-80'>
                        <strong>{order.grandPrice}</strong> ??.??
                      </span>
                    </td>
                    <td className='px-1 py-2'>{order.orderId}</td>
                    <td className='px-1 py-2 min-w-[6rem]'>
                      <span
                        data-tooltip={`?????? ???? ???????? ${
                          order.paymentData.paymentSource === 'paypal' && '?????? ??????'
                        }`}
                      >
                        {order.paymentData.paymentSource === 'paypal' && <PayPal />}
                      </span>
                    </td>
                    <td
                      className={`px-1 py-2 font-bold${
                        order.orderStatus === 'reject'
                          ? ' text-red-600 dark:text-red-400'
                          : order.orderStatus === 'accept'
                          ? ' text-green-600 dark:text-green-500'
                          : ''
                      }`}
                    >
                      {order.orderStatus === 'pending'
                        ? '?????? ????????????????'
                        : order.orderStatus === 'accept'
                        ? '?????? ????????????????'
                        : '???? ??????????'}
                    </td>
                    <td>
                      {order.orderStatus === 'pending' ? (
                        <>
                          <AcceptBtn id={order._id} />
                          <RejectBtn id={order._id} />
                          <DeleteBtn id={order._id} />
                        </>
                      ) : order.orderStatus === 'accept' ? (
                        <>
                          <RejectBtn id={order._id} />
                          <DeleteBtn id={order._id} />
                        </>
                      ) : order.orderStatus === 'reject' ? (
                        <>
                          <AcceptBtn id={order._id} />
                          <DeleteBtn id={order._id} />
                        </>
                      ) : (
                        <span>???? ???????? ??????????</span>
                      )}
                    </td>
                  </tr>
                ))
              )}

              <tr>
                <td colSpan={100}>
                  <Pagination
                    routeName={ordersByUserEmail ? `my-orders` : `dashboard/orders`}
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
                  ???? ?????? ???????????? ?????? ?????????? ???????? ?????????? ???????????? ?????????? ???????????? ???????????? ??????
                </p>
                <Link
                  to={goTo('dashboard')}
                  className='min-w-[7rem] bg-blue-500 hover:bg-blue-600 text-white py-1.5 text-lg px-6 rounded-md'
                >
                  ???????? ????????????
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
    data-tooltip='???????????? ??????????'
  >
    <span className='py-0.5 px-1 md:pl-1 md:pr-2 bg-green-300 rounded-md absolute right-2 top-1.5 pointer-events-none'>
      &#9989;
    </span>
    <span className='mr-4 pointer-events-none'>????????????</span>
  </button>
)

const RejectBtn = ({ id }) => (
  <button
    id='rejectOrder'
    data-id={id}
    data-status='reject'
    className='m-1 px-2 py-2 text-sm text-white bg-gray-600 rounded-md hover:bg-gray-700 min-w-[7rem] relative text-center overflow-hidden border'
    data-tooltip='?????? ??????????'
  >
    <span className='py-0.5 px-1 md:pl-1 md:pr-2 bg-gray-300 rounded-md absolute right-2 top-1.5 pointer-events-none'>
      &#10060;
    </span>
    <span className='mr-4 pointer-events-none'>??????</span>
  </button>
)

const DeleteBtn = ({ id }) => (
  <button
    id='deleteOrder'
    data-id={id}
    data-status='delete'
    className='m-1 px-2 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 min-w-[7rem] relative text-center overflow-hidden'
    data-tooltip='?????? ??????????'
  >
    <span className='py-0.5 px-1 md:pl-1 md:pr-2 bg-red-200 rounded-md absolute right-2 top-1.5 pointer-events-none'>
      &#128465;
    </span>
    <span className='mr-4 pointer-events-none'>??????</span>
  </button>
)

export default OrdersTable
