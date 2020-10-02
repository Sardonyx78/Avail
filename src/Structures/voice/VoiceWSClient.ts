import { EventEmitter } from "events"
import WebSocket from "ws"
import Connection from "./Connection"
import Speaking from "./Speaking"
import DiscordGatewayError from "../../Errors/DiscordGatewayError"
import { GatewayPayload } from '../../constants/Types/Types'

export default class VoiceWSClient extends EventEmitter {
     controller!: WebSocket
     connection: Connection

     heartbeatInterval!: NodeJS.Timeout

     constructor(connection: Connection) {
          super()

          this.connection = connection
     }

     send(data: GatewayPayload) {
          if (!this.controller) throw new DiscordGatewayError("There's none existent WebSocket yet use VoiceWSClient#open first!")

          this.controller.send(JSON.stringify(data))
     }

     open() {
          this.emit("open")
          this.controller = new WebSocket(`wss://${this.connection.voiceState.guild.voice.endpoint}/?v=4`)
          this.controller.on("close", () => {
               this.connection.bot.emit("debug", `[VOICE] [WS] (GUILD_ID ${this.connection.voiceState.guildID}) Closing down the WebSocket`)
               this.controller.removeAllListeners()
          })

          this.controller.on("message", msg => this.onMessage.bind(JSON.parse(msg.toString())))

          this.send({
               op: 0,
               d: {
                    /* eslint-disable camelcase */
                    server_id: this.connection.voiceState.guildID,
                    channel_id: this.connection.voiceState.channelID,
                    token: this.connection.voiceState.guild.voice.token,
                    session_id: this.connection.bot.ws.sessionID,
               },
          })
     }

     async onMessage(data: GatewayPayload) {
          this.connection.bot.emit("debug", `[VOICE] [WS] (GUILD_ID ${this.connection.voiceState.guildID}) Received Message: ${data}`)

          switch (data.op) {

          case 2: {
               this.connection.udpClient.server = { ip: data.d.ip, port: data.d.port }

               this.connection.udpClient.ssrc = data.d.ssrc

               const local = await this.connection.udpClient.discoverIP()

               this.send({
                    op: 1,
                    d: {
                         protocol: "udp",
                         data: {
                              address: local.ip,
                              port: local.port,
                              mode: "xsalsa20_poly1305"
                         }
                    }
               })

               break
          }

          case 4: {
               this.connection.udpClient.secret_key = Uint32Array.from(data.d.secret_key as number[])
               break
          }

          case 5: {
               const member = this.connection.voiceState.guild.members.get(data.d.user_id)
               const speaking = new Speaking(data.d.speaking)

               member.voice.speaking = speaking

               this.connection.bot.emit("update_speaking", member, speaking)
               break
          }

          case 8: {
               this.heartbeatInterval = setInterval(() => {
                    this.send({
                         op: 3,
                         d: data.d.heartbeat_interval,
                    })
               }, data.d.heartbeat_interval)
               break
          }
          }
     }

     close() {
          this.emit("closing")
          this.controller.close()
     }
}
