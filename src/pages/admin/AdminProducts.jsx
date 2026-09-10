import { useState } from 'react'
import { useContent } from '../../context/ContentContext'

const categorias = ['colar', 'anel', 'brinco', 'pulseira']

function AdminProductRow({ product }) {
  const { updateProduct, removeProduct } = useContent()
  const [form, setForm] = useState(product)

  function handleChange(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }))
  }

  function handleSave() {
    updateProduct(product.id, form)
  }

  return (
    <div className="admin-product-card">
      <div className="admin-product-row1">
        <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Nome" />
        <input type="number" step="0.01" value={form.price} onChange={(e) => handleChange('price', Number(e.target.value))} placeholder="Preço" />
        <input className="admin-icon-input" value={form.icon} onChange={(e) => handleChange('icon', e.target.value)} placeholder="Ícone" />
      </div>

      <div className="admin-product-row2">
        <select value={form.category} onChange={(e) => handleChange('category', e.target.value)}>
          {categorias.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <input
          className="admin-stock-input"
          type="number"
          value={form.stock}
          onChange={(e) => handleChange('stock', Number(e.target.value))}
          placeholder="Estoque"
          title="Quantidade em estoque"
        />
      </div>

      <textarea
        className="admin-product-desc"
        rows={2}
        value={form.description}
        onChange={(e) => handleChange('description', e.target.value)}
        placeholder="Descrição do produto"
      />

      <div className="admin-product-actions">
        <button type="button" className="btn" onClick={handleSave}>Salvar</button>
        <button type="button" className="admin-remove" onClick={() => removeProduct(product.id)}>Remover</button>
      </div>
    </div>
  )
}

function AdminNewProduct() {
  const { addProduct } = useContent()
  const [form, setForm] = useState({ name: '', price: '', icon: '✦', category: 'colar', stock: '', description: '' })

  function handleChange(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!form.name || !form.price) return
    addProduct({ ...form, price: Number(form.price), stock: Number(form.stock) || 0 })
    setForm({ name: '', price: '', icon: '✦', category: 'colar', stock: '', description: '' })
  }

  return (
    <form className="admin-product-card admin-new-product" onSubmit={handleSubmit}>
      <div className="admin-product-row1">
        <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Nome do novo produto" />
        <input type="number" step="0.01" value={form.price} onChange={(e) => handleChange('price', e.target.value)} placeholder="Preço" />
        <input className="admin-icon-input" value={form.icon} onChange={(e) => handleChange('icon', e.target.value)} placeholder="Ícone" />
      </div>

      <div className="admin-product-row2">
        <select value={form.category} onChange={(e) => handleChange('category', e.target.value)}>
          {categorias.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <input className="admin-stock-input" type="number" value={form.stock} onChange={(e) => handleChange('stock', e.target.value)} placeholder="Estoque" />
      </div>

      <textarea
        className="admin-product-desc"
        rows={2}
        value={form.description}
        onChange={(e) => handleChange('description', e.target.value)}
        placeholder="Descrição do produto"
      />

      <div className="admin-product-actions">
        <button className="btn btn-solid" type="submit">Adicionar</button>
      </div>
    </form>
  )
}

function AdminProducts() {
  const { products } = useContent()

  return (
    <div className="admin-section">
      <h3>Produtos ({products.length})</h3>
      <div className="admin-product-list">
        {products.map((product) => (
          <AdminProductRow key={product.id} product={product} />
        ))}
      </div>
      <h4>Adicionar novo produto</h4>
      <AdminNewProduct />
    </div>
  )
}

export default AdminProducts