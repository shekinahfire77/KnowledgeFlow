/**
 * Notes Repository
 * Handles all CRUD operations for notes
 */

import { getDatabase } from '../db';
import { nanoid } from 'nanoid';

export interface Note {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  body: string;
  tags_json: string;
  meta_json: string;
  enc_blob: Buffer | null;
}

export interface NoteInput {
  title: string;
  body: string;
  tags?: string[];
  meta?: Record<string, any>;
}

export interface NoteUpdate {
  title?: string;
  body?: string;
  tags?: string[];
  meta?: Record<string, any>;
}

/**
 * Create a new note
 */
export function createNote(input: NoteInput): Note {
  const db = getDatabase();
  const id = nanoid();
  const now = new Date().toISOString();

  const tags = JSON.stringify(input.tags || []);
  const meta = JSON.stringify(input.meta || {});

  db.prepare(`
    INSERT INTO notes (id, created_at, updated_at, title, body, tags_json, meta_json)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, now, now, input.title, input.body, tags, meta);

  return getNote(id)!;
}

/**
 * Get a note by ID
 */
export function getNote(id: string): Note | null {
  const db = getDatabase();
  const note = db
    .prepare('SELECT * FROM notes WHERE id = ?')
    .get(id) as Note | undefined;

  return note || null;
}

/**
 * Get all notes with optional filters
 */
export function listNotes(options?: {
  tags?: string[];
  limit?: number;
  offset?: number;
  orderBy?: 'created_at' | 'updated_at' | 'title';
  order?: 'ASC' | 'DESC';
}): Note[] {
  const db = getDatabase();
  let query = 'SELECT * FROM notes WHERE 1=1';
  const params: any[] = [];

  // Filter by tags if provided
  if (options?.tags && options.tags.length > 0) {
    // This is a simplified version - for production, consider using JSON functions
    const tagConditions = options.tags.map(() => 'tags_json LIKE ?').join(' AND ');
    query += ` AND (${tagConditions})`;
    options.tags.forEach(tag => {
      params.push(`%"${tag}"%`);
    });
  }

  // Order by
  const orderBy = options?.orderBy || 'updated_at';
  const order = options?.order || 'DESC';
  query += ` ORDER BY ${orderBy} ${order}`;

  // Pagination
  if (options?.limit) {
    query += ' LIMIT ?';
    params.push(options.limit);
  }
  if (options?.offset) {
    query += ' OFFSET ?';
    params.push(options.offset);
  }

  return db.prepare(query).all(...params) as Note[];
}

/**
 * Update a note
 */
export function updateNote(id: string, updates: NoteUpdate): Note | null {
  const db = getDatabase();
  const existing = getNote(id);

  if (!existing) {
    return null;
  }

  const now = new Date().toISOString();
  const fields: string[] = ['updated_at = ?'];
  const params: any[] = [now];

  if (updates.title !== undefined) {
    fields.push('title = ?');
    params.push(updates.title);
  }

  if (updates.body !== undefined) {
    fields.push('body = ?');
    params.push(updates.body);
  }

  if (updates.tags !== undefined) {
    fields.push('tags_json = ?');
    params.push(JSON.stringify(updates.tags));
  }

  if (updates.meta !== undefined) {
    fields.push('meta_json = ?');
    params.push(JSON.stringify(updates.meta));
  }

  params.push(id);

  db.prepare(`
    UPDATE notes
    SET ${fields.join(', ')}
    WHERE id = ?
  `).run(...params);

  return getNote(id);
}

/**
 * Delete a note
 */
export function deleteNote(id: string): boolean {
  const db = getDatabase();
  const result = db.prepare('DELETE FROM notes WHERE id = ?').run(id);
  return result.changes > 0;
}

/**
 * Search notes using full-text search
 */
export function searchNotes(query: string, limit: number = 50): Note[] {
  const db = getDatabase();

  // Use FTS5 for full-text search
  const results = db
    .prepare(`
      SELECT n.*
      FROM notes n
      JOIN notes_fts fts ON n.rowid = fts.rowid
      WHERE notes_fts MATCH ?
      ORDER BY rank
      LIMIT ?
    `)
    .all(query, limit) as Note[];

  return results;
}

/**
 * Get notes by IDs (useful for batch operations)
 */
export function getNotesByIds(ids: string[]): Note[] {
  if (ids.length === 0) {
    return [];
  }

  const db = getDatabase();
  const placeholders = ids.map(() => '?').join(',');
  const query = `SELECT * FROM notes WHERE id IN (${placeholders})`;

  return db.prepare(query).all(...ids) as Note[];
}

/**
 * Get notes count
 */
export function getNotesCount(): number {
  const db = getDatabase();
  const result = db.prepare('SELECT COUNT(*) as count FROM notes').get() as { count: number };
  return result.count;
}

/**
 * Parse tags from JSON string
 */
export function parseTags(tagsJson: string): string[] {
  try {
    return JSON.parse(tagsJson);
  } catch {
    return [];
  }
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
