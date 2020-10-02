import BotVoiceState from "./BotVoiceState"
import Guild from "./Guild"
import SnowDir from "./SnowDir"
import VoiceState from "./VoiceState"
import Connection from "./voice/Connection"
import Bot from "../Bot/Bot"
import { Snowflake } from '../constants/Types/Types'

export default class GuildVoice {
     token!: string
     private __endpoint__!: string
     bot: Bot
     guild: Guild
     states = new SnowDir<Snowflake, VoiceState>()

     constructor(bot: Bot, guild: Guild) {
          this.bot = bot
          this.guild = guild
     }

     update(data: VoiceServerUpdate): VoiceServerUpdate {
          if (this.guild.id !== data.guild_id) throw new TypeError("The given Voice Server Update Payload doesn't match with this voice state")
          else {
               this.token = data.token
               this.endpoint = data.endpoint
          }

          return data
     }

     get me(): BotVoiceState {
          return <BotVoiceState>this.states.get(this.bot.user.id)
     }

     set endpoint(val: string) {
          if (this.__endpoint__ === val) return
          else this.__endpoint__ = val

          if (this.me.connection) {
               this.me.connection.close().then(() => {
                    this.me.connection = new Connection(this.me)
               })
          }
     }

     get endpoint(): string {
          return this.__endpoint__
     }
}

interface VoiceServerUpdate {
     token: string
     // eslint-disable-next-line camelcase
     guild_id: string
     endpoint: string
}
