import { type ClassValue, clsx} from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

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

export function formatProcessingTime(seconds: number): string {
    if (seconds < 0.01) {
        return '< 0.01s'
    }
    return `${seconds.toFixed(2)}s`
}

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
        return text
    }
    return text.substring(0, maxLength) + '...'
}

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

export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text)
        return true
    } catch (error) {
        console.error('Erro ao copiar', error)
        return false
    }
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}