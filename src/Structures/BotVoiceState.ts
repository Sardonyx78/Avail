import Guild from './Guild'
import VoiceChannel from './VoiceChannel'
import VoiceState from "./VoiceState"
import Connection from "./voice/Connection"
import Bot from "../Bot/Bot"
import { APIVOICESTATE } from "../constants/Types/Responses"
import { Snowflake } from '../constants/Types/Types'

export default class BotVoiceState extends VoiceState {
     connection: Connection

     constructor(bot: Bot, data: APIVOICESTATE) {
          super(bot, data)
          this.connection = new Connection(this)
     }

     update(options: { mute?: boolean; deaf?: boolean }): { mute: boolean, deaf: boolean, guild: Guild, channel: VoiceChannel } {
          options = Object.assign(
               {
                    mute: this.selfMuted,
                    deaf: this.selfDeaf,
                    // eslint-disable-next-line camelcase
                    guild_id: this.guildID,
                    // eslint-disable-next-line camelcase
                    channel_id: this.channelID,
               },
               options
          )

          this.bot.ws.send({
               op: 4,
               d: options,
          })

          return {
               mute: !!options.mute,
               deaf: !!options.deaf,
               guild: this.bot.guilds.get(this.guildID),
               channel: this.bot.channels.get(this.channelID!),
          }
     }

     joinChannel(channelID: null): null
     joinChannel(channelID: Snowflake): VoiceChannel
     joinChannel(channelID: Snowflake | null): VoiceChannel | null {
          this.channelID = channelID

          return channelID ? this.channel : null
     }
}
