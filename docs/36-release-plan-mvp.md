# MVP Release Plan

Version: 0.1
Owner: product-lead
Status: Draft
Last updated: 2025-10-31

## Release Timeline

**Stage 3 Duration**: 3 weeks (Nov 15 - Dec 6, 2025)

### Week 1 (Nov 15-22): Foundation
- [ ] All documentation complete (docs 25-36)
- [ ] Design tokens and wireframes finalized
- [ ] Database schema and migrations implemented
- [ ] Repository layer complete (CRUD operations)
- [ ] Encryption module implemented (stub acceptable)

### Week 2 (Nov 23-29): Features
- [ ] Semantic features implemented (tag extraction, link building, action extraction)
- [ ] UI components scaffolded (pages, layouts)
- [ ] Quick Capture overlay functional
- [ ] Note Editor with auto-save
- [ ] Search working (FTS5 integration)

### Week 3 (Nov 30-Dec 6): Polish & Testing
- [ ] Graph View rendering
- [ ] Tasks View displaying extracted actions
- [ ] Settings panel wired up
- [ ] All unit tests passing (≥70% coverage)
- [ ] E2E smoke tests passing
- [ ] Performance targets validated
- [ ] Documentation review and finalization

---

## Branch Strategy

### Git Workflow

```
main
├── develop
│   ├── feature/quick-capture
│   ├── feature/semantic-engine
│   ├── feature/graph-view
│   └── feature/encryption
```

**Branch Naming**:
- `feature/` - New features
- `bugfix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring

**Merge Strategy**:
- Feature branches → `develop` via Pull Request (PR review required)
- `develop` → `main` only for releases (tagged)

---

## Version Tagging

### Tag Naming Convention

**Format**: `stage3-v{major}.{minor}.{patch}-{label}`

**Examples**:
- `stage3-v0.1-specs-ready` - After docs complete (Week 1)
- `stage3-v0.5-prototype-running` - After app runs (Week 2)
- `stage3-v0.9-rc` - Release Candidate (Week 3, pre-final)
- `stage3-v1.0-mvp-scaffold` - Final MVP scaffold release (Dec 6)

### Tag Creation

```bash
# Week 1 milestone
git tag -a stage3-v0.1-specs-ready -m "Documentation and design complete"
git push origin stage3-v0.1-specs-ready

# Week 2 milestone
git tag -a stage3-v0.5-prototype-running -m "Core features functional"
git push origin stage3-v0.5-prototype-running

# Week 3 release candidate
git tag -a stage3-v0.9-rc -m "Release candidate - all tests passing"
git push origin stage3-v0.9-rc

