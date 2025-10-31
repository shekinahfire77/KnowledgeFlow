# Codebook: Stage 2 Interview Analysis

Version: 0.1
Owner: research-lead
Status: Draft
Last updated: 2025-10-31

---

## Purpose

This codebook defines the systematic coding schema for qualitative interview data collected in Stage 2. Codes are applied to interview excerpts (quotes) to enable thematic analysis and hypothesis validation.

---

## Coding Process

1. **Read** full interview transcript or detailed notes
2. **Identify** excerpts (1-3 sentence quotes) that express clear themes
3. **Apply** primary code from one of 8 axes below
4. **Apply** optional secondary code if excerpt spans multiple themes
5. **Record** in `/data/coded-excerpts.csv`
6. **Extract** aggregate metrics (pain severity, WTP, etc.) to dedicated CSVs

---

## Coding Axes

We code along 8 dimensions to capture different aspects of user experience and needs.

---

## AXIS 1: Pain Type

Identifies the specific type of friction or frustration experienced.

### PAIN-001: Context Switching

**Definition:**
Losing focus, time, or cognitive flow when switching between note-taking applications during a work session.

**When to apply:**
Participant describes opening multiple apps, copying between them, or mental disruption from tool-switching.

**When NOT to apply:**
Switching between note app and other software (e.g., browser, Slack). Focus on note tool → note tool switching.

**Example quotes:**
> "I have to copy from Notion to Obsidian manually every time I start a new project."
> — P001 (Rachel)

> "I lose my train of thought switching between OneNote and Google Docs."
> — P002 (Finn)

**Related codes:** PAIN-008 (Cognitive Overhead)

---

### PAIN-002: Information Fragmentation

**Definition:**
Inability to locate notes because they are scattered across multiple tools, folders, or systems.

**When to apply:**
Participant describes search failure, not knowing where they put information, or time wasted hunting for notes.

