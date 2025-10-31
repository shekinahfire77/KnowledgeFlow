# Stage 2 QA Checklist

**Version:** 1.0
**Owner:** research-lead
**Last Updated:** 2025-10-31

---

## Purpose

Run this checklist before tagging `stage2-v1.0-validation-complete`. This ensures data quality, privacy compliance, and completeness.

---

## Section 1: Data Privacy and Security

### PII Removal Verification

**Run these commands to check for PII:**

```bash
# Check for email patterns
git grep -E "\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"
# Expected: No results OR only in templates/examples

# Check for "name:" fields
git grep -i "name:"
# Expected: Only in templates or "[REDACTED]"

# Check for phone patterns
git grep -E "\b\d{3}[-.]?\d{3}[-.]?\d{4}\b"
# Expected: No results
```

**Manual checks:**
- [ ] Open /data/respondents-master.csv → name and email columns should be "[REDACTED]"
- [ ] Open /data/screener-responses.csv → email column should be "[REDACTED]"
- [ ] Random sample 3 interview notes files → all use P### aliases, no real names
- [ ] Random sample 5 quotes in analysis report → all anonymized

**Critical:** If ANY PII found:
1. STOP - do not commit or tag
2. Remove PII immediately
3. Re-run checks
4. Log incident in /docs/24-learnings-and-changes.md

---

### File Location Verification

