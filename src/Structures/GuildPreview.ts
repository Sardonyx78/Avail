import Emoji from "./Emoji"
import Guild from './Guild'
import SnowDir from "./SnowDir"
import { Bot } from "../Bot"
import { APIGUILDPREVIEW } from "../constants/Types/Responses"
import { Snowflake } from '../constants/Types/Types'
import CDN, { ImageOptions } from "../constants/util/CDNImage"

export default class GuildPreview {
     emojis = new SnowDir<string, Emoji>()
     features!: ("INVITE_SPLASH" | "VIP_REGIONS" | "VANITY_URL" | "VERIFIED" | "PARTNERED" | "PUBLIC" | "COMMERCE" | "NEWS" | "DISCOVERABLE" | "FEATURABLE" | "ANIMATED_ICON" | "BANNER" | "PUBLIC_DISABLED" | "WELCOME_SCREEN_ENABLE")[]
     guildID!: string
     approximateMemberCount!: number
     bot: Bot
     discoverysplashHash?: string

     constructor(bot: Bot, data: APIGUILDPREVIEW) {
          this.bot = bot
          this.patch(data)
     }

     patch(data: APIGUILDPREVIEW): this {
          this.guildID = data.id

          this.approximateMemberCount = data.approximate_member_count

          this.features = data.features

          this.emojis = new SnowDir<Snowflake, Emoji>()

          for (const emoji of data.emojis) {
               this.emojis.set(emoji.id, new Emoji(this.bot, emoji, this.guildID))
          }

          this.discoverysplashHash = data.discovery_splash
          return this
     }

     discoverySplash(options: ImageOptions): string {
          return CDN.discoverySplash(this, options) as string
     }

     get guild(): Guild {
          return this.bot.guilds.get(this.guildID)
     }
}
