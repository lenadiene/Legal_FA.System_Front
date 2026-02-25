import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { atualizarUsuario, criarUsuarioNaEmpresa, listarUsuariosDaEmpresa, deletarUsuario, atualizarEmpresa } from '../../services/api'
import { User, Edit2, Save, X, Users, FileText, LogOut, Shield, Plus, Trash2, Upload } from 'lucide-react'
function Home() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [empresa, setEmpresa] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showUsersModal, setShowUsersModal] = useState(false)
  const [usuarios, setUsuarios] = useState([])
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showEditEmpresaModal, setShowEditEmpresaModal] = useState(false)
  const [editEmpresaData, setEditEmpresaData] = useState({
    razaoSocial: '',
  email: '',
  telefone: '',
  endereco: '',
  logoCabecalho: null,
  logoRodape: null,
  logoCabecalhoPreview: null,
  logoRodapePreview: null
  })
  const [isEditingEmpresa, setIsEditingEmpresa] = useState(false)
  
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
  const carregarDados = async () => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    const empresaData = localStorage.getItem('empresa')

    if (!token || !userData) {
      navigate('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    
    setEditedData({
      nome: parsedUser.nome || '',
      login: parsedUser.login || '',
      senha: ''
    })

    if (empresaData) {
      const parsedEmpresa = JSON.parse(empresaData)
      setEmpresa(parsedEmpresa)
    }

    // Carregar usuários da empresa (SE FOR GESTOR)
    if (parsedUser.role === 'gestor') {
      try {
        const usuariosDaEmpresa = await listarUsuariosDaEmpresa(token)
        setUsuarios(usuariosDaEmpresa)
      } catch (error) {
        console.error('Erro ao carregar usuários:', error)
      }
    }
  }

  carregarDados()
}, [navigate])

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditedData(prev => ({ ...prev, [name]: value }))
  }

  // Função para abrir o modal de edição da empresa
const handleEditEmpresa = () => {
  if (empresa) {
    setEditEmpresaData({
      razaoSocial: empresa.razaoSocial || '',
      email: empresa.emailCorporativo || empresa.email || '',
      telefone: empresa.telefone || '',
      endereco: empresa.endereco || '',
      logoCabecalho: null,
      logoRodape: null,
      logoCabecalhoPreview: null,
      logoRodapePreview: null
    })
    setShowEditEmpresaModal(true)
  }
}

  // Função para lidar com mudanças nos campos
  const handleEmpresaChange = (e) => {
    const { name, value } = e.target
    setEditEmpresaData(prev => ({ ...prev, [name]: value }))
  }

  // Função para salvar as alterações da empresa
  // Função para salvar as alterações da empresa
// No handleSaveEmpresa:
const handleSaveEmpresa = async () => {
  setIsEditingEmpresa(true)
  
  try {
    const token = localStorage.getItem('token')
    
    const empresaDataToSend = {
      razaoSocial: editEmpresaData.razaoSocial,
      email: editEmpresaData.email,
      telefone: editEmpresaData.telefone,
      endereco: editEmpresaData.endereco
    }
    
    // Adicionar logos apenas se foram selecionadas
    if (editEmpresaData.logoCabecalho) {
      empresaDataToSend.logoCabecalho = await convertFileToBase64(editEmpresaData.logoCabecalho)
    }
    
    if (editEmpresaData.logoRodape) {
      empresaDataToSend.logoRodape = await convertFileToBase64(editEmpresaData.logoRodape)
    }
    
    const empresaAtualizada = await atualizarEmpresa(empresa.id, empresaDataToSend, token)
    
    console.log('✅ Empresa atualizada:', empresaAtualizada)
    
    // Atualizar o estado local
    setEmpresa(empresaAtualizada)
    
    // Atualizar o localStorage
    localStorage.setItem('empresa', JSON.stringify(empresaAtualizada))
    
    alert('✅ Dados da empresa atualizados com sucesso!')
    setShowEditEmpresaModal(false)
    
  } catch (error) {
    console.error('❌ Erro detalhado:', error)
    alert(`❌ ${error.message}`)
  } finally {
    setIsEditingEmpresa(false)
  }
}

// Função auxiliar para converter arquivo para base64
const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1] // Remove o prefixo "data:image/..."
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const handleSaveEdit = async () => {
  try {
    const token = localStorage.getItem('token')
    
    const userDataToSend = {
      nome: editedData.nome,
      login: editedData.login,
      ...(editedData.senha && { senha: editedData.senha })
    }
    
    const usuarioAtualizado = await atualizarUsuario(userDataToSend, token)
    
    // Atualizar estado local
    const updatedUser = {
      ...user,
      nome: usuarioAtualizado.nome,
      login: usuarioAtualizado.login
    }
    
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    
    alert('✅ Dados atualizados com sucesso!')
    setIsEditing(false)
    
  } catch (error) {
    console.error('Erro:', error)
    alert(`❌ ${error.message}`)
  }
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
    localStorage.removeItem('token')
    localStorage.removeItem('empresa')
    localStorage.removeItem('usuarios')
    navigate('/login')
  }

 const handleAddUser = async (e) => {
  e.preventDefault()
  
  try {
    const token = localStorage.getItem('token')
    
    const novoUsuarioData = {
      nome: novoUsuario.nome,
      login: novoUsuario.login,
      senha: novoUsuario.senha,
      perfil: novoUsuario.perfil.toUpperCase(), // ADMIN, GESTOR, etc
      empresaId: user.empresaId
    }
    
    await criarUsuarioNaEmpresa(novoUsuarioData, token)
    
    // Recarregar lista
    const usuariosAtualizados = await listarUsuariosDaEmpresa(token)
    setUsuarios(usuariosAtualizados)
    
    alert('✅ Usuário criado com sucesso!')
    setNovoUsuario({ nome: '', login: '', senha: '', perfil: 'ESTAGIARIO' })
    setShowAddUserModal(false)
    
  } catch (error) {
    console.error('Erro:', error)
    alert(`❌ ${error.message}`)
  }
}

