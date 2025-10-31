# AI & Semantic Intelligence Specification

Version: 0.1
Owner: product-lead
Status: Draft
Last updated: 2025-10-31

## Overview

KnowledgeFlow uses **local-only semantic intelligence** to automate organization, discovery, and extraction without cloud APIs. All processing happens on-device using rule-based NLP and statistical methods (TF-IDF, cosine similarity). No machine learning models in MVP (planned for v2.0 with ONNX runtime).

**Core Philosophy**: Automation with user control. All semantic features can be toggled off, and suggestions require user approval.

---

## Feature 1: Context-Aware Tag Extraction

### Purpose
Automatically suggest relevant tags from note content to reduce manual organization burden.

### Method: Rule-Based NLP

**Library**: `compromise` (JavaScript NLP library, 14k stars, MIT licensed)

**Algorithm**:
1. **Input**: Note title + body (combined as single text string)
2. **Tokenization**: Parse text into linguistic units (nouns, verbs, phrases)
3. **Noun Phrase Extraction**:
   ```javascript
   import nlp from 'compromise';

   const doc = nlp(text);
   const nounPhrases = doc.nouns().out('array');
   ```
4. **Filtering**:
   - Keep only multi-word phrases (≥2 words): "budget review" ✅, "budget" ❌
   - Remove stop phrases: "the meeting", "I think", "we should"
   - Minimum phrase frequency: Appears ≥2 times in note OR high TF-IDF score
5. **Ranking**:
   - Score phrases by TF-IDF (term frequency–inverse document frequency)
   - Prefer phrases in title (2x weight)
   - Prefer noun phrases over single nouns
6. **Output**: Top 5 ranked phrases converted to tag format

**Tag Formatting**:
- Lowercase: "Q4 Planning" → "q4-planning"
- Hyphenate spaces: "budget review" → "budget-review"
- Strip special chars: "Q4 & Q1" → "q4-q1"
- Max length: 30 characters (truncate longer phrases)

### TF-IDF Scoring

**Purpose**: Identify important terms (frequent in this note, rare across all notes)

**Formula**:
```
TF(term) = (count of term in note) / (total words in note)
IDF(term) = log(total notes / notes containing term)
TF-IDF(term) = TF(term) × IDF(term)
```

**Implementation**:
```typescript
class TfIdfEngine {
  private idf: Map<string, number> = new Map();

  buildIndex(notes: Note[]) {
    // Calculate IDF for each term across all notes
    const N = notes.length;
    const termDocCount = new Map<string, number>();

    notes.forEach(note => {
      const terms = this.tokenize(note.body);
      const uniqueTerms = new Set(terms);
      uniqueTerms.forEach(term => {
        termDocCount.set(term, (termDocCount.get(term) || 0) + 1);
      });
    });

    termDocCount.forEach((docCount, term) => {
      this.idf.set(term, Math.log(N / docCount));
    });
  }

  score(term: string, note: Note): number {
    const tf = this.termFrequency(term, note);
    const idf = this.idf.get(term) || 0;
    return tf * idf;
  }
}
```

### User Interaction Flow

1. User types note content (in Quick Capture or Note Editor)
2. On pause (1-second debounce) or save trigger:
   - Extract phrases in background (Web Worker to avoid UI blocking)
3. Suggested tags appear as chips below editor:
   ```
   Suggested: [+ q4-planning] [+ budget-review] [+ revenue-projections]
   ```
4. User clicks `+` to accept tag → moves to "Accepted tags" section
5. Accepted tags saved to `tags` JSON array in database
6. Tags shown as solid chips in notes list and search results

### Edge Cases & Handling

