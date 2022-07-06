import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { DotButton, PrevButton, NextButton } from './EmblaCarouselButtons'
import useEmblaCarousel from 'embla-carousel-react'
import { Thumb } from './EmblaCarouselThumb'
import { removeSlug } from '../../functions/slug'

const EmblaCarousel = ({ slides, media, smallView = false }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false)
  const [scrollSnaps, setScrollSnaps] = useState([])

  const [mainViewportRef, embla] = useEmblaCarousel({ skipSnaps: false })
  const [thumbViewportRef, emblaThumbs] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    selectedClass: '',
    dragFree: true
  })
  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla])
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla])
  const scrollTo = useCallback(index => embla && embla.scrollTo(index), [embla])

  const onThumbClick = useCallback(
    index => {
      if (!embla || !emblaThumbs) return
      if (emblaThumbs.clickAllowed()) embla.scrollTo(index)
    },
    [embla, emblaThumbs]
  )

  const onSelect = useCallback(() => {
    if (!embla || !emblaThumbs) return
    setSelectedIndex(embla.selectedScrollSnap())
    emblaThumbs.scrollTo(embla.selectedScrollSnap())

    setPrevBtnEnabled(embla.canScrollPrev())
    setNextBtnEnabled(embla.canScrollNext())
  }, [embla, emblaThumbs, setSelectedIndex])

  useEffect(() => {
    if (!embla) return
    onSelect()
    setScrollSnaps(embla.scrollSnapList())
    embla.on('select', onSelect)
  }, [embla, setScrollSnaps, onSelect])

  //get food id, image, name, price from the array of object
  const IdByIndex = index => media[index % media.length]._id
  const priceByIndex = index => media[index % media.length].foodPrice
  const mediaByIndex = index => media[index % media.length].foodImg
  const nameByIndex = index => media[index % media.length].foodName
  const HEADER_BG_IMG = 'assets/img/header-bg.png' // or using data.heroBg

  return (
    <div dir='ltr'>
      {/* Big Menu View */}
      <div
        className={`
          ${smallView ? 'w-60 mx-auto' : 'w-full'}
          relative p-1.5 rounded-xl cursor-grab bg-center border-gray-500 dark:border-gray-100
          before:absolute overflow-hidden before:inset-0
          before:bg-gray-100 before:dark:bg-gray-600 border
          before:bg-opacity-[.85] before:dark:bg-opacity-[.85]
          before:rounded-xl before:transition-colors
        `}
        style={{ backgroundImage: `url(${HEADER_BG_IMG})` }}
      >
        <div ref={mainViewportRef}>
          <div className='flex gap-3 -ml-2 select-none flex-warp'>
            {slides.map(index =>
              smallView ? (
                <div className='relative flex flex-col pl-2 min-w-fit' key={index}>
                  <CarouselContent
                    index={index}
                    priceByIndex={priceByIndex}
                    mediaByIndex={mediaByIndex}
                    nameByIndex={nameByIndex}
                    slides={slides}
                    media={media}
                    smallView={smallView}
                  />
                  <div className='flex flex-col items-center gap-2 py-2 justify-evenly'>
                    <label
                      htmlFor='foodImg'
                      className='min-w-fit cursor-pointer bg-green-600 hover:bg-green-700 text-white py-1.5 px-6 rounded-md'
                    >
                      استبدال الصورة
                    </label>
                    <button
                      id='deleteFoodImg'
                      type='button'
                      data-img-id={index}
                      className='min-w-fit bg-red-600 hover:bg-red-700 text-white py-1.5 px-6 rounded-md'
                    >
                      حذف الصورة
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to={`/view/item/${IdByIndex(index)}`}
                  className='relative min-w-full pl-2'
                  key={index}
                >
                  <CarouselContent
                    index={index}
                    priceByIndex={priceByIndex}
                    mediaByIndex={mediaByIndex}
                    nameByIndex={nameByIndex}
                    slides={slides}
                    media={media}
                    smallView={smallView}
                  />
                </Link>
              )
            )}
          </div>
        </div>
        {!smallView && (
          <>
            <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
            <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
          </>
        )}
      </div>

      {/* Dots (buttons) View */}
      {!smallView && (
        <div className='flex justify-center pt-3 list-none'>
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              selected={index === selectedIndex}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
      )}

      {/* Thumb View */}
      {!smallView && (
        <div className='relative w-full p-2 transition-colors bg-gray-100 dark:bg-gray-600 rounded-xl'>
          <div className='w-full overflow-hidden' ref={thumbViewportRef}>
            <div className='flex justify-between cursor-default select-none'>
              {slides.map(index => (
                <Thumb
                  onClick={() => onThumbClick(index)}
                  selected={index === selectedIndex}
                  imgSrc={mediaByIndex(index)}
                  alt={removeSlug(nameByIndex(index))}
                  key={index}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export const CarouselContent = ({
  index,
  priceByIndex,
  mediaByIndex,
  nameByIndex,
  smallView = false
}) => {
  return (
    <>
      {!smallView && (
        <span className='absolute z-40 flex items-center justify-center px-4 py-2 text-base font-bold text-white bg-green-900 sm:px-6 sm:text-xl rounded-xl top-3 left-4 rtl'>
          {priceByIndex(index)} ر.ق
        </span>
      )}
      <div
        className={`relative overflow-hidden rounded-xl filter ${
          smallView ? 'h-40 w-40' : 'h-60 sm:h-72 md:h-96'
        }`}
      >
        <img
          loading='lazy'
          className={`absolute z-30 block object-cover -translate-x-1/2 -translate-y-1/2 sm:object-contain top-1/2 left-1/2 ${
            smallView ? 'w-fit' : 'w-full min-h-full'
          }`}
          alt={removeSlug(nameByIndex(index))}
          title={removeSlug(nameByIndex(index))}
          src={mediaByIndex(index)}
        />
      </div>
      {!smallView && (
        <span className='inline-block w-full py-2 text-base text-center sm:text-2xl'>
          {removeSlug(nameByIndex(index))}
        </span>
      )}
    </>
  )
}

export default EmblaCarousel
