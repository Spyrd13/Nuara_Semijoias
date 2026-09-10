import { useState } from 'react'
import ProductCard from '../components/ProductCard'
import { useContent } from '../context/ContentContext'

const categorias = [
  { value: 'todos', label: 'Todos' },
  { value: 'colar', label: 'Colares' },
  { value: 'anel', label: 'Anéis' },
  { value: 'brinco', label: 'Brincos' },
  { value: 'pulseira', label: 'Pulseiras' },
]

function CollectionPage() {
  const { products } = useContent()
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos')

  const produtosFiltrados =
    categoriaAtiva === 'todos'
      ? products
      : products.filter((product) => product.category === categoriaAtiva)

  return (
    <section className="collection" id="colecao-completa">
      <div className="section-head">
        <h2>Coleção completa</h2>
        <p>Todas as peças da Nüara, em um só lugar.</p>
      </div>

      <div className="wrap collection-layout">
        <aside className="filters">
          <h4>Categoria</h4>
          {categorias.map((cat) => (
            <button
              key={cat.value}
              className={`filter-btn ${categoriaAtiva === cat.value ? 'active' : ''}`}
              onClick={() => setCategoriaAtiva(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </aside>

        <div className="grid">
          {produtosFiltrados.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {produtosFiltrados.length === 0 && (
            <p className="empty-msg">Nenhuma peça encontrada nessa categoria.</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default CollectionPage