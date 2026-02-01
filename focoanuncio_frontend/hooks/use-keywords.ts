import { useQuery } from '@tanstack/react-query';
import { ApiKeywords } from '@/lib/api/keywords.api';

export function useKeywords() {
    return useQuery({
        queryKey: ['keywords'],
        queryFn: ApiKeywords.getKeywords,
    });
}
