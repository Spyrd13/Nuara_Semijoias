import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { ContentProvider } from './context/ContentContext'
import { CustomerProvider } from './context/CustomerContext'
import { OrdersProvider } from './context/OrdersContext'
import App from './App.jsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ContentProvider>
        <CustomerProvider>
          <OrdersProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </OrdersProvider>
        </CustomerProvider>
      </ContentProvider>
    </BrowserRouter>
  </React.StrictMode>,
)