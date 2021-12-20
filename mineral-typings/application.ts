declare module '@ioc:Mineral/Core/Application' {
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
    typescript: boolean
    exceptionHandlerNamespace?: string
    preloads: any[]
    commands: string[]
    providers: string[]
    directories: DirectoriesNode
    commandsAliases: {
      [key: string]: string
    }
    aliases: {
      [key: string]: string
    }
  }

  export interface ApplicationContract {
    container: any
  }
}