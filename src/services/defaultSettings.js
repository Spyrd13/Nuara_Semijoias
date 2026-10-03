import defaultSettings from '../data/defaultSettings'

const STORAGE_KEY = 'nuara-settings'

export { defaultSettings }

export function loadSettings() {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY)
    if (salvo) return { ...defaultSettings, ...JSON.parse(salvo) }
  } catch (erro) {
    console.error('Não foi possível ler as configurações salvas:', erro)
  }
  return defaultSettings
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    return true
  } catch (erro) {
    console.error('Não foi possível salvar as configurações:', erro)
    return false
  }
}