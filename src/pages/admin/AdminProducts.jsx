import { useState } from 'react'
import { useContent } from '../../context/ContentContext'
import { resizeImage } from '../../utils/resizeImage'

const categorias = ['colar', 'anel', 'brinco', 'pulseira']
const MAX_FOTOS = 5

function FotosField({ images, onChange }) {
  async function handleUpload(event) {
    const arquivos = Array.from(event.target.files)
    const novasImagens = await Promise.all(arquivos.map((file) => resizeImage(file)))
    onChange([...images, ...novasImagens].slice(0, MAX_FOTOS))
    event.target.value = ''
  }

  function tornarPrincipal(index) {
    const copia = [...images]
    const [escolhida] = copia.splice(index, 1)
    onChange([escolhida, ...copia])
  }

  function remover(index) {
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="admin-photo-section">
      <label className="admin-photo-label">
        Fotos (a primeira da lista é a principal — aparece na coleção)
      </label>
      <input
        className="admin-photo-input"
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        disabled={images.length >= MAX_FOTOS}
      />
      <div className="admin-photo-list">
        {images.map((src, index) => (
          <div key={index} className={`admin-photo-thumb ${index === 0 ? 'principal' : ''}`}>
            <img src={src} alt={`Foto ${index + 1}`} />
            {index === 0 && <div className="admin-photo-badge">Principal</div>}
            <div className="admin-photo-actions">
              {index !== 0 && (
                <button type="button" className="admin-photo-make-main" onClick={() => tornarPrincipal(index)}>
                  Tornar principal
                </button>
              )}
              <button type="button" className="admin-photo-remove" onClick={() => remover(index)}>
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AdminProductRow({ product }) {
  const { updateProduct, removeProduct } = useContent()
  const [form, setForm] = useState({ ...product, images: product.images || [] })

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
        <input
          type="number"
          step="0.01"
          value={form.price}
          onChange={(e) => handleChange('price', Number(e.target.value))}
          placeholder="Preço"
        />
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

      <FotosField images={form.images} onChange={(images) => handleChange('images', images)} />

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
  const [form, setForm] = useState({
    name: '', price: '', category: 'colar', stock: '', description: '', images: [],
  })

  function handleChange(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!form.name || !form.price) return
    addProduct({ ...form, price: Number(form.price), stock: Number(form.stock) || 0 })
    setForm({ name: '', price: '', category: 'colar', stock: '', description: '', images: [] })
  }

  return (
    <form className="admin-product-card admin-new-product" onSubmit={handleSubmit}>
      <div className="admin-product-row1">
        <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Nome do novo produto" />
        <input type="number" step="0.01" value={form.price} onChange={(e) => handleChange('price', e.target.value)} placeholder="Preço" />
      </div>

      <div className="admin-product-row2">
        <select value={form.category} onChange={(e) => handleChange('category', e.target.value)}>
          {categorias.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <input className="admin-stock-input" type="number" value={form.stock} onChange={(e) => handleChange('stock', e.target.value)} placeholder="Estoque" />
      </div>

      <FotosField images={form.images} onChange={(images) => handleChange('images', images)} />

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
      <p className="admin-hint">
        As fotos ficam guardadas no seu navegador por enquanto (sem
        backend ainda) — evite muitas fotos grandes por produto pra
        não estourar o espaço disponível.
      </p>

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