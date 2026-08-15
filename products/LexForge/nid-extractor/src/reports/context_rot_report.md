# LexForge Context Rot Assessment

## 1. Overview
This report documents the "Context Rot" currently infecting the LexForge engine. Context Rot occurs when a system drifts from its original commercial objective (generating premium, sellable startup names) to optimizing arbitrary, self-referential mathematical rules.

## 2. Business Model Alignment Audit
**Objective:** Evaluate if the architecture still supports the Free (Generation) vs Paid (Availability) product tiers.
**Status:** **FAILING**
- The Generation Tier (Free) is broken because the engine outputs un-sellable robotic gibberish (`Eehq`, `Tiify`).
- The Availability Tier (Paid) is broken because it incorrectly flags 99.5% of names as "High Risk," thereby destroying the value proposition of paying for "safer selections."

---

## 3. Critical Drift Issues

### Issue 1: Phonotactic Over-Optimization
- **Root Cause:** The phonotactics engine and structural success calculations heavily reward VCCV and CVCV strings, regardless of whether those strings form natural English morphemes. It punishes complex consonant clusters (like in `Stripe`), pushing the engine to generate `Erer` and `Loio`.
- **Severity:** **HIGH**
- **Recommended Fix:** Redesign the Brandability scoring to reward familiarity, semantic density, and linguistic "weight." Implement penalties for repetitive vowels (`Ee-`) or awkward suffix chains (`-hq`, `-ify` applied to 2-letter roots).
- **Priority:** CRITICAL

### Issue 2: The Suffix Trap
- **Root Cause:** The `Root + Suffix` archetype limits suffix combinations without assessing visual or phonetic aesthetics. 
- **Severity:** **HIGH**
- **Recommended Fix:** Suffixes must be intelligently mapped to compatible roots (e.g., `-ify` should only attach to roots of 4+ letters ending in consonants, not `Tiify` or `Laify`).

### Issue 3: Over-penalization of Novelty
- **Root Cause:** The engine fears collisions, so it mutates/generates absurdities to guarantee uniqueness. Then the availability checker STILL flags them as High Risk because they share 3 letters with something else.
- **Severity:** **MEDIUM**
- **Recommended Fix:** Recalibrate the fuzzy matcher. Accept that distinctiveness doesn't mean "unpronounceable alien word."

---

## 4. Final KPI Dashboard

| Metric | Score | Note |
| :--- | :--- | :--- |
| **Architecture Health Score** | 35/100 | Stable code, broken logic. |
| **Human Preference Alignment** | 12/100 | Generating robotic non-words. |
| **Commercial Readiness Score** | 5/100 | Unsellable to founders. |
| **Human Shortlist Rate** | 2% | 98% instant rejection rate. |
| **Mutation Win Rate** | 0% | Completely ineffective. |
| **Availability Calibration** | 10/100 | Massive High-Risk skew. |
| **Context Rot Severity** | **HIGH** | The system is optimizing for its own internal math, completely disconnected from reality. |

---

## 5. Final Recommendation

**Recommendation: 3. Redesign scoring architecture before Phase 5.**

Do NOT proceed to Phase 5. Do NOT deploy Phase 4.4 to production. 

The audit proves that the engine is currently a "gibberish generator." The core intelligence graph and archetypes are sound, but the *Brandability and Phonotactic scoring algorithms* have suffered severe context rot. If we deploy this, users will instantly churn because the names are objectively terrible (`Eehq`, `Tiify`, `Loer`).

We must perform a dedicated calibration phase (Phase 4.5: Aesthetic Calibration) to fix the Phonotactic engine, the Suffix logic, and the Availability thresholds before moving forward.
