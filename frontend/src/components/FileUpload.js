import { useContext } from 'react'
import { FileUploadContext } from '../Contexts/FileUploadContext'

const FileUpload = ({ data }) => {
  const { file, fileURLs, onFileRemove, onFileAdd } = useContext(FileUploadContext)

  return (
    <>
      <div
        className={`flex flex-wrap justify-center gap-x-5 py-3 overflow-y-auto bg-gray-100 rounded-lg cursor-pointer dark:bg-gray-700 w-[30rem]`}
      >
        {fileURLs.length === 0 ? (
          <img
            loading='lazy'
            src={data?.defaultImg}
            alt={data?.foodName}
            className='object-cover p-1 border border-gray-400 w-28 min-h-fit h-28 dark:border-gray-300 rounded-xl'
          />
        ) : (
          <>
            {fileURLs.map((fileURL, idx) => (
              <div
                key={idx}
                className={`flex items-center flex-col gap-y-3 max-h-44 h-44 place-content-center`}
              >
                <img
                  loading='lazy'
                  src={fileURL}
                  alt={data?.foodName}
                  className={`object-cover p-1 border border-gray-400 max-w-[7rem] min-h-fit h-28 dark:border-gray-300 rounded-xl`}
                />
                <button
                  type='button'
                  className='px-6 py-1 text-white transition-colors bg-red-500 rounded-full hover:bg-red-700'
                  onClick={() => onFileRemove(fileURL, file[idx].name)}
                >
                  حذف
                </button>
              </div>
            ))}
            <h3 className='text-xl text-center text-green-500 dark:text-green-400'>
              لا تنسى الضغط على زر تحديث أسفل الصفحة لتحميل الصور
            </h3>
          </>
        )}
      </div>

      <input
        type='file'
        name='foodImg'
        id='foodImg'
        className='p-3 text-lg text-white transition-colors bg-orange-800 cursor-pointer rounded-xl hover:bg-orange-700'
        accept='image/*'
        onChange={onFileAdd}
        multiple
      />
    </>
  )
}

export default FileUpload
