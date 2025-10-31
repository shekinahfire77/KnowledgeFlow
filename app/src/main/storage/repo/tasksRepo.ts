/**
 * Tasks Repository
 * Handles all CRUD operations for tasks
 */

import { getDatabase } from '../db';
import { nanoid } from 'nanoid';

export interface Task {
  id: string;
  note_id: string;
  title: string;
  status: 'pending' | 'completed' | 'cancelled';
  due_at: string | null;
  meta_json: string;
  created_at: string;
}

export interface TaskInput {
  note_id: string;
  title: string;
  status?: 'pending' | 'completed' | 'cancelled';
  due_at?: string | null;
  meta?: Record<string, any>;
}

export interface TaskUpdate {
  title?: string;
  status?: 'pending' | 'completed' | 'cancelled';
  due_at?: string | null;
  meta?: Record<string, any>;
}

/**
 * Create a new task
 */
export function createTask(input: TaskInput): Task {
  const db = getDatabase();
  const id = nanoid();
  const now = new Date().toISOString();

  const status = input.status || 'pending';
  const meta = JSON.stringify(input.meta || {});

  db.prepare(`
    INSERT INTO tasks (id, note_id, title, status, due_at, meta_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, input.note_id, input.title, status, input.due_at || null, meta, now);

  return getTask(id)!;
}

/**
 * Get a task by ID
 */
export function getTask(id: string): Task | null {
  const db = getDatabase();
  const task = db
    .prepare('SELECT * FROM tasks WHERE id = ?')
    .get(id) as Task | undefined;

  return task || null;
}

/**
 * Get all tasks with optional filters
 */
export function listTasks(options?: {
  note_id?: string;
  status?: 'pending' | 'completed' | 'cancelled';
  due_before?: string;
  limit?: number;
  offset?: number;
}): Task[] {
  const db = getDatabase();
  let query = 'SELECT * FROM tasks WHERE 1=1';
  const params: any[] = [];

  if (options?.note_id) {
    query += ' AND note_id = ?';
    params.push(options.note_id);
  }

  if (options?.status) {
    query += ' AND status = ?';
    params.push(options.status);
  }

  if (options?.due_before) {
    query += ' AND due_at IS NOT NULL AND due_at <= ?';
    params.push(options.due_before);
  }

  query += ' ORDER BY created_at DESC';

  if (options?.limit) {
    query += ' LIMIT ?';
    params.push(options.limit);
  }

  if (options?.offset) {
    query += ' OFFSET ?';
    params.push(options.offset);
  }

  return db.prepare(query).all(...params) as Task[];
}

/**
 * Get tasks for a specific note
 */
export function getTasksForNote(noteId: string): Task[] {
  return listTasks({ note_id: noteId });
}

/**
 * Update a task
 */
export function updateTask(id: string, updates: TaskUpdate): Task | null {
  const db = getDatabase();
  const existing = getTask(id);

  if (!existing) {
    return null;
  }

  const fields: string[] = [];
  const params: any[] = [];

  if (updates.title !== undefined) {
    fields.push('title = ?');
    params.push(updates.title);
  }

  if (updates.status !== undefined) {
    fields.push('status = ?');
    params.push(updates.status);
  }

  if (updates.due_at !== undefined) {
    fields.push('due_at = ?');
    params.push(updates.due_at);
  }

  if (updates.meta !== undefined) {
    fields.push('meta_json = ?');
    params.push(JSON.stringify(updates.meta));
  }

  if (fields.length === 0) {
    return existing;
  }

  params.push(id);

  db.prepare(`
    UPDATE tasks
    SET ${fields.join(', ')}
    WHERE id = ?
  `).run(...params);

  return getTask(id);
}

/**
 * Delete a task
 */
export function deleteTask(id: string): boolean {
  const db = getDatabase();
  const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  return result.changes > 0;
}

/**
 * Mark task as completed
 */
export function completeTask(id: string): Task | null {
  return updateTask(id, { status: 'completed' });
}

/**
 * Mark task as pending
 */
export function reopenTask(id: string): Task | null {
  return updateTask(id, { status: 'pending' });
}

/**
 * Get pending tasks count
 */
export function getPendingTasksCount(): number {
  const db = getDatabase();
  const result = db
    .prepare('SELECT COUNT(*) as count FROM tasks WHERE status = ?')
    .get('pending') as { count: number };
  return result.count;
}

/**
 * Get overdue tasks (pending tasks with due_at in the past)
 */
export function getOverdueTasks(): Task[] {
  const now = new Date().toISOString();
  return listTasks({
    status: 'pending',
    due_before: now,
  });
}

/**
 * Parse meta from JSON string
 */
export function parseMeta(metaJson: string): Record<string, any> {
  try {
    return JSON.parse(metaJson);
  } catch {
    return {};
  }
}
