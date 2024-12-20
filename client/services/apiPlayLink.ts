import api from './api';
import { Movie } from './apiMovie';

export interface PlayLink {
    id: number;
    name: string;
    url: string;
    movie: Movie;
}

export const playLink = {
    async get(movieId: number) {
        return await api.get(`/movies/${movieId}/play-links`);
    },
    async create(data: PlayLink) {
        return await api.post('/play-links', data);
    },
    async update(id: number, data: PlayLink) {
        const re= await api.put(`/play-links/${id}`, data);
        return re;
    },
    async delete(id: number) {
        return await api.delete(`/play-links/${id}`);
    },
};

