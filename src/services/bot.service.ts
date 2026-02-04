/**
 * Bot Service - Chamadas de API relacionadas ao bot
 * 
 * Todas as funções de interação com o bot ficam aqui
 */

import api, { getErrorMessage } from '@/lib/api'
import {
  QuestionRequest,
  QuestionResponse,
  HistoryResponse,
  SearchResponse,
  StatisticsResponse,
  Conversation,
} from '@/types'

/**
 * Service do Bot
 */
export const botService = {
  /**
   * Faz uma pergunta ao bot
   * 
   * @param data - Pergunta e user_id (opcional)
   * @returns Promise com resposta do bot
   */
  async askQuestion(data: QuestionRequest): Promise<QuestionResponse> {
    try {
      const response = await api.post<QuestionResponse>('/api/bot/question', data)
      return response.data
    } catch (error) {
      const message = getErrorMessage(error)
      throw new Error(message)
    }
  },

  /**
   * Busca histórico de conversas
   * 
   * @param userId - ID do usuário
   * @param limit - Conversas por página (padrão: 20)
   * @param offset - Deslocamento (padrão: 0)
   * @returns Promise com lista de conversas
   */
  async getHistory(
    userId: number,
    limit: number = 20,
    offset: number = 0
  ): Promise<HistoryResponse> {
    try {
      const response = await api.get<HistoryResponse>(
        `/api/bot/history?user_id=${userId}&limit=${limit}&offset=${offset}`
      )
      return response.data
    } catch (error) {
      const message = getErrorMessage(error)
      throw new Error(message)
    }
  },

  /**
   * Busca uma conversa específica por ID
   * 
   * @param conversationId - ID da conversa
   * @returns Promise com conversa completa
   */
  async getConversation(conversationId: number): Promise<Conversation> {
    try {
      const response = await api.get<{ conversation: Conversation }>(
        `/api/bot/conversation/${conversationId}`
      )
      return response.data.conversation
    } catch (error) {
      const message = getErrorMessage(error)
      throw new Error(message)
    }
  },

  /**
   * Busca conversas por palavra-chave
   * 
   * @param userId - ID do usuário
   * @param query - Termo de busca
   * @param limit - Máximo de resultados
   * @returns Promise com resultados da busca
   */
  async searchConversations(
    userId: number,
    query: string,
    limit: number = 20
  ): Promise<SearchResponse> {
    try {
      const response = await api.get<SearchResponse>(
        `/api/bot/search?user_id=${userId}&q=${encodeURIComponent(query)}&limit=${limit}`
      )
      return response.data
    } catch (error) {
      const message = getErrorMessage(error)
      throw new Error(message)
    }
  },

  /**
   * Deleta uma conversa específica
   * 
   * @param conversationId - ID da conversa
   * @param userId - ID do usuário (validação)
   * @returns Promise com resultado
   */
  async deleteConversation(
    conversationId: number,
    userId: number
  ): Promise<void> {
    try {
      await api.delete(`/api/bot/conversation/${conversationId}`, {
        data: { user_id: userId },
      })
    } catch (error) {
      const message = getErrorMessage(error)
      throw new Error(message)
    }
  },

  /**
   * Busca estatísticas do usuário
   * 
   * @param userId - ID do usuário
   * @returns Promise com estatísticas
   */
  async getStatistics(userId: number): Promise<StatisticsResponse> {
    try {
      const response = await api.get<StatisticsResponse>(
        `/api/bot/stats?user_id=${userId}`
      )
      return response.data
    } catch (error) {
      const message = getErrorMessage(error)
      throw new Error(message)
    }
  },

  /**
   * Limpa todo histórico do usuário
   * 
   * @param userId - ID do usuário
   * @returns Promise com número de conversas deletadas
   */
  async clearHistory(userId: number): Promise<number> {
    try {
      const response = await api.delete<{ deleted_count: number }>(
        '/api/bot/history/clear',
        {
          data: { user_id: userId },
        }
      )
      return response.data.deleted_count
    } catch (error) {
      const message = getErrorMessage(error)
      throw new Error(message)
    }
  },
}
