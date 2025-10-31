/**
 * Seed script to populate database with sample data
 * Run with: npm run seed
 */

import * as fs from 'fs';
import * as path from 'path';
import { initDatabase, getDatabase } from '../src/main/storage/db';
import * as notesRepo from '../src/main/storage/repo/notesRepo';
import * as tasksRepo from '../src/main/storage/repo/tasksRepo';

interface SampleNote {
  title: string;
  body: string;
  tags: string[];
}

interface SampleTask {
  title: string;
  status: 'pending' | 'completed' | 'cancelled';
  due_at: string | null;
}

async function seed() {
  console.log('Starting database seed...');

  // Initialize database
  initDatabase();
  const db = getDatabase();

  // Load sample data
  const notesPath = path.join(__dirname, 'notes.sample.json');
  const tasksPath = path.join(__dirname, 'tasks.sample.json');

  const sampleNotes: SampleNote[] = JSON.parse(fs.readFileSync(notesPath, 'utf-8'));
  const sampleTasks: SampleTask[] = JSON.parse(fs.readFileSync(tasksPath, 'utf-8'));

  // Clear existing data (optional - comment out to preserve data)
  console.log('Clearing existing data...');
  db.prepare('DELETE FROM links').run();
  db.prepare('DELETE FROM tasks').run();
  db.prepare('DELETE FROM notes').run();

  // Seed notes
  console.log(`Seeding ${sampleNotes.length} notes...`);
  const createdNotes: string[] = [];

  for (const sampleNote of sampleNotes) {
    const note = notesRepo.createNote({
      title: sampleNote.title,
      body: sampleNote.body,
      tags: sampleNote.tags,
    });

    createdNotes.push(note.id);
    console.log(`  Created note: ${note.title}`);
  }

  // Seed tasks (assign to random notes)
  console.log(`\nSeeding ${sampleTasks.length} tasks...`);

  for (const sampleTask of sampleTasks) {
    const randomNoteId = createdNotes[Math.floor(Math.random() * createdNotes.length)];

    const task = tasksRepo.createTask({
      note_id: randomNoteId,
      title: sampleTask.title,
      status: sampleTask.status,
      due_at: sampleTask.due_at,
    });

    console.log(`  Created task: ${task.title} (${task.status})`);
  }

  // Build semantic links (optional)
  console.log('\nBuilding semantic links...');
  try {
    const { buildSemanticLinks } = await import('../src/semantics/graph/linkEngine');

    for (const noteId of createdNotes) {
      const linkCount = buildSemanticLinks(noteId);
      console.log(`  Built ${linkCount} links for note ${noteId}`);
    }
  } catch (error) {
    console.warn('Could not build semantic links:', error);
  }

  // Summary
  console.log('\n=== Seed Summary ===');
  console.log(`Notes created: ${createdNotes.length}`);
  console.log(`Tasks created: ${sampleTasks.length}`);

  const linkCount = db.prepare('SELECT COUNT(*) as count FROM links').get() as { count: number };
  console.log(`Links created: ${linkCount.count}`);

  console.log('\nDatabase seed completed successfully!');
}

// Run seed
seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