**When NOT to apply:**
Bad search within a single tool (that's tool-specific, not fragmentation).

**Example quotes:**
> "I know I wrote that down somewhere, but I can't remember if it was in Notion or Obsidian or just a text file."
> — P003 (Gia)

> "I spend 10 minutes every morning trying to find yesterday's meeting notes."
> — P004 (Rachel)

**Related codes:** PAIN-008 (Cognitive Overhead), TASK-006 (Knowledge Retrieval)

---

### PAIN-003: Manual Linking

**Definition:**
Tedious, time-consuming effort to manually create bidirectional links or connections between related notes.

**When to apply:**
Participant describes manually adding [[links]], backlinks, tags, or cross-references in tools like Obsidian.

**When NOT to apply:**
Complaints about broken links or link syntax. Focus on the manual effort, not the technical implementation.

**Example quotes:**
> "I spend 15 minutes at the end of each day adding backlinks in Obsidian. It's so tedious."
> — P005 (Finn)

> "I know these three notes are related, but linking them all together takes forever."
> — P006 (Gia)

**Related codes:** AUTO-001 (Auto-Linking Desired)

---

### PAIN-004: Insight Blindness

**Definition:**
Missing patterns, connections, or insights in one's own notes because they're not surfaced automatically.

**When to apply:**
Participant describes discovering connections by accident, or NOT discovering connections they should have seen.

**When NOT to apply:**
Participant has no interest in discovering connections (they just want storage/retrieval).

**Example quotes:**
> "I didn't realize I'd mentioned the same concept in five different client projects until I did a manual search."
> — P007 (Rachel)

> "There are probably patterns in my research notes that I'm completely missing."
> — P008 (Gia)

**Related codes:** AUTO-001 (Auto-Linking Desired), GRAPH-001 (Graph Essential)

---

### PAIN-005: Sync/Cloud Issues

**Definition:**
Offline limitations (can't access notes without internet), sync conflicts, or slow syncing across devices.

**When to apply:**
Participant describes being blocked when offline, dealing with version conflicts, or waiting for sync.

**When NOT to apply:**
General complaints about cloud security (that's PAIN-006). Focus on functional sync problems.

**Example quotes:**
> "My Notion notes don't load without WiFi, which is a problem on flights."
> — P009 (Finn)

> "I get sync conflicts in Evernote all the time when I edit on my phone and laptop."
> — P010 (Rachel)

**Related codes:** PRIV-001 (Privacy Critical) if they want offline for privacy, not just functionality

---

### PAIN-006: Privacy Anxiety

**Definition:**
Worry, fear, or discomfort about storing sensitive notes in cloud-based tools.

**When to apply:**
Participant explicitly mentions data security, confidentiality, regulatory compliance, or distrust of cloud providers.

**When NOT to apply:**
General preference for local storage without security concern (that's just preference).

**Example quotes:**
> "I don't trust Notion with client data. What if they get hacked?"
> — P001 (Rachel)

> "I refuse to put research data in the cloud because of GDPR."
> — P003 (Gia)

**Related codes:** PRIV-001 (Privacy Critical), PAIN-005 (Sync/Cloud Issues)

---

### PAIN-007: Workflow Rigidity

**Definition:**
Tool forces a particular structure, hierarchy, or process that doesn't match participant's natural thinking.

**When to apply:**
Participant describes tool as "too rigid," "forces me to think linearly," or "doesn't flex to my workflow."

**When NOT to apply:**
Missing features (that's TRIG-004). Focus on structural constraints, not feature gaps.

**Example quotes:**
> "Notion's outliner forces me to think hierarchically, but my ideas are more networked."
> — P005 (Finn)

> "I want to just dump thoughts and organize later, but OneNote makes me choose a notebook up front."
> — P006 (Gia)

**Related codes:** GRAPH-002 (Linking Essential)

---

### PAIN-008: Cognitive Overhead

**Definition:**
Mental burden of remembering where notes are stored, which tool to use for what, or how each tool works.

**When to apply:**
Participant describes decision fatigue, mental load, or "having to think too much" about note management.

**When NOT to apply:**
Physical time spent (that's context-switching). Focus on mental effort.

**Example quotes:**
> "Every time I need to take a note, I have to decide: Notion or Obsidian? It's exhausting."
> — P007 (Rachel)

> "I can't keep track of which tool I used for which project."
> — P008 (Finn)

**Related codes:** PAIN-001 (Context Switching), PAIN-002 (Information Fragmentation)

---

## AXIS 2: Frequency Context

How often does the pain occur?

### FREQ-001: Daily

**Definition:** Pain occurs every day or nearly every day.

**Example:** "I deal with this every single morning."

---

### FREQ-002: Weekly

**Definition:** Pain occurs 1-6 times per week, but not daily.

**Example:** "This happens a few times a week when I'm working on multiple projects."

---

### FREQ-003: Monthly

**Definition:** Pain occurs occasionally, a few times per month.

**Example:** "This comes up maybe once or twice a month during crunch time."

---

### FREQ-004: Project-Triggered

**Definition:** Pain spikes during certain project phases or events (e.g., start of new client, research paper deadline).

**Example:** "Every time I start a new client project, I have to reorganize everything."

---

## AXIS 3: Task Type

What is the participant trying to accomplish when they experience pain?

### TASK-001: Research Synthesis

**Definition:** Connecting ideas across multiple sources to create a coherent argument or analysis.

**Example:** "Pulling together 20 papers into one literature review."

**Common for:** Rachel, Gia

---

### TASK-002: Meeting Notes

**Definition:** Capturing and later retrieving information from meetings.

**Example:** "I take notes in 3 meetings per day and then can't find them later."

**Common for:** All segments

---

### TASK-003: Project Planning

**Definition:** Organizing tasks, timelines, and deliverables for a project.

**Example:** "Mapping out deliverables for a 3-month client engagement."

**Common for:** Finn, Rachel

---

### TASK-004: Writing/Drafting

**Definition:** Long-form content creation (blog posts, articles, reports, thesis chapters).

**Example:** "Drafting a case study from my research notes."

**Common for:** Finn, Gia

---

### TASK-005: Reference Storage

**Definition:** Saving articles, links, code snippets, or other reference materials for later use.

**Example:** "Bookmarking 50 research papers and tagging them."

**Common for:** All segments

---

### TASK-006: Knowledge Retrieval

**Definition:** Finding old notes or information from past projects.

**Example:** "Looking up what I learned about X last year."

**Common for:** All segments

---

## AXIS 4: Privacy Stance

How important is data privacy to the participant?

### PRIV-001: Privacy Critical

**Definition:** Will not use cloud tools with sensitive data. Privacy is a dealbreaker.

**Example:** "Absolutely not putting client data in the cloud."

---

### PRIV-002: Privacy Preferred

**Definition:** Prefers local-first but tolerates cloud for convenience. Flexible.

**Example:** "I'd rather have local storage, but I use Google Drive because it syncs."

---

### PRIV-003: Privacy Neutral

**Definition:** Doesn't think about privacy much. Not a decision factor.

**Example:** "I don't really worry about data security for my notes."

---

## AXIS 5: Automation Need

What types of automation does the participant want?

### AUTO-001: Auto-Linking Desired

**Definition:** Wants automatic connection suggestions between related notes.

**Example:** "It should notice I mention 'client X' in 5 different notes and suggest linking them."

**Related codes:** PAIN-003 (Manual Linking), PAIN-004 (Insight Blindness)

---

### AUTO-002: Auto-Tagging Desired

**Definition:** Wants automatic categorization or tagging based on content.

**Example:** "It should automatically tag this as 'research' based on the keywords."

---

### AUTO-003: Auto-Summary Desired

**Definition:** Wants AI-generated summaries of notes or note collections.

**Example:** "Give me a summary of all my notes from this week."

---

### AUTO-004: Task Extraction Desired

**Definition:** Wants automatic detection and extraction of action items or TODOs.

**Example:** "Pull out all the action items from my meeting notes automatically."

---

### AUTO-005: No Automation Interest

**Definition:** Prefers manual control over automatic features.

**Example:** "I want to tag it myself. I don't trust AI to do it right."

---

## AXIS 6: Semantic/Graph Need

How important is visual or semantic organization?

### GRAPH-001: Graph Essential

**Definition:** Explicitly wants visual network or graph view of notes.

**Example:** "I need to see how my ideas connect visually."

**Related codes:** PAIN-004 (Insight Blindness)

---

### GRAPH-002: Linking Essential

**Definition:** Wants bidirectional links (like Obsidian [[links]]) but doesn't need graph visualization.

**Example:** "I love Obsidian's backlinks feature. That's the most important thing."

---

### GRAPH-003: Search Sufficient

**Definition:** Just needs good search. Doesn't care about graphs or linking.

**Example:** "As long as I can find it with search, I don't care about visual connections."

---

## AXIS 7: Switching Trigger

What would cause them to switch to a new tool?

### TRIG-001: Frustration Threshold

**Definition:** Current tool pain has reached a breaking point.

**Example:** "I'm so fed up with Notion that I'd switch to anything better."

---

### TRIG-002: New Job/Role

**Definition:** Life transition creates new needs or workflow changes.

**Example:** "I'm starting grad school next month and need a better system."

---

### TRIG-003: Privacy Event

**Definition:** Security incident or data breach prompted concern.

**Example:** "After my company got hacked, I started thinking about where my notes are stored."

---

### TRIG-004: Feature Gap

**Definition:** Current tool is missing a critical capability.

**Example:** "My tool can't do offline, and I travel a lot."

---

### TRIG-005: Recommendation

**Definition:** Social proof from trusted source.

**Example:** "My friend showed me Obsidian and now I'm curious about alternatives."

---

## AXIS 8: Willingness to Pay (WTP) Band

How much would they pay monthly for a solution?

### WTP-001: Free Only

**Definition:** Will not pay for note-taking tools.

**Example:** "I only use free tools. I wouldn't pay for this."

---

### WTP-002: <$5/month

**Definition:** Budget-conscious, maximum ~$3/month.

**Example:** "Maybe like $3/month, the price of a coffee."

---

### WTP-003: $5-10/month

**Definition:** Mid-range willingness. Sweet spot for many users.

**Example:** "I'd pay $5-10 if it saves me time."

---

### WTP-004: $10-20/month

**Definition:** Premium acceptable if value is proven.

**Example:** "$10-15 is fine if it replaces two tools and works well."

---

### WTP-005: >$20/month

**Definition:** High willingness for demonstrated ROI.

**Example:** "If it saves me an hour a day, I'd pay $30/month easily."

---

## Application Notes

### Coding Workflow

1. **First pass:** Read entire interview, note major themes
2. **Second pass:** Extract 5-10 excerpts per interview (1-3 sentence quotes)
3. **Third pass:** Apply codes to each excerpt
4. **Record:** Add to `/data/coded-excerpts.csv` with format:
   - `alias_id, excerpt_id, raw_excerpt, code_id, secondary_code_id, notes`

### Inter-Coder Reliability

**Self-check:**
- After coding all 10 interviews, wait 48 hours
- Re-code 2 randomly selected interviews without looking at original codes
- Compare: Calculate agreement rate on primary codes
- Target: >80% agreement
- If <80%: Refine code definitions, re-code all

**Log:**
Document reliability check results in `/docs/24-learnings-and-changes.md`

---

## Code Frequency Tracking

After coding all interviews, compute:

**For each code:**
- Number of participants who mentioned (N out of 10)
- Number of excerpts tagged with this code
- Percentage of total excerpts

**Export to:** `/data/coding-schema.csv` with frequency columns

---

## Example Coded Excerpt

**Raw excerpt:**
> "I spend probably 30 minutes every morning just trying to remember what I was working on across Notion, Obsidian, and my email drafts. It's like doing mental archaeology."

**Coding:**
- **Primary code:** PAIN-001 (Context Switching)
- **Secondary code:** PAIN-008 (Cognitive Overhead)
- **Frequency context:** FREQ-001 (Daily) — "every morning"
- **Task type:** TASK-003 (Project Planning) — "what I was working on"
- **Notes:** Strong pain indicator, quantified time (30 min), vivid metaphor

**CSV row:**
```csv
P001,E001,"I spend probably 30 minutes every morning just trying to remember what I was working on across Notion, Obsidian, and my email drafts.",PAIN-001,PAIN-008,"Context switching + cognitive overhead, daily 30min"
```

---

**Codebook Version:** 0.1
**Created:** 2025-10-31
**Total codes:** 40 (across 8 axes)
**Status:** Ready for Stage 2 coding (Nov 12-13, 2025)
