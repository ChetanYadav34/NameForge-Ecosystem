import csv
import re
from wordfreq import iter_wordlist, zipf_frequency

# Configurable Lexical Filter
# Default: Starts with a letter, optionally followed by letters, hyphens, or apostrophes.
LEXICAL_FILTER_REGEX = re.compile(r"^[A-Za-z][A-Za-z'-]*$")

def is_valid_token(word):
    return bool(LEXICAL_FILTER_REGEX.match(word))

def export_wordfreq():
    # wordfreq provides iter_wordlist to iterate over words in a language.
    # iter_wordlist('en') gives words in descending order of frequency.
    
    print("Generating Wordfreq CSV...")
    
    words_data = []
    
    for word in iter_wordlist('en'):
        if not is_valid_token(word):
            continue
            
        zipf = zipf_frequency(word, 'en')
        if zipf > 0:
            words_data.append((word, zipf))
            
    # Sort alphabetically before writing so output is deterministic
    words_data.sort(key=lambda x: x[0])
    
    # Export to CSV
    output_path = 'wordfreq-en.csv'
    with open(output_path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['word', 'zipf'])
        for word, zipf in words_data:
            writer.writerow([word, zipf])
            
    print(f"Successfully exported {len(words_data)} words to {output_path}")

if __name__ == '__main__':
    export_wordfreq()
