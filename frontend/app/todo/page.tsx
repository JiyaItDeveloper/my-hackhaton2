'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/session';
import { Todo } from '@/types/todo';
import { getUserTodos, createTodo, deleteTodo, toggleTodo, updateTodo } from '@/lib/api';
import { Plus, Trash2, Edit3, Save, X, CheckCircle, Circle, RotateCcw, Filter, Search, Calendar, Tag, Bell, Settings, Star, Heart, Moon, Sun, User, LogOut, ListTodo, BarChart3, Target, Award, TrendingUp, Coffee, Rocket, Zap, Activity, Flame, Trophy, Gift } from 'lucide-react';
import Link from 'next/link';

export default function TodoPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated, logout } = useSession();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loadingTodos, setLoadingTodos] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFirstCompletionModal, setShowFirstCompletionModal] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, loading, router]);

  // Handle API errors globally - if we get a 401 error, redirect to login
  useEffect(() => {
    const handleError = (event: any) => {
      if (event.error?.message?.includes('Session expired')) {
        // Clear session and redirect to login
        logout();
        router.push('/signin');
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [router]);

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
    } catch (err: any) {
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
    } catch (err: any) {
      setError('Failed to add todo. Please try again.');
      console.error(err);
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      const updatedTodo = await toggleTodo(id);
      const updatedTodos = todos.map(todo =>
        todo.id === id ? updatedTodo : todo
      );
      setTodos(updatedTodos);

      // Check if this was the first todo completion
      const wasAnyCompleted = todos.some(todo => todo.completed);
      const isNowAnyCompleted = updatedTodos.some(todo => todo.completed);

      if (!wasAnyCompleted && isNowAnyCompleted) {
        setShowFirstCompletionModal(true);
      }
    } catch (err: any) {
      setError('Failed to update todo. Please try again.');
      console.error(err);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err: any) {
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
    } catch (err: any) {
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-300">Loading application...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirect happens in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-4000"></div>
      </div>

      {/* First Completion Modal */}
      {showFirstCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-300 scale-100 animate-in fade-in-90 zoom-in-90 border border-white/20">
            <div className="text-center">
              <div className="mx-auto bg-gradient-to-r from-yellow-400 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Trophy size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">Congratulations! 🎉</h2>
              <p className="text-gray-300 mb-6">You've completed your first task. Great job on taking the first step towards better productivity!</p>
              <button
                onClick={() => setShowFirstCompletionModal(false)}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg transform transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:scale-105 active:scale-95 hover:translate-y-[-2px]"
              >
                Keep Going!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <CheckCircle size={20} className="text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Todo App
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-white/10 rounded-full px-4 py-2 border border-white/20 backdrop-blur-sm">
                <User size={16} className="text-indigo-300 mr-2" />
                <span className="text-sm font-medium text-gray-300">Hi, {user?.name || user?.email.split('@')[0]}</span>
              </div>

              <button
                onClick={() => router.push('/signout')}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2 group backdrop-blur-sm"
              >
                <LogOut size={16} className="group-hover:rotate-12 transition-transform duration-300" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Banner */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 text-white relative overflow-hidden border border-white/20">
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-1">Hello, {user?.name || user?.email.split('@')[0]}! 👋</h1>
                    <p className="text-gray-300">Ready to boost your productivity today?</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Tasks Remaining</div>
                      <div className="text-xl font-bold">{todos.filter(t => !t.completed).length}</div>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Target size={24} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
                <div className="text-2xl font-bold text-indigo-300">{todos.length}</div>
                <div className="text-xs text-gray-400">Total</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
                <div className="text-2xl font-bold text-green-300">{todos.filter(t => t.completed).length}</div>
                <div className="text-xs text-gray-400">Done</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
                <div className="text-2xl font-bold text-yellow-300">{todos.filter(t => !t.completed).length}</div>
                <div className="text-xs text-gray-400">Pending</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
                <div className="text-2xl font-bold text-purple-300">{todos.length > 0 ? Math.round((todos.filter(t => t.completed).length / todos.length) * 100) : 0}%</div>
                <div className="text-xs text-gray-400">Complete</div>
              </div>
            </div>

            {/* Add Todo Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-5 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                  <Plus size={20} className="text-indigo-300" />
                </div>
                <h2 className="text-lg font-semibold text-white">Add New Task</h2>
              </div>

              <form onSubmit={handleAddTodo} className="flex gap-3">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="What do you need to accomplish?"
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all duration-300 hover:bg-white/20 hover:border-indigo-300 text-white placeholder-gray-400"
                />

                <button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Plus size={16} />
                  Add
                </button>
              </form>
            </div>

            {/* Todo List */}
            <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden">
              <div className="p-4 bg-white/5 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <ListTodo size={20} className="text-indigo-300" />
                    Your Tasks
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-400 text-sm transition-all duration-300 hover:bg-white/20 hover:border-indigo-300 text-white placeholder-gray-400"
                      />
                    </div>

                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'completed')}
                      className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-400 text-sm transition-all duration-300 hover:bg-white/20 text-white"
                    >
                      <option value="all" className="bg-gray-800">All</option>
                      <option value="active" className="bg-gray-800">Active</option>
                      <option value="completed" className="bg-gray-800">Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              {error && (
                <div className="m-4 p-3 bg-red-500/20 text-red-300 rounded-xl border border-red-500/30 flex items-center gap-2 backdrop-blur-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              {loadingTodos ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-3"></div>
                  <p className="text-gray-400">Loading tasks...</p>
                </div>
              ) : filteredTodos.length === 0 ? (
                <div className="text-center py-8">
                  <div className="mx-auto bg-gray-500/20 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle size={20} className="text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-white mb-1">No tasks found</h4>
                  <p className="text-gray-500">Add a new task or adjust your filters</p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {filteredTodos.map((todo) => (
                    <div key={todo.id} className="p-4 hover:bg-white/5 transition-colors duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1 min-w-0">
                          <button
                            onClick={() => handleToggleTodo(todo.id)}
                            className="mr-3 flex-shrink-0"
                          >
                            {todo.completed ? (
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle size={14} className="text-white" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 border-2 border-white/30 rounded-full flex items-center justify-center hover:border-indigo-400 transition-colors">
                                <div className="w-3 h-3 bg-transparent"></div>
                              </div>
                            )}
                          </button>

                          {editingId === todo.id ? (
                            <div className="flex items-center flex-1 gap-2">
                              <input
                                type="text"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="flex-1 px-2 py-1 bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-4 focus:ring-indigo-500/30 text-sm text-white placeholder-gray-400"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveEdit(todo.id);
                                  if (e.key === 'Escape') cancelEdit();
                                }}
                              />
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => saveEdit(todo.id)}
                                  className="p-1 text-green-400 hover:bg-green-500/20 rounded-full transition-colors duration-200"
                                  title="Save"
                                >
                                  <Save size={14} />
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="p-1 text-gray-400 hover:bg-gray-500/20 rounded-full transition-colors duration-200"
                                  title="Cancel"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center flex-1">
                              <span className={`truncate ${todo.completed ? 'line-through text-gray-400' : 'text-gray-300'}`}>
                                {todo.description}
                              </span>
                              <button
                                onClick={() => startEditing(todo.id, todo.description)}
                                className="ml-2 p-1 text-blue-400 hover:bg-blue-500/20 rounded-full transition-colors duration-200"
                                title="Edit"
                              >
                                <Edit3 size={14} />
                              </button>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="p-1 text-red-400 hover:bg-red-500/20 rounded-full transition-colors duration-200 ml-2 flex-shrink-0"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Productivity Stats */}
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-5 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Activity size={20} className="text-indigo-300" />
                Productivity
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Daily Progress</span>
                    <span className="font-medium text-white">{todos.length > 0 ? Math.round((todos.filter(t => t.completed).length / todos.length) * 100) : 0}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${todos.length > 0 ? (todos.filter(t => t.completed).length / todos.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <div className="text-lg font-bold text-indigo-300">{todos.filter(t => !t.completed).length}</div>
                    <div className="text-xs text-gray-400">To Do</div>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <div className="text-lg font-bold text-green-300">{todos.filter(t => t.completed).length}</div>
                    <div className="text-xs text-gray-400">Done</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-5 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Rocket size={20} className="text-indigo-300" />
                Quick Actions
              </h3>

              <div className="space-y-3">
                <button
                  onClick={loadTodos}
                  className="w-full flex items-center gap-3 p-3 text-left text-gray-300 hover:bg-white/10 rounded-lg transition-colors duration-200"
                >
                  <RotateCcw size={16} className="text-gray-400" />
                  <span className="text-sm">Refresh Tasks</span>
                </button>

                <button className="w-full flex items-center gap-3 p-3 text-left text-gray-300 hover:bg-white/10 rounded-lg transition-colors duration-200">
                  <Bell size={16} className="text-gray-400" />
                  <span className="text-sm">Set Reminder</span>
                </button>

                <button className="w-full flex items-center gap-3 p-3 text-left text-gray-300 hover:bg-white/10 rounded-lg transition-colors duration-200">
                  <Filter size={16} className="text-gray-400" />
                  <span className="text-sm">Filter Tasks</span>
                </button>
              </div>
            </div>

            {/* Motivation Card */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-5 text-white">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Stay Focused</h3>
                  <p className="text-indigo-100 text-sm">
                    "Small daily improvements are the key to staggering long-term results."
                  </p>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-5 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Trophy size={20} className="text-indigo-300" />
                Achievements
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <Award size={14} className="text-yellow-300" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">First Task</div>
                    <div className="text-xs text-gray-400">Complete your first task</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Flame size={14} className="text-blue-300" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Streak Builder</div>
                    <div className="text-xs text-gray-400">3 days in a row</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}