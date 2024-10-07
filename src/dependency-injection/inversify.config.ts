import { Container } from 'inversify';
import { HTTPService } from '../services/http.service';
import { HTTP_SERVICE } from './tokens';

export const Injector = new Container();

Injector
  .bind(HTTP_SERVICE)
  .to(HTTPService)
  .inSingletonScope();
