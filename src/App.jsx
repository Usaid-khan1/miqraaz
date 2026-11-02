import { useState, useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'

// Providers
import { ToastProvider } from './context/ToastContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'

// Customer Components
import { Header } from './components/Header.jsx'
import { Footer } from './components/Footer.jsx'
import { CartDrawer } from './components/CartDrawer.jsx'
import { SearchModal } from './components/SearchModal.jsx'
import { WhatsAppButton } from './components/WhatsAppButton.jsx'

// Customer Pages
import { Home } from './pages/Home.jsx'
import { Collection } from './pages/Collection.jsx'
import { Product } from './pages/Product.jsx'
import { SearchPage } from './pages/SearchPage.jsx'
import { CartPage } from './pages/CartPage.jsx'
import { Checkout } from './pages/Checkout.jsx'
import { OrderSuccess } from './pages/OrderSuccess.jsx'
import { Login } from './pages/Login.jsx'
import { Register } from './pages/Register.jsx'
import { ForgotPassword } from './pages/ForgotPassword.jsx'
import { ResetPassword } from './pages/ResetPassword.jsx'
import { Account } from './pages/Account.jsx'
import { About } from './pages/About.jsx'
import { Contact } from './pages/Contact.jsx'
import { Policy } from './pages/Policy.jsx'
import { NotFound } from './pages/NotFound.jsx'

// Admin Panel
import { AdminLayout } from './admin/AdminLayout.jsx'
import { AdminOverview } from './admin/AdminOverview.jsx'
import { AdminProducts } from './admin/AdminProducts.jsx'
import { AdminCategories } from './admin/AdminCategories.jsx'
import { AdminOrders } from './admin/AdminOrders.jsx'
import { AdminCustomers } from './admin/AdminCustomers.jsx'
import { AdminCoupons } from './admin/AdminCoupons.jsx'
import { AdminInventory } from './admin/AdminInventory.jsx'
import { AdminSettings } from './admin/AdminSettings.jsx'

function AppContent() {
  const [searchOpen, setSearchOpen] = useState(false)
  const loc = useLocation()

  const isAdminRoute = loc.pathname.startsWith('/admin')
  const isHome = loc.pathname === '/'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [loc.pathname])

  return (
    <>
      {!isAdminRoute && (
        <Header onOpenSearch={() => setSearchOpen(true)} />
      )}

      <main className={isAdminRoute ? 'main-admin' : isHome ? 'main-home' : 'main-inner'}>
        <Routes>
          {/* Public Customer Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/collections/:slug" element={<Collection />} />
          <Route path="/products/:slug" element={<Product />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders/:orderNumber/success" element={<OrderSuccess />} />

          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/account" element={<Account />} />

          {/* Editorial Pages */}
          <Route path="/pages/about-miqraaz" element={<About />} />
          <Route path="/pages/about-keshk" element={<Navigate to="/pages/about-miqraaz" replace />} />
          <Route path="/pages/contact" element={<Contact />} />
          <Route path="/pages/:slug" element={<Policy />} />
          <Route path="/policies/:slug" element={<Policy />} />

          {/* Admin Dashboard Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <CartDrawer />}
      {!isAdminRoute && <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />}
      {!isAdminRoute && <WhatsAppButton />}
    </>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  )
}
