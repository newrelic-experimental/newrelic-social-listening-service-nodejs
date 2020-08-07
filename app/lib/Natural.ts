import { injectable } from 'inversify';
// @ts-ignore
import natural, { WordTokenizer, SentimentAnalyzer } from 'natural';

@injectable()
export class Natural {
  private tokenizer: WordTokenizer;
  private analyzer: SentimentAnalyzer;

  constructor() {
    // @ts-ignore
    const { WordTokenizer, PorterStemmer, SentimentAnalyzer } = natural;
    this.tokenizer = new WordTokenizer();
    this.analyzer = new SentimentAnalyzer(
      process.env.NATURAL_LANGUAGE,
      PorterStemmer,
      process.env.NATURAL_VOCABULARY,
    );
  }

  public tokenize = (text: string): string[] => this.tokenizer.tokenize(text);

  public getSentiment = (tokenized: string[]): number =>
    this.analyzer.getSentiment(tokenized);
}
