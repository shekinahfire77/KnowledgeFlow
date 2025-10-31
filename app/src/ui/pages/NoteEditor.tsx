/**
 * Note Editor Page
 * Create and edit notes
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TagChips from '../components/TagChips';

interface Note {
  id: string;
  title: string;
  body: string;
  tags_json: string;
  created_at: string;
  updated_at: string;
}

function NoteEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      loadNote(id);
    }
  }, [id, isNew]);

  const loadNote = async (noteId: string) => {
    setLoading(true);
    try {
      // TODO: Replace with actual IPC call
      // const note = await window.electron.invoke('notes:get', noteId);
      // if (note) {
      //   setTitle(note.title);
      //   setBody(note.body);
      //   setTags(JSON.parse(note.tags_json));
      // }
    } catch (error) {
      console.error('Failed to load note:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isNew) {
        // TODO: Replace with actual IPC call
        // const newNote = await window.electron.invoke('notes:create', {
        //   title,
        //   body,
        //   tags,
        // });
        // navigate(`/note/${newNote.id}`);
      } else {
        // TODO: Replace with actual IPC call
        // await window.electron.invoke('notes:update', id, {
        //   title,
        //   body,
        //   tags,
        // });
      }
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      // TODO: Replace with actual IPC call
      // await window.electron.invoke('notes:delete', id);
      navigate('/');
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  if (loading) {
    return <div style={{ padding: 'var(--spacing-lg)' }}>Loading note...</div>;
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div
        style={{
          padding: 'var(--spacing-md)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: 1 }}>
          <input
            type="text"
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              border: 'none',
              fontSize: 'var(--font-size-xl)',
              fontWeight: '600',
              padding: 'var(--spacing-sm)',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          {!isNew && (
            <button
              onClick={handleDelete}
              style={{
                padding: 'var(--spacing-sm) var(--spacing-md)',
                backgroundColor: 'var(--color-error)',
                color: 'white',
                borderRadius: 'var(--radius-md)',
              }}
            >
              Delete
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              borderRadius: 'var(--radius-md)',
            }}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Tags */}
      <div style={{ padding: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)' }}>
        <TagChips tags={tags} onChange={setTags} editable />
      </div>

      {/* Editor */}
      <div style={{ flex: 1, padding: 'var(--spacing-md)' }}>
        <textarea
          placeholder="Start writing..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            fontSize: 'var(--font-size-base)',
            lineHeight: '1.6',
            resize: 'none',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
      </div>
    </div>
  );
}

export default NoteEditor;
