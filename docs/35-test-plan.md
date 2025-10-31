# Test Plan & QA Strategy

Version: 0.1
Owner: product-lead
Status: Draft
Last updated: 2025-10-31

## Test Strategy

### Testing Pyramid

```
          /\
         /E2E\          10% - End-to-End (Playwright)
        /______\
       /        \
      /Integration\     30% - Integration Tests
     /____________\
    /              \
   /   Unit Tests   \   60% - Unit Tests (Vitest)
  /__________________\
```

**Rationale**: Unit tests are fast and catch most bugs. Integration tests verify components work together. E2E tests validate user flows but are slow and brittle.

---

## Unit Tests (Vitest)

### Coverage Target
**Minimum**: 70% overall
**Critical Modules**: 90% (repos, extractors, crypto)

### Test Scope

#### 1. Semantic Extractors
**File**: `src/tests/unit/extractors.spec.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { extractPhrases } from '../../semantics/extractors/phrases';
import { extractTodos } from '../../semantics/extractors/todos';

describe('PhraseExtractor', () => {
  it('should extract multi-word noun phrases', () => {
    const note = {
      id: '1',
      title: 'Q4 Planning Session',
      body: 'Review the budget for next quarter.',
      tags: [],
      meta: {},
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const phrases = extractPhrases(note);
    expect(phrases).toContain('q4-planning');
    expect(phrases).toContain('budget-review');
  });

  it('should filter single-word phrases', () => {
    const note = {
      id: '1',
      title: 'Budget',
      body: 'Review',
      tags: [],
      meta: {},
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const phrases = extractPhrases(note);
    expect(phrases).toHaveLength(0);
  });

  it('should handle empty note', () => {
    const note = {
      id: '1',
      title: '',
      body: '',
      tags: [],
      meta: {},
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const phrases = extractPhrases(note);
    expect(phrases).toHaveLength(0);
  });
});

describe('TodoExtractor', () => {
  it('should extract TODO pattern', () => {
    const note = {
      id: '1',
      body: 'TODO: review budget'
    };

    const todos = extractTodos(note as any);
    expect(todos).toHaveLength(1);
    expect(todos[0].title).toBe('review budget');
  });

  it('should extract Markdown checkbox pattern', () => {
    const note = {
      id: '1',
      body: '- [ ] Call client\n- [x] Done item'
    };

    const todos = extractTodos(note as any);
    expect(todos).toHaveLength(1);  // Only unchecked
    expect(todos[0].title).toBe('Call client');
  });

  it('should skip items in code blocks', () => {
    const note = {
      id: '1',
      body: '```\nTODO: this is code\n```\n\nTODO: real task'
    };

    const todos = extractTodos(note as any);
    expect(todos).toHaveLength(1);
    expect(todos[0].title).toBe('real task');
  });
});
```

#### 2. TF-IDF Engine
**File**: `src/tests/unit/tfidf.spec.ts`

```typescript
describe('TfIdfEngine', () => {
  it('should compute cosine similarity correctly', () => {
    const engine = new TfIdfEngine();
    const vecA = [1, 0, 1, 0];
    const vecB = [1, 1, 0, 0];

    const sim = engine.cosineSimilarity(vecA, vecB);
    expect(sim).toBeCloseTo(0.5, 2);
  });

  it('should build TF-IDF index from notes', () => {
    const engine = new TfIdfEngine();
    const notes = [
      { id: '1', title: 'Budget', body: 'Q4 budget planning', tags: [], meta: {}, createdAt: new Date(), updatedAt: new Date() },
      { id: '2', title: 'Meeting', body: 'Q4 meeting notes', tags: [], meta: {}, createdAt: new Date(), updatedAt: new Date() }
    ];

    notes.forEach(n => engine.addDocument(n));
    engine.buildIndex();

    const vec1 = engine.vectorize(notes[0]);
    const vec2 = engine.vectorize(notes[1]);

    const sim = engine.cosineSimilarity(vec1, vec2);
    expect(sim).toBeGreaterThan(0.3);  // Share "q4"
  });
});
```

#### 3. Repository CRUD
**File**: `src/tests/unit/repo.spec.ts`

