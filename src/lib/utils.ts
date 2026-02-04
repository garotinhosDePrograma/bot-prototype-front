/**
 * Utilitários Gerais
 * 
 * Funções auxiliares usadas em toda a aplicação
 * 
 * Conceitos TypeScript aqui:
 * - type: Define um tipo customizado
 * - ClassValue: Tipo do clsx (aceita strings, arrays, objetos)
 */

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combina classes CSS de forma inteligente
 * 
 * O que faz:
 * 1. clsx: Combina classes condicionalmente
 * 2. twMerge: Remove conflitos do Tailwind
 * 
 * Exemplo:
 * cn("px-4 py-2", "px-6") // resultado: "py-2 px-6" (remove px-4)
 * cn("text-red-500", isError && "text-green-500") // condicional
 * 
 * @param inputs - Classes CSS (strings, arrays, objetos)
 * @returns String com classes mescladas
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formata data para exibição
 * 
 * @param date - Data ISO string ou Date object
 * @returns String formatada (ex: "29/01/2024 às 15:30")
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

/**
 * Formata tempo de processamento
 * 
 * @param seconds - Tempo em segundos
 * @returns String formatada (ex: "1.23s" ou "0.05s")
 */
export function formatProcessingTime(seconds: number): string {
  if (seconds < 0.01) {
    return '< 0.01s'
  }
  return `${seconds.toFixed(2)}s`
}

/**
 * Trunca texto longo com reticências
 * 
 * @param text - Texto para truncar
 * @param maxLength - Comprimento máximo
 * @returns Texto truncado
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }
  return text.substring(0, maxLength) + '...'
}

/**
 * Debounce: Atrasa execução de função
 * Útil para busca em tempo real (não fazer request a cada letra)
 * 
 * @param func - Função para executar
 * @param delay - Delay em ms
 * @returns Função com debounce
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Copia texto para clipboard
 * 
 * @param text - Texto para copiar
 * @returns Promise<boolean> - true se copiou com sucesso
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Erro ao copiar:', error)
    return false
  }
}

/**
 * Sleep: Espera X milissegundos
 * Útil para simular loading ou delays
 * 
 * Exemplo:
 * await sleep(1000) // espera 1 segundo
 * 
 * @param ms - Milissegundos para esperar
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
