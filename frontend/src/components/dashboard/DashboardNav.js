import { Link } from 'react-router-dom'
import ThemeToggler from '../ThemeToggler'
import Logo from '../Icons/Logo'

const DashboardNav = () => {
  const handleLogout = () => {
    'user' in localStorage && localStorage.removeItem('user')

    window.location.href = '/'
  }

  return (
    <nav className='fixed top-0 left-0 right-0 z-20 flex flex-wrap items-center gap-2 px-5 py-2 text-sm bg-gray-300 shadow-xl xl:text-base bg-opacity-90 dark:bg-neutral-900 dark:bg-opacity-90 nav justify-evenly sm:justify-between lg:px-8 backdrop-blur-sm '>
      <Link to='/'>
        <Logo />
      </Link>

      <ThemeToggler />

      <div className='flex flex-wrap justify-end gap-4'>
        <Link
          to='/#'
          className='inline-block px-2 py-1 text-white bg-orange-700 border rounded-lg cursor-pointer hover:bg-opacity-30'
          onClick={handleLogout}
        >
          تسجيل الخروج
        </Link>
        <Link
          to='/'
          className='inline-block px-2 py-1 text-white bg-orange-700 border rounded-lg cursor-pointer hover:bg-opacity-30'
        >
          زيارة الموقع
        </Link>
      </div>
    </nav>
  )
}

export default DashboardNav
