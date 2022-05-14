import { Link } from 'react-router-dom'
import Logo from './Icons/Logo'
import { useContext } from 'react'
import { CartContext } from '../Contexts/CartContext'

const Card = ({
  cTitle,
  cItemId,
  cHeading,
  cDesc,
  cCtaLabel,
  cCtaLink,
  cImg = '',
  cImgAlt = 'Food Card',
  cPrice
}) => {
  const { items, addToCart, removeFromCart } = useContext(CartContext)

  const handleCart = () => {
    const item = items.find(item => item.cItemId === cItemId)
    if (item) {
      removeFromCart(cItemId, cHeading.props.children)
    } else {
      addToCart(cItemId, cHeading.props.children, cImg, cPrice, cDesc)
    }
  }

  return (
    <div className='mb-32'>
      {cTitle ? <h2 className='text-center card__title'>{cTitle}</h2> : ''}
      <div className='flex flex-wrap items-center justify-center max-w-xs mx-auto lg:justify-between sm:max-w-full'>
        <div className='flex flex-col flex-wrap items-center justify-center flex-1 order-1 gap-3 sm:px-16'>
          {cHeading ? (
            <h3
              name='foodName'
              className='inline-block pt-5 mt-10 text-xl text-center text-gray-800 bg-transparent sm:mt-0 sm:pt-2 dark:text-white underline-hover'
            >
              {cHeading}
            </h3>
          ) : null}
          {cPrice ? (
            <span className='px-3 py-1 text-green-800 bg-green-300 rounded-xl bg-opacity-80'>
              {cPrice + ' ر.ق'}
            </span>
          ) : null}
          <p className='py-8 break-all'>{cDesc}</p>
          {cCtaLabel ? (
            <div className='flex justify-evenly gap-3 flex-wrap grow-[0.5] text-center bg-transparent'>
              {cCtaLink ? (
                <Link
                  to={cCtaLink}
                  className='m-2 min-w-[7.5rem] text-white py-1.5 px-6 rounded-lg bg-green-800 hover:bg-green-700'
                >
                  {cCtaLabel}
                </Link>
              ) : (
                <button onClick={() => handleCart()}>{cCtaLabel}</button>
              )}
            </div>
          ) : null}
        </div>
        <div
          style={{ '--cardImgSize': '17rem' }}
          className='min-w-[var(--cardImgSize)] max-w-[calc(var(--cardImgSize))] overflow-hidden transition-colors bg-gray-100 border border-gray-400 rounded-lg dark:bg-gray-600 min-h-[var(--cardImgSize)] max-h-[calc(var(--cardImgSize))]'
        >
          {cImg ? (
            <img
              loading='lazy'
              src={cImg}
              alt={cImgAlt}
              className='min-w-[var(--cardImgSize)] min-h-[var(--cardImgSize)] p-2 object-cover rounded-xl aspect-video'
              height='320'
              width='320'
            />
          ) : (
            <Logo width='32 md:w-60' height='32 md:h-60' className='mx-auto my-2' />
          )}
        </div>
      </div>
    </div>
  )
}

export default Card
