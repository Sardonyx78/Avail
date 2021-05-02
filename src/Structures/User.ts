import DMChannel from "./DMChannel"
import Guild from "./Guild"
import Member from './Member'
import UserBadges from "./UserBadges"
import { Bot } from "../Bot"
import { APIUSER } from "../constants/Types/Responses"
import { Snowflake, NITRO } from '../constants/Types/Types'
import CDN, { ImageOptions } from "../constants/util/CDNImage"

export default class User {
     bot: Bot
     id!: Snowflake
     badges!: UserBadges
     nitro?: NITRO
     system!: boolean
     avatarhash!: string
     discriminator!: number
     username!: string
     dm!: DMChannel

     constructor(bot: Bot, data: APIUSER) {
          this.bot = bot
          this.patch(data)
     }

     isBot(): boolean {
          return false
     }

     patch(data: APIUSER): this {
          this.id = data.id

          this.avatarhash = data.avatar

          this.isBot = () => data.bot

          this.username = data.username
          this.discriminator = Number.parseInt(data.discriminator)

          this.nitro = data.premium_type

          this.system = !!data.system

          this.badges = new UserBadges(data.public_flags)

          this.dm = new DMChannel(this)

          return this
     }

     get tag(): string {
          return this.username + "#" + this.discriminator
     }

     avatar(options: ImageOptions): string {
          return CDN.user(this, options)
     }

     member(guild: Guild): Member {
          return guild.members.get(this.id)
     }

     async fetch(): Promise<this> {
          return this.patch(await this.bot.REST.discord<APIUSER>().users(this.id).get())
     }

     static async fetchNew(bot: Bot, id: Snowflake, cache = true): Promise<User> {
          const user = await bot.REST.discord<APIUSER>().users(id).get()

          if (cache) return bot.users.set(user.id, new User(bot, user))
          else return new User(bot, user)
     }
}
