/**
 * Chat Page - Interface principal de conversação
 * 
 * Página onde usuário interage com o bot
 * Estilo ChatGPT: mensagens + input fixo embaixo
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useChat } from '@/hooks/useChat'
import { MessageBubble } from '@/components/chat/MessageBubble'
import { QuickQuestions } from '@/components/chat/QuickQuestions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, ArrowLeft, Trash2, Bot } from 'lucide-react'

export default function ChatPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { messages, isLoading, sendMessage, clearChat } = useChat()

  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  /**
   * Redireciona se não estiver logado
   */
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  /**
   * Auto-scroll para última mensagem
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  /**
   * Envia mensagem
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inputValue.trim() || isLoading) return

    await sendMessage(inputValue)
    setInputValue('') // Limpa input
  }

  /**
   * Clique em pergunta rápida
   */
  const handleQuickQuestion = async (question: string) => {
    await sendMessage(question)
  }

  // Loading inicial
  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse-soft">
          <Bot className="w-12 h-12 text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            
            <div>
              <h1 className="text-lg font-semibold text-foreground">Chat</h1>
              <p className="text-xs text-muted-foreground">
                Busca em múltiplas fontes
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={clearChat}
            disabled={isLoading}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Limpar
          </Button>
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Mensagens */}
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {/* Referência para scroll automático */}
          <div ref={messagesEndRef} />

          {/* Perguntas Rápidas (só mostra se chat vazio) */}
          {messages.length === 1 && (
            <div className="mt-8">
              <QuickQuestions
                onQuestionClick={handleQuickQuestion}
                disabled={isLoading}
              />
            </div>
          )}
        </div>
      </div>

      {/* Input Area (fixo embaixo) */}
      <div className="border-t bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua pergunta..."
              disabled={isLoading}
              className="flex-1"
              autoFocus
            />
            
            <Button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>

          {/* Hint */}
          <p className="text-xs text-muted-foreground text-center mt-2">
            Pressione Enter para enviar
          </p>
        </div>
      </div>
    </div>
  )
}
