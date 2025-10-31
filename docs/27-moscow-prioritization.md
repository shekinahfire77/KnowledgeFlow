# MoSCoW Prioritization

Version: 0.1
Owner: product-lead
Status: Draft
Last updated: 2025-10-31

## Must Have (MVP Blockers)

These features are **essential** for the MVP to deliver on the core value proposition. Without these, the product fails to address validated user needs from Stage 2.

### 1. Quick Capture Overlay (Global Hotkey)
**Priority**: P0 - Critical
**Rationale**:
- Stage 2 validation: 9/10 participants called this a "dealbreaker" feature
- Core differentiator vs. competitors (Obsidian, Notion lack this)
- Enables frictionless capture without context switching
- Validates "speed" pillar of value proposition

**Implementation Complexity**: Medium (Tauri global shortcut API)
**Risk**: Low (well-documented API)
**User Value**: Critical - primary entry point for most notes

### 2. Note Editor with Basic Formatting
**Priority**: P0 - Critical
**Rationale**:
- Table stakes functionality for any note-taking app
- Users must be able to create, edit, view notes
- Markdown support is minimum viable (rich text not required)
- Auto-save prevents data loss (trust-building)

**Implementation Complexity**: Low (standard text editor)
**Risk**: Low (mature libraries available)
**User Value**: Critical - core product functionality

### 3. Local Encrypted Storage
**Priority**: P0 - Critical
**Rationale**:
- Privacy promise is core to positioning ("privacy-first")
- Stage 2: Privacy rated 9.2/10 importance
- Encryption at rest required to differentiate from Obsidian (no default encryption)
- DPAPI integration for Windows key management

**Implementation Complexity**: High (encryption, key management)
**Risk**: Medium (security implementation mistakes possible)
**User Value**: Critical - trust foundation for privacy-conscious users

### 4. Full-Text Search (FTS5)
**Priority**: P0 - Critical
**Rationale**:
- Stage 2: 10/10 participants said "I must be able to find things fast"
- Search is primary retrieval mechanism (vs. browsing)
- Performance target: ≤150ms p95 validated in Stage 2 testing

**Implementation Complexity**: Low (SQLite FTS5 built-in)
**Risk**: Low (proven technology)
**User Value**: Critical - enables scaling beyond 50 notes

### 5. Context-Aware Tagging (Heuristic)
**Priority**: P0 - Critical
**Rationale**:
- Demonstrates "automation" pillar without AI complexity
- Stage 2: Users want organization help but fear over-automation
- Suggested tags (user approves) balances automation + control
- Differentiator: Competitors require manual tagging

**Implementation Complexity**: Medium (NLP library integration)
**Risk**: Low (rule-based, no ML risk)
**User Value**: High - saves time, improves organization

### 6. Settings with Feature Toggles
**Priority**: P0 - Critical
**Rationale**:
- User control validates "automation anxiety" mitigation from Stage 2
- Feature flags allow cautious rollout of semantic features
- Privacy settings (encryption, telemetry) must be accessible
- Keyboard customization required for power users

**Implementation Complexity**: Low (standard settings panel)
**Risk**: Low
**User Value**: High - trust through transparency and control

---

## Should Have (MVP Nice-to-Have)

These features **significantly enhance** the product but are not absolute blockers. Can ship MVP without them, but should prioritize for immediate post-launch.

### 7. Semantic Map (Graph View)
**Priority**: P1 - High
**Rationale**:
- Key differentiator: Automated link discovery via TF-IDF
- Stage 2: 7/10 users excited by this feature
- Visual exploration appeals to spatial thinkers
- However: 3/10 users said "I wouldn't use this" (acceptable loss)

**Implementation Complexity**: High (Cytoscape, force-directed layout, performance)
**Risk**: Medium (performance degradation with large graphs)
**User Value**: High for target users, but not universal
**Feature Flag**: `AUTO_LINKS_ENABLED` (default: true, can disable)

**Decision**: Include in MVP but behind feature flag. Monitor adoption metrics closely.

### 8. Action Extraction → Tasks View
**Priority**: P1 - High
**Rationale**:
- High value per Stage 2 feedback (8/10 rating)
- Automation of tedious task list maintenance
- However: False positive risk created user anxiety in testing
- Task view provides unified action item dashboard

**Implementation Complexity**: Medium (regex patterns, UI for tasks)
**Risk**: Medium (false positives could frustrate users)
**User Value**: High when it works correctly
**Feature Flag**: `ACTION_EXTRACT_ENABLED` (default: false - opt-in)

**Decision**: Include in MVP but **opt-in only**. Users must explicitly enable in Settings.

### 9. Daily Digest
**Priority**: P1 - High
**Rationale**:
- Re-engagement mechanism (addresses retention goals)
- Users liked "reflection on work done" in Stage 2 interviews
- Low-risk feature (passive, not intrusive if done right)

**Implementation Complexity**: Medium (summarization algorithm, scheduling)
**Risk**: Low (can be dismissed if unwanted)
**User Value**: Medium - nice-to-have, not essential
**Feature Flag**: `DAILY_DIGEST_ENABLED` (default: true)

