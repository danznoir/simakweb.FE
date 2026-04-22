import { Routes, Route, Navigate } from 'react-router-dom'
import Beranda from './pages/Beranda'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardLayout from './pages/DashboardLayout'
import DashboardPage from './pages/DashboardPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dev/beranda" element={<Beranda />} />

      {/* Dashboard - nested layout */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        {/* Future pages will go here */}
        <Route path="santri" element={<DashboardPage />} />
        <Route path="divisi" element={<DashboardPage />} />
        <Route path="kelas" element={<DashboardPage />} />
        <Route path="absensi" element={<DashboardPage />} />
        <Route path="tugas" element={<DashboardPage />} />
        <Route path="pelajaran" element={<DashboardPage />} />
        <Route path="settings" element={<DashboardPage />} />
      </Route>
    </Routes>
  )
}

export default App
