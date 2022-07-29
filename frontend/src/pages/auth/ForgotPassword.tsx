import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Axios from 'axios'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Notification from '../../components/Notification'
import { LoadingSpinner } from '../../components/Loading'

import useEventListener from '../../hooks/useEventListener'
import useDocumentTitle from '../../hooks/useDocumentTitle'

import { API_URL } from '../../data/constants'

const ForgotDataFromLocalStorage =
  'ForgotData' in localStorage && JSON.parse(localStorage.getItem('ForgotData'))

const ForgotPassword = () => {
  useDocumentTitle('Forgot Password')

  const [emailOrTel, setEmailOrTel] = useState(
    ForgotDataFromLocalStorage.newUserPassword || ''
  )
  const [data, setData] = useState<any>('')
  const [loading, setloading] = useState(false)
  const [forgotLinkSentStatus, setForgotLinkSentStatus] = useState(0)
  const [forgotLinkMsg, setForgotLinkMsg] = useState('')

  const modalLoading = document.querySelector('#modal')

  const navigate = useNavigate()

  //setting user token from local storage
  const USER = JSON.parse(localStorage.getItem('user'))
  //get user data using token if the user is logged-in and token is saved in localStorage then I'll get the current user data from the database
  useEffect(() => {
    if (USER) {
      setloading(true)

      Axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${USER.token}` }
      })
        .then(({ data }) => {
          setData(data)

          USER?._id === data._id && data.userAccountType === 'admin'
            ? navigate('/dashboard')
            : USER?._id === data._id && data.userAccountType === 'user'
            ? navigate('/')
            : navigate('/')
        })
        .catch(err => {
          console.error(err)
        })
        .finally(() => {
          setloading(false)
        })
    }

    return () => {
      setData('')
    }
  }, [USER, API_URL, data.id, navigate])

  useEventListener('click', (e: any) => {
    //confirm means cancel Modal message (hide it)
    if (e.target.id === 'confirm') {
      modalLoading.classList.add('hidden')
    }
  })

  const sendForgotPassForm = async (e: any) => {
    e.preventDefault()

    if (emailOrTel === '') {
      setForgotLinkSentStatus(0)
      setForgotLinkMsg('الرجاء ملء جميع الحقول بطريقة صحيحة')

      return
    }

    const formData = new FormData()
    formData.append('userEmail', emailOrTel.trim().toLowerCase())
    formData.append('userTel', emailOrTel.trim().toLowerCase())

    // if there's no error in the form
    e.target.reset()
    e.target.querySelector('button').setAttribute('disabled', 'disabled')
    setloading(true)

    try {
      const { data } = await Axios.post(`${API_URL}/users/forgotpass`, formData)
      //destructering response from backend
      const { forgotPassSent, message } = data

      setForgotLinkSentStatus(forgotPassSent)

      if (forgotPassSent === 0) {
        return setForgotLinkMsg(message)
      }

      //if user is logged in
      setForgotLinkMsg(message)
    } catch ({ response }) {
      setForgotLinkMsg(response?.message)
    } finally {
      setloading(false)
    }
  }

  // if done loading (NOT Loading) then show the login form
  return (
    <>
      <Header />
      <section className='py-12 my-8'>
        <div className='container mx-auto'>
          <Notification sendStatus={forgotLinkSentStatus} sendStatusMsg={forgotLinkMsg} />
          <h3
            className='mx-0 mt-4 mb-12 text-2xl text-center md:text-3xl'
            data-section='login'
          >
            إستعادة كلمة المرور
          </h3>
          <div className='max-w-6xl mx-auto'>
            <form className='mt-32' onSubmit={sendForgotPassForm}>
              <label htmlFor='email' className='form__group'>
                <input
                  className='form__input'
                  id='email'
                  name='email'
                  type='text'
                  onChange={e => setEmailOrTel(e.target.value)}
                  defaultValue={emailOrTel}
                  dir='auto'
                  autoFocus
                  required
                />
                <span className='form__label'>البريد الالكتروني أو رقم الهاتف</span>
              </label>

              <div className='flex flex-col gap-6 text-center border-none form__group ltr'>
                <button
                  className={`flex gap-4 w-fit mx-auto px-12 py-3 text-white uppercase bg-orange-700 rounded-lg hover:bg-orange-800 scale-100 transition-all rtl${
                    loading && loading ? ' scale-105 cursor-progress' : ''
                  } ${
                    //add disbaled class if is true or false (that means user has clicked send button)
                    loading || !loading
                      ? ' disabled:opacity-30 disabled:hover:bg-orange-700'
                      : ''
                  }`}
                  type='submit'
                  id='submitBtn'
                >
                  {loading && loading ? (
                    <>
                      <LoadingSpinner />
                      <span>جارِ إرسال طلب استعادة كلمة المرور...</span>
                    </>
                  ) : (
                    'إرسال طلب'
                  )}
                </button>

                <strong className='block mx-auto my-8 text-orange-800 dark:text-orange-600 w-fit'>
                  أو
                </strong>

                <div className='flex gap-6 justify-evenly'>
                  <Link
                    to='/auth/join'
                    className='mx-auto text-center text-orange-700 underline-hover dark:text-orange-500 w-fit'
                  >
                    تسجيل حساب جديد
                  </Link>
                  <Link
                    to='/auth/login'
                    className='mx-auto text-center text-orange-700 underline-hover dark:text-orange-500 w-fit'
                  >
                    تسجيل الدخول
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
export default ForgotPassword
