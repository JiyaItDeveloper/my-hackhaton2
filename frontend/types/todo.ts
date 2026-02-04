export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

export interface Todo {
  id: string;
  description: string;
  completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface TodoCreate {
  description: string;
  completed?: boolean;
}

export interface TodoUpdate {
  description?: string;
  completed?: boolean;
}