# KnowledgeFlow Source Code

This directory contains the complete source code for the KnowledgeFlow application (Stage 3).

## Directory Structure

```
src/
├── main/                      # Backend (Electron/Tauri)
│   ├── index.ts              # Main entry point, IPC handlers
│   ├── storage/              # Database layer
│   │   ├── db.ts            # Database initialization
│   │   ├── migrations/      # SQL migrations
│   │   └── repo/            # Repository pattern (CRUD)
│   ├── security/            # Encryption utilities
│   ├── system/              # System integrations
│   │   ├── hotkeys.ts      # Global hotkeys
│   │   └── digest.ts       # Daily digest builder
│
├── semantics/               # Semantic features
│   ├── extractors/         # Content extraction
│   │   ├── phrases.ts     # NLP phrase extraction
│   │   └── todos.ts       # TODO pattern matching
│   ├── embedding/          # Vector representations
│   │   └── tfidf.ts       # TF-IDF implementation
│   ├── graph/              # Link building
│   │   └── linkEngine.ts  # Semantic link engine
│   └── summarize/          # Summarization
│       └── bullets.ts     # Bullet point extraction
│
├── ui/                     # React frontend
│   ├── main.tsx           # React entry point
│   ├── App.tsx            # Main app component
│   ├── index.css          # Global styles
│   ├── pages/             # Page components
│   │   ├── NotesList.tsx
│   │   ├── NoteEditor.tsx
│   │   ├── GraphView.tsx
│   │   ├── TasksView.tsx
│   │   ├── Settings.tsx
│   │   └── CaptureOverlay.tsx
│   ├── components/        # Reusable components
│   │   ├── NoteCard.tsx
│   │   ├── TagChips.tsx
│   │   ├── TaskList.tsx
│   │   ├── Toolbar.tsx
│   │   └── CommandPalette.tsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useQuickAdd.ts
│   │   ├── useSemanticLinks.ts
│   │   └── useDailyDigest.ts
│   └── lib/              # Utility libraries
│       ├── tokens.ts    # Design tokens
│       └── keyboardMap.ts # Keyboard shortcuts
│
└── tests/               # Test suite
    ├── unit/           # Unit tests
    │   ├── extractors.spec.ts
    │   └── repo.spec.ts
    └── e2e/           # End-to-end tests
        └── smoke.spec.ts
```

## Key Technologies

- **Desktop Framework**: Tauri (Electron alternative)
- **Frontend**: React 18 + TypeScript
- **Database**: SQLite with better-sqlite3
- **NLP**: compromise.js
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Testing**: Vitest (unit) + Playwright (e2e)

## Architecture Patterns

### Repository Pattern
All database operations go through repository modules (`src/main/storage/repo/*`). This provides:
- Consistent API
- Easy testing/mocking
- Separation of concerns

### IPC Communication
Frontend communicates with backend via IPC handlers defined in `src/main/index.ts`:
```typescript
window.electron.invoke('notes:create', noteData)
window.electron.invoke('tasks:list', options)
```

### Semantic Engine
The semantic engine uses TF-IDF for document similarity:
1. Extract key phrases from notes
2. Calculate TF-IDF vectors
3. Compute cosine similarity
4. Create links above threshold (default: 0.3)

## Development Workflow

### Running the App
```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run Tauri app
pnpm dev:tauri
```

### Testing
```bash
# Run unit tests
pnpm test

# Run unit tests in watch mode
pnpm test:watch

# Run e2e tests
pnpm e2e
```

### Seeding Data
```bash
# Populate database with sample data
pnpm seed
```

### Code Quality
```bash
# Lint
pnpm lint

# Format
pnpm format

# Type check
pnpm type-check
```

## Database Schema

See `src/main/storage/migrations/0001_init.sql` for the complete schema.

Key tables:
- **notes**: Main content storage with FTS5 index
- **tasks**: Extracted and manual tasks
- **links**: Semantic and manual relationships
- **settings**: Application configuration

## Stub Implementations

The following features are currently stubs (marked with TODO comments):
- [ ] Encryption (src/main/security/crypto.ts)
- [ ] Graph visualization (src/ui/pages/GraphView.tsx)
- [ ] IPC preload bridge
- [ ] Production-ready error handling
- [ ] Full E2E test suite

These will be implemented in later stages.

## Next Steps (Stage 4+)

1. Implement encryption for sensitive notes
2. Add graph visualization with D3.js or Cytoscape
3. Implement IPC preload script for security
4. Add comprehensive error handling
5. Complete E2E test coverage
6. Performance optimization
7. Production build and packaging
