# Instrument Pack: Stage 2 Research

Version: 0.1
Owner: research-lead
Status: Draft
Last updated: 2025-10-31

---

## Purpose

This document serves as the central repository for all finalized research instruments used in Stage 2 validation. All instruments have been designed to validate hypotheses H1-H10 and measure against success thresholds.

---

## 1. Screener Survey

### Tool and Deployment

**Platform:** Google Forms or Typeform (free tier)
**URL:** [To be added after deployment on Nov 1, 2025]
**Distribution:** Reddit, LinkedIn, Twitter, Discord, university mailing lists
**Duration:** 3-5 minutes to complete
**Target:** N ≥ 40 qualified responses

### Full Survey Text

See: `/docs/10-screener-survey.md` for complete question flow and logic.

### Key Qualification Questions

**Q1: Operating System**
"What is your primary operating system for work/study?"
- [ ] Windows
- [ ] macOS
- [ ] Linux
- [ ] ChromeOS
- [ ] Other: ___

**Qualification:** Must select Windows

**Q2: Note-Taking Frequency**
"How often do you take notes for work, research, or projects?"
- [ ] Multiple times per day
- [ ] Daily
- [ ] 2-3 times per week
- [ ] Weekly
- [ ] Less than weekly

**Qualification:** Must select at least "Weekly"

**Q3: Tools Used**
"Which of the following tools do you currently use for note-taking or knowledge management? (Select all that apply)"
- [ ] Obsidian
- [ ] Notion
- [ ] Microsoft OneNote
- [ ] Evernote
- [ ] Roam Research
- [ ] Logseq
- [ ] Google Docs/Keep
- [ ] Apple Notes
- [ ] Markdown files + text editor
- [ ] Other: ___

**Qualification:** Must select ≥2 tools

**Q4: Pain Severity**
"On a scale of 1-10, how frustrated are you with your current note-taking setup?"
[Slider: 1 = Not at all frustrated, 10 = Extremely frustrated]

**Qualification:** Must score ≥6

**Q5: Attention Check**
"To ensure data quality, please select 'Somewhat agree' for this question."
- [ ] Strongly disagree
- [ ] Somewhat disagree
- [ ] Somewhat agree ← Correct answer
- [ ] Strongly agree

**Qualification:** Must select correct answer

**Q6: Contact and Consent**
"If selected for a 40-minute interview, we'll offer a $25 Amazon gift card. Please provide your email address."
[Text field]

**Qualification:** Must provide valid email format

### Post-Screener Process

1. Export responses to `/data/raw/screener-export-[date].csv`
2. Apply qualification logic (filter for all criteria)
3. Create cleaned `/data/screener-responses.csv`
4. Assign segment buckets (Rachel/Finn/Gia/Other) based on role and use case
5. Select 10-12 participants ensuring quota balance
6. Create `/data/respondents-master.csv` with P### aliases

---

## 2. Interview Guide

### Overview

**Format:** Semi-structured 1-on-1 video interview
**Duration:** 35-40 minutes
**Recording:** With participant consent
**Consent:** Verbal consent obtained at start (see Section 3)

### Full Interview Protocol

See: `/docs/09-interview-guide.md` for complete question flow and probes.

### Interview Structure

**Section 1: Warm-Up (5 minutes)**
- Introductions and rapport building
- Explain interview purpose and structure
- Obtain verbal consent
- Start recording (if consented)

**Section 2: Last-Time Narrative (10 minutes)**
*Key validation section for pain frequency and severity*

**Primary Prompt:**
"Tell me about the last time you took notes for [work/research/a project]. Walk me through exactly what happened, from start to finish."

**Probes:**
- "What tools did you open?"
- "What happened next?"
- "How did you decide where to put that information?"
- "What was frustrating about that?"
- "How much time did that take?"

**Section 3: Current Tools and Workflow (8 minutes)**
*Validates H1 (context-switching), H3 (manual linking), H8 (Windows)*

