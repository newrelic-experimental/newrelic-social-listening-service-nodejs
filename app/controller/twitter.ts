import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request } from 'express';
import needle from 'needle';

import {
  TwitterStreamAdapter,
  TwitterStreamRule,
} from '../adapter/TwitterStream';
import TYPES from '../constant/types';

@controller('/twitter')
export class TwitterController {
  constructor(
    @inject(TYPES.TwitterStreamAdapter)
    private twitterStreamAdapter: TwitterStreamAdapter,
  ) {}

  @httpGet('/rules')
  public async fetchAllRules(): Promise<needle.BodyData> {
    return await this.twitterStreamAdapter.getRules();
  }

  @httpPost('/rules')
  public async addRules(request: Request): Promise<needle.BodyData> {
    const rules: TwitterStreamRule[] = request.body;
    return await this.twitterStreamAdapter.addRules(rules);
  }

  @httpDelete('/rules')
  public async deleteRules(request: Request): Promise<needle.BodyData> {
    const ids: string[] = request.body;
    return await this.twitterStreamAdapter.deleteRulesByIds(ids);
  }

  @httpGet('/stream')
  public async startStream(): Promise<{ message: string }> {
    await this.twitterStreamAdapter.startStream();
    return { message: 'OK' };
  }

  @httpDelete('/stream')
  public async stopStream(): Promise<{ message: string }> {
    await this.twitterStreamAdapter.stopStream();
    return { message: 'OK' };
  }
}
