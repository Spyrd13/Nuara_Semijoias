import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import Story from '../components/Story'
import Trust from '../components/Trust'
import Newsletter from '../components/Newsletter'
import ProductCard from '../components/ProductCard'
import { useContent } from '../context/ContentContext'

function Home() {
  const { products, destaque } = useContent()

  const destaques = products.filter((p) => destaque.productIds.includes(p.id))

  const titulos = {
    mais_vendidos: 'Mais vendidos',
    menos_vendidos: 'Peças para descobrir',
    personalizavel: 'Selecionados especialmente',
  }
  const titulo = titulos[destaque.modo] || 'Destaques'

  return (
    <>
      <Hero />

      <section className="collection" id="colecao">
        <div className="section-head">
          <h2>{titulo}</h2>
          <p>Uma seleção especial — veja a coleção completa para conhecer tudo.</p>
        </div>

        <div className="wrap grid">
          {destaques.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="see-all">
          <Link className="btn" to="/colecao">Ver coleção completa</Link>
        </div>
      </section>

      <Story />
      <Trust />
      <Newsletter />
    </>
  )
}

export default Home