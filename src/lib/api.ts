/**
 * Cliente HTTP - Configuração do Axios
 * 
 * Este arquivo configura o Axios para fazer requisições à API
 * 
 * Conceitos:
 * - Axios: Biblioteca para fazer requisições HTTP (alternativa ao fetch)
 * - Interceptors: Funções que rodam antes/depois de cada requisição
 * - Base URL: URL base da API (vem do .env)
 * - Authorization: Header com token JWT
 */

import axios, { AxiosError } from 'axios'

/**
 * URL base da API
 * Vem do arquivo .env.local
 * NEXT_PUBLIC_ = variável acessível no browser
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

/**
 * Instância do Axios configurada
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 segundos
})

/**
 * Interceptor de REQUEST
 * Roda ANTES de cada requisição
 * 
 * Usa para:
 * - Adicionar token JWT no header
 * - Adicionar headers customizados
 * - Logar requisições (dev)
 */
api.interceptors.request.use(
  (config) => {
    // Pega token do localStorage (se existir)
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Interceptor de RESPONSE
 * Roda DEPOIS de cada resposta
 * 
 * Usa para:
 * - Tratar erros globalmente
 * - Refresh de token automático
 * - Logar erros
 */
api.interceptors.response.use(
  (response) => {
    // Resposta OK - retorna os dados direto
    return response
  },
  (error: AxiosError) => {
    // Trata erros
    if (error.response) {
      // Servidor respondeu com erro (4xx, 5xx)
      const status = error.response.status

      // Token expirado ou inválido
      if (status === 401) {
        // Remove token inválido
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        // Redireciona para login (se não estiver já lá)
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login'
        }
      }

      // Log do erro
      console.error('[API Error]', {
        status,
        url: error.config?.url,
        data: error.response.data,
      })
    } else if (error.request) {
      // Requisição foi feita mas sem resposta
      console.error('[API Error] Sem resposta do servidor:', error.message)
    } else {
      // Erro ao configurar requisição
      console.error('[API Error] Erro na configuração:', error.message)
    }

    return Promise.reject(error)
  }
)

/**
 * Helper para extrair mensagem de erro
 * 
 * A API pode retornar erro em formatos diferentes:
 * - { error: "mensagem" }
 * - { message: "mensagem" }
 * - "string"
 * 
 * Esta função padroniza
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as any

    // Tenta várias propriedades comuns
    return (
      data?.error ||
      data?.message ||
      error.message ||
      'Erro ao conectar com o servidor'
    )
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Erro desconhecido'
}

export default api