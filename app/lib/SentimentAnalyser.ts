import { injectable } from 'inversify';
// @ts-ignore
import natural, { WordTokenizer, SentimentAnalyzer } from 'natural';
import aposToLexForm from 'apos-to-lex-form';
import SpellCorrector from 'spelling-corrector';
import stopword from 'stopword';
import { pipe } from 'ramda';

@injectable()
export class SentimentAnalyser {
  private tokenizer: WordTokenizer;
  private analyzer: SentimentAnalyzer;
  private corrector: any;

  constructor() {
    // @ts-ignore
    const { WordTokenizer, PorterStemmer, SentimentAnalyzer } = natural;
    this.tokenizer = new WordTokenizer();
    this.analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
    this.corrector = new SpellCorrector();
    this.corrector.loadDictionary();
  }
  // convert contractions
  private aposToLex = (text: string): string => {
    return aposToLexForm(text);
  };

  private toLowerCase = (text: string): string => {
    return text.toLowerCase();
  };

  // remove non-alphabetical and special chars
  private alphaOnly = (text: string): string => {
    return text.replace(/[^a-zA-Z\s]+/g, '');
  };

  // split text into units (tokens)
  private tokenize = (text: string): string[] => {
    return this.tokenizer.tokenize(text);
  };

  // correct misspelled words
  private spellCorrect = (tokenized: string[]): string[] => {
    return tokenized.map((token: string) => this.corrector.correct(token));
  };

  // remove stop words (stop words have no effect on user's sentiment)
  // focus on important keywords
  private removeStopWords = (tokenized: string[]): string[] => {
    return stopword.removeStopwords(tokenized);
  };

  private process = (text: string[]) => {
    return this.analyzer.getSentiment(text);
  };

  public analyse = (text: string) => {
    return pipe(
      this.aposToLex,
      this.toLowerCase,
      this.alphaOnly,
      this.tokenize,
      this.spellCorrect,
      this.removeStopWords,
      this.process,
    )(text);
  };
}
