import { createContext, useContext, useState, useEffect } from 'react'
import productsDefault from '../data/products'

const STORAGE_KEY = 'nuara-admin-content'

const heroDefault = {
  title: 'Joias que abraçam sua história',
  subtitle:
    'Peças delicadas, banhadas com cuidado e feitas para durar — do primeiro presente à ocasião mais especial. Escolha no site, finalize a compra com toda a segurança do Mercado Livre.',
}

const storyDefault = {
  title: 'Feita para quem gosta de se sentir única',
  paragraph1:
    'A Nüara nasceu do desejo de transformar pequenos gestos em lembranças — uma joia que se ganha, que se dá, que acompanha uma virada de página.',
  paragraph2:
    'Cada peça é selecionada com cuidado, pensando em durar no tempo e no gosto de quem a usa.',
}

const faqDefault = [
  { id: 1, pergunta: 'Como funciona a compra na Nüara?', resposta: 'Você navega e escolhe as peças aqui no site, mas o pagamento, o pedido e a entrega acontecem no Mercado Livre — com toda a segurança e o rastreamento de lá.' },
  { id: 2, pergunta: 'Onde meus dados de pagamento ficam guardados?', resposta: 'Em nenhum lugar do nosso site. Conectamos sua conta ao Mercado Livre por OAuth, um sistema seguro que nunca compartilha sua senha com a gente.' },
  { id: 3, pergunta: 'Posso comprar mais de uma peça de uma vez?', resposta: 'Pode! Adicione quantas peças quiser ao carrinho aqui no site. Na hora de finalizar, você confirma cada peça no Mercado Livre — elas ficam juntas no carrinho de lá, e você paga tudo de uma vez, com um só frete.' },
  { id: 4, pergunta: 'Como acompanho meu pedido?', resposta: 'O rastreamento acontece direto pelo Mercado Livre, no mesmo lugar onde você já acompanha suas outras compras.' },
  { id: 5, pergunta: 'Quais as formas de pagamento aceitas?', resposta: 'Todas as opções disponíveis no Mercado Pago: cartão de crédito, Pix, boleto e saldo em conta.' },
  { id: 6, pergunta: 'Como faço para trocar ou devolver uma peça?', resposta: 'Pelas políticas de troca e devolução do próprio Mercado Livre, já que a compra é processada por lá.' },
]

const destaqueDefault = {
  modo: 'mais_vendidos',
  productIds: [1, 2, 3, 4],
}

const defaultContent = {
  hero: heroDefault,
  story: storyDefault,
  products: productsDefault,
  faq: faqDefault,
  destaque: destaqueDefault,
}

function mergeProducts(produtosSalvos) {
  return produtosSalvos.map((salvo) => {
    const original = productsDefault.find((p) => p.id === salvo.id)
    const base = original ? { ...original, ...salvo } : salvo
    return { images: [], ...base }
  })
}

function loadContent() {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY)
    if (salvo) {
      const parsed = JSON.parse(salvo)
      return {
        ...defaultContent,
        ...parsed,
        products: mergeProducts(parsed.products || productsDefault),
        destaque: parsed.destaque || defaultContent.destaque,
      }
    }
  } catch (erro) {
    console.error('Não foi possível ler o conteúdo salvo:', erro)
  }
  return defaultContent
}

const ContentContext = createContext(null)

export function ContentProvider({ children }) {
  const [content, setContent] = useState(loadContent)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content))
    } catch (erro) {
      console.error(
        'Não foi possível salvar as alterações — provavelmente o espaço do navegador encheu (muitas fotos). Tente remover alguma foto.',
        erro
      )
    }
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