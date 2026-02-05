/**
 * Card de Conversa no Histórico
 * 
 * Exibe preview da conversa com ações (ver detalhes, deletar)
 */

'use client'

import { useState } from 'react'
import { formatDate } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Trash2, Clock, AlertCircle } from 'lucide-react'
import type { HistoryConversation } from '@/services/historyService'

interface HistoryCardProps {
  conversation: HistoryConversation
  onDelete: (id: number) => Promise<boolean>
}

export function HistoryCard({ conversation, onDelete }: HistoryCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    const success = await onDelete(conversation.id)
    
    if (success) {
      setShowDeleteDialog(false)
    }
    
    setDeleting(false)
  }

  // Cor do badge baseado na fonte
  const getSourceColor = (fonte: string) => {
    if (!fonte) return 'secondary'
    if (fonte.includes('google')) return 'default'
    if (fonte.includes('wolfram')) return 'secondary'
    return 'outline'
  }

  return (
    <>
      <Card className="hover:bg-accent/50 transition-colors">
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header com fonte e status */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                {conversation.fonte && (
                  <Badge variant={getSourceColor(conversation.fonte)}>
                    {conversation.fonte}
                  </Badge>
                )}
                {conversation.status === 'error' && (
                  <Badge variant="destructive" className="gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Erro
                  </Badge>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Pergunta */}
            <div>
              <p className="font-medium text-foreground line-clamp-2">
                {conversation.pergunta}
              </p>
            </div>

            {/* Resposta Preview */}
            <div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {conversation.resposta_preview}
              </p>
            </div>

            {/* Footer com data e tempo */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatDate(conversation.created_at)}</span>
              
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{conversation.tempo_processamento.toFixed(2)}s</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deletar conversa?</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. A conversa será permanentemente deletada.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm font-medium line-clamp-2">
              {conversation.pergunta}
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deletando...' : 'Deletar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
