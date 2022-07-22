import { Suspense, lazy } from 'react'
import useDocumentTitle from '../hooks/useDocumentTitle'

import { LoadingCard } from '../components/Loading'

const FetchCategories = lazy(() => import('../components/FetchCategories'))
const Header = lazy(() => import('../components/Header'))
const Footer = lazy(() => import('../components/Footer'))

const Categories = () => {
  useDocumentTitle('Categories')

  return (
    <>
      <Suspense fallback={<LoadingCard />}>
        <Header />
      </Suspense>
      <section className='py-20 my-40'>
        <FetchCategories />
      </section>
      <Suspense fallback={<LoadingCard />}>
        <Footer />
      </Suspense>
    </>
  )
}

export default Categories
