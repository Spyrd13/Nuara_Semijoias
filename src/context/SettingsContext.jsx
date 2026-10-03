import { createContext, useContext, useState, useEffect } from 'react'
import { loadSettings, saveSettings } from '../services/settingsStorage'

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings)

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  function updateSettings(novasConfig) {
    setSettings((atual) => ({ ...atual, ...novasConfig }))
  }

  const value = { settings, updateSettings }

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) throw new Error('useSettings precisa ser usado dentro de um <SettingsProvider>')
  return context
}