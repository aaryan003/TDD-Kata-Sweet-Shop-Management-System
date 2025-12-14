import api from '@/lib/api';
import { Sweet, SweetsResponse, SingleSweetResponse } from '@/types';

export const sweetService = {
  async getAll(): Promise<Sweet[]> {
    const response = await api.get<SweetsResponse>('/sweets');
    return response.data.data;
  },

  async search(params: {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Sweet[]> {
    const queryParams = new URLSearchParams();
    
    if (params.name) queryParams.append('name', params.name);
    if (params.category) queryParams.append('category', params.category);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());

    const response = await api.get<SweetsResponse>(`/sweets/search?${queryParams}`);
    return response.data.data;
  },

  async create(sweet: Omit<Sweet, '_id' | 'createdAt' | 'updatedAt'>): Promise<Sweet> {
    const response = await api.post<SingleSweetResponse>('/sweets', sweet);
    return response.data.data;
  },

  async update(id: string, updates: Partial<Sweet>): Promise<Sweet> {
    const response = await api.put<SingleSweetResponse>(`/sweets/${id}`, updates);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/sweets/${id}`);
  },

  async purchase(id: string, quantity: number): Promise<Sweet> {
    const response = await api.post<SingleSweetResponse>(`/sweets/${id}/purchase`, {
      quantity,
    });
    return response.data.data;
  },

  async restock(id: string, quantity: number): Promise<Sweet> {
    const response = await api.post<SingleSweetResponse>(`/sweets/${id}/restock`, {
      quantity,
    });
    return response.data.data;
  },
};