import { useQuery } from '@tanstack/react-query';
import { ApiMarketingStrategy } from '@/lib/api/marketing-strategy.api';

export function useSearchStrategies(keyword?: string, location?: string) {
    return useQuery({
        queryKey: ['strategies', 'search', keyword, location],
        queryFn: () => ApiMarketingStrategy.search(keyword, location),
        enabled: true, // Siempre habilitado, si no hay params trae todo o lo que el backend decida
    });
}

export function useAllStrategies() {
    return useQuery({
        queryKey: ['strategies', 'all'],
        queryFn: () => ApiMarketingStrategy.getAll(),
    });
}

export function useStrategyById(id: number) {
    return useQuery({
        queryKey: ['strategies', id],
        queryFn: () => ApiMarketingStrategy.getById(id),
        enabled: !!id,
    });
}
export function useMyStrategy() {
    return useQuery({
        queryKey: ['strategies', 'my'],
        queryFn: ApiMarketingStrategy.getMyStrategy,
    });
}
