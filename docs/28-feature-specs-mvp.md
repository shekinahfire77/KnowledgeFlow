# Feature Specifications - MVP

Version: 0.1
Owner: product-lead
Status: Draft
Last updated: 2025-10-31

---

## Feature 1: Quick Capture Overlay

**User Story:**
As a knowledge worker frequently switching between applications, I want to instantly capture thoughts with a global hotkey, so that I don't lose ideas or break my flow by opening a separate app.

**Problem Solved:**
Stage 2 validation showed that 9/10 users lose ideas because "switching to a note app breaks concentration." Context switching costs 3-5 minutes of refocus time (validated research). Quick Capture eliminates this friction.

**Flow Steps:**
1. User presses `Ctrl+Shift+K` while working in any application (browser, IDE, etc.)
2. Semi-transparent overlay appears centered on screen (400x200px floating window)
3. Previous application remains visible but dimmed behind overlay
4. Title input field auto-focused (optional - can skip to body)
5. User types note title, presses Tab
6. Body textarea gains focus, user types content (Markdown syntax highlighted)
7. Below textarea, suggested tags appear as chips (generated in real-time from content)
8. User clicks tag chips to accept or ignores
9. User presses `Enter` (if title focused) or `Ctrl+S` (if body focused) to save
10. Overlay fades out over 200ms
11. Focus returns to previous application
12. Note persisted to encrypted SQLite database with timestamp

**UX Notes:**
- **Visual Design**: Frosted glass effect (backdrop-filter: blur(10px)), subtle shadow for depth
- **Accessibility**: Focus trap within overlay (Tab cycles between title, body, tags, buttons), Esc key cancels
- **Keyboard-First**: Entire flow completable without mouse (Enter/Ctrl+S to save, Esc to cancel)
- **Feedback**: Brief "Saved" toast appears in corner before overlay closes
- **Positioning**: Always centered regardless of multi-monitor setup (use primary monitor if uncertain)
- **Persistence**: If user clicks outside overlay, prompt "Save draft?" with Yes/No/Cancel

**Edge Cases:**
- **Overlay already open**: Ignore subsequent `Ctrl+Shift+K` presses (no duplicate overlays)
- **Empty note**: Allow save with auto-generated title "(Untitled - Nov 15, 2025 14:30)"
- **Very long content** (>100KB): Show warning "Note exceeds 100KB. Consider splitting for performance."
- **Database unavailable**: Show error toast "Cannot save - database connection failed. Copy text to clipboard?"
- **Global hotkey conflict**: If OS/another app owns hotkey, show error on launch: "Global hotkey unavailable. Change in Settings."
- **Special characters in title**: Sanitize for filesystem (if future file-based storage) but preserve in database
- **Multiple monitors**: Always appear on monitor with currently focused window

**Success Criteria:**
- Overlay appears within 100ms of hotkey press (measured via performance.now())
- Note saved and appears in Notes List within 1 second
- 100% keyboard-operable (no mouse required)
- Zero data loss on crash (save happens before overlay closes)
- Works across all Windows applications (tested with: Chrome, VS Code, Word, File Explorer)

**Risks & Mitigations:**
- **Risk**: Global hotkey fails to register (OS or permission issue)
  **Mitigation**: Detect registration failure on launch, prompt user to change hotkey or run as admin

- **Risk**: Overlay obscures important content (e.g., user copying from behind)
  **Mitigation**: Overlay is draggable, can be repositioned. Add setting for "default position" (center/top/bottom)

