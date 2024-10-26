import api from './api';

export interface Movie {
    releaseDate: string;
    posterUrl: string | undefined;
    id: number;
    name: string;
    description: string;
    sn: string;
}


export const movie= {
    async get() {
        return await api.get('/movies');
    },
    async getById(id: string) {
        return await api.get(`/movies/${id}`);
    },
    async create(data: Movie ) {
        return await api.post('/movies', data);
    },
    async update(id: string, data: Movie) {
        return await api.put(`/movies/${id}`, data);
    },
    async delete(id: string) {
        return await api.delete(`/movies/${id}`);
    },
};

