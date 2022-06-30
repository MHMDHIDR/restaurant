import { useContext } from 'react'
import { TagsContext } from '../Contexts/TagsContext'

const AddTags = ({ inputId }) => {
  const { tags, removeTags, addTag } = useContext(TagsContext)

  return (
    <>
      <ul className='flex flex-wrap p-0 mt-2'>
        {tags.map((tag, index) => (
          <li
            key={index}
            className='flex items-center justify-center w-auto h-8 mt-6 mb-2 mr-2 text-white bg-gray-700 rounded group hover:cursor-pointer'
            onClick={() => removeTags(index)}
          >
            <span className='mx-2'>{tag}</span>
            <span
              className='
                block w-5 h-5 ml-2 leading-[1.1rem] text-xl text-center text-gray-800 bg-white rounded-full 
                group-hover:bg-red-500 group-hover:text-white
              '
            >
              &times;
            </span>
          </li>
        ))}
      </ul>
      <input
        type='text'
        id={inputId}
        className='form__input tags'
        onKeyDown={e => {
          if (e.target.value.trim() !== '') {
            addTag(e)
          }
        }}
      />
    </>
  )
}

export default AddTags
