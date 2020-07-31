import { injectable } from 'inversify';

export interface ISentimentRequest {
  text: string;
}

export interface ISentimentResponse {
  sentiment: number;
  text: string;
}

@injectable()
export class SentimentAnalysisService {

  public getSentiment(body: ISentimentRequest): ISentimentResponse {
    return {
      text: body.text,
      sentiment: 3,
    };
  }
}
