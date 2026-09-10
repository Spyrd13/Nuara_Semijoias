import { useState } from 'react'
import { useContent } from '../context/ContentContext'
import AdminHero from './admin/AdminHero'
import AdminStory from './admin/AdminStory'
import AdminProducts from './admin/AdminProducts'
import AdminFaq from './admin/AdminFaq'

const abas = [
  { value: 'hero', label: 'Home (banner)' },
  { value: 'story', label: 'Nossa história' },
  { value: 'products', label: 'Produtos' },
  { value: 'faq', label: 'FAQ' },
]

function AdminPage() {
  const [abaAtiva, setAbaAtiva] = useState('hero')
  const { resetToDefault } = useContent()

  function handleReset() {
    const confirmou = window.confirm(
      'Isso apaga TODAS as suas edições (produtos, textos, FAQ) e volta pro conteúdo original. Tem certeza?'
    )
    if (confirmou) resetToDefault()
  }

  return (
    <section className="admin-page wrap">
      <div className="admin-warning">
        ⚠️ Ambiente de teste — sem login/senha ainda. As edições ficam
        salvas só neste navegador (localStorage), não é seguro pra
        produção. Isso vai ser resolvido quando o backend entrar.
        <button type="button" className="admin-reset" onClick={handleReset}>
          Restaurar conteúdo padrão
        </button>
      </div>

      <h1>Painel administrativo</h1>

      <div className="admin-tabs">
        {abas.map((aba) => (
          <button
            key={aba.value}
            className={`admin-tab ${abaAtiva === aba.value ? 'active' : ''}`}
            onClick={() => setAbaAtiva(aba.value)}
          >
            {aba.label}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {abaAtiva === 'hero' && <AdminHero />}
        {abaAtiva === 'story' && <AdminStory />}
        {abaAtiva === 'products' && <AdminProducts />}
        {abaAtiva === 'faq' && <AdminFaq />}
      </div>
    </section>
  )
}

export default AdminPage