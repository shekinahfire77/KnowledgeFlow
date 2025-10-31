# APIs & Data Contracts

Version: 0.1
Owner: product-lead
Status: Draft
Last updated: 2025-10-31

## Domain Models (TypeScript Interfaces)

### Core Entities

```typescript
// Note entity
interface Note {
  id: string;                    // UUID v4
  createdAt: Date;
  updatedAt: Date;
  title: string;
  body: string;                  // Markdown text
  tags: string[];                // Array of tag strings
  meta: Record<string, any>;     // Extensible metadata
}

// Task entity
interface Task {
  id: string;                    // UUID v4
  noteId: string;                // Foreign key to Note
  title: string;
  status: 'pending' | 'done' | 'dismissed';
  dueAt?: Date;                  // Optional due date
  meta: Record<string, any>;
  createdAt: Date;
}

// Link entity (semantic graph edge)
interface Link {
  srcId: string;                 // Source note ID
  dstId: string;                 // Destination note ID
  weight: number;                // Similarity score (0.0-1.0)
  kind: 'semantic' | 'manual';   // How link was created
  createdAt: Date;
}

// Embedding vector
interface Embedding {
  noteId: string;                // Foreign key to Note
  vector: number[];              // TF-IDF or dense embedding
  algo: 'tfidf' | 'transformer'; // Algorithm used
  version: string;               // Model/algorithm version
  createdAt: Date;
}

// Daily digest
interface DailyDigest {
  date: Date;
  summary: string;               // Markdown-formatted summary
  noteCount: number;
  taskCount: number;
  createdAt: Date;
}

// Application settings
interface Settings {
  hotkeys: Record<string, string>;
  featureFlags: FeatureFlags;
  privacy: PrivacySettings;
  semantic: SemanticSettings;
}

interface FeatureFlags {
  TAG_EXTRACTION_ENABLED: boolean;
  AUTO_LINKS_ENABLED: boolean;
  ACTION_EXTRACT_ENABLED: boolean;
  DAILY_DIGEST_ENABLED: boolean;
  GRAPH_VIEW_ENABLED: boolean;
  TELEMETRY_ENABLED: boolean;
}

interface PrivacySettings {
  encryptionEnabled: boolean;
  telemetryEnabled: boolean;
  cloudBackupWarningDismissed: boolean;
}

interface SemanticSettings {
  autoLinkThreshold: number;     // 0.1-0.5, default 0.3
  maxGraphNodes: number;         // Default 200
  searchResultLimit: number;     // Default 50
}
```

---

## Repository Interfaces

### NotesRepo

```typescript
interface NotesRepo {
  // Create new note
  create(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note>;

  // Update existing note
  update(id: string, updates: Partial<Note>): Promise<Note>;

  // Delete note (cascade deletes tasks and links)
  delete(id: string): Promise<void>;

  // Get note by ID
  getById(id: string): Promise<Note | null>;

  // List notes with optional filters
  list(filters?: {
    tags?: string[];           // Filter by tags (OR logic)
    since?: Date;              // Created/updated after this date
    limit?: number;            // Max results
    offset?: number;           // Pagination offset
  }): Promise<Note[]>;

  // Full-text search
  search(query: string, limit?: number): Promise<SearchResult[]>;

  // Get notes count
  count(): Promise<number>;
}

interface SearchResult {
  note: Note;
  snippet: string;               // Highlighted snippet with **matches**
  score: number;                 // BM25 relevance score
}
```

**Example Usage**:
```typescript
const notesRepo = new NotesRepo();

// Create
const note = await notesRepo.create({
  title: 'Q4 Planning',
  body: 'TODO: Review budget',
  tags: ['planning', 'q4'],
  meta: {}
});

// Search
const results = await notesRepo.search('budget', 10);
console.log(results[0].snippet); // "TODO: Review **budget**"
```

---

### TasksRepo

```typescript
interface TasksRepo {
  // Create new task
  create(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task>;

  // Update task (e.g., mark done)
  update(id: string, updates: Partial<Task>): Promise<Task>;

  // Delete task
  delete(id: string): Promise<void>;

  // Get task by ID
  getById(id: string): Promise<Task | null>;

  // List tasks by note
  listByNote(noteId: string): Promise<Task[]>;

  // List all tasks with optional status filter
  listAll(status?: Task['status']): Promise<Task[]>;

  // Bulk update (e.g., mark multiple done)
  bulkUpdate(ids: string[], updates: Partial<Task>): Promise<void>;
}
```

**Example Usage**:
```typescript
const tasksRepo = new TasksRepo();

// Create
const task = await tasksRepo.create({
  noteId: note.id,
  title: 'Review budget',
  status: 'pending',
  meta: { extractedBy: 'pattern' }
});

// Mark done
await tasksRepo.update(task.id, { status: 'done' });

// List pending
const pending = await tasksRepo.listAll('pending');
```

---

