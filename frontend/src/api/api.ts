import { store } from '@/store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { auth } = store.getState();
  const token = auth.token;

  const config: RequestInit = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`,
    };
  }

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  // For DELETE requests, the server might not return a body
  if (options.method === 'DELETE' && response.status === 204) {
    return null as T;
  }
  
  if (response.headers.get('content-length') === '0' || response.status === 204) {
    return null as T;
  }

  return response.json();
}

export const get = <T>(endpoint: string): Promise<T> => request<T>(endpoint);
export const post = <T>(endpoint:string, body: any): Promise<T> => request<T>(endpoint, { method: 'POST', body });
export const put = <T>(endpoint: string, body: any): Promise<T> => request<T>(endpoint, { method: 'PUT', body });
export const del = <T>(endpoint: string): Promise<T> => request<T>(endpoint, { method: 'DELETE' }); 