import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Printer, Edit2 } from 'lucide-react'

function VisualizarContrato() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [contrato, setContrato] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Verificar autenticação
    const userData = localStorage.getItem('user')
    if (!userData) {
      navigate('/login')
      return
    }
    setUser(JSON.parse(userData))

    // Carregar contrato
    const contratos = JSON.parse(localStorage.getItem('contratos') || '[]')
    const contratoEncontrado = contratos.find(c => c.id === parseInt(id))
    
    if (contratoEncontrado) {
      setContrato(contratoEncontrado)
    } else {
      alert('Contrato não encontrado!')
      navigate('/contratos')
    }
  }, [id, navigate])

  const handlePrint = () => {
    window.print()
  }

  const handleEdit = () => {
    navigate(`/contratos/${id}/editar`)
  }

  if (!contrato) return null

  const dados = contrato?.dados || {}


  // Verificar permissões
  const canEdit = user?.role !== 'estagiario'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      
      {/* Header - Não imprime */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10 print:hidden">
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
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
            >
              <Printer size={18} />
              Imprimir
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo para Impressão */}
      <main className="max-w-5xl mx-auto px-6 py-8 print:px-0 print:py-0">
        
        {/* Layout Legal Design */}
        <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none">
          
          {/* Header com Logo */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-12 py-8 flex items-center justify-between print:bg-none print:border-b-4 print:border-purple-600">
            <div className="text-white text-2xl font-bold print:text-gray-900">Logo</div>
            <h1 className="text-3xl font-bold text-white text-center flex-1 print:text-gray-900">
              CONTRATO DE PRESTAÇÃO DE SERVIÇOS
            </h1>
          </div>

          {/* Conteúdo */}
          <div className="px-12 py-8 space-y-8 print:px-8">
            
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
                O serviço terá início em <strong>{new Date(dados.data_inicio).toLocaleDateString('pt-BR')}</strong> e conclusão prevista para <strong>{new Date(dados.data_fim).toLocaleDateString('pt-BR')}</strong>.
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
                  <strong> Data:</strong> {new Date(dados.data_assinatura).toLocaleDateString('pt-BR')}
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
          <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-12 py-4 text-center mt-8 print:bg-none print:border-t-2 print:border-purple-600">
            <p className="text-white text-xs print:text-gray-900">
              Documento elaborado sob princípios de Legal Design | Página 1
            </p>
          </div>
        </div>
      </main>

      {/* CSS para Impressão */}
      <style>{`
        @media print {
          body {
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:px-0 {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          .print\\:py-0 {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:rounded-none {
            border-radius: 0 !important;
          }
          .print\\:text-gray-900 {
            color: #111827 !important;
          }
          .print\\:bg-none {
            background: none !important;
          }
          .print\\:border-b-4 {
            border-bottom-width: 4px !important;
          }
          .print\\:border-purple-600 {
            border-color: #9333ea !important;
          }
          .print\\:border-t-2 {
            border-top-width: 2px !important;
          }
        }
      `}</style>
    </div>
  )
}

export default VisualizarContrato