### LinksRepo

```typescript
interface LinksRepo {
  // Create new link
  create(link: Omit<Link, 'createdAt'>): Promise<void>;

  // Delete specific link
  delete(srcId: string, dstId: string): Promise<void>;

  // Get all links for a note (bidirectional)
  getForNote(noteId: string): Promise<Link[]>;

  // Delete all links for a note
  deleteForNote(noteId: string): Promise<void>;

  // Rebuild all semantic links (clears old, creates new)
  rebuildAll(): Promise<void>;

  // List all links
  listAll(): Promise<Link[]>;

  // Get link count
  count(): Promise<number>;
}
```

**Example Usage**:
```typescript
const linksRepo = new LinksRepo();

// Create link
await linksRepo.create({
  srcId: note1.id,
  dstId: note2.id,
  weight: 0.8,
  kind: 'semantic'
});

// Get connections for note
const links = await linksRepo.getForNote(note1.id);
```

---

### SettingsRepo

```typescript
interface SettingsRepo {
  // Get all settings
  get(): Promise<Settings>;

  // Update settings (merge with existing)
  update(settings: Partial<Settings>): Promise<Settings>;

  // Reset to defaults
  reset(): Promise<Settings>;

  // Get specific setting
  getSetting<K extends keyof Settings>(key: K): Promise<Settings[K]>;

  // Update specific setting
  updateSetting<K extends keyof Settings>(key: K, value: Settings[K]): Promise<void>;
}
```

**Example Usage**:
```typescript
const settingsRepo = new SettingsRepo();

// Get all
const settings = await settingsRepo.get();

// Update feature flag
await settingsRepo.updateSetting('featureFlags', {
  ...settings.featureFlags,
  ACTION_EXTRACT_ENABLED: true
});
```

---

## Semantic Engine Interface

```typescript
interface SemanticEngine {
  // Extract tags from note content
  extractTags(note: Note): Promise<string[]>;

  // Generate embedding vector for note
  embed(note: Note): Promise<Embedding>;

  // Build semantic links for all notes
  linkAll(): Promise<number>;  // Returns count of links created

  // Build semantic links for single note (incremental)
  linkNote(noteId: string): Promise<Link[]>;

  // Summarize notes into digest
  summarize(notes: Note[]): Promise<string>;
}
```

**Example Usage**:
```typescript
const semanticEngine = new SemanticEngine();

// Extract tags
const tags = await semanticEngine.extractTags(note);
console.log(tags); // ['q4-planning', 'budget-review']

// Build all links
const linkCount = await semanticEngine.linkAll();
console.log(`Created ${linkCount} links`);
```

---

## Digest Engine Interface

```typescript
interface DigestEngine {
  // Build digest for time range
  buildDigest(options: {
    since: Date;
    until?: Date;
  }): Promise<DailyDigest>;

  // Get last digest
  getLastDigest(): Promise<DailyDigest | null>;

  // List historical digests
  listDigests(limit?: number): Promise<DailyDigest[]>;
}
```

**Example Usage**:
```typescript
const digestEngine = new DigestEngine();

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

const digest = await digestEngine.buildDigest({ since: yesterday });
console.log(digest.summary);
```

---

## Example Payloads

### Create Note (Request/Response)

**Request** (TypeScript):
```typescript
const note = await notesRepo.create({
  title: 'Q4 Planning Session',
  body: 'TODO: Review budget\n\n## Key Points\n- Revenue target: $500k\n- Hiring freeze',
  tags: ['planning', 'q4'],
  meta: { source: 'quick-capture' }
});
```

