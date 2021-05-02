import udp from "dgram"
import { EventEmitter } from "events"
import { Readable } from 'stream'
import { promisify } from 'util'
import OpusScript = require("opusscript")
import LibSodium from "sodium-native"
import Connection from "./Connection"
import AvailVoiceError from "../../Errors/AvailVoiceError"
import DiscordGatewayError from "../../Errors/DiscordGatewayError"

export default class UDPClient extends EventEmitter {
     socket: udp.Socket
     connection: Connection
     ssrc?: number
     nonce = Buffer.alloc(24)

     OutPCM = new Readable()
     OutOpus = new Readable()

     opus = new OpusScript(48000, 2, OpusScript.Application.AUDIO)

     server: {
          ip: string
          port: number
     } = {
               ip: "",
               port: 0,
          }

     local: {
          ip: string
          port: number
     }

     // eslint-disable-next-line camelcase
     secret_key?: Uint32Array
     foundIP = false

     constructor(connection: Connection) {
          super()
          this.connection = connection
          this.socket = udp.createSocket("udp4")
          this.local = {
               ip: "",
               port: 0,
          }
     }

     async close(): Promise<void> {
          return new Promise((resolve, reject) => {
               if (!this.socket) reject(new DiscordGatewayError("UDP Socket hasn't been created yet!"))

               this.emit("closing")

               this.socket.close(() => {
                    this.emit("closed")
                    this.connection.bot.emit("debug", `[VOICE] [UDP] (GUILD_ID ${this.connection.voiceState.guildID}) Closing down the UDP Connection`)
                    this.removeAllListeners()
                    resolve()
               })
          })
     }

     async send(data: Buffer): Promise<number> {
          return promisify(this.socket.send).call(this.socket, data) as Promise<number>
     }

     async discoverIP(): Promise<{ ip: string; port: number }> {
          return new Promise((resolve, reject) => {
               if (!this.ssrc) throw new AvailVoiceError("SSRC hasn't been given yet!")

               const m = Buffer.alloc(70)

               m.writeUIntBE(this.ssrc, 0, 4)

               this.socket.send(m, 0, m.length, this.server.port, this.server.ip)

               this.socket.once("message", message => {
                    for (let i = 4; i < message.indexOf(0, i); i++) {
                         this.local.ip += String.fromCharCode(message[i])
                    }

                    this.local.port = parseInt(message.readUIntBE(message.length - 2, 2).toString(10))

                    resolve(this.local)
               })

               this.socket.once("error", reject)

               this.foundIP = true

               this.socket.connect(this.server.port, this.server.ip)
          })
     }

     startEvents(): void {
          this.socket.on("message", message => {
               const data = this.decryptPackage(message)

               if (!data) return

               this.OutOpus.push(data)
               this.OutPCM.push(this.opus.decode(data))
          })
     }

     decryptPackage(buffer: Buffer): Buffer | undefined {
          buffer.copy(this.nonce, 0, 0, 12)

          let data = Buffer.allocUnsafe(buffer.length - 12 - LibSodium.crypto_secretbox_MACBYTES)

          try {
               LibSodium.crypto_secretbox_open_easy(data, buffer.slice(12), this.nonce, Buffer.from(this.secret_key!))
          } catch (error) {
               this.connection.bot.emit("error", `[VOICE] [UDP] (GUILD_ID ${this.connection.voiceState.guildID}) Couldn't resolve a package`)
               return undefined
          }


          if ((buffer[0] & 0xf) > 0) {
               data = data.slice(buffer[0] & (0xf * 4))
          }

          if (buffer[0] & 0x10) {
               let i = 4 + ((data[2] << 8) | data[3]) * 4

               data.forEach((x, _i) => {
                    if (x !== 0) i += _i
               })

               data = data.slice(i)
          }

          return data
     }
}
