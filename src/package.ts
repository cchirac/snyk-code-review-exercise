import { RequestHandler } from 'express';
import { maxSatisfying } from 'semver';
import { Injector } from './dependency-injection/inversify.config';
import { HTTP_SERVICE } from './dependency-injection/tokens';
import { IHttpService } from './dependency-injection/types';
import { PackageTreeNode } from './types';

type Package = { version: string; dependencies: Record<string, Package> };

/**
 * Attempts to retrieve package data from the npm registry and return it
 */
export const getPackage: RequestHandler = async function (req, res, next) {
  const { name, version } = req.params;

  try {
    return res
      .status(200)
      .json({ name, ...await getDependencies(name, version) });
  } catch (error) {
    return next(error);
  }
};

async function getDependencies(
  packageName: string,
  versionRange: string,
  parentNode: PackageTreeNode | null = null,
): Promise<Package> {
  const httpService = Injector.get<IHttpService>(HTTP_SERVICE);
  const npmPackage = await httpService.fetchPackage(packageName);

  const maxSatisfyingVersion = maxSatisfying(Object.keys(npmPackage.versions), versionRange);
  const dependencies: Record<string, Package> = {};

  if (maxSatisfyingVersion) {
    const currTreeNode = new PackageTreeNode(packageName, maxSatisfyingVersion, parentNode);

    if (!currTreeNode.equalsAnyAncestor()) {
      const newDeps = npmPackage.versions[maxSatisfyingVersion].dependencies;
      for (const [name, range] of Object.entries(newDeps ?? {})) {
        dependencies[name] = await getDependencies(name, range, currTreeNode);
      }
    }
  }

  return { version: maxSatisfyingVersion ?? versionRange, dependencies };
}
