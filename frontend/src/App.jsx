import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
// import Dashboard from './pages/Dashboard'; // Daha sonra oluşturacağız

function App() {
  return (
    <Router>
      <Routes>
        {/* Ana sayfaya gidince otomatik login'e yönlendir */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Login Sayfası */}
        <Route path="/login" element={<LoginPage />} />

        {/* Henüz Dashboard yapmadığımız için burayı bekletiyoruz */}
        <Route path="/dashboard" element={<div>Dashboard Sayfası Çok Yakında!</div>} />
      </Routes>
    </Router>
  );
}

export default App;