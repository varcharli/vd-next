import api from './api';

export interface Movie {
    releaseDate: string;
    posterUrl: string | undefined;
    bigPosterUrl: string | undefined;
    id: number;
    name: string;
    description: string;
    sn: string;
}

interface movieGetParams {
    limit?: number;
    offset?: number;
    title?: string;
    order?: string;
}

export const movie = {
    async get({ offset, limit, title, order }: movieGetParams = {}) {
        return await api.get('/movies', {
            params: {
                offset,
                limit,
                title,
                order,
            },
        });
    },
    async getById(id: number) {
        return await api.get(`/movies/${id}`);
    },
    async create(data: Movie) {
        return await api.post('/movies', data);
    },
    async update(id: number, data: Movie) {
        return await api.put(`/movies/${id}`, data);
    },
    async delete(id: number) {
        return await api.delete(`/movies/${id}`);
    },
};

