import React from 'react';
import { Trash2 } from 'lucide-react';

interface TodoItemProps {
  id: string;
  description: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ id, description, completed, onToggle, onDelete }) => {
  return (
    <li
      className={`flex items-center justify-between p-4 bg-white rounded-lg shadow transition-all duration-200 hover:shadow-md ${
        completed ? 'opacity-70' : ''
      }`}
    >
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={completed}
          onChange={() => onToggle(id)}
          className="h-4 w-4 mr-3"
        />
        <span className={`${completed ? 'line-through text-gray-500' : ''}`}>
          {description}
        </span>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onDelete(id)}
          className="text-red-500 hover:text-red-700 flex items-center p-2 rounded-full hover:bg-red-100 transition-colors duration-200 hover:scale-110"
        >
          <Trash2 className="h-4 w-4 lucide-icon" />
        </button>
      </div>
    </li>
  );
};

export default TodoItem;