| Edge Case | Behavior |
|-----------|----------|
| **No meaningful phrases** | Show "No suggestions. Add your own below." |
| **Very short note** (<20 words) | Skip extraction (insufficient content) |
| **Code blocks in note** | Ignore content within triple backticks |
| **Foreign language** | Gracefully fail (compromise is English-only) |
| **All suggestions already accepted** | Hide suggestion area |
| **Extraction takes >500ms** | Show loading indicator, timeout after 2s |
| **Extractor crash** | Log error, continue without suggestions |

### Performance Targets

- **Extraction time**: <500ms for notes up to 5000 words
- **Accuracy**: ≥70% of suggestions accepted by user (measured via telemetry if opt-in)
- **False positive rate**: <20% (user rejects or ignores suggestion)

### Feature Flag

**Name**: `TAG_EXTRACTION_ENABLED`
**Default**: `true`
**User Control**: Settings → Features → "Suggest Tags"

### Limitations (MVP)

- **English only**: compromise library doesn't support other languages
- **No learning**: Doesn't improve based on user acceptances (v2.0 feature)
- **No context**: Doesn't consider existing tags in other notes (future: suggest from tag cloud)

### Future Enhancements (v2.0+)

1. **Tag autocomplete**: As user types, suggest from existing tags
2. **Tag synonyms**: Merge similar tags ("q4-plan", "q4-planning")
3. **User feedback loop**: Learn from accepted/rejected suggestions
4. **Multilingual**: Add support for Spanish, French, German using polyglot.js

---

## Feature 2: Semantic Note Linking (Graph Generation)

### Purpose
Automatically discover conceptual relationships between notes to surface unexpected connections and enable spatial exploration.

### Method: TF-IDF + Cosine Similarity + Phrase Matching

**Algorithm Overview**:
1. **Build TF-IDF index** for all notes (vectorize each note as high-dimensional vector)
2. **Compare all note pairs** using cosine similarity
3. **Create link** if similarity ≥ threshold OR shared phrases ≥ 2
4. Store links in `links` table with weight (similarity score)

### Step-by-Step Process

#### Step 1: Vectorization
Convert each note into a numerical vector using TF-IDF:

```typescript
class TfIdfEngine {
  private vocabulary: Set<string> = new Set();  // All unique terms

  addDocument(note: Note) {
    const text = `${note.title} ${note.body}`.toLowerCase();
    const tokens = this.tokenize(text);
    tokens.forEach(token => this.vocabulary.add(token));
  }

  vectorize(note: Note): number[] {
    const text = `${note.title} ${note.body}`.toLowerCase();
    const tokens = this.tokenize(text);
    const termFreq = this.getTermFrequency(tokens);

    const vector: number[] = [];
    this.vocabulary.forEach(term => {
      const tf = termFreq.get(term) || 0;
      const idf = this.idf.get(term) || 0;
      vector.push(tf * idf);
    });

    return this.normalize(vector);  // L2 normalization
  }
}
```

**Vocabulary Building**:
- Tokenize all notes (split by whitespace, remove punctuation)
- Filter out stop words ("the", "a", "is")
- Keep terms with ≥3 characters
- Case-insensitive

#### Step 2: Similarity Calculation
Compare vectors using cosine similarity:

```typescript
cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}
```

**Result**: Score between 0.0 (completely dissimilar) and 1.0 (identical)

#### Step 3: Phrase Matching (Supplementary)
To catch semantic links that TF-IDF misses (e.g., same named entities):

```typescript
function sharedPhrases(noteA: Note, noteB: Note): number {
  const phrasesA = extractPhrases(noteA);  // From tag extractor
  const phrasesB = extractPhrases(noteB);

  const intersection = phrasesA.filter(p => phrasesB.includes(p));
  return intersection.length;
}
```

#### Step 4: Link Creation
Create link if either condition met:

```typescript
function shouldLink(noteA: Note, noteB: Note, threshold: number): boolean {
  const similarity = cosineSimilarity(vectorize(noteA), vectorize(noteB));
  const sharedCount = sharedPhrases(noteA, noteB);

  return similarity >= threshold || sharedCount >= 2;
}
```

