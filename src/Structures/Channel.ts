import Bot from "../Bot/Bot"
import { APICHANNEL, CHANNEL_TYPES } from "../constants/Types/Responses"
import { Snowflake } from '../constants/Types/Types'

export default abstract class Channel {
  bot: Bot
  id!: Snowflake
  type!: CHANNEL_TYPES
  static CHANNEL_TYPES = CHANNEL_TYPES

  constructor(bot: Bot, data?: APICHANNEL) {
       this.bot = bot

       this.patch(data)
  }

  protected abstract patch(data?: APICHANNEL): this

  async delete(): Promise<this> {
       return this.patch(await this.bot.REST.discord<APICHANNEL>().channels(this.id).delete())
  }

  async fetch(): Promise<this> {
       return this.patch(await this.bot.REST.discord<APICHANNEL>().channels(this.id).get())
  }
}
