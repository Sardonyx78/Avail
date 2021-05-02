import Guild from "./Guild"
import Member from './Member'
import VoiceChannel from "./VoiceChannel"
import Speaking from "./voice/Speaking"
import { Bot } from "../Bot"
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

     private guild_?: Guild

     constructor(bot: Bot, data: APIVOICESTATE | Member) {
          this.bot = bot
          this.patch(data)
          this.guild.voice.states.set(this.userID, this)
     }

     patch(data: APIVOICESTATE | Member): this {
          if (data instanceof Member) {
               this.guild_ = data.guild
               this.guildID = data.guild.id
               this.channelID = null
               this.userID = data.user.id
               this.streaming = VoiceState.STREAM_TYPE.NONE
          } else {
               this.guildID = data.guild_id
               this.channelID = data.channel_id
               this.userID = data.user_id
               this.sessionID = data.session_id
               this.deaf = data.deaf
               this.mute = data.mute
               this.selfMuted = !!data.self_mute
               this.selfDeaf = !!data.self_deaf
     
               if (data.self_stream) this.streaming = VoiceState.STREAM_TYPE.GOLIVE
               else if (data.self_video) this.streaming = VoiceState.STREAM_TYPE.CAMERA
               else this.streaming = VoiceState.STREAM_TYPE.NONE
          }

          return this
     }

     get guild(): Guild {
          return this.guild_ || this.bot.guilds.get(this.guildID)
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