**Decision**: Include in MVP. Easy to disable if users find annoying.

### 10. Keyboard Shortcuts (Comprehensive)
**Priority**: P1 - High
**Rationale**:
- Power users (target persona) demand keyboard efficiency
- Quick Capture is already a shortcut (validates importance)
- Navigation shortcuts reduce friction

**Implementation Complexity**: Low (event handlers)
**Risk**: Low
**User Value**: High for target users
**Feature Flag**: N/A (core UX)

**Decision**: Include in MVP. Essential for "speed" value prop.

---

## Could Have (Post-MVP Backlog)

These features are **valuable** but can wait until MVP is validated. Prioritize based on user feedback after launch.

### 11. Export to Markdown/PDF
**Priority**: P2 - Medium
**Rationale**:
- Users want data portability (trust signal)
- Stage 2: 6/10 mentioned wanting export
- Not blocking for core workflow

**Implementation Complexity**: Medium
**Risk**: Low
**Target**: Version 1.1 (1 month post-MVP)

### 12. Import from Notion/Obsidian
**Priority**: P2 - Medium
**Rationale**:
- Lowers switching cost for new users
- Stage 2: 4/10 currently use Notion/Obsidian
- Can manually copy notes for MVP

**Implementation Complexity**: High (parsing various formats)
**Risk**: Low
**Target**: Version 1.2 (2 months post-MVP)

### 13. Themes & Appearance Customization
**Priority**: P2 - Medium
**Rationale**:
- Nice-to-have but not validated as high priority in Stage 2
- Default neutral theme sufficient for MVP

**Implementation Complexity**: Medium (CSS variables, theme switching)
**Risk**: Low
**Target**: Version 1.3 (3 months post-MVP)

### 14. Advanced Search Filters
**Priority**: P2 - Medium
**Rationale**:
- `tag:name`, `created:>date`, boolean operators
- Power user feature, not needed for basic retrieval

**Implementation Complexity**: Medium (query parser)
**Risk**: Low
**Target**: Version 1.2

### 15. Note Templates
**Priority**: P2 - Medium
**Rationale**:
- Speeds up specific workflows (meeting notes, daily log)
- Stage 2: Only 3/10 mentioned wanting this

**Implementation Complexity**: Low
**Risk**: Low
**Target**: Version 1.4

---

## Won't Have (Out of Scope for v1)

These features are **explicitly excluded** from the first major version to maintain focus and speed to market.

### 16. Rich Media Embed (Images, Video)
**Rationale**:
- Significant complexity (file storage, rendering, encryption)
- Not validated as priority in Stage 2 (text-focused users)
- Markdown image links can work as workaround
- **Defer to**: Version 2.0 (6+ months post-MVP)

### 17. Handwriting Input (Windows Ink Integration)
**Rationale**:
- Very niche use case (not mentioned in Stage 2)
- High complexity for low adoption
- **Defer to**: Post-v2 (if requested by users)

### 18. Calendar Integration
**Rationale**:
- Not validated in Stage 2 research
- Adds scope without clear user need
- **Defer to**: Version 2.x (if requested)

### 19. Third-Party Plugins/Extensions
**Rationale**:
- Requires stable API and security model
- Premature before core product is proven
- **Defer to**: Version 3.0 (1 year post-MVP)

### 20. Real-Time Collaboration
**Rationale**:
- Conflicts with offline-first architecture
- Very high complexity (CRDT, sync conflicts)
- Not validated for solo knowledge workers in Stage 2
- **Defer to**: Team Edition (potential future product line)

### 21. Mobile App (Native iOS/Android)
**Rationale**:
- Desktop-first strategy validated in Stage 2
- Mobile as companion app, not primary interface
- **Defer to**: Version 1.5 (4-6 months post-MVP)
- **Approach**: React Native or PWA for quick capture only

### 22. Cloud Sync (Built-in)
**Rationale**:
- Conflicts with privacy-first positioning
- Optional cloud sync can come later
- Users can use file sync (Syncthing, Resilio) as workaround
- **Defer to**: Version 2.0 with **optional** encrypted sync

### 23. AI-Powered Summarization (GPT-style)
**Rationale**:
- Requires cloud API (conflicts with offline promise)
- Local inference (ONNX) is complex and resource-intensive
- Rule-based summarization sufficient for MVP
- **Defer to**: Version 2.5 with local ONNX models

### 24. Team/Multi-User Features
**Rationale**:
- Separate product line (potential Team Edition)
- Solo knowledge worker validated in Stage 2 as primary persona
- **Defer to**: Future product (18+ months)

### 25. Web Clipper / Browser Extension
**Rationale**:
- Nice-to-have but not core workflow
- Can manually copy/paste for MVP
- **Defer to**: Version 1.3 (3 months post-MVP)

---

## Prioritization Framework

### Decision Matrix

