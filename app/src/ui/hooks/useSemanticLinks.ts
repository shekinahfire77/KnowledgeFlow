/**
 * useSemanticLinks Hook
 * Hook for managing semantic links between notes
 */

import { useState, useEffect } from 'react';

interface Link {
  src_id: string;
  dst_id: string;
  weight: number;
  kind: string;
}

interface SemanticLinksResult {
  outgoing: Link[];
  incoming: Link[];
}

export function useSemanticLinks(noteId: string | undefined) {
  const [links, setLinks] = useState<SemanticLinksResult>({ outgoing: [], incoming: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (noteId) {
      loadLinks(noteId);
    }
  }, [noteId]);

  const loadLinks = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual IPC call
      // const result = await window.electron.invoke('links:get', id);
      // setLinks(result);

      // Stub data
      setLinks({ outgoing: [], incoming: [] });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load links');
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const buildLinks = async (id: string) => {
    try {
      // TODO: Replace with actual IPC call
      // await window.electron.invoke('semantics:buildLinks', id);
      await loadLinks(id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to build links');
      setError(error);
      throw error;
    }
  };

  const createManualLink = async (srcId: string, dstId: string, weight: number = 1.0) => {
    try {
      // TODO: Replace with actual IPC call
      // await window.electron.invoke('links:create', {
      //   src_id: srcId,
      //   dst_id: dstId,
      //   weight,
      //   kind: 'manual',
      // });
      await loadLinks(srcId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create link');
      setError(error);
      throw error;
    }
  };

  return {
    links,
    loading,
    error,
    buildLinks,
    createManualLink,
    reload: () => noteId && loadLinks(noteId),
  };
}
