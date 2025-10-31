# Updated Research Plan: Stage 2

Version: 0.1
Owner: research-lead
Status: Draft
Last updated: 2025-10-31

---

## 1. Research Methods

### Primary Method: Semi-Structured Interviews

**Format:** 1-on-1 video interviews (Zoom or similar)
**Duration:** 35-40 minutes per participant
**Sample Size:** N = 10 participants
**Recording:** Audio/video with participant consent

### Secondary Method: Screener Survey

**Format:** Online survey (Google Forms or Typeform)
**Duration:** 3-5 minutes to complete
**Sample Size:** N ≥ 40 qualified responses
**Purpose:** Recruitment filter and quota management

### Rationale for Mixed Methods

The screener survey provides quantitative breadth to identify qualified participants across target segments. Interviews provide qualitative depth to understand pain points, workflows, switching triggers, and willingness to pay. This combination allows us to validate hypotheses both numerically (thresholds) and contextually (themes).

---

## 2. Recruitment Channels

### Online Communities

**Reddit:**
- r/productivity (500K+ members)
- r/Obsidian (90K+ members)
- r/NoteTaking (40K+ members)
- r/GradSchool (200K+ members)

**Discord:**
- Personal Knowledge Management (PKM) servers
- Obsidian community server
- Productivity tool communities

**LinkedIn:**
- Knowledge management groups
- Research and consulting groups
- Freelance professional networks

**Twitter/X:**
- Hashtags: #productivity, #PKM, #notetaking, #obsidian, #notion
- Direct outreach to productivity influencers for retweets

### Academic Channels

**University Mailing Lists:**
- Graduate student listservs (for Gia segment)
- Faculty research networks
- Academic library user groups

### Incentive

**Amount:** $25 USD per completed interview
**Delivery Method:** Amazon.com gift card sent via email
**Timing:** Within 48 hours of interview completion
**Conditions:** Must complete full 35-minute interview (partial credit not available)

**Budget:**
- 10 interviews × $25 = $250
- 3 no-shows backup × $25 = $75
- 3 pilot/extra interviews × $25 = $75
- **Total Budget:** $400

---

## 3. Timeline (14 Days: November 1-14, 2025)

### Day-by-Day Schedule

**Day 1 (Friday, November 1, 2025)**
- Launch screener survey on all channels
- Post recruitment messages to Reddit, LinkedIn, Twitter
- Send outreach emails to university contacts
- Monitor initial response rate
- Target: 10-15 responses by end of day

**Day 2 (Saturday, November 2, 2025)**
- Monitor screener responses
- Respond to questions from potential participants
- Check quota balance across segments
- Target: 20-25 cumulative responses

**Day 3 (Sunday, November 3, 2025)**
- Send reminder posts to communities with low response
- Monitor for quota gaps (especially Gia segment)
- Adjust recruitment messaging if needed
- Target: 35-40 cumulative responses

**Day 4 (Monday, November 4, 2025)**
- Close screener survey (end of day)
- Export raw data to /data/raw/screener-export-2025-11-04.csv
- Apply qualification logic (Windows, pain ≥6, attention check)
- Create cleaned /data/screener-responses.csv
- Select 10-12 participants (10 primary + 2 backup)
- Check quota distribution (Rachel 3, Finn 3, Gia 2, Other 2)
- Populate /data/respondents-master.csv with P### aliases

**Day 5 (Tuesday, November 5, 2025)**
- Send interview invitations to selected participants
- Provide 3-5 time slot options per person
- Confirm time zones
- Send calendar invites with Zoom links and consent forms
- Update /data/interview-schedule.csv
- Prepare interview materials (guide, recording setup, notes template)

**Day 6 (Wednesday, November 6, 2025)**
- Conduct interviews: P001, P002
- Complete interview notes immediately after each session
- Send thank-you emails and incentives
- Save recordings to local encrypted folder
- Update interview-schedule.csv

**Day 7 (Thursday, November 7, 2025)**
- Conduct interviews: P003, P004
- Same post-interview protocol
- Begin reviewing notes for emerging themes

**Day 8 (Friday, November 8, 2025)**
- Conduct interview: P005
- Mid-point review: Check quota balance and theme saturation
- Adjust remaining interview focus if needed

**Day 9 (Saturday, November 9, 2025)**
- Conduct interviews: P006, P007
- Weekend availability for working professionals

**Day 10 (Sunday, November 10, 2025)**
- Conduct interview: P008
- Review all notes to date

**Day 11 (Monday, November 11, 2025)**
- Conduct interviews: P009, P010
- All interviews complete
- Begin transcription (if recorded)
- Create transcript summaries

**Day 12 (Tuesday, November 12, 2025)**
- Complete all transcription and summarization
- Develop codebook (/docs/19-codebook.md)
- Export coding schema to /data/coding-schema.csv
- Begin coding all 10 interviews
- Populate coded-excerpts.csv, pain-severity-scores.csv, wtp-estimates.csv
- Complete all coding by end of day

