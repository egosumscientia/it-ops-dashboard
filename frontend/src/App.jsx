import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import useAuth from './hooks/useAuth';

function App() {
  const { token, setToken, logout } = useAuth();

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={setToken} />} />
        <Route
          path="/"
          element={token ? <DashboardPage logout={logout} /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default App;