| Feature | User Value | Complexity | Risk | Differentiator | Stage 2 Validation | Decision |
|---------|-----------|------------|------|----------------|-------------------|----------|
| Quick Capture | Critical | Med | Low | ✅ High | 9/10 priority | **Must Have** |
| Note Editor | Critical | Low | Low | ❌ Table stakes | 10/10 essential | **Must Have** |
| Encryption | Critical | High | Med | ✅ High | 9.2/10 privacy | **Must Have** |
| Search | Critical | Low | Low | ❌ Table stakes | 10/10 essential | **Must Have** |
| Auto-Tagging | High | Med | Low | ✅ Medium | 7/10 interest | **Must Have** |
| Settings/Control | High | Low | Low | ⚠️ Trust signal | Implicit need | **Must Have** |
| Graph View | High | High | Med | ✅ High | 7/10 interest | **Should Have** |
| Action Extract | High | Med | Med | ✅ Medium | 8/10 interest | **Should Have** |
| Daily Digest | Medium | Med | Low | ⚠️ Retention | 6/10 interest | **Should Have** |
| Export | Medium | Med | Low | ⚠️ Trust signal | 6/10 mentioned | **Could Have** |
| Import | Medium | High | Low | ⚠️ Acquisition | 4/10 mentioned | **Could Have** |
| Rich Media | Low | High | High | ❌ Scope creep | 1/10 mentioned | **Won't Have** |
| Collaboration | Low | Very High | High | ❌ Different market | 0/10 mentioned | **Won't Have** |

### Risk Mitigation for "Should Have" Features

**Graph View Risks**:
- **Performance**: Limit to 200 nodes, offer date/tag filters
- **Low adoption**: Feature flag allows disabling
- **Confusion**: Onboarding tooltip explains graph

**Action Extraction Risks**:
- **False positives**: Opt-in only (default OFF)
- **User frustration**: Easy dismiss/delete in Tasks UI
- **Complexity**: Start with simple regex, iterate

**Daily Digest Risks**:
- **Annoyance**: Easy to disable in Settings
- **Irrelevance**: Only show if ≥2 notes created/edited
- **Timing**: Allow user to configure time or disable

---

## Release Strategy

### MVP Release (Version 0.1.0)
**Scope**: Must Have + Should Have (with feature flags)
**Timeline**: Stage 3 completion (3 weeks)
**Success Criteria**:
- All "Must Have" features working
- Performance targets met
- Zero critical bugs
- Documentation complete

### Post-MVP Iterations
**v1.1** (1 month): Export, performance improvements
**v1.2** (2 months): Import, advanced search
**v1.3** (3 months): Themes, web clipper
**v1.4** (4 months): Templates, bulk operations
**v1.5** (5 months): Mobile companion app (React Native)

**v2.0** (6 months): Rich media, optional cloud sync, local ML models

---

## Feature Flag Configuration

**MVP Feature Flags** (for gradual rollout):

```json
{
  "TAG_EXTRACTION_ENABLED": true,        // Default ON (low risk)
  "AUTO_LINKS_ENABLED": true,            // Default ON (can disable)
  "ACTION_EXTRACT_ENABLED": false,       // Default OFF (opt-in)
  "DAILY_DIGEST_ENABLED": true,          // Default ON (easy to disable)
  "GRAPH_VIEW_ENABLED": true,            // Default ON (can hide)
  "TELEMETRY_ENABLED": false             // Default OFF (privacy)
}
```

**Rollout Plan**:
1. Launch with conservative defaults (Action Extract OFF)
2. Monitor adoption metrics after 2 weeks
3. If Graph View adoption <20%: Consider removing from default UI
4. If Action Extract has high opt-in: Consider default ON in v1.1
5. If Daily Digest annoys users (feedback analysis): Improve or remove

---

## Descoping Criteria

**If timeline pressure requires cuts, remove in this order:**

1. **Daily Digest** (least critical "Should Have")
2. **Graph View** (high complexity, mixed validation)
3. **Action Extraction** (already opt-in, can ship post-MVP)

**Never descope**:
- Quick Capture
- Note Editor
- Encryption
- Search
- Auto-Tagging
- Settings

---

## Success Metrics by Category

**Must Have Features** (all must hit targets):
- Quick Capture adoption: ≥80%
- Search usage: ≥90%
- Encryption enabled: ≥70%
- Auto-tagging acceptance: ≥60% (users accept ≥1 suggestion)

**Should Have Features** (monitor for v1.1 decisions):
- Graph View adoption: ≥40% open at least once
- Action Extract opt-in: ≥20% enable feature
- Daily Digest engagement: ≥30% don't disable

**Post-MVP Features** (nice-to-have):
- Export used: ≥50% export at least once in first month
- Import used: Track as acquisition source

---

## Stakeholder Alignment

**Approved by**:
- [ ] Product Lead (prioritization rationale)
- [ ] Dev Lead (complexity estimates)
- [ ] Design Lead (UX feasibility)
- [ ] QA Lead (test coverage scope)

**Review Date**: 2025-11-15 (Stage 3 kickoff)
**Next Review**: 2025-12-06 (Stage 3 completion)