# Final MVP scaffold
git tag -a stage3-v1.0-mvp-scaffold -m "MVP scaffold complete"
git push origin stage3-v1.0-mvp-scaffold
```

---

## Build Artifacts

### Build Process

**Command**: `pnpm tauri build`

**Output Location**: `src-tauri/target/release/bundle/`

### Artifacts

**Windows**:
- `KnowledgeFlow-Setup-0.1.0.exe` - NSIS installer (recommended)
- `KnowledgeFlow-0.1.0-portable.exe` - Portable executable (no install)
- `KnowledgeFlow-0.1.0.msi` - MSI installer (enterprise)

**Checksums**:
```
SHA256 hashes:
├── KnowledgeFlow-Setup-0.1.0.exe.sha256
├── KnowledgeFlow-0.1.0-portable.exe.sha256
└── KnowledgeFlow-0.1.0.msi.sha256
```

### Build Configuration

**tauri.conf.json**:
```json
{
  "package": {
    "productName": "KnowledgeFlow",
    "version": "0.1.0"
  },
  "tauri": {
    "bundle": {
      "identifier": "com.knowledgeflow.app",
      "icon": [
        "icons/32x32.png",
        "icons/128x128.png",
        "icons/icon.icns",
        "icons/icon.ico"
      ],
      "active": true,
      "targets": ["nsis", "msi"],
      "windows": {
        "certificateThumbprint": null,
        "digestAlgorithm": "sha256",
        "timestampUrl": ""
      }
    }
  }
}
```

---

## Manual Test Script (Pre-Release)

### 1. Fresh Install Test

**Objective**: Verify app installs and launches correctly on clean Windows system

**Steps**:
1. [ ] Uninstall any previous KnowledgeFlow versions
2. [ ] Run `KnowledgeFlow-Setup-0.1.0.exe`
3. [ ] Follow installer prompts (default options)
4. [ ] Launch app from Start Menu
5. [ ] Verify app opens within 2 seconds
6. [ ] Check no errors in console (DevTools: F12)

**Expected**: App installs successfully, launches to Notes List empty state

---

### 2. Core Flows Test

**Objective**: Validate all 6 core user flows work end-to-end

#### Flow 1: Quick Capture
1. [ ] Press `Ctrl+Shift+K` (app can be in background)
2. [ ] Verify overlay appears within 100ms
3. [ ] Type "Test Note" in title, press Tab
4. [ ] Type "This is a test note." in body
5. [ ] Press `Ctrl+S`
6. [ ] Verify overlay closes
7. [ ] Verify note appears in Notes List

**Expected**: Note created and visible in <1 second

#### Flow 2: Note Edit
1. [ ] Click "Test Note" card in Notes List
2. [ ] Verify editor opens with note content
3. [ ] Edit body: "Updated test note."
4. [ ] Wait 2 seconds (auto-save triggers)
5. [ ] Verify "Saved ✓" indicator appears
6. [ ] Close editor (Esc or navigate away)
7. [ ] Reopen note
8. [ ] Verify changes persisted

**Expected**: Auto-save works, no data loss

#### Flow 3: Search
1. [ ] Press `Ctrl+F`
2. [ ] Type "test" in search box
3. [ ] Verify results appear within 150ms
4. [ ] Verify "Test Note" in results
5. [ ] Click result
6. [ ] Verify editor opens to that note

**Expected**: Search is fast and accurate

#### Flow 4: Graph View
1. [ ] Create second note: "Related Note" with "test content"
2. [ ] Click "Rebuild Graph" (to trigger link building)
3. [ ] Press `Ctrl+4` to open Graph View
4. [ ] Verify 2 nodes appear
5. [ ] Verify edge connects nodes (if semantic link detected)
6. [ ] Double-click node
7. [ ] Verify editor opens to that note

**Expected**: Graph renders, nodes clickable

#### Flow 5: Action Extraction
1. [ ] Open Settings (`Ctrl+5`)
2. [ ] Enable "Extract Actions" feature flag
3. [ ] Create note with body: "TODO: test action extraction"
4. [ ] Save note
5. [ ] Press `Ctrl+3` to open Tasks View
6. [ ] Verify task "test action extraction" appears
7. [ ] Click checkbox to mark done
8. [ ] Verify task moves to "Completed" section

**Expected**: Tasks extracted and manageable

#### Flow 6: Settings Persistence
1. [ ] Open Settings (`Ctrl+5`)
2. [ ] Toggle "Daily Digest" OFF
3. [ ] Close Settings
4. [ ] Close app
5. [ ] Relaunch app
6. [ ] Open Settings
7. [ ] Verify "Daily Digest" is still OFF

**Expected**: Settings persist across restarts

---

### 3. Performance Validation

**Objective**: Confirm performance targets are met

#### Cold Start Time
1. [ ] Close app completely
2. [ ] Start timer
3. [ ] Launch app from Start Menu
4. [ ] Stop timer when search box is clickable
5. [ ] Record time: _______ ms

**Target**: ≤2000ms (2 seconds)

#### Search Latency
1. [ ] Seed 1000 notes (run `pnpm seed` 100 times or use script)
2. [ ] Open search (`Ctrl+F`)
3. [ ] Type "test"
4. [ ] Measure time to results (use DevTools Performance tab)
5. [ ] Record p95 latency: _______ ms

**Target**: ≤150ms

#### Memory Usage
1. [ ] Open Task Manager
2. [ ] Find KnowledgeFlow process
3. [ ] Record idle memory: _______ MB
4. [ ] Open Graph View
5. [ ] Record peak memory: _______ MB

**Target**: Idle ≤300MB, Peak ≤500MB

---

### 4. Privacy Validation

**Objective**: Verify no data leakage or unauthorized network calls

#### Network Monitoring
1. [ ] Install Wireshark or Fiddler
2. [ ] Start packet capture
3. [ ] Launch KnowledgeFlow
4. [ ] Create notes, search, use all features for 5 minutes
5. [ ] Stop capture
6. [ ] Filter by `knowledgeflow` or app process
7. [ ] Verify: **Zero outbound HTTP/HTTPS requests**

**Expected**: No network activity (fully offline)

#### Encryption Verification
1. [ ] Enable encryption in Settings
2. [ ] Create note with body: "Sensitive secret information"
3. [ ] Close app
4. [ ] Open database file in hex editor (HxD or 010 Editor)
   - Path: `C:\Users\[USER]\AppData\Roaming\knowledgeflow\knowledgeflow.db`
5. [ ] Search for "Sensitive secret information"
6. [ ] Verify: **Text NOT found in plaintext**

**Expected**: Note body is encrypted (ciphertext only)

---

### 5. Accessibility Validation

**Objective**: Ensure keyboard navigation and screen reader compatibility

#### Keyboard Navigation
1. [ ] Launch app
2. [ ] Press Tab repeatedly
3. [ ] Verify: All interactive elements receive focus (visible outline)
4. [ ] Verify: Tab order is logical (top-to-bottom, left-to-right)
5. [ ] Press `Esc` in overlay
6. [ ] Verify: Overlay closes

**Expected**: 100% keyboard-operable

#### Screen Reader (NVDA)
1. [ ] Install NVDA (free screen reader)
2. [ ] Launch NVDA
3. [ ] Launch KnowledgeFlow
4. [ ] Navigate with keyboard
5. [ ] Verify: NVDA announces all button labels and states
6. [ ] Create note
7. [ ] Verify: NVDA announces "Note saved"

**Expected**: All actions announced clearly

---

## Known Limitations (Document in Release Notes)

### MVP Constraints
- **Windows only**: No macOS or Linux support (planned for v1.5)
- **English only**: UI and NLP features are English-only (i18n planned for v1.5)
- **Max 10k notes**: Performance degrades beyond 10,000 notes (optimization in v1.1)
- **Graph View limit**: Max 200 nodes rendered (larger graphs show warning)
- **No cloud sync**: Fully local-only (optional sync in v2.0)
- **No mobile app**: Desktop-only (mobile companion in v1.5)
- **No collaboration**: Single-user only (team edition in v3.0)
- **Semantic features are rule-based**: No machine learning (ML models in v2.0)

### Known Bugs (Accept for MVP)
- **Graph layout jitter**: Nodes sometimes shift slightly after layout stabilizes (cosmetic issue)
- **Auto-save toast overlap**: Multiple "Saved ✓" toasts can stack if editing rapidly (UX polish needed)
- **DPAPI fallback**: If DPAPI unavailable, passphrase prompt may appear unexpectedly (rare edge case)

---

## Rollback Plan

**Scenario**: Critical bug discovered post-release (e.g., data corruption)

### Immediate Actions (Day 0)
1. **Unpublish release**: Remove download links from website/GitHub
2. **Post incident notice**: "KnowledgeFlow v0.1.0 temporarily unavailable due to critical issue. Investigating."
3. **Triage bug**: Assess severity, determine root cause
4. **Notify users** (if contact list exists): Email warning not to upgrade

### Hotfix Release (Day 1-2)
1. **Fix bug**: Develop patch on `hotfix/critical-bug` branch
2. **Test thoroughly**: Run full test suite + manual validation
3. **Tag hotfix**: `stage3-v1.0.1-hotfix` (increment patch version)
4. **Rebuild artifacts**: `pnpm tauri build`
5. **Re-release**: Upload new binaries with changelog

### Post-Mortem (Day 3+)
1. **Document incident**: Write post-mortem (what happened, why, how to prevent)
2. **Update tests**: Add regression test for bug
3. **Improve CI/CD**: Add checks to catch similar issues earlier

---

## Release Checklist

### Pre-Release (Day -1)
- [ ] All acceptance criteria met (see docs/35-test-plan.md)
- [ ] All unit tests passing (`pnpm test`)
- [ ] E2E smoke tests passing on Windows 10
- [ ] Performance targets met (cold start ≤2s, search p95 ≤150ms)
- [ ] Accessibility audit passing (Lighthouse score ≥90)
- [ ] Security audit passing (no critical/high vulnerabilities from `npm audit`)
- [ ] Documentation complete (README, CONTRIBUTING, FAQ, all docs 25-36)
- [ ] Manual test script completed (5 sections above)
- [ ] Privacy verified (no network calls, encryption works)
- [ ] Known limitations documented in release notes

### Release Day (Dec 6, 2025)
- [ ] Merge `develop` → `main` (via PR with approvals)
- [ ] Tag release: `git tag -a stage3-v1.0-mvp-scaffold -m "MVP scaffold complete"`
- [ ] Build artifacts: `pnpm tauri build`
- [ ] Generate checksums: `sha256sum KnowledgeFlow-*.exe > checksums.txt`
- [ ] Create GitHub Release:
  - Title: "KnowledgeFlow MVP Scaffold - v0.1.0"
  - Body: Release notes (see template below)
  - Attachments: `.exe` files + `checksums.txt`
- [ ] Update README with download links
- [ ] Post announcement (if community exists): Discord, Reddit, Twitter

### Post-Release (Day +1)
- [ ] Monitor for issues (GitHub Issues, user feedback)
- [ ] Prepare hotfix branch if critical bugs found
- [ ] Schedule retrospective meeting (team review of Stage 3)
- [ ] Plan Stage 4 (next development cycle)

---

## Release Notes Template

```markdown
# KnowledgeFlow v0.1.0 - MVP Scaffold

