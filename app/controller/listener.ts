import { controller, httpGet, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request } from 'express';

import {
  ISentimentResponse,
  SentimentAnalysisService,
} from '../service/sentimentAnalysis';
import TYPES from '../constant/types';

type JsonResponse = {
  message: string;
};

@controller('/listener')
export class ListenerController {
  constructor(
    @inject(TYPES.SentimentAnalysisService)
    private sentimentAnalysisService: SentimentAnalysisService,
  ) {}

  @httpGet('/')
  public get(): JsonResponse {
    return { message: 'OK' };
  }

  @httpPost('/sentiment')
  public getSentiment(request: Request): ISentimentResponse {
    return this.sentimentAnalysisService.getSentiment(request.body);
  }
}
