/**
 * Auth Service - Chamadas de API de autenticação
 * 
 * Separa lógica de API dos componentes
 * Todos os endpoints de auth ficam aqui
 */

import api, { getErrorMessage } from '@/lib/api'
import { AuthResponse, LoginRequest, RegisterRequest } from '@/types'

/**
 * Service de Autenticação
 * Todas as funções retornam Promise (são assíncronas)
 */
export const authService = {
  /**
   * Faz login
   * 
   * @param credentials - Email e senha
   * @returns Promise com token e dados do usuário
   * @throws Error se login falhar
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      // POST /api/login
      const response = await api.post<AuthResponse>('/api/login', credentials)
      return response.data
    } catch (error) {
      // Extrai mensagem de erro legível
      const message = getErrorMessage(error)
      throw new Error(message)
    }
  },

  /**
   * Registra novo usuário
   * 
   * @param data - Nome, email e senha
   * @returns Promise com token e dados do usuário
   * @throws Error se registro falhar
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      // POST /api/register
      const response = await api.post<AuthResponse>('/api/register', data)
      return response.data
    } catch (error) {
      const message = getErrorMessage(error)
      throw new Error(message)
    }
  },

  /**
   * Verifica se token ainda é válido
   * (Opcional - se backend tiver endpoint de validação)
   */
  async validateToken(): Promise<boolean> {
    try {
      // Se tiver endpoint de validação, chama aqui
      // const response = await api.get('/api/validate')
      // return response.status === 200

      // Por enquanto, assume que token no localStorage é válido
      return !!localStorage.getItem('token')
    } catch (error) {
      return false
    }
  },
}