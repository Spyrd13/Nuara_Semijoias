import productsDefault from '../data/products'
import defaultContent from '../data/defaultContent'

const STORAGE_KEY = 'nuara-admin-content'
const CURRENT_VERSION = 1

export { defaultContent }

// Cada migração leva os dados da versão anterior pra próxima. Hoje
// está vazio porque esta é a primeira versão — no futuro, se a
// estrutura mudar de novo, a migração pra versão 2 entra aqui como
// uma função: 2: (content) => ({ ...content, campoNovo: 'valor' })
const migrations = {}

function migrate(content) {
  let versaoAtual = content.version || 0
  let resultado = content
  while (versaoAtual < CURRENT_VERSION) {
    versaoAtual += 1
    const migrar = migrations[versaoAtual]
    resultado = migrar ? migrar(resultado) : resultado
  }
  return { ...resultado, version: CURRENT_VERSION }
}

function mergeProducts(produtosSalvos) {
  return produtosSalvos.map((salvo) => {
    const original = productsDefault.find((p) => p.id === salvo.id)
    const base = original ? { ...original, ...salvo } : salvo
    return { images: [], ...base }
  })
}

export function loadContent() {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY)
    if (salvo) {
      const parsed = JSON.parse(salvo)
      const mesclado = {
        ...defaultContent,
        ...parsed,
        products: mergeProducts(parsed.products || productsDefault),
        destaque: parsed.destaque || defaultContent.destaque,
      }
      return migrate(mesclado)
    }
  } catch (erro) {
    console.error('Não foi possível ler o conteúdo salvo:', erro)
  }
  return { ...defaultContent, version: CURRENT_VERSION }
}

export function saveContent(content) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content))
    return true
  } catch (erro) {
    console.error(
      'Não foi possível salvar as alterações — provavelmente o espaço do navegador encheu (muitas fotos). Tente remover alguma foto.',
      erro
    )
    return false
  }
}