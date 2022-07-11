import { Link, useLocation } from 'react-router-dom'
import scrollTo from '../functions/scrollToSection'
import menuToggler from '../functions/menuToggler'

const MyLink = ({ children, to = `/`, className }) => {
  const { pathname } = useLocation()

  return pathname === '/' ? (
    <Link
      to={`#/${to}`}
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
