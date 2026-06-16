import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { DetailPage } from './pages/DetailPage.tsx'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/:symbol', element: <DetailPage /> },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
