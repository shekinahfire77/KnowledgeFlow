# Core User Flows

Version: 0.1
Owner: product-lead
Status: Draft
Last updated: 2025-10-31

## 1. Quick Capture Flow

**User Story**: As a knowledge worker, I want to instantly capture ideas without leaving my current context, so that I don't lose thoughts while working.

**Entry Point**: Global hotkey `Ctrl+Shift+K` (works even when app is not focused)

**Steps**:
1. User presses `Ctrl+Shift+K` while working in any application
2. Capture overlay appears as floating window (400x200px) over current app
3. Focus automatically set to title input field
4. User types note title (optional - can be empty)
5. User presses `Tab` or clicks to move to body textarea
6. User types note content (Markdown supported)
7. System suggests tags based on content (shown as chips below textarea)
8. User presses `Enter` (or `Ctrl+S`) to save
9. Note saves to database with auto-generated ID and timestamp
10. Overlay closes automatically
11. User returns to previous application context

**Exit Points**:
- **Success**: Note saved, overlay closes, user back to previous app within 1 second
- **Cancel**: User presses `Esc` or clicks "Cancel" button, overlay closes without saving
- **Background dismiss**: User clicks outside overlay area, prompt to save draft

**Success Criteria**:
- Note appears in Notes List view within 1 second of save
- No perceptible lag in overlay appearance (<100ms)
- Keyboard-only operation fully supported
- Previous window focus restored correctly

**Error Handling**:
- **Database write failure**: Show error toast "Failed to save note. Please try again.", keep overlay open with content preserved
- **Disk full**: Show error "Insufficient disk space. Free up space and try again."
- **Encryption key unavailable**: Fall back to unencrypted save with warning banner

**Edge Cases**:
- **Empty note**: Allow save with empty title/body, auto-generate title "(Untitled - [date])"
- **Extremely long content** (>100KB): Warn user "Large note detected. Consider splitting for better performance."
- **Special characters in title**: Sanitize for filesystem safety but preserve in display
- **Overlay already open**: Do nothing (prevent duplicate overlays)

## 2. Note Edit Flow

**User Story**: As a user, I want to edit my notes seamlessly with auto-save, so that I never lose changes.

**Entry Points**:
- Click note card from Notes List
- Open note from Search results
- Navigate from Graph View (click node)
- Open from Task (click source note link)
- Keyboard shortcut: `Ctrl+2` with note selected

**Steps**:
1. User triggers note open (via any entry point)
2. Note Editor loads in main panel (right side of split view)
3. Title field shows current note title (editable)
4. Body editor shows Markdown content (editable with toolbar)
5. Tags section below shows existing + suggested tags
6. User edits title and/or body content
7. **Auto-save triggers** on:
   - Focus blur (user clicks away)
   - 2-second debounce after last keystroke
   - Manual save: `Ctrl+S`
8. "Saving..." indicator appears briefly
9. "Saved ✓" indicator appears when complete
10. `updated_at` timestamp refreshes in database and UI

**Exit Points**:
- Navigate to different note (auto-save triggered first)
- Close editor panel (auto-save triggered first)
- Close app (auto-save triggered before shutdown)

**Success Criteria**:
- Changes persisted to database within 2 seconds of last edit
- "Saved" indicator provides clear feedback
- No changes lost during navigation or app close
- Undo/redo works correctly (Ctrl+Z, Ctrl+Y)

**Edge Cases**:
- **Concurrent edits** (user switches devices): Last-write-wins strategy, show warning "Note modified elsewhere. Your changes will overwrite."
- **Network offline**: Works perfectly (local-only app)
- **Very rapid typing**: Debounce prevents excessive writes, batch updates
- **Unsaved changes on navigation**: Auto-save first, then navigate (no prompt needed)
- **Note deleted while editing**: Show error "Note no longer exists", close editor

**Error Handling**:
- **Save failure**: Keep content in memory, show persistent error banner with "Retry" button
- **Disk full**: Prevent further edits, show critical alert
- **Corrupted note data**: Load backup if available, else show error and prevent save

## 3. Graph View Flow

**User Story**: As a user, I want to visualize connections between my notes, so that I can discover relationships and explore ideas spatially.

