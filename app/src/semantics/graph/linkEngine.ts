/**
 * Link building engine
 * Automatically creates semantic links between notes based on content similarity
 */

import { listNotes, getNote } from '../../main/storage/repo/notesRepo';
import { replaceSemanticLinks, upsertLink } from '../../main/storage/repo/linksRepo';
import { getSemanticSettings } from '../../main/storage/repo/settingsRepo';
import { calculateTfidf, findSimilar, DocumentCorpus } from '../embedding/tfidf';

/**
 * Build semantic links for a specific note
 * Compares the note against all other notes and creates links above threshold
 */
export function buildSemanticLinks(noteId: string): number {
  const settings = getSemanticSettings();
  const threshold = settings.linkThreshold || 0.3;

  // Get the target note
  const targetNote = getNote(noteId);
  if (!targetNote) {
    return 0;
  }

  // Get all notes
  const allNotes = listNotes({ limit: 10000 });

  // Build corpus for TF-IDF
  const documents = allNotes.map((note) => ({
    id: note.id,
    text: `${note.title} ${note.body}`,
  }));

  // Calculate TF-IDF vectors
  const corpus = calculateTfidf(documents);

  // Find similar notes
  const similarNotes = findSimilar(noteId, corpus, threshold, 20);

  // Create link objects
  const newLinks = similarNotes.map((similar) => ({
    src_id: noteId,
    dst_id: similar.id,
    weight: similar.similarity,
    kind: 'semantic' as const,
  }));

  // Replace existing semantic links with new ones
  replaceSemanticLinks(noteId, newLinks);

  return newLinks.length;
}

/**
 * Rebuild all semantic links in the database
 * This is a heavy operation - should be run in background
 */
export function rebuildAllSemanticLinks(): {
  totalNotes: number;
  totalLinks: number;
} {
  const allNotes = listNotes({ limit: 10000 });
  let totalLinks = 0;

  // Build corpus once for all notes
  const documents = allNotes.map((note) => ({
    id: note.id,
    text: `${note.title} ${note.body}`,
  }));

  const corpus = calculateTfidf(documents);
  const settings = getSemanticSettings();
  const threshold = settings.linkThreshold || 0.3;

  // Build links for each note
  for (const note of allNotes) {
    const similarNotes = findSimilar(note.id, corpus, threshold, 20);

    const newLinks = similarNotes.map((similar) => ({
      src_id: note.id,
      dst_id: similar.id,
      weight: similar.similarity,
      kind: 'semantic' as const,
    }));

    replaceSemanticLinks(note.id, newLinks);
    totalLinks += newLinks.length;
  }

  return {
    totalNotes: allNotes.length,
    totalLinks,
  };
}

/**
 * Get semantic neighbors for a note
 * Returns notes that are semantically similar
 */
export function getSemanticNeighbors(
  noteId: string,
  options?: {
    threshold?: number;
    limit?: number;
  }
): Array<{
  noteId: string;
  similarity: number;
  title: string;
}> {
  const threshold = options?.threshold || 0.3;
  const limit = options?.limit || 10;

  const targetNote = getNote(noteId);
  if (!targetNote) {
    return [];
  }

  const allNotes = listNotes({ limit: 10000 });

  const documents = allNotes.map((note) => ({
    id: note.id,
    text: `${note.title} ${note.body}`,
  }));

  const corpus = calculateTfidf(documents);
  const similarNotes = findSimilar(noteId, corpus, threshold, limit);

  return similarNotes.map((similar) => {
    const note = allNotes.find((n) => n.id === similar.id);
    return {
      noteId: similar.id,
      similarity: similar.similarity,
      title: note?.title || 'Unknown',
    };
  });
}

/**
 * Calculate similarity between two specific notes
 */
export function calculateNoteSimilarity(noteId1: string, noteId2: string): number {
  const note1 = getNote(noteId1);
  const note2 = getNote(noteId2);

  if (!note1 || !note2) {
    return 0;
  }

  const documents = [
    { id: noteId1, text: `${note1.title} ${note1.body}` },
    { id: noteId2, text: `${note2.title} ${note2.body}` },
  ];

  const corpus = calculateTfidf(documents);

  if (corpus.length < 2) {
    return 0;
  }

  const similarity = findSimilar(noteId1, corpus, 0, 1);

  return similarity.length > 0 ? similarity[0].similarity : 0;
}
