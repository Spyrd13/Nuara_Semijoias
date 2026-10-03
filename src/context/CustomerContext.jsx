import { createContext, useContext, useState } from 'react'
import { loadCustomer, saveCustomer, clearCustomer } from '../services/customerStorage'

const CustomerContext = createContext(null)

export function CustomerProvider({ children }) {
  const [customer, setCustomer] = useState(loadCustomer)

  function registerCustomer(dados) {
    setCustomer(dados)
    saveCustomer(dados)
  }

  function logout() {
    setCustomer(null)
    clearCustomer()
  }

  const value = { customer, isLoggedIn: !!customer, registerCustomer, logout }

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>
}

export function useCustomer() {
  const context = useContext(CustomerContext)
  if (!context) throw new Error('useCustomer precisa ser usado dentro de um <CustomerProvider>')
  return context
}