// utils/apiClient.ts
const PYTHON_API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:5000';

interface RequestOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  isAuth?: boolean;
}

export async function apiClient(endpoint: string, options: RequestOptions = {}) {
  const {
    method = 'GET',
    body,
    headers = {},
    isAuth = true,
  } = options;

  const reqHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Add token for authenticated requests
  if (isAuth && typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      reqHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    method,
    headers: reqHeaders,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${PYTHON_API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

// Helper methods
export const api = {
  get: (endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) => 
    apiClient(endpoint, { ...options, method: 'GET' }),
  
  post: (endpoint: string, body: any, options?: Omit<RequestOptions, 'method'>) => 
    apiClient(endpoint, { ...options, method: 'POST', body }),
  
  put: (endpoint: string, body: any, options?: Omit<RequestOptions, 'method'>) => 
    apiClient(endpoint, { ...options, method: 'PUT', body }),
  
  delete: (endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) => 
    apiClient(endpoint, { ...options, method: 'DELETE' }),
};