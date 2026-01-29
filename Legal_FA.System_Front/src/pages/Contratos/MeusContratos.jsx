// MeusContratos.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Plus, Eye, Edit2, Trash2, Printer, ArrowLeft, Search, Filter } from 'lucide-react'

function MeusContratos() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [contratos, setContratos] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('todos')

  useEffect(() => {
    // Verificar autenticação
    const userData = localStorage.getItem('user')
    if (!userData) {
      navigate('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // Carregar contratos
    const contratosData = localStorage.getItem('contratos')
    if (contratosData) {
      setContratos(JSON.parse(contratosData))
    } else {
      // Mock de contratos com "dados"
      const mockContratos = [
        {
          id: 1,
          titulo: 'Contrato de Prestação de Serviços - Empresa Alpha',
          status: 'ativo',
          dataCriacao: '2026-01-15',
          dataAtualizacao: '2026-01-20',
          criadoPor: 'João Silva',
          tipo: 'Prestação de Serviços',
          dados: {
            nome_empresa: 'Empresa Alpha',
            cnpj_empresa: '12.345.678/0001-90',
            endereco_empresa: 'Rua A, 123, São Paulo',
            nome_prestador: 'Pedro Souza',
            documento_prestador: '123.456.789-00',
            endereco_prestador: 'Rua B, 456, São Paulo',
            descricao_servico: 'Consultoria em TI',
            data_inicio: '2026-02-01',
            data_fim: '2026-03-01',
            valor_total: '5000',
            multa_atraso: '10',
            forma_pagamento: 'Transferência',
            prazo_pagamento: '30 dias',
            obrigacoes_prestador: 'Entregar relatório semanal',
            obrigacoes_contratante: 'Fornecer informações necessárias',
            clausula_confidencialidade: 'Não divulgar informações',
            condicoes_rescisao: 'Aviso prévio de 30 dias',
            cidade_foro: 'São Paulo',
            cidade_assinatura: 'São Paulo',
            data_assinatura: '2026-01-15'
          }
        },
        {
          id: 2,
          titulo: 'Contrato de Locação Comercial - Beta Corp',
          status: 'pendente',
          dataCriacao: '2026-01-10',
          dataAtualizacao: '2026-01-18',
          criadoPor: 'Maria Santos',
          tipo: 'Locação',
          dados: {
            nome_empresa: 'Beta Corp',
            cnpj_empresa: '98.765.432/0001-12',
            endereco_empresa: 'Av. Central, 200, Rio de Janeiro',
            nome_prestador: 'Ana Lima',
            documento_prestador: '987.654.321-00',
            endereco_prestador: 'Rua C, 789, Rio de Janeiro',
            descricao_servico: 'Locação de espaço comercial',
            data_inicio: '2026-02-05',
            data_fim: '2026-08-05',
            valor_total: '12000',
            multa_atraso: '5',
            forma_pagamento: 'Boleto',
            prazo_pagamento: 'Mensal',
            obrigacoes_prestador: 'Disponibilizar espaço limpo e seguro',
            obrigacoes_contratante: 'Efetuar pagamentos em dia',
            clausula_confidencialidade: 'Não compartilhar dados de clientes',
            condicoes_rescisao: 'Aviso prévio de 60 dias',
            cidade_foro: 'Rio de Janeiro',
            cidade_assinatura: 'Rio de Janeiro',
            data_assinatura: '2026-01-12'
          }
        },
        {
          id: 3,
          titulo: 'Contrato de Consultoria Jurídica - Gamma Ltd',
          status: 'ativo',
          dataCriacao: '2026-01-05',
          dataAtualizacao: '2026-01-22',
          criadoPor: 'Pedro Costa',
          tipo: 'Consultoria',
          dados: {
            nome_empresa: 'Gamma Ltd',
            cnpj_empresa: '11.222.333/0001-44',
            endereco_empresa: 'Rua D, 456, Belo Horizonte',
            nome_prestador: 'Carlos Alberto',
            documento_prestador: '111.222.333-44',
            endereco_prestador: 'Av. E, 321, Belo Horizonte',
            descricao_servico: 'Consultoria jurídica especializada',
            data_inicio: '2026-02-10',
            data_fim: '2026-04-10',
            valor_total: '8000',
            multa_atraso: '15',
            forma_pagamento: 'Pix',
            prazo_pagamento: '15 dias',
            obrigacoes_prestador: 'Fornecer parecer jurídico',
            obrigacoes_contratante: 'Fornecer documentação necessária',
            clausula_confidencialidade: 'Não divulgar informações do cliente',
            condicoes_rescisao: 'Rescisão imediata em caso de descumprimento',
            cidade_foro: 'Belo Horizonte',
            cidade_assinatura: 'Belo Horizonte',
            data_assinatura: '2026-01-05'
          }
        }
      ]
      setContratos(mockContratos)
      localStorage.setItem('contratos', JSON.stringify(mockContratos))
    }
  }, [navigate])

  // Permissões
  const canCreate = user?.role !== 'estagiario'
  const canEdit = user?.role !== 'estagiario'
  const canDelete = user?.role === 'gestor' || user?.role === 'admin' || user?.isRepresentante
  const canView = true
  const canPrint = true

  // Ações
  const handleView = (contratoId) => navigate(`/contratos/${contratoId}`)
  const handleEdit = (contratoId) => navigate(`/contratos/${contratoId}/editar`)
  const handleDelete = (contratoId) => {
    if (window.confirm('Tem certeza que deseja excluir este contrato?')) {
      const updated = contratos.filter(c => c.id !== contratoId)
      setContratos(updated)
      localStorage.setItem('contratos', JSON.stringify(updated))
      alert('Contrato excluído com sucesso!')
    }
  }
  const handlePrint = (contrato) => alert(`Imprimindo contrato: ${contrato.titulo}`)
  const handleCreateNew = () => navigate('/contratos/novo')

  // Filtrar contratos
  const filteredContratos = contratos.filter(c => {
    const matchSearch = c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || c.tipo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = filterStatus === 'todos' || c.status === filterStatus
    return matchSearch && matchStatus
  })

  const getStatusColor = (status) => {
    switch(status) {
      case 'ativo': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'pendente': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'inativo': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
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
                <option value="todos">Todos os Status</option>
                <option value="ativo">Ativos</option>
                <option value="pendente">Pendentes</option>
                <option value="inativo">Inativos</option>
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
            {filteredContratos.map(contrato => (
              <div key={contrato.id} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">{contrato.titulo}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(contrato.status)}`}>
                        {contrato.status.charAt(0).toUpperCase() + contrato.status.slice(1)}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-400 mb-4">
                      <div><span className="block text-gray-500 text-xs mb-1">Tipo</span><span className="text-white">{contrato.tipo}</span></div>
                      <div><span className="block text-gray-500 text-xs mb-1">Criado em</span><span className="text-white">{new Date(contrato.dataCriacao).toLocaleDateString('pt-BR')}</span></div>
                      <div><span className="block text-gray-500 text-xs mb-1">Última atualização</span><span className="text-white">{new Date(contrato.dataAtualizacao).toLocaleDateString('pt-BR')}</span></div>
                    </div>
                    <div className="text-sm text-gray-400">Criado por: <span className="text-white">{contrato.criadoPor}</span></div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {canView && <button onClick={() => handleView(contrato.id)} className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition" title="Visualizar"><Eye size={18} /></button>}
                    {canEdit && <button onClick={() => handleEdit(contrato.id)} className="p-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 rounded-lg transition" title="Editar"><Edit2 size={18} /></button>}
                    {canPrint && <button onClick={() => handlePrint(contrato)} className="p-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition" title="Imprimir"><Printer size={18} /></button>}
                    {canDelete && <button onClick={() => handleDelete(contrato.id)} className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition" title="Excluir"><Trash2 size={18} /></button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Permissões */}
        <div className="mt-6 bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
          <p className="text-xs text-gray-500 text-center">
            Suas permissões: 
            <span className="text-white ml-2">
              {canView && '👁️ Visualizar'}
              {canEdit && ' • ✏️ Editar'}
              {canPrint && ' • 🖨️ Imprimir'}
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
