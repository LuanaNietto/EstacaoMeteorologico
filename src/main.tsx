import { createRoot } from 'react-dom/client'
import './main.css'
import App from './App'

const root = createRoot(document.getElementById('app')!)
root.render(<App />)
