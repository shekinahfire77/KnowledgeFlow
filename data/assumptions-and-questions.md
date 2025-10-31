Version: 0.1
Owner: research-lead
Status: Draft
Last updated: 2025-10-31

# Assumptions and Open Questions

## Core Assumptions

These are unvalidated beliefs that underpin the KnowledgeFlow concept. Stage 1 research will test these assumptions.

### User Needs and Behavior
1. **Users prioritize privacy over collaboration**: We assume privacy-conscious users represent a viable market segment willing to trade collaboration features for data sovereignty.

2. **Context-switching is painful enough to motivate change**: We assume the friction of using 3-5 tools creates sufficient pain to justify adopting a new solution.

3. **Users want automation but trust local processing**: We assume users are receptive to AI-powered features as long as processing happens on their device.

4. **Manual organization fails at scale**: We assume users struggle to maintain organized note systems manually over time and would value automated assistance.

5. **Insight discovery is a real problem**: We assume users have valuable connections buried in their notes that current tools fail to surface.

### Market and Business
6. **Windows users represent viable market segment**: We assume at least 40% of target users primarily use Windows devices.

7. **$5-15/month is acceptable price range**: We assume users experiencing significant pain will pay subscription or equivalent one-time purchase in this range.

8. **Local AI is technically feasible**: We assume current local language models can provide sufficient quality for note-taking use cases on typical consumer hardware.

9. **Market timing is right**: We assume the confluence of privacy concerns, local AI capability, and note-taking market maturity creates opportunity now.

10. **Differentiation is sustainable**: We assume local-first + AI combination is defensible and not easily copied by larger competitors.

### Product and Technical
11. **Markdown is acceptable input format**: We assume users will accept markdown or markdown-like syntax rather than rich WYSIWYG editing.

12. **Graph visualization provides value**: We assume visual representation of note relationships is valuable and not just novelty that becomes unused.

13. **Import tools reduce switching friction**: We assume high-quality import from competitors will significantly lower adoption barriers.

14. **Offline-first architecture is advantageous**: We assume offline capability is a feature, not a limitation, for target users.

15. **Desktop-first is viable**: We assume mobile access is nice-to-have but not required for initial market validation.

---

## Open Questions

These questions require investigation through user research or technical exploration.

### User Needs and Pain Points

1. **What is the minimum pain threshold required to motivate switching from current tools?**
   - Is dissatisfaction at 5/10 enough, or do users need to be at 7+/10?
   - What specific pain points create urgency versus general annoyance?

2. **How much time do users actually lose to note-taking friction daily?**
   - Is it 10 minutes, 30 minutes, or 60+ minutes?
   - What activities consume the most time (searching, organizing, switching)?

3. **What triggers the decision to search for a new note-taking tool?**
   - Specific failure incident, accumulation of frustration, peer recommendation?
   - How long is consideration period from search to adoption?

4. **How important is mobile access versus desktop-only?**
   - Is mobile companion app required for adoption or merely nice-to-have?
   - What mobile use cases are critical versus occasional?

5. **Do users actually want to see connections between notes automatically?**
   - Or do they prefer explicit control over relationships?
   - Is automated suggestion helpful or overwhelming?

### Feature Priorities and Tradeoffs

6. **What is minimum viable graph complexity?**
   - How many nodes can graph view handle before becoming overwhelming?
   - What filtering and focus capabilities are essential?

7. **How much automation is helpful versus intrusive?**
   - Where is the line between assistance and loss of control?
   - What level of confidence/accuracy is required for users to trust suggestions?

8. **What file formats and import capabilities are table-stakes?**
   - Which competitors must we support import from?
   - What fidelity is required (perfect vs good-enough migration)?

9. **How do collaboration needs affect privacy-first architecture?**
   - Can users accept no collaboration features initially?
   - What percentage of target market requires team/sharing features?

10. **What citation and reference management features are required?**
    - Is basic linking sufficient or do academic users need full citation management?
    - Can we integrate with Zotero or similar, or must we build native?

### Pricing and Business Model

11. **What is actual willingness to pay across segments?**
    - Does it vary significantly by persona (Rachel vs Finn vs Gia)?
    - What justifies pricing versus free alternatives?

12. **Is subscription or one-time purchase preferred?**
    - How much price premium for one-time purchase versus monthly?
    - Does business model preference vary by segment?

13. **What is acceptable price difference from competitors?**
    - Can we charge more than Notion ($10/mo) or must we be cheaper?
    - Does privacy/offline justify premium pricing?

14. **How many users convert from free trial to paid?**
    - What trial length optimizes conversion?
    - What in-trial behaviors predict conversion?

### Technical Feasibility

15. **What local AI model performance is required?**
    - How fast must inference be to feel responsive (< 1 second, < 5 seconds)?
    - What accuracy level is "good enough" for suggestions?

16. **What are realistic minimum hardware requirements?**
    - Can we support 5-year-old laptops or only recent hardware?
    - What percentage of Windows users have sufficient hardware?

17. **How large can note repositories grow before performance degrades?**
    - 1,000 notes, 10,000 notes, 100,000 notes?
    - What optimizations are required for scale?

18. **Is local-only architecture sustainable long-term?**
    - Will lack of sync become deal-breaker as users accumulate data?
    - When should encrypted sync be added to roadmap?

### Market and Competition

19. **How loyal are users to existing tools?**
    - What would cause them to switch versus stick with imperfect solution?
    - Are free tools (Obsidian, Logseq) insurmountable competition?

20. **How quickly could competitors replicate our differentiators?**
    - Can Obsidian plugins add local AI faster than we can launch?
    - Will Notion improve offline mode before we reach market?

21. **What is realistic market share achievable?**
    - If note-taking market is 50M users, what percentage can we capture?
    - What does 1,000 paid users, 10,000 users, 100,000 users require?

22. **Do users trust new entrants in productivity space?**
    - Is "unknown company" a barrier versus established players?
    - What establishes credibility and trust?

### Go-to-Market

23. **What acquisition channels are most effective?**
    - Organic (SEO, content), community (Reddit, Discord), paid ads?
    - What is realistic customer acquisition cost?

24. **What messaging resonates most strongly?**
    - Privacy angle, automation angle, or offline angle as primary?
    - Does messaging need to differ significantly by persona?

25. **What content demonstrates value most effectively?**
    - Video demos, written case studies, interactive examples?
    - What proof points build credibility?

---

## Research Priority Mapping

### High Priority (Must answer in Stage 1)
- Questions 1, 2, 3, 6, 7, 8, 11, 12, 19
- Critical for go/no-go decision

### Medium Priority (Answer if time permits in Stage 1)
- Questions 4, 5, 9, 10, 13, 14, 22, 23, 24
- Important for positioning and feature prioritization

### Low Priority (Defer to later stages)
- Questions 15, 16, 17, 18, 20, 21, 25
- Technical or post-launch questions

---

## Assumption Testing Plan

Each assumption will be tested through:
1. **Screener survey**: Quantitative baseline across population
2. **Interview questions**: Qualitative exploration of attitudes and behaviors
3. **Analysis**: Compare findings to assumption, determine validated/invalidated
4. **Decision impact**: Pivot if critical assumptions invalidated

---

## Question Resolution Process

As research progresses:
1. Questions answered → Move to "Resolved Questions" section with findings
2. New questions emerge → Add to appropriate priority tier
3. Questions deprioritized → Document rationale for deferral
4. Assumptions validated/invalidated → Update status with evidence

This document is a living artifact updated throughout Stage 1.
