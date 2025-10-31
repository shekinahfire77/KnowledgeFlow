# Data Security Protocol

Version: 0.1
Owner: research-lead
Status: Draft
Last updated: 2025-10-31

---

## 1. Storage Requirements

### Local Storage (NOT Committed to Repo)

**What must stay local:**
- Raw recordings (audio/video files)
- Participant PII (names, emails, phone numbers)
- Consent records with real names
- Screener export with email addresses

**Storage location:** Encrypted folder on research lead's computer

**Encryption standard:** AES-256

**Tools:**
- Windows: BitLocker (built-in)
- Cross-platform alternative: VeraCrypt (open-source)

**Backup:**
- Encrypted external drive (USB or external SSD)
- NOT cloud storage (Dropbox, Google Drive, OneDrive)
- Backup frequency: After each interview
- Backup retention: Same as primary storage

**Access control:**
- Password-protected encryption key
- Minimum 16 characters, mix of letters/numbers/symbols
- Password stored in password manager only (not written down)
- No shared access (research-lead only)

---

### Repository (Committed Files)

**What can be committed:**
- Anonymized interview notes (P### aliases only)
- Anonymized transcripts or transcript summaries
- Coded excerpts with redacted quotes
- Aggregate CSV files (using P### only)
- Charts and visualizations (no PII)
- Documentation and process files

**Pseudonymization requirement:**
- All participants referenced as P001, P002, ... P010
- No real names anywhere in committed files
- No email addresses
- No phone numbers
- No specific company names (if identifiable)

---

## 2. Access Control

### Who Has Access to What

| Data Type | Research Lead | Other Team Members | Public (if repo public) |
|-----------|---------------|-------------------|------------------------|
| Raw recordings | Full access | No access | No access |
| PII mapping (name ↔ P###) | Full access | No access | No access |
| Anonymized transcripts | Full access | Read-only | Read-only |
| Interview notes (anonymized) | Full access | Read-only | Read-only |
| Coded excerpts | Full access | Read-only | Read-only |
| Aggregate data (CSVs) | Full access | Read-only | Read-only |
| Analysis reports | Full access | Read-only | Read-only |

### Access Control Mechanisms

**Local encrypted files:**
- Encryption password known only to research-lead
- No sharing of encrypted files via email or cloud
- Physical security: Lock computer when away from desk

**Repository:**
- If private repo: Team members added as collaborators (read-only)
- If public repo: No additional access control needed (all data anonymized)
- Branch protection: Main branch requires review before merge

**Email:**
- Do not attach recordings or PII files to emails
- Use secure file transfer if must share with supervisor (password-protected zip + password via separate channel)

---

## 3. Redaction Rules

Before committing ANY file to the repository, apply these redaction rules:

### Personal Identifiers

**Names:**
- Participant names → Replace with P### alias
- Example: "John Smith said..." → "P003 said..."

**Email addresses:**
- Remove entirely or replace with "[email redacted]"
- Example: john.smith@example.com → [email redacted]

**Phone numbers:**
- Remove entirely
- Not typically collected, but if mentioned in interview: "[phone redacted]"

**Company names (if identifiable):**
- Replace with generic descriptor: "[Company A]", "[Research firm]", "[Tech startup]"
- Keep if very large/public company and not sensitive: "Microsoft", "Google" OK
- Redact if small company that could identify participant: "Acme Consulting" → "[Consulting firm]"

**Project names:**
- Replace specific project names with generic: "[Project X]", "[Client project]"
- Example: "The Falcon redesign project" → "[Product redesign project]"

### Location and Context

**Geographic details:**
- Country: OK to keep ("United States", "Canada")
- State/Province: OK to keep ("California", "Ontario")
- City: Redact if <500K population → "[Mid-size city]" or "[Major metro area]"
- Specific addresses: Always redact → "[Participant's workplace]"

**Dates and events:**
- Years: OK to keep ("I started grad school in 2022")
- Specific dates: Generalize if identifiable ("My thesis defense on March 15" → "My thesis defense")
- Unique events: Generalize ("After the 2024 merger" → "After a company merger")

### Quotes and Excerpts

**Review every quote for:**
- Unusual technical terms that might identify company/project
- Combination of details that could be unique (role + company + project)
- Names of colleagues or clients → Replace with "[Colleague]", "[Client]"

**Example original quote:**
> "Last month I was working on the Falcon project for Acme Corp, and my manager Sarah asked me to synthesize 50 pages of market research from our New York office."

**Redacted version:**
> "Last month I was working on a [client project], and my [manager] asked me to synthesize 50 pages of market research."

---

## 4. Filename Conventions

### Interview Materials

**Interview notes:**
- Format: `/data/interview-notes/P###.md`
- Example: `/data/interview-notes/P001.md`

**Transcripts:**
- Format: `/data/transcripts/P###.md`
- Example: `/data/transcripts/P005.md`

**Transcript summaries:**
- Use same filename as transcript
- Or add suffix: `/data/transcripts/P###-summary.md`

### Raw Recordings (Local Only)

**Format:** `YYYY-MM-DD_P###_interview.[ext]`
**Examples:**
- `2025-11-06_P001_interview.mp4`
- `2025-11-07_P003_interview.mp3`

**Location:** `/local-encrypted/recordings/` (NOT in repo)

### PII Files (Local Only)

**PII mapping file:**
- `respondents-pii.csv` (local only)
- Contains: respondent_id, name, email, alias_id

**Consent records:**
- Format: `P###-consent-YYYY-MM-DD.txt`
- Location: `/local-encrypted/consent-records/` (NOT in repo)

---

## 5. Data Retention Schedule

| Data Type | Location | Retention Period | Deletion Method |
|-----------|----------|------------------|-----------------|
| Raw audio/video recordings | Local encrypted folder | 90 days after interview | Secure delete (overwrite) |
| PII mapping (name ↔ P###) | Local encrypted file | 1 year after study completion | Secure delete |
| Consent records | Local encrypted folder | 1 year after study completion | Secure delete |
| Anonymized transcripts | Repo | Indefinite (research record) | N/A |
| Interview notes | Repo | Indefinite (research record) | N/A |
| Coded excerpts | Repo | Indefinite (research record) | N/A |
| Aggregate data (CSVs) | Repo | Indefinite (research record) | N/A |

### Deletion Schedule

**90-day deletion (Recordings):**
- Interview date: Nov 6-11, 2025
- Deletion date: Feb 4-9, 2026
- Method: Secure delete using `sdelete` (Windows) or `shred` (Linux)

**1-year deletion (PII):**
- Study completion: Nov 14, 2025
- Deletion date: Nov 14, 2026
- Method: Secure delete + log in deletion-log.md

### Deletion Log

**File:** `/data/deletion-log.md`

**Format:**
```markdown
# Data Deletion Log

## 2026-02-04: Raw Recordings (90-day retention expired)
- Deleted: P001-P010 interview recordings
- Method: Secure delete (sdelete -p 3)
- Verified by: research-lead
- Files deleted: 10 .mp4 files, total 2.3 GB

## 2026-11-14: PII Mapping (1-year retention expired)
- Deleted: respondents-pii.csv
- Deleted: Consent records (P001-P010)
- Method: Secure delete
- Verified by: research-lead
```

---

## 6. Incident Response

### If PII is Accidentally Committed to Repo

**Immediate actions (within 1 hour):**

1. **Stop work, do not commit further changes**
2. **Assess severity:**
   - What PII was exposed? (Names, emails, recordings, etc.)
   - Is the repo public or private?
   - Has it been pushed to remote?

3. **If NOT pushed to remote yet:**
   - Delete the file: `git rm <file>`
   - Amend the commit: `git commit --amend`
   - Verify PII removed: `git show HEAD`

4. **If pushed to remote (public or private):**
   - Use `git filter-branch` or BFG Repo-Cleaner to remove from history
   - Force-push cleaned history: `git push --force`
   - Notify all team members to re-clone the repo
   - Document incident (see below)

**BFG Repo-Cleaner example:**
```bash
# Download BFG from https://rtyley.github.io/bfg-repo-cleaner/
java -jar bfg.jar --delete-files respondents-pii.csv
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

5. **Notify affected participants (if material breach):**
   - Within 24 hours if email addresses or identifiable data exposed
   - Use email template below

**Notification email template:**
```
Subject: Data Security Notification

Hi [Name],

I'm writing to inform you of a data security incident related to our recent research study.

**What happened:**
On [Date], your [email address / name] was briefly included in a file that was committed to our research repository. This was a human error during data processing.

**What we did:**
We immediately removed the file and expunged it from the repository history within [X hours]. As of [Date/Time], no copies of your personal information remain in the repository.

**Impact:**
[If private repo:] The repository is private and accessible only to our research team. There is no evidence that your information was accessed by anyone outside the team.

[If public repo:] The repository is public. While we removed the file quickly, we cannot rule out that it was accessed during the [X hours] it was exposed.

**What you can do:**
If you would like us to delete all data from your interview, please reply to this email and we will do so immediately. Your incentive payment will not be affected.

I sincerely apologize for this error. We have implemented additional safeguards to prevent this in the future.

If you have any questions or concerns, please contact me directly at [email] or [phone].

Best,
[Researcher Name]
Research Lead, KnowledgeFlow
```

6. **Document the incident:**

**File:** `/docs/24-learnings-and-changes.md`

**Section to add:**
```markdown
## Data Security Incident: [Date]

**What happened:**
[Description of PII exposure]

**Root cause:**
[Why it happened - e.g., "Forgot to redact email column before committing screener-responses.csv"]

**Impact:**
[Who was affected, how long exposed, repo visibility]

**Remediation:**
[What we did to fix it - e.g., "Used BFG to remove file from history, force-pushed clean history"]

**Prevention:**
[What we changed to prevent recurrence - e.g., "Added pre-commit hook to check for email patterns"]

**Notification:**
[Whether participants were notified]

**Date resolved:** [Date]
**Verified by:** research-lead
```

---

## 7. Compliance Checklist

### Before Every Commit

Run this checklist manually before `git commit`:

- [ ] **No real names** in committed files (only P### aliases)
- [ ] **No email addresses** in committed files
- [ ] **No phone numbers** in committed files
- [ ] **All participant references use P###** format
- [ ] **Quotes reviewed** for identifying details (company names, projects, colleagues)
- [ ] **File paths use P### naming** (e.g., `/data/interview-notes/P001.md`)
- [ ] **Raw recordings remain in local encrypted folder only** (not staged for commit)
- [ ] **PII files (respondents-pii.csv, consent records) not staged**

**Command to check staged files:**
```bash
git diff --cached --name-only
```

**Command to search for potential PII in staged files:**
```bash
# Check for email patterns
git diff --cached | grep -E "\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"

# Check for "name:" or "email:" fields
git diff --cached | grep -i "name:\|email:"
```

**If any PII found:**
- Unstage the file: `git reset HEAD <file>`
- Redact the PII
- Re-add the clean file: `git add <file>`

---

### Weekly Compliance Review

Every Friday (or after 2+ interviews), review:

- [ ] All interview notes committed use P### format
- [ ] All transcripts committed use P### format
- [ ] CSV files contain no email or name columns
- [ ] Local encrypted folder backed up to external drive
- [ ] Incentives sent to all completed interviews (within 48 hours)

---

### Pre-Release QA (Before Stage 2 Tag)

Before tagging `stage2-v1.0-validation-complete`:

- [ ] Run full PII search across repo:
  ```bash
  git grep -i "name:"
  git grep -E "\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"
  git grep -i "phone:"
  ```
- [ ] Manually review all `/data/` files
- [ ] Manually review all quotes in analysis report
- [ ] Verify deletion log updated (if 90 days elapsed)
- [ ] Verify all 10 interview notes exist and are anonymized
- [ ] Verify no recordings in `/data/` directories

---

## 8. Tools and Automation

### Recommended Tools

**Encryption:**
- Windows: BitLocker (built-in, requires Pro edition)
- Cross-platform: VeraCrypt (open-source, free)

**Secure deletion:**
- Windows: `sdelete` (Sysinternals)
- Linux/Mac: `shred` (built-in)

**PII detection (manual):**
- `git grep` for email patterns
- Text editor regex search before commit

**Repository cleanup (if PII committed):**
- BFG Repo-Cleaner: https://rtyley.github.io/bfg-repo-cleaner/
- Faster and safer than `git filter-branch`

### Optional: Pre-Commit Hook

Create `.git/hooks/pre-commit` to automatically check for PII:

```bash
#!/bin/bash

# Check for email addresses in staged files
if git diff --cached | grep -qE "\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"; then
    echo "ERROR: Email address detected in staged files!"
    echo "Please redact PII before committing."
    exit 1
fi

# Check for common PII fields
if git diff --cached | grep -qiE "real_name:|participant_name:|email:"; then
    echo "ERROR: Potential PII field detected!"
    echo "Please use P### aliases only."
    exit 1
fi

exit 0
```

**Installation:**
1. Save above script to `.git/hooks/pre-commit`
2. Make executable: `chmod +x .git/hooks/pre-commit`
3. Test: Try to commit a file with an email address

**Note:** Hooks are local only and not committed to repo. Each team member must install separately.

---

## 9. Training and Awareness

### For Research Lead (Before Stage 2)

**Required reading:**
- This data security protocol (entire document)
- GDPR basics (if applicable)
- CCPA basics (if applicable)

**Hands-on practice:**
1. Set up encrypted folder
2. Practice redaction on sample interview notes
3. Test PII detection commands
4. Practice incident response (simulate accidental commit)

### For Team Members (If Any)

**Before accessing repo:**
- Read "Access Control" and "Redaction Rules" sections
- Understand P### aliases
- Know not to share externally

**Ongoing:**
- Report any suspected PII in repo immediately
- Do not commit to main branch (if write access)

---

## 10. Periodic Audits

### Monthly Audit (During Active Research)

**Checklist:**
- [ ] Review last 10 commits for PII
- [ ] Verify local encrypted folder still encrypted
- [ ] Verify backup still accessible and encrypted
- [ ] Check deletion-log.md for upcoming deletions
- [ ] Verify all incentives sent (no pending >48 hours)

**Log results in:** Internal notes (not committed)

---

## 11. Decommissioning (After Study Ends)

When Stage 2 is complete and all retention periods expired:

**After 90 days (Recordings deleted):**
- [ ] Securely delete all recordings
- [ ] Log in deletion-log.md
- [ ] Verify deletion (recordings folder empty)

**After 1 year (PII deleted):**
- [ ] Securely delete PII mapping file (respondents-pii.csv)
- [ ] Securely delete consent records
- [ ] Log in deletion-log.md
- [ ] Verify deletion
- [ ] Commit updated deletion-log.md to repo

**Anonymized data retained indefinitely:**
- Interview notes (P### aliases)
- Transcripts (P### aliases)
- Coded excerpts
- Aggregate CSVs
- Analysis reports

---

**Data Security Protocol Approved:**
- Owner: research-lead
- Date: 2025-10-31
- Review frequency: Before each stage
- Next review: Before Stage 3 (if GO decision)
