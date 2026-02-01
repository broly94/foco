import api from '@/lib/axios';

export class ApiMarketingStrategy {
    static async search(keyword?: string, location?: string) {
        try {
            const response = await api.get('/marketing-strategy/search', {
                params: { keyword, location },
            });
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message.split(' :: ')[1] || 'Error al buscar estrategias';
            throw new Error(errorMessage);
        }
    }

    static async getAll() {
        try {
            const response = await api.get('/marketing-strategy/get-all');
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message.split(' :: ')[1] || 'Error al obtener estrategias';
            throw new Error(errorMessage);
        }
    }

    static async getMyStrategy() {
        try {
            const response = await api.get('/marketing-strategy/my-strategy');
            return response.data;
        } catch (error: any) {
            return null; // Si no tiene estrategia, devolvemos null en lugar de error
        }
    }

    static async create(data: any) {
        try {
            const response = await api.post('/marketing-strategy/create', data);
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message.split(' :: ')[1] || 'Error al crear la estrategia';
            throw new Error(errorMessage);
        }
    }

    static async getById(id: number) {
        try {
            const response = await api.get(`/marketing-strategy/${id}`);
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message.split(' :: ')[1] || 'Error al obtener la estrategia';
            throw new Error(errorMessage);
        }
    }
}
