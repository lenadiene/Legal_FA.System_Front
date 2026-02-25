import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Download, Loader2 } from 'lucide-react'
import { buscarContrato } from '../../services/api'
import html2pdf from 'html2pdf.js'

function ContratoPDF() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const [contrato, setContrato] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  
  // Pega a página de origem da URL (ex: /contratos ou /contratos/123)
  const fromPage = location.state?.from || '/contratos'

  useEffect(() => {
    async function carregarContrato() {
      try {
        const token = localStorage.getItem('token')
        const data = await buscarContrato(id, token)
        setContrato(data)
      } catch (error) {
        console.error('Erro ao carregar contrato:', error)
        alert('Erro ao carregar contrato')
        navigate(fromPage)
      }
    }
    carregarContrato()
  }, [id, navigate, fromPage])

 const formatarDataBR = (dataISO) => {
  if (!dataISO) return ''
  
  // Se já está no formato DD/MM/YYYY, retorna como está
  if (dataISO.includes('/')) return dataISO
  
  // Se está no formato ISO (YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss)
  try {
    const [ano, mes, dia] = dataISO.split('T')[0].split('-')
    return `${dia}/${mes}/${ano}`
  } catch (error) {
    console.error('Erro ao formatar data:', dataISO)
    return dataISO // Retorna o valor original em caso de erro
  }
}

  const handleDownloadPDF = async () => {
    setIsGenerating(true)
    
    try {
      const element = document.getElementById('contrato-pdf-content')
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `contrato_${id}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          letterRendering: true,
          backgroundColor: '#ffffff'
        },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      }
      
      await html2pdf().set(opt).from(element).save()
      
      // Aguardar 1 segundo para garantir que o download começou
      setTimeout(() => {
        alert('✅ PDF gerado com sucesso!')
        navigate(fromPage)
      }, 1000)
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      alert('Erro ao gerar PDF')
      setIsGenerating(false)
    }
  }

  if (!contrato) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Carregando contrato...</p>
        </div>
      </div>
    )
  }

  const dados = contrato.dados || {}

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      
      {/* Header fixo com ações */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Gerar PDF do Contrato</h1>
            <p className="text-sm text-gray-400">Visualize e baixe o contrato em PDF</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(fromPage)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Gerando PDF...
                </>
              ) : (
                <>
                  <Download size={18} />
                  Baixar
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo do PDF */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div id="contrato-pdf-content">
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
                <div className="border-2 border-purple-500 rounded-xl p-6 bg-purple-50">
                  <h2 className="text-lg font-bold text-purple-700 mb-4">🏢 CONTRATANTE</h2>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Empresa:</span> <span className="font-semibold text-gray-900">{dados.nome_empresa}</span></p>
                    <p><span className="text-gray-600">CNPJ:</span> <span className="font-semibold text-gray-900">{dados.cnpj_empresa}</span></p>
                    <p><span className="text-gray-600">Endereço:</span> <span className="font-semibold text-gray-900">{dados.endereco_empresa}</span></p>
                  </div>
                </div>

                <div className="border-2 border-purple-500 rounded-xl p-6 bg-purple-50">
                  <h2 className="text-lg font-bold text-purple-700 mb-4">👤 PRESTADOR</h2>
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
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{dados.condicoes_rescisao}</p>
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
        </div>
      </main>
    </div>
  )
}

export default ContratoPDF