**Default Threshold**: 0.3 (tunable in Settings → Advanced → "Link Sensitivity")

### Link Storage

**Database Schema**:
```sql
CREATE TABLE links (
  src_id TEXT NOT NULL,        -- Source note ID
  dst_id TEXT NOT NULL,        -- Destination note ID
  weight REAL NOT NULL,        -- Similarity score (0.0-1.0)
  kind TEXT NOT NULL,          -- 'semantic' or 'manual'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (src_id, dst_id)
);
```

**Link Properties**:
- **Bidirectional**: If A → B, also create B → A (simplifies queries)
- **Weight**: Cosine similarity score (used for edge thickness in graph)
- **Kind**: 'semantic' (auto) vs. 'manual' (user-created - future feature)

### Rebuild Trigger

**When to rebuild**:
- User clicks "Rebuild Graph" button in Graph View
- New note created (incremental: only link new note to existing)
- Note updated (incremental: re-link updated note)
- Settings → Link Sensitivity changed (full rebuild)

**Performance**:
- Full rebuild: O(N²) comparisons (expensive for large N)
- Optimization: Incremental updates for single note (O(N) comparisons)
- Limit: If notes > 500, warn user and offer date range filter

### User Interaction

1. User opens Graph View (Ctrl+4)
2. System loads notes and links from database
3. Cytoscape.js renders graph:
   - Nodes = notes (size ∝ word count)
   - Edges = links (thickness ∝ weight)
4. User can:
   - **Select node**: Click → highlight connected nodes
   - **Open note**: Double-click → open in editor
   - **Filter**: Show only notes with specific tags
   - **Rebuild**: Click "Rebuild Graph" → re-run LinkEngine

### Edge Cases & Handling

| Edge Case | Behavior |
|-----------|----------|
| **<2 notes** | Show "Add more notes to see connections" |
| **No links found** (threshold too high) | Show "No links detected. Lower sensitivity in Settings." |
| **Very dense graph** (>1000 links) | Filter to top 200 links by weight, warn user |
| **Isolated notes** (no connections) | Show in separate cluster or hide (toggle in settings) |
| **Rebuild in progress** | Disable button, show progress "Analyzing 45 of 120 notes..." |
| **Rebuild timeout** (>30s) | Cancel, show partial results, log error |

### Performance Targets

- **Link generation**: <5 seconds for 100 notes (4,950 comparisons)
- **Graph render**: <1 second for 100 nodes with 50 edges
- **Memory usage**: <100MB for 1000 notes with 5000 links

### Feature Flag

**Name**: `AUTO_LINKS_ENABLED`
**Default**: `true`
**User Control**: Settings → Features → "Auto-link Notes"

### Limitations (MVP)

- **O(N²) complexity**: Scales poorly beyond 1000 notes (optimization needed for v1.1)
- **No temporal awareness**: Doesn't weight recent connections higher
- **No link types**: All links are equal (future: differentiate by strength, recency, etc.)
- **No manual links**: User can't create/edit links (future: click-drag in graph to link)

### Future Enhancements (v2.0+)

1. **Local embeddings**: Use ONNX transformer model (e.g., MiniLM) for better semantic understanding
2. **Clustering**: Group notes into topics (k-means on embeddings)
3. **Link types**: Distinguish "contradicts", "supports", "expands on"
4. **Temporal decay**: Weight recent notes higher (exponential decay function)
5. **Incremental indexing**: Only recompute changed notes (delta updates)

---

## Feature 3: Action Item Extraction

### Purpose
Automatically detect action items in notes and extract to unified Tasks view, eliminating manual task list maintenance.

### Method: Regex Pattern Matching

