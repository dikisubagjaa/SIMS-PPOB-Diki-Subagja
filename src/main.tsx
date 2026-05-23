import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import './index.css'
import App from './App'
import store from './app/store'
import { ToastProvider } from './contexts/ToastContext'
import ToastContainer from './components/common/ToastContainer'

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <ToastContainer />
      </ToastProvider>
    </Provider>
  </React.StrictMode>,
)
