import { ApiCategories } from '@/lib/api/categories.api';
import { useQuery } from '@tanstack/react-query';

export function useCategories() {
	return useQuery({
		queryKey: ['categories'],
		queryFn: async () => await ApiCategories.getCategories(),
		retry: false,
	});
}
