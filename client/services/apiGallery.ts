import api from './api';
import { Movie } from './apiMovie';

export interface Gallery {
    id: number;
    url: string;
    movie: Movie;
}

const path='/galleries';

export const gallery = {

    
    async get() {
        return await api.get(path);
    },
    async getById(id: number) {
        return await api.get(`${path}/${id}`);
    },
    async create(data: Gallery) {
        const re= await api.post(path, data);
        const gallery = re.data as Gallery;
        return gallery;
    },
    async update(id: number, data: Gallery) {
        return await api.put(`${path}/${id}`, data);
    },
    async delete(id: number) {
        return await api.delete(`${path}/${id}`);
    },
};