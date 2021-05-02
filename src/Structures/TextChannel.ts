import FormData from "form-data"
import Attachment from "./Attachment"
import Channel from "./Channel"
import Embed from "./Embed"
import Message from "./Message"
import SnowDir from './SnowDir'
import { Bot } from "../Bot"
import { APIDMCHANNEL, APIMESSAGE, APITEXTCHANNEL } from "../constants/Types/Responses"
import { Snowflake } from '../constants/Types/Types'

export default abstract class TextChannel extends Channel {
     
     messages = new SnowDir<Snowflake, Message>()

     constructor(bot: Bot, data?: APIDMCHANNEL | APITEXTCHANNEL) {
          super(bot, data)
     }

     async send(options: MessageOptions): Promise<Message>
     async send(msg: MessageConvertable, options?: MessageOptions): Promise<Message>
     async send(msg: MessageConvertable, options?: MessageOptions): Promise<Message> {
          if (!options) options = {}

          if ((msg! instanceof Embed && typeof msg !== "string") || msg === undefined) options = msg as MessageOptions
   
          if (typeof msg === "string") options.content = msg
          else if (msg instanceof Embed) options.embed = msg
   
          if (options!.files) {
               const form = new FormData()
   
               const files = await Promise.all(
                    options!.files.map(async file => ({
                         name: file.name,
                         buffer: await file.getFile(),
                    }))
               )
   
               for (const file of files) {
                    form.append("file", file.buffer, {
                         filename: file.name,
                    })
               }
   
               delete options!.files
   
               form.append("payload_json", JSON.stringify(options))
   
               const msg = new Message(this.bot, await this.bot.REST.discord<APIMESSAGE>().channels(this.id).messages.post(form, form.getHeaders()))
   
               return this.messages.set(msg.id, msg)
          } else {
               const msg = new Message(this.bot, await this.bot.REST.discord<APIMESSAGE>().channels(this.id).messages.post(JSON.stringify(options)))
   
               return this.messages.set(msg.id, msg)
          }
     }
}

export type MessageConvertable = MessageOptions | string | Embed

export type MessageOptions = {
  files?: Attachment[]
  embed?: Embed
  content?: string
  nonce?: string
  tts?: boolean
}
