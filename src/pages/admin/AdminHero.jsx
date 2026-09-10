import { useState } from 'react'
import { useContent } from '../../context/ContentContext'

function AdminHero() {
  const { hero, updateHero } = useContent()

  const [titulo, setTitulo] = useState(hero.title)
  const [subtitulo, setSubtitulo] = useState(hero.subtitle)
  const [salvo, setSalvo] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    updateHero({ title: titulo, subtitle: subtitulo })
    setSalvo(true)
    setTimeout(() => setSalvo(false), 2000)
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h3>Banner principal (Home)</h3>

      <label>
        Título
        <input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
      </label>

      <label>
        Texto de apoio
        <textarea rows={4} value={subtitulo} onChange={(e) => setSubtitulo(e.target.value)} />
      </label>

      <div>
        <button className="btn btn-solid" type="submit">Salvar</button>
        {salvo && <span className="admin-saved"> Salvo!</span>}
      </div>
    </form>
  )
}

export default AdminHero