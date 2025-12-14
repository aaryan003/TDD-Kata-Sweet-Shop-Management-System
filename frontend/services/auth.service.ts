import api from '@/lib/api';
import Cookies from 'js-cookie';
import { AuthResponse, User } from '@/types';

export const authService = {
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', {
      name,
      email,
      password,
    });
    
    if (response.data.success) {
      Cookies.set('token', response.data.data.token, { expires: 7 });
      Cookies.set('user', JSON.stringify(response.data.data.user), { expires: 7 });
    }
    
    return response.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    
    if (response.data.success) {
      Cookies.set('token', response.data.data.token, { expires: 7 });
      Cookies.set('user', JSON.stringify(response.data.data.user), { expires: 7 });
    }
    
    return response.data;
  },

  logout() {
    Cookies.remove('token');
    Cookies.remove('user');
    window.location.href = '/';
  },

  getCurrentUser(): User | null {
    const userStr = Cookies.get('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!Cookies.get('token');
  },

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  },
};