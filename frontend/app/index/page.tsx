'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/session';
import { Todo } from '@/types/todo';
import { getUserTodos, createTodo, deleteTodo, toggleTodo, updateTodo } from '@/lib/api';
import { LogOut, Plus, Trash2, Edit3, Save, X, CheckCircle2, Circle, RotateCcw, Filter, Search, Calendar, Tag, Bell, Settings, Star, Heart, Moon, Sun, User } from 'lucide-react';

export default function TodoApp() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useSession();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loadingTodos, setLoadingTodos] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/sign');
    }
  }, [isAuthenticated, loading, router]);

  // Load todos when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadTodos();
    }
  }, [isAuthenticated, user]);

  const loadTodos = async () => {
    try {
      setLoadingTodos(true);
      const userTodos = await getUserTodos();
      setTodos(userTodos);
    } catch (err) {
      setError('Failed to load todos. Please try again.');
      console.error(err);
    } finally {
      setLoadingTodos(false);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTodo.trim()) return;

    try {
      const createdTodo = await createTodo({ description: newTodo, completed: false });
      setTodos([createdTodo, ...todos]);
      setNewTodo('');
    } catch (err) {
      setError('Failed to add todo. Please try again.');
      console.error(err);
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      const updatedTodo = await toggleTodo(id);
      setTodos(todos.map(todo =>
        todo.id === id ? updatedTodo : todo
      ));
    } catch (err) {
      setError('Failed to update todo. Please try again.');
      console.error(err);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError('Failed to delete todo. Please try again.');
      console.error(err);
    }
  };

  const startEditing = (id: string, description: string) => {
    setEditingId(id);
    setEditText(description);
  };

  const saveEdit = async (id: string) => {
    if (!editText.trim()) return;

    try {
      const updatedTodo = await updateTodo(id, { description: editText });
      setTodos(todos.map(todo =>
        todo.id === id ? updatedTodo : todo
      ));
      setEditingId(null);
      setEditText('');
    } catch (err) {
      setError('Failed to update todo. Please try again.');
      console.error(err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const filteredTodos = todos.filter(todo => {
    const matchesFilter = filter === 'all' ||
                         (filter === 'active' && !todo.completed) ||
                         (filter === 'completed' && todo.completed);

    const matchesSearch = todo.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirect happens in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Todo App</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                <User size={16} className="mr-2 text-indigo-600" />
                <span className="text-sm text-gray-700">Welcome, {user?.name || user?.email}</span>
              </div>
              <button
                onClick={() => router.push('/signout')}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Todo Form & Controls */}
          <div className="lg:col-span-2">
            {/* Search & Filters */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search todos..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-50"
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                      filter === 'all'
                        ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Tag size={16} />
                    All
                  </button>
                  <button
                    onClick={() => setFilter('active')}
                    className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                      filter === 'active'
                        ? 'bg-green-100 text-green-700 border-2 border-green-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Circle size={16} />
                    Active
                  </button>
                  <button
                    onClick={() => setFilter('completed')}
                    className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                      filter === 'completed'
                        ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <CheckCircle2 size={16} />
                    Done
                  </button>
                </div>
              </div>

              {/* Add Todo Form */}
              <form onSubmit={handleAddTodo} className="flex gap-3">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="What needs to be done?"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-50"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add
                </button>
              </form>
            </div>

            {/* Todo List */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Your Todos</h2>
                <button
                  onClick={loadTodos}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  <RotateCcw size={16} />
                  Refresh
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}

              {loadingTodos ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading todos...</p>
                </div>
              ) : filteredTodos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={24} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg">No todos found</p>
                  <p className="text-gray-400">Try changing your filters or add a new todo</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center">
                        <button
                          onClick={() => handleToggleTodo(todo.id)}
                          className="mr-3"
                        >
                          {todo.completed ? (
                            <CheckCircle2 size={20} className="text-green-500" />
                          ) : (
                            <Circle size={20} className="text-gray-400" />
                          )}
                        </button>

                        {editingId === todo.id ? (
                          <div className="flex items-center">
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="flex-1 px-3 py-1 border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEdit(todo.id);
                                if (e.key === 'Escape') cancelEdit();
                              }}
                            />
                            <div className="flex space-x-1 ml-2">
                              <button
                                onClick={() => saveEdit(todo.id)}
                                className="p-1 text-green-600 hover:bg-green-100 rounded-full"
                                title="Save"
                              >
                                <Save size={16} />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="p-1 text-gray-600 hover:bg-gray-100 rounded-full"
                                title="Cancel"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <span className={`text-gray-800 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                              {todo.description}
                            </span>
                            <button
                              onClick={() => startEditing(todo.id, todo.description)}
                              className="ml-3 p-1 text-blue-600 hover:bg-blue-100 rounded-full"
                              title="Edit"
                            >
                              <Edit3 size={16} />
                            </button>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-indigo-600" />
                Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Total Todos</span>
                  <span className="font-medium">{todos.length}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-medium">{todos.filter(t => t.completed).length}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-medium">{todos.filter(t => !t.completed).length}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Bell size={20} className="text-indigo-600" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex items-center gap-2">
                  <Settings size={16} />
                  Settings
                </button>
                <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex items-center gap-2">
                  <Filter size={16} />
                  Filters
                </button>
                <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex items-center gap-2">
                  <Calendar size={16} />
                  Calendar
                </button>
              </div>
            </div>

            {/* Motivation */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Tip of the Day</h3>
              <p className="text-indigo-100 text-sm">
                Break large tasks into smaller, manageable todos. You'll feel more accomplished as you complete each one!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}