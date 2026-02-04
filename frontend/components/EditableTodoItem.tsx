'use client';

import React, { useState } from 'react';
import { Todo, TodoUpdate } from '@/types/todo';
import { updateTodo } from '@/lib/api';
import { Trash2, Edit3, Save, X } from 'lucide-react';

interface EditableTodoItemProps {
  todo: Todo;
  onUpdate: (updatedTodo: Todo) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const EditableTodoItem: React.FC<EditableTodoItemProps> = ({
  todo,
  onUpdate,
  onDelete,
  onToggle
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.description);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = async () => {
    if (editText.trim() === '') return;

    setIsLoading(true);
    try {
      const updatedTodo = await updateTodo(todo.id, { description: editText });
      onUpdate(updatedTodo);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update todo:', error);
      alert('Failed to update todo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.description);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-sm hover:border-indigo-300">
      <div className="flex items-center flex-1">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer hover:scale-110 transition-transform duration-150"
        />

        {isEditing ? (
          <div className="flex items-center flex-1 ml-3">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-3 py-1 border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            <div className="flex space-x-1 ml-2">
              <button
                onClick={handleEdit}
                disabled={isLoading}
                className="p-1 text-green-600 hover:bg-green-100 rounded-full transition-colors duration-200"
                title="Save"
              >
                <Save className="h-4 w-4 lucide-icon" />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
                title="Cancel"
              >
                <X className="h-4 w-4 lucide-icon" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center flex-1 ml-3">
            <span
              className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
            >
              {todo.description}
            </span>
            <button
              onClick={() => setIsEditing(true)}
              className="ml-2 p-1 text-blue-600 hover:bg-blue-100 rounded-full transition-colors duration-200 hover:scale-110"
              title="Edit"
            >
              <Edit3 className="h-4 w-4 lucide-icon" />
            </button>
          </div>
        )}
      </div>

      <button
        onClick={() => onDelete(todo.id)}
        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors duration-200 hover:scale-110"
        title="Delete"
      >
        <Trash2 className="h-4 w-4 lucide-icon" />
      </button>
    </div>
  );
};

export default EditableTodoItem;