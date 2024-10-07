/**
 * The result of a package request against `https://registry.npmjs.org`. This is
 * a subset of the returned data, not a full representation, that contains
 * everything you will need to carry out the exercise.
 *
 * @example
 * {
 *   "name": "react",
 *   "description": "React is a JavaScript library for building user interfaces.",
 *   "dist-tags": {
 *     "latest": "16.13.0"
 *   },
 *   "versions": {
 *     "16.13.0": {
 *       "name": "react",
 *       "version": "16.13.0",
 *       "dependencies": {
 *         "loose-envify": "^1.1.0",
 *         "object-assign": "^4.1.1",
 *         "prop-types": "^15.6.2",
 *       }
 *     }
 *   }
 * }
 */
export interface NPMPackage {
  name: string;
  description: string;
  'dist-tags': {
    [tag: string]: string;
  };
  versions: {
    [version: string]: {
      name: string;
      version: string;
      dependencies?: {
        [packageName: string]: string;
      };
    };
  };
}

export class PackageTreeNode {
  private _packageName: string;
  private _packageVersion: string;
  private _parentNode: PackageTreeNode | null;

  constructor(packageName: string, packageVersion: string, parentNode: PackageTreeNode | null = null) {
    this._packageName = packageName;
    this._packageVersion = packageVersion;
    this._parentNode = parentNode;
  }

  public equals(other: PackageTreeNode): boolean {
    return this._packageName === other._packageName && this._packageVersion === other._packageVersion;
  }

  public equalsAnyAncestor(): boolean {
    let currAncestor = this._parentNode;

    while (currAncestor) {
      if (this.equals(currAncestor)) {
        return true;
      }

      currAncestor = currAncestor._parentNode;
    }

    return false;
  }
}
