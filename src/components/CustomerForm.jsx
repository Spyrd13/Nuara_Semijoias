import { useState } from 'react'

function CustomerForm({ onConfirmar, onCancelar, textoIntroducao, textoBotao, mostrarSalvar = true }) {
  const [nome, setNome] = useState('')
  const [sobrenome, setSobrenome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [salvar, setSalvar] = useState(true)

  function handleSubmit(event) {
    event.preventDefault()
    if (!nome || !telefone) return
    onConfirmar({ nome, sobrenome, telefone, salvar })
  }

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      {textoIntroducao && <p className="checkout-form-intro">{textoIntroducao}</p>}
      <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" required />
      <input value={sobrenome} onChange={(e) => setSobrenome(e.target.value)} placeholder="Sobrenome" />
      <input value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="Seu telefone (com DDD)" required />
      {mostrarSalvar && (
        <label className="checkout-form-checkbox">
          <input type="checkbox" checked={salvar} onChange={(e) => setSalvar(e.target.checked)} />
          Salvar meus dados pra próximas compras
        </label>
      )}
      <div className="checkout-form-actions">
        {onCancelar && <button type="button" className="btn" onClick={onCancelar}>Voltar</button>}
        <button type="submit" className="btn btn-solid">{textoBotao || 'Confirmar'}</button>
      </div>
    </form>
  )
}

export default CustomerForm