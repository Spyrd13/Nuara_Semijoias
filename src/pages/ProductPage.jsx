import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useContent } from '../context/ContentContext'

function ProductPage() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { products } = useContent()
  const product = products.find((p) => p.id === Number(id))

  const [fotoAtiva, setFotoAtiva] = useState(0)

  useEffect(() => {
    setFotoAtiva(0)
  }, [id])

  if (!product) {
    return (
      <div className="product-page not-found">
        <p>Produto não encontrado.</p>
        <Link className="btn" to="/colecao">Voltar para a coleção</Link>
      </div>
    )
  }

  const precoFormatado = product.price.toFixed(2).replace('.', ',')
  const fotos = product.images || []
  const temFotos = fotos.length > 0

  return (
    <section className="product-page wrap">
      <Link className="back-link" to="/colecao">← Voltar para a coleção</Link>

      <div className="product-detail">
        <div>
          <div className="placeholder product-detail-ph">
            {temFotos ? <img src={fotos[fotoAtiva]} alt={product.name} /> : product.icon}
          </div>

          {fotos.length > 1 && (
            <div className="product-thumbs">
              {fotos.map((src, index) => (
                <button
                  key={index}
                  type="button"
                  className={`product-thumb ${fotoAtiva === index ? 'active' : ''}`}
                  onClick={() => setFotoAtiva(index)}
                >
                  <img src={src} alt={`${product.name} ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-detail-info">
          <span className="category-tag">{product.category}</span>
          <h1>{product.name}</h1>
          <div className="price-large">R$ {precoFormatado}</div>
          <p className="description">{product.description}</p>

          <div className="product-actions">
            <button className="btn btn-solid" onClick={() => addToCart(product)}>
              Adicionar ao carrinho
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductPage