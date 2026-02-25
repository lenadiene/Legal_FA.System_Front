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
      // Tenta obter mais detalhes do erro
      const errorText = await response.text()
      console.error('Detalhes do erro:', errorText)
      throw new Error(`Erro ao criar empresa: ${response.status} - ${errorText}`)
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
/**
 * Atualizar empresa com suporte a logos
 * @param {number} id - ID da empresa
 * @param {object} empresaData - Dados da empresa (incluindo logos em Base64)
 * @param {string} token - Token JWT
 */
export const atualizarEmpresa = async (id, empresaData, token) => {
  try {
    console.log('📤 Enviando dados para atualização da empresa:', empresaData)
    
    // Preparar o objeto para enviar
    const dataToSend = {
      razaoSocial: empresaData.razaoSocial,
      email: empresaData.email,
      telefone: empresaData.telefone,
      endereco: empresaData.endereco
    }
    
    // Adicionar logos se existirem (já devem vir em Base64)
    if (empresaData.logoCabecalho) {
      dataToSend.logoCabecalhoBase64 = empresaData.logoCabecalho
    }
    
    if (empresaData.logoRodape) {
      dataToSend.logoRodapeBase64 = empresaData.logoRodape
    }
    
    const response = await fetch(`${API_URL}/api/empresas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dataToSend)
    })

    console.log('📥 Status da resposta:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Erro ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log('✅ Empresa atualizada com sucesso:', data)
    return data
    
  } catch (error) {
    console.error('❌ Erro ao atualizar empresa:', error)
    throw error
  }
}
// ============================================
// USUÁRIO
// ============================================

/**
 * Buscar dados do usuário atual
 * @param {string} token - Token JWT
 */
export const buscarUsuarioAtual = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/usuarios/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Erro ao buscar usuário')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar usuário atual:', error)
    throw error
  }
}



// ============================================
// USUÁRIOS
// ============================================

export const atualizarUsuario = async (usuarioData, token) => {
  try {
    const response = await fetch(`${API_URL}/api/usuarios/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(usuarioData)
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || 'Erro ao atualizar usuário')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro:', error)
    throw error
  }
}

export const criarUsuarioNaEmpresa = async (usuarioData, token) => {
  try {
    const response = await fetch(`${API_URL}/api/usuarios/empresa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(usuarioData)
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || 'Erro ao criar usuário')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro:', error)
    throw error
  }
}

export const listarUsuariosDaEmpresa = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/usuarios/empresa/meus-usuarios`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) throw new Error('Erro ao listar usuários')
    return await response.json()
  } catch (error) {
    console.error('Erro:', error)
    throw error
  }
}

export const deletarUsuario = async (usuarioId, token) => {
  try {
    const response = await fetch(`${API_URL}/api/usuarios/${usuarioId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || 'Erro ao deletar usuário')
    }

    return true
  } catch (error) {
    console.error('Erro:', error)
    throw error
  }
}




// ============================================
// CONTRATOS
// ============================================

export const listarContratos = async (empresaId, token) => {
  try {
    const response = await fetch(`${API_URL}/api/contratos/empresa/${empresaId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) throw new Error('Erro ao listar contratos')
    return await response.json()
  } catch (error) {
    console.error('Erro:', error)
    throw error
  }
}

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

    if (!response.ok) throw new Error('Erro ao criar contrato')
    return await response.json()
  } catch (error) {
    console.error('Erro:', error)
    throw error
  }
}

export const buscarContrato = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/api/contratos/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) throw new Error('Contrato não encontrado')
    return await response.json()
  } catch (error) {
    console.error('Erro:', error)
    throw error
  }
}

export const atualizarContrato = async (id, contratoData, token) => {
  try {
    console.log('📤 Enviando dados para atualização:', contratoData)
    
    const response = await fetch(`${API_URL}/api/contratos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(contratoData)
    })

    if (!response.ok) {
      // Tenta obter detalhes do erro
      const errorText = await response.text()
      console.error('❌ Resposta de erro do servidor:', errorText)
      throw new Error(`Erro ${response.status}: ${errorText || 'Erro ao atualizar contrato'}`)
    }

    const data = await response.json()
    console.log('✅ Contrato atualizado:', data)
    return data
  } catch (error) {
    console.error('Erro ao atualizar contrato:', error)
    throw error
  }
}

export const deletarContrato = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/api/contratos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) throw new Error('Erro ao deletar contrato')
    return true
  } catch (error) {
    console.error('Erro:', error)
    throw error
  }
}
// ============================================
// CONTRATOS - STATUS
// ============================================

/**
 * Atualizar apenas o status do contrato
 * @param {number} id - ID do contrato
 * @param {string} status - Novo status (RASCUNHO, ATIVO, PENDENTE, CONCLUIDO, CANCELADO, ARQUIVADO)
 * @param {string} token - Token JWT
 */
export const atualizarStatusContrato = async (id, status, token) => {
  try {
    console.log(`📤 Atualizando status do contrato ${id} para:`, status)
    
    const response = await fetch(`${API_URL}/api/contratos/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Erro ao atualizar status:', errorText)
      throw new Error(`Erro ${response.status}: ${errorText || 'Erro ao atualizar status'}`)
    }

    const data = await response.json()
    console.log('✅ Status atualizado com sucesso:', data)
    return data
  } catch (error) {
    console.error('Erro ao atualizar status:', error)
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
   atualizarEmpresa,
  
  // Contratos
  listarContratos,
  criarContrato,
  buscarContrato,
  atualizarContrato,
  deletarContrato,
  atualizarStatusContrato,
}