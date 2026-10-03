import { useOrders } from '../../context/OrdersContext'

function formatarData(iso) {
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

function OrderCard({ order, onAprovar, onRecusar }) {
  return (
    <div className={`admin-order-card status-${order.status}`}>
      <div className="admin-order-head">
        <div>
          <strong>{order.customer?.nome} {order.customer?.sobrenome}</strong>
          <span className="admin-order-phone"> · {order.customer?.telefone}</span>
        </div>
        <span className={`admin-order-status status-${order.status}`}>{order.status}</span>
      </div>

      <ul className="admin-order-items">
        {order.items.map((item) => (
          <li key={item.id}>{item.quantity}x {item.name}</li>
        ))}
      </ul>

      <div className="admin-order-footer">
        <span>R$ {order.total.toFixed(2).replace('.', ',')}</span>
        <span className="admin-order-date">{formatarData(order.createdAt)}</span>
      </div>

      {order.status === 'pendente' && (
        <div className="admin-order-actions">
          <button type="button" className="btn btn-solid" onClick={() => onAprovar(order.id)}>Aprovar</button>
          <button type="button" className="admin-remove" onClick={() => onRecusar(order.id)}>Recusar</button>
        </div>
      )}
    </div>
  )
}

function AdminOrders() {
  const { orders, updateOrderStatus } = useOrders()

  function aprovar(id) { updateOrderStatus(id, 'aprovado') }
  function recusar(id) { updateOrderStatus(id, 'recusado') }

  const pendentes = orders.filter((o) => o.status === 'pendente')
  const resolvidos = orders.filter((o) => o.status !== 'pendente')

  return (
    <div className="admin-section">
      <h3>Pedidos pendentes ({pendentes.length})</h3>
      <p className="admin-hint">
        Toda vez que alguém finaliza o carrinho, o pedido cai aqui como
        "pendente" — marque como aprovado só depois de confirmar que a
        mensagem chegou de verdade no WhatsApp. Funciona só pra pedidos
        feitos neste mesmo navegador até o backend existir.
      </p>

      {pendentes.length === 0 ? (
        <p className="admin-empty">Nenhum pedido pendente no momento.</p>
      ) : (
        <div className="admin-order-list">
          {pendentes.map((order) => (
            <OrderCard key={order.id} order={order} onAprovar={aprovar} onRecusar={recusar} />
          ))}
        </div>
      )}

      {resolvidos.length > 0 && (
        <>
          <h4>Histórico</h4>
          <div className="admin-order-list">
            {resolvidos.map((order) => (
              <OrderCard key={order.id} order={order} onAprovar={aprovar} onRecusar={recusar} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default AdminOrders