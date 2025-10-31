/**
 * Main App component
 * Handles routing and global layout
 */

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import NotesList from './pages/NotesList';
import NoteEditor from './pages/NoteEditor';
import GraphView from './pages/GraphView';
import TasksView from './pages/TasksView';
import Settings from './pages/Settings';
import CaptureOverlay from './pages/CaptureOverlay';
import Toolbar from './components/Toolbar';
import CommandPalette from './components/CommandPalette';

function App() {
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showCaptureOverlay, setShowCaptureOverlay] = useState(false);

  // Listen for hotkey events from main process
  React.useEffect(() => {
    // TODO: Set up IPC listeners for hotkeys
    // window.electron.on('hotkey:quick-capture', () => setShowCaptureOverlay(true));
    // window.electron.on('hotkey:search', () => setShowCommandPalette(true));
  }, []);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }

      // Cmd/Ctrl + Shift + N for quick capture
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'n') {
        e.preventDefault();
        setShowCaptureOverlay(true);
      }

      // Escape to close overlays
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
        setShowCaptureOverlay(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Toolbar />

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Sidebar */}
          <aside
            style={{
              width: '200px',
              borderRight: '1px solid var(--color-border)',
              padding: 'var(--spacing-md)',
              overflowY: 'auto',
            }}
          >
            <nav>
              <ul style={{ listStyle: 'none' }}>
                <li style={{ marginBottom: 'var(--spacing-sm)' }}>
                  <Link to="/" style={{ display: 'block', padding: 'var(--spacing-sm)' }}>
                    Notes
                  </Link>
                </li>
                <li style={{ marginBottom: 'var(--spacing-sm)' }}>
                  <Link to="/tasks" style={{ display: 'block', padding: 'var(--spacing-sm)' }}>
                    Tasks
                  </Link>
                </li>
                <li style={{ marginBottom: 'var(--spacing-sm)' }}>
                  <Link to="/graph" style={{ display: 'block', padding: 'var(--spacing-sm)' }}>
                    Graph
                  </Link>
                </li>
                <li style={{ marginBottom: 'var(--spacing-sm)' }}>
                  <Link to="/settings" style={{ display: 'block', padding: 'var(--spacing-sm)' }}>
                    Settings
                  </Link>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main content */}
          <main style={{ flex: 1, overflow: 'auto' }}>
            <Routes>
              <Route path="/" element={<NotesList />} />
              <Route path="/note/:id" element={<NoteEditor />} />
              <Route path="/note/new" element={<NoteEditor />} />
              <Route path="/tasks" element={<TasksView />} />
              <Route path="/graph" element={<GraphView />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>

        {/* Overlays */}
        {showCommandPalette && (
          <CommandPalette onClose={() => setShowCommandPalette(false)} />
        )}

        {showCaptureOverlay && (
          <CaptureOverlay onClose={() => setShowCaptureOverlay(false)} />
        )}
      </div>
    </Router>
  );
}

export default App;