```typescript
describe('NotesRepo', () => {
  let repo: NotesRepo;

  beforeEach(async () => {
    // Use in-memory SQLite for tests
    await initDatabase(':memory:');
    repo = new NotesRepo();
  });

  it('should create note', async () => {
    const note = await repo.create({
      title: 'Test',
      body: 'Test body',
      tags: ['test'],
      meta: {}
    });

    expect(note.id).toBeDefined();
    expect(note.title).toBe('Test');
  });

  it('should update note', async () => {
    const note = await repo.create({ title: 'Original', body: '', tags: [], meta: {} });
    const updated = await repo.update(note.id, { title: 'Updated' });

    expect(updated.title).toBe('Updated');
    expect(updated.updatedAt).not.toEqual(note.updatedAt);
  });

  it('should delete note', async () => {
    const note = await repo.create({ title: 'Test', body: '', tags: [], meta: {} });
    await repo.delete(note.id);

    const found = await repo.getById(note.id);
    expect(found).toBeNull();
  });

  it('should search notes', async () => {
    await repo.create({ title: 'Budget Planning', body: 'Q4 review', tags: [], meta: {} });
    await repo.create({ title: 'Meeting', body: 'Q1 notes', tags: [], meta: {} });

    const results = await repo.search('budget');
    expect(results).toHaveLength(1);
    expect(results[0].note.title).toContain('Budget');
  });
});
```

#### 4. Crypto Helpers
**File**: `src/tests/unit/crypto.spec.ts`

```typescript
describe('Encryption', () => {
  it('should encrypt and decrypt correctly', () => {
    const key = generateKey();
    const plaintext = 'Sensitive data';

    const ciphertext = encryptBlob(plaintext, key);
    const decrypted = decryptBlob(ciphertext, key);

    expect(decrypted).toBe(plaintext);
  });

  it('should fail decryption with wrong key', () => {
    const key1 = generateKey();
    const key2 = generateKey();
    const ciphertext = encryptBlob('Secret', key1);

    expect(() => decryptBlob(ciphertext, key2)).toThrow();
  });
});
```

---

## Integration Tests

### Test Scope

#### 1. Database Migrations
```typescript
describe('Database Migrations', () => {
  it('should apply all migrations successfully', async () => {
    const db = await initDatabase(':memory:');

    // Check migrations table exists
    const migrations = db.prepare('SELECT * FROM migrations').all();
    expect(migrations.length).toBeGreaterThan(0);

    // Check notes table exists
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    expect(tables.some((t: any) => t.name === 'notes')).toBe(true);
  });
});
```

#### 2. Repo + Semantic Engine
```typescript
describe('Note Creation + Tag Extraction', () => {
  it('should create note and extract tags', async () => {
    const repo = new NotesRepo();
    const engine = new SemanticEngine();

    const note = await repo.create({
      title: 'Q4 Planning',
      body: 'Review budget for next quarter',
      tags: ['planning'],
      meta: {}
    });

    const extractedTags = await engine.extractTags(note);
    expect(extractedTags).toContain('q4-planning');
    expect(extractedTags).toContain('budget-review');

    // Update note with extracted tags
    await repo.update(note.id, { tags: [...note.tags, ...extractedTags] });

    const updated = await repo.getById(note.id);
    expect(updated?.tags).toContain('q4-planning');
  });
});
```

#### 3. Link Generation
```typescript
describe('Semantic Link Building', () => {
  it('should build links between related notes', async () => {
    const notesRepo = new NotesRepo();
    const linksRepo = new LinksRepo();
    const linkEngine = new LinkEngine(notesRepo, linksRepo);

    // Create related notes
    const note1 = await notesRepo.create({
      title: 'Q4 Budget Planning',
      body: 'Review revenue projections and expenses',
      tags: [],
      meta: {}
    });

    const note2 = await notesRepo.create({
      title: 'Budget Review Meeting',
      body: 'Discussed Q4 revenue targets',
      tags: [],
      meta: {}
    });

    // Build links
    const linkCount = await linkEngine.linkAll();
    expect(linkCount).toBeGreaterThan(0);

    // Verify link exists
    const links = await linksRepo.getForNote(note1.id);
    expect(links.some(l => l.dstId === note2.id)).toBe(true);
  });
});
```

---

## E2E Tests (Playwright)

### Test Environment
- **Target**: Windows 10 64-bit
- **Browser**: Chromium (Tauri uses Webview2)
- **Resolution**: 1920x1080

### Test Scope

#### 1. Smoke Test
**File**: `src/tests/e2e/smoke.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test('app launches and shows empty state', async ({ page }) => {
  // Launch Tauri app (requires tauri-driver)
  await page.goto('http://localhost:5173');

  // Check title
  await expect(page).toHaveTitle(/KnowledgeFlow/);

  // Check empty state
  await expect(page.locator('text=No notes yet')).toBeVisible();

  // Check "Create Note" button exists
  await expect(page.locator('button', { hasText: 'Create Note' })).toBeVisible();
});
```

