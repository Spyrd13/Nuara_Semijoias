import { useState } from 'react'
import { useContent } from '../../context/ContentContext'

function AdminStory() {
  const { story, updateStory } = useContent()

  const [titulo, setTitulo] = useState(story.title)
  const [paragrafo1, setParagrafo1] = useState(story.paragraph1)
  const [paragrafo2, setParagrafo2] = useState(story.paragraph2)
  const [salvo, setSalvo] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    updateStory({ title: titulo, paragraph1: paragrafo1, paragraph2: paragrafo2 })
    setSalvo(true)
    setTimeout(() => setSalvo(false), 2000)
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h3>Nossa história</h3>

      <label>
        Título
        <input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
      </label>

      <label>
        Primeiro parágrafo
        <textarea rows={3} value={paragrafo1} onChange={(e) => setParagrafo1(e.target.value)} />
      </label>

      <label>
        Segundo parágrafo
        <textarea rows={3} value={paragrafo2} onChange={(e) => setParagrafo2(e.target.value)} />
      </label>

      <div>
        <button className="btn btn-solid" type="submit">Salvar</button>
        {salvo && <span className="admin-saved"> Salvo!</span>}
      </div>
    </form>
  )
}

export default AdminStory