**Local only (NOT in repo):**
- [ ] Raw recordings stored in local encrypted folder (NOT /data/)
- [ ] PII mapping file (name ↔ P###) stored locally (NOT in repo)
- [ ] Consent records stored locally (NOT in repo)

**Committed to repo (anonymized only):**
- [ ] /data/interview-notes/ contains only P###.md files
- [ ] /data/transcripts/ (if exists) contains only P###.md or P###-summary.md
- [ ] All CSV files use P### or alias_id, not real names

**Verification command:**
```bash
# Check for common PII filenames in repo
git ls-files | grep -E "(consent|pii|personal|recordings)"
# Expected: Only templates or docs, not actual data files
```

---

## Section 2: Data Completeness

### Interview Data Files

**For each participant P001-P0##:**
- [ ] Interview notes file exists: /data/interview-notes/P###.md
- [ ] Entry in /data/interview-schedule.csv (attended_yn = yes)
- [ ] Entry in /data/respondents-master.csv (alias_id = P###)
- [ ] Entry in /data/pain-severity-scores.csv (≥1 pain scored)
- [ ] Entry in /data/wtp-estimates.csv (WTP recorded)
- [ ] Entry in /data/segment-tags.csv (segment assigned)

**Count verification:**
```bash
# Count interview notes files
ls data/interview-notes/*.md | wc -l
# Expected: ≥8 (minimum) or 10 (target)

# Count lines in CSVs (excluding header)
wc -l data/pain-severity-scores.csv
wc -l data/wtp-estimates.csv
wc -l data/segment-tags.csv
# Expected: Each should have ≥9 lines (header + 8 participants minimum)
```

---

### Coded Data

- [ ] /data/coded-excerpts.csv exists and has ≥40 rows (header + excerpts)
- [ ] /data/coding-schema.csv exists and has ~40 codes
- [ ] Each interview has ≥3 coded excerpts (check random sample)
- [ ] All code IDs in excerpts match code IDs in schema

**Verification:**
```bash
# Count coded excerpts
wc -l data/coded-excerpts.csv
# Expected: ≥41 (header + 40 excerpts)

# Check for unique participants in excerpts
cut -d',' -f1 data/coded-excerpts.csv | sort | uniq | wc -l
# Expected: ≥9 (8 participants + header)
```

---

### Charts and Artifacts

- [ ] /data/artifacts/pain-distribution.png exists
- [ ] /data/artifacts/wtp-distribution.png exists
- [ ] /data/artifacts/privacy-importance.png exists
- [ ] /data/artifacts/switching-intent.png exists
- [ ] Chart files are readable (not corrupted)
- [ ] Charts referenced in /docs/21-analysis-report.md and /docs/22-validation-dashboard.md

---

## Section 3: Documentation Completeness

### Required Stage 2 Docs (12 files)

- [ ] /docs/13-stage2-research-brief.md
- [ ] /docs/14-updated-research-plan.md
- [ ] /docs/15-instrument-pack.md
- [ ] /docs/16-recruitment-plan.md
- [ ] /docs/17-consent-script.md
- [ ] /docs/18-data-security-protocol.md
- [ ] /docs/19-codebook.md
- [ ] /docs/20-affinity-map-notes.md
- [ ] /docs/21-analysis-report.md
- [ ] /docs/22-validation-dashboard.md
- [ ] /docs/23-decision-memo.md
- [ ] /docs/24-learnings-and-changes.md

**Version Header Check** (spot check 3 files):
- [ ] File has "Version: X.X" line
- [ ] File has "Owner: research-lead" line
- [ ] File has "Status: [Draft/Final]" line
- [ ] File has "Last updated: YYYY-MM-DD" line

---

### Analysis Report Quality

**Check /docs/21-analysis-report.md:**
- [ ] Executive summary ≤300 words
- [ ] All 8 sections present (Sample, Results, Segment Insights, WTP, Competitive, Risks, Recommendations, Appendices)
- [ ] No "[TBD]" or "[Fill after analysis]" placeholders
- [ ] ≥15 unique quotes in Appendix A
- [ ] Charts embedded or linked correctly

---

### Decision Memo Quality

**Check /docs/23-decision-memo.md:**
- [ ] Decision clearly stated: GO / HOLD / PIVOT
- [ ] Threshold table complete (8 thresholds, all with actual data)
- [ ] Rationale section ≥3 supporting points
- [ ] Confidence level stated: High / Medium / Low
- [ ] Required changes section filled (if GO)
- [ ] ≥5 open questions for Stage 3
- [ ] Signed off (research-lead, date, signature/initials)

---

### Validation Dashboard Quality

**Check /docs/22-validation-dashboard.md:**
- [ ] All KPI table cells have actual data (no "[##]" placeholders)
- [ ] Threshold pass rate calculated
- [ ] Decision status shows recommended decision
- [ ] Segment quota table shows actual completion numbers
- [ ] Hypothesis validation table shows Yes/No for each H1-H10
- [ ] Charts displayed or linked

---

## Section 4: Data Quality Checks

### Pain Severity Scores

**Check /data/pain-severity-scores.csv:**
- [ ] All scores are 1-10 (no out-of-range values)
- [ ] Median calculation makes sense (manually verify 3 participants)
- [ ] No duplicate alias_id + pain_area combinations

**Spot check:**
- [ ] P001 has ≥2 pain areas scored
- [ ] P003 has ≥2 pain areas scored
- [ ] Scores align with quotes in interview notes

---

### WTP Estimates

**Check /data/wtp-estimates.csv:**
- [ ] All WTP values are ≥0 (no negative)
- [ ] Confidence values are 1, 2, or 3 only
- [ ] Justification quotes exist for all participants
- [ ] Median WTP calculation verified

**Spot check:**
- [ ] P001 WTP matches quote in interview notes
- [ ] P005 WTP matches quote in interview notes

---

### Segment Tags

**Check /data/segment-tags.csv:**
- [ ] All participants assigned to valid segment (Rachel/Finn/Gia/Other)
- [ ] Importance scores are 1-10 (no out-of-range)
- [ ] Switching intent is 1-5 (no out-of-range)
- [ ] Segment distribution matches quota targets (±1 acceptable)

---

## Section 5: Analysis Accuracy

### Threshold Calculations

**Recalculate manually (spot check 3 thresholds):**

**Threshold 2: Pain Severity Median**
- [ ] Sort pain scores from pain-severity-scores.csv
- [ ] Calculate median
- [ ] Verify matches value in /docs/21-analysis-report.md Section 3
- [ ] Verify matches value in /docs/22-validation-dashboard.md

**Threshold 5: WTP Median**
- [ ] Sort WTP values from wtp-estimates.csv
- [ ] Calculate median
- [ ] Verify matches report
- [ ] Verify $5-10 range check is correct

**Threshold 8: Differentiator Resonance**
- [ ] Count participants who mentioned semantic/auto in concept card reaction
- [ ] Divide by total participants
- [ ] Verify ≥70% calculation

---

### Chart Accuracy

**For pain-distribution.png:**
- [ ] X-axis labels match data (1-10 scale)
- [ ] Bar heights match counts from pain-severity-scores.csv
- [ ] Title and labels present and readable

**For wtp-distribution.png:**
- [ ] Data matches wtp-estimates.csv
- [ ] Binning makes sense (not too granular or coarse)
- [ ] Median line shown or noted

---

## Section 6: Consistency Checks

### Cross-File Consistency

**Participant count consistency:**
- [ ] Same N reported in:
  - /docs/21-analysis-report.md (Section 1)
  - /docs/22-validation-dashboard.md (KPI table)
  - /docs/23-decision-memo.md (Appendix)
- [ ] Count of interview notes files matches reported N
- [ ] Count of rows in segment-tags.csv matches reported N

---

### Segment Distribution Consistency

**Check segment counts match across:**
- [ ] /data/segment-tags.csv (count by segment column)
- [ ] /docs/21-analysis-report.md Section 1 (Segment Distribution table)
- [ ] /docs/22-validation-dashboard.md (Segment Quota Status table)

**Verify:**
```bash
# Count segments in segment-tags.csv
cut -d',' -f2 data/segment-tags.csv | tail -n +2 | sort | uniq -c
# Manually check matches docs
```

---

### Decision Alignment

- [ ] Decision in /docs/23-decision-memo.md matches recommendation in /docs/21-analysis-report.md Executive Summary
- [ ] Decision matches threshold pass rate (GO if ≥5/6, HOLD if 3-4, PIVOT if ≤2)
- [ ] Decision in /docs/22-validation-dashboard.md matches decision memo

---

## Section 7: Repository Health

### File Organization

- [ ] All interview notes in /data/interview-notes/
- [ ] All transcripts (if any) in /data/transcripts/
- [ ] All charts in /data/artifacts/
- [ ] All docs in /docs/
- [ ] All templates in /templates/
- [ ] All process files in /process/
- [ ] No stray files in root directory

---

### Git Status

```bash
# Check for uncommitted changes
git status
# Expected: Clean working directory (or only expected changes)

# Check for untracked files
git status -u
# Expected: No critical files untracked (templates, CSVs, docs should be tracked)

# Check for large files (recordings should NOT be in repo)
find . -type f -size +10M
# Expected: No large files (recordings are local only)
```

---

### README Update

- [ ] /README.md has Stage 2 section
- [ ] Stage 2 section includes:
  - [ ] Summary of Stage 2 (1-2 sentences)
  - [ ] Decision outcome (GO/HOLD/PIVOT)
  - [ ] Key findings (2-3 bullet points)
  - [ ] Link to decision memo
  - [ ] Date range (Nov 1-14, 2025)

---

## Section 8: Compliance and Ethics

### Informed Consent

- [ ] All interviewed participants gave consent (check interview notes)
- [ ] Consent script used for all interviews
- [ ] Recording consent obtained separately (if applicable)
- [ ] No participants under 18 years old

---

### Incentive Delivery

**Check /data/respondents-master.csv:**
- [ ] All completed interviews have incentive_status = "sent"
- [ ] No "pending" status >48 hours after interview
- [ ] Incentive amount = 25 for all (or documented exception)

---

### Data Retention Compliance

- [ ] Deletion schedule documented in /docs/18-data-security-protocol.md
- [ ] If 90 days have passed since interviews: Check recordings deleted
- [ ] Deletion log updated if any deletions occurred

---

## Section 9: Learnings Documentation

### Deviations Logged

**Check /docs/24-learnings-and-changes.md:**
- [ ] All timeline deviations documented
- [ ] All methodology changes documented
- [ ] Rationale provided for each deviation
- [ ] Recruitment channel effectiveness documented
- [ ] Inter-coder reliability results logged (if performed)

---

### Risk Updates

**Check /data/risks-updates.csv:**
- [ ] All risk changes logged (elevated, reduced, new, retired)
- [ ] Evidence source provided for each update
- [ ] New likelihood and impact assessed
- [ ] Date updated recorded

---

## Section 10: Final Sign-Off

### Pre-Release Checklist

- [ ] **All Section 1 checks passed** (PII removed, files in correct locations)
- [ ] **All Section 2 checks passed** (Data completeness)
- [ ] **All Section 3 checks passed** (Documentation completeness)
- [ ] **All Section 4 checks passed** (Data quality)
- [ ] **All Section 5 checks passed** (Analysis accuracy)
- [ ] **All Section 6 checks passed** (Consistency across files)
- [ ] **All Section 7 checks passed** (Repository health)
- [ ] **All Section 8 checks passed** (Compliance and ethics)
- [ ] **All Section 9 checks passed** (Learnings documented)

---

### Critical Issues Found

[If any critical issues found, list here and DO NOT proceed with release]

**Issue 1:** [Description]
- Severity: [Critical / High / Medium / Low]
- Action: [What needs to be fixed]
- Status: [Open / Resolved]

---

### QA Completion Sign-Off

**QA Performed by:** research-lead
**Date:** [YYYY-MM-DD]
**Time:** [HH:MM]

**QA Result:**
- [ ] **PASS** - All checks passed, ready for release
- [ ] **FAIL** - Critical issues found, release blocked (see above)

**Notes:**
[Any observations, minor issues accepted, or notes for future improvement]

---

### Release Approval

**If QA PASSED:**

- [ ] All acceptance criteria met (/process/acceptance-criteria-stage2.md)
- [ ] All QA checks passed
- [ ] No critical PII violations
- [ ] Ready to tag `stage2-v1.0-validation-complete`

**Approved for release by:** research-lead
**Date:** [YYYY-MM-DD]
**Signature:** [Name or initials]

---

**QA Checklist Version:** 1.0
**Owner:** research-lead
**Last Updated:** 2025-10-31
