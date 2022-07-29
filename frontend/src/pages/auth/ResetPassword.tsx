import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Axios from 'axios'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Notification from '../../components/Notification'
import { LoadingSpinner, LoadingPage } from '../../components/Loading'

import useEventListener from '../../hooks/useEventListener'
import useDocumentTitle from '../../hooks/useDocumentTitle'

import { API_URL } from '../../data/constants'

const LoginDataFromLocalStorage =
  'LoginData' in localStorage && JSON.parse(localStorage.getItem('LoginData'))

const ResetPassword = () => {
  useDocumentTitle('Reset Password')

  const [userEmailOrTel, setEmailOrTel] = useState(
    LoginDataFromLocalStorage.userEmailOrTel || ''
  )
  const [data, setData] = useState<any>('')
  const [loading, setloading] = useState(false)
  const [forgotLinkSentStatus, setForgotLinkSentStatus] = useState()
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
        .then(res => {
          setData(res.data)

          if (USER?._id === data.id && USER.userAccountType === 'admin') {
            navigate('/dashboard')
          } else if (USER?._id === data.id && USER.userAccountType === 'user') {
            navigate('/')
          }
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

  const sendForgotPassForm = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    setloading(true)

    try {
      const { data } = await Axios.post(`${API_URL}/users/forgotpass`, {
        userEmail: userEmailOrTel.trim().toLowerCase(),
        userTel: userEmailOrTel.trim().toLowerCase()
      })
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
  return !loading ? (
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
                  defaultValue={userEmailOrTel}
                  dir='auto'
                  autoFocus
                  required
                />
                <span className='form__label'>البريد الالكتروني أو رقم الهاتف</span>
              </label>

              <div className='flex flex-col gap-6 text-center border-none form__group ltr'>
                <button
                  className={`w-48 mx-auto px-12 py-3 text-white uppercase bg-orange-700 rounded-lg hover:bg-orange-800 scale-100 transition-all`}
                  type='submit'
                  id='submitBtn'
                >
                  {loading && loading ? (
                    <>
                      <LoadingSpinner />
                      جارِ إرسال طلب استعادة كلمة المرور...
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
  ) : (
    <LoadingPage />
  )
}
export default ResetPassword
