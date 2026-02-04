/**
 * Context de Autenticação
 * 
 * O que é Context?
 * - Permite compartilhar dados entre componentes sem passar props
 * - Como uma "variável global" do React
 * 
 * Este context guarda:
 * - Usuário logado
 * - Token JWT
 * - Funções de login/logout
 */

'use client' // Indica que roda no browser (não no servidor)

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, AuthResponse } from '@/types'

/**
 * Tipo do contexto
 * Define quais dados/funções estarão disponíveis
 */
interface AuthContextType {
  user: User | null              // Usuário logado (null se deslogado)
  token: string | null            // JWT token
  login: (data: AuthResponse) => void   // Função para logar
  logout: () => void              // Função para deslogar
  isLoading: boolean              // Carregando dados do localStorage
}

/**
 * Cria o Context
 * undefined = valor inicial (antes de ter provider)
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Provider - Componente que fornece os dados
 * Envolve a aplicação toda
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  /**
   * useEffect - Roda quando componente monta
   * Aqui: Recupera dados salvos do localStorage
   */
  useEffect(() => {
    // Recupera token e user salvos
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      try {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      } catch (error) {
        // Se JSON inválido, limpa tudo
        console.error('Erro ao recuperar dados:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }

    setIsLoading(false)
  }, []) // [] = roda apenas 1 vez (quando monta)

  /**
   * Função de Login
   * Salva token e user no state e localStorage
   */
  const login = (data: AuthResponse) => {
    setToken(data.token)
    setUser(data.user)

    // Salva no localStorage (persiste entre sessões)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  /**
   * Função de Logout
   * Limpa tudo
   */
  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  /**
   * Valor fornecido para componentes filhos
   */
  const value = {
    user,
    token,
    login,
    logout,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook customizado para usar o contexto
 * 
 * Uso em componentes:
 * const { user, login, logout } = useAuth()
 */
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }

  return context
}