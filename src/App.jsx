import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import CollectionPage from './pages/CollectionPage'
import ProductPage from './pages/ProductPage'
import AccountPage from './pages/AccountPage'
import FAQPage from './pages/FAQPage'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/colecao" element={<CollectionPage />} />
        <Route path="/produto/:id" element={<ProductPage />} />
        <Route path="/minha-conta" element={<AccountPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <Footer />
      <CartDrawer />
    </>
  )
}

export default App