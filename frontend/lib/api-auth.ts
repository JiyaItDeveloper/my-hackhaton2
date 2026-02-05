import { User, Todo, TodoCreate, TodoUpdate } from '@/types/todo';
import { getToken, storeToken, removeToken } from './token-storage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Helper function to make authenticated API requests
const authenticatedRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// AUTHENTICATION API FUNCTIONS
export const registerUser = async (userData: { email: string; password: string; name?: string }) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Registration failed');
  }

  return response.json();
};

export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Login failed');
  }

  const data = await response.json();

  // Store the token for future requests
  if (data.access_token) {
    storeToken(data.access_token);
  }

  return data;
};

export const logoutUser = async () => {
  // In a real implementation, you might want to call a backend logout endpoint
  // For now, we just remove the token from localStorage
  removeToken();
};

// USER MANAGEMENT
export const getCurrentUser = async (): Promise<User> => {
  return authenticatedRequest('/auth/me');
};

// TODO MANAGEMENT
export const getUserTodos = async (): Promise<Todo[]> => {
  return authenticatedRequest('/tasks');
};

export const createTodo = async (todoData: TodoCreate): Promise<Todo> => {
  return authenticatedRequest('/tasks', {
    method: 'POST',
    body: JSON.stringify(todoData),
  });
};

export const getTodoById = async (id: string): Promise<Todo> => {
  return authenticatedRequest(`/tasks/${id}`);
};

export const updateTodo = async (id: string, todoData: TodoUpdate): Promise<Todo> => {
  return authenticatedRequest(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(todoData),
  });
};

export const deleteTodo = async (id: string): Promise<void> => {
  await authenticatedRequest(`/tasks/${id}`, {
    method: 'DELETE',
  });
};

export const toggleTodo = async (id: string): Promise<Todo> => {
  return authenticatedRequest(`/tasks/${id}/complete`, {
    method: 'PATCH',
  });
};