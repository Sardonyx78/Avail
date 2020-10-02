import Bot from "../../Bot/Bot"
import Guild from "../../Structures/Guild"
import Member from "../../Structures/Member"
import User from "../../Structures/User"
import { Snowflake } from '../Types/Types'

export type UserAlike = User | Snowflake | Member

export class Resolver {
     bot: Bot

     constructor(bot: Bot) {
          this.bot = bot
     }

     asUser(user: UserAlike): User {
          if (user instanceof User) return user
          else if (user instanceof Member) return user.user
          else if (typeof user === "string") return this.bot.users.get(user)

          throw new TypeError("A non UserAlike was provided.")
     }

     idOf(user: UserAlike): Snowflake {
          if (user instanceof User) return user.id
          else if (user instanceof Member) return user.user.id
          else if (typeof user === "string") return user

          throw new TypeError("A non UserAlike was provided.")
     }

     asMember(user: UserAlike, guild: Guild): Member {
          if (user instanceof Member) return user
          else if (user instanceof User) return user.member(guild)
          else if (typeof user === "string") return guild.members.get(user)

          throw new TypeError("A non UserAlike was provided.")
     }
}
