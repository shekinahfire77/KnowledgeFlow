# UX Principles & Design System

Version: 0.1
Owner: product-lead
Status: Draft
Last updated: 2025-10-31

## Core UX Principles

### 1. Focus Over Features
**Principle**: Single-tasking UI that emphasizes the current activity without distraction.

**Implementation**:
- Minimal chrome (thin borders, subtle shadows)
- Generous whitespace (40px padding minimum)
- One primary action visible at a time
- Distraction-free writing mode (F11 full-screen editor)
- No notifications/popups during active editing

**Anti-Patterns to Avoid**:
- ❌ Sidebar clutter with too many options
- ❌ Animated UI elements that draw attention
- ❌ Modal dialogs that interrupt flow
- ❌ Busy backgrounds or gradients

### 2. Speed Over Complexity
**Principle**: Every interaction feels instant (<100ms perceived latency). Keyboard shortcuts for all actions.

**Implementation**:
- Keyboard-first navigation (all features accessible via hotkeys)
- Predictive loading (pre-fetch likely next actions)
- Optimistic UI updates (show result before server confirms)
- Debounced auto-save (avoid blocking on writes)
- Instant search results (FTS5 with <150ms p95)

**Performance Budgets**:
- Overlay appearance: <100ms
- Note load: <200ms
- Search results: <150ms p95
- Graph render: <1s for 100 nodes
- Auto-save latency: <2s from last keystroke

### 3. Clarity Over Cleverness
**Principle**: Obvious information hierarchy, clear next actions, no hidden functionality.

**Implementation**:
- Visual hierarchy: Title (24px bold) → Body (16px regular) → Meta (14px gray)
- Primary action buttons: Solid color, high contrast
- Secondary actions: Outlined or text-only
- Labels over icons alone (always pair icon with text)
- Clear feedback for all actions ("Saved ✓", "Error: ...")

**Information Architecture**:
```
Primary Nav (Ctrl+1-5):
├─ Notes List (Ctrl+1)      [Default view]
├─ Note Editor (Ctrl+2)     [Opens on note select]
├─ Tasks (Ctrl+3)           [Action items]
├─ Graph (Ctrl+4)           [Visual exploration]
└─ Settings (Ctrl+5)        [Configuration]

Secondary Actions:
├─ Quick Capture (Ctrl+Shift+K)  [Global]
├─ Search (Ctrl+F)               [Overlay]
└─ Command Palette (Ctrl+.)      [Power user]
```

### 4. Privacy by Design
**Principle**: Visual indicators that data never leaves device. No cloud icons, no "syncing" spinners.

**Implementation**:
- Status bar shows "Local Only 🔒" indicator
- Settings → Privacy → Encryption status visible
- No "Sign In" buttons (no accounts needed)
- Warning banners for privacy risks (e.g., cloud backup enabled)
- Open-source transparency (code available for audit)

**Trust Signals**:
- Green lock icon when encryption enabled
- Database file location shown in Settings (transparency)
- "Your data stays on your device" messaging on first launch
- No network activity indicators (no spinners, loading states)

---

## Keyboard-First Interaction Model

### Global Shortcuts (Work Anywhere)

| Shortcut | Action | Context |
|----------|--------|---------|
| `Ctrl+Shift+K` | Quick Capture overlay | Global (any app) |

