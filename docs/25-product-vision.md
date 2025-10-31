# Product Vision

Version: 0.1
Owner: product-lead
Status: Draft
Last updated: 2025-10-31

## Vision Statement

KnowledgeFlow empowers knowledge workers with a privacy-first, offline-capable Windows note-taking application that uses semantic intelligence to automatically surface connections, extract actionable insights, and organize information—without ever leaving your device. We enable users to capture thoughts instantly, discover hidden patterns in their notes, and maintain complete control over their data through local-only processing and encryption at rest.

## Success Metrics

### User Engagement
- **DAU/MAU ratio ≥30%**: Indicates daily habit formation and sticky product usage
- **D7 Retention ≥60%**: Users return after first week, validating core value proposition

### User Satisfaction
- **NPS ≥40**: Strong word-of-mouth potential and user advocacy
- **Customer Satisfaction (CSAT) ≥4.0/5.0**: Users satisfied with product experience

### Feature Adoption
- **Quick Capture ≥80%**: Primary entry point for capturing ideas, validates core workflow
- **Search ≥90%**: Essential retrieval mechanism, must be universally adopted
- **Graph View ≥40%**: Differentiating feature showing semantic connections
- **Action Extraction ≥50%**: Automation value validated when half of users opt-in
- **Daily Digest ≥30%**: Re-engagement mechanism, lower threshold acceptable

### Performance (Technical Excellence)
- **Cold Start ≤2s**: Time from launch to interactive UI on mid-range laptop
- **Search Latency p95 ≤150ms**: Fast enough to feel instant for 1,000 notes
- **Memory Footprint ≤300MB idle**: Respectful of system resources
- **Crash Rate <0.1%**: Stability required for trust in local-only app

### Privacy Validation
- **Zero outbound network calls** (default configuration): Verifiable offline-first promise
- **Encryption enabled ≥70%**: Users value and activate privacy protection
- **Telemetry opt-in ≤20%**: Expected for privacy-conscious audience

## Target User Profile

**Primary Persona: The Privacy-Conscious Knowledge Worker**
- Age: 28-45
- Role: Software engineers, researchers, writers, consultants
- Pain Points:
  - Distrust cloud note-taking apps (data harvesting concerns)
  - Overwhelmed by information without automated organization
  - Need fast capture without context switching
  - Want connections between ideas but manual linking is tedious
- Values: Privacy, speed, automation with control, local-first tools

## Competitive Positioning

| Dimension | KnowledgeFlow | Obsidian | Notion | Logseq |
|-----------|--------------|----------|--------|--------|
| Privacy-First | ✅ Encrypted local-only | ⚠️ Local but no encryption default | ❌ Cloud-required | ⚠️ Local but complex |
| Semantic Linking | ✅ Automated TF-IDF | ❌ Manual only | ⚠️ AI but cloud-based | ⚠️ Manual backlinks |
| Quick Capture | ✅ Global hotkey overlay | ❌ None | ❌ None | ❌ None |
| Action Extraction | ✅ Automated task detection | ❌ Manual | ⚠️ Database properties | ⚠️ Manual TODO |
| Windows Native | ✅ Tauri native | ⚠️ Electron | ⚠️ Web/Electron | ⚠️ Electron |

## Long-Term Vision (Beyond MVP)

**Phase 2 (Q1 2026)**: Mobile companion app for quick capture on-the-go with local sync
**Phase 3 (Q2 2026)**: Local transformer models (ONNX) for better semantic understanding
**Phase 4 (Q3 2026)**: Optional encrypted cloud sync for cross-device users
**Phase 5 (Q4 2026)**: Team edition with encrypted collaboration

## Anti-Goals (What We Won't Do)

- **Cloud-first architecture**: Undermines privacy promise
- **Mandatory accounts/login**: Barrier to entry, privacy violation
- **Ad-supported model**: Conflicts with privacy positioning
- **Mobile-first design**: Desktop power users are primary audience
- **Real-time collaboration in MVP**: Complexity not validated in Stage 2
