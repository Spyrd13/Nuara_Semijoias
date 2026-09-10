import { useState } from 'react'
import { useContent } from '../context/ContentContext'

function FAQPage() {
  const { faq } = useContent()
  const [abertaId, setAbertaId] = useState(null)

  function toggle(id) {
    setAbertaId((atual) => (atual === id ? null : id))
  }

  return (
    <section className="faq-page wrap">
      <div className="section-head">
        <h2>Perguntas frequentes</h2>
        <p>Tudo o que você precisa saber sobre como comprar na Nüara.</p>
      </div>

      <div className="faq-list">
        {faq.map((item) => (
          <div className="faq-item" key={item.id}>
            <button className="faq-question" onClick={() => toggle(item.id)}>
              <span>{item.pergunta}</span>
              <span className="faq-icon">{abertaId === item.id ? '−' : '+'}</span>
            </button>
            {abertaId === item.id && <p className="faq-answer">{item.resposta}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}

export default FAQPage