import got from 'got/dist/source';
import { IHttpService } from '../dependency-injection/types';
import { NPMPackage } from '../types';

export class HTTPService implements IHttpService {
  fetchPackage(packageName: string): Promise<NPMPackage> {
    return got(
      `https://registry.npmjs.org/${packageName}`,
    ).json<NPMPackage>();
  }
}
