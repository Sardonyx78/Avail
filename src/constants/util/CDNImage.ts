import Guild from "../../Structures/Guild"
import GuildPreview from "../../Structures/GuildPreview"
import User from "../../Structures/User"

export default class CDN {
  static DEFAULT_OPTIONS = {
       type: "png",
       size: "256",
       dynamic: true,
  }

  static BASE = "https://cdn.discordapp.com/"

  static user(user: User, options: ImageOptions) {
       options = Object.assign(this.DEFAULT_OPTIONS, options)

       if (user.avatarhash) return this.BASE + `avatars/${user.avatarhash}/${CDN.imageResolver(user.avatarhash, options)}`
       else return this.BASE + `embed/avatars/${user.discriminator % 5}.png`
  }

  static discoverySplash(preview: GuildPreview, options: ImageOptions) {
       options = Object.assign(this.DEFAULT_OPTIONS, options)

       if (preview.discoverysplashHash) return this.BASE + `discovery-splashes/${preview.guildID}/${this.imageResolver(preview.discoverysplashHash, options)}`
       else return null
  }

  static splash(guild: Guild, options: ImageOptions) {
       options = Object.assign(this.DEFAULT_OPTIONS, options)

       if (guild.splashhash) return this.BASE + `splashes/${guild.id}/${this.imageResolver(guild.splashhash, options)}`
       else return null
  }

  static icon(guild: Guild, options: ImageOptions) {
       options = Object.assign(this.DEFAULT_OPTIONS, options)

       if (guild.iconhash) return this.BASE + `icons/${guild.id}/${this.imageResolver(guild.splashhash, options)}`
       else return null
  }

  static imageResolver(hash: string, options: ImageOptions) {
       if (options.dynamic) return `${hash}.${hash.startsWith("a_") ? "gif" : options.type}?size=${options.size}`
       else return `${hash}/${hash}.${options.size}?size=${options.size}`
  }
}

export interface ImageOptions {
  type: "png" | "webm" | "jpeg" | "gif"
  size: 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096
  dynamic: boolean
}
