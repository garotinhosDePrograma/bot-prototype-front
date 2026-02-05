/**
 * useChat - Hook customizado para gerenciar o chat
 * 
 * Centraliza toda lógica do chat:
 * - Histórico de mensagens
 * - Enviar pergunta
 * - Loading states
 * - Erros
 * 
 * Hooks customizados permitem reutilizar lógica entre componentes
 */

'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { botService } from '@/services/bot.service'
import { ChatMessage } from '@/types'

/**
 * Hook useChat
 * 
 * Uso:
 * const { messages, sendMessage, isLoading } = useChat()
 */
export function useChat() {
  const { user } = useAuth()
  
  // State das mensagens
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      type: 'bot',
      content: 'Olá! Sou o Proto Bot. Faça uma pergunta e vou buscar a melhor resposta em múltiplas fontes!',
      timestamp: new Date(),
    },
  ])
  
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Envia uma pergunta ao bot
   */
  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    // Adiciona mensagem do usuário
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Adiciona mensagem de loading do bot
    const loadingMessage: ChatMessage = {
      id: `loading-${Date.now()}`,
      type: 'bot',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    }

    setMessages((prev) => [...prev, loadingMessage])

    try {
      // Chama API
      const response = await botService.askQuestion({
        pergunta: content.trim(),
        user_id: user?.id, // Opcional, mas salva no histórico se fornecido
      })

      // Remove mensagem de loading
      setMessages((prev) => prev.filter((msg) => msg.id !== loadingMessage.id))

      // Adiciona resposta do bot
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: response.response,
        timestamp: new Date(),
        metadata: {
          source: response.source,
          processing_time: response.processing_time,
        },
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      // Remove loading
      setMessages((prev) => prev.filter((msg) => msg.id !== loadingMessage.id))

      // Adiciona mensagem de erro
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: 'bot',
        content:
          error instanceof Error
            ? error.message
            : 'Desculpe, ocorreu um erro ao processar sua pergunta.',
        timestamp: new Date(),
        metadata: {
          error: true,
        },
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Limpa o chat
   */
  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        type: 'bot',
        content: 'Chat limpo! Pronto para novas perguntas.',
        timestamp: new Date(),
      },
    ])
  }

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
  }
}
