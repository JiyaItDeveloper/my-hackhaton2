import { User, Todo, TodoCreate, TodoUpdate } from '@/types/todo';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Helper function to get the auth token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

// Helper function to make authenticated API requests with token refresh capability
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  let token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    let response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // If we get a 401 Unauthorized error, try to refresh the token or clear session
    if (response.status === 401) {
      // Clear the invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }

      // Throw a specific error for unauthorized access
      throw new Error('Session expired. Please sign in again.');
    }

    if (!response.ok) {
      // Handle error response - could be JSON or plain text
      let errorData;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
      } else {
        const errorText = await response.text().catch(() => `HTTP error! status: ${response.status}`);
        errorData = { message: errorText };
      }

      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      // Network error
      throw new Error('Failed to connect to server. Please check your connection and try again.');
    }
    throw error;
  }
};

// AUTHENTICATION API
export const registerUser = async (userData: { email: string; password: string; name?: string }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      // Handle error response - could be JSON or plain text
      let errorData;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json().catch(() => ({ detail: `HTTP error! status: ${response.status}` }));
      } else {
        const errorText = await response.text().catch(() => `HTTP error! status: ${response.status}`);
        errorData = { detail: errorText };
      }

      throw new Error(errorData.detail || 'Registration failed');
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      // Network error
      throw new Error('Failed to connect to server. Please check your connection and try again.');
    }
    throw error;
  }
};

export const loginUser = async (credentials: { email: string; password: string }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      // Handle error response - could be JSON or plain text
      let errorData;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json().catch(() => ({ detail: `HTTP error! status: ${response.status}` }));
      } else {
        const errorText = await response.text().catch(() => `HTTP error! status: ${response.status}`);
        errorData = { detail: errorText };
      }

      throw new Error(errorData.detail || 'Login failed');
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      // Network error
      throw new Error('Failed to connect to server. Please check your connection and try again.');
    }
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User> => {
  return apiRequest('/auth/me');
};

export const logoutUser = async () => {
  const token = getAuthToken();

  if (token) {
    try {
      // Call backend logout endpoint to invalidate the token
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      // We don't necessarily need to check the response for logout, but log any errors
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorText = `HTTP error! status: ${response.status}`;

        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json().catch(() => ({ message: errorText }));
          errorText = errorData.message || errorText;
        } else {
          errorText = await response.text().catch(() => errorText);
        }

        console.warn('Backend logout error:', errorText);
      }
    } catch (error) {
      // Even if backend logout fails, still clear local storage
      console.warn('Backend logout failed, clearing local session', error);
    }
  }

  // Always clear the local token
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
};

// TODO API
export const getUserTodos = async (): Promise<Todo[]> => {
  return apiRequest('/tasks');
};

export const createTodo = async (todoData: TodoCreate): Promise<Todo> => {
  return apiRequest('/tasks', {
    method: 'POST',
    body: JSON.stringify(todoData),
  });
};

export const getTodoById = async (id: string): Promise<Todo> => {
  return apiRequest(`/tasks/${id}`);
};

export const deleteTodo = async (id: string): Promise<void> => {
  await apiRequest(`/tasks/${id}`, {
    method: 'DELETE',
  });
};

export const toggleTodo = async (id: string): Promise<Todo> => {
  return apiRequest(`/tasks/${id}/complete`, {
    method: 'PATCH',
  });
};

export const updateTodo = async (id: string, todoData: TodoUpdate): Promise<Todo> => {
  return apiRequest(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(todoData),
  });
};