import { Suspense, lazy } from 'react'
import ThemeContextProvider from './Contexts/ThemeContext'
import CartContextProvider from './Contexts/CartContext'
import TagsContextProvider from './Contexts/TagsContext'
import ToppingsContextProvider from './Contexts/ToppingsContext'
import FileUploadContextProvider from './Contexts/FileUploadContext'

//components
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ModalNotFound from './components/Modal/ModalNotFound'

//Loading Page
import { LoadingPage } from './components/Loading'

//user pages
const Home = lazy(() => import('./pages/Home'))
const OrderFood = lazy(() => import('./pages/OrderFood'))
const ViewFood = lazy(() => import('./pages/ViewFood'))
const SearchResults = lazy(() => import('./pages/SearchResults'))
const Categories = lazy(() => import('./pages/Categories'))
const Join = lazy(() => import('./pages/Join'))
const Login = lazy(() => import('./pages/Login'))

//dashboard pages
const DashboardHome = lazy(() => import('./pages/dashboard/DashboardHome'))
const DashboardOrders = lazy(() => import('./pages/dashboard/DashboardOrders'))
const DashboardMenu = lazy(() => import('./pages/dashboard/DashboardMenu'))
const DashboardAddFood = lazy(() => import('./pages/dashboard/food/DashboardAddFood'))
const DashboardEditFood = lazy(() => import('./pages/dashboard/food/DashboardEditFood'))
const DashboardAppSettings = lazy(() => import('./pages/dashboard/DashboardAppSettings'))
const DashboardUsers = lazy(() => import('./pages/dashboard/DashboardUsers'))

const App = () => (
  <FileUploadContextProvider>
    <ThemeContextProvider>
      <ToppingsContextProvider>
        <CartContextProvider>
          <TagsContextProvider>
            <Router>
              <Suspense fallback={<LoadingPage />}>
                <Routes>
                  <Route path='/' element={<Home />} />
                  <Route path='categories' element={<Categories />} />
                  <Route path='order-food' element={<OrderFood />} />
                  <Route path='search' element={<SearchResults />}>
                    <Route path=':search' element={<SearchResults />}>
                      <Route path=':pageNum' element={<SearchResults />} />
                    </Route>
                  </Route>

                  {/* View All Food */}
                  <Route path='view' element={<ViewFood />} />
                  <Route path='view/:pageNum' element={<ViewFood />} />
                  {/* multiple item */}
                  <Route path='view/:category/:pageNum' element={<ViewFood />} />
                  {/* single item */}
                  <Route path='view/item/:foodId' element={<ViewFood />} />

                  {/* authentication */}
                  <Route path='join' element={<Join />} />
                  <Route path='login' element={<Login />} />

                  {/* dashboard */}
                  <Route path='dashboard' element={<DashboardHome />}>
                    {/* Food */}
                    <Route path='orders' element={<DashboardOrders />} />
                    <Route path='orders/:pageNum' element={<DashboardOrders />} />
                    <Route path='menu' element={<DashboardMenu />} />
                    <Route path='menu/:pageNum' element={<DashboardMenu />} />
                    <Route path='add-food' element={<DashboardAddFood />} />
                    <Route path='edit-food/:foodId' element={<DashboardEditFood />} />
                    <Route path='settings' element={<DashboardAppSettings />} />
                    <Route path='users' element={<DashboardUsers />} />
                    <Route path='users/:pageNum' element={<DashboardUsers />} />
                  </Route>
                  <Route path='*' element={<ModalNotFound />} />
                </Routes>
              </Suspense>
            </Router>
          </TagsContextProvider>
        </CartContextProvider>
      </ToppingsContextProvider>
    </ThemeContextProvider>
  </FileUploadContextProvider>
)

export default App
