Version: 0.1
Owner: research-lead
Status: Draft
Last updated: 2025-10-31

# Screener Survey

## Overview
Qualification survey to identify participants matching target user criteria for KnowledgeFlow user research. Screens for Windows users, pain severity, and archetype fit.

---

## Survey Introduction

**Title**: User Research on Note-Taking Tools (Windows users, $25 gift card)

**Introduction Text**:

We're conducting research to understand how people manage notes and information for work, study, or personal projects. This brief survey will help us identify participants for 30-40 minute interviews.

Qualified interview participants will receive a $25 gift card as a thank you.

Your responses are confidential and used only for research purposes. The survey takes 3-5 minutes to complete.

---

## Screener Questions

### Q1: Occupation and Context

**Question**: What is your current occupation or primary role?

**Type**: Free text (required)

**Purpose**: Understand participant context, map to archetypes

**Analysis**: Code responses into Rachel (researcher/analyst), Finn (freelancer/creator), or Gia (student) categories

---

### Q2: Note-Taking Frequency

**Question**: How often do you take notes for work, study, or projects?

**Type**: Single choice (required)

**Choices**:
- Daily
- 3-5 times per week
- 1-2 times per week
- Monthly
- Rarely or never

**Disqualify if**: "Rarely or never"

**Purpose**: Ensure active note-taking users (validate H1 context)

**Quota preference**: Daily or 3-5 times per week users preferred

---

### Q3: Tool Count

**Question**: How many different tools or applications do you currently use for taking notes, managing information, or organizing knowledge?

**Type**: Single choice (required)

**Choices**:
- Just one tool
- 2-3 tools
- 4-5 tools
- 6 or more tools

**Disqualify if**: None (but "Just one tool" is lower priority)

**Purpose**: Measure fragmentation (validate H1)

**Quota preference**: 2-3 or 4-5 tools preferred for interviews

---

### Q4: Current Tools List

**Question**: Please list the main tools you use for notes and information management (e.g., Notion, Evernote, OneNote, Google Docs, etc.)

**Type**: Free text (required)

**Purpose**: Understand tool ecosystem, competitive landscape, import needs

**Analysis**: Code for cloud vs local, free vs paid, complexity level

---

### Q5: Pain Severity

**Question**: On a scale of 1 to 10, how satisfied are you with your current note-taking and information management setup?

1 = Extremely dissatisfied, major problems
10 = Completely satisfied, no issues

**Type**: Scale 1-10 (required)

**Disqualify if**: 8, 9, or 10 (too satisfied, insufficient pain)

**Purpose**: Measure pain severity (core validation)

**Quota preference**: 1-4 scores for interviews (higher pain)

**Note**: Inverted scale to reduce bias (asking satisfaction not dissatisfaction)

---

### Q6: Specific Frustrations

**Question**: What is the single most frustrating thing about how you currently take and manage notes?

**Type**: Free text (required)

**Purpose**: Understand top-of-mind pain points, get qualitative context

**Analysis**: Code themes (search, organization, tool switching, privacy, etc.)

---

### Q7: Privacy Importance

**Question**: How important is it to you that your notes are stored locally on your device rather than in the cloud?

1 = Not important at all, cloud is fine
10 = Extremely important, must be local

**Type**: Scale 1-10 (required)

**Purpose**: Validate privacy hypothesis (H2)

**Analysis**: Calculate % scoring 8+ (hypothesis threshold is 40%)

**Quota preference**: Mix of high and medium scorers for interviews

---

### Q8: Offline Needs

**Question**: In the past month, have you experienced situations where you needed to access or work with your notes but didn't have reliable internet access?

**Type**: Single choice (required)

**Choices**:
- Yes, frequently (multiple times)
- Yes, occasionally (1-2 times)
- No, but it would be useful
- No, I always have internet access

**Purpose**: Validate offline importance hypothesis (H5)

**Analysis**: Calculate % reporting offline needs

---

### Q9: Primary Operating System

**Question**: What is your primary operating system for the device where you take most of your notes?

