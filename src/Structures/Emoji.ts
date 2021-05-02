import Guild from "./Guild"
import Role from "./Role"
import SnowDir from './SnowDir'
import { Bot } from "../Bot"
import { APIEMOJI } from "../constants/Types/Responses"
import { Snowflake } from '../constants/Types/Types'

export default class Emoji {
     bot: Bot
     unicode!: boolean
     id?: Snowflake
     name!: string
     animated?: boolean
     available?: boolean
     managed?: boolean
     private roleIDs?: Snowflake[]
     private guildID?: Snowflake

     constructor(bot: Bot, data: APIEMOJI, guildID?: Snowflake) {
          this.bot = bot
          this.patch(data, guildID)
     }

     patch(data: APIEMOJI, guildID?: Snowflake): this {
          this.name = data.name
          this.guildID = guildID
          if (!data.id) {
               this.unicode = true
               this.animated = false
          } else {
               this.animated = data.animated
               this.available = data.available
               this.managed = data.managed
               this.name = data.name
               this.roleIDs = data.roles
          }
          return this
     }

     get roles(): SnowDir<Snowflake, Role> {
          if (this.roleIDs) return this.guild!.roles.findAll(x => this.roleIDs!.includes(x.id))
          else return new SnowDir<Snowflake, Role>()
     }

     get guild(): Guild | null {
          if (!this.guildID) return null
          else return this.bot.guilds.get(this.guildID)
     }

     toString(): string {
          if (this.unicode) return this.name
          else if (this.animated) return `<a:${this.name}:${this.id}>`
          else return `<${this.name}:${this.id}>`
     }
}
