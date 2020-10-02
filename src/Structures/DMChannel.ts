import Message from "./Message"
import SnowDir from "./SnowDir"
import TextChannel, { MessageConvertable, MessageOptions } from "./TextChannel"
import User from "./User"
import DiscordAPIError from "../Errors/DiscordAPIError"
import { APIDMCHANNEL } from "../constants/Types/Responses"
import { Snowflake } from '../constants/Types/Types'

export default class DMChannel extends TextChannel {
     user: User
     lastMessageID?: string
     messages = new SnowDir<Snowflake, Message>()

     constructor(user: User, data?: APIDMCHANNEL) {
          super(user.bot, data)

          this.user = user
     }

     async open(data?: APIDMCHANNEL): Promise<this> {
          if (data) return this.patch(data)
          else if (this.id) return this
          else
               return this.patch(
                    await this.bot.REST.discord<APIDMCHANNEL>()
                         .users("@me")
                         // eslint-disable-next-line camelcase
                         .channels.post(JSON.stringify({ recipient_id: this.user.id }))
               )
     }

     patch(data: APIDMCHANNEL): this {
          if (!data) return this
          
          this.id = data.id
          this.lastMessageID = data.last_message_id

          return this
     }

     async send(options: MessageOptions): Promise<Message>
     async send(msg: MessageConvertable, options?: MessageOptions): Promise<Message> {
          if (!this.id) throw new DiscordAPIError("This DM Channel is not opened yet, use the method DMChannel#open() first to open a DM Channel first!")

          return super.send(msg, options)
     }
}
