import { Readable } from "stream"
import UDPClient from "./UDPClient"
import VoiceWSClient from "./VoiceWSClient"
import { Bot } from "../../Bot"
import BotVoiceState from "../BotVoiceState"
import { FFmpeg, opus as opusEnc, VolumeTransformer } from 'prism-media'
import { AudioTransmitter } from "./AudioTransmitter"

export default class Connection {

     voiceState: BotVoiceState
     bot: Bot
     udpClient: UDPClient
     ws: VoiceWSClient
     receiving: Readable
     transmitting = new AudioTransmitter(this)

     constructor(voiceState: BotVoiceState) {
          this.bot = voiceState.bot
          this.voiceState = voiceState
          this.ws = new VoiceWSClient(this)
          this.udpClient = new UDPClient(this)
          this.receiving = new Readable()

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

     play(input: Readable) {
          const ffmpeg = new FFmpeg({ args: ['-analyzeduration', '0', '-loglevel', '0', '-f', 's16le', '-ar', '48000', '-ac', '2'] })
          input.pipe(ffmpeg)

          const opus = new opusEnc.Encoder({ channels: 2, rate: 48000, frameSize: 960 })

          const volume = new VolumeTransformer({ type: "s16le", volume: 1 })
          ffmpeg.pipe(volume).pipe(opus)

          this.transmitting.pipe(opus)
     }
}