**Release Date**: December 6, 2025
**Stage**: Stage 3 Complete

## Overview

KnowledgeFlow v0.1.0 is the first functional MVP scaffold—a privacy-first, offline-capable Windows note-taking application with semantic intelligence. This release includes all core features necessary for capturing, organizing, and discovering connections in your notes without ever leaving your device.

## What's New

### Core Features
✅ **Quick Capture Overlay** (`Ctrl+Shift+K`) - Instant note capture from any app
✅ **Note Editor** - Markdown support with auto-save
✅ **Full-Text Search** (`Ctrl+F`) - Lightning-fast FTS5 search (p95 <150ms)
✅ **Context-Aware Tagging** - Automatic tag suggestions from note content
✅ **Semantic Map** (`Ctrl+4`) - Visual graph of note connections
✅ **Action Extraction** - Automatic TODO detection and task management
✅ **Daily Digest** - Morning summary of yesterday's work
✅ **Local Encrypted Storage** - AES-256-GCM encryption (optional, DPAPI-backed)
✅ **Settings Panel** (`Ctrl+5`) - Feature flags, keyboard customization, privacy controls

### Privacy & Security
🔒 Fully offline (zero network calls)
🔒 Optional encryption at rest (Windows DPAPI or passphrase)
🔒 No telemetry by default (opt-in only)
🔒 Open-source (auditable code)

