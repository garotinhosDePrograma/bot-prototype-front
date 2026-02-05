/**
 * Layout Raiz da Aplicação
 * 
 * Este componente envolve TODAS as páginas
 * Aqui configuramos:
 * - Metadados (título, descrição)
 * - Fontes
 * - Providers (Auth, Theme, etc)
 * - Estilos globais
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

/**
 * Configuração da fonte Inter (Google Fonts)
 * subset: 'latin' = apenas caracteres latinos (menor tamanho)
 */
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

/**
 * Metadados da aplicação
 * Aparece no <head> do HTML
 */
export const metadata: Metadata = {
  title: 'Proto Bot - Chatbot Inteligente',
  description: 'Chatbot inteligente com busca em múltiplas fontes de conhecimento',
  keywords: ['chatbot', 'ia', 'bot', 'assistente virtual'],
  authors: [{ name: 'Luiz' }],
  // Cor do tema (mobile)
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0f' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
}

/**
 * Layout Raiz
 * 
 * Conceitos:
 * - children: Conteúdo das páginas (vai mudar)
 * - RootLayout: Sempre presente em todas as páginas
 * - Providers: Envolvem children para dar acesso global
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      {/* 
        className="dark" força modo escuro
        Remove se quiser light mode por padrão
      */}
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </Head>
      <body className={inter.className}>
        {/* 
          AuthProvider envolve toda aplicação
          Agora qualquer componente pode usar useAuth()
        */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
