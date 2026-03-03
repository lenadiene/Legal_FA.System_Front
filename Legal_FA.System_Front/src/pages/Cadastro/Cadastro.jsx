import { criarEmpresa, registrarUsuario } from '../../services/api'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Mail, Lock, User, Phone, MapPin, FileText, ArrowLeft, Upload, Image } from 'lucide-react'

const limparBase64 = (base64) => {
  if (!base64) return null
  return base64.split(',')[1]
}

function Cadastro() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  
  const [empresaData, setEmpresaData] = useState({
    cnpj: '',
    emailCorporativo: '',
    endereco: '',
    logoCabecalho: null,
    logoRodape: null,
    razaoSocial: '',
    telefone: ''
  })
  
  const [logoCabecalhoPreview, setLogoCabecalhoPreview] = useState(null)
  const [logoRodapePreview, setLogoRodapePreview] = useState(null)
  
  const [representanteData, setRepresentanteData] = useState({
    nome: '',
    login: '',
    senha: '',
    confirmarSenha: ''
  })

  const handleEmpresaChange = (e) => {
    const { name, value } = e.target
    setEmpresaData(prev => ({ ...prev, [name]: value }))
  }
const [senhaValida, setSenhaValida] = useState(false)

const validarSenha = (senha) => {
  // Regex: 1 maiúscula, 1 minúscula, 1 número, 1 especial
  const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{6,}$/
  return regex.test(senha)
}
const handleRepresentanteChange = (e) => {
  const { name, value } = e.target
  setRepresentanteData(prev => ({ ...prev, [name]: value }))
  
  if (name === 'senha') {
    setSenhaValida(validarSenha(value))
  }
}


  const handleLogoCabecalhoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setEmpresaData(prev => ({ ...prev, logoCabecalho: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoCabecalhoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogoRodapeChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setEmpresaData(prev => ({ ...prev, logoRodape: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoRodapePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleNextStep = (e) => {
    e.preventDefault()
    setCurrentStep(2)
  }

const handleSubmit = async (e) => {
  e.preventDefault()
  
  if (representanteData.senha !== representanteData.confirmarSenha) {
    alert('As senhas não coincidem!')
    return
  }
  
// Validar senha antes de enviar
  if (!validarSenha(representanteData.senha)) {
    alert('A senha não atende aos requisitos de segurança!')
    return
  }
  
  setIsLoading(true)
  
  try {
    // PASSO 1: Criar Empresa
    console.log('📤 Criando empresa...')
    
    const empresaCriada = await criarEmpresa({
      razaoSocial: empresaData.razaoSocial,
      cnpj: empresaData.cnpj,
      emailCorporativo: empresaData.emailCorporativo,
      telefone: empresaData.telefone,
      endereco: empresaData.endereco,
      logoCabecalho: limparBase64(logoCabecalhoPreview),
      logoRodape: limparBase64(logoRodapePreview)
    })
    
    const empresaId = empresaCriada.id
    console.log('✅ Empresa criada com ID:', empresaId)

    // PASSO 2: Registrar Representante
    console.log('📤 Registrando representante...')
    
        await registrarUsuario({
      login: representanteData.login,
      senha: representanteData.senha,
      role: "GESTOR", // Primeiro usuário é ADMIN
      nomeCompleto: representanteData.nome, // ← Agora enviando como nomeCompleto
      empresaId: empresaId
    })
    
    console.log('✅ Representante registrado!')

    // PASSO 3: Fazer login automático para obter token
    console.log('📤 Fazendo login automático...')
    
    const loginResponse = await fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login: representanteData.login,
        senha: representanteData.senha
      })
    })

    if (!loginResponse.ok) {
      throw new Error('Erro ao fazer login automático')
    }

    const loginData = await loginResponse.json()
    
    console.log('✅ Login automático realizado!')
    
    // Salvar token
    localStorage.setItem('token', loginData.token)
    
    // Salvar dados do usuário completos
    localStorage.setItem('user', JSON.stringify({
      id: loginData.usuario.id,
      login: loginData.usuario.login,
      nome: loginData.usuario.funcionario.nome,
      role: loginData.usuario.perfil.toLowerCase(),
      funcionarioId: loginData.usuario.funcionario.id,
      empresaId: loginData.usuario.funcionario.empresa.id,
      isRepresentante: true  // Primeiro usuário é sempre representante
    }))
    
    // Salvar dados da empresa
    localStorage.setItem('empresa', JSON.stringify({
      id: loginData.usuario.funcionario.empresa.id,
      razaoSocial: loginData.usuario.funcionario.empresa.razaoSocial,
      cnpj: loginData.usuario.funcionario.empresa.cnpj,
      emailCorporativo: loginData.usuario.funcionario.empresa.emailCorporativo,
      telefone: loginData.usuario.funcionario.empresa.telefone,
      endereco: loginData.usuario.funcionario.empresa.endereco
    }))
    
    alert('✅ Cadastro realizado com sucesso!')
    navigate('/home')
    
  } catch (error) {
    console.error('❌ Erro no cadastro:', error)
    alert(`Erro: ${error.message}`)
  } finally {
    setIsLoading(false)
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative">
      
      {/* Botão Voltar */}
      <button
        onClick={() => currentStep === 1 ? navigate('/') : setCurrentStep(1)}
        className="fixed top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition z-50"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-medium">Voltar</span>
      </button>

      {/* Card */}
      <div className="w-full max-w-3xl mx-auto">
        <form onSubmit={currentStep === 1 ? handleNextStep : handleSubmit} className="bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-gray-700">
          
          {/* Indicador de Etapas */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition ${
                currentStep === 1 ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400'
              }`}>
                1
              </div>
              <div className="w-16 h-1 bg-gray-700"></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition ${
                currentStep === 2 ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400'
              }`}>
                2
              </div>
            </div>
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            {currentStep === 1 ? 'Dados da Empresa' : 'Representante Principal'}
          </h1>
          <p className="text-gray-400 text-center text-sm mb-8">
            {currentStep === 1 ? 'Preencha as informações da sua empresa' : 'Crie o usuário administrador'}
          </p>

          {/* ETAPA 1 - DADOS DA EMPRESA */}
          {currentStep === 1 && (
            <div className="space-y-5">
              
              {/* Grid 2 colunas */}
              <div className="grid md:grid-cols-2 gap-5">
                
                {/* Razão Social */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Razão Social *</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="razaoSocial"
                      placeholder="Exemplo Advocacia Ltda"
                      required
                      value={empresaData.razaoSocial}
                      onChange={handleEmpresaChange}
                      className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-xl pl-11 pr-4 py-3 text-base focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition placeholder:text-gray-400"
                    />
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* CNPJ */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">CNPJ *</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="cnpj"
                      placeholder="00.000.000/0000-00"
                      required
                      value={empresaData.cnpj}
                      onChange={handleEmpresaChange}
                      className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-xl pl-11 pr-4 py-3 text-base focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition placeholder:text-gray-400"
                    />
                    <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Email Corporativo */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Email Corporativo *</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="emailCorporativo"
                      placeholder="contato@empresa.com"
                      required
                      value={empresaData.emailCorporativo}
                      onChange={handleEmpresaChange}
                      className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-xl pl-11 pr-4 py-3 text-base focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition placeholder:text-gray-400"
                    />
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Telefone *</label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="telefone"
                      placeholder="(11) 99999-9999"
                      required
                      value={empresaData.telefone}
                      onChange={handleEmpresaChange}
                      className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-xl pl-11 pr-4 py-3 text-base focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition placeholder:text-gray-400"
                    />
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Endereço - Full Width */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Endereço Completo *</label>
                <div className="relative">
                  <input
                    type="text"
                    name="endereco"
                    placeholder="Rua Exemplo, 123 - Centro - São Paulo, SP"
                    required
                    value={empresaData.endereco}
                    onChange={handleEmpresaChange}
                    className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-xl pl-11 pr-4 py-3 text-base focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition placeholder:text-gray-400"
                  />
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Upload de Logos */}
              <div className="grid md:grid-cols-2 gap-5 pt-4">
                
                {/* Logo Cabeçalho */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Logo do Cabeçalho</label>
                  <div className="border-2 border-dashed border-gray-600 rounded-xl p-4 hover:border-purple-500 transition cursor-pointer bg-gray-700/30">
                    <input
                      type="file"
                      id="logoCabecalho"
                      accept="image/*"
                      onChange={handleLogoCabecalhoChange}
                      className="hidden"
                    />
                    <label htmlFor="logoCabecalho" className="cursor-pointer flex flex-col items-center">
                      {logoCabecalhoPreview ? (
                        <img src={logoCabecalhoPreview} alt="Logo Cabeçalho" className="h-20 object-contain mb-2" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-400 text-center">Clique para fazer upload</p>
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
                      id="logoRodape"
                      accept="image/*"
                      onChange={handleLogoRodapeChange}
                      className="hidden"
                    />
                    <label htmlFor="logoRodape" className="cursor-pointer flex flex-col items-center">
                      {logoRodapePreview ? (
                        <img src={logoRodapePreview} alt="Logo Rodapé" className="h-20 object-contain mb-2" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-400 text-center">Clique para fazer upload</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* Botão Próxima Etapa */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold py-4 rounded-full text-base transition-all duration-300 shadow-lg shadow-purple-500/30 transform active:scale-[0.98] mt-6"
              >
                Próxima Etapa →
              </button>
            </div>
          )}

          {/* ETAPA 2 - REPRESENTANTE PRINCIPAL */}
          {currentStep === 2 && (
            <div className="space-y-5">
              
              {/* Nome */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Nome Completo *</label>
                <div className="relative">
                  <input
                    type="text"
                    name="nome"
                    placeholder="João Silva"
                    required
                    value={representanteData.nome}
                    onChange={handleRepresentanteChange}
                    className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-xl pl-11 pr-4 py-3 text-base focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition placeholder:text-gray-400"
                  />
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Login (Email) */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Login (Email) *</label>
                <div className="relative">
                  <input
                    type="email"
                    name="login"
                    placeholder="joao@empresa.com"
                    required
                    value={representanteData.login}
                    onChange={handleRepresentanteChange}
                    className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-xl pl-11 pr-4 py-3 text-base focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition placeholder:text-gray-400"
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Senha */}
<div>
  <label className="block text-sm text-gray-300 mb-2">Senha *</label>
  <div className="relative">
    <input
      type="password"
      name="senha"
      placeholder="••••••••"
      required
      minLength={6}
      value={representanteData.senha}
      onChange={handleRepresentanteChange}
      className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-xl pl-11 pr-4 py-3"
    />
    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
  </div>
  
  {/* Indicadores de Validação */}
  <div className="mt-2 space-y-1">
    <p className="text-xs text-gray-400">A senha deve conter:</p>
    <div className="flex flex-col gap-1 text-xs">
      <span className={representanteData.senha.length >= 6 ? 'text-green-400' : 'text-gray-500'}>
        ✓ Mínimo 6 caracteres
      </span>
      <span className={/[A-Z]/.test(representanteData.senha) ? 'text-green-400' : 'text-gray-500'}>
        ✓ Uma letra maiúscula
      </span>
      <span className={/[a-z]/.test(representanteData.senha) ? 'text-green-400' : 'text-gray-500'}>
        ✓ Uma letra minúscula
      </span>
      <span className={/[0-9]/.test(representanteData.senha) ? 'text-green-400' : 'text-gray-500'}>
        ✓ Um número
      </span>
      <span className={/[@#$%^&+=!]/.test(representanteData.senha) ? 'text-green-400' : 'text-gray-500'}>
        ✓ Um caractere especial (@#$%^&+=!)
      </span>
    </div>
  </div>
</div>

              {/* Confirmar Senha */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Confirmar Senha *</label>
                <div className="relative">
                  <input
                    type="password"
                    name="confirmarSenha"
                    placeholder="••••••••"
                    required
                    minLength={6}
                    value={representanteData.confirmarSenha}
                    onChange={handleRepresentanteChange}
                    className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-xl pl-11 pr-4 py-3 text-base focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition placeholder:text-gray-400"
                  />
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Aviso de senhas diferentes */}
              {representanteData.senha !== representanteData.confirmarSenha && representanteData.confirmarSenha && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm">⚠️ As senhas não coincidem</p>
                </div>
              )}

              {/* Botão Finalizar */}
              <button
                type="submit"
                disabled={isLoading || representanteData.senha !== representanteData.confirmarSenha}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold py-4 rounded-full text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30 transform active:scale-[0.98] mt-6"
              >
                {isLoading ? 'Finalizando Cadastro...' : 'Finalizar Cadastro ✓'}
              </button>
            </div>
          )}

          {/* Link para Login */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Já tem uma conta?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-purple-400 hover:text-purple-300 font-medium transition"
              >
                Fazer login
              </button>
            </p>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          Legal FA.System © 2026
        </p>
      </div>
    </div>
  )
}

export default Cadastro