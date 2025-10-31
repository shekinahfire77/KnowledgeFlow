# Telemetry & Analytics Policy

Version: 0.1
Owner: product-lead
Status: Draft
Last updated: 2025-10-31

## Default: OFF (Opt-In Only)

**Privacy-First Principle**: Telemetry is **disabled by default**. Users must explicitly enable in Settings.

**Rationale**: KnowledgeFlow is positioned as a privacy-first application. Telemetry opt-out (common industry practice) would violate user trust. Opt-in respects user autonomy and aligns with GDPR/CCPA best practices.

---

## What We Collect (If Enabled)

### Application Metadata
```json
{
  "app_version": "0.1.0",
  "platform": "win32",
  "os_version": "Windows 10 Pro 19044.1234",
  "architecture": "x64",
  "locale": "en-US"
}
```

**Purpose**: Understand platform distribution, prioritize platform-specific bug fixes, plan localization.

### Feature Usage Counts
```json
{
  "feature_usage": {
    "quick_capture_opens": 45,
    "notes_created": 23,
    "graph_view_opens": 12,
    "tasks_view_opens": 8,
    "search_queries": 67,
    "tags_accepted": 34,
    "tags_rejected": 12,
    "actions_extracted": 15,
    "actions_dismissed": 3,
    "digest_shown": 7,
    "digest_dismissed": 2
  }
}
```

**Purpose**: Measure feature adoption, identify unused features (candidates for deprecation), validate product decisions.

### Performance Metrics
```json
{
  "performance": {
    "cold_start_ms": 1850,
    "note_load_p50_ms": 145,
    "note_load_p95_ms": 312,
    "search_p50_ms": 67,
    "search_p95_ms": 132,
    "graph_render_ms": 892,
    "memory_usage_mb": 287
  }
}
```

**Purpose**: Track performance against targets (cold start ≤2s, search p95 ≤150ms), identify performance regressions.

### Error Logs (Stack Traces Only)
```json
{
  "errors": [
    {
      "type": "DatabaseLockError",
      "message": "Database is locked",
      "stack": "at NotesRepo.create (notesRepo.ts:45:12)\n...",
      "timestamp": "2025-11-15T14:30:00Z",
      "context": {
        "action": "save_note",
        "feature": "quick_capture"
      }
    }
  ]
}
```

**Purpose**: Identify common bugs, prioritize fixes, improve stability.

