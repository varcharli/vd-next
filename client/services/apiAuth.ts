import api from './api';
import { User } from './apiUser';
const tokenKey = 'local_token';

export interface AuthResponse {
    ok: boolean;
    message?: string;
}

export const auth = {
    async login(name: string, password: string): Promise<AuthResponse> {
        const response = await api.post('/auth/login', { name, password });
        const data = response.data;
        const token = data.access_token;
        console.log('token---', token);
        if (token) {
            this.saveToken(token);
            return { ok: true, message: 'Login successful' };
        } else {
            this.deleteToken();
            return { ok: false, message: response.data?.message };
        }
    },
    // async register(username: string, password: string): Promise<AuthResponse> {
    //     const response = await api.post('/auth/register', { username, password });
    //     return response.data;
    // },
    async me(): Promise<User> {
        const response = await api.get('/auth/me');
        return response.data;
    },
    saveToken(token: string) {
        localStorage.setItem(tokenKey, token);
    },
    getToken() {
        return localStorage.getItem(tokenKey);
    },
    deleteToken() {
        localStorage.removeItem(tokenKey);
    },
    logout() {
        this.deleteToken();
        window.location.href = '/login';
    },
    async changePassword(oldPassword: string, newPassword: string): Promise<AuthResponse> {
        const response = await api.post('/auth/change-password', { oldPassword, newPassword });
        return response.data;
    }

};