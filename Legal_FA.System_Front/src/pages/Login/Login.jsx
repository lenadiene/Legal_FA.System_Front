import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowLeft } from 'lucide-react'
import { login } from "../../services/api"


function Login() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const token = await login({
        email: username,
        password: password
      })

      localStorage.setItem('token', token)
      navigate('/home')
    } catch (error) {
      alert('Login ou senha inválidos')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative">

      {/* Botão Voltar */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition z-50"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-medium">Voltar</span>
      </button>

      {/* Card */}
      <div className="w-full max-w-md mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-gray-700"
        >

          <h1 className="text-2xl font-bold text-white text-center mb-10">
            Acesse o sistema
          </h1>

          {/* Email */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="email"
                placeholder="E-mail"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-full pl-12 pr-6 py-4 text-base focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition placeholder:text-gray-400"
              />
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Senha */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="password"
                placeholder="Senha"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-full pl-12 pr-6 py-4 text-base focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition placeholder:text-gray-400"
              />
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Lembre-me */}
          <div className="flex items-center mb-8">
            <label className="flex items-center gap-2 cursor-pointer text-gray-300">
              <input
                type="checkbox"
                className="w-[15px] h-[15px] rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm">Lembre de mim</span>
            </label>
          </div>

          {/* Botão */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold py-4 rounded-full text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30 transform active:scale-[0.98]"
          >
            {isLoading ? 'Entrando...' : 'Login'}
          </button>

          {/* Registro */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Não tem uma conta?{' '}
              <button
                type="button"
                onClick={() => navigate('/cadastro')}
                className="text-purple-400 hover:text-purple-300 font-medium transition"
              >
                Registrar
              </button>
            </p>
          </div>

        </form>

        <p className="text-center text-gray-500 text-xs mt-6">
          Legal FA.System © 2026
        </p>
      </div>
    </div>
  )
}

export default Login
