import { Bot } from "..";
import { APIREACTION, Snowflake } from "../constants";
import Emoji from "./Emoji";
import Message from "./Message";
import SnowDir from "./SnowDir";
import User from "./User";

export class Reaction {
     message: Message
     emoji!: Emoji
     count!: number
     users = new SnowDir<Snowflake, User>()
     private _me!: boolean
     bot: Bot;

     constructor(bot: Bot, message: Message, data: APIREACTION) {
          this.bot = bot
          this.message = message
          this.patch(data)
     }

     patch(data: APIREACTION) {
          this._me = data.me
          this.emoji = this.bot.emojis.get(data.emoji.id!) || new Emoji(this.bot, data.emoji)
          this.count = data.count
     }

     get me() {
          return this._me || this.users.has(this.message.bot.user.id)
     }
}