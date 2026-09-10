import { useCart } from '../context/CartContext'

function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, totalPrice } = useCart()

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
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="placeholder cart-item-ph">{item.icon}</div>
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p>{item.quantity}x R$ {item.price.toFixed(2).replace('.', ',')}</p>
                  </div>
                  <button className="cart-remove" onClick={() => removeFromCart(item.id)}>
                    Remover
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Total estimado</span>
                <strong>R$ {totalPrice.toFixed(2).replace('.', ',')}</strong>
              </div>
              <p className="cart-note">
                O pagamento e a entrega são feitos com segurança pelo Mercado Livre.
              </p>
              <button className="btn btn-solid cart-checkout">Finalizar compra</button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}

export default CartDrawer