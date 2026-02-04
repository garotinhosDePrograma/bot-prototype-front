/**
 * Tipos TypeScript da Aplicação
 * 
 * Este arquivo centraliza todos os tipos/interfaces usados no projeto
 * 
 * Por que usar tipos?
 * - Autocomplete no VS Code/editor
 * - Erros antes de rodar o código
 * - Documentação automática
 * - Refatoração mais segura
 */

// ==================== AUTENTICAÇÃO ====================

/**
 * Dados do usuário autenticado
 */
export interface User {
  id: number
  nome: string
  email: string
}

/**
 * Resposta do login/register
 */
export interface AuthResponse {
  token: string
  user: User
}

/**
 * Payload para login
 */
export interface LoginRequest {
  email: string
  senha: string
}

/**
 * Payload para registro
 */
export interface RegisterRequest {
  nome: string
  email: string
  senha: string
}

// ==================== BOT / CONVERSAS ====================

/**
 * Uma conversa completa com o bot
 */
export interface Conversation {
  id: number
  user_id: number
  pergunta: string
  resposta: string
  fonte: string | null
  tempo_processamento: number
  status: 'success' | 'error'
  metadata?: ConversationMetadata
  created_at: string
}

/**
 * Versão resumida da conversa (para listagens)
 */
export interface ConversationSummary {
  id: number
  user_id: number
  pergunta: string
  resposta_preview: string
  fonte: string | null
  tempo_processamento: number
  status: 'success' | 'error'
  created_at: string
}

/**
 * Metadata adicional da conversa (JSON)
 */
export interface ConversationMetadata {
  logs_processo?: LogProcesso[]
  cache_usado?: boolean
  tipo_pergunta?: string
  intencao?: string
}

/**
 * Log de uma etapa do processo
 */
export interface LogProcesso {
  etapa: string
  timestamp: number
  [key: string]: any // Permite campos dinâmicos
}

/**
 * Payload para fazer pergunta
 */
export interface QuestionRequest {
  pergunta: string
  user_id?: number
}

/**
 * Resposta da pergunta
 */
export interface QuestionResponse {
  status: 'success' | 'error'
  query: string
  response: string
  source: string
  processing_time: number
  user_id?: number
  message?: string // Se houver erro
  logs_processo?: LogProcesso[]
}

/**
 * Resposta do histórico
 */
export interface HistoryResponse {
  status: 'success' | 'error'
  conversations: ConversationSummary[]
  pagination: {
    total: number
    limit: number
    offset: number
    has_more: boolean
  }
}

/**
 * Resposta de busca
 */
export interface SearchResponse {
  status: 'success' | 'error'
  query: string
  results: ConversationSummary[]
  total: number
}

// ==================== ESTATÍSTICAS ====================

/**
 * Estatísticas do usuário
 */
export interface UserStatistics {
  total_perguntas: number
  tempo_medio: number
  cache_hits: number
  taxa_cache: number
  sucessos: number
  erros: number
  taxa_sucesso: number
  fontes_mais_usadas: SourceUsage[]
}

/**
 * Uso de uma fonte específica
 */
export interface SourceUsage {
  fonte: string
  count: number
}

/**
 * Resposta de estatísticas
 */
export interface StatisticsResponse {
  status: 'success' | 'error'
  statistics: UserStatistics
}

// ==================== API GENÉRICO ====================

/**
 * Resposta padrão de erro da API
 */
export interface ApiError {
  error: string
  message?: string
}

/**
 * Resposta padrão de sucesso
 */
export interface ApiSuccess {
  status: 'success'
  message?: string
}

// ==================== CHAT UI ====================

/**
 * Mensagem do chat (UI)
 * Diferente de Conversation (que vem da API)
 */
export interface ChatMessage {
  id: string // Gerado no frontend (uuid)
  type: 'user' | 'bot' | 'system'
  content: string
  timestamp: Date
  isLoading?: boolean
  metadata?: {
    source?: string
    processing_time?: number
    error?: boolean
  }
}

/**
 * Estado do chat
 */
export interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
}

// ==================== PERGUNTAS RÁPIDAS ====================

/**
 * Pergunta pré-definida
 */
export interface QuickQuestion {
  id: string
  text: string
  category?: 'geral' | 'ciencia' | 'historia' | 'matematica'
}