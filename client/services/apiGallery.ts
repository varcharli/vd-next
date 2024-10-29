import api from './api';

export interface Gallery {
    id: number;
    url: string;
    movieId: number;
}

export const gallery = {
    async get() {
        return await api.get('/gallery');
    },
    async getById(id: number) {
        return await api.get(`/gallery/${id}`);
    },
    async create(data: Gallery) {
        return await api.post('/gallery', data);
    },
    async update(id: number, data: Gallery) {
        return await api.put(`/gallery/${id}`, data);
    },
    async delete(id: number) {
        return await api.delete(`/gallery/${id}`);
    },
};