**Patterns Detected**:
```javascript
const TODO_PATTERNS = [
  /TODO:\s*(.+)/gi,              // "TODO: review budget"
  /- \[ \]\s*(.+)/gi,            // "- [ ] Call client" (Markdown checkbox)
  /Action:\s*(.+)/gi,            // "Action: Schedule meeting"
  /Need to:\s*(.+)/gi,           // "Need to: Update docs"
  /@todo\s*(.+)/gi,              // "@todo fix bug" (common annotation)
  /\[ \]\s*(.+)/gi,              // "[ ] Send email" (without dash)
];
```

**Extraction Logic**:
```typescript
function extractTodos(note: Note): Task[] {
  const todos: Task[] = [];

  TODO_PATTERNS.forEach(pattern => {
    let match;
    while ((match = pattern.exec(note.body)) !== null) {
      const title = match[1].trim();

      // Skip if in code block
      if (isInCodeBlock(match.index, note.body)) continue;

      // Skip if already completed (- [x])
      if (note.body.includes(`- [x] ${title}`)) continue;

      todos.push({
        noteId: note.id,
        title: title,
        status: 'pending',
        meta: {
          extractedBy: 'pattern',
          pattern: pattern.source,
          position: match.index
        }
      });
    }
  });

  return todos;
}
```

### Code Block Detection
Avoid false positives in code snippets:

```typescript
function isInCodeBlock(position: number, text: string): boolean {
  // Count triple backticks before this position
  const beforeText = text.substring(0, position);
  const tickCount = (beforeText.match(/```/g) || []).length;

  // Odd count = inside code block
  return tickCount % 2 === 1;
}
```

### Deduplication
Prevent creating duplicate tasks on note re-save:

```typescript
async function extractAndSaveTasks(note: Note) {
  const extracted = extractTodos(note);
  const existing = await tasksRepo.listByNote(note.id);

  for (const task of extracted) {
    // Check if task with same title already exists for this note
    const isDuplicate = existing.some(e =>
      e.title === task.title && e.status === 'pending'
    );

    if (!isDuplicate) {
      await tasksRepo.create(task);
    }
  }
}
```

### Task Lifecycle

**States**:
- `pending`: Newly extracted, not yet completed
- `done`: User marked as complete (checkbox clicked)
- `dismissed`: User dismissed (false positive or irrelevant)

**Transitions**:
```
pending → done (user clicks checkbox)
pending → dismissed (user right-clicks → Dismiss)
done → pending (user unchecks)
dismissed → (removed from view, can be restored from history)
```

### User Interaction Flow

1. User saves note containing "TODO: review budget"
2. If `ACTION_EXTRACT_ENABLED` is true:
   - Extractor runs in background (don't block save)
   - Task created in `tasks` table
3. User navigates to Tasks View (Ctrl+3)
4. Task appears in "Pending" section:
   ```
   ☐ Review budget
      From: Q4 Planning Notes • Extracted 2 min ago
      [Open Note] [Dismiss]
   ```
5. User can:
   - **Mark done**: Click checkbox → status = 'done', moves to "Completed" section
   - **Edit**: Click title → inline edit (updates database)
   - **Dismiss**: Right-click → "Dismiss" → status = 'dismissed', hidden
   - **Open source**: Click "Open Note" → opens note in editor, scrolls to action item

### Edge Cases & Handling

| Edge Case | Behavior |
|-----------|----------|
| **False positive** (e.g., "TODO: learn why this failed") | User dismisses, won't recreate on re-save |
| **Completed in note** (- [x]) | Don't extract (check for [x] checkbox) |
| **Action spans multiple lines** | Only capture first line (document limitation) |
| **Duplicate action text in same note** | Create separate task, add "(2)" suffix to title |
| **Note deleted** | Cascade delete tasks (foreign key constraint) |
| **Very long action** (>200 chars) | Truncate to 200 chars, show full on hover |
| **Extractor crash** | Log error, don't block save, show notification |

### Performance Targets

- **Extraction time**: <100ms per note (regex is fast)
- **UI latency**: Zero blocking (run in background)
- **Accuracy**: ≥80% precision (user accepts task as valid)

### Feature Flag

**Name**: `ACTION_EXTRACT_ENABLED`
**Default**: **`false`** (opt-in due to false positive risk)
**User Control**: Settings → Features → "Extract Actions"

**Why Opt-In**: Stage 2 validation showed 8/10 interest BUT 6/10 anxiety about "computer making assumptions." Opt-in respects user control.

### Limitations (MVP)

- **Regex-based**: Misses implicit actions ("Should review budget" won't match)
- **Single-line only**: Can't capture multi-line task descriptions
- **No due dates**: Doesn't parse "TODO: review budget by Friday" (future: extract dates)
- **No priorities**: All tasks equal priority (future: detect "URGENT", "!" patterns)

### Future Enhancements (v2.0+)

1. **NLP-based extraction**: Use compromise to detect imperative verbs ("Review", "Send", "Update")
2. **Date parsing**: Extract due dates from text ("by Friday", "next week")
3. **Priority detection**: Parse "!!!" or "URGENT" keywords
4. **Subtasks**: Detect nested lists as subtasks
5. **Task templates**: User-defined patterns for extraction

---

## Feature 4: Daily Digest Summarization

### Purpose
Generate daily summary of user activity to support reflection, re-engagement, and retention.

### Method: Extractive Summarization (TF-IDF)

**Algorithm**:
1. Query notes created/updated in time range (default: last 24 hours)
2. Extract first sentence from each note (or title if body is short)
3. Score sentences by TF-IDF (importance within day's notes)
4. Select top 5 sentences
5. Format as Markdown bullet list

**Implementation**:
```typescript
function summarizeBullets(notes: Note[]): string {
  if (notes.length === 0) {
    return 'No notes created in this period.';
  }

  const bullets: string[] = [];

  // Simple approach: First sentence or title
  notes.slice(0, 5).forEach(note => {
    const firstSentence = note.body.split(/[.!?]/)[0].trim();
    const summary = firstSentence.length > 80 && firstSentence.length < 200
      ? firstSentence
      : note.title;

    bullets.push(`- **${note.title}**: ${summary}`);
  });

  return bullets.join('\n');
}
```

### Digest Format

```markdown
# Daily Digest - November 15, 2025

