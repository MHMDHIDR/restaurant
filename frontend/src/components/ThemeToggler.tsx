import { useContext } from 'react'
import { ThemeContext } from '../Contexts/ThemeContext'

const DarkmodeToggle = () => {
  /**
   * @description
   * This component is used to toggle the dark mode of the website.
   * It uses the `matchMedia` API to check if the user prefers dark mode.
   * It uses the `localStorage` API to save the user preference.
   * It uses the `classList` API to add and remove classes.
   * It uses the `querySelector` API to get the `html` element.
   * It uses the `setLocalStorage` function to save the user preference.
   * It uses the `setTheme` function to set the theme.
   * It uses the `useState` hook to set the theme on the first render.
   *
   * 1- Check if there's no theme object in the localStorage, (if TRUE), get the user System preference.
   * 2- Make a useState variable with value of (System preference), and save it in the local storage.
   * 3- if user clicks on the toggle call the setTheme function with the opposite value of the useState variable.
   * 4- make a function to set the theme in localStorage.
   * 5- make a function to set the theme in <html>
   */

  const { isDark, setIsDark, getLocalStorageTheme } = useContext<any>(ThemeContext)

  const PREFERENCE = window.matchMedia('(prefers-color-scheme: dark)')

  //if there's no theme object in the localStorage, (if TRUE), get the user System preference and set it to localStorage.
  if (!('theme' in localStorage)) {
    setLocalStorageTheme(PREFERENCE.matches)
  }
  setHtmlToDark(getLocalStorageTheme())

  //listen when user changes his preferences and change the theme accordingly.
  PREFERENCE.addEventListener('change', () => {
    handleToggle()
  })

  //set the theme in localStorage
  function setLocalStorageTheme(isDark) {
    return localStorage.setItem('theme', isDark ? 'dark' : 'lights')
  }

  const handleToggle = () => {
    setIsDark(!isDark)
    setHtmlToDark(!isDark)
    setLocalStorageTheme(!isDark)
  }

  function setHtmlToDark(isDark) {
    const HTML = document.querySelector('html')
    if (isDark || getLocalStorageTheme()) {
      HTML.classList.add('dark')
      return
    }
    HTML.classList.remove('dark') //remove dark class
  }

  return (
    <label
      className='cursor-pointer relative h-[calc(var(--drkModeToggleSize)/3)] w-[calc(var(--drkModeToggleSize)/1.15)] ltr'
      aria-label={`Switch to ${isDark === true ? 'Light' : 'Dark'} Mode`}
      title={`Switch to ${isDark === true ? 'Light' : 'Dark'} Mode`}
    >
      <input
        className='absolute w-0 h-0 opacity-0 theme-toggler peer'
        type='checkbox'
        data-theme='toggler'
        style={{ width: '50px', height: '50px', cursor: 'pointer' }}
        defaultChecked={isDark}
        onChange={handleToggle}
        aria-label='Dark Mode Toggler Checkbox'
        title='Dark Mode Toggler Checkbox'
      />

      {/* Toggle pill */}
      <div className='absolute w-full h-full transition-colors duration-300 border-2 border-gray-500 border-solid rounded-full shadow-lg dark:border-gray-200 peer-checked:bg-gray-700'></div>

      {/* Lightmode sun */}
      <div className='peer-checked:opacity-0 peer-checked:translate-x-12 peer-checked:translate-y-8 peer-checked:-rotate-0 absolute opacity-100 translate-x-[calc(var(--drkModeToggleSize)/10)] translate-y-[calc(var(--drkModeToggleSize)/22)] rotate-12 origin-[50%_50%] transition-all duration-300'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          xmlnsXlink='http://www.w3.org/1999/xlink'
          aria-hidden='true'
          focusable='false'
          preserveAspectRatio='xMidYMid meet'
          viewBox='0 0 24 24'
          className='absolute h-[calc(var(--drkModeToggleSize)/4.5)] w-[calc(var(--drkModeToggleSize)/4.5)] text-yellow-600'
          data-icon='feather-sun'
          data-inline='false'
        >
          <g
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <circle cx='12' cy='12' r='5'></circle>
            <path d='M12 1v2'></path>
            <path d='M12 21v2'></path>
            <path d='M4.22 4.22l1.42 1.42'></path>
            <path d='M18.36 18.36l1.42 1.42'></path>
            <path d='M1 12h2'></path>
            <path d='M21 12h2'></path>
            <path d='M4.22 19.78l1.42-1.42'></path>
            <path d='M18.36 5.64l1.42-1.42'></path>
          </g>
        </svg>
      </div>

      {/* Lightmode moon */}
      <div className='peer-checked:bg-[#485367] peer-checked:shadow-white peer-checked:translate-x-[calc(var(--drkModeToggleSize)/20)] absolute h-[calc(var(--drkModeToggleSize)/4.5)] w-[calc(var(--drkModeToggleSize)/4.5)] rounded-full bg-yellow-100 translate-x-[calc(var(--drkModeToggleSize)/1.8)] translate-y-[calc(var(--drkModeToggleSize)/20)] shadow-[inset_0_0_0_0.13em] shadow-orange-300 transition-all duration-300'></div>

      {/* Darkmode moon */}
      <div className='peer-checked:opacity-100 peer-checked:translate-x-[calc(var(--drkModeToggleSize)/1.9)] peer-checked:translate-y-[calc(var(--drkModeToggleSize)/15)] peer-checked:-rotate-[15deg] absolute opacity-0 translate-x-24 translate-y-2 rotate-0 origin-[50%_50%] transition-all duration-300'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          xmlnsXlink='http://www.w3.org/1999/xlink'
          aria-hidden='true'
          focusable='false'
          preserveAspectRatio='xMidYMid meet'
          viewBox='0 0 24 24'
          className='absolute h-[calc(var(--drkModeToggleSize)/3.5)] w-[calc(var(--drkModeToggleSize)/3.5)] text-orange-300'
          data-icon='feather-moon'
          data-inline='false'
        >
          <g
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M21 12.79A9 9 0 1 1 11.21 3A7 7 0 0 0 21 12.79z'></path>
          </g>
        </svg>
      </div>
    </label>
  )
}

export default DarkmodeToggle