#### 2. Quick Capture Flow
```typescript
test('Quick Capture flow', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Simulate global hotkey (Ctrl+Shift+K)
  await page.keyboard.press('Control+Shift+K');

  // Check overlay appears
  await expect(page.locator('.capture-overlay')).toBeVisible();

  // Fill title
  await page.fill('[aria-label="Note title"]', 'Test Note');
  await page.keyboard.press('Tab');

  // Fill body
  await page.fill('[aria-label="Note body"]', 'This is a test note.');

  // Save
  await page.keyboard.press('Control+S');

  // Check overlay closes
  await expect(page.locator('.capture-overlay')).not.toBeVisible();

  // Verify note appears in list
  await expect(page.locator('.note-card', { hasText: 'Test Note' })).toBeVisible();
});
```

#### 3. Search Flow
```typescript
test('Search finds note', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Create a note first
  await page.click('button:has-text("Create Note")');
  await page.fill('[aria-label="Note title"]', 'Budget Planning');
  await page.fill('[aria-label="Note body"]', 'Q4 revenue review');
  await page.keyboard.press('Control+S');

  // Open search
  await page.keyboard.press('Control+F');

  // Type query
  await page.fill('[aria-label="Search"]', 'budget');

  // Wait for results
  await page.waitForSelector('.search-result', { timeout: 5000 });

  // Verify result
  await expect(page.locator('.search-result', { hasText: 'Budget Planning' })).toBeVisible();

  // Open note from results
  await page.click('.search-result:has-text("Budget Planning")');

  // Verify editor opens
  await expect(page.locator('.note-editor')).toBeVisible();
  await expect(page.locator('input[value="Budget Planning"]')).toBeVisible();
});
```

#### 4. Graph View Flow
```typescript
test('Graph View renders and allows navigation', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Create two related notes
  await createNote(page, 'Note 1', 'Q4 budget planning');
  await createNote(page, 'Note 2', 'Budget review meeting');

  // Open Graph View
  await page.keyboard.press('Control+4');

  // Wait for graph to render
  await page.waitForSelector('.cytoscape-container', { timeout: 5000 });

  // Check nodes exist
  const nodes = await page.locator('.cytoscape-node').count();
  expect(nodes).toBeGreaterThanOrEqual(2);

  // Check edges exist
  const edges = await page.locator('.cytoscape-edge').count();
  expect(edges).toBeGreaterThanOrEqual(1);

  // Double-click node to open note (requires custom Cytoscape interaction)
  // TODO: Implement Cytoscape event simulation
});

async function createNote(page: any, title: string, body: string) {
  await page.click('button:has-text("Create Note")');
  await page.fill('[aria-label="Note title"]', title);
  await page.fill('[aria-label="Note body"]', body);
  await page.keyboard.press('Control+S');
  await page.waitForTimeout(500);  // Wait for save
}
```

#### 5. Settings Persistence
```typescript
test('Settings persist across restarts', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Open Settings
  await page.keyboard.press('Control+5');

  // Toggle feature flag
  await page.click('[data-testid="ACTION_EXTRACT_ENABLED"]');

  // Close settings
  await page.keyboard.press('Escape');

  // Restart app (reload page simulates restart)
  await page.reload();

  // Open Settings again
  await page.keyboard.press('Control+5');

  // Verify toggle is still on
  const toggle = page.locator('[data-testid="ACTION_EXTRACT_ENABLED"]');
  await expect(toggle).toBeChecked();
});
```

---

## Performance Tests

### Benchmark Suite
**File**: `src/tests/performance/benchmarks.spec.ts`

```typescript
describe('Performance Benchmarks', () => {
  it('Cold start ≤2s', async () => {
    const start = Date.now();
    await launchApp();
    await waitForUIInteractive();
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(2000);
  });

  it('Search p95 ≤150ms (1000 notes)', async () => {
    // Seed 1000 notes
    await seedNotes(1000);

    const latencies: number[] = [];

    // Run 100 searches
    for (let i = 0; i < 100; i++) {
      const start = Date.now();
      await notesRepo.search('test query');
      const duration = Date.now() - start;
      latencies.push(duration);
    }

    const p95 = percentile(latencies, 95);
    expect(p95).toBeLessThan(150);
  });

  it('Graph render ≤1s (100 notes)', async () => {
    await seedNotes(100);
    await linkEngine.linkAll();

    const start = Date.now();
    await renderGraph();
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(1000);
  });
});

function percentile(arr: number[], p: number): number {
  const sorted = arr.slice().sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[index];
}
```