You created **5 notes** and **3 tasks** yesterday.

## Key Activity
- **Q4 Planning Notes**: Reviewed budget and revenue projections
- **User Research Findings**: Validated privacy as critical feature
- **Technical Architecture**: Decided on Tauri + React stack

## Top Tasks
- [ ] Review budget for next quarter
- [ ] Schedule demo for stakeholders
- [ ] Update documentation

## Note Streaks
🔥 5-day streak! You've captured ideas every day this week.

---
[Open Recent Notes] [View All Tasks] [Dismiss]
```

### Trigger Options

**Automatic**:
- App launch between 8-10am local time (check last digest date)
- Only show once per day (store last shown date)

**Manual**:
- Settings → Features → "Generate Digest"
- Always allows re-generation with latest data

### User Interaction Flow

1. User launches app at 9:00am
2. System checks: Last digest shown date = Nov 14, today = Nov 15
3. DigestEngine queries notes/tasks from Nov 14
4. Generate digest (takes ~1 second)
5. Display in modal overlay (centered, 600px wide)
6. User can:
   - **Click note title**: Opens note in editor, closes digest
   - **Click task**: Navigates to Tasks View, closes digest
   - **Dismiss**: Click "Dismiss" or `Esc`, digest closes, won't show again today
   - **Export**: (Future) Save digest as Markdown file

### Edge Cases & Handling

| Edge Case | Behavior |
|-----------|----------|
| **No activity** | Show "No notes or tasks created yesterday. Start capturing!" |
| **High activity** (>50 notes) | Summarize top 10 by edit volume, show total count |
| **First launch** | Show welcome message instead of digest |
| **Manual trigger on same day** | Allow regeneration with updated data (no caching) |
| **Summarization failure** | Fall back to simple list of note titles |
| **Missing timestamps** | Skip malformed notes, log error |

### Performance Targets

- **Generation time**: <2 seconds (including DB query + summarization)
- **UI latency**: <200ms added to app launch (run in background)

### Feature Flag

**Name**: `DAILY_DIGEST_ENABLED`
**Default**: `true`
**User Control**: Settings → Features → "Daily Digest"

### Limitations (MVP)

- **Extractive only**: Uses first sentence, doesn't generate new text (v2.0: abstractive summarization)
- **No personalization**: Same algorithm for all users (future: learn user preferences)
- **Fixed time window**: Last 24 hours only (future: custom ranges)
- **No insights**: Just lists notes (future: identify themes, patterns)

### Future Enhancements (v2.0+)

1. **Abstractive summarization**: Generate summaries with local LLM (e.g., Llama 3.2 via ONNX)
2. **Insights**: "You're writing more about 'planning' this week"
3. **Custom time ranges**: Weekly digest, monthly review
4. **Email digest**: Optional email with summary (requires cloud integration)
5. **Streaks & gamification**: Track consecutive days of note-taking

---

## Semantic Engine Architecture

### Class Diagram

```
┌─────────────────────────┐
│   SemanticEngine        │
├─────────────────────────┤
│ + extractTags()         │
│ + embed()               │
│ + linkAll()             │
│ + linkNote()            │
│ + summarize()           │
└─────────────────────────┘
         │
         ├──> TfIdfEngine (vectorization)
         ├──> PhraseExtractor (tags)
         ├──> TodoExtractor (actions)
         ├──> LinkEngine (graph)
         └──> BulletSummarizer (digest)