### In-App Navigation

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+1` | Notes List | View all notes |
| `Ctrl+2` | Note Editor | Open selected note (if any) |
| `Ctrl+3` | Tasks View | View action items |
| `Ctrl+4` | Graph View | Visual knowledge map |
| `Ctrl+5` | Settings | Configuration panel |
| `Ctrl+N` | New Note | Create blank note in editor |
| `Ctrl+F` | Search | Open search overlay |
| `Ctrl+.` | Command Palette | Type-to-search all actions |
| `Esc` | Close/Cancel | Dismiss overlay, modal, or dialog |
| `?` | Help Overlay | Show all keyboard shortcuts |

### Editor Shortcuts

| Shortcut | Action | Effect |
|----------|--------|--------|
| `Ctrl+S` | Manual Save | Trigger save immediately (also auto-saves) |
| `Ctrl+B` | Bold | Wrap selection in **bold** |
| `Ctrl+I` | Italic | Wrap selection in *italic* |
| `Ctrl+K` | Insert Link | Create [link](url) at cursor |
| `Ctrl+\`` | Code Inline | Wrap selection in \`code\` |
| `Ctrl+Shift+C` | Code Block | Insert triple backtick block |
| `Ctrl+Z` | Undo | Undo last edit (50-action history) |
| `Ctrl+Y` | Redo | Redo undone edit |
| `Ctrl+/` | Comment | Insert <!-- comment --> |
| `Tab` | Indent | Indent selected lines |
| `Shift+Tab` | Outdent | Outdent selected lines |
| `Ctrl+D` | Duplicate Line | Duplicate current line |
| `Ctrl+L` | Select Line | Select entire line |
| `/` | Slash Command | Type slash commands (e.g., /todo, /heading) |

### Search Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `Ctrl+F` | Open Search | From any view |
| `↓` / `↑` | Navigate Results | Move selection up/down |
| `Enter` | Open Note | Open selected result in editor |
| `Esc` | Close Search | Return to previous view |
| `Ctrl+Shift+F` | Search in Graph | Open search within Graph View |

### Graph View Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `Scroll Wheel` | Zoom In/Out | Pan and zoom graph |
| `Click+Drag` | Pan Canvas | Move graph viewport |
| `Click Node` | Select | Highlight node, show tooltip |
| `Double-Click Node` | Open Note | Open in editor |
| `Ctrl+R` | Rebuild Graph | Re-run semantic link engine |
| `Ctrl+F` | Search Graph | Highlight nodes matching query |
| `Esc` | Deselect | Clear node selection |

### Tasks View Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `Space` | Toggle Done | Mark task complete/incomplete |
| `Enter` | Edit Task | Inline edit task title |
| `Del` | Delete Task | Remove task from database |
| `Ctrl+Click` | Select Multiple | Multi-select for bulk actions |
| `Shift+Click` | Range Select | Select range of tasks |

### Settings Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `Ctrl+Tab` | Next Tab | Cycle through Settings tabs |
| `Ctrl+Shift+Tab` | Previous Tab | Cycle backward through tabs |
| `Ctrl+F` | Search Settings | Filter settings by keyword |
| `Esc` | Close Settings | Return to previous view |

---

## Accessibility Guidelines

### WCAG 2.1 AA Compliance

**Color Contrast**:
- Text on background: ≥4.5:1 for normal text, ≥3:1 for large text (18px+)
- Interactive elements: ≥3:1 contrast with adjacent colors
- Disabled state: ≥2:1 (clear visual distinction)

**Keyboard Navigation**:
- All interactive elements focusable via Tab key
- Focus indicators: 2px solid blue outline (visible in all themes)
- Tab order follows logical reading order (top-to-bottom, left-to-right)
- No keyboard traps (Esc always exits modals/overlays)

**Screen Readers**:
- ARIA labels on all buttons, inputs, interactive elements
- Semantic HTML (use `<button>`, `<nav>`, `<main>`, not `<div onclick>`)
- Live regions for dynamic updates (e.g., "Saved" toast uses `aria-live="polite"`)
- Skip links to main content (for keyboard users)
- Landmarks for major sections (navigation, main, aside)

**Focus Management**:
- Auto-focus on overlay open (e.g., Quick Capture focuses title input)
- Return focus to trigger element on modal close
- Visible focus indicators (never `outline: none` without alternative)

**Alternative Content**:
- Graph View (visual-only) has alternative "Connections List" text view
- Icon buttons always have aria-label or visible text
- Color not sole indicator of state (use icons + text)

### Tested Screen Readers
- **Windows**: NVDA (primary), JAWS (secondary)
- **Future (macOS)**: VoiceOver

### High Contrast Mode
- Respect Windows High Contrast Mode settings
- Override custom colors with system colors
- Test in Windows Settings → Ease of Access → High Contrast

---

## Visual Language

### Color Palette
See `/design/tokens/color-tokens.json` for full palette.

**Usage Guidelines**:
- **Neutral 900 (#171717)**: Primary text, headings
- **Neutral 500 (#737373)**: Secondary text, labels
- **Neutral 300 (#d4d4d4)**: Tertiary text, placeholders
- **Neutral 200 (#e5e5e5)**: Borders, dividers
- **Neutral 100 (#f5f5f5)**: Backgrounds, hover states
- **Primary 500 (#3b82f6)**: Interactive elements (buttons, links)
- **Success (#10b981)**: Positive actions (Save, Done)
- **Warning (#f59e0b)**: Caution (e.g., encryption disabled)
- **Error (#ef4444)**: Destructive actions (Delete) or errors

### Typography Scale
See `/design/tokens/type-scale.json` for full scale.

**Hierarchy**:
1. **Page Title**: 30px (2xl), semi-bold, neutral-900
2. **Section Heading**: 24px (2xl), semi-bold, neutral-900
3. **Note Title**: 20px (xl), semi-bold, neutral-900
4. **Body Text**: 16px (base), regular, neutral-900
5. **Secondary Text**: 14px (sm), regular, neutral-500
6. **Caption**: 12px (xs), regular, neutral-400

**Font Stack**:
- **Sans-serif** (UI, body text): `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`
- **Monospace** (code): `'Cascadia Code', 'Fira Code', Consolas, monospace`

**Line Height**:
- **Tight (1.25)**: Headings, titles (minimize vertical space)
- **Normal (1.5)**: Body text, paragraphs (optimal readability)
- **Relaxed (1.75)**: Long-form content (reduce eye strain)

### Spacing System
See `/design/tokens/spacing.json` for full scale.

**8px Grid**:
All spacing values are multiples of 4px (or 8px for larger gaps):
- **xs (4px)**: Icon padding, chip spacing
- **sm (8px)**: Input padding, button padding
- **md (16px)**: Section padding, card padding
- **lg (24px)**: Component spacing, margins
- **xl (32px)**: Page padding, section gaps
- **2xl (48px)**: Hero sections, major dividers

**Layout Gutters**:
- **Sidebar**: 300px fixed width (resizable future)
- **Main content**: Max 800px width (optimal reading line length)
- **Gutter**: 40px between sidebar and main content

### Border Radius
- **None (0px)**: Inputs, precise elements
- **Small (4px)**: Buttons, chips, tags
- **Medium (8px)**: Cards, panels, modals
- **Large (12px)**: Overlays, popovers
- **Full (9999px)**: Pills, badges, avatars

### Shadows & Elevation
- **sm (1px blur)**: Subtle lift (buttons, inputs on hover)
- **md (6px blur)**: Elevated cards, dropdown menus
- **lg (15px blur)**: Modals, overlays
- **xl (25px blur)**: Dialogs, important alerts

**Usage**:
- Base layer (0): Background, body
- Layer 1 (sm shadow): Cards, panels
- Layer 2 (md shadow): Dropdowns, tooltips
- Layer 3 (lg shadow): Modals, Quick Capture overlay
- Layer 4 (xl shadow): Critical alerts, confirmations

---

## Animation & Motion

### Principles
- **Purposeful**: Animations provide feedback or guide attention, not decoration
- **Fast**: Durations ≤200ms (quick enough to feel instant)
- **Subtle**: Ease-in-out curves, no bounces or elastic effects

### Animation Catalog

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Overlay open | Fade in + scale(0.95 → 1) | 150ms | ease-out |
| Overlay close | Fade out + scale(1 → 0.95) | 150ms | ease-in |
| Toast notification | Slide up + fade in | 200ms | ease-out |
| Button hover | Background color change | 100ms | linear |
| Page transition | Fade + slide 20px | 200ms | ease-in-out |
| Loading spinner | Rotate 360° | 1000ms | linear (loop) |
| Checkbox toggle | Scale(0.8 → 1) | 150ms | ease-out |
| Graph node select | Stroke pulse | 300ms | ease-in-out |

### Reduced Motion
Respect `prefers-reduced-motion` media query:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Component Patterns

### Buttons

**Primary Button** (main action):
- Background: `primary-500`
- Text: White, 14px, semi-bold
- Padding: 12px 24px
- Border-radius: 4px
- Hover: Darken 10%
- Active: Scale 0.98

**Secondary Button** (alternative action):
- Background: Transparent
- Border: 1px solid `neutral-300`
- Text: `neutral-700`, 14px, medium
- Padding: 12px 24px
- Hover: Background `neutral-100`

**Danger Button** (destructive):
- Background: `error` (#ef4444)
- Text: White, 14px, semi-bold
- Padding: 12px 24px
- Hover: Darken 10%
- Always require confirmation (modal or inline)

### Inputs

**Text Input**:
- Border: 1px solid `neutral-300`
- Border-radius: 4px
- Padding: 8px 12px
- Font: 16px (prevents mobile zoom)
- Focus: Border → `primary-500`, 2px width
- Error: Border → `error`, show error message below

**Textarea**:
- Min-height: 120px
- Resize: Vertical only
- Auto-grow: Expand to fit content (max-height: 600px)

### Cards

**Note Card**:
- Background: White
- Border: 1px solid `neutral-200`
- Border-radius: 8px
- Padding: 16px
- Shadow: `sm` (subtle lift)
- Hover: Shadow → `md`, border → `primary-500`

**Structure**:
```
┌─────────────────────────────┐
│ **Note Title** (16px bold)  │ ← Title
│ Snippet of note body text…  │ ← Snippet (14px, 2 lines)
│                             │
│ [tag1] [tag2] [tag3]        │ ← Tags (chips)
│ Updated 2 hours ago         │ ← Timestamp (12px gray)
└─────────────────────────────┘
```

### Tags/Chips

**Suggested Tag** (not yet accepted):
- Background: Transparent
- Border: 1px dashed `neutral-300`
- Text: `neutral-600`, 12px
- Padding: 4px 8px
- Border-radius: 4px
- Icon: `+` (to accept)

**Accepted Tag**:
- Background: `primary-100` (light blue)
- Border: 1px solid `primary-500`
- Text: `primary-700`, 12px, medium
- Padding: 4px 8px
- Icon: `×` (to remove)

### Modals

**Structure**:
- Backdrop: `rgba(0, 0, 0, 0.5)` (dim background)
- Modal: White background, `lg` shadow
- Max-width: 600px
- Padding: 32px
- Border-radius: 12px
- Close button: Top-right corner, `×` icon

**Header**:
- Title: 24px semi-bold
- Close button (optional): Icon button top-right

**Body**:
- Content area with padding
- Max-height: 70vh (scrollable if content exceeds)

**Footer**:
- Action buttons (Primary + Secondary)
- Right-aligned
- Gap: 12px

### Toasts/Notifications

**Position**: Bottom-right corner, 16px from edges
**Stack**: New toasts appear above previous (max 3 visible)
**Auto-dismiss**: 3 seconds (or user clicks `×`)

**Types**:
- **Success**: Green left border, checkmark icon
- **Error**: Red left border, alert icon
- **Warning**: Yellow left border, caution icon
- **Info**: Blue left border, info icon

---

## Empty States

### Notes List (No Notes)
```
┌─────────────────────────────┐
│                             │
│     📝                      │
│                             │
│   No notes yet              │
│   Press Ctrl+Shift+K to     │
│   capture your first idea   │
│                             │
│   [ Create Note ]           │
│                             │
└─────────────────────────────┘
```

### Search (No Results)
```
No notes found for "budget"

