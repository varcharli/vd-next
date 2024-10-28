import api from './api';

export interface Actor {
    id: number;
    name: string;
    description: string | undefined;
    photoUrl: string | undefined;
}

interface actorGetParams {
    limit?: number;
    page?: number;
    title?: string;
    order?: string;
}

export const actor = {
    async get({ page, limit, title, order }: actorGetParams = {}) {
        const defaultPageSize = 28;
        const offset = ((page || 1) - 1) * (limit || defaultPageSize);

        return await api.get('/actors', {
            params: {
                offset,
                limit,
                title,
                order,
            },

        });
    },
    async getById(id: number)  {
        return await api.get(`/actors/${id}`);
    }
};