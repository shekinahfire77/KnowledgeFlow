# Stage 2 Execution Workflow

**Phase:** Problem Validation & User Research
**Duration:** 14 days (Nov 1-14, 2025)
**Owner:** research-lead
**Version:** 1.0
**Last Updated:** 2025-10-31

---

## Overview

This workflow defines the step-by-step execution process for Stage 2. Follow this sequence to ensure systematic completion of all research activities.

---

## Execution Sequence

### Phase 1: Instrument Finalization (Day 0 - Oct 31)

**Tasks:**
1. ✅ Review screener survey from Stage 1 (/docs/10-screener-survey.md)
2. ✅ Finalize interview guide (/docs/09-interview-guide.md)
3. ✅ Finalize consent script (/docs/17-consent-script.md)
4. ⬜ Set up survey tool (Google Forms or Typeform)
5. ⬜ Set up scheduling tool (Calendly or Google Calendar)
6. ⬜ Create recruitment post templates (see /docs/16-recruitment-plan.md)
7. ⬜ Prepare incentive delivery system (Amazon gift card purchase/setup)

**Deliverables:**
- Live screener survey URL
- Interview guide accessible (printed or digital)
- Consent script ready to read
- Recruitment posts drafted and ready to post

**Git Tag:** `stage2-v0.1-instruments-ready`

---

### Phase 2: Screener Launch & Recruitment (Days 1-4 - Nov 1-4)

#### Day 1 (Friday, November 1, 2025)

**Morning (9am-12pm):**
- [ ] Launch screener survey
- [ ] Post to Reddit:
  - [ ] r/productivity
  - [ ] r/Obsidian
  - [ ] r/NoteTaking
  - [ ] r/GradSchool
- [ ] Post to LinkedIn groups (knowledge management, research)
- [ ] Tweet/post on Twitter/X with hashtags

**Afternoon (1pm-5pm):**
- [ ] Share to Discord communities (PKM, Obsidian, Notion servers)
- [ ] Email university contacts for Gia segment
- [ ] Monitor initial responses (check every 2 hours)
- [ ] Respond to questions from potential participants

**End of Day:**
- [ ] Count: Target 10-15 responses
- [ ] Check quota balance (Rachel, Finn, Gia, Other)
- [ ] Document channels with best response in /docs/24-learnings-and-changes.md

---

#### Day 2-3 (Weekend, November 2-3, 2025)

**Daily tasks:**
- [ ] Monitor screener responses (check 3x per day minimum)
- [ ] Respond to participant questions
- [ ] Check response quality (attention check pass rate)
- [ ] Review quota balance

**If <20 qualified responses by end of Day 2:**
- [ ] Send reminder posts to communities with low response
- [ ] Expand to additional subreddits or groups
- [ ] Adjust recruitment messaging if needed

**Target:**
- Day 2 end: 20-25 cumulative qualified responses
- Day 3 end: 35-40 cumulative qualified responses

---

#### Day 4 (Monday, November 4, 2025)

**Morning:**
- [ ] Close screener survey (9am)
- [ ] Export responses to /data/raw/screener-export-2025-11-04.csv
- [ ] Review in spreadsheet, note total responses

**Afternoon:**
- [ ] Apply qualification logic:
  - [ ] Remove attention-check failures
  - [ ] Remove speeders (<90 seconds)
  - [ ] Remove duplicates (same email/IP)
  - [ ] Filter: Windows primary, ≥2 tools, pain ≥6/10
- [ ] Create /data/screener-responses.csv (cleaned)
- [ ] Assign segment buckets (Rachel/Finn/Gia/Other) based on role
- [ ] Select 10-12 participants ensuring quota balance:
  - Rachel: 3
  - Finn: 3
  - Gia: 2
  - Other: 2
  - Backups: +2
- [ ] Populate /data/respondents-master.csv with P### aliases
- [ ] Quality check: Verify quotas met or achievable

