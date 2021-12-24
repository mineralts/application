import Logger from '@mineralts/logger'
import { Intent, RcFile } from './types'
import { MineralEvent } from '@mineralts/core'
import { Client } from '@mineralts/api'
import { Collection } from '@mineralts/core'

export default class Application {
  private static $instance: Application

  public logger: Logger = new Logger()
  public readonly appName: string
  public readonly version: string

  public readonly mode: string = 'development'
  public static cdn = 'https://cdn.discordapp.com'

  public rcFile: RcFile
  public preloads: any[]
  public commands: string[]
  public statics: string[]

  public aliases: Map<string, string> = new Map()

  public container: {
    events: Collection<string, Map<string, MineralEvent>>
  }

  public client!: Client
  public readonly intents: number
  public readonly token: string

  constructor(public readonly appRoot: string, environment: any) {
    this.appName = environment.appName
    this.version = environment.version
    this.rcFile = environment.rcFile
    this.preloads = this.rcFile.preloads
    this.commands = this.rcFile.commands
    this.statics = this.rcFile.statics
    this.aliases = new Map(Object.entries(this.rcFile.aliases))
    this.token = environment.token

    this.container = {
      events: new Collection()
    }

    const intents: 'ALL' | Exclude<keyof typeof Intent, 'ALL'>[] = 'ALL'
    this.intents = this.getIntentValue(intents)
  }

  public getIntentValue (intents: 'ALL' | Exclude<keyof typeof Intent, 'ALL'>[]) {
    return intents
      ? intents === 'ALL'
        ? Intent[intents]
        : intents.reduce((acc: number, current: keyof typeof Intent) => acc + Intent[current], 0)
      : 0
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

  public static getClient () {
    const instance = this.getInstance()
    return instance.client
  }
}