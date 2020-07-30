import { controller, httpGet } from 'inversify-express-utils';

type JsonResponse = {
  message: string;
};

@controller('/listener')
export class ListenerController {
  @httpGet('/')
  public get(): JsonResponse {
    return { message: 'OK' };
  }
}
