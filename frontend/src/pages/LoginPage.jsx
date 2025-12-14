import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState(null);
  const toastTimer = useRef(null);
  const navigate = useNavigate();

  const notify = (type, message) => {
    setBanner({ type, message });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setBanner(null);
      toastTimer.current = null;
    }, 3200);
  };

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { token } = await login(email, password);
      if (onLogin) onLogin(token);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Credenciales invalidas');
      notify('error', err.message || 'Credenciales invalidas');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      {banner && (
        <div className="toast-container">
          <div className={`toast ${banner.type === 'error' ? 'toast-error' : 'toast-success'}`}>
            {banner.message}
          </div>
        </div>
      )}
      <div className="auth-layout">
        <div className="card hero-card auth-banner">
          <p className="eyebrow">IT Ops</p>
          <h1 className="page-title">Control diario sin friccion</h1>
          <p className="muted">
            Accede al tablero de incidentes, prioriza y coordina con un vistazo.
          </p>
          <div className="row-meta">
            <span className="chip">SLA visibles</span>
            <span className="chip">Historial auditable</span>
            <span className="chip">Diseno compacto</span>
          </div>
        </div>

        <div className="card">
          <h2 style={{ margin: '0 0 12px' }}>Inicia sesion</h2>
          <p className="muted" style={{ margin: '0 0 12px' }}>
            Usa tus credenciales internas para seguir los incidentes en curso.
          </p>

          {error && <div className="alert">{error}</div>}

          <form className="form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@test.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password">Contrasena</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
              />
            </div>

            <button className="btn btn-primary" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            <p className="helper">Acceso protegido con JWT</p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