### Performance
⚡ Cold start <2s (on mid-range laptop)
⚡ Search latency p95 <150ms (1k notes)
⚡ Memory footprint <300MB idle

## Known Limitations

- **Windows only**: Windows 10 version 1903+ required (64-bit)
- **English only**: UI and NLP features are English-only
- **No cloud sync**: Fully local (optional sync planned for v2.0)
- **No mobile app**: Desktop-only (mobile companion planned for v1.5)
- **Max 10k notes**: Performance may degrade beyond 10,000 notes
- **Graph View**: Limited to 200 visible nodes
- **Semantic features**: Rule-based (no ML models yet)

## Installation

### Download
- [KnowledgeFlow-Setup-0.1.0.exe](https://github.com/knowledgeflow/releases/download/stage3-v1.0-mvp-scaffold/KnowledgeFlow-Setup-0.1.0.exe) (Recommended)
- [KnowledgeFlow-0.1.0-portable.exe](https://github.com/knowledgeflow/releases/download/stage3-v1.0-mvp-scaffold/KnowledgeFlow-0.1.0-portable.exe) (No install required)

### Verify Checksums
```bash
sha256sum -c checksums.txt
```

### System Requirements
- **OS**: Windows 10 version 1903+ or Windows 11 (64-bit)
- **CPU**: Intel Core i5 8th gen or equivalent (4 cores recommended)
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 500MB free space

## Getting Started

1. Install KnowledgeFlow
2. Launch the app
3. Press `Ctrl+Shift+K` to capture your first note
4. Explore features via keyboard shortcuts (`?` for help)

## Keyboard Shortcuts

- `Ctrl+Shift+K` - Quick Capture (global)
- `Ctrl+N` - New Note
- `Ctrl+F` - Search
- `Ctrl+1` - Notes List
- `Ctrl+2` - Note Editor
- `Ctrl+3` - Tasks View
- `Ctrl+4` - Graph View
- `Ctrl+5` - Settings

## Documentation

- [Product Vision](docs/25-product-vision.md)
- [User Flows](docs/26-core-user-flows.md)
- [Feature Specs](docs/28-feature-specs-mvp.md)
- [Privacy & Security](docs/31-privacy-and-threat-model.md)
- [Test Plan](docs/35-test-plan.md)

## Contributing

KnowledgeFlow is open-source (MIT License). Contributions welcome!

- Report bugs: [GitHub Issues](https://github.com/knowledgeflow/issues)
- Contribute code: [CONTRIBUTING.md](CONTRIBUTING.md)
- Security issues: security@knowledgeflow.app

## Roadmap

**v1.1 (1 month)**: Export to Markdown/PDF, performance improvements
**v1.2 (2 months)**: Import from Notion/Obsidian, advanced search filters
**v1.5 (5 months)**: Mobile companion app, i18n (Spanish, French, German)
**v2.0 (6 months)**: Local ML models (ONNX), optional encrypted cloud sync

## Acknowledgments

Built with:
- [Tauri](https://tauri.app/) - Desktop app framework
- [React](https://react.dev/) - UI framework
- [SQLite](https://sqlite.org/) - Database
- [Cytoscape.js](https://js.cytoscape.org/) - Graph visualization
- [compromise](https://github.com/spencermountain/compromise) - NLP library

## License

MIT License. See [LICENSE](LICENSE) for details.

---

**🚀 Generated with [Claude Code](https://claude.com/claude-code)**
```

---

## Post-MVP Roadmap

### v1.1 (January 2026)
- Export to Markdown/PDF
- Performance optimizations (graph virtualization)
- Bug fixes from user feedback

### v1.2 (February 2026)
- Import from Notion/Obsidian
- Advanced search filters (boolean operators, date ranges)
- Note templates

### v1.3 (March 2026)
- Themes (dark mode)
- Web clipper browser extension

### v1.4 (April 2026)
- Bulk operations (merge notes, batch tag edit)
- Note versioning (history/rollback)

### v1.5 (May 2026)
- Mobile companion app (React Native)
- i18n (Spanish, French, German, Japanese, Chinese)

### v2.0 (June 2026)
- Local ML models via ONNX (better semantic understanding)
- Optional encrypted cloud sync (zero-knowledge architecture)
- Rich media support (images, videos)

### v3.0 (2027)
- Team Edition (encrypted collaboration)
- API for third-party integrations
- Plugin system

---

## Success Metrics (Post-Launch Monitoring)

### Week 1 Metrics
- Downloads: Target 100 (alpha users, internal testing)
- Crash rate: <1%
- Critical bugs: 0
- User feedback: Collect via GitHub Issues

### Month 1 Metrics
- DAU/MAU: Target ≥30%
- Retention (D7): Target ≥60%
- Feature adoption: Quick Capture ≥80%, Graph View ≥40%, Action Extract ≥50%
- NPS: Target ≥40

### Month 3 Metrics
- Active users: Target 500
- Note count avg per user: Target 100
- Search queries per session: Target 5
- Performance maintained: Cold start still ≤2s, search p95 ≤150ms

---

**Last Updated**: 2025-10-31
**Owner**: product-lead + release-manager
