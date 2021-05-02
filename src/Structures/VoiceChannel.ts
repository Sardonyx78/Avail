import GuildChannel from "./GuildChannel"
import { Bot } from "../Bot"
import { APIVOICECHANNEL } from "../constants/Types/Responses"
import Guild from './Guild'

export default class VoiceChannel extends GuildChannel {
     constructor(bot: Bot, data: APIVOICECHANNEL, guild: Guild) {
          super(bot, data, guild)
     }

     join(): VoiceChannel {
          return this.guild.voice.me.joinChannel(this.id)
     }

     disconnect(): null {
          return this.guild.voice.me.joinChannel(null)
     }
}
