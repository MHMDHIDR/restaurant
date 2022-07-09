import { useState, useEffect, useRef, useContext } from 'react'
import { Link } from 'react-router-dom'
import Axios from 'axios'

import { TagsContext } from '../../../Contexts/TagsContext'
import { FileUploadContext } from '../../../Contexts/FileUploadContext'

import useDocumentTitle from '../../../hooks/useDocumentTitle'
import useAxios from '../../../hooks/useAxios'

import Modal from '../../../components/Modal/Modal'
import { Success, Error, Loading } from '../../../components/Icons/Status'
import AddTags from '../../../components/AddTags'
import FileUpload from '../../../components/FileUpload'

import { createSlug } from '../../../functions/slug'
import goTo from '../../../functions/goTo'

const AddFood = () => {
  useDocumentTitle('Add Food or Drink')

  //Form States
  const [foodName, setFoodName] = useState('')
  const [foodPrice, setFoodPrice] = useState('')
  const [category, setCategory] = useState([])
  const [foodDesc, setFoodDesc] = useState('')

  const [addFoodStatus, setAddFoodStatus] = useState()
  const [addFoodMessage, setAddFoodMessage] = useState()
  const [categoryList, setCategoryList] = useState([])
  const [toppings, setToppings] = useState([{}])

  //Contexts
  const { tags } = useContext(TagsContext)
  const { file } = useContext(FileUploadContext)

  //Form errors messages
  const ImgErr = useRef(null)
  const foodNameErr = useRef(null)
  const priceErr = useRef(null)
  const descErr = useRef(null)
  const formMsg = useRef(null)

  const modalLoading = document.querySelector('#modal')
  const BASE_URL =
    process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_API_LOCAL_URL
      : process.env.REACT_APP_API_URL

  //fetching categories
  const { response } = useAxios({
    method: 'get',
    url: '/settings'
  })

  useEffect(() => {
    if (response !== null) {
      setCategoryList(response?.CategoryList)
    }
  }, [response])

  const handleAddFood = async e => {
    e.preventDefault()

    //using FormData to send constructed data
    const formData = new FormData()
    formData.append('foodName', foodName)
    formData.append('foodPrice', foodPrice)
    formData.append('category', category[0])
    formData.append('foodDesc', foodDesc)
    formData.append('foodToppings', JSON.stringify(toppings))
    formData.append('foodTags', JSON.stringify(tags))
    file.map(foodImg => formData.append('foodImg', foodImg))

    if (
      ImgErr.current.textContent === '' &&
      foodNameErr.current.textContent === '' &&
      priceErr.current.textContent === '' &&
      descErr.current.textContent === ''
    ) {
      //show waiting modal
      modalLoading.classList.remove('hidden')

      try {
        const response = await Axios.post(`${BASE_URL}/foods`, formData)

        const { foodAdded, message } = response.data
        setAddFoodStatus(foodAdded)
        setAddFoodMessage(message)
        //Remove waiting modal
        setTimeout(() => {
          modalLoading.classList.add('hidden')
        }, 300)
      } catch (err) {
        formMsg.current.textContent = `عفواً حدث خطأ ما 😥 ${err}`
      }
    } else {
      formMsg.current.textContent =
        'الرجاء إضافة بيانات الوجبة بصورة صحيحة لتستطيع إضافتها 😃'
    }
  }

  const handleInputChange = (e, index) => {
    const { name, value } = e.target
    const newToppings = [...toppings]
    newToppings[index][name] = value
    setToppings(newToppings)
  }

  const handleAddClick = () => {
    setToppings([...toppings, {}])
  }

  const handleRemoveClick = index => {
    const list = [...toppings]
    list.splice(index, 1)
    setToppings(list)
  }

  return (
    <>
      {addFoodStatus === 1 ? (
        <Modal
          status={Success}
          msg={`تم إضافة ${category[1]} بنجاح 😄 الرجاء الانتظار ليتم تحويلك لقائمة الوجبات والمشروبات`}
          // redirectLink='menu'
          // redirectTime='3000'
        />
      ) : addFoodStatus === 0 ? (
        <Modal status={Error} msg={addFoodMessage} />
      ) : null}

      <section className='py-12 my-8 dashboard'>
        <div className='container mx-auto'>
          <h3 className='mx-0 mt-4 mb-12 text-2xl text-center md:text-3xl'>إضافة وجبة</h3>
          <div>
            <div className='food'>
              {/* Show Modal Loading when submitting form */}
              <Modal
                status={Loading}
                modalHidden='hidden'
                classes='text-blue-500 text-center'
                msg='الرجاء الانتظار...'
              />

              <form
                method='POST'
                className='form'
                encType='multipart/form-data'
                onSubmit={handleAddFood}
              >
                <div className='flex flex-col items-center justify-center gap-4 mb-8 sm:justify-between'>
                  <FileUpload
                    data={{
                      defaultImg: [
                        {
                          foodImgDisplayName: 'food',
                          foodImgDisplayPath: 'https://source.unsplash.com/random?food'
                        }
                      ],
                      foodName: 'Food, Drink, Sweet'
                    }}
                  />

                  <span
                    className='inline-block md:text-lg text-red-600 dark:text-red-400 font-[600] pt-2 px-1'
                    ref={ImgErr}
                  ></span>
                </div>

                <label htmlFor='foodName' className='form__group'>
                  <input
                    type='text'
                    id='foodName'
                    className='form__input'
                    autoFocus
                    required
                    onChange={e => setFoodName(createSlug(e.target.value.trim()))}
                    onKeyUp={e => {
                      const target = e.target.value.trim()

                      if (target.length > 0 && target.length < 5) {
                        foodNameErr.current.textContent =
                          'إسم الوجبة أو المشروب صغير ولا يوصف'
                      } else if (target.length > 30) {
                        foodNameErr.textContent =
                          'الاسم لا يمكن أن يزيد عن 30 حرفاً، يمكنك إضافة وصف طويل إذا كنت تحتاج لذلك'
                      } else {
                        foodNameErr.current.textContent = ''
                      }
                    }}
                  />
                  <span className='form__label'>اسم الوجبة أو المشروب</span>
                  <span
                    className='inline-block md:text-lg text-red-600 dark:text-red-400 font-[600] pt-2 px-1'
                    ref={foodNameErr}
                  ></span>
                </label>

                <label htmlFor='foodPrice' className='form__group'>
                  <input
                    type='number'
                    id='foodPrice'
                    className='form__input'
                    min='5'
                    max='500'
                    required
                    onChange={e => setFoodPrice(e.target.value.trim())}
                    onKeyUp={e => {
                      const target = parseInt(e.target.value.trim())

                      if (target > 0 && target < 5) {
                        priceErr.current.textContent = `سعر الوجبة أو المشروب يجب أن لا يقل عن 5 ريال`
                      } else if (target > 500) {
                        priceErr.current.textContent = `سعر الوجبة أو المشروب يجب أن لا يزيد عن 500 ريال`
                      } else {
                        priceErr.current.textContent = ''
                      }
                    }}
                  />
                  <span className='form__label'>السعر (ر.ق)</span>
                  <span
                    className='inline-block md:text-lg text-red-600 dark:text-red-400 font-[600] pt-2 px-1'
                    ref={priceErr}
                  ></span>
                </label>

                <label htmlFor='category' className='form__group'>
                  <select
                    id='category'
                    className='form__input'
                    required
                    onChange={e =>
                      setCategory([
                        e.target.value.trim(),
                        e.target.options[e.target.selectedIndex].textContent
                      ])
                    }
                  >
                    <option value=''>اختر التصنيف</option>
                    {categoryList?.map((category, idx) => (
                      <option key={idx} value={category[0]}>
                        {category[1]}
                      </option>
                    ))}
                  </select>
                  <span className='form__label active'>التصنيف</span>
                </label>

                <label htmlFor='foodDescription' className='form__group'>
                  <textarea
                    name='foodDescription'
                    id='foodDescription'
                    minLength='10'
                    maxLength='300'
                    className='form__input'
                    required
                    onChange={e => setFoodDesc(e.target.value.trim())}
                    onKeyUp={e => {
                      const target = e.target.value.trim()

                      if (target.length > 0 && target.length < 30) {
                        descErr.current.textContent = `الوصف صغير ولا يكفي أن يصف العنصر المضاف`
                      } else if (target.length > 300) {
                        descErr.current.textContent = `الوصف لا يمكن أن يزيد عن 300 حرف`
                      } else {
                        descErr.current.textContent = ''
                      }
                    }}
                  ></textarea>
                  <span className='form__label'>وصف الوجبة أو المشروب</span>
                  <span
                    className='inline-block md:text-lg text-red-600 dark:text-red-400 font-[600] pt-2 px-1'
                    ref={descErr}
                  ></span>
                </label>

                <label htmlFor='foodTags' className='form__group'>
                  <AddTags inputId='foodTags' />
                  <span className='form__label'>
                    علامات تصنيفية تساعد في عملية البحث عن الوجبة (Tags) - هذا الحقل
                    اختياري
                  </span>
                </label>

                <div className='mx-0 mt-4 mb-6 text-center'>
                  <h3 className='mb-10 text-xl'>الإضافات - Toppings (اختياري)</h3>
                  <div className='flex justify-around'>
                    <span className='text-xl'>الإضافة</span>
                    <span className='text-xl'>السعر (ر.ق)</span>
                  </div>
                </div>
                {toppings?.map(({ toppingName, toppingPrice }, idx) => (
                  <label className='block space-y-2' key={idx}>
                    <div className='flex gap-4 justify-evenly'>
                      <input
                        type='text'
                        id='toppingName'
                        min='5'
                        max='500'
                        className='w-2/4 p-3 text-xl text-gray-700 bg-transparent border-2 border-gray-500 border-solid rounded-lg outline-none focus-within:border-orange-500 dark:focus-within:border-gray-400 dark:text-gray-200'
                        dir='auto'
                        name='toppingName'
                        defaultValue={toppingName}
                        onChange={e => handleInputChange(e, idx)}
                        required
                      />
                      <input
                        type='number'
                        id='toppingPrice'
                        min='1'
                        max='500'
                        className='w-2/4 p-3 text-xl text-gray-700 bg-transparent border-2 border-gray-500 border-solid rounded-lg outline-none focus-within:border-orange-500 dark:focus-within:border-gray-400 dark:text-gray-200 rtl'
                        dir='auto'
                        name='toppingPrice'
                        defaultValue={toppingPrice}
                        onChange={e => handleInputChange(e, idx)}
                        required
                      />
                    </div>
                    <div className='flex gap-4 pb-6'>
                      {toppings.length !== 1 && (
                        <button
                          type='button'
                          tooltip='حذف الإضافة'
                          className='px-5 py-2 text-white transition-colors bg-red-500 rounded-lg w-fit hover:bg-red-600'
                          onClick={() => handleRemoveClick(idx)}
                        >
                          -
                        </button>
                      )}
                      {toppings.length - 1 === idx && (
                        <button
                          type='button'
                          tooltip='إضافة جديدة'
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
                  className='my-14 inline-block md:text-2xl text-red-600 dark:text-red-400 font-[600] py-2 px-1'
                  ref={formMsg}
                ></div>

                <div className='flex items-center justify-evenly'>
                  <button
                    type='submit'
                    className='min-w-[7rem] bg-green-600 hover:bg-green-700 text-white py-1.5 px-6 rounded-md'
                  >
                    إضافة
                  </button>
                  <Link
                    to={goTo('menu')}
                    className='text-gray-800 underline-hover text-bold dark:text-white'
                  >
                    القائمة
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default AddFood
