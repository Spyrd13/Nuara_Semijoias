import { useCustomer } from '../context/CustomerContext'
import { useOrders } from '../context/OrdersContext'
import CustomerForm from '../components/CustomerForm'

function statusLabel(status) {
  if (status === 'aprovado') return 'Aprovado'
  if (status === 'recusado') return 'Recusado'
  return 'Aguardando aprovação'
}

function AccountPage() {
  const { customer, isLoggedIn, registerCustomer, logout } = useCustomer()
  const { orders } = useOrders()

  if (!isLoggedIn) {
    return (
      <section className="account-page wrap">
        <h1>Minha conta</h1>
        <p className="account-intro">
          Entre com seus dados pra ver o histórico dos seus pedidos.
        </p>
        <CustomerForm
          onConfirmar={(dados) => registerCustomer({ nome: dados.nome, sobrenome: dados.sobrenome, telefone: dados.telefone })}
          textoBotao="Entrar"
          mostrarSalvar={false}
        />
      </section>
    )
  }

  const meusPedidos = orders.filter((o) => o.customer?.telefone === customer.telefone)

  return (
    <section className="account-page wrap">
      <div className="account-header">
        <div>
          <h1>Olá, {customer.nome}!</h1>
          <p className="account-intro">Aqui está o histórico dos seus pedidos.</p>
        </div>
        <button type="button" className="admin-reset" onClick={logout}>Sair</button>
      </div>

      {meusPedidos.length === 0 ? (
        <div className="account-placeholder">
          <p>Você ainda não fez nenhum pedido por aqui.</p>
        </div>
      ) : (
        <div className="admin-order-list">
          {meusPedidos.map((order) => (
            <div key={order.id} className="admin-order-card">
              <div className="admin-order-head">
                <span className={`admin-order-status status-${order.status}`}>{statusLabel(order.status)}</span>
                <span className="admin-order-date">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
              <ul className="admin-order-items">
                {order.items.map((item) => (
                  <li key={item.id}>{item.quantity}x {item.name}</li>
                ))}
              </ul>
              <div className="admin-order-footer">
                <span>R$ {order.total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default AccountPage