/**
 * Daily digest builder
 * Creates daily summaries of notes, tasks, and links
 */

import { listNotes } from '../storage/repo/notesRepo';
import { listTasks, getOverdueTasks } from '../storage/repo/tasksRepo';
import { getLinkStats } from '../storage/repo/linksRepo';

export interface DigestData {
  date: string;
  summary: {
    notesCreated: number;
    notesUpdated: number;
    tasksCreated: number;
    tasksCompleted: number;
    tasksOverdue: number;
    linksCreated: number;
  };
  recentNotes: Array<{
    id: string;
    title: string;
    created_at: string;
  }>;
  pendingTasks: Array<{
    id: string;
    title: string;
    due_at: string | null;
  }>;
  overdueTasks: Array<{
    id: string;
    title: string;
    due_at: string | null;
  }>;
}

/**
 * Build daily digest for today
 */
export function buildDailyDigest(): DigestData {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = today.toISOString();

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowIso = tomorrow.toISOString();

  // Get notes created/updated today
  const allNotes = listNotes({ limit: 1000 });
  const notesCreatedToday = allNotes.filter(
    (note) => note.created_at >= todayIso && note.created_at < tomorrowIso
  );
  const notesUpdatedToday = allNotes.filter(
    (note) => note.updated_at >= todayIso && note.updated_at < tomorrowIso && note.created_at < todayIso
  );

  // Get tasks created/completed today
  const allTasks = listTasks({ limit: 1000 });
  const tasksCreatedToday = allTasks.filter(
    (task) => task.created_at >= todayIso && task.created_at < tomorrowIso
  );

  // For completed tasks, we'd need a completed_at field (future enhancement)
  // For now, just count completed tasks
  const tasksCompleted = allTasks.filter((task) => task.status === 'completed').length;

  // Get overdue tasks
  const overdueTasks = getOverdueTasks();

  // Get pending tasks
  const pendingTasks = listTasks({ status: 'pending', limit: 10 });

  // Get link statistics
  const linkStats = getLinkStats();

  return {
    date: todayIso,
    summary: {
      notesCreated: notesCreatedToday.length,
      notesUpdated: notesUpdatedToday.length,
      tasksCreated: tasksCreatedToday.length,
      tasksCompleted: tasksCompleted,
      tasksOverdue: overdueTasks.length,
      linksCreated: linkStats.totalLinks,
    },
    recentNotes: notesCreatedToday.slice(0, 5).map((note) => ({
      id: note.id,
      title: note.title,
      created_at: note.created_at,
    })),
    pendingTasks: pendingTasks.map((task) => ({
      id: task.id,
      title: task.title,
      due_at: task.due_at,
    })),
    overdueTasks: overdueTasks.slice(0, 10).map((task) => ({
      id: task.id,
      title: task.title,
      due_at: task.due_at,
    })),
  };
}

/**
 * Format digest as readable text
 */
export function formatDigest(digest: DigestData): string {
  const lines: string[] = [];

  lines.push(`# Daily Digest - ${new Date(digest.date).toLocaleDateString()}`);
  lines.push('');

  lines.push('## Summary');
  lines.push(`- Notes created: ${digest.summary.notesCreated}`);
  lines.push(`- Notes updated: ${digest.summary.notesUpdated}`);
  lines.push(`- Tasks created: ${digest.summary.tasksCreated}`);
  lines.push(`- Tasks completed: ${digest.summary.tasksCompleted}`);
  lines.push(`- Tasks overdue: ${digest.summary.tasksOverdue}`);
  lines.push(`- Total links: ${digest.summary.linksCreated}`);
  lines.push('');

  if (digest.recentNotes.length > 0) {
    lines.push('## Recent Notes');
    for (const note of digest.recentNotes) {
      lines.push(`- ${note.title}`);
    }
    lines.push('');
  }

  if (digest.overdueTasks.length > 0) {
    lines.push('## Overdue Tasks');
    for (const task of digest.overdueTasks) {
      lines.push(`- ${task.title} (due: ${task.due_at})`);
    }
    lines.push('');
  }

  if (digest.pendingTasks.length > 0) {
    lines.push('## Pending Tasks');
    for (const task of digest.pendingTasks) {
      const dueStr = task.due_at ? ` (due: ${task.due_at})` : '';
      lines.push(`- ${task.title}${dueStr}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
