import { forwardRef } from 'react'
import { cardProps } from '../../types'
import { createLocaleDateString } from '../../utils/convertDate'
import Divider from '../Divider'

const InvoicePrint = forwardRef((ordersData, ref) => {
  return (
    <table className='table w-full text-center border-collapse table-auto' ref={ref}>
      <thead className='text-white bg-orange-800'>
        <tr>
          <th className='px-1 py-2 min-w-[10rem]'>الإســـــــم</th>
          <th className='px-1 py-2 min-w-[7rem]'>البريد الالكتروني</th>
          <th className='px-1 py-2'>تاريخ و وقت الطلب</th>
          <th className='px-1 py-2'>الهاتف</th>
          <th className='px-1 py-2'>رقم الطلب</th>
          <th className='px-1 py-2 min-w-[20rem]'>تفاصيل الطلب</th>
          <th className='px-1 py-2'>ملاحظات الطلب</th>
          <th className='px-1 py-2'>السعر الاجمالي</th>
        </tr>
      </thead>
      <tbody>
        {ordersData?.response?.map((order: any, idx: number) => (
          <tr
            key={order._id}
            className='transition-colors even:bg-neutral-300 odd:bg-neutral-200 dark:even:bg-neutral-700 dark:odd:bg-neutral-600'
          >
            <td className='min-w-[0.5rem] px-1 py-2'>{idx + 1}</td>
            <td className='px-1 py-2 min-w-[10rem]'>{order.personName}</td>
            <td className='px-1 py-2 min-w-[6rem]'>{order.userEmail}</td>
            <td className='text-center min-w-[13rem] px-1 py-2'>
              <p>{createLocaleDateString(order.orderDate)}</p>
            </td>
            <td className='px-1 py-2'>{order.personPhone}</td>
            <td className='px-1 py-2'>{order.orderId}</td>
            <td className='px-1 py-2 min-w-[30rem]'>
              <span
                data-tooltip={`عرض ${order.orderItems.length} ${
                  order.orderItems.length > 1 ? 'طلبات' : 'طلب'
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
                {order?.orderItems.length === 0 ? (
                  <p className='max-w-lg my-2 text-lg font-bold leading-10 tracking-wider mx-auto text-red-500'>
                    عفواً! لا يوجد تفاصيل خاصة بهذا الطلب
                  </p>
                ) : (
                  order?.orderItems?.map((item: cardProps, idx: number) => (
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
                              <span>اسم الطلب: {item.cHeading}</span>
                              <span>الكمية: {item.cQuantity}</span>
                            </div>
                          </div>

                          <span className='inline-block px-2 py-2 text-green-800 bg-green-300 rounded-xl bg-opacity-80'>
                            السعر على حسب الكميات: &nbsp;
                            <strong>{item.cPrice * item.cQuantity}</strong> ر.ق
                          </span>
                        </div>
                        <div className='flex flex-col gap-6'>
                          {inSeletedToppings
                            .map(id => id.slice(0, -2))
                            ?.includes(item.cItemId) && <h3>الاضافات</h3>}
                          {item?.cToppings?.map(
                            ({ toppingId, toppingName, toppingPrice, toppingQuantity }) =>
                              inSeletedToppings[idx]?.includes(toppingId) && (
                                <div key={toppingId} className='flex gap-4'>
                                  <span className='px-2 text-orange-900 bg-orange-200 rounded-lg'>
                                    ✅ &nbsp; {toppingName}
                                  </span>
                                  <span className='px-2 text-orange-900 bg-orange-200 rounded-lg'>
                                    سعر الوحدة {toppingPrice}
                                  </span>
                                  <span className='px-2 text-orange-900 bg-orange-200 rounded-lg'>
                                    الكمية المطلوبة {toppingQuantity}
                                  </span>
                                  <span className='px-2 text-green-900 bg-green-200 rounded-lg'>
                                    السعر حسب الكمية: {toppingPrice * toppingQuantity} ر.ق
                                  </span>
                                  <hr />
                                </div>
                              )
                          )}
                        </div>
                      </div>
                      <Divider marginY={2} thickness={0.5} />
                    </div>
                  ))
                )}
              </div>
            </td>
            <td className='px-1 py-2'>
              {!order.personNotes ? (
                <span className='font-bold text-red-600 dark:text-red-400'>
                  لا يوجد ملاحظات في الطلب
                </span>
              ) : (
                order.personNotes
              )}
            </td>
            <td>
              <span className='inline-block px-2 py-2 text-green-800 bg-green-300 rounded-xl bg-opacity-80'>
                <strong>{order.grandPrice}</strong> ر.ق
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
})

export default InvoicePrint
