/**
 * MessageBubble - Bolha de mensagem individual
 * 
 * Componente que renderiza uma mensagem do chat
 * Estilo diferente para usuário vs bot
 */

import { ChatMessage } from '@/types'
import { cn, formatProcessingTime } from '@/lib/utils'
import { Bot, User, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface MessageBubbleProps {
  message: ChatMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.type === 'user'
  const isBot = message.type === 'bot'
  const isError = message.metadata?.error

  return (
    <div
      className={cn(
        'flex gap-3 mb-4 animate-slide-up',
        isUser && 'flex-row-reverse'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
          isUser ? 'bg-primary' : 'bg-card border'
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-primary-foreground" />
        ) : (
          <Bot className="w-4 h-4 text-foreground" />
        )}
      </div>

      {/* Mensagem */}
      <div
        className={cn(
          'flex flex-col max-w-[80%] md:max-w-[70%]',
          isUser && 'items-end'
        )}
      >
        {/* Bolha */}
        <div
          className={cn(
            'rounded-2xl px-4 py-3',
            isUser
              ? 'bg-primary text-primary-foreground rounded-br-sm'
              : 'bg-card border rounded-bl-sm',
            isError && 'border-destructive bg-destructive/10 text-destructive'
          )}
        >
          {message.isLoading ? (
            // Loading state
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Pensando...</span>
            </div>
          ) : (
            // Conteúdo da mensagem
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </p>
          )}
        </div>

        {/* Metadata (fonte, tempo) */}
        {isBot && message.metadata && !message.isLoading && (
          <div className="flex items-center gap-2 mt-1 px-1">
            {message.metadata.source && (
              <Badge variant="outline" className="text-xs">
                {message.metadata.source}
              </Badge>
            )}
            
            {message.metadata.processing_time !== undefined && (
              <span className="text-xs text-muted-foreground">
                {formatProcessingTime(message.metadata.processing_time)}
              </span>
            )}
          </div>
        )}

        {/* Timestamp */}
        <span className="text-xs text-muted-foreground mt-1 px-1">
          {message.timestamp.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  )
}
