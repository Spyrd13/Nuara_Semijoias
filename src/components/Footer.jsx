import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer>
      <div className="wrap footer-grid">
        <div>
          <div className="footer-brand">Nüara Semijoias</div>
          <p>Peças que contam histórias. Vitrine própria, compra segura pelo Mercado Livre.</p>
        </div>
        <div className="footer-col">
          <h4>Loja</h4>
          <Link to="/colecao">Coleção</Link>
          <a href="/#historia">Nossa história</a>
          <Link to="/minha-conta">Minha conta</Link>
        </div>
        <div className="footer-col">
          <h4>Ajuda</h4>
          <Link to="/faq">Perguntas frequentes</Link>
          <a href="#">Rastrear pedido</a>
          <a href="#">Trocas e devoluções</a>
        </div>
        <div className="footer-col">
          <h4>Contato</h4>
          <a href="#">Instagram</a>
          <a href="#">WhatsApp</a>
          <a href="#">contato@nuara.com.br</a>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© 2026 Nüara Semijoias. Todos os direitos reservados.</span>
        <span>Compra processada com segurança pelo Mercado Livre</span>
        <Link className="admin-link" to="/admin">admin</Link>
      </div>
    </footer>
  )
}

export default Footer