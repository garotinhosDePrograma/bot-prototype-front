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

export default function LoginPage() {
    const router = useRouter()
    const { login } = useAuth()

    // State do formulário
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    /**
     * Submete o formulário
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault() // Previne reload da página

        // Limpa erro anterior
        setError('')
        setIsLoading(true)

        try {
            // Chama API de login
            const data = await authService.login({ email, senha })

            // Salva no context
            login(data)

            // Redireciona para dashboard
            router.push('/dashboard')
        } catch (err) {
            // Mostra erro
            setError(err instanceof Error ? err.message : 'Erro ao fazer login')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            {/* Container centralizado */}
            <div className="w-full max-w-md">
                {/* Logo/Header */}
                <div className="text-center mb-8 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                        <Bot className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">Bot Worker</h1>
                    <p className="text-muted-foreground mt-2">
                        Chatbot inteligente multi-fonte
                    </p>
                </div>

                {/* Card de Login */}
                <Card className="animate-slide-up">
                    <CardHeader>
                        <CardTitle>Entrar</CardTitle>
                        <CardDescription>
                            Entre com sua conta para continuar
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                    placeholder="••••••••"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
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
                                        Entrando...
                                    </>
                                ) : (
                                    'Entrar'
                                )}
                            </Button>
                        </form>

                        {/* Link para Registro */}
                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            Não tem uma conta?{' '}
                            <Link
                                href="/register"
                                className="text-primary hover:underline font-medium"
                            >
                                Criar conta
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <p className="text-center text-sm text-muted-foreground mt-8">
                    um projeto ai
                </p>
            </div>
        </div>
    )
}