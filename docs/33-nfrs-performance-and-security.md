# Non-Functional Requirements: Performance & Security

Version: 0.1
Owner: product-lead
Status: Draft
Last updated: 2025-10-31

## Performance Requirements

### Cold Start Time
**Target**: ≤2 seconds on mid-range laptop
**Measurement**: Time from process start to UI interactive (user can type in search box)

**Test Environment**:
- CPU: Intel i5-8th gen or equivalent (4 cores, 2.8 GHz)
- RAM: 8GB DDR4
- Storage: SATA SSD (not NVMe)
- OS: Windows 10 version 1903+

**Budget Breakdown**:
| Phase | Target Time | Description |
|-------|-------------|-------------|
| Process init | 500ms | Tauri bootstrap, Node.js runtime start |
| DB connection | 200ms | Open SQLite file, run PRAGMA queries |
| Initial render | 800ms | React app mount, render Notes List |
| First paint | 500ms | Browser paints UI (user sees content) |
| **Total** | **2000ms** | **Interactive** |

**Optimization Strategies**:
- Lazy-load Graph View (don't initialize Cytoscape on startup)
- Defer semantic indexing to background thread
- Cache last view state (restore Notes List without query on second launch)
- Use SQLite WAL mode for faster writes (no lock delays)

**Failure Mode**: If cold start exceeds 3s consistently, investigate:
- Database size (large database = slower open)
- Antivirus interference (real-time scanning can block file access)
- Disk I/O bottleneck (check with Task Manager)

---

### Search Latency
**Target**: p95 ≤150ms for 1,000 notes
**Measurement**: Time from keystroke in search box to results rendered

**Percentiles**:
- p50 (median): ≤80ms
- p95: ≤150ms
- p99: ≤250ms

**Implementation**: SQLite FTS5 with BM25 ranking
**Query Optimization**:
- Index title and body columns with FTS5 virtual table
- Limit results to top 50 (prevents rendering slowdown)
- Use prepared statements (avoid query parsing overhead)

**Scaling Test**:
- 1,000 notes: p95 ≤150ms ✅
- 10,000 notes: p95 ≤300ms (acceptable)
- 100,000 notes: Expected degradation (not target use case, but should remain <1s)

**User Experience**: Search feels "instant" at <100ms. 150ms is perceptual threshold.

---

### Memory Footprint
**Target**: ≤300MB RAM at idle
**Peak**: ≤500MB with Graph View open (100 notes)

**Measurement**: Windows Task Manager → Process memory

**Breakdown**:
| Component | Expected Usage | Notes |
|-----------|----------------|-------|
| Tauri/Webview | 80MB | Chromium-based renderer |
| React app | 50MB | Virtual DOM, component state |
| SQLite | 30MB | Database cache (PRAGMA cache_size) |
| Cytoscape (if loaded) | 100MB | Graph layout engine, canvas rendering |
| Node.js runtime | 40MB | Background processes |
| **Total (idle)** | **200MB** | Without Graph View |
| **Total (peak)** | **400MB** | With Graph View + 100 notes |

**Optimization**:
- Virtualize long lists (Notes List with 1000+ items)
- Unload Graph View when not visible (free memory)
- Limit graph nodes to 200 max (hide rest with pagination)
- Use `window.gc()` on view change (if available in Electron)

**Warning Threshold**: If memory exceeds 600MB, show notification "High memory usage detected. Consider closing unused views."

---

### CPU Usage
**Target**: <1% CPU at idle
**Peak**: ≤25% CPU during indexing, ≤50% CPU during graph layout (max 2 seconds)

**Measurement**: Windows Task Manager → CPU column

**Scenarios**:
| Activity | Expected CPU | Duration | Notes |
|----------|--------------|----------|-------|
| Idle (no typing) | <1% | Continuous | Background auto-save timer only |
| Typing in editor | 5-10% | Per keystroke | Debounced save, syntax highlighting |
| Tag extraction | 10-20% | <500ms | NLP processing (compromise.js) |
| Full-text search | 15-25% | <150ms | SQLite FTS5 query |
| Graph layout | 30-50% | 1-2s | Force-directed simulation (Cytoscape) |
| Link generation | 20-40% | 3-5s | TF-IDF vectorization + similarity |

**Optimization**:
- Use Web Workers for heavy compute (tag extraction, link generation)
- Debounce user input (don't recompute on every keystroke)
- Stop graph layout after 2 seconds (prevent infinite simulation)
- Rate-limit auto-save (max 1 write per 2 seconds)

---

### Disk I/O
**Target**: Minimize writes to extend SSD lifespan, avoid blocking UI

**Auto-Save Strategy**:
- Debounced to 2 seconds after last keystroke
- Coalesce multiple edits into single write
- Use SQLite WAL mode (write-ahead logging) for concurrent reads during write

**Database Size**:
| Data | Expected Size (1000 notes) | Notes |
|------|----------------------------|-------|
| Notes table | ~10MB | Avg 500 words/note, UTF-8 |
| FTS index | ~5MB | Compressed, BM25 ranking data |
| Links table | ~1MB | 100 links/note avg |
| Embeddings | ~20MB | TF-IDF vectors (sparse) |
| **Total** | **~40MB** | For 1000 notes |

**Scaling**:
- 10,000 notes: ~400MB (manageable)
- 100,000 notes: ~4GB (exceeds target, warn user)

**Compression**: SQLite auto-compresses (no additional config needed)

---

### Graph Rendering Performance
**Target**: ≤1 second render for 100 notes with 50 links

**Measurement**: Time from "loading graph..." to stable layout (no more node movement)

**Performance Factors**:
- Node count: Linear (O(N))
- Edge count: Linear (O(E))
- Layout algorithm: O(N²) for force-directed (expensive)

**Optimizations**:
- Limit visible nodes to 200 (virtualize rest)
- Limit visible edges by weight threshold (hide weak links)
- Stop force simulation after 2 seconds (prevent long tail)
- Use static layout for large graphs (skip force-directed)

**Degradation Strategy**:
- 0-200 nodes: Force-directed layout (animated)
- 200-500 nodes: Circular layout (instant)
- 500+ nodes: Show warning "Graph too large. Filter by tags or date range."

---

## Security Requirements

### Encryption Standards
**Algorithm**: AES-256-GCM (Galois/Counter Mode)
**Library**: libsodium (sodium-native npm package)
**Key Size**: 256 bits (32 bytes)
**Nonce/IV**: 96 bits (12 bytes), randomly generated per encryption
**Authentication Tag**: 128 bits (16 bytes)

**Compliance**: NIST SP 800-38D (FIPS approved)

**Implementation**:
```typescript
import sodium from 'sodium-native';

function encrypt(plaintext: string, key: Buffer): Buffer {
  const nonce = Buffer.alloc(sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES);
  sodium.randombytes_buf(nonce);

  const ciphertext = Buffer.alloc(plaintext.length + sodium.crypto_aead_xchacha20poly1305_ietf_ABYTES);
  sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
    ciphertext,
    Buffer.from(plaintext, 'utf8'),
    null,  // No additional data
    null,  // No secret nonce
    nonce,
    key
  );

  // Return: nonce || ciphertext (with tag appended)
  return Buffer.concat([nonce, ciphertext]);
}
```

**Key Derivation** (if using passphrase):
- Algorithm: PBKDF2-SHA256
- Iterations: 100,000 (OWASP recommendation for 2025)
- Salt: 128-bit random salt (stored in settings table)
- Output: 256-bit key

---

### Input Validation & Sanitization

**SQL Injection Prevention**:
- ✅ Use parameterized queries (never string concatenation)
- ✅ better-sqlite3 bindings escape all inputs
- ✅ Never use `db.exec()` with user input (only for migrations)

**Example**:
```typescript
// ✅ SAFE
db.prepare('SELECT * FROM notes WHERE title = ?').get(userInput);

// ❌ UNSAFE (never do this)
db.exec(`SELECT * FROM notes WHERE title = '${userInput}'`);
```

**XSS Prevention** (Markdown Rendering):
- ✅ Sanitize HTML output with DOMPurify
- ✅ Never use `dangerouslySetInnerHTML` without sanitization
- ✅ Content Security Policy (CSP) in Tauri webview

**Example**:
```typescript
import DOMPurify from 'dompurify';
import { marked } from 'marked';

function renderMarkdown(md: string): string {
  const html = marked(md);
  return DOMPurify.sanitize(html);
}
```

**CSP Headers** (tauri.conf.json):
```json
{
  "tauri": {
    "security": {
      "csp": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'none';"
    }
  }
}
```

**Path Traversal Prevention**:
- ✅ Never use user input directly in file paths
- ✅ Validate file extensions (if file import feature added)
- ✅ Use `path.basename()` to strip directory components

---

### Dependency Security

**Audit Process**:
- Weekly `npm audit` in CI/CD pipeline
- Critical vulnerabilities: Patch within 48 hours
- High vulnerabilities: Patch within 1 week
- Medium/Low: Patch in next release

**Lockfile**: `package-lock.json` committed to repo (ensures reproducible builds)

**Minimize Dependencies**: Only use well-maintained, audited libraries
- **better-sqlite3**: 3M+ downloads/week, actively maintained
- **libsodium**: Industry-standard crypto, FIPS-approved
- **React**: 20M+ downloads/week, Facebook-backed
- **Tauri**: 50k+ stars, Rust-based (memory-safe)

**Avoid**:
- Packages with <1k weekly downloads (low maintenance risk)
- Packages with known CVEs (check Snyk, npm audit)
- Packages with unclear licenses (legal risk)

---

### Memory Safety

**Sensitive Data Handling**:
- Clear encryption keys from memory after use
- Overwrite password fields on blur (prevent memory dump leakage)
- Use `Buffer.fill(0)` to zero out key buffers

**Example**:
```typescript
function deriveKey(passphrase: string): Buffer {
  const key = crypto.pbkdf2Sync(passphrase, salt, 100000, 32, 'sha256');

  // Clear passphrase from memory (best-effort, not guaranteed in JS)
  passphrase = '';

  return key;
}

function cleanup(key: Buffer) {
  key.fill(0);  // Zero out key buffer
}
```

**Limitations**: JavaScript/TypeScript memory management makes true zeroing difficult (garbage collector may leave copies). Mitigation: Minimize time sensitive data is in memory.

---

### Network Security

**MVP**: No network calls (fully offline)

**Future** (if cloud sync added):
- ✅ TLS 1.3 only (disable TLS 1.0, 1.1, 1.2)
- ✅ Certificate pinning (prevent MITM)
- ✅ End-to-end encryption (keys never sent to server)
- ✅ Zero-knowledge architecture (server cannot decrypt)

---

## Accessibility Requirements

### WCAG 2.1 AA Compliance

**Color Contrast**:
- Text on background: ≥4.5:1 for normal text (16px)
- Large text (18px+): ≥3:1
- Interactive elements: ≥3:1 with adjacent colors

**Test Tool**: WebAIM Contrast Checker, Lighthouse Audit

**Keyboard Navigation**:
- All interactive elements focusable via Tab key
- Focus indicators: 2px solid blue outline (`outline: 2px solid #3b82f6`)
- Tab order follows logical flow (top-to-bottom, left-to-right)
- No keyboard traps (Esc always exits modals/overlays)

**Screen Readers**:
- ARIA labels on all buttons, inputs (`aria-label`, `aria-describedby`)
- Semantic HTML (`<button>`, `<nav>`, `<main>`, not `<div onclick>`)
- Live regions for dynamic updates (`aria-live="polite"` for toasts)
- Landmarks for major sections (`role="navigation"`, `role="main"`)

**Testing**:
- NVDA screen reader (Windows) - Primary
- JAWS (Windows) - Secondary
- Lighthouse Accessibility Audit (automated)

**Alternative Text**:
- Images: Alt text (if images added in future)
- Icons: Aria-label (e.g., `<button aria-label="Delete note">🗑️</button>`)
- Graphs: Alternative text view ("Connections List" for Graph View)

---

### High Contrast Mode

**Respect Windows Settings**:
- Detect `prefers-contrast: high` media query
- Override custom colors with system colors
- Increase border widths (1px → 2px)

**Example**:
```css
@media (prefers-contrast: high) {
  * {
    border-width: 2px !important;
    outline-width: 3px !important;
  }

  body {
    background: Canvas;  /* System background color */
    color: CanvasText;    /* System text color */
  }
}
```

---

### Reduced Motion

**Respect User Preference**:
- Detect `prefers-reduced-motion: reduce` media query
- Disable animations (or reduce to <0.01s)

**Example**:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Localization (Future)

**MVP**: English only

**Future** (v1.5+):
- i18n framework: react-i18next
- Languages: Spanish, French, German, Japanese, Chinese
- RTL support: Arabic, Hebrew (CSS `direction: rtl`)

**Text Extraction**:
- All UI strings in `locales/en.json`
- No hardcoded text in components

**Date/Time Formatting**:
- Use `Intl.DateTimeFormat` (locale-aware)
- Relative time: "2 hours ago" → localized

---

## Platform Requirements

### Operating System
**MVP**: Windows 10 version 1903+ (May 2019 Update)
**Future**: Windows 11, macOS 11+, Linux (Ubuntu 20.04+)

**Why Windows 10 1903+**:
- DPAPI support for encryption
- Modern WebView2 (Chromium-based)
- Long-term support (extended until 2025)

**Architecture**: 64-bit only (x64, ARM64 future)

---

### Hardware Minimum

**CPU**: Intel Core i5 8th gen or equivalent (4 cores, 2.0+ GHz)
**RAM**: 4GB (8GB recommended)
**Storage**: 500MB free space (for app + database)
**Display**: 1024x768 minimum resolution (1440x900 recommended)

---

## Error Handling & Resilience

### Graceful Degradation

**Database Unavailable**:
- Show error: "Cannot connect to database. Check disk space and permissions."
- Offer "Read-Only Mode" (browse cached notes in memory, no saves)

**Encryption Key Lost**:
- Show error: "Encryption key unavailable. Notes cannot be decrypted."
- Offer: "Reset app" (delete all data and start fresh) or "Export database" (for recovery attempt)

**Full-Text Search Index Corrupted**:
- Detect on search error (FTS5 returns error)
- Auto-rebuild index in background
- Show toast: "Rebuilding search index... (30 seconds)"

**Graph Rendering Failure**:
- Catch Cytoscape errors
- Fall back to list view: "Connections List" (text-based)
- Log error for telemetry (if enabled)

---

### Crash Recovery

**Auto-Save**:
- Unsaved edits stored in local draft (separate table)
- On next launch, detect draft and prompt: "Recover unsaved note?"

**Corrupted Database**:
- Detect on open (SQLite `PRAGMA integrity_check`)
- If corrupted, restore from backup (if exists)
- If no backup, show error and offer "Export what's recoverable"

---

## Monitoring & Logging

### Debug Logging (Off by Default)

**Enable**: Settings → Advanced → "Enable Debug Logging"

**Log Location**: `AppData\Roaming\knowledgeflow\logs\app.log`

**Log Levels**:
- ERROR: Critical failures (database corruption, encryption errors)
- WARN: Recoverable issues (slow query, network timeout)
- INFO: Normal operations (app start, note saved)
- DEBUG: Verbose diagnostics (query text, timings)

**Log Format**:
```
[2025-11-15T14:30:00Z] [ERROR] NotesRepo: Failed to save note
Error: Database is locked
  at NotesRepo.create (notesRepo.ts:45:12)
  ...
```

**Log Rotation**:
- Max size: 10MB per log file
- Keep last 3 files (app.log, app.log.1, app.log.2)
- Auto-delete oldest when limit exceeded

**Privacy**: Logs are local-only. User can export via Settings → Advanced → "Export Logs" (for support)

---

## Testing Requirements

### Unit Tests
**Coverage Target**: ≥70% for business logic (repos, extractors, semantic engine)

**Frameworks**:
- Vitest (test runner)
- @testing-library/react (UI components)

**Run**: `pnpm test`

### Integration Tests
**Scope**: Database operations, repo interactions, semantic engine end-to-end

**Example**:
```typescript
test('Create note → Extract tags → Save to DB', async () => {
  const note = await notesRepo.create({ title: 'Test', body: 'Q4 planning' });
  const tags = extractTags(note);
  expect(tags).toContain('q4-planning');
});
```

### E2E Tests (Playwright)
**Scope**: User flows (Quick Capture, Search, Graph View)

**Example**:
```typescript
test('Quick Capture flow', async ({ page }) => {
  // Press global hotkey (simulated)
  await page.keyboard.press('Control+Shift+K');
  await expect(page.locator('.capture-overlay')).toBeVisible();

  await page.fill('[aria-label="Note title"]', 'Test Note');
  await page.press('[aria-label="Note title"]', 'Enter');

  await expect(page.locator('.notes-list')).toContainText('Test Note');
});
```

**Run**: `pnpm e2e`

---

### Performance Tests

**Benchmarks**:
```typescript
describe('Performance', () => {
  it('Cold start ≤2s', async () => {
    const start = Date.now();
    await launchApp();
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(2000);
  });

  it('Search ≤150ms p95', async () => {
    const latencies = await measureSearchLatency(100); // 100 queries
    const p95 = percentile(latencies, 95);
    expect(p95).toBeLessThan(150);
  });
});
```

---

## Release Criteria

**MVP Release Checklist**:
- [ ] All unit tests pass (≥70% coverage)
- [ ] E2E smoke tests pass (Quick Capture, Search, Graph)
- [ ] Performance targets met (cold start ≤2s, search p95 ≤150ms)
- [ ] Accessibility audit passes (Lighthouse score ≥90)
- [ ] Security audit passes (no critical/high vulnerabilities)
- [ ] Encryption works (verified via hex dump of database)
- [ ] Privacy: No outbound network calls (verified with Wireshark)
- [ ] Documentation complete (README, CONTRIBUTING, FAQ)
- [ ] Windows 10 tested (1903+, 64-bit)

---

**Last Updated**: 2025-10-31
**Owner**: product-lead + dev-lead
