# Chart: [Chart Name]

**File:** /data/artifacts/[filename].png
**Created:** YYYY-MM-DD
**Created by:** research-lead
**Type:** [Bar Chart / Histogram / Scatter Plot / Pie Chart / Box Plot / Line Chart]
**Tool Used:** [Excel / Google Sheets / Python matplotlib / R ggplot2 / Other]

---

## Purpose

**Research Question:**
[What question does this chart answer? Be specific.]

**Example:**
"What is the distribution of pain severity scores among interview participants? Does pain cluster at high severity or spread across the scale?"

---

## Data Source

### Source Files

**CSV File(s):**
- Primary: /data/[filename].csv
- Secondary (if applicable): /data/[filename2].csv

**Rows Used:** [All / Filtered subset - specify filter]

**Date Range:** [If time-series data - e.g., "Nov 6-11, 2025"]

**Sample Size:** N = [##] participants / [###] data points

---

### Variables

**X-axis:**
- Variable name: [e.g., "Pain Severity Score"]
- Units: [e.g., "1-10 scale"]
- Data type: [Continuous / Discrete / Categorical]

**Y-axis:**
- Variable name: [e.g., "Number of Participants"]
- Units: [e.g., "Count"]
- Data type: [Continuous / Discrete / Categorical]

**Series/Groups (if applicable):**
- [e.g., "Segment (Rachel, Finn, Gia, Other)"]
- [Color-coded or pattern-coded]

**Filters Applied:**
- [e.g., "Excluded participants who didn't answer pain severity question (N=0)"]
- [e.g., "Limited to interviews completed Nov 6-11"]

---

## Key Findings

### Observation 1

**Finding:**
[What does the chart show? - e.g., "Median pain severity is 8/10, well above target threshold of 7/10"]

**Supporting Data:**
[Specific values - e.g., "8 of 10 participants (80%) rated pain 7-10/10"]

**Implication:**
[What does this mean for research questions? - e.g., "Strong validation of H1: Pain is severe and frequent"]

---

### Observation 2

**Finding:**
[Another insight - e.g., "Pain scores cluster at 8-9/10; few participants below 7"]

**Supporting Data:**

**Implication:**

---

### Observation 3

**Finding:**

**Supporting Data:**

**Implication:**

---

## Statistical Notes

**Central Tendency:**
- Median: [Value]
- Mean: [Value]
- Mode: [Value]

**Dispersion:**
- Range: [Min] to [Max]
- Interquartile Range (IQR): [25th percentile] to [75th percentile]
- Standard Deviation: [Value] (if applicable)

**Distribution Shape:**
- [Normal / Skewed left / Skewed right / Bimodal / Uniform]
- [Description - e.g., "Right-skewed with long tail toward lower scores"]

**Outliers:**
- [Identified outliers - e.g., "P007 rated pain as 4/10, significantly below median"]
- [Explanation if known - e.g., "P007 is new to note-taking; hasn't accumulated enough notes to feel pain yet"]
- [Treatment: Included / Excluded from analysis]

---

## Interpretation

### What This Means for Research Questions

[Connect findings to specific hypotheses or thresholds]

**Example:**
"This chart validates Threshold 2 (Pain severity ≥7/10 median) with high confidence. The median of 8/10 exceeds the target, and 80% of participants rate pain as high (7-10), also exceeding Threshold 3 (≥60%). This confirms that the problem is severe enough to warrant a solution."

**Threshold/Hypothesis Validation:**
- [Threshold/Hypothesis ID]: [Met / Not Met]
- [Evidence from chart]

---

### Segment Differences (if applicable)

[If chart shows segment breakdown, note differences]

**Example:**
"Rachel segment shows highest pain (median 9/10) compared to Finn (8/10) and Gia (7/10). This aligns with persona hypothesis that Rachel experiences acute context-switching pain due to client confidentiality requirements."

---

### Unexpected Findings

[Anything surprising or contrary to expectations?]

**Example:**
"Expected Gia (students) to have lower pain, but median was 7/10, same as other segments. Pain is more universal than hypothesized."

---

## Chart Configuration

### Visual Elements

**Chart Title:** "[Exact title as appears on chart]"

**Axis Labels:**
- X-axis: "[Label text]"
- Y-axis: "[Label text]"

**Legend:**
- Position: [Top-right / Bottom-right / None]
- Labels: [List legend items if applicable]

**Colors:**
- [Color 1]: [Hex code or name - e.g., "#4A90E2 (Blue) - Rachel segment"]
- [Color 2]: [Hex code or name - e.g., "#F5A623 (Orange) - Finn segment"]
- [Color 3]: [Hex code or name]

**Gridlines:**
- Horizontal: [Yes / No]
- Vertical: [Yes / No]
- Style: [Solid / Dashed / Light gray]

---

### Data Labels

**Labels shown:** [Yes / No / On bars only / On points only]

**Format:** [e.g., "Count (N=X)" or "Percentage (X%)"]

---

### Chart-Specific Settings

**For Histogram:**
- Bin width: [e.g., "1 point on 1-10 scale"]
- Number of bins: [#]

**For Scatter Plot:**
- Point size: [e.g., "5px"]
- Regression line: [Yes / No]

**For Bar Chart:**
- Bar width: [e.g., "0.8"]
- Gap between bars: [e.g., "0.2"]

**For Pie Chart:**
- Start angle: [e.g., "90 degrees"]
- Exploded slices: [Which slices, if any]

---

## Related Charts

[Link to other charts that provide complementary views]

**Related Chart 1:** [Chart name - e.g., "WTP Distribution"]
- **File:** /data/artifacts/[filename].png
- **Relationship:** [How they relate - e.g., "Pain severity correlates with WTP; high pain (8-10) → higher WTP ($8-15/month)"]

**Related Chart 2:** [Chart name]
- **File:**
- **Relationship:**

---

## Referenced In

[Where is this chart cited in documentation?]

- `/docs/21-analysis-report.md`: Section [#] - [Section name]
- `/docs/22-validation-dashboard.md`: [Line reference or section]
- `/docs/23-decision-memo.md`: [Section]

---

## Methodology Notes

### Data Preparation

[How was data cleaned or transformed before charting?]

**Steps:**
1. [Step 1 - e.g., "Loaded pain-severity-scores.csv"]
2. [Step 2 - e.g., "Filtered for non-null values (all 10 participants answered)"]
3. [Step 3 - e.g., "Calculated median and IQR"]
4. [Step 4 - e.g., "Created histogram with bin width = 1"]

**Data Quality Issues:**
- [Issue 1 if any - e.g., "P004 initially entered 85 instead of 8.5; corrected after clarification"]
- [Issue 2]

---

### Chart Creation Process

**Tool:** [Excel / Google Sheets / Python / R]

**Script/Formula (if applicable):**
```
[Code snippet or Excel formula if reproducibility needed]

Example for Python:
import matplotlib.pyplot as plt
import pandas as pd

df = pd.read_csv('/data/pain-severity-scores.csv')
plt.hist(df['pain_score_1to10'], bins=10, edgecolor='black')
plt.xlabel('Pain Severity (1-10)')
plt.ylabel('Number of Participants')
plt.title('Pain Severity Distribution (N=10)')
plt.savefig('/data/artifacts/pain-distribution.png')
```

---

## Caveats and Limitations

[Important notes about interpretation or limitations of the chart]

**Limitations:**
1. [Limitation 1 - e.g., "Small sample size (N=10) means individual outliers have large impact"]
2. [Limitation 2 - e.g., "Self-reported pain scores may be inflated (participants recruited from pain-aware communities)"]
3. [Limitation 3 - e.g., "Pain severity is subjective; one person's '7' may be another's '9'"]

**Assumptions:**
- [Assumption 1 - e.g., "Pain severity scale is linear and evenly spaced"]
- [Assumption 2 - e.g., "Participants understood the 1-10 scale consistently"]

---

## Revisions

| Version | Date | Changes | By |
|---------|------|---------|-----|
| 1.0 | YYYY-MM-DD | Initial chart created | research-lead |
| [1.1] | [Date] | [What changed - e.g., "Updated to include Gia segment data"] | [Who] |

---

**Chart Documentation Version:** 1.0
**Last Updated:** [YYYY-MM-DD]
**Owner:** research-lead
