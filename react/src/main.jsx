import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
// import LoginPage from './pages/login.jsx'
// import TaskForm from './test'
// import { BrowserRouter } from 'react-router-dom';


createRoot(document.getElementById('root')).render(
  <StrictMode>
  
    <App />
    {/* <TaskForm/> */}
    
  </StrictMode>,
)
