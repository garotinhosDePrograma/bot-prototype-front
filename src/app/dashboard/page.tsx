/**
 * Dashboard - Página Principal (Autenticada)
 * 
 * Primeira página que o usuário vê após login
 * Mostra resumo de estatísticas e ações rápidas
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { botService } from '@/services/bot.service'
import { UserStatistics } from '@/types'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  MessageSquare,
  Clock,
  Zap,
  TrendingUp,
  MessageCircle,
  History,
  LogOut,
  Loader2,
} from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout, isLoading: authLoading } = useAuth()

  const [stats, setStats] = useState<UserStatistics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  /**
   * Redireciona se não estiver logado
   */
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  /**
   * Carrega estatísticas do usuário
   */
  useEffect(() => {
    const loadStats = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        const response = await botService.getStatistics(user.id)
        setStats(response.statistics)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas')
        console.error('Erro ao carregar stats:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [user])

  /**
   * Função de logout
   */
  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  // Loading state
  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Bem-vindo de volta, {user.nome}!
            </p>
          </div>
          
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Cards de Estatísticas */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-20" />
                <CardContent className="h-16" />
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : stats ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {/* Total de Perguntas */}
            <StatsCard
              title="Total de Perguntas"
              value={stats.total_perguntas}
              icon={MessageSquare}
              description="Todas as conversas"
            />

            {/* Tempo Médio */}
            <StatsCard
              title="Tempo Médio"
              value={`${stats.tempo_medio}s`}
              icon={Clock}
              description="Tempo de processamento"
            />

            {/* Cache Hits */}
            <StatsCard
              title="Cache"
              value={`${stats.taxa_cache}%`}
              icon={Zap}
              description={`${stats.cache_hits} respostas instantâneas`}
            />

            {/* Taxa de Sucesso */}
            <StatsCard
              title="Taxa de Sucesso"
              value={`${stats.taxa_sucesso}%`}
              icon={TrendingUp}
              description={`${stats.sucessos} de ${stats.total_perguntas}`}
            />
          </div>
        ) : null}

        {/* Grid de Ações e Info */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>
                Comece uma nova conversa ou veja seu histórico
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/chat">
                <Button className="w-full justify-start" size="lg">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Nova Conversa
                </Button>
              </Link>
              
              <Link href="/history">
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <History className="w-5 h-5 mr-2" />
                  Ver Histórico
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Fontes Mais Usadas */}
          {stats && stats.fontes_mais_usadas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Fontes Mais Usadas</CardTitle>
                <CardDescription>
                  APIs que mais responderam suas perguntas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.fontes_mais_usadas.map((fonte, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-sm font-medium capitalize">
                          {fonte.fonte}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {fonte.count} {fonte.count === 1 ? 'resposta' : 'respostas'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
