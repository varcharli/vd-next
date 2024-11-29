import api from './api';
const path = '/scraper/logs';
export interface ScraperLog {
    id: number;
    name: string;
    log: string;
    time: string;
}

interface logGetParams {
    limit?: number;
    page?: number;
    name?: string;
}

export const scraperLog = {
    async get({ page, limit, name }: logGetParams = {}) {
        const defaultPageSize = 30;
        limit = limit || defaultPageSize;
        const offset = ((page || 1) - 1) * limit;

        return await api.get(path, {
            params: {
                offset,
                limit,
                name,
            },
        });
    },
    async getById(id: number)   {
        return await api.get(`${path}/${id}`);
    },
    async create(data: ScraperLog) {
        return await api.post(path, data);
    },
    async update(id: number, data: ScraperLog) {
        return await api.post(`${path}/${id}`, data);
    },
};