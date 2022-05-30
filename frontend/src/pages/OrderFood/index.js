import { useContext, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
// import Axios from 'axios'
import { PayPalButtons } from '@paypal/react-paypal-js'

import { CartContext } from '../../Contexts/CartContext'
import { ThemeContext } from '../../Contexts/ThemeContext'

import useDocumentTitle from '../../hooks/useDocumentTitle'

import { validPhone } from '../../functions/validForm'

import Modal from '../../components/Modal/Modal'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import CartItems from './CartItems'
import { Success } from '../../components/Icons/Status'

//orderFood
const OrderFood = () => {
  useDocumentTitle('Order Food')

  //global variables
  const MIN_CHARACTERS = 1
  const MAX_CHARACTERS = 100
  // const BASE_URL =
  //   process.env.NODE_ENV === 'development'
  //     ? process.env.REACT_APP_API_LOCAL_URL
  //     : process.env.REACT_APP_API_URL

  const { items } = useContext(CartContext)
  const { isDark } = useContext(ThemeContext)

  //Form States
  const [personName, setPersonName] = useState('')
  const [personPhone, setPersonPhone] = useState('')
  const [personNotes, setPersonNotes] = useState('')
  const [msg, setMsg] = useState('')
  // const [orderFoodStatus, setOrderFoodStatus] = useState('')
  // const [responseMsg, setResponseMsg] = useState('')
  const [grandPrice, setGrandPrice] = useState('')
  const [isVisisblePaypal, setIsVisisblePaypal] = useState(false)

  //Declaring Referenced Element
  const personNameErr = useRef(null)
  const personPhoneErr = useRef(null)
  const formErr = useRef(null)
  const grandPriceRef = useRef(null)

  const handleCollectOrder = async e => {
    e.preventDefault()

    //using FormData to send constructed data
    const formData = new FormData()
    formData.append('personName', personName)
    formData.append('personPhone', personPhone)
    formData.append('personNotes', personNotes)
    //if grandPrice is undefined, we'll take the value from grandPriceRef
    formData.append('grandPrice', grandPrice || grandPriceRef?.current?.textContent)
    formData.append('foodItems', JSON.stringify(items))

    if (
      personName !== '' &&
      personPhone !== '' &&
      personNameErr.current.textContent === '' &&
      personPhoneErr.current.textContent === ''
    ) {
      // if payment is successful, we'll send the data to the server
      // handleSaveOrder(formData)
      setIsVisisblePaypal(true)
    } else {
      formErr.current.textContent = 'الرجاء إدخال البيانات المطلوبة بشكل صحيح'
    }
  }

  // const handleSaveOrder = async formData => {
  //   try {
  //     const response = await Axios.post(`${BASE_URL}/orders`, formData)
  //     const { orderAdded, message } = response.data

  //     setOrderFoodStatus(orderAdded)
  //     setResponseMsg(message)
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }

  const [paidFor, setPaidFor] = useState(false)
  const [error, setError] = useState(null)

  const handleApprove = orderId => {
    // Call backend function to fulfill order

    // if response is success
    setPaidFor(true)
    // Refresh user's account or subscription status
  }

  if (paidFor) {
    // Display success message, modal or redirect user to success page
    setMsg('شكراً لشراءك من مطعمنا، سيتم التواصل معك في اقرب وقت')
  }

  if (error) {
    // Display error message, modal or redirect user to error page
    alert(error)
  }

  return (
    <>
      <Header />
      <section id='orderFood' className='py-12 my-8'>
        {msg && (
          <Modal
            status={Success}
            msg={msg}
            btnText='إعادة الذهاب إلى الصفحة الرئيسية'
            btnLink='/'
            classes='hidden'
          />
        )}
        <div className='container mx-auto text-center'>
          {items.length > 0 ? (
            <>
              <h2 className='inline-block mb-20 text-3xl font-bold'>الطلبات</h2>
              <CartItems setGrandPrice={setGrandPrice} />

              <form method='POST' onSubmit={handleCollectOrder}>
                <Link
                  to='/view'
                  className='block p-2 mx-auto my-10 text-xl transition-colors bg-orange-200 rounded-md w-fit hover:bg-orange-300 dark:text-orange-900'
                >
                  تصفح وجبات أخرى
                </Link>
                <h2 className='mb-10 text-2xl'>يرجى إضافة تفاصيل الطلب</h2>
                <label htmlFor='name' className='form__group'>
                  <input
                    className='relative form__input'
                    id='name'
                    name='name'
                    type='text'
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
                  <span className='form__label'>
                    اسمك الكريم &nbsp;
                    <strong className='text-xl leading-4 text-red-600'>*</strong>
                  </span>
                  <span
                    className='inline-block md:text-lg text-red-600 dark:text-red-400 font-[600] pt-2 px-1'
                    ref={personNameErr}
                  ></span>
                </label>
                <label htmlFor='phoneNumber' className='form__group'>
                  <input
                    className='form__input'
                    id='phoneNumber'
                    name='phoneNumber'
                    type='tel'
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
                  <span className='form__label'>
                    رقم الهاتف - مثال: 33445566 &nbsp;
                    <strong className='text-xl leading-4 text-red-600'>*</strong>
                  </span>
                  <span
                    className='inline-block md:text-lg text-red-600 dark:text-red-400 font-[600] pt-2 px-1'
                    ref={personPhoneErr}
                  ></span>
                </label>
                <label htmlFor='message' className='form__group'>
                  <textarea
                    className='form__input'
                    id='message'
                    name='message'
                    minLength={MIN_CHARACTERS * 20}
                    maxLength={MAX_CHARACTERS * 2}
                    onChange={e => setPersonNotes(e.target.value.trim())}
                  ></textarea>

                  <span className='form__label'>
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
                    {items.reduce((acc, item) => acc + item.cPrice * item.cQuantity, 0)}
                  </strong>
                  &nbsp;ر.ق
                </span>
                <h1 className='my-2 mb-10 text-2xl'>السداد بواسطة</h1>

                {isVisisblePaypal && (
                  <PayPalButtons
                    style={{
                      color: isDark ? 'silver' : 'black',
                      label: 'checkout',
                      height: 48,
                      shape: 'pill'
                    }}
                    onClick={(data, actions) => {
                      // Validate on button click, client or server side
                      const hasAlreadyBoughtItem = false

                      if (hasAlreadyBoughtItem) {
                        setError(
                          'You already bought this item. Go to your account to view your list of items.'
                        )
                        return actions.reject()
                      } else {
                        return actions.resolve()
                      }
                    }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            description: personNotes,
                            amount: {
                              value: items.reduce(
                                (acc, product) => acc + product.cPrice,
                                0
                              )
                            },
                            items: items.map(item => ({
                              name: item.cName,
                              quantity: item.cQuantity,
                              category: 'foods, drinks',
                              unit_amount: {
                                currency_code: 'USD',
                                value: item.cPrice
                              }
                            })),
                            shipping: {
                              name: personName,
                              phone: personPhone,
                              method: 'NO_SHIPPING'
                            }
                          }
                        ]
                      })
                    }}
                    onApprove={async (data, actions) => {
                      await actions.order.capture()
                      handleApprove(data.orderID)
                    }}
                    onCancel={() => {
                      // Display cancel message, modal or redirect user to cancel page or back to cart
                    }}
                    onError={err => {
                      setError(err)
                    }}
                  />
                )}
                {/* show button fter payment object is returned from paypal */}
                <div className='flex flex-col items-center justify-evenly'>
                  <button
                    to='/checkout'
                    type='submit'
                    className={`w-full py-2 text-white text-lg uppercase bg-green-800 hover:bg-green-700 rounded-lg scale-100 transition-all flex justify-center items-center gap-3`}
                    onClick={handleCollectOrder}
                  >
                    إتمام الطلب
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className='flex flex-col items-center justify-center gap-6 my-10'>
              <p className='max-w-lg my-2 text-lg font-bold leading-10 tracking-wider text-red-500'>
                عفواً! لم يتم العثور على وجبات أو مشروبات في سلة
                الطلبات&nbsp;&nbsp;😥&nbsp;يمكنك تصفح المطعم وإضافة وجبات أو مشروبات جديدة
                إلى سلة الطلبات
              </p>
              <div className='flex gap-3'>
                <Link
                  to='/view'
                  className='px-3 py-1 text-orange-800 transition-colors bg-orange-100 border border-orange-700 rounded hover:bg-orange-200'
                >
                  تصفح الوجبات
                </Link>
                <Link
                  to='/categories'
                  className='px-3 py-1 text-orange-800 transition-colors bg-orange-100 border border-orange-700 rounded hover:bg-orange-200'
                >
                  تصفح التصنيفات
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  )
}

export default OrderFood
