// Configuração da URL base da API
const API_URL = 'http://localhost:8080'

// ============================================
// AUTENTICAÇÃO
// ============================================

/**
 * Login do usuário
 */
export const login = async (loginData) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login: loginData.email,
        senha: loginData.password
      })
    })

    if (!response.ok) {
      throw new Error('Credenciais inválidas')
    }

    const data = await response.json()
    return data.token
  } catch (error) {
    console.error('Erro no login:', error)
    throw error
  }
}

/**
 * Registrar novo usuário (Representante)
 */
export const registrarUsuario = async (representanteData, empresaId) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login: representanteData.login,
        senha: representanteData.senha,
        role: 'GESTOR',
        nomeCompleto: representanteData.nome,
        empresaId: empresaId
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || 'Erro ao registrar usuário')
    }

    return true
  } catch (error) {
    console.error('Erro ao registrar:', error)
    throw error
  }
}

// ============================================
// EMPRESA
// ============================================

/**
 * Criar nova empresa
 */
export const criarEmpresa = async (empresaData) => {
  try {
    const response = await fetch(`${API_URL}/api/empresas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        razaoSocial: empresaData.razaoSocial,
        cnpj: empresaData.cnpj,
        email: empresaData.emailCorporativo,
        telefone: empresaData.telefone,
        endereco: empresaData.endereco,
        logoCabecalho: empresaData.logoCabecalho,
        logoRodape: empresaData.logoRodape
      })
    })

    if (!response.ok) {
      throw new Error('Erro ao criar empresa')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao criar empresa:', error)
    throw error
  }
}

/**
 * Buscar empresa por ID
 */
export const buscarEmpresa = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/empresas/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error('Empresa não encontrada')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar empresa:', error)
    throw error
  }
}

// ============================================
// CONTRATOS
// ============================================

/**
 * Listar contratos
 */
export const listarContratos = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/contratos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Erro ao listar contratos')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao listar contratos:', error)
    throw error
  }
}

/**
 * Criar novo contrato
 */
export const criarContrato = async (contratoData, token) => {
  try {
    const response = await fetch(`${API_URL}/api/contratos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(contratoData)
    })

    if (!response.ok) {
      throw new Error('Erro ao criar contrato')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao criar contrato:', error)
    throw error
  }
}

/**
 * Buscar contrato por ID
 */
export const buscarContrato = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/api/contratos/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Contrato não encontrado')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar contrato:', error)
    throw error
  }
}

/**
 * Atualizar contrato
 */
export const atualizarContrato = async (id, contratoData, token) => {
  try {
    const response = await fetch(`${API_URL}/api/contratos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(contratoData)
    })

    if (!response.ok) {
      throw new Error('Erro ao atualizar contrato')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao atualizar contrato:', error)
    throw error
  }
}

/**
 * Deletar contrato
 */
export const deletarContrato = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/api/contratos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Erro ao deletar contrato')
    }

    return true
  } catch (error) {
    console.error('Erro ao deletar contrato:', error)
    throw error
  }
}

export default {
  // Auth
  login,
  registrarUsuario,
  
  // Empresa
  criarEmpresa,
  buscarEmpresa,
  
  // Contratos
  listarContratos,
  criarContrato,
  buscarContrato,
  atualizarContrato,
  deletarContrato
}