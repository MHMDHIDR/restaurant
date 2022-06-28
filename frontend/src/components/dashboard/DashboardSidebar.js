import { useRef } from 'react'
import { NavLink } from 'react-router-dom'

import goTo from '../../functions/goTo'
import menuToggler from '../../functions/menuToggler'

const DashboardSidebar = () => {
  const menuTogglerBtn = useRef(null)
  const { top } = menuTogglerBtn?.current?.getBoundingClientRect() ?? ''

  return (
    <aside>
      <input
        className='absolute w-0 h-0 overflow-hidden peer'
        type='checkbox'
        aria-label='Navigation Menu'
        title='Navigation Menu'
        id='menuToggler'
      />
      <label
        htmlFor='menuToggler'
        tooltip='القائمة'
        className={`block z-20 w-10 h-10 transition-all translate-x-0 bg-orange-700 border-2 border-r-0 border-gray-800 cursor-pointer hover:bg-orange-800 dark:border-white translate-y-36 sm:translate-y-24 peer-checked:-translate-x-56 ${
          top < 100 &&
          `after:content-[attr(tooltip)] after:bottom-[calc(var(--top)*2)] after:mt-2
          before:dark:border-t-transparent before:border-t-transparent before:border-b-gray-800 before:dark:border-b-gray-300 before:top-[var(--bottom)]`
        }`}
        style={{ margin: '0' }}
        ref={menuTogglerBtn}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 512 512'
          className='stroke-white'
        >
          <title>Sidebar Menu</title>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='17'
            d='M96 256h320M96 176h320M96 336h320'
          />
        </svg>
      </label>
      {/* overlay full inset-0 */}
      <div
        className='fixed inset-0 z-10 transition-opacity duration-500 bg-black opacity-0 pointer-events-none peer-checked:opacity-100 peer-checked:bg-opacity-80 peer-checked:pointer-events-auto'
        onClick={menuToggler}
      />

      <ul
        className='fixed z-10 flex flex-col w-56 h-full overflow-x-hidden overflow-y-auto transition-all translate-x-full bg-orange-800 shadow-inner dashboard__sidebar pt-36 sm:pt-20 peer-checked:translate-x-0'
        id='menu'
      >
        <li className='hover:bg-orange-700'>
          <NavLink
            end
            to={goTo('dashboard')}
            className={({ isActive }) =>
              !isActive ? 'dashboard__nav' : 'dashboard__nav isActive'
            }
            onClick={menuToggler}
          >
            لوحة التحكم
          </NavLink>
        </li>
        <li className='hover:bg-orange-700'>
          <NavLink
            end
            to={goTo('orders')}
            className={({ isActive }) =>
              !isActive ? 'dashboard__nav' : 'dashboard__nav isActive'
            }
            onClick={menuToggler}
          >
            الطلبات
          </NavLink>
        </li>
        <li className='hover:bg-orange-700'>
          <NavLink
            end
            to={goTo('menu')}
            className={({ isActive }) =>
              !isActive ? 'dashboard__nav' : 'dashboard__nav isActive'
            }
            onClick={menuToggler}
          >
            قائمة الوجبات
          </NavLink>
        </li>
        <li className='hover:bg-orange-700'>
          <NavLink
            end
            to={goTo('add-food')}
            className={({ isActive }) =>
              !isActive ? 'dashboard__nav' : 'dashboard__nav isActive'
            }
            onClick={menuToggler}
          >
            إضافة وجبة
          </NavLink>
        </li>
        <li className='hover:bg-orange-700'>
          <NavLink
            end
            to={goTo('settings')}
            className={({ isActive }) =>
              !isActive ? 'dashboard__nav' : 'dashboard__nav isActive'
            }
            onClick={menuToggler}
          >
            إعدادات الموقع
          </NavLink>
        </li>
        <li className='hover:bg-orange-700'>
          <NavLink
            end
            to={goTo('users')}
            className={({ isActive }) =>
              !isActive ? 'dashboard__nav' : 'dashboard__nav isActive'
            }
            onClick={menuToggler}
          >
            المستخدمين
          </NavLink>
        </li>
      </ul>
    </aside>
  )
}

export default DashboardSidebar
