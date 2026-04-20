import { Routes, Route, Navigate } from 'react-router-dom'
import Beranda from './pages/Beranda'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dev/beranda" element={<Beranda />} />
    </Routes>
  )
}

export default App
