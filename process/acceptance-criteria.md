Version: 0.1
Owner: research-lead
Status: Draft
Last updated: 2025-10-31

# Stage 1 Acceptance Criteria

## Overview
This checklist ensures the Stage 1 planning and validation package meets quality standards before release. All items must be checked before tagging stage1-v1.0-ready-for-recruitment.

## Documentation Completeness

### Core Documents
- [ ] All twelve docs exist (01 through 12)
- [ ] All docs have version headers (Version, Owner, Status, Last updated)
- [ ] All version headers use correct date format (YYYY-MM-DD)
- [ ] All docs use 2025-10-31 as last updated date for initial release
- [ ] All docs marked with appropriate status (Draft/Review/Final)
- [ ] Owner field populated for all documents

### Templates
- [ ] All five templates exist in /templates/ directory
- [ ] All templates are usable fill-in-the-blank format
- [ ] Templates have clear section headers
- [ ] Templates include placeholder text in brackets
- [ ] Templates demonstrate proper structure

### Data Files
- [ ] All CSV files have proper headers
- [ ] All CSVs have 3+ sample rows
- [ ] CSV formatting is valid (no broken quotes or delimiters)
- [ ] assumptions-and-questions.md exists with content

### Process Files
- [ ] workflow-stage1.md exists with sequenced steps
- [ ] acceptance-criteria.md exists (this file)
- [ ] glossary.md exists with all required definitions

## Content Quality

### Hypotheses (doc 02)
- [ ] Contains 6-10 falsifiable hypotheses
- [ ] Each hypothesis has clear statement
- [ ] Each hypothesis has signal to validate
- [ ] Each hypothesis has evidence threshold
- [ ] Each hypothesis has disconfirming evidence
- [ ] Hypotheses use proper format (H1, H2, etc.)

### Interview Guide (doc 09)
- [ ] Has "last time" narrative prompts
- [ ] Structured in time-bounded sections
- [ ] Total duration is 30-40 minutes
- [ ] Includes warm-up section
- [ ] Includes example probes for each section
- [ ] Covers current tools, pain points, ideal solution
- [ ] Includes value and payment willingness questions

### Screener Survey (doc 10)
- [ ] Disqualifies non-Windows users
- [ ] Has pain severity question (scale 1-10)
- [ ] Has frequency of note-taking question
- [ ] Includes quota guidance
- [ ] Clear disqualification criteria marked
- [ ] Has email collection for follow-up
- [ ] Has beta opt-in question

### Competitive Matrix (doc 06)
- [ ] Shows KnowledgeFlow gaps clearly
- [ ] Includes at least 5 competitors (Obsidian, Notion, OneNote, Logseq, Mem)
- [ ] Covers privacy/offline dimension
- [ ] Covers graph/links capability
- [ ] Covers automation features
- [ ] Covers local AI capability
- [ ] Uses consistent symbols (✓/-/partial)

### Risk Log (doc 07)
- [ ] Includes privacy risks
- [ ] Includes AI accuracy risks
- [ ] Includes adoption risks
- [ ] Contains 8-12 total risks
- [ ] Uses proper table format
- [ ] All risks have mitigation strategies
- [ ] All risks have assigned owners
- [ ] Covers market, accuracy, performance, legal categories

### Research Plan (doc 08)
- [ ] Has firm dates (2025-11-01 to 2025-11-14)
- [ ] Has go/no-go thresholds
- [ ] Specifies 10 semi-structured interviews
- [ ] Specifies screener survey N≥25
- [ ] Defines recruitment channels
- [ ] Includes analysis plan (thematic coding, pain scoring)
- [ ] Maps objectives to hypotheses
- [ ] Includes decision gates

### Value Proposition (doc 05)
- [ ] Has one-sentence promise
- [ ] Has 3 persona variants (Rachel, Finn, Gia)
- [ ] Has contrast lines for competitors
- [ ] Focuses on privacy/offline
- [ ] Focuses on semantic linking
- [ ] Focuses on automation
- [ ] Focuses on local AI

### Personas (doc 04)
- [ ] Contains 3 personas minimum
- [ ] Includes "Research Analyst Rachel"
- [ ] Includes "Freelance Creator Finn"
- [ ] Includes "Graduate Student Gia"
- [ ] Each has demographics
- [ ] Each has goals
- [ ] Each has frustrations
- [ ] Each has current tools
- [ ] Each has triggers (what makes them search)
- [ ] Each has selection criteria
- [ ] Each has memorable quote

## Formatting and Style

### Tables
- [ ] All tables render correctly in Markdown
- [ ] Tables have proper headers
- [ ] Tables use consistent column alignment
- [ ] No broken table formatting

### Style Rules
- [ ] Plain language throughout
- [ ] Short sentences used
- [ ] No marketing fluff
- [ ] No em dashes
- [ ] No ellipses (except in quoted material)
- [ ] Numbered lists used appropriately
- [ ] Testable, falsifiable statements only

### File Naming
- [ ] All files use lowercase
- [ ] All files use hyphen-separation
- [ ] Numbered files use proper sequence (01, 02, not 1, 2)
- [ ] No spaces in filenames

## Data Integrity

### CSV Files
- [ ] screener-questions.csv has proper structure
- [ ] interview-schedule.csv has sample candidates
- [ ] competitor-list.csv has 5+ competitors
- [ ] All CSV files use consistent delimiter (comma)
- [ ] All CSV fields properly quoted where needed

### Dates
- [ ] All dates use ISO format (YYYY-MM-DD)
- [ ] All dates are consistent with 2025-10-31 as "today"
- [ ] Timeline dates are realistic and sequential
- [ ] Interview schedule uses correct timezone notation

## Decisions Log (doc 12)
- [ ] Has 5+ entries
- [ ] Includes decision to focus Stage 1 on validation
- [ ] Includes decision to target Windows-first
- [ ] Includes decision to prioritize privacy/offline
- [ ] Includes decision to use semi-structured interviews
- [ ] Includes decision to offer incentives
- [ ] Each entry has date, context, options, decision, rationale, impact

## Repository Structure
- [ ] /docs/ directory exists with all 12 files
- [ ] /templates/ directory exists with all 5 templates
- [ ] /data/ directory exists with all files
- [ ] /process/ directory exists with all 3 files
- [ ] README.md exists at root

## README Quality
- [ ] README has overview section
- [ ] README lists target users
- [ ] README shows repository structure
- [ ] README has current version tag
- [ ] README links to key documents
- [ ] README has next steps
- [ ] README has decision criteria reference

## Final Checks
- [ ] Internal review completed
- [ ] Stakeholder feedback incorporated
- [ ] No placeholder text remains (except in templates)
- [ ] No TODO items remain unresolved
- [ ] All cross-references between docs are valid
- [ ] Contact information current (if applicable)

## Sign-Off

**Reviewed by**: _______________
**Date**: _______________
**Approved for recruitment**: Yes / No
**Notes**:
