# Stage 2 Acceptance Criteria

**Version:** 1.0
**Owner:** research-lead
**Last Updated:** 2025-10-31

---

## Purpose

This document defines the specific, measurable criteria that must be met for Stage 2 to be considered complete and successful. All criteria must be satisfied before proceeding to Stage 3.

---

## Critical Acceptance Criteria (Must Pass)

### AC-1: Sample Size and Quality

**Criteria:**
- ✅ Screener responses: N ≥ 40 qualified participants
- ✅ Interviews completed: N ≥ 8 (target 10, minimum 8)
- ✅ Attention-check pass rate in screener: ≥90%
- ✅ Interview completion rate (≥30 min): ≥80% of scheduled

**Verification:**
- Check /data/screener-responses.csv row count (qualified_yn = yes)
- Check /data/interview-schedule.csv (attended_yn = yes count)
- Review interview-notes files for duration

---

### AC-2: Segment Quota Coverage

**Criteria:**
- ✅ Rachel: ≥2 interviews (target 3)
- ✅ Finn: ≥2 interviews (target 3)
- ✅ Gia: ≥1 interview (target 2)
- ✅ Other: ≥1 interview (target 2)
- ✅ Total: ≥8 interviews minimum

**Verification:**
- Check /data/segment-tags.csv for segment distribution
- Review /docs/21-analysis-report.md Section 1 (Sample and Method)

---

### AC-3: Data Collection Completeness

**Criteria:**
For each interview (N ≥ 8):
- ✅ Interview notes file exists: /data/interview-notes/P###.md
- ✅ Pain severity score recorded (1-10 scale)
- ✅ Willingness to pay recorded (dollar amount)
- ✅ Switching intent recorded (1-5 scale)
- ✅ Privacy importance recorded (1-10 scale)
- ✅ Segment tag assigned

**Verification:**
- Check /data/interview-notes/ directory for P001-P0## files
- Check /data/pain-severity-scores.csv (all participants present)
- Check /data/wtp-estimates.csv (all participants present)
- Check /data/segment-tags.csv (all participants present)

---

### AC-4: Coding and Analysis Completion

**Criteria:**
- ✅ Codebook created: /docs/19-codebook.md (≥30 codes across 8 axes)
- ✅ All interviews coded: /data/coded-excerpts.csv (≥40 total excerpts)
- ✅ Average ≥4 excerpts per interview
- ✅ Affinity mapping complete: /docs/20-affinity-map-notes.md
- ✅ Analysis report complete: /docs/21-analysis-report.md (all sections filled)

**Verification:**
- Check codebook exists and has code definitions
- Check coded-excerpts.csv row count (≥40)
- Check affinity map has ≥3 pain clusters and ≥2 outcome clusters
- Check analysis report has executive summary + all 8 sections

---

### AC-5: Threshold Evaluation

**Criteria:**
- ✅ All 8 thresholds measured and documented
- ✅ Pass/fail determination for each threshold
- ✅ Charts created for key metrics:
  - Pain severity distribution
  - WTP distribution
  - Privacy importance
  - Switching intent
- ✅ Validation dashboard populated: /docs/22-validation-dashboard.md

**Verification:**
- Check /docs/21-analysis-report.md Section 3 (Results vs Thresholds)
- Check /data/artifacts/ directory for 4 chart files (.png)
- Check validation dashboard has actual data (not TBD)

---

### AC-6: Decision Documentation

**Criteria:**
- ✅ Decision memo complete: /docs/23-decision-memo.md
- ✅ Clear decision stated: GO / HOLD / PIVOT
- ✅ Decision rationale documented (≥3 supporting points)
- ✅ Confidence level stated: High / Medium / Low
- ✅ Signed off by research-lead with date

**Verification:**
- Check decision memo exists and has decision in Section 1
- Check rationale section is complete (not TBD)
- Check signature/approval at end of memo

---

### AC-7: Data Security and Privacy Compliance

