import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useCustomer } from '../context/CustomerContext'
import { useOrders } from '../context/OrdersContext'
import { useSettings } from '../context/SettingsContext'
import CustomerForm from './CustomerForm'

const NUMERO_WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMERO

function montarMensagem(items, totalPrice, introducao) {
  const linhas = items.map((item) => `${item.quantity}x ${item.name}`)
  const total = `Total: R$ ${totalPrice.toFixed(2).replace('.', ',')}`
  return `${introducao}\n${linhas.join('\n')}\n\n${total}`
}

function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, increaseQuantity, decreaseQuantity, totalPrice } = useCart()
  const { customer, isLoggedIn, registerCustomer } = useCustomer()
  const { addOrder } = useOrders()
  const { settings } = useSettings()
  const [mostrarForm, setMostrarForm] = useState(false)

  function concluirPedido(dadosCliente) {
    if (!NUMERO_WHATSAPP) {
      alert('Número de WhatsApp não configurado. Confira o arquivo .env (VITE_WHATSAPP_NUMERO).')
      return
    }
    addOrder({ items, total: totalPrice, customer: dadosCliente })
    const mensagem = montarMensagem(items, totalPrice, settings.mensagemPedidoIntro)
    const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensagem)}`
    window.open(url, '_blank')
    setMostrarForm(false)
  }

  function handleProsseguir() {
    if (isLoggedIn) {
      concluirPedido(customer)
    } else {
      setMostrarForm(true)
    }
  }

  function handleConfirmarForm({ nome, sobrenome, telefone, salvar }) {
    const dados = { nome, sobrenome, telefone }
    if (salvar) registerCustomer(dados)
    concluirPedido(dados)
  }

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={closeCart} />
      <aside className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-drawer-header">
          <h3>Seu carrinho</h3>
          <button className="cart-close" onClick={closeCart}>×</button>
        </div>

        {items.length === 0 ? (
          <p className="cart-empty">Seu carrinho está vazio.</p>
        ) : mostrarForm ? (
          <CustomerForm
            onConfirmar={handleConfirmarForm}
            onCancelar={() => setMostrarForm(false)}
            textoIntroducao="Pra gente confirmar seu pedido, preenche rapidinho:"
            textoBotao="Confirmar e ir pro WhatsApp"
          />
        ) : (
          <>
            <p className="cart-shipping-note">
              O valor abaixo é só das peças — o frete (via Uber Moto)
              é calculado à parte, na hora de combinar a entrega.
            </p>

            <div className="cart-items">
              {items.map((item) => {
                const temFoto = item.images && item.images.length > 0
                return (
                  <div className="cart-item" key={item.id}>
                    <div className="placeholder cart-item-ph">
                      {temFoto ? <img src={item.images[0]} alt={item.name} /> : item.icon}
                    </div>
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <div className="cart-qty-row">
                        <button type="button" className="cart-qty-btn" onClick={() => decreaseQuantity(item.id)} aria-label="Diminuir quantidade">−</button>
                        <span className="cart-qty-value">{item.quantity}</span>
                        <button type="button" className="cart-qty-btn" onClick={() => increaseQuantity(item.id)} aria-label="Aumentar quantidade">+</button>
                        <span className="cart-item-price">R$ {item.price.toFixed(2).replace('.', ',')}</span>
                      </div>
                    </div>
                    <button className="cart-remove" onClick={() => removeFromCart(item.id)}>Remover</button>
                  </div>
                )
              })}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Total estimado</span>
                <strong>R$ {totalPrice.toFixed(2).replace('.', ',')}</strong>
              </div>
              <p className="cart-note">
                {isLoggedIn
                  ? `Vamos te reconhecer como ${customer.nome} — ao prosseguir, já vai direto pro WhatsApp.`
                  : 'Ao prosseguir, você vai pro WhatsApp com a mensagem já pronta pra confirmar o pedido com a gente.'}
              </p>
              <button className="btn btn-solid cart-checkout" onClick={handleProsseguir}>
                Prosseguir para pagamento
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}

export default CartDrawer