const handleDeleteUser = async (usuarioId) => {
  if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return

  try {
    const token = localStorage.getItem('token')
    await deletarUsuario(usuarioId, token)
    
    // Recarregar lista
    const usuariosAtualizados = await listarUsuariosDaEmpresa(token)
    setUsuarios(usuariosAtualizados)
    
    alert('✅ Usuário excluído com sucesso!')
  } catch (error) {
    console.error('Erro:', error)
    alert(`❌ ${error.message}`)
  }
}

  // Verificar permissões
  const canManageUsers = user?.role === 'admin' || user?.role === 'gestor' || user?.isRepresentante
  const canViewAllData = user?.role === 'admin' || user?.role === 'gestor'
  const canEditEmpresa = user?.role === 'gestor'
  
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
                  {user.isRepresentante && ' ⭐ Representante'}
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Informações da Empresa</h3>
              
              {/* Botão Editar Empresa - APENAS PARA GESTORES */}
              {canEditEmpresa && (
                <button
                  onClick={handleEditEmpresa}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition"
                >
                  <Edit2 size={18} />
                  <span className="text-sm">Editar Empresa</span>
                </button>
              )}
            </div>
            
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
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <p className="text-white font-medium">{empresa.emailCorporativo || empresa.email}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Telefone</label>
                <p className="text-white font-medium">{empresa.telefone}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Endereço</label>
                <p className="text-white font-medium">{empresa.endereco}</p>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Editar Empresa */}
        {/* Modal de Editar Empresa */}
{showEditEmpresaModal && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Editar Dados da Empresa</h2>
        <button
          onClick={() => setShowEditEmpresaModal(false)}
          className="text-gray-400 hover:text-white transition"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSaveEmpresa(); }} className="space-y-4">
        
        {/* Grid 2 colunas para campos de texto */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Razão Social</label>
            <input
              type="text"
              name="razaoSocial"
              required
              value={editEmpresaData.razaoSocial}
              onChange={handleEmpresaChange}
              className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Email Corporativo</label>
            <input
              type="email"
              name="email"
              required
              value={editEmpresaData.email}
              onChange={handleEmpresaChange}
              className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Telefone</label>
            <input
              type="text"
              name="telefone"
              value={editEmpresaData.telefone}
              onChange={handleEmpresaChange}
              className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
              placeholder="(11) 99999-9999"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Endereço</label>
            <input
              type="text"
              name="endereco"
              value={editEmpresaData.endereco}
              onChange={handleEmpresaChange}
              className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
              placeholder="Rua Exemplo, 123 - Centro"
            />
          </div>
        </div>

        {/* SEÇÃO DE LOGOS - Mesmo estilo da tela de cadastro */}
        <div className="border-t border-gray-700 my-6 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Logos da Empresa</h3>
          <p className="text-sm text-gray-400 mb-4">Se não quiser alterar, deixe os campos em branco</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Logo Cabeçalho */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Logo do Cabeçalho</label>
              <div className="border-2 border-dashed border-gray-600 rounded-xl p-4 hover:border-purple-500 transition cursor-pointer bg-gray-700/30">
                <input
                  type="file"
                  id="editLogoCabecalho"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      setEditEmpresaData(prev => ({ ...prev, logoCabecalho: file }))
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setEditEmpresaData(prev => ({ ...prev, logoCabecalhoPreview: reader.result }))
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                  className="hidden"
                />
                <label htmlFor="editLogoCabecalho" className="cursor-pointer flex flex-col items-center">
                  {editEmpresaData.logoCabecalhoPreview ? (
                    <img src={editEmpresaData.logoCabecalhoPreview} alt="Logo Cabeçalho" className="h-20 object-contain mb-2" />
                  ) : empresa?.logoCabecalho ? (
                    <div className="text-center">
                      <img src={empresa.logoCabecalho} alt="Logo atual" className="h-20 object-contain mb-2 opacity-50" />
                      <p className="text-xs text-gray-400">Logo atual (clique para substituir)</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-400 text-center">Clique para fazer upload</p>
                      <p className="text-xs text-gray-500 mt-1">Deixe em branco para manter a atual</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Logo Rodapé */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Logo do Rodapé</label>
              <div className="border-2 border-dashed border-gray-600 rounded-xl p-4 hover:border-purple-500 transition cursor-pointer bg-gray-700/30">
                <input
                  type="file"
                  id="editLogoRodape"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      setEditEmpresaData(prev => ({ ...prev, logoRodape: file }))
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setEditEmpresaData(prev => ({ ...prev, logoRodapePreview: reader.result }))
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                  className="hidden"
                />
                <label htmlFor="editLogoRodape" className="cursor-pointer flex flex-col items-center">
                  {editEmpresaData.logoRodapePreview ? (
                    <img src={editEmpresaData.logoRodapePreview} alt="Logo Rodapé" className="h-20 object-contain mb-2" />
                  ) : empresa?.logoRodape ? (
                    <div className="text-center">
                      <img src={empresa.logoRodape} alt="Logo atual" className="h-20 object-contain mb-2 opacity-50" />
                      <p className="text-xs text-gray-400">Logo atual (clique para substituir)</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-400 text-center">Clique para fazer upload</p>
                      <p className="text-xs text-gray-500 mt-1">Deixe em branco para manter a atual</p>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={() => setShowEditEmpresaModal(false)}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-6 py-3 font-semibold transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isEditingEmpresa}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-6 py-3 font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save size={18} />
            {isEditingEmpresa ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
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