Try different keywords or check spelling.
```

### Tasks View (No Tasks)
```
No tasks yet.

Add "TODO:" to notes or enable
Action Extraction in Settings.
```

### Graph View (No Links)
```
No semantic links detected.

Try adding more content to notes
to discover connections.

[ Rebuild Graph ]
```

---

## Error States

### Error Message Pattern
```
[Icon] **Error Title**
Brief explanation of what went wrong.

[Action Button] (e.g., "Retry", "Learn More")
```

**Examples**:

**Save Failed**:
```
❌ **Could not save note**
Database connection failed. Your changes are preserved in memory.

[ Retry ]  [ Copy to Clipboard ]
```

**Search Failed**:
```
⚠️ **Search took too long**
Try a more specific query or check your database.

[ Rebuild Search Index ]
```

---

## Loading States

### Skeleton Screens
Use for initial page load (avoid spinners if possible):

**Notes List Loading**:
- Show 5 gray rectangles (note card shapes)
- Pulse animation (opacity 0.5 → 1)

**Graph View Loading**:
- Show "Loading graph…" with progress bar
- Display node count: "Analyzing 45 of 120 notes"

### Spinners
Only use for actions taking >500ms:
- Size: 24px for inline, 48px for full-screen
- Color: `primary-500`
- Animation: Rotate 360° in 1s (linear loop)

---

## Responsive Behavior

**Window Minimum Size**: 1024x768px
**Optimal**: 1440x900px

### Layout Breakpoints
- **Narrow** (<1200px): Hide sidebar by default, toggle with button
- **Medium** (1200-1600px): Sidebar visible, main content constrained to 800px
- **Wide** (>1600px): Sidebar + main content + optional right panel (future)

### Multi-Monitor Support
- Overlays (Quick Capture) appear on monitor with focused window
- Main app remembers last position and size (restore on launch)

---

## Dark Mode (Future)

**Not in MVP**, but designed for:
- Toggle in Settings → General → Theme
- Uses CSS custom properties for easy theme switching
- Respect `prefers-color-scheme` media query
- Same contrast ratios as light mode (WCAG AA)

**Palette**:
- Background: `#1a1a1a`
- Text: `#e5e5e5`
- Primary: `#60a5fa` (lighter blue for contrast)

