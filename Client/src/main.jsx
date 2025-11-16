import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Success from './pages/Success.jsx'
import Failure from './pages/Failure.jsx'
import Payments from './pages/Payments.jsx'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/success', element: <Success /> },
  { path: '/failure', element: <Failure /> },
  { path: '/payments', element: <Payments /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
