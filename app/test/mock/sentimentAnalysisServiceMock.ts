import {
  ISentimentRequest,
  ISentimentResponse,
} from '../../service/sentimentAnalysis';
import { SentimentAnalyser } from '../../lib/SentimentAnalyser';

import { SentimentAnalyserMock } from './SentimentAnalyserMock';

export class SentimentAnalysisServiceMock {
  private sentimentAnalyser: SentimentAnalyser;
  constructor(analyser: SentimentAnalyserMock) {
    this.sentimentAnalyser = analyser as SentimentAnalyser;
  }
  public getSentiment(body: ISentimentRequest): ISentimentResponse {
    return { text: body.text, sentiment: 4 };
  }
}
