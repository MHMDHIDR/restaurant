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

      <div className='flex flex-wrap p-10 justify-center overflow-y-scroll bg-gray-100 rounded-lg cursor-pointer w-[30rem] gap-6'>
        {foodFileURLs.length === 0 ? (
          <img
            loading='lazy'
            src={data?.defaultImg}
            alt={data?.foodName}
            className='object-cover p-1 border border-gray-400 w-28 min-h-fit h-28 dark:border-gray-300 rounded-xl'
          />
        ) : (
          foodFileURLs.map((fileURL, idx) => (
            <img
              key={idx}
              loading='lazy'
              src={fileURL}
              alt={data?.foodName}
              className='object-cover p-1 border border-gray-400 w-28 min-h-fit h-28 dark:border-gray-300 rounded-xl'
            />
          ))
        )}
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
