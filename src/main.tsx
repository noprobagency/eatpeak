import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { initFontLab } from './lib/fontlab'
import './styles/globals.css'

// `?font=`, `?italic=0`, `?body=display`: si applicano prima del primo render.
initFontLab()

const container = document.getElementById('root')
if (!container) throw new Error('Manca #root in index.html')

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
