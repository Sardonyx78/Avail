import Guild from "./Guild"
import Role from "./Role"
import SnowDir from "./SnowDir"
import User from "./User"
import VoiceState from "./VoiceState"
import { Bot } from "../Bot"
import { APIMEMBER } from "../constants/Types/Responses"
import { Snowflake } from '../constants/Types/Types'
import BotVoiceState from './BotVoiceState'

export default class Member {
     public user!: User
     public bot: Bot
     public guild: Guild
     public nick?: string
     public joinDate!: Date
     public voice!: VoiceState

     private roleIDs!: Snowflake[]

     constructor(bot: Bot, data: APIMEMBER, guild: Guild) {
          this.bot = bot
          this.guild = guild

          this.patch(data)
     }

     public async fetch(data?: APIMEMBER): Promise<Member> {
          if (data) return this.patch(data)
          else return this.patch(await this.bot.REST.discord<APIMEMBER>().guilds(this.guild.id).members(this.user.id).get())
     }

     patch(data: APIMEMBER): this {
          if (data.user) {
               const user = new User(this.bot, data.user)
               this.bot.users.set(data.user.id, user)
               this.user = user
          }

          this.roleIDs = data.roles
          this.nick = data.nick

          this.voice = new (this.bot.user.id === data.user.id ? BotVoiceState : VoiceState)(this.bot, this)

          this.voice.mute = data.mute
          this.voice.deaf = data.deaf

          this.joinDate = new Date(data.joined_at)

          return this
     }

     async kick(): Promise<this> {
          await this.guild.kickMember(this)
          return this
     }

     public get roles(): SnowDir<Snowflake, Role> {
          return this.guild.roles.findAll(x => this.roleIDs.includes(x.id))
     }
}
