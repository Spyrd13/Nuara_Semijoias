import { useState } from 'react'
import { useSettings } from '../../context/SettingsContext'
import { resizeImage } from '../../utils/resizeImage'

function AdminSettings() {
  const { settings, updateSettings } = useSettings()
  const [form, setForm] = useState(settings)
  const [salvo, setSalvo] = useState(false)

  function handleChange(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }))
  }

  async function handleImagem(campo, event) {
    const arquivo = event.target.files[0]
    if (!arquivo) return
    const base64 = await resizeImage(arquivo, 400, 0.85)
    handleChange(campo, base64)
    event.target.value = ''
  }

  function handleSubmit(event) {
    event.preventDefault()
    updateSettings(form)
    setSalvo(true)
    setTimeout(() => setSalvo(false), 2000)
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h3>Configurações da loja</h3>
      <p className="admin-hint">
        O número de WhatsApp não fica aqui por segurança — ele continua
        configurado direto no arquivo .env do projeto.
      </p>

      <label>
        Nome da loja
        <input value={form.nomeLoja} onChange={(e) => handleChange('nomeLoja', e.target.value)} />
      </label>

      <label>
        Instagram (link completo)
        <input value={form.instagram} onChange={(e) => handleChange('instagram', e.target.value)} placeholder="https://instagram.com/..." />
      </label>

      <label>
        E-mail de contato
        <input value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
      </label>

      <label>
        Texto do rodapé (embaixo do nome da loja)
        <textarea rows={2} value={form.footerTexto} onChange={(e) => handleChange('footerTexto', e.target.value)} />
      </label>

      <label>
        Link de trocas e devoluções
        <input value={form.linkTrocas} onChange={(e) => handleChange('linkTrocas', e.target.value)} />
      </label>

      <label>
        Horário de atendimento
        <input value={form.horarioAtendimento} onChange={(e) => handleChange('horarioAtendimento', e.target.value)} />
      </label>

      <label>
        Frase inicial da mensagem de pedido (vai no WhatsApp)
        <input value={form.mensagemPedidoIntro} onChange={(e) => handleChange('mensagemPedidoIntro', e.target.value)} />
      </label>

      <div className="admin-photo-section">
        <label className="admin-photo-label">Logo (aparece no topo do site, no lugar do nome)</label>
        <input className="admin-photo-input" type="file" accept="image/*" onChange={(e) => handleImagem('logo', e)} />
        {form.logo && (
          <div className="admin-photo-list">
            <div className="admin-photo-thumb principal">
              <img src={form.logo} alt="Logo" />
              <div className="admin-photo-actions">
                <button type="button" className="admin-photo-remove" onClick={() => handleChange('logo', null)}>Remover</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="admin-photo-section">
        <label className="admin-photo-label">Favicon (ícone da aba do navegador)</label>
        <input className="admin-photo-input" type="file" accept="image/*" onChange={(e) => handleImagem('favicon', e)} />
        {form.favicon && (
          <div className="admin-photo-list">
            <div className="admin-photo-thumb principal">
              <img src={form.favicon} alt="Favicon" />
              <div className="admin-photo-actions">
                <button type="button" className="admin-photo-remove" onClick={() => handleChange('favicon', null)}>Remover</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <button className="btn btn-solid" type="submit">Salvar</button>
        {salvo && <span className="admin-saved"> Salvo!</span>}
      </div>
    </form>
  )
}

export default AdminSettings