**Response** (Note object):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2025-11-15T14:30:00.000Z",
  "updatedAt": "2025-11-15T14:30:00.000Z",
  "title": "Q4 Planning Session",
  "body": "TODO: Review budget\n\n## Key Points\n- Revenue target: $500k\n- Hiring freeze",
  "tags": ["planning", "q4", "budget", "revenue"],
  "meta": { "source": "quick-capture" }
}
```

**Note**: Tags array includes both user-provided (`planning`, `q4`) and auto-extracted (`budget`, `revenue`).

---

### Search Notes

**Request**:
```typescript
const results = await notesRepo.search('budget', 10);
```

**Response** (SearchResult[]):
```json
[
  {
    "note": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Q4 Planning Session",
      "body": "TODO: Review budget\n\n...",
      "tags": ["planning", "q4", "budget"],
      "createdAt": "2025-11-15T14:30:00.000Z",
      "updatedAt": "2025-11-15T14:30:00.000Z",
      "meta": {}
    },
    "snippet": "TODO: Review **budget**\n\nRevenue target: $500k",
    "score": 0.85
  }
]
```

---

### List Tasks

**Request**:
```typescript
const tasks = await tasksRepo.listAll('pending');
```

**Response** (Task[]):
```json
[
  {
    "id": "7a3f9c2b-4d5e-6f7g-8h9i-0j1k2l3m4n5o",
    "noteId": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Review budget",
    "status": "pending",
    "dueAt": null,
    "meta": {
      "extractedBy": "pattern",
      "pattern": "TODO:\\s*(.+)"
    },
    "createdAt": "2025-11-15T14:30:05.000Z"
  }
]
```

---

### Get Graph Links

**Request**:
```typescript
const links = await linksRepo.listAll();
```

**Response** (Link[]):
```json
[
  {
    "srcId": "550e8400-e29b-41d4-a716-446655440000",
    "dstId": "7a3f9c2b-4d5e-6f7g-8h9i-0j1k2l3m4n5o",
    "weight": 0.75,
    "kind": "semantic",
    "createdAt": "2025-11-15T14:35:00.000Z"
  }
]
```

---

### Get Settings

**Request**:
```typescript
const settings = await settingsRepo.get();
```

**Response** (Settings):
```json
{
  "hotkeys": {
    "quickCapture": "Ctrl+Shift+K",
    "newNote": "Ctrl+N",
    "search": "Ctrl+F",
    "notesList": "Ctrl+1",
    "noteEditor": "Ctrl+2",
    "tasksView": "Ctrl+3",
    "graphView": "Ctrl+4",
    "settings": "Ctrl+5"
  },
  "featureFlags": {
    "TAG_EXTRACTION_ENABLED": true,
    "AUTO_LINKS_ENABLED": true,
    "ACTION_EXTRACT_ENABLED": false,
    "DAILY_DIGEST_ENABLED": true,
    "GRAPH_VIEW_ENABLED": true,
    "TELEMETRY_ENABLED": false
  },
  "privacy": {
    "encryptionEnabled": true,
    "telemetryEnabled": false,
    "cloudBackupWarningDismissed": false
  },
  "semantic": {
    "autoLinkThreshold": 0.3,
    "maxGraphNodes": 200,
    "searchResultLimit": 50
  }
}
```

---

## Error Handling

### Error Types

```typescript
class DatabaseError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

class NotFoundError extends Error {
  constructor(resource: string, id: string) {
    super(`${resource} with ID ${id} not found`);
    this.name = 'NotFoundError';
  }
}

class EncryptionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EncryptionError';
  }
}

class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

### Example Error Responses

**Not Found**:
```typescript
try {
  const note = await notesRepo.getById('invalid-id');
} catch (err) {
  if (err instanceof NotFoundError) {
    console.error('Note not found');
  }
}
```

**Database Error**:
```typescript
try {
  await notesRepo.create(note);
} catch (err) {
  if (err instanceof DatabaseError && err.code === 'SQLITE_LOCKED') {
    console.error('Database is locked, retry later');
  }
}
```

---

## Database Schema (SQLite)

### Tables

```sql
-- Notes table
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

-- Full-text search index
CREATE VIRTUAL TABLE notes_fts USING fts5(
  title, body,
  content=notes,
  content_rowid=rowid
);

-- Tasks table
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

-- Links table
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

-- Embeddings table
CREATE TABLE embeddings (
  note_id TEXT PRIMARY KEY,
  vector_json TEXT NOT NULL,
  algo TEXT NOT NULL DEFAULT 'tfidf',
  version TEXT NOT NULL DEFAULT '1.0',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
);

-- Settings table
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## Migration Strategy

### Migration Files

**Location**: `src/main/storage/migrations/`

**Naming**: `XXXX_description.sql` (e.g., `0001_init.sql`, `0002_add_digest_table.sql`)

**Format**:
```sql
-- Migration: 0002_add_digest_table
-- Description: Add table for storing daily digests
-- Applied: 2025-11-20

CREATE TABLE digests (
  id TEXT PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  note_count INTEGER NOT NULL,
  task_count INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Tracking**:
```sql
CREATE TABLE migrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Execution**:
```typescript
async function runMigrations(db: Database) {
  const appliedMigrations = db.prepare('SELECT name FROM migrations').all();
  const appliedSet = new Set(appliedMigrations.map((m: any) => m.name));

  const migrationFiles = fs.readdirSync('./migrations').sort();

  for (const file of migrationFiles) {
    if (!appliedSet.has(file)) {
      const sql = fs.readFileSync(`./migrations/${file}`, 'utf8');
      db.exec(sql);
      db.prepare('INSERT INTO migrations (name) VALUES (?)').run(file);
      console.log(`Applied migration: ${file}`);
    }
  }
}
```

---

## Versioning & Compatibility

**API Version**: v1 (MVP)
**Database Schema Version**: 1

**Breaking Changes**: Require new major version (v2)
**Non-Breaking Changes**: Same version, handled via migrations

**Example**: Adding `digest` table is non-breaking (existing data unaffected). Renaming `notes.title` to `notes.name` is breaking (old code fails).

---

**Last Updated**: 2025-10-31
**Owner**: product-lead + dev-lead