---

## Accessibility Tests

### Lighthouse Audit
```bash
# Run Lighthouse in CI
npx lighthouse http://localhost:5173 \
  --only-categories=accessibility \
  --output=html \
  --output-path=./accessibility-report.html

# Assert score ≥90
```

### Manual Testing Checklist
- [ ] Keyboard navigation works (Tab through all elements)
- [ ] Focus indicators visible (2px blue outline)
- [ ] NVDA screen reader announces all actions
- [ ] Color contrast ≥4.5:1 (WebAIM Contrast Checker)
- [ ] ARIA labels on all interactive elements
- [ ] High contrast mode works (Windows settings)
- [ ] Reduced motion respected (`prefers-reduced-motion`)

---

## Security Tests

### SQL Injection Test
```typescript
describe('SQL Injection Prevention', () => {
  it('should not allow SQL injection in search', async () => {
    const maliciousQuery = "'; DROP TABLE notes; --";

    // Should not crash or execute malicious SQL
    expect(async () => {
      await notesRepo.search(maliciousQuery);
    }).not.toThrow();

    // Verify notes table still exists
    const notes = await notesRepo.list();
    expect(notes).toBeDefined();
  });
});
```

### XSS Prevention Test
```typescript
describe('XSS Prevention', () => {
  it('should sanitize Markdown with script tags', () => {
    const maliciousMd = '<script>alert("XSS")</script>';
    const html = renderMarkdown(maliciousMd);

    expect(html).not.toContain('<script>');
    expect(html).not.toContain('alert');
  });
});
```

### Encryption Test
```typescript
describe('Encryption Security', () => {
  it('should store encrypted data in database', async () => {
    // Enable encryption
    await settingsRepo.updateSetting('privacy', { encryptionEnabled: true });

    // Create note
    const note = await notesRepo.create({
      title: 'Secret',
      body: 'Sensitive information',
      tags: [],
      meta: {}
    });

    // Read raw database
    const db = getDatabase();
    const row = db.prepare('SELECT enc_blob FROM notes WHERE id = ?').get(note.id);

    // Verify body is not readable
    expect(row.enc_blob).toBeDefined();
    expect(row.enc_blob.toString('utf8')).not.toContain('Sensitive information');
  });
});
```

---

## Acceptance Criteria Checklist

### Documentation
- [ ] All 12 docs (25-36) exist with version headers
- [ ] MoSCoW aligns with feature flags in code
- [ ] Keyboard map in docs matches keyboardMap.ts

### UX
- [ ] 6 SVG wireframes exist in `/design/wireframes/`
- [ ] Design tokens JSON files exist and used in UI

### Application
- [ ] App runs on Windows 10 1903+
- [ ] Global hotkey (Ctrl+Shift+K) opens Quick Capture
- [ ] Can create, edit, delete notes
- [ ] Search works via FTS (results appear <150ms)
- [ ] Semantic engine builds links (visible in Graph View)
- [ ] Graph View renders with force-directed layout
- [ ] Action extraction creates tasks (if enabled)
- [ ] Daily digest renders markdown summary
- [ ] Data encrypted at rest (verified via hex dump)
- [ ] Settings toggles persist across restarts

### Tests
- [ ] All unit tests pass (`pnpm test`)
- [ ] E2E smoke test passes on Windows
- [ ] Coverage ≥70%

### Performance
- [ ] Cold start ≤2s (mid-range laptop)
- [ ] Search p95 ≤150ms (1k notes)
- [ ] Memory ≤300MB idle

### Privacy
- [ ] No outbound network calls (verified with Wireshark)
- [ ] Telemetry off by default
- [ ] Encryption works (can decrypt notes)

---

## Test Execution

### Local Development
```bash
# Unit tests (watch mode)
pnpm test:watch

# Unit tests (single run)
pnpm test

# E2E tests
pnpm e2e

# Performance benchmarks
pnpm test:perf

# Coverage report
pnpm test:coverage
```

### CI/CD Pipeline
```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - run: npm install
      - run: npm run test:coverage
      - run: npm run e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## Test Data Management

### Seed Data
**File**: `seed/notes.sample.json` (10 sample notes)

**Seed Script**:
```bash
pnpm seed  # Populates database with sample data
```

### Test Fixtures
```typescript
// fixtures/notes.ts
export const sampleNote: Note = {
  id: 'test-id-1',
  title: 'Test Note',
  body: 'This is a test note.',
  tags: ['test'],
  meta: {},
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01')
};
```

---

**Last Updated**: 2025-10-31
**Owner**: product-lead + qa-lead
