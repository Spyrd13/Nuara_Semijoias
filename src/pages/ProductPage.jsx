import { useParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useContent } from '../context/ContentContext'

function ProductPage() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { products } = useContent()
  const product = products.find((p) => p.id === Number(id))

  if (!product) {
    return (
      <div className="product-page not-found">
        <p>Produto não encontrado.</p>
        <Link className="btn" to="/colecao">Voltar para a coleção</Link>
      </div>
    )
  }

  const precoFormatado = product.price.toFixed(2).replace('.', ',')

  return (
    <section className="product-page wrap">
      <Link className="back-link" to="/colecao">← Voltar para a coleção</Link>

      <div className="product-detail">
        <div className="placeholder product-detail-ph">{product.icon}</div>

        <div className="product-detail-info">
          <span className="category-tag">{product.category}</span>
          <h1>{product.name}</h1>
          <div className="price-large">R$ {precoFormatado}</div>
          <p className="description">{product.description}</p>

          <div className="product-actions">
            <button className="btn" onClick={() => addToCart(product)}>
              Adicionar ao carrinho
            </button>
            <a className="btn btn-solid" href="#">Comprar no Mercado Livre</a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductPage