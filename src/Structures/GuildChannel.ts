import Channel from "./Channel"
import Guild from './Guild'
import Member from "./Member"
import PermissionOverwrite, { MemberPermissionOverwrite, RolePermissionOverwrite } from "./PermissionOverwrite"
import Role from "./Role"
import SnowDir from "./SnowDir"
import { Bot } from "../Bot"
import { APITEXTCHANNEL, APIVOICECHANNEL, CHANNEL_TYPES } from "../constants/Types/Responses"
import { Snowflake } from '../constants/Types/Types'

export default class GuildChannel extends Channel {

     guildID!: Snowflake
     position!: number
     perms!: SnowDir<string, PermissionOverwrite>

     constructor(bot: Bot, data: APITEXTCHANNEL | APIVOICECHANNEL, guild: Guild) {
          super(bot, data, guild)
     }

     patch(data: APITEXTCHANNEL | APIVOICECHANNEL, guild?: Guild): this {
          this.id = data.id
          this.type = data.type
          this.guildID = data.guild_id || guild!.id
          this.position = data.position
          this.perms = new SnowDir<Snowflake, PermissionOverwrite>()

          for (const overwrite of data.permission_overwrites) {
               this.perms.set(overwrite.id, new PermissionOverwrite(overwrite.id, overwrite.type, overwrite.allow_new, overwrite.deny_new, this.guild))
          }

          return this
     }

     public async changePosition(position: number): Promise<this> {
          await this.bot.REST.discord<void>()
               .guilds(this.guild.id)
               .channels.patch(JSON.stringify([this.id, position]))

          return this
     }

     get guild(): Guild {
          return this.bot.guilds.get(this.guildID)
     }

     // eslint-disable-next-line camelcase
     public async change(options: { name: string; type: CHANNEL_TYPES; position: number; topic: string; nsfw: boolean; rate_per_user: number; bitrate: number; user_limit: number; permission_overwrites: PermissionOverwrite[]; parent_id: Snowflake }): Promise<this> {
          return this.patch(await this.bot.REST.discord<APITEXTCHANNEL | APIVOICECHANNEL>().channels(this.id).patch(JSON.stringify(options)))
     }

     forMember(member: Member): MemberPermissionOverwrite {
          return this.perms.find(x => x.type === "member" && member.user.id === x.id) as MemberPermissionOverwrite
     }

     forRole(role: Role): RolePermissionOverwrite {
          return this.perms.find(x => x.type === "role" && role.id === x.id) as RolePermissionOverwrite
     }
}
