import Header from '../components/Header'
import Menu from '../components/Menu'
import NewFood from '../components/NewFood'
import About from '../components/About'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

import useDocumentTitle from '../hooks/useDocumentTitle'

const Home = () => {
  useDocumentTitle('Home')

  return (
    <>
      <Header />
      <Menu />
      <NewFood />
      <About />
      <Contact />
      <Footer />
    </>
  )
}

export default Home
