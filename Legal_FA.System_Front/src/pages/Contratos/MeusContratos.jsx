import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Plus, Eye, Edit2, Trash2, Download, ArrowLeft, Search, Filter } from 'lucide-react' 
function MeusContratos() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [contratos, setContratos] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('todos')
  const [downloadingId, setDownloadingId] = useState(null)
// Função para verificar se o token expirou e redirecionar
  const verificarTokenExpirado = (error) => {
    // Verifica se é erro 403 (Forbidden) ou 401 (Unauthorized)
    if (error.message?.includes('403') || error.message?.includes('401') || 
        error.status === 403 || error.status === 401) {
      
      console.log('🔐 Token expirado ou inválido! Redirecionando para login...')
      
      // Limpar dados do localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Redirecionar para login
      navigate('/login')
      return true
    }
    return false
  }

  useEffect(() => {
    const carregarContratos = async () => {
      const userData = localStorage.getItem('user')
      if (!userData) {
        navigate('/login')
        return
      }

      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      try {
        const token = localStorage.getItem('token')
        const response = await fetch(
          `http://localhost:8080/api/contratos/empresa/${parsedUser.empresaId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )

        if (!response.ok) throw new Error('Erro ao carregar contratos')

        const data = await response.json()
        
        // Transformar para formato da tela
        const contratosFormatados = data.map(c => ({
          id: c.id,
          titulo: c.titulo,
          status: c.status,
          dataCriacao: c.dataCriacao.split('T')[0],
          dataAtualizacao: c.dataAtualizacao?.split('T')[0] || c.dataCriacao.split('T')[0],
          criadoPor: c.criadoPor,
          tipo: c.tipo,
          dados: c.dados
        }))

        setContratos(contratosFormatados)
        
      } catch (error) {
        console.error('Erro:', error)
        setContratos([])
      }
    }

    carregarContratos()
  }, [navigate])

  // Permissões
  const canCreate = user?.role !== 'estagiario'
  const canEdit = user?.role !== 'estagiario'
  const canDelete = user?.role === 'gestor' || user?.role === 'admin' || user?.isRepresentante
  const canView = true
  const canDownload = true

  // ============= FUNÇÕES DE AÇÃO =============
  
  // ✅ Função para criar novo contrato
  const handleCreateNew = () => {
    navigate('/contratos/novo')
  }

  // ✅ Função para visualizar contrato
  const handleView = (contratoId) => {
    navigate(`/contratos/${contratoId}`)
  }

  // ✅ Função para editar contrato
  const handleEdit = (contratoId) => {
    navigate(`/contratos/${contratoId}/editar`)
  }

  // ✅ Função para excluir contrato
  const handleDelete = async (contratoId) => {
    if (!window.confirm('Tem certeza que deseja excluir este contrato?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/contratos/${contratoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Erro ao deletar contrato')

      setContratos(contratos.filter(c => c.id !== contratoId))
      alert('✅ Contrato excluído com sucesso!')
      
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao excluir contrato')
    }
  }

  // ✅ Função para download do PDF
const handleDownload = (contrato) => {
  // Redireciona para a página de PDF passando a origem
  navigate(`/contratos/${contrato.id}/pdf`, { 
    state: { from: '/contratos' } 
  })
}


  // Filtrar contratos
  const filteredContratos = contratos.filter(c => {
    const matchSearch = c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       c.tipo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = filterStatus === 'todos' || c.status === filterStatus
    return matchSearch && matchStatus
  })

  // Função: Retorna cor e emoji para cada status
  const getStatusConfig = (status) => {
    const statusMap = {
      'RASCUNHO': {
        color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        emoji: '📝',
        label: 'Rascunho'
      },
      'EM_REVISAO': {
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        emoji: '🔍',
        label: 'Em Revisão'
      },
      'APROVADO': {
        color: 'bg-green-500/20 text-green-400 border-green-500/30',
        emoji: '✅',
        label: 'Aprovado'
      },
      'ASSINADO': {
        color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        emoji: '✍️',
        label: 'Assinado'
      },
      'CANCELADO': {
        color: 'bg-red-500/20 text-red-400 border-red-500/30',
        emoji: '❌',
        label: 'Cancelado'
      },
      'EXPIRADO': {
        color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        emoji: '⏰',
        label: 'Expirado'
      }
    }
    
    return statusMap[status] || {
      color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      emoji: '📄',
      label: status
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/home')} className="flex items-center gap-2 text-gray-400 hover:text-white transition">
              <ArrowLeft size={20} />
              <span className="text-sm">Voltar</span>
            </button>
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-purple-500" />
              <h1 className="text-xl font-bold text-white">Meus Contratos</h1>
            </div>
          </div>
          {canCreate && (
            <button onClick={handleCreateNew} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition transform active:scale-[0.98]">
              <Plus size={20} /> Criar Novo Contrato
            </button>
          )}
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Busca e filtro */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar contratos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-purple-500 transition"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-purple-500 transition appearance-none"
              >
                <option value="todos">📋 Todos os Status</option>
                <option value="RASCUNHO">📝 Rascunhos</option>
                <option value="EM_REVISAO">🔍 Em Revisão</option>
                <option value="APROVADO">✅ Aprovados</option>
                <option value="ASSINADO">✍️ Assinados</option>
                <option value="CANCELADO">❌ Cancelados</option>
                <option value="EXPIRADO">⏰ Expirados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de contratos */}
        {filteredContratos.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-12 border border-gray-700 text-center">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Nenhum contrato encontrado</h3>
            <p className="text-gray-400 mb-6">{searchTerm ? 'Tente ajustar sua busca' : 'Comece criando seu primeiro contrato'}</p>
            {canCreate && (
              <button onClick={handleCreateNew} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition">
                <Plus size={20} /> Criar Primeiro Contrato
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContratos.map(contrato => {
              const statusConfig = getStatusConfig(contrato.status)
              
              return (
                <div key={contrato.id} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-white">{contrato.titulo}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
                          {statusConfig.emoji} {statusConfig.label}
                        </span>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-400 mb-4">
                        <div>
                          <span className="block text-gray-500 text-xs mb-1">Tipo</span>
                          <span className="text-white">{contrato.tipo}</span>
                        </div>
                        <div>
                          <span className="block text-gray-500 text-xs mb-1">Criado em</span>
                          <span className="text-white">{new Date(contrato.dataCriacao).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div>
                          <span className="block text-gray-500 text-xs mb-1">Última atualização</span>
                          <span className="text-white">{new Date(contrato.dataAtualizacao).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        Criado por: <span className="text-white">{contrato.criadoPor}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {/* Botão Visualizar */}
                      {canView && (
                        <button 
                          onClick={() => handleView(contrato.id)} 
                          className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition" 
                          title="Visualizar"
                        >
                          <Eye size={18} />
                        </button>
                      )}
                      
                      {/* Botão Download */}
                      {canDownload && (
                        <button 
                          onClick={() => handleDownload(contrato)} 
                          disabled={downloadingId === contrato.id}
                          className={`p-2 rounded-lg transition ${
                            downloadingId === contrato.id
                              ? 'bg-gray-600/20 text-gray-400 cursor-wait'
                              : 'bg-green-600/20 hover:bg-green-600/30 text-green-400'
                          }`}
                          title="Baixar PDF"
                        >
                          <Download size={18} />
                        </button>
                      )}
                      
                      {/* Botão Editar */}
                      {canEdit && (
                        <button 
                          onClick={() => handleEdit(contrato.id)} 
                          className="p-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 rounded-lg transition" 
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                      )}
                      
                      {/* Botão Excluir */}
                      {canDelete && (
                        <button 
                          onClick={() => handleDelete(contrato.id)} 
                          className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition" 
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Legenda de status */}
        <div className="mt-6 bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
          <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-4 flex-wrap">
            <span>📝 Rascunho</span>
            <span className="text-gray-600">|</span>
            <span>🔍 Em Revisão</span>
            <span className="text-gray-600">|</span>
            <span>✅ Aprovado</span>
            <span className="text-gray-600">|</span>
            <span>✍️ Assinado</span>
            <span className="text-gray-600">|</span>
            <span>❌ Cancelado</span>
            <span className="text-gray-600">|</span>
            <span>⏰ Expirado</span>
          </p>
        </div>

        {/* Permissões */}
        <div className="mt-6 bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
          <p className="text-xs text-gray-500 text-center">
            Suas permissões: 
            <span className="text-white ml-2">
              {canView && '👁️ Visualizar'}
              {canEdit && ' • ✏️ Editar'}
              {canDownload && ' • 📥 Download'}
              {canDelete && ' • 🗑️ Deletar'}
              {canCreate && ' • ➕ Criar'}
            </span>
          </p>
        </div>
      </main>
    </div>
  )
}

export default MeusContratos