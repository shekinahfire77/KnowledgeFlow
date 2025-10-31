/**
 * Toolbar Component
 * Top navigation and search bar
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Toolbar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement search navigation
      console.log('Search:', searchQuery);
    }
  };

  return (
    <header
      style={{
        height: '56px',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 var(--spacing-md)',
        gap: 'var(--spacing-md)',
        backgroundColor: 'var(--color-bg-primary)',
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontSize: 'var(--font-size-lg)',
          fontWeight: '700',
          color: 'var(--color-primary)',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/')}
      >
        KnowledgeFlow
      </div>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        style={{
          flex: 1,
          maxWidth: '400px',
          marginLeft: 'var(--spacing-lg)',
        }}
      >
        <input
          type="search"
          placeholder="Search notes... (Cmd+K)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-sm)',
            outline: 'none',
          }}
        />
      </form>

      {/* Actions */}
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--spacing-sm)' }}>
        <button
          onClick={() => navigate('/note/new')}
          style={{
            padding: 'var(--spacing-sm) var(--spacing-md)',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: '500',
          }}
        >
          New Note
        </button>
      </div>
    </header>
  );
}

export default Toolbar;
