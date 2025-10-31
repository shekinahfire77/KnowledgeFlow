/**
 * Task List Component
 * Displays a list of tasks with checkboxes
 */

import React from 'react';

interface Task {
  id: string;
  note_id: string;
  title: string;
  status: 'pending' | 'completed' | 'cancelled';
  due_at: string | null;
  created_at: string;
}

interface TaskListProps {
  tasks: Task[];
  onToggle: (taskId: string) => void;
}

function TaskList({ tasks, onToggle }: TaskListProps) {
  const formatDueDate = (dueAt: string | null): string => {
    if (!dueAt) return '';

    const due = new Date(dueAt);
    const now = new Date();
    const diffMs = due.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} days`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${diffDays} days`;
    }
  };

  return (
    <div>
      {tasks.map((task) => (
        <div
          key={task.id}
          style={{
            padding: 'var(--spacing-md)',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
          }}
        >
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={task.status === 'completed'}
            onChange={() => onToggle(task.id)}
            style={{
              width: '20px',
              height: '20px',
              cursor: 'pointer',
            }}
          />

          {/* Task content */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 'var(--font-size-base)',
                textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                color: task.status === 'completed' ? 'var(--color-text-secondary)' : 'var(--color-text-primary)',
              }}
            >
              {task.title}
            </div>

            {/* Due date */}
            {task.due_at && (
              <div
                style={{
                  fontSize: 'var(--font-size-xs)',
                  color: new Date(task.due_at) < new Date() ? 'var(--color-error)' : 'var(--color-text-secondary)',
                  marginTop: 'var(--spacing-xs)',
                }}
              >
                {formatDueDate(task.due_at)}
              </div>
            )}
          </div>

          {/* Status badge */}
          <div
            style={{
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--font-size-xs)',
              backgroundColor:
                task.status === 'completed'
                  ? 'var(--color-success)'
                  : task.status === 'cancelled'
                  ? 'var(--color-text-tertiary)'
                  : 'var(--color-warning)',
              color: 'white',
            }}
          >
            {task.status}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
