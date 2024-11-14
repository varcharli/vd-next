import api from './api';
import { Movie } from './apiMovie';

export interface DownloadLink {
    id: number;
    name?: string;
    url: string;
    movie?: Movie;
}

const path = '/download-links';

export const downloadLink = {
    async get(movieId: number) {
        return await api.get(`/movies/${movieId}/${path}`);
    },
    async create(data: DownloadLink) {
        if(!data.name){
            data.name = '';
        }
        const re = await api.post(path, data);
        const link = re.data as DownloadLink;
        return link;

    },
    async update(id: number, data: DownloadLink) {
        const re = await api.put(`${path}/${id}`, data);
        return re;
    },
    async delete(id: number) {
        return await api.delete(`${path}/${id}`);
    },
};

