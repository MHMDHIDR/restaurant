import { useContext, useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Axios from 'axios'

import { CartContext } from '../../Contexts/CartContext'
import { ToppingsContext } from '../../Contexts/ToppingsContext'

import useDocumentTitle from '../../hooks/useDocumentTitle'

import { validPhone } from '../../utils/validForm'
import scrollToView from '../../utils/scrollToView'

import { API_URL } from '../../data/constants'

import Modal from '../../components/Modal/Modal'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { Success, Loading } from '../../components/Icons/Status'
import { LoadingSpinner } from '../../components/Loading'
import CartItems from './CartItems'
import PaymentButton from './PaymentButton'

const formDataFromLocalStorage =
  'formDataCart' in localStorage && JSON.parse(localStorage.getItem('formDataCart'))

//orderFood
const OrderFood = () => {
  useDocumentTitle('Cart Items')
  const { pathname } = useLocation()

  useEffect(() => {
    scrollToView()
  }, [])

  //global variables
  const MAX_CHARACTERS = 100

  const { items, grandPrice } = useContext(CartContext)
  const { checkedToppings } = useContext(ToppingsContext)

  //Form States
  const [userId, setUserId] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [personName, setPersonName] = useState(formDataFromLocalStorage.personName || '')
  const [personPhone, setPersonPhone] = useState(
    formDataFromLocalStorage.personPhone || ''
  )
  const [personAddress, setPersonAddress] = useState(
    formDataFromLocalStorage.personAddress || ''
  )
  const [personNotes, setPersonNotes] = useState(
    formDataFromLocalStorage.personNotes || ''
  )
  const [orderFoodStatus, setOrderFoodStatus] = useState(0)
  const [responseMsg, setResponseMsg] = useState('')
  const [showLoginRegisterModal, setShowLoginRegisterModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  //Declaring Referenced Element
  const personNameErr = useRef<HTMLSpanElement>(null)
  const personPhoneErr = useRef<HTMLSpanElement>(null)
  const personAddressErr = useRef<HTMLSpanElement>(null)
  const formErr = useRef<HTMLParagraphElement>(null)
  const grandPriceRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setUserId(JSON.parse(localStorage.getItem('user'))?._id)
    setUserEmail(JSON.parse(localStorage.getItem('user'))?.userEmail)

    localStorage.setItem(
      'formDataCart',
      JSON.stringify({
        personName,
        personPhone,
        personAddress,
        personNotes
      })
    )
  }, [personName, personPhone, personAddress, personNotes])

  const handleCollectOrder = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (
      personName !== '' &&
      personPhone !== '' &&
      personNameErr.current.textContent === '' &&
      personPhoneErr.current.textContent === '' &&
      personAddressErr.current.textContent === ''
    ) {
      formErr.current.textContent = ''

      //if there's No user in localStorage then show modal to login or register else collect order
      if (JSON.parse(localStorage.getItem('user'))) {
        setShowLoginRegisterModal(false)
        setShowPaymentModal(true)
      } else {
        setShowLoginRegisterModal(true)
      }
    } else {
      formErr.current.textContent = '???????????? ?????????? ???????????????? ???????????????? ???????? ????????'
    }
  }

  const handleSaveOrder = async (paymentData: any) => {
    //using FormData to send constructed data
    const formData = new FormData()
    formData.append('userId', userId)
    formData.append('userEmail', userEmail)
    formData.append('personName', personName)
    formData.append('personPhone', personPhone)
    formData.append('personAddress', personAddress)
    formData.append('personNotes', personNotes)
    formData.append('checkedToppings', JSON.stringify(checkedToppings))
    formData.append('foodItems', JSON.stringify(items))
    formData.append('grandPrice', grandPriceRef?.current?.textContent || grandPrice)
    formData.append('paymentData', JSON.stringify(paymentData))

    try {
      const response = await Axios.post(`${API_URL}/orders`, formData)
      const { orderAdded, message } = response.data
      setIsLoading(false)

      setOrderFoodStatus(orderAdded)
      setResponseMsg(message)

      //remove all items from cart
      if (orderAdded) {
        const cartItems = ['restCartItems', 'restCheckedToppings', 'formDataCart']
        cartItems.forEach(item => localStorage.removeItem(item))
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <Header />
      <section id='orderFood' className='py-12 my-8'>
        {orderFoodStatus === 1 ? (
          <Modal
            status={Success}
            msg={responseMsg}
            btnName='?????????? ??????????????'
            btnLink='/view'
            redirectLink='/view'
            redirectTime={10000}
          />
        ) : showLoginRegisterModal === true ? (
          <Modal
            status={Loading}
            msg={`?????? ???????? ?????????? ???????????? ???? ?????? ???????? ???????? ???????? ???????? ??????????`}
            btnName='?????????? ????????'
            btnLink={`/auth/login${pathname}`}
          />
        ) : (
          showPaymentModal === true && (
            <Modal
              status={Loading}
              msg={`?????????? ?????????? ???????????????? ???????? ?????????????? ??????????:`}
              extraComponents={
                PaymentButton ? (
                  <PaymentButton
                    value={grandPriceRef?.current?.textContent || grandPrice}
                    onSuccess={(paymentData: any) => {
                      setShowPaymentModal(false)
                      handleSaveOrder(paymentData)
                    }}
                    // onError={() => {
                    //   setShowPaymentModal(false)
                    //   setOrderFoodStatus(0)
                    //   setResponseMsg('?????? ?????? ?????????? ??????????')
                    // }}
                  />
                ) : (
                  <LoadingSpinner />
                )
              }
              btnName='????????'
              btnLink={`order-food`}
            />
          )
        )}

        <div className='container mx-auto text-center'>
          {items.length > 0 ? (
            <>
              <h2 className='inline-block mb-20 text-3xl font-bold'>?????? ??????????????</h2>
              <CartItems />

              <form method='POST' onSubmit={handleCollectOrder}>
                <Link
                  to='/view'
                  className='relative pr-10 block p-2 mx-auto my-10 text-xl text-gray-900 bg-orange-400 border group border-orange-700 hover:bg-orange-500 transition-colors rounded-md w-[20rem] lg:w-[25rem]'
                >
                  <span className='absolute inline-flex justify-center pt-3.5 ml-3 pointer-events-none transition-all bg-white border border-orange-700 rounded-full -top-1.5 w-14 h-14 group-hover:right-2 right-6'>
                    ????
                  </span>
                  ???????? ?????????? ????????
                </Link>

                <h2 className='mb-10 text-2xl'>???????? ?????????? ???????????? ??????????</h2>
                <label htmlFor='name' className={`form__group`}>
                  <input
                    className={`relative form__input`}
                    id='name'
                    name='name'
                    type='text'
                    defaultValue={personName}
                    onChange={e => setPersonName(e.target.value.trim())}
                    onKeyUp={e => {
                      const target = e.target.value.trim()

                      if (target.length > 0 && target.length < 4) {
                        personNameErr.current.textContent = '???????? ?????????? ?????? ?????????? ??????????'
                      } else if (target.length > 30) {
                        personNameErr.current.textContent =
                          '?????????? ???????? ?????????? ???????? ?????????? ?????? ???? ???????? ???? 30 ??????'
                      } else {
                        personNameErr.current.textContent = ''
                      }
                    }}
                    required
                  />
                  <span className={`form__label`}>
                    ???????? ???????????? &nbsp;
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
                    defaultValue={personPhone}
                    onChange={e => setPersonPhone(e.target.value.trim())}
                    onKeyUp={e => {
                      const target = e.target.value.trim()

                      if (
                        (target.length > 0 && target.length < 8) ||
                        target.length > 8 ||
                        !validPhone(target)
                      ) {
                        personPhoneErr.current.textContent =
                          '???????????? ?????????? ?????? ???????? ?????? ???????? ?????? ???????????? ???? ????????????'
                      } else {
                        personPhoneErr.current.textContent = ''
                      }
                    }}
                    required
                  />
                  <span className={`form__label`}>
                    ?????? ???????????? - ????????: 33445566 &nbsp;
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
                    defaultValue={personAddress}
                    onChange={e => setPersonAddress(e.target.value.trim())}
                    onKeyUp={e => {
                      const target = e.target.value.trim()

                      if (target.length > 0 && target.length < 4) {
                        personAddressErr.current.textContent =
                          '???????? ?????????? ?????? ?????????? ??????????'
                      } else {
                        personAddressErr.current.textContent = ''
                      }
                    }}
                    required
                  />
                  <span className={`form__label`}>
                    ?????????????? - ????????: ?????????? ?????? 53 - ???????? ?????? 000 - ???????? ?????? 00&nbsp;
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
                    defaultValue={personNotes}
                    maxLength={MAX_CHARACTERS * 2}
                    onChange={e => setPersonNotes(e.target.value.trim())}
                  ></textarea>

                  <span className={`form__label`}>
                    ???????????? ?????? ?????????????? ???? ???????????? ?????????? ???????????????? ???? ???? ???????? &nbsp;????
                  </span>
                </label>
                <p
                  className='block text-2xl my-4 text-red-600 dark:text-red-400 font-[600] pt-2 px-1'
                  ref={formErr}
                ></p>
                <span className='inline-block px-3 py-1 my-4 text-xl text-green-800 bg-green-300 border border-green-800 rounded-md select-none'>
                  ?????????? ????????????????:&nbsp;
                  <strong ref={grandPriceRef}>
                    {
                      //calculate grand price
                      //calculate all items prices * all items quantities
                      items.reduce(
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
                      )
                    }
                  </strong>
                  &nbsp; ??.??
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
                        ???????? ?????????? ???????????? ??????????...
                      </>
                    ) : (
                      '?????????? ????????????????'
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className='flex flex-col items-center justify-center gap-6 my-10'>
              <p className='max-w-lg my-2 text-lg font-bold leading-10 tracking-wider text-red-500'>
                ??????????! ???? ?????? ???????????? ?????? ?????????? ???? ?????????????? ???? ??????
                ??????????????&nbsp;&nbsp;????&nbsp;?????????? ???????? ???????????? ???????????? ?????????? ???? ?????????????? ??????????
                ?????? ?????? ??????????????
              </p>
              <div className='flex gap-3'>
                <Link
                  to='/view'
                  className='px-3 py-1 text-orange-800 transition-colors bg-orange-100 border border-orange-700 rounded hover:bg-orange-200'
                >
                  ???????? ??????????????
                </Link>
                <Link
                  to='/categories'
                  className='px-3 py-1 text-orange-800 transition-colors bg-orange-100 border border-orange-700 rounded hover:bg-orange-200'
                >
                  ???????? ??????????????????
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
