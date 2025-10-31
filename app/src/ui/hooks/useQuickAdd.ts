/**
 * useQuickAdd Hook
 * Hook for quick note creation functionality
 */

import { useState } from 'react';

interface QuickAddOptions {
  onSuccess?: (noteId: string) => void;
  onError?: (error: Error) => void;
}

export function useQuickAdd(options?: QuickAddOptions) {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createNote = async (title: string, body: string, tags?: string[]) => {
    setIsCreating(true);
    setError(null);

    try {
      // TODO: Replace with actual IPC call
      // const note = await window.electron.invoke('notes:create', {
      //   title: title || 'Quick Note',
      //   body,
      //   tags: tags || ['quick-capture'],
      // });

      // Stub response
      const note = { id: 'stub-id' };

      options?.onSuccess?.(note.id);
      return note;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create note');
      setError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createNote,
    isCreating,
    error,
  };
}
