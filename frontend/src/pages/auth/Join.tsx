import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Axios from 'axios'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Notification from '../../components/Notification'
import { LoadingSpinner, LoadingPage } from '../../components/Loading'

import { API_URL } from '../../data/constants'

const Login = () => {
  const [userFullName, setFullName] = useState('')
  const [userEmail, setEmail] = useState('')
  const [userTel, setTel] = useState('')
  const [userPassword, setPassword] = useState('')
  const [data, setData] = useState<any>('')
  const [regStatus, setRegStatus] = useState()
  const [loading, setloading] = useState(false)
  const [errMsg, setErrMsg] = useState('')

  const navigate = useNavigate()

  //setting user token from local storage
  const USER = JSON.parse(localStorage.getItem('user'))
  //get user data using token if the user is logged-in and token is saved in localStorage then I'll get the current user data from the database
  useEffect(() => {
    if (USER) {
      setloading(true)

      Axios.get(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${USER.token}`
        }
      })
        .then(res => {
          setData(res.data)

          if (USER?._id === data.id) {
            navigate('/dashboard')
          }
        })
        .catch(err => {
          console.error(err)
        })
        .finally(() => {
          setloading(false)
        })
    }

    return () => setData('')
  }, [USER, API_URL, data.id, navigate])

  const handleJoin = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    setloading(true)

    try {
      const joinUser = await Axios.post(`${API_URL}/users/join`, {
        userFullName,
        userEmail,
        userTel,
        userPassword
      })
      //getting response from backend
      const { data } = joinUser
      setRegStatus(data.userAdded)

      //if user is joined correctly
      setErrMsg(data?.message)
    } catch ({ response }) {
      setErrMsg(
        response.status === 409
          ? 'عفواً المستخدم مسجل من قبل بنفس البريد الالكتروني'
          : response.status === 400
          ? 'رجاء تعبئة جميع الحقول أدناه'
          : response.statusText
      )
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
          <Notification sendStatus={regStatus} sendStatusMsg={errMsg} />
          <h3
            className='mx-0 mt-4 mb-12 text-2xl text-center md:text-3xl'
            data-section='login'
          >
            تسجيل حساب جديد للوحة التحكم
          </h3>
          <div className='max-w-6xl mx-auto'>
            <form className='mt-32' onSubmit={handleJoin}>
              <label htmlFor='name' className='form__group'>
                <input
                  className='form__input'
                  id='name'
                  name='name'
                  type='text'
                  onChange={e => setFullName(e.target.value)}
                  autoFocus
                  required
                />
                <span className='form__label'>اسمك الكريم</span>
              </label>

              <label htmlFor='email' className='form__group'>
                <input
                  className='form__input'
                  id='email'
                  name='email'
                  type='text'
                  onChange={e => setEmail(e.target.value)}
                  dir='auto'
                  required
                />
                <span className='form__label'>بريدك الالكتروني</span>
              </label>

              <label htmlFor='tel' className='form__group'>
                <input
                  className='form__input'
                  id='tel'
                  name='tel'
                  type='tel'
                  onChange={e => setTel(e.target.value)}
                  dir='auto'
                  required
                />
                <span className='form__label'>رقم الهاتف</span>
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
                      جارِ التسجيل...
                    </>
                  ) : (
                    'تسجيل'
                  )}
                </button>

                <strong className='block mx-auto my-8 text-orange-800 dark:text-orange-600 w-fit'>
                  أو
                </strong>

                <Link
                  to='/auth/login'
                  className='mx-auto text-center text-orange-700 underline-hover dark:text-orange-500 w-fit'
                >
                  تسجيل الدخول
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
