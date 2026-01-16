import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import DocumentsPage from './pages/DocumentsPage'
import ExtractionPage from './pages/ExtractionPage'
import EmbeddingPage from './pages/EmbeddingPage'
import ComparisonPage from './pages/ComparisonPage'
import './App.css'

function App() {
  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/documents" replace />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/extraction" element={<ExtractionPage />} />
          <Route path="/embedding" element={<EmbeddingPage />} />
          <Route path="/comparison" element={<ComparisonPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