**Quality Gates:**
- ✅ N ≥ 40 qualified responses
- ✅ Quota balance achievable (all segments have candidates)
- ✅ Attention-check failures removed
- ✅ No PII in files committed to repo

---

### Phase 3: Scheduling (Day 5 - Nov 5)

**Tasks:**
- [ ] Send interview invitations to 10-12 selected participants
- [ ] Email template: See /docs/16-recruitment-plan.md
- [ ] Provide 3-5 time slot options per participant (from their availability)
- [ ] Use P### aliases in all communications (never real names in repo files)
- [ ] Confirm time zones (critical for remote interviews)
- [ ] Send calendar invites with:
  - [ ] Zoom/video link
  - [ ] Consent form link or attachment
  - [ ] Estimated duration (40 minutes)
  - [ ] Contact email for questions
- [ ] Update /data/interview-schedule.csv with confirmed slots
- [ ] Prepare interview materials:
  - [ ] Interview guide accessible
  - [ ] Notes template open (for each interview)
  - [ ] Recording software tested (Zoom or OBS)
  - [ ] Consent script printed/ready

**Contingency:**
- If <10 confirmations by end of day → Reach out to backups
- If quota imbalance (e.g., 0 Gia) → Prioritize under-represented segment outreach

**Quality Gate:**
- ✅ 10 confirmed interview slots
- ✅ Calendar invites sent with consent forms
- ✅ All participants confirmed time zone
- ✅ Recording equipment tested

---

### Phase 4: Interviews (Days 6-11 - Nov 6-11)

**Pre-Interview Checklist** (Run before each interview):
- [ ] Review participant info (segment, screener responses)
- [ ] Have interview guide open
- [ ] Have notes template open (/templates/interview-notes-template.md)
- [ ] Test recording software (audio/video check)
- [ ] Have consent script visible
- [ ] Close distracting apps/notifications

---

#### During Interview (35-40 min per participant)

**Section 1: Consent (2 min)**
- [ ] Read consent script verbatim
- [ ] Get clear verbal "yes" to participate
- [ ] Get clear verbal "yes" or "no" to recording
- [ ] If recording: Start recording and get on-record consent

**Section 2: Warm-up (5 min)**
- [ ] Brief introductions
- [ ] Explain interview structure
- [ ] Set expectations (no right/wrong answers)

**Section 3: Last-Time Narrative (10 min)** ← Most important
- [ ] Prompt: "Tell me about the last time you took notes for [work/research/project]"
- [ ] Follow-up probes: "What happened next?" "How did you feel?" "What tools did you use?"
- [ ] Capture verbatim quotes as much as possible

**Section 4: Current Tools and Workflow (8 min)**
- [ ] Ask about all tools used
- [ ] Ask about why multiple tools vs. one
- [ ] Ask about context-switching frequency
- [ ] Ask about how they link information across tools

**Section 5: Pain Points (8 min)**
- [ ] Ask: "On a scale of 1-10, how painful is your current setup?"
- [ ] Ask about most frustrating aspect
- [ ] Ask about privacy concerns (H2 validation)
- [ ] Ask about offline needs (H5 validation)
- [ ] Ask about discovering connections (H4 validation)

**Section 6: Ideal Solution (5 min)**
- [ ] Ask: "If you could wave a magic wand, what would the perfect tool do?"
- [ ] Ask about must-have vs. nice-to-have features
- [ ] Ask about dealbreakers

**Section 7: Value and WTP (3 min)**
- [ ] Present concept card (see /docs/15-instrument-pack.md)
- [ ] Ask: "What would you pay per month for this?"
- [ ] Ask: "What price would feel too expensive?"
- [ ] Ask: "Which feature is most valuable?"

**Section 8: Closing (1 min)**
- [ ] Ask: "Anything else I should know about your workflow?"
- [ ] Ask: "Would you be interested in beta testing?"
- [ ] Thank participant, confirm incentive delivery

---

