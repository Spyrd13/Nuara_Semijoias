import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { getPrecoEfetivo, estaEmPromocao, formatarPreco } from '../utils/pricing'

function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [activeIndex, setActiveIndex] = useState(0)

  const precoFormatado = formatarPreco(getPrecoEfetivo(product))
  const fotos = product.images || []
  const temFotos = fotos.length > 0
  const temVariasFotos = fotos.length > 1

  function handlePrev(event) {
    event.preventDefault()
    event.stopPropagation()
    setActiveIndex((atual) => (atual === 0 ? fotos.length - 1 : atual - 1))
  }

  function handleNext(event) {
    event.preventDefault()
    event.stopPropagation()
    setActiveIndex((atual) => (atual === fotos.length - 1 ? 0 : atual + 1))
  }

  function handleAddToCart(event) {
    event.preventDefault()
    event.stopPropagation()
    addToCart(product)
  }

  return (
    <Link className="card" to={`/produto/${product.id}`}>
      <div className="placeholder card-ph">
        {temFotos ? <img src={fotos[activeIndex]} alt={product.name} /> : product.icon}

        {temVariasFotos && (
          <>
            <button
              type="button"
              className="card-arrow card-arrow-left"
              onClick={handlePrev}
              aria-label="Foto anterior"
            >
              ‹
            </button>
            <button
              type="button"
              className="card-arrow card-arrow-right"
              onClick={handleNext}
              aria-label="Próxima foto"
            >
              ›
            </button>
            <div className="card-dots">
              {fotos.map((_, index) => (
                <span key={index} className={`card-dot ${activeIndex === index ? 'active' : ''}`} />
              ))}
            </div>
          </>
        )}
      </div>

      <h3>{product.name}</h3>
      <div className="card-bottom-row">
        <div className="price">
          {estaEmPromocao(product) && <span className="price-old">R$ {formatarPreco(product.price)}</span>}
          R$ {precoFormatado}
        </div>
         <button
          type="button"
          className="card-add-btn"
          onClick={handleAddToCart}
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </Link>
  )
}

export default ProductCard