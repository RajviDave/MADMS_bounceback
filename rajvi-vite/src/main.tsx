import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// import  Button  from "rajvid\rajvi-vite\src\components\ui\button.tsx"


createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <App></App>  
  </StrictMode>,
)
