import api from './api';

export interface PlayList {
    id: number;
    name: string;
    totalCount: number;
    posterUrl: string;
    isSys: boolean;
    updatedAt: Date;
}

const prex = '/play-lists';

export const playList= {

    async get(): Promise<PlayList[]> {
        const response = await api.get(prex);
        return response.data;
    },
    async getById(id: number): Promise<PlayList> {
        const response = await api.get(`${prex}/${id}`);
        return response.data;
    },
    async create(name: string): Promise<PlayList> {
        const response = await api.post(prex, { name });
        return response.data;
    },
    async update(id: number, name: string): Promise<PlayList> {
        const response = await api.put(`${prex}/${id}`, { name });
        return response.data;
    },
    async delete(id: number): Promise<PlayList> {
        const response = await api.delete(`${prex}/${id}`);
        return response.data;
    },

    async addMovie(listId: number, movieId: number): Promise<PlayList> {
        const response = await api.post(`${prex}/${listId}/movies/${movieId}`);
        return response.data;
    },

    async removeMovie(listId: number, movieId: number): Promise<PlayList> {
        const response = await api.delete(`${prex}/${listId}/movies/${movieId}`);
        return response.data;
    },

};