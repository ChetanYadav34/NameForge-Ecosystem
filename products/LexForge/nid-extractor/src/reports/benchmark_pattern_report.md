# Benchmark Pattern Extraction Report

## 1. Objective
To extract morphological patterns from a corpus of top startups and establish mathematical definitions of premium naming structures, avoiding subjective guessing.

## 2. Benchmark Corpus
**SaaS**: Notion, Linear, Figma, Vercel, Datadog, Snowflake
**Fintech**: Stripe, Plaid, Ramp, Brex, Mercury, Robinhood
**AI**: OpenAI, Anthropic, Perplexity, Cursor
**Consumer**: Uber, Airbnb, Canva

## 3. Pattern Extraction

### Length Distribution
- **Average Length**: 6.4 characters
- **Median Length**: 6 characters
- **Shortest**: 4 (Ramp, Brex, Uber)
- **Longest**: 10 (Anthropic, Perplexity)
- **Insight**: Premium names cluster heavily in the **4-7 character range**. Anything >8 is usually a compound word (Snowflake) or a classical Greek/Latin root (Anthropic).

### Syllable Distribution
- **Average Syllables**: 2.3
- **1 Syllable**: Stripe, Plaid, Ramp, Brex (Common in Fintech/speed).
- **2 Syllables**: Notion, Linear, Figma, Vercel, Cursor, Uber, Canva.
- **Insight**: **2 syllables** is the gold standard for SaaS and Consumer. 

### Vowel vs Consonant Ratio
- Stripe (2V, 4C = 0.5)
- Figma (2V, 3C = 0.66)
- Notion (3V, 3C = 1.0)
- Linear (3V, 3C = 1.0)
- OpenAI (4V, 2C = 2.0)
- **Average Ratio (V/C)**: ~0.7 to 1.0.
- **Insight**: Premium names have a healthy balance. They do not stack 4 consonants (like `Rahq`) or 4 vowels (like `Daio`).

### Ending Distribution
- **Vowel Endings**: `a` (Figma, Canva), `o` (Datadog has `o` inside but ends in `g`, let's check endings. No `o` ending here). `i` (OpenAI).
- **Consonant Endings**: `r` (Linear, Vercel, Cursor, Uber), `n` (Notion), `x` (Brex), `p` (Ramp).
- **Silent E**: `e` (Stripe, Snowflake).
- **Insight**: Strong endings in `r`, `n`, `x`, `p` or open vowels like `a`. Noticeable absence of artificially forced `-hq`, `-io`, or `-ify` suffixes in the absolute top tier.

### Consonant Clusters
- **Valid Clusters**: `Str` (Stripe), `Pl` (Plaid), `Br` (Brex), `sn` (Snowflake). These are natural English onset clusters.
- **Invalid Clusters**: None of these companies use unpronounceable medial or coda clusters like `lt` inside `Helt` or `nl` inside `Anly`.

## 4. Derived Rules for Clunkiness & Aesthetics

**Aesthetic Rewards:**
- Length 4-7 characters (+ Premium Feel).
- Syllable count 2 (+ Memorability).
- Vowel/Consonant ratio between 0.6 and 1.2 (+ Visual Cleanliness).
- Natural English consonant clusters or CVCV patterns.

**Clunkiness Penalties (Veto Triggers):**
- V/C ratio < 0.4 (Too many consonants).
- V/C ratio > 2.0 (Too many vowels).
- Medial clusters not native to English (e.g., `hq`, `nl`, `ioe`).
- Ends with artificial tech suffixes (`ify`, `hq`) unless attached to a 4+ letter valid English root.
