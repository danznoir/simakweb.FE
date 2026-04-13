import { Routes, Route, Navigate } from 'react-router-dom'
import Beranda from './pages/Beranda'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dev/beranda" replace />} />
      <Route path="/dev/beranda" element={<Beranda />} />
    </Routes>
  )
}

export default App