- **Risk**: Performance lag in overlay appearance (feels sluggish)
  **Mitigation**: Pre-render overlay as hidden on app launch, only show/hide (don't create/destroy)

- **Risk**: Focus doesn't return correctly to previous app
  **Mitigation**: Store previous window handle (via WinAPI), explicitly restore focus on close

**Dependencies:**
- Tauri `globalShortcut` API for hotkey registration
- Tauri `window` API for overlay positioning and focus management
- SQLite database initialized (notes table exists)
- Encryption key available (or prompt for passphrase if first time)

**MVP Status:** **Must Have** (P0 - Critical)

**Acceptance Tests:**
```gherkin
Given the app is running (can be in background)
When I press Ctrl+Shift+K
Then the Quick Capture overlay appears within 100ms
And the title input field is focused
And I can type, tab to body, type more
And I can press Ctrl+S to save
Then the overlay closes within 300ms
And the note appears in the Notes List
And focus returns to my previous application
```

---

## Feature 2: Note Editor

**User Story:**
As a user, I want to edit my notes with auto-save and basic formatting, so that I can focus on content without worrying about manual saves or losing work.

**Problem Solved:**
Stage 2: 100% of users identified "must not lose data" as critical requirement. Manual save buttons create anxiety ("Did I save?"). Auto-save with clear feedback builds trust.

**Flow Steps:**
1. User clicks note card in Notes List OR opens note from search results
2. Editor panel slides in from right (or replaces list view on small screens)
3. Note content loads (title + body + tags)
4. Title field shows as large editable text (24px, bold)
5. Formatting toolbar appears below title (B, I, Link, Code, List buttons)
6. Body editor shows Markdown content (syntax highlighting enabled)
7. User edits title and/or body
8. Auto-save triggers on:
   - 2-second debounce after last keystroke
   - Focus blur (user clicks away from editor)
   - Manual `Ctrl+S`
9. "Saving..." indicator appears in top-right corner
10. Database UPDATE query executes (sets updated_at timestamp)
11. "Saved ✓" indicator replaces "Saving..." (fades after 2 seconds)
12. Editor remains open for continued editing

**UX Notes:**
- **Typography**: Title 24px semi-bold, body 16px regular, line-height 1.6 for readability
- **Formatting Toolbar**: Hover to see keyboard shortcuts (Cmd+B, Cmd+I, etc.), disabled for read-only notes
- **Markdown Preview**: Toggle button (👁️ icon) to switch between edit/preview mode (default: edit)
- **Distraction-Free**: Option to hide sidebar and enter full-screen editor mode (F11)
- **Accessibility**: ARIA labels on toolbar buttons, keyboard shortcuts discoverable via `?` help overlay
- **Undo/Redo**: Native browser undo (Ctrl+Z, Ctrl+Y) works, stored in memory (not persisted)

**Edge Cases:**
- **Note deleted while editing**: Show error banner "Note no longer exists", disable editing, offer "Restore as new note"
- **Concurrent edit** (same note opened in two windows - future multi-device): Last-write-wins, show warning "Note modified elsewhere. Your changes will overwrite."
- **Very rapid typing**: Debounce prevents excessive writes (batched to 1 write per 2 seconds)
- **Unsaved changes on navigation**: Auto-save triggers before navigation, no confirmation dialog needed
- **Empty title**: Allow save with empty title, auto-generate "(Untitled)" in list view display
- **Extremely long note** (>1MB): Warn user "Large note may impact performance. Consider splitting."
- **Special Markdown rendering** (HTML tags): Sanitize on render to prevent XSS (use DOMPurify)

**Success Criteria:**
- Changes persisted to database within 2 seconds of last edit
- "Saved" indicator provides clear confirmation
- Zero data loss during navigation, window close, or app crash (auto-save before exit)
- Undo/redo works for at least 50 actions
- Editor loads note content within 200ms
- Markdown preview renders correctly (headings, lists, code blocks, links)

**Risks & Mitigations:**
- **Risk**: User doesn't notice auto-save, questions if data was saved
  **Mitigation**: Clear "Saved ✓" indicator + optional sound effect + Settings toggle for "confirm on save"

- **Risk**: Auto-save triggers too frequently (performance impact)
  **Mitigation**: 2-second debounce + batch updates + database write throttling

- **Risk**: Markdown syntax confusing for non-technical users
  **Mitigation**: WYSIWYG toolbar inserts Markdown syntax (e.g., **bold**), optional rich text mode in future

- **Risk**: Large notes cause editor lag (>100KB)
  **Mitigation**: Use CodeMirror or Monaco editor with virtualization, lazy-load content

**Dependencies:**
- NotesRepo with `update()` method
- Markdown parser (remark or marked.js) for preview mode
- DOMPurify for XSS prevention in rendered HTML
- Debounce utility function (lodash.debounce or custom)

**MVP Status:** **Must Have** (P0 - Critical)

**Acceptance Tests:**
```gherkin
Given I have opened a note in the editor
When I type "Hello World" in the body
And I wait 2 seconds
Then I see "Saved ✓" indicator
And the note's updated_at timestamp is refreshed
When I close the editor and reopen the note
Then I see "Hello World" in the body (changes persisted)
```

---

## Feature 3: Context-Aware Tagging

**User Story:**
As a user creating many notes, I want tags automatically suggested based on content, so that I can organize notes without manual categorization effort.

**Problem Solved:**
Stage 2: Users want organization help (8/10 rating) but fear loss of control (7/10 anxiety about "AI doing too much"). Suggested tags (user approves) balances automation + control.

**Flow Steps:**
1. User types note content in Quick Capture or Note Editor
2. On pause (1-second debounce after last keystroke) or save trigger:
   - NLP extractor analyzes title + body text
   - Identify noun phrases (2+ word combinations) using compromise.js
   - Extract top 5 most relevant phrases
   - Filter out common stop phrases ("the meeting", "I think")
   - Convert to tag format (lowercase, hyphenated: "q4-planning")
3. Suggested tags appear as chips below editor with "+" icon
4. Existing tags (user-added or previously accepted) shown as solid chips
5. User clicks "+" on suggested tag to accept → moves to accepted tags
6. User clicks "x" on accepted tag to remove
7. User can manually type custom tags in input field (autocomplete from existing tags)
8. Tags saved to note's `tags` JSON array in database

**UX Notes:**
- **Visual Distinction**: Suggested tags have dotted border + gray background, accepted tags have solid border + blue background
- **Interaction**: Click to accept/remove (no drag-drop to avoid complexity)
- **Accessibility**: Tags are keyboard-navigable (Tab to each chip, Enter to accept/remove)
- **Tag Limit**: Max 10 tags per note (prevents tag bloat)
- **Tag Cloud**: Settings panel shows most-used tags with usage count (for future filtering)

**Edge Cases:**
- **No meaningful phrases extracted**: Show message "No tag suggestions. Add your own below."
- **All suggested tags already exist**: Don't show duplicates
- **Very short note** (<20 words): Skip extraction (insufficient content)
- **Code snippet in note**: Ignore code blocks (detect Markdown code fences) to avoid false extractions
- **Foreign language content**: Compromise.js handles English only - gracefully fail for other languages
- **Tag name conflicts**: Case-insensitive matching (treat "Budget" and "budget" as same)
- **Special characters in extracted phrases**: Strip non-alphanumeric except hyphens (e.g., "Q4 & Q1" → "q4-q1")

**Success Criteria:**
- ≥60% of users accept at least 1 suggested tag per note (measured via telemetry if opt-in)
- Tag extraction completes within 500ms for notes up to 5000 words
- False positive rate <20% (subjective - measured via user feedback and "remove tag" action frequency)
- Users manually add ≤2 tags on average when suggestions are provided (shows good coverage)

**Risks & Mitigations:**
- **Risk**: Extraction quality poor (irrelevant suggestions)
  **Mitigation**: Tune phrase extraction (require min word count, TF-IDF scoring), allow user feedback to improve

- **Risk**: Performance lag on large notes
  **Mitigation**: Limit analysis to first 2000 words, run in Web Worker to avoid UI blocking

- **Risk**: Over-tagging (too many suggestions accepted blindly)
  **Mitigation**: Limit to 5 suggestions, rank by relevance (TF-IDF), show only top 3 initially with "Show more"

**Dependencies:**
- compromise.js library for NLP (noun phrase extraction)
- TF-IDF implementation for ranking phrase relevance
- NotesRepo with tags stored as JSON array

**MVP Status:** **Must Have** (P0 - Critical differentiator)

**Feature Flag:** `TAG_EXTRACTION_ENABLED` (default: true)

**Acceptance Tests:**
```gherkin
Given I create a note with body "We need to review the budget for Q4 planning"
When the note is saved
Then I see suggested tags: "q4-planning", "budget"
When I click the "+" icon on "budget"
Then "budget" moves to accepted tags
And is saved to the note's tags array in the database
```

---

## Feature 4: Semantic Map (Graph View)

**User Story:**
As a user with many interconnected notes, I want to visualize relationships automatically discovered by semantic analysis, so that I can explore my knowledge spatially and discover unexpected connections.

**Problem Solved:**
Stage 2: 7/10 users excited by automatic link discovery, citing "I don't have time to manually link notes" and "I want to see patterns I might miss." Differentiates from Obsidian (manual linking only) and Notion (no graph).

**Flow Steps:**
1. User presses `Ctrl+4` or clicks "Graph" icon in toolbar
2. Graph View panel loads (full-screen canvas)
3. System queries all notes + links from database
4. Cytoscape.js renders force-directed graph:
   - Nodes = notes (circle size ∝ word count)
   - Edges = semantic links (thickness ∝ similarity weight)
   - Colors = tag categories (e.g., blue for "technical", green for "planning")
5. User interactions:
   - **Pan**: Click and drag background
   - **Zoom**: Mouse wheel or pinch (trackpad)
   - **Select node**: Click note node → highlights + shows tooltip (title + snippet)
   - **Open note**: Double-click node → opens in Note Editor
   - **Filter by tag**: Right sidebar checkboxes (show only notes with selected tags)
   - **Search in graph**: Type query → highlights matching nodes
   - **Rebuild links**: Click "Rebuild Graph" button → re-runs LinkEngine
6. Graph layout animates smoothly (force-directed simulation runs for ~2 seconds)
7. Legend shows link types: solid line (semantic), dashed line (manual - future)

**UX Notes:**
- **Performance**: Limit to 200 nodes visible at once, virtualize rest
- **Empty State**: "Create notes to see connections" if <2 notes exist
- **No Links State**: "No semantic links found. Try adding more content to notes." if nodes exist but no edges
- **Accessibility**: Graph not fully accessible to screen readers (provide alternative "Connections List" view)
- **Customization**: Settings → Graph → Adjust "link sensitivity" (threshold 0.1-0.5)
- **Visual Calm**: Use muted colors (neutral palette), avoid visual overwhelm

**Edge Cases:**
- **Single note**: Show single node with message "Add more notes to see connections"
- **Very dense graph** (>500 nodes): Warn user, offer date range filter ("Last 30 days", "Last 90 days")
- **Isolated notes** (no connections): Show in separate cluster or hide (toggle in settings)
- **Performance degradation**: If layout takes >5 seconds, stop simulation and show static layout with warning
- **Rebuild in progress**: Disable "Rebuild" button, show progress indicator "Analyzing X of Y notes..."
- **Link threshold too low**: If >1000 edges, warn "Too many connections (graph may be slow). Increase link sensitivity in Settings."
- **Zero similarity** (all notes completely unrelated): Show disconnected nodes, suggest "Add shared keywords"

**Success Criteria:**
- Graph renders within 1 second for 100 notes with 50 links
- Smooth pan/zoom (maintain 60 FPS)
- At least 1 edge visible if notes share ≥2 noun phrases or similarity ≥0.3
- Double-click consistently opens note within 200ms
- Adoption: ≥40% of users open Graph View at least once per week

**Risks & Mitigations:**
- **Risk**: Graph View confusing or overwhelming
  **Mitigation**: Onboarding tooltip on first open, legend for link types, filter controls

- **Risk**: Poor performance with large graphs
  **Mitigation**: Node limit (200), edge filtering (weight threshold), option to disable force-directed layout

- **Risk**: Low adoption (users don't find value)
  **Mitigation**: Feature flag allows disabling, monitor metrics, consider removing if <20% adoption after 1 month

- **Risk**: Semantic links not meaningful (false connections)
  **Mitigation**: Tunable threshold in Settings, combine TF-IDF + phrase matching for higher precision

**Dependencies:**
- Cytoscape.js for graph rendering
- LinkEngine (TF-IDF + cosine similarity) for semantic link building
- LinksRepo for storing/retrieving edges
- NotesRepo for node data

**MVP Status:** **Should Have** (P1 - High value differentiator)

**Feature Flag:** `AUTO_LINKS_ENABLED` (default: true)

**Acceptance Tests:**
```gherkin
Given I have 5 notes with shared keyword "budget"
When I click "Rebuild Graph" (to trigger LinkEngine)
And I open Graph View
Then I see 5 nodes connected by edges
When I double-click a node
Then the corresponding note opens in Editor
```

---

## Feature 5: Action Extraction

**User Story:**
As a user who captures tasks within notes, I want action items automatically extracted and shown in a unified Tasks view, so that I don't have to manually maintain a separate task list.

**Problem Solved:**
Stage 2: 8/10 users manually copy action items from notes to task manager (Todoist, Notion) - tedious duplication. Automated extraction eliminates this friction while preserving source context.

**Flow Steps:**
1. User saves note containing action patterns (e.g., "TODO: review budget")
2. If `ACTION_EXTRACT_ENABLED` feature flag is true:
   - Action extractor scans note body with regex patterns:
     - `TODO:\s*(.+)`
     - `- \[ \]\s*(.+)` (Markdown checkbox)
     - `Action:\s*(.+)`
     - `Need to:\s*(.+)`
   - Extract text following pattern (trim whitespace)
   - Create Task object with `noteId`, `title`, `status: 'pending'`
3. Insert task into `tasks` table
4. User navigates to Tasks View (Ctrl+3)
5. Extracted tasks appear in list with:
   - Checkbox (click to mark done)
   - Task title (editable inline)
   - Source note link (click to open note in editor)
   - Date extracted (shown in gray subtext)
6. User can:
   - **Mark done**: Click checkbox → status becomes 'done', task moves to "Completed" section
   - **Dismiss**: Right-click → "Dismiss" → status becomes 'dismissed', task hidden from view
   - **Edit**: Click title to edit inline (updates database on blur)
   - **Delete**: Right-click → "Delete" → removes from database
   - **Open source**: Click note link → opens note in editor, scrolls to action item context

**UX Notes:**
- **Sections**: Tasks View has 3 tabs: "Pending" (default), "Completed", "Dismissed"
- **Empty State**: "No tasks found. Add 'TODO:' to notes or enable Action Extraction in Settings."
- **Visual Link**: Task cards show source note title + icon to indicate origin
- **Bulk Actions**: Select multiple tasks (Shift+click) to mark done or delete
- **Keyboard Shortcuts**: `Space` to toggle checkbox, `Del` to delete, `Enter` to edit

**Edge Cases:**
- **False positives**: User can dismiss tasks (won't be re-created on note re-save), or disable feature entirely
- **Duplicate actions**: If note re-saved with same TODO, don't create duplicate (check existing tasks by title + noteId)
- **Completed action in note** (e.g., `- [x] Done`): Don't extract (only extract unchecked items)
- **Action pattern in code block**: Ignore content within Markdown code fences (triple backticks)
- **Very long action text**: Truncate display to 100 characters, show full text on hover tooltip
- **Note deleted**: Cascade delete all associated tasks (foreign key constraint)
- **Multiple actions in one note**: Extract all as separate task entries
- **Action spans multiple lines**: Regex captures only first line (document this limitation)

**Success Criteria:**
- Tasks appear in Tasks View immediately after note save (< 1 second latency)
- Link to source note opens correct note and highlights action item context
- Zero duplicate tasks created on note re-save
- ≥50% of users who enable feature use Tasks View weekly (measured via telemetry if opt-in)
- False positive rate <15% (measured via dismiss action frequency)

**Risks & Mitigations:**
- **Risk**: High false positive rate frustrates users
  **Mitigation**: Default OFF (opt-in), clear "Dismiss" action, tunable patterns in Settings → Advanced

- **Risk**: Users don't discover Tasks View
  **Mitigation**: Onboarding checklist item "Enable Action Extraction", notification on first TODO detected

- **Risk**: Regex patterns too rigid (miss valid actions)
  **Mitigation**: Iteratively expand patterns based on user feedback, allow custom patterns (future)

- **Risk**: Performance impact on note save
  **Mitigation**: Run extraction in background (don't block save), debounce to avoid repeated scans

**Dependencies:**
- TasksRepo for CRUD operations
- Regex patterns for action detection (todos.ts extractor)
- NotesRepo for linking tasks to notes
- Foreign key constraints for cascade delete

**MVP Status:** **Should Have** (P1 - High value but opt-in due to false positive risk)

**Feature Flag:** `ACTION_EXTRACT_ENABLED` (default: **false** - user must enable)

**Acceptance Tests:**
```gherkin
Given I have enabled Action Extraction in Settings
When I create a note with body "TODO: review budget\n\n- [ ] Call client"
And I save the note
Then I navigate to Tasks View
And I see 2 tasks: "review budget" and "Call client"
When I click the source note link on "review budget"
Then the source note opens in Editor
```

---

## Feature 6: Daily Digest

**User Story:**
As a user who captures many notes, I want a daily summary of my work, so that I can reflect on progress and identify next steps without manually reviewing all notes.

**Problem Solved:**
Stage 2: Users report "forgetting what I worked on" and "no sense of progress." Daily reflection creates habit + re-engagement opportunity. Retention mechanism to increase DAU/MAU.

**Flow Steps:**
1. Trigger fires (automatic on app launch between 8-10am, or manual via Settings → "Generate Digest")
2. DigestEngine queries notes created/updated in time range (default: last 24 hours)
3. Summarization algorithm:
   - Extract first sentence from each note (or title if body is short)
   - Score sentences by TF-IDF (high-information-density sentences)
   - Select top 5 sentences
   - Format as Markdown bullet list
4. Count notes created and tasks extracted
5. Generate digest Markdown:
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
   ```
6. Display in dedicated Digest panel (modal or sidebar)
7. User can:
   - Click note titles to open in editor
   - Click tasks to navigate to Tasks View
   - Export digest as Markdown file (future)
   - Dismiss digest (closes modal)
   - Change digest settings (time range, auto-show preference)

**UX Notes:**
- **Non-Intrusive**: Modal appears on launch but can be dismissed, won't reappear until next trigger
- **Skip Empty Days**: If no notes created/updated, show "No activity yesterday. Start capturing ideas!"
- **Customization**: Settings → Digest → Time range (1 day, 3 days, 7 days), auto-show (yes/no)
- **Accessibility**: Digest content is plain Markdown (screen reader friendly), keyboard-navigable links

**Edge Cases:**
- **No activity**: Show "No notes or tasks created in this period."
- **Very high activity** (>50 notes): Summarize top 10 by edit volume, show total count
- **First launch** (no historical data): Show welcome message instead of digest
- **Manual trigger on same day**: Allow re-generation with updated data (don't cache)
- **Digest during active work session**: Don't interrupt, queue for next launch
- **Timezone handling**: Use local system time for "yesterday" calculation (not UTC)
- **Summarization failure**: Fall back to simple bulleted list of note titles
- **Missing timestamps** (data corruption): Skip malformed notes, log error

**Success Criteria:**
- Digest generates within 2 seconds (including database query + summarization)
- Summary accurately reflects user activity (validated via user survey)
- ≥30% of users don't disable digest after 1 week (retention indicator)
- Clickable links work correctly (open notes/tasks)
- No performance impact on app launch (<200ms added latency)

**Risks & Mitigations:**
- **Risk**: Digest annoys users (intrusive, irrelevant)
  **Mitigation**: Easy to disable in Settings, auto-show only once per day, dismissible modal

- **Risk**: Summarization quality poor (unhelpful bullets)
  **Mitigation**: Start with simple sentence extraction, iterate based on feedback, allow user to customize

- **Risk**: Users ignore digest (low engagement)
  **Mitigation**: Monitor adoption metrics, A/B test timing (morning vs. evening), consider removing if <20% engagement

- **Risk**: Performance impact on launch
  **Mitigation**: Run digest generation in background (don't block UI), cache last digest

**Dependencies:**
- NotesRepo for querying recent notes
- TasksRepo for counting recent tasks
- Summarization engine (bullets.ts) for TF-IDF-based sentence selection
- Date/time utilities for time range calculation

**MVP Status:** **Should Have** (P1 - Retention mechanism)

**Feature Flag:** `DAILY_DIGEST_ENABLED` (default: true)

**Acceptance Tests:**
```gherkin
Given I created 3 notes yesterday
When I launch the app in the morning
Then I see a Daily Digest modal
And the digest shows "You created 3 notes yesterday"
And I see a bulleted summary of key activity
When I click a note title in the digest
Then the note opens in Editor
```

---

## Feature 7: Local Encrypted Storage

**User Story:**
As a privacy-conscious user, I want my notes encrypted at rest on my local disk, so that I can trust my sensitive information is protected from physical disk access or theft.

**Problem Solved:**
Stage 2: Privacy rated 9.2/10 importance. Users distrust cloud apps due to data breaches and surveillance fears. Local-only + encryption at rest is core differentiator vs. Obsidian (no default encryption) and Notion (cloud-only).

**Flow Steps:**
1. **First Launch**:
   - App detects no encryption key exists
   - Prompt user: "Enable encryption for your notes?" (Yes/No)
   - If Yes:
     - On Windows: Generate key, store using DPAPI (Data Protection API)
     - Fallback: Prompt for passphrase, derive key using PBKDF2 (100k iterations)
   - If No: Store notes unencrypted (allow enabling later)
2. **Normal Operation**:
   - On note save:
     - If encryption enabled: Encrypt note body with AES-256-GCM (using libsodium)
     - Store ciphertext in `enc_blob` column
     - Store plaintext in `body` column for FTS indexing (can be cleared for stricter security)
   - On note read:
     - If `enc_blob` exists: Decrypt using stored key
     - Display plaintext in editor
3. **Key Management**:
   - Settings → Privacy → "Encryption Status" shows:
     - "Enabled" (green) or "Disabled" (gray)
     - "Key stored securely via Windows DPAPI" or "Passphrase-protected"
   - Settings → Privacy → "Change Passphrase" (if using passphrase mode)
   - Settings → Privacy → "Enable Encryption" (if currently disabled)
4. **Security Indicators**:
   - Lock icon in status bar when encryption active
   - Warning banner if encryption disabled: "Notes are not encrypted. Enable in Settings."

**UX Notes:**
- **Transparency**: Clear messaging about what is/isn't encrypted (metadata like timestamps not encrypted for indexing)
- **Trust Signals**: Show encryption algorithm (AES-256), open-source code for audit
- **Onboarding**: First launch wizard emphasizes privacy as key feature
- **Performance**: Encryption/decryption must be fast (<10ms per note) to avoid UI lag

**Edge Cases:**
- **Key unavailable** (e.g., DPAPI failure): Prompt for passphrase as fallback, or fail gracefully (read-only mode)
- **Passphrase forgotten**: **No recovery possible** - warn user prominently during setup
- **Migrating from unencrypted to encrypted**: Batch encrypt all existing notes, show progress bar
- **Disk full during encryption**: Abort, leave notes unencrypted, show error
- **Corrupted ciphertext**: Detect via authentication tag, show error "Note corrupted, cannot decrypt", offer to restore from backup
- **Platform migration** (Windows to Mac in future): DPAPI keys not portable, require passphrase export
- **Backup exposure**: Warn user to exclude app data folder from cloud backup services (OneDrive, Dropbox)

**Success Criteria:**
- ≥70% of users enable encryption (measured via telemetry if opt-in)
- Encryption/decryption adds <10ms latency per note operation (measured via benchmarks)
- Zero plaintext notes in database when encryption enabled (verified via hex dump inspection)
- Key management UI is clear and understandable (validated via user testing)
- No data loss due to encryption failures (comprehensive error handling)

**Risks & Mitigations:**
- **Risk**: Encryption bugs cause data loss
  **Mitigation**: Extensive testing, fallback to unencrypted save on error, automatic backups

- **Risk**: Poor key management UX (users get locked out)
  **Mitigation**: Clear warnings during setup, optional key export for backup, recovery documentation

- **Risk**: Performance impact on large notes
  **Mitigation**: Use hardware-accelerated AES (CPU instructions), benchmark with 100KB notes

- **Risk**: DPAPI not available (older Windows versions)
  **Mitigation**: Fallback to passphrase mode, detect OS version on launch

**Dependencies:**
- libsodium (sodium-native npm package) for AES-256-GCM encryption
- Windows DPAPI wrapper (node-dpapi) for key storage on Windows
- PBKDF2 implementation (Node.js crypto module) for passphrase-based key derivation
- SQLite schema with `enc_blob` column for ciphertext storage

**MVP Status:** **Must Have** (P0 - Core privacy promise)

**Feature Flag:** `ENCRYPTION_ENABLED` (user setting, default: false until user chooses)

**Acceptance Tests:**
```gherkin
Given I enable encryption on first launch
When I create a note with body "Sensitive information"
And I inspect the SQLite database file in a hex editor
Then the note body is stored as ciphertext (not readable plaintext)
When I open the note in the editor
Then the body displays as "Sensitive information" (decrypted correctly)
```

---

## Feature 8: Settings Panel

**User Story:**
As a user, I want to customize app behavior, keyboard shortcuts, and privacy settings, so that I can tailor KnowledgeFlow to my preferences and maintain control over my data.

**Problem Solved:**
Stage 2: Users expressed "automation anxiety" - want control over automated features. Settings provide transparency and control, building trust. Feature flags allow cautious feature rollout.

**Flow Steps:**
1. User presses `Ctrl+5` or clicks Settings gear icon in toolbar
2. Settings panel opens (modal or sidebar, 600px width)
3. Tabbed interface with 4 categories:
   - **General**: Theme (light/dark - future), language (English only in MVP)
   - **Privacy**: Encryption, telemetry, data location, backup warnings
   - **Keyboard**: Hotkey customization, conflicts detection
   - **Features**: Feature flag toggles (Auto-link, Action Extract, Digest, Tag Suggestions)
   - **Advanced**: Performance tuning (max graph nodes, link threshold), debug logging
4. User navigates tabs (click or Ctrl+Tab)
5. User modifies settings:
   - **Toggles**: Click to enable/disable (instant feedback)
   - **Sliders**: Drag to adjust values (e.g., link sensitivity 0.1-0.5)
   - **Hotkey inputs**: Click "Record" button, press new key combo, auto-saves
   - **Text inputs**: Type new values (e.g., passphrase)
6. Changes auto-save to database on blur/change
7. "Saved" toast appears briefly in corner
8. Settings requiring restart show badge "Restart required" in red

**UX Notes:**
- **Search**: Search box at top to filter settings by keyword (e.g., "encryption")
- **Defaults**: "Reset to Defaults" button at bottom (requires confirmation)
- **Accessibility**: Keyboard-navigable (Tab through all inputs), screen reader labels
- **Validation**: Inline validation for invalid inputs (e.g., duplicate hotkeys, out-of-range values)
- **Help Text**: Each setting has tooltip (?) icon explaining what it does

**Settings Breakdown:**

### Privacy Tab
| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| Enable Encryption | Toggle | OFF (user chooses on first launch) | Encrypt notes at rest with AES-256 |
| Change Passphrase | Button | N/A | Update encryption passphrase (if using passphrase mode) |
| Telemetry | Toggle | OFF | Share anonymous usage data to improve app |
| View Last Telemetry Payload | Button | N/A | Show JSON of last data sent (transparency) |
| Data Location | Read-only text | `C:\Users\...\AppData\Roaming\knowledgeflow` | Path to database file |
| Cloud Backup Warning | Checkbox | Unchecked | "I've disabled cloud backup for app folder" |

### Features Tab
| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| Auto-link Notes | Toggle | ON | Build semantic links between notes automatically |
| Extract Actions | Toggle | OFF | Detect TODO items and create tasks |
| Daily Digest | Toggle | ON | Show summary of recent work on launch |
| Suggest Tags | Toggle | ON | Auto-suggest tags from note content |
| Link Sensitivity | Slider (0.1-0.5) | 0.3 | Threshold for semantic link creation (lower = more links) |

### Keyboard Tab
| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| Quick Capture | Hotkey input | Ctrl+Shift+K | Global hotkey to open capture overlay |
| New Note | Hotkey input | Ctrl+N | Create new note in app |
| Search | Hotkey input | Ctrl+F | Open search |
| Notes List | Hotkey input | Ctrl+1 | Navigate to Notes List |
| Note Editor | Hotkey input | Ctrl+2 | Navigate to Editor (if note selected) |
| Tasks View | Hotkey input | Ctrl+3 | Navigate to Tasks |
| Graph View | Hotkey input | Ctrl+4 | Navigate to Graph |
| Settings | Hotkey input | Ctrl+5 | Open Settings |

### Advanced Tab
| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| Max Graph Nodes | Number input | 200 | Limit nodes rendered in Graph View for performance |
| Search Result Limit | Number input | 50 | Max results shown in search |
| Enable Debug Logging | Toggle | OFF | Write verbose logs to file for troubleshooting |
| Export Logs | Button | N/A | Save logs to file for support |
| Rebuild Search Index | Button | N/A | Force rebuild FTS index (if search broken) |
| Clear All Data | Button | N/A | **Danger**: Delete all notes and reset app (requires confirmation) |

**Edge Cases:**
- **Conflicting hotkeys**: Detect on save, show error "Hotkey 'Ctrl+N' already in use for 'New Note'. Choose different."
- **Invalid slider values**: Clamp to min/max range (0.1-0.5 for link sensitivity)
- **Encryption enabled with no passphrase**: Require passphrase input before enabling
- **Reset to defaults**: Show confirmation modal "This will reset all settings. You cannot undo. Continue?"
- **Settings file corrupted**: Load hardcoded defaults, log error, notify user "Settings reset to defaults due to corruption."
- **Restart required but user doesn't restart**: Show persistent notification banner "Restart required for changes to take effect."

**Success Criteria:**
- All settings persist across app restarts (stored in `settings` table)
- Changes take effect immediately (or after restart if required)
- Conflicting hotkeys prevented (cannot save duplicate bindings)
- Users can find settings easily (search box helps)
- No settings lost on app crash (auto-save on change)

**Risks & Mitigations:**
- **Risk**: Settings panel overwhelming (too many options)
  **Mitigation**: Progressive disclosure (Advanced tab hidden by default), search functionality, clear categorization

- **Risk**: Users break app with bad settings (e.g., disable all features)
  **Mitigation**: "Reset to Defaults" button, validation prevents invalid values, clear help text

- **Risk**: Settings don't persist (database write failure)
  **Mitigation**: Retry with exponential backoff, show error banner if save fails, keep in-memory state

**Dependencies:**
- SettingsRepo for CRUD operations on `settings` table
- Zustand or React Context for settings state management (avoid prop drilling)
- Validation utilities for input checking
- Hotkey recording library for capturing key combos

**MVP Status:** **Must Have** (P0 - User control for trust)

**Acceptance Tests:**
```gherkin
Given I open Settings
When I navigate to Features tab
And I toggle "Extract Actions" to ON
And I close Settings and restart app
Then I open Settings again
And I see "Extract Actions" is still ON (persisted)
When I create a note with "TODO: test"
Then I see a task extracted in Tasks View (feature enabled)
```

---

## Cross-Feature Integration Map

| Feature | Triggers | Depends On | Outputs |
|---------|----------|------------|---------|
| Quick Capture | Global hotkey | NotesRepo, Encryption | New note in DB |
| Note Editor | User click/navigation | NotesRepo | Updated note in DB |
| Tag Extraction | Note save | Note content | Suggested tags array |
| Graph View | User navigation | NotesRepo, LinksRepo | Visual graph |
| Action Extraction | Note save (if enabled) | Note content | Tasks in TasksRepo |
| Daily Digest | Scheduled/manual | NotesRepo, TasksRepo | Markdown summary |
| Encryption | Note save/read | Key management | Encrypted blob in DB |
| Settings | User edits | SettingsRepo | Feature flags, hotkeys |

**Data Flow Example** (Quick Capture → Graph View):
1. User presses Ctrl+Shift+K
2. Quick Capture overlay opens
3. User types note with "Q4 budget planning"
4. Note saved via NotesRepo.create()
5. Tag Extractor suggests ["q4-planning", "budget"]
6. Note saved with tags
7. **Background**: LinkEngine scans for semantic links, finds existing note about "budget review"
8. Link created in LinksRepo (srcId: new note, dstId: existing note, weight: 0.8)
9. User opens Graph View (Ctrl+4)
10. New note appears as node, connected to existing "budget review" note
