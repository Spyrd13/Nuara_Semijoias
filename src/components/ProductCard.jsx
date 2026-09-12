// Este é o exemplo mais importante para você entender "props".
// ProductCard NÃO sabe nada sobre um produto específico — ele só
// sabe desenhar "UM produto genérico", e recebe qual produto
// desenhar por fora, através do parâmetro { product }.
//
// { product } aqui é "desestruturação": em vez de escrever
// function ProductCard(props) { ... props.product ... }
// já pegamos direto a propriedade "product" que foi passada.
import { Link } from 'react-router-dom'

function ProductCard({ product }) {
  const precoFormatado = product.price.toFixed(2).replace('.', ',')
  const temFoto = product.images && product.images.length > 0

  return (
    <Link className="card" to={`/produto/${product.id}`}>
      <div className="placeholder card-ph">
        {temFoto ? <img src={product.images[0]} alt={product.name} /> : product.icon}
      </div>
      <h3>{product.name}</h3>
      <div className="price">R$ {precoFormatado}</div>
    </Link>
  )
}

export default ProductCard