**Criteria:**
- ✅ NO PII in any committed files:
  - No real names (only P### aliases)
  - No email addresses
  - No phone numbers
  - No company names if identifiable
- ✅ All quotes anonymized and redacted
- ✅ Raw recordings stored locally only (NOT in repo)
- ✅ Data security protocol followed: /docs/18-data-security-protocol.md

**Verification:**
- Run: `git grep -i "name:"` → Should only return template files or "[REDACTED]"
- Run: `git grep -E "\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"` → No email addresses found
- Check /data/interview-notes/ files: All references use P###
- Check local encrypted folder has recordings (not in repo)

---

### AC-8: Documentation Completeness

**Criteria:**
- ✅ All 12 Stage 2 docs files created:
  - 13-stage2-research-brief.md
  - 14-updated-research-plan.md
  - 15-instrument-pack.md
  - 16-recruitment-plan.md
  - 17-consent-script.md
  - 18-data-security-protocol.md
  - 19-codebook.md
  - 20-affinity-map-notes.md
  - 21-analysis-report.md
  - 22-validation-dashboard.md
  - 23-decision-memo.md
  - 24-learnings-and-changes.md
- ✅ All files have version header (Version, Owner, Status, Last updated)
- ✅ README.md updated with Stage 2 summary

**Verification:**
- Check /docs/ directory for all 12 files (13-24)
- Spot-check 3 files for version header
- Check README.md has Stage 2 section

---

## Important Acceptance Criteria (Should Pass)

### AC-9: Inter-Coder Reliability

**Criteria:**
- ✅ Self-check performed (re-code 2 interviews after 48 hours)
- ✅ Agreement rate ≥75% on primary codes (target 80%)
- ✅ Results logged in /docs/24-learnings-and-changes.md

**Verification:**
- Check learnings doc for reliability check section
- Review agreement rate

---

### AC-10: Incentive Delivery

**Criteria:**
- ✅ All completed interviews received $25 incentive within 48 hours
- ✅ Incentive status tracked in /data/respondents-master.csv
- ✅ No outstanding incentives (all "sent" or "bounced" with follow-up)

**Verification:**
- Check respondents-master.csv (incentive_status column)
- Verify all "completed" interviews have "sent" status
- Check for "pending" >48 hours (should be none)

---

### AC-11: Learnings Documentation

**Criteria:**
- ✅ Methodology deviations documented
- ✅ Recruitment channel effectiveness documented
- ✅ Process improvements identified (≥3 items)
- ✅ Persona and value prop changes documented
- ✅ Risk updates documented in /data/risks-updates.csv

**Verification:**
- Check /docs/24-learnings-and-changes.md (all sections filled)
- Check /data/risks-updates.csv has entries

---

## Optional Acceptance Criteria (Nice to Have)

### AC-12: Transcription Quality

**Criteria:**
- ⬜ Transcripts created for all recorded interviews
- ⬜ Transcripts saved to /data/transcripts/P###.md (anonymized)
- ⬜ Transcript summaries created using template

**Note:** Not required if interviews rely on detailed notes instead of recording

---

### AC-13: Stakeholder Review (if applicable)

**Criteria:**
- ⬜ Decision memo reviewed by [stakeholder/advisor]
- ⬜ Feedback incorporated or logged

**Note:** Only applicable if project has oversight or advisory board

---

## Acceptance Checklist

**Before marking Stage 2 as complete:**

- [ ] **AC-1:** Sample size verified (≥40 screener, ≥8 interviews)
- [ ] **AC-2:** Segment quotas met or acceptable
- [ ] **AC-3:** Data collection complete for all interviews
- [ ] **AC-4:** Coding and analysis complete
- [ ] **AC-5:** Thresholds measured, charts created
- [ ] **AC-6:** Decision memo signed off
- [ ] **AC-7:** PII compliance verified (no PII in repo)
- [ ] **AC-8:** Documentation complete (12 files + README)
- [ ] **AC-9:** Inter-coder reliability check performed
- [ ] **AC-10:** Incentives delivered
- [ ] **AC-11:** Learnings documented
- [ ] **AC-12:** [Optional] Transcripts complete
- [ ] **AC-13:** [Optional] Stakeholder review

**Total Critical (must pass):** 8/8
**Total Important (should pass):** 3/3
**Total Optional:** [#]/2

---

## Sign-Off

**Stage 2 Acceptance:**

- [ ] All critical acceptance criteria met (AC-1 through AC-8)
- [ ] Important acceptance criteria met or exceptions documented
- [ ] Stage 2 deliverables complete and approved

**Approved by:** research-lead
**Date:** [YYYY-MM-DD]
**Signature:** [Name or initials]

**Ready to proceed to Stage 3:** [YES / NO]

---

**Acceptance Criteria Version:** 1.0
**Owner:** research-lead
**Last Updated:** 2025-10-31