**Privacy**: Stack traces are sanitized to remove file paths containing usernames (e.g., `C:\Users\JohnDoe\` → `C:\Users\<USER>\`).

### Aggregated Statistics
```json
{
  "statistics": {
    "total_notes": 247,
    "total_tasks": 18,
    "total_links": 134,
    "avg_note_length_words": 156,
    "avg_notes_per_day": 3.2
  }
}
```

**Purpose**: Understand usage patterns, validate scalability assumptions (e.g., "most users have <1000 notes").

---

## What We DON'T Collect (Never)

### Absolutely Prohibited
- ❌ **Note content** (titles, bodies, snippets)
- ❌ **Tags** (could reveal sensitive topics)
- ❌ **Search queries** (privacy violation)
- ❌ **Task titles** (may contain sensitive info)
- ❌ **File paths** (may contain usernames, directory structure)
- ❌ **IP addresses** (even anonymized)
- ❌ **Device serial numbers** or hardware IDs
- ❌ **GPS location**
- ❌ **Unique user identifiers** (no tracking across sessions)
- ❌ **Clipboard content**
- ❌ **Screenshots** or screen recordings

---

## How Telemetry Works

### Opt-In Flow

1. **First Launch**: No prompt (silent, telemetry OFF by default)
2. **Settings Panel**: User navigates to Settings → Privacy → "Help improve KnowledgeFlow"
3. **Checkbox**: "Share anonymous usage data" (unchecked by default)
4. **Info Link**: "What data is collected?" → Opens this policy
5. **Enable**: User checks box → Telemetry starts collecting (no data sent until next batch)

### Data Collection

**Frequency**: Events collected locally, batched weekly
**Storage**: Local SQLite table `telemetry_events` (deleted after send)
**Batching**: Max 1 week of data per batch (prevents large payloads)

**Event Schema**:
```sql
CREATE TABLE telemetry_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,  -- 'feature_usage', 'performance', 'error'
  event_data JSON NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Data Transmission

**Endpoint**: `POST https://telemetry.knowledgeflow.app/v1/batch` (hypothetical)
**Protocol**: HTTPS (TLS 1.3)
**Frequency**: Weekly (Sundays at 2am local time, or on app exit if >7 days since last send)
**Retry**: 3 retries with exponential backoff (1s, 2s, 4s) if network fails
**Timeout**: 10 seconds (don't block app if server is slow)

**Request Format**:
```http
POST /v1/batch HTTP/1.1
Host: telemetry.knowledgeflow.app
Content-Type: application/json

{
  "app_version": "0.1.0",
  "platform": "win32",
  "batch_id": "abc123",  // Random UUID per batch (not linked across batches)
  "events": [
    { "type": "feature_usage", "data": {...}, "timestamp": "..." },
    { "type": "performance", "data": {...}, "timestamp": "..." }
  ]
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Telemetry received. Thank you for helping improve KnowledgeFlow!"
}
```

### Opt-Out

**Instant**: Unchecking "Share anonymous usage data" immediately stops collection
**Pending Data**: Any unsent batches are deleted from local database
**No Retroactive Deletion**: Previously sent data cannot be deleted (it's anonymized, we can't identify which data is yours)

---

## Transparency & User Control

### View Last Payload

**Feature**: Settings → Privacy → "View Last Telemetry Payload"

**Purpose**: Full transparency. User can see exactly what was sent.

**Example**:
```json
{
  "app_version": "0.1.0",
  "platform": "win32",
  "os_version": "Windows 10 Pro 19044.1234",
  "batch_id": "7f3a9b2c-...",
  "events": [
    {
      "type": "feature_usage",
      "data": {
        "quick_capture_opens": 12,
        "notes_created": 5
      },
      "timestamp": "2025-11-15T14:30:00Z"
    },
    {
      "type": "performance",
      "data": {
        "cold_start_ms": 1823
      },
      "timestamp": "2025-11-15T09:00:00Z"
    }
  ]
}
```

**Copy Button**: User can copy JSON to clipboard for review or sharing

### Open-Source Telemetry Module

**Repository**: `src/main/telemetry/` (part of KnowledgeFlow open-source repo)

**Auditability**: Anyone can inspect code to verify:
- What data is collected
- How it's sanitized
- Where it's sent
- That opt-out truly disables collection

**Code Snippet** (pseudocode):
```typescript
class TelemetryEngine {
  private enabled: boolean = false;  // Default OFF

  async init() {
    const settings = await settingsRepo.get();
    this.enabled = settings.privacy.telemetryEnabled;
  }

  logEvent(type: string, data: any) {
    if (!this.enabled) return;  // No-op if disabled

    // Sanitize data (remove user paths, etc.)
    const sanitized = this.sanitize(data);

    // Store locally
    db.insert('telemetry_events', { type, data: sanitized });
  }

  async sendBatch() {
    if (!this.enabled) return;

    const events = db.query('telemetry_events');
    const payload = { app_version: '0.1.0', events };

    try {
      await fetch('https://telemetry.knowledgeflow.app/v1/batch', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      // Delete sent events
      db.delete('telemetry_events');
    } catch (err) {
      console.error('Telemetry send failed (will retry later):', err);
    }
  }
}
```

---

## Compliance & Legal

### GDPR (Europe)

- ✅ **Consent**: Explicit opt-in (not pre-checked)
- ✅ **Purpose Limitation**: Data used only for product improvement
- ✅ **Data Minimization**: Collect only what's necessary
- ✅ **Transparency**: Full disclosure of what's collected (this document)
- ✅ **Right to Access**: "View Last Payload" feature
- ✅ **Right to Erasure**: Opt-out deletes pending data (sent data is anonymized, cannot be linked back to user)
- ✅ **Storage Limitation**: Data deleted after analysis (not stored indefinitely)

### CCPA (California)

- ✅ **Notice at Collection**: Disclosed in Settings before enabling
- ✅ **No Sale of Data**: We don't sell telemetry data (used internally only)
- ✅ **Opt-Out**: Easy one-click disable

### Children's Privacy (COPPA - US)

- ✅ **No Data on Minors**: We don't knowingly collect data from users <13 (no age verification, but app is targeted at adults)
- ℹ️ **Parental Consent**: Not applicable (no user accounts, no age collection)

---

## Data Retention & Deletion

### Our Server-Side Practices (Hypothetical)

**Retention Period**: 90 days after collection
**Aggregation**: After 90 days, data is aggregated into summary statistics (individual events deleted)
**Backup Deletion**: Backups also purged after 90 days

**Example**:
- Day 0: Telemetry batch received → Stored in raw events table
- Day 90: Raw events aggregated → "Total quick_capture_opens: 12,345 (across all users in week of Nov 15)"
- Day 91: Raw events deleted, only aggregates remain

**No User Profiles**: Data is not linked across batches (each batch has random UUID), so we cannot build user profiles

---

## Use Cases for Telemetry

### Product Decisions

**Question**: Should we remove Graph View if adoption is low?
**Data Needed**: `graph_view_opens` count per user, percentage of users who never open Graph View
**Decision**: If <20% of users open Graph View in first month, consider hiding feature or improving onboarding

### Bug Prioritization

**Question**: Which errors impact the most users?
**Data Needed**: Error frequency, error types, stack traces
**Decision**: Fix `DatabaseLockError` first (affects 30% of users) before `GraphRenderTimeout` (affects 5%)

### Performance Regression Detection

**Question**: Did the latest update slow down the app?
**Data Needed**: `cold_start_ms` p50 and p95 before/after update
**Decision**: If cold start increased from 1.8s → 2.5s, rollback update and investigate

### Feature Validation

**Question**: Are users accepting suggested tags (validating NLP quality)?
**Data Needed**: `tags_accepted` vs `tags_rejected` ratio
**Decision**: If rejection rate >30%, improve phrase extraction algorithm

---

## Alternative: Crash Reporting Only (Future)

**Opt-In Level 2**: "Share crash reports only (no usage data)"

**What's Included**:
- ✅ Error logs (stack traces)
- ✅ App version, OS version
- ❌ Feature usage counts
- ❌ Performance metrics

**Purpose**: Minimal telemetry for users who want to help fix bugs but not share usage patterns

---

## FAQ: User Questions

**Q: Why do you need telemetry if the app is open-source?**
A: Open-source shows *what* the code does, but telemetry shows *how* users actually use it. For example, we can see that Graph View has low adoption, prompting us to improve onboarding or reconsider the feature.

**Q: Can you identify me from telemetry data?**
A: No. We don't collect IP addresses, user IDs, or any identifiers. Each batch has a random UUID that's not linked across batches. Even if our servers were compromised, there's no way to tie data back to individual users.

**Q: What if I enable telemetry, then disable it?**
A: Disabling immediately stops collection. Any unsent data in your local database is deleted. Previously sent data remains on our servers (but it's anonymized, so we can't delete "your" data specifically).

**Q: Do you share telemetry data with third parties?**
A: No. Telemetry is used exclusively by the KnowledgeFlow team for product improvement. We don't sell, rent, or share data with advertisers, analytics companies, or anyone else.

**Q: Can I trust that telemetry is really OFF by default?**
A: Yes. The code is open-source (see `src/main/telemetry/telemetryEngine.ts`). You can verify that `enabled` defaults to `false`. Or, disable network access for KnowledgeFlow in Windows Firewall and confirm no outbound requests.

---

## Implementation Checklist

### MVP (v0.1.0)
- [ ] Telemetry module implemented (but no-op by default)
- [ ] Settings → Privacy → "Share anonymous usage data" checkbox (default OFF)
- [ ] "View Last Payload" button (shows empty if never sent)
- [ ] Link to this policy document
- [ ] No telemetry endpoint live (logs to console only in MVP)

### v1.1 (Post-MVP)
- [ ] Telemetry endpoint deployed (`telemetry.knowledgeflow.app`)
- [ ] Batching and sending logic enabled
- [ ] Error monitoring integrated (Sentry alternative, self-hosted)
- [ ] Analytics dashboard (internal-only, not user-facing)

### v1.2 (Enhanced Transparency)
- [ ] "Telemetry Playground" (future): Interactive tool showing anonymized data
- [ ] Public metrics: Share high-level stats (e.g., "50% of users enable encryption")
- [ ] Opt-in to beta features via telemetry (e.g., "Test new graph layout")

---

## Conclusion

**Telemetry in KnowledgeFlow**:
- ✅ **Opt-In**: Disabled by default, user must explicitly enable
- ✅ **Anonymous**: No user identifiers, no cross-batch linking
- ✅ **Transparent**: Full disclosure of what's collected, view last payload
- ✅ **Open-Source**: Code is auditable by anyone
- ✅ **Privacy-Respecting**: No note content, no search queries, no sensitive data
- ✅ **Purpose-Driven**: Used only for product improvement, not ads or tracking
- ✅ **Compliant**: GDPR, CCPA, COPPA-friendly

**User Promise**: If you don't enable telemetry, **zero data leaves your device**. No tracking, no analytics, no "anonymous" IDs. Complete privacy.

---

**Last Updated**: 2025-10-31
**Next Review**: 2026-01-15 (post-MVP, after first data collection)
**Owner**: product-lead + legal-counsel (if/when hired)
