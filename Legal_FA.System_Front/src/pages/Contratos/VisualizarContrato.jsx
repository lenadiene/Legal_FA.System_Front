import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Download, Edit2 } from 'lucide-react'
import { buscarContrato } from '../../services/api'

function VisualizarContrato() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [contrato, setContrato] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')

    if (!userData) {
      navigate('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    async function carregarContrato() {
      try {
        const token = localStorage.getItem('token')
        const data = await buscarContrato(id, token)
        setContrato(data)
      } catch (error) {
        console.error(error)
        alert('Contrato não encontrado ou acesso negado')
        navigate('/contratos')
      }
    }

    carregarContrato()
  }, [id, navigate])

  if (!contrato) return null

  const dados = contrato.dados || {}

  // Verificar permissões
  const canEdit = user?.role !== 'estagiario'
  
  const handleEdit = () => {
    navigate(`/contratos/${id}/editar`)
  }

  // Função para formatar data
  function formatarDataBR(dataISO) {
    if (!dataISO) return ''
    
    // Se já está no formato DD/MM/YYYY, retorna como está
    if (dataISO.includes('/')) return dataISO
    
    // Se está no formato ISO (YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss)
    try {
      const [ano, mes, dia] = dataISO.split('T')[0].split('-')
      return `${dia}/${mes}/${ano}`
    } catch (error) {
      console.error('Erro ao formatar data:', dataISO)
      return dataISO
    }
  }

  // Redirecionar para página de PDF
  const handleDownloadPDF = () => {
    navigate(`/contratos/${id}/pdf`, { 
      state: { from: `/contratos/${id}` } 
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/contratos')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Voltar</span>
          </button>
          
          <div className="flex items-center gap-3">
            {canEdit && (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition"
              >
                <Edit2 size={18} />
                Editar
              </button>
            )}
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
            >
              <Download size={18} />
              Download de PDF
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl shadow-2xl overflow-hidden">
          
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
                  <p><span className="text-gray-600">Empresa:</span> <span className="font-semibold text-gray-900">{dados.nome_empresa}</span></p>
                  <p><span className="text-gray-600">CNPJ:</span> <span className="font-semibold text-gray-900">{dados.cnpj_empresa}</span></p>
                  <p><span className="text-gray-600">Endereço:</span> <span className="font-semibold text-gray-900">{dados.endereco_empresa}</span></p>
                </div>
              </div>

              {/* Card Prestador */}
              <div className="border-2 border-purple-500 rounded-xl p-6 bg-purple-50">
                <h2 className="text-lg font-bold text-purple-700 mb-4 flex items-center gap-2">
                  👤 PRESTADOR
                </h2>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-600">Nome:</span> <span className="font-semibold text-gray-900">{dados.nome_prestador}</span></p>
                  <p><span className="text-gray-600">Doc:</span> <span className="font-semibold text-gray-900">{dados.documento_prestador}</span></p>
                  <p><span className="text-gray-600">Endereço:</span> <span className="font-semibold text-gray-900">{dados.endereco_prestador}</span></p>
                </div>
              </div>
            </div>

            {/* Seção 01 */}
            <div className="border-l-4 border-purple-500 pl-6 py-2">
              <h2 className="text-xl font-bold text-purple-700 mb-3">01. Objeto do Serviço</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{dados.descricao_servico}</p>
            </div>

            {/* Seção 02 */}
            <div className="border-l-4 border-purple-500 pl-6 py-2">
              <h2 className="text-xl font-bold text-purple-700 mb-3">02. Vigência e Prazos</h2>
              <p className="text-gray-700 mb-4">
                O serviço terá início em <strong>{formatarDataBR(dados.data_inicio)}</strong> e conclusão prevista para <strong>{formatarDataBR(dados.data_fim)}</strong>.
              </p>
              <p className="text-sm text-gray-600 italic">Caso seja necessário prorrogar, as partes devem concordar por escrito.</p>
            </div>

            {/* Box de Valores */}
            <div className="border-2 border-dashed border-purple-300 rounded-xl p-6 bg-purple-50/50">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-xs text-gray-600 uppercase mb-2">Investimento Total</p>
                  <p className="text-2xl font-bold text-purple-700">R$ {dados.valor_total}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase mb-2">Forma de Pagamento</p>
                  <p className="text-lg font-semibold text-gray-900">{dados.forma_pagamento}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase mb-2">Multa por Atraso</p>
                  <p className="text-2xl font-bold text-purple-700">{dados.multa_atraso}%</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-purple-200 text-center">
                <p className="text-sm text-gray-600">
                  <strong>Prazo para pagamento:</strong> {dados.prazo_pagamento}
                </p>
              </div>
            </div>

            {/* Seção 03 */}
            <div className="border-l-4 border-purple-500 pl-6 py-2">
              <h2 className="text-xl font-bold text-purple-700 mb-3">03. Obrigações de Cada Parte</h2>
              <div className="mb-4">
                <h3 className="font-bold text-gray-900 mb-2">Do Prestador:</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{dados.obrigacoes_prestador}</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Do Contratante:</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{dados.obrigacoes_contratante}</p>
              </div>
            </div>

            {/* Seção 04 */}
            <div className="border-l-4 border-purple-500 pl-6 py-2">
              <h2 className="text-xl font-bold text-purple-700 mb-3">04. Confidencialidade</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{dados.clausula_confidencialidade}</p>
            </div>

            {/* Seção 05 */}
            <div className="border-l-4 border-purple-500 pl-6 py-2">
              <h2 className="text-xl font-bold text-purple-700 mb-3">05. Condições de Rescisão</h2>
              <p className="text-gray-700 leading-relaxed">O contrato pode ser encerrado nas seguintes condições:</p>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mt-2">{dados.condicoes_rescisao}</p>
            </div>

            {/* Seção 06 */}
            <div className="border-l-4 border-purple-500 pl-6 py-2">
              <h2 className="text-xl font-bold text-purple-700 mb-3">06. Foro</h2>
              <p className="text-gray-700 leading-relaxed">
                Fica eleito o foro da comarca de <strong>{dados.cidade_foro}</strong>, para resolver qualquer conflito relacionado a este contrato.
              </p>
            </div>

            {/* Linha separadora */}
            <div className="border-t-2 border-gray-300 my-8"></div>

            {/* Assinaturas */}
            <div>
              <h2 className="text-xl font-bold text-purple-700 mb-4 text-center">Assinaturas</h2>
              <p className="text-center text-gray-600 mb-6">
                Ao assinar, as partes concordam com todos os termos deste contrato.
              </p>
              
              <div className="text-center mb-8">
                <p className="text-gray-700">
                  <strong>Cidade:</strong> {dados.cidade_assinatura} | 
                  <strong> Data:</strong> {formatarDataBR(dados.data_assinatura)}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <div className="text-center">
                  <div className="border-t-2 border-gray-400 pt-3 mt-16">
                    <p className="font-bold text-gray-900 text-lg">CONTRATANTE</p>
                    <p className="text-sm text-gray-600 mt-1">{dados.nome_empresa}</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="border-t-2 border-gray-400 pt-3 mt-16">
                    <p className="font-bold text-gray-900 text-lg">PRESTADOR</p>
                    <p className="text-sm text-gray-600 mt-1">{dados.nome_prestador}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-12 py-4 text-center mt-8">
            <p className="text-white text-xs">
              Documento elaborado sob princípios de Legal Design
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default VisualizarContrato