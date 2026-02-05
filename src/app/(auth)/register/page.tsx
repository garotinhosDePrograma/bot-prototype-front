/**
 * Página de Registro
 * 
 * Formulário para criar nova conta
 * Similar ao login, mas com campo extra (nome)
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { authService } from '@/services/auth.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bot, Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()

  // State do formulário
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  /**
   * Valida senhas
   */
  const validatePasswords = (): boolean => {
    if (senha.length < 6) {
      setError('Senha deve ter no mínimo 6 caracteres')
      return false
    }

    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem')
      return false
    }

    return true
  }

  /**
   * Submete o formulário
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setError('')

    // Valida senhas antes de enviar
    if (!validatePasswords()) {
      return
    }

    setIsLoading(true)

    try {
      // Chama API de registro
      const data = await authService.register({ nome, email, senha })
      
      // Faz login automático após registro
      login(data)
      
      // Redireciona para dashboard
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
            <Bot className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Proto Bot</h1>
          <p className="text-muted-foreground mt-2">
            Crie sua conta e comece a usar
          </p>
        </div>

        {/* Card de Registro */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle>Criar Conta</CardTitle>
            <CardDescription>
              Preencha os dados para criar sua conta
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campo Nome */}
              <div className="space-y-2">
                <label htmlFor="nome" className="text-sm font-medium text-foreground">
                  Nome
                </label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Seu nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Campo Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Campo Senha */}
              <div className="space-y-2">
                <label htmlFor="senha" className="text-sm font-medium text-foreground">
                  Senha
                </label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  disabled={isLoading}
                  required
                  minLength={6}
                />
              </div>

              {/* Campo Confirmar Senha */}
              <div className="space-y-2">
                <label htmlFor="confirmarSenha" className="text-sm font-medium text-foreground">
                  Confirmar Senha
                </label>
                <Input
                  id="confirmarSenha"
                  type="password"
                  placeholder="Digite a senha novamente"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Mensagem de Erro */}
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Botão Submit */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  'Criar Conta'
                )}
              </Button>
            </form>

            {/* Link para Login */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Já tem uma conta?{' '}
              <Link
                href="/login"
                className="text-primary hover:underline font-medium"
              >
                Fazer login
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Ao criar uma conta, você concorda com nossos Termos de Uso
        </p>
      </div>
    </div>
  )
}
