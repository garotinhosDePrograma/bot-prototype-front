/**
 * Hook customizado para gerenciar histórico de conversas
 * 
 * Gerencia estado, paginação, busca e deleção
 */

import { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '@/contexts/AuthContext'
import * as historyService from '@/services/historyService'
import type { HistoryConversation } from '@/services/historyService'

export function useHistory() {
  const { user } = useAuthStore()
  
  const [conversations, setConversations] = useState<HistoryConversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Paginação
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)
  const limit = 20
  
  // Busca
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  /**
   * Carrega histórico com paginação
   */
  const loadHistory = useCallback(async (pageNum: number = 0) => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)
      
      const offset = pageNum * limit
      const data = await historyService.getHistory(user.id, limit, offset)
      
      if (pageNum === 0) {
        setConversations(data.conversations)
      } else {
        setConversations(prev => [...prev, ...data.conversations])
      }
      
      setTotal(data.pagination.total)
      setHasMore(data.pagination.has_more)
      setPage(pageNum)
      
    } catch (err: any) {
      console.error('Erro ao carregar histórico:', err)
      setError(err.response?.data?.error || 'Erro ao carregar histórico')
    } finally {
      setLoading(false)
    }
  }, [user, limit])

  /**
   * Busca conversas por palavra-chave
   */
  const search = useCallback(async (query: string) => {
    if (!user || !query.trim()) {
      loadHistory(0)
      return
    }

    try {
      setIsSearching(true)
      setLoading(true)
      setError(null)
      
      const data = await historyService.searchConversations(user.id, query, 50)
      
      setConversations(data.results)
      setTotal(data.total)
      setHasMore(false) // Busca não tem paginação
      setSearchQuery(query)
      
    } catch (err: any) {
      console.error('Erro na busca:', err)
      setError(err.response?.data?.error || 'Erro ao buscar conversas')
    } finally {
      setLoading(false)
      setIsSearching(false)
    }
  }, [user, loadHistory])

  /**
   * Limpa busca e volta para histórico normal
   */
  const clearSearch = useCallback(() => {
    setSearchQuery('')
    loadHistory(0)
  }, [loadHistory])

  /**
   * Carrega próxima página
   */
  const loadMore = useCallback(() => {
    if (!loading && hasMore && !searchQuery) {
      loadHistory(page + 1)
    }
  }, [loading, hasMore, page, searchQuery, loadHistory])

  /**
   * Deleta uma conversa
   */
  const deleteConversation = useCallback(async (conversationId: number) => {
    if (!user) return

    try {
      await historyService.deleteConversation(conversationId, user.id)
      
      // Remove da lista local
      setConversations(prev => prev.filter(c => c.id !== conversationId))
      setTotal(prev => prev - 1)
      
      return true
    } catch (err: any) {
      console.error('Erro ao deletar conversa:', err)
      setError(err.response?.data?.error || 'Erro ao deletar conversa')
      return false
    }
  }, [user])

  /**
   * Limpa todo o histórico
   */
  const clearAllHistory = useCallback(async () => {
    if (!user) return

    try {
      await historyService.clearHistory(user.id)
      
      setConversations([])
      setTotal(0)
      setHasMore(false)
      setPage(0)
      
      return true
    } catch (err: any) {
      console.error('Erro ao limpar histórico:', err)
      setError(err.response?.data?.error || 'Erro ao limpar histórico')
      return false
    }
  }, [user])

  /**
   * Recarrega histórico
   */
  const refresh = useCallback(() => {
    if (searchQuery) {
      search(searchQuery)
    } else {
      loadHistory(0)
    }
  }, [searchQuery, search, loadHistory])

  // Carrega histórico inicial
  useEffect(() => {
    loadHistory(0)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    // Estado
    conversations,
    loading,
    error,
    total,
    hasMore,
    searchQuery,
    isSearching,
    
    // Ações
    search,
    clearSearch,
    loadMore,
    deleteConversation,
    clearAllHistory,
    refresh
  }
}
