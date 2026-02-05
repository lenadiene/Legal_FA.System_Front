import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Edit2, Save, X, Users, FileText, LogOut, Shield, Plus, Trash2 } from 'lucide-react'

function Home() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [empresa, setEmpresa] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showUsersModal, setShowUsersModal] = useState(false)
  const [usuarios, setUsuarios] = useState([])
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  
  const [editedData, setEditedData] = useState({
    nome: '',
    login: '',
    senha: ''
  })

  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    login: '',
    senha: '',
    perfil: 'estagiario'
  })

  useEffect(() => {
    // Carregar dados do localStorage
    const token = localStorage.getItem('token')
    const empresaData = localStorage.getItem('empresa')
    const usuariosData = localStorage.getItem('usuarios')

    if (!token) {
  navigate('/login')
  return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setEditedData({
      nome: parsedUser.nome || '',
      login: parsedUser.login || parsedUser.email || '',
      senha: ''
    })

    if (empresaData) {
      setEmpresa(JSON.parse(empresaData))
    }

    if (usuariosData) {
      setUsuarios(JSON.parse(usuariosData))
    }
  }, [navigate])

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditedData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveEdit = () => {
    const updatedUser = {
      ...user,
      nome: editedData.nome,
      login: editedData.login
    }
    
    localStorage.setItem('user', JSON.stringify(updatedUser))
    setUser(updatedUser)
    setIsEditing(false)
    alert('Dados atualizados com sucesso!')
  }

  const handleCancelEdit = () => {
    setEditedData({
      nome: user.nome,
      login: user.login || user.email,
      senha: ''
    })
    setIsEditing(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleAddUser = (e) => {
    e.preventDefault()
    
    const newUser = {
      id: Date.now(),
      ...novoUsuario,
      empresaId: empresa?.cnpj || 'default'
    }

    const updatedUsuarios = [...usuarios, newUser]
    setUsuarios(updatedUsuarios)
    localStorage.setItem('usuarios', JSON.stringify(updatedUsuarios))
    
    setNovoUsuario({
      nome: '',
      login: '',
      senha: '',
      perfil: 'estagiario'
    })
    setShowAddUserModal(false)
    alert('Usuário adicionado com sucesso!')
  }

  const handleDeleteUser = (userId) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      const updatedUsuarios = usuarios.filter(u => u.id !== userId)
      setUsuarios(updatedUsuarios)
      localStorage.setItem('usuarios', JSON.stringify(updatedUsuarios))
      alert('Usuário excluído com sucesso!')
    }
  }

  // Verificar permissões
  const canManageUsers = user?.role === 'admin' || user?.role === 'gestor' || user?.isRepresentante
  const canViewAllData = user?.role === 'admin' || user?.role === 'gestor'

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-500" />
            <h1 className="text-xl font-bold text-white">Legal FA.System</h1>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition"
          >
            <LogOut size={20} />
            <span className="text-sm">Sair</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Card de Boas-vindas */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-500 rounded-2xl p-8 mb-8 shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-2">
            Bem-vindo, {user.nome}! 👋
          </h2>
          <p className="text-purple-100">
            {user.role === 'admin' && 'Administrador do Sistema'}
            {user.role === 'gestor' && 'Gestor da Empresa'}
            {user.isRepresentante && 'Representante da Empresa'}
            {user.role === 'analista' && 'Analista'}
            {user.role === 'estagiario' && 'Estagiário'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Card de Dados do Usuário */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-purple-500" />
                Meus Dados
              </h3>
              
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition"
                >
                  <Edit2 size={18} />
                  <span className="text-sm">Editar</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition"
                  >
                    <Save size={16} />
                    Salvar
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition"
                  >
                    <X size={16} />
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nome</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="nome"
                    value={editedData.nome}
                    onChange={handleEditChange}
                    className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                  />
                ) : (
                  <p className="text-white font-medium">{user.nome}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Login / Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="login"
                    value={editedData.login}
                    onChange={handleEditChange}
                    className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                  />
                ) : (
                  <p className="text-white font-medium">{user.login || user.email}</p>
                )}
              </div>

              {isEditing && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Nova Senha (opcional)</label>
                  <input
                    type="password"
                    name="senha"
                    value={editedData.senha}
                    onChange={handleEditChange}
                    placeholder="Deixe em branco para manter a atual"
                    className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-400 mb-1">Perfil de Acesso</label>
                <p className="text-white font-medium capitalize">
                  {user.role === 'admin' && '🔐 Administrador'}
                  {user.role === 'gestor' && '👔 Gestor'}
                  {user.isRepresentante && '⭐ Representante'}
                  {user.role === 'analista' && '📊 Analista'}
                  {user.role === 'estagiario' && '📚 Estagiário'}
                </p>
              </div>
            </div>
          </div>

          {/* Card de Ações */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6">Ações Rápidas</h3>
            
            <div className="space-y-3">
              
              {/* Botão Meus Contratos - TODOS TÊM ACESSO */}
              <button
                onClick={() => navigate('/contratos')}
                className="w-full flex items-center gap-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-6 py-4 transition transform active:scale-[0.98]"
              >
                <FileText className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-semibold">Meus Contratos</p>
                  <p className="text-xs text-purple-100">Ver e gerenciar contratos</p>
                </div>
              </button>

              {/* Botão Meus Usuários - Apenas Admin, Gestor e Representante */}
              {canManageUsers && (
                <button
                  onClick={() => setShowUsersModal(true)}
                  className="w-full flex items-center gap-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl px-6 py-4 transition transform active:scale-[0.98]"
                >
                  <Users className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-semibold">Meus Usuários</p>
                    <p className="text-xs text-gray-300">Gerenciar equipe</p>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Informações da Empresa - Apenas Admin e Gestor */}
        {canViewAllData && empresa && (
          <div className="mt-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Informações da Empresa</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Razão Social</label>
                <p className="text-white font-medium">{empresa.razaoSocial}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">CNPJ</label>
                <p className="text-white font-medium">{empresa.cnpj}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Telefone</label>
                <p className="text-white font-medium">{empresa.telefone}</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal de Usuários */}
      {showUsersModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto border border-gray-700">
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Gerenciar Usuários</h2>
              <button
                onClick={() => setShowUsersModal(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Botão Adicionar Usuário */}
            <button
              onClick={() => setShowAddUserModal(true)}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-6 py-3 transition mb-6"
            >
              <Plus size={20} />
              Adicionar Novo Usuário
            </button>

            {/* Lista de Usuários */}
            <div className="space-y-3">
              {usuarios.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Nenhum usuário cadastrado ainda.</p>
              ) : (
                usuarios.map(usuario => (
                  <div key={usuario.id} className="bg-gray-700/50 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">{usuario.nome}</p>
                      <p className="text-gray-400 text-sm">{usuario.login}</p>
                      <span className="text-xs text-purple-400 capitalize">{usuario.perfil}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteUser(usuario.id)}
                      className="text-red-400 hover:text-red-300 transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Adicionar Usuário */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700">
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Novo Usuário</h2>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={novoUsuario.nome}
                  onChange={(e) => setNovoUsuario(prev => ({ ...prev, nome: e.target.value }))}
                  className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                  placeholder="João Silva"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Login / Email</label>
                <input
                  type="email"
                  required
                  value={novoUsuario.login}
                  onChange={(e) => setNovoUsuario(prev => ({ ...prev, login: e.target.value }))}
                  className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                  placeholder="joao@empresa.com"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Senha</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={novoUsuario.senha}
                  onChange={(e) => setNovoUsuario(prev => ({ ...prev, senha: e.target.value }))}
                  className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Perfil de Acesso</label>
                <select
                  value={novoUsuario.perfil}
                  onChange={(e) => setNovoUsuario(prev => ({ ...prev, perfil: e.target.value }))}
                  className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                >
                  <option value="gestor">Gestor</option>
                  <option value="analista">Analista</option>
                  <option value="estagiario">Estagiário</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-6 py-3 font-semibold transition"
              >
                Adicionar Usuário
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home