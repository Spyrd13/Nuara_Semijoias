export function getPrecoEfetivo(product) {
  if (product.precoPromocional && product.precoPromocional > 0 && product.precoPromocional < product.price) {
    return product.precoPromocional
  }
  return product.price
}

export function estaEmPromocao(product) {
  return getPrecoEfetivo(product) !== product.price
}

export function formatarPreco(valor) {
  return valor.toFixed(2).replace('.', ',')
}