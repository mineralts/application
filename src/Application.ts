import Logger from '@mineralts/logger'
import { RcFile } from './types'
import { MineralEvent } from '@mineralts/core'

export default class Application {
  private static $instance: Application

  public logger: Logger = new Logger()
  public readonly appName: string
  public readonly version: string
  public readonly mode: string = 'development'

  public rcFile: RcFile
  public preloads: any[]
  public commands: string[]
  public statics: string[]

  public aliases: Map<string, string> = new Map()

  public container: {
    events: Map<string, Map<string, MineralEvent>>
  }

  constructor(public readonly appRoot: string, environment: any) {
    this.appName = environment.appName
    this.version = environment.version
    this.rcFile = environment.rcFile
    this.preloads = this.rcFile.preloads
    this.commands = this.rcFile.commands
    this.statics = this.rcFile.statics
    this.aliases = new Map(Object.entries(this.rcFile.aliases))

    this.container = {
      events: new Map()
    }
  }

  private static getInstance () {
    return this.$instance
  }

  public static create (appRoot: string, environment: any) {
    if (!this.$instance) {
      this.$instance = new Application(appRoot, environment)
    }
    return this.$instance
  }

  public static inProduction () {
    const instance = this.getInstance()
    return instance.mode === 'production'
  }
}