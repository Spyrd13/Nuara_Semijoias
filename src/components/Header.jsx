import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Header() {
  const { totalItems, toggleCart } = useCart()

  return (
    <header>
      <nav className="wrap">
        <Link className="brand" to="/">Nüara Semijoias</Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/colecao">Coleção</Link>
          <Link to="/faq">Perguntas Frequentes</Link>
        </div>
        <div className="nav-cta">
          <Link className="icon-btn" to="/minha-conta">Minha conta</Link>
          <button className="cart-btn" onClick={toggleCart}>
            Carrinho
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>
        </div>
      </nav>
    </header>
  )
}

export default Header