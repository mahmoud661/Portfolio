import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Analytics } from "@vercel/analytics/react"

// Initialize theme
const theme = localStorage.getItem('theme') || 
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.classList.toggle('dark', theme === 'dark');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Analytics/>
    <App />
  </StrictMode>,
)