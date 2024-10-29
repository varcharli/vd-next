import api from './api';

export interface User {
    id: number;
    name: string;
    isAdmin: boolean;
}

export const apiUser = {
    async get() {
        return await api.get('/users');
    },
    async getById(id: number) {
        return await api.get(`/users/${id}`);
    },
    async create(data: User) {
        return await api.post('/users', data);
    },
    async update(id: number, data: User) {
        return await api.put(`/users/${id}`, data);
    },
    async delete(id: number) {
        return await api.delete(`/users/${id}`);
    },
};