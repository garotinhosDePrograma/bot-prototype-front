/**
 * Barra de Busca do Histórico
 * 
 * Input com debounce para buscar conversas
 */

'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { debounce } from '@/lib/utils'

interface SearchBarProps {
  onSearch: (query: string) => void
  onClear: () => void
  placeholder?: string
}

export function SearchBar({ 
  onSearch, 
  onClear, 
  placeholder = "Buscar conversas..." 
}: SearchBarProps) {
  const [value, setValue] = useState('')

  // Debounced search - só executa 500ms após parar de digitar
  useEffect(() => {
    const debouncedSearch = debounce((query: string) => {
      if (query.trim()) {
        onSearch(query)
      } else {
        onClear()
      }
    }, 500)

    debouncedSearch(value)
  }, [value, onSearch, onClear])

  const handleClear = () => {
    setValue('')
    onClear()
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9"
      />

      {value && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