**Day 13 (Wednesday, November 13, 2025)**
- Conduct affinity mapping (cluster themes)
- Document in /docs/20-affinity-map-notes.md
- Compute quantitative metrics vs thresholds
- Create charts (pain distribution, WTP, privacy, switching intent)
- Save to /data/artifacts/
- Update /docs/22-validation-dashboard.md
- Update personas and value proposition
- Write /docs/21-analysis-report.md
- Update /data/risks-updates.csv

**Day 14 (Thursday, November 14, 2025)**
- Evaluate thresholds (pass/fail)
- Apply decision rule (Go/Hold/Pivot)
- Write /docs/23-decision-memo.md
- Run QA checklist (/process/qa-checklist-stage2.md)
- Verify no PII committed to repo
- Update README.md
- Git tag: stage2-v1.0-validation-complete
- Final review and sign-off

---

## 4. Roles and Responsibilities

| Role | Responsibilities | Owner |
|------|-----------------|-------|
| **Research Lead** | Overall coordination, decision-making, final sign-off | research-lead |
| **Screener Administrator** | Survey deployment, monitoring, data export | research-lead |
| **Interview Scheduler** | Calendar coordination, reminders, rescheduling | research-lead |
| **Interviewer** | Conducting all 10 interviews, obtaining consent | research-lead |
| **Data Analyst** | Coding, analysis, dashboard creation | research-lead |
| **QA Reviewer** | Compliance check, PII verification | research-lead |

**Note:** In this stage, research-lead performs all roles. In future stages with larger teams, these responsibilities may be distributed.

---

## 5. Tools

| Function | Tool | Notes |
|----------|------|-------|
| **Screener Survey** | Google Forms or Typeform | Free tier sufficient, export to CSV |
| **Scheduling** | Google Calendar or Calendly | Time zone handling critical |
| **Video Calls** | Zoom | Recording requires participant consent |
| **Recording (backup)** | OBS Studio | Local recording if Zoom fails |
| **Transcription** | Otter.ai or manual | Manual preferred for accuracy with technical terms |
| **Data Analysis** | Excel or Google Sheets | Pivot tables, basic charts |
| **Coding** | Spreadsheet + manual tagging | /data/coded-excerpts.csv |
| **Affinity Mapping** | Markdown or Miro/Mural | Digital sticky notes if collaborative |
| **Charts** | Excel, Google Sheets, or Python/matplotlib | Simple bar and histogram charts |
| **Version Control** | Git | All files except PII |

---

## 6. Data Flow Diagram

```
┌─────────────────────┐
│  Screener Survey    │
│  (Google Forms)     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│  Raw Export                             │
│  /data/raw/screener-export-YYYY-MM-DD.csv│
└──────────┬──────────────────────────────┘
           │
           ▼ Apply qualification logic
           │ (Windows, pain ≥6, attention check)
┌──────────────────────────┐
│  Screener Responses      │
│  /data/screener-responses.csv │
└──────────┬───────────────┘
           │
           ▼ Select participants (N=10)
┌──────────────────────────┐
│  Respondent Master List  │
│  /data/respondents-master.csv │
│  (PII version local only)│
└──────────┬───────────────┘
           │
           ▼ Schedule interviews
┌──────────────────────────┐
│  Interview Schedule      │
│  /data/interview-schedule.csv │
└──────────┬───────────────┘
           │
           ▼ Conduct interview
┌──────────────────────────┐
│  Consent Obtained        │
│  (verbal, recorded)      │
└──────────┬───────────────┘
           │
           ▼ Interview session (35-40 min)
┌──────────────────────────┐
│  Recording + Notes       │
│  Local: recording.mp4    │
│  Repo: /data/interview-notes/P###.md │
└──────────┬───────────────┘
           │
           ▼ Transcribe (if recorded)
┌──────────────────────────┐
│  Transcript              │
│  /data/transcripts/P###.md │
└──────────┬───────────────┘
           │
           ▼ Summarize
┌──────────────────────────┐
│  Transcript Summary      │
│  (using template)        │
└──────────┬───────────────┘
           │
           ▼ Develop codes
┌──────────────────────────┐
│  Codebook                │
│  /docs/19-codebook.md    │
│  /data/coding-schema.csv │
└──────────┬───────────────┘
           │
           ▼ Apply codes to excerpts
┌──────────────────────────────────┐
│  Coded Data (CSVs)               │
│  • coded-excerpts.csv            │
│  • pain-severity-scores.csv      │
│  • wtp-estimates.csv             │
│  • segment-tags.csv              │
└──────────┬───────────────────────┘
           │
           ▼ Analyze
┌──────────────────────────┐
│  Analysis Outputs        │
│  • Affinity map          │
│  • Threshold calculations│
│  • Charts (artifacts/)   │
│  • Dashboard             │
│  • Analysis report       │
└──────────┬───────────────┘
           │
           ▼ Decide
┌──────────────────────────┐
│  Decision Memo           │
│  /docs/23-decision-memo.md│
│  (GO / HOLD / PIVOT)     │
└──────────────────────────┘
```

