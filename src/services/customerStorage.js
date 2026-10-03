const STORAGE_KEY = 'nuara-customer'

export function loadCustomer() {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY)
    return salvo ? JSON.parse(salvo) : null
  } catch (erro) {
    console.error('Não foi possível ler os dados do cliente:', erro)
    return null
  }
}

export function saveCustomer(customer) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customer))
    return true
  } catch (erro) {
    console.error('Não foi possível salvar os dados do cliente:', erro)
    return false
  }
}

export function clearCustomer() {
  localStorage.removeItem(STORAGE_KEY)
}