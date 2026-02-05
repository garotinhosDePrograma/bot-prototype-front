/**
 * Página Inicial (Landing Page)
 * 
 * Primeira página que usuários NÃO logados veem
 * Mostra botões para Login/Registro
 */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Bot, Zap, Shield, TrendingUp } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  /**
   * Se usuário já está logado, redireciona pro dashboard
   */
  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard')
    }
  }, [user, isLoading, router])

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse-soft">
          <Bot className="w-12 h-12 text-primary" />
        </div>
      </div>
    )
  }

  // Se não estiver logado, mostra landing page
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-3xl mb-6 animate-fade-in">
            <Bot className="w-10 h-10 text-primary" />
          </div>

          {/* Título */}
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 animate-slide-up">
            Proto Bot
          </h1>

          {/* Subtítulo */}
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-slide-up">
            Chatbot inteligente que busca respostas em múltiplas fontes de conhecimento.
            Wolfram Alpha, Google, Wikipedia e mais.
          </p>

          {/* Botões CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Começar Gratuitamente
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Fazer Login
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            {/* Feature 1 */}
            <div className="bg-card border rounded-lg p-6 animate-fade-in">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Respostas Rápidas
              </h3>
              <p className="text-sm text-muted-foreground">
                Busca paralela em múltiplas APIs para respostas em segundos
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card border rounded-lg p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Fontes Confiáveis
              </h3>
              <p className="text-sm text-muted-foreground">
                Informações de Wolfram Alpha, Google, Wikipedia e DuckDuckGo
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card border rounded-lg p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Histórico Completo
              </h3>
              <p className="text-sm text-muted-foreground">
                Todas suas conversas salvas com busca e estatísticas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>Feito com Next.js, TypeScript e Tailwind CSS</p>
        </div>
      </footer>
    </div>
  )
}
