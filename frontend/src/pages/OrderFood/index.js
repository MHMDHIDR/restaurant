import { useContext, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import Axios from 'axios'

import { CartContext } from '../../Contexts/CartContext'

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
  const BASE_URL =
    process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_API_LOCAL_URL
      : process.env.REACT_APP_API_URL

  const { items } = useContext(CartContext)

  //Form States
  const [personName, setPersonName] = useState('')
  const [personPhone, setPersonPhone] = useState('')
  const [personNotes, setPersonNotes] = useState('')
  const [orderFoodStatus, setOrderFoodStatus] = useState('')
  const [responseMsg, setResponseMsg] = useState('')
  const [grandPrice, setGrandPrice] = useState('')

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
      handleSaveOrder(formData)
    } else {
      formErr.current.textContent = 'الرجاء إدخال البيانات المطلوبة بشكل صحيح'
    }
  }

  const handleSaveOrder = async formData => {
    try {
      const response = await Axios.post(`${BASE_URL}/orders`, formData)
      const { orderAdded, message } = response.data

      setOrderFoodStatus(orderAdded)
      setResponseMsg(message)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <Header />
      <section id='orderFood' className='py-12 my-8'>
        {orderFoodStatus && (
          <Modal
            status={Success}
            msg={responseMsg}
            redirectLink='/view'
            redirectTime='800000'
            btnName='قائمة الوجبات'
            btnLink='/view'
          />
        )}

        <div className='container mx-auto text-center'>
          {items.length > 0 ? (
            <>
              <h2 className='inline-block mb-20 text-3xl font-bold'>سلة الطلبات</h2>
              <CartItems setGrandPrice={setGrandPrice} />

              <form method='POST' onSubmit={handleCollectOrder}>
                <Link
                  to='/view'
                  className='relative pr-10 block p-2 mx-auto my-10 text-xl text-gray-900 bg-orange-400 border group border-orange-700 hover:bg-orange-500 transition-colors rounded-md w-[20rem] lg:w-[25rem]'
                >
                  <span className='absolute inline-flex justify-center pt-3.5 ml-3 transition-all bg-white border border-orange-700 rounded-full -top-1.5 w-14 h-14 group-hover:right-2 right-6'>
                    🛒
                  </span>
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
