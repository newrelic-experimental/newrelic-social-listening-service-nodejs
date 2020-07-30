import { controller, httpGet } from 'inversify-express-utils';

type JsonResponse = {
  message: string;
};

@controller('/')
export class ListenerController {
  @httpGet('/')
  public get(): JsonResponse {
    return { message: 'OK From Controller' };
  }
}
