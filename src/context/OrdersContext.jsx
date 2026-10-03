import { createContext, useContext, useState, useEffect } from 'react'
import { loadOrders, saveOrders } from '../services/ordersStorage'

const OrdersContext = createContext(null)

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(loadOrders)

  useEffect(() => {
    saveOrders(orders)
  }, [orders])

  function addOrder({ items, total, customer }) {
    const pedido = {
      id: Date.now(),
      items,
      total,
      customer,
      status: 'pendente',
      createdAt: new Date().toISOString(),
    }
    setOrders((atual) => [pedido, ...atual])
    return pedido
  }

  function updateOrderStatus(id, status) {
    setOrders((atual) => atual.map((o) => (o.id === id ? { ...o, status } : o)))
  }

  const value = { orders, addOrder, updateOrderStatus }

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (!context) throw new Error('useOrders precisa ser usado dentro de um <OrdersProvider>')
  return context
}