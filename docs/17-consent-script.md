# Informed Consent Script

Version: 0.1
Owner: research-lead
Status: Draft
Last updated: 2025-10-31

---

## Informed Consent for User Research Interview

### Purpose

You are being invited to participate in a research study about note-taking and knowledge management workflows. This study is being conducted to understand how people currently manage information and what improvements they would find valuable.

### What You'll Do

- Participate in a 35-40 minute video interview
- Answer questions about your current note-taking practices
- Share experiences and opinions about tools you use
- Optionally, the interview may be recorded (audio/video)

### What We'll Collect

- Your responses to interview questions
- Audio and/or video recording (only with your permission)
- Notes taken during the interview
- Your segment classification (e.g., "researcher," "student")

We will NOT collect unnecessary personal information. Your name and email will be replaced with a pseudonym (P###) in all research materials.

### How We'll Use Your Data

- Product development and validation
- Internal research reports
- Anonymized quotes may appear in documentation (no names/identifying details)
- Data will NOT be sold or shared with third parties

### Data Storage and Security

- Recordings stored encrypted and password-protected
- Only research team has access
- Raw recordings deleted within 90 days
- Anonymized notes and quotes retained for product development

### Your Rights

- Participation is voluntary
- You can skip any question
- You can stop the interview at any time
- You can request deletion of your data within 14 days of the interview
- You can review a summary of your interview transcript upon request

### Recording Policy

With your permission, we may record this interview (audio and/or video) for transcription purposes. Recordings are deleted within 90 days. You can decline recording and still participate.

**Do we have your permission to record this interview?** [ Yes / No ]

### Incentive

You will receive a $25 Amazon gift card via email within 48 hours of completing the interview, regardless of your answers.

### Contact

If you have questions about this study or your data:
- Email: research-lead@knowledgeflow.local
- Study ID: KF-Stage2-2025

### Data Protection (GDPR/CCPA Compliance)

**Data Controller:** KnowledgeFlow Research Team
**Legal Basis:** Consent for research purposes
**Your Rights:** Access, rectification, erasure, portability, restriction, objection

**To exercise your rights:**
Email research-lead@knowledgeflow.local with your Participant ID (P###) within 14 days of your interview.

---

## Verbal Consent Script (for Interviews)

### Interviewer Reads at Start of Session

**REQUIRED: Read this verbatim before starting the interview.**

> "Before we begin, I want to make sure you're comfortable with how this interview will work. This is a research study about note-taking practices. The interview will take about 40 minutes. I'd like to record our conversation for transcription purposes, but the recording will be deleted within 90 days and your name will never appear in any reports—we'll use a pseudonym like 'Participant 5' instead.
>
> You can skip any question or stop the interview at any time. Your honest feedback is what we're looking for—there are no right or wrong answers. You'll receive a $25 Amazon gift card within 48 hours regardless of your answers.
>
> Do you consent to participate in this study? And do I have your permission to record this interview?"

**Wait for clear verbal "yes" to both questions before proceeding.**

### If Participant Consents to Both

**Interviewer says:**
> "Great, thank you. I'm starting the recording now. For the record, can you please state your first name and confirm that you consent to participate and to being recorded?"

**Participant responds on recording.**

**Interviewer says:**
> "Thank you. Let's begin."

### If Participant Declines Recording

**Interviewer says:**
> "That's completely fine. I'll take detailed notes instead and you'll still receive the gift card. Do you still consent to participate in the interview?"

**Wait for "yes."**

**Interviewer says:**
> "Perfect. Let's begin."

### If Participant Declines Participation

**Interviewer says:**
> "I completely understand. Thank you for your time. Have a great day!"

**End call. Do not send incentive.**

---

## Survey Checkbox Text (for Screener)

Include this consent checkbox at the end of the screener survey:

```
☐ I consent to participate in this research study. I understand my responses will be used for product research, my data will be anonymized, and I can withdraw at any time. I have read the consent information above.
```

**Required:** Participants must check this box to submit the screener.

**Consent text to display above checkbox:**

```
By submitting this survey, you consent to:
- Your responses being used for product research
- Being contacted for a follow-up interview if selected
- Your data being stored anonymously

You have the right to:
- Withdraw from the study at any time
- Request deletion of your data within 14 days
- Decline the interview even after completing this survey

Your email will only be used to contact you about this study and will not be shared with third parties.
```

---

## Withdrawal Process

### During the Interview

If a participant wants to stop mid-interview:

**Interviewer says:**
> "Of course, no problem at all. Thank you for your time. Would you still like to receive the gift card for the portion you completed?"

**If participant completed ≥20 minutes:**
- Send half incentive ($12.50) as goodwill gesture
- Delete recording immediately
- Do not use any data from the interview

**If participant completed <20 minutes:**
- Do not send incentive
- Delete recording immediately
- Do not use any data

### After the Interview (Data Deletion Request)

If a participant requests data deletion within 14 days:

**Response email:**

```
Subject: Data Deletion Confirmation

Hi [Name],

We've received your request to delete your interview data from our study.

**Completed:**
✓ Recording deleted from all storage (if applicable)
✓ Interview notes deleted
✓ Your email removed from our contact list
✓ Participant ID (P###) retired and not reused

**Note:** Your incentive payment will not be affected—you can keep the gift card.

**Confirmation:** All data associated with your participation has been permanently deleted as of [Date].

If you have any questions, please let me know.

Best,
Research Team
KnowledgeFlow
```

**Actions:**
1. Delete recording from local encrypted folder
2. Delete interview notes file
3. Remove from respondents-master.csv
4. Remove from all analysis CSV files
5. Log deletion in /data/deletion-log.md
6. Update interview count in analysis (note: "N=9 after 1 withdrawal")

---

## Special Considerations

### Minors (Under 18)

This study excludes minors. Screener includes age verification question.

If a participant reveals during the interview that they are under 18:
- Stop the interview immediately
- Thank them for their time
- Do not send incentive
- Delete all data
- Do not use responses

### Vulnerable Populations

Graduate students are included but not considered vulnerable in this context (research is about note-taking, not academic performance or mental health).

If a participant becomes distressed during the interview:
- Offer to pause or stop
- Remind them they can skip questions
- Do not press on sensitive topics
- Prioritize participant wellbeing over data collection

### Language Barriers

Interviews conducted in English only.

If during the interview it becomes clear the participant has difficulty understanding:
- Slow down and simplify language
- Allow extra time
- Offer to reschedule with a written question list
- If communication is severely impaired, offer to end gracefully and still provide incentive

---

## Consent Documentation

### Storage

**Local file (not committed to repo):**
`/consent-records/P###-consent-YYYY-MM-DD.txt`

**Contents:**
```
Participant ID: P###
Interview Date: YYYY-MM-DD
Consent to participate: Yes
Consent to recording: Yes/No
Timestamp: YYYY-MM-DDTHH:MM:SSZ
Interviewer: research-lead
```

**Retention:** 1 year, then delete

### Verbal Consent Recording

First 30 seconds of each recording includes verbal consent.

If participant withdraws, delete entire recording including consent portion.

---

## Compliance Checklist

Before each interview, verify:

- [ ] Consent script printed or accessible on screen
- [ ] Participant has received consent form via email (optional but recommended)
- [ ] Recording software ready to start after consent obtained
- [ ] Backup note-taking method ready (if participant declines recording)
- [ ] Incentive delivery method confirmed (email address on file)

After each interview, verify:

- [ ] Consent documented (verbal on recording or in written log)
- [ ] Recording stopped and saved to encrypted folder (if applicable)
- [ ] Participant thanked and incentive timeline confirmed
- [ ] Interview notes anonymized (P### used, no real name)

---

**Consent Protocol Approved:**
- Owner: research-lead
- Date: 2025-10-31
- Legal Review: Pending (if required by jurisdiction)
