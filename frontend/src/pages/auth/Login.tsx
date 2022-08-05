import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Axios from 'axios'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Notification from '../../components/Notification'
import { LoadingSpinner, LoadingPage } from '../../components/Loading'

import useEventListener from '../../hooks/useEventListener'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import useAuth from '../../hooks/useAuth'

const LoginDataFromLocalStorage =
  'LoginData' in localStorage && JSON.parse(localStorage.getItem('LoginData'))

const Login = () => {
  useDocumentTitle('Login')

  const [userEmailOrTel, setEmailOrTel] = useState(
    LoginDataFromLocalStorage.userEmailOrTel || ''
  )
  const [userPassword, setPassword] = useState('')
  const [loggedInStatus, setLoggedInStatus] = useState()
  const [isSendingLoginForm, setIsSendingLoginForm] = useState(false)
  const [loginMsg, setLoginMsg] = useState('')
  const { redirect } = useParams()

  const modalLoading = document.querySelector('#modal')

  const navigate = useNavigate()
  const API_URL =
    process.env.NODE_ENV === 'development'
      ? process.env.API_LOCAL_URL
      : process.env.API_URL

  const { isAuth, userType, loading } = useAuth()
  useEffect(() => {
    isAuth && userType === 'admin'
      ? navigate('/dashboard')
      : isAuth && userType === 'user'
      ? navigate('/')
      : null
  }, [isAuth, userType, navigate])

  useEventListener('click', (e: any) => {
    //confirm means cancel Modal message (hide it)
    if (e.target.id === 'confirm') {
      modalLoading.classList.add('hidden')
    }
  })

  const sendLoginForm = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsSendingLoginForm(true)

    try {
      const loginUser = await Axios.post(`${API_URL}/users/login`, {
        userPassword,
        userEmail: userEmailOrTel.trim().toLowerCase(),
        userTel: userEmailOrTel.trim().toLowerCase()
      })
      //getting response from backend
      const { data } = loginUser

      setLoggedInStatus(data.LoggedIn)

      if (data.LoggedIn === 0) {
        return setLoginMsg(data?.message)
      }

      const { _id, userAccountType, userEmail, userTel, token } = data

      //if user is logged in
      setLoginMsg(data?.message)
      localStorage.setItem(
        'user',
        JSON.stringify({ _id, userAccountType, userEmail, userTel, token })
      )

      redirect
        ? navigate(`/${redirect}`)
        : userAccountType === 'admin'
        ? navigate('/dashboard')
        : navigate('/')
    } catch ({ response }) {
      setLoginMsg(response?.data?.message)
    } finally {
      setIsSendingLoginForm(false)
    }
  }

  const responseGoogle = (response: any) => {
    console.log(response)
  }

  // if done loading (NOT Loading) then show the login form
  return !loading ? (
    <>
      <Header />
      <section className='py-12 my-8'>
        <div className='container mx-auto'>
          <Notification sendStatus={loggedInStatus} sendStatusMsg={loginMsg} />

          <h3
            className='mx-0 mt-4 mb-12 text-2xl text-center md:text-3xl'
            data-section='login'
          >
            تسجيل الدخول للوحة التحكم
          </h3>
          <div className='max-w-6xl mx-auto'>
            <form className='mt-32' onSubmit={sendLoginForm}>
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

              <label htmlFor='password' className='form__group'>
                <input
                  className='form__input'
                  id='password'
                  name='password'
                  type='password'
                  onChange={e => setPassword(e.target.value)}
                  dir='auto'
                  required
                />
                <span className='form__label'>كلمة المرور</span>
              </label>

              <div className='flex flex-col gap-6 text-center border-none form__group ltr'>
                <button
                  className={`w-48 mx-auto px-12 py-3 text-white uppercase bg-orange-700 rounded-lg hover:bg-orange-800 scale-100 transition-all`}
                  type='submit'
                  id='submitBtn'
                >
                  {isSendingLoginForm && isSendingLoginForm ? (
                    <>
                      <LoadingSpinner />
                      جارِ تسجيل الدخول...
                    </>
                  ) : (
                    'تسجيل الدخول'
                  )}
                </button>

                <strong className='block mx-auto my-8 text-orange-800 dark:text-orange-600 w-fit'>
                  أو
                </strong>

                <div className='flex sm:flex-col sm:gap-y-12 items-center gap-x-6 justify-evenly'>
                  <Link
                    to='/auth/join'
                    className='mx-auto text-center text-orange-700 underline-hover dark:text-orange-800 sm:dark:text-orange-500 w-fit'
                  >
                    تسجيل حساب جديد
                  </Link>

                  {/* Login with Google process.env.GOOGLE_CLIENT_ID */}
                  <div id='loginWithGoogle'></div>

                  <Link
                    to='/auth/forgot'
                    className='mx-auto text-center text-orange-700 underline-hover dark:text-orange-800 sm:dark:text-orange-500 w-fit'
                  >
                    نسيت كلمة المرور
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
export default Login
