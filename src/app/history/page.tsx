/**
 * Página de Histórico de Conversas
 * 
 * Lista todas as conversas do usuário com:
 * - Busca por palavra-chave
 * - Paginação infinita
 * - Deletar conversas
 * - Limpar todo histórico
 */

'use client'

import { useState } from 'react'
import { useHistory } from '@/hooks/useHistory'
import { SearchBar } from '@/components/history/SearchBar'
import { HistoryCard } from '@/components/history/HistoryCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { History, Trash2, RefreshCw, Loader2, AlertCircle } from 'lucide-react'

export default function HistoryPage() {
  const {
    conversations,
    loading,
    error,
    total,
    hasMore,
    searchQuery,
    isSearching,
    search,
    clearSearch,
    loadMore,
    deleteConversation,
    clearAllHistory,
    refresh
  } = useHistory()

  const [showClearDialog, setShowClearDialog] = useState(false)
  const [clearing, setClearing] = useState(false)

  const handleClearAll = async () => {
    setClearing(true)
    const success = await clearAllHistory()
    
    if (success) {
      setShowClearDialog(false)
    }
    
    setClearing(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Histórico</h1>
                <p className="text-muted-foreground">
                  {total} {total === 1 ? 'conversa' : 'conversas'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={refresh}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>

              {total > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setShowClearDialog(true)}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Limpar tudo
                </Button>
              )}
            </div>
          </div>

          {/* Barra de Busca */}
          <SearchBar
            onSearch={search}
            onClear={clearSearch}
            placeholder="Buscar por pergunta ou resposta..."
          />

          {/* Info de busca */}
          {searchQuery && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Search className="h-4 w-4" />
              <span>
                Buscando por: <strong>{searchQuery}</strong>
                {!isSearching && ` (${conversations.length} resultados)`}
              </span>
            </div>
          )}
        </div>

        {/* Loading inicial */}
        {loading && conversations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">
              {isSearching ? 'Buscando...' : 'Carregando histórico...'}
            </p>
          </div>
        )}

        {/* Erro */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="flex items-center gap-3 p-4 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Lista de conversas */}
        {!loading && conversations.length > 0 && (
          <div className="space-y-3">
            {conversations.map((conversation) => (
              <HistoryCard
                key={conversation.id}
                conversation={conversation}
                onDelete={deleteConversation}
              />
            ))}

            {/* Botão carregar mais */}
            {hasMore && !searchQuery && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={loading}
                  className="gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Carregando...
                    </>
                  ) : (
                    'Carregar mais'
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!loading && conversations.length === 0 && !error && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
              <History className="h-12 w-12 text-muted-foreground" />
              <div className="text-center">
                <p className="font-medium">
                  {searchQuery ? 'Nenhum resultado encontrado' : 'Nenhuma conversa ainda'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery 
                    ? 'Tente buscar por outros termos' 
                    : 'Suas conversas com o bot aparecerão aqui'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog de Confirmação - Limpar Tudo */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Limpar todo o histórico?</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. Todas as suas {total} conversas 
              serão permanentemente deletadas.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-md">
            <p className="text-sm text-destructive font-medium">
              ⚠️ Atenção: Esta ação é irreversível!
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowClearDialog(false)}
              disabled={clearing}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleClearAll}
              disabled={clearing}
            >
              {clearing ? 'Limpando...' : 'Limpar tudo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