**Questions:**
- "What tools do you currently use for note-taking?"
- "Why do you use multiple tools instead of just one?"
- "How do you decide what goes in each tool?"
- "How do you link information across tools?"
- "How often do you switch between them in a typical work session?"

**Section 4: Pain Points (8 minutes)**
*Validates all hypotheses, measures severity*

**Questions:**
- "On a scale of 1-10, how painful is your current setup?"
- "What's the most frustrating part?"
- "Can you tell me about a time when you couldn't find something you'd written down?"
- "How do you feel about your notes being stored in the cloud?" (H2 privacy)
- "Have you ever discovered connections between your notes that surprised you?" (H4 insight discovery)
- "What happens when you don't have internet access?" (H5 offline)

**Section 5: Ideal Solution (5 minutes)**
*Uncovers jobs-to-be-done and desired outcomes*

**Questions:**
- "If you could wave a magic wand and design the perfect note-taking tool, what would it do?"
- "What would make your workflow a 10/10?"
- "What features are dealbreakers—what must a tool have for you to even consider it?"

**Section 6: Value and Willingness to Pay (3 minutes)**
*Validates H6 (WTP), H7 (automation), H10 (graph)*

**Concept Card Presentation:**
"Imagine a Windows note-taking app that:
- Automatically suggests connections between your notes
- Works completely offline with optional cloud sync
- Uses AI running on your own computer (no data sent to cloud)
- Visualizes your knowledge as an interactive graph
- Price: $5-15/month

How does this compare to what you use today?"

**Follow-up:**
- "What would you be willing to pay per month for this?"
- "What price would feel too expensive?"
- "What price would feel suspiciously cheap?"
- "Which feature is most valuable to you?"

**Section 7: Closing (1 minute)**
- "Is there anything else about your note-taking workflow I should know?"
- "Would you be interested in beta testing this product?"
- Thank participant, confirm incentive delivery

---

## 3. Consent Script

### Verbal Consent Protocol

See: `/docs/17-consent-script.md` for full legal language and data protection details.

### Interviewer Script (Read at Start of Session)

"Before we begin, I want to make sure you're comfortable with how this interview will work. This is a research study about note-taking practices. The interview will take about 40 minutes. I'd like to record our conversation for transcription purposes, but the recording will be deleted within 90 days and your name will never appear in any reports—we'll use a pseudonym like 'Participant 5' instead.

You can skip any question or stop the interview at any time. Your honest feedback is what we're looking for—there are no right or wrong answers. You'll receive a $25 Amazon gift card within 48 hours regardless of your answers.

Do you consent to participate in this study? And do I have your permission to record this interview?"

**Required:** Wait for clear verbal "yes" to both questions before proceeding.

**If participant declines recording:**
"That's completely fine. I'll take detailed notes instead and you'll still receive the gift card. Let's begin."

---

## 4. On-Call Prompts

Use these prompts during interviews to elicit richer stories and clarify ambiguity.

### Deepening Prompts

**When participant gives surface-level answer:**
- "Can you walk me through exactly what happened?"
- "What did you do next?"
- "Tell me more about that."

**When participant mentions emotion:**
- "How did that make you feel?"
- "Why was that frustrating?"
- "What was going through your mind at that moment?"

**When participant mentions pain point:**
- "How often does that happen?"
- "What do you do as a workaround?"
- "Have you tried to solve this? What did you try?"

**When participant mentions feature/tool:**
- "Why is that important to you?"
- "What would happen if you didn't have that?"
- "How would you prioritize that compared to [other feature]?"

### Clarifying Prompts

**For vague quantities:**
- "When you say 'a lot of time,' roughly how many minutes or hours?"
- "When you say 'often,' do you mean daily, weekly, or monthly?"

**For hypotheticals:**
- "If this took 5 seconds instead of 5 minutes, would that matter?"
- "If this worked offline, would you use it differently?"
- "If this cost $X instead of $Y, how would that change your decision?"

