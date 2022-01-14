import Logger from '@mineralts/logger'
import { Intent, RcFile } from './types'
import { Http } from '@mineralts/connector'
import { MineralEvent, Environment, Helper } from '@mineralts/core'
import { Client, Collection } from '@mineralts/api'
import path from 'path'
import * as fs from 'fs'

export default class Application {
  private static $instance: Application

  public logger: Logger = new Logger()
  public request!: Http

  public readonly appName: string
  public readonly version: string

  public readonly mode: string = 'development'
  public static cdn = 'https://cdn.discordapp.com'

  public rcFile: RcFile
  public preloads: any[]
  public commands: Collection<string, any> = new Collection()
  public statics: string[]
  public environment: Environment = new Environment()

  public aliases: Map<string, string> = new Map()

  public container: { events: Collection<string, Map<string, MineralEvent>>, commands: Collection<string, any>, subcommands: Collection<string, any>} = {
    events: new Collection(),
    commands: new Collection(),
    subcommands: new Collection()
  }

  public helper: Helper = new Helper()
  public client!: Client
  public readonly intents: number
  public readonly token: string

  constructor(public readonly appRoot: string, environment: any) {
    this.appName = environment.appName
    this.version = environment.version
    this.rcFile = environment.rcFile
    this.preloads = this.rcFile.preloads
    this.statics = this.rcFile.statics
    this.aliases = new Map(Object.entries(this.rcFile.aliases))
    this.token = environment.token

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

  public registerBinding<T> (key: string, value: T) {
    this[key] = value
  }

  public async registerCliCommands () {
    const commands = this.rcFile.commands

    if (commands.includes('@mineralts/forge')) {
      const forgePackageLocation = path.join(process.cwd(), 'node_modules', '@mineralts', 'forge')
      const jsonPackageLocation = path.join(forgePackageLocation, 'package.json')
      const JsonPackage = await import(jsonPackageLocation)

      await Promise.all(
        JsonPackage['@mineralts'].commands.map(async (commandDir) => {
          const location = path.join(forgePackageLocation, commandDir)
          const files = await fs.promises.readdir(location)

          files.map(async (file: string) => {
            const { default: Command } = await import(path.join(location, file))
            const generateManifest = new Command()

            generateManifest.logger = this.logger
            generateManifest.application = this

            this.commands.set(Command.commandName, generateManifest)
          })
        })
      )
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

  public static getClient () {
    const instance = this.getInstance()
    return instance.client
  }

  public static createRequest () {
    const instance = this.getInstance()
    return instance.request
  }

  public static getLogger () {
    const instance = this.getInstance()
    return instance.logger
  }

  public static getContainer () {
    const instance = this.getInstance()
    return instance.container
  }

  public static getToken () {
    const instance = this.getInstance()
    return instance.token
  }

  public static getEnvironment () {
    const instance = this.getInstance()
    return instance.environment.cache
  }

  public static getRcFile (): RcFile {
    const instance = this.getInstance()
    return instance.rcFile
  }

  public static getHelper (): Helper {
    const instance = this.getInstance()
    return instance.helper
  }
}