**Type**: Single choice (required)

**Choices**:
- Windows
- macOS
- Linux
- iPad/iOS
- Android
- Chromebook
- Other

**Disqualify if**: Any choice except "Windows"

**Purpose**: Screen for Windows platform requirement (validate H8)

**Critical**: This is a hard disqualifier

---

### Q10: Windows Device Details

**Question**: (Only shown if Q9 = Windows) What type of Windows device do you primarily use?

**Type**: Single choice (required if Q9=Windows)

**Choices**:
- Personal laptop
- Personal desktop
- Company-issued laptop
- Company-issued desktop
- Tablet (Surface or similar)
- Other

**Purpose**: Understand device context, ownership, constraints

---

### Q11: Feature Interest

**Question**: Which of these features would be most valuable to you in a note-taking tool? (Select up to 3)

**Type**: Multiple choice, max 3 selections (required)

**Choices**:
- Automatic linking between related notes
- Visual graph of note relationships
- AI-powered search that understands meaning
- Automatic organization and tagging
- Works fully offline without internet
- Local storage with complete privacy
- Handwriting and voice input support
- Task and calendar integration
- Import from existing tools
- Collaboration and sharing

**Purpose**: Validate feature priorities, automation interest (H7, H9, H10)

**Analysis**: Rank features by selection frequency

---

### Q12: Willingness to Pay

**Question**: If a tool solved your biggest note-taking frustrations, what would you be willing to pay?

**Type**: Single choice (required)

**Choices**:
- I would only use free tools
- Up to $5/month or $30-40 one-time
- $5-10/month or $50-80 one-time
- $10-15/month or $100-120 one-time
- $15-30/month or $150-250 one-time
- More than $30/month or $250+ one-time

**Purpose**: Validate willingness-to-pay hypothesis (H6)

**Analysis**: Distribution across buckets, correlation with pain scores

**Quota preference**: $5-15/month or equivalent one-time range for interviews

---

### Q13: Interview Availability

