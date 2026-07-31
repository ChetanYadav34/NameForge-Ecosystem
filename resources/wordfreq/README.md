# Wordfreq Dataset

- **Provider**: wordfreq (Python package)
- **Version**: 3.1.1
- **Language**: English (en)
- **Scale**: Zipf

## Lexical Filter

To ensure high-quality dataset tokens, a strict lexical filter is applied during generation. The default filter regex is:

```python
LEXICAL_FILTER_REGEX = re.compile(r"^[A-Za-z][A-Za-z'-]*$")
```

This successfully:
- Keeps valid lexical tokens (e.g. `computer`, `mother-in-law`, `can't`, `you're`)
- Removes numbers, digits, symbols, emojis, and noise (e.g. `0`, `0.000`, `###`, `@home`)

## Deterministic Output

- All generated frequencies are exported to `wordfreq-en.csv`.
- The dataset is strictly alphabetically sorted before export to guarantee deterministic output.
- The output file uses `UTF-8` encoding.

## Generation / Regeneration Workflow

To regenerate the dataset from scratch, run the exporter script from this directory:

```bash
python export_wordfreq.py
```

> **WARNING**: The `wordfreq-en.csv` file is automatically generated. Do not edit it manually.
