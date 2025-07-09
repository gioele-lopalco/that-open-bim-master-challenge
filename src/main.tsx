import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App.tsx'
// For testing purposes, we're using the .env file to store the Firebase configuration
// in local development im removing the strict mode to avoid the error
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