### Time-Saving Redirects

**When participant goes off-topic:**
- "That's really interesting. Let me make a note of that and we can come back to it if we have time. For now, I want to make sure I understand [on-topic question]..."

**When running behind schedule:**
- "I want to be respectful of your time. Let me ask you the most important question about [topic]..."

---

## 5. Concept Card

### Presentation Format

Show this description verbally or on-screen during Section 6 of the interview.

### Concept Description

"Imagine a Windows note-taking app that:
- **Automatically suggests connections** between your notes (like 'you mentioned X in 3 different projects')
- **Works completely offline** with optional cloud sync
- **Uses AI running on your own computer** (no data sent to cloud)
- **Visualizes your knowledge** as an interactive graph
- **Price:** $5-15/month

How does this compare to what you use today?"

### Follow-Up Questions

1. "What stands out to you as most valuable?"
2. "What concerns do you have?"
3. "How likely would you be to try this? (1-5 scale)"
4. "What would you pay per month for this?"
5. "Which feature could we remove and you'd still be interested?"
6. "Which feature is a dealbreaker if we don't include it?"

### Validation Mapping

This concept card validates:
- **H7 (Automation):** "Automatically suggests connections"
- **H2 (Privacy):** "Uses AI running on your own computer (no data sent to cloud)"
- **H5 (Offline):** "Works completely offline"
- **H10 (Graph):** "Visualizes your knowledge as an interactive graph"
- **H6 (WTP):** "Price: $5-15/month" → reaction and stated WTP

---

## 6. Segment Classification Heuristics

Use these heuristics during participant selection to ensure quota balance.

### Research Analyst Rachel

**Indicators:**
- Works at consulting firm, research agency, or corporate strategy role
- Primary use case: Research synthesis, client deliverables
- Mentions: Sensitive client data, confidentiality, regulatory compliance
- Tools: Mix of Notion/OneNote (collaboration) + Obsidian/local files (privacy)
- Pain: Context-switching between client projects

### Freelance Creator Finn

**Indicators:**
- Self-employed, freelancer, or content creator
- Primary use case: Managing multiple client projects simultaneously
- Mentions: Invoicing, project timelines, content pipelines
- Tools: Notion (project management) + Google Docs (drafts) + Obsidian (ideas)
- Pain: Chaos across projects, hard to context-switch

### Graduate Student Gia

**Indicators:**
- Currently in graduate program (Master's or PhD)
- Primary use case: Literature review, research synthesis, thesis writing
- Mentions: Academic papers, citations, reading notes
- Tools: Zotero/Mendeley + Word + Notion + Obsidian
- Pain: Managing 50-200 paper notes, finding connections

### Other Knowledge Workers

**Indicators:**
- Doesn't fit above archetypes cleanly
- Still qualifies (Windows, ≥2 tools, pain ≥6)
- Examples: Product managers, engineers who take design notes, teachers

---

## 7. Data Collection Templates

### Interview Notes Template

Location: `/templates/interview-notes-template.md`

Use this template for every interview to ensure consistency.

### Transcript Summary Template

Location: `/templates/transcript-summary-template.md`

Use this template after transcription to extract key findings.

---

## 8. Instrument Version Control

| Instrument | Version | Last Updated | Changes from Previous |
|------------|---------|--------------|----------------------|
| Screener Survey | 1.0 | 2025-10-31 | Initial version (from Stage 1 draft) |
| Interview Guide | 1.0 | 2025-10-31 | Initial version (from Stage 1 draft) |
| Consent Script | 1.0 | 2025-10-31 | Initial version (new in Stage 2) |
| Concept Card | 1.0 | 2025-10-31 | Initial version (new in Stage 2) |

**Change Log:**
All changes to instruments after deployment must be documented here and in `/docs/24-learnings-and-changes.md`.

---

**Instrument Pack Finalized:**
- Owner: research-lead
- Date: 2025-10-31
- Status: Ready for deployment Nov 1, 2025
