import { createContext, useContext, useState, useEffect } from 'react'
import { loadContent, saveContent, defaultContent } from '../services/contentStorage'

const ContentContext = createContext(null)

export function ContentProvider({ children }) {
  const [content, setContent] = useState(loadContent)

   useEffect(() => {
    saveContent(content)
  }, [content])

  function updateHero(novoHero) {
    setContent((atual) => ({ ...atual, hero: novoHero }))
  }

  function updateStory(novaStory) {
    setContent((atual) => ({ ...atual, story: novaStory }))
  }

  function updateDestaque(novoDestaque) {
    setContent((atual) => ({ ...atual, destaque: novoDestaque }))
  }

  function addProduct(produto) {
    setContent((atual) => {
      const novoId = atual.products.length
        ? Math.max(...atual.products.map((p) => p.id)) + 1
        : 1
      return { ...atual, products: [...atual.products, { ...produto, id: novoId }] }
    })
  }

  function updateProduct(id, camposAtualizados) {
    setContent((atual) => ({
      ...atual,
      products: atual.products.map((p) => (p.id === id ? { ...p, ...camposAtualizados } : p)),
    }))
  }

  function removeProduct(id) {
    setContent((atual) => ({
      ...atual,
      products: atual.products.filter((p) => p.id !== id),
      destaque: {
        ...atual.destaque,
        productIds: atual.destaque.productIds.filter((pid) => pid !== id),
      },
    }))
  }

  function addFaqItem(item) {
    setContent((atual) => {
      const novoId = atual.faq.length ? Math.max(...atual.faq.map((f) => f.id)) + 1 : 1
      return { ...atual, faq: [...atual.faq, { ...item, id: novoId }] }
    })
  }

  function updateFaqItem(id, camposAtualizados) {
    setContent((atual) => ({
      ...atual,
      faq: atual.faq.map((f) => (f.id === id ? { ...f, ...camposAtualizados } : f)),
    }))
  }

  function removeFaqItem(id) {
    setContent((atual) => ({
      ...atual,
      faq: atual.faq.filter((f) => f.id !== id),
    }))
  }

  function resetToDefault() {
    setContent(defaultContent)
  }

  const value = {
    ...content,
    updateHero,
    updateStory,
    updateDestaque,
    addProduct,
    updateProduct,
    removeProduct,
    addFaqItem,
    updateFaqItem,
    removeFaqItem,
    resetToDefault,
  }

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useContent() {
  const context = useContext(ContentContext)
  if (!context) {
    throw new Error('useContent precisa ser usado dentro de um <ContentProvider>')
  }
  return context
}