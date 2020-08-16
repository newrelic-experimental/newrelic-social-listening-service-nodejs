import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request } from 'express';

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
  public async fetchAllRules() {
    return await this.twitterStreamAdapter.getRules();
  }

  @httpPost('/rules')
  public async addRules(request: Request) {
    const rules: TwitterStreamRule[] = request.body;
    return await this.twitterStreamAdapter.addRules(rules);
  }

  @httpDelete('/rules')
  public async deleteRules(request: Request) {
    const ids: string[] = request.body;
    return await this.twitterStreamAdapter.deleteRulesByIds(ids);
  }
}