**Post-Interview Checklist** (Immediately after):
- [ ] Stop recording
- [ ] Complete interview notes using template
- [ ] Save notes as /data/interview-notes/P###.md
- [ ] If recorded: Save recording to local encrypted folder (NOT repo)
- [ ] Anonymize notes before saving (P### only, no real names)
- [ ] Send thank-you email
- [ ] Send $25 Amazon gift card within 48 hours
- [ ] Use incentive receipt template
- [ ] Update /data/interview-schedule.csv (attended_yn = yes, recorded_yn)
- [ ] Update /data/respondents-master.csv (incentive_status = sent)

---

#### Target Interview Schedule

**Nov 6 (Wed):**
- [ ] Interview P001 [Time]
- [ ] Interview P002 [Time]

**Nov 7 (Thu):**
- [ ] Interview P003 [Time]
- [ ] Interview P004 [Time]

**Nov 8 (Fri):**
- [ ] Interview P005 [Time]

**Nov 9 (Sat):**
- [ ] Interview P006 [Time]
- [ ] Interview P007 [Time]

**Nov 10 (Sun):**
- [ ] Interview P008 [Time]

**Nov 11 (Mon):**
- [ ] Interview P009 [Time]
- [ ] Interview P010 [Time]

**Quality Gate:**
- ✅ All 10 interviews completed
- ✅ Average duration 30-45 min
- ✅ All notes anonymized before commit
- ✅ All incentives sent within 48 hours

---

### Phase 5: Transcription & Summarization (Day 11-12 - Nov 11-12)

**Tasks (if interviews were recorded):**
- [ ] Transcribe all recorded interviews (Otter.ai or manual)
- [ ] Save transcripts to /data/transcripts/P###.md (anonymized)
- [ ] Redact PII from transcripts (names, emails, companies, projects)

**Tasks (for all interviews):**
- [ ] Create transcript summary for each using template
- [ ] Save as /data/transcripts/P###-summary.md
- [ ] Extract top 5 pains per participant
- [ ] Note WTP quotes
- [ ] Preliminary segment validation (does P### fit their archetype?)

**Deliverables:**
- 10 transcript files (if recorded) - saved locally, not committed
- 10 transcript summary files - committed to repo
- Initial pain/WTP data extracted

**Quality Gate:**
- ✅ All transcripts anonymized (P### only)
- ✅ Top pains identified for each participant
- ✅ WTP captured for each participant

---

### Phase 6: Codebook Development (Day 12 - Nov 12)

**Morning:**
- [ ] Review all interview notes and transcript summaries
- [ ] Identify recurring themes and pain types
- [ ] List potential codes (aim for 30-40 total)

**Afternoon:**
- [ ] Build coding schema using /docs/19-codebook.md structure
- [ ] Define 8 coding axes:
  - [ ] Pain Type (PAIN-001 through PAIN-008)
  - [ ] Frequency (FREQ-001 through FREQ-004)
  - [ ] Task Type (TASK-001 through TASK-006)
  - [ ] Privacy Stance (PRIV-001 through PRIV-003)
  - [ ] Automation Need (AUTO-001 through AUTO-005)
  - [ ] Graph Need (GRAPH-001 through GRAPH-003)
  - [ ] Switching Trigger (TRIG-001 through TRIG-005)
  - [ ] WTP Band (WTP-001 through WTP-005)
- [ ] Export to /data/coding-schema.csv
- [ ] Write clear definitions with examples for each code

**Deliverables:**
- Complete codebook with ~40 codes
- CSV schema file for tracking

**Quality Gate:**
- ✅ Each code has clear definition
- ✅ Example quotes provided
- ✅ Boundary cases explained

---

### Phase 7: Coding (Day 12 - Nov 12)

**Afternoon/Evening:**
- [ ] Code all 10 interviews using the codebook
- [ ] Extract excerpts (1-3 sentence quotes) from each interview
- [ ] Apply primary code to each excerpt
- [ ] Apply secondary code if excerpt spans multiple themes
- [ ] Record in /data/coded-excerpts.csv

**Populate aggregate CSVs:**
- [ ] /data/pain-severity-scores.csv (pain areas and ratings per participant)
- [ ] /data/wtp-estimates.csv (WTP per participant with quotes)
- [ ] /data/segment-tags.csv (segment, use case, importance scores, switching intent)

**Quality Gate:**
- ✅ All 10 participants coded
- ✅ At least 5 excerpts per participant
- ✅ Aggregate data populated

**Inter-Coder Reliability Check:**
- [ ] Wait 48 hours after initial coding
- [ ] Re-code 2 randomly selected interviews without looking at original codes
- [ ] Compare: Calculate agreement rate on primary codes
- [ ] Target: >80% agreement
- [ ] If <80%: Refine code definitions and re-code

**Log reliability results in:** /docs/24-learnings-and-changes.md

---

### Phase 8: Affinity Mapping (Day 13 - Nov 13)

**Morning:**
- [ ] Cluster coded excerpts by theme
- [ ] Identify top pain clusters (3-6 clusters)
- [ ] Identify desired outcomes clusters (2-4 clusters)
- [ ] Identify barriers to switch (2-4 clusters)
- [ ] Extract representative quotes for each cluster

**Afternoon:**
- [ ] Link themes to product pillars:
  - [ ] Semantic graph
  - [ ] Automation
  - [ ] Privacy/local-first
  - [ ] Offline-first
- [ ] Document in /docs/20-affinity-map-notes.md

**Deliverables:**
- Thematic synthesis
- Evidence-backed opportunity areas
- Pain cluster frequency (X/10 participants)

---

### Phase 9: Quantitative Analysis (Day 13 - Nov 13)

**Compute Metrics vs Thresholds:**
- [ ] Problem frequency: % with weekly collisions (target ≥70%)
- [ ] Median pain severity (target ≥7/10)
- [ ] % high pain (7-10/10) (target ≥60%)
- [ ] Switching intent: % likely+ (target ≥50%)
- [ ] Median WTP (target $5-10/month)
- [ ] % premium WTP (≥$7/mo) (target ≥30%)
- [ ] % privacy importance (7-10/10) (target ≥60%)
- [ ] % differentiator resonance (mention semantic/auto) (target ≥70%)

**Create Charts:**
- [ ] Pain severity distribution histogram (/data/artifacts/pain-distribution.png)
- [ ] WTP distribution bar chart (/data/artifacts/wtp-distribution.png)
- [ ] Privacy importance distribution (/data/artifacts/privacy-importance.png)
- [ ] Switching intent bar chart (/data/artifacts/switching-intent.png)

**Update Dashboard:**
- [ ] Populate /docs/22-validation-dashboard.md with actual data
- [ ] Mark thresholds as met/not met
- [ ] Add charts

**Git Tag:** `stage2-v0.5-data-collected`

---

### Phase 10: Persona & Value Prop Updates (Day 13 - Nov 13)

**Tasks:**
- [ ] Compare actual interviews to draft personas (Rachel, Finn, Gia)
- [ ] Update personas with:
  - [ ] Real quotes from participants
  - [ ] Actual WTP data (not estimated)
  - [ ] Pain points observed (not assumed)
  - [ ] Tools actually used (not guessed)
- [ ] Refine value proposition based on:
  - [ ] What resonated in concept card reactions
  - [ ] Language participants used ("connections" vs "links")
  - [ ] Feature priority (what they mentioned as must-have)
- [ ] Document all changes in /docs/24-learnings-and-changes.md
- [ ] Update /docs/04-user-personas-draft.md or create v2
- [ ] Update /docs/05-value-proposition.md or create v2

---

### Phase 11: Risk Update (Day 13 - Nov 13)

**Review Risks:**
- [ ] Open /docs/07-risk-log.md
- [ ] For each risk, assess based on interview evidence:
  - [ ] Is likelihood higher or lower than expected?
  - [ ] Is impact higher or lower than expected?
- [ ] Identify risks elevated by evidence
- [ ] Identify risks reduced by evidence
- [ ] Identify NEW risks that emerged from interviews

**Update /data/risks-updates.csv:**
- [ ] Record risk ID, change type, evidence source, new assessments
- [ ] Add notes explaining why risk changed

**Revise Mitigation Strategies:**
- [ ] For elevated/new risks: Define mitigations
- [ ] For reduced risks: Deprioritize or retire

---

### Phase 12: Analysis Report (Day 13 - Nov 13)

**Write /docs/21-analysis-report.md:**

**Section 1: Executive Summary (≤300 words)**
- [ ] Sample size and composition
- [ ] Key findings vs thresholds
- [ ] Recommended decision
- [ ] Top 3 insights
- [ ] Critical changes needed

**Section 2: Sample and Method**
- [ ] Screener summary (N responses, qualified, channels)
- [ ] Interview summary (N completed, dates, duration, segments)

**Section 3: Results vs Thresholds**
- [ ] Table with all 8 thresholds, targets, actuals, pass/fail
- [ ] Detailed analysis for each threshold
- [ ] Charts embedded or linked

**Section 4: Segment Insights**
- [ ] Rachel findings (demographics, pains, WTP, feature priorities, persona updates)
- [ ] Finn findings (same structure)
- [ ] Gia findings (same structure)
- [ ] Other findings (if applicable)

**Section 5: WTP Analysis**
- [ ] Distribution table and chart
- [ ] Price sensitivity factors
- [ ] Pricing implications and recommendation

**Section 6: Competitive Implications**
- [ ] Most common current tools (with usage %)
- [ ] Why they're leaving each tool
- [ ] What we must match (table stakes)
- [ ] Where we can differentiate

**Section 7: Risks Update**
- [ ] Risks elevated
- [ ] Risks reduced
- [ ] New risks identified
- [ ] Link to /data/risks-updates.csv

**Section 8: Recommendations**
- [ ] Product recommendations (feature prioritization)
- [ ] Value prop updates
- [ ] Messaging recommendations
- [ ] Persona refinements
- [ ] Pricing recommendation
- [ ] Platform priority (Windows-first confirmed?)

**Section 9: Appendices**
- [ ] 15+ representative quotes
- [ ] Methodology notes (deviations, challenges, quality)

**Git Tag:** `stage2-v0.9-rc`

---

### Phase 13: Decision Memo (Day 14 - Nov 14)

**Evaluate Thresholds:**
- [ ] Count how many of 6 core thresholds met (1, 2, 4, 5, 6, 8)
- [ ] Apply decision rule:
  - GO if ≥5 met
  - HOLD if 3-4 met
  - PIVOT if ≤2 met

**Write /docs/23-decision-memo.md:**

**Section 1: Threshold Evaluation Table**
- [ ] All thresholds with pass/fail and weight

**Section 2: Decision Rationale**
- [ ] Why GO/HOLD/PIVOT based on data
- [ ] Supporting evidence from thresholds
- [ ] Qualitative insights
- [ ] Risk assessment
- [ ] Confidence level (High/Medium/Low)

**Section 3: Required Changes for Stage 3** (if GO)
- [ ] Product changes
- [ ] Positioning changes
- [ ] Persona refinements
- [ ] Pricing recommendation
- [ ] Platform priority

**Section 4: Open Questions for Stage 3**
- [ ] List 5+ questions that need answering in next stage

**Section 5: Risks to Monitor**
- [ ] High priority risks with mitigation plans
- [ ] Medium priority risks

**Section 6: Next Steps**
- [ ] Immediate actions (Week 1 of Stage 3)
- [ ] Short-term actions (Month 1)
- [ ] Success metrics for Stage 3

**Sign Off:**
- [ ] research-lead approves decision
- [ ] Date and signature/initials

---

### Phase 14: Final QA & Release (Day 14 - Nov 14)

**Run /process/qa-checklist-stage2.md:**
- [ ] Complete all items on QA checklist
- [ ] Verify no PII committed to repo
- [ ] Verify all files have version headers
- [ ] Verify chart counts match data
- [ ] Verify quote anonymization (P### only)
- [ ] Verify all 10 interview notes exist

**Update Documentation:**
- [ ] Update README.md with Stage 2 summary
- [ ] Add section describing Stage 2 results
- [ ] Link to key documents

**Git Operations:**
- [ ] Review all changes: `git status`
- [ ] Review diff: `git diff`
- [ ] Add all files: `git add .`
- [ ] Commit with message:
  ```
  Stage 2: Validation complete - [GO/HOLD/PIVOT] decision

  - Completed 10 user interviews (Nov 6-11)
  - [X]/8 thresholds met
  - Decision: [GO/HOLD/PIVOT]
  - Key findings: [1-2 sentence summary]

  See docs/23-decision-memo.md for details.
  ```
- [ ] Tag release: `git tag stage2-v1.0-validation-complete`
- [ ] Push (if using remote): `git push && git push --tags`

**Write Release Notes:**
- [ ] Create /docs/release-notes-stage2.md with:
  - Files changed (list key documents)
  - Threshold results summary
  - Decision outcome
  - Next steps

**Final Checklist:**
- ✅ All interviews completed
- ✅ All data coded and analyzed
- ✅ Decision memo signed off
- ✅ No PII in committed files
- ✅ README updated
- ✅ Git tagged

**Stage 2 Complete!**

---

## Error Handling

### If Quotas Lag During Recruitment

**Symptoms:**
- End of Day 3: <35 qualified responses
- End of Day 4: Specific segment (e.g., Gia) has 0 candidates

**Actions:**
1. Extend recruitment by 2-3 days
2. Prioritize under-represented segment in outreach
3. Expand to additional communities (more subreddits, Discord servers)
4. Consider lowering pain threshold to ≥5/10 (document in learnings)
5. Log decision in /docs/24-learnings-and-changes.md with rationale

---

### If Thresholds Are Mixed (3-4 of 6 met)

**Decision:** HOLD

**Actions:**
1. Analyze which thresholds failed and why
2. Determine if more interviews would help or if deeper issue exists
3. Options:
   - Run +3-5 interviews in highest-value segment (Rachel or Finn)
   - Revise value proposition or concept and retest
   - Extend timeline by 3-5 days
4. Reconvene for decision after additional data
5. Log all changes in /docs/24-learnings-and-changes.md

---

### If Technical Issues (Recording Fails)

**Actions:**
1. Rely on detailed real-time notes (use template)
2. Offer participant option to re-interview if critical gap exists
3. Document limitation in analysis report (Section 9: Methodology Notes)
4. Increase note-taking detail for remaining interviews
5. Test recording software before each subsequent interview

---

### If Participant No-Shows

**Actions:**
1. Wait 15 minutes past scheduled time
2. Send email: "We missed you! Would you like to reschedule?"
3. Offer one reschedule attempt with 2-3 new time slots
4. If no response within 24 hours: Move to backup participant
5. Update /data/interview-schedule.csv (attended_yn = no)
6. If >3 no-shows total: Extend timeline by 2 days to complete target N=10

---

## Deviations Log

**All deviations from this workflow must be documented in /docs/24-learnings-and-changes.md**

**Required information:**
- What changed (specific task or timeline)
- Why (reason for deviation)
- Impact on results (data quality, timeline, coverage)
- Date of deviation
- Mitigation or corrective action

**Example:**
"Extended recruitment from Nov 4 to Nov 6 due to only 32 qualified responses (target 40). Gia segment under-represented. Mitigation: Targeted Reddit r/GradSchool and university listservs. Achieved 42 qualified by Nov 6."

---

**Workflow Version:** 1.0
**Owner:** research-lead
**Last Updated:** 2025-10-31
**Status:** Ready for execution Nov 1, 2025
