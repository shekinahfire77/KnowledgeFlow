# Privacy Architecture & Threat Model

Version: 0.1
Owner: product-lead
Status: Draft
Last updated: 2025-10-31

## Privacy Principles

**Core Promise**: Your data never leaves your device. No accounts, no clouds, no tracking.

**Design Philosophy**:
1. **Offline-First**: App works perfectly with zero network connectivity
2. **Local-Only Storage**: All data in SQLite on user's machine
3. **Encryption at Rest**: AES-256-GCM for sensitive note content
4. **Minimal Metadata**: Only store what's necessary for functionality
5. **User Control**: All features can be disabled, data can be exported/deleted

---

## Data Architecture

### What Data We Store

**Local SQLite Database** (`C:\Users\[USER]\AppData\Roaming\knowledgeflow\knowledgeflow.db`):

| Table | Data | Encrypted? | Purpose |
|-------|------|------------|---------|
| `notes` | title, body, tags, timestamps | body: YES (optional) | Note content |
| `tasks` | title, note_id, status, timestamps | title: YES (optional) | Extracted actions |
| `links` | src_id, dst_id, weight, kind | NO | Semantic graph edges |
| `embeddings` | note_id, vector_json, algo | NO | TF-IDF vectors (cache) |
| `settings` | key-value pairs (JSON) | NO | User preferences |

**What's Encrypted** (if user enables):
- Note bodies (`notes.enc_blob` column)
- Task descriptions
- Any user-entered text

**What's NOT Encrypted** (for functionality):
- Metadata: created_at, updated_at, note IDs
- Tags (needed for filtering/search)
- Full-text search index (FTS5 virtual table)
- Links and embeddings (numerical data)
- Settings

**Rationale**: Full-text search requires plaintext index. Trade-off: Performance vs. maximum security. User can clear FTS index and rely only on encrypted full-body search (slower).

### Encryption Implementation

**Algorithm**: AES-256-GCM (Galois/Counter Mode)
- **Key Size**: 256 bits (32 bytes)
- **Nonce/IV**: 96 bits (12 bytes), randomly generated per encryption
- **Authentication Tag**: 128 bits (16 bytes), prevents tampering
- **Library**: libsodium (sodium-native npm package)

**Encryption Flow**:
```
Plaintext → AES-256-GCM(key, nonce) → Ciphertext || Tag
Store: nonce || ciphertext || tag as BLOB in database
```

**Decryption Flow**:
```
Read BLOB → Extract nonce, ciphertext, tag
AES-256-GCM-Decrypt(key, nonce, ciphertext, tag) → Plaintext (or error if tampered)
```

### Key Management

**Windows (Primary)**: DPAPI (Data Protection API)
- Keys stored in Windows Credential Manager
- Protected by user's Windows login credentials
- Automatic encryption/decryption via OS
- API: `node-dpapi` npm package

**Fallback (Cross-Platform)**: Passphrase-Based
- User enters passphrase on first launch (if DPAPI unavailable)
- Derive key using PBKDF2:
  - **Algorithm**: PBKDF2-SHA256
  - **Iterations**: 100,000 (OWASP recommendation)
  - **Salt**: 128-bit random salt (stored in settings)
  - **Output**: 256-bit key
- Passphrase never stored, only derived key hash for verification

**Key Storage Location**:
- DPAPI: Windows Credential Manager (`HKCU\Software\Microsoft\Windows\CurrentVersion\Credentials`)
- Passphrase mode: Derived key stored in `settings` table (hashed, not plaintext passphrase)

**Key Recovery**:
- **DPAPI**: Automatic (tied to Windows account)
- **Passphrase**: **No recovery if forgotten** - data is permanently unrecoverable (warn user prominently)

---

## Threat Model

### Threats In Scope

#### 1. Physical Disk Access (Laptop Theft, Disk Imaging)

**Threat**: Attacker gains physical access to user's hard drive (laptop stolen, disk removed)

