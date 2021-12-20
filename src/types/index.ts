/*
 * @mineralts/index.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

export type ApplicationNode = {
  major: number
  minor: number
  patch: number
  prerelease: (string | number)[]
  version: string
  toString(): string
}

export interface DirectoriesNode {
  config: string
  public: string
  contracts: string
  providers: string
  start: string
  tests: string
  [key: string]: string
}

export type RcFile = {
  preloads: any[]
  commands: string[]
  providers: string[]
  statics: string[]
  aliases: {
    [key: string]: string
  }
}

export interface ApplicationContract {
  container: any
}