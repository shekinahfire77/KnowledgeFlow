/**
 * useDailyDigest Hook
 * Hook for managing daily digest functionality
 */

import { useState } from 'react';

interface DigestData {
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

export function useDailyDigest() {
  const [digest, setDigest] = useState<DigestData | null>(null);
  const [formatted, setFormatted] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const buildDigest = async () => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual IPC call
      // const result = await window.electron.invoke('digest:build');
      // setDigest(result.data);
      // setFormatted(result.formatted);

      // Stub data
      const stubDigest: DigestData = {
        date: new Date().toISOString(),
        summary: {
          notesCreated: 0,
          notesUpdated: 0,
          tasksCreated: 0,
          tasksCompleted: 0,
          tasksOverdue: 0,
          linksCreated: 0,
        },
        recentNotes: [],
        pendingTasks: [],
        overdueTasks: [],
      };

      setDigest(stubDigest);
      setFormatted('# Daily Digest\n\nNo activity today.');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to build digest');
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    digest,
    formatted,
    loading,
    error,
    buildDigest,
  };
}