---

## 7. Data Security and Privacy

**Principle:** Minimize PII collection and exposure. Pseudonymize early and consistently.

### Storage Rules

**Local Only (NOT in repo):**
- Raw recordings (audio/video)
- Participant names and emails (PII spreadsheet)
- Screener raw export with email addresses

**Repository (Committed):**
- Anonymized interview notes (P### aliases)
- Anonymized transcripts
- Coded excerpts with quotes (redacted for identifying details)
- Aggregate data (CSV files with P### only)

### Encryption

**Local PII files:**
- Store in encrypted folder (Windows BitLocker or VeraCrypt)
- Password-protected with AES-256
- Backup to encrypted external drive (NOT cloud)

### Redaction Rules

Before committing any file:
- Replace participant names → P### alias
- Remove email addresses
- Remove phone numbers
- Generalize company names → "[Company A]" or industry
- Generalize project names → "[Project X]"
- Generalize geographic details → "[Major metro area]" or country only

### Retention Schedule

| Data Type | Location | Retention |
|-----------|----------|-----------|
| Raw recordings | Local encrypted | 90 days, then delete |
| PII mapping (name ↔ P###) | Local encrypted | 1 year, then delete |
| Anonymized transcripts | Repo | Indefinite |
| Interview notes | Repo | Indefinite |
| Coded excerpts | Repo | Indefinite |
| Aggregate CSVs | Repo | Indefinite |

**Deletion Log:** Maintain in /data/deletion-log.md

---

## 8. Quality Assurance

### Interview Quality Checks

**During recruitment:**
- Attention-check question in screener to filter bots/speeders
- Quota monitoring to ensure segment balance
- Backup participants (N=12 recruited for N=10 target)

**During interviews:**
- Audio check at start of each session
- Notes taken in real-time (backup if recording fails)
- Follow interview guide but allow flexibility for depth
- Aim for 35-40 minutes (minimum 30, maximum 45)

**After interviews:**
- Inter-coder reliability: Re-code 2 interviews after 48 hours
- Target: >80% agreement on primary codes
- Review for anonymization before commit
- Verify incentive sent within 48 hours

### Data Quality Checks

**Screener data:**
- Remove responses <90 seconds (speeders)
- Check attention-check question pass rate
- Verify Windows qualification (text field review)
- Ensure pain severity ≥6 for all selected participants

**Interview data:**
- All 10 participants must complete ≥30 minutes
- All must answer WTP question (even if "wouldn't pay")
- All must provide at least one pain story
- Segment classification reviewable by second coder

---

## 9. Contingency Plans

### If Screener Response <40 Qualified

**Action:**
- Extend recruitment by 3 days (to Nov 7)
- Increase incentive visibility in posts
- Expand to additional subreddits or communities
- Lower pain threshold to ≥5/10 if necessary (document in learnings)

### If Quota Imbalance (e.g., no Gia candidates)

**Action:**
- Targeted outreach to universities and academic forums
- Extend recruitment window for that segment only
- If still insufficient, proceed with "Other" segment and note limitation
- Do NOT proceed if <8 total interviews

### If Participant No-Shows

**Action:**
- Attempt one reschedule (same participant)
- If no response within 24 hours, move to backup participant
- Document in interview-schedule.csv
- If >3 no-shows, extend timeline by 2 days

### If Recording Fails

**Action:**
- Rely on detailed real-time notes
- Offer participant option to re-interview if critical gap
- Document limitation in analysis report
- Increase note-taking detail for remaining interviews

### If Thresholds Mixed (3-4 of 6 met)

**Action:**
- Conduct +3 interviews in highest-potential segment (Rachel or Finn)
- Extend timeline by 3-5 days
- Recompute thresholds with larger N
- Document decision in decision memo and learnings

---

## 10. Ethical Considerations

### Informed Consent

- Verbal consent obtained and recorded at start of each interview
- Participants informed of: purpose, duration, recording, anonymization, withdrawal rights
- Consent script: /docs/17-consent-script.md
- Right to skip questions or stop interview at any time

### Anonymization

- All participants assigned P### alias before any analysis
- Quotes reviewed for identifying details before inclusion in reports
- No attribution beyond segment (Rachel/Finn/Gia)

### Incentive Fairness

- $25 for 40 minutes = ~$37.50/hour (above minimum wage)
- Paid regardless of answers or segment fit
- No payment contingent on "good" responses

### Data Subject Rights (GDPR/CCPA Compliance)

- Participants can request data deletion within 14 days
- Participants can request transcript summary
- Data controller and contact info provided in consent form
- Retention schedule disclosed upfront

---

**Research Plan Approved:**
- Owner: research-lead
- Date: 2025-10-31
- Version: 0.1
