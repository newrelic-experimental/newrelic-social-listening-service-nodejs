import { injectable, inject } from 'inversify';
import TYPES from '../constant/types';

import { SentimentAnalyser } from '../lib/SentimentAnalyser';

export interface ISentimentRequest {
  text: string;
}

export interface ISentimentResponse {
  sentiment: number;
  text: string;
}

@injectable()
export class SentimentAnalysisService {
  constructor(
    @inject(TYPES.SentimentAnalyser)
    private sentimentAnalyser: SentimentAnalyser,
  ) {}

  public getSentiment = (body: ISentimentRequest): ISentimentResponse => {
    const { text } = body;
    const sentiment = this.sentimentAnalyser.analyse(body.text);
    return {
      text,
      sentiment,
    };
  };
}
