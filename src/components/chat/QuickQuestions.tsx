/**
 * QuickQuestions - Botões de perguntas pré-definidas
 * 
 * Permite usuário clicar em perguntas prontas
 * Facilita primeiras interações
 */

import { Button } from '@/components/ui/button'
import { QuickQuestion } from '@/types'

/**
 * Lista de perguntas rápidas
 * Pode vir de uma API ou banco no futuro
 */
const QUICK_QUESTIONS: QuickQuestion[] = [
  {
    id: '1',
    text: 'Qual a capital da França?',
    category: 'geral',
  },
  {
    id: '2',
    text: 'Como funciona a fotossíntese?',
    category: 'ciencia',
  },
  {
    id: '3',
    text: 'Quem foi Albert Einstein?',
    category: 'historia',
  },
  {
    id: '4',
    text: 'Por que o céu é azul?',
    category: 'ciencia',
  },
  {
    id: '5',
    text: 'Quanto é 15% de 80?',
    category: 'matematica',
  },
]

interface QuickQuestionsProps {
  onQuestionClick: (question: string) => void
  disabled?: boolean
}

export function QuickQuestions({ onQuestionClick, disabled }: QuickQuestionsProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-muted-foreground">
        ⚡ Perguntas Rápidas
      </p>
      
      <div className="flex flex-wrap gap-2">
        {QUICK_QUESTIONS.map((q) => (
          <Button
            key={q.id}
            variant="outline"
            size="sm"
            onClick={() => onQuestionClick(q.text)}
            disabled={disabled}
            className="text-xs"
          >
            {q.text}
          </Button>
        ))}
      </div>
    </div>
  )
}
