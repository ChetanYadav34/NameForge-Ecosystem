export class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isWord: boolean = false;
}

export class Trie {
  private root: TrieNode = new TrieNode();

  insert(word: string): void {
    let node = this.root;
    for (const char of word.toLowerCase()) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }
    node.isWord = true;
  }

  contains(word: string): boolean {
    let node = this.root;
    for (const char of word.toLowerCase()) {
      if (!node.children.has(char)) return false;
      node = node.children.get(char)!;
    }
    return node.isWord;
  }

  /**
   * Evaluates how close a word is to existing dictionary words
   * Returns a score: 0 = exact match (collision), 1 = completely novel
   */
  evaluateCollision(word: string): number {
    if (this.contains(word)) return 0.0;
    
    // Very basic Levenshtein or prefix overlap would go here for 'near collisions'
    // For MVP Phase 24, we check for exact match only and a simplistic length overlap
    let node = this.root;
    let matchDepth = 0;
    for (const char of word.toLowerCase()) {
      if (!node.children.has(char)) break;
      node = node.children.get(char)!;
      matchDepth++;
    }

    if (matchDepth === word.length) return 0.0; // It's a prefix of a longer word? Still highly colliding
    
    const collisionRatio = matchDepth / word.length;
    
    // If it matches deeply with a real word prefix, lower score.
    return 1.0 - (collisionRatio * 0.5); // Max 50% penalty for prefix matching
  }
}
