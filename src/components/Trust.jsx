// Dados pequenos e só usados aqui podem viver dentro do próprio
// componente (não precisam de um arquivo em src/data/ separado) —
// isso normalmente é feito quando a lista é "fixa" e não vem de uma API.
const items = [
  { label: 'Compra segura', sub: 'Pagamento e envio via Mercado Livre' },
  { label: 'Rastreamento', sub: 'Acompanhe seu pedido na sua conta' },
  { label: 'Sob medida', sub: 'Peças selecionadas com cuidado' },
]

function Trust() {
  return (
    <section className="trust">
      <div className="wrap">
        {items.map((item) => (
          <div className="trust-item" key={item.label}>
            <div className="label">{item.label}</div>
            <div className="sub">{item.sub}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Trust
