import { useContent } from '../context/ContentContext'

function Hero() {
  const { hero } = useContent()

  return (
    <section className="hero">
      <div>
        <h1>{hero.title}</h1>
        <p>{hero.subtitle}</p>
        <a className="btn btn-solid" href="#colecao">Descobrir peças</a>
      </div>
      <div className="hero-visual">
        <div className="frame">
          <div className="placeholder">✦</div>
        </div>
        <span className="dot d1"></span>
        <span className="dot d2"></span>
      </div>
    </section>
  )
}

export default Hero