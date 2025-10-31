/**
 * Links Repository
 * Handles semantic and manual links between notes
 */

import { getDatabase } from '../db';

export interface Link {
  src_id: string;
  dst_id: string;
  weight: number;
  kind: 'semantic' | 'manual' | 'reference';
  created_at: string;
}

export interface LinkInput {
  src_id: string;
  dst_id: string;
  weight?: number;
  kind?: 'semantic' | 'manual' | 'reference';
}

/**
 * Create or update a link between notes
 */
export function upsertLink(input: LinkInput): Link {
  const db = getDatabase();
  const now = new Date().toISOString();
  const weight = input.weight ?? 0.5;
  const kind = input.kind || 'semantic';

  // Use INSERT OR REPLACE to handle both create and update
  db.prepare(`
    INSERT INTO links (src_id, dst_id, weight, kind, created_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(src_id, dst_id) DO UPDATE SET
      weight = excluded.weight,
      kind = excluded.kind
  `).run(input.src_id, input.dst_id, weight, kind, now);

  return getLink(input.src_id, input.dst_id)!;
}

/**
 * Get a specific link
 */
export function getLink(srcId: string, dstId: string): Link | null {
  const db = getDatabase();
  const link = db
    .prepare('SELECT * FROM links WHERE src_id = ? AND dst_id = ?')
    .get(srcId, dstId) as Link | undefined;

  return link || null;
}

/**
 * Get all links for a note (both outgoing and incoming)
 */
export function getLinksForNote(noteId: string): {
  outgoing: Link[];
  incoming: Link[];
} {
  const db = getDatabase();

  const outgoing = db
    .prepare('SELECT * FROM links WHERE src_id = ? ORDER BY weight DESC')
    .all(noteId) as Link[];

  const incoming = db
    .prepare('SELECT * FROM links WHERE dst_id = ? ORDER BY weight DESC')
    .all(noteId) as Link[];

  return { outgoing, incoming };
}

/**
 * Get outgoing links from a note
 */
export function getOutgoingLinks(noteId: string, options?: {
  kind?: string;
  minWeight?: number;
  limit?: number;
}): Link[] {
  const db = getDatabase();
  let query = 'SELECT * FROM links WHERE src_id = ?';
  const params: any[] = [noteId];

  if (options?.kind) {
    query += ' AND kind = ?';
    params.push(options.kind);
  }

  if (options?.minWeight !== undefined) {
    query += ' AND weight >= ?';
    params.push(options.minWeight);
  }

  query += ' ORDER BY weight DESC';

  if (options?.limit) {
    query += ' LIMIT ?';
    params.push(options.limit);
  }

  return db.prepare(query).all(...params) as Link[];
}

/**
 * Get incoming links to a note
 */
export function getIncomingLinks(noteId: string, options?: {
  kind?: string;
  minWeight?: number;
  limit?: number;
}): Link[] {
  const db = getDatabase();
  let query = 'SELECT * FROM links WHERE dst_id = ?';
  const params: any[] = [noteId];

  if (options?.kind) {
    query += ' AND kind = ?';
    params.push(options.kind);
  }

  if (options?.minWeight !== undefined) {
    query += ' AND weight >= ?';
    params.push(options.minWeight);
  }

  query += ' ORDER BY weight DESC';

  if (options?.limit) {
    query += ' LIMIT ?';
    params.push(options.limit);
  }

  return db.prepare(query).all(...params) as Link[];
}

/**
 * Delete a specific link
 */
export function deleteLink(srcId: string, dstId: string): boolean {
  const db = getDatabase();
  const result = db
    .prepare('DELETE FROM links WHERE src_id = ? AND dst_id = ?')
    .run(srcId, dstId);
  return result.changes > 0;
}

/**
 * Delete all links for a note
 */
export function deleteLinksForNote(noteId: string): number {
  const db = getDatabase();
  const result = db
    .prepare('DELETE FROM links WHERE src_id = ? OR dst_id = ?')
    .run(noteId, noteId);
  return result.changes;
}

/**
 * Batch create/update links
 */
export function batchUpsertLinks(links: LinkInput[]): void {
  const db = getDatabase();

  db.transaction(() => {
    for (const link of links) {
      upsertLink(link);
    }
  })();
}

/**
 * Get all semantic links above a threshold
 */
export function getSemanticLinks(minWeight: number = 0.3): Link[] {
  const db = getDatabase();
  return db
    .prepare('SELECT * FROM links WHERE kind = ? AND weight >= ? ORDER BY weight DESC')
    .all('semantic', minWeight) as Link[];
}

/**
 * Replace all semantic links for a note
 * Used when recalculating semantic similarities
 */
export function replaceSemanticLinks(srcId: string, newLinks: LinkInput[]): void {
  const db = getDatabase();

  db.transaction(() => {
    // Delete existing semantic links from this note
    db.prepare('DELETE FROM links WHERE src_id = ? AND kind = ?')
      .run(srcId, 'semantic');

    // Insert new semantic links
    for (const link of newLinks) {
      if (link.src_id === srcId) {
        upsertLink({ ...link, kind: 'semantic' });
      }
    }
  })();
}

/**
 * Get link statistics
 */
export function getLinkStats(): {
  totalLinks: number;
  semanticLinks: number;
  manualLinks: number;
  avgWeight: number;
} {
  const db = getDatabase();

  const total = db.prepare('SELECT COUNT(*) as count FROM links').get() as { count: number };
  const semantic = db.prepare('SELECT COUNT(*) as count FROM links WHERE kind = ?').get('semantic') as { count: number };
  const manual = db.prepare('SELECT COUNT(*) as count FROM links WHERE kind = ?').get('manual') as { count: number };
  const avgWeight = db.prepare('SELECT AVG(weight) as avg FROM links').get() as { avg: number | null };

  return {
    totalLinks: total.count,
    semanticLinks: semantic.count,
    manualLinks: manual.count,
    avgWeight: avgWeight.avg || 0,
  };
}
