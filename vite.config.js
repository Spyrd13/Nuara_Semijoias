import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite é a ferramenta que "serve" seu site em modo desenvolvimento
// (com atualização instantânea ao salvar) e depois empacota tudo
// para produção. O plugin react() ensina o Vite a entender arquivos .jsx
export default defineConfig({
  plugins: [react()],
})
