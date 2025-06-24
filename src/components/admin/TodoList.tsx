import React, { useState } from 'react';
import { Todo } from '../AdminPage'; // Assuming Todo interface is exported
import { supabase } from '../../lib/supabase';

interface TodoListProps {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  currentUserId: string | null;
}

const TodoList: React.FC<TodoListProps> = ({ todos, setTodos, currentUserId }) => {
  const [newTask, setNewTask] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim() || !currentUserId) return;
    
    setIsAdding(true);
    setError(null);

    try {
      const { data, error: insertError } = await supabase
        .from('todos')
        .insert({
          task: newTask,
          is_completed: false,
          user_id: currentUserId
        })
        .select()
        .single();

      if (insertError) throw insertError;
      if (data) {
        setTodos(prev => [...prev, data]);
        setNewTask('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add todo');
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleTodo = async (id: string, currentStatus: boolean) => {
    try {
      const { error: updateError } = await supabase
        .from('todos')
        .update({ is_completed: !currentStatus })
        .eq('id', id);

      if (updateError) throw updateError;
      
      setTodos(prev => prev.map(todo => 
        todo.id === id ? { ...todo, is_completed: !currentStatus } : todo
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-light mb-4 tracking-tight">Todo List</h3>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleAddTodo} className="flex gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
          disabled={isAdding || !currentUserId}
        />
        <button
          type="submit"
          className="bg-[#0CF2A0] text-black px-4 py-2 rounded transition-colors hover:bg-[#07C280] disabled:opacity-50"
          disabled={isAdding || !newTask.trim() || !currentUserId}
        >
          {isAdding ? 'Adding...' : 'Add'}
        </button>
      </form>

      <div className="space-y-2">
        {todos.length === 0 ? (
          <div className="text-center text-gray-400 py-4">
            No tasks yet. Add one to get started.
          </div>
        ) : (
          todos.map((todo) => (
            <div 
              key={todo.id} 
              className="flex items-center justify-between p-3 bg-black/20 rounded"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={todo.is_completed}
                  onChange={() => handleToggleTodo(todo.id, todo.is_completed)}
                  className="h-5 w-5 rounded border-gray-700 text-[#0CF2A0] focus:ring-[#0CF2A0]"
                />
                <span className={`${todo.is_completed ? 'line-through text-gray-500' : 'text-white'}`}>
                  {todo.task}
                </span>
              </div>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;