**Question**: Would you be willing to participate in a 30-40 minute video interview about your note-taking experience? (You'll receive a $25 gift card as a thank you)

**Type**: Single choice (required)

**Choices**:
- Yes, I'm interested
- Maybe, depends on timing
- No, just wanted to share feedback

**Purpose**: Gauge interview willingness

**Follow-up**: If "Yes" or "Maybe", show Q14

---

### Q14: Contact Information

**Question**: Please provide your email address so we can contact you about interview scheduling.

**Type**: Email field (required if Q13 = "Yes" or "Maybe")

**Purpose**: Enable follow-up for interview scheduling

**Privacy note**: "Your email will only be used to contact you about this research and will not be shared or used for marketing."

---

### Q15: Interview Timing Preferences

**Question**: What times would work best for you for a video interview? (Select all that apply)

**Type**: Multiple choice (required if Q13 = "Yes" or "Maybe")

**Choices**:
- Weekday mornings (9am-12pm)
- Weekday early afternoons (12pm-3pm)
- Weekday late afternoons (3pm-6pm)
- Weekday evenings (6pm-9pm)
- Weekend mornings
- Weekend afternoons
- Weekend evenings

**Purpose**: Schedule planning and feasibility assessment

---

### Q16: Time Zone

**Question**: What is your time zone?

**Type**: Dropdown (required if Q13 = "Yes" or "Maybe")

**Choices**: Standard time zone list (America/New_York, America/Chicago, America/Los_Angeles, etc.)

**Purpose**: Scheduling coordination

---

### Q17: Additional Comments

**Question**: Is there anything else you'd like to share about your note-taking experience or frustrations?

**Type**: Free text (optional)

**Purpose**: Capture additional context, identify emergent themes

---

## Survey Closing

**Thank You Message**:

Thank you for completing this survey!

**If qualified for interview**:
We'll review your responses and contact you within 3-5 days if we'd like to schedule an interview. Selected participants will receive a $25 gift card for a 30-40 minute video conversation.

**If not qualified**:
We appreciate your time and feedback. While your profile may not match our current research needs, your input helps us understand the broader note-taking landscape.

**Privacy reminder**:
Your responses are confidential and will be used only for product research purposes.

---

## Disqualification Logic

**Automatic Disqualification** (do not contact for interview):

1. Q2 (Frequency) = "Rarely or never"
2. Q5 (Pain/Satisfaction) = 8, 9, or 10 (too satisfied)
3. Q9 (Primary OS) ≠ "Windows"
4. Q13 (Interview interest) = "No"

**Lower Priority** (contact only if needed to fill quotas):

1. Q3 (Tool count) = "Just one tool" (less fragmentation pain)
2. Q5 (Pain) = 6-7 (moderate pain, not severe)
3. Q12 (Willingness to pay) = "Free only" (low monetization potential)

---

## Quota Targets

**Total screener responses target**: 40-50
**Qualified for interview pool**: 20-25
**Actual interviews conducted**: 10

**Archetype Distribution** (interview selection):
- **Rachel** (researchers, analysts, corporate): 5 interviews (50%)
  - Look for: Corporate email, analytical roles, high tool counts
- **Finn** (freelancers, creators, consultants): 3 interviews (30%)
  - Look for: Freelance/independent roles, mentions of clients or projects
- **Gia** (graduate students, academics): 2 interviews (20%)
  - Look for: Student/academic roles, university affiliations

**Selection Criteria for Interviews**:
1. Meet all qualification criteria (not disqualified)
2. Pain score ≤ 5 preferred (≤ 4 highly preferred)
3. Use 2+ tools (validate fragmentation)
4. Privacy score ≥ 6 for at least 50% of sample
5. Willingness to pay in $5-15 range preferred
6. Archetype diversity to match targets
7. Articulate specific frustrations (not generic)

---

## Data Collection and Analysis

**Platform**: Google Forms or Typeform
**Timeline**: 2025-11-01 to 2025-11-03 (3 days open)
**Expected response rate**: 30-50 responses

**Initial Analysis** (2025-11-03):
1. Remove disqualified responses
2. Calculate descriptive statistics (means, distributions)
3. Code free text responses for themes
4. Score and rank qualified participants
5. Select interview participants based on quotas
6. Contact top candidates for interview scheduling

**Hypothesis Testing**:
- H2 (Privacy): % scoring privacy ≥8 should be ≥40%
- H5 (Offline): % reporting offline needs should be ≥30%
- H6 (WTP): % in $5-15 range should be ≥50% among pain≥7 users
- H8 (Windows): % using Windows (after screening) provides market size signal

---

## Survey Distribution

**Channels**:
- Reddit posts (r/productivity, r/PKMS, r/Zettelkasten, r/GradSchool)
- Twitter/X with hashtags (#PKM #productivity #notetaking)
- LinkedIn groups (research and analyst communities)
- Discord servers (productivity communities)
- University mailing lists

**Message Template**:

"I'm conducting user research on note-taking and knowledge management for Windows users. Looking for 10 people to interview about their experiences (30-40 min, $25 gift card).

If you use Windows and take notes regularly for work/study, please fill out this 3-5 minute survey: [link]

Help improve note-taking tools by sharing your experience!"

---

## Privacy and Ethics

- Responses anonymous unless email provided for interview
- Email addresses stored separately from survey responses
- No PII published or shared
- Participants can withdraw at any time
- Compliance with research ethics standards
- GDPR-compliant data handling if international respondents

---

## Quality Assurance

**Pre-launch**:
- Pilot test with 2-3 volunteers
- Check skip logic and disqualification flows
- Verify email collection and data export
- Test on mobile and desktop browsers

**During collection**:
- Monitor response quality daily
- Check for duplicate submissions (by email or IP)
- Watch for spam or invalid responses
- Adjust promotion strategy if response rate low

**Post-collection**:
- Remove duplicate or invalid responses
- Validate email addresses before outreach
- Document response rate and channel performance
- Archive raw data securely
