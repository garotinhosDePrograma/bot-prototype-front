/**
 * StatsCard - Card para exibir uma estatística
 * 
 * Componente reutilizável para dashboard
 * Mostra ícone, título, valor e variação
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Props do componente
 * 
 * TypeScript: Define quais propriedades o componente aceita
 */
interface StatsCardProps {
  title: string           // Título do card
  value: string | number  // Valor principal
  icon: LucideIcon        // Ícone (do lucide-react)
  description?: string    // Descrição opcional
  trend?: {               // Tendência opcional (sobe/desce)
    value: number
    isPositive: boolean
  }
  className?: string      // Classes CSS extras
}

/**
 * Componente StatsCard
 * 
 * Exemplo de uso:
 * <StatsCard
 *   title="Total de Perguntas"
 *   value={50}
 *   icon={MessageSquare}
 *   description="Este mês"
 * />
 */
export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn('', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {/* Ícone */}
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      
      <CardContent>
        {/* Valor principal */}
        <div className="text-2xl font-bold">{value}</div>
        
        {/* Descrição ou Trend */}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        
        {trend && (
          <div className="flex items-center mt-1">
            <span
              className={cn(
                'text-xs font-medium',
                trend.isPositive ? 'text-accent' : 'text-destructive'
              )}
            >
              {trend.isPositive ? '+' : ''}
              {trend.value}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              vs. mês anterior
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
