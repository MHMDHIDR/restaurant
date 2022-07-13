import { toggleCSSclasses } from '../../utils/toggleCSSclasses'

const Backtop = ({ color = 'orange' }) => {
  const backTop = document.querySelector('.back__top')
  const ScrollLimit = 400

  if (backTop !== null) {
    window.addEventListener('scroll', () => {
      toggleCSSclasses(
        [window.scrollY > ScrollLimit],
        backTop,
        ['opacity-100', 'bottom-[10%]', 'pointer-events-auto'],
        ['opacity-0', 'bottom-1/2', 'pointer-events-none']
      )
    })

    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  return (
    <div
      className={`
        cursor-pointer bg-${color}-700 hover:bg-${color}-800 fixed right-[3%] h-10 w-10 border-2 border-solid border-${color}-100 rounded-md z-50 overflow-hidden transition-all back__top
        after:content-["⬆"] after:block after:text-center after:text-lg after:mt-1 after:transition-[margin]
        hover:after:mt-0.5
        opacity-0 bottom-1/2 pointer-events-none
      `}
      title='الذهاب للأعلى'
    ></div>
  )
}

export default Backtop
