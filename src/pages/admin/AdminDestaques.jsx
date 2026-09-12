import { useState } from 'react'
import { useContent } from '../../context/ContentContext'

const modos = [
  { value: 'mais_vendidos', label: 'Mais vendido' },
  { value: 'menos_vendidos', label: 'Menos vendido' },
  { value: 'personalizavel', label: 'Personalizável' },
]

const categorias = [
  { value: 'todos', label: 'Todos' },
  { value: 'colar', label: 'Colares' },
  { value: 'anel', label: 'Anéis' },
  { value: 'brinco', label: 'Brincos' },
  { value: 'pulseira', label: 'Pulseiras' },
]

function paraCincoSlots(ids) {
  const slots = [...ids].slice(0, 5)
  while (slots.length < 5) slots.push(null)
  return slots
}

function AdminDestaques() {
  const { products, destaque, updateDestaque } = useContent()

  const [modo, setModo] = useState(destaque.modo)
  const [slots, setSlots] = useState(paraCincoSlots(destaque.productIds))
  const [abaSlot, setAbaSlot] = useState(0)
  const [categoriaFiltro, setCategoriaFiltro] = useState('todos')
  const [salvo, setSalvo] = useState(false)

  const produtosFiltrados =
    categoriaFiltro === 'todos'
      ? products
      : products.filter((p) => p.category === categoriaFiltro)

  function escolherProdutoNoSlot(productId) {
    setSlots((atual) => atual.map((id, i) => (i === abaSlot ? productId : id)))
  }

  function limparSlot() {
    setSlots((atual) => atual.map((id, i) => (i === abaSlot ? null : id)))
  }

  function handleSave() {
    const productIds = slots.filter((id) => id !== null)
    updateDestaque({ modo, productIds })
    setSalvo(true)
    setTimeout(() => setSalvo(false), 2000)
  }

  function nomeDoSlot(id) {
    const produto = products.find((p) => p.id === id)
    return produto ? produto.name : null
  }

  return (
    <div className="admin-section">
      <h3>Destaques da Home</h3>
      <p className="admin-hint">
        Escolha o modo de exibição. Em "Personalizável", você escolhe
        exatamente qual peça aparece em cada uma das 5 posições.
      </p>

      <div className="admin-radio-group">
        {modos.map((item) => (
          <label key={item.value} className="admin-radio">
            <input
              type="radio"
              name="modo-destaque"
              checked={modo === item.value}
              onChange={() => setModo(item.value)}
            />
            {item.label}
          </label>
        ))}
      </div>

      {modo !== 'personalizavel' ? (
        <p className="admin-hint">
          Nesse modo, a Home mostra as mesmas peças já escolhidas em
          "Personalizável" — só o título da seção muda. Pra trocar as
          peças, selecione "Personalizável" ao lado.
        </p>
      ) : (
        <>
          <div className="admin-slot-tabs">
            {slots.map((id, index) => (
              <button
                key={index}
                type="button"
                className={`admin-slot-tab ${abaSlot === index ? 'active' : ''}`}
                onClick={() => setAbaSlot(index)}
              >
                {nomeDoSlot(id) || `Peça ${index + 1}`}
              </button>
            ))}
          </div>

          <div className="admin-slot-picker">
            <select
              className="admin-slot-filter"
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
            >
              {categorias.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>

            {slots[abaSlot] && (
              <button type="button" className="admin-slot-clear" onClick={limparSlot}>
                Deixar esta posição vazia
              </button>
            )}

            <div className="admin-slot-options">
              {produtosFiltrados.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  className={`admin-slot-option ${slots[abaSlot] === product.id ? 'selected' : ''}`}
                  onClick={() => escolherProdutoNoSlot(product.id)}
                >
                  {product.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div>
        <button type="button" className="btn btn-solid" onClick={handleSave}>Salvar</button>
        {salvo && <span className="admin-saved"> Salvo!</span>}
      </div>
    </div>
  )
}

export default AdminDestaques