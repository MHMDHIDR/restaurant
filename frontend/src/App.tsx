import { Suspense, lazy } from 'react'
import ThemeContextProvider from './Contexts/ThemeContext'
import CartContextProvider from './Contexts/CartContext'
import TagsContextProvider from './Contexts/TagsContext'
import ToppingsContextProvider from './Contexts/ToppingsContext'
import FileUploadContextProvider from './Contexts/FileUploadContext'
import SearchContextProvider from './Contexts/SearchContext'
import DashboardOrderContextProvider from './Contexts/DashboardOrderContext'

//components
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ModalNotFound from './components/Modal/ModalNotFound'

//Loading Page
import { LoadingPage } from './components/Loading'
import DashboardOrdersEdit from './pages/dashboard/orders/DashboardOrdersEdit'
import DashboardStatistics from './pages/dashboard/DashboardStatistics'

//user pages
const Home = lazy(() => import('./pages/Home'))
const OrderFood = lazy(() => import('./pages/OrderFood'))
const MyOrders = lazy<any>(() => import('./pages/MyOrders'))
const ViewFood = lazy(() => import('./pages/ViewFood'))
const SearchResults = lazy(() => import('./pages/SearchResults'))
const Categories = lazy(() => import('./pages/Categories'))

//Auth pages
const Join = lazy(() => import('./pages/auth/Join'))
const Login = lazy(() => import('./pages/auth/Login'))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'))

//dashboard pages
const DashboardHome = lazy<any>(() => import('./pages/dashboard/DashboardHome'))
// const DashboardOrders = lazy(() => import('./pages/dashboard/orders/DashboardOrders'))
import DashboardOrders from './pages/dashboard/orders/DashboardOrders'
const DashboardMenu = lazy(() => import('./pages/dashboard/DashboardMenu'))
const DashboardAddFood = lazy(() => import('./pages/dashboard/food/DashboardAddFood'))
const DashboardEditFood = lazy(() => import('./pages/dashboard/food/DashboardEditFood'))
const DashboardAppSettings = lazy(() => import('./pages/dashboard/DashboardAppSettings'))
const DashboardUsers = lazy(() => import('./pages/dashboard/DashboardUsers'))

const App: React.FC = () => (
  <FileUploadContextProvider>
    <ThemeContextProvider>
      <ToppingsContextProvider>
        <CartContextProvider>
          <TagsContextProvider>
            <SearchContextProvider>
              <DashboardOrderContextProvider>
                <Router>
                  <Suspense fallback={<LoadingPage />}>
                    <Routes>
                      <Route path='/' element={<Home />} />

                      <Route path='categories' element={<Categories />} />

                      <Route path='order-food' element={<OrderFood />} />

                      <Route path='my-orders' element={<MyOrders />}>
                        <Route path=':pageNum' element={<MyOrders />} />
                      </Route>

                      <Route path='search' element={<SearchResults />}>
                        <Route path=':search' element={<SearchResults />} />
                      </Route>

                      {/* View Routes */}
                      <Route path='view' element={<ViewFood />}>
                        <Route path=':pageNum' element={<ViewFood />} />

                        <Route path=':category' element={<ViewFood />}>
                          <Route path=':pageNum' element={<ViewFood />} />
                        </Route>

                        <Route path='item' element={<ViewFood />}>
                          <Route path=':foodId' element={<ViewFood />} />
                        </Route>
                      </Route>

                      <Route path='auth/join' element={<Join />} />

                      <Route path='auth/login' element={<Login />}>
                        <Route path=':redirect' element={<Login />} />
                      </Route>

                      <Route path='auth/forgot' element={<ForgotPassword />} />

                      <Route path='auth/reset' element={<ResetPassword />}>
                        <Route path=':token' element={<ResetPassword />} />
                      </Route>

                      {/* Dashboard */}

                      <Route path='dashboard' element={<DashboardHome />}>
                        <Route path='stats' element={<DashboardStatistics />} />

                        <Route path='orders' element={<DashboardOrders />}>
                          <Route path=':pageNum' element={<DashboardOrders />} />
                        </Route>

                        <Route
                          path='edit-order/:orderId'
                          element={<DashboardOrdersEdit />}
                        />

                        <Route path='menu' element={<DashboardMenu />}>
                          <Route path=':pageNum' element={<DashboardMenu />} />
                        </Route>

                        <Route path='add-food' element={<DashboardAddFood />} />

                        <Route path='edit-food/:foodId' element={<DashboardEditFood />} />

                        <Route path='settings' element={<DashboardAppSettings />} />

                        <Route path='users' element={<DashboardUsers />}>
                          <Route path=' :pageNum' element={<DashboardUsers />} />
                        </Route>
                      </Route>
                      <Route path='*' element={<ModalNotFound />} />
                    </Routes>
                  </Suspense>
                </Router>
              </DashboardOrderContextProvider>
            </SearchContextProvider>
          </TagsContextProvider>
        </CartContextProvider>
      </ToppingsContextProvider>
    </ThemeContextProvider>
  </FileUploadContextProvider>
)

export default App
