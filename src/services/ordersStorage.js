const STORAGE_KEY = 'nuara-orders'

export function loadOrders() {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY)
    return salvo ? JSON.parse(salvo) : []
  } catch (erro) {
    console.error('Não foi possível ler os pedidos salvos:', erro)
    return []
  }
}

export function saveOrders(orders) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
    return true
  } catch (erro) {
    console.error('Não foi possível salvar os pedidos:', erro)
    return false
  }
}