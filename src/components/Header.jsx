import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useSettings } from '../context/SettingsContext'

function Header() {
  const { totalItems, toggleCart } = useCart()
  const { settings } = useSettings()

  return (
    <header>
      <nav className="wrap">
        <Link className="brand" to="/">
          {settings.logo ? <img className="brand-logo" src={settings.logo} alt={settings.nomeLoja} /> : settings.nomeLoja}
        </Link>
        <div className="nav-links">
          <Link to="/colecao">Coleção</Link>
          <a href="/#historia">Nossa história</a>
        </div>
        <div className="nav-cta">
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