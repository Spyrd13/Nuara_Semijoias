import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  function addToCart(product) {
    setItems((atual) => {
      const jaExiste = atual.find((item) => item.id === product.id)
      if (jaExiste) {
        return atual.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...atual, { ...product, quantity: 1 }]
    })
    setIsOpen(true)
  }

    function removeFromCart(id) {
    setItems((atual) => atual.filter((item) => item.id !== id))
  }

  function increaseQuantity(id) {
    setItems((atual) =>
      atual.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    )
  }

  function decreaseQuantity(id) {
    setItems((atual) =>
      atual
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    )
  }

  function toggleCart() {
    setIsOpen((atual) => !atual)
  }

  function closeCart() {
    setIsOpen(false)
  }

  const totalItems = items.reduce((soma, item) => soma + item.quantity, 0)
  const totalPrice = items.reduce((soma, item) => soma + item.price * item.quantity, 0)

   const value = {
    items,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    isOpen,
    toggleCart,
    closeCart,
    totalItems,
    totalPrice,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart precisa ser usado dentro de um <CartProvider>')
  }
  return context
}