```

### Performance Considerations

**Blocking vs. Non-Blocking**:
- **Tag extraction**: Non-blocking (run in Web Worker, display when ready)
- **Action extraction**: Non-blocking (don't delay note save)
- **Link generation**: User-triggered (clicking "Rebuild Graph" expects wait)
- **Digest**: Background on launch (don't block UI)

**Caching**:
- **TF-IDF vectors**: Cache in `embeddings` table, recompute only on note change
- **Phrase index**: Rebuild on note save (incremental)
- **Links**: Persist in database, rebuild only on user request or settings change

**Throttling**:
- Debounce tag extraction: Wait 1 second after last keystroke
- Rate limit link generation: Max 1 rebuild per 10 seconds (prevent spam)

---

## Testing Strategy

### Unit Tests (Vitest)

**Coverage Target**: ≥70% for semantic modules

**Test Cases**:
```typescript
describe('PhraseExtractor', () => {
  it('should extract noun phrases from text', () => {
    const note = { title: 'Q4 Planning', body: 'Review budget' };
    const phrases = extractPhrases(note);
    expect(phrases).toContain('q4-planning');
  });

  it('should filter single-word phrases', () => {
    const note = { title: 'Budget', body: 'Review' };
    const phrases = extractPhrases(note);
    expect(phrases).toHaveLength(0);  // No multi-word phrases
  });
});

describe('TodoExtractor', () => {
  it('should extract TODO items', () => {
    const note = { body: 'TODO: review budget\n\nSome text\n\n- [ ] Call client' };
    const todos = extractTodos(note);
    expect(todos).toHaveLength(2);
    expect(todos[0].title).toBe('review budget');
  });

  it('should skip completed items', () => {
    const note = { body: '- [x] Done\n- [ ] Pending' };
    const todos = extractTodos(note);
    expect(todos).toHaveLength(1);
  });
});

