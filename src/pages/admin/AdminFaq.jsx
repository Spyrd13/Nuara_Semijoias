import { useState } from 'react'
import { useContent } from '../../context/ContentContext'

function AdminFaqRow({ item }) {
  const { updateFaqItem, removeFaqItem } = useContent()
  const [pergunta, setPergunta] = useState(item.pergunta)
  const [resposta, setResposta] = useState(item.resposta)

  function handleSave() {
    updateFaqItem(item.id, { pergunta, resposta })
  }

  return (
    <div className="admin-faq-row">
      <input value={pergunta} onChange={(e) => setPergunta(e.target.value)} placeholder="Pergunta" />
      <textarea rows={2} value={resposta} onChange={(e) => setResposta(e.target.value)} placeholder="Resposta" />
      <div className="admin-faq-actions">
        <button type="button" className="btn" onClick={handleSave}>Salvar</button>
        <button type="button" className="admin-remove" onClick={() => removeFaqItem(item.id)}>
          Remover
        </button>
      </div>
    </div>
  )
}

function AdminNewFaq() {
  const { addFaqItem } = useContent()
  const [pergunta, setPergunta] = useState('')
  const [resposta, setResposta] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    if (!pergunta || !resposta) return
    addFaqItem({ pergunta, resposta })
    setPergunta('')
    setResposta('')
  }

  return (
    <form className="admin-faq-row admin-new-faq" onSubmit={handleSubmit}>
      <input value={pergunta} onChange={(e) => setPergunta(e.target.value)} placeholder="Nova pergunta" />
      <textarea rows={2} value={resposta} onChange={(e) => setResposta(e.target.value)} placeholder="Resposta" />
      <button className="btn btn-solid" type="submit">Adicionar</button>
    </form>
  )
}

function AdminFaq() {
  const { faq } = useContent()

  return (
    <div className="admin-section">
      <h3>Perguntas frequentes ({faq.length})</h3>

      <div className="admin-faq-list">
        {faq.map((item) => (
          <AdminFaqRow key={item.id} item={item} />
        ))}
      </div>

      <h4>Adicionar nova pergunta</h4>
      <AdminNewFaq />
    </div>
  )
}

export default AdminFaq