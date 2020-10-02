import erlpack from "erlpack"
import WebSocket from "ws"
import zlib from "zlib-sync"
import Bot from "./Bot"
import DiscordGatewayError from "../Errors/DiscordGatewayError"
import Awaiter from "../Structures/Awaiter"
import ClientUser from "../Structures/ClientUser"
import Guild from "../Structures/Guild"
import Message from "../Structures/Message"
import SnowDir from "../Structures/SnowDir"
import { APIRECOMMENDEDWS } from "../constants/Types/Responses"
import { GatewayPayload, Snowflake, WS_EVENT } from '../constants/Types/Types'

const wssify = (url: URL) => {
     url.searchParams.append("encoding", "etf")
     url.searchParams.append("compress", "zlib-stream")
     url.searchParams.append("v", "6")
     url.protocol = "wss"

     return url.toString()
}

export default class Gateway {
     controller!: WebSocket
     bot: Bot
     private inflate = new zlib.Inflate({
          chunkSize: 65535,
     })
     private heartbeatInterval!: NodeJS.Timeout
     private guildCache!: Set<Snowflake>

     sessionID!: string

     awaiters = new SnowDir<number, Awaiter>()
     destroyed = false

     constructor(bot: Bot) {
          this.bot = bot
     }

     onmessage(data: GatewayPayload): void {
          this.bot.emit("debug", "Recieved a payload with the opcode " + data.op)
          switch (data.op) {
          case 0:
               this.dispatch(data.t!, data.d)
               break

          case 10:
               this.bot.emit("debug", "Recieved The Inital Heartbeat, Hearbeat Interval: " + data.d.heartbeat_interval)

               if (this.heartbeatInterval) clearInterval(this.heartbeatInterval)

               this.heartbeatInterval = setInterval(() => {
                    this.bot.emit("debug", "Sent Heartbeat.")
                    this.controller.send(erlpack.pack({ op: 1 }))
               }, data.d.heartbeat_interval)
               return
          }
     }

     setAwaiter(awaiter: Awaiter): number {
          const numb = this.awaiters.lastKey() ? 0 : this.awaiters.lastKey() + 1

          this.awaiters.set(numb, awaiter)

          awaiter.once("destroyed", () => {
               this.awaiters.delete(numb)
          })

          return numb
     }

     destroy(): void {
          this.controller.close()
          this.destroyed = true
     }

     //eslint-disable-next-line
     dispatch(event: WS_EVENT, data: any): void {
          this.bot.emit("debug", "Dispatching event " + event)

          if (data === "false") {
               this.destroy()
               throw new DiscordGatewayError("Invalid Session")
          }

          this.awaiters.findAll(awaiter => awaiter.type === event).forEach(x => x.add(data))
          switch (event) {
          case WS_EVENT.READY: {
               this.guildCache = new Set(data.guilds.map((x: { id: Snowflake }) => x.id))
               this.sessionID = data.session_id
               this.bot.user = new ClientUser(this.bot, data.user)

               break
          }

          case WS_EVENT.GUILD_CREATE: {
               const guild = new Guild(this.bot, data)
               this.bot.guilds.set(data.id, guild)

               if (!this.guildCache.has(guild.id)) {
                    this.bot.emit("guild_create", guild)
               } else this.guildCache.delete(guild.id)

               if (this.guildCache.size === 0) this.bot.emit("ready", this.bot.user)

               break
          }
          case WS_EVENT.MESSAGE_CREATE: {
               const msg = new Message(this.bot, data)
               msg.channel.messages.set(msg.id, msg)
               this.bot.emit("message_create", msg)

               break
          }
          case WS_EVENT.RECONNECT: {
               this.send({
                    op: 6,
                    d: {
                         token: this.bot.token,
                         // eslint-disable-next-line camelcase
                         session_id: this.sessionID,
                         seq: data.s,
                    },
               })

               break
          }
          case WS_EVENT.VOICE_SERVER_UPDATE: {
               this.bot.guilds.get(data.id).voice.endpoint = data.endpoint
               this.bot.guilds.get(data.id).voice.token = data.token

               break
          }
          case WS_EVENT.VOICE_STATE_UPDATE: {
               if (data.user_id === this.bot.user.id) {
                    this.bot.guilds.get(data.guild_id).voice.me.patch(data)
               }
               break
          }
          }
     }

     async send(data: GatewayPayload): Promise<GatewayPayload> {
          if (this.controller.readyState >= 2) throw new Error("WebSocket is already in CLOSING or CLOSED state.")

          this.controller.send(erlpack.pack(data))
          return data
     }

     async connect(): Promise<void> {
          const gateway = await this.bot.REST.discord<APIRECOMMENDEDWS>().gateway("bot").get()

          return new Promise((resolve, reject) => {

               this.controller = new WebSocket(wssify(new URL(gateway.url)))

               this.controller.on("open", () => {
                    this.bot.emit("debug", "Gateway connection established")

                    this.send({
                         op: 2,
                         d: {
                              token: this.bot.token,
                              properties: {
                                   $os: process.platform,
                                   $browser: this.bot.mobile ? "Discord IOS" : "Avail",
                                   $device: this.bot.mobile ? "Discord IOS" : "Avail",
                              },
                         },
                    })
               })

               this.controller.on("message", msg => {
                    this.inflate.push(msg as Buffer, zlib.Z_SYNC_FLUSH)
                    this.onmessage(erlpack.unpack(this.inflate.result as Buffer))
               })

               this.controller.once("error", reject)

               this.controller.once("open", () => resolve())
          })
     }
}
