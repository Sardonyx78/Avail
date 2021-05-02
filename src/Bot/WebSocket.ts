import erlpack from "erlpack"
import WebSocket from "ws"
import zlib from "zlib-sync"
import { Bot } from "./Bot"
import DiscordGatewayError from "../Errors/DiscordGatewayError"
import Awaiter from "../Structures/Awaiter"
import ClientUser from "../Structures/ClientUser"
import Guild from "../Structures/Guild"
import Message from "../Structures/Message"
import SnowDir from "../Structures/SnowDir"
import { APIRECOMMENDEDWS, APIVOICESTATE } from "../constants/Types/Responses"
import { GatewayPayload, Snowflake, WS_EVENT } from '../constants/Types/Types'
import VoiceState from '../Structures/VoiceState'
import TextChannel from "../Structures/TextChannel"
import { Reaction } from "../Structures/Reaction"

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
               case WS_EVENT.MESSAGE_UPDATE: {
                    const msg = this.bot.channels.get<TextChannel>(data.channel_id).messages.get(data.id)

                    const clone = Object.assign(Object.create(msg), msg)

                    this.bot.emit("message_update", clone, msg.patch(data))
                    break
               }
               case WS_EVENT.MESSAGE_DELETE: {
                    const channel = this.bot.channels.get<TextChannel>(data.channel_id)

                    if (!channel) return

                    const msg = channel.messages.get(data.id)
                    
                    if (channel.messages.delete(data.id)) this.bot.emit("message_delete", msg)

                    break
               }
               case WS_EVENT.MESSAGE_DELETE_BULK: {
                    const channel = this.bot.channels.get<TextChannel>(data.channel_id)

                    if (!channel) return

                    const msgs = channel.messages.findAll((msg) => data.ids.include(msg.id))

                    if (msgs.size === 0) return
                    
                    for (const [_, msg] of msgs) {
                         channel.messages.delete(msg.id)
                    }

                    this.bot.emit("message_delete_bulk", msgs)

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
                    } else this.bot.guilds.get(data.guild_id).members.get(data.user_id).voice.patch(data)
                    break
               }
               case WS_EVENT.MESSAGE_REACTION_ADD: {
                    if (data.emoji.name === null) return // Ignores deleted emotes
                    const message = this.bot.channels.get<TextChannel>(data.channel_id).messages.get(data.message_id)
                    if (!message) return

                    const reaction = message.reactions.get(data.emoji.id || data.emoji.name) || message.reactions.set(data.emoji.id || data.emoji.name, new Reaction(this.bot, message, { count: 1, emoji: data.emoji, me: data.user_id === this.bot.user.id }))

                    const user = this.bot.users.get(data.user_id)

                    if (!user) return

                    reaction.users.set(data.user_id, user)

                    this.bot.emit("reaction_add", reaction, user)

                    break
               }
               case WS_EVENT.MESSAGE_REACTION_REMOVE: {
                    if (data.emoji.name === null) return // Ignores deleted emotes
                    const message = this.bot.channels.get<TextChannel>(data.channel_id).messages.get(data.message_id)
                    if (!message) return

                    const reaction = message.reactions.get(data.emoji.id || data.emoji.name)

                    const user = this.bot.users.get(data.user_id)

                    if (!user) return

                    reaction.users.delete(data.user_id)

                    this.bot.emit("reaction_remove", reaction, user)

                    break
               }
               case WS_EVENT.MESSAGE_REACTION_REMOVE_EMOJI: {
                    if (data.emoji.name === null) return // Ignores deleted emotes
                    const message = this.bot.channels.get<TextChannel>(data.channel_id).messages.get(data.message_id)
                    if (!message) return

                    const reaction = message.reactions.get(data.emoji.id || data.emoji.name)

                    message.reactions.delete(data.emoji.id || data.emoji.name)

                    this.bot.emit("reaction_remove_all", reaction)

                    break
               }
               case WS_EVENT.MESSAGE_REACTION_REMOVE_ALL: {
                    const message = this.bot.channels.get<TextChannel>(data.channel_id).messages.get(data.message_id)
                    if (!message) return

                    this.bot.emit("reaction_clear", message)

                    message.reactions.clear()

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
                    resolve()
               })

               this.controller.on("message", msg => {
                    this.inflate.push(msg as Buffer, zlib.Z_SYNC_FLUSH)
                    this.onmessage(erlpack.unpack(this.inflate.result as Buffer))
               })

               this.controller.once("error", reject)
          })
     }
}
