import ThemeToggler from '../ThemeToggler'
import { Loading } from '../Icons/Status'

interface ModalProps {
  msg: string
  extraComponents?: React.ReactNode
  status?: React.ReactNode
  modalHidden?: string
  classes?: string
  redirectLink?: string
  redirectTime?: number
  btnName?: string
  btnLink?: string
  ctaConfirmBtns?: string[]
  ctaSpecialBtns?: string[]
}

const Modal = ({
  msg = ``,
  extraComponents,
  status = Loading,
  modalHidden = '',
  classes = msg.length > 200 ? 'text-justify' : 'text-center',
  redirectLink,
  redirectTime = 2500,
  btnName = '',
  btnLink = '/',
  ctaConfirmBtns = [],
  ctaSpecialBtns = []
}: ModalProps) => {
  if (redirectLink && redirectTime) {
    setTimeout(() => window.location.assign(redirectLink), redirectTime)
  }

  if (!modalHidden.includes('hidden')) {
    // if hidden property is there then add overflow-hidden to body
    document.body.classList.add('overflow-hidden')
  }

  return (
    <section
      id='modal'
      className={`fixed inset-0 p-0 m-0 min-h-screen min-w-screen z-[10000] bg-gray-500 opacity-95 ${
        modalHidden.includes('hidden') ? ' hidden' : ''
      } flex items-center`}
    >
      <span className='hidden'>
        {/* hidden theme toggler because I don't want user to change theme inside a modal view */}
        <ThemeToggler />
      </span>
      <div className='container mx-auto'>
        <div
          className='p-6 mx-12 text-center text-black bg-gray-200 border border-gray-400 rounded-lg shadow-lg dark:bg-gray-700 dark:text-gray-300 dashed'
          aria-modal='true'
        >
          <div className='flex justify-center'>{status}</div>
          <pre className='py-8 leading-9 whitespace-pre-line' dir='auto'>
            <p className={classes}>{msg}</p>
          </pre>
          {extraComponents && extraComponents}
          {btnName && btnLink ? (
            <a
              href={btnLink}
              className='inline-block px-5 py-1 text-white bg-orange-600 rounded-md hover:bg-orange-700'
            >
              {btnName}
            </a>
          ) : ctaConfirmBtns ? (
            <button className='flex items-center justify-center w-full gap-6'>
              {ctaConfirmBtns.map((btn, key) => {
                const conditions = [
                  '??????????',
                  '??????????',
                  '??????????',
                  '??????????',
                  '?????????? ?????? ????????',
                  '?????????? ?????? ????????????'
                ]
                const confirmColor = btn.includes('??????')
                  ? 'neutral'
                  : conditions.some(btnTxt => btn.includes(btnTxt))
                  ? 'green'
                  : 'red'
                return (
                  <span
                    key={key}
                    id={key === 0 ? 'confirm' : 'cancel'}
                    className={`${
                      key === 0
                        ? `bg-${confirmColor}-600 hover:bg-${confirmColor}-700 border-2 text-white py-1 px-5 rounded-md inline-block`
                        : 'underline-hover text-orange-700 dark:text-white'
                    }`}
                  >
                    {btn}
                  </span>
                )
              })}
            </button>
          ) : ctaSpecialBtns ? (
            <button>
              {ctaSpecialBtns.map((btn, idx) => (
                <span
                  key={idx}
                  className='inline-block px-5 py-1 text-white bg-orange-600 rounded-md hover:bg-orange-700'
                >
                  {btn}
                </span>
              ))}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default Modal
