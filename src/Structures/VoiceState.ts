import Guild from "./Guild"
import Member from './Member'
import VoiceChannel from "./VoiceChannel"
import Speaking from "./voice/Speaking"
import Bot from "../Bot/Bot"
import { APIVOICESTATE } from "../constants/Types/Responses"
import { Snowflake } from '../constants/Types/Types'

enum STREAM_TYPE {
     CAMERA,
     GOLIVE,
     NONE,
}

export default class VoiceState {
     static STREAM_TYPE = STREAM_TYPE
     bot: Bot
     guildID!: Snowflake
     channelID!: Snowflake | null
     userID!: Snowflake
     sessionID?: string
     deaf!: boolean
     mute!: boolean
     selfMuted!: boolean
     selfDeaf!: boolean
     streaming!: STREAM_TYPE
     speaking!: Speaking

     constructor(bot: Bot, data: APIVOICESTATE) {
          this.bot = bot
          this.patch(data)
     }

     patch(data: APIVOICESTATE): this {
          this.guildID = data.guild_id
          this.channelID = data.channel_id
          this.userID = data.user_id
          this.guild.members.get(this.userID).fetch(data.member)
          this.sessionID = data.session_id
          this.deaf = data.deaf
          this.mute = data.mute
          this.selfMuted = !!data.self_mute
          this.selfDeaf = !!data.self_deaf

          if (data.self_stream) this.streaming = VoiceState.STREAM_TYPE.GOLIVE
          else if (data.self_video) this.streaming = VoiceState.STREAM_TYPE.CAMERA
          else this.streaming = VoiceState.STREAM_TYPE.NONE

          return this
     }

     get guild(): Guild {
          return this.bot.guilds.get(this.guildID)
     }

     get channel(): VoiceChannel | null {
          if (!this.channelID) return null
          return this.bot.channels.get(this.channelID) as VoiceChannel
     }

     /*update(data: APIVOICESTATE) {
          if (data.guild_id !== this.guildID) throw new DiscordAPIError(undefined, "The match")
     }*/

     get member(): Member {
          return this.guild.members.get(this.userID)
     }
}
