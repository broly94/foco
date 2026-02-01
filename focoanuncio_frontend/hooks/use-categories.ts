import { useQuery } from '@tanstack/react-query';
import { ApiCategories } from '@/lib/api/categories.api';

export function useCategories() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: ApiCategories.getCategories,
    });
}