**Entry Points**:
- Keyboard shortcut: `Ctrl+4`
- Click "Graph" icon in navigation toolbar
- Click "View in Graph" from context menu on note

**Steps**:
1. User triggers Graph View
2. System loads all notes and links from database
3. Cytoscape.js renders force-directed graph layout
4. Nodes represent notes (size = word count, color = tag category)
5. Edges represent links (thickness = similarity weight)
6. User can:
   - **Pan**: Click and drag canvas
   - **Zoom**: Mouse wheel or pinch gesture
   - **Select node**: Click note node (highlights + shows tooltip)
   - **Open note**: Double-click node (opens in editor)
   - **Filter by tag**: Right panel shows tag checkboxes
   - **Search in graph**: Type to highlight matching nodes
   - **Rebuild links**: Click "Rebuild Graph" button (re-runs semantic engine)

**Exit Points**:
- Navigate to other view (Notes, Tasks, Settings)
- Close graph panel
- Open note from graph (switches to Editor view)

**Success Criteria**:
- Graph renders within 1 second for 100 notes
- Smooth pan/zoom interaction (60 FPS)
- At least 1 edge visible if notes share content
- Node selection provides clear visual feedback
- Double-click opens note consistently

**Performance Constraints**:
- Max 200 nodes rendered at once (virtualization for larger graphs)
- Links with weight <0.2 filtered by default (adjustable in settings)
- Force-directed layout runs for max 2 seconds then stabilizes

**Edge Cases**:
- **No notes exist**: Show empty state "Create notes to see connections"
- **No links found**: Show message "No semantic links detected. Try adding more content."
- **Single note**: Show single node with message "Add more notes to see connections"
- **Isolated notes**: Show disconnected nodes in separate clusters
- **Very dense graph** (>500 nodes): Warn user, offer to filter by date range or tags

**Error Handling**:
- **Layout failure**: Fall back to circular layout
- **Rendering timeout**: Show partial graph with "Layout interrupted" message
- **Memory limit exceeded**: Filter to most recent 200 notes

## 4. Action Extraction Flow

**User Story**: As a user, I want my action items automatically extracted from notes, so that I don't have to manually maintain a separate task list.

**Entry Point**: Background process triggered on note save (if feature enabled)

**Steps**:
1. User saves note containing action patterns:
   - `TODO: review budget`
   - `- [ ] Call client`
   - `Action: Schedule meeting`
   - `Need to: Update documentation`
2. On save, action extractor scans note body with regex patterns
3. For each detected action:
   - Extract action text (following pattern)
   - Create Task object with:
     - `noteId`: Source note ID
     - `title`: Extracted text
     - `status`: 'pending'
     - `meta`: Pattern matched, timestamp
4. Insert tasks into `tasks` table
5. User navigates to Tasks View (Ctrl+3)
6. Extracted tasks appear in list with:
   - Checkbox (to mark done)
   - Task title
   - Link to source note
   - Date extracted

**User Interactions**:
- **Mark done**: Click checkbox, status → 'done', moves to "Completed" section
- **Dismiss**: Right-click → "Dismiss", status → 'dismissed', removes from pending
- **Open source**: Click note link, opens editor at source note
- **Edit task**: Click task title, inline edit (updates database)
- **Delete task**: Right-click → "Delete", removes from database

**Exit Points**:
- Navigate away from Tasks View
- All tasks completed/dismissed (empty state)

**Success Criteria**:
- Tasks appear in Tasks View immediately after note save
- Link to source note opens correct note
- Status changes persist across app restarts
- No duplicate tasks created on re-save

**Edge Cases**:
- **False positives**: User can dismiss, pattern tuning in Settings → Advanced
- **Multiple actions in one note**: All extracted as separate tasks
- **Action pattern in code block**: Ignore (detect Markdown code fences)
- **Completed action in note** (e.g., `- [x] Done`): Don't extract or mark existing as done
- **Note deleted**: Cascade delete associated tasks
- **Duplicate action text**: Create separate task with "(duplicate)" indicator

