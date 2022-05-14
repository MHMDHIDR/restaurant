import { useContext, useState, useRef } from 'react'
import Axios from 'axios'
import { Link } from 'react-router-dom'
import { CartContext } from '../../Contexts/CartContext'
import useDocumentTitle from '../../hooks/useDocumentTitle'

import { validPhone } from '../../functions/validForm'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Modal from '../../components/Modal/Modal'
import { Success, Error, Loading } from '../../components/Icons/Status'
import { LoadingSpinner } from '../../components/Loading'
import CartItems from './CartItems'

//orderFood
const OrderFood = () => {
  useDocumentTitle('Order Food')

  //Form States
  const [personName, setPersonName] = useState('')
  const [personPhone, setPersonPhone] = useState('')
  const [personNotes, setPersonNotes] = useState('')
  const [orderFoodStatus, setOrderFoodStatus] = useState()
  const [grandPrice, setGrandPrice] = useState()
  const [loading, setLoading] = useState()
  const [responseMsg, setResponseMsg] = useState()

  //Declaring Referenced Element
  const personNameErr = useRef(null)
  const personPhoneErr = useRef(null)
  const formErr = useRef(null)
  const grandPriceRef = useRef(null)

  //global variables
  const MIN_CHARACTERS = 1
  const MAX_CHARACTERS = 100

  //Form errors messages
  const modalLoading = document.querySelector('#modal')

  const BASE_URL =
    process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_API_LOCAL_URL
      : process.env.REACT_APP_API_URL

  const { items } = useContext(CartContext)

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
      personNameErr.current.textContent === '' &&
      personPhoneErr.current.textContent === ''
    ) {
      handleSaveOrder(formData)
    } else {
      formErr.current.textContent = 'الرجاء إدخال البيانات المطلوبة بشكل صحيح'
    }
  }

  const handleSaveOrder = async formData => {
    try {
      //show waiting modal
      modalLoading.classList.remove('hidden')
      setLoading(true)

      const response = await Axios.post(`${BASE_URL}/orders`, formData)
      const { orderAdded, message } = response.data

      setOrderFoodStatus(orderAdded)
      setResponseMsg(message)
      //Remove waiting modal
      setTimeout(() => {
        modalLoading.classList.add('hidden')
      }, 300)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {orderFoodStatus === 1 ? (
        <Modal
          status={Success}
          msg='
              تم طلب الوجبة    😄    سيتم التواصل معك في رقم هاتفك عندما 
              يكون الطلب جاهز، 
              في هذه الأثناء حاول التجول في باقي المطعم واختر ما يعجبك من قائمة الوجبات    😃'
          redirectLink='/view'
          redirectTime='8000'
          btnName='قائمة الوجبات'
          btnLink='/view'
        />
      ) : orderFoodStatus === 0 ? (
        <Modal
          status={Error}
          msg={`حدثت مشكلة أثناء إضافة الطلب! يرجى ارسال رسالة إلى مطعمنا عبر نموذج الاتصال انسخ الرسالة التالية فيه وسيتم التواصل معك في أقرب وقت:
          
          ${responseMsg}`}
          btnName='التواصل معنا'
          btnLink='/#contact'
        />
      ) : null}

      <Header />
      <section id='orderFood' className='py-12 my-8'>
        <div className='container mx-auto text-center'>
          {/* Show Modal Loading when submitting form */}
          <Modal
            status={Loading}
            modalHidden='hidden'
            classes='txt-blue text-center'
            msg='الرجاء الانتظار...'
          />

          {items.length === 0 ? (
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
          ) : (
            <CartItems setGrandPrice={setGrandPrice} />
          )}

          {items.length > 0 && (
            <form method='POST' onSubmit={handleCollectOrder}>
              <h2 className='mb-10 text-lg'>يرجى إضافة تفاصيل الطلب</h2>

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

              <div className='flex flex-col items-center justify-evenly'>
                <span className='my-10 text-2xl'>
                  اضفط على إحدى وسائل الدفع المتاحة أدناه وذلك لاتمام طلبك
                </span>

                <button
                  className={`w-full py-2 text-white text-lg uppercase bg-green-800 hover:bg-green-700 rounded-lg scale-100 transition-all flex justify-center items-center gap-3${
                    loading && loading ? ' scale-105 cursor-progress' : ''
                  } ${
                    //add disbaled class if is true or false (that means user has clicked send button)
                    loading || !loading
                      ? ' disabled:opacity-30 disabled:hover:bg-green-600'
                      : ''
                  }`}
                  type='submit'
                  id='submitBtn'
                >
                  {loading && loading ? (
                    <>
                      <LoadingSpinner />
                      جارِ الطلب...
                    </>
                  ) : (
                    'إتمام الطلب'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </>
  )
}

export default OrderFood
