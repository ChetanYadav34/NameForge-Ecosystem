import { EvaluatorContext, IEvaluator } from "./pronounceability";
import { Trie } from "../../../corpus/trie";

export class CollisionEvaluator implements IEvaluator {
  readonly id = "eval:en:collision";
  readonly name = "Dictionary Collision Check";
  private trie: Trie;

  constructor(dictionaryWords: string[]) {
    this.trie = new Trie();
    for (const word of dictionaryWords) {
      this.trie.insert(word);
    }
  }

  evaluate(context: EvaluatorContext): number {
    const word = context.candidate.orthography;
    return this.trie.evaluateCollision(word);
  }
}
