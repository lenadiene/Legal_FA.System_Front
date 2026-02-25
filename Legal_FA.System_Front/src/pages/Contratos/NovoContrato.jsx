import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Eye } from 'lucide-react'

function NovoContrato() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [empresa, setEmpresa] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const [contratoData, setContratoData] = useState({
    // 1. Contratante (preenche automaticamente com dados da empresa)
    nome_empresa: '',
    cnpj_empresa: '',
    endereco_empresa: '',
    
    // 2. Prestador
    nome_prestador: '',
    documento_prestador: '',
    endereco_prestador: '',
    
    // 3. Serviço
    descricao_servico: '',
    
    // 4. Prazo
    data_inicio: '',
    data_fim: '',
    
    // 5. Valor e Pagamento
    valor_total: '',
    forma_pagamento: '',
    prazo_pagamento: '',
    multa_atraso: '',
    
    // 6. Obrigações
    obrigacoes_prestador: '',
    obrigacoes_contratante: '',
    
    // 7. Confidencialidade
    clausula_confidencialidade: 'As partes se comprometem a manter sigilo sobre todas as informações confidenciais trocadas durante a vigência deste contrato.',
    
    // 8. Rescisão
    condicoes_rescisao: '',
    
    // 9. Foro
    cidade_foro: '',
    
    // 10. Assinaturas
    cidade_assinatura: '',
    data_assinatura: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    // Verificar autenticação
    const userData = localStorage.getItem('user')
    if (!userData) {
      navigate('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    
    // Verificar se é estagiário (não pode criar contratos)
    if (parsedUser.role === 'estagiario') {
      alert('Você não tem permissão para criar contratos.')
      navigate('/contratos')
      return
    }

    setUser(parsedUser)

    // Carregar dados da empresa
    const empresaData = localStorage.getItem('empresa')
    if (empresaData) {
      const parsedEmpresa = JSON.parse(empresaData)
      setEmpresa(parsedEmpresa)
      
      // Preencher automaticamente dados do contratante
      setContratoData(prev => ({
        ...prev,
        nome_empresa: parsedEmpresa.razaoSocial || '',
        cnpj_empresa: parsedEmpresa.cnpj || '',
        endereco_empresa: parsedEmpresa.endereco || ''
      }))
    }
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setContratoData(prev => ({ ...prev, [name]: value }))
  }

const handleSubmit = async (e) => {
  e.preventDefault()
  setIsLoading(true)

  try {
    const token = localStorage.getItem('token')
    
    const novoContrato = {
      titulo: `Contrato de Prestação de Serviços - ${contratoData.nome_prestador}`,
      empresaId: user.empresaId,
      funcionarioResponsavelId: user.funcionarioId,
      templateId: 1, // ID do template "Prestação de Serviços"
      dados: contratoData
    }

    const response = await fetch('http://localhost:8080/api/contratos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(novoContrato)
    })

    if (!response.ok) {
      throw new Error('Erro ao criar contrato')
    }

    const contratoСriado = await response.json()
    
    alert('✅ Contrato criado com sucesso!')
    navigate('/contratos')
    
  } catch (error) {
    console.error('❌ Erro:', error)
    alert(`Erro: ${error.message}`)
  } finally {
    setIsLoading(false)
  }
}
  if (!user) return null

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
          // FORMULÁRIO
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Título */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                📄 Novo Contrato de Prestação de Serviços
              </h1>
              <p className="text-gray-400">Preencha todos os campos abaixo</p>
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
                    placeholder="Nome do prestador"
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
                    placeholder="000.000.000-00"
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
                    placeholder="Endereço completo"
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
                  placeholder="Descreva detalhadamente o serviço a ser prestado..."
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
                    placeholder="10.000,00"
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
                    placeholder="2"
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
                    placeholder="Ex: PIX, Transferência, Boleto"
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
                    placeholder="Ex: 30 dias após emissão da nota"
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
                    placeholder="Liste as responsabilidades do prestador..."
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
                    placeholder="Liste as responsabilidades do contratante..."
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
                  placeholder="Descreva as condições para rescisão do contrato..."
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
                  placeholder="Ex: São Paulo"
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
                    placeholder="Ex: São Paulo"
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

            {/* Botão Salvar */}
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
                {isLoading ? 'Salvando...' : 'Salvar Contrato'}
              </button>
            </div>
          </form>
        ) : (
          // PRÉ-VISUALIZAÇÃO - LEGAL DESIGN COMPLETO
          <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl shadow-2xl max-w-5xl mx-auto overflow-hidden">
            
            {/* Header com Logo */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-12 py-8 flex items-center justify-between">
              <div className="text-white text-2xl font-bold">Logo</div>
              <h1 className="text-3xl font-bold text-white text-center flex-1">
                CONTRATO DE PRESTAÇÃO DE SERVIÇOS
              </h1>
            </div>

            {/* Conteúdo */}
            <div className="px-12 py-8 space-y-8">
              
              {/* Cards Contratante e Prestador */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Card Contratante */}
                <div className="border-2 border-purple-500 rounded-xl p-6 bg-purple-50">
                  <h2 className="text-lg font-bold text-purple-700 mb-4 flex items-center gap-2">
                    🏢 CONTRATANTE
                  </h2>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Empresa:</span> <span className="font-semibold text-gray-900">{contratoData.nome_empresa}</span></p>
                    <p><span className="text-gray-600">CNPJ:</span> <span className="font-semibold text-gray-900">{contratoData.cnpj_empresa}</span></p>
                    <p><span className="text-gray-600">Endereço:</span> <span className="font-semibold text-gray-900">{contratoData.endereco_empresa}</span></p>
                  </div>
                </div>

                {/* Card Prestador */}
                <div className="border-2 border-purple-500 rounded-xl p-6 bg-purple-50">
                  <h2 className="text-lg font-bold text-purple-700 mb-4 flex items-center gap-2">
                    👤 PRESTADOR
                  </h2>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Nome:</span> <span className="font-semibold text-gray-900">{contratoData.nome_prestador || '[Não preenchido]'}</span></p>
                    <p><span className="text-gray-600">Doc:</span> <span className="font-semibold text-gray-900">{contratoData.documento_prestador || '[Não preenchido]'}</span></p>
                    <p><span className="text-gray-600">Endereço:</span> <span className="font-semibold text-gray-900">{contratoData.endereco_prestador || '[Não preenchido]'}</span></p>
                  </div>
                </div>
              </div>

              {/* Seção 01 - Objeto do Serviço */}
              <div className="border-l-4 border-purple-500 pl-6 py-2">
                <h2 className="text-xl font-bold text-purple-700 mb-3">01. Objeto do Serviço</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{contratoData.descricao_servico || '[Não preenchido]'}</p>
              </div>

              {/* Seção 02 - Vigência e Prazos */}
              <div className="border-l-4 border-purple-500 pl-6 py-2">
                <h2 className="text-xl font-bold text-purple-700 mb-3">02. Vigência e Prazos</h2>
                <p className="text-gray-700 mb-4">
                  O serviço terá início em <strong>{contratoData.data_inicio ? new Date(contratoData.data_inicio).toLocaleDateString('pt-BR') : '[Não preenchido]'}</strong> e conclusão prevista para <strong>{contratoData.data_fim ? new Date(contratoData.data_fim).toLocaleDateString('pt-BR') : '[Não preenchido]'}</strong>.
                </p>
                <p className="text-sm text-gray-600 italic">Caso seja necessário prorrogar, as partes devem concordar por escrito.</p>
              </div>

              {/* Box de Valores em Destaque */}
              <div className="border-2 border-dashed border-purple-300 rounded-xl p-6 bg-purple-50/50">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-xs text-gray-600 uppercase mb-2">Investimento Total</p>
                    <p className="text-2xl font-bold text-purple-700">R$ {contratoData.valor_total || '[Não preenchido]'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase mb-2">Forma de Pagamento</p>
                    <p className="text-lg font-semibold text-gray-900">{contratoData.forma_pagamento || '[Não preenchido]'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase mb-2">Multa por Atraso</p>
                    <p className="text-2xl font-bold text-purple-700">{contratoData.multa_atraso || '[Não preenchido]'}%</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-purple-200 text-center">
                  <p className="text-sm text-gray-600">
                    <strong>Prazo para pagamento:</strong> {contratoData.prazo_pagamento || '[Não preenchido]'}
                  </p>
                </div>
              </div>

              {/* Seção 03 - Obrigações */}
              <div className="border-l-4 border-purple-500 pl-6 py-2">
                <h2 className="text-xl font-bold text-purple-700 mb-3">03. Obrigações de Cada Parte</h2>
                
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 mb-2">Do Prestador:</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{contratoData.obrigacoes_prestador || '[Não preenchido]'}</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Do Contratante:</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{contratoData.obrigacoes_contratante || '[Não preenchido]'}</p>
                </div>
              </div>

              {/* Seção 04 - Confidencialidade */}
              <div className="border-l-4 border-purple-500 pl-6 py-2">
                <h2 className="text-xl font-bold text-purple-700 mb-3">04. Confidencialidade</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{contratoData.clausula_confidencialidade}</p>
              </div>

              {/* Seção 05 - Rescisão */}
              <div className="border-l-4 border-purple-500 pl-6 py-2">
                <h2 className="text-xl font-bold text-purple-700 mb-3">05. Condições de Rescisão</h2>
                <p className="text-gray-700 leading-relaxed">O contrato pode ser encerrado nas seguintes condições:</p>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mt-2">{contratoData.condicoes_rescisao || '[Não preenchido]'}</p>
              </div>

              {/* Seção 06 - Foro */}
              <div className="border-l-4 border-purple-500 pl-6 py-2">
                <h2 className="text-xl font-bold text-purple-700 mb-3">06. Foro</h2>
                <p className="text-gray-700 leading-relaxed">
                  Fica eleito o foro da comarca de <strong>{contratoData.cidade_foro || '[Não preenchido]'}</strong>, para resolver qualquer conflito relacionado a este contrato.
                </p>
              </div>

              {/* Linha separadora */}
              <div className="border-t-2 border-gray-300 my-8"></div>

              {/* Seção de Assinaturas */}
              <div>
                <h2 className="text-xl font-bold text-purple-700 mb-4 text-center">Assinaturas</h2>
                <p className="text-center text-gray-600 mb-6">
                  Ao assinar, as partes concordam com todos os termos deste contrato.
                </p>
                
                {/* Local e Data */}
                <div className="text-center mb-8">
                  <p className="text-gray-700">
                    <strong>Cidade:</strong> {contratoData.cidade_assinatura || '[Não preenchido]'} | 
                    <strong> Data:</strong> {contratoData.data_assinatura ? new Date(contratoData.data_assinatura).toLocaleDateString('pt-BR') : '[Não preenchido]'}
                  </p>
                </div>

                {/* Assinaturas */}
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="text-center">
                    <div className="border-t-2 border-gray-400 pt-3 mt-16">
                      <p className="font-bold text-gray-900 text-lg">CONTRATANTE</p>
                      <p className="text-sm text-gray-600 mt-1">{contratoData.nome_empresa}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="border-t-2 border-gray-400 pt-3 mt-16">
                      <p className="font-bold text-gray-900 text-lg">PRESTADOR</p>
                      <p className="text-sm text-gray-600 mt-1">{contratoData.nome_prestador || '__________________________'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-12 py-4 text-center mt-8">
              <p className="text-white text-xs">
                Documento elaborado sob princípios de Legal Design | Página 1
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default NovoContrato