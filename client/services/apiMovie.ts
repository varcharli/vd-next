import api from './api';
import { Actor } from './apiActor';
import { Gallery } from './apiGallery';
import { PlayList } from './apiPlayList';
import { PlayLink } from './apiPlayLink';

export interface Movie {
    releaseDate: string;
    posterUrl: string | undefined;
    largePosterUrl: string | undefined;
    id: number;
    name: string;
    description: string;
    sn: string;
    actors: Actor[];
    galleries: Gallery[];
    playLists: PlayList[];
    playLinks:PlayLink[];
}

interface movieGetParams {
    limit?: number;
    page?: number;
    title?: string;
    order?: string;
    playListId?: number;
    actorId?: number;
}

export const movie = {
    async get({ page, limit, title, order,playListId,actorId }: movieGetParams = {}) {
        const defaultPageSize = 28;
        const offset = ((page || 1) - 1) * (limit || defaultPageSize);
        
        return await api.get('/movies', {
            params: {
                offset,
                limit,
                title,
                order,
                playListId,
                actorId
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
    async setPlayLists(id: number, playListIds: number[]) {
        return await api.post(`/movies/${id}/play-lists`, { playListIds });
    }
};

