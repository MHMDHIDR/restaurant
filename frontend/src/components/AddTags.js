import { useContext } from 'react'
import { TagsContext } from '../Contexts/TagsContext'
import TagIcon from '../components/Icons/TagIcon'

const AddTags = ({ inputId }) => {
  const { tags, removeTags, addTag } = useContext(TagsContext)

  return (
    <>
      <ul className='flex flex-wrap mt-6'>
        {tags.map((tag, index) => (
          <li
            key={index}
            className='flex items-center justify-center w-auto h-8 mt-0 mb-2 ml-2 text-lg tracking-widest text-white bg-orange-800 rounded group hover:cursor-pointer'
            onClick={() => removeTags(index)}
          >
            <span className='flex items-center gap-2 mx-2'>
              <TagIcon />
              {tag}
            </span>
            <span
              className='
                block w-5 h-5 ml-2 pl-0.5 leading-[1.1rem] text-xl text-center text-orange-800 bg-white rounded-full 
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
        placeholder='اكتب التصنيفات التي تريد اضافتها'
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
