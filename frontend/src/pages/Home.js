import { Suspense, lazy } from 'react'

//Loading Page
import { LoadingPage } from '../components/Loading'

import useDocumentTitle from '../hooks/useDocumentTitle'

//components
const Header = lazy(() => import('../components/Header'))
const Menu = lazy(() => import('../components/Menu'))
const NewFood = lazy(() => import('../components/NewFood'))
const About = lazy(() => import('../components/About'))
const Contact = lazy(() => import('../components/Contact'))
const Footer = lazy(() => import('../components/Footer'))

const Home = () => {
  useDocumentTitle('Home')

  return (
    <Suspense fallback={<LoadingPage />}>
      <Header />
      <Menu />
      <NewFood />
      <About />
      <Contact />
      <Footer />
    </Suspense>
  )
}

export default Home
