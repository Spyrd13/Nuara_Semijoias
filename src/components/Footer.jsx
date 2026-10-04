import { Link } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'

function Footer() {
  const { settings } = useSettings()
  const anoAtual = new Date().getFullYear()

  return (
    <footer>
      <div className="wrap footer-grid">
        <div>
          <div className="footer-brand">{settings.nomeLoja}</div>
          <p>{settings.footerTexto}</p>
          {settings.horarioAtendimento && (
            <p className="footer-horario">{settings.horarioAtendimento}</p>
          )}
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
          <a href={settings.linkTrocas}>Trocas e devoluções</a>
        </div>
        <div className="footer-col">
          <h4>Contato</h4>
          {settings.instagram && <a href={settings.instagram} target="_blank" rel="noreferrer">Instagram</a>}
          <a href="#">WhatsApp</a>
          {settings.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© {anoAtual} {settings.nomeLoja}. Todos os direitos reservados.</span>
        <span>Compra combinada direto pelo WhatsApp</span>
        <Link className="admin-link" to="/admin">admin</Link>
      </div>
    </footer>
  )
}

export default Footer