**Error Handling**:
- **Extractor crash**: Log error, don't block note save, show notification "Task extraction failed"
- **Invalid pattern**: Skip malformed matches
- **Database constraint violation**: Log and continue

**Feature Flag**: `ACTION_EXTRACT_ENABLED` (default: false in MVP, opt-in)

## 5. Daily Digest Flow

**User Story**: As a user, I want a summary of my recent work, so that I can review what I've accomplished and plan next steps.

**Entry Points**:
- **Automatic**: App launch in morning (8-10am local time)
- **Manual**: Click "Generate Digest" in Settings → Features
- **Scheduled**: Option to receive daily at specified time

**Steps**:
1. Trigger fires (automatic or manual)
2. System queries notes created/updated in time range (default: last 24 hours)
3. Digest engine processes notes:
   - Extract key sentences using TF-IDF scoring
   - Identify action verbs and important nouns
   - Generate 3-5 bullet point summary
4. Count notes and tasks created
5. Format as Markdown:
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
6. Display in dedicated Digest panel or notification
7. User can:
   - Click note titles to open
   - Click tasks to navigate to Tasks View
   - Export digest as Markdown file
   - Dismiss digest

**Exit Points**:
- User dismisses notification
- User navigates away from Digest panel
- User closes app (digest saved to history)

**Success Criteria**:
- Digest generates within 2 seconds
- Summary accurately reflects user activity
- Clickable links work correctly
- No digest shown if no activity (shows "No activity yesterday")

**Edge Cases**:
- **No notes created**: Show "No activity during this period."
- **Only trivial edits**: Filter out minor typo fixes (threshold: <10 characters changed)
- **Very high activity** (>50 notes): Summarize top 10 by edit volume
- **Missing timestamps**: Skip malformed notes
- **First launch**: Show welcome message instead of digest

**Error Handling**:
- **Summarization failure**: Fall back to simple note count + list of titles
- **Database query timeout**: Use cached data if available
- **Rendering error**: Show plain text version

**Feature Flag**: `DAILY_DIGEST_ENABLED` (default: true)

## 6. Search Flow

**User Story**: As a user, I want to find notes instantly by content, so that I can retrieve information without browsing.

**Entry Points**:
- Keyboard shortcut: `Ctrl+F`
- Click search icon in toolbar
- Type `/` in command palette

**Steps**:
1. User presses `Ctrl+F`
2. Search overlay appears (top of window or modal)
3. Focus set to search input field
4. User types query (e.g., "budget q4")
5. **Real-time search** triggers on each keystroke (debounced 150ms)
6. SQLite FTS5 performs full-text search with BM25 ranking
7. Results render as list:
   - Note title (bolded)
   - Snippet with matched terms highlighted
   - Match score (optional, for debugging)
   - Tags (visual chips)
   - Last updated timestamp
8. User can:
   - Navigate results with arrow keys
   - Press `Enter` to open selected note
   - Click result to open
   - Refine query
   - Clear search with `Esc`

**Exit Points**:
- Open note from results (switches to Editor)
- Press `Esc` (closes search overlay)
- Click outside search area

**Success Criteria**:
- Search latency p95 ≤150ms for 1,000 notes
- Results ranked by relevance (BM25 algorithm)
- Matched terms highlighted in snippet
- Keyboard navigation fully functional
- Search works offline (local-only)

**Advanced Search Features** (future):
- Filters: `tag:planning`, `created:>2025-11-01`
- Boolean operators: `budget AND (q4 OR q1)`
- Fuzzy matching: `~budget` matches "budgeting"

**Edge Cases**:
- **No results**: Show "No notes found for '[query]'. Try different keywords."
- **Very broad query** (e.g., "the"): Return top 50 results
- **Special characters**: Escape SQL properly, don't break query
- **Empty query**: Show recent notes or clear results
- **Typos**: Future: suggest corrections using edit distance

**Error Handling**:
- **FTS index corrupted**: Rebuild index, notify user "Rebuilding search index..."
- **Query timeout**: Cancel query, show "Search took too long. Try a more specific query."
- **Database locked**: Retry with exponential backoff

## 7. Settings Flow

**User Story**: As a user, I want to customize app behavior and features, so that I can tailor the experience to my preferences.

