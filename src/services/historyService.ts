/**
 * API Service - Histórico de Conversas
 * 
 * Endpoints para gerenciar histórico do bot
 */

import api from './api'

export interface HistoryConversation {
  id: number
  user_id: number
  pergunta: string
  resposta_preview: string
  fonte: string
  tempo_processamento: number
  status: 'success' | 'error'
  created_at: string
}

export interface HistoryResponse {
  status: string
  conversations: HistoryConversation[]
  pagination: {
    total: number
    limit: number
    offset: number
    has_more: boolean
  }
}

export interface SearchResponse {
  status: string
  query: string
  results: HistoryConversation[]
  total: number
}

export interface ConversationDetail {
  id: number
  user_id: number
  pergunta: string
  resposta: string
  fonte: string
  tempo_processamento: number
  status: string
  metadata: Record<string, any>
  created_at: string
}

/**
 * Busca histórico de conversas com paginação
 */
export const getHistory = async (
  userId: number,
  limit: number = 20,
  offset: number = 0
): Promise<HistoryResponse> => {
  const response = await api.get('/bot/history', {
    params: { user_id: userId, limit, offset }
  })
  return response.data
}

/**
 * Busca conversas por palavra-chave
 */
export const searchConversations = async (
  userId: number,
  query: string,
  limit: number = 20
): Promise<SearchResponse> => {
  const response = await api.get('/bot/search', {
    params: { user_id: userId, q: query, limit }
  })
  return response.data
}

/**
 * Busca detalhes completos de uma conversa
 */
export const getConversationDetail = async (
  conversationId: number
): Promise<{ status: string; conversation: ConversationDetail }> => {
  const response = await api.get(`/bot/conversation/${conversationId}`)
  return response.data
}

/**
 * Deleta uma conversa específica
 */
export const deleteConversation = async (
  conversationId: number,
  userId: number
): Promise<{ status: string; message: string }> => {
  const response = await api.delete(`/bot/conversation/${conversationId}`, {
    data: { user_id: userId }
  })
  return response.data
}

/**
 * Limpa todo o histórico do usuário
 */
export const clearHistory = async (
  userId: number
): Promise<{ status: string; message: string; deleted_count: number }> => {
  const response = await api.delete('/bot/history/clear', {
    data: { user_id: userId }
  })
  return response.data
}

export default {
  getHistory,
  searchConversations,
  getConversationDetail,
  deleteConversation,
  clearHistory
}
