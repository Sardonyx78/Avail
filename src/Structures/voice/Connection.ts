import { Writable, Readable } from "stream"
import UDPClient from "./UDPClient"
import VoiceWSClient from "./VoiceWSClient"
import Bot from "../../Bot/Bot"
import BotVoiceState from "../BotVoiceState"

export default class Connection {

     voiceState: BotVoiceState
     bot: Bot
     udpClient: UDPClient
     ws: VoiceWSClient
     receiving: Readable
     transmitting: Writable

     constructor(voiceState: BotVoiceState) {
          this.bot = voiceState.bot
          this.voiceState = voiceState
          this.ws = new VoiceWSClient(this)
          this.udpClient = new UDPClient(this)

          this.receiving = new Readable()

          this.transmitting = new Writable({
               write: (chunk, _encoding, cb) => {
                    this.udpClient!.send(chunk)
                    cb()
               },
          })

          this.ws.open()
     }

     async close(): Promise<void> {
          this.udpClient!.close()
          this.ws.close()
     }

     startSpeaking(): void {
          this.ws.send({
               op: 5,
               d: {
                    speaking: 1,
                    delay: 0,
                    ssrc: this.udpClient!.ssrc,
               },
          })
     }

     stopSpeaking(): void {
          this.ws.send({
               op: 5,
               d: {
                    speaking: 0,
                    delay: 0,
                    ssrc: this.udpClient!.ssrc,
               },
          })
     }
}