**Entry Points**:
- Keyboard shortcut: `Ctrl+5`
- Click "Settings" gear icon in toolbar
- First launch setup wizard

**Steps**:
1. User opens Settings
2. Settings panel loads with tabbed interface:
   - **General**: Appearance, language (future)
   - **Privacy**: Encryption, telemetry, data location
   - **Keyboard**: Customize hotkeys
   - **Features**: Enable/disable feature flags
   - **Advanced**: Debug options, performance tuning
3. User navigates tabs (click or Ctrl+Tab)
4. User modifies settings:
   - Toggle switches for boolean values
   - Input fields for hotkeys (record key combo)
   - Sliders for thresholds (e.g., link sensitivity)
   - Checkboxes for feature flags
5. Changes auto-save to database on blur/change
6. "Saved" indicator confirms persistence
7. Some changes require restart (show badge "Restart required")

**Settings Categories**:

### Privacy Tab
- **Encryption Status**: Shows if encryption enabled, key management
- **Change Passphrase**: Button to update encryption key
- **Telemetry**: Checkbox "Share anonymous usage data" (default: OFF)
- **Data Location**: Show path to database file
- **Cloud Backup Warning**: Checkbox "I've disabled cloud backup for app folder"

### Features Tab
- **Auto-link Notes**: Toggle (default: ON)
- **Extract Actions**: Toggle (default: OFF - opt-in)
- **Daily Digest**: Toggle (default: ON)
- **Suggested Tags**: Toggle (default: ON)
- **Link Sensitivity**: Slider 0.1-0.5 (default: 0.3)

### Keyboard Tab
- List of all shortcuts with record buttons
- "Reset to Defaults" button
- Conflict detection (show warning if duplicate)

### Advanced Tab
- **Performance**: Max graph nodes, search result limit
- **Debug**: Enable logging, export logs
- **Danger Zone**: Clear all data, reset app, export database

**Exit Points**:
- Click "Close" or `Esc`
- Navigate to other view
- Changes saved, user continues using app

**Success Criteria**:
- All settings persist across app restarts
- Changes take effect immediately (or after restart if required)
- No settings lost on crash
- Defaults are sensible and secure

**Edge Cases**:
- **Conflicting hotkeys**: Prevent save, show error "Hotkey already in use"
- **Invalid threshold values**: Clamp to valid range (0.1-0.5)
- **Encryption enabled mid-session**: Prompt to encrypt existing data
- **Reset to defaults**: Confirm with modal "This will reset all settings. Continue?"

**Error Handling**:
- **Save failure**: Show persistent error banner with retry button
- **Invalid input**: Validate on blur, show inline error message
- **Restart required but user doesn't restart**: Show persistent notification

**Feature Flag Storage**: Settings stored in `settings` table as JSON blobs

---

## Flow Interactions & Dependencies

**Flow Chaining Examples**:
1. Quick Capture → Note Edit → Graph View (see connections)
2. Search → Note Edit → Action Extraction → Tasks View
3. Daily Digest → Click note title → Note Edit
4. Graph View → Double-click node → Note Edit → See linked tasks

**Cross-Feature Dependencies**:
- **Action Extraction** depends on Note Edit (trigger on save)
- **Graph View** depends on Semantic Engine (link building)
- **Daily Digest** depends on Note Edit (activity tracking)
- **Search** depends on FTS index (auto-maintained by triggers)

**Keyboard Navigation Map**:
- `Ctrl+Shift+K`: Quick Capture (global)
- `Ctrl+N`: New note
- `Ctrl+F`: Search
- `Ctrl+1`: Notes List
- `Ctrl+2`: Note Editor
- `Ctrl+3`: Tasks View
- `Ctrl+4`: Graph View
- `Ctrl+5`: Settings
- `Ctrl+S`: Save (manual trigger)
- `Ctrl+.`: Command palette
- `Esc`: Close overlay/modal

**Error Recovery Flows**:
- **Database corruption**: Restore from backup, notify user
- **Encryption key lost**: Offer recovery options or reset (data loss)
- **App crash during save**: Load auto-saved draft on next launch
