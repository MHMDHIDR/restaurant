import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import useAxios from '../hooks/useAxios'

import abstractText from '../utils/abstractText'
import { removeSlug } from '../utils/slug'
import MyLink from '../components/MyLink'

import Logo from './Icons/Logo'
import Backtop from './Icons/Backtop'
import { WhatsApp, Twitter, Instagram } from './Icons/Socials'

const Footer = () => {
  const [settings, setSettings] = useState('')
  const [itemsNames, setItemsNames] = useState([])

  const fetchSettings = useAxios({ method: 'get', url: '/settings' })
  const productsNames = useAxios({ method: 'get', url: '/foods/1/2' })

  useEffect(() => {
    if (productsNames.response !== null || fetchSettings.response !== null) {
      setSettings(fetchSettings.response)
      setItemsNames(productsNames.response?.response)
    }
  }, [fetchSettings, productsNames])

  return (
    <footer className='text-white bg-orange-700 footer'>
      <div className='container mx-auto'>
        <div className='flex flex-col flex-wrap items-center justify-around gap-6 py-4 pb-20 sm:flex-row'>
          <div className='flex flex-wrap items-center justify-center flex-1 sm:flex-nowrap'>
            <Link
              aria-label='App Logo'
              title='App Logo'
              to='/'
              className='p-1.5 xl:p-3 transition-colors bg-orange-400 rounded-lg dark:bg-orange-600 opacity-80 hover:opacity-100'
            >
              <Logo width='10 md:w-14' height='10 md:h-14' />
            </Link>
            <p className='w-full mr-4 leading-10'>
              {settings
                ? settings?.appDesc
                : 'أطلب ألذ الأطعمة والمشروبات الطازجة من مطعمنا العالمي'}
            </p>
          </div>
          <div className='flex flex-wrap flex-1 w-full gap-14 sm:w-auto justify-evenly'>
            <div>
              <h3 className='mb-3 text-lg font-bold'>وجبات مقترحة لك</h3>
              <ul className='space-y-2'>
                {!itemsNames || itemsNames.length === 0 ? (
                  <li>
                    <Link to='/view' className='hover:text-gray-700'>
                      عرض الوجبات
                    </Link>
                  </li>
                ) : (
                  itemsNames.map((item, idx) => (
                    <li key={idx}>
                      <Link to={`/view/item/${item._id}`} className='hover:text-gray-700'>
                        {removeSlug(abstractText(item.foodName, 20))}
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div>
              <h3 className='mb-3 text-lg font-bold'>روابـــــط</h3>
              <ul className='space-y-2'>
                <li>
                  <Link to='/view' className='hover:text-gray-700'>
                    كل الوجبات
                  </Link>
                </li>
                <li>
                  <MyLink to='new' className='hover:text-gray-700'>
                    جديد المطعم
                  </MyLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className='flex items-center justify-around gap-6 py-4'>
          <a
            rel='noreferrer'
            href={`https://web.whatsapp.com/send?phone=974${settings?.whatsAppNumber}&text=مرحبا+اسمي:+....،+معك+.....+أرغب+بالتواصل+معك+بخصوص:+....`}
            target='_blank'
          >
            <WhatsApp fill='lime' />
          </a>
          <a rel='noreferrer' href={settings?.instagramAccount} target='_blank'>
            <Instagram fill='hotpink' />
          </a>
          <a rel='noreferrer' href={settings?.twitterAccount} target='_blank'>
            <Twitter fill='cyan' />
          </a>
        </div>

        <div className='flex items-center justify-around gap-6 py-4'>
          <p className='font-[600] text-center px-2 sm:px-0 leading-loose'>
            موقع Restaurant لطلب الوجبات والأطعمة اللذيذة - جميع الحقوق محفوظة &copy; 2021
          </p>
        </div>
      </div>

      <Backtop />
    </footer>
  )
}

export default Footer
