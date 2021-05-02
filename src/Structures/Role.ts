import ColorConvertable from "./ColorConvertable"
import Guild from "./Guild"
import Member from "./Member"
import Permissions from "./Permissions"
import SnowDir from "./SnowDir"
import { Bot } from "../Bot"
import { APIROLE } from "../constants/Types/Responses"
import { Snowflake } from '../constants/Types/Types'

export default class Role {
  id!: Snowflake
  bot: Bot
  color!: ColorConvertable
  name!: string
  hoisted!: boolean
  position!: number
  permissions!: Permissions
  managed!: boolean
  mentionable!: boolean
  guild!: Guild

  constructor(bot: Bot, guild: Guild, data: APIROLE) {
       this.bot = bot

       this.patch(data, guild)
  }

  patch(data: APIROLE, guild: Guild): this {
       this.color = data.color === 0 ? new ColorConvertable(0xfff) : new ColorConvertable(data.color)
       this.id = data.id
       this.name = data.name
       this.permissions = new Permissions(data.permissions)
       this.hoisted = data.hoist
       this.managed = data.managed
       this.mentionable = data.mentionable
       this.position = data.position
       this.guild = guild
       return this
  }

  get members(): SnowDir<Snowflake, Member> {
       return this.guild.members.findAll(x => x.roles.has(this.id))
  }
}
