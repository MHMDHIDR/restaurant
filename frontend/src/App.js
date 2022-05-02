import ThemeContextProvider from './Contexts/ThemeContext'
import CartContextProvider from './Contexts/CartContext'

//components
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ModalNotFound from './components/Modal/ModalNotFound'

//user pages
import Home from './pages/Home'
import OrderFood from './pages/OrderFood'
import ViewFood from './pages/ViewFood'
import Categories from './pages/Categories'
import Join from './pages/Join'
import Login from './pages/Login'

//dashboard pages
import DashboardHome from './pages/dashboard/DashboardHome'
import DashboardOrders from './pages/dashboard/DashboardOrders'
import DashboardMenu from './pages/dashboard/DashboardMenu'
import DashboardAddFood from './pages/dashboard/food/DashboardAddFood'
import DashboardEditFood from './pages/dashboard/food/DashboardEditFood'
import DashboardAppSettings from './pages/dashboard/DashboardAppSettings'
import DashboardUsers from './pages/dashboard/DashboardUsers'

const App = () => {
  return (
    <ThemeContextProvider>
      <CartContextProvider>
        <Router>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='categories' element={<Categories />} />

            <Route path='order-food' element={<OrderFood />} />

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
        </Router>
      </CartContextProvider>
    </ThemeContextProvider>
  )
}

export default App