describe('TfIdfEngine', () => {
  it('should compute cosine similarity correctly', () => {
    const engine = new TfIdfEngine();
    const vecA = [1, 0, 1];
    const vecB = [1, 1, 0];
    const sim = engine.cosineSimilarity(vecA, vecB);
    expect(sim).toBeCloseTo(0.408, 2);
  });
});
```

### Integration Tests

**Test Scenarios**:
1. Create note → Extract tags → Verify tags in database
2. Create 2 notes with shared keywords → Rebuild graph → Verify link exists
3. Create note with TODO → Verify task in tasks table
4. Simulate day of activity → Generate digest → Verify Markdown output

### Performance Benchmarks

```typescript
describe('Performance', () => {
  it('should extract tags in <500ms for 5000-word note', async () => {
    const longNote = { title: 'Test', body: generateText(5000) };
    const start = performance.now();
    const tags = await extractTags(longNote);
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(500);
  });

  it('should link 100 notes in <5 seconds', async () => {
    const notes = generateNotes(100);
    const start = performance.now();
    await linkEngine.linkAll(notes);
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(5000);
  });
});
```

---

## Monitoring & Telemetry

**Metrics to Track** (if user opts in):
- Tag extraction: Acceptance rate (% of suggestions clicked)
- Graph View: Adoption rate (% users who open at least once per week)
- Action extraction: False positive rate (% tasks dismissed)
- Daily digest: Engagement rate (% users who don't disable after 1 week)
- Performance: p50, p95, p99 latencies for each feature

**Privacy**: All metrics anonymized, no note content captured, opt-in only.

---

## Documentation for Users

**In-App Help** (accessible via `?` key):
```
## Semantic Features

**Auto-Tagging**: Suggests tags based on note content. Click "+" to accept.

**Semantic Map**: Automatically links related notes. Open with Ctrl+4.

**Action Extraction**: Detects TODO items in notes. Enable in Settings.

**Daily Digest**: Daily summary of your work. Shows on morning launch.

All features can be disabled in Settings → Features.
```

**Settings Descriptions**:
- "Auto-link Notes": Automatically discover connections between notes based on shared keywords and concepts.
- "Extract Actions": Scan notes for TODO items and create tasks automatically. (May have false positives - you can dismiss.)
- "Daily Digest": Show a summary of notes and tasks created yesterday when you launch the app in the morning.
- "Link Sensitivity": Higher values = fewer links (only strong connections). Lower = more links.

---

## Known Limitations & Future Roadmap

### MVP Limitations
1. **English-only**: NLP libraries don't support other languages
2. **Rule-based**: No machine learning, limited semantic understanding
3. **No learning**: Doesn't improve from user feedback
4. **Performance**: Link generation is O(N²), scales poorly beyond 1000 notes

### v2.0 Semantic Enhancements (Q2 2026)
1. **Local embeddings**: ONNX transformer models (MiniLM, all-MiniLM-L6-v2)
2. **Clustering**: Automatic topic detection (k-means on embeddings)
3. **Abstractive summarization**: Generate new summaries (not just extractive)
4. **Learning loop**: Improve suggestions based on user acceptances
5. **Multilingual**: Support Spanish, French, German

### v3.0 Advanced Intelligence (Q4 2026)
1. **Query answering**: "What did I write about Q4 planning?" → semantic search
2. **Note generation**: Drafts based on existing notes (local GPT-style)
3. **Contradiction detection**: Flag conflicting statements across notes
4. **Knowledge graph reasoning**: Infer implicit connections

---

## References & Research

**Papers**:
- Salton & Buckley (1988): "Term-weighting approaches in automatic text retrieval" (TF-IDF foundation)
- Mikolov et al. (2013): "Efficient Estimation of Word Representations in Vector Space" (Word2Vec - future)

**Libraries**:
- compromise: https://github.com/spencermountain/compromise
- Natural: https://github.com/NaturalNode/natural (alternative NLP library)

**Benchmarks**:
- SentenceBERT (future embeddings): https://www.sbert.net/
- ONNX Runtime: https://onnxruntime.ai/ (for local ML models)
