import { EventEmitter } from "events"
import REST from "./REST"
import Gateway from "./WebSocket"
import Channel from '../Structures/Channel'
import ClientUser from "../Structures/ClientUser"
import Emoji from "../Structures/Emoji"
import Guild from "../Structures/Guild"
import SnowDir from "../Structures/SnowDir"
import User from "../Structures/User"
import Connection from "../Structures/voice/Connection"
import EVENT from "../constants/Types/EVENT"
import { Snowflake } from '../constants/Types/Types'
import { Resolver } from "../constants/util/Resolver"

export default class Bot extends EventEmitter {
     mobile: boolean

     token: string

     guilds = new SnowDir<Snowflake, Guild>()

     channels = new SnowDir<Snowflake, Channel>()

     users = new SnowDir<Snowflake, User>()

     emojis = new SnowDir<Snowflake, Emoji>()

     REST = new REST(this)
     ws = new Gateway(this)
     user!: ClientUser

     resolver = new Resolver(this)

     private intervals = new Set<NodeJS.Timeout>()
     private timeouts = new Set<NodeJS.Timeout>()
     private immediates = new Set<NodeJS.Immediate>()

     voiceStates = new SnowDir<Snowflake, Connection>()

     constructor(token: string, options: { mobile?: boolean }) {
          super()

          this.mobile = !!options.mobile

          this.token = token

     }

     connect(): Promise<void> {
          return this.ws.connect()
     }

     destroy(): void {
          this.ws.destroy()
          this.voiceStates.forEach(x => {
               x.udpClient.close()
               x.ws.close()
          })

          this.immediates.forEach(clearImmediate)
          this.intervals.forEach(clearInterval)
          this.timeouts.forEach(clearTimeout)

          this.immediates.clear()
          this.intervals.clear()
          this.timeouts.clear()
     }

     // eslint-disable-next-line @typescript-eslint/no-explicit-any
     setInterval(callback: (...args: any[]) => void, ms: number, ...args: any[]): NodeJS.Timeout {
          const interval = setInterval(callback, ms, ...args)
          this.intervals.add(interval)
          return interval
     }

     // eslint-disable-next-line @typescript-eslint/no-explicit-any
     setImmediate(callback: (...args: any[]) => void, ...args: any[]): NodeJS.Immediate {
          const immediate = setImmediate(callback, ...args)
          this.immediates.add(immediate)
          return immediate
     }

     // eslint-disable-next-line @typescript-eslint/no-explicit-any
     setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): NodeJS.Timeout {
          const timeout = setTimeout(
               (..._args) => {
                    callback(_args)
                    this.timeouts.delete(timeout)
               },
               ms,
               ...args
          )
          this.timeouts.add(timeout)
          return timeout
     }

     clearInterval(interval: NodeJS.Timeout): void {
          clearInterval(interval)
          this.intervals.delete(interval)
     }

     clearTimeout(timeout: NodeJS.Timeout): void {
          clearTimeout(timeout)
          this.timeouts.delete(timeout)
     }

     clearImmediate(immediate: NodeJS.Immediate): void {
          clearImmediate(immediate)
          this.immediates.delete(immediate)
     }
}


/* eslint-disable @typescript-eslint/no-explicit-any */
export default interface Bot {
     on: <K extends keyof EVENT>(event: K, listener: (...args: EVENT[K]) => any) => this
     once: <K extends keyof EVENT>(event: K, listener: (...args: EVENT[K]) => any) => this
     emit: <K extends keyof EVENT>(event: K, ...args: EVENT[K]) => boolean
}
