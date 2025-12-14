import { useState } from 'react'
import { login } from '../services/api'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const { token } = await login(email, password)
      localStorage.setItem('token', token)
      navigate('/')
    } catch {
      alert('Credenciales inválidas')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button>Entrar</button>
    </form>
  )
}

export default LoginPage
