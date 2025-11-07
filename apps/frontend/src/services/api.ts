import axios from 'axios';
import type {
  Customer,
  CreateCustomerDto,
  UpdateCustomerDto,
  PaginatedResponse,
  Country,
  State,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Customer API
export const customerApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Customer>> => {
    const response = await api.get<PaginatedResponse<Customer>>('/customers', { params });
    return response.data;
  },

  getOne: async (id: string): Promise<Customer> => {
    const response = await api.get<Customer>(`/customers/${id}`);
    return response.data;
  },

  create: async (data: CreateCustomerDto): Promise<Customer> => {
    const response = await api.post<Customer>('/customers', data);
    return response.data;
  },

  update: async (id: string, data: UpdateCustomerDto): Promise<Customer> => {
    const response = await api.patch<Customer>(`/customers/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/customers/${id}`);
  },
};

// Country API
export const countryApi = {
  getAll: async (): Promise<Country[]> => {
    const response = await api.get<Country[]>('/countries');
    return response.data;
  },

  getOne: async (id: string): Promise<Country> => {
    const response = await api.get<Country>(`/countries/${id}`);
    return response.data;
  },
};

// State API
export const stateApi = {
  getAll: async (): Promise<State[]> => {
    const response = await api.get<State[]>('/states');
    return response.data;
  },

  getByCountry: async (countryId: string): Promise<State[]> => {
    const response = await api.get<State[]>(`/states?countryId=${countryId}`);
    return response.data;
  },
};

export default api;
