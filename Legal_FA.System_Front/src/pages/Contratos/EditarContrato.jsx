import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, Eye } from 'lucide-react'

function EditarContrato() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [contratoData, setContratoData] = useState(null)

  useEffect(() => {
    // Verificar autenticação
    const userData = localStorage.getItem('user')
    if (!userData) {
      navigate('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    
    // Verificar se é estagiário (não pode editar)
    if (parsedUser.role === 'estagiario') {
      alert('Você não tem permissão para editar contratos.')
      navigate('/contratos')
      return
    }

    setUser(parsedUser)

    // Carregar contrato
    const contratos = JSON.parse(localStorage.getItem('contratos') || '[]')
    const contrato = contratos.find(c => c.id === parseInt(id))
    
    if (contrato) {
      setContratoData(contrato.dados)
    } else {
      alert('Contrato não encontrado!')
      navigate('/contratos')
    }
  }, [id, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setContratoData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Atualizar contrato
    const contratos = JSON.parse(localStorage.getItem('contratos') || '[]')
    const index = contratos.findIndex(c => c.id === parseInt(id))
    
    if (index !== -1) {
      contratos[index] = {
        ...contratos[index],
        dataAtualizacao: new Date().toISOString().split('T')[0],
        dados: contratoData
      }
      localStorage.setItem('contratos', JSON.stringify(contratos))
    }

    setTimeout(() => {
      setIsLoading(false)
      alert('Contrato atualizado com sucesso!')
      navigate('/contratos')
    }, 1000)
  }

  if (!contratoData || !user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/contratos')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Voltar</span>
          </button>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
            >
              <Eye size={18} />
              {showPreview ? 'Editar' : 'Pré-visualizar'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        
        {!showPreview ? (
          // FORMULÁRIO DE EDIÇÃO
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Título */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                ✏️ Editar Contrato
              </h1>
              <p className="text-gray-400">Modifique os campos necessários</p>
            </div>

            {/* Seção 1: Contratante */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                🏢 1. Quem está contratando
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Nome da Empresa</label>
                  <input
                    type="text"
                    name="nome_empresa"
                    required
                    value={contratoData.nome_empresa}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">CNPJ</label>
                  <input
                    type="text"
                    name="cnpj_empresa"
                    required
                    value={contratoData.cnpj_empresa}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-300 mb-2">Endereço</label>
                  <input
                    type="text"
                    name="endereco_empresa"
                    required
                    value={contratoData.endereco_empresa}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Seção 2: Prestador */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                👤 2. Quem vai prestar o serviço
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Nome / Razão Social *</label>
                  <input
                    type="text"
                    name="nome_prestador"
                    required
                    value={contratoData.nome_prestador}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">CPF/CNPJ *</label>
                  <input
                    type="text"
                    name="documento_prestador"
                    required
                    value={contratoData.documento_prestador}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-300 mb-2">Endereço *</label>
                  <input
                    type="text"
                    name="endereco_prestador"
                    required
                    value={contratoData.endereco_prestador}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Seção 3: Serviço */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                🛠️ 3. Qual é o serviço?
              </h2>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Descrição do Serviço *</label>
                <textarea
                  name="descricao_servico"
                  required
                  value={contratoData.descricao_servico}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>
            </div>

            {/* Seção 4: Prazo */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                ⏰ 4. Prazo
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Data de Início *</label>
                  <input
                    type="date"
                    name="data_inicio"
                    required
                    value={contratoData.data_inicio}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Data de Término *</label>
                  <input
                    type="date"
                    name="data_fim"
                    required
                    value={contratoData.data_fim}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Seção 5: Valor e Pagamento */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                💰 5. Valor e Pagamento
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Valor Total (R$) *</label>
                  <input
                    type="text"
                    name="valor_total"
                    required
                    value={contratoData.valor_total}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Multa por Atraso (%) *</label>
                  <input
                    type="text"
                    name="multa_atraso"
                    required
                    value={contratoData.multa_atraso}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Forma de Pagamento *</label>
                  <input
                    type="text"
                    name="forma_pagamento"
                    required
                    value={contratoData.forma_pagamento}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Prazo para Pagamento *</label>
                  <input
                    type="text"
                    name="prazo_pagamento"
                    required
                    value={contratoData.prazo_pagamento}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Seção 6: Obrigações */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                📋 6. Obrigações de cada parte
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Obrigações do Prestador *</label>
                  <textarea
                    name="obrigacoes_prestador"
                    required
                    value={contratoData.obrigacoes_prestador}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Obrigações do Contratante *</label>
                  <textarea
                    name="obrigacoes_contratante"
                    required
                    value={contratoData.obrigacoes_contratante}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Seção 7: Confidencialidade */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                🔒 7. Confidencialidade
              </h2>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Cláusula de Confidencialidade</label>
                <textarea
                  name="clausula_confidencialidade"
                  value={contratoData.clausula_confidencialidade}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>
            </div>

            {/* Seção 8: Rescisão */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                ❌ 8. Rescisão
              </h2>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Condições de Rescisão *</label>
                <textarea
                  name="condicoes_rescisao"
                  required
                  value={contratoData.condicoes_rescisao}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>
            </div>

            {/* Seção 9: Foro */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                ⚖️ 9. Foro
              </h2>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Cidade do Foro *</label>
                <input
                  type="text"
                  name="cidade_foro"
                  required
                  value={contratoData.cidade_foro}
                  onChange={handleChange}
                  className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Seção 10: Assinaturas */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                ✍️ 10. Assinaturas
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Cidade *</label>
                  <input
                    type="text"
                    name="cidade_assinatura"
                    required
                    value={contratoData.cidade_assinatura}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Data *</label>
                  <input
                    type="date"
                    name="data_assinatura"
                    required
                    value={contratoData.data_assinatura}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/contratos')}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-xl font-semibold transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white py-4 rounded-xl font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save size={20} />
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        ) : (
          // PRÉ-VISUALIZAÇÃO (mesmo layout do NovoContrato)
          <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl shadow-2xl max-w-5xl mx-auto overflow-hidden">
            {/* Mesmo código da pré-visualização do NovoContrato.jsx */}
            <div className="text-center p-12">
              <p className="text-gray-600">Pré-visualização com as alterações...</p>
              <p className="text-sm text-gray-500 mt-2">(Use o mesmo layout da tela de novo contrato)</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default EditarContrato