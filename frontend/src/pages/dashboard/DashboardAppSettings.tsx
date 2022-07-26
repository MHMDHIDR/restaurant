import { useState, useEffect, useRef } from 'react'
import useAxios from '../../hooks/useAxios'
import Axios from 'axios'

import useDocumentTitle from '../../hooks/useDocumentTitle'

import Modal from '../../components/Modal/Modal'
import { Success, Error, Loading } from '../../components/Icons/Status'
import { LoadingSpinner } from '../../components/Loading'

const About = () => {
  useDocumentTitle('App Settings')

  //Description Form States
  const [appDesc, setAppDesc] = useState('')
  const [appTagline, setAppTagline] = useState('')
  const [whatsAppNumber, setWhatsAppNumber] = useState('')
  const [instagramAccount, setInstagramAccount] = useState('')
  const [twitterAccount, setTwitterAccount] = useState('')

  //Loading States
  const [settingsUpdated, setSettingsUpdated] = useState()
  const [settingsUpdatedMsg, setSettingsUpdatedMsg] = useState()

  //TagLine Form States
  const [data, setData] = useState()
  const [categoryList, setCategoryList] = useState([])
  const [loading, setLoading] = useState()

  //fetching description data
  const { response } = useAxios({
    method: 'get',
    url: '/settings'
  })

  useEffect(() => {
    if (response !== null) {
      setData(response)
      setCategoryList(response?.CategoryList)
    }
  }, [response])

  const DESC_MIN_LENGTH = 30
  const DESC_MAX_LENGTH = 400

  const TAGLINE_MIN_LENGTH = 10
  const TAGLINE_MAX_LENGTH = 100

  //Form errors messages
  const descErr = useRef<HTMLSpanElement>(null)
  const tagLineErr = useRef<HTMLSpanElement>(null)
  const whatsAppNumberErr = useRef<HTMLSpanElement>(null)
  const instagramAccountErr = useRef<HTMLSpanElement>(null)
  const twitterAccountErr = useRef<HTMLSpanElement>(null)
  const formMsg = useRef<HTMLDivElement>(null)

  const modalLoading = document.querySelector('#modal')

  // handle input change
  const handleInputChange = (e, index, otherValue) => {
    const { name, value } = e.target
    const list = [...categoryList]
    list[index] = name === 'categoryValue' ? [otherValue, value] : [value, otherValue]

    setCategoryList(list)
  }

  // handle click event of the Add button
  const handleAddClick = () => {
    setCategoryList([...categoryList, ['', '']])
  }

  const handleRemoveClick = index => {
    const list = [...categoryList]
    list.splice(index, 1)
    setCategoryList(list)
  }

  const BASE_URL =
    process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_API_LOCAL_URL
      : process.env.REACT_APP_API_URL

  const handleUpdate = async e => {
    e.preventDefault()

    //initial form values if no value was updated taking it from [0] index
    const currentAppDesc = appDesc || data?.appDesc
    const currentAppTagline = appTagline || data?.appTagline
    const currentWhatsAppNumber = whatsAppNumber || data?.whatsAppNumber
    const currentInstagramAccount = instagramAccount || data?.instagramAccount
    const currentTwitterAccount = twitterAccount || data?.twitterAccount
    const currentCategoryList = categoryList || data?.appTagline

    const formData = new FormData()
    formData.append('appDesc', currentAppDesc)
    formData.append('appTagline', currentAppTagline)
    formData.append('whatsAppNumber', currentWhatsAppNumber)
    formData.append('instagramAccount', currentInstagramAccount)
    formData.append('twitterAccount', currentTwitterAccount)
    formData.append('CategoryList', JSON.stringify(currentCategoryList))

    if (
      descErr.current.textContent === '' ||
      tagLineErr.current.textContent === '' ||
      whatsAppNumberErr.current.textContent === '' ||
      instagramAccountErr.current.textContent === '' ||
      twitterAccountErr.current.textContent === ''
    ) {
      //show waiting modal
      modalLoading.classList.remove('hidden')
      setLoading(true)

      try {
        const response = await Axios.patch(`${BASE_URL}/settings/${data?._id}`, formData)
        const { settingsUpdated, message } = response.data

        setSettingsUpdated(settingsUpdated)
        setSettingsUpdatedMsg(message)

        //Remove waiting modal
        setTimeout(() => {
          modalLoading.classList.add('hidden')
        }, 300)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    } else {
      formMsg.current.textContent =
        'الرجاء إضافة التعديلات بطريقة صحيحة لتستطيع التحديث بنجاح 😃'
    }
  }

  return (
    <>
      {settingsUpdated === 1 ? (
        <Modal
          status={Success}
          msg={settingsUpdatedMsg}
          redirectLink='./'
          redirectTime='3500'
        />
      ) : settingsUpdated === 0 ? (
        <Modal status={Error} msg='حدث خطأ ما أثناء تحديث الإعدادات!' />
      ) : null}

      <section className='py-12 my-8 dashboard'>
        <div className='container mx-auto'>
          {/* Show Modal Loading when submitting form */}
          <Modal
            status={Loading}
            modalHidden='hidden'
            classes='txt-blue text-center'
            msg='الرجاء الانتظار...'
          />

          {/* Description Form */}
          <form id='descForm' onSubmit={handleUpdate}>
            <h3 className='mx-0 mt-4 mb-12 text-lg text-center'>عن الموقع</h3>
            <label htmlFor='aboutDescription' className='form__group'>
              <textarea
                name='aboutDescription'
                id='aboutDescription'
                className='form__input'
                defaultValue={data && data.appDesc}
                minLength={DESC_MIN_LENGTH}
                maxLength={DESC_MAX_LENGTH}
                onChange={e => setAppDesc(e.target.value.trim())}
                onKeyUp={e => {
                  const target = e.target.value.trim()

                  if (target.length > 0 && target.length < DESC_MIN_LENGTH) {
                    descErr.current.textContent = `وصف الموقع قصير جداً ولا يوصف الموقع بشكل كافي، الوصف يتكون من ${DESC_MIN_LENGTH} حرف على الأقل`
                  } else if (target.length > DESC_MAX_LENGTH) {
                    descErr.current.textContent = `وصف الموقع طويل جداً! لا يمكن أن يزيد عن ${DESC_MAX_LENGTH} حرف`
                  } else {
                    descErr.current.textContent = ''
                  }
                }}
                required
              ></textarea>
              <span className='form__label'>اكتب وصف عن الموقع</span>
              <span
                className='inline-block md:text-lg text-red-600 dark:text-red-400 font-[600] pt-2 px-1'
                ref={descErr}
              ></span>
            </label>

            <h3 className='mx-0 mt-4 mb-12 text-lg text-center'>شعار الموقع</h3>
            <label htmlFor='aboutTagline' className='form__group'>
              <textarea
                name='aboutTagline'
                id='aboutTagline'
                className='form__input'
                defaultValue={data && data.appTagline}
                minLength={TAGLINE_MIN_LENGTH}
                maxLength={TAGLINE_MAX_LENGTH}
                onChange={e => setAppTagline(e.target.value.trim())}
                onKeyUp={e => {
                  const target = e.target.value.trim()

                  if (target.length > 0 && target.length < TAGLINE_MIN_LENGTH) {
                    tagLineErr.current.textContent = `شعار الموقع قصير جداً ولا يعبر عن الموقع، الشعار يتكون من ${TAGLINE_MIN_LENGTH} حرف على الأقل`
                  } else if (target.length > TAGLINE_MAX_LENGTH) {
                    tagLineErr.current.textContent = `شعار الموقع طويل جداً! لا يمكن أن يزيد عن ${TAGLINE_MAX_LENGTH} حرف`
                  } else {
                    tagLineErr.current.textContent = ''
                  }
                }}
                required
              ></textarea>
              <span className='form__label'>اكتب نص شعار للموقع</span>
              <span
                className='inline-block md:text-lg text-red-600 dark:text-red-400 font-[600] pt-2 px-1'
                ref={tagLineErr}
              ></span>
            </label>

            <h3 className='mx-0 mt-4 mb-12 text-lg text-center'>رقم الواتساب</h3>
            <label htmlFor='whatsAppNumber' className='form__group'>
              <input
                name='whatsAppNumber'
                id='instagramAccount'
                type='text'
                className='form__input'
                defaultValue={data && data.instagramAccount}
                minLength={8}
                maxLength={8}
                onChange={e => setWhatsAppNumber(e.target.value.trim())}
                onKeyUp={e => {
                  const target = e.target.value.trim()

                  if (target.length > 0 && target.length < 8) {
                    whatsAppNumberErr.current.textContent = `رقم الوتساب قصير يجب أن يتكون من ٨ أرقام`
                  } else if (target.length > 8) {
                    whatsAppNumberErr.current.textContent = `رقم الوتساب طويل لا يمكن أن يزيد عن ٨ أرقام`
                  } else {
                    whatsAppNumberErr.current.textContent = ''
                  }
                }}
                required
              />
              <span className='pointer-events-none form__label'>
                رقم الواتساب الخاص بالموقع للتواصل معك عبر الواتساب
              </span>
              <span
                className='inline-block md:text-lg text-red-600 dark:text-red-400 font-[600] pt-2 px-1'
                ref={whatsAppNumberErr}
              ></span>
            </label>

            <h3 className='mx-0 mt-4 mb-12 text-lg text-center'>رابط حساب الانستقرام</h3>
            <label htmlFor='instagramAccount' className='form__group'>
              <input
                name='instagramAccount'
                id='instagramAccount'
                type='text'
                className='form__input'
                defaultValue={data && data.instagramAccount}
                minLength={TAGLINE_MIN_LENGTH}
                maxLength={TAGLINE_MAX_LENGTH}
                onChange={e => setInstagramAccount(e.target.value.trim())}
                onKeyUp={e => {
                  const target = e.target.value.trim()

                  if (target.length > 0 && target.length < TAGLINE_MIN_LENGTH) {
                    instagramAccountErr.current.textContent = `رابط حساب الانستقرام قصير جداً يجب أن يتكون من ${TAGLINE_MIN_LENGTH} حرف على الأقل`
                  } else if (target.length > TAGLINE_MAX_LENGTH) {
                    instagramAccountErr.current.textContent = `رابط حساب الانستقرام طويل جداً! لا يمكن أن يزيد عن ${TAGLINE_MAX_LENGTH} حرف`
                  } else {
                    instagramAccountErr.current.textContent = ''
                  }
                }}
                required
              />
              <span className='pointer-events-none form__label'>
                اكتب رابط حساب الانستقرام الخاص بك، وذلك لفتح صفحة حسابك عند الضغط على
                ايقونة انستقرام اسفل الموقع
              </span>
              <span
                className='inline-block md:text-lg text-red-600 dark:text-red-400 font-[600] pt-2 px-1'
                ref={instagramAccountErr}
              ></span>
            </label>

            <h3 className='mx-0 mt-4 mb-12 text-lg text-center'>رابط حساب التويتر</h3>
            <label htmlFor='twitterAccount' className='form__group'>
              <input
                name='twitterAccount'
                id='twitterAccount'
                type='text'
                className='form__input'
                defaultValue={data && data.twitterAccount}
                minLength={TAGLINE_MIN_LENGTH}
                maxLength={TAGLINE_MAX_LENGTH}
                onChange={e => setTwitterAccount(e.target.value.trim())}
                onKeyUp={e => {
                  const target = e.target.value.trim()

                  if (target.length > 0 && target.length < TAGLINE_MIN_LENGTH) {
                    twitterAccountErr.current.textContent = `رابط حساب التويتر قصير جداً، يجب أن يتكون من ${TAGLINE_MIN_LENGTH} حرف على الأقل`
                  } else if (target.length > TAGLINE_MAX_LENGTH) {
                    twitterAccountErr.current.textContent = `رابط حساب التويتر طويل جداً! لا يمكن أن يزيد عن ${TAGLINE_MAX_LENGTH} حرف`
                  } else {
                    twitterAccountErr.current.textContent = ''
                  }
                }}
                required
              />
              <span className='pointer-events-none form__label'>
                اكتب رابط حساب التويتر الخاص بك، وذلك لفتح صفحة حسابك عند الضغط على ايقونة
                تويتر اسفل الموقع
              </span>
              <span
                className='inline-block md:text-lg text-red-600 dark:text-red-400 font-[600] pt-2 px-1'
                ref={twitterAccountErr}
              ></span>
            </label>

            <div className='mx-0 mt-4 mb-6 text-center'>
              <h3 className='mb-10 text-lg'>تصنيفات الوجبات</h3>
              <div className='flex justify-evenly'>
                <span>اسم التصنيف بالانجليزي</span>
                <span>اسم التصنيف بالعربي</span>
              </div>
            </div>
            {categoryList?.map((categoryItem, idx) => (
              <label className='mb-4 space-y-2' key={idx}>
                <div className='flex gap-4 justify-evenly'>
                  <input
                    type='text'
                    id='category'
                    min='5'
                    max='500'
                    onChange={e => handleInputChange(e, idx, categoryItem[1])}
                    className='w-2/4 px-2 py-1 text-xl text-gray-700 bg-transparent border-2 border-gray-500 border-solid rounded-lg outline-none focus-within:border-orange-500 dark:focus-within:border-gray-400 dark:text-gray-200'
                    dir='auto'
                    name='categoryName'
                    defaultValue={categoryItem[0]}
                    required
                  />
                  <input
                    type='text'
                    id='category'
                    min='5'
                    max='500'
                    onChange={e => handleInputChange(e, idx, categoryItem[0])}
                    className='w-2/4 px-2 py-1 text-xl text-gray-700 bg-transparent border-2 border-gray-500 border-solid rounded-lg outline-none focus-within:border-orange-500 dark:focus-within:border-gray-400 dark:text-gray-200'
                    dir='auto'
                    name='categoryValue'
                    defaultValue={categoryItem[1]}
                    required
                  />
                </div>
                <div className='flex gap-4 pb-6'>
                  {categoryList.length !== 1 && (
                    <button
                      type='button'
                      className='px-5 py-2 text-white transition-colors bg-red-500 rounded-lg w-fit hover:bg-red-600'
                      onClick={() => handleRemoveClick(idx)}
                    >
                      -
                    </button>
                  )}
                  {categoryList.length - 1 === idx && (
                    <button
                      type='button'
                      className='px-5 py-2 text-white transition-colors bg-blue-500 rounded-lg w-fit hover:bg-blue-600'
                      onClick={handleAddClick}
                    >
                      +
                    </button>
                  )}
                </div>
              </label>
            ))}

            <div
              className='inline-block md:text-lg text-red-600 dark:text-red-400 font-[600] pt-2 px-1'
              data-form-msg
            ></div>

            <div className='flex items-center justify-evenly'>
              <button
                type='submit'
                className='m-2 min-w-[7rem] bg-green-600 hover:bg-green-700 text-white py-1.5 px-6 rounded-md'
              >
                {loading && loading ? (
                  <>
                    <LoadingSpinner />
                    تحديث البيانات...
                  </>
                ) : (
                  'تحديث'
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}

export default About
