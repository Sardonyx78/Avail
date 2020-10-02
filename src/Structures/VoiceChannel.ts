import GuildChannel from "./GuildChannel"
import Bot from "../Bot/Bot"
import { APIVOICECHANNEL } from "../constants/Types/Responses"

export default class VoiceChannel extends GuildChannel {
     constructor(bot: Bot, data: APIVOICECHANNEL) {
          super(bot, data)
     }

     join(): VoiceChannel {
          return this.guild.voice.me.joinChannel(this.id)
     }

     disconnect(): null {
          return this.guild.voice.me.joinChannel(null)
     }
}
