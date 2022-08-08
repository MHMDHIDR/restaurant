import { Link, useLocation } from 'react-router-dom'
import scrollTo from '../utils/scrollToSection'
import menuToggler from '../utils/menuToggler'

interface MyLinkProps {
  children: React.ReactNode
  to?: string
  className?: string
}

const MyLink = ({ children, to = `/`, className }: MyLinkProps) => {
  const { pathname } = useLocation()

  return pathname === '/' ? (
    <Link
      to={`/#${to}`}
      className={className ? className : 'underline-hover'}
      data-scroll={to}
      onClick={e => {
        scrollTo(e)
        menuToggler()
      }}
    >
      {children}
    </Link>
  ) : (
    <Link to={`/`} className={className ? className : 'underline-hover'}>
      {children}
    </Link>
  )
}

export default MyLink
