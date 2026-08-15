# LexForge Scoring Calibration Report

## 1. Overview
This report evaluates the accuracy of LexForge's internal metric calculations—specifically Brandability, Availability Risk, and Mutation Effectiveness—and compares them to Track A heuristics and Track B human blind reviews.

---

## 2. Metric Drift & Correlation Analysis

We measured the Pearson correlation between the Internal Brandability Score and Human Preference.

### Correlation Matrix
- **Brandability vs. Track A Heuristic:** `r = -0.15` (Slightly Negative)
- **Brandability vs. Track B Blind Review:** `r = -0.42` (Negative)
- **Pronounceability vs. Track B Blind Review:** `r = -0.08` (Negligible)

**Finding:** The internal Brandability score is *inversely correlated* with actual human preference. The higher the system scores a name, the more likely a human is to reject it. The system is overfitting to smooth CV sequences and penalizing natural linguistic textures.

---

## 3. Availability Threshold Calibration

During the Phase 4.3 and 4.4 audits, the Availability Intelligence layer returned a massive skew:
- **High Risk:** 431
- **Medium Risk:** 0
- **Low Risk:** 2

### Root Cause Analysis
The fuzzy normalization and Levenshtein threshold in `company_checker.ts` are far too aggressive. 
- The system currently triggers `SIMILAR_CONFLICT` (which maps to High Risk) if a generated candidate shares 3-4 letters sequentially with *any* of the 10,000+ companies in the dataset.
- Because our candidates are extremely short (4-6 letters) and use the most common English prefixes/suffixes, they mathematically collide with almost every tech company in existence.

### Recommendations
1. **Reduce Fuzzy Sensitivity:** Increase the minimum Levenshtein edit distance required for a "similar" match.
2. **Implement Vowel Insensitivity Carefully:** If we strip vowels, `Erer` and `Roer` become `rr`, which matches too many things.
3. **Target Distribution:** A healthy system should aim for:
   - High Risk: 20-30%
   - Medium Risk: 40-50%
   - Low Risk: 20-30%

---

## 4. Mutation Effectiveness Audit

The Phase 4.2B Mutation Engine was introduced to inject novelty and avoid collisions. 

### Mutation Metrics
- **Total Mutations Triggered:** 7 (out of 433 candidates)
- **Mutation Win Rate:** 0%
- **Mutation Failure Rate:** 100% (7 losses)
- **Candidate Survival Rate:** 98.3% (426 candidates bypassed mutation or reverted)
- **Average Mutation Delta:** -3.1 points per mutation

### Finding
The Mutation Engine is currently a completely useless component. 
1. It rarely triggers successfully.
2. When it does trigger, the `validateCandidate` or `scoreBrandability` pipeline immediately punishes the mutated result, ensuring it loses to its unmutated parent.
3. It adds zero meaningful value to the pipeline.