**Likelihood**: Medium (common for mobile workers, travel scenarios)

**Impact**: High (all notes exposed if unencrypted)

**Mitigation**:
- ✅ Encryption at rest with AES-256-GCM
- ✅ DPAPI ties key to user account (can't decrypt on different machine without user credentials)
- ✅ Passphrase mode requires strong passphrase (recommend 16+ characters)

**Residual Risk**: If attacker also compromises Windows account password, DPAPI keys are accessible. Mitigation: Use passphrase mode with strong passphrase separate from Windows password.

---

#### 2. Backup Exposure (Cloud Backup Services)

**Threat**: User has OneDrive, Dropbox, or Google Drive syncing `AppData` folder, exposing encrypted database to cloud

**Likelihood**: High (many users have cloud backup enabled by default)

**Impact**: Medium (data is encrypted, but still increases attack surface)

**Mitigation**:
- ✅ First-launch warning: "Disable cloud backup for KnowledgeFlow data folder?"
- ✅ Settings → Privacy → Checkbox: "I've disabled cloud backup for app folder"
- ✅ Documentation: Instructions to exclude `AppData\Roaming\knowledgeflow` from OneDrive, Dropbox
- ⚠️ User responsibility: We can't programmatically disable cloud sync (no API access)

**Residual Risk**: If user ignores warning, encrypted database syncs to cloud. Data is still encrypted, but key may be vulnerable if DPAPI and cloud account both compromised.

---

#### 3. Malware / Keylogger

**Threat**: Malware on user's machine logs keystrokes (captures passphrase) or dumps memory (extracts decryption key)

**Likelihood**: Medium (common threat for consumer devices)

**Impact**: High (complete compromise - attacker can read all notes)

**Mitigation**:
- ❌ **No effective mitigation at application level** (OS-level threat)
- ⚠️ User responsibility: Antivirus, OS security updates, avoid suspicious downloads
- ℹ️ Transparency: Document in FAQ that KnowledgeFlow cannot protect against OS-level malware

**Residual Risk**: High. This is an inherent limitation of local-only apps. If OS is compromised, all bets are off.

---

#### 4. Memory Dump (Process Memory Inspection)

**Threat**: Attacker with admin privileges dumps KnowledgeFlow process memory, extracting decrypted note content or keys

**Likelihood**: Low (requires admin access and targeted attack)

**Impact**: Medium (one-time exposure of currently open notes)

**Mitigation**:
- ✅ Clear sensitive data from memory after use (`memset` zero after decryption)
- ✅ Minimize time decrypted data stays in memory (re-encrypt on save)
- ⚠️ Limited effectiveness (JavaScript/Electron memory management makes true zeroing difficult)

**Residual Risk**: Medium. If attacker has admin access, memory dumps are possible. Mitigation helps but isn't bulletproof.

---

#### 5. Supply Chain Attack (Compromised Dependencies)

**Threat**: Malicious code in npm dependencies exfiltrates data or keys

**Likelihood**: Low (rare, but high-profile incidents exist - e.g., event-stream hack)

**Impact**: High (complete compromise)

**Mitigation**:
- ✅ Dependency scanning: Weekly `npm audit` in CI/CD
- ✅ Lock file: `package-lock.json` ensures reproducible builds
- ✅ Minimize dependencies: Only use well-known, audited libraries
- ✅ Open source: Code is auditable by security researchers
- ✅ Subresource Integrity: (Future) Pin dependency hashes

**Residual Risk**: Low but non-zero. Even audited packages can be compromised post-audit. Monitor security advisories.

---

#### 6. Application Vulnerabilities (SQL Injection, XSS)

**Threat**: Bugs in KnowledgeFlow allow attackers to read/modify data or execute code

**Likelihood**: Medium (common for web/desktop apps)

**Impact**: High (data exposure or compromise)

**Mitigation**:
- ✅ **SQL Injection**: Use parameterized queries (better-sqlite3 bindings, never string concatenation)
- ✅ **XSS**: Sanitize Markdown rendering with DOMPurify, no `dangerouslySetInnerHTML` without sanitization
- ✅ **CSP**: Content Security Policy in Tauri webview prevents inline scripts
- ✅ **Code Review**: Manual security review before each release
- ✅ **Fuzzing**: (Future) Automated input fuzzing to find edge cases

**Residual Risk**: Medium. Bugs are inevitable. Mitigation: Fast patching, responsible disclosure policy.

---

### Threats Out of Scope

#### 7. Cloud Sync Interception (Not Applicable)

**Threat**: Man-in-the-middle attack on cloud sync
**Mitigation**: N/A - No cloud sync in MVP (fully offline)

#### 8. Multi-User Access Control (Not Applicable)

**Threat**: Unauthorized users on shared device accessing notes
**Mitigation**: N/A - Relies on Windows user account separation (OS responsibility)

#### 9. Screen Capture / Shoulder Surfing

**Threat**: Attacker physically observes screen or uses screen recording malware
**Mitigation**: Out of scope (user responsibility to secure physical environment)

---

## Data Minimization

**What We DON'T Collect**:
- ❌ User accounts (no login required)
- ❌ Email addresses
- ❌ IP addresses
- ❌ Device fingerprints
- ❌ Unique identifiers (no anonymous IDs sent anywhere)
- ❌ Note content (never leaves device)
- ❌ Search queries
- ❌ Usage patterns (unless telemetry explicitly enabled)

**What We DO Store Locally** (necessary for functionality):
- ✅ Note content (encrypted if enabled)
- ✅ Tags, timestamps (for organization)
- ✅ Links, embeddings (for semantic features)
- ✅ Settings, preferences (for customization)

---

## User Controls & Transparency

### Settings → Privacy Panel

**Encryption Status**:
- Visual indicator: "🔒 Enabled" (green) or "⚠️ Disabled" (yellow)
- Show method: "Windows DPAPI" or "Passphrase-Protected"
- Button: "Enable Encryption" (if disabled) or "Change Passphrase" (if passphrase mode)

**Data Location**:
- Display full path: `C:\Users\[USER]\AppData\Roaming\knowledgeflow\knowledgeflow.db`
- Button: "Open Data Folder" (launches Explorer)
- Warning: "Do not manually edit database files"

**Cloud Backup Warning**:
- Checkbox: "⚠️ I've disabled cloud backup for KnowledgeFlow folder"
- Link: "How do I exclude folders from OneDrive/Dropbox?" → Opens FAQ

**Telemetry**:
- Checkbox: "Share anonymous usage data to improve KnowledgeFlow" (default: OFF)
- Link: "What data is collected?" → Shows telemetry policy
- Button: "View Last Payload" (transparency - shows exact JSON sent)

**Data Management**:
- Button: "Export All Notes as Markdown" (future - v1.1)
- Button: "Delete All Data and Reset App" (confirmation modal, irreversible)

---

## Telemetry Policy (If User Opts In)

**Default**: OFF (must be explicitly enabled by user)

**What We Collect** (anonymous, no note content):
```json
{
  "app_version": "0.1.0",
  "os": "Windows 10 Pro",
  "os_version": "19044.1234",
  "feature_usage": {
    "quick_capture_opens": 45,
    "graph_view_opens": 12,
    "tasks_view_opens": 8,
    "search_queries": 67
  },
  "performance": {
    "cold_start_ms": 1850,
    "search_p95_ms": 132
  },
  "errors": [
    {
      "type": "DatabaseLockError",
      "message": "Database is locked",
      "stack": "...",
      "timestamp": "2025-11-15T14:30:00Z"
    }
  ]
}
```

**What We DON'T Collect**:
- ❌ Note titles, bodies, tags (any user content)
- ❌ File paths (may contain usernames)
- ❌ IP addresses
- ❌ Device serial numbers
- ❌ GPS location

**How It's Sent**:
- **Frequency**: Batched weekly (not real-time)
- **Protocol**: HTTPS POST to `telemetry.knowledgeflow.app` (hypothetical endpoint)
- **Opt-Out**: Instant (no data sent after unchecking)

**Transparency**:
- Button in Settings: "View Last Telemetry Payload" → Shows full JSON
- Open-source telemetry module → Code is auditable

---

## Backup & Export

### User-Initiated Backup (Future - v1.1)

**Export Options**:
1. **Markdown Archive**: Export all notes as `.md` files (decrypted)
2. **Database Dump**: Copy SQLite file (encrypted, can restore)
3. **JSON Export**: All data as JSON (for import to other tools)

**Encryption Warning**:
When exporting Markdown: "Exported files will NOT be encrypted. Store securely or encrypt with separate tool (e.g., VeraCrypt)."

### Automatic Backups (Future - v1.2)

**Optional Feature** (disabled by default):
- Daily backup of database to user-specified folder
- Keep last 7 backups (rotating)
- Warn: "Backups are encrypted with same key. If key is lost, backups are also unrecoverable."

---

## Compliance & Legal

**GDPR** (Europe):
- ✅ **Right to Access**: User can export all data
- ✅ **Right to Erasure**: User can delete all data
- ✅ **Data Portability**: Export as JSON or Markdown
- ✅ **Consent**: Telemetry is opt-in (explicit consent required)
- ✅ **Data Minimization**: Collect only what's necessary
- ✅ **Local Processing**: No data transfers to third parties

**CCPA** (California):
- ✅ **No Sale of Data**: Not applicable (no data collected unless telemetry enabled)
- ✅ **Disclosure**: Privacy policy clearly states what data is collected
- ✅ **Deletion**: User can delete all data

**Note**: Since app is local-only with no servers, most data protection regulations don't apply (no "data controller" or "data processor"). However, principles align with best practices.

---

## Security Audit & Penetration Testing

**Pre-Release** (before MVP launch):
- [ ] Manual code review: Focus on encryption, SQL queries, XSS vectors
- [ ] Dependency audit: `npm audit` and review of critical dependencies (libsodium, better-sqlite3)
- [ ] Static analysis: ESLint security rules, TypeScript strict mode
- [ ] Fuzzing: Test extractors and parsers with malformed input

**Post-Release** (continuous):
- [ ] Bug bounty program (future - if funding available)
- [ ] Responsible disclosure policy: security@knowledgeflow.app (hypothetical)
- [ ] Security advisories: GitHub Security Advisories for public disclosure

---

## Incident Response Plan

**If Security Vulnerability Discovered**:

1. **Triage** (Day 0):
   - Assess severity (Critical, High, Medium, Low)
   - Determine scope (affected versions, data at risk)

2. **Mitigation** (Day 0-1):
   - Develop patch
   - Test patch in staging environment
   - Prepare security advisory (disclose responsibly)

3. **Release** (Day 1-2):
   - Emergency patch release (version bump: e.g., 0.1.0 → 0.1.1)
   - Publish security advisory (GitHub, website, email to users if we have opt-in list)
   - Document incident post-mortem

4. **Communication** (Day 2+):
   - Notify affected users (if identifiable - only possible if telemetry enabled)
   - Update documentation
   - Improve processes to prevent recurrence

**Example Advisory**:
```
Security Advisory: SQL Injection in Search (CVE-2025-XXXXX)

Severity: High
Affected Versions: 0.1.0 - 0.1.5
Fixed In: 0.1.6

Description: A SQL injection vulnerability in the search feature could allow local attackers
to read arbitrary data from the database. Exploitation requires local access to the device.

Mitigation: Update to version 0.1.6 immediately.

Timeline:
- 2025-11-20: Vulnerability reported via security@knowledgeflow.app
- 2025-11-21: Patch developed and tested
- 2025-11-22: Version 0.1.6 released, advisory published
```

---

## User Education

### FAQ: "Is My Data Safe?"

**Q: How is my data encrypted?**
A: We use AES-256-GCM, the same encryption standard used by governments and banks. Your notes are encrypted before being saved to disk. Decryption keys are protected by Windows DPAPI or your passphrase.

**Q: Can you (the developers) read my notes?**
A: No. All data stays on your device. We have no servers, no accounts, no way to access your notes. Even if we wanted to (we don't), it's technically impossible.

**Q: What if I forget my passphrase?**
A: If you're using passphrase mode and forget your passphrase, your data is **permanently unrecoverable**. This is by design (we can't add a "backdoor" without compromising security). We strongly recommend using a password manager.

**Q: Is it safe to use cloud backup (OneDrive, Dropbox) with KnowledgeFlow?**
A: Your database is encrypted, so even if it syncs to the cloud, the content is protected. However, we recommend excluding the KnowledgeFlow folder from cloud backup for maximum privacy. Instructions: [Link to FAQ].

**Q: Can malware steal my notes?**
A: If your computer has malware with admin privileges, it could potentially read your notes (by logging keystrokes or dumping memory). This is true for any app, not just KnowledgeFlow. Best protection: Keep your OS updated, use antivirus, avoid suspicious downloads.

**Q: Is telemetry safe?**
A: Telemetry is OFF by default. If you enable it, we only collect anonymous usage stats and error logs (no note content). You can view exactly what's sent in Settings → Privacy → "View Last Payload."

---

## Open Source & Auditability

**Repository**: https://github.com/knowledgeflow/knowledgeflow (hypothetical)

**License**: MIT (open-source, auditable by anyone)

**Build Reproducibility**:
- Locked dependencies (`package-lock.json`)
- Deterministic build process (documented in CONTRIBUTING.md)
- Checksum verification (SHA256 hashes published with releases)

**Why Open Source Matters for Privacy**:
- **Transparency**: Anyone can audit code for backdoors or vulnerabilities
- **Trust**: "Don't trust, verify" - users can compile from source
- **Community Security**: More eyes on code = faster bug discovery

---

## Future Enhancements

### v1.5: Hardware Key Support (YubiKey)
- Use YubiKey or other FIDO2 devices for encryption key storage
- More secure than DPAPI or passphrase (key never leaves hardware)

### v2.0: Optional Encrypted Cloud Sync
- End-to-end encrypted sync (keys never sent to server)
- Zero-knowledge architecture (server cannot decrypt data)
- Users who value cross-device sync can opt-in without sacrificing privacy

### v3.0: Multi-User / Team Edition
- Encrypted collaboration (shared encryption keys via secure exchange)
- Access control (read-only vs. edit permissions)
- Audit logs (who accessed what, when)

---

## Conclusion

**KnowledgeFlow prioritizes privacy by design**:
- ✅ Offline-first (no network required)
- ✅ Local-only storage (no cloud, no servers)
- ✅ Encryption at rest (AES-256-GCM)
- ✅ User control (all features toggleable)
- ✅ Data minimization (collect only what's necessary)
- ✅ Open source (auditable by anyone)

**Residual Risks** (unavoidable):
- ⚠️ OS-level malware (outside app's control)
- ⚠️ Physical device theft (mitigated by encryption, but keys may be vulnerable if weak passphrase)
- ⚠️ User error (syncing to cloud, weak passphrase, etc.)

**User Responsibility**:
- Use strong passphrase (if not using DPAPI)
- Keep OS and antivirus updated
- Disable cloud backup for app folder (if maximum privacy desired)
- Backup database to secure location (external drive, not cloud)

---

**Last Reviewed**: 2025-10-31
**Next Review**: 2025-12-06 (post-MVP launch)
**Owner**: product-lead + security-lead (to be assigned)
