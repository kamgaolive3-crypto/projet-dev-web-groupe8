import "@fontsource-variable/inter";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// theme memorise (BasculeTheme) : applique AVANT le premier rendu
if (localStorage.getItem("miam_theme") === "dark") {
  document.documentElement.classList.add("dark")
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)