---

## Onboarding Experience

### First Launch Wizard (Future)
1. **Welcome Screen**: "Privacy-first note-taking"
2. **Encryption Setup**: "Enable encryption?" (Yes/No)
3. **Quick Capture Demo**: "Press Ctrl+Shift+K anytime"
4. **Feature Flags**: "Enable automation?" (Action Extract opt-in)
5. **Done**: "Start capturing ideas"

### Tooltips
- Show contextual help on hover (e.g., "This is your Quick Capture overlay")
- Dismiss with `×` or click outside
- Only show once per feature (store in settings)

---

## Voice & Tone

**Principles**:
- **Clear, not clever**: Direct language, no jargon
- **Calm, not anxious**: Avoid urgency, alarm words
- **Empowering, not bossy**: Suggest, don't command ("You might want to…" vs. "You must…")

**Examples**:
- ✅ "Your notes are encrypted and stored locally."
- ❌ "We use military-grade AES-256 encryption!"
- ✅ "Try different keywords or check spelling."
- ❌ "Search failed. Error code: FTS5_NOMATCH"

---

## Platform Conventions

### Windows-Specific
- Title bar: Native Windows chrome (minimize, maximize, close)
- Context menus: Right-click for actions (standard Windows behavior)
- Keyboard: `Ctrl` for shortcuts (not `Cmd`)
- File paths: `C:\Users\...` format in UI

### Notifications
- Use Windows native notifications (Action Center integration)
- Not in MVP, but planned for Daily Digest

---

## Component Library (Recommended)

**For Implementation**:
- **Base**: Custom components styled with design tokens
- **Icons**: Lucide React (consistent, MIT licensed)
- **Markdown**: remark + react-markdown
- **Editor**: CodeMirror 6 or Monaco (future - for syntax highlighting)

**Avoid**:
- Heavy UI frameworks (Material-UI, Ant Design) - too opinionated
- Inline styles - use CSS modules or styled-components
- `!important` - indicates design system breakdown

---

## Design QA Checklist

Before shipping:
- [ ] All keyboard shortcuts work correctly
- [ ] Focus indicators visible on all interactive elements
- [ ] Color contrast meets WCAG AA (use contrast checker)
- [ ] Text is readable at 16px minimum
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Screen reader announces all actions (test with NVDA)
- [ ] Empty states have clear next actions
- [ ] Error messages explain problem + provide solution
- [ ] Loading states prevent layout shift
- [ ] Mobile/narrow screen has functional layout (future)
