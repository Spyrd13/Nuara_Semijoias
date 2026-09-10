import { useState } from 'react'

function Newsletter() {
  // useState é o "Hook" mais usado do React. Ele cria uma variável
  // que o React observa: sempre que ela muda (com setEmail), o
  // componente é redesenhado automaticamente com o novo valor.
  //
  // const [valorAtual, funcaoParaMudar] = useState(valorInicial)
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)

  // Esta função roda quando o formulário é enviado (botão clicado
  // ou Enter pressionado dentro do input).
  function handleSubmit(event) {
    event.preventDefault() // impede o navegador de recarregar a página
    console.log('E-mail cadastrado:', email)
    // Aqui, no futuro, você vai chamar sua API do backend, ex:
    // fetch('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) })
    setEnviado(true)
    setEmail('')
  }

  return (
    <section className="newsletter">
      <h2>Receba novidades da coleção</h2>
      <p>Lançamentos e peças em edição limitada, direto no seu e-mail.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Seu melhor e-mail"
          required
          // "value" preso ao estado + "onChange" atualizando o estado
          // é o que se chama de "componente controlado": o React é
          // sempre a fonte da verdade do que está escrito no campo.
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <button className="btn btn-solid" type="submit">Assinar</button>
      </form>

      {/* Renderização condicional: só mostra esta linha SE enviado for true */}
      {enviado && <p className="confirm-msg">Cadastro recebido, obrigada! 💌</p>}
    </section>
  )
}

export default Newsletter
