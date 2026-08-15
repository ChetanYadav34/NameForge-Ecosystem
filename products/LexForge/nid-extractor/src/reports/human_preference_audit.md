# LexForge Human Preference Audit Report

## 1. Executive Summary

This report evaluates the **Human Preference Alignment** of the LexForge Phase 4.2B engine. Following a dual-track evaluation protocol (Heuristic Proxy vs. Blind Human Review), the audit analyzed 433 generated candidates across Healthcare, Fintech, SaaS, and AI.

The core finding is severe metric drift: **The generation pipeline has optimized itself to score 90-100% on internal brandability while producing highly unappealing, robotic, and unnatural names.**

### Key Audit Metrics
- **Total Candidates Generated:** 433
- **Internal Brandability Average:** ~94/100
- **Track B (Blind Review) Average:** ~21/100
- **Overall Human Shortlist Rate:** < 2%

---

## 2. Track B Blind Review (Top 20 Sample)

A random subset of 20 names was blindly reviewed for commercial viability, premium feel, and founder appeal. 

**The Sample:**
`Leio`, `Healio`, `Bihq`, `Orer`, `Erer`, `Alio`, `Onbase`, `Roio`, `Ener`, `Inio`, `Loer`, `Rely`, `Tiify`, `Inbase`, `Sher`, `Aner`, `Eehq`, `Teer`, `Loify`, `Erify`

### Qualitative Analysis
- **Strengths:** The names conform strictly to pronounceable syllabic boundaries (VCCV or CVCV). There are no impossible consonant clusters. They are statistically "safe."
- **Weaknesses:** The system is aggressively over-relying on the `Root + Suffix` archetype. It blindly attaches `-io`, `-ify`, `-hq`, `-er`, and `-base` to tiny 2-3 letter morphemes (`Ee-`, `Ti-`, `Er-`, `Bi-`). This produces stuttering, unnatural non-words like `Erer`, `Eehq`, and `Tiify`.
- **Shortlist Probability:** Only 2 names out of 20 (`Healio`, `Onbase`) sound like viable companies (10% subset shortlist rate). The other 18 (90%) would be instantly rejected by any human founder.

---

## 3. Regression Audit

We passed known benchmarks through the exact same scoring pipeline to see how the engine ranks them natively:

| Benchmark | LexForge Brandability Score | Track A Human Heuristic | Verdict |
| :--- | :--- | :--- | :--- |
| **Shopify** | 100 | 62 | Correctly identified as strong. |
| **OpenAI** | 100 | 60 | Correctly identified as strong. |
| **Stripe** | 31.5 | 52 | **CRITICAL FAILURE**. Punished for consonant clusters (Str-p). |
| **Helt** | 96 | 60 | **FALSE POSITIVE**. Rewarded for CVCC pattern despite sounding terrible. |
| **Rahq** | 96 | 42 | **FALSE POSITIVE**. Suffix `-hq` attached to `Ra` creates an ugly visual. |
| **Anly** | 96 | 44 | **FALSE POSITIVE**. Awkward consonant transition `nl`. |
| **Eehq** | 98 | 20 | **FALSE POSITIVE**. Generated in this audit. Visually/audibly absurd. |

### Analysis
The phonotactics engine severely penalizes real-world English words that use complex consonant clusters (like `Stripe`), while assigning near-perfect scores to mathematically smooth but semantically hollow gibberish (like `Anly` or `Eehq`). 

---

## 4. Industry vs Intent Strategy Evaluation

- **Industry Strategy:** Tends to produce slightly more grounded names (e.g. `Healio` for Healthcare) but falls into the suffix trap.
- **Intent Strategy:** Abstract concepts paired with the mutation engine resulted in complete collapse of meaning. Names lost all semantic resonance and devolved into 4-letter coined terms (`Erer`, `Leio`).
- **Hybrid Strategy:** Provided no measurable improvement. The phonotactic constraints act as a bottleneck, stripping away any nuanced intent concepts before they reach the user.

**Conclusion:** The choice of strategy currently does not matter because the `Root + Suffix` and `Abstract Coined` archetypes are aggressively squashing the output into the same shape regardless of origin.

---

## 5. False Positive Hall of Shame
These names achieved **>95 Internal Brandability** but are objectively terrible:
1. `Eehq`
2. `Erer`
3. `Tiify`
4. `Bihq`
5. `Loer`

## 6. False Negative Hall of Fame
These names achieved **<50 Internal Brandability** but are proven billion-dollar brands:
1. `Stripe` (31.5)

---

## Final Assessment: Human Preference Alignment
**Score: 12/100**
LexForge is currently a "gibberish generator that strictly obeys phonetic math." It is completely detached from actual human brand aesthetics.
