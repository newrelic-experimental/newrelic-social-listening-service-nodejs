import { injectable, inject } from 'inversify';
import { pipe } from 'ramda';
import aposToLexForm from 'apos-to-lex-form';
import stopword from 'stopword';
import TYPES from '../constant/types';
import { Natural } from './Natural';
import { SpellCorrectorFactory } from './SpellCorrector';

@injectable()
export class SentimentAnalyser {
  constructor(
    @inject(TYPES.Natural) private natural: Natural,
    @inject(TYPES.SpellCorrector) private spellCorrector: SpellCorrectorFactory,
  ) {}
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
    return this.natural.tokenize(text);
  };

  // correct misspelled words
  private spellCorrect = (tokenized: string[]): string[] => {
    return tokenized.map((token: string) => this.spellCorrector.correct(token));
  };

  // remove stop words (stop words have no effect on user's sentiment)
  // focus on important keywords
  private removeStopWords = (tokenized: string[]): string[] => {
    return stopword.removeStopwords(tokenized);
  };

  private process = (tokenized: string[]) => {
    return this.natural.getSentiment(tokenized);
  };

  public analyse = (text: string): number => {
    return pipe(
      this.aposToLex,
      this.toLowerCase,
      this.alphaOnly,
      this.tokenize,
      // this.spellCorrect,
      this.removeStopWords,
      this.process,
    )(text);
  };
}
