import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './shared/styles/index.css'
import App from './app/App.tsx'
import { AuthProvider } from './app/AuthProvider.tsx'

const root = document.getElementById('root')
if (!root) {
  throw new Error('Root element #root not found')
}

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
    <AuthProvider>
    <App />
    </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
