import { useParams } from 'react-router-dom'
import { useContext, useState, useRef, useEffect } from 'react'
import Axios from 'axios'

import { CartContext } from '../../../Contexts/CartContext'
import { ToppingsContext } from '../../../Contexts/ToppingsContext'

import useDocumentTitle from '../../../hooks/useDocumentTitle'

import { validPhone } from '../../../utils/validForm'
import scrollToView from '../../../utils/scrollToView'

import { API_URL } from '../../../data/constants'

import Modal from '../../../components/Modal/Modal'
import { Success } from '../../../components/Icons/Status'
import { LoadingCard, LoadingSpinner } from '../../../components/Loading'
import CartItems from '../../OrderFood/CartItems'
import useAxios from '../../../hooks/useAxios'

const DashboardOrdersEdit = () => {
  useDocumentTitle('Cart Items')

  useEffect(() => {
    scrollToView()
  }, [])

  const USER = JSON.parse(localStorage.getItem('user'))

  const { items, grandPrice, setGrandPrice } = useContext(CartContext)
  const { checkedToppings, orderItemToppings, setOrderItemToppings } =
    useContext(ToppingsContext)

  useEffect(() => setOrderItemToppings(ordersData?.orderToppings), [])

  //global variables
  const MAX_CHARACTERS = 100

  const [ordersData, setOrdersData] = useState<any>()

  //Form States
  const [userId, setUserId] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [personName, setPersonName] = useState('')
  const [personPhone, setPersonPhone] = useState('')
  const [personAddress, setPersonAddress] = useState('')
  const [personNotes, setPersonNotes] = useState('')
  const [orderFoodStatus, setOrderFoodStatus] = useState(0)
  const [responseMsg, setResponseMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  //Declaring Referenced Element
  const personNameErr = useRef<HTMLSpanElement>(null)
  const personPhoneErr = useRef<HTMLSpanElement>(null)
  const personAddressErr = useRef<HTMLSpanElement>(null)
  const formErr = useRef<HTMLParagraphElement>(null)
  const grandPriceRef = useRef<HTMLElement>(null)

  const { ...response } = useAxios({
    url: `/orders/1/1/${useParams().orderId}`,
    headers: USER ? JSON.stringify({ Authorization: `Bearer ${USER.token}` }) : null
  })

  useEffect(() => {
    if (response.response !== null) {
      setOrdersData(response.response.response)
      setUserId(response.response.response?.userId)
      setUserEmail(response.response.response?.userEmail)
    }
  }, [response.response])

  useEffect(() => {
    setGrandPrice(grandPriceRef?.current?.textContent || grandPrice)
  }, [grandPriceRef?.current?.textContent, grandPrice])

  const handleCollectOrder = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (
      personName !== '' &&
      personPhone !== '' &&
      personNameErr.current.textContent === '' &&
      personPhoneErr.current.textContent === '' &&
      personAddressErr.current.textContent === ''
    ) {
      handleSaveOrder()
      formErr.current.textContent = ''
    } else {
      formErr.current.textContent = 'الرجاء إدخال البيانات المطلوبة بشكل صحيح'
    }
  }

  const handleSaveOrder = async () => {
    //using FormData to send constructed data
    const formData = new FormData()
    formData.append('userId', userId)
    formData.append('userEmail', userEmail)
    formData.append('personName', personName)
    formData.append('personPhone', personPhone)
    formData.append('personAddress', personAddress)
    formData.append('personNotes', personNotes)
    formData.append('checkedToppings', JSON.stringify(orderItemToppings))
    formData.append('foodItems', JSON.stringify(items))
    formData.append('grandPrice', grandPrice)

    try {
      const response = await Axios.post(`${API_URL}/orders`, formData)
      const { orderAdded, message } = response.data
      setIsLoading(false)

      setOrderFoodStatus(orderAdded)
      setResponseMsg(message)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <section id='orderFood' className='py-12 my-8'>
        {orderFoodStatus === 1 && (
          <Modal
            status={Success}
            msg={responseMsg}
            btnName='قائمة الوجبات'
            btnLink='/view'
            redirectLink='/view'
            redirectTime={10000}
          />
        )}

        <div className='container mx-auto text-center'>
          {ordersData ? (
            <>
              <h2 className='inline-block mb-20 text-3xl font-bold'>
                تعديل تفاصيل طلب ({ordersData.personName})
              </h2>

              <CartItems
                orderItems={ordersData?.orderItems}
                orderToppings={ordersData?.orderToppings}
              />

              <form method='POST' onSubmit={handleCollectOrder}>
                <label htmlFor='name' className={`form__group`}>
                  <input
                    className={`relative form__input`}
                    id='name'
                    name='name'
                    type='text'
                    defaultValue={personName || ordersData.personName}
                    onChange={e => setPersonName(e.target.value.trim())}
                    onKeyUp={e => {
                      const target = e.target.value.trim()

                      if (target.length > 0 && target.length < 4) {
                        personNameErr.current.textContent = 'يرجى إدخال إسم بصيغة صحيحة'
                      } else if (target.length > 30) {
                        personNameErr.current.textContent =
                          'الاسم طويل جداً، يرجى إضافة إسم لا يزيد عن 30 حرف'
                      } else {
                        personNameErr.current.textContent = ''
                      }
                    }}
                    required
                  />
                  <span className={`form__label`}>
                    الاســـــــــــــــــم &nbsp;
                    <strong className='text-xl leading-4 text-red-600'>*</strong>
                  </span>
                  <span
                    className='inline-block md:text-lg text-red-600 dark:text-red-400 font-[600] pt-2 px-1'
                    ref={personNameErr}
                  ></span>
                </label>
                <label htmlFor='phoneNumber' className={`form__group`}>
                  <input
                    className={`form__input`}
                    id='phoneNumber'
                    name='phoneNumber'
                    type='tel'
                    defaultValue={personPhone || ordersData.personPhone}
                    onChange={e => setPersonPhone(e.target.value.trim())}
                    onKeyUp={e => {
                      const target = e.target.value.trim()

                      if (
                        (target.length > 0 && target.length < 8) ||
                        target.length > 8 ||
                        !validPhone(target)
                      ) {
                        personPhoneErr.current.textContent =
                          'الرجاء إدخال رقم هاتف نفس صيغة رقم الهاتف في المثال'
                      } else {
                        personPhoneErr.current.textContent = ''
                      }
                    }}
                    required
                  />
                  <span className={`form__label`}>
                    رقم الهاتف - مثال: 33445566 &nbsp;
                    <strong className='text-xl leading-4 text-red-600'>*</strong>
                  </span>
                  <span
                    className='inline-block md:text-lg text-red-600 dark:text-red-400 font-[600] pt-2 px-1'
                    ref={personPhoneErr}
                  ></span>
                </label>
                <label htmlFor='Address' className={`form__group`}>
                  <input
                    className={`form__input`}
                    id='Address'
                    name='Address'
                    type='text'
                    defaultValue={personAddress || ordersData.personAddress}
                    onChange={e => setPersonAddress(e.target.value.trim())}
                    onKeyUp={e => {
                      const target = e.target.value.trim()

                      if (target.length > 0 && target.length < 4) {
                        personAddressErr.current.textContent =
                          'يرجى إدخال إسم بصيغة صحيحة'
                      } else {
                        personAddressErr.current.textContent = ''
                      }
                    }}
                    required
                  />
                  <span className={`form__label`}>
                    العنوان - مثال: منطقة رقم 53 - شارع رقم 000 - منزل رقم 00&nbsp;
                    <strong className='text-xl leading-4 text-red-600'>*</strong>
                  </span>
                  <span
                    className='inline-block md:text-lg text-red-600 dark:text-red-400 font-[600] pt-2 px-1'
                    ref={personAddressErr}
                  ></span>
                </label>
                <label htmlFor='message' className={`form__group`}>
                  <textarea
                    className={`form__input`}
                    id='message'
                    name='message'
                    defaultValue={personNotes || ordersData.personNotes}
                    maxLength={MAX_CHARACTERS * 2}
                    onChange={e => setPersonNotes(e.target.value.trim())}
                  ></textarea>

                  <span className={`form__label`}>
                    تستطيع وضع ملاحظات أو اضافات للشيف لإضافتها لك في طلبك &nbsp;😄
                  </span>
                </label>
                <p
                  className='block text-2xl my-4 text-red-600 dark:text-red-400 font-[600] pt-2 px-1'
                  ref={formErr}
                ></p>
                <span className='inline-block px-3 py-1 my-4 text-xl text-green-800 bg-green-300 border border-green-800 rounded-md select-none'>
                  السعر الاجمالي:&nbsp;
                  <strong ref={grandPriceRef}>
                    {items.reduce(
                      (acc, item) =>
                        acc +
                        item.cPrice * item.cQuantity +
                        //calculate all items checked toppings prices * all items checked toppings quantities
                        checkedToppings.reduce(
                          (acc, curr) =>
                            curr.toppingId.slice(0, -2) === item.cItemId
                              ? acc +
                                parseInt(curr.toppingPrice) *
                                  item.cToppings.reduce(
                                    (acc, curr2) =>
                                      curr2.toppingId === curr.toppingId
                                        ? curr2.toppingQuantity
                                        : acc,
                                    0
                                  )
                              : acc,
                          0
                        ),
                      0
                    )}
                  </strong>
                  &nbsp; ر.ق
                </span>

                <div className='flex flex-col items-center justify-evenly'>
                  <button
                    type='submit'
                    className={`w-full py-2 text-white text-lg uppercase bg-green-800 hover:bg-green-700 rounded-lg scale-100 transition-all flex justify-center items-center gap-3`}
                    onClick={handleCollectOrder}
                  >
                    {isLoading && isLoading ? (
                      <>
                        <LoadingSpinner />
                        جارِ تأكيد بيانات الطلب...
                      </>
                    ) : (
                      'تأكيد البيانات'
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <LoadingCard />
          )}
        </div>
      </section>
    </>
  )
}

export default DashboardOrdersEdit
