import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Axios from 'axios'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Notification from '../../components/Notification'
import { LoadingSpinner, LoadingPage } from '../../components/Loading'

import useEventListener from '../../hooks/useEventListener'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import useAxios from '../../hooks/useAxios'

import { API_URL } from '../../data/constants'

const ResetPassword = () => {
  useDocumentTitle('Reset Password')

  const [newUserPass, setNewUserPass] = useState('')
  const [newUserPassConfirm, setNewUserPassConfirm] = useState('')
  const [data, setData] = useState<any>('')
  const [loading, setloading] = useState(false)
  const [resetLinkSentStatus, setNewPassStatus] = useState(0)
  const [resetLinkMsg, setNewPassMsg] = useState('')

  const modalLoading = document.querySelector('#modal')

  const navigate = useNavigate()
  const { token } = useParams()

  const userToken = useAxios({
    method: 'get',
    url: `${API_URL}/users`
  })

  console.log('userToken==> ', userToken)

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

  const sendResetPassForm = async (e: any) => {
    e.preventDefault()

    if (newUserPass === '' || newUserPassConfirm === '') {
      setNewPassStatus(0)
      setNewPassMsg('الرجاء ملء جميع الحقول بطريقة صحيحة')
      return
    } else if (newUserPass !== newUserPassConfirm) {
      setNewPassStatus(0)
      setNewPassMsg('كلمة المرور غير متطابقة')
      return
    } else {
      const formData = new FormData()
      formData.append('userPass', newUserPass.trim())
      formData.append('userToken', token)

      // if there's no error in the form
      e.target.reset()
      e.target.querySelector('button').setAttribute('disabled', 'disabled')
      setloading(true)

      try {
        const { data } = await Axios.post(`${API_URL}/users/resetpass`, formData)
        //destructering response from backend
        const { newPassSet, message } = data

        setNewPassStatus(newPassSet)

        if (newPassSet === 0) {
          return setNewPassMsg(message)
        }

        //if user is logged in
        setNewPassMsg(message)
      } catch ({ response }) {
        setNewPassMsg(response?.message)
      } finally {
        setloading(false)
      }
    }
  }

  // if done loading (NOT Loading) then show the login form
  return !loading ? (
    <>
      <Header />
      <section className='py-12 my-8'>
        <div className='container mx-auto'>
          <Notification sendStatus={resetLinkSentStatus} sendStatusMsg={resetLinkMsg} />
          <h3
            className='mx-0 mt-4 mb-12 text-2xl text-center md:text-3xl'
            data-section='login'
          >
            كلمة السر الجديدة
          </h3>
          <div className='max-w-6xl mx-auto'>
            <form className='mt-32' onSubmit={sendResetPassForm}>
              <label htmlFor='email' className='form__group'>
                <input
                  className='form__input'
                  id='email'
                  name='email'
                  type='password'
                  onChange={e => setNewUserPass(e.target.value)}
                  defaultValue={newUserPass}
                  dir='auto'
                  autoFocus
                  required
                />
                <span className='form__label'>الرجاء كتابة كلمة المرور الجديدة</span>
              </label>

              <label htmlFor='email' className='form__group'>
                <input
                  className='form__input'
                  id='email'
                  name='email'
                  type='password'
                  onChange={e => setNewUserPassConfirm(e.target.value)}
                  defaultValue={newUserPass}
                  dir='auto'
                  autoFocus
                  required
                />
                <span className='form__label'>
                  الرجاء كتابة كلمة المرور الجديدة مرة أخرى للتأكيد
                </span>
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
                      جارِ تغيير كلمة المرور...
                    </>
                  ) : (
                    'تغيير كلمة المرور'
                  )}
                </button>
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
