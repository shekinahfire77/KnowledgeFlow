/**
 * Tasks View Page
 * Displays and manages tasks extracted from notes
 */

import React, { useState, useEffect } from 'react';
import TaskList from '../components/TaskList';

interface Task {
  id: string;
  note_id: string;
  title: string;
  status: 'pending' | 'completed' | 'cancelled';
  due_at: string | null;
  created_at: string;
}

function TasksView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    loadTasks();
  }, [filter]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual IPC call
      // const options = filter !== 'all' ? { status: filter } : {};
      // const result = await window.electron.invoke('tasks:list', options);
      // setTasks(result);

      // Stub data for development
      setTasks([]);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      // TODO: Replace with actual IPC call
      // await window.electron.invoke('tasks:complete', taskId);
      loadTasks();
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  return (
    <div style={{ padding: 'var(--spacing-lg)' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-lg)',
        }}
      >
        <h1>Tasks</h1>

        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          {(['all', 'pending', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: 'var(--spacing-sm) var(--spacing-md)',
                backgroundColor: filter === f ? 'var(--color-primary)' : 'var(--color-bg-tertiary)',
                color: filter === f ? 'white' : 'var(--color-text-primary)',
                borderRadius: 'var(--radius-md)',
                textTransform: 'capitalize',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks list */}
      {loading ? (
        <div>Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-secondary)' }}>
          <p>No tasks found. Tasks are automatically extracted from your notes.</p>
        </div>
      ) : (
        <TaskList tasks={tasks} onToggle={handleToggleTask} />
      )}
    </div>
  );
}

export default TasksView;
