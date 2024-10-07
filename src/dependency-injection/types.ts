import { NPMPackage } from '../types';

export interface IHttpService {
  // eslint-disable-next-line no-unused-vars
  fetchPackage: (packageName: string) => Promise<NPMPackage>;
}
