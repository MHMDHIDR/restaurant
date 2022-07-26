import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Axios from 'axios'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Notification from '../components/Notification'
import { LoadingSpinner, LoadingPage } from '../components/Loading'

import useEventListener from '../hooks/useEventListener'

const LoginDataFromLocalStorage =
  'LoginData' in localStorage && JSON.parse(localStorage.getItem('LoginData'))

const Login = () => {
  const [userEmailOrTel, setEmailOrTel] = useState(
    LoginDataFromLocalStorage.userEmailOrTel || ''
  )
  const [userPassword, setPassword] = useState('')
  const [data, setData] = useState('')
  const [loggedInStatus, setLoggedInStatus] = useState()
  const [loading, setloading] = useState(false)
  const [loginMsg, setLoginMsg] = useState('')
  const { redirect } = useParams()

  const modalLoading = document.querySelector('#modal')

  const navigate = useNavigate()
  const BASE_URL =
    process.env.NODE_ENV === 'development'
      ? process.env.API_LOCAL_URL
      : process.env.API_URL

  //setting user token from local storage
  const USER = JSON.parse(localStorage.getItem('user'))
  //get user data using token if the user is logged-in and token is saved in localStorage then I'll get the current user data from the database
  useEffect(() => {
    if (USER) {
      setloading(true)

      Axios.get(`${BASE_URL}/users`, {
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
  }, [USER, BASE_URL, data.id, navigate])

  useEventListener('click', e => {
    //confirm means cancel Modal message (hide it)
    if (e.target.id === 'confirm') {
      modalLoading.classList.add('hidden')
    }
  })

  const sendLoginForm = async e => {
    e.preventDefault()

    setloading(true)

    try {
      const loginUser = await Axios.post(`${BASE_URL}/users/login`, {
        userEmailOrTel,
        userPassword
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
      setloading(false)
    }
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
                  {loading && loading ? (
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

                <Link
                  to='/join'
                  className='mx-auto text-center text-orange-700 underline-hover dark:text-orange-500 w-fit'
                >
                  تسجيل حساب جديد
                </Link>
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
