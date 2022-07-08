import { useState, useEffect } from 'react'

const ImageUpload = ({ data }) => {
  const [foodFile, setFoodFile] = useState([])
  const [foodFileURLs, setFoodFileURLs] = useState([])

  const onFileChange = e => {
    setFoodFile([...e.target.files])
  }

  useEffect(() => {
    if (foodFile.length < 1) return

    const newFileUrls = []
    foodFile.forEach(file => {
      if (Math.ceil(file.size / 1000000) < 2) {
        newFileUrls.push(URL.createObjectURL(file))
      }
      setFoodFileURLs(newFileUrls)
    })
  }, [foodFile])

  return (
    <>
      {console.log(foodFileURLs)}

      <div
        className={`grid grid-cols-3 gap-6 p-4 overflow-y-auto bg-gray-100 rounded-lg cursor-pointer dark:bg-gray-700 w-[30rem]`}
      >
        {foodFileURLs.length === 0 ? (
          <img
            loading='lazy'
            src={data?.defaultImg}
            alt={data?.foodName}
            className='object-cover p-1 border border-gray-400 w-28 min-h-fit h-28 dark:border-gray-300 rounded-xl'
          />
        ) : (
          <>
            {foodFileURLs.map((fileURL, idx) => (
              <div
                key={idx}
                className={`flex items-center flex-col gap-y-3 max-h-44 h-44`}
              >
                <img
                  loading='lazy'
                  src={fileURL}
                  alt={data?.foodName}
                  className='object-cover p-1 border border-gray-400 max-w-[7rem] min-h-fit h-28 dark:border-gray-300 rounded-xl'
                />
                <button
                  type='button'
                  className='min-w-full py-2 text-white transition-colors bg-red-500 rounded-full hover:bg-red-700'
                  onClick={() => {
                    setFoodFileURLs(foodFileURLs.filter(url => url !== fileURL))
                  }}
                >
                  حذف
                </button>
              </div>
            ))}
          </>
        )}
        <h3 className='col-span-3 text-xl text-center text-green-600 dark:text-green-400'>
          لا تنسى الضغط على زر تحديث أسفل الصفحة لتحميل الصور
        </h3>
      </div>

      <input
        type='file'
        name='foodImg'
        id='foodImg'
        className='p-3 text-lg text-white transition-colors bg-orange-800 cursor-pointer rounded-xl hover:bg-orange-700'
        accept='image/*'
        onChange={onFileChange}
        multiple
      />
    </>
  )
}

export default ImageUpload
