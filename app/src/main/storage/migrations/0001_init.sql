-- KnowledgeFlow Initial Database Schema
-- Stage 3: Core tables with semantic link support

-- Notes table: stores all note content
CREATE TABLE notes (
  id TEXT PRIMARY KEY,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  tags_json TEXT DEFAULT '[]',
  meta_json TEXT DEFAULT '{}',
  enc_blob BLOB NULL
);

-- Full-text search index for notes
CREATE VIRTUAL TABLE notes_fts USING fts5(
  title,
  body,
  content=notes,
  content_rowid=rowid,
  tokenize='porter unicode61'
);

-- Triggers to keep FTS index in sync
CREATE TRIGGER notes_fts_insert AFTER INSERT ON notes BEGIN
  INSERT INTO notes_fts(rowid, title, body) VALUES (new.rowid, new.title, new.body);
END;

CREATE TRIGGER notes_fts_update AFTER UPDATE ON notes BEGIN
  UPDATE notes_fts SET title = new.title, body = new.body WHERE rowid = new.rowid;
END;

CREATE TRIGGER notes_fts_delete AFTER DELETE ON notes BEGIN
  DELETE FROM notes_fts WHERE rowid = old.rowid;
END;

-- Links table: stores relationships between notes
CREATE TABLE links (
  src_id TEXT NOT NULL,
  dst_id TEXT NOT NULL,
  weight REAL NOT NULL DEFAULT 0.5,
  kind TEXT NOT NULL DEFAULT 'semantic',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (src_id, dst_id),
  FOREIGN KEY (src_id) REFERENCES notes(id) ON DELETE CASCADE,
  FOREIGN KEY (dst_id) REFERENCES notes(id) ON DELETE CASCADE
);

-- Index for efficient link lookups
CREATE INDEX idx_links_src ON links(src_id);
CREATE INDEX idx_links_dst ON links(dst_id);
CREATE INDEX idx_links_kind ON links(kind);

-- Tasks table: stores extracted and manual tasks
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  note_id TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  due_at DATETIME NULL,
  meta_json TEXT DEFAULT '{}',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
);

-- Index for task queries
CREATE INDEX idx_tasks_note_id ON tasks(note_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_at ON tasks(due_at);

-- Settings table: stores application configuration
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO settings (key, value_json) VALUES
  ('theme', '{"mode": "light", "accentColor": "#6366f1"}'),
  ('hotkeys', '{"quickCapture": "CmdOrCtrl+Shift+N", "search": "CmdOrCtrl+K"}'),
  ('semantics', '{"linkThreshold": 0.3, "autoExtract": true}'),
  ('digest', '{"enabled": true, "time": "09:00"}');
